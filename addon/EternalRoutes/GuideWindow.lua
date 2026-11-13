--[[----------------------------------------------------------------------------
    EternalRoutes — GuideWindow.lua
    Interface du guide, d'après la maquette « EternalRoutes – proposition
    d'interface » :
      1. fenêtre principale : lieu de l'étape, flèche, quêtes et objectifs,
         navigation, étapes suivantes ;
      2. mode réduit : une ligne (quête en cours, objectif, distance) ;
      3. vue du parcours : zones et étapes, clic pour consulter une étape ;
      4. réglages : flèche, étapes suivantes, mode réduit, taille, langue.

    API attendue par le reste de l'addon (inchangée) :
      Window.Refresh(), Window.Toggle(), Window.OnLogin(),
      Window.OnLanguageChanged()
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local L = ns.L

local Window = {}
ns.Window = Window

-- ---------------------------------------------------------------------------
-- Constantes
-- ---------------------------------------------------------------------------

local TEX        = "Interface\\AddOns\\EternalRoutes\\Textures\\"
local BLANC      = "Interface\\Buttons\\WHITE8x8"
local POLICE     = "Fonts\\FRIZQT__.TTF"
local POLICE_TITRE = "Fonts\\MORPHEUS.TTF"
local FLECHE     = "Interface\\Minimap\\MinimapArrow"
local ICONE_CARTE = "Interface\\Icons\\INV_Misc_Map_01"
-- icônes de quête du jeu : « ! » jaune (quête à accepter), « ? » jaune (quête à rendre)
local ICONE_QUETE = {
    prendre = "Interface\\GossipFrame\\AvailableQuestIcon",
    rendre  = "Interface\\GossipFrame\\ActiveQuestIcon",
    entrainer = "Interface\\GossipFrame\\TrainerGossipIcon",
}

local LARGEUR    = 380   -- fenêtre principale
local H_ENTETE   = 62
local H_GUIDE    = 50
local H_PIED     = 28
local MARGE      = 12
local SUR_PLACE  = 12    -- mètres : badge « sur place »
local NB_SUITE   = 2     -- étapes affichées sous « Ensuite »

local C = {
    fond       = { 0.090, 0.075, 0.059 },
    entete     = { 0.122, 0.098, 0.075 },
    carte      = { 0.129, 0.102, 0.075 },
    carteHaut  = { 0.165, 0.129, 0.086 },
    bord       = { 0.369, 0.290, 0.165 },
    bordClair  = { 0.478, 0.384, 0.200 },
    trait      = { 0.227, 0.180, 0.125 },
    traitDoux  = { 0.165, 0.133, 0.098 },
    or_        = { 0.890, 0.761, 0.478 },
    orFonce    = { 0.722, 0.525, 0.169 },
    orBord     = { 0.788, 0.635, 0.290 },
    orSurvol   = { 0.800, 0.600, 0.220 },
    clair      = { 0.953, 0.914, 0.839 },
    texte      = { 0.937, 0.902, 0.831 },
    pale       = { 0.659, 0.596, 0.494 },
    sourd      = { 0.549, 0.486, 0.388 },
    objectif   = { 0.725, 0.667, 0.565 },
    vert       = { 0.435, 0.682, 0.525 },
    vertClair  = { 0.561, 0.812, 0.624 },
    bleu       = { 0.498, 0.698, 0.851 },
    bouton     = { 0.141, 0.114, 0.086 },
    boutonTexte = { 0.796, 0.722, 0.604 },
    sombre     = { 0.102, 0.071, 0.039 },
    survol     = { 0.200, 0.157, 0.102 },
}

local COULEUR_ACTION = { prendre = C.or_, rendre = C.vert, faire = C.bleu, entrainer = { 0.780, 0.639, 0.902 } }

-- États d'une quête dans la fenêtre : à prendre (neutre), acceptée en cours (orangé), objectifs remplis (vert),
-- rendue (repliée, barrée). La couleur n'est jamais seule : pictogramme et badge écrit l'accompagnent.
local ETATS = {
    prendre = { fond = { 0.165, 0.129, 0.090 }, bord = { 0.541, 0.427, 0.208 }, texte = { 0.890, 0.761, 0.478 } },
    cours   = { fond = { 0.235, 0.141, 0.055 }, bord = { 0.851, 0.549, 0.200 }, texte = { 1.000, 0.725, 0.380 } },
    pret    = { fond = { 0.090, 0.188, 0.133 }, bord = { 0.310, 0.624, 0.420 }, texte = { 0.561, 0.816, 0.624 } },
    rendue  = { fond = { 0.102, 0.086, 0.071 }, bord = { 0.227, 0.180, 0.125 }, texte = { 0.549, 0.486, 0.388 } },
}
local MAX_JOURNAL = 20   -- quêtes au plus dans le journal du jeu

local function EtatVisuel(q, etat)
    if not q then return "prendre" end
    if etat == "done" then return "rendue" end
    if q.kind == "entrainer" then return "prendre" end
    if etat == "complete" then return "pret" end
    if etat == "in_progress" then return "cours" end
    return "prendre"
end

local function BadgeEtat(q, ev)
    if ev == "pret" then return q.kind == "rendre" and L.BADGE_TO_TURNIN or L.BADGE_DONE_OBJ end
    if ev == "cours" then return q.kind == "prendre" and L.BADGE_ACCEPTED or L.BADGE_IN_PROGRESS end
    if q.kind == "entrainer" then return L.BADGE_TO_VISIT end
    if q.kind == "prendre" then return L.BADGE_TO_TAKE end
    return L.BADGE_NOT_TAKEN
end

-- ---------------------------------------------------------------------------
-- Outils d'habillage
-- ---------------------------------------------------------------------------

local function Teinte(obj, c, a)
    obj:SetTextColor(c[1], c[2], c[3], a or 1)
end

local function Fond(f, fond, bord, alpha)
    f:SetBackdrop({ bgFile = BLANC, edgeFile = BLANC, edgeSize = 1 })
    f:SetBackdropColor(fond[1], fond[2], fond[3], alpha or 1)
    if bord then
        f:SetBackdropBorderColor(bord[1], bord[2], bord[3], 1)
    else
        f:SetBackdropBorderColor(0, 0, 0, 0)
    end
end

local function Texte(parent, taille, couleur, police)
    local fs = parent:CreateFontString(nil, "OVERLAY")
    fs:SetFont(police or POLICE, taille, "")
    fs:SetShadowOffset(1, -1)
    fs:SetShadowColor(0, 0, 0, 0.8)
    fs:SetJustifyH("LEFT")
    fs:SetJustifyV("TOP")
    if couleur then Teinte(fs, couleur) end
    return fs
end

local function Trait(parent, c)
    local t = parent:CreateTexture(nil, "ARTWORK")
    t:SetColorTexture(c[1], c[2], c[3], 1)
    t:SetHeight(1)
    return t
end

-- libellés qui changent avec la langue
local libelles = {}
local function Libelle(fs, cle, ...)
    libelles[#libelles + 1] = { fs = fs, cle = cle, args = { ... } }
    fs:SetText(L[cle] and L[cle]:format(...) or cle)
    return fs
end

local function Aide(self)
    if not self.aideCle or not L[self.aideCle] then return end
    GameTooltip:SetOwner(self, "ANCHOR_TOP")
    GameTooltip:SetText(L[self.aideCle], 1, 1, 1)
    GameTooltip:Show()
end

-- bouton plat : secondaire (sombre) ou principal (or)
local function Bouton(parent, w, h, texte, principal, icone)
    local b = CreateFrame("Button", nil, parent, "BackdropTemplate")
    b:SetSize(w, h)
    Fond(b, principal and C.orFonce or C.bouton, principal and C.orBord or C.trait)

    if icone then
        local t = b:CreateTexture(nil, "ARTWORK")
        local s = math.min(w, h) - 8
        t:SetSize(s, s)
        t:SetPoint("CENTER")
        t:SetTexture(icone)
        if icone:find("Interface\\Icons\\", 1, true) then
            t:SetTexCoord(0.08, 0.92, 0.08, 0.92)
        end
        b.icone = t
    end

    local fs = b:CreateFontString(nil, "OVERLAY")
    fs:SetFont(POLICE, principal and 12 or 11, "")
    fs:SetPoint("CENTER")
    if principal then
        Teinte(fs, C.sombre)
    else
        Teinte(fs, C.boutonTexte)
        fs:SetShadowOffset(1, -1)
        fs:SetShadowColor(0, 0, 0, 0.8)
    end
    if texte then fs:SetText(texte) end
    b.texte = fs

    b:SetScript("OnEnter", function(self)
        if principal then
            self:SetBackdropColor(C.orSurvol[1], C.orSurvol[2], C.orSurvol[3], 1)
        else
            self:SetBackdropBorderColor(C.or_[1], C.or_[2], C.or_[3], 1)
        end
        Aide(self)
    end)
    b:SetScript("OnLeave", function(self)
        if principal then
            self:SetBackdropColor(C.orFonce[1], C.orFonce[2], C.orFonce[3], 1)
        else
            self:SetBackdropBorderColor(C.trait[1], C.trait[2], C.trait[3], 1)
        end
        GameTooltip:Hide()
    end)
    b:SetScript("OnMouseDown", function(self) self.texte:SetPoint("CENTER", 1, -1) end)
    b:SetScript("OnMouseUp", function(self) self.texte:SetPoint("CENTER", 0, 0) end)
    return b
end

-- fenêtre déplaçable, position gardée par personnage (coin haut gauche)
local function Deplacable(f, cle)
    f:SetMovable(true)
    f:EnableMouse(true)
    f:RegisterForDrag("LeftButton")
    f:SetClampedToScreen(true)
    f:SetScript("OnDragStart", function(self) self:StartMoving() end)
    f:SetScript("OnDragStop", function(self)
        self:StopMovingOrSizing()
        if ns.db then
            ns.db[cle .. "L"] = self:GetLeft()
            ns.db[cle .. "H"] = self:GetTop()
        end
        self:ClearAllPoints()
        self:SetPoint("TOPLEFT", UIParent, "BOTTOMLEFT", ns.db[cle .. "L"] or 0, ns.db[cle .. "H"] or 0)
    end)
end

local function Placer(f, cle, point, x, y)
    f:ClearAllPoints()
    local l, h = ns.db and ns.db[cle .. "L"], ns.db and ns.db[cle .. "H"]
    if l and h then
        f:SetPoint("TOPLEFT", UIParent, "BOTTOMLEFT", l, h)
    else
        f:SetPoint(point, UIParent, point, x, y)
    end
end

-- en-tête commun : logo, titre, sous-titre, bouton fermer
local function EnTete(parent, taille, hauteur)
    local e = CreateFrame("Frame", nil, parent, "BackdropTemplate")
    e:SetPoint("TOPLEFT", 1, -1)
    e:SetPoint("TOPRIGHT", -1, -1)
    e:SetHeight(hauteur)
    Fond(e, C.entete)
    local t = Trait(e, C.trait)
    t:SetPoint("BOTTOMLEFT")
    t:SetPoint("BOTTOMRIGHT")

    local logo = e:CreateTexture(nil, "ARTWORK")
    logo:SetTexture(TEX .. "logo")
    logo:SetSize(taille, taille)
    logo:SetPoint("LEFT", 10, 0)

    local titre = Texte(e, 17, C.or_, POLICE_TITRE)
    titre:SetPoint("BOTTOMLEFT", logo, "RIGHT", 10, 1)

    local sous = Texte(e, 10, C.pale)
    sous:SetPoint("TOPLEFT", logo, "RIGHT", 10, -3)

    local fermer = Bouton(e, 24, 24, "x")
    fermer:SetPoint("RIGHT", -10, 0)
    fermer.aideCle = "CLOSE"
    fermer:SetScript("OnClick", function() parent:Hide() end)

    return { cadre = e, logo = logo, titre = titre, sous = sous, fermer = fermer }
end

-- case à cocher dessinée avec les icônes de l'addon
local function Case(parent, cle, lire, ecrire)
    local b = CreateFrame("Button", nil, parent)
    b:SetHeight(22)
    local ic = b:CreateTexture(nil, "ARTWORK")
    ic:SetSize(18, 18)
    ic:SetPoint("LEFT")
    local fs = Texte(b, 12, C.texte)
    fs:SetPoint("LEFT", ic, "RIGHT", 8, 0)
    fs:SetPoint("RIGHT")
    fs:SetJustifyV("MIDDLE")
    function b.Maj()
        ic:SetTexture(TEX .. (lire() and "check_full" or "check_outline"))
        fs:SetText(L[cle] or cle)
    end
    b:SetScript("OnClick", function()
        ecrire(not lire())
        b.Maj()
    end)
    b:SetScript("OnEnter", function() Teinte(fs, C.or_) end)
    b:SetScript("OnLeave", function() Teinte(fs, C.texte) end)
    b.Maj()
    return b
end

-- ---------------------------------------------------------------------------
-- Données affichées
-- ---------------------------------------------------------------------------

local function Nombre(v)
    local s = ("%.1f"):format(v or 0)
    if not (ns.IsEnglish and ns.IsEnglish()) then
        s = (s:gsub("%.", ","))
    end
    return s
end

local function NettoyerObjectif(t)
    local s = tostring(t or ""):gsub("|4[^;]*;", "")
    s = s:gsub("%s*:%s*%d+%s*/%s*%d+.*$", "")
    return s
end

local function Action(q)
    return L["ACT_" .. tostring(q.kind)] or tostring(q.kind)
end

-- zones du guide, dans l'ordre de passage (une zone revisitée compte à nouveau)
local cacheZones = {}
local function ZonesDu(guide)
    local c = cacheZones[guide.id]
    if c and c.n == #guide.steps then return c end
    c = { liste = {}, index = {}, n = #guide.steps }
    for i, s in ipairs(guide.steps) do
        local nom = s.zone or "?"
        local z = c.liste[#c.liste]
        if not z or z.cle ~= nom then
            z = { cle = nom, premiere = s, etapes = {} }
            c.liste[#c.liste + 1] = z
        end
        z.etapes[#z.etapes + 1] = i
        c.index[i] = #c.liste
    end
    cacheZones[guide.id] = c
    return c
end

local function ResumeEtape(s)
    local quetes = ns.Engine.QuetesApplicables and ns.Engine.QuetesApplicables(s) or (s.quests or {})
    local q = quetes[1]
    local quoi
    if q then
        quoi = Action(q) .. " " .. ns.Engine.QuestName(q)
        if #quetes > 1 then quoi = quoi .. (" +%d"):format(#quetes - 1) end
    else
        quoi = tostring(s.text or "")
    end
    local ou = ns.Engine.NomLieu(s) or ns.Engine.NomZone(s)
    return ou and (ou .. " · " .. quoi) or quoi
end

local function LieuEtape(s)
    local lieu = ns.Engine.NomLieu(s)
    if lieu and lieu ~= "" then return lieu end
    return L.OBJECTIVE_ZONE:format(ns.Engine.NomZone(s))
end

local function EtatLibelle(q, etat)
    if etat == "done" then return L.ST_DONE end
    if q.kind == "entrainer" then return L.ST_TO_TRAIN or "" end
    if q.kind == "prendre" then
        return etat == "available" and L.ST_TO_TAKE or L.ST_TAKEN
    elseif q.kind == "rendre" then
        if etat == "complete" then return L.ST_READY end
        if etat == "in_progress" then return L.ST_IN_PROGRESS end
        return L.ST_NOT_TAKEN
    end
    if etat == "complete" then return L.ST_COMPLETE end
    if etat == "in_progress" then return L.ST_IN_PROGRESS end
    if etat == "available" then return L.ST_NOT_TAKEN end
    return ""
end

-- direction et distance d'une étape, calculées depuis la position du joueur.
-- Renvoie angle (radians, relatif à l'orientation du joueur ; nil si inconnu)
-- et distance (mètres ; nil si inconnue).
function Window.Direction(step)
    if not (step and step.x and step.y) then return nil, nil end
    if not (C_Map and C_Map.GetWorldPosFromMapPos and CreateVector2D and UnitPosition) then return nil, nil end
    local carte = step.map or (ns.zoneMaps and step.zone and ns.zoneMaps[step.zone])
        or (C_Map.GetBestMapForUnit and C_Map.GetBestMapForUnit("player"))
    if not carte then return nil, nil end
    local ok, continent, pos = pcall(C_Map.GetWorldPosFromMapPos, carte, CreateVector2D(step.x / 100, step.y / 100))
    if not ok or not pos then return nil, nil end
    local cibleN, cibleO = pos:GetXY()
    local joueurN, joueurO, _, instance = UnitPosition("player")
    if not joueurN or (continent and instance and continent ~= instance) then return nil, nil end
    local dN, dO = cibleN - joueurN, cibleO - joueurO
    local distance = math.sqrt(dN * dN + dO * dO)
    local face = GetPlayerFacing and GetPlayerFacing()
    local angle = face and (math.atan2(dO, dN) - face) or nil
    return angle, distance
end

local function Distance(d)
    return L.DIST:format(math.floor(d + 0.5))
end

-- Icône ou flèche : une étape où l'on accepte une quête montre le « ! » du jeu, une étape où l'on rend
-- une quête montre le « ? » ; la flèche de direction passe alors en petit, dans le coin. Une étape
-- « Faire » garde la grande flèche.
local function ModeBoussole(icone, fleche, step, grande, petite, inconnu)
    local q = step and ns.Engine.GetPendingQuest and ns.Engine.GetPendingQuest(step)
    local fichier = q and ICONE_QUETE[q.kind]
    fleche:ClearAllPoints()
    if fichier then
        icone:SetTexture(fichier)
        icone:Show()
        fleche:SetSize(petite, petite)
        fleche:SetPoint("CENTER", icone, "BOTTOMRIGHT", -2, 2)
        if inconnu then inconnu:Hide() end
    else
        icone:Hide()
        fleche:SetSize(grande, grande)
        fleche:SetPoint(unpack(fleche.ancre))
    end
end

-- ---------------------------------------------------------------------------
-- 1. Fenêtre principale
-- ---------------------------------------------------------------------------

local fenetre, mini, vueParcours, reglages
local lignesQuete, lignesSuite, lignesListe = {}, {}, {}
local RemplirListe, RemplirParcours, MajReglages

local function LigneQuete(i)
    local r = lignesQuete[i]
    if r then return r end
    r = CreateFrame("Frame", nil, fenetre.carte, "BackdropTemplate")
    r:EnableMouse(true)
    r.eclair = r:CreateTexture(nil, "BACKGROUND", nil, 7)
    r.eclair:SetPoint("TOPLEFT", 1, -1)
    r.eclair:SetPoint("BOTTOMRIGHT", -1, 1)
    r.eclair:Hide()
    r.badge = Texte(r, 9, C.or_)
    r.badge:SetJustifyH("RIGHT")
    r.barreNom = r:CreateTexture(nil, "OVERLAY")
    r.barreNom:SetHeight(1)
    r.barreNom:Hide()
    r.icone = r:CreateTexture(nil, "ARTWORK")
    r.icone:SetSize(18, 18)
    r.icone:SetPoint("TOPLEFT", 0, -8)
    r.action = Texte(r, 9, C.or_)
    r.action:SetPoint("TOPLEFT", 26, -8)
    r.nom = Texte(r, 13, C.clair)
    r.nom:SetWordWrap(true)
    r.pnj = Texte(r, 10, C.sourd)
    r.sep = Trait(r, C.traitDoux)
    r.sep:SetPoint("BOTTOMLEFT")
    r.sep:SetPoint("BOTTOMRIGHT")
    r.objs = {}
    r:SetScript("OnEnter", function(self)
        if not self.q then return end
        GameTooltip:SetOwner(self, "ANCHOR_LEFT")
        GameTooltip:AddLine(ns.Engine.QuestName(self.q), C.or_[1], C.or_[2], C.or_[3])
        GameTooltip:AddLine(Action(self.q) .. " · " .. (self.etatTexte or ""), 0.8, 0.8, 0.8)
        local nv = ns.Engine.Prerequis and ns.Engine.Prerequis(self.q)
        if nv then GameTooltip:AddLine(L.LEVEL_LABEL:format(nv), 0.8, 0.8, 0.8) end
        if self.source then GameTooltip:AddLine(self.source == "base" and L.POS_BASE or L.POS_GAME, 0.6, 0.6, 0.6) end
        local desc = ns.Engine.GetQuestDescription(self.q)
        if desc then GameTooltip:AddLine(desc, 1, 1, 1, true) end
        GameTooltip:Show()
    end)
    r:SetScript("OnLeave", function() GameTooltip:Hide() end)
    lignesQuete[i] = r
    return r
end

local function Objectif(r, k)
    local o = r.objs[k]
    if o then return o end
    o = {}
    o.texte = Texte(r, 11, C.objectif)
    o.texte:SetWordWrap(true)
    o.compte = Texte(r, 11, C.or_)
    o.compte:SetJustifyH("RIGHT")
    r.objs[k] = o
    return o
end

local P = 6            -- marge intérieure des lignes de quête
local etatsLignes = {}  -- dernier état affiché de chaque quête (éclair au changement)

-- bref éclair de la couleur de l'état, quand une quête vient d'être acceptée ou remplie
local function Eclair(r, c)
    r.eclair:SetColorTexture(c[1], c[2], c[3], 1)
    local pas = { 0.5, 0.36, 0.22, 0.1, 0 }
    for i, a in ipairs(pas) do
        local function poser() r.eclair:SetAlpha(a); r.eclair:SetShown(a > 0) end
        if C_Timer and C_Timer.After then C_Timer.After((i - 1) * 0.15, poser) elseif i == #pas then poser() end
    end
end

-- remplit une ligne de quête ; renvoie sa hauteur
local function RemplirQuete(r, q, largeur, location, source)
    local etat = ns.Engine.GetQuestStatus(q)
    local ev = EtatVisuel(q, etat)
    local couleurs = ETATS[ev]
    r.q = q
    r.source = source
    r.etatTexte = EtatLibelle(q, etat)
    r:SetWidth(largeur)
    Fond(r, couleurs.fond, couleurs.bord)
    local cle = q.cle or q.id or q.name
    if cle then
        local avant = etatsLignes[cle]
        etatsLignes[cle] = ev
        if avant and avant ~= ev and (ev == "cours" or ev == "pret") then Eclair(r, couleurs.bord) end
    end

    -- rendue : une seule ligne, barrée, en bas de l'étape
    if ev == "rendue" then
        r.action:Hide()
        r.badge:Hide()
        r.pnj:Hide()
        if r.alerte then r.alerte:Hide() end
        for _, o in ipairs(r.objs) do o.texte:Hide(); o.compte:Hide() end
        r.icone:SetTexture(TEX .. "check_full")
        r.icone:SetAlpha(0.6)
        r.icone:SetSize(14, 14)
        r.icone:ClearAllPoints()
        r.icone:SetPoint("TOPLEFT", P, -4)
        r.nom:SetFont(POLICE, 11, "")
        r.nom:SetWordWrap(false)
        r.nom:ClearAllPoints()
        r.nom:SetPoint("TOPLEFT", 22 + P, -6)
        r.nom:SetWidth(largeur - 22 - 2 * P)
        r.nom:SetText(ns.Engine.QuestName(q) .. " · " .. (q.kind == "entrainer" and L.FOLD_SEEN or L.FOLD_DONE))
        Teinte(r.nom, couleurs.texte)
        local w = math.min(r.nom:GetStringWidth() or 0, largeur - 22 - 2 * P)
        r.barreNom:SetColorTexture(couleurs.texte[1], couleurs.texte[2], couleurs.texte[3], 0.8)
        r.barreNom:ClearAllPoints()
        r.barreNom:SetPoint("TOPLEFT", r.nom, "TOPLEFT", 0, -6)
        r.barreNom:SetWidth(math.max(w, 1))
        r.barreNom:Show()
        r:SetHeight(22)
        r:Show()
        return 22
    end
    r.barreNom:Hide()

    -- pictogramme : « ! » du jeu à prendre, « ? » du jeu à rendre, sinon case à cocher
    local tex
    if ev == "pret" then
        tex = ICONE_QUETE.rendre
    elseif q.kind == "entrainer" then
        tex = ICONE_QUETE.entrainer
    elseif q.kind == "prendre" and ev == "prendre" then
        tex = ICONE_QUETE.prendre
    elseif q.kind == "rendre" then
        tex = TEX .. "helmet"
    else
        tex = TEX .. "check_outline"
    end
    r.icone:SetTexture(tex)
    r.icone:SetAlpha(1)
    r.icone:SetSize(18, 18)
    r.icone:ClearAllPoints()
    r.icone:SetPoint("TOPLEFT", P, -8)

    r.action:Show()
    r.action:ClearAllPoints()
    r.action:SetPoint("TOPLEFT", 26 + P, -8)
    r.action:SetText((L["LABEL_" .. tostring(q.kind)] or Action(q):upper()) .. (q.group and (" · " .. L.GROUP) or ""))
    Teinte(r.action, couleurs.texte)

    r.badge:Show()
    r.badge:ClearAllPoints()
    r.badge:SetPoint("TOPRIGHT", -P, -8)
    r.badge:SetText(BadgeEtat(q, ev))
    Teinte(r.badge, couleurs.texte)

    r.nom:SetFont(POLICE, 13, "")
    r.nom:SetWordWrap(true)
    r.nom:ClearAllPoints()
    r.nom:SetPoint("TOPLEFT", 26 + P, -22)
    r.nom:SetWidth(largeur - 26 - 2 * P)
    r.nom:SetText(ns.Engine.QuestName(q))
    Teinte(r.nom, C.clair)

    local y = -22 - math.max(r.nom:GetStringHeight() or 14, 14) - 4

    local objs = ns.Engine.GetObjectives(q)
    local k = 0
    for _, o in ipairs(objs) do
        local texte = NettoyerObjectif(o.text)
        -- où l'objet a été ramassé lors de l'enregistrement (RouteProbe) : « · sur : Coffre de ravitaillement »
        local sources = texte ~= "" and ns.Engine.SourcesObjectif and ns.Engine.SourcesObjectif(q, texte)
        if sources then texte = texte .. " · " .. sources end
        if texte ~= "" then
            k = k + 1
            local l = Objectif(r, k)
            local req = o.numRequired or 0
            local n = o.numFulfilled or 0
            local fini = o.finished or (req > 0 and n >= req)
            l.compte:ClearAllPoints()
            l.compte:SetPoint("TOPRIGHT", -P, y)
            if req > 0 then
                l.compte:SetText(("%d / %d"):format(n, req))
                Teinte(l.compte, fini and ETATS.pret.texte or couleurs.texte)
            else
                l.compte:SetText(o.finished and "ok" or "")
                Teinte(l.compte, ETATS.pret.texte)
            end
            l.texte:ClearAllPoints()
            l.texte:SetPoint("TOPLEFT", 26 + P, y)
            l.texte:SetWidth(largeur - 26 - 2 * P - 56)
            l.texte:SetText(texte)
            Teinte(l.texte, fini and ETATS.pret.texte or C.objectif)
            l.texte:Show()
            l.compte:Show()
            y = y - math.max(l.texte:GetStringHeight() or 12, 12) - 3
        end
    end
    for j = k + 1, #r.objs do
        r.objs[j].texte:Hide()
        r.objs[j].compte:Hide()
    end

    local pnj
    if location and location ~= "" then
        if q.kind == "prendre" then
            pnj = L.PICK_AT .. location
        elseif q.kind == "rendre" then
            pnj = L.TURNIN_AT .. location
        end
    end
    if q.kind == "entrainer" then
        pnj = (q.metier and L.TRAINER_PROF or L.TRAINER_CLASS)
    end
    if pnj then
        r.pnj:ClearAllPoints()
        r.pnj:SetPoint("TOPLEFT", 26 + P, y)
        r.pnj:SetWidth(largeur - 26 - 2 * P)
        r.pnj:SetText(pnj)
        r.pnj:Show()
        y = y - (r.pnj:GetStringHeight() or 11) - 3
    else
        r.pnj:Hide()
    end

    -- niveau requis ou quête préalable manquante (base intégrée), pour une quête pas encore prise
    local alerte
    if q.kind == "prendre" and etat == "available" and ns.Engine.Prerequis then
        local _, manqueNiveau, manqueQuete = ns.Engine.Prerequis(q)
        if manqueNiveau then
            alerte = L.NEED_LEVEL:format(manqueNiveau, UnitLevel("player") or 1)
        elseif manqueQuete then
            alerte = L.NEED_PREREQ:format(manqueQuete)
        end
    end
    if alerte then
        if not r.alerte then
            r.alerte = Texte(r, 10, { 0.906, 0.616, 0.376 })
            r.alerte:SetWordWrap(true)
        end
        r.alerte:ClearAllPoints()
        r.alerte:SetPoint("TOPLEFT", 26 + P, y)
        r.alerte:SetWidth(largeur - 26 - 2 * P)
        r.alerte:SetText(alerte)
        r.alerte:Show()
        y = y - (r.alerte:GetStringHeight() or 11) - 3
    elseif r.alerte then
        r.alerte:Hide()
    end

    local h = math.max(-y + 6, 34)
    r:SetHeight(h)
    r:Show()
    return h
end

-- ---------------------------------------------------------------------------
-- Quêtes en cours (journal du jeu) et annonces
-- ---------------------------------------------------------------------------

-- quêtes de la route, par identifiant et par nom, avec l'étape où les rendre
local indexRoutes = {}
local function IndexRoute(guide)
    local c = indexRoutes[guide.id]
    if c and c.n == #guide.steps then return c end
    c = { n = #guide.steps, parId = {}, parNom = {} }
    for i, s in ipairs(guide.steps) do
        for _, q in ipairs(s.quests or {}) do
            if q.kind ~= "entrainer" then
                -- l'identifiant d'abord : deux quêtes peuvent porter le même titre (233 et 234)
                local e
                if q.id then e = c.parId[q.id] elseif q.name then e = c.parNom[q.name] end
                if not e then
                    e = { q = q }
                    if q.id then c.parId[q.id] = e end
                    if q.name and not c.parNom[q.name] then c.parNom[q.name] = e end
                end
                if q.kind == "rendre" and not e.rendre then e.rendre = i end
            end
        end
    end
    indexRoutes[guide.id] = c
    return c
end

-- quêtes du journal du jeu (hors en-têtes) et leur nombre
local function LireJournal()
    local out, n = {}, 0
    if C_QuestLog and C_QuestLog.GetNumQuestLogEntries and C_QuestLog.GetInfo then
        local total = C_QuestLog.GetNumQuestLogEntries() or 0
        for i = 1, total do
            local info = C_QuestLog.GetInfo(i)
            if info and not info.isHeader then
                n = n + 1
                out[#out + 1] = { id = info.questID, titre = info.title }
            end
        end
    elseif GetNumQuestLogEntries and GetQuestLogTitle then
        local total = GetNumQuestLogEntries() or 0
        for i = 1, total do
            local titre, _, _, entete, _, _, _, id = GetQuestLogTitle(i)
            if titre and not entete then
                n = n + 1
                out[#out + 1] = { id = id, titre = titre }
            end
        end
    end
    return out, n
end

--- Annonce sous l'étape : clé de traduction et ses valeurs, pour suivre la langue choisie.
function Window.Annoncer(cle, ev, ...)
    Window.annonce = { cle = cle, args = { ... }, ev = ev, t = GetTime() }
    local q, etape = ...
    Window.annonce.texte = (L[cle] or cle):format(ns.Engine.QuestName(q), etape)
    -- effacer l'annonce au bout de 8 secondes
    if C_Timer and C_Timer.After then
        local a = Window.annonce
        C_Timer.After(8.2, function() if Window.annonce == a and GetTime() - a.t >= 8 then Window.Refresh() end end)
    end
end

local precedents, guideScanne, debutScan = {}, nil, nil
--- Relève les quêtes de la route présentes dans le journal et annonce les changements (prise, objectifs remplis, rendu).
function Window.Scanner()
    local guide = ns.Engine.GetActiveGuide()
    Window.journal = { lignes = {}, total = 0 }
    if not guide then return end
    local idx = IndexRoute(guide)
    local entrees, total = LireJournal()
    Window.journal.total = total
    debutScan = debutScan or GetTime()
    -- au chargement (journal encore vide ou guide changé), on relève sans rien annoncer
    local initial = guideScanne ~= guide.id or (GetTime() - debutScan) < 10
    local vus, nouveaux = {}, {}
    for _, en in ipairs(entrees) do
        local e = (en.id and idx.parId[en.id]) or (en.titre and idx.parNom[en.titre])
        if e and not vus[e] then
            vus[e] = true
            local ev = (ns.Engine.QuestState(e.q) == "complete") and "pret" or "cours"
            Window.journal.lignes[#Window.journal.lignes + 1] = { e = e, ev = ev }
            nouveaux[e] = ev
        end
    end
    -- l'état relevé est gardé avant d'annoncer : une annonce rafraîchit la fenêtre, qui relit le journal
    local anciens = precedents
    precedents = nouveaux
    guideScanne = guide.id
    if not initial then
        local cur = ns.Engine.GetStepIndex()
        local annonce
        for _, l in ipairs(Window.journal.lignes) do
            local avant = anciens[l.e]
            if not avant then
                annonce = { "ANN_ACCEPTED", "cours", l.e.q }
            elseif avant == "cours" and l.ev == "pret" then
                if l.e.rendre and l.e.rendre ~= cur then
                    annonce = { "ANN_READY_STEP", "pret", l.e.q, l.e.rendre }
                else
                    annonce = { "ANN_READY", "pret", l.e.q }
                end
            end
        end
        for e in pairs(anciens) do
            if not nouveaux[e] and ns.Engine.QuestState(e.q) == "done" then
                annonce = { "ANN_TURNED", "pret", e.q }
            end
        end
        if annonce then Window.Annoncer(annonce[1], annonce[2], annonce[3], annonce[4]) end
    end
    -- prêtes à rendre d'abord, puis dans l'ordre du parcours
    table.sort(Window.journal.lignes, function(a, b)
        if a.ev ~= b.ev then return a.ev == "pret" end
        return (a.e.rendre or 1e9) < (b.e.rendre or 1e9)
    end)
end

local function LigneSuite(i)
    local l = lignesSuite[i]
    if l then return l end
    l = CreateFrame("Button", nil, fenetre)
    l:SetHeight(20)
    l.n = Texte(l, 11, C.or_)
    l.n:SetPoint("LEFT")
    l.n:SetWidth(34)
    l.pt = l:CreateTexture(nil, "ARTWORK")
    l.pt:SetSize(7, 7)
    l.pt:SetPoint("LEFT", 36, 0)
    l.texte = Texte(l, 12, { 0.867, 0.816, 0.722 })
    l.texte:SetPoint("LEFT", 50, 0)
    l.texte:SetPoint("RIGHT")
    l.texte:SetWordWrap(false)
    l.trait = Trait(l, C.bouton)
    l.trait:SetPoint("BOTTOMLEFT")
    l.trait:SetPoint("BOTTOMRIGHT")
    l:SetScript("OnClick", function(self)
        ns.viewStep = self.index
        Window.Refresh()
    end)
    l:SetScript("OnEnter", function(self) Teinte(self.texte, C.or_) end)
    l:SetScript("OnLeave", function(self) Teinte(self.texte, { 0.867, 0.816, 0.722 }) end)
    lignesSuite[i] = l
    return l
end

local lignesJournal = {}
local function LigneJournal(i)
    local b = lignesJournal[i]
    if b then return b end
    b = CreateFrame("Button", nil, fenetre)
    b:SetHeight(18)
    b.fond = b:CreateTexture(nil, "BACKGROUND")
    b.fond:SetAllPoints()
    b.pt = b:CreateTexture(nil, "ARTWORK")
    b.pt:SetSize(8, 8)
    b.pt:SetPoint("LEFT", 6, 0)
    b.droite = Texte(b, 11, C.pale)
    b.droite:SetPoint("RIGHT", -6, 0)
    b.droite:SetJustifyH("RIGHT")
    b.droite:SetJustifyV("MIDDLE")
    b.nom = Texte(b, 12, C.texte)
    b.nom:SetPoint("LEFT", 20, 0)
    b.nom:SetPoint("RIGHT", b.droite, "LEFT", -8, 0)
    b.nom:SetJustifyV("MIDDLE")
    b.nom:SetWordWrap(false)
    -- clic : affiche l'étape où rendre la quête
    b:SetScript("OnClick", function(self)
        if self.rendre then ns.viewStep = self.rendre; Window.Refresh() end
    end)
    b:SetScript("OnEnter", function(self) Teinte(self.nom, C.or_) end)
    b:SetScript("OnLeave", function(self) Teinte(self.nom, C.texte) end)
    lignesJournal[i] = b
    return b
end

local function OuvrirListe()
    if not fenetre then return end
    RemplirListe()
    fenetre.liste:Show()
end

local function ActionPrincipale()
    local guide = ns.Engine.GetActiveGuide()
    if not guide then
        if fenetre.liste:IsShown() then fenetre.liste:Hide() else OuvrirListe() end
        return
    end
    local vue, cur = ns.Engine.GetViewStep(), ns.Engine.GetStepIndex()
    if ns.viewStep and vue ~= cur then
        ns.viewStep = nil
        Window.Refresh()
        return
    end
    if guide.steps[cur] then
        ns.Engine.Advance()
    elseif fenetre.liste:IsShown() then
        fenetre.liste:Hide()
    else
        OuvrirListe()   -- guide terminé : choisir la suite
    end
end

local function CreerListe(f, ancre)
    local l = CreateFrame("Frame", nil, f, "BackdropTemplate")
    l:SetPoint("TOPLEFT", ancre, "BOTTOMLEFT", MARGE, 4)
    l:SetPoint("TOPRIGHT", ancre, "BOTTOMRIGHT", -MARGE, 4)
    l:SetHeight(260)
    l:SetFrameLevel(f:GetFrameLevel() + 30)
    Fond(l, C.fond, C.bord, 0.99)
    l:EnableMouse(true)
    l:Hide()

    local scroll = CreateFrame("ScrollFrame", nil, l, "UIPanelScrollFrameTemplate")
    scroll:SetPoint("TOPLEFT", 8, -8)
    scroll:SetPoint("BOTTOMRIGHT", -28, 8)
    local contenu = CreateFrame("Frame", nil, scroll)
    contenu:SetSize(LARGEUR - 2 * MARGE - 38, 1)
    scroll:SetScrollChild(contenu)
    l.scroll, l.contenu = scroll, contenu
    l.groupes = {
        { cle = "RECORDED", ouvert = true, test = function(g) return g.zone and g.zone ~= "" end },
        { cle = "BY_CLASS", ouvert = true, test = function(g) return not g.zone or g.zone == "" end },
    }
    return l
end

function RemplirListe()
    local l = fenetre.liste
    -- seulement les routes de la race, de la faction et de la classe du personnage (tous niveaux)
    local tous = {}
    for _, g in ipairs(ns.Engine.GetAllGuides and ns.Engine.GetAllGuides() or {}) do
        if not ns.Engine.GuideConvient or ns.Engine.GuideConvient(g, false) then tous[#tous + 1] = g end
    end
    local adaptes = {}
    for _, g in ipairs(ns.Engine.GetGuidesForPlayer and ns.Engine.GetGuidesForPlayer() or {}) do
        adaptes[g.id] = true
    end
    local actif = ns.db and ns.db.activeGuide
    local largeur = l.contenu:GetWidth()
    local n, y = 0, 0

    local function Ligne(texte, couleur, retrait, coche, clic)
        n = n + 1
        local b = lignesListe[n]
        if not b then
            b = CreateFrame("Button", nil, l.contenu, "BackdropTemplate")
            b:SetHeight(22)
            Fond(b, C.fond, nil, 0)
            b.coche = b:CreateTexture(nil, "ARTWORK")
            b.coche:SetSize(14, 14)
            b.texte = Texte(b, 12, C.clair)
            b.texte:SetWordWrap(false)
            b:SetScript("OnEnter", function(self) self:SetBackdropColor(C.survol[1], C.survol[2], C.survol[3], 1) end)
            b:SetScript("OnLeave", function(self) self:SetBackdropColor(0, 0, 0, 0) end)
            lignesListe[n] = b
        end
        b:ClearAllPoints()
        b:SetPoint("TOPLEFT", 0, y)
        b:SetWidth(largeur)
        b.coche:ClearAllPoints()
        b.coche:SetPoint("LEFT", retrait, 0)
        if coche then
            b.coche:SetTexture(TEX .. "check_full")
            b.coche:Show()
        else
            b.coche:Hide()
        end
        b.texte:ClearAllPoints()
        b.texte:SetPoint("LEFT", retrait + (coche ~= nil and 20 or 4), 0)
        b.texte:SetPoint("RIGHT", -4, 0)
        b.texte:SetJustifyV("MIDDLE")
        b.texte:SetText(texte)
        Teinte(b.texte, couleur)
        b:SetScript("OnClick", clic)
        b:Show()
        y = y - 23
    end

    for _, grp in ipairs(l.groupes) do
        local items = {}
        for _, g in ipairs(tous) do
            if grp.test(g) then items[#items + 1] = g end
        end
        if #items > 0 then
            Ligne(("%s  %s (%d)"):format(grp.ouvert and "-" or "+", (L[grp.cle] or grp.cle):upper(), #items), C.sourd, 0, nil, function()
                grp.ouvert = not grp.ouvert
                RemplirListe()
            end)
        end
        if grp.ouvert then
            for _, g in ipairs(items) do
                local couleur = (g.id == actif) and C.or_ or (adaptes[g.id] and C.clair or C.pale)
                Ligne(ns.Engine.NomGuide(g), couleur, 8, g.id == actif, function()
                    if not ns.Engine.LoadGuide(g.id) then
                        ns.Print(L.GUIDE_MISSING .. tostring(g.id))
                    end
                    if ns.TomTomBridge and ns.TomTomBridge.Refresh then ns.TomTomBridge.Refresh() end
                    l:Hide()
                    Window.Refresh()
                end)
            end
        end
    end
    for k = n + 1, #lignesListe do lignesListe[k]:Hide() end
    l.contenu:SetHeight(math.max(-y, 1))
    l.scroll:SetVerticalScroll(0)
end

local function CreerFenetre()
    local f = CreateFrame("Frame", "EternalRoutesFrame", UIParent, "BackdropTemplate")
    f:SetWidth(LARGEUR)
    f:SetHeight(420)
    f:SetFrameStrata("MEDIUM")
    f:SetToplevel(true)
    Fond(f, C.fond, C.bord, 0.97)
    Deplacable(f, "fenetre")
    Placer(f, "fenetre", "TOPRIGHT", -240, -160)
    f:Hide()
    fenetre = f

    -- en-tête
    local e = EnTete(f, 44, H_ENTETE)
    e.titre:SetText("EternalRoutes")
    e.sous:SetText(L.TAGLINE)
    e.fermer:SetScript("OnClick", function()
        f:Hide()
        if ns.db then ns.db.shown = false end
    end)

    local reduire = Bouton(e.cadre, 24, 24, "-")
    reduire:SetPoint("RIGHT", e.fermer, "LEFT", -6, 0)
    reduire.aideCle = "MINI_TIP"
    reduire:SetScript("OnClick", function() Window.SetMini(true) end)

    local parcours = Bouton(e.cadre, 24, 24, nil, false, ICONE_CARTE)
    parcours:SetPoint("RIGHT", reduire, "LEFT", -6, 0)
    parcours.aideCle = "ROUTE_TIP"
    parcours:SetScript("OnClick", function() Window.ToggleRoute() end)

    local langue = Bouton(e.cadre, 30, 24, L.LANG_BUTTON)
    langue:SetPoint("RIGHT", parcours, "LEFT", -6, 0)
    langue.aideCle = "LANG_TIP"
    langue:SetScript("OnClick", function()
        ns.SetLang(ns.IsEnglish() and "fr" or "en")
    end)
    f.langue = langue

    -- guide et progression
    local g = CreateFrame("Frame", nil, f)
    g:SetPoint("TOPLEFT", 0, -(H_ENTETE + 1))
    g:SetPoint("TOPRIGHT", 0, -(H_ENTETE + 1))
    g:SetHeight(H_GUIDE)
    local tg = Trait(g, C.traitDoux)
    tg:SetPoint("BOTTOMLEFT", 1, 0)
    tg:SetPoint("BOTTOMRIGHT", -1, 0)

    local nomGuide = CreateFrame("Button", nil, g)
    nomGuide:SetPoint("TOPLEFT", 14, -9)
    nomGuide:SetHeight(18)
    nomGuide.texte = Texte(nomGuide, 13, C.clair)
    nomGuide.texte:SetPoint("LEFT")
    nomGuide.texte:SetWordWrap(false)
    nomGuide.fleche = nomGuide:CreateTexture(nil, "ARTWORK")
    nomGuide.fleche:SetTexture("Interface\\Buttons\\Arrow-Down-Up")
    nomGuide.fleche:SetSize(12, 12)
    nomGuide.fleche:SetPoint("LEFT", nomGuide.texte, "RIGHT", 4, -2)
    nomGuide.aideCle = "CHANGE_GUIDE_TIP"
    nomGuide:SetScript("OnClick", function()
        if f.liste:IsShown() then f.liste:Hide() else OuvrirListe() end
    end)
    nomGuide:SetScript("OnEnter", function(self) Teinte(self.texte, C.or_); Aide(self) end)
    nomGuide:SetScript("OnLeave", function(self) Teinte(self.texte, C.clair); GameTooltip:Hide() end)
    f.nomGuide = nomGuide

    local zone = Texte(g, 11, C.pale)
    zone:SetPoint("TOPRIGHT", -14, -12)
    zone:SetJustifyH("RIGHT")
    f.zone = zone

    local barre = CreateFrame("StatusBar", nil, g, "BackdropTemplate")
    barre:SetPoint("TOPLEFT", 14, -32)
    barre:SetPoint("TOPRIGHT", -104, -32)
    barre:SetHeight(8)
    Fond(barre, C.traitDoux)
    barre:SetStatusBarTexture(BLANC)
    barre:SetStatusBarColor(C.or_[1], C.or_[2], C.or_[3])
    barre:SetMinMaxValues(0, 1)
    barre:SetValue(0)
    f.barre = barre

    local etape = Texte(g, 11, C.or_)
    etape:SetPoint("TOPRIGHT", -14, -30)
    etape:SetJustifyH("RIGHT")
    f.etape = etape

    -- carte de l'étape
    local carte = CreateFrame("Frame", nil, f, "BackdropTemplate")
    carte:SetPoint("TOPLEFT", MARGE, -(H_ENTETE + 1 + H_GUIDE + MARGE))
    carte:SetWidth(LARGEUR - 2 * MARGE)
    carte:SetHeight(60)
    Fond(carte, C.carte, C.bord)
    f.carte = carte

    local haut = CreateFrame("Frame", nil, carte, "BackdropTemplate")
    haut:SetPoint("TOPLEFT", 1, -1)
    haut:SetPoint("TOPRIGHT", -1, -1)
    haut:SetHeight(58)
    Fond(haut, C.carteHaut)

    local boussole = CreateFrame("Button", nil, haut, "BackdropTemplate")
    boussole:SetSize(40, 40)
    boussole:SetPoint("LEFT", 10, 0)
    Fond(boussole, C.entete, C.bordClair)
    -- clic : renvoie le point de l'étape à TomTom et affiche l'état de la flèche
    boussole.aideCle = "ARROW_TIP"
    boussole:SetScript("OnEnter", Aide)
    boussole:SetScript("OnLeave", function() GameTooltip:Hide() end)
    boussole:SetScript("OnClick", function()
        if ns.TomTomBridge and ns.TomTomBridge.Refresh then ns.TomTomBridge.Refresh() end
        if ns.TomTomBridge and ns.TomTomBridge.Status then ns.Print(ns.TomTomBridge.Status()) end
    end)
    local icone = boussole:CreateTexture(nil, "ARTWORK")
    icone:SetSize(30, 30)
    icone:SetPoint("CENTER")
    icone:Hide()
    f.icone = icone
    local fleche = boussole:CreateTexture(nil, "OVERLAY")
    fleche:SetTexture(FLECHE)
    fleche:SetSize(30, 30)
    fleche:SetPoint("CENTER")
    fleche.ancre = { "CENTER", boussole, "CENTER", 0, 0 }
    fleche:SetVertexColor(C.or_[1], C.or_[2], C.or_[3])
    local inconnu = Texte(boussole, 16, C.sourd)
    inconnu:SetPoint("CENTER")
    inconnu:SetJustifyH("CENTER")
    inconnu:SetJustifyV("MIDDLE")
    inconnu:SetText("?")
    f.fleche, f.inconnu = fleche, inconnu

    local badge = CreateFrame("Frame", nil, haut, "BackdropTemplate")
    badge:SetHeight(18)
    badge:SetPoint("RIGHT", -10, 0)
    Fond(badge, C.vert)
    badge.texte = badge:CreateFontString(nil, "OVERLAY")
    badge.texte:SetFont(POLICE, 9, "")
    badge.texte:SetPoint("CENTER")
    Teinte(badge.texte, { 0.043, 0.102, 0.063 })
    badge:Hide()
    f.badge = badge

    local lieu = Texte(haut, 14, C.clair)
    lieu:SetPoint("TOPLEFT", boussole, "TOPRIGHT", 10, -4)
    lieu:SetPoint("RIGHT", haut, "RIGHT", -84, 0)
    lieu:SetWordWrap(false)
    f.lieu = lieu

    local coords = Texte(haut, 11, C.pale)
    coords:SetPoint("TOPLEFT", lieu, "BOTTOMLEFT", 0, -5)
    coords:SetPoint("RIGHT", haut, "RIGHT", -84, 0)
    coords:SetWordWrap(false)
    f.coords = coords

    -- navigation
    local prec = Bouton(f, 36, 34, "<")
    prec:SetPoint("TOPLEFT", carte, "BOTTOMLEFT", 0, -10)
    prec.aideCle = "PREV_TIP"
    prec:SetScript("OnClick", function()
        ns.viewStep = math.max(1, ns.Engine.GetViewStep() - 1)
        Window.Refresh()
    end)
    local suiv = Bouton(f, 36, 34, ">")
    suiv:SetPoint("TOPRIGHT", carte, "BOTTOMRIGHT", 0, -10)
    suiv.aideCle = "NEXT_TIP"
    suiv:SetScript("OnClick", function()
        local gd = ns.Engine.GetActiveGuide()
        ns.viewStep = math.min(gd and #gd.steps or 1, ns.Engine.GetViewStep() + 1)
        Window.Refresh()
    end)
    local principal = Bouton(f, 100, 34, "", true)
    principal:SetPoint("TOPLEFT", prec, "TOPRIGHT", 8, 0)
    principal:SetPoint("BOTTOMRIGHT", suiv, "BOTTOMLEFT", -8, 0)
    principal:SetScript("OnClick", ActionPrincipale)
    f.principal = principal

    -- ensuite
    local suite = Texte(f, 10, C.sourd)
    suite:SetPoint("TOPLEFT", prec, "BOTTOMLEFT", 2, -12)
    Libelle(suite, "NEXT_TITLE")
    f.suite = suite

    -- pied
    local pied = CreateFrame("Frame", nil, f, "BackdropTemplate")
    pied:SetPoint("BOTTOMLEFT", 1, 1)
    pied:SetPoint("BOTTOMRIGHT", -1, 1)
    pied:SetHeight(H_PIED)
    Fond(pied, C.entete)
    local tp = Trait(pied, C.trait)
    tp:SetPoint("TOPLEFT")
    tp:SetPoint("TOPRIGHT")
    local point = pied:CreateTexture(nil, "ARTWORK")
    point:SetSize(7, 7)
    point:SetPoint("LEFT", 14, 0)
    f.point = point
    local etat = Texte(pied, 10, C.pale)
    etat:SetPoint("LEFT", point, "RIGHT", 7, 0)
    etat:SetJustifyV("MIDDLE")
    f.etat = etat
    local bReglages = Bouton(pied, 76, 20, L.SETTINGS)
    bReglages:SetPoint("RIGHT", -8, 0)
    bReglages:SetScript("OnClick", function() Window.ToggleOptions() end)
    f.bReglages = bReglages
    local cmd = Texte(pied, 10, C.sourd)
    cmd:SetPoint("RIGHT", bReglages, "LEFT", -8, 0)
    cmd:SetText("/er")

    f.liste = CreerListe(f, g)

    -- flèche et distance, en continu
    local ecoule = 0
    f:SetScript("OnUpdate", function(self, dt)
        ecoule = ecoule + dt
        if ecoule < 0.1 then return end
        ecoule = 0
        local angle, dist = Window.Direction(self.etapeVue)
        if angle then
            self.fleche:SetRotation(angle)
            self.fleche:Show()
            self.inconnu:Hide()
        else
            self.fleche:Hide()
            self.inconnu:SetShown(not self.icone:IsShown())
        end
        local texte = self.coordsBase or ""
        if dist then texte = texte .. " · " .. Distance(dist) end
        if texte ~= self.coordsTexte then
            self.coordsTexte = texte
            self.coords:SetText(texte)
        end
        local proche = (dist and dist <= SUR_PLACE) and true or false
        if proche ~= self.badge:IsShown() then
            self.badge:SetShown(proche)
        end
    end)
end

local function RafraichirFenetre()
    local f = fenetre
    local guide = ns.Engine.GetActiveGuide()
    local largeurCarte = LARGEUR - 2 * MARGE
    local hCarte = 60
    local nQ = 0
    local nS = 0
    f.etapeVue = nil
    f.coordsBase = ""
    f.coordsTexte = nil

    f.badge.texte:SetText(L.ON_SITE)
    f.badge:SetWidth(f.badge.texte:GetStringWidth() + 12)

    if not guide then
        f.nomGuide.texte:SetText(L.CHOOSE_GUIDE)
        f.zone:SetText("")
        f.barre:SetValue(0)
        f.etape:SetText("")
        f.lieu:SetText(L.NO_GUIDE)
        f.coords:SetText("")
        f.principal.texte:SetText(L.CHOOSE_GUIDE)
    else
        local zones = ZonesDu(guide)
        local n = #guide.steps
        local cur = ns.Engine.GetStepIndex()
        local vue = ns.Engine.GetViewStep()
        local step = guide.steps[vue]
        if cur > n then step = nil end
        if ns.viewStep and guide.steps[ns.viewStep] then step = guide.steps[ns.viewStep] end

        f.nomGuide.texte:SetText(ns.Engine.NomGuide(guide))
        local zi = zones.index[math.min(math.max(vue, 1), n)]
        local nomZone = step and ns.Engine.NomZone(step) or (zi and ns.Engine.NomZone(zones.liste[zi].premiere)) or ""
        if zi then
            f.zone:SetText(nomZone .. " · " .. L.ZONE_OF:format(zi, #zones.liste))
        else
            f.zone:SetText(nomZone)
        end
        f.barre:SetMinMaxValues(0, math.max(n, 1))
        f.barre:SetValue(math.min(cur - 1, n))
        f.etape:SetText(L.STEP_OF:format(math.min(cur, n), n))

        if not step then
            f.lieu:SetText(L.DONE)
            f.coordsBase = L.DONE_HINT
            f.coords:SetText(L.DONE_HINT)
            f.principal.texte:SetText(L.CHOOSE_GUIDE)
        else
            f.etapeVue = step
            ModeBoussole(f.icone, f.fleche, step, 30, 16, f.inconnu)
            local lieuTexte = LieuEtape(step)
            if vue ~= cur then lieuTexte = ("#%d · %s"):format(vue, lieuTexte) end
            f.lieu:SetText(lieuTexte)
            if step.x and step.y then
                f.coordsBase = L.COORDS:format(Nombre(step.x), Nombre(step.y))
            end
            f.coords:SetText(f.coordsBase)

            local y = -64
            local quetes = ns.Engine.QuetesApplicables and ns.Engine.QuetesApplicables(step) or (step.quests or {})
            -- ce qui reste à faire en tête, ce qui est rendu replié en bas
            local ordre, rendues = {}, {}
            for _, q in ipairs(quetes) do
                if EtatVisuel(q, ns.Engine.GetQuestStatus(q)) == "rendue" then rendues[#rendues + 1] = q else ordre[#ordre + 1] = q end
            end
            for _, q in ipairs(rendues) do ordre[#ordre + 1] = q end
            for _, q in ipairs(ordre) do
                nQ = nQ + 1
                local r = LigneQuete(nQ)
                r:ClearAllPoints()
                r:SetPoint("TOPLEFT", f.carte, "TOPLEFT", 8, y)
                local h = RemplirQuete(r, q, largeurCarte - 16, ns.Engine.NomLieu(step), step.source)
                r.sep:Hide()
                y = y - h - 4
            end
            -- annonce : quête acceptée, objectifs remplis, quête rendue (8 secondes)
            local a = Window.annonce
            if a and GetTime() - a.t < 8 then
                if not f.annonce then
                    f.annonce = CreateFrame("Frame", nil, f.carte, "BackdropTemplate")
                    f.annonce.texte = Texte(f.annonce, 12, C.clair)
                    f.annonce.texte:SetPoint("TOPLEFT", 8, -5)
                    f.annonce.texte:SetWordWrap(true)
                end
                local c = ETATS[a.ev] or ETATS.cours
                Fond(f.annonce, c.fond, c.bord)
                f.annonce.texte:SetWidth(largeurCarte - 32)
                -- le nom de la quête et le texte suivent la langue choisie
                local q, etape = a.args[1], a.args[2]
                f.annonce.texte:SetText((L[a.cle] or a.cle):format(ns.Engine.QuestName(q), etape))
                Teinte(f.annonce.texte, c.texte)
                local ha = (f.annonce.texte:GetStringHeight() or 12) + 10
                f.annonce:ClearAllPoints()
                f.annonce:SetPoint("TOPLEFT", f.carte, "TOPLEFT", 8, y)
                f.annonce:SetSize(largeurCarte - 16, ha)
                f.annonce:Show()
                y = y - ha - 4
            elseif f.annonce then
                f.annonce:Hide()
            end
            hCarte = -y + 4

            if ns.viewStep and vue ~= cur then
                f.principal.texte:SetText(L.BACK_TO:format(math.min(cur, n)))
            else
                f.principal.texte:SetText(L.VALIDATE)
            end

            -- étapes suivantes
            if ns.db.showNext ~= false then
                local yS = 0
                local i = vue + 1
                while i <= n and nS < NB_SUITE do
                    local s = guide.steps[i]
                    if ns.Engine.StepApplies(s) then
                        nS = nS + 1
                        local l = LigneSuite(nS)
                        l.index = i
                        l:ClearAllPoints()
                        l:SetPoint("TOPLEFT", f.suite, "BOTTOMLEFT", 0, -4 + yS)
                        l:SetWidth(LARGEUR - 2 * MARGE - 4)
                        l.n:SetText("#" .. i)
                        l.texte:SetText(ResumeEtape(s))
                        local pq = ns.Engine.GetPendingQuest(s)
                        local c = ETATS[EtatVisuel(pq, pq and ns.Engine.GetQuestStatus(pq))].bord
                        l.pt:SetColorTexture(c[1], c[2], c[3], 1)
                        l:Show()
                        yS = yS - 21
                    end
                    i = i + 1
                end
            end
        end
    end

    for k = nQ + 1, #lignesQuete do lignesQuete[k]:Hide() end
    for k = nS + 1, #lignesSuite do lignesSuite[k]:Hide() end
    f.suite:SetShown(nS > 0)

    local nJ, hJournal = 0, 0
    if not f.journalTitre then
        f.journalTitre = Texte(f, 10, C.sourd)
        f.journalCompte = Texte(f, 10, C.pale)
        f.journalCompte:SetJustifyH("RIGHT")
        f.journalSuite = Texte(f, 11, C.sourd)
    end
    if guide then
        local j = Window.journal or { lignes = {}, total = 0 }
        local yJ = -(10 + 34 + 12) - ((nS > 0) and (14 + nS * 21 + 4) or 0)
        f.journalTitre:ClearAllPoints()
        f.journalTitre:SetPoint("TOPLEFT", f.carte, "BOTTOMLEFT", 2, yJ)
        f.journalTitre:SetText(L.LOG_TITLE)
        f.journalCompte:ClearAllPoints()
        f.journalCompte:SetPoint("TOPRIGHT", f.carte, "BOTTOMRIGHT", -2, yJ)
        f.journalCompte:SetText(("%d / %d"):format(j.total or 0, MAX_JOURNAL))
        Teinte(f.journalCompte, (j.total or 0) >= MAX_JOURNAL and ETATS.cours.texte or C.pale)
        f.journalTitre:Show()
        f.journalCompte:Show()
        local yL = yJ - 16
        for _, l in ipairs(j.lignes) do
            if nJ >= 6 then break end
            nJ = nJ + 1
            local b = LigneJournal(nJ)
            local c = ETATS[l.ev]
            b.rendre = l.e.rendre
            b:ClearAllPoints()
            b:SetPoint("TOPLEFT", f.carte, "BOTTOMLEFT", 0, yL)
            b:SetWidth(largeurCarte)
            b.fond:SetColorTexture(c.fond[1], c.fond[2], c.fond[3], 0.85)
            b.pt:SetColorTexture(c.bord[1], c.bord[2], c.bord[3], 1)
            b.nom:SetText(ns.Engine.QuestName(l.e.q))
            local droite
            if l.ev == "pret" then
                droite = l.e.rendre and L.LOG_READY:format(l.e.rendre) or L.LOG_READY_NOSTEP
            else
                for _, o in ipairs(ns.Engine.GetObjectives(l.e.q)) do
                    if not o.finished and (o.numRequired or 0) > 0 then
                        droite = ("%d / %d"):format(o.numFulfilled or 0, o.numRequired)
                        break
                    end
                end
                droite = droite or L.ST_IN_PROGRESS
            end
            b.droite:SetText(droite)
            Teinte(b.droite, c.texte)
            b:Show()
            yL = yL - 20
        end
        local reste = #j.lignes - nJ
        local note = (#j.lignes == 0 and L.LOG_EMPTY) or (reste > 0 and L.LOG_MORE:format(reste)) or nil
        if note then
            f.journalSuite:ClearAllPoints()
            f.journalSuite:SetPoint("TOPLEFT", f.carte, "BOTTOMLEFT", 4, yL - 2)
            f.journalSuite:SetText(note)
            f.journalSuite:Show()
            yL = yL - 18
        else
            f.journalSuite:Hide()
        end
        hJournal = yJ - yL
    else
        f.journalTitre:Hide()
        f.journalCompte:Hide()
        f.journalSuite:Hide()
    end
    for k = nJ + 1, #lignesJournal do lignesJournal[k]:Hide() end

    local fsNom = f.nomGuide.texte
    local wNom = (fsNom.GetUnboundedStringWidth and fsNom:GetUnboundedStringWidth()) or fsNom:GetStringWidth() or 0
    f.nomGuide:SetWidth(math.min(wNom, 220) + 18)
    f.nomGuide.texte:SetWidth(math.min(wNom, 220) + 1)

    f.carte:SetHeight(hCarte)

    -- pied : état de la flèche
    local tomtom = type(_G.TomTom) == "table" and type(_G.TomTom.AddWaypoint) == "function"
    local fleche
    if ns.db.arrowEnabled == false then
        fleche = L.ARROW_OFF
        f.point:SetColorTexture(C.sourd[1], C.sourd[2], C.sourd[3], 1)
    else
        fleche = tomtom and L.ARROW_TOMTOM or L.ARROW_GAME
        f.point:SetColorTexture(C.vert[1], C.vert[2], C.vert[3], 1)
    end
    f.etat:SetText(fleche .. " · " .. L.AUTO)
    f.bReglages.texte:SetText(L.SETTINGS)
    f.langue.texte:SetText(L.LANG_BUTTON or "EN")

    local h = 1 + H_ENTETE + H_GUIDE + MARGE + hCarte + 10 + 34 + 12
    if nS > 0 then h = h + 14 + nS * 21 + 4 end
    if hJournal > 0 then h = h + hJournal + 4 end
    h = h + H_PIED + 1
    f:SetHeight(h)
end

-- ---------------------------------------------------------------------------
-- 2. Mode réduit
-- ---------------------------------------------------------------------------

local function CreerMini()
    local m = CreateFrame("Frame", "EternalRoutesMini", UIParent, "BackdropTemplate")
    m:SetSize(330, 48)
    m:SetFrameStrata("MEDIUM")
    Fond(m, C.fond, C.bord, 0.97)
    Deplacable(m, "mini")
    Placer(m, "mini", "TOPRIGHT", -240, -200)
    m:Hide()
    mini = m

    local logo = CreateFrame("Button", nil, m)
    logo:SetSize(34, 34)
    logo:SetPoint("LEFT", 7, 0)
    local t = logo:CreateTexture(nil, "ARTWORK")
    t:SetAllPoints()
    t:SetTexture(TEX .. "logo")
    logo.aideCle = "EXPAND_TIP"
    logo:SetScript("OnEnter", Aide)
    logo:SetScript("OnLeave", function() GameTooltip:Hide() end)
    logo:SetScript("OnClick", function() Window.SetMini(false) end)
    local surbrillance = logo:CreateTexture(nil, "HIGHLIGHT")
    surbrillance:SetAllPoints()
    surbrillance:SetColorTexture(1, 0.85, 0.5, 0.18)

    -- retour à la fenêtre complète : bouton dédié, clic sur le logo, ou clic droit sur la barre
    local agrandir = Bouton(m, 30, 30, "+")
    agrandir:SetPoint("RIGHT", -8, 0)
    agrandir.texte:SetFont(POLICE, 16, "")
    agrandir.aideCle = "EXPAND_TIP"
    agrandir:SetScript("OnClick", function() Window.SetMini(false) end)
    m.agrandir = agrandir
    m:SetScript("OnMouseUp", function(_, bouton)
        if bouton == "RightButton" then Window.SetMini(false) end
    end)

    local valider = Bouton(m, 30, 30, nil, true, TEX .. "check_full")
    valider:SetPoint("RIGHT", agrandir, "LEFT", -6, 0)
    valider.aideCle = "VALIDATE"
    valider:SetScript("OnClick", function() ns.Engine.Advance() end)

    local fleche = m:CreateTexture(nil, "ARTWORK")
    fleche:SetTexture(FLECHE)
    fleche:SetSize(24, 24)
    fleche:SetPoint("RIGHT", valider, "LEFT", -8, 0)
    fleche:SetVertexColor(C.or_[1], C.or_[2], C.or_[3])
    fleche:SetDrawLayer("OVERLAY")
    fleche.ancre = { "RIGHT", valider, "LEFT", -8, 0 }
    m.fleche = fleche
    local icone = m:CreateTexture(nil, "ARTWORK")
    icone:SetSize(26, 26)
    icone:SetPoint("RIGHT", valider, "LEFT", -8, 0)
    icone:Hide()
    m.icone = icone

    local titre = Texte(m, 12, C.clair)
    titre:SetPoint("TOPLEFT", logo, "TOPRIGHT", 8, -2)
    titre:SetPoint("RIGHT", icone, "LEFT", -8, 0)
    titre:SetWordWrap(false)
    m.titre = titre

    local sous = Texte(m, 10, C.pale)
    sous:SetPoint("TOPLEFT", titre, "BOTTOMLEFT", 0, -4)
    sous:SetPoint("RIGHT", icone, "LEFT", -8, 0)
    sous:SetWordWrap(false)
    m.sous = sous

    local fondBarre = m:CreateTexture(nil, "ARTWORK")
    fondBarre:SetColorTexture(C.traitDoux[1], C.traitDoux[2], C.traitDoux[3], 1)
    fondBarre:SetPoint("BOTTOMLEFT", 1, 1)
    fondBarre:SetPoint("BOTTOMRIGHT", -1, 1)
    fondBarre:SetHeight(3)
    local barre = m:CreateTexture(nil, "OVERLAY")
    barre:SetColorTexture(C.or_[1], C.or_[2], C.or_[3], 1)
    barre:SetPoint("BOTTOMLEFT", 1, 1)
    barre:SetHeight(3)
    m.barre = barre

    local ecoule = 0
    m:SetScript("OnUpdate", function(self, dt)
        ecoule = ecoule + dt
        if ecoule < 0.1 then return end
        ecoule = 0
        local angle, dist = Window.Direction(self.etape)
        if angle then
            self.fleche:SetRotation(angle)
            self.fleche:Show()
        else
            self.fleche:Hide()
        end
        local texte = self.sousBase or ""
        if dist then
            texte = (texte ~= "" and (texte .. " · ") or "") .. Distance(dist)
        end
        if texte ~= self.sousTexte then
            self.sousTexte = texte
            self.sous:SetText(texte)
        end
    end)
end

local function RafraichirMini()
    local m = mini
    local guide = ns.Engine.GetActiveGuide()
    m.etape = nil
    m.sousBase = ""
    m.sousTexte = nil
    m:SetBackdropBorderColor(C.bord[1], C.bord[2], C.bord[3], 1)
    if not guide then
        m.titre:SetText(L.NO_GUIDE)
        m.sous:SetText("")
        m.barre:SetWidth(0.1)
        return
    end
    local n = #guide.steps
    local cur = ns.Engine.GetStepIndex()
    local step = ns.Engine.GetCurrentStep()
    m.barre:SetWidth(math.max(0.1, (m:GetWidth() - 2) * math.min(cur - 1, n) / math.max(n, 1)))
    if not step then
        m.titre:SetText(L.DONE)
        m.sous:SetText("")
        return
    end
    m.etape = step
    ModeBoussole(m.icone, m.fleche, step, 24, 14)
    local q = ns.Engine.GetPendingQuest(step)
    local ev = q and EtatVisuel(q, ns.Engine.GetQuestStatus(q))
    if ev == "cours" or ev == "pret" then
        local c = ETATS[ev].bord
        m:SetBackdropBorderColor(c[1], c[2], c[3], 1)
    end
    if q then
        m.titre:SetText(Action(q) .. " · " .. ns.Engine.QuestName(q))
        local base
        for _, o in ipairs(ns.Engine.GetObjectives(q)) do
            if not o.finished then
                base = NettoyerObjectif(o.text)
                if (o.numRequired or 0) > 0 then
                    base = base .. (" %d / %d"):format(o.numFulfilled or 0, o.numRequired)
                end
                break
            end
        end
        m.sousBase = base or LieuEtape(step)
    else
        m.titre:SetText(LieuEtape(step))
    end
    m.sous:SetText(m.sousBase)
end

-- ---------------------------------------------------------------------------
-- 3. Vue du parcours
-- ---------------------------------------------------------------------------

local lignesParcours = {}
local zonesOuvertes = {}

local function CreerParcours()
    local p = CreateFrame("Frame", "EternalRoutesRoute", UIParent, "BackdropTemplate")
    p:SetSize(380, 520)
    p:SetFrameStrata("DIALOG")
    p:SetToplevel(true)
    Fond(p, C.fond, C.bord, 0.98)
    Deplacable(p, "parcours")
    Placer(p, "parcours", "CENTER", -200, 260)
    p:Hide()
    tinsert(UISpecialFrames, "EternalRoutesRoute")
    vueParcours = p

    local e = EnTete(p, 36, 56)
    p.entete = e

    -- chiffres
    p.stats = {}
    local largeurStat = (380 - 28 - 16) / 3
    for k = 1, 3 do
        local s = CreateFrame("Frame", nil, p, "BackdropTemplate")
        s:SetSize(largeurStat, 44)
        s:SetPoint("TOPLEFT", 14 + (k - 1) * (largeurStat + 8), -68)
        Fond(s, C.carte)
        s.valeur = Texte(s, 15, C.clair)
        s.valeur:SetPoint("TOPLEFT", 8, -6)
        s.legende = Texte(s, 10, C.pale)
        s.legende:SetPoint("TOPLEFT", s.valeur, "BOTTOMLEFT", 0, -3)
        p.stats[k] = s
    end

    local scroll = CreateFrame("ScrollFrame", nil, p, "UIPanelScrollFrameTemplate")
    scroll:SetPoint("TOPLEFT", 14, -124)
    scroll:SetPoint("BOTTOMRIGHT", -32, 58)
    local contenu = CreateFrame("Frame", nil, scroll)
    contenu:SetSize(380 - 14 - 32, 1)
    scroll:SetScrollChild(contenu)
    p.scroll, p.contenu = scroll, contenu

    local bas = CreateFrame("Frame", nil, p, "BackdropTemplate")
    bas:SetPoint("BOTTOMLEFT", 1, 1)
    bas:SetPoint("BOTTOMRIGHT", -1, 1)
    bas:SetHeight(52)
    Fond(bas, C.entete)
    local tb = Trait(bas, C.trait)
    tb:SetPoint("TOPLEFT")
    tb:SetPoint("TOPRIGHT")
    local largeurBouton = (380 - 28 - 8) / 2
    local revenir = Bouton(bas, largeurBouton, 34, "")
    revenir:SetPoint("LEFT", 14, 0)
    revenir:SetScript("OnClick", function()
        ns.viewStep = nil
        Window.Refresh()
    end)
    p.revenir = revenir
    local fermer = Bouton(bas, largeurBouton, 34, "", true)
    fermer:SetPoint("RIGHT", -14, 0)
    fermer:SetScript("OnClick", function() p:Hide() end)
    p.fermerBas = fermer

    p:SetScript("OnShow", function()
        local guide = ns.Engine.GetActiveGuide()
        wipe(zonesOuvertes)
        if guide then
            local zi = ZonesDu(guide).index[ns.Engine.GetViewStep()]
            if zi then zonesOuvertes[zi] = true end
        end
        RemplirParcours(true)
    end)
end

local function LigneParcours(i)
    local b = lignesParcours[i]
    if b then return b end
    b = CreateFrame("Button", nil, vueParcours.contenu, "BackdropTemplate")
    Fond(b, C.fond, nil, 0)
    b.icone = b:CreateTexture(nil, "ARTWORK")
    b.icone:SetSize(14, 14)
    b.gauche = Texte(b, 12, C.clair)
    b.gauche:SetWordWrap(false)
    b.gauche:SetJustifyV("MIDDLE")
    b.droite = Texte(b, 11, C.pale)
    b.droite:SetJustifyH("RIGHT")
    b.droite:SetJustifyV("MIDDLE")
    b:SetScript("OnEnter", function(self)
        self:SetBackdropBorderColor(C.or_[1], C.or_[2], C.or_[3], 1)
    end)
    b:SetScript("OnLeave", function(self)
        self:SetBackdropBorderColor(self.bord[1], self.bord[2], self.bord[3], self.bordA or 0)
    end)
    lignesParcours[i] = b
    return b
end

function RemplirParcours(defiler)
    local p = vueParcours
    local guide = ns.Engine.GetActiveGuide()
    local e = p.entete
    e.titre:SetText(L.ROUTE)
    p.revenir.texte:SetText(L.BACK_TO_CURRENT)
    p.fermerBas.texte:SetText(L.CLOSE)

    local n, y, yCourant = 0, 0, nil
    local largeur = p.contenu:GetWidth()

    if not guide then
        e.sous:SetText(L.NO_GUIDE)
        for k = 1, 3 do
            p.stats[k].valeur:SetText("-")
            p.stats[k].legende:SetText("")
        end
    else
        local zones = ZonesDu(guide)
        local total = #guide.steps
        local cur = ns.Engine.GetStepIndex()
        local vue = ns.Engine.GetViewStep()
        e.sous:SetText(ns.Engine.NomGuide(guide) .. " · EternalRoutes")

        p.stats[1].valeur:SetText(("%d %%"):format(math.floor(math.min(cur - 1, total) / math.max(total, 1) * 100)))
        p.stats[1].legende:SetText(L.STAT_ROUTE)
        p.stats[2].valeur:SetText(("%d / %d"):format(zones.index[math.min(cur, total)] or #zones.liste, #zones.liste))
        p.stats[2].legende:SetText(L.STAT_ZONES)
        p.stats[3].valeur:SetText(L.LEVEL_SHORT:format(UnitLevel("player") or 1))
        p.stats[3].legende:SetText(L.STAT_LEVEL)

        local function PlacerLigne(b, h, retrait)
            b:ClearAllPoints()
            b:SetPoint("TOPLEFT", retrait, y)
            b:SetSize(largeur - retrait, h)
            y = y - h - 4
        end

        for zi, z in ipairs(zones.liste) do
            local faits = 0
            for _, i in ipairs(z.etapes) do
                if i < cur then faits = faits + 1 end
            end
            local tout = (faits == #z.etapes)
            local courante = (zones.index[math.min(cur, total)] == zi) and cur <= total

            n = n + 1
            local b = LigneParcours(n)
            PlacerLigne(b, 28, 0)
            b.bord = courante and C.bordClair or C.traitDoux
            b.bordA = 1
            Fond(b, courante and C.carteHaut or (tout and { 0.110, 0.165, 0.125 } or C.carte), b.bord)
            b.icone:ClearAllPoints()
            b.icone:SetPoint("LEFT", 8, 0)
            b.icone:SetTexture(TEX .. (tout and "check_full" or "check_outline"))
            b.icone:Show()
            b.gauche:ClearAllPoints()
            b.gauche:SetPoint("LEFT", 28, 0)
            b.gauche:SetPoint("RIGHT", -64, 0)
            b.gauche:SetFont(POLICE, 12, "")
            b.gauche:SetText((zonesOuvertes[zi] and "-  " or "+  ") .. ns.Engine.NomZone(z.premiere))
            Teinte(b.gauche, courante and C.or_ or (tout and C.vertClair or C.clair))
            b.droite:ClearAllPoints()
            b.droite:SetPoint("RIGHT", -8, 0)
            b.droite:SetText(("%d / %d"):format(faits, #z.etapes))
            Teinte(b.droite, courante and C.or_ or C.pale)
            b:SetScript("OnClick", function()
                zonesOuvertes[zi] = not zonesOuvertes[zi]
                RemplirParcours(false)
            end)
            b:Show()

            if zonesOuvertes[zi] then
                for _, i in ipairs(z.etapes) do
                    local s = guide.steps[i]
                    n = n + 1
                    local l = LigneParcours(n)
                    if i == vue then yCourant = y end
                    PlacerLigne(l, 20, 12)
                    local fait = i < cur
                    l.bord = (i == vue) and C.bordClair or C.fond
                    l.bordA = (i == vue) and 1 or 0
                    Fond(l, (i == cur) and C.survol or C.fond, nil, (i == cur) and 1 or 0)
                    l:SetBackdropBorderColor(l.bord[1], l.bord[2], l.bord[3], l.bordA)
                    if fait then
                        l.icone:ClearAllPoints()
                        l.icone:SetPoint("LEFT", 4, 0)
                        l.icone:SetTexture(TEX .. "check_full")
                        l.icone:Show()
                    else
                        l.icone:Hide()
                    end
                    l.gauche:ClearAllPoints()
                    l.gauche:SetPoint("LEFT", 22, 0)
                    l.gauche:SetPoint("RIGHT", -4, 0)
                    l.gauche:SetFont(POLICE, 11, "")
                    l.gauche:SetText(("#%d  %s"):format(i, ResumeEtape(s)))
                    local couleur = fait and C.sourd or ((i == cur) and C.or_ or { 0.867, 0.816, 0.722 })
                    Teinte(l.gauche, couleur, ns.Engine.StepApplies(s) and 1 or 0.45)
                    l.droite:SetText("")
                    l:SetScript("OnClick", function()
                        ns.viewStep = (i ~= cur) and i or nil
                        if ns.db.miniMode then
                            Window.SetMini(false)
                        else
                            fenetre:Show()
                            if ns.db then ns.db.shown = true end
                        end
                        Window.Refresh()
                    end)
                    l:Show()
                end
            end
        end
    end

    for k = n + 1, #lignesParcours do lignesParcours[k]:Hide() end
    p.contenu:SetHeight(math.max(-y, 1))
    if defiler then
        local cible = yCourant and math.max(0, -yCourant - 80) or 0
        p.scroll:SetVerticalScroll(0)
        C_Timer.After(0, function()
            local maxi = p.scroll:GetVerticalScrollRange() or 0
            p.scroll:SetVerticalScroll(math.min(cible, maxi))
        end)
    end
end

-- ---------------------------------------------------------------------------
-- 4. Réglages
-- ---------------------------------------------------------------------------

local function AppliquerTaille()
    local s = (ns.db and ns.db.scale) or 1
    if fenetre then fenetre:SetScale(s) end
    if mini then mini:SetScale(s) end
end

StaticPopupDialogs["ETERNALROUTES_RESET"] = {
    text = "",
    button1 = YES,
    button2 = NO,
    OnAccept = function()
        ns.db.stepIndex = 1
        ns.viewStep = nil
        ns.Engine.Refresh()
    end,
    timeout = 0,
    whileDead = true,
    hideOnEscape = true,
    preferredIndex = 3,
}

local function CreerReglages()
    local r = CreateFrame("Frame", "EternalRoutesOptions", UIParent, "BackdropTemplate")
    r:SetSize(340, 470)
    r:SetFrameStrata("DIALOG")
    r:SetToplevel(true)
    Fond(r, C.fond, C.bord, 0.98)
    Deplacable(r, "reglages")
    Placer(r, "reglages", "CENTER", 220, 120)
    r:Hide()
    tinsert(UISpecialFrames, "EternalRoutesOptions")
    reglages = r

    local e = EnTete(r, 36, 56)
    e.sous:SetText("EternalRoutes · /er")
    r.entete = e

    local y = -72
    local function Section(cle)
        local fs = Texte(r, 10, C.sourd)
        fs:SetPoint("TOPLEFT", 16, y)
        Libelle(fs, cle)
        y = y - 18
    end
    r.cases = {}
    local function AjoutCase(cle, lire, ecrire)
        local c = Case(r, cle, lire, ecrire)
        c:SetPoint("TOPLEFT", 16, y)
        c:SetPoint("RIGHT", -16, 0)
        r.cases[#r.cases + 1] = c
        y = y - 26
        return c
    end

    -- parcours
    Section("OPT_ROUTE")
    local guide = Texte(r, 12, C.texte)
    guide:SetPoint("TOPLEFT", 16, y - 4)
    guide:SetPoint("RIGHT", -110, 0)
    guide:SetWordWrap(false)
    r.guide = guide
    local changer = Bouton(r, 90, 24, "")
    changer:SetPoint("TOPRIGHT", -16, y)
    changer:SetScript("OnClick", function()
        if ns.db.miniMode then Window.SetMini(false) end
        fenetre:Show()
        if ns.db then ns.db.shown = true end
        Window.Refresh()
        OuvrirListe()
    end)
    r.changer = changer
    y = y - 38

    -- affichage
    Section("OPT_DISPLAY")
    AjoutCase("OPT_ARROW", function() return ns.db.arrowEnabled ~= false end, function(v)
        ns.db.arrowEnabled = v
        if ns.TomTomBridge and ns.TomTomBridge.Refresh then ns.TomTomBridge.Refresh() end
        Window.Refresh()
    end)
    AjoutCase("OPT_NEXT", function() return ns.db.showNext ~= false end, function(v)
        ns.db.showNext = v
        Window.Refresh()
    end)
    AjoutCase("OPT_MINI", function() return ns.db.miniMode == true end, function(v)
        Window.SetMini(v)
    end)

    local taille = Texte(r, 12, C.texte)
    taille:SetPoint("TOPLEFT", 16, y - 5)
    r.taille = taille
    local plus = Bouton(r, 26, 24, "+")
    plus:SetPoint("TOPRIGHT", -16, y)
    local moins = Bouton(r, 26, 24, "-")
    moins:SetPoint("RIGHT", plus, "LEFT", -6, 0)
    local function Taille(delta)
        local s = (ns.db.scale or 1) + delta
        s = math.max(0.7, math.min(1.5, math.floor(s * 10 + 0.5) / 10))
        ns.db.scale = s
        AppliquerTaille()
        MajReglages()
    end
    plus:SetScript("OnClick", function() Taille(0.1) end)
    moins:SetScript("OnClick", function() Taille(-0.1) end)
    y = y - 32

    local langue = Texte(r, 12, C.texte)
    langue:SetPoint("TOPLEFT", 16, y - 5)
    r.langue = langue
    local bLangue = Bouton(r, 90, 24, "")
    bLangue:SetPoint("TOPRIGHT", -16, y)
    bLangue:SetScript("OnClick", function() ns.SetLang(ns.IsEnglish() and "fr" or "en") end)
    r.bLangue = bLangue
    y = y - 40

    -- automatismes
    Section("OPT_AUTO")
    local note = Texte(r, 11, C.pale)
    note:SetPoint("TOPLEFT", 16, y)
    note:SetPoint("RIGHT", -16, 0)
    note:SetWordWrap(true)
    r.note = note

    -- boutons du bas
    local bas = CreateFrame("Frame", nil, r, "BackdropTemplate")
    bas:SetPoint("BOTTOMLEFT", 1, 1)
    bas:SetPoint("BOTTOMRIGHT", -1, 1)
    bas:SetHeight(52)
    Fond(bas, C.entete)
    local tb = Trait(bas, C.trait)
    tb:SetPoint("TOPLEFT")
    tb:SetPoint("TOPRIGHT")
    local lb = (340 - 28 - 8) / 2
    local reinit = Bouton(bas, lb, 34, "")
    reinit:SetPoint("LEFT", 14, 0)
    reinit:SetScript("OnClick", function()
        StaticPopupDialogs["ETERNALROUTES_RESET"].text = L.RESET_CONFIRM
        StaticPopup_Show("ETERNALROUTES_RESET")
    end)
    r.reinit = reinit
    local fermer = Bouton(bas, lb, 34, "", true)
    fermer:SetPoint("RIGHT", -14, 0)
    fermer:SetScript("OnClick", function() r:Hide() end)
    r.fermerBas = fermer

    r:SetScript("OnShow", function() MajReglages() end)
end

function MajReglages()
    local r = reglages
    if not r then return end
    r.entete.titre:SetText(L.SETTINGS)
    local guide = ns.Engine and ns.Engine.GetActiveGuide()
    r.guide:SetText(guide and ns.Engine.NomGuide(guide) or L.NO_GUIDE)
    r.changer.texte:SetText(L.CHANGE)
    for _, c in ipairs(r.cases) do c.Maj() end
    r.taille:SetText(L.OPT_SCALE:format(math.floor(((ns.db and ns.db.scale) or 1) * 100 + 0.5)))
    r.langue:SetText(L.OPT_LANG)
    r.bLangue.texte:SetText(L.OPT_LANG_BUTTON)
    r.note:SetText(L.OPT_NOTE)
    r.reinit.texte:SetText(L.RESET)
    r.fermerBas.texte:SetText(L.CLOSE)
end

-- ---------------------------------------------------------------------------
-- API
-- ---------------------------------------------------------------------------

local function Creer()
    if fenetre then return end
    CreerFenetre()
    CreerMini()
    CreerParcours()
    CreerReglages()
    AppliquerTaille()
end

local derniereVue = false
function Window.Refresh()
    if not fenetre or not ns.Engine then return end
    -- en consultation (< >, ensuite, vue du parcours), TomTom suit l'étape affichée
    if ns.viewStep ~= derniereVue then
        derniereVue = ns.viewStep
        if ns.TomTomBridge and ns.TomTomBridge.Refresh then ns.TomTomBridge.Refresh() end
    end
    Window.Scanner()
    RafraichirFenetre()
    RafraichirMini()
    if vueParcours:IsShown() then RemplirParcours(false) end
    if reglages:IsShown() then MajReglages() end
end

function Window.SetMini(actif)
    Creer()
    ns.db.miniMode = actif and true or false
    ns.db.shown = true
    if ns.db.miniMode then
        fenetre:Hide()
        mini:Show()
    else
        mini:Hide()
        fenetre:Show()
    end
    Window.Refresh()
end

function Window.Toggle()
    Creer()
    local cadre = ns.db.miniMode and mini or fenetre
    if cadre:IsShown() then
        cadre:Hide()
        ns.db.shown = false
    else
        cadre:Show()
        ns.db.shown = true
        Window.Refresh()
    end
end

function Window.ToggleRoute()
    Creer()
    vueParcours:SetShown(not vueParcours:IsShown())
end

function Window.ToggleOptions()
    Creer()
    reglages:SetShown(not reglages:IsShown())
end

function Window.OnLanguageChanged()
    if not fenetre then return end
    for _, l in ipairs(libelles) do
        l.fs:SetText(L[l.cle] and L[l.cle]:format(unpack(l.args)) or l.cle)
    end
    fenetre.liste:Hide()
    Window.Refresh()
    -- l'intitulé de la flèche TomTom suit la langue
    if ns.TomTomBridge and ns.TomTomBridge.Refresh then ns.TomTomBridge.Refresh() end
end

function Window.OnLogin()
    Creer()
    if ns.db.shown ~= false then
        if ns.db.miniMode then mini:Show() else fenetre:Show() end
    end
    Window.Refresh()
end

-- accès pour les tests hors du jeu
Window._test = { lignesQuete = lignesQuete, lignesJournal = lignesJournal, ETATS = ETATS }
