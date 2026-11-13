--[[----------------------------------------------------------------------------
    EternalProbe — Captures.lua : ce que la deuxième génération enregistre en plus de RouteProbe.

    Tout passe par des événements nouveaux, au même format « heure|type|… » : EternalRoutes ignore
    ceux qu'il ne connaît pas, le site les lit à l'import.

      qniveau     qid|niveau de la quête|niveau du joueur|groupe conseillé (0 si aucun)
      recompense  qid|xp|argent (cuivre)|objets donnés « id×n;… »|objets au choix « id×n;… »
      choix       qid|objet choisi (id)
      gain        qid|xp|argent reçus au rendu
      taxi        point de vol où l'on est|carte|x|y|nombre de destinations connues
      fpnouveau   zone|carte|x|y (nouveau point de vol découvert)
      vol         depart ou arrivee|carte|x|y
      mort        zone|carte|x|y
      exploit     nom|classement (elite, rareelite, rare, worldboss)|carte|x|y
      photo       raison (niveau, zone, exploit, depart)

    Interdits du client : aucun événement ni fonction réservés à l'interface de Blizzard (le journal de
    combat, COMBAT_LOG_EVENT_UNFILTERED, fait bloquer l'addon par WoW Forever dès le chargement). Un élite
    vaincu se voit donc sur la cible : morte, classée élite ou rare, et pas prise par un autre joueur.

    Captures d'écran : le jeu les range dans Screenshots\ avec l'heure du PC dans le nom ; l'événement
    « photo », daté par les repères d'horloge, permet au site de retrouver la bonne image.
    /ep photos off les coupe, /ep photos on les remet.
------------------------------------------------------------------------------]]

local P = _G.EternalProbe
if not P or not P.AddEvent then return end

local function Ev(genre, ...)
    local morceaux = {}
    for i = 1, select("#", ...) do
        local v = select(i, ...)
        morceaux[i] = (type(v) == "number" and v % 1 ~= 0) and ("%.3f"):format(v) or tostring(v)
    end
    P.AddEvent(genre, table.concat(morceaux, "|"))
end

local function Ici()
    local map, x, y = P.Position()
    return GetZoneText and GetZoneText() or "?", map or "nil", x or 0, y or 0
end

local function ItemID(lien)
    return lien and tonumber(tostring(lien):match("|Hitem:(%d+)")) or nil
end

-- ---- captures d'écran ---------------------------------------------------------

local function PhotosActives()
    local db = P.DB()
    if db.photos == nil then db.photos = true end
    return db.photos
end

local dernierePhoto = 0
local chargement = GetTime() -- pas de photo dans les 15 s qui suivent un chargement ou un /reload
local function Photo(raison)
    if not P.EnCours() or not PhotosActives() or not Screenshot then return end
    if GetTime() - chargement < 15 then return end
    if GetTime() - dernierePhoto < 5 then return end -- pas de rafale
    dernierePhoto = GetTime()
    local function prendre()
        Screenshot()
        P.NoterHeure("photo")
        Ev("photo", raison)
    end
    if C_Timer and C_Timer.After then C_Timer.After(1, prendre) else prendre() end
end
P.Photo = Photo

function P.CommandeEnPlus(lower)
    if lower == "photos off" then
        P.DB().photos = false
        P.Print("Captures d'écran automatiques : coupées.")
        return true
    elseif lower == "photos on" or lower == "photos" then
        P.DB().photos = true
        P.Print("Captures d'écran automatiques : actives (niveau, nouvelle zone, élite vaincu).")
        return true
    end
    return false
end

-- ---- monstres d'élite : classement vu sur la cible ou au survol ------------------

local classements, nbClassements = {}, 0
local function RetenirClassement(unite)
    if not UnitExists or not UnitExists(unite) or UnitIsPlayer(unite) then return end
    local c = UnitClassification and UnitClassification(unite)
    if c == "elite" or c == "rareelite" or c == "rare" or c == "worldboss" then
        local guid = UnitGUID(unite)
        if guid and not classements[guid] then
            if nbClassements > 500 then classements, nbClassements = {}, 0 end
            classements[guid] = c
            nbClassements = nbClassements + 1
        end
    end
end

-- ---- événements ---------------------------------------------------------------

local f = CreateFrame("Frame")
for _, ev in ipairs({
    "QUEST_ACCEPTED", "QUEST_COMPLETE", "QUEST_TURNED_IN",
    "TAXIMAP_OPENED", "UI_INFO_MESSAGE", "PLAYER_DEAD",
    "PLAYER_TARGET_CHANGED", "UPDATE_MOUSEOVER_UNIT", "UNIT_HEALTH",
    "PLAYER_LEVEL_UP", "ZONE_CHANGED_NEW_AREA",
}) do
    pcall(f.RegisterEvent, f, ev)
end

