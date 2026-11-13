import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
// @ts-expect-error fengari n'a pas de types
import { lauxlib, lua, lualib, to_luastring } from "fengari";
import { guideDepuisExport, lireExport, porteeConseillee, verifierGuide, versParcoursReleves } from "@/lib/probe";

vi.mock("server-only", () => ({}));

// Code de /ep export fabriqué à la main : un orc chasseur dans la vallée des Épreuves (Durotar, carte 1411).
function code(lignes: string[], tronquer = false): string {
  const tout = ["EP|1", "ctx|Grosorc-Forever|Orc|Orc|HUNTER|Horde|1|depart|1411", "q|4641|Votre place en ce monde", ...lignes];
  tout.push(`fin|${tout.length + 1}`);
  const b64 = Buffer.from(tout.join("\n"), "utf8").toString("base64");
  return "EP1:" + (tronquer ? b64.slice(0, Math.floor(b64.length / 2)) : b64);
}

const SEANCE = [
  "10.0|pos|1411|0.436|0.689",
  "11.0|accept|4641|Votre place en ce monde",
  "20.0|turnin|4641|Votre place en ce monde",
  "21.0|accept|788|Nettoyer la vallée",
  "30.0|pos|1411|0.450|0.640",
  "31.0|obj|788|1|1|10|monster|1411|0.450|0.640|Sanglier",
  "60.0|level|2",
  "70.0|turnin|788|Nettoyer la vallée",
  "80.0|trajet|debut|Zeppelin Tirisfal - Orgrimmar|Clairières de Tirisfal|1420|0.61|0.59",
  "300.0|trajet|arrivee|Zeppelin Tirisfal - Orgrimmar|Durotar|1411|0.5|0.12|220",
  "310.0|exploit|Chef kolkar|elite|1411|0.46|0.61",
];

describe("lecture du code de /ep export", () => {
  it("lit contexte, quêtes et événements", () => {
    const e = lireExport(code(SEANCE));
    expect(e.personnage).toBe("Grosorc-Forever");
    expect(e.raceFichier).toBe("Orc");
    expect(e.quetes.get(4641)).toBe("Votre place en ce monde");
    expect(e.evenements).toHaveLength(SEANCE.length);
  });

  it("refuse un code coupé au collage, un autre texte, une version inconnue", () => {
    expect(() => lireExport(code(SEANCE, true))).toThrow(/incomplet|inattendus/);
    expect(() => lireExport("bonjour")).toThrow(/EP1:/);
    expect(() => lireExport("EP1:" + Buffer.from("EP|9\nfin|2").toString("base64"))).toThrow(/Version/);
    expect(() => lireExport("")).toThrow(/Aucun code/);
  });
});

describe("conversion en guide et vérification", () => {
  const g = guideDepuisExport(lireExport(code(SEANCE)));

  it("donne la race, la classe, la partie et les étapes de la zone dans l'ordre joué", () => {
    expect(g).toMatchObject({ race: "orc", classe: "chasseur", faction: "horde", partie: "depart" });
    expect(g.zones).toEqual([{ lieu: "durotar", etapes: ["prendre:4641", "rendre:4641", "prendre:788", "faire:788", "rendre:788"] }]);
    expect(g.niveaux).toEqual([1, 2]);
    expect(g.trajets[0]).toMatchObject({ nom: "Zeppelin Tirisfal - Orgrimmar", duree: 220 });
    expect(g.trajets[0].depart.lieu).toBe("clairieres-de-tirisfal");
    expect(g.exploits[0]).toMatchObject({ nom: "Chef kolkar", classement: "elite", lieu: "durotar" });
    expect(g.inconnues).toEqual([]);
  });

  it("vérifie que l'ordre reste jouable pour toutes les classes de la race", () => {
    expect(porteeConseillee(g)).toBe("race");
    const v = verifierGuide(g, "race");
    expect(v.problemes).toEqual([]);
    expect(v.ok).toBe(true);
    expect(v.pages.length).toBeGreaterThan(1);
    expect(v.pages.every((p) => p.race === "orc")).toBe(true);
    expect(v.reconnues).toBe(5);
  });

  it("refuse un ordre où une quête se rend avant d'être prise", () => {
    const mauvais = guideDepuisExport(lireExport(code(["10.0|pos|1411|0.4|0.6", "11.0|turnin|788|x", "12.0|accept|788|x"])));
    const v = verifierGuide(mauvais, "race");
    expect(v.ok).toBe(false);
    expect(v.problemes.join(" ")).toMatch(/se rendrait avant d'être prise/);
  });

  it("étend une partie commune à toute la faction", () => {
    const releves = versParcoursReleves(g, "faction", "essai");
    expect(new Set(releves.map((r) => r.race))).toEqual(new Set(["orc", "mort-vivant", "tauren", "troll", "skyborne-horde"]));
    expect(releves.every((r) => r.classe === null)).toBe(true);
  });

  it("signale les quêtes que le guide ne connaît pas", () => {
    const g2 = guideDepuisExport(lireExport(code(["10.0|pos|1411|0.4|0.6", "11.0|accept|99999|Une quête de Forever"]).replace("", "")));
    expect(g2.inconnues).toEqual([]); // sans titre dans les lignes « q », rien à signaler
    const avecTitre = ["10.0|pos|1411|0.4|0.6", "11.0|accept|99999|Une quête de Forever"];
    const tout = ["EP|1", "ctx|A|Orc|Orc|HUNTER|Horde|3||", "q|99999|Une quête de Forever", ...avecTitre];
    tout.push(`fin|${tout.length + 1}`);
    const g3 = guideDepuisExport(lireExport("EP1:" + Buffer.from(tout.join("\n")).toString("base64")));
    expect(g3.inconnues).toEqual([{ id: 99999, titre: "Une quête de Forever", lieu: "durotar" }]);
  });
});

describe("de bout en bout : le code produit par EternalProbe se lit sur le site", () => {
  it("/ep export d'une séance simulée donne un guide", () => {
    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    const lire = (f: string) => readFileSync(path.join(process.cwd(), f), "utf8");
    const morceaux = [
      lire("tests/banc/wow-simule.lua"),
      lire("addon/EternalProbe/EternalProbe.lua"), lire("addon/EternalProbe/Captures.lua"), lire("addon/EternalProbe/Export.lua"),
      `BANC.Evenement("PLAYER_LOGIN")
       SlashCmdList.ETERNALPROBE("start")
       BANC.journal[4641] = { titre = "Votre place en ce monde", niveau = 1, objectifs = {} }
       BANC.Evenement("QUEST_ACCEPTED", 4641)
       BANC.Avancer(3)
       BANC.x = 0.44
       BANC.Avancer(2)
       BANC.Evenement("QUEST_TURNED_IN", 4641, 40, 0)
       BANC.journal[4641] = nil
       SlashCmdList.ETERNALPROBE("export")
       return (EternalProbe.CodeExport())`,
    ];
    for (const m of morceaux) {
      if (lauxlib.luaL_dostring(L, to_luastring(m)) !== lua.LUA_OK) throw new Error(lua.lua_tojsstring(L, -1));
    }
    const exporte = lua.lua_tojsstring(L, -1) as string;
    expect(exporte.startsWith("EP1:")).toBe(true);
    const e = lireExport(exporte);
    expect(e.evenements.some((x) => x.type === "pos")).toBe(true); // la position d'avant chaque étape est gardée
    const g = guideDepuisExport(e);
    expect(g.race).toBe("orc");
    expect(g.zones[0]).toEqual({ lieu: "durotar", etapes: ["prendre:4641", "rendre:4641"] });
  });
});
