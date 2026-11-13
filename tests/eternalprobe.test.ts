import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error fengari n'a pas de types
import { lauxlib, lua, lualib, to_luastring } from "fengari";

// Banc d'essai hors du jeu (T-27) : EternalProbe tourne dans un WoW simulé (tests/banc/wow-simule.lua),
// puis l'import d'EternalRoutes convertit son enregistrement. Ne remplace pas la relecture en jeu.

const ADDON = path.join(process.cwd(), "addon");
const lire = (f: string) => readFileSync(path.join(ADDON, f), "utf8");

function executer(...morceaux: string[]): string {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);
  for (const code of morceaux) {
    if (lauxlib.luaL_dostring(L, to_luastring(code)) !== lua.LUA_OK) {
      throw new Error(lua.lua_tojsstring(L, -1));
    }
  }
  return lua.lua_tojsstring(L, -1) ?? "";
}

const SIMULE = readFileSync(path.join(process.cwd(), "tests/banc/wow-simule.lua"), "utf8");
const SONDE = [lire("EternalProbe/EternalProbe.lua"), lire("EternalProbe/Captures.lua")];

// Une séance courte : une quête prise, faite et rendue avec récompense au choix, un élite vaincu,
// un point de vol découvert puis un vol, une mort, un niveau gagné.
const SEANCE = `
BANC.Evenement("PLAYER_LOGIN")
SlashCmdList.ETERNALPROBE("start")
BANC.Avancer(2)
BANC.journal[783] = { titre = "Votre place en ce monde", niveau = 2, objectifs = {
  { text = "Sanglier tacheté : 0/4", type = "monster", numFulfilled = 0, numRequired = 4, finished = false } } }
BANC.cible = { nom = "Gornek", guid = "Creature-0-1-1-1-3143-1", x = 0.42, y = 0.68 }
BANC.Evenement("PLAYER_TARGET_CHANGED")
BANC.Evenement("GOSSIP_SHOW")
BANC.Evenement("QUEST_ACCEPTED", 783)
BANC.Avancer(2)
BANC.x, BANC.y = 0.45, 0.62
BANC.Avancer(2)
BANC.cible = { nom = "Chef kolkar", guid = "Creature-0-1-1-1-3197-9", classement = "elite", x = 0.46, y = 0.61 }
BANC.Evenement("PLAYER_TARGET_CHANGED")
BANC.combat = { 0, "PARTY_KILL", false, "Player-1", "Testeur", 0, 0, "Creature-0-1-1-1-3197-9", "Chef kolkar" }
BANC.Evenement("COMBAT_LOG_EVENT_UNFILTERED")
BANC.Avancer(2)
BANC.journal[783].objectifs[1] = { text = "Sanglier tacheté : 4/4", type = "monster", numFulfilled = 4, numRequired = 4, finished = true }
BANC.Evenement("QUEST_LOG_UPDATE")
BANC.x, BANC.y = 0.42, 0.68
BANC.Avancer(2)
BANC.cible = { nom = "Gornek", guid = "Creature-0-1-1-1-3143-1", x = 0.42, y = 0.68 }
BANC.Evenement("PLAYER_TARGET_CHANGED")
BANC.Evenement("GOSSIP_SHOW")
BANC.quete = { id = 783, xp = 170, argent = 35, objets = { { id = 2504, n = 1 } }, choix = { { id = 2385, n = 1 }, { id = 2386, n = 1 } } }
BANC.Evenement("QUEST_COMPLETE")
GetQuestReward(2)
BANC.Evenement("QUEST_TURNED_IN", 783, 170, 35)
BANC.journal[783] = nil
BANC.quete = nil
BANC.Avancer(6)
BANC.joueur.niveau = 4
BANC.Evenement("PLAYER_LEVEL_UP", 4)
BANC.Avancer(2)
BANC.Evenement("UI_INFO_MESSAGE", 0, ERR_NEWTAXIPATH)
BANC.taxi = { { nom = "Orgrimmar, Durotar", genre = "CURRENT" }, { nom = "Croisée, Tarides", genre = "REACHABLE" } }
BANC.Evenement("TAXIMAP_OPENED")
BANC.enVol = true
BANC.Avancer(2)
BANC.enVol = false
BANC.Avancer(2)
BANC.Evenement("PLAYER_DEAD")
SlashCmdList.ETERNALPROBE("stop")
`;

