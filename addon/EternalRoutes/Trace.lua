--[[----------------------------------------------------------------------------
    EternalRoutes — Trace.lua
    Tracé du chemin vers l'étape visée, sur la carte du monde (traits) et sur la minicarte (points).

    Le chemin se calcule en plusieurs points : à pied tout droit, ou, quand c'est nettement plus court,
    à pied jusqu'au maître de vol, le vol, puis à pied jusqu'à l'étape. Seuls les points de vol que le
    personnage connaît servent (ceux lus à l'ouverture de la carte des vols, gardés dans sa sauvegarde).

    Maîtres de vol : à chaque ouverture de la carte des vols, le point courant est noté pour tout le compte
    (EternalRoutesRoutesDB.maitresVol : nom du point, carte, position) et les points connus du personnage
    (EternalRoutesDB.volsConnus). La position des autres points vient de la carte des vols du jeu
    (C_TaxiMap.GetTaxiNodesForMap) quand le client la donne.

    Réglages : /er trace (tout), /er trace carte, /er trace mini.
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local Trace = {}
ns.Trace = Trace

-- vitesses en mètres (yards) par seconde
local V_PIED, V_VOL, DETOUR_VOL, ATTENTE_VOL = 7, 32, 1.3, 20
local CONTINENTS = { 1414, 1415 } -- Kalimdor, Royaumes de l'Est
-- diamètre de la minicarte en mètres, par niveau de zoom (extérieur, intérieur)
local DIAM_EXT = { [0] = 466 + 2 / 3, 400, 333 + 1 / 3, 266 + 2 / 3, 200, 133 + 1 / 3 }
local DIAM_INT = { [0] = 300, 240, 180, 120, 80, 50 }

-- ---------------------------------------------------------------------------
-- Calcul du chemin (sans dépendre du jeu : testé hors du jeu)
-- ---------------------------------------------------------------------------

local function Dist(a, b)
    local dx, dy = a.x - b.x, a.y - b.y
    return math.sqrt(dx * dx + dy * dy)
end
Trace.Dist = Dist

--- Chemin le plus court en temps, de dep à cible (positions monde { c, x, y }), avec les points de vol connus
--- (noeuds : { nom, c, x, y }). Rend une liste de points ; chaque point dit comment on l'atteint (mode
--- « pied » ou « vol ») et, pour le vol, le point de départ et d'arrivée.
function Trace.Planifier(dep, cible, noeuds, vPied)
    vPied = vPied or V_PIED
    local chemin = { { c = dep.c, x = dep.x, y = dep.y, mode = "depart" } }
    if not (dep and cible) or dep.c ~= cible.c then
        chemin[#chemin + 1] = { c = cible.c, x = cible.x, y = cible.y, mode = "pied", autreContinent = dep.c ~= cible.c }
        return chemin, nil
    end
    local direct = Dist(dep, cible) / vPied
    local meilleur, a0, b0 = direct, nil, nil
    if direct > 60 then
        for _, a in ipairs(noeuds or {}) do
            if a.c == dep.c then
                local ta = Dist(dep, a) / vPied + ATTENTE_VOL
                if ta < meilleur then
                    for _, b in ipairs(noeuds) do
                        if b ~= a and b.c == cible.c then
                            local t = ta + Dist(a, b) * DETOUR_VOL / V_VOL + Dist(b, cible) / vPied
                            if t < meilleur then meilleur, a0, b0 = t, a, b end
                        end
                    end
                end
            end
        end
    end
    -- le vol ne vaut que s'il fait gagner au moins un quart du temps
    if a0 and meilleur < direct * 0.75 then
        chemin[#chemin + 1] = { c = a0.c, x = a0.x, y = a0.y, mode = "pied", nom = a0.nom }
        chemin[#chemin + 1] = { c = b0.c, x = b0.x, y = b0.y, mode = "vol", nom = b0.nom, depuis = a0.nom }
        chemin[#chemin + 1] = { c = cible.c, x = cible.x, y = cible.y, mode = "pied" }
        return chemin, { depuis = a0.nom, vers = b0.nom, temps = meilleur, direct = direct }
    end
    chemin[#chemin + 1] = { c = cible.c, x = cible.x, y = cible.y, mode = "pied" }
    return chemin, nil
end

--- Points le long d'un segment, tous les `pas` mètres (pour les pointillés de la minicarte).
function Trace.Echantillons(a, b, pas)
    local d = Dist(a, b)
    local n = math.max(1, math.floor(d / pas))
    local out = {}
    for i = 1, n do
        local t = i / n
        out[#out + 1] = { x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t }
    end
    return out
end

-- ---------------------------------------------------------------------------
-- Conversions de positions (carte du jeu <-> monde)
-- ---------------------------------------------------------------------------

local function Vecteur(x, y)
    if CreateVector2D then return CreateVector2D(x, y) end
    return { x = x, y = y, GetXY = function(v) return v.x, v.y end }
end

local function XY(v)
    if not v then return nil end
    if v.GetXY then return v:GetXY() end
    return v.x, v.y
end

--- Position monde d'un point d'une carte (x, y de 0 à 100).
function Trace.Monde(map, x, y)
    if not (map and x and y and C_Map and C_Map.GetWorldPosFromMapPos) then return nil end
    local ok, c, pos = pcall(C_Map.GetWorldPosFromMapPos, map, Vecteur(x / 100, y / 100))
    if not ok or not c or not pos then return nil end
    local wx, wy = XY(pos)
    if not wx then return nil end
    return { c = c, x = wx, y = wy }
end

--- Position (0 à 1, parfois hors de la carte) d'un point monde sur une carte du jeu.
function Trace.SurCarte(p, map)
    if not (p and map and C_Map and C_Map.GetMapPosFromWorldPos) then return nil end
    local ok, _, pos = pcall(C_Map.GetMapPosFromWorldPos, p.c, Vecteur(p.x, p.y), map)
    if not ok or not pos then
        -- certaines versions rendent la position seule
        ok, pos = pcall(C_Map.GetMapPosFromWorldPos, p.c, Vecteur(p.x, p.y), map)
        if not ok or type(pos) ~= "table" then return nil end
    end
    return XY(pos)
end

local function PositionJoueur()
    local map = C_Map and C_Map.GetBestMapForUnit and C_Map.GetBestMapForUnit("player")
    if not map then return nil end
    local p = C_Map.GetPlayerMapPosition and C_Map.GetPlayerMapPosition(map, "player")
    local x, y = XY(p)
    if not x or (x == 0 and y == 0) then return map end
    return map, x * 100, y * 100
end

-- ---------------------------------------------------------------------------
-- Maîtres de vol : collecte et points connus
-- ---------------------------------------------------------------------------

local function Comptes()
    EternalRoutesRoutesDB = EternalRoutesRoutesDB or {}
    EternalRoutesRoutesDB.maitresVol = EternalRoutesRoutesDB.maitresVol or {}
    return EternalRoutesRoutesDB.maitresVol
end

--- Carte des vols ouverte : point courant (position du maître de vol) et points connus du personnage.
function Trace.NoterPointsDeVol()
    if not (NumTaxiNodes and TaxiNodeName and TaxiNodeGetType) then return end
    ns.db.volsConnus = ns.db.volsConnus or {}
    local courant
    for i = 1, NumTaxiNodes() do
        local genre, nom = TaxiNodeGetType(i), TaxiNodeName(i)
        if nom and (genre == "CURRENT" or genre == "REACHABLE") then ns.db.volsConnus[nom] = true end
        if genre == "CURRENT" then courant = nom end
    end
    local map, x, y = PositionJoueur()
    if courant and map and x then
        local faction = UnitFactionGroup and UnitFactionGroup("player") or nil
        Comptes()[courant] = { map = map, x = math.floor(x * 10 + 0.5) / 10, y = math.floor(y * 10 + 0.5) / 10, faction = faction }
    end
    Trace.noeuds = nil
end

--- Points de vol connus du personnage, en positions monde.
function Trace.Noeuds()
    if Trace.noeuds then return Trace.noeuds end
    local connus = ns.db and ns.db.volsConnus or {}
    local liste, vus = {}, {}
    for nom, p in pairs(Comptes()) do
        if connus[nom] then
            local m = Trace.Monde(p.map, p.x, p.y)
            if m then m.nom = nom; liste[#liste + 1] = m; vus[nom] = true end
        end
    end
    -- les autres points connus : position donnée par la carte des vols du jeu, si le client la fournit
    if C_TaxiMap and C_TaxiMap.GetTaxiNodesForMap then
        for _, cont in ipairs(CONTINENTS) do
            local ok, noeuds = pcall(C_TaxiMap.GetTaxiNodesForMap, cont)
            if ok and type(noeuds) == "table" then
                for _, n in ipairs(noeuds) do
                    if n.name and connus[n.name] and not vus[n.name] and n.position then
                        local x, y = XY(n.position)
                        local m = x and Trace.Monde(cont, x * 100, y * 100)
                        if m then m.nom = n.name; liste[#liste + 1] = m; vus[n.name] = true end
                    end
                end
            end
        end
    end
    Trace.noeuds = liste
    return liste
end

-- ---------------------------------------------------------------------------
-- Chemin vers l'étape visée
-- ---------------------------------------------------------------------------

local function VitessePied()
    local niveau = UnitLevel and UnitLevel("player") or 1
    if niveau >= 60 then return V_PIED * 2 end
    if niveau >= 40 then return V_PIED * 1.6 end
    return V_PIED
end

function Trace.Chemin()
    local step = ns.TomTomBridge and ns.TomTomBridge.TargetStep and ns.TomTomBridge.TargetStep()
    if not (step and step.map and step.x and step.y) then return nil end
    local map, x, y = PositionJoueur()
    if not (map and x) then return nil end
    local dep, cible = Trace.Monde(map, x, y), Trace.Monde(step.map, step.x, step.y)
    if not (dep and cible) then return nil end
    local chemin, vol = Trace.Planifier(dep, cible, Trace.Noeuds(), VitessePied())
    return chemin, vol
end

-- ---------------------------------------------------------------------------
-- Carte du monde : traits
-- ---------------------------------------------------------------------------

local surCarte, traits = nil, {}
local COULEURS = { pied = { 1, 0.82, 0.1, 0.9 }, vol = { 0.35, 0.75, 1, 0.9 } }

local function CalqueCarte()
    if surCarte ~= nil then return surCarte or nil end
    local wm = _G.WorldMapFrame
    local toile = wm and wm.ScrollContainer and wm.ScrollContainer.Child
    if not toile then surCarte = false return nil end
    surCarte = CreateFrame("Frame", "EternalRoutesTraceCarte", toile)
    surCarte:SetAllPoints(toile)
    surCarte:SetFrameLevel((toile.GetFrameLevel and toile:GetFrameLevel() or 0) + 50)
    return surCarte
end

local function Trait(i)
    local t = traits[i]
    if t then return t end
    if surCarte.CreateLine then
        t = surCarte:CreateLine(nil, "OVERLAY")
        t:SetThickness(4)
    end
    traits[i] = t or false
    return traits[i]
end

function Trace.MajCarte()
    local f = CalqueCarte()
    if not f then return end
    for _, t in pairs(traits) do if t then t:Hide() end end
    local wm = _G.WorldMapFrame
    if not (ns.db.traceCarte ~= false and wm and wm:IsShown()) then return end
    local mapId = wm.GetMapID and wm:GetMapID()
    local chemin = mapId and Trace.Chemin()
    if not chemin then return end
    local w, h = f:GetWidth(), f:GetHeight()
    if not (w and h and w > 0) then return end
    local n = 0
    for i = 2, #chemin do
        local a, b = chemin[i - 1], chemin[i]
        if not b.autreContinent then
            local ax, ay = Trace.SurCarte(a, mapId)
            local bx, by = Trace.SurCarte(b, mapId)
            if ax and bx then
                n = n + 1
                local t = Trait(n)
                if t then
                    local c = COULEURS[b.mode] or COULEURS.pied
                    t:SetColorTexture(c[1], c[2], c[3], c[4])
                    t:SetStartPoint("TOPLEFT", f, ax * w, -ay * h)
                    t:SetEndPoint("TOPLEFT", f, bx * w, -by * h)
                    t:Show()
                end
            end
        end
    end
end

-- ---------------------------------------------------------------------------
-- Minicarte : pointillés
-- ---------------------------------------------------------------------------

local points = {}
local MAX_POINTS = 80
local TEX = { pied = "Interface\\COMMON\\Indicator-Yellow", vol = "Interface\\COMMON\\Indicator-Green" }

local function Point(i)
    local p = points[i]
    if p then return p end
    if not (Minimap and Minimap.CreateTexture) then return nil end
    p = Minimap:CreateTexture(nil, "OVERLAY")
    p:SetSize(8, 8)
    points[i] = p
    return p
end

-- le chemin, converti en coordonnées de la carte du joueur, refait chaque seconde (la conversion coûte)
local cache, ageChemin = nil, 99

local function CheminSurCarte(map)
    local chemin = Trace.Chemin()
    if not chemin then return nil end
    local pts = {}
    for i = 2, #chemin do
        local b = chemin[i]
        if b.autreContinent then break end
        local x, y = Trace.SurCarte(b, map)
        if not x then return nil end
        pts[#pts + 1] = { x = x * 100, y = y * 100, mode = b.mode }
    end
    return { map = map, pts = pts }
end

-- taille d'une carte en mètres : donnée par le jeu, sinon tirée des positions monde de deux coins
local tailles = {}
local function TailleCarte(map)
    if tailles[map] then return tailles[map][1], tailles[map][2] end
    local l, h
    if C_Map.GetMapWorldSize then l, h = C_Map.GetMapWorldSize(map) end
    if not (l and l > 0) then
        local a, b = Trace.Monde(map, 0, 0), Trace.Monde(map, 100, 100)
        if a and b then l, h = math.abs(b.y - a.y), math.abs(b.x - a.x) end
    end
    if l and l > 0 then tailles[map] = { l, h } end
    return l, h
end

function Trace.MajMini(dt)
    for _, p in pairs(points) do p:Hide() end
    if ns.db.traceMini == false or not Minimap or not Minimap:IsShown() then return end
    local map, px, py = PositionJoueur()
    if not (map and px) then return end
    ageChemin = ageChemin + (dt or 1)
    if ageChemin >= 1 or not cache or cache.map ~= map then cache, ageChemin = CheminSurCarte(map), 0 end
    if not (cache and #cache.pts > 0) then return end
    local largeur, hauteur = TailleCarte(map)
    if not (largeur and largeur > 0) then return end
    local zoom = Minimap.GetZoom and Minimap:GetZoom() or 0
    local diam = ((IsIndoors and IsIndoors()) and DIAM_INT or DIAM_EXT)[zoom] or DIAM_EXT[0]
    local taille = Minimap:GetWidth()
    local echelle, rayon = taille / diam, taille / 2 - 5
    local f = (GetCVar and GetCVar("rotateMinimap") == "1" and GetPlayerFacing) and (GetPlayerFacing() or 0) or 0
    local cf, sf = math.cos(f), math.sin(f)
    -- en mètres, depuis le joueur : x vers l'est, y vers le sud
    local function Metres(x, y) return (x - px) / 100 * largeur, (y - py) / 100 * hauteur end
    local ax, ay = 0, 0
    local n = 0
    for _, b in ipairs(cache.pts) do
        local bx, by = Metres(b.x, b.y)
        local pas = (b.mode == "vol") and 45 or 18
        for _, e in ipairs(Trace.Echantillons({ x = ax, y = ay }, { x = bx, y = by }, pas)) do
            local sx, sy = (e.x * cf - e.y * sf) * echelle, (e.x * sf + e.y * cf) * echelle
            if sx * sx + sy * sy <= rayon * rayon then
                n = n + 1
                if n > MAX_POINTS then return end
                local p = Point(n)
                if p then
                    p:SetTexture(TEX[b.mode] or TEX.pied)
                    p:ClearAllPoints()
                    p:SetPoint("CENTER", Minimap, "CENTER", sx, -sy)
                    p:Show()
                end
            end
        end
        ax, ay = bx, by
    end
end

-- ---------------------------------------------------------------------------
-- Événements et rafraîchissement
-- ---------------------------------------------------------------------------

function Trace.Commande(arg)
    local L = ns.L
    arg = (arg or ""):lower()
    if arg == "carte" or arg == "map" then
        ns.db.traceCarte = ns.db.traceCarte == false
    elseif arg == "mini" or arg == "minimap" then
        ns.db.traceMini = ns.db.traceMini == false
    else
        local actif = not (ns.db.traceCarte ~= false or ns.db.traceMini ~= false)
        ns.db.traceCarte, ns.db.traceMini = actif, actif
    end
    ns.Print(L.TRACE_STATE:format(ns.db.traceCarte ~= false and L.TRACE_ON or L.TRACE_OFF,
        ns.db.traceMini ~= false and L.TRACE_ON or L.TRACE_OFF))
    Trace.noeuds, ageChemin, cache = nil, 99, nil
    Trace.MajCarte()
end

--- Le vol conseillé, en clair, pour la consigne de l'étape (nil si on va à pied).
function Trace.VolConseille()
    local _, vol = Trace.Chemin()
    return vol
end

if CreateFrame then
    local f = CreateFrame("Frame")
    f:RegisterEvent("TAXIMAP_OPENED")
    f:SetScript("OnEvent", function(_, event)
        if event == "TAXIMAP_OPENED" and ns.db then Trace.NoterPointsDeVol() end
    end)
    local attenteMini, attenteCarte = 0, 0
    f:SetScript("OnUpdate", function(_, dt)
        if not ns.db then return end
        attenteMini = attenteMini + dt
        if attenteMini >= 0.1 then
            local ok = pcall(Trace.MajMini, attenteMini)
            if not ok then for _, p in pairs(points) do p:Hide() end end
            attenteMini = 0
        end
        attenteCarte = attenteCarte + dt
        if attenteCarte >= 0.5 then
            attenteCarte = 0
            if _G.WorldMapFrame and _G.WorldMapFrame:IsShown() then pcall(Trace.MajCarte) end
        end
    end)
end
