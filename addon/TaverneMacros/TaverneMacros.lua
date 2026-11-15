--[[----------------------------------------------------------------------------
    TaverneMacros — les macros de votre classe, créées en un clic.

      /tm                    ouvre la fenêtre de choix (cases à cocher, installation)
      /tm installer          crée (ou met à jour) les macros choisies, retire les macros de l'addon décochées
      /tm installer tout     coche et installe toutes les macros de la classe (dans la limite des places)
      /tm liste              affiche les macros de la classe, cochées ou non, et leurs touches
      /tm ajouter <nom>      coche une macro (sans l'installer)
      /tm enlever <nom>      décoche une macro
      /tm defaut             revient au choix de base
      /tm nourriture <nom>   chasseur : nourriture utilisée par la macro « Nourrir »
      /tm retirer            supprime toutes les macros créées par l'addon

    Chaque classe a ses macros de base (cochées d'office) et des macros au choix (Macros.lua).
    Le personnage n'a que 18 places de macros : la fenêtre compte celles qui restent.
    Les noms des sorts viennent du jeu (GetSpellInfo, d'après leur identifiant) : les macros
    marchent avec un client français comme anglais. Une macro dont le sort n'est pas encore
    appris s'installe quand même : elle servira dès que le sort sera connu.
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

--- Macros de la classe du personnage, celles de l'autre faction écartées.
local function Classe()
    local classe = select(2, UnitClass("player"))
    local toutes = ns.MACROS[classe or ""]
    if not toutes then return classe, nil end
    local faction = UnitFactionGroup and UnitFactionGroup("player")
    local out = {}
    for _, m in ipairs(toutes) do
        if not m.faction or not faction or m.faction == faction then out[#out + 1] = m end
    end
    return classe, out
end

--- Choix du personnage : { [nom] = true/false } ; sans choix enregistré, les macros de base.
local function Choisie(m)
    local choix = DB().choix
    if choix and choix[m.nom] ~= nil then return choix[m.nom] end
    return m.base == true
end

local function Choisir(m, oui)
    DB().choix = DB().choix or {}
    DB().choix[m.nom] = oui and true or false
end

local function Trouver(macros, nom)
    nom = tostring(nom or ""):lower()
    for _, m in ipairs(macros or {}) do
        if m.nom:lower() == nom then return m end
    end
    for _, m in ipairs(macros or {}) do
        if m.nom:lower():find(nom, 1, true) then return m end
    end
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

local Fenetre -- rafraîchie après une installation

local function Installer(tout)
    local classe, macros = Classe()
    if not macros then Print("pas de macros prévues pour cette classe.") return end
    if InCombatLockdown and InCombatLockdown() then Print("impossible en combat : réessayez après.") return end
    if tout then for _, m in ipairs(macros) do Choisir(m, true) end end
    -- d'abord retirer les macros de l'addon décochées : elles libèrent des places
    local retirees = 0
    for _, m in ipairs(macros) do
        if not Choisie(m) and DB().creees[m.nom] then
            local index = GetMacroIndexByName(m.nom)
            if index and index > 0 then DeleteMacro(index) retirees = retirees + 1 end
            DB().creees[m.nom] = nil
        end
    end
    local crees, maj, refus = 0, 0, {}
    for _, m in ipairs(macros) do
        if Choisie(m) then
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
    end
    Print(("macros du %s : %d créée(s), %d mise(s) à jour, %d retirée(s). Échap > Macros, onglet du personnage, pour les glisser sur vos barres."):format(
        NOMS_CLASSES[classe] or classe, crees, maj, retirees))
    if #refus > 0 then
        Print("plus de place pour : " .. table.concat(refus, ", ") .. ". Décochez des macros ou libérez des places, puis relancez /tm installer.")
    end
    if Fenetre and Fenetre:IsShown() then Fenetre:Rafraichir() end
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
    if Fenetre and Fenetre:IsShown() then Fenetre:Rafraichir() end
end

local function Liste()
    local classe, macros = Classe()
    if not macros then Print("pas de macros prévues pour cette classe.") return end
    Print(("macros du %s ([x] cochée, /tm pour choisir, /tm installer pour créer) :"):format(NOMS_CLASSES[classe] or classe))
    for _, m in ipairs(macros) do
        DEFAULT_CHAT_FRAME:AddMessage(("  %s |cffe3c27a%s|r — %s"):format(Choisie(m) and "[x]" or "[  ]", m.nom, m.aide))
    end
    if classe == "HUNTER" and DB().nourriture then
        DEFAULT_CHAT_FRAME:AddMessage("  Nourriture : " .. DB().nourriture)
    end
end

-- ---------------------------------------------------------------------------
-- Fenêtre de choix
-- ---------------------------------------------------------------------------

local function CreerFenetre()
    local f = CreateFrame("Frame", "TaverneMacrosFenetre", UIParent, "BasicFrameTemplateWithInset")
    f:SetSize(460, 540)
    f:SetPoint("CENTER")
    f:SetMovable(true)
    f:EnableMouse(true)
    f:RegisterForDrag("LeftButton")
    f:SetScript("OnDragStart", f.StartMoving)
    f:SetScript("OnDragStop", f.StopMovingOrSizing)
    f:SetFrameStrata("DIALOG")
    tinsert(UISpecialFrames, "TaverneMacrosFenetre") -- Échap la ferme

    f.titre = f:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    f.titre:SetPoint("TOP", 0, -6)

    f.compte = f:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
    f.compte:SetPoint("TOPLEFT", 14, -32)
    f.compte:SetPoint("TOPRIGHT", -14, -32)
    f.compte:SetJustifyH("LEFT")

    local defil = CreateFrame("ScrollFrame", "TaverneMacrosDefil", f, "UIPanelScrollFrameTemplate")
    defil:SetPoint("TOPLEFT", 10, -52)
    defil:SetPoint("BOTTOMRIGHT", -30, 46)
    local contenu = CreateFrame("Frame", nil, defil)
    contenu:SetSize(410, 10)
    defil:SetScrollChild(contenu)
    f.contenu, f.cases = contenu, {}

    local function Bouton(texte, largeur, x, action)
        local b = CreateFrame("Button", nil, f, "UIPanelButtonTemplate")
        b:SetSize(largeur, 24)
        b:SetPoint("BOTTOMLEFT", x, 12)
        b:SetText(texte)
        b:SetScript("OnClick", action)
        return b
    end
    Bouton("Installer la sélection", 160, 12, function() Installer(false) end)
    Bouton("Choix de base", 120, 178, function()
        DB().choix = nil
        f:Rafraichir()
    end)
    Bouton("Tout cocher", 110, 304, function()
        local _, macros = Classe()
        for _, m in ipairs(macros or {}) do Choisir(m, true) end
        f:Rafraichir()
    end)

    function f:Rafraichir()
        local classe, macros = Classe()
        macros = macros or {}
        self.titre:SetText(("TaverneMacros — %s"):format(NOMS_CLASSES[classe or ""] or tostring(classe)))
        local cochees, nouvelles = 0, 0
        for _, m in ipairs(macros) do
            if Choisie(m) then
                cochees = cochees + 1
                local index = GetMacroIndexByName(m.nom)
                if not (index and index > 0) then nouvelles = nouvelles + 1 end
            end
        end
        local libres = PlacesLibres()
        local couleur = nouvelles > libres and "|cffff6060" or "|cff80ff80"
        self.compte:SetText(("%d macro(s) cochée(s) sur %d · %s%d place(s) libre(s)|r pour %d à créer"):format(
            cochees, #macros, couleur, libres, nouvelles))
        local y = 0
        for i, m in ipairs(macros) do
            local c = self.cases[i]
            if not c then
                c = CreateFrame("CheckButton", nil, self.contenu, "UICheckButtonTemplate")
                c:SetSize(24, 24)
                c.libelle = c:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
                c.libelle:SetPoint("TOPLEFT", c, "TOPRIGHT", 2, -2)
                c.libelle:SetWidth(370)
                c.libelle:SetJustifyH("LEFT")
                c.aide = c:CreateFontString(nil, "OVERLAY", "GameFontDisableSmall")
                c.aide:SetPoint("TOPLEFT", c.libelle, "BOTTOMLEFT", 0, -2)
                c.aide:SetWidth(370)
                c.aide:SetJustifyH("LEFT")
                c:SetScript("OnClick", function(btn)
                    Choisir(btn.macro, btn:GetChecked())
                    self:Rafraichir()
                end)
                c:SetScript("OnEnter", function(btn)
                    GameTooltip:SetOwner(btn, "ANCHOR_RIGHT")
                    GameTooltip:AddLine(btn.macro.nom, 1, 0.82, 0.48)
                    GameTooltip:AddLine(CorpsDe(btn.macro), 1, 1, 1, true)
                    GameTooltip:Show()
                end)
                c:SetScript("OnLeave", function() GameTooltip:Hide() end)
                self.cases[i] = c
            end
            c.macro = m
            c:SetChecked(Choisie(m))
            local index = GetMacroIndexByName(m.nom)
            local etat = (index and index > 0) and " |cff80ff80(installée)|r" or ""
            c.libelle:SetText(m.nom .. (m.base and "" or " |cffaaaaaa· au choix|r") .. etat)
            c.aide:SetText(m.aide)
            c:ClearAllPoints()
            c:SetPoint("TOPLEFT", 4, -y)
            c:Show()
            y = y + 22 + math.max(14, c.aide:GetStringHeight()) + 8
        end
        for i = #macros + 1, #self.cases do self.cases[i]:Hide() end
        self.contenu:SetHeight(math.max(10, y))
    end

    f:SetScript("OnShow", function(self) self:Rafraichir() end)
    return f
end

local function Ouvrir()
    if not ns.MACROS[select(2, UnitClass("player")) or ""] then Print("pas de macros prévues pour cette classe.") return end
    Fenetre = Fenetre or CreerFenetre()
    if Fenetre:IsShown() then Fenetre:Hide() else Fenetre:Show() end
end

SLASH_TAVERNEMACROS1 = "/tm"
SLASH_TAVERNEMACROS2 = "/taverne-macros"
SlashCmdList.TAVERNEMACROS = function(msg)
    local brut = tostring(msg or ""):match("^%s*(.-)%s*$") or ""
    local cmd, reste = brut:match("^(%S*)%s*(.-)$")
    cmd = (cmd or ""):lower()
    if cmd == "installer" or cmd == "install" then
        Installer(reste:lower() == "tout" or reste:lower() == "all")
    elseif cmd == "retirer" or cmd == "remove" then
        Retirer()
    elseif cmd == "liste" or cmd == "list" then
        Liste()
    elseif cmd == "ajouter" or cmd == "enlever" or cmd == "add" or cmd == "del" then
        local _, macros = Classe()
        local m = Trouver(macros, reste)
        if not m then Print(("macro introuvable : « %s » (/tm liste)."):format(reste)) return end
        Choisir(m, cmd == "ajouter" or cmd == "add")
        Print(("« %s » %s. /tm installer pour appliquer."):format(m.nom, (cmd == "ajouter" or cmd == "add") and "cochée" or "décochée"))
    elseif cmd == "defaut" or cmd == "défaut" or cmd == "reset" then
        DB().choix = nil
        Print("retour au choix de base. /tm installer pour appliquer.")
    elseif cmd == "nourriture" or cmd == "food" then
        DB().nourriture = (reste ~= "" and reste) or nil
        Print(DB().nourriture and ("nourriture : " .. DB().nourriture .. ". Relancez /tm installer pour mettre la macro à jour.") or "nourriture retirée de la macro.")
    else
        Ouvrir()
    end
end

-- API pour les tests
_G.TaverneMacros = { Corps = Corps, CorpsDe = CorpsDe, Installer = Installer, Retirer = Retirer, Choisie = Choisie,
    Choisir = Choisir, Classe = Classe, ns = ns }