local function NiveauQuete(qid)
    if not (C_QuestLog and C_QuestLog.GetLogIndexForQuestID and C_QuestLog.GetInfo) then return end
    local i = C_QuestLog.GetLogIndexForQuestID(qid)
    local info = i and C_QuestLog.GetInfo(i)
    if info then
        Ev("qniveau", qid, info.level or 0, UnitLevel("player"), info.suggestedGroup or 0)
    end
end

local function Recompenses()
    local qid = GetQuestID and GetQuestID() or 0
    local function liste(genre, n)
        local t = {}
        for i = 1, n or 0 do
            local id = ItemID(GetQuestItemLink and GetQuestItemLink(genre, i))
            local _, _, nombre = GetQuestItemInfo(genre, i)
            if id then t[#t + 1] = ("%d×%d"):format(id, nombre or 1) end
        end
        return table.concat(t, ";")
    end
    Ev("recompense", qid, GetRewardXP and GetRewardXP() or 0, GetRewardMoney and GetRewardMoney() or 0,
        liste("reward", GetNumQuestRewards and GetNumQuestRewards()), liste("choice", GetNumQuestChoices and GetNumQuestChoices()))
end

-- l'objet choisi parmi les récompenses
if hooksecurefunc and GetQuestReward then
    hooksecurefunc("GetQuestReward", function(choix)
        if not P.EnCours() or not choix or choix < 1 then return end
        local qid = GetQuestID and GetQuestID() or 0
        Ev("choix", qid, ItemID(GetQuestItemLink and GetQuestItemLink("choice", choix)) or 0)
    end)
end

local function PointDeVol()
    local courant, connus = "?", 0
    for i = 1, (NumTaxiNodes and NumTaxiNodes() or 0) do
        local genre = TaxiNodeGetType(i)
        if genre == "CURRENT" then courant = TaxiNodeName(i) or "?" end
        if genre == "REACHABLE" then connus = connus + 1 end
    end
    local _, map, x, y = Ici()
    Ev("taxi", courant, map, x, y, connus)
end

--- Élite ou rare vaincu : la cible est morte, on connaissait son classement, et elle n'était pas à un autre joueur.
local function VerifierCible()
    if not P.EnCours() or not UnitExists("target") or not UnitIsDead or not UnitIsDead("target") then return end
    local guid = UnitGUID("target")
    local c = guid and classements[guid]
    if not c then return end
    classements[guid] = nil
    if UnitIsTapDenied and UnitIsTapDenied("target") then return end
    local _, map, x, y = Ici()
    Ev("exploit", UnitName("target") or "?", c, map, x, y)
    Photo("exploit")
end

f:SetScript("OnEvent", function(_, event, ...)
    if event == "UPDATE_MOUSEOVER_UNIT" then RetenirClassement("mouseover") return end
    if event == "PLAYER_TARGET_CHANGED" then RetenirClassement("target"); VerifierCible() return end
    if event == "UNIT_HEALTH" then
        if (...) == "target" then VerifierCible() end
        return
    end
    if not P.EnCours() then return end

    if event == "QUEST_ACCEPTED" then
        local qid = ...
        -- le journal n'est à jour qu'un instant après l'acceptation
        if C_Timer and C_Timer.After then C_Timer.After(0.5, function() NiveauQuete(qid) end) else NiveauQuete(qid) end

    elseif event == "QUEST_COMPLETE" then
        Recompenses()

    elseif event == "QUEST_TURNED_IN" then
        local qid, xp, argent = ...
        Ev("gain", qid or 0, xp or 0, argent or 0)

    elseif event == "TAXIMAP_OPENED" then
        PointDeVol()

    elseif event == "UI_INFO_MESSAGE" then
        local _, message = ...
        if ERR_NEWTAXIPATH and message == ERR_NEWTAXIPATH then
            Ev("fpnouveau", Ici())
        end

    elseif event == "PLAYER_DEAD" then
        Ev("mort", Ici())

    elseif event == "PLAYER_LEVEL_UP" then
        Photo("niveau")

    elseif event == "ZONE_CHANGED_NEW_AREA" then
        local db = P.DB()
        local _, map = Ici()
        db.zonesVues = db.zonesVues or {}
        if map ~= "nil" and not db.zonesVues[tostring(map)] then
            db.zonesVues[tostring(map)] = true
            Photo("zone")
        end
    end
end)

-- vols : départ et arrivée, vus toutes les secondes
local enVol, attente = false, 0
f:SetScript("OnUpdate", function(_, dt)
    attente = attente + dt
    if attente < 1 then return end
    attente = 0
    if not P.EnCours() or not UnitOnTaxi then return end
    local maintenant = UnitOnTaxi("player") and true or false
    if maintenant ~= enVol then
        enVol = maintenant
        local _, map, x, y = Ici()
        Ev("vol", maintenant and "depart" or "arrivee", map, x, y)
    end
end)
