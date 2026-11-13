-- Banc d'essai des addons : un WoW simulé, juste assez pour charger EternalProbe et l'import d'EternalRoutes
-- hors du jeu. Le client est en Lua 5.1, le banc en Lua 5.3 (fengari) : on n'utilise que ce qui est commun.
-- Rien ici ne vient du jeu : chaque fonction rend ce qu'un scénario de test lui fixe dans BANC.

unpack = unpack or table.unpack

BANC = {
    t = 1000, frames = {}, minuteurs = {}, photos = 0, messages = {},
    joueur = { nom = "Testeur", niveau = 3, race = "Orc", raceFichier = "Orc", classe = "Guerrier", classeFichier = "WARRIOR", faction = "Horde" },
    carte = 1411, x = 0.42, y = 0.68, zone = "Durotar",
    cible = nil, journal = {}, quete = nil, taxi = nil, enVol = false, combat = nil,
    -- événements réservés à l'interface de Blizzard : un addon qui s'y inscrit est bloqué par le jeu
    interdits = { COMBAT_LOG_EVENT_UNFILTERED = true }, bloque = {},
}

-- ---- cadres (frames) : toute méthode inconnue ne fait rien --------------------------------------
local function NouveauCadre()
    local c = { scripts = {}, evenements = {} }
    return setmetatable(c, { __index = function(_, k)
        if k == "SetScript" then return function(self, nom, fn) self.scripts[nom] = fn end end
        if k == "GetScript" then return function(self, nom) return self.scripts[nom] end end
        if k == "RegisterEvent" then return function(self, ev)
            if BANC.interdits[ev] then BANC.bloque[#BANC.bloque + 1] = ev end
            self.evenements[ev] = true
        end end
        if k == "CreateTexture" or k == "CreateFontString" then return function() return NouveauCadre() end end
        if k == "GetWidth" or k == "GetHeight" then return function() return 140 end end
        if k == "GetCenter" then return function() return 0, 0 end end
        if k == "IsShown" then return function() return false end end
        if k == "GetText" then return function() return "" end end
        if k == "GetFont" then return function() return "Fonts\\FRIZQT__.TTF", 12, "" end end
        return function() end
    end })
end

function CreateFrame()
    local c = NouveauCadre()
    BANC.frames[#BANC.frames + 1] = c
    return c
end
UIParent, Minimap, GameTooltip = NouveauCadre(), NouveauCadre(), NouveauCadre()
DEFAULT_CHAT_FRAME = { AddMessage = function(_, m) BANC.messages[#BANC.messages + 1] = m end }
SlashCmdList, UISpecialFrames, SOUNDKIT = {}, {}, setmetatable({}, { __index = function() return 0 end })
RaidNotice_AddMessage, PlaySound, ReloadUI = function() end, function() end, function() end
RaidWarningFrame, ChatTypeInfo = NouveauCadre(), setmetatable({}, { __index = function() return { r = 1, g = 1, b = 1 } end })

function hooksecurefunc(nom, fn)
    local avant = _G[nom]
    _G[nom] = function(...) local r = { avant(...) }; fn(...); return unpack(r) end
end

-- ---- temps et minuteurs -------------------------------------------------------------------------
function GetTime() return BANC.t end
function time() return math.floor(BANC.t) end -- horloge du PC, pour les reprises après /reload
C_Timer = { After = function(d, fn) BANC.minuteurs[#BANC.minuteurs + 1] = { quand = BANC.t + d, fn = fn } end }

function BANC.Avancer(s)
    local fin = BANC.t + s
    while BANC.t < fin do
        BANC.t = BANC.t + 0.5
        local prets, restants = {}, {}
        for _, m in ipairs(BANC.minuteurs) do
            if m.quand <= BANC.t then prets[#prets + 1] = m else restants[#restants + 1] = m end
        end
        BANC.minuteurs = restants
        for _, m in ipairs(prets) do m.fn() end
        for _, c in ipairs(BANC.frames) do
            if c.scripts.OnUpdate then c.scripts.OnUpdate(c, 0.5) end
        end
    end
end

function BANC.Evenement(ev, ...)
    for _, c in ipairs(BANC.frames) do
        if c.evenements[ev] and c.scripts.OnEvent then c.scripts.OnEvent(c, ev, ...) end
    end
end

-- ---- joueur, cartes, unités -------------------------------------------------------------------
local J = BANC.joueur
function UnitName(u)
    if u == "player" then return J.nom end
    if (u == "target" or u == "npc" or u == "mouseover") and BANC.cible then return BANC.cible.nom end
end
function UnitLevel() return J.niveau end
function UnitRace() return J.race, J.raceFichier, 2 end
function UnitClass() return J.classe, J.classeFichier, 1 end
function UnitFactionGroup() return J.faction end
function UnitGUID(u)
    if u == "player" then return "Player-1" end
    if BANC.cible and (u == "target" or u == "mouseover") then return BANC.cible.guid end
end
function UnitExists(u) return u == "player" or (BANC.cible ~= nil and (u == "target" or u == "mouseover")) end
function UnitIsPlayer(u) return u == "player" end
function UnitClassification() return BANC.cible and BANC.cible.classement or "normal" end
function UnitIsDead(u) return u == "target" and BANC.cible ~= nil and BANC.cible.mort == true end
function UnitIsTapDenied(u) return u == "target" and BANC.cible ~= nil and BANC.cible.autre == true end
function UnitOnTaxi() return BANC.enVol end
function GetZoneText() return BANC.zone end
function GetRealmName() return "Forever" end
function IsInInstance() return false end
function IsTradeskillTrainer() return false end
function Screenshot() BANC.photos = BANC.photos + 1 end
ERR_NEWTAXIPATH = "Nouveau trajet aérien découvert !"

local Pos = { GetXY = function(self) return self.x, self.y end }
C_Map = {
    GetBestMapForUnit = function() return BANC.carte end,
    GetPlayerMapPosition = function(_, u)
        if u == "player" then return setmetatable({ x = BANC.x, y = BANC.y }, { __index = Pos }) end
        if BANC.cible and BANC.cible.x then return setmetatable({ x = BANC.cible.x, y = BANC.cible.y }, { __index = Pos }) end
    end,
    GetMapInfo = function(m) return { name = m == 1411 and "Durotar" or ("Carte " .. tostring(m)) } end,
}
C_AddOns = { IsAddOnLoaded = function() return false end }

-- ---- quêtes ------------------------------------------------------------------------------------
C_QuestLog = {
    GetTitleForQuestID = function(q) local e = BANC.journal[q]; return e and e.titre end,
    GetNumQuestLogEntries = function() local n = 0; for _ in pairs(BANC.journal) do n = n + 1 end; return n end,
    GetInfo = function(i)
        local k = 0
        for q, e in pairs(BANC.journal) do
            k = k + 1
            if k == i then return { questID = q, title = e.titre, level = e.niveau, suggestedGroup = e.groupe or 0, isHeader = false } end
        end
    end,
    GetLogIndexForQuestID = function(q)
        local k = 0
        for id in pairs(BANC.journal) do k = k + 1; if id == q then return k end end
    end,
    GetQuestObjectives = function(q) local e = BANC.journal[q]; return e and e.objectifs or {} end,
}
C_GossipInfo = { GetAvailableQuests = function() return {} end, GetActiveQuests = function() return {} end }
function GetQuestID() return BANC.quete and BANC.quete.id or 0 end
function GetRewardXP() return BANC.quete and BANC.quete.xp or 0 end
function GetRewardMoney() return BANC.quete and BANC.quete.argent or 0 end
function GetNumQuestRewards() return BANC.quete and #BANC.quete.objets or 0 end
function GetNumQuestChoices() return BANC.quete and #BANC.quete.choix or 0 end
local function Objet(genre, i) local q = BANC.quete; return q and (genre == "choice" and q.choix or q.objets)[i] end
function GetQuestItemLink(genre, i) local o = Objet(genre, i); return o and ("|cffffffff|Hitem:%d::::|h[Objet]|h|r"):format(o.id) end
function GetQuestItemInfo(genre, i) local o = Objet(genre, i); if o then return "Objet", 0, o.n end end
function GetQuestReward() end

-- ---- vols et combat ----------------------------------------------------------------------------
function NumTaxiNodes() return BANC.taxi and #BANC.taxi or 0 end
function TaxiNodeName(i) return BANC.taxi[i].nom end
function TaxiNodeGetType(i) return BANC.taxi[i].genre end
function CombatLogGetCurrentEventInfo() return unpack(BANC.combat or {}) end

-- ---- butin (non utilisé par les scénarios, mais appelé par la sonde) ----------------------------
function GetNumLootItems() return 0 end
function GetSpellInfo() return nil end
function GetSpellSubtext() return nil end