const EVENEMENTS = `
local t = {}
for _, e in ipairs(EternalProbeDB.events) do t[#t + 1] = e end
return table.concat(t, "\\n") .. "\\n#photos=" .. BANC.photos .. "\\n#format=" .. tostring(EternalProbeDB.format)
`;

describe("EternalProbe dans un WoW simulé", () => {
  const sortie = executer(SIMULE, ...SONDE, SEANCE, EVENEMENTS);
  const lignes = sortie.split("\n");
  const de = (type: string) => lignes.filter((l) => l.split("|")[1] === type);

  it("écrit sa propre table, au format 2", () => {
    expect(sortie).toContain("#format=2");
  });

  it("garde les événements que lit EternalRoutes", () => {
    expect(de("accept")[0]).toMatch(/\|accept\|783\|Votre place en ce monde$/);
    expect(de("turnin")).toHaveLength(1);
    expect(de("pos").length).toBeGreaterThan(1);
    expect(de("clock").length).toBeGreaterThan(0);
  });

  it("relève niveau de quête, récompenses, choix et gain", () => {
    expect(de("qniveau")[0]).toMatch(/\|qniveau\|783\|2\|3\|0$/);
    expect(de("recompense")[0]).toMatch(/\|recompense\|783\|170\|35\|2504×1\|2385×1;2386×1$/);
    expect(de("choix")[0]).toMatch(/\|choix\|783\|2386$/);
    expect(de("gain")[0]).toMatch(/\|gain\|783\|170\|35$/);
  });

  it("relève élite vaincu, point de vol, vol, mort, et prend les photos", () => {
    expect(de("exploit")[0]).toMatch(/\|exploit\|Chef kolkar\|elite\|1411\|/);
    expect(de("fpnouveau")).toHaveLength(1);
    expect(de("taxi")[0]).toMatch(/\|taxi\|Orgrimmar, Durotar\|1411\|.*\|1$/);
    expect(de("vol").map((l) => l.split("|")[2])).toEqual(["depart", "arrivee"]);
    expect(de("mort")).toHaveLength(1);
    expect(de("photo").map((l) => l.split("|")[2])).toEqual(["exploit", "niveau"]);
    expect(sortie).toContain("#photos=2");
  });
});

describe("Import d'un enregistrement EternalProbe par EternalRoutes", () => {
  // l'espace de noms d'EternalRoutes, réduit à ce dont l'import a besoin
  const ESPACE = `
EternalRoutes = { ADDON_NAME = "EternalRoutes", guides = {}, db = {}, questDB = {}, Print = function() end,
  L = setmetatable({}, { __index = function(_, k) return k .. " %s %s %s %s" end }) }
`;
  const CONVERTIR = `
local route, raison = EternalRoutes.Importer.Convertir(EternalRoutes.Importer.Enregistrement())
if not route then return "ECHEC " .. tostring(raison) end
local n = 0
for _, s in ipairs(route.steps) do n = n + #s.quests end
return route.source .. "|" .. tostring(route.type) .. "|" .. #route.steps .. "|" .. n
`;

  it("fait une route de l'enregistrement d'EternalProbe", () => {
    const r = executer(SIMULE, ...SONDE, SEANCE, ESPACE, lire("EternalRoutes/Importer.lua"), CONVERTIR);
    expect(r).not.toMatch(/^ECHEC/);
    const [source, , etapes, actions] = r.split("|");
    expect(source).toBe("RouteProbe");
    expect(Number(etapes)).toBeGreaterThan(0);
    expect(Number(actions)).toBeGreaterThanOrEqual(2); // prendre et rendre au moins
  });

  it("préfère EternalProbeDB à l'ancienne RouteProbeDB", () => {
    const r = executer(SIMULE, ...SONDE, SEANCE, ESPACE, lire("EternalRoutes/Importer.lua"),
      `RouteProbeDB = { events = { "1.0|accept|1|Ancienne" } }
       return EternalRoutes.Importer.Enregistrement() == EternalProbeDB and "eternal" or "ancienne"`);
    expect(r).toBe("eternal");
  });
});
