import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
// @ts-expect-error fengari n'a pas de types
import { lauxlib, lua, lualib, to_luastring } from "fengari";
import { corrigerGuide, guideDepuisExport, lireExport, porteeConseillee, texteCorrectif, verifierGuide, versParcoursReleves } from "@/lib/probe";

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
  "60.0|level|2|nouveau",
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

  it("propose des correctifs : la quête fautive sort du parcours relevé, le reste de l'ordre joué est gardé", () => {
    const mauvais = guideDepuisExport(lireExport(code([
      "10.0|pos|1411|0.4|0.6", "11.0|accept|4641|x", "12.0|turnin|4641|x", "13.0|turnin|788|x", "14.0|accept|788|x",
    ])));
    const avant = verifierGuide(mauvais, "race");
    expect(avant.ok).toBe(false);
    expect(avant.defauts?.some((d) => d.id === 788 && d.lieu === "durotar")).toBe(true);
    const c = corrigerGuide(mauvais, "race");
    expect(c.correctifs).toEqual([expect.objectContaining({ lieu: "durotar", id: 788, etapes: ["rendre:788", "prendre:788"] })]);
    expect(c.guide.zones).toEqual([{ lieu: "durotar", etapes: ["prendre:4641", "rendre:4641"] }]);
    expect(c.verification.ok).toBe(true);
    expect(texteCorrectif(c.correctifs[0])).toMatch(/Durotar : « .+ » \(se rendrait avant d'être prise[^)]*\) retirée du parcours relevé \(2 étapes\)/);
    // l'original n'est pas modifié
    expect(mauvais.zones[0].etapes).toHaveLength(4);
  });

  it("ne propose rien quand le problème ne tient pas à une quête", () => {
    const sansQuete = guideDepuisExport(lireExport(code(["10.0|pos|1411|0.4|0.6"])));
    const c = corrigerGuide(sansQuete, "race");
    expect(c.correctifs).toEqual([]);
    expect(c.verification.ok).toBe(false);
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

  it("/ep suite garde la zone de départ, exportable à part avec /ep export depart", () => {
    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    const lire = (f: string) => readFileSync(path.join(process.cwd(), f), "utf8");
    const morceaux = [
      lire("tests/banc/wow-simule.lua"),
      lire("addon/EternalProbe/EternalProbe.lua"), lire("addon/EternalProbe/Captures.lua"), lire("addon/EternalProbe/Export.lua"),
      `EternalRoutes = { Importer = { Importer = function() return { id = "rp-depart" } end } }
       BANC.Evenement("PLAYER_LOGIN")
       SlashCmdList.ETERNALPROBE("start")
       BANC.journal[4641] = { titre = "Votre place en ce monde", niveau = 1, objectifs = {} }
       BANC.Avancer(2)
       BANC.Evenement("QUEST_ACCEPTED", 4641)
       BANC.Evenement("QUEST_TURNED_IN", 4641, 40, 0)
       SlashCmdList.ETERNALPROBE("suite")
       BANC.Avancer(2)
       BANC.journal[788] = { titre = "Nettoyer la vallée", niveau = 2, objectifs = {} }
       BANC.Evenement("QUEST_ACCEPTED", 788)
       local depart = EternalProbe.CodeExport(true)
       local commune = EternalProbe.CodeExport()
       return depart .. "\\n" .. commune`,
    ];
    for (const m of morceaux) {
      if (lauxlib.luaL_dostring(L, to_luastring(m)) !== lua.LUA_OK) throw new Error(lua.lua_tojsstring(L, -1));
    }
    const [depart, commune] = (lua.lua_tojsstring(L, -1) as string).split("\n");
    const gd = guideDepuisExport(lireExport(depart));
    const gc = guideDepuisExport(lireExport(commune));
    expect(gd.partie).toBe("depart");
    expect(gd.zones[0].etapes).toEqual(["prendre:4641", "rendre:4641"]);
    expect(gc.partie).toBe("commune");
    expect(gc.zones[0].etapes).toEqual(["prendre:788"]);
  });
});
