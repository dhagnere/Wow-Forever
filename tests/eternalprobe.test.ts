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
BANC.Avancer(20) -- pas de photo dans les 15 s qui suivent un chargement
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
BANC.cible.mort = true
BANC.Evenement("UNIT_HEALTH", "target")
BANC.cible = { nom = "Chef kolkar", guid = "Creature-0-1-1-1-3197-7", classement = "elite", x = 0.47, y = 0.61 }
BANC.Evenement("PLAYER_TARGET_CHANGED")
BANC.cible.mort, BANC.cible.autre = true, true -- vaincu par un autre joueur : pas un exploit
BANC.Evenement("UNIT_HEALTH", "target")
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
  .. "\\n#bloque=" .. table.concat(BANC.bloque, ",")
`;

describe("EternalProbe dans un WoW simulé", () => {
  const sortie = executer(SIMULE, ...SONDE, SEANCE, EVENEMENTS);
  const lignes = sortie.split("\n");
  const de = (type: string) => lignes.filter((l) => l.split("|")[1] === type);

  it("ne touche à rien de réservé à l'interface de Blizzard (sinon le jeu bloque l'addon au chargement)", () => {
    expect(sortie).toMatch(/#bloque=$/);
  });

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
    expect(de("exploit")).toHaveLength(1);
    expect(de("exploit")[0]).toMatch(/\|exploit\|Chef kolkar\|elite\|1411\|/);
    expect(de("fpnouveau")).toHaveLength(1);
    expect(de("taxi")[0]).toMatch(/\|taxi\|Orgrimmar, Durotar\|1411\|.*\|1$/);
    expect(de("vol").map((l) => l.split("|")[2])).toEqual(["depart", "arrivee"]);
    expect(de("mort")).toHaveLength(1);
    expect(de("photo").map((l) => l.split("|")[2])).toEqual(["exploit", "niveau"]);
    expect(sortie).toContain("#photos=2");
  });
});

describe("Trajets en zeppelin ou en bateau (/ep trajet)", () => {
  // Départ en haut de la tour de Tirisfal, vol au-dessus de la mer puis de Durotar, arrêt à la tour d'Orgrimmar.
  const TRAJET = `
BANC.Evenement("PLAYER_LOGIN")
BANC.Avancer(20)
BANC.carte, BANC.zone, BANC.x, BANC.y = 1420, "Clairières de Tirisfal", 0.61, 0.59
SlashCmdList.ETERNALPROBE("trajet Zeppelin Tirisfal - Orgrimmar")
for i = 1, 10 do BANC.x = BANC.x + 0.005; BANC.Avancer(1) end   -- on bouge encore dans Tirisfal
BANC.carte, BANC.zone = 1411, "Durotar"
for i = 1, 30 do BANC.x, BANC.y = 0.30 + i * 0.005, 0.20 + i * 0.003; BANC.Avancer(1) end -- en vol : jamais immobile
BANC.x, BANC.y = 0.50, 0.12
BANC.Avancer(10) -- à quai, immobile
`;
  const LIGNES = `
