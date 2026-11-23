import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error fengari n'a pas de types
import { lauxlib, lua, lualib, to_luastring } from "fengari";

// TaverneMacros hors du jeu : macros de chaque classe (base et au choix), installation de la sélection.

const lire = (f: string) =>
  readFileSync(path.join(process.cwd(), "addon/TaverneMacros", f), "utf8").replace(/^local (\w+), ns = \.\.\./m, 'local $1, ns = "TaverneMacros", NS');

function executer(...morceaux: string[]): string {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);
  for (const code of morceaux) {
    if (lauxlib.luaL_dostring(L, to_luastring(code)) !== lua.LUA_OK) throw new Error(lua.lua_tojsstring(L, -1));
  }
  return lua.lua_tojsstring(L, -1) ?? "";
}

const JEU = `
NS = {}
JOUEUR = { classe = "WARRIOR", faction = "Horde" }
MACROS_JEU, MAX_CHARACTER_MACROS, MESSAGES = {}, 18, {}
function UnitClass() return "Guerrier", JOUEUR.classe end
function UnitFactionGroup() return JOUEUR.faction end
function GetSpellInfo() return nil end
function InCombatLockdown() return false end
function GetNumMacros() local n = 0 for _ in pairs(MACROS_JEU) do n = n + 1 end return 0, n end
function GetMacroIndexByName(nom) return MACROS_JEU[nom] and 1 or 0 end
function CreateMacro(nom, icone, corps) MACROS_JEU[nom] = corps return 1 end
function EditMacro(i, nom, icone, corps) MACROS_JEU[nom] = corps end
function DeleteMacro() end
function wipe(t) for k in pairs(t) do t[k] = nil end return t end
DEFAULT_CHAT_FRAME = { AddMessage = function(_, m) MESSAGES[#MESSAGES + 1] = m end }
SlashCmdList = {}
`;

describe("TaverneMacros", () => {
  const MACROS = lire("Macros.lua");
  const ADDON = lire("TaverneMacros.lua");

  it("a des macros de base et au choix pour les neuf classes, valides pour le jeu", () => {
    const r = executer(JEU, MACROS, ADDON, `
local out, erreurs = {}, {}
for _, classe in ipairs({ "WARRIOR", "PALADIN", "HUNTER", "ROGUE", "PRIEST", "SHAMAN", "MAGE", "WARLOCK", "DRUID" }) do
  for _, faction in ipairs({ "Horde", "Alliance" }) do
    JOUEUR.classe, JOUEUR.faction = classe, faction
    local _, macros = TaverneMacros.Classe()
    local base, choix, noms = 0, 0, {}
    for _, m in ipairs(macros) do
      if m.base then base = base + 1 else choix = choix + 1 end
      if noms[m.nom] then erreurs[#erreurs + 1] = classe .. " doublon " .. m.nom end
      noms[m.nom] = true
      if #m.nom > 16 then erreurs[#erreurs + 1] = classe .. " nom long " .. m.nom end
      local corps = TaverneMacros.CorpsDe(m)
      if corps:find("{", 1, true) then erreurs[#erreurs + 1] = classe .. " sort inconnu dans " .. m.nom end
      if #TaverneMacros.Corps(m.modele) > 255 then erreurs[#erreurs + 1] = classe .. " trop longue " .. m.nom end
    end
    if base > 18 then erreurs[#erreurs + 1] = classe .. " trop de macros de base" end
    if faction == "Horde" then out[#out + 1] = classe .. ":" .. base .. "+" .. choix end
  end
end
return table.concat(erreurs, "; ") .. "|" .. table.concat(out, " ")`);
    const [erreurs, comptes] = r.split("|");
    expect(erreurs).toBe("");
    for (const c of comptes.split(" ")) {
      const [, base, choix] = c.match(/:(\d+)\+(\d+)/)!;
      expect(Number(base)).toBeGreaterThanOrEqual(8);
      expect(Number(choix)).toBeGreaterThanOrEqual(10);
    }
  });

  it("installe la sélection : macros de base, ajout d'une macro au choix, retrait d'une macro décochée", () => {
    const r = executer(JEU, MACROS, ADDON, `
JOUEUR.classe = "WARRIOR"
TaverneMacros.Installer(false)
local n1 = 0 for _ in pairs(MACROS_JEU) do n1 = n1 + 1 end
SlashCmdList.TAVERNEMACROS("ajouter tourbillon")
SlashCmdList.TAVERNEMACROS("enlever charge")
TaverneMacros.Installer(false)
return n1 .. " " .. tostring(MACROS_JEU["Tourbillon"] ~= nil) .. " " .. tostring(TaverneMacrosDB.creees["Charge"] == nil)
  .. " " .. tostring(MACROS_JEU["Tourbillon"]:find("Tourbillon", 1, true) ~= nil)`);
    expect(r).toBe("9 true true true");
  });

  it("ajoute la macro raciale du personnage (cochée d'office) et les macros communes à toutes les classes", () => {
    const r = executer(JEU, MACROS, ADDON, `
local res = {}
-- race connue du jeu
JOUEUR.classe = "PRIEST"
function UnitRace() return "Orc", "Orc" end
local _, macros = TaverneMacros.Classe()
local raciale, communes = nil, 0
for _, m in ipairs(macros) do
  if m.nom == "Raciale" then raciale = m end
  if m.genre == "commune" then communes = communes + 1 end
end
res[#res + 1] = tostring(raciale and raciale.base) .. ":" .. TaverneMacros.CorpsDe(raciale) .. ":" .. communes
-- race que la table ne connaît pas : reconnue à la capacité raciale apprise (Skyborne)
function UnitRace() return "Célestien", "Inconnue" end
function IsPlayerSpell(id) return id == 1259705 end
local _, m2 = TaverneMacros.Classe()
for _, m in ipairs(m2) do if m.nom == "Raciale" then res[#res + 1] = TaverneMacros.CorpsDe(m) end end
-- installation : la macro raciale part avec les macros de base
function UnitRace() return "Humain", "Human" end
IsPlayerSpell = nil
TaverneMacros.Installer(false)
res[#res + 1] = tostring(MACROS_JEU["Raciale"] ~= nil) .. ":" .. tostring(MACROS_JEU["Foyer"] == nil)
return table.concat(res, "|")`);
    const [orc, skyborne, installe] = r.split("|");
    expect(orc).toMatch(/^true:/);
    expect(orc).toContain("Fureur sanguinaire");
    expect(orc).toContain("Bris de malédictions");
    expect(orc.endsWith(":6")).toBe(true);
    expect(skyborne).toContain("Lecture des lignes telluriques");
    expect(installe).toBe("true:true");
  });

  it("garde les téléportations de mage à la faction du personnage", () => {
    const r = executer(JEU, MACROS, ADDON, `
JOUEUR.classe, JOUEUR.faction = "MAGE", "Alliance"
local _, macros = TaverneMacros.Classe()
for _, m in ipairs(macros) do if m.nom == "Téléport" then return TaverneMacros.CorpsDe(m) end end`);
    expect(r).toContain("Hurlevent");
    expect(r).not.toContain("Orgrimmar");
  });
});
