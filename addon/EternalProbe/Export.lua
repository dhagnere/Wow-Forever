--[[----------------------------------------------------------------------------
    EternalProbe — Export.lua : /ep export, le code à coller sur le site.

    La fenêtre montre un code déjà sélectionné : Ctrl+C, puis coller sur La Taverne Éternelle,
    Administration › Guides à valider (Probe). Rien à chercher dans le dossier WTF.

    Le code ne garde que l'utile : contexte du personnage, noms des quêtes, et les événements qui font
    un parcours (quêtes, objectifs, PNJ, zones, niveaux, trajets, vols, élites…), chacun précédé de la
    dernière position connue. Les milliers de points de passage (« pos ») et d'instantanés (« log ») restent
    dans la sauvegarde, pas dans le code.

    Format : « EP1: » suivi du texte encodé en base64 (le jeu interprète le caractère « | » dans les champs
    de saisie : le base64 n'en contient aucun). Une fois décodé, une ligne par enregistrement :
      EP|1                          version du code
      ctx|personnage|race (fichier)|race (nom)|classe|faction|niveau|partie|carte de départ|carte au départ de l'enregistrement
      q|id|titre                    une ligne par quête connue
      <heure>|<type>|…              événements de la sauvegarde, tels quels
      fin|<nombre de lignes>        contrôle : un code tronqué au collage est refusé par le site
------------------------------------------------------------------------------]]

local P = _G.EternalProbe
if not P or not P.DB then return end

local GARDER = {
    clock = true, zone = true, level = true, accept = true, turnin = true, detail = true, gossip = true,
    targetpos = true, obj = true, loot = true, recu = true, trainer = true, learn = true, mark = true,
    qniveau = true, recompense = true, choix = true, gain = true, taxi = true, fpnouveau = true, vol = true,
    mort = true, exploit = true, photo = true, trajet = true,
}

-- ---- base64, en Lua 5.1 pur (pas d'opérations sur les bits) -------------------------------------
local ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

local function Base64(s)
    local out, n = {}, #s
    for i = 1, n, 3 do
        local a, b, c = s:byte(i, i + 2)
        local v = a * 65536 + (b or 0) * 256 + (c or 0)
        local c1 = math.floor(v / 262144) % 64
        local c2 = math.floor(v / 4096) % 64
        local c3 = math.floor(v / 64) % 64
        local c4 = v % 64
        out[#out + 1] = ALPHABET:sub(c1 + 1, c1 + 1) .. ALPHABET:sub(c2 + 1, c2 + 1)
            .. (b and ALPHABET:sub(c3 + 1, c3 + 1) or "=") .. (c and ALPHABET:sub(c4 + 1, c4 + 1) or "=")
    end
    return table.concat(out)
end
P.Base64 = Base64

-- ---- le code ------------------------------------------------------------------------------------
local function Champ(v) return (tostring(v == nil and "" or v):gsub("[|\n]", "/")) end

function P.CodeExport()
    local db = P.DB()
    local c = db.context or {}
    local lignes = {
        "EP|1",
        table.concat({ "ctx", Champ(db.personnage), Champ(c.raceFile), Champ(c.raceName), Champ(c.classFile),
            Champ(c.faction), Champ(c.level), Champ(db.partie), Champ(db.carteDepart), Champ(c.map) }, "|"),
    }
    local ids = {}
    for k in pairs(db.quests or {}) do ids[#ids + 1] = tonumber(k) or k end
    table.sort(ids, function(a, b) return tostring(a) < tostring(b) end)
    for _, id in ipairs(ids) do
        local q = db.quests[tostring(id)] or db.quests[id]
        if q and q.name then lignes[#lignes + 1] = "q|" .. Champ(id) .. "|" .. Champ(q.name) end
    end
    local derniere, ecrite = nil, nil
    local nbEvenements = 0
    for _, e in ipairs(db.events or {}) do
        local genre = tostring(e):match("^[^|]*|([^|]*)")
        if genre == "pos" then
            derniere = e
        elseif GARDER[genre] then
            if derniere and derniere ~= ecrite then lignes[#lignes + 1] = derniere; ecrite = derniere end
            lignes[#lignes + 1] = (tostring(e):gsub("\n", " "))
            nbEvenements = nbEvenements + 1
        end
    end
    lignes[#lignes + 1] = "fin|" .. (#lignes + 1)
    return "EP1:" .. Base64(table.concat(lignes, "\n")), nbEvenements, #ids
end

-- ---- la fenêtre ---------------------------------------------------------------------------------
local fenetre, zone, info

local function Fenetre()
    if fenetre then return fenetre end
    fenetre = CreateFrame("Frame", "EternalProbeExport", UIParent, "BackdropTemplate")
    fenetre:SetSize(540, 340)
    fenetre:SetPoint("CENTER")
    fenetre:SetFrameStrata("DIALOG")
    fenetre:SetMovable(true)
    fenetre:EnableMouse(true)
    fenetre:RegisterForDrag("LeftButton")
    fenetre:SetScript("OnDragStart", function(self) self:StartMoving() end)
    fenetre:SetScript("OnDragStop", function(self) self:StopMovingOrSizing() end)
    if fenetre.SetBackdrop then
        fenetre:SetBackdrop({ bgFile = "Interface\\DialogFrame\\UI-DialogBox-Background-Dark",
            edgeFile = "Interface\\DialogFrame\\UI-DialogBox-Border", edgeSize = 24,
            insets = { left = 6, right = 6, top = 6, bottom = 6 } })
    end
    tinsert(UISpecialFrames, "EternalProbeExport") -- Échap ferme la fenêtre

    local titre = fenetre:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
    titre:SetPoint("TOP", 0, -16)
    titre:SetText("EternalProbe · code à coller sur le site")

    info = fenetre:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
    info:SetPoint("TOPLEFT", 20, -42)
    info:SetPoint("TOPRIGHT", -20, -42)
    info:SetJustifyH("LEFT")

    local ok, defil = pcall(CreateFrame, "ScrollFrame", "EternalProbeExportDefil", fenetre, "UIPanelScrollFrameTemplate")
    if not ok then defil = CreateFrame("ScrollFrame", "EternalProbeExportDefil", fenetre) end
    defil:SetPoint("TOPLEFT", 20, -82)
    defil:SetPoint("BOTTOMRIGHT", -40, 48)

    zone = CreateFrame("EditBox", nil, defil)
    zone:SetMultiLine(true)
    zone:SetAutoFocus(false)
    zone:SetFontObject(ChatFontSmall or GameFontHighlightSmall)
    zone:SetWidth(470)
    zone:SetMaxLetters(0)
    zone:SetScript("OnEscapePressed", function() fenetre:Hide() end)
    -- lecture seule : toute frappe remet le code et le resélectionne
    zone:SetScript("OnTextChanged", function(self, parUtilisateur)
        if parUtilisateur and self.code then self:SetText(self.code); self:HighlightText() end
    end)
    zone:SetScript("OnMouseUp", function(self) self:HighlightText() end)
    defil:SetScrollChild(zone)

    local fermer = CreateFrame("Button", nil, fenetre, "UIPanelButtonTemplate")
    fermer:SetSize(120, 24)
    fermer:SetPoint("BOTTOMRIGHT", -20, 16)
    fermer:SetText("Fermer")
    fermer:SetScript("OnClick", function() fenetre:Hide() end)

    local reselect = CreateFrame("Button", nil, fenetre, "UIPanelButtonTemplate")
    reselect:SetSize(160, 24)
    reselect:SetPoint("BOTTOMLEFT", 20, 16)
    reselect:SetText("Tout resélectionner")
    reselect:SetScript("OnClick", function() zone:SetFocus(); zone:HighlightText() end)
    return fenetre
end

function P.Exporter()
    local code, nbEvenements, nbQuetes = P.CodeExport()
    if nbEvenements == 0 then
        P.Print("Rien à exporter : aucun enregistrement pour ce personnage (/ep start, jouez, puis /ep export).")
        return
    end
    Fenetre()
    zone.code = code
    zone:SetText(code)
    info:SetText(("%d événements, %d quêtes, %d Ko. Ctrl+C pour copier, puis collez sur taverne-eternelle.fr, Administration › Guides à valider (Probe)."):format(
        nbEvenements, nbQuetes, math.ceil(#code / 1024)))
    fenetre:Show()
    zone:SetFocus()
    zone:HighlightText()
    P.Print("Code prêt : Ctrl+C dans la fenêtre. L'enregistrement reste dans la sauvegarde ; /ep clear l'efface une fois le guide publié.")
end

local avant = P.CommandeEnPlus
function P.CommandeEnPlus(lower, raw)
    if lower == "export" then P.Exporter() return true end
    return avant and avant(lower, raw) or false
end
