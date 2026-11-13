--[[----------------------------------------------------------------------------
    EternalRoutes — Core.lua
    Fichier : Core.lua
    Rôle    : namespace, variables sauvegardées, événements, commandes slash.
------------------------------------------------------------------------------]]

local ADDON_NAME = "EternalRoutes"

EternalRoutes = EternalRoutes or {}
local ns = EternalRoutes

ns.ADDON_NAME = ADDON_NAME
ns.version = "0.7.0"

ns.db = {}

local defaults = {
    activeGuide   = nil,
    stepIndex     = 1,
    arrowEnabled  = true,
    showNext      = true,
    miniMode      = false,
    scale         = 1,
}

-- Message de chat (gère les retours à la ligne)
function ns.Print(msg)
    local text = tostring(msg)
    for line in (text .. "\n"):gmatch("(.-)\n") do
        DEFAULT_CHAT_FRAME:AddMessage(("|cff33ccff%s|r: %s"):format(ADDON_NAME, line))
    end
end

local eventFrame = CreateFrame("Frame")
ns.eventFrame = eventFrame
eventFrame:RegisterEvent("ADDON_LOADED")
eventFrame:RegisterEvent("PLAYER_LOGIN")

eventFrame:SetScript("OnEvent", function(self, event, ...)
    if event == "ADDON_LOADED" then
        local loaded = ...
        if loaded == ADDON_NAME then
            ns.OnInitialize()
        elseif loaded == "TomTom" then
            if ns.TomTomBridge and ns.TomTomBridge.OnTomTomLoaded then
                ns.TomTomBridge.OnTomTomLoaded()
            end
        end
    elseif event == "PLAYER_LOGIN" then
        ns.OnLogin()
    end
end)

function ns.OnInitialize()
    if type(EternalRoutesDB) ~= "table" then
        EternalRoutesDB = {}
    end
    for k, v in pairs(defaults) do
        if EternalRoutesDB[k] == nil then
            EternalRoutesDB[k] = v
        end
    end
    ns.db = EternalRoutesDB
    if type(EternalRoutesDB.doneQuests) ~= "table" then
        EternalRoutesDB.doneQuests = {}
    end
    -- 0.4.5 : retour une fois à la langue du client (un clic sur EN restait mémorisé)
    if ns.db.langReset ~= 1 then
        ns.db.lang = nil
        ns.db.langReset = 1
    end
    if ns.SetLang then
        ns.SetLang(ns.db.lang or ((GetLocale() == "enUS" or GetLocale() == "enGB") and "en" or "fr"))
    end
end

function ns.OnLogin()
    if ns.Engine and ns.Engine.OnLogin then
        ns.Engine.OnLogin()
    end
    if ns.Window and ns.Window.OnLogin then
        ns.Window.OnLogin()
    end
    if ns.L then
        ns.Print(ns.L.WELCOME)
    end
end

