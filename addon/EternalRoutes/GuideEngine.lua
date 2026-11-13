--[[----------------------------------------------------------------------------
    EternalRoutes — GuideEngine.lua
    Moteur de guide : progression, détection par nom, réactions aux événements.

    État exposé (analysable via /er state) :
      acceptedNames  quêtes acceptées (depuis QUEST_ACCEPTED)
      interacting    une fenêtre de dialogue/quête est ouverte
      atNpc          le joueur est à moins de 12 m du point de l'étape
      lastEvent      dernier événement WoW reçu
      debug          journalisation des événements dans le chat
------------------------------------------------------------------------------]]

local ns = EternalRoutes
local Engine = {}
ns.Engine = Engine

-- état exposé
Engine.acceptedNames = {}
Engine.interacting = false
Engine.atNpc = false
Engine.lastEvent = nil
Engine.debug = false

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

local function PlayerFaction()
    local f = UnitFactionGroup("player")
    if f == "Alliance" or f == "Horde" then
        return f
    end
    return nil
end

local function PlayerLevel()
    return UnitLevel("player") or 1
end

local function IsQuestTurnedIn(id)
    if not id then return false end
    if ns.db and ns.db.doneQuests and ns.db.doneQuests[id] then return true end
    return false
end

local function HasItem(id, count)
    if not id then return false end
    local n = 0
    if C_Item and C_Item.GetItemCount then
        n = C_Item.GetItemCount(id) or 0
    elseif GetItemCount then
        n = GetItemCount(id) or 0
    end
    return n >= (count or 1)
end

local function IsOnMap(mapId)
    if not mapId then return false end
    if C_Map and C_Map.GetBestMapForUnit then
        return C_Map.GetBestMapForUnit("player") == mapId
    end
    return false
end

-- ---------------------------------------------------------------------------
-- Quêtes par nom (le site n'a pas d'IDs) + par ID (events)
-- ---------------------------------------------------------------------------

local questLogNames = {}
local questLogDirty = true

local function NormalizeName(s)
    if not s then return "" end
    s = s:gsub("\226\128\153", "'") -- ’ -> '
    s = s:gsub("\226\128\152", "'") -- ‘ -> '
    return s
end

local function RefreshQuestLog()
    questLogNames = {}
    local count = 0
    if C_QuestLog and C_QuestLog.GetNumQuestLogEntries then
        count = C_QuestLog.GetNumQuestLogEntries() or 0
    elseif GetNumQuestLogEntries then
        count = GetNumQuestLogEntries() or 0
    end

    for i = 1, count do
        local title, isHeader
        if C_QuestLog and C_QuestLog.GetInfo then
            local info = C_QuestLog.GetInfo(i)
            if info then
                title = info.title
                isHeader = info.isHeader
            end
        end
        if not title and GetQuestLogTitle then
            title, _, _, isHeader = GetQuestLogTitle(i)
        end
        if title and not isHeader then
            questLogNames[NormalizeName(title)] = true
        end
    end
    questLogDirty = false
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

function Engine.NormalizeName(s)
    return NormalizeName(s)
end

-- résout les IDs connus d'une quête (QuestIds.lua) : nombre ou liste
local function IdsFor(name)
    local v = ns.questIds and ns.questIds[name]
    if type(v) == "number" then return { v } end
    if type(v) == "table" then return v end
    -- identifiant appris en jeu à l'acceptation (quêtes propres à Forever)
    local appris = name and ns.db and ns.db.learnedIds and ns.db.learnedIds[NormalizeName(name)]
    if appris then return { appris } end
    return nil
end

function Engine.IsOnQuestByName(name)
    if not name then return false end
    local ids = IdsFor(name)
    if ids and C_QuestLog then
        for _, id in ipairs(ids) do
            if C_QuestLog.IsOnQuest and C_QuestLog.IsOnQuest(id) then return true end
            if ns.db and ns.db.doneQuests and ns.db.doneQuests[id] then return true end
        end
        return false
    end
    local n = NormalizeName(name)
    if Engine.acceptedNames[n] then return true end
    if questLogDirty then RefreshQuestLog() end
    return questLogNames[n] == true
end

-- ---------------------------------------------------------------------------
-- API
-- ---------------------------------------------------------------------------

function Engine.GetPlayerLevel()
    return PlayerLevel()
end

--- Le guide convient-il au personnage (faction, classe, race ; niveau si demandé) ?
function Engine.GuideConvient(g, avecNiveau)
    if not g then return false end
    local _, classFile = UnitClass("player")
    local _, raceFile = UnitRace("player")
    local okFaction = (g.faction == "Neutral" or g.faction == PlayerFaction())
    local okClass = (not g.class or g.class == "" or g.class == classFile)
    local okRace = (not g.race or g.race == "" or g.race == raceFile)
    if type(g.races) == "table" and #g.races > 0 then
        okRace = false
        for _, r in ipairs(g.races) do if r == raceFile then okRace = true end end
    end
    local okLevel = true
    if avecNiveau then
        local level = PlayerLevel()
        okLevel = level >= (g.minLevel or 1) and level <= (g.maxLevel or 60)
    end
    return okFaction and okClass and okRace and okLevel
end