local t = {}
for _, e in ipairs(EternalProbeDB.events) do if e:find("|trajet|", 1, true) then t[#t + 1] = e end end
return table.concat(t, "\\n") .. "\\n#encours=" .. tostring(EternalProbeDB.trajet ~= nil)
`;

  it("note le départ, puis l'arrivée seule quand on s'arrête dans une autre zone", () => {
    const r = executer(SIMULE, ...SONDE, TRAJET, LIGNES).split("\n");
    expect(r[0]).toMatch(/\|trajet\|debut\|Zeppelin Tirisfal - Orgrimmar\|Clairières de Tirisfal\|1420\|/);
    expect(r[1]).toMatch(/\|trajet\|arrivee\|Zeppelin Tirisfal - Orgrimmar\|Durotar\|1411\|0\.500\|0\.120\|\d+$/);
    expect(r).toHaveLength(3);
    expect(r[2]).toBe("#encours=false");
  });

  it("ne conclut rien tant qu'on bouge, et se termine à la main avec /ep trajet fin", () => {
    const enMouvement = TRAJET.split("BANC.x, BANC.y = 0.50, 0.12")[0];
    const r1 = executer(SIMULE, ...SONDE, enMouvement, LIGNES).split("\n");
    expect(r1.filter((l) => l.includes("|arrivee|"))).toHaveLength(0);
    expect(r1.at(-1)).toBe("#encours=true");
    const r2 = executer(SIMULE, ...SONDE, enMouvement, 'SlashCmdList.ETERNALPROBE("trajet fin")', LIGNES).split("\n");
    expect(r2.filter((l) => l.includes("|arrivee|"))).toHaveLength(1);
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

  it("ignore un trajet noté dans l'enregistrement : même route qu'avant", () => {
    const sans = executer(SIMULE, ...SONDE, SEANCE, ESPACE, lire("EternalRoutes/Importer.lua"), CONVERTIR);
    const avec = executer(SIMULE, ...SONDE, SEANCE,
      'BANC.carte, BANC.zone = 1420, "Clairières de Tirisfal"; SlashCmdList.ETERNALPROBE("trajet Zeppelin"); BANC.carte = 1411; BANC.Avancer(10)',
      ESPACE, lire("EternalRoutes/Importer.lua"), CONVERTIR);
    expect(avec).toBe(sans);
  });

  it("préfère EternalProbeDB à l'ancienne RouteProbeDB", () => {
    const r = executer(SIMULE, ...SONDE, SEANCE, ESPACE, lire("EternalRoutes/Importer.lua"),
      `RouteProbeDB = { events = { "1.0|accept|1|Ancienne" } }
       return EternalRoutes.Importer.Enregistrement() == EternalProbeDB and "eternal" or "ancienne"`);
    expect(r).toBe("eternal");
  });
});

describe("Consignes sous l'étape : entraîneurs, grimoires, objets à ramasser (EternalRoutes 0.12)", () => {
  // Un démoniste fait la séance courte, achète un grimoire chez l'entraîneur de démons, puis ouvre sa fenêtre
  const ACHAT = `
BANC.cible = { nom = "Kazrogal", guid = "Creature-0-1-1-1-5815-1", x = 0.40, y = 0.60 }
BANC.titrePnj = "<Entraîneur de démons>"
BANC.objets[16321] = { nom = "Grimoire d'Éclair de feu (Rang 2)", classe = 9, sousClasse = 0 }
BANC.objets[2512] = { nom = "Flèche brute", classe = 6, sousClasse = 2 }
BANC.vente = { { id = 16321, nom = "Grimoire d'Éclair de feu (Rang 2)" }, { id = 2512, nom = "Flèche brute" } }
BANC.Evenement("MERCHANT_SHOW")
BuyMerchantItem(1)
BuyMerchantItem(2)
BANC.Evenement("MERCHANT_CLOSED")
BANC.Avancer(5)
BANC.Evenement("TRAINER_SHOW")
BANC.Evenement("TRAINER_CLOSED")
BANC.titrePnj = nil
`;
  const DEMONISTE =
    'BANC.joueur.classe, BANC.joueur.classeFichier = "Démoniste", "WARLOCK"\n' +
    SEANCE.replace('SlashCmdList.ETERNALPROBE("stop")', ACHAT + 'SlashCmdList.ETERNALPROBE("stop")');
  const ESPACE = `
GetLocale = function() return "frFR" end
EternalRoutes = { ADDON_NAME = "EternalRoutes", guides = {}, db = {}, questDB = {}, Print = function() end }
`;
  const MOTEUR = [lire("EternalRoutes/Locale.lua"), lire("EternalRoutes/Importer.lua"), lire("EternalRoutes/GuideEngine.lua")];

  it("note le titre de l'entraîneur et le seul grimoire acheté", () => {
    const r = executer(SIMULE, ...SONDE, DEMONISTE, `
local t = {}
for _, e in ipairs(EternalProbeDB.events) do
  local k = e:match("^[^|]*|([^|]*)")
  if k == "livre" or k == "trainer" then t[#t + 1] = e:gsub("^[^|]*|", "") end
end
return table.concat(t, "\\n")`).split("\n");
    expect(r).toHaveLength(2);
    expect(r[0]).toMatch(/^livre\|16321\|Grimoire d'Éclair de feu \(Rang 2\)\|Kazrogal\|Entraîneur de démons\|/);
    expect(r[1]).toMatch(/^trainer\|Kazrogal\|0\|.*\|Entraîneur de démons$/);
  });

  it("fait de l'achat une étape « choisir une capacité pour votre démon », faite dès le grimoire en sac", () => {
    const r = executer(SIMULE, ...SONDE, DEMONISTE, ESPACE, ...MOTEUR, `
local route = assert(EternalRoutes.Importer.Convertir(EternalRoutes.Importer.Enregistrement()))
local E, out = EternalRoutes.Engine, {}
for _, s in ipairs(route.steps) do
  local q = s.quests[1]
  if q.kind == "entrainer" then
    local etat = E.EtatEntraineur(q)
    out[#out + 1] = table.concat(E.ActionsEtape(q, E.GetObjectives(q)), " / ") .. " [" .. etat .. "]"
    if q.achat then
      BANC.sacs = {}
      E.OublierSacs()
      out[#out + 1] = "sans grimoire [" .. E.EtatEntraineur(q) .. "] " .. E.GetObjectives(q)[1].text
    end
  end
end
return table.concat(out, "\\n")`).split("\n");
    expect(r).toEqual([
      "Choisissez une capacité pour votre démon et achetez son grimoire. [done]",
      "sans grimoire [available] Grimoire d'Éclair de feu (Rang 2)",
      "Choisissez une capacité pour votre démon. [available]",
    ]);
  });

  it("rappelle d'ouvrir le grimoire resté dans les sacs, et pas les autres objets", () => {
    const r = executer(SIMULE, ...SONDE, DEMONISTE, ESPACE, ...MOTEUR,
      'return table.concat(EternalRoutes.Engine.ActionsSacs(), "\\n")');
    expect(r).toBe("Ouvrez vos sacs et faites un clic droit sur « Grimoire d'Éclair de feu (Rang 2) » : votre démon apprend la capacité.");
  });

  it("dit où ramasser un objet et quoi faire chez un entraîneur de classe ou de métier", () => {
    const r = executer(SIMULE, ESPACE, ...MOTEUR, `
local E = EternalRoutes.Engine
local q = { kind = "faire", collecte = {
  { item = "Viande de sanglier", sources = { "Sanglier tacheté" }, monstres = true },
  { item = "Caisse de vivres", sources = { "Caisse abandonnée" }, decor = true } } }
local objs = {
  { text = "Viande de sanglier : 2/6", type = "item", finished = false },
  { text = "Caisse de vivres : 0/3", type = "item", finished = false },
  { text = "Brasier allumé : 0/1", type = "object", finished = false },
  { text = "Loup : 3/3", type = "monster", finished = true } }
local t = E.ActionsEtape(q, objs)
t[#t + 1] = E.ActionsEtape({ kind = "faire" }, { { text = "Rapporter 5 × Pierre", finished = false } })[1]
t[#t + 1] = E.ActionsEtape({ kind = "entrainer" }, {})[1]
t[#t + 1] = E.ActionsEtape({ kind = "entrainer", metier = true }, {})[1]
t[#t + 1] = E.ActionsEtape({ kind = "entrainer", familier = "bete" }, {})[1]
t[#t + 1] = tostring(#E.ActionsEtape({ kind = "prendre" }, {}))
return table.concat(t, "\\n")`).split("\n");
    expect(r).toEqual([
      "Fouillez les corps : Sanglier tacheté.",
      "Cliquez sur : Caisse abandonnée pour ramasser les objets.",
      "Cliquez sur l'objet indiqué dans le décor.",
      "Ramassez les objets demandés.",
      "Apprenez vos nouveaux sorts auprès de l'entraîneur.",
      "Apprenez le rang suivant de votre métier.",
      "Choisissez les techniques à enseigner à votre familier.",
      "0",
    ]);
  });
});