-- Commandes slash : /eternalroutes  ou  /er
--   /er              ouvre / ferme le guide
--   /er reset        réinitialise la progression
--   /er next|prev    avance / recule d'une étape
--   /er status       guide et étape courants (court)
--   /er state        analyse complète du moteur
--   /er quests       statut détaillé des quêtes de l'étape
--   /er debug        journalise les événements WoW dans le chat
--   /er fleche       renvoie le point à TomTom et affiche l'état de la flèche
--   /er importer     transforme l'enregistrement RouteProbe en route (gardée pour le compte)
--   /er routes       liste les routes importées · /er supprimer <id> en retire une · /er restaurer <id> remet la précédente
--   /er mini         bascule entre fenêtre complète et mode réduit
--   /er route        vue du parcours (zones et étapes)
--   /er options      réglages
SLASH_ETERNALROUTES1 = "/eternalroutes"
SLASH_ETERNALROUTES2 = "/er"
SlashCmdList.ETERNALROUTES = function(msg)
    msg = tostring(msg or ""):lower():match("^%s*(.-)%s*$") or ""

    if msg == "reset" then
        if ns.db then ns.db.stepIndex = 1 end
        if ns.Engine and ns.Engine.Refresh then ns.Engine.Refresh() end
        ns.Print(ns.L.RESET_DONE)
        return
    end
    if msg == "next" then
        if ns.Engine and ns.Engine.Advance then ns.Engine.Advance() end
        return
    end
    if msg == "status" then
        local g = ns.Engine and ns.Engine.GetActiveGuide and ns.Engine.GetActiveGuide()
        if g then
            ns.Print(ns.L.STATUS_LINE:format(ns.Engine.NomGuide(g), ns.Engine.GetStepIndex(), #g.steps))
        else
            ns.Print(ns.L.NO_ACTIVE)
        end
        return
    end
    if msg == "state" then
        ns.Print((ns.Engine and ns.Engine.Describe and ns.Engine.Describe()) or ns.L.ENGINE_MISSING)
        return
    end
    if msg == "objs" then
        local step = ns.Engine.GetCurrentStep()
        ns.Print(ns.L.DBG_OBJ_LOADED:format(tostring(ns.questObjectives ~= nil)))
        if not step then ns.Print(ns.L.NO_STEP) return end
        for _, q in ipairs(step.quests or {}) do
            ns.Print(ns.L.DBG_QUEST:format(tostring(q.id), tostring(ns.Engine.QuestName(q)), tostring(ns.Engine.GetQuestStatus(q))))
            local objs = ns.Engine.GetObjectives(q)
            ns.Print(ns.L.DBG_OBJECTIVES:format(#objs))
            for _, o in ipairs(objs) do
                ns.Print(("   · text=%s  %s/%s"):format(tostring(o.text), tostring(o.numFulfilled), tostring(o.numRequired)))
            end
        end
        return
    end
    if msg == "quests" then
        local g = ns.Engine and ns.Engine.GetActiveGuide and ns.Engine.GetActiveGuide()
        if not g then ns.Print(ns.L.NO_ACTIVE) return end
        local step = g.steps[ns.Engine.GetStepIndex()]
        if not step then ns.Print(ns.L.STEP_MISSING) return end
        local lines = {}
        for i, q in ipairs(step.quests or {}) do
            lines[#lines + 1] = ("#%d %s « %s » [%s]"):format(i, ns.L["ACT_" .. tostring(q.kind)] or q.kind, ns.Engine.QuestName(q), ns.Engine.GetQuestStatus(q))
        end
        ns.Print(table.concat(lines, "\n"))
        return
    end
    if msg == "debug" then
        if ns.Engine then ns.Engine.debug = not ns.Engine.debug end
        ns.Print((ns.Engine and ns.Engine.debug) and ns.L.DEBUG_ON or ns.L.DEBUG_OFF)
        return
    end
    if msg == "fleche" or msg == "flèche" or msg == "arrow" then
        if ns.TomTomBridge then
            ns.TomTomBridge.Refresh()
            ns.Print(ns.TomTomBridge.Status())
        end
        return
    end
    if msg == "importer" or msg == "import" then
        if ns.Importer then ns.Importer.Importer() end
        return
    end
    if msg == "routes" then
        if ns.Importer then ns.Importer.Lister() end
        return
    end
    if msg:match("^restaurer ") or msg:match("^restore ") then
        if ns.Importer then ns.Importer.Restaurer(msg:match("^%S+%s+(.+)$") or "") end
        return
    end
    if msg:match("^supprimer ") or msg:match("^delete ") then
        if ns.Importer then ns.Importer.Supprimer(msg:match("^%S+%s+(.+)$") or "") end
        return
    end
    if msg == "mini" then
        if ns.Window and ns.Window.SetMini then ns.Window.SetMini(not ns.db.miniMode) end
        return
    end
    if msg == "route" or msg == "parcours" then
        if ns.Window and ns.Window.ToggleRoute then ns.Window.ToggleRoute() end
        return
    end
    if msg == "options" or msg == "reglages" or msg == "config" then
        if ns.Window and ns.Window.ToggleOptions then ns.Window.ToggleOptions() end
        return
    end
    if msg == "rec start" then
        if ns.Recorder then ns.Recorder.Start() end
        return
    end
    if msg == "rec stop" then
        if ns.Recorder then ns.Recorder.Stop() end
        return
    end
    if msg == "rec dump" then
        if ns.Recorder then ns.Recorder.Dump() end
        return
    end
    if msg == "rec clear" then
        if ns.Recorder then ns.Recorder.Clear() end
        return
    end

    if ns.Window and ns.Window.Toggle then
        ns.Window.Toggle()
    end
end

-- Bouton minimap (déplaçable) : afficher / masquer le guide
if Minimap then
    local mmBtn = CreateFrame("Button", "EternalRoutesMinimapButton", Minimap)
    mmBtn:SetSize(32, 32)
    mmBtn:SetFrameStrata("MEDIUM")
    mmBtn:SetMovable(true)
    mmBtn:RegisterForDrag("LeftButton")

    local dx, dy
    if ns.db and ns.db.mmX and ns.db.mmY then
        dx, dy = ns.db.mmX, ns.db.mmY
    else
        local r = (Minimap.GetWidth and Minimap:GetWidth() / 2 + 8) or 80
        local a = math.rad(225)
        dx, dy = math.cos(a) * r, math.sin(a) * r
    end
    mmBtn:SetPoint("CENTER", Minimap, "CENTER", dx, dy)

    local icon = mmBtn:CreateTexture(nil, "BACKGROUND")
    icon:SetTexture("Interface\\AddOns\\EternalRoutes\\Textures\\logo")
    icon:SetSize(20, 20)
    icon:SetPoint("CENTER")

    mmBtn:SetHighlightTexture("Interface\\Minimap\\UI-Minimap-ZoomButton-Highlight")

    mmBtn:SetScript("OnDragStart", function(self) self:StartMoving() end)
    mmBtn:SetScript("OnDragStop", function(self)
        self:StopMovingOrSizing()
        if ns.db then
            local cx, cy = self:GetCenter()
            local mx, my = Minimap:GetCenter()
            if cx and cy and mx and my then
                ns.db.mmX = cx - mx
                ns.db.mmY = cy - my
            end
        end
    end)
    mmBtn:SetScript("OnClick", function()
        if ns.Window and ns.Window.Toggle then ns.Window.Toggle() end
    end)
    mmBtn:SetScript("OnEnter", function(self)
        GameTooltip:SetOwner(self, "ANCHOR_LEFT")
        GameTooltip:AddLine("EternalRoutes")
        GameTooltip:AddLine(ns.L.MM_CLICK, 1, 1, 1)
        GameTooltip:AddLine(ns.L.MM_DRAG, 0.7, 0.7, 0.7)
        GameTooltip:Show()
    end)
    mmBtn:SetScript("OnLeave", function() GameTooltip:Hide() end)
end
