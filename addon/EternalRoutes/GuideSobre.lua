--[[----------------------------------------------------------------------------
    EternalRoutes — GuideSobre.lua
    Fenêtre sobre et transparente (maquette « EternalRoutes · fenêtre épurée », version A) : l'étape en cours,
    une ligne par tâche, colorée selon son état, puis « Ensuite » et une fine barre de progression.

      rouge  : à faire, rien d'avancé          orange : en cours (un objectif commencé)
      vert   : fait, ou prêt à rendre          bleu   : passage (voyage, entraîneur)

    La couleur n'est jamais seule : pictogramme, compte (2/7) et mot « fait » l'accompagnent.
    C'est la fenêtre par défaut ; /er style classique rend l'ancienne, /er style sobre la remet.
    /er opacite <20-95> règle la transparence du fond. Le mode réduit (une ligne) reste celui de l'addon.
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local L = ns.L
local Window = ns.Window
local Sobre = {}
ns.Sobre = Sobre

local BLANC  = "Interface\\Buttons\\WHITE8x8"
local POLICE = "Fonts\\FRIZQT__.TTF"
local LARGEUR = 330

local COULEUR = {
    rouge  = { 0.75, 0.15, 0.15, 0.62 },
    orange = { 0.80, 0.47, 0.08, 0.62 },
    vert   = { 0.18, 0.55, 0.27, 0.45 },
    bleu   = { 0.24, 0.43, 0.75, 0.55 },
}
local TEXTE_VERT = { 0.85, 0.95, 0.87 }

local ICONE = {
    prendre   = "Interface\\GossipFrame\\AvailableQuestIcon",
    rendre    = "Interface\\GossipFrame\\ActiveQuestIcon",
    entrainer = "Interface\\GossipFrame\\TrainerGossipIcon",
    voyage    = "Interface\\GossipFrame\\TaxiGossipIcon",
    vaincre   = "Interface\\CURSOR\\Attack",
    ramasser  = "Interface\\CURSOR\\Pickup",
    fait      = "Interface\\RAIDFRAME\\ReadyCheck-Ready",
    foyer     = "Interface\\Icons\\INV_Misc_Rune_01",
}
local LOGO = "Interface\\AddOns\\EternalRoutes\\Textures\\logo"
local PIERRE = 6948 -- pierre de foyer

local function Actif() return ns.db and ns.db.style ~= "classique" end
Sobre.Actif = Actif

local function Texte(parent, taille, r, g, b, gras)
    local fs = parent:CreateFontString(nil, "OVERLAY")
    fs:SetFont(POLICE, taille, gras and "" or "")
    fs:SetShadowOffset(1, -1)
    fs:SetShadowColor(0, 0, 0, 0.9)
    fs:SetJustifyH("LEFT")
    fs:SetTextColor(r or 0.95, g or 0.95, b or 0.95)
    return fs
end

local function BoutonIcone(parent, taille, texture, aide, survolCouleur)
    local b = CreateFrame("Button", nil, parent)
    b:SetSize(taille + 10, taille + 10)
    b.icone = b:CreateTexture(nil, "ARTWORK")
    b.icone:SetSize(taille, taille)
    b.icone:SetPoint("CENTER")
    if texture then b.icone:SetTexture(texture) end
    local h = b:CreateTexture(nil, "HIGHLIGHT")
    h:SetAllPoints()
    h:SetColorTexture(1, 1, 1, 0.08)
    b:SetScript("OnEnter", function(self)
        if not aide then return end
        GameTooltip:SetOwner(self, "ANCHOR_TOP")
        GameTooltip:SetText(aide, 1, 1, 1, 1, true)
        GameTooltip:Show()
    end)
    b:SetScript("OnLeave", function() GameTooltip:Hide() end)
    return b
end

local function BoutonTexte(parent, texte, aide)
    local b = BoutonIcone(parent, 14, nil, aide)
    b:SetSize(22, 22)
    local fond = b:CreateTexture(nil, "BACKGROUND")
    fond:SetAllPoints()
    fond:SetColorTexture(1, 1, 1, 0.07)
    b.texte = Texte(b, 13, 0.92, 0.92, 0.92)
    b.texte:SetPoint("CENTER", 0, 1)
    b.texte:SetText(texte)
    return b
end

-- ---------------------------------------------------------------------------
-- Création
-- ---------------------------------------------------------------------------

local f, lignes, consignes = nil, {}, {}

local function Opacite()
    local o = tonumber(ns.db and ns.db.opacite) or 55
    return math.min(95, math.max(20, o)) / 100
end

function Sobre.AppliquerOpacite()
    if f then f:SetBackdropColor(0.03, 0.035, 0.047, Opacite()) end
end

local function Creer()
    if f then return f end
    f = CreateFrame("Frame", "EternalRoutesSobre", UIParent, "BackdropTemplate")
    f:SetWidth(LARGEUR)
    f:SetHeight(120)
    f:SetFrameStrata("MEDIUM")
    f:SetClampedToScreen(true)
    f:SetBackdrop({ bgFile = BLANC, edgeFile = BLANC, edgeSize = 1 })
    f:SetBackdropBorderColor(1, 1, 1, 0.10)
    Sobre.AppliquerOpacite()
    f:SetMovable(true)
    f:EnableMouse(true)
    f:RegisterForDrag("LeftButton")
    f:SetScript("OnDragStart", function(self) self:StartMoving() end)
    f:SetScript("OnDragStop", function(self)
        self:StopMovingOrSizing()
        ns.db.sobreL, ns.db.sobreH = self:GetLeft(), self:GetTop()
        self:ClearAllPoints()
        self:SetPoint("TOPLEFT", UIParent, "BOTTOMLEFT", ns.db.sobreL, ns.db.sobreH)
    end)
    f:ClearAllPoints()
    if ns.db.sobreL and ns.db.sobreH then
        f:SetPoint("TOPLEFT", UIParent, "BOTTOMLEFT", ns.db.sobreL, ns.db.sobreH)
    else
        f:SetPoint("TOPRIGHT", UIParent, "TOPRIGHT", -40, -240)
    end
    f:Hide()

    -- en-tête : parcours, nom de la route, tracé, réglages, réduire, fermer
    local logo = CreateFrame("Frame", nil, f)
    logo:SetSize(24, 24)
    logo:SetPoint("TOPLEFT", 4, -3)
    logo.tex = logo:CreateTexture(nil, "ARTWORK")
    logo.tex:SetAllPoints()
    logo.tex:SetTexture(LOGO)
    logo:EnableMouse(true)
    logo:SetScript("OnEnter", function(self)
        GameTooltip:SetOwner(self, "ANCHOR_TOP")
        GameTooltip:SetText(L.SOBRE_LOGO, 1, 0.82, 0.3)
        GameTooltip:Show()
    end)
    logo:SetScript("OnLeave", function() GameTooltip:Hide() end)
    f.logo = logo

    local menu = BoutonIcone(f, 14, "Interface\\Icons\\INV_Misc_Map_01", L.SOBRE_MENU)
    menu:SetPoint("LEFT", logo, "RIGHT", 0, 0)
    menu:SetScript("OnClick", function() Window.ToggleRoute() end)
    f.menu = menu

    local fermer = BoutonTexte(f, "x", L.SOBRE_CLOSE)
    fermer:SetPoint("TOPRIGHT", -5, -5)
    fermer:SetScript("OnClick", function() f:Hide(); ns.db.shown = false end)
    local reduire = BoutonTexte(f, "-", L.MINI_TIP)
    reduire:SetPoint("RIGHT", fermer, "LEFT", -4, 0)
    reduire:SetScript("OnClick", function() Window.SetMini(true) end)
    local reglages = BoutonIcone(f, 14, "Interface\\Buttons\\UI-OptionsButton", L.SOBRE_OPTIONS)
    reglages:SetPoint("RIGHT", reduire, "LEFT", -2, 0)
    reglages:SetScript("OnClick", function() Window.ToggleOptions() end)
    local trace = BoutonIcone(f, 14, "Interface\\Icons\\Ability_Hunter_Pathfinding", L.SOBRE_TRACE)
    trace:SetPoint("RIGHT", reglages, "LEFT", -2, 0)
    trace:SetScript("OnClick", function()
        if ns.Trace then ns.Trace.Commande() end
        Sobre.Rafraichir()
    end)
    f.trace = trace

    local titre = Texte(f, 12, 0.95, 0.95, 0.95)
    titre:SetPoint("LEFT", menu, "RIGHT", 2, 0)
    titre:SetPoint("RIGHT", trace, "LEFT", -4, 0)
    titre:SetWordWrap(false)
    f.titre = titre

    local trait = f:CreateTexture(nil, "ARTWORK")
    trait:SetColorTexture(1, 1, 1, 0.08)
    trait:SetHeight(1)
    trait:SetPoint("TOPLEFT", 1, -30)
    trait:SetPoint("TOPRIGHT", -1, -30)

    -- navigation : ‹ 47 / 212 ›   lieu · distance
    local prec = BoutonTexte(f, "<", L.PREV_TIP)
    prec:SetPoint("TOPLEFT", 8, -35)
    prec:SetScript("OnClick", function()
        ns.viewStep = math.max(1, ns.Engine.GetViewStep() - 1)
        Window.Refresh()
    end)
    local numero = Texte(f, 12, 1, 1, 1)
    numero:SetPoint("LEFT", prec, "RIGHT", 6, 0)
    f.numero = numero
    local total = Texte(f, 12, 0.6, 0.6, 0.6)
    total:SetPoint("LEFT", numero, "RIGHT", 3, 0)
    f.total = total
    local suiv = BoutonTexte(f, ">", L.NEXT_TIP)
    suiv:SetPoint("LEFT", total, "RIGHT", 6, 0)
    suiv:SetScript("OnClick", function()
        local g = ns.Engine.GetActiveGuide()
        ns.viewStep = math.min(g and #g.steps or 1, ns.Engine.GetViewStep() + 1)
        Window.Refresh()
    end)
    f.suiv = suiv
    local lieu = Texte(f, 11, 0.62, 0.62, 0.62)
    lieu:SetPoint("LEFT", suiv, "RIGHT", 8, 0)
    lieu:SetPoint("RIGHT", f, "RIGHT", -10, 0)
    lieu:SetJustifyH("RIGHT")
    lieu:SetWordWrap(false)
    f.lieu = lieu

    -- consultation d'une autre étape : un clic pour revenir à l'étape en cours
    local retour = CreateFrame("Button", nil, f)
    retour:SetHeight(16)
    retour.texte = Texte(retour, 10, 1, 0.82, 0.3)
    retour.texte:SetPoint("LEFT")
    retour:SetScript("OnClick", function() ns.viewStep = nil; Window.Refresh() end)
    retour:Hide()
    f.retour = retour

    -- « Ensuite » et barre de progression
    f.sepSuite = f:CreateTexture(nil, "ARTWORK")
    f.sepSuite:SetColorTexture(1, 1, 1, 0.06)
    f.sepSuite:SetHeight(1)
    f.suite = Texte(f, 11, 0.6, 0.6, 0.6)
    f.suite:SetWordWrap(true)
    f.fondBarre = f:CreateTexture(nil, "ARTWORK")
    f.fondBarre:SetColorTexture(1, 1, 1, 0.08)
    f.fondBarre:SetHeight(4)
    f.fondBarre:SetPoint("BOTTOMLEFT", 1, 1)
    f.fondBarre:SetPoint("BOTTOMRIGHT", -1, 1)
    f.barre = f:CreateTexture(nil, "OVERLAY")
    f.barre:SetColorTexture(0.25, 0.75, 0.37, 1)
    f.barre:SetHeight(4)
    f.barre:SetPoint("BOTTOMLEFT", 1, 1)

    -- pierre de foyer : un clic l'utilise (bouton sécurisé du jeu, comme une barre d'action)
    local ok, pierre = pcall(CreateFrame, "Button", "EternalRoutesSobreFoyer", f, "SecureActionButtonTemplate")
    if ok and pierre then
        pierre:SetSize(20, 20)
        pierre:SetAttribute("type", "item")
        pierre:SetAttribute("item", "item:" .. PIERRE)
        if pierre.RegisterForClicks then pierre:RegisterForClicks("AnyUp", "AnyDown") end
        pierre.icone = pierre:CreateTexture(nil, "ARTWORK")
        pierre.icone:SetAllPoints()
        pierre.icone:SetTexture(ICONE.foyer)
        local h = pierre:CreateTexture(nil, "HIGHLIGHT")
        h:SetAllPoints()
        h:SetColorTexture(1, 1, 1, 0.2)
        pierre:SetScript("OnEnter", function(self)
            GameTooltip:SetOwner(self, "ANCHOR_TOP")
            GameTooltip:SetText(L.SOBRE_HEARTH, 1, 1, 1)
            GameTooltip:Show()
        end)
        pierre:SetScript("OnLeave", function() GameTooltip:Hide() end)
        pierre:Hide()
        f.pierre = pierre
    end

    -- distance de l'étape, mise à jour en continu
    local ecoule = 0
    f:SetScript("OnUpdate", function(self, dt)
        ecoule = ecoule + dt
        if ecoule < 0.25 then return end
        ecoule = 0
        -- « a and f() » ne garde que la première valeur de f : la distance (deuxième valeur) était toujours perdue.
        local dist
        if Window.Direction then dist = select(2, Window.Direction(self.etape)) end
        local t = self.lieuBase or ""
        if dist then t = (t ~= "" and (t .. " · ") or "") .. L.DIST:format(math.floor(dist + 0.5)) end
        if t ~= self.lieuTexte then self.lieuTexte = t; self.lieu:SetText(t) end
    end)
    return f
end

local function Ligne(i)
    local r = lignes[i]
    if r then return r end
    r = CreateFrame("Frame", nil, f)
    r:SetHeight(24)
    r.fond = r:CreateTexture(nil, "BACKGROUND")
    r.fond:SetAllPoints()
    r.icone = r:CreateTexture(nil, "ARTWORK")
    r.icone:SetSize(14, 14)
    r.icone:SetPoint("LEFT", 6, 0)
    r.compte = Texte(r, 12, 1, 1, 1)
    r.compte:SetPoint("RIGHT", -8, 0)
    r.compte:SetJustifyH("RIGHT")
    r.texte = Texte(r, 12, 1, 1, 1)
    r.texte:SetPoint("LEFT", r.icone, "RIGHT", 7, 0)
    r.texte:SetPoint("RIGHT", r.compte, "LEFT", -6, 0)
    r.texte:SetWordWrap(false)
    r:EnableMouse(true)
    r:SetScript("OnEnter", function(self)
        if not self.q then return end
        GameTooltip:SetOwner(self, "ANCHOR_LEFT")
        GameTooltip:AddLine(ns.Engine.QuestName(self.q), 1, 0.82, 0.3)
        local desc = ns.Engine.GetQuestDescription and ns.Engine.GetQuestDescription(self.q)
        if desc then GameTooltip:AddLine(desc, 1, 1, 1, true) end
        GameTooltip:Show()
    end)
    r:SetScript("OnLeave", function() GameTooltip:Hide() end)
    lignes[i] = r
    return r
end

local function Consigne(i)
    local c = consignes[i]
    if c then return c end
    c = Texte(f, 11, 0.72, 0.72, 0.72)
    c:SetWordWrap(true)
    consignes[i] = c
    return c
end

-- ---------------------------------------------------------------------------
-- Tâches d'une étape : une ligne par quête à prendre ou rendre, une par objectif à faire
-- ---------------------------------------------------------------------------

local function Nettoyer(t)
    local s = tostring(t or ""):gsub("|4[^;]*;", "")
    s = s:gsub("%s*:%s*%d+%s*/%s*%d+.*$", "")
    return s
end

local function Verbe(q) return L["ACT_" .. tostring(q.kind)] or tostring(q.kind) end

--- Lignes d'une quête : { texte, compte, couleur, icone }.
function Sobre.Taches(q)
    local etat = ns.Engine.GetQuestStatus(q)
    local nom = ns.Engine.QuestName(q)
    local out = {}
    if q.kind == "voyage" or q.kind == "entrainer" or q.kind == "foyer" then
        local fait = etat == "done"
        out[1] = { texte = nom, compte = fait and L.SOBRE_DONE or "", couleur = fait and "vert" or "bleu", icone = ICONE[q.kind],
            pierre = q.kind == "foyer" and q.action == "utiliser" and not fait }
    elseif q.kind == "prendre" then
        local pris = etat ~= "available" and etat ~= "unknown"
        out[1] = { texte = Verbe(q) .. " « " .. nom .. " »", compte = pris and L.SOBRE_DONE or "", couleur = pris and "vert" or "rouge",
            icone = pris and ICONE.fait or ICONE.prendre }
    elseif q.kind == "rendre" then
        local couleur = (etat == "complete" or etat == "done") and "vert" or (etat == "in_progress" and "orange") or "rouge"
        local compte = etat == "done" and L.SOBRE_DONE or (etat == "complete" and L.SOBRE_READY) or ""
        out[1] = { texte = Verbe(q) .. " « " .. nom .. " »", compte = compte, couleur = couleur, icone = ICONE.rendre }
    else
        local objs = ns.Engine.GetObjectives(q) or {}
        for _, o in ipairs(objs) do
            local n, req = o.numFulfilled or 0, o.numRequired or 0
            local couleur = (o.finished or etat == "complete" or etat == "done") and "vert" or (n > 0 and "orange") or "rouge"
            local texte = Nettoyer(o.text)
            if texte == "" then texte = nom end
            local tuer = texte:find("Vaincre") or texte:find("tué") or texte:find("[Ss]lain") or texte:find("[Kk]ill")
            out[#out + 1] = { texte = texte, compte = req > 0 and ("%d/%d"):format(n, req) or (o.finished and L.SOBRE_DONE or ""),
                couleur = couleur, icone = couleur == "vert" and ICONE.fait or (tuer and ICONE.vaincre or ICONE.ramasser) }
        end
        if #out == 0 then
            local couleur = (etat == "complete" or etat == "done") and "vert" or (etat == "in_progress" and "orange") or "rouge"
            out[1] = { texte = Verbe(q) .. " « " .. nom .. " »", compte = "", couleur = couleur, icone = ICONE.vaincre }
        end
    end
    return out
end

local function Suite(guide, index)
    local s = guide.steps[index]
    if not s then return nil end
    local quetes = ns.Engine.QuetesApplicables and ns.Engine.QuetesApplicables(s) or (s.quests or {})
    local q = quetes[1]
    local quoi = q and (Verbe(q) .. " « " .. ns.Engine.QuestName(q) .. " »") or tostring(s.text or "")
    if q and #quetes > 1 then quoi = quoi .. (" +%d"):format(#quetes - 1) end
    local ou = ns.Engine.NomLieu(s)
    return L.SOBRE_NEXT:format(quoi .. ((ou and ou ~= "") and (" · " .. ou) or ""))
end

-- ---------------------------------------------------------------------------
-- Rafraîchissement
-- ---------------------------------------------------------------------------

function Sobre.Rafraichir()
    if not f or not f:IsShown() then return end
    local guide = ns.Engine.GetActiveGuide()
    local y = -60
    local nL, nC = 0, 0
    f.etape, f.lieuBase, f.lieuTexte = nil, "", nil
    f.trace.icone:SetVertexColor(1, 1, 1, (ns.db.traceCarte ~= false or ns.db.traceMini ~= false) and 1 or 0.35)
    f.retour:Hide()
    local pierreSur
    if not guide then
        f.titre:SetText(L.CHOOSE_GUIDE)
        f.numero:SetText("")
        f.total:SetText("")
        f.lieu:SetText("")
        f.suite:SetText(L.NO_GUIDE)
    else
        local n = #guide.steps
        local cur = ns.Engine.GetStepIndex()
        local vue = ns.Engine.GetViewStep()
        local step = (cur <= n) and guide.steps[vue] or nil
        if ns.viewStep and guide.steps[ns.viewStep] then step = guide.steps[ns.viewStep] end
        f.titre:SetText(ns.Engine.NomGuide(guide))
        f.numero:SetText(tostring(math.min(vue, n)))
        f.total:SetText("/ " .. n)
        f.barre:SetWidth(math.max(0.1, (LARGEUR - 2) * math.min(cur - 1, n) / math.max(n, 1)))
        if ns.viewStep and vue ~= cur then
            f.retour.texte:SetText(L.SOBRE_BACK:format(math.min(cur, n)))
            f.retour:SetWidth((f.retour.texte:GetStringWidth() or 0) + 4)
            f.retour:ClearAllPoints()
            f.retour:SetPoint("TOPLEFT", 10, y)
            f.retour:Show()
            y = y - 16
        end
        if not step then
            f.lieuBase = ""
            f.lieu:SetText("")
            f.suite:SetText(L.DONE)
        else
            f.etape = step
            f.lieuBase = ns.Engine.NomLieu(step) or ns.Engine.NomZone(step) or ""
            f.lieu:SetText(f.lieuBase)
            local quetes = ns.Engine.QuetesApplicables and ns.Engine.QuetesApplicables(step) or (step.quests or {})
            for _, q in ipairs(quetes) do
                for _, t in ipairs(Sobre.Taches(q)) do
                    nL = nL + 1
                    local r = Ligne(nL)
                    r.q = q
                    local c = COULEUR[t.couleur] or COULEUR.rouge
                    r.fond:SetColorTexture(c[1], c[2], c[3], c[4])
                    r.icone:SetTexture(t.icone)
                    r.texte:SetText(t.texte)
                    r.compte:SetText(t.compte or "")
                    local tc = (t.couleur == "vert") and TEXTE_VERT or { 1, 1, 1 }
                    r.texte:SetTextColor(tc[1], tc[2], tc[3])
                    r.compte:SetTextColor(tc[1], tc[2], tc[3])
                    r:ClearAllPoints()
                    r:SetPoint("TOPLEFT", 5, y)
                    r:SetPoint("TOPRIGHT", -5, y)
                    r:Show()
                    if t.pierre then pierreSur = r end
                    y = y - 26
                end
                -- une consigne par quête, en gris sous ses lignes
                local etat = ns.Engine.GetQuestStatus(q)
                if etat ~= "done" and etat ~= "complete" then
                    local actions = ns.Engine.ActionsEtape and ns.Engine.ActionsEtape(q, ns.Engine.GetObjectives(q)) or {}
                    if actions[1] then
                        nC = nC + 1
                        local c = Consigne(nC)
                        c:ClearAllPoints()
                        c:SetPoint("TOPLEFT", 32, y)
                        c:SetWidth(LARGEUR - 44)
                        c:SetText(actions[1])
                        c:Show()
                        y = y - math.max(c:GetStringHeight() or 12, 12) - 5
                    end
                end
            end
            f.suite:SetText(Suite(guide, vue + 1) or "")
        end
    end
    -- le bouton sécurisé ne se déplace pas en combat : il garde alors sa place
    if f.pierre and not (InCombatLockdown and InCombatLockdown()) then
        if pierreSur then
            f.pierre:ClearAllPoints()
            f.pierre:SetPoint("RIGHT", pierreSur, "RIGHT", -4, 0)
            f.pierre:Show()
        else
            f.pierre:Hide()
        end
    end
    for i = nL + 1, #lignes do lignes[i]:Hide() end
    for i = nC + 1, #consignes do consignes[i]:Hide() end
    -- « Ensuite », puis la barre
    y = y - 2
    f.sepSuite:ClearAllPoints()
    f.sepSuite:SetPoint("TOPLEFT", 6, y)
    f.sepSuite:SetPoint("TOPRIGHT", -6, y)
    y = y - 5
    f.suite:ClearAllPoints()
    f.suite:SetPoint("TOPLEFT", 10, y)
    f.suite:SetWidth(LARGEUR - 20)
    local hs = (f.suite:GetText() or "") ~= "" and math.max(f.suite:GetStringHeight() or 12, 12) or 0
    f.sepSuite:SetShown(hs > 0)
    y = y - hs - 10
    f:SetHeight(-y)
end

-- ---------------------------------------------------------------------------
-- Raccordement à la fenêtre de l'addon : la fenêtre sobre remplace la grande fenêtre
-- ---------------------------------------------------------------------------

local base = {
    Refresh = Window.Refresh, Toggle = Window.Toggle, SetMini = Window.SetMini, OnLogin = Window.OnLogin,
}

local function CacherClassique()
    local g = _G.EternalRoutesFrame
    if g and g:IsShown() then g:Hide() end
end

function Window.Refresh()
    base.Refresh()
    if Actif() then
        CacherClassique()
        Sobre.Rafraichir()
    end
end

function Window.OnLogin()
    base.OnLogin()
    Creer()
    if Actif() then
        CacherClassique()
        if ns.db.shown ~= false and not ns.db.miniMode then f:Show() end
        Sobre.Rafraichir()
    end
end

function Window.SetMini(actif)
    base.SetMini(actif)
    Creer()
    if not Actif() then f:Hide() return end
    CacherClassique()
    if actif then
        f:Hide()
    else
        f:Show()
        ns.viewStep = nil
        Sobre.Rafraichir()
    end
end

function Window.Toggle()
    if not Actif() or ns.db.miniMode then return base.Toggle() end
    Creer()
    CacherClassique()
    if f:IsShown() then
        f:Hide()
        ns.db.shown = false
    else
        -- à l'ouverture, toujours l'étape en cours
        ns.viewStep = nil
        f:Show()
        ns.db.shown = true
        Window.Refresh()
    end
end

--- /er style [sobre|classique] : choisir la fenêtre.
function Sobre.Style(choix)
    choix = (choix or ""):lower()
    if choix == "" then choix = Actif() and "classique" or "sobre" end
    ns.db.style = (choix == "classique" or choix == "classic") and "classique" or "sobre"
    Creer()
    if Actif() then
        CacherClassique()
        if not ns.db.miniMode then f:Show() end
    else
        f:Hide()
        if not ns.db.miniMode and _G.EternalRoutesFrame then _G.EternalRoutesFrame:Show() end
    end
    ns.db.shown = true
    Window.Refresh()
    ns.Print(Actif() and L.SOBRE_STYLE_ON or L.SOBRE_STYLE_OFF)
end

--- /er opacite <20-95>
function Sobre.Opacite(valeur)
    local v = tonumber(valeur)
    if v then ns.db.opacite = math.min(95, math.max(20, v)) end
    Sobre.AppliquerOpacite()
    ns.Print(L.SOBRE_OPACITY:format(math.floor(Opacite() * 100 + 0.5)))
end
