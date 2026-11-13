--[[----------------------------------------------------------------------------
    EternalRoutes — Importer.lua
    Transforme l'enregistrement de RouteProbe (RouteProbeDB) en route, en jeu.

      /er importer            convertit l'enregistrement en cours en route
      /er routes              liste les routes importées
      /er supprimer <id>      supprime une route importée
      /er restaurer <id>      remet la version d'avant le dernier import (gardée à chaque remplacement)

    Étapes produites :
      - prendre : la dernière acceptation avant le rendu (une quête reprise compte une fois),
                  chez le PNJ du dernier dialogue ;
      - rendre  : le rendu, chez le PNJ du dernier dialogue ;
      - faire   : pour une quête à monstres ou à objets, là où les objectifs ont progressé
                  (RouteProbe 0.6 : chaque monstre vaincu, objet ramassé ou objet du décor utilisé est
                  noté avec sa position), sinon là où l'on a combattu entre la prise et le rendu ;
                  les objets ramassés gardent leur source (« sur : Coffre de ravitaillement ») ;
      - entraîneur : une visite où l'on a appris au moins un sort, réservée à la classe
                  enregistrée. Réimporter une route garde les entraîneurs des autres classes.
    Les étapes au même endroit et à la suite sont regroupées.
    Les routes importées sont gardées pour tout le compte (EternalRoutesRoutesDB).
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local Importer = {}
ns.Importer = Importer

-- ---------------------------------------------------------------------------
-- Outils
-- ---------------------------------------------------------------------------

local function Decouper(s)
    local t = {}
    for morceau in (s .. "|"):gmatch("(.-)|") do t[#t + 1] = morceau end
    return t
end

local function Mediane(l)
    local c = {}
    for i, v in ipairs(l) do c[i] = v end
    table.sort(c)
    local n = #c
    if n == 0 then return nil end
    if n % 2 == 1 then return c[(n + 1) / 2] end
    return (c[n / 2] + c[n / 2 + 1]) / 2
end

-- les noms du jeu finissent souvent par une espace insécable (octets 194 160), que %s ne reconnaît pas
local function Rogner(s)
    local t = tostring(s or ""):gsub("\194\160", " ")
    return (t:gsub("^%s+", ""):gsub("%s+$", ""))
end

--- Titre d'un PNJ → familier qu'il sert : « demon » (entraîneur de démons), « bete » (dresseur de familiers), ou nil.
local function Familier(titre)
    local t = tostring(titre or ""):lower()
    if t == "" or t == "nil" then return nil end
    if t:find("d\195\169mon") or t:find("demon") then return "demon" end
    if t:find("famili") or t:find("pet trainer", 1, true) then return "bete" end
    return nil
end

local function NettoyerObjectif(t)
    local s = tostring(t or ""):gsub("\194\160", " "):gsub("|4[^;]*;", "")
    s = s:gsub("%s*:%s*%d+%s*/%s*%d+.*$", "")
    return Rogner(s)
end

local function Arrondi(v)
    return math.floor(v * 10 + 0.5) / 10
end

local function Slug(s)
    s = tostring(s or ""):lower()
    s = s:gsub("[àâä]", "a"):gsub("[éèêë]", "e"):gsub("[îï]", "i"):gsub("[ôö]", "o"):gsub("[ùûü]", "u"):gsub("ç", "c")
    s = s:gsub("[^%w]+", "-"):gsub("^%-+", ""):gsub("%-+$", "")
    return s
end

local function NomZone(carte, defaut)
    if carte and C_Map and C_Map.GetMapInfo then
        local info = C_Map.GetMapInfo(carte)
        if info and info.name and info.name ~= "" then return info.name end
    end
    return defaut or "?"
end

-- Zones de départ (identifiant de carte du jeu) et races qui y commencent.
-- Une route enregistrée dans l'une d'elles sert à toutes ces races, quelle que soit la classe :
-- les quêtes réservées aux autres classes sont masquées par le moteur.
local ZONES_DEPART = {
    [1429] = { nom = "Forêt d'Elwynn",          races = { "Human" },          faction = "Alliance" },
    [1426] = { nom = "Dun Morogh",              races = { "Dwarf", "Gnome" }, faction = "Alliance" },
    [1438] = { nom = "Teldrassil",              races = { "NightElf" },       faction = "Alliance" },
    [1411] = { nom = "Durotar",                 races = { "Orc", "Troll" },   faction = "Horde" },
    [1420] = { nom = "Clairières de Tirisfal",  races = { "Scourge" },        faction = "Horde" },
    [1412] = { nom = "Mulgore",                 races = { "Tauren" },         faction = "Horde" },
    [2521] = { nom = "Île de Zéphras",          races = nil,                  faction = nil },   -- Skyborne
}
Importer.ZONES_DEPART = ZONES_DEPART

local NOMS_RACES = { Human = "Humain", Dwarf = "Nain", Gnome = "Gnome", NightElf = "Elfe de la nuit",
    Orc = "Orc", Troll = "Troll", Scourge = "Mort-vivant", Tauren = "Tauren" }

-- ---------------------------------------------------------------------------
-- Conversion
-- ---------------------------------------------------------------------------

--- Convertit un enregistrement RouteProbe en route. Renvoie la route, ou nil et la raison.
function Importer.Convertir(db)
    if type(db) ~= "table" or type(db.events) ~= "table" or #db.events == 0 then
        return nil, ns.L.IMP_NO_RECORD
    end
    local ctx = db.context or {}
    local quetes = db.quests or {}

    -- événements, triés par heure (l'ordre d'origine départage les égalités)
    local ev = {}
    for i, ligne in ipairs(db.events) do
        local p = Decouper(tostring(ligne))
        local t = tonumber(p[1])
        if t then
            local d = {}
            for j = 3, #p do d[#d + 1] = p[j] end
            ev[#ev + 1] = { t = t, k = p[2], d = d, i = i }
        end
    end
    table.sort(ev, function(a, b) if a.t ~= b.t then return a.t < b.t end return a.i < b.i end)

    local positions = {}
    for _, e in ipairs(ev) do
        if e.k == "pos" then
            local carte, x, y = tonumber(e.d[1]), tonumber(e.d[2]), tonumber(e.d[3])
            if carte and x and y then positions[#positions + 1] = { t = e.t, carte = carte, x = x * 100, y = y * 100 } end
        end
    end
    -- sans déplacement noté, les positions des cibles et des changements de zone servent de repli
    if #positions == 0 then
        for _, e in ipairs(ev) do
            local carte, x, y
            if e.k == "targetpos" then carte, x, y = tonumber(e.d[2]), tonumber(e.d[3]), tonumber(e.d[4])
            elseif e.k == "zone" or e.k == "trainer" then
                local o = (e.k == "zone") and 1 or 2
                carte, x, y = tonumber(e.d[o + 1]), tonumber(e.d[o + 2]), tonumber(e.d[o + 3])
            end
            if carte and x and y and x > 0 and y > 0 then positions[#positions + 1] = { t = e.t, carte = carte, x = x * 100, y = y * 100 } end
        end
    end
    if #positions == 0 then return nil, ns.L.IMP_NO_POS end

    local function Position(t)
        local p = positions[1]
        for _, q in ipairs(positions) do
            if q.t <= t then p = q else break end
        end
        return p.carte, p.x, p.y
    end

    -- PNJ : dialogues, et dernière unité ciblée juste avant une fenêtre de quête
    local pnj = {}
    for i, e in ipairs(ev) do
        if e.k == "gossip" and e.d[1] and e.d[1] ~= "?" then pnj[e.d[1]] = true end
        if e.k == "detail" or e.k == "accept" or e.k == "turnin" then
            for j = i - 1, 1, -1 do
                local f = ev[j]
                if e.t - f.t > 20 then break end
                if (f.k == "target" or f.k == "targetpos") and f.d[1] then pnj[f.d[1]] = true break end
            end
        end
    end

    local function PnjAvant(t)
        local avant = {}
        for _, e in ipairs(ev) do
            if e.t <= t then avant[#avant + 1] = e else break end
        end
        for j = #avant, 1, -1 do
            local e = avant[j]
            if t - e.t > 20 then break end
            if e.k == "gossip" and e.d[1] and e.d[1] ~= "?" then return e.d[1] end
        end
        for j = #avant, 1, -1 do
            local e = avant[j]
            if t - e.t > 20 then break end
            if (e.k == "target" or e.k == "targetpos") and pnj[e.d[1]] then return e.d[1] end
        end
        return nil
    end

    local function Objectifs(qid)
        local q = quetes[tostring(qid)] or {}
        local out = {}
        for _, o in ipairs(q.objectives or {}) do
            if (o.kind == "monster" or o.kind == "item" or o.kind == "object") and o.name then
                out[#out + 1] = Rogner(o.name)
            else
                local texte = NettoyerObjectif(o.text)
                if texte ~= "" then out[#out + 1] = texte end
            end
        end
        return out
    end

    local function ACombattre(qid)
        local q = quetes[tostring(qid)] or {}
        for _, o in ipairs(q.objectives or {}) do
            if o.kind == "monster" or o.kind == "item" or o.kind == "object" then return true end
        end
        return false
    end

    local function Monstres(qid)
        local q = quetes[tostring(qid)] or {}
        local m = {}
        for _, o in ipairs(q.objectives or {}) do
            if o.kind == "monster" and o.name then m[Rogner(o.name)] = true end
        end
        return m
    end

    -- noms, prises et rendus
    local nom, acceptations, rendus = {}, {}, {}
    for _, e in ipairs(ev) do
        local qid = tonumber(e.d[1])
        if qid and (e.k == "accept" or e.k == "turnin") then
            if e.d[2] and e.d[2] ~= "nil" and e.d[2] ~= "" then nom[qid] = e.d[2] end
            if e.k == "accept" then
                acceptations[qid] = acceptations[qid] or {}
                table.insert(acceptations[qid], e.t)
            else
                rendus[qid] = e.t
            end
        end
    end
    for cle, q in pairs(quetes) do
        local qid = tonumber(cle)
        if qid and not nom[qid] then nom[qid] = q.name or ns.L.QUEST_N:format(cle) end
    end

    local brutes = {}
    for qid, liste in pairs(acceptations) do
        local fin = rendus[qid] or math.huge
        local retenue = liste[#liste]
        for _, t in ipairs(liste) do if t < fin then retenue = t end end
        brutes[#brutes + 1] = { t = retenue, genre = "prendre", qid = qid }
    end
    for qid, t in pairs(rendus) do
        brutes[#brutes + 1] = { t = t, genre = "rendre", qid = qid }
    end

    -- objets de quête ramassés et progrès des objectifs (RouteProbe 0.6)
    local progres, ramasses = {}, {}
    for _, e in ipairs(ev) do
        if e.k == "obj" then
            local carte, x, y = tonumber(e.d[6]), tonumber(e.d[7]), tonumber(e.d[8])
            local qid = tonumber(e.d[1])
            if qid and carte and x and y then
                progres[#progres + 1] = { t = e.t, qid = qid, kind = e.d[5], carte = carte, x = x * 100, y = y * 100, nom = Rogner(e.d[9]) }
            end
        elseif e.k == "loot" or e.k == "recu" then
            local o = (e.k == "loot") and 2 or 0     -- « loot » porte en plus le genre et l'identifiant de la source
            local carte, x, y = tonumber(e.d[3 + o]), tonumber(e.d[4 + o]), tonumber(e.d[5 + o])
            ramasses[#ramasses + 1] = { t = e.t, itemID = tonumber(e.d[1]), n = tonumber(e.d[2]) or 1,
                genre = (e.k == "loot") and e.d[3] or nil, sourceId = (e.k == "loot") and tonumber(e.d[4]) or nil,
                carte = carte, x = x and x * 100, y = y and y * 100,
                nom = Rogner(e.d[6 + o]), source = (e.k == "loot") and Rogner(e.d[9]) or "" }
        end
    end

    --- Objets ramassés pour une quête entre sa prise et son rendu : par objet, la quantité et ses sources.
    local function Collecte(qid, debut, fin)
        local q = quetes[tostring(qid)] or {}
        local ids, noms = {}, {}
        for _, o in ipairs(q.objectives or {}) do
            if o.itemID then ids[o.itemID] = true end
            if o.kind == "item" and o.name then noms[Rogner(o.name)] = true end
        end
        local parObjet, ordreObjets, points = {}, {}, {}
        for _, r in ipairs(ramasses) do
            if r.t > debut and r.t < fin and ((r.itemID and ids[r.itemID]) or noms[r.nom]) then
                local cle = r.itemID or r.nom
                local c = parObjet[cle]
                if not c then
                    c = { item = r.nom, itemID = r.itemID, n = 0, sources = {}, comptes = {} }
                    parObjet[cle] = c
                    ordreObjets[#ordreObjets + 1] = cle
                end
                c.n = c.n + r.n
                if r.source ~= "" then
                    if not c.comptes[r.source] then c.sources[#c.sources + 1] = r.source end
                    c.comptes[r.source] = (c.comptes[r.source] or 0) + 1
                    -- décor (coffre, plante…) ou monstre : décide du verbe affiché sous l'étape
                    if r.genre == "objet" then c.decor = true elseif r.genre == "monstre" then c.monstres = true end
                end
                if r.carte and r.x and r.y then points[#points + 1] = { t = r.t, carte = r.carte, x = r.x, y = r.y } end
            end
        end
        local liste = {}
        for _, cle in ipairs(ordreObjets) do
            local c = parObjet[cle]
            table.sort(c.sources, function(a, b) return c.comptes[a] > c.comptes[b] end)
            while #c.sources > 3 do table.remove(c.sources) end
            c.comptes = nil
            liste[#liste + 1] = c
        end
        return liste, points
    end

    --- Bornes de la quête : dernière prise avant le rendu, et le rendu.
    local function Bornes(qid)
        local fin = rendus[qid] or math.huge
        local debut
        for _, t in ipairs(acceptations[qid] or {}) do if t < fin then debut = t end end
        return debut, fin
    end

    local collectes = {}
    for qid in pairs(acceptations) do
        local debut, fin = Bornes(qid)
        if debut then
            local liste = Collecte(qid, debut, fin)
            if #liste > 0 then collectes[qid] = liste end
        end
    end

    -- « faire » : là où les objectifs ont progressé (objets ramassés compris)
    local placees = {}
    for qid in pairs(acceptations) do
        local debut, fin = Bornes(qid)
        if debut and rendus[qid] then
            local pts = {}
            for _, p in ipairs(progres) do
                if p.qid == qid and p.t > debut and p.t < fin then pts[#pts + 1] = p end
            end
            local _, butin = Collecte(qid, debut, fin)
            for _, p in ipairs(butin) do pts[#pts + 1] = p end
            if #pts > 0 then
                -- la carte la plus fréquente, puis le point médian sur cette carte
                local parCarte, carte = {}, nil
                for _, p in ipairs(pts) do
                    parCarte[p.carte] = (parCarte[p.carte] or 0) + 1
                    if not carte or parCarte[p.carte] > parCarte[carte] then carte = p.carte end
                end
                local xs, ys, ts = {}, {}, {}
                for _, p in ipairs(pts) do
                    if p.carte == carte then xs[#xs + 1], ys[#ys + 1], ts[#ts + 1] = p.x, p.y, p.t end
                end
                brutes[#brutes + 1] = { t = Mediane(ts), genre = "faire", qid = qid, carte = carte, x = Mediane(xs), y = Mediane(ys), releve = #xs }
                placees[qid] = true
            end
        end
    end

    -- sinon, là où l'on a combattu entre la prise et le rendu
    local hostiles = {}
    for _, e in ipairs(ev) do
        if (e.k == "target" or e.k == "targetpos") and e.d[1] and not pnj[e.d[1]] then
            hostiles[#hostiles + 1] = { t = e.t, nom = Rogner(e.d[1]) }
        end
    end
    local tousMonstres = {}
    for qid in pairs(nom) do
        for m in pairs(Monstres(qid)) do tousMonstres[m] = true end
    end
    for qid, liste in pairs(acceptations) do
        local fin = rendus[qid]
        if fin and ACombattre(qid) and not placees[qid] then
            local debut
            for _, t in ipairs(liste) do if t < fin then debut = t end end
            if debut then
                local cibles = Monstres(qid)
                local combats = {}
                local avecCibles = next(cibles) ~= nil
                for _, h in ipairs(hostiles) do
                    if h.t > debut and h.t < fin then
                        if (avecCibles and cibles[h.nom]) or (not avecCibles and not tousMonstres[h.nom]) then
                            combats[#combats + 1] = h.t
                        end
                    end
                end
                if #combats == 0 and not avecCibles then
                    for _, h in ipairs(hostiles) do
                        if h.t > debut and h.t < fin then combats[#combats + 1] = h.t end
                    end
                end
                if #combats > 0 then
                    local xs, ys, carte = {}, {}, nil
                    for _, t in ipairs(combats) do
                        local c, x, y = Position(t)
                        carte = carte or c
                        xs[#xs + 1], ys[#ys + 1] = x, y
                    end
                    brutes[#brutes + 1] = { t = Mediane(combats), genre = "faire", qid = qid, carte = carte, x = Mediane(xs), y = Mediane(ys) }
                end
            end
        end
    end

    -- « entraîneur » : visites où l'on a appris au moins un sort (une réouverture juste après compte avec)
    local visites = {}
    for i, e in ipairs(ev) do
        if e.k == "trainer" then
            local npc = Rogner(e.d[1])
            local sorts, vus = {}, {}
            for j = i + 1, #ev do
                local f = ev[j]
                if f.k == "trainerclose" or f.k == "trainer" or f.t - e.t > 300 then break end
                local id = tonumber(f.d[1])
                if f.k == "learn" and id and not vus[id] then
                    vus[id] = true
                    sorts[#sorts + 1] = { id = id, name = f.d[2] }
                end
            end
            if #sorts > 0 or Familier(e.d[7]) then
                local prec = visites[#visites]
                if prec and prec.npc == npc and e.t - prec.tFin < 120 then
                    for _, sp in ipairs(sorts) do
                        if not prec.vus[sp.id] then prec.vus[sp.id] = true; prec.sorts[#prec.sorts + 1] = sp end
                    end
                    prec.tFin = e.t
                else
                    local carte, x, y = tonumber(e.d[3]), tonumber(e.d[4]), tonumber(e.d[5])
                    if carte and x and y then x, y = x * 100, y * 100 else carte, x, y = Position(e.t) end
                    visites[#visites + 1] = { t = e.t, tFin = e.t, npc = npc, metier = (e.d[2] == "1"), carte = carte,
                        x = x, y = y, niveau = tonumber(e.d[6]), sorts = sorts, vus = vus, familier = Familier(e.d[7]) }
                end
            end
        end
    end

    -- « livre » (EternalProbe 0.10) : grimoires achetés chez un même vendeur, en une visite
    for _, e in ipairs(ev) do
        if e.k == "livre" then
            local npc = Rogner(e.d[3])
            local livre = { id = tonumber(e.d[1]), name = Rogner(e.d[2]) }
            local prec = visites[#visites]
            if prec and prec.achat and prec.npc == npc and e.t - prec.tFin < 300 then
                if not prec.vus[livre.name] then prec.vus[livre.name] = true; prec.livres[#prec.livres + 1] = livre end
                prec.tFin = e.t
            else
                local carte, x, y = tonumber(e.d[5]), tonumber(e.d[6]), tonumber(e.d[7])
                if carte and x and y then x, y = x * 100, y * 100 else carte, x, y = Position(e.t) end
                visites[#visites + 1] = { t = e.t, tFin = e.t, npc = npc, achat = true, carte = carte, x = x, y = y,
                    niveau = tonumber(e.d[8]), sorts = {}, livres = { livre }, vus = { [livre.name] = true },
                    familier = Familier(e.d[4]) or (ctx.classFile == "WARLOCK" and "demon" or nil) }
            end
        end
    end
    table.sort(visites, function(a, b) return a.t < b.t end)
    for _, v in ipairs(visites) do
        brutes[#brutes + 1] = { t = v.t, genre = "entrainer", qid = 0, visite = v }
    end

    local ordre = { rendre = 0, faire = 1, entrainer = 2, prendre = 3 }
    table.sort(brutes, function(a, b)
        if a.t ~= b.t then return a.t < b.t end
        if ordre[a.genre] ~= ordre[b.genre] then return ordre[a.genre] < ordre[b.genre] end
        return a.qid < b.qid
    end)

    -- regroupement par lieu
    local etapes = {}
    for _, b in ipairs(brutes) do
      if b.genre == "entrainer" then
        local v = b.visite
        etapes[#etapes + 1] = { genre = "entrainer", carte = v.carte, x = v.x, y = v.y, location = v.npc,
            class = ctx.classFile, niveau = v.niveau,
            quests = { { kind = "entrainer", name = v.npc, spells = v.sorts, metier = v.metier or nil,
                familier = v.familier, achat = v.achat or nil, livres = v.livres,
                cle = ("%s-%s-%d"):format(tostring(ctx.classFile), Slug(v.npc), math.floor(v.t)) } } }
      else
        local carte, x, y, lieu
        if b.genre == "faire" then
            carte, x, y = b.carte, b.x, b.y
        else
            carte, x, y = Position(b.t)
            lieu = PnjAvant(b.t)
        end
        local q = { kind = b.genre, name = nom[b.qid], id = b.qid }
        local objs = Objectifs(b.qid)
        if b.genre ~= "rendre" and #objs > 0 then q.objectives = objs end
        if b.genre ~= "rendre" and collectes[b.qid] then q.collecte = collectes[b.qid] end
        local dernier = etapes[#etapes]
        local proche = dernier and dernier.carte == carte and math.abs(dernier.x - x) < 3 and math.abs(dernier.y - y) < 3
        if not lieu and b.genre ~= "faire" and proche and dernier.genre ~= "faire" and dernier.genre ~= "entrainer" then lieu = dernier.location end
        local meme = proche and dernier.genre == b.genre and (b.genre == "faire" or dernier.location == lieu)
        local deja = false
        if meme then
            for _, x2 in ipairs(dernier.quests) do if x2.id == b.qid then deja = true end end
        end
        if meme and not deja then
            table.insert(dernier.quests, q)
        else
            etapes[#etapes + 1] = { genre = b.genre, carte = carte, x = x, y = y, location = lieu, quests = { q }, releve = b.releve }
        end
      end
    end
    if #etapes == 0 then return nil, ns.L.IMP_NO_QUEST end

    -- La base intégrée d'abord : donneur pour « prendre », receveur pour « rendre », secteur des objectifs pour
    -- « faire ». Une quête absente de la base (propre à Forever) garde la position enregistrée.
    for _, e in ipairs(etapes) do
        e.source = "jeu"
        for _, q in ipairs(e.quests) do
            local b = ns.questDB and ns.questDB[q.id]
            local p
            if b then
                if e.genre == "prendre" and b.g then p = { b.g[3], b.g[4], b.g[5], b.g[1] }
                elseif e.genre == "rendre" and b.r then p = { b.r[3], b.r[4], b.r[5], b.r[1] }
                elseif e.genre == "faire" and b.c and not e.releve then p = { b.c[1], b.c[2], b.c[3] } end
            end
            if p then
                e.carte, e.x, e.y = p[1], p[2], p[3]
                if p[4] and not e.location then e.location = p[4] end
                e.source = "base"
                break
            end
        end
    end

    -- zone de départ d'après la race du personnage : les étapes d'une autre zone de départ
    -- (reste de l'enregistrement d'un autre personnage) sont écartées
    local carteRace
    for carte, z in pairs(ZONES_DEPART) do
        for _, r in ipairs(z.races or {}) do if r == ctx.raceFile then carteRace = carte end end
    end
    -- RouteProbe dit lui-même quelle partie il enregistrait : une « partie commune » reste une route de faction,
    -- même si elle passe encore par une carte de zone de départ (Brill est dans les Clairières de Tirisfal, la tour
    -- du zeppelin d'Orgrimmar à Durotar). Sans cette indication (ancien enregistrement), on devine par les cartes.
    local partie = (db.partie == "commune" or db.partie == "depart") and db.partie or nil
    local ecartees, departRace = 0, nil
    if carteRace and partie ~= "commune" then
        for _, e in ipairs(etapes) do if e.carte == carteRace then departRace = ZONES_DEPART[carteRace] break end end
    end
    if departRace then
        local gardees = {}
        for _, e in ipairs(etapes) do
            if ZONES_DEPART[e.carte] and e.carte ~= carteRace then ecartees = ecartees + 1 else gardees[#gardees + 1] = e end
        end
        etapes = gardees
    end

    -- niveaux et identité de la route
    local niveauMax = tonumber(ctx.level) or 1
    for _, e in ipairs(ev) do
        if e.k == "level" then niveauMax = math.max(niveauMax, tonumber(e.d[1]) or 0) end
    end
    local zoneDepart = NomZone(etapes[1].carte, ctx.zone)
    local steps, zones, zoneIndex, derniereZone = {}, 0, 0, nil
    local ancre, nbEntraineurs = nil, 0
    for _, e in ipairs(etapes) do
        local zone = NomZone(e.carte, ctx.zone)
        if zone ~= derniereZone then zoneIndex = zoneIndex + 1; derniereZone = zone end
        local s = { zone = zone, zoneIndex = zoneIndex, location = e.location, map = e.carte, x = Arrondi(e.x), y = Arrondi(e.y), quests = e.quests, source = e.source, releve = e.releve }
        local noms = {}
        for _, q in ipairs(e.quests) do noms[#noms + 1] = q.name end
        if e.genre == "prendre" then s.accepts = noms elseif e.genre == "rendre" then s.turnins = noms end
        if e.genre == "entrainer" then
            -- l'ancre (dernière action de quête avant la visite) replace l'étape si la route est réenregistrée
            s.class, s.niveau, s.ancre = e.class, e.niveau, ancre
            nbEntraineurs = nbEntraineurs + 1
        else
            local dq = e.quests[#e.quests]
            ancre = ("%s:%s"):format(dq.kind, tostring(dq.id))
        end
        steps[#steps + 1] = s
    end
    zones = zoneIndex

    -- niveau au début de l'enregistrement : la première montée de niveau moins un, sinon le niveau capté
    local niveauDebut
    for _, e in ipairs(ev) do
        if e.k == "level" then niveauDebut = math.max(1, (tonumber(e.d[1]) or 2) - 1) break end
    end
    niveauDebut = niveauDebut or tonumber(ctx.level) or 1

    -- route de départ (zone de départ d'une ou plusieurs races) ou route de faction (la suite)
    local depart = departRace or (partie ~= "commune" and ZONES_DEPART[etapes[1].carte]) or nil
    local route = {
        partie = partie,
        faction = ctx.faction,
        zone = zoneDepart,
        priority = 10,
        zoneCount = zones,
        source = "RouteProbe",
        enregistreAvec = ("%s %s"):format(tostring(ctx.className or ctx.classFile), tostring(ctx.raceName or ctx.raceFile)),
        importe = date and date("%Y-%m-%d %H:%M") or nil,
        classeEnregistree = ctx.classFile,
        niveauDebut = niveauDebut,
        niveauMax = niveauMax,
        nbEntraineurs = nbEntraineurs,
        ecartees = ecartees,
        steps = steps,
    }
    if depart then
        local noms = {}
        for _, r in ipairs(depart.races or {}) do noms[#noms + 1] = NOMS_RACES[r] or r end
        route.type = "depart"
        route.id = "rp-depart-" .. Slug(depart.nom)
        route.races = depart.races
        route.faction = depart.faction or ctx.faction
        route.minLevel = 1
        route.maxLevel = math.max(15, niveauMax + 5)
        route.name = ("Départ · %s%s · 1-%d"):format(depart.nom, #noms > 0 and (" (" .. table.concat(noms, ", ") .. ")") or "", niveauMax)
    else
        route.type = "faction"
        route.id = ("rp-%s-%d"):format(Slug(ctx.faction or "route"), niveauDebut)
        route.minLevel = math.max(1, niveauDebut - 2)
        route.maxLevel = math.min(60, niveauMax + 5)
        route.name = ("%s · %s · %d-%d"):format(ctx.faction or "Route", zoneDepart, niveauDebut, niveauMax)
    end
    return route
end

-- ---------------------------------------------------------------------------
-- Routes gardées pour le compte
-- ---------------------------------------------------------------------------

local function Stock()
    if type(EternalRoutesRoutesDB) ~= "table" then EternalRoutesRoutesDB = {} end
    EternalRoutesRoutesDB.routes = EternalRoutesRoutesDB.routes or {}
    return EternalRoutesRoutesDB.routes
end

--- Recharge les routes importées dans la liste des guides (au chargement de l'addon).
--- Répare une route importée par une ancienne version : une route enregistrée dans une zone de départ
--- devient route de départ (réservée à ses races), et une route de départ perd les étapes d'une autre
--- zone de départ (enregistrements de deux personnages mélangés). Renvoie true si la route a changé.
function Importer.Reparer(g)
    if type(g) ~= "table" or g.source ~= "RouteProbe" or type(g.steps) ~= "table" or not g.steps[1] then return false end
    local change = false
    local z = ZONES_DEPART[g.steps[1].map]
    if g.type ~= "depart" and z and z.races and g.partie ~= "commune" then
        g.type, g.races, g.faction, g.minLevel = "depart", z.races, z.faction or g.faction, 1
        change = true
    end
    if g.type == "depart" and type(g.races) == "table" then
        local carteRoute
        for carte, zz in pairs(ZONES_DEPART) do
            if zz.races and zz.races[1] == g.races[1] then carteRoute = carte end
        end
        if carteRoute then
            local gardees = {}
            for _, s in ipairs(g.steps) do
                if not (ZONES_DEPART[s.map] and s.map ~= carteRoute) then gardees[#gardees + 1] = s end
            end
            if #gardees > 0 and #gardees < #g.steps then
                g.steps, g.cartesSet, change = gardees, nil, true
            end
        end
    end
    return change
end

function Importer.Charger()
    ns.guides = ns.guides or {}
    for id, g in pairs(Stock()) do
        if type(g) == "table" and type(g.steps) == "table" then
            Importer.Reparer(g)
            ns.guides[id] = g
        end
    end
end

--- Réimport d'une route partagée : garde les étapes d'entraîneur des autres classes,
--- replacées après leur ancre. Renvoie le nombre d'étapes gardées et perdues.
function Importer.Fusionner(g, ancienne)
    local gardees, perdues = 0, 0
    if type(ancienne) ~= "table" or type(ancienne.steps) ~= "table" then return 0, 0 end
    for _, os in ipairs(ancienne.steps) do
        local q = os.quests and os.quests[1]
        if q and q.kind == "entrainer" and os.class and os.class ~= g.classeEnregistree then
            local pos
            if not os.ancre then
                pos = 0
            else
                for i, s in ipairs(g.steps) do
                    for _, x in ipairs(s.quests or {}) do
                        if x.kind ~= "entrainer" and ("%s:%s"):format(x.kind, tostring(x.id)) == os.ancre then pos = i end
                    end
                end
            end
            if pos then
                -- après l'ancre et les entraîneurs qui la suivent déjà
                while g.steps[pos + 1] and g.steps[pos + 1].quests and g.steps[pos + 1].quests[1]
                    and g.steps[pos + 1].quests[1].kind == "entrainer" do
                    pos = pos + 1
                end
                local voisine = g.steps[math.max(pos, 1)]
                if voisine then os.zone, os.zoneIndex = voisine.zone, voisine.zoneIndex end
                table.insert(g.steps, pos + 1, os)
                gardees = gardees + 1
            else
                perdues = perdues + 1
            end
        end
    end
    g.nbEntraineurs = 0
    for _, s in ipairs(g.steps) do
        if s.quests and s.quests[1] and s.quests[1].kind == "entrainer" then g.nbEntraineurs = g.nbEntraineurs + 1 end
    end
    return gardees, perdues
end

--- Ce que contient l'enregistrement, pour expliquer un refus.
function Importer.Contenu(db)
    local n = { events = 0, pos = 0, accept = 0, turnin = 0, debut = nil, fin = nil }
    for _, ligne in ipairs((type(db) == "table" and type(db.events) == "table") and db.events or {}) do
        n.events = n.events + 1
        local k = tostring(ligne):match("^[^|]*|([^|]*)")
        if k == "pos" or k == "targetpos" then n.pos = n.pos + 1 end
        if k == "accept" then n.accept = n.accept + 1 end
        if k == "turnin" then n.turnin = n.turnin + 1 end
    end
    return n
end

--- Enregistrement à importer : celui d'EternalProbe s'il en contient un, sinon celui de l'ancienne sonde RouteProbe.
function Importer.Enregistrement()
    local ep, rp = _G.EternalProbeDB, _G.RouteProbeDB
    if type(ep) == "table" and type(ep.events) == "table" and #ep.events > 0 then return ep end
    if type(rp) == "table" and type(rp.events) == "table" and #rp.events > 0 then return rp end
    return ep or rp
end

function Importer.Importer()
    local db = Importer.Enregistrement()
    local ok, g, raison = pcall(Importer.Convertir, db)
    if not ok then
        ns.Print(ns.L.IMP_ERROR:format(tostring(g)))
        return nil
    end
    if not g then
        if not db then
            ns.Print(ns.L.IMP_NO_PROBE)
        else
            ns.Print(ns.L.IMP_FAILED:format(tostring(raison)))
            local n = Importer.Contenu(db)
            ns.Print(ns.L.IMP_CONTENT:format(n.events, n.pos, n.accept, n.turnin))
            ns.Print(ns.L.IMP_HINT)
        end
        return nil
    end
    local remplace = Stock()[g.id] ~= nil
    -- la version remplacée est gardée : /er restaurer <id> la remet si l'import n'était pas le bon
    if remplace then
        EternalRoutesRoutesDB.avant = EternalRoutesRoutesDB.avant or {}
        EternalRoutesRoutesDB.avant[g.id] = Stock()[g.id]
    end
    local gardees, perdues = Importer.Fusionner(g, Stock()[g.id])
    Stock()[g.id] = g
    ns.guides[g.id] = g
    local nbQuetes = 0
    for _, s in ipairs(g.steps) do nbQuetes = nbQuetes + #s.quests end
    ns.Print((remplace and ns.L.IMP_UPDATED or ns.L.IMP_NEW):format(ns.Engine and ns.Engine.NomGuide(g) or g.name, #g.steps, nbQuetes))
    if (g.ecartees or 0) > 0 then ns.Print(ns.L.IMP_DROPPED:format(g.ecartees)) end
    if (g.nbEntraineurs or 0) > 0 then
        ns.Print(ns.L.IMP_TRAINERS:format(g.nbEntraineurs))
    end
    if gardees > 0 then ns.Print(ns.L.IMP_KEPT:format(gardees)) end
    if remplace then ns.Print(ns.L.IMP_BACKUP:format(g.id)) end
    if perdues > 0 then ns.Print(ns.L.IMP_LOST:format(perdues)) end
    if g.type == "depart" then
        ns.Print(ns.L.IMP_START)
    else
        ns.Print(ns.L.IMP_FACTION:format(tostring(g.faction), g.minLevel, g.maxLevel))
    end
    -- choisir la route si le personnage n'en suit aucune, ou s'il suivait déjà celle-ci
    if ns.Engine then
        local active = ns.Engine.GetActiveGuide()
        if not active or ns.db.activeGuide == g.id then
            for _, candidat in ipairs(ns.Engine.GetGuidesForPlayer()) do
                if candidat.id == g.id then ns.Engine.LoadGuide(g.id) break end
            end
        elseif g.type == "faction" and active.type == "depart" and ns.Engine.Enchainer then
            -- le personnage a déjà quitté sa zone de départ (route importée depuis Orgrimmar, par exemple) :
            -- la route de faction prend le relais si elle passe par la carte où il se trouve
            ns.Engine.Enchainer("import")
        end
        ns.Engine.Refresh()
    end
    ns.Print(ns.L.IMP_NEXT_CHAR)
    return g
end

function Importer.Lister()
    local n = 0
    for id, g in pairs(Stock()) do
        n = n + 1
        ns.Print(ns.L.IMP_LIST_LINE:format(id, ns.Engine and ns.Engine.NomGuide(g) or tostring(g.name), #(g.steps or {}), tostring(g.importe or "?")))
    end
    if n == 0 then ns.Print(ns.L.IMP_LIST_EMPTY) end
end

--- Remet la version d'une route d'avant son dernier import (échange : un second appel revient à l'import).
function Importer.Restaurer(id)
    id = Rogner(id)
    local avant = type(EternalRoutesRoutesDB) == "table" and EternalRoutesRoutesDB.avant and EternalRoutesRoutesDB.avant[id]
    if type(avant) ~= "table" then
        ns.Print(ns.L.IMP_NO_BACKUP:format(id))
        return false
    end
    local actuelle = Stock()[id]
    Stock()[id] = avant
    EternalRoutesRoutesDB.avant[id] = actuelle
    ns.guides[id] = avant
    if ns.Engine then ns.Engine.Refresh() end
    ns.Print(ns.L.IMP_RESTORED:format(ns.Engine and ns.Engine.NomGuide(avant) or tostring(avant.name), #(avant.steps or {})))
    return true
end

function Importer.Supprimer(id)
    id = Rogner(id)
    if Stock()[id] then
        Stock()[id] = nil
        ns.guides[id] = nil
        if ns.db and ns.db.activeGuide == id then ns.db.activeGuide = nil end
        if ns.Engine then ns.Engine.Refresh() end
        ns.Print(ns.L.IMP_DELETED:format(id))
    else
        ns.Print(ns.L.IMP_UNKNOWN:format(id))
    end
end

-- les routes importées sont chargées dès que l'addon a lu ses sauvegardes
local f = CreateFrame("Frame")
f:RegisterEvent("ADDON_LOADED")
f:SetScript("OnEvent", function(_, _, nomAddon)
    if nomAddon == ns.ADDON_NAME then Importer.Charger() end
end)
