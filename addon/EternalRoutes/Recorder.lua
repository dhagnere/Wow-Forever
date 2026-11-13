--[[----------------------------------------------------------------------------
    EternalRoutes — Recorder.lua
    Mode « sonde » : enregistre les événements du jeu (quêtes, PNJ, positions)
    pendant que le joueur joue, pour apprendre les vrais IDs de quête.

      /er rec start   démarre l'enregistrement
      /er rec stop    arrête
      /er rec dump    affiche les quêtes apprises (nom = id)
      /er rec clear   efface

    Les données sont conservées dans EternalRoutesRecDB (compte, pas personnage).
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local R = {}
ns.Recorder = R

local recording = false
local MAX_EVENTS = 20000

local function DB()
    if type(EternalRoutesRecDB) ~= "table" then EternalRoutesRecDB = {} end
    if type(EternalRoutesRecDB.quests) ~= "table" then EternalRoutesRecDB.quests = {} end
    if type(EternalRoutesRecDB.events) ~= "table" then EternalRoutesRecDB.events = {} end
    if type(EternalRoutesRecDB.targets) ~= "table" then EternalRoutesRecDB.targets = {} end
    return EternalRoutesRecDB
end

local function Count(t)
    local n = 0
    for _ in pairs(t or {}) do n = n + 1 end
    return n
end

local function QuestTitleByID(questID)
    if not questID then return nil end
    if C_QuestLog then
        if C_QuestLog.GetTitleForQuestID then
            local t = C_QuestLog.GetTitleForQuestID(questID)
            if t then return t end
        end
        if C_QuestLog.GetQuestInfo then
            local info = C_QuestLog.GetQuestInfo(questID)
            if info then return info.title end
        end
    end
    return nil
end

local function CurrentPos()
    local map
    if C_Map and C_Map.GetBestMapForUnit then
        map = C_Map.GetBestMapForUnit("player")
    end
    local x, y
    if map and C_Map.GetPlayerMapPosition then
        local pos = C_Map.GetPlayerMapPosition(map, "player")
        if pos then
            x, y = pos:GetXY()
        end
    end
    return map, x, y
end

local function AddEvent(ev, detail)
    local db = DB()
    db.events[#db.events + 1] = ("%.1f|%s|%s"):format(GetTime(), ev, tostring(detail))
    if #db.events > MAX_EVENTS then
        table.remove(db.events, 1)
    end
end

local function Learn(questID, title)
    if questID and title then
        DB().quests[title] = questID
    end
end

local function Handler(event, ...)
    if not recording then return end

    if event == "QUEST_ACCEPTED" then
        local q = ...
        local name = QuestTitleByID(q)
        Learn(q, name)
        AddEvent("accept", ("%s|%s"):format(tostring(q), tostring(name)))

    elseif event == "QUEST_TURNED_IN" then
        local q = ...
        local name = QuestTitleByID(q)
        Learn(q, name)
        AddEvent("turnin", ("%s|%s"):format(tostring(q), tostring(name)))

    elseif event == "GOSSIP_SHOW" or event == "QUEST_GREETING" then
        local npc = UnitName("target") or UnitName("npc") or "?"
        AddEvent("gossip", npc)
        if C_GossipInfo then
            if C_GossipInfo.GetAvailableQuests then
                for _, qi in ipairs(C_GossipInfo.GetAvailableQuests()) do
                    Learn(qi.questID, qi.title)
                    AddEvent("available", ("%s|%s|%s"):format(tostring(qi.questID), tostring(qi.title), npc))
                end
            end
            if C_GossipInfo.GetActiveQuests then
                for _, qi in ipairs(C_GossipInfo.GetActiveQuests()) do
                    Learn(qi.questID, qi.title)
                    AddEvent("active", ("%s|%s|%s"):format(tostring(qi.questID), tostring(qi.title), npc))
                end
            end
        end

    elseif event == "QUEST_DETAIL" then
        local q = GetQuestID and GetQuestID()
        local name = QuestTitleByID(q)
        Learn(q, name)
        AddEvent("detail", ("%s|%s"):format(tostring(q), tostring(name)))

    elseif event == "PLAYER_TARGET_CHANGED" then
        local name = UnitName("target")
        if name then
            DB().targets[name] = DB().targets[name] or tostring(UnitGUID("target"))
            AddEvent("target", name)
        end

    elseif event == "ZONE_CHANGED_NEW_AREA" or event == "PLAYER_ENTERING_WORLD" then
        local map, x, y = CurrentPos()
        AddEvent("zone", ("%s|%s|%s|%s"):format(tostring(GetZoneText()), tostring(map), tostring(x), tostring(y)))
    end
end

local frame = CreateFrame("Frame")
for _, ev in ipairs({
    "QUEST_ACCEPTED", "QUEST_TURNED_IN", "GOSSIP_SHOW", "QUEST_GREETING",
    "QUEST_DETAIL", "PLAYER_TARGET_CHANGED", "ZONE_CHANGED_NEW_AREA", "PLAYER_ENTERING_WORLD",
}) do
    frame:RegisterEvent(ev)
end
frame:SetScript("OnEvent", function(_, event, ...) Handler(event, ...) end)

-- échantillonnage de position (toutes les 3 s pendant l'enregistrement)
local elapsed = 0
frame:SetScript("OnUpdate", function(_, dt)
    if not recording then return end
    elapsed = elapsed + dt
    if elapsed < 3 then return end
    elapsed = 0
    local map, x, y = CurrentPos()
    if map and x and y then
        AddEvent("pos", ("%s|%.3f|%.3f"):format(tostring(map), x, y))
    end
end)

function R.Start()
    recording = true
    DB()
    ns.Print("Enregistrement démarré. Jouez, interagissez, puis /er rec stop.")
end

function R.Stop()
    recording = false
    local db = DB()
    ns.Print(("Enregistrement arrêté : %d quêtes apprises, %d événements."):format(Count(db.quests), #db.events))
end

function R.Clear()
    EternalRoutesRecDB = { quests = {}, events = {}, targets = {} }
    ns.Print("Enregistrement effacé.")
end

function R.Dump()
    local db = DB()
    local lines = {}
    for name, id in pairs(db.quests) do
        lines[#lines + 1] = ("%s = %s"):format(tostring(id), tostring(name))
    end
    table.sort(lines)
    ns.Print(("Quêtes apprises : %d · événements : %d"):format(#lines, #db.events))
    local max = 150
    for i = 1, math.min(#lines, max) do
        ns.Print(lines[i])
    end
    if #lines > max then
        ns.Print(("… (%d autres quêtes non affichées)"):format(#lines - max))
    end
end
