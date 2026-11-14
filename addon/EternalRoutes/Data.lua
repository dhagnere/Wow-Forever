--[[----------------------------------------------------------------------------
    EternalRoutes — Data.lua
    Documentation du format des données de parcours.

    FORMAT D'UN GUIDE :
    {
        id       = "orc_hunter",
        name     = "Orc chasseur 1-60",
        faction  = "Horde",        -- "Alliance" | "Horde" | "Neutral"
        race     = "Orc",          -- affichage / futur filtrage
        class    = "HUNTER",       -- affichage / futur filtrage
        minLevel = 1,
        maxLevel = 60,
        zoneCount = 26,
        steps    = { ... }
    }

    FORMAT D'UNE ÉTAPE :
    {
        text      = "Gornek (42,1 · 68,3)\nPrendre « ... »",
        zone      = "Durotar",     -- zone (affichage + orientation)
        zoneIndex = 1,             -- numéro de zone (affichage)
        x = 42.1, y = 68.3,        -- coordonnées 0..100 (flèche TomTom)
        map = 1411,                -- carte du jeu (UiMap), relevée par RouteProbe
        accepts   = { "Quête A" }, -- complète quand toutes sont au journal (par nom)
        turnins   = { "Quête B" }, -- pas d'ID -> avance manuelle
    }

    Les guides réels sont générés par tools/ingest.mjs dans Guides.lua.
------------------------------------------------------------------------------]]

local ns = EternalRoutes
ns.guides = ns.guides or {}
