--[[----------------------------------------------------------------------------
    EternalProbe — sonde d'enregistrement de parcours, deuxième génération.
    Remplace RouteProbe (désactiver RouteProbe quand EternalProbe est installé).
    Sauvegarde propre : EternalProbeDB, avec un numéro de format (FORMAT) pour que le site
    et EternalRoutes reconnaissent ses enregistrements, comme ceux de l'ancienne sonde.

    But : capturer une session de jeu (contexte race/classe/carte, quêtes,
    objectifs lus dans le jeu, PNJ, positions) pour construire ensuite la
    logique Lua des parcours.

      /ep start       démarre l'enregistrement (capture le contexte)
      /ep stop        arrête
      /ep context     affiche le contexte (race, classe, carte, zone)
      /ep dump        résumé : contexte + quêtes apprises + compteurs
      /ep clear       efface l'enregistrement
      /ep mark <txt>  ajoute un marqueur (fin de phase, note…)
    Entraîneurs : la visite (nom, position, métier ou non) et les sorts appris
    sont enregistrés ; EternalRoutes en fait une étape « entraîneur ».

    Vidéo : à chaque /ep start, un rappel invite à lancer l'enregistrement manuel
    de Warcraft Recorder, et l'heure du PC est notée (début, fin, marqueurs) pour
    caler la vidéo sur la route. Un addon ne peut pas lancer la vidéo lui-même.

      /ep suite       fin de la zone de départ : arrête, importe dans
                      EternalRoutes, puis enregistre la partie commune

    Zone de départ : la sonde la connaît d'après la race. Quand le joueur la
    quitte pendant l'enregistrement (hors capitales et instances), un bandeau
    rouge lui dit de passer à la partie commune de sa faction.

    Les compteurs d'objectifs sont LUS via C_QuestLog.GetQuestObjectives
    (numFulfilled / numRequired) — on ne compte rien soi-même.

    Objets à collecter : chaque progression d'un objectif est notée avec l'heure et la position
    (« obj ») ; chaque objet de quête ramassé l'est aussi, avec ce qui l'a donné : objet du décor
    (coffre, plante, caisse…) ou monstre, par son nom et son identifiant (« loot »), ou reçu sans
    fenêtre de butin (« recu »). EternalRoutes en fait l'étape « faire » et la ligne « sur : … ».
------------------------------------------------------------------------------]]

local ADDON = "EternalProbe"
local P = {}
_G.EternalProbe = P

local recording = false
local MAX_EVENTS = 60000
local updateIcon

-- ---- helpers ----------------------------------------------------------------

local FORMAT = 2 -- 1 : RouteProbe ; 2 : EternalProbe (mêmes événements, table propre)
P.FORMAT = FORMAT

local function DB()
    if type(EternalProbeDB) ~= "table" then EternalProbeDB = {} end
    EternalProbeDB.format = FORMAT
    EternalProbeDB.sonde = ADDON
    EternalProbeDB.quests = EternalProbeDB.quests or {}
    EternalProbeDB.events = EternalProbeDB.events or {}
    EternalProbeDB.targets = EternalProbeDB.targets or {}
    EternalProbeDB.context = EternalProbeDB.context or {}
    return EternalProbeDB
end

local function Print(msg)
    local text = tostring(msg)
    for line in (text .. "\n"):gmatch("(.-)\n") do
        DEFAULT_CHAT_FRAME:AddMessage(("|cff33ccff%s|r: %s"):format(ADDON, line))
    end
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

-- Lit les compteurs de jeu (mobs tués / objets collectés)
local function QuestObjectives(questID, logIndex)
    local out = {}
    if not questID then return out end
    if C_QuestLog and C_QuestLog.GetQuestObjectives then
        local objs = C_QuestLog.GetQuestObjectives(questID)
        if objs then
            for oi, o in ipairs(objs) do
                local t = o.text or ""
                local itemID
                if logIndex and GetQuestLogLeaderBoard then
                    local ok, lt = pcall(GetQuestLogLeaderBoard, oi, logIndex)
                    if ok and lt then
                        itemID = tonumber(lt:match("|Hitem:(%d+)"))
                    end
                end
                if not itemID then
                    itemID = tonumber(t:match("|Hitem:(%d+)"))
                end
                out[#out + 1] = {
                    text = t,
                    name = t:match("^(.-)%s*:"),
                    itemID = itemID,
                    kind = o.type or "?",
                    fulfilled = o.numFulfilled or 0,
                    required = o.numRequired or 0,
                    finished = o.finished and true or false,
                }
            end
        end
    end
    return out
end

