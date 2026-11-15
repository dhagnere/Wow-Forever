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
      photo       raison (niveau, zone, exploit, trajet)
      trajet      debut ou arrivee ou annule|nom du trajet|zone|carte|x|y (|durée en s à l'arrivée)
      vol choix   nom du point de vol choisi sur la carte des vols (avant « vol depart »)
      livre       objet|nom|vendeur|titre du vendeur|carte|x|y|niveau du joueur (grimoire ou livre acheté)

    « trainer » (EternalProbe.lua) porte en 7e champ le titre du PNJ : EternalRoutes en tire l'action
    affichée sous l'étape (choisir une capacité pour son démon ou son familier).

    Trajets (zeppelin, bateau) : /ep trajet <nom> au moment d'embarquer. L'arrivée est notée seule dès qu'on
    reste immobile 5 s dans une autre carte que celle du départ ; /ep trajet fin la note à la main,
    /ep trajet annule l'abandonne. Sans commande : le bouton « Trajet » (déplaçable, près de la minicarte) ou un
    raccourci clavier (Options > Raccourcis > EternalProbe) : clic gauche zeppelin, clic droit bateau, Maj + clic abandon ;
    /ep bouton le masque ou l'affiche. Un zeppelin ou un bateau qui change de continent est noté seul (0.11.5) :
    départ au quai où l'on a attendu, sans clic. Un trajet marche même sans enregistrement en cours, survit à un /reload,
    et devient dans EternalRoutes (0.14) une étape « voyage » au départ de l'embarcadère, validée à l'arrivée ;
    un vol (taxi, puis vol depart et arrivee) donne de même une étape au maître de vol.

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

-- ---- trajets (zeppelin, bateau) ------------------------------------------------

local trajet -- { nom, carte, zone, t, dernier, immobile }

local function TrajetFin(issue)
    if not trajet then P.Print("Aucun trajet en cours (/ep trajet <nom> au moment d'embarquer).") return end
    local zone, map, x, y = Ici()
    local duree = math.floor(GetTime() - trajet.t + 0.5)
    if issue == "annule" then
        Ev("trajet", "annule", trajet.nom, zone, map, x, y)
        P.Print(("Trajet « %s » abandonné."):format(trajet.nom))
    else
        Ev("trajet", "arrivee", trajet.nom, zone, map, x, y, duree)
        P.Print(("Trajet « %s » : arrivée à %s, après %d min %02d s."):format(trajet.nom, zone, math.floor(duree / 60), duree % 60))
        Photo("trajet")
    end
    trajet = nil
    P.DB().trajet = nil
    if P.MajBoutonTrajet then P.MajBoutonTrajet() end
end

local function TrajetDebut(nom, depart)
    if trajet then TrajetFin("annule") end
    local zone, map, x, y = Ici()
    if depart then zone, map, x, y = depart.zone, depart.map, depart.x, depart.y end
    if map == "nil" then P.Print("Position inconnue : impossible de noter le départ du trajet ici.") return end
    nom = (nom and nom ~= "") and nom or ("Trajet depuis " .. zone)
    trajet = { nom = nom, carte = map, zone = zone, t = GetTime(), immobile = 0 }
    P.DB().trajet = { nom = nom, carte = map, zone = zone, heure = time and time() or 0 }
    Ev("trajet", "debut", nom, zone, map, x, y)
    P.Print(("Trajet « %s » : départ de %s. L'arrivée sera notée seule (immobile dans une autre zone) ; /ep trajet fin pour la noter vous-même."):format(nom, zone))
end

--- Arrivée : immobile 5 s de suite dans une autre carte que celle du départ (en vol ou en mer, on bouge sans cesse).
local function SuivreTrajet()
    if not trajet then return end
    if GetTime() - trajet.t > 900 then TrajetFin("annule") return end
    local map, x, y = P.Position()
    if not (map and x and y and x > 0 and y > 0) or map == trajet.carte then trajet.immobile, trajet.dernier = 0, nil return end
    local d = trajet.dernier
    if d and d.map == map and math.abs(x - d.x) < 0.001 and math.abs(y - d.y) < 0.001 then
        trajet.immobile = trajet.immobile + 1
    else
        trajet.immobile = 0
    end
    trajet.dernier = { map = map, x = x, y = y }
    if trajet.immobile >= 5 then TrajetFin("arrivee") end
end

-- ---- trajets vus seuls : zeppelin ou bateau qui change de continent -----------------
-- Le quai est l'endroit où l'on est resté immobile au moins 8 s (l'attente du transport) ; un changement de
-- continent (écran de chargement en route) sans pierre de foyer ni mort, moins de 10 min après, ouvre le trajet
-- depuis ce quai ; l'arrivée se note ensuite comme pour un trajet noté à la main.
local quai, dernierePos, immobileQuai, continent, foyer = nil, nil, 0, nil, -999
local SORTS_FOYER = { [8690] = true, [556] = true } -- pierre de foyer, rappel astral

--- Zeppelin ou bateau, d'après le quai : les zeppelins de la Horde partent de Durotar, des Clairières de
--- Tirisfal et de Grom'gol (nord de Strangleronce) ; tout le reste est un bateau.
function P.ModeQuai(map, y)
    if map == 1411 or map == 1420 then return "Zeppelin" end
    if map == 1434 and y and y < 0.5 then return "Zeppelin" end
    return "Bateau"
end

local function SuivreQuai()
    local map, x, y = P.Position()
    if map and x and x > 0 then
        local d = dernierePos
        if d and d.map == map and math.abs(x - d.x) < 0.002 and math.abs(y - d.y) < 0.002 then
            immobileQuai = immobileQuai + 1
        else
            immobileQuai = 0
        end
        dernierePos = { map = map, x = x, y = y }
        if immobileQuai >= 8 and not (UnitOnTaxi and UnitOnTaxi("player")) then
            quai = { map = map, x = x, y = y, zone = GetZoneText and GetZoneText() or "?", t = GetTime() }
        end
    end
    local inst = UnitPosition and select(4, UnitPosition("player"))
    if inst == nil then return end
    if continent ~= nil and inst ~= continent then
        local mort = UnitIsDeadOrGhost and UnitIsDeadOrGhost("player")
        if not trajet and not mort and GetTime() - foyer > 60 and quai and GetTime() - quai.t < 600 and P.EnCours() then
            TrajetDebut(P.ModeQuai(quai.map, quai.y), quai)
        end
        quai = nil
    end
    continent = inst
end
P.SuivreQuai = SuivreQuai

--- Après un /reload : reprendre le trajet noté dans la sauvegarde, s'il a moins de 15 minutes.
local function ReprendreTrajet()
    local t = P.DB().trajet
    if not t or not time then return end
    local age = time() - (t.heure or 0)
    if age > 900 then P.DB().trajet = nil return end
    trajet = { nom = t.nom, carte = t.carte, zone = t.zone, t = GetTime() - age, immobile = 0 }
    P.Print(("Trajet « %s » repris après le rechargement."):format(t.nom))
end

-- ---- bouton « Trajet » (déplaçable) et raccourci clavier ------------------------
-- Pour enregistrer une vidéo sans taper de commande : un clic au moment d'embarquer, l'arrivée est notée seule.
-- Le nom reste générique (« Zeppelin », « Bateau ») : EternalRoutes en fait « Prendre le zeppelin pour <arrivée> ».

local boutonTrajet

local function MajBoutonTrajet()
    if not boutonTrajet then return end
    if trajet then boutonTrajet.icone:SetVertexColor(0.4, 1, 0.4) else boutonTrajet.icone:SetVertexColor(1, 1, 1) end
end
P.MajBoutonTrajet = MajBoutonTrajet

--- Clic gauche : départ en zeppelin, ou arrivée si un trajet est en cours ; clic droit : départ en bateau ;
--- Maj + clic : abandonner le trajet en cours.
function P.TrajetBouton(bouton)
    if IsShiftKeyDown and IsShiftKeyDown() then
        if trajet then TrajetFin("annule") end
    elseif trajet then
        TrajetFin("arrivee")
    else
        TrajetDebut(bouton == "RightButton" and "Bateau" or "Zeppelin")
    end
    MajBoutonTrajet()
end
-- raccourci clavier (Échap > Options > Raccourcis > EternalProbe)
function EternalProbe_Trajet() P.TrajetBouton("LeftButton") end
function EternalProbe_TrajetBateau() P.TrajetBouton("RightButton") end
BINDING_HEADER_ETERNALPROBE = "EternalProbe"
BINDING_NAME_ETERNALPROBE_TRAJET = "Trajet en zeppelin (ou arrivée)"
BINDING_NAME_ETERNALPROBE_TRAJETBATEAU = "Trajet en bateau (ou arrivée)"

local function PlacerBoutonTrajet()
    if not boutonTrajet then return end
    local pos = P.DB().boutonTrajet
    boutonTrajet:ClearAllPoints()
    if pos and pos.x and pos.y then
        boutonTrajet:SetPoint("CENTER", UIParent, "BOTTOMLEFT", pos.x, pos.y)
    elseif Minimap then
        boutonTrajet:SetPoint("TOPRIGHT", Minimap, "BOTTOMLEFT", 4, 4)
    else
        boutonTrajet:SetPoint("CENTER", UIParent, "CENTER", 0, 0)
    end
    if P.DB().boutonTrajetCache then boutonTrajet:Hide() else boutonTrajet:Show() end
end

if CreateFrame and UIParent then
    boutonTrajet = CreateFrame("Button", "EternalProbeTrajetButton", UIParent)
    boutonTrajet:SetSize(30, 30)
    boutonTrajet:SetFrameStrata("MEDIUM")
    boutonTrajet:SetMovable(true)
    boutonTrajet:SetClampedToScreen(true)
    boutonTrajet:RegisterForDrag("LeftButton")
    boutonTrajet:RegisterForClicks("LeftButtonUp", "RightButtonUp")
    local fond = boutonTrajet:CreateTexture(nil, "BACKGROUND")
    fond:SetTexture("Interface\\Minimap\\UI-Minimap-Background")
    fond:SetSize(26, 26)
    fond:SetPoint("CENTER")
    boutonTrajet.icone = boutonTrajet:CreateTexture(nil, "ARTWORK")
    boutonTrajet.icone:SetTexture("Interface\\Icons\\Ability_Hunter_Pathfinding")
    boutonTrajet.icone:SetSize(22, 22)
    boutonTrajet.icone:SetPoint("CENTER")
    local bord = boutonTrajet:CreateTexture(nil, "OVERLAY")
    bord:SetTexture("Interface\\Minimap\\MiniMap-TrackingBorder")
    bord:SetSize(52, 52)
    bord:SetPoint("TOPLEFT")
    boutonTrajet:SetHighlightTexture("Interface\\Minimap\\UI-Minimap-ZoomButton-Highlight")
    boutonTrajet:SetScript("OnDragStart", function(self) self:StartMoving() end)
    boutonTrajet:SetScript("OnDragStop", function(self)
        self:StopMovingOrSizing()
        local x, y = self:GetCenter()
        if x and y then P.DB().boutonTrajet = { x = x, y = y } end
    end)
    boutonTrajet:SetScript("OnClick", function(_, bouton) P.TrajetBouton(bouton) end)
    boutonTrajet:SetScript("OnEnter", function(self)
        if not GameTooltip then return end
        GameTooltip:SetOwner(self, "ANCHOR_LEFT")
        GameTooltip:AddLine("EternalProbe · Trajet")
        if trajet then
            GameTooltip:AddLine(("En cours : %s, depuis %s."):format(trajet.nom, trajet.zone), 0.4, 1, 0.4)
            GameTooltip:AddLine("L'arrivée sera notée seule. Clic : la noter maintenant.", 1, 1, 1)
            GameTooltip:AddLine("Maj + clic : abandonner.", 1, 1, 1)
        else
            GameTooltip:AddLine("Clic gauche en embarquant : zeppelin.", 1, 1, 1)
            GameTooltip:AddLine("Clic droit : bateau.", 1, 1, 1)
        end
        GameTooltip:AddLine("Glisser : déplacer · /ep bouton : masquer ou afficher", 0.7, 0.7, 0.7)
        GameTooltip:Show()
    end)
    boutonTrajet:SetScript("OnLeave", function() if GameTooltip then GameTooltip:Hide() end end)
end

function P.CommandeEnPlus(lower, raw)
    if lower == "bouton" then
        P.DB().boutonTrajetCache = not P.DB().boutonTrajetCache
        PlacerBoutonTrajet()
        P.Print(P.DB().boutonTrajetCache and "Bouton « Trajet » masqué (/ep bouton pour le remettre)." or "Bouton « Trajet » affiché.")
        return true
    end
    if lower == "trajet fin" then TrajetFin("arrivee") return true end
    if lower == "trajet annule" then TrajetFin("annule") return true end
    if lower == "trajet" or lower:match("^trajet%s") then
        TrajetDebut(tostring(raw or ""):match("^%S+%s+(.-)%s*$"))
        return true
    end
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

-- ---- grimoires et livres achetés -----------------------------------------------
-- Un démon apprend ses capacités par un grimoire acheté à l'entraîneur de démons : l'achat devient
-- une étape d'EternalRoutes (« choisissez une capacité pour votre démon »).

local function EstLivre(id, nom)
    if id and GetItemInfoInstant then
        local ok, _, _, _, _, _, classe, sousClasse = pcall(GetItemInfoInstant, id)
        if ok and classe then return classe == 9 and sousClasse == 0 end
    end
    nom = tostring(nom or "")
    return nom:find("^Grimoire") ~= nil or nom:find("^Livre") ~= nil or nom:find("^Book") ~= nil
end
P.EstLivre = EstLivre

local function NoterAchat(index)
    if not P.EnCours() then return end
    local lien = GetMerchantItemLink and GetMerchantItemLink(index)
    local id = ItemID(lien)
    local nom = GetMerchantItemInfo and GetMerchantItemInfo(index)
    if not EstLivre(id, nom) then return end
    local _, map, x, y = Ici()
    Ev("livre", id or 0, tostring(nom or ""):gsub("|", "/"), (UnitName("npc") or "?"), P.SousTitre and P.SousTitre("npc") or "",
        map, x, y, UnitLevel("player") or 0)
end
if BuyMerchantItem then hooksecurefunc("BuyMerchantItem", NoterAchat) end

-- ---- événements ---------------------------------------------------------------

local f = CreateFrame("Frame")
for _, ev in ipairs({
    "QUEST_ACCEPTED", "QUEST_COMPLETE", "QUEST_TURNED_IN",
    "TAXIMAP_OPENED", "UI_INFO_MESSAGE", "PLAYER_DEAD",
    "PLAYER_TARGET_CHANGED", "UPDATE_MOUSEOVER_UNIT", "UNIT_HEALTH",
    "PLAYER_LEVEL_UP", "ZONE_CHANGED_NEW_AREA", "PLAYER_LOGIN", "UNIT_SPELLCAST_SUCCEEDED",
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

-- destination choisie sur la carte des vols (nom du point d'arrivée), notée au départ du vol
if hooksecurefunc and TakeTaxiNode then
    hooksecurefunc("TakeTaxiNode", function(i)
        if not P.EnCours() or not TaxiNodeName then return end
        Ev("vol", "choix", TaxiNodeName(i) or "?")
    end)
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
    if event == "PLAYER_LOGIN" then ReprendreTrajet(); PlacerBoutonTrajet(); MajBoutonTrajet() return end
    if event == "UNIT_SPELLCAST_SUCCEEDED" then
        local unite, _, sort = ...
        if unite == "player" and SORTS_FOYER[sort] then foyer = GetTime() end
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
    SuivreTrajet()
    pcall(SuivreQuai)
    if not P.EnCours() or not UnitOnTaxi then return end
    local maintenant = UnitOnTaxi("player") and true or false
    if maintenant ~= enVol then
        enVol = maintenant
        local _, map, x, y = Ici()
        Ev("vol", maintenant and "depart" or "arrivee", map, x, y)
    end
end)
