--[[----------------------------------------------------------------------------
    TaverneMacros — les macros de votre classe, créées en un clic.

      /tm installer          crée (ou met à jour) les macros de la classe du personnage
      /tm liste              affiche les macros de la classe et leurs touches
      /tm nourriture <nom>   chasseur : nourriture utilisée par la macro « Nourrir »
      /tm retirer            supprime les macros créées par l'addon

    Les neuf classes ont leurs macros (Macros.lua). Les noms des sorts viennent du jeu
    (GetSpellInfo, d'après leur identifiant) : les macros marchent avec un client français
    comme anglais. Elles sont créées dans l'onglet du personnage (Échap > Macros), à glisser
    ensuite sur les barres. Une macro dont le sort n'est pas encore appris s'installe quand même :
    elle servira dès que le sort sera connu.
    L'addon ne joue pas à votre place : une macro ne lance qu'un sort par appui.
------------------------------------------------------------------------------]]

local ADDON, ns = ...
local QUESTION = 134400          -- icône « ? » : remplacée par celle du sort grâce à #showtooltip

local NOMS_CLASSES = {
    WARRIOR = "guerrier", PALADIN = "paladin", HUNTER = "chasseur", ROGUE = "voleur", PRIEST = "prêtre",
    SHAMAN = "chaman", MAGE = "mage", WARLOCK = "démoniste", DRUID = "druide",
}

local function Nom(cle)
    local s = ns.SORTS[cle]
    if not s then return cle end
    local nom = GetSpellInfo and GetSpellInfo(s[1])
    if (not nom or nom == "") and C_Spell and C_Spell.GetSpellName then
        nom = C_Spell.GetSpellName(s[1])
    end
    return (nom and nom ~= "") and nom or s[2]
end

-- remplace {Nom anglais} par le nom du sort dans la langue du client
local function Corps(modele)
    return (modele:gsub("{([^}]+)}", Nom))
end

local function Print(msg)
    DEFAULT_CHAT_FRAME:AddMessage(("|cffe3c27a%s|r : %s"):format(ADDON, tostring(msg)))
end

local function DB()
    if type(TaverneMacrosDB) ~= "table" then TaverneMacrosDB = {} end
    TaverneMacrosDB.creees = TaverneMacrosDB.creees or {}
    return TaverneMacrosDB
end

local function Classe()
    local _, classe = UnitClass("player")
    return classe, ns.MACROS[classe or ""]
end

local function CorpsDe(m)
    local corps = Corps(m.modele)
    if m.nom == "Nourrir" and DB().nourriture and DB().nourriture ~= "" then
        corps = corps .. "\n/use " .. DB().nourriture
    end
    return corps:sub(1, 255)
end

local function PlacesLibres()
    local _, parPerso = GetNumMacros()
    local max = MAX_CHARACTER_MACROS or 18
    return max - (parPerso or 0)
end

local function Installer()
    local classe, macros = Classe()
    if not macros then Print("pas de macros prévues pour cette classe.") return end
    if InCombatLockdown and InCombatLockdown() then Print("impossible en combat : réessayez après.") return end
    local crees, maj, refus = 0, 0, {}
    for _, m in ipairs(macros) do
        local corps = CorpsDe(m)
        local index = GetMacroIndexByName(m.nom)
        if index and index > 0 then
            EditMacro(index, m.nom, QUESTION, corps)
            maj = maj + 1
            DB().creees[m.nom] = true
        elseif PlacesLibres() > 0 then
            local ok = CreateMacro(m.nom, QUESTION, corps, true)
            if ok then
                crees = crees + 1
                DB().creees[m.nom] = true
            else
                refus[#refus + 1] = m.nom
            end
        else
            refus[#refus + 1] = m.nom
        end
    end
    Print(("macros du %s : %d créée(s), %d mise(s) à jour. Échap > Macros, onglet du personnage, pour les glisser sur vos barres."):format(
        NOMS_CLASSES[classe] or classe, crees, maj))
    if #refus > 0 then
        Print("plus de place pour : " .. table.concat(refus, ", ") .. ". Libérez des macros du personnage puis relancez /tm installer.")
    end
end

local function Retirer()
    if InCombatLockdown and InCombatLockdown() then Print("impossible en combat : réessayez après.") return end
    local n = 0
    for nom in pairs(DB().creees) do
        local index = GetMacroIndexByName(nom)
        if index and index > 0 then
            DeleteMacro(index)
            n = n + 1
        end
    end
    wipe(DB().creees)
    Print(("%d macro(s) supprimée(s)."):format(n))
end

local function Liste()
    local classe, macros = Classe()
    if not macros then Print("pas de macros prévues pour cette classe.") return end
    Print(("macros du %s (/tm installer pour les créer) :"):format(NOMS_CLASSES[classe] or classe))
    for _, m in ipairs(macros) do
        DEFAULT_CHAT_FRAME:AddMessage(("  |cffe3c27a%s|r — %s"):format(m.nom, m.aide))
    end
    if classe == "HUNTER" and DB().nourriture then
        DEFAULT_CHAT_FRAME:AddMessage("  Nourriture : " .. DB().nourriture)
    end
end

SLASH_TAVERNEMACROS1 = "/tm"
SLASH_TAVERNEMACROS2 = "/taverne-macros"
SlashCmdList.TAVERNEMACROS = function(msg)
    local brut = tostring(msg or ""):match("^%s*(.-)%s*$") or ""
    local cmd, reste = brut:match("^(%S*)%s*(.-)$")
    cmd = (cmd or ""):lower()
    if cmd == "installer" or cmd == "install" then
        Installer()
    elseif cmd == "retirer" or cmd == "remove" then
        Retirer()
    elseif cmd == "nourriture" or cmd == "food" then
        DB().nourriture = (reste ~= "" and reste) or nil
        Print(DB().nourriture and ("nourriture : " .. DB().nourriture .. ". Relancez /tm installer pour mettre la macro à jour.") or "nourriture retirée de la macro.")
    else
        Liste()
    end
end

-- API pour les tests
_G.TaverneMacros = { Corps = Corps, CorpsDe = CorpsDe, Installer = Installer, Retirer = Retirer, ns = ns }