function Engine.GetGuidesForPlayer()
    local list = {}
    for _, g in pairs(ns.guides) do
        if Engine.GuideConvient(g, true) then list[#list + 1] = g end
    end
    table.sort(list, function(a, b)
        local pa, pb = a.priority or 0, b.priority or 0
        if pa ~= pb then return pa > pb end
        if (a.minLevel or 0) ~= (b.minLevel or 0) then
            return (a.minLevel or 0) < (b.minLevel or 0)
        end
        return tostring(a.id) < tostring(b.id)
    end)
    return list
end

-- tous les guides (pour le sélecteur)
function Engine.GetAllGuides()
    local list = {}
    for id, g in pairs(ns.guides) do list[#list + 1] = g end
    table.sort(list, function(a, b) return Engine.NomGuide(a) < Engine.NomGuide(b) end)
    return list
end

function Engine.GetActiveGuide()
    local id = ns.db.activeGuide
    return (id and ns.guides[id]) or nil
end

function Engine.GetStepIndex()
    return ns.db.stepIndex or 1
end

-- une étape s'applique-t-elle à la classe du joueur ?
-- bit du personnage dans les masques de classe et de race (nil : inconnu, pas de filtre)
local function BitJoueur(info)
    local id = select(3, info("player"))
    if type(id) ~= "number" or id < 1 then return nil end
    return 2 ^ (id - 1)
end

local function ABit(masque, b)
    return math.floor(masque / b) % 2 == 1
end

--- La quête concerne-t-elle ce personnage ? Masques des bases libres (QuestRestrictions.lua),
--- puis quêtes constatées absentes chez leur PNJ (quêtes propres à Forever, inconnues des bases).
function Engine.QueteApplicable(q)
    if not q or not q.id then return true end
    if ns.db and ns.db.absentes and ns.db.absentes[q.id] then return false end
    local cm = ns.questClassMask and ns.questClassMask[q.id]
    local bc = cm and BitJoueur(UnitClass)
    if cm and bc and not ABit(cm, bc) then return false end
    local rm = ns.questRaceMask and ns.questRaceMask[q.id]
    local br = rm and BitJoueur(UnitRace)
    -- races du jeu d'origine seulement (1 à 8) : une race nouvelle (Skyborne) n'est pas filtrée
    if rm and br and br <= 128 and not ABit(rm, br) then return false end
    return true
end

--- Quêtes de l'étape qui concernent le personnage.
function Engine.QuetesApplicables(step)
    local out = {}
    for _, q in ipairs((step and step.quests) or {}) do
        if Engine.QueteApplicable(q) then out[#out + 1] = q end
    end
    return out
end

function Engine.StepApplies(step)
    if not step then return true end
    if step.quests and #step.quests > 0 and #Engine.QuetesApplicables(step) == 0 then return false end
    if step.class and step.class ~= "" then
        local _, classFile = UnitClass("player")
        if step.class ~= classFile then return false end
    end
    if step.race and step.race ~= "" then
        local _, raceFile = UnitRace("player")
        if step.race ~= raceFile then return false end
    end
    return true
end

function Engine.GetCurrentStep()
    local g = Engine.GetActiveGuide()
    if not g then return nil end
    local idx = ns.db.stepIndex or 1
    while idx <= #g.steps and not Engine.StepApplies(g.steps[idx]) do
        idx = idx + 1
    end
    if idx ~= (ns.db.stepIndex or 1) then
        ns.db.stepIndex = idx
    end
    if idx > #g.steps then return nil end
    return g.steps[idx]
end

-- objectifs (compteurs de jeu) d'une quête
-- compte les objets du sac portant ce nom (secours quand le jeu remet le compteur à 0)
local function CountItemsByName(name)
    if not name or name == "" then return 0 end
    local count = 0
    local numSlots = (C_Container and C_Container.GetContainerNumSlots) or GetContainerNumSlots
    local getInfo = (C_Container and C_Container.GetContainerItemInfo) or GetContainerItemInfo
    if not numSlots or not getInfo then return 0 end
    for bag = 0, 4 do
        local ok, slots = pcall(numSlots, bag)
        if ok and slots and slots > 0 then
            for slot = 1, slots do
                local info = getInfo(bag, slot)
                if type(info) == "table" and info.itemID then
                    if GetItemInfo(info.itemID) == name then
                        count = count + (info.stackCount or 1)
                    end
                end
            end
        end
    end
    return count
end

local function Anglais() return ns.IsEnglish and ns.IsEnglish() end

--- Contenus propres à Forever : nom anglais saisi à la main (content/traductions-forever-en.ts), sinon le texte tel quel.
function Engine.TraduireEn(texte)
    if not texte or not Anglais() or not ns.traductionsEn then return texte end
    local t = tostring(texte):gsub("\194\160", " "):gsub("^%s+", ""):gsub("%s+$", "")
    return ns.traductionsEn[t] or texte
end
local TraduireEn = Engine.TraduireEn

-- ---------------------------------------------------------------------------
-- Étapes « entraîneur » : visite d'un entraîneur, réservée à la classe enregistrée
-- ---------------------------------------------------------------------------

function Engine.EstEntraineur(step)
    local q = step and step.quests and step.quests[1]
    return q ~= nil and q.kind == "entrainer"
end

local function SortConnu(id)
    if not id then return false end
    if IsSpellKnown and IsSpellKnown(id) then return true end
    if IsPlayerSpell and IsPlayerSpell(id) then return true end
    return false
end

local function NomSort(sp)
    local en = Anglais() and ns.spellNamesEn and ns.spellNamesEn[sp.id]
    if en then
        return en[2] and (en[1] .. " (" .. ns.L.RANK:format(en[2]) .. ")") or en[1]
    end
    local nom = GetSpellInfo and GetSpellInfo(sp.id)
    if nom and nom ~= "" then
        local rang = GetSpellSubtext and GetSpellSubtext(sp.id)
        if rang and rang ~= "" then nom = nom .. " (" .. rang .. ")" end
        return nom
    end
    return sp.name or ("#" .. tostring(sp.id))
end

--- Faite quand l'entraîneur a été vu à cette étape, ou quand tous ses sorts sont connus.
function Engine.EtatEntraineur(q)
    if ns.db and ns.db.entraineurs and q.cle and ns.db.entraineurs[q.cle] then return "done" end
    local sorts = q.spells or {}
    if #sorts > 0 then
        local tous = true
        for _, sp in ipairs(sorts) do
            if not SortConnu(sp.id) then tous = false break end
        end
        if tous then return "done" end
    end
    return "available"
end

--- Fenêtre d'entraîneur fermée : valide l'étape en cours si c'est une visite du même genre.
function Engine.EntraineurVu(npc, metier)
    local step = Engine.GetCurrentStep()
    if not Engine.EstEntraineur(step) then return end
    local q = step.quests[1]
    local memeNom = npc and q.name and npc == q.name
    local memeGenre = (q.metier and true or false) == (metier and true or false)
    if memeNom or memeGenre then
        ns.db.entraineurs = ns.db.entraineurs or {}
        ns.db.entraineurs[q.cle or q.name] = true
    end
end

function Engine.GetObjectives(q)
    if q and q.kind == "entrainer" then
        local out = {}
        for _, sp in ipairs(q.spells or {}) do
            local connu = SortConnu(sp.id)
            out[#out + 1] = { text = NomSort(sp), numFulfilled = connu and 1 or 0, numRequired = 0, finished = connu }
        end
        return out
    end
    local ids = q.id and { q.id } or IdsFor(q.name)
    local out = {}
    if ids and C_QuestLog and C_QuestLog.GetQuestObjectives then
        for _, id in ipairs(ids) do
            local objs = C_QuestLog.GetQuestObjectives(id)
            local logIndex = C_QuestLog.GetLogIndexForQuestID and C_QuestLog.GetLogIndexForQuestID(id) or nil
            if objs then
                for _, o in ipairs(objs) do
                    out[#out + 1] = o
                end
            end
        end
    end
    -- version anglaise sur un client français : texte anglais de la base, compteurs du jeu
    if #out > 0 and Anglais() then
        local base = Engine.Base(q)
        if base and base.obj and base.oe then
            local fr, en = {}, {}
            for m in (base.obj .. " ; "):gmatch("(.-) ; ") do if m ~= "" then fr[#fr + 1] = m end end
            for m in (base.oe .. " ; "):gmatch("(.-) ; ") do if m ~= "" then en[#en + 1] = m end end
            if #fr == #en then
                local traduits = {}
                for k, o in ipairs(out) do
                    local texte = tostring(o.text or "")
                    local trouve
                    for i, f in ipairs(fr) do
                        local nom = f:match("×%s*(.+)$") or f
                        if texte:find(nom, 1, true) then trouve = en[i] break end
                    end
                    if not trouve and #out == #en then trouve = en[k] end
                    if trouve then
                        local c = {}
                        for cle, v in pairs(o) do c[cle] = v end
                        c.text = trouve
                        traduits[#traduits + 1] = c
                    else
                        traduits[#traduits + 1] = o
                    end
                end
                out = traduits
            end
        end
    end
    if #out > 0 and Anglais() and ns.traductionsEn then
        for k, o in ipairs(out) do
            local texte = tostring(o.text or "")
            local nom, compte = texte:match("^(.-)(%s*:%s*%d+%s*/%s*%d+.*)$")
            local avant
            if not nom then avant, nom = texte:match("^(%d+%s*/%s*%d+%s+)(.+)$") end
            local en = TraduireEn(nom or texte)
            if en ~= (nom or texte) then
                local c = {}
                for cle, v in pairs(o) do c[cle] = v end
                c.text = (avant or "") .. en .. (compte or "")
                out[k] = c
            end
        end
    end
    -- repli : base intégrée dans la langue choisie, ou objectifs enregistrés (langue du client)
    if #out == 0 then
        local base = Engine.Base(q)
        local texte = base and ((ns.IsEnglish and ns.IsEnglish() and base.oe) or (not (ns.IsEnglish and ns.IsEnglish()) and (q.objectives == nil) and base.obj))
        if texte and texte ~= "" then
            for morceau in (texte .. " ; "):gmatch("(.-) ; ") do
                if morceau ~= "" then out[#out + 1] = { text = morceau, numFulfilled = 0, numRequired = 0, finished = false } end
            end
            return out
        end
    end
    if #out == 0 then
        local entry = q.id and ns.questObjectives and ns.questObjectives[q.id]
        local en = ns.IsEnglish and ns.IsEnglish()
        local src = en and (entry and entry.objectives) or q.objectives
        if type(src) ~= "table" then
            src = en and q.objectives or (entry and entry.objectives)
        end
        if type(src) == "table" then
            for _, o in ipairs(src) do
                if type(o) == "table" then
                    out[#out + 1] = { text = TraduireEn(o.text or ""), numFulfilled = o.fulfilled or 0, numRequired = o.required or 0, finished = false }
                else
                    out[#out + 1] = { text = TraduireEn(tostring(o)), numFulfilled = 0, numRequired = 0, finished = false }
                end
            end
        end
    end
    return out
end

--- Sources relevées par RouteProbe pour l'objet d'un objectif (« sur : Coffre, Sanglier »), ou nil.
function Engine.SourcesObjectif(q, texte)
    if not (q and type(q.collecte) == "table" and texte) then return nil end
    for _, c in ipairs(q.collecte) do
        if c.item and c.item ~= "" and #(c.sources or {}) > 0 and tostring(texte):find(c.item, 1, true) then
            return ns.L.OBJ_SOURCES:format(table.concat(c.sources, ", "))
        end
    end
    return nil
end

-- description de la quête (base AC)
function Engine.GetQuestDescription(q)
    if not q or not q.id then return nil end
    local e = ns.questObjectives and ns.questObjectives[q.id]
    if e and e.description and e.description ~= "" then return e.description end
    local b = Engine.Base(q)
    if b then
        local t = (ns.IsEnglish and ns.IsEnglish() and b.oe) or b.obj
        if t and t ~= "" then return t end
    end
    return nil
end

--- Fiche de la quête dans la base intégrée (QuestDB.lua), ou nil (quête propre à Forever).
function Engine.Base(q)
    return q and q.id and ns.questDB and ns.questDB[q.id] or nil
end

--- Niveau et quête préalable : renvoie le niveau de la quête, le niveau requis s'il manque,
--- et le nom de la quête préalable si elle n'est pas encore rendue.
function Engine.Prerequis(q)
    local b = Engine.Base(q)
    if not b then return nil end
    local manqueNiveau = b.min and PlayerLevel() < b.min and b.min or nil
    local manqueQuete
    if b.av and ns.questDB[b.av] then
        local av = { id = b.av, name = ns.questDB[b.av].t }
        if Engine.QuestState(av) ~= "done" then manqueQuete = Engine.QuestName(av) end
    end
    return b.nv, manqueNiveau, manqueQuete
end

-- nom localisé de la quête (FR/EN selon le client), sinon nom enregistré
function Engine.QuestName(q)
    if not q then return "" end
    if q.kind == "entrainer" then return TraduireEn(q.name) or "" end
    -- version anglaise : le titre anglais passe avant celui du journal (langue du client)
    if ns.IsEnglish and ns.IsEnglish() then
        local b = q.id and ns.questDB and ns.questDB[q.id]
        if b and b.te then return b.te end
        local en = ns.questNames and ns.questNames[q.name]
        if en then return en end
        if q.name and TraduireEn(q.name) ~= q.name then return TraduireEn(q.name) end
    end
    if q.id and C_QuestLog and C_QuestLog.GetTitleForQuestID then
        local t = C_QuestLog.GetTitleForQuestID(q.id)
        if t and t ~= "" then return TraduireEn(t) end
    end
    return TraduireEn(q.name) or ""
end

-- ---------------------------------------------------------------------------
-- Noms dans la langue choisie : zones, PNJ, routes
-- ---------------------------------------------------------------------------


local RACES_EN = { Human = "Human", Dwarf = "Dwarf", Gnome = "Gnome", NightElf = "Night Elf",
    Orc = "Orc", Troll = "Troll", Scourge = "Undead", Tauren = "Tauren" }
local RACES_FR = { Human = "Humain", Dwarf = "Nain", Gnome = "Gnome", NightElf = "Elfe de la nuit",
    Orc = "Orc", Troll = "Troll", Scourge = "Mort-vivant", Tauren = "Tauren" }

--- Nom d'une zone d'après sa carte (UiMap), sinon le nom enregistré.
function Engine.NomCarte(map, defaut)
    if Anglais() and map and ns.zoneNamesEn and ns.zoneNamesEn[map] then return ns.zoneNamesEn[map] end
    return defaut or (map and ns.zoneNamesEn and ns.zoneNamesEn[map]) or "?"
end

function Engine.NomZone(step)
    if not step then return "" end
    return Engine.NomCarte(step.map or (ns.zoneMaps and step.zone and ns.zoneMaps[step.zone]), step.zone)
end

--- PNJ de l'étape : nom anglais de la base intégrée quand il y est (donneur ou receveur d'une de ses quêtes).
function Engine.NomLieu(step)
    local lieu = step and step.location
    if not lieu or lieu == "" or not Anglais() or not ns.questDB then return lieu end
    for _, q in ipairs(step.quests or {}) do
        local b = q.id and ns.questDB[q.id]
        if b then
            for _, p in ipairs({ b.g, b.r }) do
                if p and p[1] == lieu and p[2] and p[2] ~= "" then return p[2] end
            end
        end
    end
    -- sinon, tous les PNJ connus de la base (table construite une fois)
    if not Engine.pnjEn then
        Engine.pnjEn = {}
        for _, b in pairs(ns.questDB) do
            for _, p in ipairs({ b.g, b.r }) do
                if p and p[1] and p[2] and p[2] ~= "" then Engine.pnjEn[p[1]] = p[2] end
            end
        end
    end
    return Engine.pnjEn[lieu] or TraduireEn(lieu)
end

--- Nom d'une route : les routes RouteProbe sont renommées dans la langue choisie.
function Engine.NomGuide(g)
    if not g then return "" end
    if g.source ~= "RouteProbe" then return g.name or g.id or "" end
    local premiere = g.steps and g.steps[1]
    local zone = Engine.NomCarte(premiere and premiere.map, g.zone)
    if g.type == "depart" then
        local noms = {}
        for _, r in ipairs(g.races or {}) do noms[#noms + 1] = (Anglais() and RACES_EN or RACES_FR)[r] or r end
        local fin = g.niveauMax or tonumber(tostring(g.name or ""):match("1%-(%d+)$")) or g.maxLevel or 10
        return (ns.L.ROUTE_START or "%s%s 1-%d"):format(zone, #noms > 0 and (" (" .. table.concat(noms, ", ") .. ")") or "", fin)
    end
    local a, b = tostring(g.name or ""):match("(%d+)%-(%d+)$")
    return ("%s · %s · %s-%s"):format(tostring(g.faction or "Route"), zone,
        tostring(g.niveauDebut or a or g.minLevel or 1), tostring(g.niveauMax or b or g.maxLevel or 60))
end

-- état réel d'une quête : available / in_progress / complete / done
function Engine.QuestState(q)
    if not q then return "unknown" end
    if q.kind == "entrainer" then return Engine.EtatEntraineur(q) end
    local ids = q.id and { q.id } or IdsFor(q.name)
    if not C_QuestLog then return "unknown" end
    if not ids then
        -- quête sans identifiant connu (ajouts Forever) : suivie par son nom dans le journal
        if not q.name then return "unknown" end
        return Engine.IsOnQuestByName(q.name) and "in_progress" or "available"
    end

    for _, id in ipairs(ids) do
        if ns.db and ns.db.doneQuests and ns.db.doneQuests[id] then return "done" end
        -- rendue avant l'installation de l'addon, ou sur un autre appareil
        if C_QuestLog.IsQuestFlaggedCompleted and C_QuestLog.IsQuestFlaggedCompleted(id) then return "done" end
    end

    local onQuest = false
    if C_QuestLog.IsOnQuest then
        for _, id in ipairs(ids) do
            if C_QuestLog.IsOnQuest(id) then onQuest = true; break end
        end
    end
    if not onQuest then return "available" end

    -- drapeau fiable du journal (prêt à rendre) : évite le faux « complete »
    if C_QuestLog.GetLogIndexForQuestID and C_QuestLog.GetInfo then
        for _, id in ipairs(ids) do
            local idx = C_QuestLog.GetLogIndexForQuestID(id)
            if idx and idx > 0 then
                local info = C_QuestLog.GetInfo(idx)
                if info then
                    if info.isComplete then return "complete" end
                    -- le drapeau seul ne suffit pas : vérifier les objectifs
                    local objs = Engine.GetObjectives(q)
                    local counted, allDone = 0, true
                    for _, o in ipairs(objs) do
                        if o.type ~= "log" then
                            counted = counted + 1
                            if not o.finished then allDone = false; break end
                        end
                    end
                    if counted > 0 and allDone then return "complete" end
                    return "in_progress"
                end
            end
        end
    end

    -- repli : objectifs (on ignore les objectifs « lire » qui se valident dans le sac)
    local objs = Engine.GetObjectives(q)
    local counted = 0
    for _, o in ipairs(objs) do
        if o.type ~= "log" then
            counted = counted + 1
            if not o.finished then return "in_progress" end
        end
    end
    if counted == 0 then return "in_progress" end
    return "complete"
end

Engine.GetQuestStatus = Engine.QuestState

-- prochaine action de l'étape (pour l'intitulé de la flèche)
function Engine.GetPendingQuest(step)
    if not step or not step.quests then return nil end
    local quetes = Engine.QuetesApplicables(step)
    for _, q in ipairs(quetes) do
        local state = Engine.QuestState(q)
        if state ~= "done" and state ~= "complete" then
            return q
        end
    end
    return quetes[1] or step.quests[1]
end

-- une étape est terminée quand toutes ses quêtes le sont
function Engine.StepIsComplete(step)
    if not step then return false end
    if not Engine.StepApplies(step) then return true end
    if not step.quests or #step.quests == 0 then return false end
    for _, q in ipairs(Engine.QuetesApplicables(step)) do
        local state = Engine.QuestState(q)
        if q.kind == "rendre" then
            if state ~= "done" then return false end
        elseif q.kind == "prendre" then
            -- acceptée suffit : l'étape « faire » prend le relais
            if state == "available" or state == "unknown" then return false end
        else
            if state ~= "complete" and state ~= "done" then return false end
        end
    end
    return true
end

function Engine.GetViewStep()
    local g = Engine.GetActiveGuide()
    if not g then return 1 end
    local v = ns.viewStep or (ns.db.stepIndex or 1)
    if v < 1 then v = 1 end
    if v > #g.steps then v = #g.steps end
    return v
end

function Engine.Advance()
    ns.viewStep = nil
    local g = Engine.GetActiveGuide()
    if not g then return end
    -- après la dernière étape : #steps + 1, le guide est terminé
    if Engine.GetStepIndex() <= #g.steps then
        ns.db.stepIndex = Engine.GetStepIndex() + 1
        if ns.db.stepIndex > #g.steps then
            ns.Print(ns.L.DONE)
            if not (Engine.Enchainer and Engine.Enchainer("fin")) then
                ns.Print(ns.L.CHOOSE_NEXT or "")
                Engine.Refresh()
            end
            return
        end
    end
    Engine.Refresh()
end

-- le guide est-il terminé ?
function Engine.IsFinished()
    local g = Engine.GetActiveGuide()
    return g ~= nil and (ns.db.stepIndex or 1) > #g.steps
end

function Engine.GoBack()
    if Engine.GetStepIndex() > 1 then
        ns.db.stepIndex = Engine.GetStepIndex() - 1
    end
    Engine.Refresh()
end

function Engine.FastForward()
    local g = Engine.GetActiveGuide()
    if not g then return end
    local idx = ns.db.stepIndex or 1
    local guard = 0
    while idx <= #g.steps and Engine.StepIsComplete(g.steps[idx]) and guard < 100000 do
        idx = idx + 1
        guard = guard + 1
    end
    ns.db.stepIndex = idx
end

function Engine.LoadGuide(id)
    if not ns.guides[id] then return false end
    ns.viewStep = nil
    ns.db.activeGuide = id
    ns.db.stepIndex = 1
    Engine.SyncToProgress()
    Engine.Refresh()
    if Engine.IsFinished() then
        ns.Print(ns.L.ALREADY_DONE)
    elseif (ns.db.stepIndex or 1) > 1 then
        ns.Print(ns.L.RESUME_AT:format(ns.db.stepIndex))
    end
    return true
end

function Engine.Refresh()
    if ns.Window and ns.Window.Refresh then
        ns.Window.Refresh()
    end
    if ns.TomTomBridge and ns.TomTomBridge.Refresh then
        ns.TomTomBridge.Refresh()
    end
end

-- ---------------------------------------------------------------------------
-- Détection « devant le PNJ » (distance à la flèche, ≤ 12 m)
-- ---------------------------------------------------------------------------

local function UpdateAtNpc()
    local step = Engine.GetCurrentStep()
    if not step or not (step.x and step.y) then
        Engine.atNpc = false
        return
    end
    if not (ns.TomTomBridge and ns.TomTomBridge.GetDistance) then
        Engine.atNpc = false
        return
    end
    if ns.TomTomBridge.IsOnWaypointMap and not ns.TomTomBridge.IsOnWaypointMap() then
        Engine.atNpc = false
        return
    end
    local d = ns.TomTomBridge.GetDistance()
    Engine.atNpc = (d ~= nil and d <= 12)
end

-- arrivée sur une étape « objectif » (Faire uniquement, ≤ 40 m)
local function ArrivedAtStep(step)
    if not (step.x and step.y) then return false end
    if step.accepts or step.turnins then return false end
    if not (ns.TomTomBridge and ns.TomTomBridge.GetDistance) then return false end
    if ns.TomTomBridge.IsOnWaypointMap and not ns.TomTomBridge.IsOnWaypointMap() then return false end
    local d = ns.TomTomBridge.GetDistance()
    return d ~= nil and d <= 40
end

-- ---------------------------------------------------------------------------
-- Analyse (/er state, /er quests)
-- ---------------------------------------------------------------------------

function Engine.Describe()
    local g = Engine.GetActiveGuide()
    if not g then return ns.L.NO_ACTIVE end
    local idx = Engine.GetStepIndex()
    local step = g.steps[idx]
    if not step then return ns.L.STEP_MISSING end

    local d = ns.TomTomBridge and ns.TomTomBridge.GetDistance and ns.TomTomBridge.GetDistance()
    local distText = d and ("%.0f %s"):format(d, ns.L.UNIT) or "—"

    local lines = {
        ns.L.DESC_GUIDE:format(Engine.NomGuide(g)),
        ns.L.DESC_STEP:format(idx, #g.steps, Engine.NomZone(step)),
        ns.L.DESC_PLACE:format(tostring(Engine.NomLieu(step) or "?")),
        ns.L.DESC_DIST:format(distText),
        ns.L.DESC_NPC:format(tostring(Engine.atNpc), tostring(Engine.interacting)),
        ns.L.DESC_EVENT:format(tostring(Engine.lastEvent or "—")),
    }
    for i, q in ipairs(step.quests or {}) do
        lines[#lines + 1] = ("  #%d %s « %s » [%s]"):format(i, ns.L["ACT_" .. tostring(q.kind)] or q.kind, Engine.QuestName(q), Engine.GetQuestStatus(q))
    end
    return table.concat(lines, "\n")
end

-- ---------------------------------------------------------------------------
-- Événements et boucle
-- ---------------------------------------------------------------------------

local engineFrame = CreateFrame("Frame")
engineFrame:RegisterEvent("QUEST_LOG_UPDATE")
engineFrame:RegisterEvent("QUEST_ACCEPTED")
engineFrame:RegisterEvent("QUEST_TURNED_IN")
engineFrame:RegisterEvent("QUEST_WATCH_UPDATE")
engineFrame:RegisterEvent("ZONE_CHANGED_NEW_AREA")
engineFrame:RegisterEvent("GOSSIP_SHOW")
engineFrame:RegisterEvent("GOSSIP_CLOSED")
engineFrame:RegisterEvent("QUEST_GREETING")
engineFrame:RegisterEvent("QUEST_DETAIL")
engineFrame:RegisterEvent("QUEST_PROGRESS")
engineFrame:RegisterEvent("QUEST_COMPLETE")
engineFrame:RegisterEvent("QUEST_FINISHED")
engineFrame:RegisterEvent("PLAYER_LEVEL_UP")
for _, e in ipairs({ "TRAINER_SHOW", "TRAINER_CLOSED", "LEARNED_SPELL_IN_TAB", "SPELLS_CHANGED" }) do
    pcall(engineFrame.RegisterEvent, engineFrame, e)
end
local entraineurOuvert

local function LogEvent(text)
    Engine.lastEvent = text
    if Engine.debug then
        ns.Print("[evt] " .. text)
    end
end

engineFrame:SetScript("OnEvent", function(self, event, ...)
    if event == "QUEST_LOG_UPDATE" then
        questLogDirty = true
    elseif event == "QUEST_ACCEPTED" then
        local questID = ...
        local name = QuestTitleByID(questID)
        if name then
            Engine.acceptedNames[NormalizeName(name)] = true
            if ns.db and questID then
                ns.db.learnedIds = ns.db.learnedIds or {}
                ns.db.learnedIds[NormalizeName(name)] = questID
            end
            LogEvent(("QUEST_ACCEPTED #%s → %s"):format(tostring(questID), name))
        else
            LogEvent(("QUEST_ACCEPTED #%s"):format(tostring(questID)))
        end
        -- le journal peut se mettre à jour juste après l'événement : re-vérifier
        if C_Timer and C_Timer.After then
            C_Timer.After(0.5, function() Engine.OnStateChanged() end)
        end
    elseif event == "QUEST_TURNED_IN" then
        local questID = ...
        if questID and ns.db then
            ns.db.doneQuests = ns.db.doneQuests or {}
            ns.db.doneQuests[questID] = true
        end
        LogEvent(("QUEST_TURNED_IN #%s"):format(tostring(questID)))
    elseif event == "GOSSIP_SHOW" or event == "QUEST_GREETING" or event == "QUEST_DETAIL"
        or event == "QUEST_PROGRESS" or event == "QUEST_COMPLETE" then
        Engine.interacting = true
        LogEvent(event)
        if event == "GOSSIP_SHOW" or event == "QUEST_GREETING" then Engine.ConstaterAbsentes(event) end
    elseif event == "ZONE_CHANGED_NEW_AREA" then
        LogEvent(event)
        if C_Timer and C_Timer.After then C_Timer.After(1, function() Engine.Enchainer("zone") end) else Engine.Enchainer("zone") end
    elseif event == "PLAYER_LEVEL_UP" then
        LogEvent(event)
        Engine.OublierAbsentes()
    elseif event == "GOSSIP_CLOSED" or event == "QUEST_FINISHED" then
        Engine.interacting = false
        LogEvent(event)
    elseif event == "TRAINER_SHOW" then
        Engine.interacting = true
        entraineurOuvert = { npc = UnitName("npc") or UnitName("target"), metier = IsTradeskillTrainer and IsTradeskillTrainer() or false }
        LogEvent(event)
    elseif event == "TRAINER_CLOSED" then
        Engine.interacting = false
        if entraineurOuvert then Engine.EntraineurVu(entraineurOuvert.npc, entraineurOuvert.metier) end
        entraineurOuvert = nil
        LogEvent(event)
    else
        LogEvent(event)
    end
    Engine.OnStateChanged()
end)

local elapsed = 0
local lastAtNpc = nil

engineFrame:SetScript("OnUpdate", function(self, dt)
    elapsed = elapsed + dt
    if elapsed < 0.5 then return end
    elapsed = 0

    UpdateAtNpc()
    if Engine.atNpc ~= lastAtNpc then
        lastAtNpc = Engine.atNpc
        if ns.TomTomBridge and ns.TomTomBridge.Refresh then
            ns.TomTomBridge.Refresh()
        end
    end

    local step = Engine.GetCurrentStep()
    if step and Engine.StepIsComplete(step) then
        Engine.Advance()
    end
end)

function Engine.OnStateChanged()
    Engine.RewindIfAbandoned()
    local step = Engine.GetCurrentStep()
    if step and Engine.StepIsComplete(step) then
        Engine.Advance()
    else
        -- met à jour les compteurs d'objectifs en direct
        if ns.Window and ns.Window.Refresh then
            ns.Window.Refresh()
        end
    end
end

-- choisit le guide le plus adapté : zone actuelle, sinon premier du filtre
-- cartes traversées par une route (calculées une fois)
function Engine.CartesDe(g)
    if not g.cartesSet then
        g.cartesSet = {}
        for _, s in ipairs(g.steps or {}) do
            local m = s.map or (ns.zoneMaps and s.zone and ns.zoneMaps[s.zone])
            if m then g.cartesSet[m] = true end
        end
    end
    return g.cartesSet
end

local function CarteJoueur()
    return C_Map and C_Map.GetBestMapForUnit and C_Map.GetBestMapForUnit("player")
end

function Engine.ChooseBestGuide()
    local list = Engine.GetGuidesForPlayer()
    if #list == 0 then return nil end
    local carte = CarteJoueur()
    local meilleur
    for _, g in ipairs(list) do
        if carte and Engine.CartesDe(g)[carte] then
            if not meilleur or (g.minLevel or 1) > (meilleur.minLevel or 1) then meilleur = g end
        end
    end
    if meilleur then return meilleur end
    local zone = GetZoneText()
    for _, g in ipairs(list) do
        if g.zone and g.zone == zone then return g end
    end
    return list[1]
end

--- Route suivante : une route de faction, au niveau du personnage, qui passe par `carte` si elle est donnée.
function Engine.RouteSuivante(actuelle, carte)
    local choix
    for _, g in ipairs(Engine.GetGuidesForPlayer()) do
        if g ~= actuelle and g.type ~= "depart" and (not carte or Engine.CartesDe(g)[carte]) then
            if not choix or (g.minLevel or 1) < (choix.minLevel or 1) then choix = g end
        end
    end
    return choix
end

--- Passe à la route suivante : à la fin de la route, ou en entrant dans une zone que la route de départ ne contient pas.
function Engine.Enchainer(raison)
    local g = Engine.GetActiveGuide()
    if not g then return end
    local carte = CarteJoueur()
    local suivante
    if raison == "fin" then
        suivante = Engine.RouteSuivante(g, carte) or Engine.RouteSuivante(g)
    elseif g.type == "depart" and carte and not Engine.CartesDe(g)[carte] then
        suivante = Engine.RouteSuivante(g, carte)
    end
    if suivante then
        ns.Print(ns.L.NEXT_ROUTE:format(Engine.NomGuide(suivante)))
        Engine.LoadGuide(suivante.id)
        return true
    end
    return false
end

--- Chez un PNJ de l'étape en cours : une quête « à prendre » qu'il ne propose pas à ce personnage
--- (quête d'une autre classe ou d'une autre race, propre à Forever) est notée absente et l'étape la saute.
--- La note tombe au niveau suivant, au cas où la quête n'était simplement pas encore ouverte.
function Engine.ConstaterAbsentes(evenement)
    local step = Engine.GetCurrentStep()
    if not step or not step.quests then return end
    local npc = UnitName("npc") or UnitName("target")
    if not npc or not step.location or not step.location:find(npc, 1, true) then return end
    local proposeesId, proposeesNom = {}, {}
    if evenement == "GOSSIP_SHOW" and C_GossipInfo and C_GossipInfo.GetAvailableQuests then
        for _, qi in ipairs(C_GossipInfo.GetAvailableQuests() or {}) do
            if qi.questID then proposeesId[qi.questID] = true end
            if qi.title then proposeesNom[NormalizeName(qi.title)] = true end
        end
    elseif evenement == "QUEST_GREETING" and GetNumAvailableQuests and GetAvailableTitle then
        for i = 1, GetNumAvailableQuests() or 0 do
            local t = GetAvailableTitle(i)
            if t then proposeesNom[NormalizeName(t)] = true end
        end
    else
        return
    end
    ns.db.absentes = ns.db.absentes or {}
    local change = false
    for _, q in ipairs(Engine.QuetesApplicables(step)) do
        if q.kind == "prendre" and q.id and Engine.QuestState(q) == "available"
            and not proposeesId[q.id] and not proposeesNom[NormalizeName(Engine.QuestName(q))] then
            ns.db.absentes[q.id] = PlayerLevel()
            change = true
        end
    end
    if change then
        -- les suites d'une quête absente le sont aussi : quête de même titre (une chaîne garde souvent son nom),
        -- ou quête prise au même endroit, dans l'étape même ou juste après, là où l'on rend une quête absente
        local g = Engine.GetActiveGuide()
        local encore = g ~= nil
        local function Noter(x)
            if x.kind == "prendre" and x.id and not ns.db.absentes[x.id] then
                ns.db.absentes[x.id] = PlayerLevel()
                encore = true
            end
        end
        while encore do
            encore = false
            local titres = {}
            for _, s in ipairs(g.steps) do
                for _, x in ipairs(s.quests or {}) do
                    if x.id and ns.db.absentes[x.id] and x.name then titres[NormalizeName(x.name)] = true end
                end
            end
            for i, s in ipairs(g.steps) do
                local suite = false
                for _, x in ipairs(s.quests or {}) do
                    if x.name and titres[NormalizeName(x.name)] then Noter(x) end
                    if x.kind == "rendre" and x.id and ns.db.absentes[x.id] then suite = true end
                end
                if suite then
                    for _, x in ipairs(s.quests) do Noter(x) end
                    local n = g.steps[i + 1]
                    if n and n.location and n.location == s.location then
                        for _, x in ipairs(n.quests or {}) do Noter(x) end
                    end
                end
            end
        end
        Engine.OnStateChanged()
    end
end

function Engine.OublierAbsentes()
    if not (ns.db and ns.db.absentes) then return end
    local niveau = PlayerLevel()
    for id, n in pairs(ns.db.absentes) do
        if type(n) ~= "number" or n < niveau then ns.db.absentes[id] = nil end
    end
end

-- rattrapage : avance jusqu'à la première étape non terminée, puis clamp
--- Étape d'entraîneur non validée mais dépassée : l'étape de quête suivante est déjà faite ou entamée.
function Engine.EntraineurDepasse(g, i)
    if not Engine.EstEntraineur(g.steps[i]) then return false end
    for j = i + 1, #g.steps do
        local s = g.steps[j]
        if not Engine.EstEntraineur(s) and Engine.StepApplies(s) then
            if Engine.StepIsComplete(s) then return true end
            for _, q in ipairs(Engine.QuetesApplicables(s)) do
                local st = Engine.QuestState(q)
                if st ~= "available" and st ~= "unknown" then return true end
            end
            return false
        end
    end
    return false
end

function Engine.SyncToProgress()
    ns.viewStep = nil
    local g = Engine.GetActiveGuide()
    if not g then return end
    local firstIncomplete = #g.steps + 1
    for i = 1, #g.steps do
        if not Engine.StepIsComplete(g.steps[i]) and not Engine.EntraineurDepasse(g, i) then
            firstIncomplete = i
            break
        end
    end
    ns.db.stepIndex = firstIncomplete
    if ns.db.stepIndex > #g.steps + 1 then ns.db.stepIndex = #g.steps + 1 end
    if ns.db.stepIndex < 1 then ns.db.stepIndex = 1 end
end

-- si la quête de l'étape courante est abandonnée, recalcule la première étape non terminée
function Engine.RewindIfAbandoned()
    local g = Engine.GetActiveGuide()
    if not g then return end
    local step = g.steps[Engine.GetStepIndex()]
    if not step or not step.quests then return end
    local abandoned = false
    for _, q in ipairs(Engine.QuetesApplicables(step)) do
        if q.kind ~= "prendre" and q.id and Engine.QuestState(q) == "available" then
            abandoned = true
            break
        end
    end
    if not abandoned then return end
    for i = 1, #g.steps do
        if not Engine.StepIsComplete(g.steps[i]) and not Engine.EntraineurDepasse(g, i) then
            ns.db.stepIndex = i
            Engine.Refresh()
            ns.Print(ns.L.ABANDONED)
            return
        end
    end
end

function Engine.OnLogin()
    -- un guide d'une autre race ou faction (route réparée, autre personnage) est abandonné
    local actif = Engine.GetActiveGuide()
    if actif and not Engine.GuideConvient(actif, false) then ns.db.activeGuide = nil end
    if not Engine.GetActiveGuide() then
        local best = Engine.ChooseBestGuide()
        if best then
            ns.db.activeGuide = best.id
        end
    end
    Engine.SyncToProgress()
    Engine.Refresh()
    if not Engine.GetActiveGuide() then
        ns.Print(ns.L.NO_GUIDE_LOGIN)
    end
end
