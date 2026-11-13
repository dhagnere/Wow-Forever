--[[----------------------------------------------------------------------------
    EternalRoutes — TomTomIntegration.lua
    Flèche de direction : TomTom si présent, sinon waypoint natif Blizzard.

    API TomTom (Classic Era) vérifiée sur le terrain (réf. RestedXP-TomTom) :
      TomTom:AddWaypoint(mapId, x, y, opts) -> uid   (x/y normalisés 0..1)
      TomTom:RemoveWaypoint(uid)
      TomTom:SetCrazyArrow(uid, arrivalDist, title)

    Repli (client moderne / Forever sans TomTom) :
      C_Map.SetUserWaypoint({ uiMapID, position })
      C_SuperTrack.SetSuperTrackedUserWaypoint(true)
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local Bridge = {}
ns.TomTomBridge = Bridge

local activeUid = nil
local activeMap = nil
local dernier = nil   -- dernier point envoyé : { map, x, y, title, ok }

-- étape visée : celle que l'on consulte (boutons < >, vue du parcours), sinon l'étape en cours
function Bridge.TargetStep()
    local g = ns.Engine and ns.Engine.GetActiveGuide and ns.Engine.GetActiveGuide()
    if g and ns.viewStep and g.steps[ns.viewStep] then return g.steps[ns.viewStep] end
    return ns.Engine and ns.Engine.GetCurrentStep and ns.Engine.GetCurrentStep()
end

local function GetTomTom()
    local tt = _G.TomTom
    if type(tt) == "table" and type(tt.AddWaypoint) == "function" and type(tt.RemoveWaypoint) == "function" then
        return tt
    end
end

local function ClearActive()
    local tt = GetTomTom()
    if tt and activeUid then
        pcall(tt.RemoveWaypoint, tt, activeUid)
    end
    activeUid = nil
    activeMap = nil
    if C_Map and C_Map.ClearUserWaypoint then
        pcall(C_Map.ClearUserWaypoint)
    end
end

function Bridge.Refresh()
    ClearActive()
    dernier = nil

    if not ns.db.arrowEnabled then return end
    if not ns.Engine then return end

    local step = Bridge.TargetStep()
    if not step then return end

    local map = step.map or (ns.zoneMaps and step.zone and ns.zoneMaps[step.zone])
    if not map and C_Map and C_Map.GetBestMapForUnit then
        map = C_Map.GetBestMapForUnit("player")
    end
    if not map then return end

    -- Coordonnées : directes (0..100) ou monde RXP (wx/wy) à convertir
    local x, y = step.x, step.y
    if (not x or not y) and step.wx and step.wy and C_Map and C_Map.GetMapPosFromWorldPos then
        local ok, pos = pcall(C_Map.GetMapPosFromWorldPos, map, { x = step.wx, y = step.wy })
        if ok and pos then x, y = pos:GetXY() end
    end
    if not (x and y) then return end

    -- TomTom attend des coordonnées normalisées 0..1
    x = x / 100
    y = y / 100
    if x < 0 or x > 1 or y < 0 or y > 1 then return end

    -- Intitulé sous la flèche : action + PNJ
    local pending = ns.Engine and ns.Engine.GetPendingQuest and ns.Engine.GetPendingQuest(step)
    local title
    if pending then
        local verb = (ns.L and ns.L["ACT_" .. tostring(pending.kind)]) or tostring(pending.kind)
        local qname = (ns.Engine and ns.Engine.QuestName) and ns.Engine.QuestName(pending) or pending.name
        local lieu = ns.Engine and ns.Engine.NomLieu and ns.Engine.NomLieu(step) or step.location
        title = verb .. ((ns.IsEnglish and ns.IsEnglish()) and ": " or " : ") .. qname
        if lieu and lieu ~= "" and lieu ~= qname then
            title = title .. " @ " .. lieu
        end
    else
        local lieu = ns.Engine and ns.Engine.NomLieu and ns.Engine.NomLieu(step) or step.location
        title = tostring(lieu or (ns.Engine and ns.Engine.NomZone and ns.Engine.NomZone(step)) or step.zone or "EternalRoutes")
    end
    if #title > 60 then title = title:sub(1, 57) .. "..." end

    local tt = GetTomTom()
    if tt then
        local arrival = (tt.profile and tt.profile.arrow and tt.profile.arrow.arrival) or 0

        local uid = tt:AddWaypoint(map, x, y, {
            title      = title,
            source     = "EternalRoutes",
            crazy      = true,
            minimap    = true,
            world      = true,
            persistent = false,
            silent     = true,
        })

        if uid and type(tt.SetCrazyArrow) == "function" then
            pcall(tt.SetCrazyArrow, tt, uid, arrival, title)
        end

        activeUid = uid
        activeMap = map
        dernier = { map = map, x = x * 100, y = y * 100, title = title, ok = uid ~= nil, tomtom = true }
        return
    end

    -- Repli : waypoint natif Blizzard (client moderne, sans TomTom)
    if C_Map and C_Map.SetUserWaypoint then
        local ok = pcall(C_Map.SetUserWaypoint, { uiMapID = map, position = { x = x, y = y } })
        if ok then
            if C_SuperTrack and C_SuperTrack.SetSuperTrackedUserWaypoint then
                pcall(C_SuperTrack.SetSuperTrackedUserWaypoint, true)
            end
            activeMap = map
        end
        dernier = { map = map, x = x * 100, y = y * 100, title = title, ok = ok, tomtom = false }
    end
end

-- état de la flèche, en clair (/er fleche ou clic sur la boussole de la fenêtre)
function Bridge.Status()
    local L = ns.L
    if ns.db and ns.db.arrowEnabled == false then return L.ARROW_DISABLED end
    local step = Bridge.TargetStep()
    if not step then
        if ns.Engine and ns.Engine.IsFinished and ns.Engine.IsFinished() then return L.ALREADY_DONE end
        return L.ARROW_NO_STEP
    end
    if not (step.x and step.y) then return L.ARROW_NO_COORDS end
    if not GetTomTom() then return L.ARROW_NO_TOMTOM end
    if not (dernier and dernier.ok) then
        return L.ARROW_FAILED:format(tostring(dernier and dernier.map or step.map), step.x, step.y)
    end
    local d = Bridge.GetDistance()
    return L.ARROW_OK:format(tostring(dernier.title), tostring(dernier.map), dernier.x, dernier.y,
        d and (" · " .. ("%.0f"):format(d) .. " " .. (L.UNIT or "m")) or "")
end

function Bridge.OnTomTomLoaded()
    Bridge.Refresh()
end

function Bridge.GetDistance()
    local tt = GetTomTom()
    if not (tt and activeUid) then return nil end
    if type(tt.GetDistanceToWaypoint) ~= "function" then return nil end
    local ok, dist = pcall(tt.GetDistanceToWaypoint, tt, activeUid)
    if ok and type(dist) == "number" then return dist end
    return nil
end

function Bridge.IsOnWaypointMap()
    if not activeMap then return false end
    if C_Map and C_Map.GetBestMapForUnit then
        return C_Map.GetBestMapForUnit("player") == activeMap
    end
    return false
end