local function FormatObjectives(objs)
    local parts = {}
    for _, o in ipairs(objs or {}) do
        parts[#parts + 1] = ("%s %s/%s"):format(tostring(o.text), tostring(o.fulfilled), tostring(o.required))
    end
    return table.concat(parts, " ; ")
end

local function CurrentPos()
    local map
    if C_Map and C_Map.GetBestMapForUnit then
        map = C_Map.GetBestMapForUnit("player")
    end
    local x, y
    if map and C_Map and C_Map.GetPlayerMapPosition then
        local pos = C_Map.GetPlayerMapPosition(map, "player")
        if pos then
            x, y = pos:GetXY()
        end
    end
    return map, x, y
end

-- Position d'une unité (cible : PNJ/mob) sur la carte courante
local function UnitMapPos(unit)
    local map
    if C_Map and C_Map.GetBestMapForUnit then
        map = C_Map.GetBestMapForUnit("player")
    end
    if not map or not C_Map.GetPlayerMapPosition then return nil end
    local pos = C_Map.GetPlayerMapPosition(map, unit)
    if pos then
        local x, y = pos:GetXY()
        if x and y and x > 0 and y > 0 then
            return map, x, y
        end
    end
    return nil
end

local function CaptureContext()
    local className, classFile, classID = UnitClass("player")
    local raceName, raceFile, raceID = UnitRace("player")
    local map = CurrentPos()
    local mapName
    if map and C_Map and C_Map.GetMapInfo then
        local info = C_Map.GetMapInfo(map)
        mapName = info and info.name
    end
    return {
        className = className, classFile = classFile, classID = classID,
        raceName = raceName, raceFile = raceFile, raceID = raceID,
        faction = UnitFactionGroup("player"),
        level = UnitLevel("player"),
        map = map, mapName = mapName,
        zone = GetZoneText(),
        capturedAt = GetTime(),
    }
end

local function AddEvent(ev, detail)
    local db = DB()
    db.events[#db.events + 1] = ("%.1f|%s|%s"):format(GetTime(), ev, tostring(detail))
    if #db.events > MAX_EVENTS then
        table.remove(db.events, 1)
    end
end

local function LearnQuest(questID, name)
    if not questID then return nil end
    local db = DB()
    local key = tostring(questID)
    local rec = db.quests[key]
    if not rec then
        rec = { id = questID, name = name, firstSeen = GetTime() }
        db.quests[key] = rec
    end
    if name and name ~= "" then
        rec.name = name
    end
    return rec
end

-- ---- zone de départ ---------------------------------------------------------

-- Zone de départ de chaque race, niveau où elle s'achève, races qui la partagent.
local ZONES_DEPART = {
    [1429] = { nom = "Forêt d'Elwynn",         fin = 10, races = "Humain",          faction = "Alliance" },
    [1426] = { nom = "Dun Morogh",             fin = 10, races = "Nain, Gnome",     faction = "Alliance" },
    [1438] = { nom = "Teldrassil",             fin = 11, races = "Elfe de la nuit", faction = "Alliance" },
    [1411] = { nom = "Durotar",                fin = 14, races = "Orc, Troll",      faction = "Horde" },
    [1420] = { nom = "Clairières de Tirisfal", fin = 12, races = "Mort-vivant",     faction = "Horde" },
    [1412] = { nom = "Mulgore",                fin = 10, races = "Tauren",          faction = "Horde" },
    [2521] = { nom = "Île de Zéphras",         fin = 10, races = "Skyborne",        faction = nil },
}
local CARTE_DE_LA_RACE = {
    Human = 1429, Dwarf = 1426, Gnome = 1426, NightElf = 1438,
    Orc = 1411, Troll = 1411, Scourge = 1420, Tauren = 1412,
}
-- Lieux visités pendant la zone de départ sans la quitter vraiment :
-- capitales (maîtres de classe) et Reflet-de-Lune (druides).
local SANS_ALERTE = { [1453] = true, [1454] = true, [1455] = true, [1456] = true,
    [1457] = true, [1458] = true, [1450] = true }
local NIVEAU_MIN_ALERTE = 8   -- en dessous, une sortie est un détour : simple rappel dans la discussion

local alerteFaite, alerteNiveau = false, false
local bandeau

--- Carte de la zone de départ du personnage (d'après sa race, sinon Zéphras s'il y a commencé).
local function CarteDepart()
    local _, race = UnitRace("player")
    if race and CARTE_DE_LA_RACE[race] then return CARTE_DE_LA_RACE[race] end
    local db = DB()
    if db.carteDepart then return db.carteDepart end
    local map = CurrentPos()
    if map == 2521 then return 2521 end
    return nil
end

--- La carte est-elle la zone cible ou l'un de ses sous-lieux ?
local function DansCarte(map, cible)
    for _ = 1, 6 do
        if not map or map == 0 then return false end
        if map == cible then return true end
        local info = C_Map and C_Map.GetMapInfo and C_Map.GetMapInfo(map)
        map = info and info.parentMapID
    end
    return false
end

local function NomCarte(map)
    local info = map and C_Map and C_Map.GetMapInfo and C_Map.GetMapInfo(map)
    return (info and info.name) or GetZoneText() or "?"
end

local function QuiSuisJe()
    local classe = UnitClass("player")
    local race = UnitRace("player")
    return ("%s %s"):format(tostring(classe or "?"), tostring(race or "?"))
end

local function Bandeau()
    if bandeau then return bandeau end
    local f = CreateFrame("Frame", "EternalProbeBandeau", UIParent, "BackdropTemplate")
    f:SetSize(620, 118)
    f:SetPoint("TOP", UIParent, "TOP", 0, -120)
    f:SetFrameStrata("HIGH")
    if f.SetBackdrop then
        f:SetBackdrop({ bgFile = "Interface\\Tooltips\\UI-Tooltip-Background",
            edgeFile = "Interface\\Tooltips\\UI-Tooltip-Border", edgeSize = 16,
            insets = { left = 4, right = 4, top = 4, bottom = 4 } })
        f:SetBackdropColor(0.12, 0, 0, 0.92)
        f:SetBackdropBorderColor(1, 0.15, 0.15, 1)
    end
    f:SetMovable(true)
    f:EnableMouse(true)
    f:RegisterForDrag("LeftButton")
    f:SetScript("OnDragStart", function(self) self:StartMoving() end)
    f:SetScript("OnDragStop", function(self) self:StopMovingOrSizing() end)

    f.titre = f:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
    f.titre:SetPoint("TOP", f, "TOP", 0, -12)
    f.titre:SetWidth(590)
    f.titre:SetTextColor(1, 0.2, 0.2)
    if f.titre.GetFont and f.titre.SetFont then
        local police = f.titre:GetFont()
        if police then f.titre:SetFont(police, 20, "OUTLINE") end
    end

    f.texte = f:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    f.texte:SetPoint("TOP", f.titre, "BOTTOM", 0, -6)
    f.texte:SetWidth(590)
    f.texte:SetTextColor(1, 0.55, 0.55)

    f.suite = CreateFrame("Button", nil, f, "UIPanelButtonTemplate")
    f.suite:SetSize(190, 22)
    f.suite:SetPoint("BOTTOM", f, "BOTTOM", -50, 10)
    f.suite:SetText("Partie commune")
    f.suite:SetScript("OnClick", function() P.Suite() end)

    f.fermer = CreateFrame("Button", nil, f, "UIPanelButtonTemplate")
    f.fermer:SetSize(90, 22)
    f.fermer:SetPoint("LEFT", f.suite, "RIGHT", 10, 0)
    f.fermer:SetText("Plus tard")
    f.fermer:SetScript("OnClick", function() f:Hide() end)

    f:Hide()
    bandeau = f
    return f
end

local function Alerter(titre, texte, avecBouton)
    local f = Bandeau()
    f.titre:SetText(titre)
    f.texte:SetText(texte)
    f.suite:SetShown(avecBouton and true or false)
    f:Show()
    if RaidNotice_AddMessage and RaidWarningFrame then
        RaidNotice_AddMessage(RaidWarningFrame, titre, { r = 1, g = 0.2, b = 0.2 })
    end
    if PlaySound then PlaySound(SOUNDKIT and SOUNDKIT.RAID_WARNING or 8959) end
    DEFAULT_CHAT_FRAME:AddMessage("|cffff3333" .. titre .. "|r")
    for ligne in (texte .. "\n"):gmatch("(.-)\n") do
        if ligne ~= "" then DEFAULT_CHAT_FRAME:AddMessage("|cffff7777" .. ligne .. "|r") end
    end
end

local function AvecImport()
    return _G.EternalRoutes and _G.EternalRoutes.Importer and true or false
end

local function Consigne()
    if AvecImport() then
        return "Bouton « Partie commune » ou /ep suite : arrêt, import dans EternalRoutes, nouvel enregistrement."
    end
    return "/ep stop, puis /reload pour sauvegarder. EternalRoutes n'est pas chargé : l'import se fera plus tard."
end

--- Vérifie, après un changement de zone ou de niveau, si la zone de départ est terminée.
local function VerifierDepart(raison)
    if not recording then return end
    local db = DB()
    if db.partie ~= "depart" then return end
    local cible = CarteDepart()
    local zone = cible and ZONES_DEPART[cible]
    if not zone then return end
    local map = CurrentPos()
    local niveau = UnitLevel("player") or 1
    local faction = zone.faction or UnitFactionGroup("player") or "?"

    if raison == "niveau" then
        if not alerteNiveau and niveau >= zone.fin and DansCarte(map, cible) then
            alerteNiveau = true
            Alerter(("Niveau %d : fin de la zone de départ (%s)"):format(niveau, zone.nom),
                ("%s : la zone de départ s'achève vers le niveau %d.\nRendez les quêtes en cours ici. Dès que vous quitterez %s, enregistrez la partie commune %s."):format(
                    QuiSuisJe(), zone.fin, zone.nom, faction), false)
        end
        return
    end

    if not map then return end
    if IsInInstance and IsInInstance() then return end
    if DansCarte(map, cible) then
        -- retour dans la zone de départ : la partie de départ continue
        if alerteFaite then
            alerteFaite = false
            if bandeau then bandeau:Hide() end
            Print("Retour dans " .. zone.nom .. " : l'enregistrement de la zone de départ continue.")
        end
        return
    end
    if SANS_ALERTE[map] or alerteFaite then return end

    if niveau < NIVEAU_MIN_ALERTE then
        Print(("Vous sortez de %s au niveau %d : si c'est un détour, continuez. La zone de départ s'achève vers le niveau %d."):format(
            zone.nom, niveau, zone.fin))
        return
    end
    alerteFaite = true
    AddEvent("mark", "fin-zone-depart")
    Alerter(("Zone de départ terminée — %s"):format(QuiSuisJe()),
        ("Vous quittez %s pour %s, au niveau %d. La route de départ (%s) est complète.\nEnregistrez maintenant la partie commune %s.\n%s"):format(
            zone.nom, NomCarte(map), niveau, zone.races, faction, Consigne()), AvecImport())
end

local function VerifierPlusTard(raison)
    if C_Timer and C_Timer.After then
        C_Timer.After(1, function() VerifierDepart(raison) end)
    else
        VerifierDepart(raison)
    end
end

-- Relevé des quêtes en cours + de leurs compteurs d'objectifs
local function SnapshotLog()
    local db = DB()
    local n = 0
    if C_QuestLog and C_QuestLog.GetNumQuestLogEntries then
        n = C_QuestLog.GetNumQuestLogEntries() or 0
    end
    for i = 1, n do
        local info = C_QuestLog and C_QuestLog.GetInfo and C_QuestLog.GetInfo(i)
        if info and not info.isHeader and info.questID then
            local rec = LearnQuest(info.questID, info.title)
            local objs = QuestObjectives(info.questID, i)
            if #objs > 0 then
                -- progression d'un objectif : où et quand (monstre vaincu, objet ramassé, objet du décor utilisé)
                local avant = rec.objectives or {}
                for oi, o in ipairs(objs) do
                    local prec = avant[oi]
                    -- (pas au premier relevé : des objets déjà dans les sacs à la prise ne sont pas une collecte)
                    if prec and o.required > 0 and o.fulfilled > (prec.fulfilled or 0) then
                        local map, x, y = CurrentPos()
                        AddEvent("obj", ("%s|%d|%d|%d|%s|%s|%s|%s|%s"):format(tostring(info.questID), oi, o.fulfilled, o.required,
                            tostring(o.kind), tostring(map), x and ("%.3f"):format(x) or "nil", y and ("%.3f"):format(y) or "nil",
                            tostring(o.name or o.text or ""):gsub("|", "/")))
                    end
                end
                rec.objectives = objs
            end
        end
    end
end

-- ---- un enregistrement par personnage --------------------------------------

local function Personnage()
    local nom = UnitName("player") or "?"
    local royaume = GetRealmName and GetRealmName() or ""
    return (royaume ~= "") and (nom .. "-" .. royaume) or nom
end

local CHAMPS = { "events", "quests", "targets", "context", "horloges", "partie", "carteDepart", "enCours", "departGarde" }

--- La sauvegarde est commune au compte : l'enregistrement d'un autre personnage est mis de côté,
--- et celui du personnage connecté lui est rendu. Renvoie le nom du personnage mis de côté, s'il y en a un.
local function SonEnregistrement()
    local db = DB()
    local moi = Personnage()
    if db.personnage == moi then return nil end
    db.archives = db.archives or {}
    -- ancienne sauvegarde sans propriétaire : gardée si elle correspond à la classe et à la race du personnage
    if not db.personnage and #db.events > 0 then
        local _, classe = UnitClass("player")
        local _, race = UnitRace("player")
        local c = db.context or {}
        if (c.classFile == nil or c.classFile == classe) and (c.raceFile == nil or c.raceFile == race) then
            db.personnage = moi
            return nil
        end
        db.personnage = ("%s %s (ancien)"):format(tostring(c.raceFile), tostring(c.classFile))
    end
    local ancien
    if db.personnage and #db.events > 0 then
        local a = {}
        for _, k in ipairs(CHAMPS) do a[k] = db[k] end
        db.archives[db.personnage] = a
        ancien = db.personnage
    end
    local mien = db.archives[moi]
    db.archives[moi] = nil
    for _, k in ipairs(CHAMPS) do db[k] = mien and mien[k] or nil end
    db.personnage = moi
    DB()
    return ancien
end

local function AnnoncerEchange(ancien)
    if not ancien then return end
    Print(("Enregistrement de %s mis de côté : il lui sera rendu à sa prochaine connexion (/ep archives)."):format(ancien))
    Print(("Enregistrement de ce personnage : %d événements."):format(#DB().events))
end

-- ---- heure du PC (pour caler la vidéo) -------------------------------------

local function HeurePC()
    return (date and date("%Y-%m-%d %H:%M:%S")) or "?"
end

local function HeureCourte(h)
    return tostring(h):match("(%d+:%d+:%d+)$") or tostring(h)
end

--- Note l'heure du PC dans l'enregistrement, avec l'heure du jeu qui date les autres événements.
local function NoterHeure(quoi)
    local db = DB()
    local h = HeurePC()
    db.horloges = db.horloges or {}
    db.horloges[#db.horloges + 1] = { quoi = quoi, heure = h, t = GetTime(), niveau = UnitLevel("player") }
    AddEvent("clock", ("%s|%s"):format(quoi, h))
    return h
end

--- Heure du PC correspondant à un instant du jeu (d'après le dernier repère noté avant lui).
function P.HeureDe(t)
    local repere
    for _, r in ipairs(DB().horloges or {}) do
        if r.t <= t then repere = r end
    end
    if not repere or not time then return nil end
    local a, mo, j, hh, mi, ss = tostring(repere.heure):match("(%d+)-(%d+)-(%d+) (%d+):(%d+):(%d+)")
    if not a then return nil end
    local base = time({ year = tonumber(a), month = tonumber(mo), day = tonumber(j), hour = tonumber(hh), min = tonumber(mi), sec = tonumber(ss) })
    return date("%H:%M:%S", base + math.floor(t - repere.t + 0.5))
end

local function RappelVideo()
    local texte = "Vidéo : lancez l'enregistrement manuel de Warcraft Recorder pour cette partie."
    if RaidNotice_AddMessage and RaidWarningFrame then
        RaidNotice_AddMessage(RaidWarningFrame, texte, { r = 1, g = 0.6, b = 0.2 })
    end
    DEFAULT_CHAT_FRAME:AddMessage("|cffff9933" .. texte .. "|r")
end

-- ---- sorts appris chez l'entraîneur ----------------------------------------

local dejaAppris = {}
local function NoterSort(id)
    id = tonumber(id)
    if not id or dejaAppris[id] then return end
    dejaAppris[id] = true
    local nom = GetSpellInfo and GetSpellInfo(id)
    local rang = GetSpellSubtext and GetSpellSubtext(id)
    if nom and rang and rang ~= "" then nom = nom .. " (" .. rang .. ")" end
    local texte = tostring(nom or ("Sort " .. id)):gsub("|", "/")
    AddEvent("learn", ("%d|%s"):format(id, texte))
end

-- ---- événements -------------------------------------------------------------

local frame = CreateFrame("Frame")
P._frame = frame
for _, ev in ipairs({
    "PLAYER_LOGIN", "PLAYER_ENTERING_WORLD", "ZONE_CHANGED_NEW_AREA",
    "QUEST_LOG_UPDATE", "QUEST_ACCEPTED", "QUEST_TURNED_IN", "QUEST_WATCH_UPDATE",
    "GOSSIP_SHOW", "GOSSIP_CLOSED", "QUEST_GREETING", "QUEST_DETAIL",
    "QUEST_PROGRESS", "QUEST_COMPLETE", "QUEST_FINISHED",
    "PLAYER_TARGET_CHANGED", "PLAYER_LEVEL_UP",
    "TRAINER_SHOW", "TRAINER_CLOSED", "LEARNED_SPELL_IN_TAB", "CHAT_MSG_SYSTEM",
    "LOOT_OPENED", "LOOT_CLOSED", "CHAT_MSG_LOOT",
}) do
    -- un événement inconnu du client ne doit pas empêcher le chargement
    pcall(frame.RegisterEvent, frame, ev)
end

-- ---- objets de quête ramassés ---------------------------------------------------

--- Objets attendus par les quêtes du journal (identifiant et nom), d'après les objectifs relevés.
local function ObjetsAttendus()
    local ids, noms = {}, {}
    for _, rec in pairs(DB().quests) do
        for _, o in ipairs(rec.objectives or {}) do
            if o.itemID then ids[o.itemID] = true end
            if o.kind == "item" and o.name then noms[o.name] = true end
        end
    end
    return ids, noms
end

--- Objet de quête : attendu par un objectif, ou de la catégorie « Quête » du jeu (classe 12).
local function ObjetDeQuete(itemID, nom)
    local ids, noms = ObjetsAttendus()
    if (itemID and ids[itemID]) or (nom and noms[nom]) then return true end
    if itemID and GetItemInfoInstant then
        local ok, _, _, _, _, _, classe = pcall(GetItemInfoInstant, itemID)
        if ok and classe == 12 then return true end
    end
    return false
end

--- Source d'un objet du butin : « objet » (décor : coffre, plante…) ou « monstre », son identifiant et son nom.
local function SourceButin(slot)
    if not GetLootSourceInfo then return "?", "", "" end
    local guid = GetLootSourceInfo(slot)
    if not guid then return "?", "", "" end
    -- « GameObject-0-serveur-instance-zone-identifiant-apparition » : le sixième champ est l'identifiant
    local champs = {}
    for c in (tostring(guid) .. "-"):gmatch("(.-)%-") do champs[#champs + 1] = c end
    local genre, id = champs[1], champs[6]
    local nom = ""
    -- le nom de l'objet du décor est celui de l'info-bulle affichée au clic ; celui du monstre, la cible
    if genre == "GameObject" and GameTooltip and GameTooltip:IsShown() and GameTooltipTextLeft1 then
        nom = GameTooltipTextLeft1:GetText() or ""
    elseif genre == "Creature" or genre == "Vehicle" then
        nom = UnitName("target") or UnitName("mouseover") or ""
    end
    return (genre == "GameObject" and "objet") or ((genre == "Creature" or genre == "Vehicle") and "monstre") or tostring(genre),
        tostring(id or ""), tostring(nom):gsub("|", "/")
end

local finButin = 0

local function NoterButin()
    local map, x, y = CurrentPos()
    local px, py = x and ("%.3f"):format(x) or "nil", y and ("%.3f"):format(y) or "nil"
    for slot = 1, (GetNumLootItems and GetNumLootItems() or 0) do
        local lien = GetLootSlotLink and GetLootSlotLink(slot)
        local itemID = lien and tonumber(tostring(lien):match("|Hitem:(%d+)"))
        local _, nom, quantite = GetLootSlotInfo(slot)
        if itemID and ObjetDeQuete(itemID, nom) then
            local genre, id, source = SourceButin(slot)
            AddEvent("loot", ("%d|%d|%s|%s|%s|%s|%s|%s|%s"):format(itemID, tonumber(quantite) or 1, genre, id,
                tostring(map), px, py, tostring(nom or ""):gsub("|", "/"), source))
        end
    end
end

--- « Vous recevez l'objet : … » sans fenêtre de butin (objet donné en utilisant le décor, ou par un PNJ).
local function PrefixeButin(modele)
    return modele and (modele:match("^(.-)%%s")) or nil
end

local function NoterRecu(msg)
    if GetTime() - finButin < 2 then return end   -- déjà noté par la fenêtre de butin
    msg = tostring(msg or "")
    local moi = false
    for _, cle in ipairs({ "LOOT_ITEM_SELF", "LOOT_ITEM_SELF_MULTIPLE", "LOOT_ITEM_PUSHED_SELF", "LOOT_ITEM_PUSHED_SELF_MULTIPLE" }) do
        local p = PrefixeButin(_G[cle])
        if p and p ~= "" and msg:sub(1, #p) == p then moi = true end
    end
    if not moi then return end
    local itemID = tonumber(msg:match("|Hitem:(%d+)"))
    local nom = msg:match("|h%[(.-)%]|h")
    local quantite = tonumber(msg:match("|rx(%d+)")) or tonumber(msg:match("x(%d+)%.?%s*$")) or 1
    if itemID and ObjetDeQuete(itemID, nom) then
        local map, x, y = CurrentPos()
        AddEvent("recu", ("%d|%d|%s|%s|%s|%s"):format(itemID, quantite, tostring(map),
            x and ("%.3f"):format(x) or "nil", y and ("%.3f"):format(y) or "nil", tostring(nom or ""):gsub("|", "/")))
    end
end

P.ObjetDeQuete, P.NoterButin, P.NoterRecu = ObjetDeQuete, NoterButin, NoterRecu

--- Titre d'un PNJ, lu sur la 2e ligne de sa bulle (« <Entraîneur de démons> »), ou "" si aucun.
local bulle
function P.SousTitre(unite)
    local ok, texte = pcall(function()
        if not (UnitExists and UnitExists(unite)) then return "" end
        bulle = bulle or CreateFrame("GameTooltip", "EternalProbeBulle", nil, "GameTooltipTemplate")
        bulle:SetOwner(WorldFrame or UIParent, "ANCHOR_NONE")
        bulle:SetUnit(unite)
        local ligne = _G["EternalProbeBulleTextLeft2"]
        local t = ligne and ligne:GetText() or ""
        bulle:Hide()
        return t
    end)
    texte = ok and tostring(texte or "") or ""
    -- la 2e ligne d'un PNJ sans titre donne son niveau : rien à garder
    if texte:find("%d") and (texte:find(LEVEL or "Niveau", 1, true) or texte:find("Niveau", 1, true) or texte:find("Level", 1, true)) then
        return ""
    end
    return (texte:gsub("[<>]", ""):gsub("|", "/"))
end

frame:SetScript("OnEvent", function(_, event, ...)
    if event == "PLAYER_LOGIN" then
        local ancien = SonEnregistrement()
        -- un enregistrement en cours reprend après /reload ou une reconnexion
        if DB().enCours then
            recording = true
            NoterHeure("reprise")
            if updateIcon then updateIcon() end
        end
        if recording then
            DB().context = CaptureContext()
        end
        local charge = (C_AddOns and C_AddOns.IsAddOnLoaded or IsAddOnLoaded)
        if charge and charge("RouteProbe") then
            Print("|cffff5555RouteProbe est encore activé|r : EternalProbe le remplace. Décochez RouteProbe dans la liste des AddOns, puis /reload.")
        end
        Print("EternalProbe prêt · commandes : /ep start | stop | dump | context | clear | suite | mark <texte> | reload")
        Print("Enregistrer puis /reload (ou /ep reload) pour sauvegarder dans les SavedVariables.")
        AnnoncerEchange(ancien)
        if recording then
            Print(("Enregistrement repris après le rechargement (%d événements gardés). /ep stop pour l'arrêter."):format(#DB().events))
            RappelVideo()
        end
        return
    end

    if not recording then return end

    if event == "QUEST_ACCEPTED" then
        local q = ...
        local name = QuestTitleByID(q)
        LearnQuest(q, name)
        AddEvent("accept", ("%s|%s"):format(tostring(q), tostring(name)))

    elseif event == "QUEST_TURNED_IN" then
        local q = ...
        local name = QuestTitleByID(q)
        LearnQuest(q, name)
        AddEvent("turnin", ("%s|%s"):format(tostring(q), tostring(name)))

    elseif event == "QUEST_LOG_UPDATE" or event == "QUEST_WATCH_UPDATE" then
        SnapshotLog()
        AddEvent("log", "snapshot")

    elseif event == "GOSSIP_SHOW" or event == "QUEST_GREETING" then
        local npc = UnitName("target") or "?"
        AddEvent("gossip", npc)
        if C_GossipInfo then
            if C_GossipInfo.GetAvailableQuests then
                for _, qi in ipairs(C_GossipInfo.GetAvailableQuests()) do
                    LearnQuest(qi.questID, qi.title)
                    AddEvent("available", ("%s|%s|%s"):format(tostring(qi.questID), tostring(qi.title), npc))
                end
            end
            if C_GossipInfo.GetActiveQuests then
                for _, qi in ipairs(C_GossipInfo.GetActiveQuests()) do
                    LearnQuest(qi.questID, qi.title)
                    AddEvent("active", ("%s|%s|%s"):format(tostring(qi.questID), tostring(qi.title), npc))
                end
            end
        end

    elseif event == "QUEST_DETAIL" then
        local q = GetQuestID and GetQuestID()
        local name = QuestTitleByID(q)
        LearnQuest(q, name)
        AddEvent("detail", ("%s|%s"):format(tostring(q), tostring(name)))

    elseif event == "GOSSIP_CLOSED" or event == "QUEST_FINISHED" then
        AddEvent(event, "")

    elseif event == "PLAYER_TARGET_CHANGED" then
        local name = UnitName("target")
        if name then
            DB().targets[name] = DB().targets[name] or tostring(UnitGUID("target"))
            local map, x, y = UnitMapPos("target")
            if map and x and y then
                AddEvent("targetpos", ("%s|%s|%.3f|%.3f"):format(name, tostring(map), x, y))
            else
                AddEvent("target", name)
            end
        end

    elseif event == "ZONE_CHANGED_NEW_AREA" or event == "PLAYER_ENTERING_WORLD" then
        DB().context = CaptureContext()
        local map, x, y = CurrentPos()
        AddEvent("zone", ("%s|%s|%s|%s"):format(tostring(GetZoneText()), tostring(map), tostring(x), tostring(y)))
        VerifierPlusTard("zone")

    elseif event == "TRAINER_SHOW" then
        local npc = UnitName("npc") or UnitName("target") or "?"
        local metier = IsTradeskillTrainer and IsTradeskillTrainer() and 1 or 0
        local map, x, y = CurrentPos()
        -- 7e champ : titre du PNJ (« Entraîneur de démons », « Dresseur de familiers »…), pour l'action affichée
        AddEvent("trainer", ("%s|%d|%s|%s|%s|%s|%s"):format(npc, metier, tostring(map),
            x and ("%.3f"):format(x) or "nil", y and ("%.3f"):format(y) or "nil", tostring(UnitLevel("player")),
            P.SousTitre("npc")))
        dejaAppris = {}

    elseif event == "TRAINER_CLOSED" then
        AddEvent("trainerclose", "")

    elseif event == "LEARNED_SPELL_IN_TAB" then
        NoterSort((...))

    elseif event == "CHAT_MSG_SYSTEM" then
        -- « Vous avez appris un nouveau sort : [Horion de terre] » : le lien porte l'identifiant
        local msg = ...
        local id = msg and tonumber(tostring(msg):match("|Hspell:(%d+)"))
        if id then NoterSort(id) end

    elseif event == "LOOT_OPENED" then
        finButin = GetTime()
        NoterButin()

    elseif event == "LOOT_CLOSED" then
        finButin = GetTime()

    elseif event == "CHAT_MSG_LOOT" then
        NoterRecu((...))

    elseif event == "PLAYER_LEVEL_UP" then
        AddEvent("level", tostring(UnitLevel("player")))
        VerifierPlusTard("niveau")
    end
end)

-- échantillonnage de position : toutes les 1 s, uniquement si le joueur bouge
local elapsed = 0
local lastMap, lastX, lastY
frame:SetScript("OnUpdate", function(_, dt)
    if not recording then return end
    elapsed = elapsed + dt
    if elapsed < 1 then return end
    elapsed = 0
    local map, x, y = CurrentPos()
    if not (map and x and y) then return end
    if lastMap == map and lastX and math.abs(x - lastX) < 0.002 and math.abs(y - lastY) < 0.002 then
        return
    end
    lastMap, lastX, lastY = map, x, y
    AddEvent("pos", ("%s|%.3f|%.3f"):format(tostring(map), x, y))
end)

-- ---- API publique -----------------------------------------------------------

-- Outils partagés avec Captures.lua (nouvelles captures d'EternalProbe), qui ajoute ses propres événements.
P.AddEvent = AddEvent
P.Position = CurrentPos
P.PositionUnite = UnitMapPos
P.NoterHeure = NoterHeure
P.DB = DB
P.Print = Print
function P.EnCours() return recording end

function P.Start()
    AnnoncerEchange(SonEnregistrement())
    recording = true
    local db = DB()
    db.enCours = true
    db.context = CaptureContext()
    local c = db.context
    Print(("Enregistrement démarré · %s %s · %s · niv %s · %s (%s)"):format(
        tostring(c.raceFile or "?"), tostring(c.classFile or "?"), tostring(c.faction or "?"),
        tostring(c.level or "?"), tostring(c.zone or "?"), tostring(c.map or "?")))
    -- vidéo : rappel et heure du PC, pour caler l'enregistrement de Warcraft Recorder
    local h = NoterHeure("debut")
    RappelVideo()
    Print(("Heure du PC au départ : %s. Elle est gardée avec l'enregistrement (/ep context)."):format(h))
    -- la partie se décide au premier départ : zone de départ ou partie commune
    if c.map == 2521 and not db.carteDepart then db.carteDepart = 2521 end
    if not db.partie then
        local cible = CarteDepart()
        db.partie = (cible and DansCarte(c.map, cible)) and "depart" or "commune"
    end
    local cible = CarteDepart()
    local zone = cible and ZONES_DEPART[cible]
    if db.partie == "depart" and zone then
        Print(("Partie enregistrée : zone de départ (%s, %s, jusqu'au niveau %d environ). Un bandeau rouge vous dira quand passer à la partie commune."):format(
            zone.nom, zone.races, zone.fin))
    else
        Print(("Partie enregistrée : partie commune %s."):format(tostring(c.faction or "?")))
    end
    if updateIcon then updateIcon() end
end

--- Fin de la zone de départ : arrête, importe la route de départ, enregistre la partie commune.
function P.Suite()
    if bandeau then bandeau:Hide() end
    if recording then P.Stop() end
    local er = _G.EternalRoutes
    if not (er and er.Importer and er.Importer.Importer) then
        Print("EternalRoutes n'est pas chargé : l'enregistrement est gardé. /reload pour le sauvegarder, l'import se fera plus tard.")
        return
    end
    local route = er.Importer.Importer()
    if type(route) ~= "table" then
        Print("Import non confirmé : l'enregistrement est gardé. Vérifiez /er routes, puis /ep clear et /ep start.")
        return
    end
    -- la zone de départ reste exportable (/ep export depart) : la partie commune repart d'un enregistrement vide
    local db = DB()
    local garde = { events = db.events, quests = db.quests, context = db.context, partie = db.partie,
        carteDepart = db.carteDepart, personnage = db.personnage }
    P.Clear()
    DB().departGarde = garde
    DB().partie = "commune"
    P.Start()
    Print("Zone de départ gardée : /ep export depart donne son code pour le site, à tout moment.")
end

function P.Stop()
    local db = DB()
    if recording then
        local h = NoterHeure("fin")
        Print(("Heure du PC à l'arrêt : %s. Arrêtez aussi la vidéo dans Warcraft Recorder."):format(h))
    end
    recording = false
    db.enCours = nil
    Print(("Enregistrement arrêté : %d quêtes, %d événements."):format(Count(db.quests), #db.events))
    if _G.EternalRoutes and _G.EternalRoutes.Importer then
        Print("Tapez /er importer pour en faire une route dans EternalRoutes (ou /ep suite à la fin de la zone de départ).")
    end
    if updateIcon then updateIcon() end
end

function P.Clear()
    -- efface l'enregistrement de ce personnage seulement (les autres restent de côté)
    local db = DB()
    for _, k in ipairs(CHAMPS) do db[k] = nil end
    db.personnage = Personnage()
    DB()
    alerteFaite, alerteNiveau = false, false
    if bandeau then bandeau:Hide() end
    Print("Enregistrement effacé.")
end

function P.Context()
    local c = DB().context or {}
    local _, classe = UnitClass("player")
    Print(("En ce moment : niveau %s · %s · %s"):format(tostring(UnitLevel("player")), tostring(GetZoneText()),
        recording and "enregistrement EN COURS" or "enregistrement à l'arrêt (/ep start pour reprendre)"))
    Print("Au départ de l'enregistrement :")
    Print(("Classe : %s (%s) · Race : %s (%s) · Faction : %s"):format(
        tostring(c.className or "?"), tostring(c.classFile or "?"),
        tostring(c.raceName or "?"), tostring(c.raceFile or "?"), tostring(c.faction or "?")))
    Print(("Niveau : %s · Carte : %s (%s) · Zone : %s"):format(
        tostring(c.level or "?"), tostring(c.mapName or "?"), tostring(c.map or "?"), tostring(c.zone or "?")))
    local reperes = DB().horloges or {}
    if #reperes > 0 then
        local noms = { debut = "début", fin = "fin", marqueur = "marqueur", reprise = "reprise" }
        local parts = {}
        for _, r in ipairs(reperes) do
            parts[#parts + 1] = ("%s %s (niv %s)"):format(noms[r.quoi] or r.quoi, HeureCourte(r.heure), tostring(r.niveau or "?"))
        end
        Print(("Heures du PC (vidéo) : %s · le %s"):format(table.concat(parts, " · "), tostring(reperes[1].heure):match("^(%S+)") or "?"))
    end
    local cible = CarteDepart()
    local zone = cible and ZONES_DEPART[cible]
    if zone then
        Print(("Zone de départ : %s (%s), jusqu'au niveau %d environ · partie enregistrée : %s"):format(
            zone.nom, zone.races, zone.fin,
            DB().partie == "depart" and "zone de départ" or DB().partie == "commune" and "partie commune" or "pas encore commencée"))
    end
end

P.ZONES_DEPART = ZONES_DEPART
P.VerifierDepart = VerifierDepart

function P.Dump()
    local db = DB()
    local c = db.context or {}
    Print(("Contexte : %s %s · %s · niv %s · %s (%s)"):format(
        tostring(c.raceFile or "?"), tostring(c.classFile or "?"), tostring(c.faction or "?"),
        tostring(c.level or "?"), tostring(c.zone or "?"), tostring(c.map or "?")))
    Print(("Quêtes apprises : %d · événements : %d"):format(Count(db.quests), #db.events))
    local ramasses, progres = {}, 0
    for _, ligne in ipairs(db.events) do
        local k, a, b = tostring(ligne):match("^[^|]*|([^|]*)|([^|]*)|([^|]*)")
        if k == "obj" then progres = progres + 1 end
        if k == "loot" or k == "recu" then
            local nom = tostring(ligne):match(k == "loot" and "^[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|([^|]*)" or "^[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|([^|]*)")
            nom = (nom and nom ~= "") and nom or ("objet " .. tostring(a))
            ramasses[nom] = (ramasses[nom] or 0) + (tonumber(b) or 1)
        end
    end
    local liste = {}
    for nom, n in pairs(ramasses) do liste[#liste + 1] = ("%s ×%d"):format(nom, n) end
    table.sort(liste)
    Print(("Progrès d'objectifs notés : %d · objets de quête ramassés : %s"):format(progres, #liste > 0 and table.concat(liste, ", ") or "aucun"))

    local keys = {}
    for k in pairs(db.quests) do keys[#keys + 1] = k end
    table.sort(keys)

    local max = 80
    for i = 1, math.min(#keys, max) do
        local rec = db.quests[keys[i]]
        local line = ("%s = %s"):format(tostring(rec.id), tostring(rec.name))
        if rec.objectives and #rec.objectives > 0 then
            line = line .. " [" .. FormatObjectives(rec.objectives) .. "]"
        end
        Print(line)
    end
    if #keys > max then
        Print(("… (%d autres quêtes)"):format(#keys - max))
    end
end

-- ---- commandes --------------------------------------------------------------

SLASH_ETERNALPROBE1 = "/ep"
SLASH_ETERNALPROBE2 = "/eternalprobe"
SlashCmdList.ETERNALPROBE = function(msg)
    local raw = (msg or ""):match("^%s*(.-)%s*$") or ""
    local lower = raw:lower()

    if lower:match("^mark%s+") then
        local text = raw:sub(6)
        AddEvent("mark", text)
        local h = NoterHeure("marqueur")
        Print(("Marqueur à %s : %s"):format(HeureCourte(h), text))
        return
    end

    if lower == "start" then P.Start(); return end
    if lower == "stop" then P.Stop(); return end
    if lower == "dump" then P.Dump(); return end
    if lower == "clear" then P.Clear(); return end
    if lower == "context" then P.Context(); return end
    if lower == "reload" then ReloadUI(); return end
    if lower == "suite" or lower == "commune" then P.Suite(); return end
    if lower == "archives" then
        local n = 0
        for nom, a in pairs(DB().archives or {}) do
            n = n + 1
            Print(("%s : %d événements mis de côté."):format(nom, #(a.events or {})))
        end
        if n == 0 then Print("Aucun enregistrement d'un autre personnage mis de côté.") end
        return
    end

    if P.CommandeEnPlus and P.CommandeEnPlus(lower, raw) then return end
    Print("Commandes : /ep start | stop | dump | context | clear | suite | archives | mark <texte> | trajet <nom> | trajet fin | export | export depart | photos on|off")
end

-- Bouton minimap (déplaçable) : démarrer / arrêter l'enregistrement
if Minimap then
    local mmBtn = CreateFrame("Button", "EternalProbeMinimapButton", Minimap)
    mmBtn:SetSize(32, 32)
    mmBtn:SetFrameStrata("MEDIUM")
    mmBtn:SetMovable(true)
    mmBtn:RegisterForDrag("LeftButton")

    local db = DB()
    local dx, dy
    if db.mmX and db.mmY then
        dx, dy = db.mmX, db.mmY
    else
        local r = (Minimap.GetWidth and Minimap:GetWidth() / 2 + 8) or 80
        local a = math.rad(200)
        dx, dy = math.cos(a) * r, math.sin(a) * r
    end
    mmBtn:SetPoint("CENTER", Minimap, "CENTER", dx, dy)

    local icon = mmBtn:CreateTexture(nil, "BACKGROUND")
    icon:SetTexture("Interface\\Icons\\INV_Misc_Note_01")
    icon:SetSize(20, 20)
    icon:SetPoint("CENTER")

    mmBtn:SetHighlightTexture("Interface\\Minimap\\UI-Minimap-ZoomButton-Highlight")

    updateIcon = function()
        if recording then
            icon:SetVertexColor(1, 0.35, 0.35)
        else
            icon:SetVertexColor(1, 1, 1)
        end
    end
    updateIcon()

    mmBtn:SetScript("OnDragStart", function(self) self:StartMoving() end)
    mmBtn:SetScript("OnDragStop", function(self)
        self:StopMovingOrSizing()
        local d = DB()
        local cx, cy = self:GetCenter()
        local mx, my = Minimap:GetCenter()
        if cx and cy and mx and my then
            d.mmX = cx - mx
            d.mmY = cy - my
        end
    end)
    mmBtn:SetScript("OnClick", function()
        if recording then P.Stop() else P.Start() end
    end)
    mmBtn:SetScript("OnEnter", function(self)
        GameTooltip:SetOwner(self, "ANCHOR_LEFT")
        GameTooltip:AddLine("EternalProbe")
        GameTooltip:AddLine(recording and "Enregistrement EN COURS — clic pour arrêter"
            or "Clic pour démarrer l'enregistrement", 1, 1, 1)
        GameTooltip:AddLine("Glisser : déplacer", 0.7, 0.7, 0.7)
        GameTooltip:Show()
    end)
    mmBtn:SetScript("OnLeave", function() GameTooltip:Hide() end)
end
