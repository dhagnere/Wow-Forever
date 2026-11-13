-- Généré par npm run addon:guides (La Taverne Éternelle) : ne pas modifier à la main.
-- Base de quêtes intégrée · 2334 quêtes, en français et en anglais
-- Données : content/guide-jeu.json, version du jeu 1.60.1.70790 ; bases libres CMaNGOS classic-db (GPL v3) et AzerothCore (GPL v2).
local ns = EternalRoutes
-- Champs : t (titre), te (titre anglais), nv (niveau), min (niveau minimal), av (quête préalable),
--   g / r (donneur / receveur : nom, nom anglais, carte, x, y), c (secteur des objectifs : carte, x, y),
--   obj / oe (objectifs rédigés par La Taverne, en français / en anglais). Ne reprend aucun texte de quête du jeu.
ns.questDB = ns.questDB or {}
local D = ns.questDB
D[5] = { t = "L'estomac qui gargouille", nv = 20, min = 17, te = "Jitters' Growling Gut", g = { "La Tremblote", "Jitters", 1431, 18.4, 56.4 }, r = { "Chef Grual", "Chef Grual", 1431, 73.8, 43.5 } }
D[6] = { t = "La prime pour Garrick Ladétrousse", nv = 5, min = 2, te = "Bounty on Garrick Padfoot", av = 18, g = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, r = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, c = { 1429, 57.5, 48.3 }, obj = "Rapporter Tête de Garrick", oe = "Bring Garrick's Head" }
D[7] = { t = "Le nettoyage du camp des kobolds", nv = 2, min = 1, te = "Kobold Camp Cleanup", av = 783, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, c = { 1429, 49.6, 36.3 }, obj = "Vaincre 10 × Vermine kobold", oe = "Kill 10 × Kobold Vermin" }
D[8] = { t = "Un marché de voleur", nv = 5, min = 1, te = "A Rogue's Deal", g = { "Calvin Montague", "Calvin Montague", 1420, 38.2, 56.8 }, r = { "Renée l'aubergiste", "Innkeeper Renee", 1420, 61.7, 52 }, obj = "Rapporter Lettre", oe = "Bring Nondescript Letter" }
D[9] = { t = "Les champs de mort", nv = 15, min = 8, te = "The Killing Fields", g = { "Saldean le fermier", "Farmer Saldean", 1436, 56, 31.2 }, r = { "Saldean le fermier", "Farmer Saldean", 1436, 56, 31.2 }, c = { 1436, 38.2, 50.9 }, obj = "Vaincre 20 × Gardien des moissons", oe = "Kill 20 × Harvest Watcher" }
D[10] = { t = "La rédemption de Scrimshank", nv = 48, min = 39, te = "The Scrimshank Redemption", av = 82, g = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, r = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, c = { 1446, 56, 71.2 }, obj = "Rapporter Equipement d'analyse de Scrimshank", oe = "Bring Scrimshank's Surveying Gear" }
D[11] = { t = "Une prime pour les gnolls rivepatte", nv = 10, min = 6, te = "Riverpaw Gnoll Bounty", g = { "Adjoint Rainer", "Deputy Rainer", 1429, 24.2, 74.4 }, r = { "Adjoint Rainer", "Deputy Rainer", 1429, 24.2, 74.4 }, c = { 1429, 27.7, 87.2 }, obj = "Rapporter 8 × Brassard peint de gnoll", oe = "Bring 8 × Painted Gnoll Armband" }
D[12] = { t = "La milice du peuple", nv = 12, min = 9, te = "The People's Militia", g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, r = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, c = { 1436, 47.1, 42.1 }, obj = "Vaincre 15 × Trappeur défias ; Vaincre 15 × Contrebandier défias", oe = "Kill 15 × Defias Trapper ; Kill 15 × Defias Smuggler" }
D[13] = { t = "La milice du peuple", nv = 14, min = 9, te = "The People's Militia", av = 12, g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, r = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, c = { 1436, 43.3, 68.7 }, obj = "Vaincre 15 × Pilleur défias ; Vaincre 15 × Pillard défias", oe = "Kill 15 × Defias Pillager ; Kill 15 × Defias Looter" }
D[14] = { t = "La milice du peuple", nv = 17, min = 9, te = "The People's Militia", av = 13, g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, r = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, c = { 1436, 41.8, 78.5 }, obj = "Vaincre 15 × Malandrin défias ; Vaincre 5 × Eclaireur défias ; Vaincre 5 × Truand défias", oe = "Kill 15 × Defias Highwayman ; Kill 5 × Defias Pathstalker ; Kill 5 × Defias Knuckleduster" }
D[15] = { t = "Enquête sur la crête aux échos", nv = 3, min = 1, te = "Investigate Echo Ridge", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, c = { 1429, 49.1, 35.1 }, obj = "Vaincre 10 × Ouvrier kobold", oe = "Kill 10 × Kobold Worker" }
D[18] = { t = "La confrérie des voleurs", nv = 4, min = 2, te = "Brotherhood of Thieves", av = 783, g = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, r = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, c = { 1429, 54.8, 46.8 }, obj = "Rapporter 12 × Masque rouge", oe = "Bring 12 × Red Burlap Bandana" }
D[19] = { t = "Tharil'zun", nv = 25, min = 18, av = 20, g = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 }, r = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 }, c = { 1433, 64.4, 59.4 }, obj = "Rapporter Tête de Tharil'zun", oe = "Bring Tharil'zun's Head" }
D[20] = { t = "La menace des Rochenoires", nv = 21, min = 18, te = "Blackrock Menace", g = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 }, r = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 }, c = { 1433, 69.4, 75.1 }, obj = "Rapporter 10 × Hache détériorée", oe = "Bring 10 × Battleworn Axe" }
D[21] = { t = "Règlement de comptes à Écho-Coron", nv = 5, min = 1, te = "Skirmish at Echo Ridge", av = 15, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, c = { 1429, 48.8, 28.4 }, obj = "Vaincre 12 × Travailleur kobold", oe = "Kill 12 × Kobold Laborer" }
D[22] = { t = "La tourte au foie de broche-tripes", nv = 12, min = 9, te = "Goretusk Liver Pie", g = { "Salma Saldean", "Salma Saldean", 1436, 56, 31.2 }, r = { "Salma Saldean", "Salma Saldean", 1436, 56, 31.2 }, c = { 1436, 50.3, 22.3 }, obj = "Rapporter 8 × Foie de Broche-tripes", oe = "Bring 8 × Goretusk Liver" }
D[25] = { t = "Y a du gaz dans l’eau", nv = 25, min = 23, te = "Stonetalon Standstill", g = { "Mastok Torvesiffle", "Mastok Wrilehiss", 1440, 73.7, 60 }, r = { "Mastok Torvesiffle", "Mastok Wrilehiss", 1440, 73.7, 60 }, c = { 1440, 48.9, 70 }, obj = "Vaincre 12 × Elémentaire d'eau souillé", oe = "Kill 12 × Befouled Water Elemental" }
D[26] = { t = "Une leçon à apprendre", nv = 16, min = 16, te = "A Lesson to Learn", g = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[27] = { t = "Une leçon à apprendre", nv = 16, min = 16, te = "A Lesson to Learn", g = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[28] = { t = "L'épreuve du lac", nv = 16, min = 16, te = "Trial of the Lake", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Tajarri", "Tajarri", 1450, 36.5, 40.1 } }
D[29] = { t = "L'épreuve du lac", nv = 16, min = 16, te = "Trial of the Lake", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Tajarri", "Tajarri", 1450, 36.5, 40.1 } }
D[30] = { t = "L'épreuve du lion de mer", nv = 16, min = 16, te = "Trial of the Sea Lion", g = { "Tajarri", "Tajarri", 1450, 36.5, 40.1 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, obj = "Rapporter Pendentif du lion de mer", oe = "Bring Pendant of the Sea Lion" }
D[31] = { t = "Forme aquatique", nv = 16, min = 16, te = "Aquatic Form", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 }, obj = "Rapporter Pendentif du lion de mer", oe = "Bring Pendant of the Sea Lion" }
D[32] = { t = "L'ascension des silithides", nv = 48, min = 39, te = "Rise of the Silithid", av = 113, g = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, obj = "Rapporter Rapport d'analyse d'insecte", oe = "Bring Insect Analysis Report" }
D[33] = { t = "Les loups derrière la frontière", nv = 2, min = 1, te = "Wolves Across the Border", av = 5261, g = { "Eagan Tannepeau", "Eagan Peltskinner", 1429, 48.2, 42.9 }, r = { "Eagan Tannepeau", "Eagan Peltskinner", 1429, 48.2, 42.9 }, c = { 1429, 48.7, 41.3 }, obj = "Rapporter 8 × Viande de loup coriace", oe = "Bring 8 × Tough Wolf Meat" }
D[34] = { t = "Un invité indésirable", nv = 24, min = 18, te = "An Unwelcome Guest", g = { "Martie Jainrose", "Martie Jainrose", 1433, 16.8, 46.3 }, r = { "Martie Jainrose", "Martie Jainrose", 1433, 16.8, 46.3 }, c = { 1433, 10.6, 49.3 }, obj = "Rapporter Défense de Fouailleventre", oe = "Bring Bellygrub's Tusk" }
D[35] = { t = "Inquiétudes supplémentaires", nv = 10, min = 7, te = "Further Concerns", av = 40, g = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, r = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 } }
D[36] = { t = "Le ragoût de la marche de l'Ouest", nv = 10, min = 9, te = "Westfall Stew", g = { "Verna Froncebouille", "Verna Furlbrow", 1429, 17.7, 82.7 }, obj = "Rapporter Recette du Ragoût de la marche de l'Ouest, par Verna", oe = "Bring Verna's Westfall Stew Recipe" }
D[37] = { t = "Trouver les gardes disparus", nv = 10, min = 7, te = "Find the Lost Guards", av = 35, g = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, r = { "Un corps à moitié dévoré", "A half-eaten body", 1429, 72.7, 60.3 } }
D[38] = { t = "Le ragoût de la marche de l'Ouest", nv = 13, min = 9, te = "Westfall Stew", av = 36, g = { "Salma Saldean", "Salma Saldean", 1436, 56, 31.2 }, r = { "Salma Saldean", "Salma Saldean", 1436, 56, 31.2 }, c = { 1436, 44.4, 46.3 }, obj = "Rapporter 3 × Viande filandreuse de vautour ; Rapporter 3 × Oeil de murloc ; Rapporter 3 × Groin de Broche-tripes ; Rapporter 3 × Okra", oe = "Bring 3 × Stringy Vulture Meat ; Bring 3 × Murloc Eye ; Bring 3 × Goretusk Snout ; Bring 3 × Okra" }
D[39] = { t = "Remettre le rapport de Thomas", nv = 10, min = 7, te = "Deliver Thomas' Report", av = 71, g = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 } }
D[40] = { t = "Péril en la rivière", nv = 10, min = 7, te = "A Fishy Peril", g = { "Remy « Deux fois »", "Remy \"Two Times\"", 1429, 42.1, 65.9 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 } }
D[45] = { t = "La destinée de Rolf", nv = 10, min = 7, te = "Discover Rolf's Fate", av = 37, g = { "Un corps à moitié dévoré", "A half-eaten body", 1429, 72.7, 60.3 }, r = { "Cadavre de Rolf", "Rolf's corpse", 1429, 79.8, 55.5 } }
D[46] = { t = "Des primes pour les murlocs", nv = 10, min = 7, te = "Bounty on Murlocs", g = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, r = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, c = { 1429, 75.1, 84.1 }, obj = "Rapporter 8 × Aileron de murloc déchiré", oe = "Bring 8 × Torn Murloc Fin" }
D[47] = { t = "L'échange de poussière d'or", nv = 7, min = 4, te = "Gold Dust Exchange", g = { "Remy « Deux fois »", "Remy \"Two Times\"", 1429, 42.1, 65.9 }, r = { "Remy « Deux fois »", "Remy \"Two Times\"", 1429, 42.1, 65.9 }, c = { 1429, 61.9, 55.9 }, obj = "Rapporter 10 × Poussière d'or", oe = "Bring 10 × Gold Dust" }
D[52] = { t = "Protéger la frontière", nv = 10, min = 7, te = "Protect the Frontier", g = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, r = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, c = { 1429, 80.9, 77.8 }, obj = "Vaincre 8 × Rôdeur ; Vaincre 5 × Jeune ours des forêts", oe = "Kill 8 × Prowler ; Kill 5 × Young Forest Bear" }
D[54] = { t = "Rapport pour Comté-de-l’Or", nv = 5, min = 1, te = "Report to Goldshire", av = 21, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, obj = "Rapporter Documents du maréchal McBride", oe = "Bring Marshal McBride's Documents" }
D[55] = { t = "Morbent Lagangrène", nv = 32, min = 20, te = "Morbent Fel", av = 325, g = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, r = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, c = { 1431, 16.9, 33.4 }, obj = "Rapporter Fléau de Morbent ; Vaincre Morbent Lagangrène", oe = "Bring Morbent's Bane ; Kill Morbent Fel" }
D[56] = { t = "Les Veilleurs", nv = 24, min = 18, te = "The Night Watch", g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, c = { 1431, 79.4, 71 }, obj = "Vaincre 8 × Guerrier squelette ; Vaincre 6 × Mage squelette", oe = "Kill 8 × Skeletal Warrior ; Kill 6 × Skeletal Mage" }
D[57] = { t = "Les Veilleurs", nv = 26, min = 18, te = "The Night Watch", av = 56, g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, c = { 1431, 18.5, 44.6 }, obj = "Vaincre 15 × Démon squelette ; Vaincre 15 × Squelette infernal", oe = "Kill 15 × Skeletal Fiend ; Kill 15 × Skeletal Horror" }
D[58] = { t = "Les Veilleurs", nv = 30, min = 18, te = "The Night Watch", av = 57, g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, c = { 1431, 21.8, 32.7 }, obj = "Vaincre 20 × Répandeur de peste", oe = "Kill 20 × Plague Spreader" }
D[59] = { t = "Les armures de cuir et d'étoffe", nv = 10, min = 7, te = "Cloth and Leather Armor", av = 39, g = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, r = { "Sara Timberlain", "Sara Timberlain", 1429, 79.5, 68.8 }, obj = "Rapporter Bon pour une pièce d'armure de Hurlevent", oe = "Bring Stormwind Armor Marker" }
D[60] = { t = "Les bougies de kobolds", nv = 7, min = 3, te = "Kobold Candles", g = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, r = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, c = { 1429, 61.9, 55.9 }, obj = "Rapporter 8 × Grande bougie", oe = "Bring 8 × Large Candle" }
D[61] = { t = "Une cargaison pour Hurlevent", nv = 7, min = 3, te = "Shipment to Stormwind", av = 60, g = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, obj = "Rapporter Cargaison de William", oe = "Bring William's Shipment" }
D[62] = { t = "La mine de Fondugouffre", nv = 7, min = 4, te = "The Fargodeep Mine", g = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 } }
D[63] = { t = "L'appel de l'eau", nv = 23, min = 20, te = "Call of Water", av = 220, g = { "Islen Oeil-des-rivières", "Islen Waterseer", 1413, 65.8, 43.9 }, obj = "Rapporter Bracelets de manifestation corrompue ; Rapporter Restes d'eau pure", oe = "Bring Corrupt Manifestation's Bracers ; Bring Remaining Drops of Purest Water", r = { "Brazier of Everfount", "Brazier of Everfount", 1421, 38.3, 44.6 } }
D[64] = { t = "Le cadeau oublié", nv = 12, min = 9, te = "The Forgotten Heirloom", g = { "Fermier Froncebouille", "Farmer Furlbrow", 1429, 17.7, 82.7 }, r = { "Fermier Froncebouille", "Farmer Furlbrow", 1429, 17.7, 82.7 }, obj = "Rapporter Montre de Froncebouille", oe = "Bring Furlbrow's Pocket Watch" }
D[65] = { t = "La Confrérie défias", nv = 18, min = 14, te = "The Defias Brotherhood", g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 } }
D[66] = { t = "La légende de Stalvan", nv = 28, min = 22, te = "The Legend of Stalvan", g = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, r = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 } }
D[67] = { t = "La légende de Stalvan", nv = 28, min = 22, te = "The Legend of Stalvan", av = 66, g = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 } }
D[69] = { t = "La légende de Stalvan", nv = 28, min = 22, te = "The Legend of Stalvan", av = 68, g = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 } }
D[71] = { t = "Faire son rapport au garde Thomas", nv = 10, min = 7, te = "Report to Thomas", av = 45, g = { "Cadavre de Rolf", "Rolf's corpse", 1429, 79.8, 55.5 }, r = { "Garde Thomas", "Guard Thomas", 1429, 74, 72.2 }, c = { 1429, 54.3, 66.5 }, obj = "Rapporter Médaillons de Rolf et Malakai", oe = "Bring Rolf and Malakai's Medallions" }
D[76] = { t = "La mine Veine-de-jaspe", nv = 10, min = 4, te = "The Jasperlode Mine", av = 62, g = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 } }
D[77] = { t = "Une situation délicate", nv = 48, min = 42, te = "A Sticky Situation", av = 650, g = { "Gilveradin Courresoleil", "Gilveradin Sunchaser", 1425, 26.7, 48.6 }, r = { "Gilveradin Courresoleil", "Gilveradin Sunchaser", 1425, 26.7, 48.6 }, c = { 1425, 58.2, 41.4 }, obj = "Rapporter 10 × Houle au miel des Hinterlands", oe = "Bring 10 × Hinterlands Honey Ripple" }
D[79] = { t = "La légende de Stalvan", nv = 28, min = 22, te = "The Legend of Stalvan", av = 78, g = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, obj = "Rapporter Pages de journal maculées de boue", oe = "Bring Muddy Journal Pages" }
D[80] = { t = "La légende de Stalvan", nv = 28, min = 22, te = "The Legend of Stalvan", av = 79, g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 }, obj = "Rapporter Une page de journal maculée de sang", oe = "Bring A Bloodstained Journal Page" }
D[81] = { t = "La livraison de Houle", nv = 48, min = 42, te = "Ripple Delivery", av = 77, g = { "Gilveradin Courresoleil", "Gilveradin Sunchaser", 1425, 26.7, 48.6 }, obj = "Rapporter Livraison de Houle de Dran", oe = "Bring Dran's Ripple Delivery" }
D[82] = { t = "Enquête au Repaire nuisible", nv = 47, min = 39, te = "Noxious Lair Investigation", av = 992, g = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, r = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, c = { 1446, 33.8, 44.1 }, obj = "Rapporter 5 × Morceaux d'insecte Centipaar", oe = "Bring 5 × Centipaar Insect Parts" }
D[83] = { t = "Articles en lin de qualité", nv = 9, min = 4, te = "Red Linen Goods", g = { "Sara Timberlain", "Sara Timberlain", 1429, 79.5, 68.8 }, r = { "Sara Timberlain", "Sara Timberlain", 1429, 79.5, 68.8 }, c = { 1429, 74.1, 51.5 }, obj = "Rapporter 6 × Masque rouge en lin", oe = "Bring 6 × Red Linen Bandana" }
D[84] = { t = "Revenir voir Billy", nv = 6, min = 5, te = "Back to Billy", av = 86, g = { "« Tatie » Bernice Champierreux", "\"Auntie\" Bernice Stonefield", 1429, 34.5, 84.3 }, r = { "Billy Maclure", "Billy Maclure", 1429, 43.1, 85.7 }, obj = "Rapporter Tourte de panse de porc", oe = "Bring Pork Belly Pie" }
D[85] = { t = "Le collier perdu", nv = 6, min = 5, te = "Lost Necklace", g = { "« Tatie » Bernice Champierreux", "\"Auntie\" Bernice Stonefield", 1429, 34.5, 84.3 }, r = { "Billy Maclure", "Billy Maclure", 1429, 43.1, 85.7 } }
D[86] = { t = "Une tourte pour Billy", nv = 6, min = 5, te = "Pie for Billy", av = 85, g = { "Billy Maclure", "Billy Maclure", 1429, 43.1, 85.7 }, r = { "« Tatie » Bernice Champierreux", "\"Auntie\" Bernice Stonefield", 1429, 34.5, 84.3 }, c = { 1429, 32.2, 86.6 }, obj = "Rapporter 4 × Morceau de viande de sanglier", oe = "Bring 4 × Chunk of Boar Meat" }
D[87] = { t = "Dent-d'or", nv = 8, min = 5, te = "Goldtooth", av = 84, g = { "Billy Maclure", "Billy Maclure", 1429, 43.1, 85.7 }, r = { "« Tatie » Bernice Champierreux", "\"Auntie\" Bernice Stonefield", 1429, 34.5, 84.3 }, c = { 1429, 41.7, 78 }, obj = "Rapporter Collier de Bernice", oe = "Bring Bernice's Necklace" }
D[88] = { t = "Princesse doit mourir !", nv = 9, min = 6, te = "Princess Must Die!", g = { "Maman Champierreux", "Ma Stonefield", 1429, 34.5, 84.3 }, r = { "Maman Champierreux", "Ma Stonefield", 1429, 34.5, 84.3 }, c = { 1429, 69.7, 79.3 }, obj = "Rapporter Collier de cuivre", oe = "Bring Brass Collar" }
D[89] = { t = "Le pont sur le lac", nv = 20, min = 15, te = "The Everstill Bridge", av = 125, g = { "Contremaître Oslow", "Foreman Oslow", 1433, 28.4, 49 }, r = { "Contremaître Oslow", "Foreman Oslow", 1433, 28.4, 49 }, c = { 1433, 14.8, 20.5 }, obj = "Rapporter 5 × Clou en fer ; Rapporter 5 × Vis en fer", oe = "Bring 5 × Iron Pike ; Bring 5 × Iron Rivet" }
D[90] = { t = "Kébab de loup assaisonné", nv = 25, min = 18, te = "Seasoned Wolf Kabobs", g = { "Chef Grual", "Chef Grual", 1431, 73.8, 43.5 }, r = { "Chef Grual", "Chef Grual", 1431, 73.8, 43.5 }, c = { 1431, 31.8, 27.4 }, obj = "Rapporter 10 × Steak de loup ; Rapporter objet 2665", oe = "Bring 10 × Lean Wolf Flank ; Bring item 2665" }
D[91] = { t = "La loi de Salomon", nv = 23, min = 17, te = "Solomon's Law", g = { "Bailli Conacher", "Bailiff Conacher", 1433, 24.6, 44.3 }, r = { "Bailli Conacher", "Bailiff Conacher", 1433, 24.6, 44.3 }, c = { 1433, 72.6, 41.1 }, obj = "Rapporter 10 × Pendentif sombrepoil", oe = "Bring 10 × Shadowhide Pendant" }
D[92] = { t = "Goulash des Carmines", nv = 18, min = 15, te = "Redridge Goulash", g = { "Chef Breanna", "Chef Breanna", 1433, 16.8, 46.3 }, r = { "Chef Breanna", "Chef Breanna", 1433, 16.8, 46.3 }, c = { 1433, 26.8, 72.7 }, obj = "Rapporter 5 × Groin de grand Broche-tripes ; Rapporter 5 × Viande de condor coriace ; Rapporter 5 × Chair croustillante d'araignée", oe = "Bring 5 × Great Goretusk Snout ; Bring 5 × Tough Condor Meat ; Bring 5 × Crisp Spider Meat" }
D[93] = { t = "Les tourtes au crabe de la Pénombre", nv = 20, min = 17, te = "Dusky Crab Cakes", av = 5, g = { "Chef Grual", "Chef Grual", 1431, 73.8, 43.5 }, r = { "Chef Grual", "Chef Grual", 1431, 73.8, 43.5 }, c = { 1431, 30.8, 49.4 }, obj = "Rapporter 6 × Patte d'araignée fondante", oe = "Bring 6 × Gooey Spider Leg" }
D[95] = { t = "La vengeance de Sven", nv = 25, min = 20, te = "Sven's Revenge", g = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, r = { "Mound of loose dirt", "Mound of loose dirt", 1431, 49.9, 77.7 } }
D[96] = { t = "L'appel de l'eau", nv = 23, min = 20, te = "Call of Water", r = { "Islen Oeil-des-rivières", "Islen Waterseer", 1413, 65.8, 43.8 }, obj = "Rapporter Eclat d'eau", oe = "Bring Shard of Water" }
D[97] = { t = "La légende de Stalvan", nv = 28, min = 22, te = "The Legend of Stalvan", av = 80, g = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 } }
D[98] = { t = "La légende de Stalvan", nv = 35, min = 22, te = "The Legend of Stalvan", av = 97, g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, c = { 1431, 77.3, 36.2 }, obj = "Rapporter Chevalière des Mistmantle", oe = "Bring Mistmantle Family Ring" }
D[99] = { t = "La folie d'Arugal", nv = 15, min = 9, te = "Arugal's Folly", av = 424, g = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, r = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, c = { 1421, 46.2, 73.1 }, obj = "Rapporter 6 × Chaîne de Bois-du-Bûcher", oe = "Bring 6 × Pyrewood Shackle" }
D[100] = { t = "L'appel de l'eau", nv = 23, min = 20, te = "Call of Water", av = 63, g = { "Brazier of Everfount", "Brazier of Everfount", 1421, 38.3, 44.6 }, r = { "Manifestation d'eau mineure", "Minor Manifestation of Water", 1421, 38.3, 44.6 } }
D[101] = { t = "Le Totem d'affliction", nv = 25, min = 18, te = "The Totem of Infliction", g = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, r = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, c = { 1431, 21.6, 33.4 }, obj = "Rapporter 10 × Croc de goule ; Rapporter 5 × Fiole de venin d'araignée ; Rapporter 10 × Doigt de squelette", oe = "Bring 10 × Ghoul Fang ; Bring 5 × Vial of Spider Venom ; Bring 10 × Skeleton Finger" }
D[102] = { t = "Une patrouille dans la marche de l'Ouest", nv = 14, min = 8, te = "Patrolling Westfall", g = { "Capitaine Danuvin", "Captain Danuvin", 1436, 56.3, 47.5 }, r = { "Capitaine Danuvin", "Captain Danuvin", 1436, 56.3, 47.5 }, c = { 1436, 61.2, 73.8 }, obj = "Rapporter 8 × Patte de gnoll", oe = "Bring 8 × Gnoll Paw" }
D[103] = { t = "Le gardien de la flamme", nv = 16, min = 10, te = "Keeper of the Flame", g = { "Capitaine Grayson", "Captain Grayson", 1436, 30, 86 }, r = { "Capitaine Grayson", "Captain Grayson", 1436, 30, 86 }, c = { 1436, 50, 31 }, obj = "Rapporter 5 × Flasque d'huile", oe = "Bring 5 × Flask of Oil" }
D[104] = { t = "Menace sur la côte", nv = 20, min = 15, te = "The Coastal Menace", g = { "Capitaine Grayson", "Captain Grayson", 1436, 30, 86 }, r = { "Capitaine Grayson", "Captain Grayson", 1436, 30, 86 }, c = { 1436, 29.3, 75.9 }, obj = "Rapporter Ecaille du Vieux Troubloeil", oe = "Bring Scale of Old Murk-Eye" }
D[105] = { t = "Hélas, Andorhal", nv = 60, min = 50, te = "Alas, Andorhal", av = 5098, g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, obj = "Rapporter Eclat phylactère d'Araj", oe = "Bring Araj's Phylactery Shard" }
D[106] = { t = "Jeunes amoureux", nv = 6, min = 5, te = "Young Lovers", g = { "Maybell Maclure", "Maybell Maclure", 1429, 43.1, 85.7 }, r = { "Tommy Joe Champierreux", "Tommy Joe Stonefield", 1429, 29.8, 86 }, obj = "Rapporter Lettre d'amour de Maybell", oe = "Bring Maybell's Love Letter" }
D[107] = { t = "Note pour William", nv = 6, min = 5, te = "Note to William", av = 111, g = { "Mamie Champierreux", "Gramma Stonefield", 1429, 34.5, 84.3 }, r = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, obj = "Rapporter Note de Mamie Stonefield", oe = "Bring Gramma Stonefield's Note" }
D[109] = { t = "Aller voir Gryan Roidemantel", nv = 10, min = 9, te = "Report to Gryan Stoutmantle", g = { "Saldean le fermier", "Farmer Saldean", 1436, 56, 31.2 }, r = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 } }
D[110] = { t = "Analyse des morceaux d'insectes", nv = 48, min = 39, te = "Insect Part Analysis", av = 10, g = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, r = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 } }
D[111] = { t = "Discuter avec Mamie", nv = 6, min = 5, te = "Speak with Gramma", av = 106, g = { "Tommy Joe Champierreux", "Tommy Joe Stonefield", 1429, 29.8, 86 }, r = { "Mamie Champierreux", "Gramma Stonefield", 1429, 34.5, 84.3 } }
D[112] = { t = "À la recherche du varech", nv = 7, min = 5, te = "Collecting Kelp", av = 107, g = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, r = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, c = { 1429, 54.4, 66.4 }, obj = "Rapporter 4 × Feuille de Varech cristallin", oe = "Bring 4 × Crystal Kelp Frond" }
D[113] = { t = "Analyse des morceaux d'insectes", nv = 48, min = 39, te = "Insect Part Analysis", av = 110, g = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, r = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, obj = "Rapporter Rapport d'analyse d'insecte", oe = "Bring Insect Analysis Report" }
D[114] = { t = "La fuite", nv = 7, min = 5, te = "The Escape", av = 112, g = { "William Pilon", "William Pestle", 1429, 42.1, 65.9 }, r = { "Maybell Maclure", "Maybell Maclure", 1429, 43.1, 85.7 }, obj = "Rapporter Liqueur d'invisibilité", oe = "Bring Invisibility Liquor" }
D[115] = { t = "Magie des Ténèbres", nv = 23, min = 18, te = "Shadow Magic", av = 20, g = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 }, r = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 }, c = { 1433, 63.2, 56 }, obj = "Rapporter 3 × Orbe de minuit", oe = "Bring 3 × Midnight Orb" }
D[116] = { t = "Régime sec", nv = 15, min = 12, te = "Dry Times", g = { "Tavernier Daniels", "Barkeep Daniels", 1433, 24.6, 44.3 }, r = { "Tavernier Daniels", "Barkeep Daniels", 1433, 24.6, 44.3 }, obj = "Rapporter Tonneau de Tonnebière ; Rapporter Tonneau de merlot ; Rapporter Bouteille de tord-boyaux ; Rapporter Outre de rhum doux", oe = "Bring Keg of Thunderbrew ; Bring Cask of Merlot ; Bring Bottle of Moonshine ; Bring Skin of Sweet Rum" }
D[118] = { t = "Le prix des fers", nv = 18, min = 14, te = "The Price of Shoes", g = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, obj = "Rapporter Note de Verner", oe = "Bring Verner's Note" }
D[120] = { t = "Un message pour Hurlevent", nv = 14, min = 14, te = "Messenger to Stormwind", g = { "Magistrat Salomon", "Magistrate Solomon", 1433, 24.6, 44.3 }, obj = "Rapporter La situation de Comté-du-Lac", oe = "Bring The State of Lakeshire" }
D[122] = { t = "Les écailles de dragonnet", nv = 18, min = 14, te = "Underbelly Scales", av = 119, g = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, r = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, c = { 1433, 50.1, 76.3 }, obj = "Rapporter 6 × Ecaille ventrale de jeune dragon", oe = "Bring 6 × Underbelly Whelp Scale" }
D[124] = { t = "Le hurlement des gnolls", nv = 20, min = 15, te = "A Baying of Gnolls", av = 119, g = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, r = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, c = { 1433, 19.5, 34 }, obj = "Vaincre 10 × Brute des Carmines ; Vaincre 8 × Mystique des Carmines", oe = "Kill 10 × Redridge Brute ; Kill 8 × Redridge Mystic" }
D[125] = { t = "Les outils perdus", nv = 16, min = 15, te = "The Lost Tools", g = { "Contremaître Oslow", "Foreman Oslow", 1433, 28.4, 49 }, r = { "Contremaître Oslow", "Foreman Oslow", 1433, 28.4, 49 }, c = { 1433, 36.4, 54.7 }, obj = "Rapporter Boîte d'outils d'Oslow", oe = "Bring Oslow's Toolbox" }
D[126] = { t = "Les collines aux hurlements", nv = 25, min = 15, te = "Howling in the Hills", av = 124, g = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, r = { "Verner Bongoulot", "Verner Osgood", 1433, 28.4, 49 }, c = { 1433, 22.6, 21.4 }, obj = "Rapporter Patte de Couineur", oe = "Bring Yowler's Paw" }
D[127] = { t = "Criée aux poissons", nv = 21, min = 16, te = "Selling Fish", g = { "Chef des docks Baren", "Dockmaster Baren", 1433, 24.6, 44.3 }, r = { "Chef des docks Baren", "Dockmaster Baren", 1433, 24.6, 44.3 }, c = { 1433, 40.6, 66.5 }, obj = "Rapporter 10 × Poisson-lune", oe = "Bring 10 × Spotted Sunfish" }
D[128] = { t = "La prime rochenoire", nv = 25, min = 20, te = "Blackrock Bounty", g = { "Garde Howe", "Guard Howe", 1433, 26.5, 57.9 }, r = { "Garde Howe", "Guard Howe", 1433, 26.5, 57.9 }, c = { 1433, 24.4, 11.2 }, obj = "Vaincre 15 × Champion Rochenoire", oe = "Kill 15 × Blackrock Champion" }
D[129] = { t = "Un repas gratuit", nv = 15, min = 12, te = "A Free Lunch", g = { "Darcy Parker", "Darcy", 1433, 24.6, 44.3 }, r = { "Garde Parker", "Guard Parker", 1433, 10.2, 71.5 }, obj = "Rapporter Repas de Parker", oe = "Bring Parker's Lunch" }
D[130] = { t = "Une visite chez l'herboriste", nv = 15, min = 12, te = "Visit the Herbalist", av = 129, g = { "Garde Parker", "Guard Parker", 1433, 10.2, 71.5 }, r = { "Martie Jainrose", "Martie Jainrose", 1433, 16.8, 46.3 } }
D[131] = { t = "Bouquet de jonquilles", nv = 15, min = 12, te = "Delivering Daffodils", av = 130, g = { "Martie Jainrose", "Martie Jainrose", 1433, 16.8, 46.3 }, r = { "Darcy Parker", "Darcy", 1433, 24.6, 44.3 }, obj = "Rapporter Bouquet de jonquilles", oe = "Bring Daffodil Bouquet" }
D[132] = { t = "La Confrérie défias", nv = 18, min = 14, te = "The Defias Brotherhood", av = 65, g = { "Wiley le noir", "Wiley the Black", 1433, 24.6, 44.3 }, obj = "Rapporter Note de Wiley", oe = "Bring Wiley's Note" }
D[133] = { t = "L'épouvantail à goules", nv = 27, min = 20, te = "Ghoulish Effigy", av = 159, g = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, r = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, c = { 1431, 21.7, 32.4 }, obj = "Rapporter 7 × Côte de goule", oe = "Bring 7 × Ghoul Rib" }
D[134] = { t = "Les ogres voleurs", nv = 30, min = 20, te = "Ogre Thieves", av = 133, g = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, r = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, c = { 1431, 33.4, 76.4 }, obj = "Rapporter Caisse d'Abercrombie", oe = "Bring Abercrombie's Crate" }
D[135] = { t = "La Confrérie défias", nv = 18, min = 14, te = "The Defias Brotherhood", av = 132, g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, obj = "Rapporter Note de Wiley", oe = "Bring Wiley's Note" }
D[138] = { t = "Le trésor caché du capitaine Sanders", nv = 16, min = 10, te = "Captain Sander's Hidden Treasure", av = 136, g = { "Coffre du capitaine", "Captain's Footlocker", 1436, 25.9, 47.8 }, r = { "Tonneau cassé", "Broken Barrel", 1436, 40.5, 47.8 } }
D[139] = { t = "Le trésor caché du capitaine Sanders", nv = 16, min = 10, te = "Captain Sander's Hidden Treasure", av = 138, g = { "Tonneau cassé", "Broken Barrel", 1436, 40.5, 47.8 }, r = { "Vieille cruche", "Old Jug", 1436, 40.6, 17 } }
D[140] = { t = "Le trésor caché du capitaine Sanders", nv = 16, min = 10, te = "Captain Sander's Hidden Treasure", av = 139, g = { "Vieille cruche", "Old Jug", 1436, 40.6, 17 }, r = { "Coffre verrouillé", "Locked Chest", 1436, 26, 16.9 } }
D[142] = { t = "La Confrérie défias", nv = 18, min = 14, te = "The Defias Brotherhood", av = 141, g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, r = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, c = { 1436, 45.1, 69.3 }, obj = "Rapporter Un message mystérieux", oe = "Bring A Mysterious Message" }
D[143] = { t = "Un message pour la marche de l'Ouest", nv = 14, min = 14, te = "Messenger to Westfall", av = 121, g = { "Magistrat Salomon", "Magistrate Solomon", 1433, 24.6, 44.3 }, obj = "Rapporter Demande d'aide de Solomon à la marche de l'Ouest", oe = "Bring Solomon's Plea to Westfall" }
D[144] = { t = "Un message pour la marche de l'Ouest", nv = 14, min = 14, te = "Messenger to Westfall", av = 143, g = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 }, obj = "Rapporter Réponse de Stoutmantle à Solomon", oe = "Bring Stoutmantle's Response to Solomon" }
D[145] = { t = "Un message pour Sombre-Comté", nv = 18, min = 18, te = "Messenger to Darkshire", av = 144, g = { "Magistrat Salomon", "Magistrate Solomon", 1433, 24.6, 44.3 }, obj = "Rapporter Demande d'aide de Solomon à Darkshire", oe = "Bring Solomon's Plea to Darkshire" }
D[146] = { t = "Un message pour Sombre-Comté", nv = 18, min = 18, te = "Messenger to Darkshire", av = 145, g = { "Seigneur Ello Bouclenoire", "Lord Ello Ebonlocke", 1431, 73.8, 43.5 }, obj = "Rapporter Réponse d'Ebonlocke à Solomon", oe = "Bring Ebonlocke's Response to Solomon" }
D[147] = { t = "Chasse à l'homme", nv = 10, min = 7, te = "Manhunt", av = 123, g = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, c = { 1429, 71.1, 80.6 }, obj = "Rapporter Anneau du Collecteur", oe = "Bring The Collector's Ring" }
D[148] = { t = "Fournitures en provenance de Sombre-Comté", nv = 24, min = 20, te = "Supplies from Darkshire", g = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, r = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 } }
D[149] = { t = "Mèche de cheveux fantômes", nv = 24, min = 20, te = "Ghost Hair Thread", av = 148, g = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, r = { "Marie l'aveugle", "Blind Mary", 1431, 82, 59.1 }, obj = "Rapporter Peigne spectral", oe = "Bring Spectral Comb" }
D[150] = { t = "Les braconniers murlocs", nv = 20, min = 20, te = "Murloc Poachers", g = { "Chef des docks Baren", "Dockmaster Baren", 1433, 24.6, 44.3 }, r = { "Chef des docks Baren", "Dockmaster Baren", 1433, 24.6, 44.3 }, obj = "Rapporter 8 × Aileron de murloc", oe = "Bring 8 × Murloc Fin" }
D[151] = { t = "Pauvre Vieille Blanchette !", nv = 14, min = 9, te = "Poor Old Blanchy", g = { "Verna Froncebouille", "Verna Furlbrow", 1429, 17.7, 82.7 }, r = { "Verna Froncebouille", "Verna Furlbrow", 1429, 17.7, 82.7 }, c = { 1429, 15.4, 77.4 }, obj = "Rapporter 8 × Poignée d'avoine", oe = "Bring 8 × Handful of Oats" }
D[152] = { t = "La côte n'est pas sûre", nv = 19, min = 10, te = "The Coast Isn't Clear", g = { "Capitaine Grayson", "Captain Grayson", 1436, 30, 86 }, r = { "Capitaine Grayson", "Captain Grayson", 1436, 30, 86 }, c = { 1436, 46.7, 9.6 }, obj = "Vaincre 7 × Cours-la-côte murloc ; Vaincre 7 × Guerrier murloc ; Vaincre 7 × Chasse-marée murloc ; Vaincre 7 × Oracle murloc", oe = "Kill 7 × Murloc Coastrunner ; Kill 7 × Murloc Warrior ; Kill 7 × Murloc Tidehunter ; Kill 7 × Murloc Oracle" }
D[153] = { t = "Les masques en cuir rouge", nv = 15, min = 10, te = "Red Leather Bandanas", g = { "Eclaireur Galiaan", "Scout Galiaan", 1436, 54, 53 }, r = { "Eclaireur Galiaan", "Scout Galiaan", 1436, 54, 53 }, c = { 1436, 41.5, 70.2 }, obj = "Rapporter 15 × Masque en cuir rouge", oe = "Bring 15 × Red Leather Bandana" }
D[154] = { t = "Rendre le peigne", nv = 24, min = 20, te = "Return the Comb", av = 149, g = { "Marie l'aveugle", "Blind Mary", 1431, 82, 59.1 }, r = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, obj = "Rapporter Peigne fantôme", oe = "Bring Ghost Hair Comb" }
D[155] = { t = "La Confrérie défias", nv = 18, min = 14, te = "The Defias Brotherhood", av = 142, g = { "Le traître défias", "The Defias Traitor", 1436, 56.3, 47.5 }, r = { "Gryan Roidemantel", "Gryan Stoutmantle", 1436, 56.3, 47.5 } }
D[156] = { t = "Cueillette de racines pourries", nv = 24, min = 20, te = "Gather Rot Blossoms", av = 158, g = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 }, r = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 }, c = { 1431, 18.5, 44.6 }, obj = "Rapporter 8 × Racine pourrie", oe = "Bring 8 × Rot Blossom" }
D[157] = { t = "Apporter la mèche", nv = 24, min = 20, te = "Deliver the Thread", av = 154, g = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, r = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, obj = "Rapporter Mèche de cheveux fantômes", oe = "Bring Ghost Hair Thread" }
D[158] = { t = "Le suc de zombie", nv = 24, min = 20, te = "Zombie Juice", av = 157, g = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, r = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 } }
D[159] = { t = "Livrer le Suc", nv = 24, min = 20, te = "Juice Delivery", av = 156, g = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 }, r = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, obj = "Rapporter Fiole de suc de zombie", oe = "Bring Bottle of Zombie Juice" }
D[160] = { t = "Une lettre pour le Maire", nv = 30, min = 20, te = "Note to the Mayor", av = 134, g = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 }, r = { "Seigneur Ello Bouclenoire", "Lord Ello Ebonlocke", 1431, 73.8, 43.5 }, obj = "Rapporter Lettre à Ello", oe = "Bring Letter to Ello" }
D[161] = { t = "Une sombre menace se dessine", nv = 18, min = 16, te = "A Dark Threat Looms", av = 199, g = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 }, obj = "Rapporter Poudre à l'odeur étrange", oe = "Bring Strange Smelling Powder" }
D[162] = { t = "L'ascension des silithides", nv = 49, min = 39, te = "Rise of the Silithid", av = 113, g = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, obj = "Rapporter Rapport d'analyse d'insecte", oe = "Bring Insect Analysis Report" }
D[163] = { t = "Colline-aux-Corbeaux", nv = 20, min = 17, te = "Raven Hill", g = { "Elaine Carevin", "Elaine Carevin", 1431, 75.3, 48.7 }, r = { "La Tremblote", "Jitters", 1431, 18.4, 56.4 } }
D[164] = { t = "Livraison à Sven", nv = 23, min = 17, te = "Deliveries to Sven", g = { "Elaine Carevin", "Elaine Carevin", 1431, 75.3, 48.7 }, r = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, obj = "Rapporter Fournitures pour Sven", oe = "Bring Supplies for Sven" }
D[165] = { t = "L'ermite", nv = 25, min = 17, te = "The Hermit", g = { "Elaine Carevin", "Elaine Carevin", 1431, 75.3, 48.7 }, r = { "Abercrombie", "Abercrombie", 1431, 28.1, 31.5 } }
D[169] = { t = "On recherche : Gath'Ilzogg", nv = 26, min = 15, te = "Wanted: Gath'Ilzogg", g = { "Avis de recherche : Gath'Ilzogg", "Wanted: Gath'Ilzogg", 1433, 24.6, 44.3 }, r = { "Magistrat Salomon", "Magistrate Solomon", 1433, 24.6, 44.3 }, c = { 1433, 64.5, 55.8 }, obj = "Rapporter Tête de Gath'Ilzogg", oe = "Bring Head of Gath'Ilzogg" }
D[170] = { t = "Une nouvelle menace", nv = 2, min = 1, te = "A New Threat", av = 179, g = { "Balir Martel-de-givre", "Balir Frosthammer", 1426, 29.7, 71.3 }, r = { "Balir Martel-de-givre", "Balir Frosthammer", 1426, 29.7, 71.3 }, c = { 1426, 25, 74.3 }, obj = "Vaincre 6 × Trogg Mâcheroc ; Vaincre 6 × Trogg Mâcheroc mastoc", oe = "Kill 6 × Rockjaw Trogg ; Kill 6 × Burly Rockjaw Trogg" }
D[173] = { t = "Worgens dans les bois", nv = 28, min = 23, te = "Worgen in the Woods", g = { "Calor", "Calor", 1431, 75.3, 48.7 }, r = { "Calor", "Calor", 1431, 75.3, 48.7 }, c = { 1431, 64.6, 70.8 }, obj = "Vaincre 6 × Tisseur d'ombre Plaie-de-nuit", oe = "Kill 6 × Nightbane Shadow Weaver" }
D[174] = { t = "Les yeux dans les étoiles", nv = 25, min = 20, te = "Look To The Stars", g = { "Viktori Prism'Antras", "Viktori Prism'Antras", 1431, 79.8, 48 }, r = { "Viktori Prism'Antras", "Viktori Prism'Antras", 1431, 79.8, 48 }, obj = "Rapporter Tube en bronze", oe = "Bring Bronze Tube" }
D[175] = { t = "Les yeux dans les étoiles", nv = 25, min = 20, te = "Look To The Stars", av = 174, g = { "Viktori Prism'Antras", "Viktori Prism'Antras", 1431, 79.8, 48 }, r = { "Marie l'aveugle", "Blind Mary", 1431, 82, 59.1 } }
D[176] = { t = "On recherche : « Lardeur »", nv = 11, min = 5, te = "Wanted:  \"Hogger\"", g = { "Avis de recherche", "Wanted Poster", 1429, 24.2, 74.4 }, r = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, c = { 1429, 26, 89.8 }, obj = "Rapporter Grande griffe de gnoll", oe = "Bring Huge Gnoll Claw" }
D[177] = { t = "Les yeux dans les étoiles", nv = 25, min = 20, te = "Look To The Stars", av = 175, g = { "Marie l'aveugle", "Blind Mary", 1431, 82, 59.1 }, r = { "Viktori Prism'Antras", "Viktori Prism'Antras", 1431, 79.8, 48 }, c = { 1431, 80.9, 72 }, obj = "Rapporter Miroir de Marie", oe = "Bring Mary's Looking Glass" }
D[179] = { t = "Tailleur chez les nains", nv = 1, min = 1, te = "Dwarven Outfitters", g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, c = { 1426, 28.2, 74.3 }, obj = "Rapporter 8 × Viande de loup coriace", oe = "Bring 8 × Tough Wolf Meat" }
D[180] = { t = "On recherche : lieutenant Tripecroc", nv = 26, min = 15, te = "Wanted: Lieutenant Fangore", g = { "Avis de recherche : Lieutenant Tripecroc ", "Wanted: Lieutenant Fangore", 1433, 24.6, 44.3 }, r = { "Magistrat Salomon", "Magistrate Solomon", 1433, 24.6, 44.3 }, c = { 1433, 75.1, 37.1 }, obj = "Rapporter Patte de Fangore", oe = "Bring Fangore's Paw" }
D[181] = { t = "Les yeux dans les étoiles", nv = 30, min = 20, te = "Look To The Stars", av = 177, g = { "Viktori Prism'Antras", "Viktori Prism'Antras", 1431, 79.8, 48 }, r = { "Viktori Prism'Antras", "Viktori Prism'Antras", 1431, 79.8, 48 }, c = { 1431, 37, 81.5 }, obj = "Rapporter Monocle d'ogre", oe = "Bring Ogre's Monocle" }
D[182] = { t = "La menace trolle", nv = 4, min = 1, te = "The Troll Cave", g = { "Grelin Blanchebarbe", "Grelin Whitebeard", 1426, 25.1, 75.7 }, r = { "Grelin Blanchebarbe", "Grelin Whitebeard", 1426, 25.1, 75.7 }, c = { 1426, 26.1, 79.7 }, obj = "Vaincre 14 × Jeune troll Crins-de-givre", oe = "Kill 14 × Frostmane Troll Whelp" }
D[183] = { t = "Chasseur de sangliers", nv = 3, min = 1, te = "The Boar Hunter", g = { "Talin Oeil-perçant", "Talin Keeneye", 1426, 22.6, 71.4 }, r = { "Talin Oeil-perçant", "Talin Keeneye", 1426, 22.6, 71.4 }, c = { 1426, 23.6, 73 }, obj = "Vaincre 12 × Petit sanglier des rochers", oe = "Kill 12 × Small Crag Boar" }
D[185] = { t = "Le frisson de la chasse au tigre", nv = 31, min = 28, te = "Tiger Mastery", av = 583, g = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, r = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, c = { 1434, 35.8, 12 }, obj = "Vaincre 10 × Jeune tigre de Strangleronce", oe = "Kill 10 × Young Stranglethorn Tiger" }
D[186] = { t = "Petit tigre deviendra grand…", nv = 33, min = 28, te = "Tiger Mastery", av = 185, g = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, r = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, obj = "Vaincre 10 × Tigre de Strangleronce", oe = "Kill 10 × Stranglethorn Tiger" }
D[187] = { t = "Chasseur de grands fauves : les tigres", nv = 35, min = 28, te = "Tiger Mastery", av = 186, g = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, r = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, c = { 1434, 33.2, 18.5 }, obj = "Vaincre 10 × Ancien tigre de Strangleronce", oe = "Kill 10 × Elder Stranglethorn Tiger" }
D[188] = { t = "La maîtrise de la chasse au tigre", nv = 37, min = 28, te = "Tiger Mastery", av = 187, g = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, r = { "Ajeck Rouack", "Ajeck Rouack", 1434, 35.6, 10.6 }, c = { 1434, 32.2, 17.4 }, obj = "Rapporter Patte de Sin'Dall", oe = "Bring Paw of Sin'Dall" }
D[189] = { t = "Les oreilles de Scalp-rouge", nv = 35, min = 30, te = "Bloodscalp Ears", g = { "Kebok", "Kebok", 1434, 27, 77.1 }, r = { "Kebok", "Kebok", 1434, 27, 77.1 }, c = { 1434, 25.1, 12.5 }, obj = "Rapporter 15 × Oreille de Bloodscalp", oe = "Bring 15 × Bloodscalp Ear" }
D[190] = { t = "Le frisson de la chasse à la panthère", nv = 31, min = 28, te = "Panther Mastery", av = 583, g = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, r = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, c = { 1434, 39.4, 10.7 }, obj = "Vaincre 10 × Jeune panthère", oe = "Kill 10 × Young Panther" }
D[191] = { t = "Petite panthère deviendra grande…", nv = 33, min = 28, te = "Panther Mastery", av = 190, g = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, r = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, c = { 1434, 46, 13.7 }, obj = "Vaincre 10 × Panthère", oe = "Kill 10 × Panther" }
D[192] = { t = "Chasseur de grands fauves : les panthères", nv = 38, min = 28, te = "Panther Mastery", av = 191, g = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, r = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, obj = "Vaincre 10 × Panthère Ombregueule", oe = "Kill 10 × Shadowmaw Panther" }
D[193] = { t = "La maîtrise de la chasse à la panthère", nv = 40, min = 28, te = "Panther Mastery", av = 192, g = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, r = { "Sire S. J. Erlgadin", "Sir S. J. Erlgadin", 1434, 35.6, 10.6 }, c = { 1434, 49.6, 24 }, obj = "Rapporter Croc de Bhag'thera", oe = "Bring Fang of Bhag'thera" }
D[194] = { t = "Le frisson de la chasse au raptor", nv = 34, min = 28, te = "Raptor Mastery", av = 583, g = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, r = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, c = { 1434, 26.3, 15.8 }, obj = "Vaincre 10 × Raptor de Strangleronce", oe = "Kill 10 × Stranglethorn Raptor" }
D[195] = { t = "Petit raptor deviendra grand…", nv = 36, min = 28, te = "Raptor Mastery", av = 194, g = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, r = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, c = { 1434, 35, 24.5 }, obj = "Vaincre 10 × Raptor flagellant", oe = "Kill 10 × Lashtail Raptor" }
D[196] = { t = "Chasseur de grands sauriens : les raptors", nv = 41, min = 28, te = "Raptor Mastery", av = 195, g = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, r = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, c = { 1434, 29.7, 43.5 }, obj = "Vaincre 10 × Traqueur de la jungle", oe = "Kill 10 × Jungle Stalker" }
D[197] = { t = "La maîtrise de la chasse aux raptors", nv = 43, min = 28, te = "Raptor Mastery", av = 196, g = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, r = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, c = { 1434, 29.6, 43.6 }, obj = "Rapporter Serre de Téthis", oe = "Bring Talon of Tethis" }
D[198] = { t = "Les marchandises du soldat Thorsen", nv = 32, min = 30, te = "Supplies to Private Thorsen", g = { "Krazek", "Krazek", 1434, 27, 77.1 }, r = { "Soldat Thorsen", "Private Thorsen", 1434, 38, 3.4 }, obj = "Rapporter Diverses fournitures gobelines", oe = "Bring Miscellaneous Goblin Supplies" }
D[199] = { t = "Une sombre menace se dessine", nv = 18, min = 16, te = "A Dark Threat Looms", av = 250, g = { "Tonneau suspect", "Suspicious Barrel", 1432, 56.1, 13.2 }, r = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 }, obj = "Rapporter Poudre à l'odeur étrange", oe = "Bring Strange Smelling Powder" }
D[200] = { t = "Hérode la Paperasse", nv = 35, min = 30, te = "Bookie Herod", av = 215, g = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 }, r = { "Archives d'Hérode la Paperasse", "Bookie Herod's Records", 1434, 43.7, 9.4 } }
D[201] = { t = "L'enquête au camp", nv = 32, min = 28, te = "Investigate the Camp", g = { "Krazek", "Krazek", 1434, 27, 77.1 }, r = { "Krazek", "Krazek", 1434, 27, 77.1 } }
D[202] = { t = "Le colonel Kurzen", nv = 40, min = 30, te = "Colonel Kurzen", av = 574, g = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 }, r = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 }, c = { 1434, 48.8, 6 }, obj = "Rapporter Tête de Kurzen ; Vaincre 6 × Troupe d'élite de Kurzen ; Vaincre 4 × Lieutenant de Kurzen", oe = "Bring Kurzen's Head ; Kill 6 × Kurzen Elite ; Kill 4 × Kurzen Subchief" }
D[203] = { t = "La seconde rébellion", nv = 33, min = 30, te = "The Second Rebellion", g = { "Sergent Yohwa", "Sergeant Yohwa", 1434, 38, 3.4 }, r = { "Sergent Yohwa", "Sergeant Yohwa", 1434, 38, 3.4 }, c = { 1434, 45.4, 10.6 }, obj = "Vaincre 15 × Guerrier de la jungle de Kurzen", oe = "Kill 15 × Kurzen Jungle Fighter" }
D[204] = { t = "Mauvaise médecine", nv = 34, min = 30, te = "Bad Medicine", g = { "Sergent Yohwa", "Sergeant Yohwa", 1434, 38, 3.4 }, r = { "Sergent Yohwa", "Sergeant Yohwa", 1434, 38, 3.4 }, c = { 1434, 46.5, 8.8 }, obj = "Rapporter 7 × Remède tropical ; Rapporter Extraits de fougère vénéneuse", oe = "Bring 7 × Jungle Remedy ; Bring Venom Fern Extract" }
D[205] = { t = "Sorcellerie trolle", nv = 40, min = 30, te = "Troll Witchery", av = 207, g = { "Frère Nimetz", "Brother Nimetz", 1434, 38, 3.4 }, r = { "Frère Nimetz", "Brother Nimetz", 1434, 38, 3.4 }, c = { 1434, 45.9, 37.4 }, obj = "Rapporter 4 × Fétiche Skullsplitter", oe = "Bring 4 × Skullsplitter Fetish" }
D[206] = { t = "Mai'Zoth", nv = 46, min = 30, g = { "Frère Nimetz", "Brother Nimetz", 1434, 38, 3.4 }, r = { "Frère Nimetz", "Brother Nimetz", 1434, 38, 3.4 }, c = { 1434, 52.9, 27.6 }, obj = "Rapporter Vue de l'esprit", oe = "Bring Mind's Eye" }
D[207] = { t = "Le mystère de Kurzen", nv = 38, min = 30, te = "Kurzen's Mystery", g = { "Frère Nimetz", "Brother Nimetz", 1434, 38, 3.4 }, r = { "Frère Nimetz", "Brother Nimetz", 1434, 38, 3.4 }, c = { 1434, 27.2, 21.1 }, obj = "Rapporter La première légende des trolls ; Rapporter La deuxième légende des trolls ; Rapporter La troisième légende des trolls ; Rapporter La quatrième légende des trolls", oe = "Bring The First Troll Legend ; Bring The Second Troll Legend ; Bring The Third Troll Legend ; Bring The Fourth Troll Legend" }
D[208] = { t = "La chasse au gros gibier", nv = 43, min = 28, te = "Big Game Hunter", g = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, r = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 }, c = { 1434, 38.2, 35.6 }, obj = "Rapporter Tête de Bangalash", oe = "Bring Head of Bangalash" }
D[209] = { t = "Les défenses de Casse-crâne", nv = 42, min = 37, te = "Skullsplitter Tusks", av = 189, g = { "Kebok", "Kebok", 1434, 27, 77.1 }, r = { "Kebok", "Kebok", 1434, 27, 77.1 }, c = { 1434, 45.7, 38.8 }, obj = "Rapporter 18 × Défense de Skullsplitter", oe = "Bring 18 × Skullsplitter Tusk" }
D[210] = { t = "La cuisine de Krazek", nv = 37, min = 32, te = "Krazek's Cookery", g = { "Caporal Kaleb", "Corporal Kaleb", 1434, 38, 3.4 }, r = { "Krazek", "Krazek", 1434, 27, 77.1 }, obj = "Rapporter Cocotte ébréchée de Krazek", oe = "Bring Krazek's Crock Pot" }
D[211] = { t = "Hélas, Andorhal", nv = 60, min = 50, te = "Alas, Andorhal", av = 5097, g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, obj = "Rapporter Eclat phylactère d'Araj", oe = "Bring Araj's Phylactery Shard" }
D[213] = { t = "Une ponction musclée", nv = 36, min = 31, te = "Hostile Takeover", g = { "Kebok", "Kebok", 1434, 27, 77.1 }, r = { "Kebok", "Kebok", 1434, 27, 77.1 }, c = { 1434, 44.8, 19.8 }, obj = "Rapporter 8 × Cristal réduit", oe = "Bring 8 × Tumbled Crystal" }
D[215] = { t = "Les secrets de la jungle", nv = 33, min = 30, te = "Jungle Secrets", g = { "Soldat Thorsen", "Private Thorsen", 1434, 38, 3.4 }, r = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 } }
D[216] = { t = "Entre un roc et un Crin-de-Chardon", nv = 24, min = 21, te = "Between a Rock and a Thistlefur", g = { "Karang Amakkar", "Karang Amakkar", 1440, 11.9, 34.5 }, r = { "Karang Amakkar", "Karang Amakkar", 1440, 11.9, 34.5 }, c = { 1440, 34.1, 38.7 }, obj = "Vaincre 8 × Vengeur Crin-de-Chardon ; Vaincre 8 × Chaman Crin-de-Chardon", oe = "Kill 8 × Thistlefur Avenger ; Kill 8 × Thistlefur Shaman" }
D[217] = { t = "Une frappe décisive", nv = 17, min = 10, te = "In Defense of the King's Lands", av = 263, g = { "Capitaine Rudagite", "Captain Rugelfuss", 1432, 23.2, 73.7 }, r = { "Capitaine Rudagite", "Captain Rugelfuss", 1432, 23.2, 73.7 }, c = { 1432, 34.8, 90.5 }, obj = "Vaincre Grawmug ; Vaincre Grinceur ; Vaincre Bagarreur", oe = "Kill Grawmug ; Kill Gnasher ; Kill Brawler" }
D[218] = { t = "La glace et le feu", nv = 5, min = 1, te = "The Stolen Journal", av = 182, g = { "Grelin Blanchebarbe", "Grelin Whitebeard", 1426, 25.1, 75.7 }, r = { "Grelin Blanchebarbe", "Grelin Whitebeard", 1426, 25.1, 75.7 }, c = { 1426, 30.5, 80.2 }, obj = "Rapporter Journal de Grelin Whitebeard", oe = "Bring Grelin Whitebeard's Journal" }
D[219] = { t = "Porté disparu", nv = 25, min = 19, te = "Missing In Action", g = { "Caporal Keeshan", "Corporal Keeshan", 1433, 23.3, 12.6 }, r = { "Maréchal Marris", "Marshal Marris", 1433, 28.4, 49 } }
D[220] = { t = "L'appel de l'eau", nv = 23, min = 20, te = "Call of Water", av = 1534, g = { "Brine", "Brine", 1413, 45.9, 77 }, r = { "Islen Oeil-des-rivières", "Islen Waterseer", 1413, 65.8, 43.9 }, obj = "Rapporter Fiole d'eau pure", oe = "Bring Vial of Purest Water" }
D[221] = { t = "Worgens dans les bois", nv = 29, min = 23, te = "Worgen in the Woods", av = 173, g = { "Calor", "Calor", 1431, 75.3, 48.7 }, r = { "Calor", "Calor", 1431, 75.3, 48.7 }, c = { 1431, 63.7, 45.2 }, obj = "Vaincre 12 × Messager Plaie-de-nuit", oe = "Kill 12 × Nightbane Dark Runner" }
D[222] = { t = "Worgens dans les bois", nv = 31, min = 23, te = "Worgen in the Woods", av = 221, g = { "Calor", "Calor", 1431, 75.3, 48.7 }, r = { "Calor", "Calor", 1431, 75.3, 48.7 }, c = { 1431, 72.8, 73.5 }, obj = "Vaincre 8 × Croc noir Plaie-de-nuit ; Vaincre 8 × Contaminé Plaie-de-nuit", oe = "Kill 8 × Nightbane Vile Fang ; Kill 8 × Nightbane Tainted One" }
D[223] = { t = "Worgens dans les bois", nv = 31, min = 23, te = "Worgen in the Woods", av = 222, g = { "Calor", "Calor", 1431, 75.3, 48.7 }, r = { "Jonathan Carevin", "Jonathan Carevin", 1431, 75.3, 48.7 }, obj = "Rapporter Note de Calor", oe = "Bring Calor's Note" }
D[224] = { t = "À la défense des terres du roi", nv = 12, min = 10, te = "In Defense of the King's Lands", g = { "Montagnard Pave-silex", "Mountaineer Cobbleflint", 1432, 23.2, 73.7 }, r = { "Montagnard Pave-silex", "Mountaineer Cobbleflint", 1432, 23.2, 73.7 }, c = { 1432, 33.1, 74.2 }, obj = "Vaincre 10 × Trogg Brisepierre ; Vaincre 10 × Eclaireur Brisepierre", oe = "Kill 10 × Stonesplinter Trogg ; Kill 10 × Stonesplinter Scout" }
D[225] = { t = "La tombe effritée", nv = 35, min = 28, te = "The Weathered Grave", g = { "Un tombeau dégradé par les intempéries", "A Weathered Grave", 1431, 17.7, 29.1 }, r = { "Sirra Von'Indi", "Sirra Von'Indi", 1431, 75.3, 48.7 } }
D[226] = { t = "Des loups aux trousses", nv = 21, min = 19, te = "Wolves at Our Heels", g = { "Lars", "Lars", 1431, 7.8, 34.1 }, r = { "Lars", "Lars", 1431, 7.8, 34.1 }, c = { 1431, 28.8, 26.4 }, obj = "Vaincre 12 × Loup redoutable affamé ; Vaincre 8 × Loup redoutable enragé", oe = "Kill 12 × Starving Dire Wolf ; Kill 8 × Rabid Dire Wolf" }
D[227] = { t = "Morgan Ladimore", nv = 35, min = 28, av = 225, g = { "Sirra Von'Indi", "Sirra Von'Indi", 1431, 75.3, 48.7 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 } }
D[228] = { t = "Mor'Ladim", nv = 35, min = 28, av = 227, g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, c = { 1431, 16.7, 37.4 }, obj = "Rapporter Crâne de Mor'Ladim", oe = "Bring Mor'Ladim's Skull" }
D[229] = { t = "La fille qui survécut", nv = 35, min = 28, te = "The Daughter Who Lived", av = 228, g = { "Commandant Althea Bouclenoire", "Commander Althea Ebonlocke", 1431, 73.8, 43.5 }, r = { "Gardienne Ladimore", "Watcher Ladimore", 1431, 75.3, 48.7 } }
D[230] = { t = "Le camp de Sven", nv = 25, min = 20, te = "Sven's Camp", av = 95, g = { "Mound of loose dirt", "Mound of loose dirt", 1431, 49.9, 77.7 }, r = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, obj = "Rapporter Livre de la ferme de Sven", oe = "Bring Book from Sven's Farm" }
D[231] = { t = "L'amour d'une fille", nv = 35, min = 28, te = "A Daughter's Love", av = 229, g = { "Gardienne Ladimore", "Watcher Ladimore", 1431, 75.3, 48.7 }, r = { "Un tombeau dégradé par les intempéries", "A Weathered Grave", 1431, 17.7, 29.1 }, obj = "Rapporter Anneau de Sarah", oe = "Bring Sarah's Ring" }
D[233] = { t = "La distribution du courrier de la Vallée des Frigères", nv = 3, min = 1, te = "Coldridge Valley Mail Delivery", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Talin Oeil-perçant", "Talin Keeneye", 1426, 22.6, 71.4 }, obj = "Rapporter Un tas de lettres", oe = "Bring A Stack of Letters" }
D[234] = { t = "La distribution du courrier de la Vallée des Frigères", nv = 4, min = 1, te = "Coldridge Valley Mail Delivery", av = 233, g = { "Talin Oeil-perçant", "Talin Keeneye", 1426, 22.6, 71.4 }, r = { "Grelin Blanchebarbe", "Grelin Whitebeard", 1426, 25.1, 75.7 }, obj = "Rapporter Une lettre pour Grelin Whitebeard", oe = "Bring A Letter to Grelin Whitebeard" }
D[237] = { t = "À la défense des terres du roi", nv = 15, min = 10, te = "In Defense of the King's Lands", av = 224, g = { "Montagnard Gravegalle", "Mountaineer Gravelgaw", 1432, 23.2, 73.7 }, r = { "Montagnard Gravegalle", "Mountaineer Gravelgaw", 1432, 23.2, 73.7 }, c = { 1432, 34.8, 84.5 }, obj = "Vaincre 10 × Brise-crâne Brisepierre ; Vaincre 10 × Prophète Brisepierre", oe = "Kill 10 × Stonesplinter Skullthumper ; Kill 10 × Stonesplinter Seer" }
D[239] = { t = "Au secours de la garnison du ruisseau de l'Ouest !", nv = 10, min = 6, te = "Westbrook Garrison Needs Help!", av = 76, g = { "Maréchal Dughan", "Marshal Dughan", 1429, 42.1, 65.9 }, r = { "Adjoint Rainer", "Deputy Rainer", 1429, 24.2, 74.4 } }
D[240] = { t = "Retour vers la Tremblote", nv = 20, min = 17, te = "Return to Jitters", av = 93, g = { "Chef Grual", "Chef Grual", 1431, 73.8, 43.5 }, r = { "La Tremblote", "Jitters", 1431, 18.4, 56.4 }, obj = "Rapporter Gâteaux au crabe brun", oe = "Bring Dusky Crab Cakes" }
D[244] = { t = "Des gnolls encombrants", nv = 16, min = 11, te = "Encroaching Gnolls", g = { "Garde Parker", "Guard Parker", 1433, 10.2, 71.5 }, r = { "Adjoint Feldon", "Deputy Feldon", 1433, 26.5, 57.9 } }
D[245] = { t = "Les plaies à huit pattes", nv = 21, min = 17, te = "Eight-Legged Menaces", g = { "Gardien Dodds", "Watcher Dodds", 1431, 45.1, 67 }, r = { "Gardien Dodds", "Watcher Dodds", 1431, 45.1, 67 }, c = { 1431, 10.8, 55.9 }, obj = "Vaincre 15 × Araignée Tisse-venin pygmée", oe = "Kill 15 × Pygmy Venom Web Spider" }
D[246] = { t = "L'appréciation du danger", nv = 17, min = 11, te = "Assessing the Threat", av = 244, g = { "Adjoint Feldon", "Deputy Feldon", 1433, 26.5, 57.9 }, r = { "Adjoint Feldon", "Deputy Feldon", 1433, 26.5, 57.9 }, c = { 1433, 26.1, 82.1 }, obj = "Vaincre 10 × Bâtard des Carmines ; Vaincre 6 × Braconnier des Carmines", oe = "Kill 10 × Redridge Mongrel ; Kill 6 × Redridge Poacher" }
D[247] = { t = "La chasse achevée", nv = 30, min = 20, te = "The Hunt Completed", g = { "Senani Cœur-de-tonnerre", "Senani Thunderheart", 1440, 73.7, 60 }, r = { "Senani Cœur-de-tonnerre", "Senani Thunderheart", 1440, 73.7, 60 } }
D[248] = { t = "En regardant plus loin", nv = 22, min = 20, te = "Looking Further", av = 94, g = { "Statue du vieux lion", "Old Lion Statue", 1433, 79.4, 46.8 }, r = { "Un pot vide", "An Empty Jar", 1433, 58.2, 49.8 }, obj = "Rapporter Glyphe d'Azora", oe = "Bring Glyph of Azora" }
D[249] = { t = "Morganth", nv = 27, min = 20, av = 248, g = { "Statue du vieux lion", "Old Lion Statue", 1433, 79.4, 46.8 }, c = { 1433, 75, 49.5 }, obj = "Rapporter Pendentif des ombres", oe = "Bring Pendant of Shadow" }
D[250] = { t = "Une sombre menace se dessine", nv = 18, min = 16, te = "A Dark Threat Looms", g = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 }, r = { "Tonneau suspect", "Suspicious Barrel", 1432, 56.1, 13.2 } }
D[251] = { t = "La traduction de la lettre d'Abercrombie", nv = 30, min = 20, te = "Translate Abercrombie's Note", av = 160, g = { "Seigneur Ello Bouclenoire", "Lord Ello Ebonlocke", 1431, 73.8, 43.5 }, r = { "Sirra Von'Indi", "Sirra Von'Indi", 1431, 75.3, 48.7 }, obj = "Rapporter Lettre à Ello", oe = "Bring Letter to Ello" }
D[252] = { t = "La traduction pour Ello", nv = 30, min = 20, te = "Translation to Ello", av = 401, g = { "Sirra Von'Indi", "Sirra Von'Indi", 1431, 75.3, 48.7 }, r = { "Seigneur Ello Bouclenoire", "Lord Ello Ebonlocke", 1431, 73.8, 43.5 }, obj = "Rapporter Lettre traduite", oe = "Bring Translated Letter" }
D[253] = { t = "La fiancée de l'Embaumeur", nv = 30, min = 20, te = "Bride of the Embalmer", av = 252, g = { "Seigneur Ello Bouclenoire", "Lord Ello Ebonlocke", 1431, 73.8, 43.5 }, r = { "Seigneur Ello Bouclenoire", "Lord Ello Ebonlocke", 1431, 73.8, 43.5 }, obj = "Rapporter Coeur de l'Embaumeur", oe = "Bring The Embalmer's Heart" }
D[255] = { t = "Mercenaires", nv = 19, min = 15, te = "Mercenaries", g = { "Magistrat Courtnez", "Magistrate Bluntnose", 1432, 34.6, 44.5 }, r = { "Magistrat Courtnez", "Magistrate Bluntnose", 1432, 34.6, 44.5 }, c = { 1432, 68.7, 25 }, obj = "Vaincre 4 × Ogre Mo'grosh ; Vaincre 4 × Brute Mo'grosh ; Vaincre 4 × Massacreur Mo'grosh", oe = "Kill 4 × Mo'grosh Ogre ; Kill 4 × Mo'grosh Brute ; Kill 4 × Mo'grosh Enforcer" }
D[256] = { t = "ON RECHERCHE : Chok'sul", nv = 22, min = 17, te = "WANTED: Chok'sul", g = { "Avis de recherche !", "WANTED", 1432, 34.6, 44.5 }, r = { "Magistrat Courtnez", "Magistrate Bluntnose", 1432, 34.6, 44.5 }, c = { 1432, 79.6, 14.7 }, obj = "Rapporter Tête de Chok'sul", oe = "Bring Chok'sul's Head" }
D[257] = { t = "La fanfaronnade d'un chasseur", nv = 16, min = 11, te = "A Hunter's Boast", g = { "Daryl le Jeune", "Daryl the Youngling", 1432, 83.5, 65.5 }, r = { "Daryl le Jeune", "Daryl the Youngling", 1432, 83.5, 65.5 }, c = { 1432, 75.8, 70.2 }, obj = "Vaincre 6 × Busard des montagnes", oe = "Kill 6 × Mountain Buzzard" }
D[258] = { t = "Le défi d'un chasseur", nv = 17, min = 11, te = "A Hunter's Challenge", av = 257, g = { "Daryl le Jeune", "Daryl the Youngling", 1432, 83.5, 65.5 }, r = { "Daryl le Jeune", "Daryl the Youngling", 1432, 83.5, 65.5 }, c = { 1432, 63.7, 38.6 }, obj = "Vaincre 5 × Ancien sanglier des montagnes", oe = "Kill 5 × Elder Mountain Boar" }
D[261] = { t = "Sur le chemin écarlate", nv = 39, min = 34, te = "Down the Scarlet Path", g = { "Frère Anton", "Brother Anton", 1443, 66.5, 7.9 }, r = { "Frère Anton", "Brother Anton", 1443, 66.5, 7.9 }, c = { 1443, 64.3, 83.8 }, obj = "Vaincre 30 × Ravageur mort-vivant", oe = "Kill 30 × Undead Ravager" }
D[262] = { t = "La silhouette mystérieuse", nv = 25, min = 20, te = "The Shadowy Figure", av = 230, g = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, r = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, obj = "Rapporter Livre de la ferme de Sven", oe = "Bring Book from Sven's Farm" }
D[263] = { t = "À la défense des terres du roi", nv = 15, min = 10, te = "In Defense of the King's Lands", av = 237, g = { "Montagnard Cognemur", "Mountaineer Wallbang", 1432, 23.2, 73.7 }, r = { "Montagnard Cognemur", "Mountaineer Wallbang", 1432, 23.2, 73.7 }, c = { 1432, 37, 89.9 }, obj = "Vaincre 10 × Chaman Brisepierre ; Vaincre 10 × Briseur d'os Brisepierre", oe = "Kill 10 × Stonesplinter Shaman ; Kill 10 × Stonesplinter Bonesnapper" }
D[265] = { t = "La mystérieuse recherche se poursuit", nv = 25, min = 20, te = "The Shadowy Search Continues", av = 262, g = { "Madame Eva", "Madame Eva", 1431, 73.8, 43.5 }, r = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 }, obj = "Rapporter Livre de la ferme de Sven", oe = "Bring Book from Sven's Farm" }
D[266] = { t = "Une enquête à l'auberge", nv = 25, min = 20, te = "Inquire at the Inn", av = 265, g = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 }, r = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 }, obj = "Rapporter Livre de la ferme de Sven", oe = "Bring Book from Sven's Farm" }
D[267] = { t = "La menace trogg", nv = 12, min = 10, te = "The Trogg Threat", g = { "Capitaine Rudagite", "Captain Rugelfuss", 1432, 23.2, 73.7 }, r = { "Capitaine Rudagite", "Captain Rugelfuss", 1432, 23.2, 73.7 }, c = { 1432, 34.8, 86.2 }, obj = "Rapporter 8 × Dent de pierre de trogg", oe = "Bring 8 × Trogg Stone Tooth" }
D[268] = { t = "Retourner voir Sven", nv = 25, min = 20, te = "Return to Sven", av = 453, g = { "La Tremblote", "Jitters", 1431, 18.4, 56.4 }, r = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, obj = "Rapporter Journal complet de la Tremblotte", oe = "Bring Jitters' Completed Journal" }
D[269] = { t = "À la recherche de la sagesse", nv = 29, min = 20, te = "Seeking Wisdom", av = 323, g = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, obj = "Rapporter Journal complet de la Tremblotte", oe = "Bring Jitters' Completed Journal" }
D[271] = { t = "La vengeance de Vyrin", nv = 20, min = 15, te = "Vyrin's Revenge", av = 258, g = { "Vyrin Vent-vif", "Vyrin Swiftwind", 1432, 83.5, 65.5 }, r = { "Daryl le Jeune", "Daryl the Youngling", 1432, 83.5, 65.5 }, c = { 1432, 37.9, 63.4 }, obj = "Rapporter Tête du vieux Noiraud", oe = "Bring Ol' Sooty's Head" }
D[272] = { t = "L'épreuve du lion de mer", nv = 16, min = 16, te = "Trial of the Sea Lion", g = { "Tajarri", "Tajarri", 1450, 36.5, 40.1 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, obj = "Rapporter Pendentif du lion de mer", oe = "Bring Pendant of the Sea Lion" }
D[273] = { t = "Approvisionnement du site de fouilles", nv = 15, min = 10, te = "Resupplying the Excavation", av = 302, g = { "Jern Casque-à-cornes", "Jern Hornhelm", 1432, 34.6, 44.5 }, r = { "Huldar", "Huldar", 1432, 52.2, 69.3 } }
D[274] = { t = "Une sombre menace se dessine", nv = 18, min = 16, te = "A Dark Threat Looms", av = 161, g = { "Ashlan Rictus-de-pierre", "Ashlan Stonesmirk", 1437, 50, 18.2 }, obj = "Rapporter Colloïde de désamorçage", oe = "Bring Disarming Colloid" }
D[275] = { t = "Fièvre sur le pays", nv = 26, min = 20, te = "Blisters on The Land", av = 277, g = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 }, r = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 }, c = { 1437, 23.4, 31.8 }, obj = "Vaincre 8 × Rampant des tourbières", oe = "Kill 8 × Fen Creeper" }
D[276] = { t = "Piétinements de pattes", nv = 21, min = 20, te = "Tramping Paws", g = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 }, r = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 }, c = { 1437, 62.7, 66 }, obj = "Vaincre 15 × Gnoll Poil-moussu ; Vaincre 10 × Bâtard Poil-moussu", oe = "Kill 15 × Mosshide Gnoll ; Kill 10 × Mosshide Mongrel" }
D[277] = { t = "Feu interdit", nv = 23, min = 20, te = "Fire Taboo", av = 276, g = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 }, r = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 }, c = { 1437, 32.8, 32.8 }, obj = "Rapporter 9 × Silex brut", oe = "Bring 9 × Crude Flint" }
D[278] = { t = "Une sombre menace se dessine", nv = 18, min = 16, te = "A Dark Threat Looms", av = 274, g = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 }, r = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 }, c = { 1432, 77.1, 37.4 }, obj = "Rapporter Venin de rôdeuse ; Rapporter Cristal Mo'grosh ; Rapporter Larme de crocilisque", oe = "Bring Lurker Venom ; Bring Mo'grosh Crystal ; Bring Crocolisk Tear" }
D[279] = { t = "Les griffes des profondeurs", nv = 22, min = 20, te = "Claws from the Deep", g = { "Karl Boran", "Karl Boran", 1437, 8.3, 58.6 }, r = { "Karl Boran", "Karl Boran", 1437, 8.3, 58.6 }, c = { 1437, 16, 40.3 }, obj = "Rapporter Tête d'Enfourneur ; Vaincre 12 × Murloc Branchie-bleue", oe = "Bring Gobbler's Head ; Kill 12 × Bluegill Murloc" }
D[280] = { t = "Une sombre menace se dessine", nv = 18, min = 16, te = "A Dark Threat Looms", av = 278, g = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 }, r = { "Charge explosive", "Explosive Charge", 1432, 50.6, 14.3 }, obj = "Rapporter Mixture de désamorçage", oe = "Bring Disarming Mixture" }
D[281] = { t = "Récupération de marchandises", nv = 25, min = 20, te = "Reclaiming Goods", av = 279, g = { "Karl Boran", "Karl Boran", 1437, 8.3, 58.6 }, r = { "Caisse endommagée", "Damaged Crate", 1437, 13.5, 41.4 } }
D[282] = { t = "Les observations de Senir", nv = 5, min = 1, te = "Senir's Observations", av = 218, g = { "Grelin Blanchebarbe", "Grelin Whitebeard", 1426, 25.1, 75.7 }, r = { "Montagnard Thalos", "Mountaineer Thalos", 1426, 29.7, 71.3 }, obj = "Rapporter Rapport de Grelin", oe = "Bring Grelin's Report" }
D[283] = { t = "Une sombre menace se dessine", nv = 20, min = 16, te = "A Dark Threat Looms", av = 280, g = { "Charge explosive", "Explosive Charge", 1432, 50.6, 14.3 }, r = { "Ingénieur en chef Hinderweir VII", "Chief Engineer Hinderweir VII", 1432, 46, 13.6 } }
D[284] = { t = "La recherche continue", nv = 25, min = 20, te = "The Search Continues", av = 281, g = { "Caisse endommagée", "Damaged Crate", 1437, 13.5, 41.4 }, r = { "Tonneau scellé", "Sealed Barrel", 1437, 13.5, 41.4 } }
D[285] = { t = "À la recherche d'autres taudis", nv = 25, min = 20, te = "Search More Hovels", av = 284, g = { "Tonneau scellé", "Sealed Barrel", 1437, 13.5, 41.4 }, r = { "Tonneau à moitié enseveli", "Half-buried Barrel", 1437, 13.9, 34.8 } }
D[286] = { t = "Rapporter la statuette", nv = 25, min = 20, te = "Return the Statuette", av = 285, g = { "Tonneau à moitié enseveli", "Half-buried Barrel", 1437, 13.9, 34.8 }, r = { "Karl Boran", "Karl Boran", 1437, 8.3, 58.6 }, obj = "Rapporter Statuette de Menethil", oe = "Bring Menethil Statuette" }
D[287] = { t = "Le repaire des Crins-de-Givre", nv = 9, min = 7, te = "Frostmane Hold", av = 420, g = { "Senir Blanchebarbe", "Senir Whitebeard", 1426, 46.7, 53.8 }, r = { "Senir Blanchebarbe", "Senir Whitebeard", 1426, 46.7, 53.8 }, c = { 1426, 23.1, 52.4 }, obj = "Vaincre 5 × Chasseur de têtes Crins-de-givre", oe = "Kill 5 × Frostmane Headhunter" }
D[288] = { t = "La IIIe flotte", nv = 27, min = 22, te = "The Third Fleet", g = { "Second Fitzsimmons", "First Mate Fitzsimmons", 1437, 8.3, 58.6 }, r = { "Second Fitzsimmons", "First Mate Fitzsimmons", 1437, 8.3, 58.6 }, obj = "Rapporter Cruche d’hydromiel nain", oe = "Bring Flagon of Dwarven Honeymead" }
D[289] = { t = "L'équipage maudit", nv = 29, min = 22, te = "The Cursed Crew", av = 288, g = { "Second Fitzsimmons", "First Mate Fitzsimmons", 1437, 8.3, 58.6 }, r = { "Second Fitzsimmons", "First Mate Fitzsimmons", 1437, 8.3, 58.6 }, c = { 1437, 14.4, 27.7 }, obj = "Rapporter Tabatière de Snellig ; Vaincre 13 × Marin maudit ; Vaincre 5 × Soldat de marine maudit", oe = "Bring Snellig's Snuffbox ; Kill 13 × Cursed Sailor ; Kill 5 × Cursed Marine" }
D[290] = { t = "Lever la malédiction", nv = 30, min = 22, te = "Lifting the Curse", av = 289, g = { "Second Fitzsimmons", "First Mate Fitzsimmons", 1437, 8.3, 58.6 }, r = { "Coffre verrouillé de l'Intrépide", "Intrepid's Locked Strongbox", 1437, 14.4, 24 }, c = { 1437, 15.4, 23.6 }, obj = "Rapporter Clé du coffre de l'Intrépide", oe = "Bring Intrepid Strongbox Key" }
D[291] = { t = "Les rapports", nv = 10, min = 1, te = "The Reports", av = 287, g = { "Senir Blanchebarbe", "Senir Whitebeard", 1426, 46.7, 53.8 }, obj = "Rapporter Rapport de Senir", oe = "Bring Senir's Report" }
D[292] = { t = "L'Œil de Paleth", nv = 30, min = 22, te = "The Eye of Paleth", av = 290, g = { "Coffre verrouillé de l'Intrépide", "Intrepid's Locked Strongbox", 1437, 14.4, 24 }, r = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, obj = "Rapporter Oeil maudit de Paleth", oe = "Bring Cursed Eye of Paleth" }
D[293] = { t = "Purifier l'Œil", nv = 30, min = 22, te = "Cleansing the Eye", av = 292, g = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, obj = "Rapporter Oeil maudit de Paleth", oe = "Bring Cursed Eye of Paleth" }
D[294] = { t = "La vengeance d'Ormer", nv = 24, min = 22, te = "Ormer's Revenge", g = { "Ormer Tressefer", "Ormer Ironbraid", 1437, 38.2, 50.9 }, r = { "Ormer Tressefer", "Ormer Ironbraid", 1437, 38.2, 50.9 }, c = { 1437, 24.8, 49 }, obj = "Vaincre 10 × Raptor tacheté ; Vaincre 10 × Hurleur tacheté", oe = "Kill 10 × Mottled Raptor ; Kill 10 × Mottled Screecher" }
D[295] = { t = "La vengeance d'Ormer", nv = 27, min = 22, te = "Ormer's Revenge", av = 294, g = { "Ormer Tressefer", "Ormer Ironbraid", 1437, 38.2, 50.9 }, r = { "Ormer Tressefer", "Ormer Ironbraid", 1437, 38.2, 50.9 }, c = { 1437, 33.5, 47.6 }, obj = "Vaincre 10 × Faucheur tacheté ; Vaincre 10 × Tranchegueule tacheté", oe = "Kill 10 × Mottled Scytheclaw ; Kill 10 × Mottled Razormaw" }
D[296] = { t = "La vengeance d'Ormer", nv = 29, min = 22, te = "Ormer's Revenge", av = 295, g = { "Ormer Tressefer", "Ormer Ironbraid", 1437, 38.2, 50.9 }, r = { "Ormer Tressefer", "Ormer Ironbraid", 1437, 38.2, 50.9 }, c = { 1437, 33.3, 51.5 }, obj = "Rapporter Serre de Grondecroc", oe = "Bring Sarltooth's Talon" }
D[297] = { t = "Réunir les idoles", nv = 18, min = 13, te = "Gathering Idols", g = { "Magmar Tombebranche", "Magmar Fellhew", 1432, 64.9, 66.7 }, r = { "Magmar Tombebranche", "Magmar Fellhew", 1432, 64.9, 66.7 }, c = { 1432, 70.3, 64 }, obj = "Rapporter 8 × Idole de pierre sculptée", oe = "Bring 8 × Carved Stone Idol" }
D[298] = { t = "Compte rendu d'avancement des fouilles", nv = 15, min = 10, te = "Excavation Progress Report", g = { "Prospecteur Baguefer", "Prospector Ironband", 1432, 64.9, 66.7 }, r = { "Jern Casque-à-cornes", "Jern Hornhelm", 1432, 34.6, 44.5 }, obj = "Rapporter Rapport d'état d'Ironband", oe = "Bring Ironband's Progress Report" }
D[299] = { t = "Découverte du passé", nv = 28, min = 25, te = "Uncovering the Past", g = { "Prospecteur Whelgar", "Prospector Whelgar", 1437, 38.2, 50.9 }, r = { "Prospecteur Whelgar", "Prospector Whelgar", 1437, 38.2, 50.9 }, c = { 1437, 34.5, 48.3 }, obj = "Rapporter Fragment Ados ; Rapporter Fragment Modr ; Rapporter Fragment Golm ; Rapporter Fragment Neru", oe = "Bring Ados Fragment ; Bring Modr Fragment ; Bring Golm Fragment ; Bring Neru Fragment" }
D[301] = { t = "Rapport à Forgefer", nv = 15, min = 10, te = "Report to Ironforge", av = 298, g = { "Jern Casque-à-cornes", "Jern Hornhelm", 1432, 34.6, 44.5 }, obj = "Rapporter Rapport d'état d'Ironband", oe = "Bring Ironband's Progress Report" }
D[303] = { t = "La guerre contre les Sombrefers", nv = 30, min = 25, te = "The Dark Iron War", g = { "Motley Garmaçon", "Motley Garmason", 1437, 50, 18.2 }, r = { "Motley Garmaçon", "Motley Garmason", 1437, 50, 18.2 }, c = { 1437, 61.4, 26.1 }, obj = "Vaincre 10 × Nain Sombrefer ; Vaincre 5 × Tunnelier Sombrefer ; Vaincre 5 × Saboteur Sombrefer ; Vaincre 5 × Démolisseur Sombrefer", oe = "Kill 10 × Dark Iron Dwarf ; Kill 5 × Dark Iron Tunneler ; Kill 5 × Dark Iron Saboteur ; Kill 5 × Dark Iron Demolitionist" }
D[304] = { t = "Une tâche sinistre", nv = 34, min = 26, te = "A Grim Task", g = { "Tresse-longue le Macabre", "Longbraid the Grim", 1437, 50, 18.2 }, r = { "Tresse-longue le Macabre", "Longbraid the Grim", 1437, 50, 18.2 }, c = { 1437, 61.3, 26.5 }, obj = "Rapporter Oreille de Balgaras", oe = "Bring Ear of Balgaras" }
D[305] = { t = "À la recherche de l'équipe de fouilles", nv = 24, min = 21, te = "In Search of The Excavation Team", g = { "Tarrel Tisseroche", "Tarrel Rockweaver", 1437, 11.5, 52.2 }, r = { "Merrin Tisseroche", "Merrin Rockweaver", 1437, 38.2, 50.9 } }
D[306] = { t = "À la recherche de l'équipe de fouilles", nv = 24, min = 21, te = "In Search of The Excavation Team", av = 305, g = { "Merrin Tisseroche", "Merrin Rockweaver", 1437, 38.2, 50.9 }, r = { "Tarrel Tisseroche", "Tarrel Rockweaver", 1437, 11.5, 52.2 }, obj = "Rapporter Lettre de Merrin", oe = "Bring Merrin's Letter" }
D[307] = { t = "Bas les pattes !", nv = 15, min = 9, te = "Filthy Paws", g = { "Montagnard foudrepique", "Mountaineer Stormpike", 1432, 24.8, 18.4 }, r = { "Montagnard foudrepique", "Mountaineer Stormpike", 1432, 24.8, 18.4 }, c = { 1432, 35.4, 24.2 }, obj = "Rapporter 4 × Equipement de mineur", oe = "Bring 4 × Miners' Gear" }
D[309] = { t = "Protection de la cargaison", nv = 15, min = 10, te = "Protecting the Shipment", av = 454, g = { "Miran", "Miran", 1432, 52.2, 69.3 }, r = { "Prospecteur Baguefer", "Prospector Ironband", 1432, 64.9, 66.7 } }
D[310] = { t = "Bières rivales", nv = 6, min = 2, te = "Bitter Rivals", g = { "Marleth Brasselorge", "Marleth Barleybrew", 1426, 30.2, 45.5 }, r = { "Tonneau de Tonneblonde non gardé", "Unguarded Thunder Ale Barrel", 1426, 46.7, 53.8 }, obj = "Rapporter Tonneau de Barleybrew Scalder", oe = "Bring Barrel of Barleybrew Scalder" }
D[311] = { t = "Retour chez Marleth", nv = 7, min = 2, te = "Return to Marleth", av = 310, g = { "Tonneau de Tonneblonde non gardé", "Unguarded Thunder Ale Barrel", 1426, 46.7, 53.8 }, r = { "Marleth Brasselorge", "Marleth Barleybrew", 1426, 30.2, 45.5 }, obj = "Rapporter Tonneau de Thunder Ale", oe = "Bring Barrel of Thunder Ale" }
D[312] = { t = "La réserve volée de Tundra MacGrann", nv = 12, min = 7, te = "Tundra MacGrann's Stolen Stash", g = { "Tundra MacGrann", "Tundra MacGrann", 1426, 34.6, 51.7 }, r = { "Tundra MacGrann", "Tundra MacGrann", 1426, 34.6, 51.7 }, c = { 1426, 38.5, 53.9 }, obj = "Rapporter Viande séchée de MacGrann", oe = "Bring MacGrann's Dried Meats" }
D[313] = { t = "Redéploiement stratégique", nv = 7, min = 4, te = "The Grizzled Den", g = { "Pilote Engrepierre", "Pilot Stonegear", 1426, 49.6, 48.6 }, r = { "Pilote Engrepierre", "Pilot Stonegear", 1426, 49.6, 48.6 }, c = { 1426, 40.9, 50.7 }, obj = "Rapporter 8 × Peau de wendigo", oe = "Bring 8 × Wendigo Mane" }
D[314] = { t = "Protection du troupeau", nv = 12, min = 6, te = "Protecting the Herd", g = { "Rudra Distillambre", "Rudra Amberstill", 1426, 63.1, 49.8 }, r = { "Rudra Distillambre", "Rudra Amberstill", 1426, 63.1, 49.8 }, c = { 1426, 62.6, 46 }, obj = "Rapporter Croc de Vagash", oe = "Bring Fang of Vagash" }
D[315] = { t = "La bière brune parfaite", nv = 9, min = 5, te = "The Perfect Stout", g = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 }, r = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 }, c = { 1426, 41.4, 37.9 }, obj = "Rapporter 6 × Chatoyante", oe = "Bring 6 × Shimmerweed" }
D[317] = { t = "Ravitailler le Crache-vapeur", nv = 6, min = 2, te = "Stocking Jetsteam", g = { "Pilote Claquesoufflet", "Pilot Bellowfiz", 1426, 49.6, 48.6 }, r = { "Pilote Claquesoufflet", "Pilot Bellowfiz", 1426, 49.6, 48.6 }, c = { 1426, 43.2, 60.5 }, obj = "Rapporter 4 × Morceau de viande de sanglier ; Rapporter 2 × Fourrure d'ours épaisse", oe = "Bring 4 × Chunk of Boar Meat ; Bring 2 × Thick Bear Fur" }
D[318] = { t = "L’éternol", nv = 7, min = 2, te = "Evershine", av = 317, g = { "Pilote Claquesoufflet", "Pilot Bellowfiz", 1426, 49.6, 48.6 }, r = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 } }
D[319] = { t = "Une faveur pour un tonneau d’éternol", nv = 8, min = 2, te = "A Favor for Evershine", av = 318, g = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 }, r = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 }, c = { 1426, 37, 33.9 }, obj = "Vaincre 6 × Ours Griffeglace ; Vaincre 8 × Ancien sanglier des rochers ; Vaincre 8 × Léopard des neiges", oe = "Kill 6 × Ice Claw Bear ; Kill 8 × Elder Crag Boar ; Kill 8 × Snow Leopard" }
D[320] = { t = "Retour vers Claquesoufflet", nv = 8, min = 2, te = "Return to Bellowfiz", av = 319, g = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 }, r = { "Pilote Claquesoufflet", "Pilot Bellowfiz", 1426, 49.6, 48.6 }, obj = "Rapporter Tonneau d'Evershine", oe = "Bring Cask of Evershine" }
D[321] = { t = "Le fer de sancteforge", nv = 29, min = 20, te = "Lightforge Iron", av = 270, g = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, r = { "Coffre détrempé", "Waterlogged Chest", 1437, 12.1, 64.2 } }
D[322] = { t = "Béni soit ce bras", nv = 29, min = 20, te = "Blessed Arm", av = 324, g = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, obj = "Rapporter Caisse de lingots de sancteforge", oe = "Bring Crate of Lightforge Ingots" }
D[323] = { t = "Prouver votre valeur", nv = 28, min = 20, te = "Proving Your Worth", av = 268, g = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, r = { "Sven Yorgen", "Sven Yorgen", 1431, 7.8, 34.1 }, c = { 1431, 16.1, 35.7 }, obj = "Vaincre 15 × Ecumeur squelette ; Vaincre 3 × Soigneur squelette ; Vaincre 3 × Gardien squelette", oe = "Kill 15 × Skeletal Raider ; Kill 3 × Skeletal Healer ; Kill 3 × Skeletal Warder" }
D[324] = { t = "Les lingots perdus", nv = 29, min = 20, te = "The Lost Ingots", av = 321, g = { "Coffre détrempé", "Waterlogged Chest", 1437, 12.1, 64.2 }, r = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, c = { 1437, 24.4, 16.9 }, obj = "Rapporter 5 × Lingot de sancteforge", oe = "Bring 5 × Lightforge Ingot" }
D[328] = { t = "La clé cachée", nv = 37, min = 30, te = "The Hidden Key", av = 200, g = { "Archives d'Hérode la Paperasse", "Bookie Herod's Records", 1434, 43.7, 9.4 }, r = { "Coffre-fort d'Hérode la Paperasse", "Bookie Herod's Strongbox", 1434, 49.6, 7.6 }, obj = "Rapporter Petite clé en cuivre", oe = "Bring Small Brass Key" }
D[329] = { t = "L'espion découvert !", nv = 37, min = 30, te = "The Spy Revealed!", av = 328, g = { "Coffre-fort d'Hérode la Paperasse", "Bookie Herod's Strongbox", 1434, 49.6, 7.6 }, r = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 }, obj = "Rapporter Note maculée de boue", oe = "Bring Muddy Note" }
D[330] = { t = "Composition des patrouilles", nv = 37, min = 30, te = "Patrol Schedules", av = 329, g = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 }, r = { "Caporal Sethman", "Corporal Sethman", 1434, 38, 3.4 } }
D[331] = { t = "Rapport au lieutenant Doren", nv = 37, min = 30, te = "Report to Doren", av = 330, g = { "Caporal Sethman", "Corporal Sethman", 1434, 38, 3.4 }, r = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 } }
D[338] = { t = "« Les vertes collines de Strangleronce »", nv = 40, min = 30, te = "The Green Hills of Stranglethorn", av = 583, g = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, r = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, obj = "Rapporter Les vertes collines de Strangleronce - Chapitre I ; Rapporter Les vertes collines de Strangleronce - Chapitre II ; Rapporter Les vertes collines de Strangleronce - Chapitre III ; Rapporter Les vertes collines de Strangleronce - Chapitre IV", oe = "Bring Green Hills of Stranglethorn - Chapter I ; Bring Green Hills of Stranglethorn - Chapter II ; Bring Green Hills of Stranglethorn - Chapter III ; Bring Green Hills of Stranglethorn - Chapter IV" }
D[339] = { t = "Chapitre I", nv = 40, min = 30, te = "Chapter I", g = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, r = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, obj = "Rapporter Les vertes collines de Strangleronce - Page 1 ; Rapporter Les vertes collines de Strangleronce - Page 4 ; Rapporter Les vertes collines de Strangleronce - Page 6 ; Rapporter Les vertes collines de Strangleronce - Page 8", oe = "Bring Green Hills of Stranglethorn - Page 1 ; Bring Green Hills of Stranglethorn - Page 4 ; Bring Green Hills of Stranglethorn - Page 6 ; Bring Green Hills of Stranglethorn - Page 8" }
D[340] = { t = "Chapitre II", nv = 40, min = 30, te = "Chapter II", g = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, r = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, obj = "Rapporter Les vertes collines de Strangleronce - Page 10 ; Rapporter Les vertes collines de Strangleronce - Page 11 ; Rapporter Les vertes collines de Strangleronce - Page 14 ; Rapporter Les vertes collines de Strangleronce - Page 16", oe = "Bring Green Hills of Stranglethorn - Page 10 ; Bring Green Hills of Stranglethorn - Page 11 ; Bring Green Hills of Stranglethorn - Page 14 ; Bring Green Hills of Stranglethorn - Page 16" }
D[341] = { t = "Chapitre III", nv = 40, min = 30, te = "Chapter III", g = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, r = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, obj = "Rapporter Les vertes collines de Strangleronce - Page 18 ; Rapporter Les vertes collines de Strangleronce - Page 20 ; Rapporter Les vertes collines de Strangleronce - Page 21 ; Rapporter Les vertes collines de Strangleronce - Page 24", oe = "Bring Green Hills of Stranglethorn - Page 18 ; Bring Green Hills of Stranglethorn - Page 20 ; Bring Green Hills of Stranglethorn - Page 21 ; Bring Green Hills of Stranglethorn - Page 24" }
D[342] = { t = "Chapitre IV", nv = 40, min = 30, te = "Chapter IV", g = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, r = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, obj = "Rapporter Les vertes collines de Strangleronce - Page 25 ; Rapporter Les vertes collines de Strangleronce - Page 26 ; Rapporter Les vertes collines de Strangleronce - Page 27", oe = "Bring Green Hills of Stranglethorn - Page 25 ; Bring Green Hills of Stranglethorn - Page 26 ; Bring Green Hills of Stranglethorn - Page 27" }
D[347] = { t = "Minerai de rethban", nv = 24, min = 20, te = "Rethban Ore", av = 345, g = { "Contremaître Oslow", "Foreman Oslow", 1433, 28.4, 49 }, c = { 1433, 14.5, 19.7 }, obj = "Rapporter 5 × Minerai de rethban", oe = "Bring 5 × Rethban Ore" }
D[348] = { t = "La fièvre de Strangleronce", nv = 45, min = 40, te = "Stranglethorn Fever", g = { "Fin Bulboucan", "Fin Fizracket", 1434, 27, 77.1 }, r = { "Fin Bulboucan", "Fin Fizracket", 1434, 27, 77.1 }, obj = "Rapporter Coeur de Mokk", oe = "Bring Heart of Mokk" }
D[354] = { t = "Morts dans la Famille", nv = 11, min = 7, te = "Deaths in the Family", g = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, r = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, c = { 1420, 46.8, 33.1 }, obj = "Rapporter Cadavre de Gregor ; Rapporter Cadavre de Nissa ; Rapporter Cadavre de Thurman", oe = "Bring Gregor's Remains ; Bring Nissa's Remains ; Bring Thurman's Remains" }
D[355] = { t = "Parler à Sevren", nv = 10, min = 7, te = "Speak with Sevren", av = 354, g = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, r = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 } }
D[356] = { t = "Patrouille d'arrière-garde", nv = 11, min = 6, te = "Rear Guard Patrol", g = { "Nécrogarde Linnea", "Deathguard Linnea", 1420, 65.5, 60.3 }, r = { "Nécrogarde Linnea", "Deathguard Linnea", 1420, 65.5, 60.3 }, c = { 1420, 76, 61.2 }, obj = "Vaincre 8 × Horreur sanguinolente ; Vaincre 8 × Esprit vagabond", oe = "Kill 8 × Bleeding Horror ; Kill 8 × Wandering Spirit" }
D[358] = { t = "Les profanateurs", nv = 8, min = 4, te = "Graverobbers", g = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, r = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, c = { 1420, 57.3, 39.5 }, obj = "Rapporter 8 × Ichor d'embaumement ; Vaincre 8 × Profanateur Poil-Putride ; Vaincre 5 × Bâtard Poil-Putride", oe = "Bring 8 × Embalming Ichor ; Kill 8 × Rot Hide Graverobber ; Kill 5 × Rot Hide Mongrel" }
D[359] = { t = "En mission pour les Réprouvés", nv = 9, min = 6, te = "Forsaken Duties", av = 358, g = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, r = { "Nécrogarde Linnea", "Deathguard Linnea", 1420, 65.5, 60.3 } }
D[360] = { t = "Retourner voir le Magistrat", nv = 9, min = 6, te = "Return to the Magistrate", av = 359, g = { "Nécrogarde Linnea", "Deathguard Linnea", 1420, 65.5, 60.3 }, r = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 } }
D[362] = { t = "Les moulins hantés", nv = 10, min = 7, te = "The Haunted Mills", g = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, r = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, c = { 1420, 47.3, 40.8 }, obj = "Rapporter Cadavre de Devlin", oe = "Bring Devlin's Remains" }
D[363] = { t = "Réveil brutal", nv = 1, min = 1, te = "Rude Awakening", g = { "Fossoyeur Mordo", "Undertaker Mordo", 1420, 30.2, 71.7 }, r = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 } }
D[364] = { t = "Les Sans-esprit", nv = 2, min = 1, te = "The Mindless Ones", g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, c = { 1420, 32.8, 63 }, obj = "Vaincre 8 × Zombie décérébré ; Vaincre 8 × Goule déshéritée", oe = "Kill 8 × Mindless Zombie ; Kill 8 × Wretched Zombie" }
D[365] = { t = "Les champs du Chagrin", nv = 7, min = 4, te = "Fields of Grief", g = { "Nécrogarde Simmer", "Deathguard Simmer", 1420, 38.2, 56.8 }, r = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, c = { 1420, 35.1, 50 }, obj = "Rapporter 10 × Potiron de Tirisfal", oe = "Bring 10 × Tirisfal Pumpkin" }
D[367] = { t = "Une peste nouvelle", nv = 6, min = 6, te = "A New Plague", g = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, r = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, c = { 1420, 40.1, 44.1 }, obj = "Rapporter 5 × Sang de sombredogue", oe = "Bring 5 × Darkhound Blood" }
D[368] = { t = "Une peste nouvelle", nv = 9, min = 6, te = "A New Plague", av = 367, g = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, r = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, c = { 1420, 35, 40.7 }, obj = "Rapporter 5 × Ecaille d'Aileron noir", oe = "Bring 5 × Vile Fin Scale" }
D[369] = { t = "Une peste nouvelle", nv = 11, min = 6, te = "A New Plague", av = 368, g = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, r = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, c = { 1420, 86.8, 52.4 }, obj = "Rapporter 4 × Venin de Tisse-nuit vicieuse", oe = "Bring 4 × Vicious Night Web Spider Venom" }
D[370] = { t = "En guerre avec la Croisade écarlate", nv = 9, min = 5, te = "At War With The Scarlet Crusade", av = 427, g = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, r = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, c = { 1420, 79, 55.8 }, obj = "Vaincre Capitaine Perrine ; Vaincre 3 × Zélote écarlate ; Vaincre 3 × Missionnaire écarlate", oe = "Kill Captain Perrine ; Kill 3 × Scarlet Zealot ; Kill 3 × Scarlet Missionary" }
D[371] = { t = "En guerre avec la Croisade écarlate", nv = 10, min = 5, te = "At War With The Scarlet Crusade", av = 370, g = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, r = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, c = { 1420, 79.2, 55.6 }, obj = "Vaincre Capitaine Vachon ; Vaincre 5 × Frère écarlate", oe = "Kill Captain Vachon ; Kill 5 × Scarlet Friar" }
D[372] = { t = "En guerre avec la Croisade écarlate", nv = 12, min = 5, te = "At War With The Scarlet Crusade", av = 371, g = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, r = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, c = { 1420, 79.5, 25.1 }, obj = "Vaincre Capitaine Melrache ; Vaincre 2 × Garde du corps écarlate", oe = "Kill Captain Melrache ; Kill 2 × Scarlet Bodyguard" }
D[374] = { t = "Preuves de la mort", nv = 7, min = 5, te = "Proof of Demise", av = 427, g = { "Nécrogarde Burgess", "Deathguard Burgess", 1420, 61.7, 52 }, r = { "Nécrogarde Burgess", "Deathguard Burgess", 1420, 61.7, 52 }, c = { 1420, 33, 48.5 }, obj = "Rapporter 10 × Anneau de la Croisade écarlate", oe = "Bring 10 × Scarlet Insignia Ring" }
D[375] = { t = "Le frisson de la mort", nv = 8, min = 7, te = "The Chill of Death", g = { "Gretchen Dedmar", "Gretchen Dedmar", 1420, 61.7, 52 }, r = { "Gretchen Dedmar", "Gretchen Dedmar", 1420, 61.7, 52 }, c = { 1420, 63.3, 40.7 }, obj = "Rapporter 5 × Peau de chauve-souris du crépuscule ; Rapporter Bobine de fil grossier", oe = "Bring 5 × Duskbat Pelt ; Bring Coarse Thread" }
D[376] = { t = "Les Maudits", nv = 2, min = 2, te = "The Damned", g = { "Novice Elreth", "Novice Elreth", 1420, 30.8, 66.2 }, r = { "Novice Elreth", "Novice Elreth", 1420, 30.8, 66.2 }, c = { 1420, 32.8, 64.9 }, obj = "Rapporter 6 × Patte de charognard ; Rapporter 6 × Aile de chauve-souris du crépuscule", oe = "Bring 6 × Scavenger Paw ; Bring 6 × Duskbat Wing" }
D[379] = { t = "Etancher cette soif", nv = 46, min = 38, te = "Slake That Thirst", av = 243, g = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, r = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, c = { 1446, 62.7, 35.5 }, obj = "Rapporter 5 × Outre de Bat-le-désert", oe = "Bring 5 × Wastewander Water Pouch" }
D[380] = { t = "Les grottes des Tisse-nuit", nv = 4, min = 2, te = "Night Web's Hollow", av = 376, g = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, r = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, c = { 1420, 27.2, 58.4 }, obj = "Vaincre 10 × Jeune Tisse-nuit ; Vaincre 8 × Araignée Tisse-nuit", oe = "Kill 10 × Young Night Web Spider ; Kill 8 × Night Web Spider" }
D[381] = { t = "La Croisade écarlate", nv = 4, min = 2, te = "The Scarlet Crusade", av = 380, g = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, r = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, c = { 1420, 37.4, 66.5 }, obj = "Rapporter 12 × Bracelets écarlates", oe = "Bring 12 × Scarlet Armband" }
D[382] = { t = "Le messager rouge", nv = 5, min = 2, te = "The Red Messenger", av = 381, g = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, r = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, c = { 1420, 36.6, 68.5 }, obj = "Rapporter Documents de la Croisade écarlate", oe = "Bring Scarlet Crusade Documents" }
D[383] = { t = "Informations décisives", nv = 5, min = 2, te = "Vital Intelligence", av = 382, g = { "Exécuteur Arren", "Executor Arren", 1420, 30.8, 66.2 }, r = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, c = { 1420, 36.6, 68.5 }, obj = "Rapporter Documents de la Croisade écarlate", oe = "Bring Scarlet Crusade Documents" }
D[384] = { t = "Côtes de sanglier à la bière", nv = 7, min = 5, te = "Beer Basted Boar Ribs", g = { "Ragnar Tonnebière", "Ragnar Thunderbrew", 1426, 46.7, 53.8 }, r = { "Ragnar Tonnebière", "Ragnar Thunderbrew", 1426, 46.7, 53.8 }, c = { 1426, 43.2, 60.5 }, obj = "Rapporter 6 × Côtes de sanglier des rochers ; Rapporter Bière au malt Rhapsody", oe = "Bring 6 × Crag Boar Rib ; Bring Rhapsody Malt" }
D[385] = { t = "Chasse aux crocilisques", nv = 15, min = 10, te = "Crocolisk Hunting", g = { "Marek Cœur-de-fer", "Marek Ironheart", 1432, 81.8, 61.7 }, r = { "Marek Cœur-de-fer", "Marek Ironheart", 1432, 81.8, 61.7 }, c = { 1432, 56.8, 37.5 }, obj = "Rapporter 5 × Viande de crocilisque ; Rapporter 6 × Peau de crocilisque", oe = "Bring 5 × Crocolisk Meat ; Bring 6 × Crocolisk Skin" }
D[397] = { t = "Vous nous avez bien servi", nv = 30, min = 25, te = "You Have Served Us Well", g = { "Zardeth de la Griffe noire", "Zardeth of the Black Claw", 1453, 40.1, 85.3 }, r = { "Zggi", "Zggi", 1453, 40.2, 85.3 } }
D[398] = { t = "On recherche : Œil-de-ver", nv = 10, min = 6, te = "Wanted: Maggot Eye", g = { "Wanted!", "Wanted!", 1420, 61.7, 52 }, r = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, c = { 1420, 58.7, 30.8 }, obj = "Rapporter Patte d'Oeil-de-ver", oe = "Bring Maggot Eye's Paw" }
D[400] = { t = "Des outils pour Grillacier", nv = 5, min = 2, te = "Tools for Steelgrill", g = { "Tharek Noirepierre", "Tharek Blackstone", 1426, 46.7, 53.8 }, r = { "Beldin Grillacier", "Beldin Steelgrill", 1426, 49.6, 48.6 }, obj = "Rapporter Outils de Steelgrill", oe = "Bring Steelgrill's Tools" }
D[401] = { t = "Attendre la fin des travaux de Sirra", nv = 30, min = 20, te = "Wait for Sirra to Finish", av = 251, g = { "Sirra Von'Indi", "Sirra Von'Indi", 1431, 75.3, 48.7 }, r = { "Sirra Von'Indi", "Sirra Von'Indi", 1431, 75.3, 48.7 } }
D[404] = { t = "Une tâche putride", nv = 6, min = 4, te = "A Putrid Task", g = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, r = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, c = { 1420, 53.3, 52.3 }, obj = "Rapporter 7 × Griffe putride", oe = "Bring 7 × Putrid Claw" }
D[405] = { t = "La liche prodigue", nv = 8, min = 5, te = "The Prodigal Lich", av = 358, g = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, obj = "Rapporter Ordres de Sevren", oe = "Bring Sevren's Orders" }
D[407] = { t = "Les champs du Chagrin", nv = 7, min = 4, te = "Fields of Grief", av = 365, g = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, r = { "Zélote écarlate capturé", "Captured Scarlet Zealot", 1420, 61.7, 52 }, obj = "Rapporter Potiron arrosé", oe = "Bring Laced Pumpkin" }
D[408] = { t = "La crypte familiale", nv = 13, min = 7, te = "The Family Crypt", av = 355, g = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, r = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, c = { 1420, 51.5, 29.8 }, obj = "Rapporter Crâne de Dargol ; Vaincre 8 × Ancêtre gémissante ; Vaincre 8 × Ancêtre pourrissant", oe = "Bring Dargol's Skull ; Kill 8 × Wailing Ancestor ; Kill 8 × Rotting Ancestor" }
D[409] = { t = "Prouver l'allégeance", nv = 12, min = 5, te = "Proving Allegiance", av = 366, g = { "Gunther Arcanus", "Gunther Arcanus", 1420, 68.2, 41.9 }, r = { "Gunther Arcanus", "Gunther Arcanus", 1420, 68.2, 41.9 }, obj = "Vaincre Lillith Nefara", oe = "Kill Lillith Nefara" }
D[411] = { t = "Le retour de la liche prodigue", nv = 12, min = 5, te = "The Prodigal Lich Returns", av = 409, g = { "Gunther Arcanus", "Gunther Arcanus", 1420, 68.2, 41.9 }, obj = "Rapporter Gemme du Néant", oe = "Bring Nether Gem" }
D[412] = { t = "Opération Recombobulation", nv = 10, min = 7, te = "Operation Recombobulation", g = { "Esbrouf Fulgurouage", "Razzle Sprysprocket", 1426, 49.6, 48.6 }, r = { "Esbrouf Fulgurouage", "Razzle Sprysprocket", 1426, 49.6, 48.6 }, c = { 1426, 26, 40.7 }, obj = "Rapporter 8 × Rouage de rééquilibrage ; Rapporter 8 × Engrenage gyromécanique", oe = "Bring 8 × Restabilization Cog ; Bring 8 × Gyromechanic Gear" }
D[413] = { t = "La Brune scintillante", nv = 10, min = 8, te = "Shimmer Stout", av = 315, g = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 }, r = { "Montagnard Brasselorge", "Mountaineer Barleybrew", 1426, 86.3, 48.8 }, obj = "Rapporter Tonneau de Shimmer Stout", oe = "Bring Barrel of Shimmer Stout" }
D[414] = { t = "Une bière brune pour Kadrell", nv = 10, min = 8, te = "Stout to Kadrell", av = 413, g = { "Montagnard Brasselorge", "Mountaineer Barleybrew", 1426, 86.3, 48.8 }, obj = "Rapporter Bidon de Shimmer Stout", oe = "Bring Cask of Shimmer Stout" }
D[415] = { t = "La nouvelle cuvée de Rejold", nv = 10, min = 8, te = "Rejold's New Brew", g = { "Tharek Noirepierre", "Tharek Blackstone", 1426, 46.7, 53.8 }, r = { "Rejold Brasselorge", "Rejold Barleybrew", 1426, 30.2, 45.5 } }
D[416] = { t = "Chasse au rat", nv = 11, min = 10, te = "Rat Catching", g = { "Montagnard Kadrell", "Mountaineer Kadrell", 1432, 34.6, 44.5 }, r = { "Montagnard Kadrell", "Mountaineer Kadrell", 1432, 34.6, 44.5 }, c = { 1432, 37.7, 16.2 }, obj = "Rapporter 12 × Oreille de Rat des tunnels", oe = "Bring 12 × Tunnel Rat Ear" }
D[417] = { t = "La revanche du pilote", nv = 11, min = 8, te = "A Pilot's Revenge", av = 419, g = { "Un cadavre de nain", "A Dwarven Corpse", 1432, 4.6, 31.4 }, c = { 1432, 2.2, 34.2 }, obj = "Rapporter Griffe galeuse ; Rapporter Journal d'Hildelve", oe = "Bring Mangy Claw ; Bring Hildelve's Journal" }
D[418] = { t = "Les boudins de Thelsamar", nv = 11, min = 7, te = "Thelsamar Blood Sausages", g = { "Vidra Poêlâtre", "Vidra Hearthstove", 1432, 34.8, 49.3 }, r = { "Vidra Poêlâtre", "Vidra Hearthstove", 1432, 34.8, 49.3 }, c = { 1432, 34.9, 34.8 }, obj = "Rapporter 3 × Tripes de sanglier ; Rapporter 3 × Viande d'ours ; Rapporter 3 × Ichor d'araignée", oe = "Bring 3 × Boar Intestines ; Bring 3 × Bear Meat ; Bring 3 × Spider Ichor" }
D[419] = { t = "Le pilote perdu", nv = 10, min = 8, te = "The Lost Pilot", g = { "Pilote Martèlepied", "Pilot Hammerfoot", 1426, 83.9, 39.2 } }
D[420] = { t = "Les observations de Senir", nv = 5, min = 1, te = "Senir's Observations", av = 282, g = { "Montagnard Thalos", "Mountaineer Thalos", 1426, 29.7, 71.3 }, r = { "Senir Blanchebarbe", "Senir Whitebeard", 1426, 46.7, 53.8 }, obj = "Rapporter Rapport de Grelin", oe = "Bring Grelin's Report" }
D[421] = { t = "Prouver votre valeur", nv = 10, min = 9, te = "Prove Your Worth", g = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, r = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, c = { 1421, 50.6, 39 }, obj = "Vaincre 5 × Poil-blanc Ragelune", oe = "Kill 5 × Moonrage Whitescalp" }
D[422] = { t = "La folie d'Arugal", nv = 11, min = 9, te = "Arugal's Folly", av = 421, g = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, r = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, c = { 1421, 52.8, 28.6 }, obj = "Rapporter Remède d'Arugal", oe = "Bring Remedy of Arugal" }
D[423] = { t = "La folie d'Arugal", nv = 14, min = 9, te = "Arugal's Folly", av = 422, g = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, r = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, c = { 1421, 41.2, 27.4 }, obj = "Rapporter 6 × Bracelet de Glouton ; Rapporter 3 × Bracelet de Ténébreux", oe = "Bring 6 × Glutton Shackle ; Bring 3 × Darksoul Shackle" }
D[424] = { t = "La folie d'Arugal", nv = 15, min = 9, te = "Arugal's Folly", av = 423, g = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, r = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, c = { 1421, 58.6, 44.9 }, obj = "Rapporter Tête de Grimson", oe = "Bring Head of Grimson" }
D[425] = { t = "Ivar l'Infect", nv = 12, min = 10, te = "Ivar the Foul", av = 430, g = { "Rane Yorick", "Rane Yorick", 1421, 53.5, 13.4 }, r = { "Rane Yorick", "Rane Yorick", 1421, 53.5, 13.4 }, c = { 1421, 51.5, 13.9 }, obj = "Rapporter Tête d'Ivar", oe = "Bring Ivar's Head" }
D[426] = { t = "La chute des moulins", nv = 8, min = 6, te = "The Mills Overrun", av = 404, g = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, r = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, c = { 1420, 46.5, 35.2 }, obj = "Rapporter 5 × Côtes ébréchées ; Rapporter 3 × Crâne noirci", oe = "Bring 5 × Notched Rib ; Bring 3 × Blackened Skull" }
D[427] = { t = "En guerre avec la Croisade écarlate", nv = 8, min = 5, te = "At War With The Scarlet Crusade", av = 383, g = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, r = { "Exécuteur Zygand", "Executor Zygand", 1420, 61.7, 52 }, c = { 1420, 33, 48.5 }, obj = "Vaincre 10 × Guerrier écarlate", oe = "Kill 10 × Scarlet Warrior" }
D[428] = { t = "Les nécrotraqueurs égarés", nv = 12, min = 10, te = "Lost Deathstalkers", g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, r = { "Rane Yorick", "Rane Yorick", 1421, 53.5, 13.4 } }
D[429] = { t = "Cœurs sauvages", nv = 11, min = 10, te = "Wild Hearts", g = { "Rane Yorick", "Rane Yorick", 1421, 53.5, 13.4 }, r = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, c = { 1421, 56.1, 13 }, obj = "Rapporter 6 × Coeur de worg décoloré", oe = "Bring 6 × Discolored Worg Heart" }
D[430] = { t = "Retour vers Quinn", nv = 11, min = 10, te = "Return to Quinn", av = 429, g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, r = { "Quinn Yorick", "Quinn Yorick", 1421, 53.5, 13.4 }, obj = "Rapporter Potion de Quinn mineure", oe = "Bring Minor Quinn's Potion" }
D[432] = { t = "Ces satanés troggs !", nv = 9, min = 5, te = "Those Blasted Troggs!", g = { "Contremaître Front-de-pierre", "Foreman Stonebrow", 1426, 69.1, 56.3 }, r = { "Contremaître Front-de-pierre", "Foreman Stonebrow", 1426, 69.1, 56.3 }, c = { 1426, 70.1, 55.6 }, obj = "Vaincre 6 × Brise-crâne Mâcheroc", oe = "Kill 6 × Rockjaw Skullthumper" }
D[433] = { t = "Le serviteur public", nv = 11, min = 6, te = "The Public Servant", g = { "Sénateur Mehr Sacrepierre", "Senator Mehr Stonehallow", 1426, 69.1, 56.3 }, r = { "Sénateur Mehr Sacrepierre", "Senator Mehr Stonehallow", 1426, 69.1, 56.3 }, c = { 1426, 74.9, 56.3 }, obj = "Vaincre 10 × Briseur d'os Mâcheroc", oe = "Kill 10 × Rockjaw Bonesnapper" }
D[435] = { t = "Une escorte pour Erland", nv = 11, min = 10, te = "Escorting Erland", g = { "Nécrotraqueur Erland", "Deathstalker Erland", 1421, 56.2, 9.2 }, r = { "Rane Yorick", "Rane Yorick", 1421, 53.5, 13.4 } }
D[436] = { t = "Les fouilles de Baguefer", nv = 18, min = 13, te = "Ironband's Excavation", g = { "Jern Casque-à-cornes", "Jern Hornhelm", 1432, 34.6, 44.5 }, r = { "Magmar Tombebranche", "Magmar Fellhew", 1432, 64.9, 66.7 } }
D[437] = { t = "Le Champ des morts", nv = 14, min = 10, te = "The Dead Fields", g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, r = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, obj = "Rapporter Essence de Cinglenuit", oe = "Bring Essence of Nightlash" }
D[438] = { t = "Le bac délabré", nv = 16, min = 10, te = "The Decrepit Ferry", av = 437, g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, r = { "Corpse Laden Boat", "Corpse Laden Boat", 1421, 58.4, 34.9 } }
D[439] = { t = "Un indice vers les Poil-putride", nv = 16, min = 10, te = "Rot Hide Clues", av = 438, g = { "Corpse Laden Boat", "Corpse Laden Boat", 1421, 58.4, 34.9 }, r = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, obj = "Rapporter Anneau de Deliah", oe = "Bring Deliah's Ring" }
D[440] = { t = "La bague ciselée", nv = 16, min = 10, te = "The Engraved Ring", av = 439, g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, obj = "Rapporter Anneau de Deliah", oe = "Bring Deliah's Ring" }
D[441] = { t = "Raleigh et Fossoyeuse", nv = 16, min = 10, te = "Raleigh and the Undercity", av = 440, g = { "Magistrat Sevren", "Magistrate Sevren", 1420, 61.7, 52 }, obj = "Rapporter Anneau de Deliah", oe = "Bring Deliah's Ring" }
D[442] = { t = "L'attaque de l'île de Fenris", nv = 24, min = 10, te = "Assault on Fenris Isle", av = 448, g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, r = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, c = { 1421, 65.7, 23.7 }, obj = "Rapporter Tête de Thule", oe = "Bring Thule's Head" }
D[443] = { t = "L'ichor de Poil-putride", nv = 17, min = 10, te = "Rot Hide Ichor", av = 438, g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, r = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, c = { 1421, 67.1, 30.4 }, obj = "Rapporter 8 × Ichor de Poil-putride", oe = "Bring 8 × Rot Hide Ichor" }
D[444] = { t = "L'origine des Poil-putride", nv = 17, min = 10, te = "Rot Hide Origins", av = 443, g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, obj = "Rapporter Echantillon d'ichor", oe = "Bring Sample Ichor" }
D[445] = { t = "Livraison dans la forêt des Pins-Argentés", nv = 10, min = 9, te = "Delivery to Silverpine Forest", g = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, obj = "Rapporter Les découvertes de Johaan", oe = "Bring Johaan's Findings" }
D[447] = { t = "Une recette mortelle", nv = 12, min = 9, te = "A Recipe For Death", g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, c = { 1421, 43.4, 18.7 }, obj = "Rapporter 6 × Coeur de vieil ours ; Rapporter 6 × Sang du Grouillement", oe = "Bring 6 × Grizzled Bear Heart ; Bring 6 × Skittering Blood" }
D[448] = { t = "Un rapport pour Hadrec", nv = 16, min = 10, te = "Report to Hadrec", av = 446, g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, r = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 } }
D[449] = { t = "Le rapport des nécrotraqueurs", nv = 11, min = 10, te = "The Deathstalkers' Report", av = 435, g = { "Rane Yorick", "Rane Yorick", 1421, 53.5, 13.4 }, r = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, obj = "Rapporter Rapport du Traqueur noir", oe = "Bring Deathstalker Report" }
D[451] = { t = "Une recette mortelle", nv = 18, min = 9, te = "A Recipe For Death", av = 450, g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, c = { 1421, 75, 22 }, obj = "Rapporter 6 × Mousse de Furtif du lac ; Rapporter 6 × Mousse de Rampant du lac ; Rapporter Tumeur durcie", oe = "Bring 6 × Lake Skulker Moss ; Bring 6 × Lake Creeper Moss ; Bring Hardened Tumor" }
D[452] = { t = "Embuscade à Bois-du-Bûcher", nv = 15, min = 12, te = "Pyrewood Ambush", g = { "Nécrotraqueuse Faerleia", "Deathstalker Faerleia", 1421, 46.5, 74.4 }, r = { "Nécrotraqueuse Faerleia", "Deathstalker Faerleia", 1421, 46.5, 74.4 } }
D[453] = { t = "À la recherche de la silhouette mystérieuse", nv = 25, min = 20, te = "Finding the Shadowy Figure", av = 266, g = { "Smitts l'aubergiste", "Tavernkeep Smitts", 1431, 73.8, 43.5 }, r = { "La Tremblote", "Jitters", 1431, 18.4, 56.4 }, obj = "Rapporter Livre de la ferme de Sven", oe = "Bring Book from Sven's Farm" }
D[454] = { t = "Après l'embuscade", nv = 15, min = 10, te = "After the Ambush", av = 273, g = { "Huldar", "Huldar", 1432, 52.2, 69.3 }, r = { "Miran", "Miran", 1432, 52.2, 69.3 } }
D[455] = { t = "Le défi d'Algaz", nv = 21, min = 19, te = "The Algaz Gauntlet", g = { "Montagnard Rochegar", "Mountaineer Rockgar", 1432, 25.4, 10.4 }, obj = "Vaincre 8 × Eclaireur Gueule-de-dragon ; Vaincre 6 × Grunt Gueule-de-dragon", oe = "Kill 8 × Dragonmaw Scout ; Kill 6 × Dragonmaw Grunt" }
D[456] = { t = "L'équilibre de la nature", nv = 2, min = 1, te = "The Balance of Nature", g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, c = { 1438, 60.1, 42.6 }, obj = "Vaincre 7 × Jeune sabre-de-nuit ; Vaincre 4 × Jeune sanglier des chardons", oe = "Kill 7 × Young Nightsaber ; Kill 4 × Young Thistle Boar" }
D[457] = { t = "Le dû de la nature", nv = 3, min = 1, te = "The Balance of Nature", av = 456, g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, c = { 1438, 59.6, 36.4 }, obj = "Vaincre 7 × Sabre-de-nuit galeux ; Vaincre 7 × Sanglier des chardons", oe = "Kill 7 × Mangy Nightsaber ; Kill 7 × Thistle Boar" }
D[458] = { t = "La protectrice sylvestre", nv = 1, min = 1, te = "The Woodland Protector", g = { "Melithar Forteramure", "Melithar Staghelm", 1438, 58.7, 44.3 }, r = { "Tarindrella", "Tarindrella", 1438, 58.7, 44.3 } }
D[459] = { t = "Les démons voleurs", nv = 3, min = 1, te = "The Woodland Protector", av = 458, g = { "Tarindrella", "Tarindrella", 1438, 58.7, 44.3 }, r = { "Tarindrella", "Tarindrella", 1438, 58.7, 44.3 }, c = { 1438, 57, 38.4 }, obj = "Rapporter 8 × Gangremousse", oe = "Bring 8 × Fel Moss" }
D[461] = { t = "L’alcôve secrète", nv = 18, min = 12, te = "The Hidden Niche", av = 460, g = { "Shallow Grave", "Shallow Grave", 1421, 67.9, 24.9 }, r = { "Étagère poussiéreuse", "Dusty Shelf", 1421, 67.9, 24.9 }, obj = "Rapporter Cadavre d'Alaric", oe = "Bring Alaric's Remains" }
D[463] = { t = "Le Gardien vert", nv = 21, min = 20, te = "The Greenwarden", g = { "Second Fitzsimmons", "First Mate Fitzsimmons", 1437, 8.3, 58.6 }, r = { "Rethiel le Gouverneur vert", "Rethiel the Greenwarden", 1437, 56.4, 40.4 } }
D[464] = { t = "Bannières de guerre", nv = 28, min = 23, te = "War Banners", av = 473, g = { "Capitaine Rudepoing", "Captain Stoutfist", 1437, 8.3, 58.6 }, r = { "Capitaine Rudepoing", "Captain Stoutfist", 1437, 8.3, 58.6 }, c = { 1437, 46, 45.3 }, obj = "Rapporter 8 × Etendard de guerre Dragonmaw", oe = "Bring 8 × Dragonmaw War Banner" }
D[465] = { t = "La manœuvre de Nek'rosh", nv = 31, min = 23, te = "Nek'rosh's Gambit", av = 464, g = { "Capitaine Rudepoing", "Captain Stoutfist", 1437, 8.3, 58.6 }, r = { "Catapulte des Gueules-de-dragon", "Dragonmaw Catapult", 1437, 47.5, 47 }, c = { 1437, 53.5, 54.7 }, obj = "Rapporter Combustible nain", oe = "Bring Dwarven Tinder" }
D[467] = { t = "La quête d'Engrepierre", nv = 23, min = 20, te = "Stonegear's Search", g = { "Montagnard Kadrell", "Mountaineer Kadrell", 1432, 34.6, 44.5 } }
D[468] = { t = "Un rapport pour le Montagnard Rochegar", nv = 21, min = 19, te = "Report to Mountaineer Rockgar", g = { "Montagnard Kadrell", "Mountaineer Kadrell", 1432, 34.6, 44.5 }, r = { "Montagnard Rochegar", "Mountaineer Rockgar", 1432, 25.4, 10.4 } }
D[469] = { t = "Livraison quotidienne", nv = 21, min = 18, te = "Daily Delivery", g = { "Einar Poignepierre", "Einar Stonegrip", 1437, 49.9, 39.4 }, r = { "James Halloran", "James Halloran", 1437, 8.3, 58.6 }, obj = "Rapporter Lot de peaux de crocilisques", oe = "Bring Bundle of Crocolisk Skins" }
D[470] = { t = "En creusant dans la vase", nv = 24, min = 19, te = "Digging Through the Ooze", g = { "Sidonie", "Sida", 1437, 8.3, 58.6 }, r = { "Sidonie", "Sida", 1437, 8.3, 58.6 }, c = { 1437, 64.1, 44.1 }, obj = "Rapporter Sac de Sidonie", oe = "Bring Sida's Bag" }
D[471] = { t = "Les devoirs de l'apprenti", nv = 26, min = 18, te = "Apprentice's Duties", av = 484, g = { "James Halloran", "James Halloran", 1437, 8.3, 58.6 }, r = { "James Halloran", "James Halloran", 1437, 8.3, 58.6 }, c = { 1437, 19.4, 25 }, obj = "Rapporter 6 × Peau de crocilisque géant", oe = "Bring 6 × Giant Crocolisk Skin" }
D[472] = { t = "La chute de Dun Modr", nv = 25, min = 25, te = "Fall of Dun Modr", g = { "Harlo Barnaby", "Harlo Barnaby", 1437, 8.3, 58.6 }, r = { "Tresse-longue le Macabre", "Longbraid the Grim", 1437, 50, 18.2 } }
D[473] = { t = "Un rapport au capitaine Rudepoing", nv = 28, min = 23, te = "Report to Captain Stoutfist", g = { "Valstag Gueule-de-fer", "Valstag Ironjaw", 1437, 8.3, 58.6 }, r = { "Capitaine Rudepoing", "Captain Stoutfist", 1437, 8.3, 58.6 } }
D[474] = { t = "Vaincre Nek'rosh", nv = 32, min = 23, te = "Defeat Nek'rosh", av = 465, g = { "Catapulte des Gueules-de-dragon", "Dragonmaw Catapult", 1437, 47.5, 47 }, r = { "Capitaine Rudepoing", "Captain Stoutfist", 1437, 8.3, 58.6 }, c = { 1437, 53.5, 54.7 }, obj = "Rapporter Tête de Nek'rosh", oe = "Bring Nek'rosh's Head" }
D[475] = { t = "Une brise étrange", nv = 6, min = 4, te = "A Troubling Breeze", g = { "Athridas Mantelours", "Athridas Bearmantle", 1438, 56, 57.3 }, r = { "Gaerolas Talvethren", "Gaerolas Talvethren", 1438, 66.3, 58.5 } }
D[476] = { t = "La corruption des Pins-tordus", nv = 6, min = 4, te = "Gnarlpine Corruption", av = 475, g = { "Gaerolas Talvethren", "Gaerolas Talvethren", 1438, 66.3, 58.5 }, r = { "Athridas Mantelours", "Athridas Bearmantle", 1438, 56, 57.3 } }
D[477] = { t = "Frontières", nv = 14, min = 10, te = "Border Crossings", g = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, r = { "Caisse de Dalaran", "Dalaran Crate", 1421, 49.9, 60.3 } }
D[478] = { t = "Des cartes et des runes", nv = 14, min = 10, te = "Maps and Runes", av = 477, g = { "Caisse de Dalaran", "Dalaran Crate", 1421, 49.9, 60.3 }, r = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, obj = "Rapporter Pendentif marqué de runes", oe = "Bring Rune-inscribed Pendant" }
D[479] = { t = "Enquête à Moulin-de-l'Ambre", nv = 16, min = 10, te = "Ambermill Investigations", av = 482, g = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, r = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, c = { 1421, 59.4, 63.6 }, obj = "Rapporter 8 × Pendentif de Dalaran", oe = "Bring 8 × Dalaran Pendant" }
D[480] = { t = "Le Tisserand", nv = 22, min = 10, te = "The Weaver", av = 479, g = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, r = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, c = { 1421, 63.4, 64.3 }, obj = "Rapporter Bâton d'Ataeric", oe = "Bring Ataeric's Staff" }
D[481] = { t = "L'analyse de Dalar", nv = 14, min = 10, te = "Dalar's Analysis", av = 478, g = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, r = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, obj = "Rapporter Pendentif marqué de runes", oe = "Bring Rune-inscribed Pendant" }
D[482] = { t = "Les intentions de Dalaran", nv = 14, min = 10, te = "Dalaran's Intentions", av = 481, g = { "Dalar Tisselaube", "Dalar Dawnweaver", 1421, 44.2, 39.8 }, r = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 } }
D[483] = { t = "Les reliques d'éveil", nv = 9, min = 4, te = "The Relics of Wakening", av = 476, g = { "Athridas Mantelours", "Athridas Bearmantle", 1438, 56, 57.3 }, r = { "Athridas Mantelours", "Athridas Bearmantle", 1438, 56, 57.3 }, c = { 1438, 44.7, 59.3 }, obj = "Rapporter Talisman de la griffe du Corbeau ; Rapporter Plume noire ; Rapporter Saphir des cieux ; Rapporter Rune de nidification", oe = "Bring Raven Claw Talisman ; Bring Black Feather Quill ; Bring Sapphire of Sky ; Bring Rune of Nesting" }
D[484] = { t = "Les peaux de jeune crocilisque", nv = 22, min = 18, te = "Young Crocolisk Skins", g = { "James Halloran", "James Halloran", 1437, 8.3, 58.6 }, r = { "James Halloran", "James Halloran", 1437, 8.3, 58.6 }, c = { 1437, 63.9, 70.8 }, obj = "Rapporter 4 × Peau de jeune crocilisque", oe = "Bring 4 × Young Crocolisk Skin" }
D[486] = { t = "Ursal le Marteleur", nv = 12, min = 4, te = "Ursal the Mauler", av = 483, g = { "Athridas Mantelours", "Athridas Bearmantle", 1438, 56, 57.3 }, r = { "Athridas Mantelours", "Athridas Bearmantle", 1438, 56, 57.3 }, c = { 1438, 38.8, 79.8 }, obj = "Vaincre Ursal le Marteleur", oe = "Kill Ursal the Mauler" }
D[487] = { t = "La route de Darnassus", nv = 8, min = 5, te = "The Road to Darnassus", g = { "Prêtresse de la lune Amara", "Moon Priestess Amara", 1438, 56, 57.3 }, r = { "Prêtresse de la lune Amara", "Moon Priestess Amara", 1438, 56, 57.3 }, c = { 1438, 46.7, 53 }, obj = "Vaincre 6 × Embusqué Pin-tordu", oe = "Kill 6 × Gnarlpine Ambusher" }
D[488] = { t = "Les commandements de Zenn", nv = 5, min = 4, te = "Zenn's Bidding", g = { "Zenn Vilsabot", "Zenn Foulhoof", 1438, 60.5, 56.3 }, r = { "Zenn Vilsabot", "Zenn Foulhoof", 1438, 60.5, 56.3 }, c = { 1438, 53.7, 58.8 }, obj = "Rapporter 3 × Croc de Sabre-de-nuit ; Rapporter 3 × Plume de Hibou Strigid ; Rapporter 3 × Soie d'araignée Tissebois", oe = "Bring 3 × Nightsaber Fang ; Bring 3 × Strigid Owl Feather ; Bring 3 × Webwood Spider Silk" }
D[489] = { t = "En quête de rédemption !", nv = 7, min = 4, te = "Seek Redemption!", av = 488, g = { "Syral Feuillelame", "Syral Bladeleaf", 1438, 56, 57.3 }, r = { "Zenn Vilsabot", "Zenn Foulhoof", 1438, 60.5, 56.3 }, c = { 1438, 53.8, 65.2 }, obj = "Rapporter 3 × Gangrenoix", oe = "Bring 3 × Fel Cone" }
D[491] = { t = "Une Baguette pour Bethor", nv = 18, min = 12, te = "Wand to Bethor", av = 461, g = { "Étagère poussiéreuse", "Dusty Shelf", 1421, 67.9, 24.9 }, obj = "Rapporter Baguette tressée", oe = "Bring Woven Wand" }
D[492] = { t = "Une peste nouvelle", nv = 11, min = 6, te = "A New Plague", av = 369, g = { "Apothicaire Johaan", "Apothecary Johaan", 1420, 61.7, 52 }, r = { "Montagnard capturé", "Captured Mountaineer", 1420, 61.7, 52 }, obj = "Rapporter Boisson spéciale de Johaan", oe = "Bring Johaan's Special Drink" }
D[493] = { t = "Voyage jusqu’aux contreforts de Hautebrande", nv = 20, min = 19, te = "Journey to Hillsbrad Foothills", g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, obj = "Rapporter Les découvertes de Renferrel", oe = "Bring Renferrel's Findings" }
D[494] = { t = "Prêts à frapper", nv = 20, min = 19, te = "Time To Strike", g = { "Nécrotraqueuse Lesh", "Deathstalker Lesh", 1424, 20.8, 47.4 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 } }
D[496] = { t = "L'élixir de souffrance", nv = 22, min = 19, te = "Elixir of Suffering", g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, c = { 1424, 64.8, 33.8 }, obj = "Rapporter 10 × Langue d'ours gris ; Rapporter Ichor de Rampant", oe = "Bring 10 × Gray Bear Tongue ; Bring Creeper Ichor" }
D[498] = { t = "Sauvetage", nv = 22, min = 17, te = "The Rescue", g = { "Krusk", "Krusk", 1424, 62.3, 20.5 }, r = { "Krusk", "Krusk", 1424, 62.3, 20.5 }, c = { 1424, 77.6, 40.6 }, obj = "Utiliser Ouverture sur Boulet et chaîne verrouillés ; Utiliser Ouverture sur Boulet et chaîne verrouillés", oe = "Use Opening on Locked ball and chain ; Use Opening on Locked ball and chain" }
D[499] = { t = "L'élixir de souffrance", nv = 22, min = 19, te = "Elixir of Suffering", av = 496, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Umpi", "Umpi", 1424, 62.3, 20.5 }, obj = "Rapporter Elixir de souffrance", oe = "Bring Elixir of Suffering" }
D[500] = { t = "La prime Cassecrête", nv = 36, min = 30, te = "Crushridge Bounty", g = { "Maréchal Senterouge", "Marshal Redpath", 1424, 49.5, 58.7 }, r = { "Maréchal Senterouge", "Marshal Redpath", 1424, 49.5, 58.7 }, obj = "Rapporter 9 × Articulation sale", oe = "Bring 9 × Dirty Knucklebones" }
D[501] = { t = "L'élixir de douleur", nv = 24, min = 21, te = "Elixir of Pain", g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, c = { 1424, 52.8, 36.2 }, obj = "Rapporter 10 × Sang de lion des montagnes", oe = "Bring 10 × Mountain Lion Blood" }
D[502] = { t = "L'élixir de douleur", nv = 24, min = 21, te = "Elixir of Pain", av = 501, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Stanley", "Stanley", 1424, 32.7, 35.3 }, obj = "Rapporter Elixir de douleur", oe = "Bring Elixir of Pain" }
D[503] = { t = "Gol'dir", nv = 36, min = 29, av = 533, g = { "Krusk", "Krusk", 1424, 62.3, 20.5 }, obj = "Rapporter Clé rouillée en fer", oe = "Bring Rusted Iron Key" }
D[504] = { t = "Les combattants cassecrêtes", nv = 40, min = 30, te = "Crushridge Warmongers", av = 500, g = { "Maréchal Senterouge", "Marshal Redpath", 1424, 49.5, 58.7 }, r = { "Maréchal Senterouge", "Marshal Redpath", 1424, 49.5, 58.7 }, obj = "Vaincre 10 × Combattant Cassecrête", oe = "Kill 10 × Crushridge Warmonger" }
D[505] = { t = "Syndicat d'assassins", nv = 33, min = 26, te = "Syndicate Assassins", g = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, r = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, obj = "Vaincre 12 × Détrousseur du Syndicat ; Vaincre 8 × Larron du Syndicat", oe = "Kill 12 × Syndicate Footpad ; Kill 8 × Syndicate Thief" }
D[509] = { t = "L'élixir d'agonie", nv = 28, min = 24, te = "Elixir of Agony", g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, obj = "Rapporter 6 × Fleurs de fangemufle", oe = "Bring 6 × Mudsnout Blossoms" }
D[512] = { t = "Nobles morts", nv = 36, min = 26, te = "Noble Deaths", av = 510, g = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, r = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, obj = "Rapporter 7 × Chevalière d'Alterac", oe = "Bring 7 × Alterac Signet Ring" }
D[513] = { t = "L'élixir d'agonie", nv = 28, min = 24, te = "Elixir of Agony", av = 509, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, obj = "Rapporter Poudre de fangemufle", oe = "Bring Mudsnout Composite" }
D[514] = { t = "Le maître des lettres", nv = 34, min = 30, te = "Letter to Stormpike", av = 511, g = { "Maître des traditions Dibbs", "Loremaster Dibbs", 1424, 49.5, 58.7 }, obj = "Rapporter Lettre astucieusement codée", oe = "Bring Cleverly Encrypted Letter" }
D[516] = { t = "Le Péril de Beren", nv = 21, min = 16, te = "Beren's Peril", g = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, r = { "Prêtre des ombres Allister", "Shadow Priest Allister", 1421, 44.2, 39.8 }, c = { 1421, 59.5, 72 }, obj = "Vaincre 6 × Manouvrier Serres-de-corbeau ; Vaincre 6 × Gardien Serres-de-corbeau", oe = "Kill 6 × Ravenclaw Drudger ; Kill 6 × Ravenclaw Guardian" }
D[517] = { t = "L'élixir d'agonie", nv = 30, min = 24, te = "Elixir of Agony", av = 515, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, c = { 1424, 72.4, 79.8 }, obj = "Rapporter Tonneau de Shindigger", oe = "Bring Keg of Shindigger Stout" }
D[518] = { t = "La couronne de volonté", nv = 39, min = 34, te = "The Crown of Will", g = { "Melisara", "Melisara", 1424, 62.3, 20.5 }, r = { "Melisara", "Melisara", 1424, 62.3, 20.5 }, obj = "Vaincre 10 × Marteleur Cassecrête", oe = "Kill 10 × Crushridge Mauler" }
D[519] = { t = "La couronne de volonté", nv = 41, min = 34, te = "The Crown of Will", av = 518, g = { "Melisara", "Melisara", 1424, 62.3, 20.5 }, r = { "Melisara", "Melisara", 1424, 62.3, 20.5 }, obj = "Rapporter Tête de Targ ; Rapporter Tête de Fouilleboue ; Rapporter Tête de Glommus", oe = "Bring Targ's Head ; Bring Muckrake's Head ; Bring Glommus's Head" }
D[523] = { t = "La mort du baron Vardus", nv = 40, min = 30, te = "Baron's Demise", av = 522, g = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, r = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, obj = "Rapporter Tête du baron Vardus", oe = "Bring Head of Baron Vardus" }
D[524] = { t = "L'élixir d'agonie", nv = 30, min = 24, te = "Elixir of Agony", av = 517, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, obj = "Rapporter Baril infecté", oe = "Bring Tainted Keg" }
D[526] = { t = "Les lingots de sancteforge", nv = 29, min = 20, te = "Lightforge Ingots", av = 324, g = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, r = { "Glorin Front-d'acier", "Glorin Steelbrow", 1437, 8.3, 58.6 }, c = { 1437, 24.4, 16.9 }, obj = "Rapporter 5 × Lingot de sancteforge", oe = "Bring 5 × Lightforge Ingot" }
D[527] = { t = "La bataille de Hautebrande", nv = 24, min = 19, te = "Battle of Hillsbrad", g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 33.5, 40 }, obj = "Vaincre 6 × Fermier de Hautebrande ; Vaincre 6 × Ouvrier agricole de Hautebrande ; Vaincre Ray le fermier ; Vaincre Getz le fermier", oe = "Kill 6 × Hillsbrad Farmer ; Kill 6 × Hillsbrad Farmhand ; Kill Farmer Ray ; Kill Farmer Getz" }
D[528] = { t = "La bataille de Hautebrande", nv = 25, min = 19, te = "Battle of Hillsbrad", av = 527, g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 32.9, 44.3 }, obj = "Vaincre 15 × Paysan de Hautebrande", oe = "Kill 15 × Hillsbrad Peasant" }
D[529] = { t = "La bataille de Hautebrande", nv = 26, min = 19, te = "Battle of Hillsbrad", av = 528, g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 31.6, 45.6 }, obj = "Rapporter Chargement de fer ; Vaincre Forgeron Verringtan ; Vaincre 4 × Apprenti forgeron de Hautebrande", oe = "Bring Shipment of Iron ; Kill Blacksmith Verringtan ; Kill 4 × Hillsbrad Apprentice Blacksmith" }
D[531] = { t = "La vengeance de Vyrin", nv = 20, min = 15, te = "Vyrin's Revenge", av = 271, g = { "Daryl le Jeune", "Daryl the Youngling", 1432, 83.5, 65.5 }, r = { "Vyrin Vent-vif", "Vyrin Swiftwind", 1432, 83.5, 65.5 }, c = { 1432, 37.9, 63.4 }, obj = "Rapporter Tête du vieux Noiraud", oe = "Bring Ol' Sooty's Head" }
D[532] = { t = "La bataille de Hautebrande", nv = 26, min = 19, te = "Battle of Hillsbrad", av = 529, g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 30.8, 42.7 }, obj = "Rapporter Registre municipal d'Hillsbrad ; Vaincre Magistrat Burnside ; Vaincre 4 × Conseiller de Hautebrande ; Activer Proclamation de Hautebrande", oe = "Bring Hillsbrad Town Registry ; Kill Magistrate Burnside ; Kill 4 × Hillsbrad Councilman ; Use Hillsbrad Proclamation" }
D[533] = { t = "L'épée d'HumbertInfiltration", nv = 34, min = 29, te = "Infiltration", av = 498, g = { "Krusk", "Krusk", 1424, 62.3, 20.5 }, r = { "Krusk", "Krusk", 1424, 62.3, 20.5 }, obj = "Rapporter Missive du Syndicat", oe = "Bring Syndicate Missive" }
D[536] = { t = "Le long de la côte", nv = 30, min = 25, te = "Down the Coast", g = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, r = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, c = { 1424, 42.7, 69.1 }, obj = "Vaincre 10 × Chasse-marée Aileron déchiré ; Vaincre 10 × Oracle Aileron déchiré", oe = "Kill 10 × Torn Fin Tidehunter ; Kill 10 × Torn Fin Oracle" }
D[537] = { t = "Le conseil noir", nv = 40, min = 30, te = "Dark Council", av = 525, g = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, r = { "Magistrat Henry Maleb", "Magistrate Henry Maleb", 1424, 49.5, 58.7 }, obj = "Rapporter Tête de Nagaz ; Vaincre 4 × Mage de l'ombre d'Argus", oe = "Bring Head of Nagaz ; Kill 4 × Argus Shadow Mage" }
D[539] = { t = "La bataille de Hautebrande", nv = 28, min = 19, te = "Battle of Hillsbrad", av = 532, g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 29.6, 55.2 }, obj = "Vaincre Contremaître Bonds ; Vaincre 10 × Mineur de Hautebrande", oe = "Kill Foreman Bonds ; Kill 10 × Hillsbrad Miner" }
D[540] = { t = "L'entretien des connaissances", nv = 38, min = 20, te = "Preserving Knowledge", av = 538, g = { "Maître des traditions Dibbs", "Loremaster Dibbs", 1424, 49.5, 58.7 }, r = { "Maître des traditions Dibbs", "Loremaster Dibbs", 1424, 49.5, 58.7 }, obj = "Rapporter 5 × Tome retrouvé ; Rapporter Livre de cuir usé", oe = "Bring 5 × Recovered Tome ; Bring Worn Leather Book" }
D[541] = { t = "La bataille de Hautebrande", nv = 30, min = 19, te = "Battle of Hillsbrad", av = 539, g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 70.7, 77.3 }, obj = "Vaincre 8 × Montagnard de Dun Garok ; Vaincre 4 × Fusilier de Dun Garok ; Vaincre 2 × Prêtre de Dun Garok ; Vaincre Capitaine Colline-de-fer", oe = "Kill 8 × Dun Garok Mountaineer ; Kill 4 × Dun Garok Rifleman ; Kill 2 × Dun Garok Priest ; Kill Captain Ironhill" }
D[542] = { t = "Les livres de Milton", nv = 38, min = 20, te = "Return to Milton", av = 540, g = { "Maître des traditions Dibbs", "Loremaster Dibbs", 1424, 49.5, 58.7 }, obj = "Rapporter Tomes d'Alterac", oe = "Bring Tomes of Alterac" }
D[544] = { t = "L'invasion de la prison", nv = 34, min = 30, te = "Prison Break In", g = { "Magus Wordeen Toisevide", "Magus Wordeen Voidglare", 1424, 62.3, 20.5 }, r = { "Magus Wordeen Toisevide", "Magus Wordeen Voidglare", 1424, 62.3, 20.5 }, obj = "Rapporter Coeur de pierre de sang ; Rapporter Pierre de sang marbrée ; Rapporter Eclat de pierre de sang ; Rapporter Pierre de sang ovale", oe = "Bring Bloodstone Wedge ; Bring Bloodstone Marble ; Bring Bloodstone Shard ; Bring Bloodstone Oval" }
D[545] = { t = "Les patrouilles de Dalaran", nv = 35, min = 30, te = "Dalaran Patrols", av = 544, g = { "Magus Wordeen Toisevide", "Magus Wordeen Voidglare", 1424, 62.3, 20.5 }, r = { "Magus Wordeen Toisevide", "Magus Wordeen Voidglare", 1424, 62.3, 20.5 }, obj = "Vaincre 6 × Invocateur de Dalaran ; Vaincre 12 × Elémentaire asservi", oe = "Kill 6 × Dalaran Summoner ; Kill 12 × Elemental Slave" }
D[546] = { t = "Souvenirs de morts", nv = 25, min = 20, te = "Souvenirs of Death", av = 527, g = { "Nécrogarde Samsa", "Deathguard Samsa", 1424, 62.3, 20.5 }, r = { "Nécrogarde Samsa", "Deathguard Samsa", 1424, 62.3, 20.5 }, obj = "Rapporter 30 × Crâne d'humain d'Hillsbrad", oe = "Bring 30 × Hillsbrad Human Skull" }
D[547] = { t = "L'épée d'Humbert", nv = 30, min = 26, te = "Humbert's Sword", g = { "Nécrogarde Humbert", "Deathguard Humbert", 1424, 62.3, 20.5 }, r = { "Nécrogarde Humbert", "Deathguard Humbert", 1424, 62.3, 20.5 }, c = { 1424, 71.1, 77.9 }, obj = "Rapporter Epée d'Humbert", oe = "Bring Humbert's Sword" }
D[549] = { t = "ON RECHERCHE : Personnel du Syndicat", nv = 22, min = 17, te = "WANTED: Syndicate Personnel", g = { "WANTED", "WANTED", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 78.7, 42.5 }, obj = "Vaincre 10 × Voleur du Syndicat ; Vaincre 10 × Sentinelle du Syndicat", oe = "Kill 10 × Syndicate Rogue ; Kill 10 × Syndicate Watchman" }
D[550] = { t = "La bataille de Hautebrande", nv = 32, min = 19, te = "Battle of Hillsbrad", av = 541, g = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, obj = "Rapporter Recommandation portant le sceau de Darthalia", oe = "Bring Darthalia's Sealed Commendation" }
D[552] = { t = "La vengeance d'Helcular", nv = 33, min = 29, te = "Helcular's Revenge", g = { "Novice Thaivand", "Novice Thaivand", 1424, 62.3, 20.5 }, r = { "Novice Thaivand", "Novice Thaivand", 1424, 62.3, 20.5 }, c = { 1424, 45.7, 31.7 }, obj = "Rapporter Bâtonnet d'Helcular", oe = "Bring Helcular's Rod" }
D[553] = { t = "La vengeance d'Helcular", nv = 33, min = 29, te = "Helcular's Revenge", av = 552, g = { "Novice Thaivand", "Novice Thaivand", 1424, 62.3, 20.5 }, r = { "Tombeau d'Helcular", "Helcular's Grave", 1424, 52.8, 53.4 }, obj = "Rapporter Bâtonnet d'Helcular ; Activer Flamme d'Azel ; Activer Flamme de Veraz ; Activer Flamme d'Uzel", oe = "Bring Rod of Helcular ; Use Flame of Azel ; Use Flame of Veraz ; Use Flame of Uzel" }
D[554] = { t = "Les Runes gravées", nv = 40, min = 28, te = "Stormpike's Deciphering", av = 551, g = { "Maître des traditions Dibbs", "Loremaster Dibbs", 1424, 49.5, 58.7 }, obj = "Rapporter Parchemin ensorcelé", oe = "Bring Ensorcelled Parchment" }
D[555] = { t = "Bisque de tortue apaisante", nv = 31, min = 28, te = "Soothing Turtle Bisque", g = { "Chef Jessen", "Chef Jessen", 1424, 49.5, 58.7 }, r = { "Chef Jessen", "Chef Jessen", 1424, 49.5, 58.7 }, c = { 1424, 66.7, 34.8 }, obj = "Rapporter 10 × Viande de tortue ; Rapporter Epices apaisantes", oe = "Bring 10 × Turtle Meat ; Bring Soothing Spices" }
D[556] = { t = "Les Runes gravées", nv = 32, min = 30, te = "Stone Tokens", g = { "Gardien Bel'varil", "Keeper Bel'varil", 1424, 62.3, 20.5 }, r = { "Gardien Bel'varil", "Keeper Bel'varil", 1424, 62.3, 20.5 }, obj = "Rapporter 10 × Rune gravée usée", oe = "Bring 10 × Worn Stone Token" }
D[557] = { t = "Les brassards de lien", nv = 34, min = 30, te = "Bracers of Binding", av = 556, g = { "Gardien Bel'varil", "Keeper Bel'varil", 1424, 62.3, 20.5 }, r = { "Gardien Bel'varil", "Keeper Bel'varil", 1424, 62.3, 20.5 }, obj = "Rapporter 4 × Brassards de liaison de terre", oe = "Bring 4 × Bracers of Earth Binding" }
D[559] = { t = "La preuve de Farren", nv = 32, min = 25, te = "Farren's Proof", av = 536, g = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, r = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, c = { 1424, 40.3, 69.6 }, obj = "Rapporter 10 × Tête de murloc", oe = "Bring 10 × Murloc Head" }
D[560] = { t = "La preuve de Farren", nv = 32, min = 25, te = "Farren's Proof", av = 559, g = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, r = { "Maréchal Senterouge", "Marshal Redpath", 1424, 49.5, 58.7 }, obj = "Rapporter Sac de têtes de murloc", oe = "Bring Sack of Murloc Heads" }
D[561] = { t = "La preuve de Farren", nv = 32, min = 25, te = "Farren's Proof", av = 560, g = { "Maréchal Senterouge", "Marshal Redpath", 1424, 49.5, 58.7 }, r = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 } }
D[562] = { t = "Hurlevent me voilà", nv = 32, min = 25, te = "Stormwind Ho!", av = 561, g = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, r = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, c = { 1424, 56.8, 70.4 }, obj = "Vaincre 10 × Chasseur du rivage Daguéchine ; Vaincre 10 × Sirène Daguéchine", oe = "Kill 10 × Daggerspine Shorehunter ; Kill 10 × Daggerspine Siren" }
D[563] = { t = "Nouvelle affectation", nv = 32, min = 25, te = "Reassignment", av = 562, g = { "Lieutenant Farren Orinelle", "Lieutenant Farren Orinelle", 1424, 49.5, 58.7 }, obj = "Rapporter Rapport de Farren", oe = "Bring Farren's Report" }
D[564] = { t = "Un problème très coûteux", nv = 34, min = 30, te = "Costly Menace", g = { "Darren Malvew", "Darren Malvew", 1424, 49.5, 58.7 }, r = { "Darren Malvew", "Darren Malvew", 1424, 49.5, 58.7 }, obj = "Vaincre 8 × Lion des montagnes ; Vaincre 10 × Lion des montagnes massif", oe = "Kill 8 × Mountain Lion ; Kill 10 × Hulking Mountain Lion" }
D[565] = { t = "La cape en fourrure de yéti de Bartolo", nv = 34, min = 29, te = "Bartolo's Yeti Fur Cloak", g = { "Bartolo Ginsetti", "Bartolo Ginsetti", 1424, 49.5, 58.7 }, r = { "Bartolo Ginsetti", "Bartolo Ginsetti", 1424, 49.5, 58.7 }, c = { 1424, 32.9, 41.6 }, obj = "Rapporter Rouleau d'étoffe de laine ; Rapporter Bobine de fil raffiné ; Rapporter Cape d'homme des collines ; Rapporter 10 × Fourrure de yéti", oe = "Bring Bolt of Woolen Cloth ; Bring Fine Thread ; Bring Hillman's Cloak ; Bring 10 × Yeti Fur" }
D[566] = { t = "ON RECHERCHE : baron Vardus", nv = 40, min = 35, te = "WANTED: Baron Vardus", g = { "WANTED", "WANTED", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, obj = "Rapporter Tête du baron Vardus", oe = "Bring Head of Baron Vardus" }
D[567] = { t = "Dangereux !", nv = 28, min = 19, te = "Dangerous!", g = { "Dangerous!", "Dangerous!", 1424, 62.3, 20.5 }, r = { "Grande exécutrice Darthalia", "High Executor Darthalia", 1424, 62.3, 20.5 }, c = { 1424, 32.7, 42.9 }, obj = "Vaincre Greffier Horrace Blancheval ; Vaincre Citoyen Wilkes ; Vaincre Mineur Hackett ; Vaincre Kalaba la fermière", oe = "Kill Clerk Horrace Whitesteed ; Kill Citizen Wilkes ; Kill Miner Hackett ; Kill Farmer Kalaba" }
D[568] = { t = "La défense de Grom'gol", nv = 36, min = 33, te = "The Defense of Grom'gol", g = { "Commandant Aggro'gosh", "Commander Aggro'gosh", 1434, 32.2, 28.9 }, r = { "Commandant Aggro'gosh", "Commander Aggro'gosh", 1434, 32.2, 28.9 }, c = { 1434, 35, 24.5 }, obj = "Vaincre 15 × Raptor flagellant", oe = "Kill 15 × Lashtail Raptor" }
D[569] = { t = "La défense de Grom'gol", nv = 37, min = 33, te = "The Defense of Grom'gol", av = 568, g = { "Commandant Aggro'gosh", "Commander Aggro'gosh", 1434, 32.2, 28.9 }, r = { "Commandant Aggro'gosh", "Commander Aggro'gosh", 1434, 32.2, 28.9 }, c = { 1434, 36.6, 29.8 }, obj = "Vaincre 10 × Brute mosh'ogg ; Vaincre 5 × Féticheur mosh'ogg", oe = "Kill 10 × Mosh'Ogg Brute ; Kill 5 × Mosh'Ogg Witch Doctor" }
D[570] = { t = "Enchantement de Mok'thardin", nv = 38, min = 33, te = "Mok'thardin's Enchantment", g = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, r = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, c = { 1434, 39, 37.6 }, obj = "Rapporter 8 × Griffe d'Ombregueule ; Rapporter Croc de tigresse en parfait état", oe = "Bring 8 × Shadowmaw Claw ; Bring Pristine Tigress Fang" }
D[571] = { t = "Enchantement de Mok'thardin", nv = 41, min = 33, te = "Mok'thardin's Enchantment", av = 572, g = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, r = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, c = { 1434, 33, 64.2 }, obj = "Rapporter Tendon d'ancien gorille", oe = "Bring Aged Gorilla Sinew" }
D[572] = { t = "Enchantement de Mok'thardin", nv = 41, min = 33, te = "Mok'thardin's Enchantment", av = 570, g = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, r = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, c = { 1434, 29.7, 43.5 }, obj = "Rapporter 10 × Plume de Traqueur de la jungle", oe = "Bring 10 × Jungle Stalker Feather" }
D[573] = { t = "Enchantement de Mok'thardin", nv = 44, min = 33, te = "Mok'thardin's Enchantment", av = 571, g = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, r = { "Prophète Mok'thardin", "Far Seer Mok'thardin", 1434, 32.2, 28.9 }, c = { 1434, 26.3, 61.7 }, obj = "Rapporter Eau de la source sacrée ; Vaincre 10 × Explorateur naga", oe = "Bring Holy Spring Water ; Kill 10 × Naga Explorer" }
D[574] = { t = "Forces spéciales", nv = 38, min = 30, te = "Special Forces", g = { "Sergent Yohwa", "Sergeant Yohwa", 1434, 38, 3.4 }, r = { "Lieutenant Doren", "Lieutenant Doren", 1434, 38, 3.4 }, c = { 1434, 46.3, 7.7 }, obj = "Vaincre 10 × Commando de Kurzen ; Vaincre 6 × Réducteur de tête de Kurzen", oe = "Kill 10 × Kurzen Commando ; Kill 6 × Kurzen Headshrinker" }
D[575] = { t = "L'offre et la demande", nv = 31, min = 26, te = "Supply and Demand", g = { "Drizzlik", "Drizzlik", 1434, 27, 77.1 }, r = { "Drizzlik", "Drizzlik", 1434, 27, 77.1 }, c = { 1434, 36.5, 10.5 }, obj = "Rapporter 2 × Grande peau de crocilisque des rivières", oe = "Bring 2 × Large River Crocolisk Skin" }
D[576] = { t = "Gardez un œil dehors", nv = 42, min = 37, te = "Keep An Eye Out", av = 595, g = { "Dizzy le Borgne", "Dizzy One-Eye", 1434, 27, 77.1 }, r = { "Dizzy le Borgne", "Dizzy One-Eye", 1434, 27, 77.1 }, c = { 1434, 31.4, 82.1 }, obj = "Rapporter Oeil de Dizzy", oe = "Bring Dizzy's Eye" }
D[577] = { t = "La face cachée des bottes", nv = 36, min = 31, te = "Some Assembly Required", av = 575, g = { "Drizzlik", "Drizzlik", 1434, 27, 77.1 }, r = { "Drizzlik", "Drizzlik", 1434, 27, 77.1 }, c = { 1434, 40.4, 21.1 }, obj = "Rapporter 5 × Peau de Gueule d'acier", oe = "Bring 5 × Snapjaw Crocolisk Skin" }
D[578] = { t = "La pierre des marées", nv = 37, min = 32, te = "The Stone of the Tides", av = 616, g = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, r = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 } }
D[580] = { t = "La bibine perdue de Whiskey Slim", nv = 50, min = 40, te = "Whiskey Slim's Lost Grog", g = { "Whiskey Slim", "Whiskey Slim", 1434, 27, 77.1 }, r = { "Whiskey Slim", "Whiskey Slim", 1434, 27, 77.1 }, obj = "Rapporter 12 × Porto Pupellyverbos", oe = "Bring 12 × Pupellyverbos Port" }
D[581] = { t = "La chasse pour Yenniku", nv = 34, min = 30, te = "Hunt for Yenniku", g = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, r = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, c = { 1434, 25.1, 12.5 }, obj = "Rapporter 9 × Défense de Bloodscalp", oe = "Bring 9 × Bloodscalp Tusk" }
D[582] = { t = "Les chasseurs de têtes", nv = 37, min = 30, te = "Headhunting", av = 581, g = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, r = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, c = { 1434, 22, 10.9 }, obj = "Rapporter 20 × Tête réduite", oe = "Bring 20 × Shrunken Head" }
D[583] = { t = "Bienvenue dans la jungle", nv = 30, min = 28, te = "Welcome to the Jungle", g = { "Barnil Potepierre", "Barnil Stonepot", 1434, 35.6, 10.6 }, r = { "Hemet Nesingwary", "Hemet Nesingwary", 1434, 35.6, 10.6 } }
D[584] = { t = "Les têtes du clan Scalp-rouge", nv = 41, min = 30, te = "Bloodscalp Clan Heads", av = 582, g = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, r = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, c = { 1434, 23.4, 8.1 }, obj = "Rapporter Tête de Gan'zulah ; Rapporter Tête de Nezzliok", oe = "Bring Gan'zulah's Head ; Bring Nezzliok's Head" }
D[585] = { t = "En parlant avec Nezzliok", nv = 40, min = 30, te = "Speaking with Nezzliok", av = 584, g = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, r = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, c = { 1434, 45.3, 36 }, obj = "Rapporter Trophée Balia'mah ; Rapporter Trophée Ziata'jai ; Rapporter Trophée Zul'Mamwe", oe = "Bring Balia'mah Trophy ; Bring Ziata'jai Trophy ; Bring Zul'Mamwe Trophy" }
D[586] = { t = "En parlant avec Gan'zulah", nv = 46, min = 30, te = "Speaking with Gan'zulah", av = 584, g = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, r = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, c = { 1434, 46, 42.5 }, obj = "Rapporter Armure brisée d'Ana'thek ; Vaincre 8 × Chasseur casse-crâne ; Vaincre 6 × Chasseur de têtes casse-crâne ; Vaincre 4 × Berserker casse-crâne", oe = "Bring Broken Armor of Ana'thek ; Kill 8 × Skullsplitter Hunter ; Kill 6 × Skullsplitter Headhunter ; Kill 4 × Skullsplitter Berserker" }
D[587] = { t = "Faire un tabac", nv = 41, min = 37, te = "Up to Snuff", av = 595, g = { "Deeg", "Deeg", 1434, 27, 77.1 }, r = { "Deeg", "Deeg", 1434, 27, 77.1 }, c = { 1434, 31.4, 82.1 }, obj = "Rapporter 15 × Tabac à priser", oe = "Bring 15 × Snuff" }
D[588] = { t = "Le sort de Yenniku", nv = 45, min = 30, te = "The Fate of Yenniku", g = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, r = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 } }
D[589] = { t = "Les éclats vibrants", nv = 45, min = 30, te = "The Singing Crystals", av = 588, g = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, r = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, c = { 1434, 43, 47.8 }, obj = "Rapporter 3 × Eclat bleu vibrant", oe = "Bring 3 × Pulsing Blue Shard" }
D[590] = { t = "Un marché de voleur", nv = 5, min = 1, te = "A Rogue's Deal", av = 8, g = { "Calvin Montague", "Calvin Montague", 1420, 38.2, 56.8 }, r = { "Calvin Montague", "Calvin Montague", 1420, 38.2, 56.8 } }
D[591] = { t = "La vue de l'esprit", nv = 46, min = 30, te = "The Mind's Eye", av = 589, g = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, r = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, c = { 1434, 52.9, 27.6 }, obj = "Rapporter Vue de l'esprit", oe = "Bring Mind's Eye" }
D[592] = { t = "Il faut sauver Yenniku", nv = 46, min = 30, te = "Saving Yenniku", av = 591, g = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, r = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, obj = "Rapporter Gemme d'âme capturée", oe = "Bring Filled Soul Gem" }
D[595] = { t = "Les boucaniers de la Voile sanglante", nv = 41, min = 37, te = "The Bloodsail Buccaneers", g = { "Second Crazz", "First Mate Crazz", 1434, 27, 77.1 }, r = { "Correspondance de la Voile sanglante", "Bloodsail Correspondence", 1434, 27.3, 69.5 } }
D[596] = { t = "Les Colliers d'os ensanglantés", nv = 37, min = 30, te = "Bloody Bone Necklaces", g = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, r = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, c = { 1434, 25.1, 12.5 }, obj = "Rapporter 25 × Collier d'os sanglant", oe = "Bring 25 × Bloody Bone Necklace" }
D[597] = { t = "Les boucaniers de la Voile sanglante", nv = 41, min = 37, te = "The Bloodsail Buccaneers", av = 595, g = { "Correspondance de la Voile sanglante", "Bloodsail Correspondence", 1434, 27.3, 69.5 }, r = { "Second Crazz", "First Mate Crazz", 1434, 27, 77.1 } }
D[598] = { t = "Collier d'os brisés", nv = 42, min = 30, te = "Split Bone Necklace", av = 596, g = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, r = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, c = { 1434, 45.7, 38.8 }, obj = "Rapporter 25 × Collier d'os brisés", oe = "Bring 25 × Split Bone Necklace" }
D[599] = { t = "Les boucaniers de la Voile sanglante", nv = 41, min = 37, te = "The Bloodsail Buccaneers", av = 597, g = { "Second Crazz", "First Mate Crazz", 1434, 27, 77.1 }, r = { "Amiral Corne-de-mer", "Fleet Master Seahorn", 1434, 27, 77.1 } }
D[600] = { t = "Les mines de la KapitalRisk", nv = 41, min = 30, te = "Venture Company Mining", av = 605, g = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, r = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, c = { 1434, 41.6, 43.9 }, obj = "Rapporter 10 × Cristal bleu chantant", oe = "Bring 10 × Singing Blue Crystal" }
D[601] = { t = "Les élémentaires d'eau", nv = 37, min = 32, te = "Water Elementals", av = 578, g = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, r = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, c = { 1434, 21, 23.1 }, obj = "Rapporter 6 × Bracelets d'élémentaire d'eau", oe = "Bring 6 × Water Elemental Bracers" }
D[602] = { t = "L'analyse magique", nv = 37, min = 32, te = "Magical Analysis", av = 601, g = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, obj = "Rapporter Sac de bracelets d'élémentaire d'eau", oe = "Bring Bag of Water Elemental Bracers" }
D[604] = { t = "Les boucaniers de la Voile sanglante", nv = 43, min = 37, te = "The Bloodsail Buccaneers", av = 599, g = { "Amiral Corne-de-mer", "Fleet Master Seahorn", 1434, 27, 77.1 }, r = { "Amiral Corne-de-mer", "Fleet Master Seahorn", 1434, 27, 77.1 }, c = { 1434, 30.7, 82.6 }, obj = "Rapporter Cartes de la Voile sanglante ; Rapporter Ordres de la Voile sanglante ; Vaincre 10 × Bretteur de la Voile sanglante", oe = "Bring Bloodsail Charts ; Bring Bloodsail Orders ; Kill 10 × Bloodsail Swashbuckler" }
D[605] = { t = "Les éclats bleus chantants", nv = 35, min = 30, te = "Singing Blue Shards", g = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, r = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, c = { 1434, 37.2, 43.8 }, obj = "Rapporter 10 × Eclat de cristal chantant", oe = "Bring 10 × Singing Crystal Shard" }
D[606] = { t = "Effrayer Philippe le Chancelant", nv = 41, min = 30, te = "Scaring Shaky", g = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 }, r = { "Phillippe le Chancelant", "\"Shaky\" Phillipe", 1434, 27, 77.1 }, c = { 1434, 33, 64.2 }, obj = "Rapporter 5 × Abats de Valbrume", oe = "Bring 5 × Mistvale Giblets" }
D[607] = { t = "De retour chez MacKinley", nv = 41, min = 30, te = "Return to MacKinley", av = 606, g = { "Phillippe le Chancelant", "\"Shaky\" Phillipe", 1434, 27, 77.1 }, r = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 }, obj = "Rapporter Paiement de Philippe le Chancelant", oe = "Bring Shaky's Payment" }
D[608] = { t = "Les boucaniers de la Voile sanglante", nv = 45, min = 37, te = "The Bloodsail Buccaneers", av = 604, g = { "Amiral Corne-de-mer", "Fleet Master Seahorn", 1434, 27, 77.1 }, r = { "Amiral Corne-de-mer", "Fleet Master Seahorn", 1434, 27, 77.1 }, c = { 1434, 30.9, 89 }, obj = "Vaincre Capitaine Eau-plate ; Vaincre Capitaine Soulaquille ; Vaincre Amiral Firallon", oe = "Kill Captain Stillwater ; Kill Captain Keelhaul ; Kill Fleet Master Firallon" }
D[609] = { t = "Gages vaudou", nv = 44, min = 30, te = "Voodoo Dues", av = 607, g = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 }, r = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 }, c = { 1434, 35.3, 51.3 }, obj = "Rapporter Fléau de Maury ; Rapporter Longue-vue dorée de Jon-Jon ; Rapporter Grand anneau de Chucky", oe = "Bring Maury's Clubbed Foot ; Bring Jon-Jon's Golden Spyglass ; Bring Chucky's Huge Ring" }
D[610] = { t = "Duncan « le Beau garçon »", nv = 39, min = 32, te = "\"Pretty Boy\" Duncan", av = 603, g = { "Catelyn la Lame", "Catelyn the Blade", 1434, 27, 77.1 }, r = { "Catelyn la Lame", "Catelyn the Blade", 1434, 27, 77.1 }, c = { 1434, 27.4, 69.4 }, obj = "Rapporter Lame de Catelyn", oe = "Bring Catelyn's Blade" }
D[611] = { t = "La malédiction des marées", nv = 40, min = 32, te = "The Curse of the Tides", av = 610, g = { "Catelyn la Lame", "Catelyn the Blade", 1434, 27, 77.1 }, r = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, c = { 1434, 22.7, 24.1 }, obj = "Rapporter Pierre des Marées ; Rapporter Lame de Catelyn", oe = "Bring Stone of the Tides ; Bring Catelyn's Blade" }
D[613] = { t = "Le pied-bot de Maury", nv = 44, min = 30, te = "Cracking Maury's Foot", av = 609, g = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 }, r = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 }, c = { 1434, 49.2, 28.2 }, obj = "Rapporter Clé de Maury", oe = "Bring Maury's Key" }
D[616] = { t = "L'île hantée", nv = 37, min = 32, te = "The Haunted Isle", g = { "Krazek", "Krazek", 1434, 27, 77.1 }, r = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 } }
D[617] = { t = "De derrière les fagots", nv = 43, min = 38, te = "Akiris by the Bundle", g = { "Corsaire Bloads", "Privateer Bloads", 1434, 27, 77.1 }, r = { "Corsaire Bloads", "Privateer Bloads", 1434, 27, 77.1 }, c = { 1434, 26.3, 61.7 }, obj = "Rapporter 10 × Roseau akiris", oe = "Bring 10 × Akiris Reed" }
D[621] = { t = "Le secret de Zanzil", nv = 44, min = 35, te = "Zanzil's Secret", g = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, r = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, c = { 1434, 38.8, 56.6 }, obj = "Rapporter 12 × Mixture de Zanzil", oe = "Bring 12 × Zanzil's Mixture" }
D[622] = { t = "La cocotte du caporal Kaleb", nv = 37, min = 32, te = "Return to Corporal Kaleb", av = 627, g = { "Krazek", "Krazek", 1434, 27, 77.1 }, r = { "Caporal Kaleb", "Corporal Kaleb", 1434, 38, 3.4 }, obj = "Rapporter Cocotte réparée de Krazek", oe = "Bring Krazek's Fixed Pot" }
D[623] = { t = "De derrière les fagots", nv = 43, min = 38, te = "Akiris by the Bundle", av = 617, g = { "Corsaire Bloads", "Privateer Bloads", 1434, 27, 77.1 }, obj = "Rapporter Tas de roseaux akiris", oe = "Bring Bundle of Akiris Reeds" }
D[625] = { t = "Devinette de Cortello", nv = 43, min = 35, te = "Cortello's Riddle", av = 624, g = { "Un parchemin trempé", "A Soggy Scroll", 1435, 22.9, 48.2 } }
D[626] = { t = "Devinette de Cortello", nv = 51, min = 35, te = "Cortello's Riddle", av = 625, g = { "Parchemin moisi", "Musty Scroll", 1445, 31.1, 66.1 } }
D[627] = { t = "Un service pour Krazek", nv = 37, min = 32, te = "Favor for Krazek", av = 210, g = { "Krazek", "Krazek", 1434, 27, 77.1 }, r = { "Krazek", "Krazek", 1434, 27, 77.1 }, obj = "Rapporter 4 × Minerai de pierre de sang inférieur", oe = "Bring 4 × Lesser Bloodstone Ore" }
D[628] = { t = "L’Excelsior de chez Drizzlik", nv = 38, min = 31, te = "Excelsior", av = 577, g = { "Drizzlik", "Drizzlik", 1434, 27, 77.1 }, r = { "Drizzlik", "Drizzlik", 1434, 27, 77.1 }, c = { 1434, 29.5, 24.9 }, obj = "Rapporter Peau d'ancien crocilisque", oe = "Bring Elder Crocolisk Skin" }
D[629] = { t = "Le récif infâme", nv = 37, min = 30, te = "The Vile Reef", g = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, r = { "Kin'weelay", "Kin'weelay", 1434, 32.2, 28.9 }, c = { 1434, 24.8, 23 }, obj = "Rapporter Eclat de tablette", oe = "Bring Tablet Shard" }
D[630] = { t = "Message dans une bouteille", nv = 51, min = 45, te = "Message in a Bottle", av = 594, g = { "Princesse Poobah", "Princess Poobah", 1434, 38.5, 80.6 }, r = { "Princesse Poobah", "Princess Poobah", 1434, 38.5, 80.6 }, c = { 1434, 40.9, 83.9 }, obj = "Rapporter Clé de chaîne", oe = "Bring Shackle Key" }
D[631] = { t = "Le viaduc de Thandol", nv = 31, min = 28, te = "The Thandol Span", g = { "Rhag Garmaçon", "Rhag Garmason", 1437, 50, 18.2 }, r = { "Cadavre d'Ebenezer Bouclerouille", "Ebenezer Rustlocke's Corpse", 1437, 51.3, 8 } }
D[632] = { t = "Le viaduc de Thandol", nv = 31, min = 28, te = "The Thandol Span", av = 631, g = { "Cadavre d'Ebenezer Bouclerouille", "Ebenezer Rustlocke's Corpse", 1437, 51.3, 8 }, r = { "Rhag Garmaçon", "Rhag Garmason", 1437, 50, 18.2 }, obj = "Rapporter Ordres de Deepfury", oe = "Bring Deepfury's Orders" }
D[633] = { t = "Le viaduc de Thandol", nv = 31, min = 28, te = "The Thandol Span", av = 632, g = { "Rhag Garmaçon", "Rhag Garmason", 1437, 50, 18.2 }, r = { "Rhag Garmaçon", "Rhag Garmason", 1437, 50, 18.2 }, obj = "Activer Cache d'explosifs", oe = "Use Cache of Explosives" }
D[634] = { t = "L'appel à l'Alliance", nv = 31, min = 28, te = "Plea To The Alliance", av = 633, g = { "Rhag Garmaçon", "Rhag Garmason", 1437, 50, 18.2 } }
D[638] = { t = "Trollemort", nv = 37, min = 32, te = "Trollbane", g = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 } }
D[639] = { t = "Le cachet de Strom", nv = 37, min = 32, te = "Sigil of Strom", g = { "Zengu", "Zengu", 1417, 73.8, 34 }, r = { "Zengu", "Zengu", 1417, 73.8, 34 }, c = { 1417, 27.6, 63 }, obj = "Rapporter Glyphe de Strom", oe = "Bring Sigil of Strom" }
D[640] = { t = "Le cachet qui fut brisé", nv = 40, min = 32, te = "The Broken Sigil", av = 639, g = { "Zengu", "Zengu", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, c = { 1417, 23.7, 59.9 }, obj = "Rapporter 5 × Fragment de glyphe", oe = "Bring 5 × Sigil Fragment" }
D[641] = { t = "Le cachet de Thoradin", nv = 40, min = 32, te = "Sigil of Thoradin", av = 640, g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Zengu", "Zengu", 1417, 73.8, 34 }, obj = "Rapporter Glyphe de Thoradin", oe = "Bring Sigil of Thoradin" }
D[642] = { t = "La princesse emprisonnée", nv = 37, min = 30, te = "The Princess Trapped", g = { "Fragments de Myzrael", "Shards of Myzrael", 1417, 62.5, 33.7 }, r = { "Fragments iridescents", "Iridescent Shards", 1417, 84.3, 31 }, c = { 1417, 81, 35.7 }, obj = "Rapporter 12 × Poussières de Myzrael", oe = "Bring 12 × Mote of Myzrael" }
D[643] = { t = "Le cachet d'Arathor", nv = 41, min = 32, te = "Sigil of Arathor", av = 641, g = { "Zengu", "Zengu", 1417, 73.8, 34 }, r = { "Zengu", "Zengu", 1417, 73.8, 34 }, c = { 1417, 33.5, 52.1 }, obj = "Rapporter Glyphe d'Arathor", oe = "Bring Sigil of Arathor" }
D[644] = { t = "Le cachet de Trollemort", nv = 42, min = 32, te = "Sigil of Trollbane", av = 643, g = { "Zengu", "Zengu", 1417, 73.8, 34 }, r = { "Zengu", "Zengu", 1417, 73.8, 34 }, c = { 1417, 28.4, 58.1 }, obj = "Rapporter Glyphe de Trollbane", oe = "Bring Sigil of Trollbane" }
D[645] = { t = "Trol'kalar", nv = 42, min = 32, av = 644, g = { "Zengu", "Zengu", 1417, 73.8, 34 }, r = { "Tombeau de Trollemort", "Trollbane's Tomb", 1417, 28.9, 59.6 }, obj = "Rapporter Glyphe d'Ignaeus", oe = "Bring Sigil of Ignaeus" }
D[646] = { t = "Trol'kalar", nv = 42, min = 32, av = 645, g = { "Tombeau de Trollemort", "Trollbane's Tomb", 1417, 28.9, 59.6 }, r = { "Zengu", "Zengu", 1417, 73.8, 34 }, obj = "Rapporter Trol'kalar en fourreau", oe = "Bring Sheathed Trol'kalar" }
D[647] = { t = "Le tord-boyaux de MacKreel", nv = 30, min = 28, te = "MacKreel's Moonshine", g = { "Foggy MacKreel", "Foggy MacKreel", 1437, 51.3, 8 }, obj = "Rapporter Tord-boyaux de MacKreel", oe = "Bring MacKreel's Moonshine" }
D[648] = { t = "À la rescousse de OOX-17/TN !", nv = 48, min = 43, te = "Rescue OOX-17/TN!", av = 351, g = { "Robot guidé OOX-17/TN", "Homing Robot OOX-17/TN", 1446, 60.2, 64.7 } }
D[651] = { t = "Les pierres de lien", nv = 38, min = 30, te = "Stones of Binding", av = 642, g = { "Fragments iridescents", "Iridescent Shards", 1417, 84.3, 31 }, r = { "Pierre de Lien Intérieure", "Stone of Inner Binding", 1417, 36.2, 57.4 }, c = { 1417, 25.8, 30.7 }, obj = "Rapporter Clé ardente ; Rapporter Clé armoriée ; Rapporter Clé de tonnerre", oe = "Bring Burning Key ; Bring Cresting Key ; Bring Thundering Key" }
D[652] = { t = "La Pierre cruciale", nv = 42, min = 30, te = "Breaking the Keystone", av = 651, g = { "Pierre de Lien Intérieure", "Stone of Inner Binding", 1417, 36.2, 57.4 }, r = { "Clé cruciale", "Keystone", 1417, 36.2, 57.4 }, c = { 1417, 67.7, 37.7 }, obj = "Rapporter Bâtonnet de l'ordre", oe = "Bring Rod of Order" }
D[653] = { t = "Les alliés de Myzrael", nv = 40, min = 30, te = "Myzrael's Allies", av = 652, g = { "Clé cruciale", "Keystone", 1417, 36.2, 57.4 } }
D[655] = { t = "Trépas-d'Orgrim", nv = 34, min = 29, te = "Hammerfall", g = { "Gor'mul", "Gor'mul", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 } }
D[656] = { t = "L'invocation de la Princesse", nv = 50, min = 30, te = "Summoning the Princess", av = 692, g = { "Theldurin l'Egaré", "Theldurin the Lost", 1418, 51.4, 76.9 }, obj = "Rapporter Chaînes indicibles", oe = "Bring Eldritch Shackles" }
D[657] = { t = "Les indices d'une Peste nouvelle ?", nv = 36, min = 30, te = "Hints of a New Plague?", av = 658, g = { "Quae", "Quae", 1417, 60.2, 53.8 }, r = { "Kinelory", "Kinelory", 1417, 60.2, 53.8 } }
D[658] = { t = "Les indices d'une Peste nouvelle ?", nv = 36, min = 30, te = "Hints of a New Plague?", av = 659, g = { "Quae", "Quae", 1417, 60.2, 53.8 }, r = { "Quae", "Quae", 1417, 60.2, 53.8 }, c = { 1417, 52.5, 61.5 }, obj = "Rapporter Documents scellés", oe = "Bring Sealed Folder" }
D[659] = { t = "Les indices d'une Peste nouvelle ?", nv = 33, min = 30, te = "Hints of a New Plague?", g = { "Phin Odelic", "Phin Odelic", 1424, 49.5, 58.7 } }
D[660] = { t = "Les indices d'une Peste nouvelle ?", nv = 37, min = 30, te = "Hints of a New Plague?", av = 657, g = { "Kinelory", "Kinelory", 1417, 60.2, 53.8 }, r = { "Quae", "Quae", 1417, 60.2, 53.8 } }
D[661] = { t = "Les indices d'une Peste nouvelle ?", nv = 37, min = 30, te = "Hints of a New Plague?", av = 660, g = { "Quae", "Quae", 1417, 60.2, 53.8 } }
D[662] = { t = "Sauvetage en haute mer", nv = 40, min = 35, te = "Deep Sea Salvage", av = 663, g = { "Second Nilzlix", "First Mate Nilzlix", 1417, 32.8, 81.5 }, r = { "Second Nilzlix", "First Mate Nilzlix", 1417, 32.8, 81.5 }, c = { 1417, 21.8, 85.1 }, obj = "Rapporter Cartes de la Folie de la Vierge ; Rapporter Journal de la Folie de la Vierge ; Rapporter Cartes de l'Esprit des Pins argentés ; Rapporter Journal de l'Esprit des Pins argentés", oe = "Bring Maiden's Folly Charts ; Bring Maiden's Folly Log ; Bring Spirit of Silverpine Charts ; Bring Spirit of Silverpine Log" }
D[663] = { t = "Terre !", nv = 35, min = 35, te = "Land Ho!", g = { "Lolo le Guetteur", "Lolo the Lookout", 1417, 32.8, 81.5 }, r = { "Shakes O'Breen", "Shakes O'Breen", 1417, 32.8, 81.5 } }
D[664] = { t = "Chagrin noyé", nv = 40, min = 35, te = "Drowned Sorrows", g = { "Capitaine Tripacier", "Captain Steelgut", 1417, 32.8, 81.5 }, r = { "Capitaine Tripacier", "Captain Steelgut", 1417, 32.8, 81.5 }, c = { 1417, 21.9, 87.6 }, obj = "Vaincre 10 × Ecumeur Daguéchine ; Vaincre 3 × Sorcière Daguéchine", oe = "Kill 10 × Daggerspine Raider ; Kill 3 × Daggerspine Sorceress" }
D[665] = { t = "Le trésor englouti", nv = 40, min = 35, te = "Sunken Treasure", g = { "Professeur Phloppenthrope", "Professor Phizzlethorpe", 1417, 32.8, 81.5 }, r = { "Docteur Draunessieu", "Doctor Draxlegauge", 1417, 32.8, 81.5 } }
D[666] = { t = "Le trésor englouti", nv = 40, min = 35, te = "Sunken Treasure", av = 665, g = { "Docteur Draunessieu", "Doctor Draxlegauge", 1417, 32.8, 81.5 }, r = { "Docteur Draunessieu", "Doctor Draxlegauge", 1417, 32.8, 81.5 }, c = { 1417, 21.7, 88.3 }, obj = "Rapporter 10 × Gemme elfique ; Rapporter Lunettes de chasse aux gemmes", oe = "Bring 10 × Elven Gem ; Bring Goggles of Gem Hunting" }
D[667] = { t = "La mort venue d'en bas", nv = 44, min = 35, te = "Death From Below", av = 670, g = { "Shakes O'Breen", "Shakes O'Breen", 1417, 32.8, 81.5 }, r = { "Shakes O'Breen", "Shakes O'Breen", 1417, 32.8, 81.5 } }
D[668] = { t = "Le trésor englouti", nv = 40, min = 35, te = "Sunken Treasure", av = 666, g = { "Docteur Draunessieu", "Doctor Draxlegauge", 1417, 32.8, 81.5 }, r = { "Shakes O'Breen", "Shakes O'Breen", 1417, 32.8, 81.5 }, obj = "Rapporter Gemmes elfiques", oe = "Bring Elven Gems" }
D[669] = { t = "Le trésor englouti", nv = 40, min = 35, te = "Sunken Treasure", av = 668, g = { "Shakes O'Breen", "Shakes O'Breen", 1417, 32.8, 81.5 }, obj = "Rapporter Echantillon de gemme elfique", oe = "Bring Sample Elven Gem" }
D[670] = { t = "Le trésor englouti", nv = 40, min = 35, te = "Sunken Treasure", av = 669, g = { "Amiral Corne-de-mer", "Fleet Master Seahorn", 1434, 27, 77.1 }, obj = "Rapporter Lettre scellée de Seahorn", oe = "Bring Seahorn's Sealed Letter" }
D[671] = { t = "Magies immondes", nv = 33, min = 30, te = "Foul Magics", g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, c = { 1417, 31.6, 28.3 }, obj = "Rapporter 10 × Amulette de pierre de sang", oe = "Bring 10 × Bloodstone Amulet" }
D[672] = { t = "L'éveil de l'esprit", nv = 34, min = 29, te = "Raising Spirits", av = 655, g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, c = { 1417, 41.9, 45.2 }, obj = "Rapporter 10 × Oeil de raptor des hautes-terres", oe = "Bring 10 × Highland Raptor Eye" }
D[673] = { t = "Magies immondes", nv = 40, min = 35, te = "Foul Magics", av = 671, g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, c = { 1417, 29.6, 63 }, obj = "Rapporter Orbe de pierre de sang souillé", oe = "Bring Befouled Bloodstone Orb" }
D[674] = { t = "L'éveil de l'esprit", nv = 34, min = 29, te = "Raising Spirits", av = 672, g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Gor'mul", "Gor'mul", 1417, 73.8, 34 }, obj = "Rapporter Amulette de Griffe du raptor", oe = "Bring Raptor Talon Amulet" }
D[675] = { t = "L'éveil de l'esprit", nv = 34, min = 29, te = "Raising Spirits", av = 674, g = { "Gor'mul", "Gor'mul", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 } }
D[676] = { t = "Menace sur le Trépas-d'Orgrim", nv = 32, min = 30, te = "The Hammer May Fall", g = { "Suif", "Tallow", 1424, 62.3, 20.5 }, obj = "Vaincre 8 × Ogre Rochepoing ; Vaincre 10 × Massacreur Rochepoing", oe = "Kill 8 × Boulderfist Ogre ; Kill 10 × Boulderfist Enforcer" }
D[677] = { t = "L'appel du combat", nv = 32, min = 30, te = "Call to Arms", av = 676, g = { "Drum Lagangrène", "Drum Fel", 1417, 73.8, 34 }, r = { "Drum Lagangrène", "Drum Fel", 1417, 73.8, 34 }, c = { 1417, 66.1, 71.1 }, obj = "Vaincre 10 × Lanceur de haches fânécorce ; Vaincre 10 × Chasseur de têtes fânécorce ; Vaincre 8 × Féticheur fânécorce", oe = "Kill 10 × Witherbark Axe Thrower ; Kill 10 × Witherbark Headhunter ; Kill 8 × Witherbark Witch Doctor" }
D[678] = { t = "L'appel du combat", nv = 38, min = 30, te = "Call to Arms", av = 677, g = { "Drum Lagangrène", "Drum Fel", 1417, 73.8, 34 }, r = { "Drum Lagangrène", "Drum Fel", 1417, 73.8, 34 }, c = { 1417, 53, 76 }, obj = "Vaincre 10 × Brute Rochepoing ; Vaincre 4 × Magus Rochepoing", oe = "Kill 10 × Boulderfist Brute ; Kill 4 × Boulderfist Magus" }
D[679] = { t = "L'appel du combat", nv = 40, min = 30, te = "Call to Arms", av = 678, g = { "Drum Lagangrène", "Drum Fel", 1417, 73.8, 34 }, r = { "Drum Lagangrène", "Drum Fel", 1417, 73.8, 34 }, c = { 1417, 19.7, 67.6 }, obj = "Vaincre 7 × Chaman Rochepoing ; Vaincre 3 × Seigneur Rochepoing", oe = "Kill 7 × Boulderfist Shaman ; Kill 3 × Boulderfist Lord" }
D[680] = { t = "La réelle menace", nv = 40, min = 30, te = "The Real Threat", av = 678, g = { "Korin Lagangrène", "Korin Fel", 1417, 73.8, 34 }, r = { "Korin Lagangrène", "Korin Fel", 1417, 73.8, 34 }, c = { 1417, 19.6, 66.6 }, obj = "Rapporter Tête d'Or'Kalar", oe = "Bring Or'Kalar's Head" }
D[682] = { t = "Les écussons de Stromgarde", nv = 37, min = 30, te = "Stromgarde Badges", av = 681, g = { "Capitaine Nials", "Captain Nials", 1417, 45.8, 47.6 }, r = { "Capitaine Nials", "Captain Nials", 1417, 45.8, 47.6 }, c = { 1417, 27.6, 63 }, obj = "Rapporter 7 × Insigne de Stromgarde", oe = "Bring 7 × Stromgarde Badge" }
D[684] = { t = "On recherche : Marez Capuche", nv = 39, min = 30, te = "Wanted!  Marez Cowl", g = { "Tableau des recherches", "Wanted Board", 1417, 45.8, 47.6 }, r = { "Capitaine Nials", "Captain Nials", 1417, 45.8, 47.6 }, c = { 1417, 29.6, 63 }, obj = "Rapporter Tête de Marez", oe = "Bring Marez's Head" }
D[685] = { t = "On recherche : Otto et Lépervier", nv = 40, min = 30, te = "Wanted!  Otto and Falconcrest", g = { "Tableau des recherches", "Wanted Board", 1417, 45.8, 47.6 }, r = { "Capitaine Nials", "Captain Nials", 1417, 45.8, 47.6 }, c = { 1417, 26.2, 65.6 }, obj = "Rapporter Tête d'Otto ; Rapporter Tête de Falconcrest", oe = "Bring Otto's Head ; Bring Falconcrest's Head" }
D[687] = { t = "Theldurin l’Egaré", nv = 40, min = 30, te = "Theldurin the Lost", g = { "Zaruk", "Zaruk", 1417, 73.8, 34 } }
D[688] = { t = "Les alliés de Myzrael", nv = 40, min = 30, te = "Myzrael's Allies", av = 652, g = { "Clé cruciale", "Keystone", 1417, 36.2, 57.4 }, r = { "Zaruk", "Zaruk", 1417, 73.8, 34 } }
D[691] = { t = "Valoir son poids en or", nv = 36, min = 30, te = "Worth Its Weight in Gold", g = { "Apprenti Kryten", "Apprentice Kryten", 1417, 45.8, 47.6 }, r = { "Apprenti Kryten", "Apprentice Kryten", 1417, 45.8, 47.6 }, c = { 1417, 66.6, 72 }, obj = "Rapporter 10 × Défense de Witherbark ; Rapporter 4 × Bourse-médecine Witherbark ; Rapporter Couteau de chasseur d'ombre", oe = "Bring 10 × Witherbark Tusk ; Bring 4 × Witherbark Medicine Pouch ; Bring Shadow Hunter Knife" }
D[692] = { t = "Les fragments perdus", nv = 41, min = 30, te = "The Lost Fragments", av = 687, g = { "Theldurin l'Egaré", "Theldurin the Lost", 1418, 51.4, 76.9 }, r = { "Theldurin l'Egaré", "Theldurin the Lost", 1418, 51.4, 76.9 }, obj = "Rapporter Fragment de parchemin déchiré ; Rapporter Fragment de parchemin fripé ; Rapporter Fragment de parchemin noirci", oe = "Bring Torn Scroll Fragment ; Bring Crumpled Scroll Fragment ; Bring Singed Scroll Fragment" }
D[693] = { t = "La baguette au poing", nv = 39, min = 30, te = "Wand over Fist", av = 691, g = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 }, r = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 }, c = { 1417, 54.8, 81.9 }, obj = "Rapporter Baguette d'invocation de Trelane", oe = "Bring Trelane's Wand of Invocation" }
D[694] = { t = "Les défenses de Trelane", nv = 39, min = 30, te = "Trelane's Defenses", av = 693, g = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 }, r = { "Apprenti Kryten", "Apprentice Kryten", 1417, 45.8, 47.6 }, c = { 1417, 19.7, 67.6 }, obj = "Rapporter Agate azur", oe = "Bring Azure Agate" }
D[695] = { t = "Enchantement d'Apprenti", nv = 39, min = 30, te = "An Apprentice's Enchantment", av = 694, g = { "Apprenti Kryten", "Apprentice Kryten", 1417, 45.8, 47.6 }, r = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 } }
D[696] = { t = "Attaque sur la tour", nv = 39, min = 30, te = "Attack on the Tower", av = 695, g = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 }, r = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 }, c = { 1417, 18.2, 68.1 }, obj = "Rapporter Phylactère de Trelane ; Rapporter Orbe de Trelane ; Rapporter Agate de braise de Trelane", oe = "Bring Trelane's Phylactery ; Bring Trelane's Orb ; Bring Trelane's Ember Agate" }
D[697] = { t = "La demande de Malin", nv = 39, min = 30, te = "Malin's Request", av = 696, g = { "Skuerto", "Skuerto", 1417, 45.8, 47.6 }, obj = "Rapporter Lettre scellée pour l'archimage Malin", oe = "Bring Sealed Letter to Archmage Malin" }
D[698] = { t = "Petit bonus du soir", nv = 40, min = 35, te = "Lack of Surplus", g = { "Dar", "Dar", 1435, 44.7, 57.2 }, r = { "Tok'Kar", "Tok'Kar", 1435, 81.3, 81 }, c = { 1435, 54.5, 41.1 }, obj = "Rapporter 8 × Flanc de Dents-de-scie non préparé", oe = "Bring 8 × Unprepared Sawtooth Flank" }
D[699] = { t = "Petit bonus du soir", nv = 42, min = 35, te = "Lack of Surplus", av = 698, g = { "Tok'Kar", "Tok'Kar", 1435, 81.3, 81 }, r = { "Tok'Kar", "Tok'Kar", 1435, 81.3, 81 }, c = { 1435, 80.2, 19.6 }, obj = "Rapporter 6 × Griffe de Mordeur Dents-de-scie", oe = "Bring 6 × Sawtooth Snapper Claw" }
D[701] = { t = "La ruse du raptor", nv = 37, min = 29, te = "Guile of the Raptor", av = 675, g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, c = { 1417, 51.6, 67.7 }, obj = "Rapporter 12 × Coeur de raptor", oe = "Bring 12 × Raptor Heart" }
D[702] = { t = "La ruse du raptor", nv = 37, min = 29, te = "Guile of the Raptor", av = 701, g = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 }, r = { "Gor'mul", "Gor'mul", 1417, 73.8, 34 }, obj = "Rapporter Orbe de Tor'gan", oe = "Bring Tor'gan's Orb" }
D[703] = { t = "Ailes de busard grillées", nv = 40, min = 33, te = "Barbecued Buzzard Wings", g = { "Rigglefuzz", "Rigglefuzz", 1418, 42.4, 52.9 }, r = { "Rigglefuzz", "Rigglefuzz", 1418, 42.4, 52.9 }, c = { 1418, 15.3, 61.3 }, obj = "Rapporter 4 × Aile de busard", oe = "Bring 4 × Buzzard Wing" }
D[705] = { t = "Pêche aux perles", nv = 37, min = 30, te = "Pearl Diving", g = { "Rigglefuzz", "Rigglefuzz", 1418, 42.4, 52.9 }, r = { "Rigglefuzz", "Rigglefuzz", 1418, 42.4, 52.9 }, obj = "Rapporter 9 × Perle bleue", oe = "Bring 9 × Blue Pearl" }
D[706] = { t = "Enchantements d'éclats flamboyants", nv = 45, min = 40, te = "Fiery Blaze Enchantments", g = { "Sigrun Taillefer", "Sigrun Ironhew", 1418, 53.8, 43.3 }, r = { "Sigrun Taillefer", "Sigrun Ironhew", 1418, 53.8, 43.3 }, c = { 1418, 78.7, 53.3 }, obj = "Rapporter Coeur de drake noir", oe = "Bring Black Drake's Heart" }
D[710] = { t = "Étude des éléments : la roche", nv = 37, min = 35, te = "Study of the Elements: Rock", g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, c = { 1418, 19.1, 43.3 }, obj = "Rapporter 10 × Petit éclat de pierre", oe = "Bring 10 × Small Stone Shard" }
D[711] = { t = "Étude des éléments : la roche", nv = 39, min = 35, te = "Study of the Elements: Rock", av = 710, g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, c = { 1418, 39.7, 76 }, obj = "Rapporter 3 × Grand bloc de pierre", oe = "Bring 3 × Large Stone Slab" }
D[712] = { t = "Étude des éléments : la roche", nv = 42, min = 35, te = "Study of the Elements: Rock", av = 711, g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, c = { 1418, 13.8, 86.5 }, obj = "Rapporter 5 × Brassards de Liaison de pierre", oe = "Bring 5 × Bracers of Rock Binding" }
D[713] = { t = "La tête froide l'emporte toujours", nv = 37, min = 35, te = "Coolant Heads Prevail", g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, obj = "Rapporter Huile glaciale", oe = "Bring Frost Oil" }
D[714] = { t = "Un gyro... quoi ?", nv = 37, min = 35, te = "Gyro... What?", av = 713, g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, obj = "Rapporter Gyrochronatome", oe = "Bring Gyrochronatom" }
D[715] = { t = "Pierre liquide", nv = 37, min = 35, te = "Liquid Stone", av = 714, g = { "Lucien Torsaclef", "Lucien Tosselwrench", 1418, 25.9, 44.9 }, r = { "Lucien Torsaclef", "Lucien Tosselwrench", 1418, 25.9, 44.9 }, obj = "Rapporter Potion de soins ; Rapporter Potion d'Invisibilité inférieure", oe = "Bring Healing Potion ; Bring Lesser Invisibility Potion" }
D[716] = { t = "Mieux est la pierre que le tissu", nv = 42, min = 35, te = "Stone Is Better than Cloth", av = 712, g = { "Lucien Torsaclef", "Lucien Tosselwrench", 1418, 25.9, 44.9 }, r = { "Lucien Torsaclef", "Lucien Tosselwrench", 1418, 25.9, 44.9 }, obj = "Rapporter Brassards guillochés en bronze", oe = "Bring Patterned Bronze Bracers" }
D[717] = { t = "Tremblement de terre", nv = 50, min = 40, te = "Tremors of the Earth", av = 732, g = { "Garek", "Garek", 1418, 61.9, 54.3 }, r = { "Garek", "Garek", 1418, 61.9, 54.3 }, c = { 1418, 12.6, 75.5 }, obj = "Rapporter Liens de Cinglenoir ; Rapporter Entraves de Hematus ; Rapporter Signe de la Terre", oe = "Bring Blacklash's Bindings ; Bring Chains of Hematus ; Bring Sign of the Earth" }
D[718] = { t = "Mirages", nv = 38, min = 35, g = { "Sigrun Taillefer", "Sigrun Ironhew", 1418, 53.8, 43.3 }, r = { "Sigrun Taillefer", "Sigrun Ironhew", 1418, 53.8, 43.3 }, c = { 1418, 66.9, 23.5 }, obj = "Rapporter Caisse de fournitures", oe = "Bring Supply Crate" }
D[719] = { t = "Un nain et ses outils", nv = 35, min = 35, te = "A Dwarf and His Tools", g = { "Prospecteur Ryedol", "Prospector Ryedol", 1418, 53.8, 43.3 }, r = { "Prospecteur Ryedol", "Prospector Ryedol", 1418, 53.8, 43.3 }, c = { 1418, 44.9, 31 }, obj = "Rapporter Piolet porte-bonheur de Ryedol", oe = "Bring Ryedol's Lucky Pick" }
D[720] = { t = "Un signe d'espoir", nv = 35, min = 35, te = "A Sign of Hope", g = { "Carte chiffonnée", "Crumpled Map", 1418, 53, 33.9 }, r = { "Prospecteur Ryedol", "Prospector Ryedol", 1418, 53.8, 43.3 } }
D[724] = { t = "Espérance en la foi", nv = 40, min = 35, te = "Prospect of Faith", av = 723, g = { "Prospecteur Ryedol", "Prospector Ryedol", 1418, 53.8, 43.3 }, obj = "Rapporter Amulette de Hammertoe", oe = "Bring Hammertoe's Amulet" }
D[727] = { t = "L'Abrégé de Yagyin à Forgefer", nv = 40, min = 30, te = "To Ironforge for Yagyin's Digest", av = 709, g = { "Theldurin l'Egaré", "Theldurin the Lost", 1418, 51.4, 76.9 }, obj = "Rapporter Glyphe du Marteau", oe = "Bring Sigil of the Hammer" }
D[728] = { t = "L'Abrégé de Yagyin à Fossoyeuse", nv = 40, min = 30, te = "To the Undercity for Yagyin's Digest", av = 709, g = { "Theldurin l'Egaré", "Theldurin the Lost", 1418, 51.4, 76.9 }, obj = "Rapporter Glyphe du Marteau", oe = "Bring Sigil of the Hammer" }
D[729] = { t = "Les absences du prospecteur", nv = 20, min = 15, te = "The Absent Minded Prospector", g = { "Archéologue Hollee", "Archaeologist Hollee", 1439, 37.4, 41.8 }, r = { "Prospecteur Songerrance", "Prospector Remtravel", 1439, 35.7, 83.7 } }
D[731] = { t = "Les absences du prospecteur", nv = 20, min = 15, te = "The Absent Minded Prospector", av = 729, g = { "Prospecteur Songerrance", "Prospector Remtravel", 1439, 35.7, 83.7 }, r = { "Archéologue Hollee", "Archaeologist Hollee", 1439, 37.4, 41.8 } }
D[732] = { t = "Tremblement de terre", nv = 43, min = 40, te = "Tremors of the Earth", av = 718, g = { "Garek", "Garek", 1418, 61.9, 54.3 }, r = { "Garek", "Garek", 1418, 61.9, 54.3 }, c = { 1418, 12.6, 75.5 }, obj = "Rapporter Signe de la Terre", oe = "Bring Sign of the Earth" }
D[733] = { t = "Demandes variées", nv = 40, min = 35, te = "Scrounging", av = 718, g = { "Sigrun Taillefer", "Sigrun Ironhew", 1418, 53.8, 43.3 }, r = { "Sigrun Taillefer", "Sigrun Ironhew", 1418, 53.8, 43.3 }, c = { 1418, 10, 79.1 }, obj = "Rapporter 7 × Morceaux de métal", oe = "Bring 7 × Scrap Metal" }
D[734] = { t = "Grandes difficultés", nv = 42, min = 35, te = "This Is Going to Be Hard", g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lucien Torsaclef", "Lucien Tosselwrench", 1418, 25.9, 44.9 } }
D[739] = { t = "Murdaloc", nv = 42, min = 30, av = 738, g = { "Squelette de nain décrépi", "Battered Dwarven Skeleton", 1418, 50.9, 62.4 }, c = { 1418, 50.5, 68.5 }, obj = "Vaincre Murdaloc ; Vaincre 12 × Briseur d'os Cavepierre", oe = "Kill Murdaloc ; Kill 12 × Stonevault Bonesnapper" }
D[741] = { t = "Les absences du prospecteur", nv = 20, min = 15, te = "The Absent Minded Prospector", av = 731, g = { "Archéologue Hollee", "Archaeologist Hollee", 1439, 37.4, 41.8 }, obj = "Rapporter Mystérieux fossile", oe = "Bring Mysterious Fossil" }
D[743] = { t = "Le danger des Furies-des-vents", nv = 8, min = 5, te = "Dangers of the Windfury", g = { "Ruul Serre-d'aigle", "Ruul Eagletalon", 1412, 46.5, 64.9 }, r = { "Ruul Serre-d'aigle", "Ruul Eagletalon", 1412, 46.5, 64.9 }, c = { 1412, 34.9, 48.4 }, obj = "Rapporter 8 × Serre de Furie-des-vents", oe = "Bring 8 × Windfury Talon" }
D[745] = { t = "Partager la terre", nv = 6, min = 1, te = "Sharing the Land", g = { "Baine Sabot-de-sang", "Baine Bloodhoof", 1412, 46.5, 64.9 }, r = { "Baine Sabot-de-sang", "Baine Bloodhoof", 1412, 46.5, 64.9 }, c = { 1412, 49.7, 73.6 }, obj = "Vaincre 10 × Tanneur crin-pâle ; Vaincre 8 × Ecorcheur crin-pâle ; Vaincre 5 × Braconnier crin-pâle", oe = "Kill 10 × Palemane Tanner ; Kill 8 × Palemane Skinner ; Kill 5 × Palemane Poacher" }
D[746] = { t = "Les fouilles des nains", nv = 8, min = 6, te = "Dwarven Digging", g = { "Baine Sabot-de-sang", "Baine Bloodhoof", 1412, 46.5, 64.9 }, r = { "Baine Sabot-de-sang", "Baine Bloodhoof", 1412, 46.5, 64.9 }, obj = "Rapporter 5 × Outils cassés", oe = "Bring 5 × Broken Tools" }
D[747] = { t = "La chasse commence", nv = 2, min = 1, te = "The Hunt Begins", g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, c = { 1412, 46.8, 81.1 }, obj = "Rapporter 7 × Viande de trotteur des plaines ; Rapporter 7 × Plume de trotteur des plaines", oe = "Bring 7 × Plainstrider Meat ; Bring 7 × Plainstrider Feather" }
D[748] = { t = "L'eau empoisonnée", nv = 5, min = 4, te = "Poison Water", g = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, r = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, c = { 1412, 41.6, 67.1 }, obj = "Rapporter 6 × Patte de loup des prairies ; Rapporter 4 × Serre de trotteur des plaines", oe = "Bring 6 × Prairie Wolf Paw ; Bring 4 × Plainstrider Talon" }
D[749] = { t = "La caravane dévastée", nv = 8, min = 5, te = "The Ravaged Caravan", g = { "Morin Traqueur-de-nuage", "Morin Cloudstalker", 1412, 54.8, 64.3 }, r = { "Caisse de ravitaillements scellée", "Sealed Supply Crate", 1412, 51.9, 53.4 } }
D[750] = { t = "La chasse continue", nv = 3, min = 1, te = "The Hunt Continues", av = 747, g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, c = { 1412, 47.3, 88.2 }, obj = "Rapporter 10 × Peau de puma des montagnes", oe = "Bring 10 × Mountain Cougar Pelt" }
D[751] = { t = "La caravane dévastée", nv = 8, min = 5, te = "The Ravaged Caravan", av = 749, g = { "Caisse de ravitaillements scellée", "Sealed Supply Crate", 1412, 51.9, 53.4 }, r = { "Morin Traqueur-de-nuage", "Morin Cloudstalker", 1412, 54.8, 64.3 }, obj = "Rapporter Documents de la KapitalRisk", oe = "Bring Venture Co. Documents" }
D[752] = { t = "Une humble contribution", nv = 2, min = 1, te = "A Humble Task", g = { "Chef Vent-du-faucon", "Chief Hawkwind", 1412, 44.5, 77.5 }, r = { "Grand-mère Vent-du-faucon", "Greatmother Hawkwind", 1412, 48.8, 80.9 } }
D[753] = { t = "Une humble contribution", nv = 3, min = 1, te = "A Humble Task", av = 752, g = { "Grand-mère Vent-du-faucon", "Greatmother Hawkwind", 1412, 48.8, 80.9 }, r = { "Chef Vent-du-faucon", "Chief Hawkwind", 1412, 44.5, 77.5 }, c = { 1412, 49, 81.3 }, obj = "Rapporter Cruche d'eau", oe = "Bring Water Pitcher" }
D[754] = { t = "La purification de Sabot-d'hiver", nv = 6, min = 4, te = "Winterhoof Cleansing", av = 748, g = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, r = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 } }
D[755] = { t = "Les rites de la Terre-mère", nv = 3, min = 1, te = "Rites of the Earthmother", av = 753, g = { "Chef Vent-du-faucon", "Chief Hawkwind", 1412, 44.5, 77.5 }, r = { "Voyant Langue-grise", "Seer Graytongue", 1412, 42.5, 90.1 } }
D[756] = { t = "Le totem de Corne-tonnerre", nv = 7, min = 4, te = "Thunderhorn Totem", av = 754, g = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, r = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, c = { 1412, 51.5, 48 }, obj = "Rapporter 6 × Griffes de Traqueur ; Rapporter 6 × Griffes de puma", oe = "Bring 6 × Stalker Claws ; Bring 6 × Cougar Claws" }
D[757] = { t = "Le rite de force", nv = 4, min = 1, te = "Rite of Strength", av = 755, g = { "Voyant Langue-grise", "Seer Graytongue", 1412, 42.5, 90.1 }, r = { "Chef Vent-du-faucon", "Chief Hawkwind", 1412, 44.5, 77.5 }, c = { 1412, 57.1, 80.2 }, obj = "Rapporter 12 × Ceinture de Dos-hirsute", oe = "Bring 12 × Bristleback Belt" }
D[758] = { t = "La purification de Corne-tonnerre", nv = 8, min = 4, te = "Thunderhorn Cleansing", av = 756, g = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, r = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 } }
D[759] = { t = "Le totem de Crin-sauvage", nv = 10, min = 4, te = "Wildmane Totem", av = 758, g = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, r = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, c = { 1412, 52.4, 34.5 }, obj = "Rapporter 8 × Dent d'Alpha des prairies", oe = "Bring 8 × Prairie Alpha Tooth" }
D[760] = { t = "La purification de Crin-sauvage", nv = 10, min = 4, te = "Wildmane Cleansing", av = 759, g = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 }, r = { "Mull Corne-tonnerre", "Mull Thunderhorn", 1412, 46.5, 64.9 } }
D[761] = { t = "Chasse aux rapaces", nv = 6, min = 4, te = "Swoop Hunting", g = { "Harken Totem-de-vent", "Harken Windtotem", 1412, 46.5, 64.9 }, r = { "Harken Totem-de-vent", "Harken Windtotem", 1412, 46.5, 64.9 }, c = { 1412, 49.3, 49 }, obj = "Rapporter 8 × Plume de Rapace trophée", oe = "Bring 8 × Trophy Swoop Quill" }
D[763] = { t = "Les rites de la Terre-mère", nv = 5, min = 1, te = "Rites of the Earthmother", av = 757, g = { "Chef Vent-du-faucon", "Chief Hawkwind", 1412, 44.5, 77.5 }, r = { "Baine Sabot-de-sang", "Baine Bloodhoof", 1412, 46.5, 64.9 }, obj = "Rapporter Totem de Hawkwind", oe = "Bring Totem of Hawkwind" }
D[764] = { t = "La KapitalRisk", nv = 10, min = 5, te = "The Venture Co.", av = 751, g = { "Morin Traqueur-de-nuage", "Morin Cloudstalker", 1412, 54.8, 64.3 }, r = { "Morin Traqueur-de-nuage", "Morin Cloudstalker", 1412, 54.8, 64.3 }, c = { 1412, 58.9, 48.5 }, obj = "Vaincre 14 × Ouvrier de la KapitalRisk ; Vaincre 6 × Superviseur de la KapitalRisk", oe = "Kill 14 × Venture Co. Worker ; Kill 6 × Venture Co. Supervisor" }
D[765] = { t = "Le superviseur Vibrouage", nv = 12, min = 5, te = "Supervisor Fizsprocket", av = 751, g = { "Morin Traqueur-de-nuage", "Morin Cloudstalker", 1412, 54.8, 64.3 }, r = { "Morin Traqueur-de-nuage", "Morin Cloudstalker", 1412, 54.8, 64.3 }, c = { 1412, 61.2, 49.3 }, obj = "Rapporter Ecritoire de Fizsprocket", oe = "Bring Fizsprocket's Clipboard" }
D[766] = { t = "Mazzranache", nv = 8, min = 5, g = { "Maur Mande-pluie", "Maur Raincaller", 1412, 46.2, 60.8 }, r = { "Maur Mande-pluie", "Maur Raincaller", 1412, 46.2, 60.8 }, c = { 1412, 41.6, 67.1 }, obj = "Rapporter Coeur de loup des prairies ; Rapporter Fémur de puma des basses plaines ; Rapporter Ecaille de trotteur des plaines ; Rapporter Gésier de Rapace", oe = "Bring Prairie Wolf Heart ; Bring Flatland Cougar Femur ; Bring Plainstrider Scale ; Bring Swoop Gizzard" }
D[767] = { t = "Le rite de vision", nv = 6, min = 3, te = "Rite of Vision", av = 763, g = { "Baine Sabot-de-sang", "Baine Bloodhoof", 1412, 46.5, 64.9 }, r = { "Zarlman Deux-Lunes", "Zarlman Two-Moons", 1412, 46.5, 64.9 } }
D[771] = { t = "Le rite de vision", nv = 7, min = 3, te = "Rite of Vision", av = 767, g = { "Zarlman Deux-Lunes", "Zarlman Two-Moons", 1412, 46.5, 64.9 }, r = { "Zarlman Deux-Lunes", "Zarlman Two-Moons", 1412, 46.5, 64.9 }, c = { 1412, 49.2, 68.2 }, obj = "Rapporter 2 × Pierre de puits ; Rapporter 2 × Pomme de pin", oe = "Bring 2 × Well Stone ; Bring 2 × Ambercorn" }
D[772] = { t = "Le Rite de vision", nv = 7, min = 3, te = "Rite of Vision", av = 771, g = { "Zarlman Deux-Lunes", "Zarlman Two-Moons", 1412, 46.5, 64.9 } }
D[775] = { t = "Un voyage aux Pitons-du-Tonnerre", nv = 10, min = 3, te = "Journey into Thunder Bluff", av = 773, g = { "Esprit ancestral", "Ancestral Spirit", 1412, 58.3, 30.7 } }
D[777] = { t = "Grandes difficultés", nv = 42, min = 35, te = "This Is Going to Be Hard", av = 734, g = { "Lucien Torsaclef", "Lucien Tosselwrench", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, obj = "Rapporter Rouage N°5", oe = "Bring Cog #5" }
D[778] = { t = "Ça promet d'être dur", nv = 45, min = 35, te = "This Is Going to Be Hard", av = 777, g = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, r = { "Lotwil Veriatus", "Lotwil Veriatus", 1418, 25.9, 44.9 }, obj = "Rapporter Entraves des élémentaires de Lotwil", oe = "Bring Lotwil's Shackles of Elemental Binding" }
D[780] = { t = "Les sangliers de guerre apprivoisés", nv = 4, min = 1, te = "The Battleboars", av = 750, g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, c = { 1412, 54.3, 81.8 }, obj = "Rapporter 8 × Groin de sanglier de guerre ; Rapporter 8 × Flanc de sanglier de guerre", oe = "Bring 8 × Battleboar Snout ; Bring 8 × Battleboar Flank" }
D[782] = { t = "Alliances rompues", nv = 43, min = 40, te = "Broken Alliances", g = { "Gorn", "Gorn", 1427, 82, 36.7 }, r = { "Gorn", "Gorn", 1427, 82, 36.7 }, obj = "Rapporter Signe de la Terre", oe = "Bring Sign of the Earth" }
D[783] = { t = "Menace intérieure", nv = 1, min = 1, te = "A Threat Within", g = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, r = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 } }
D[784] = { t = "Vaincre les traîtres", nv = 7, min = 3, te = "Vanquish the Betrayers", g = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, r = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, c = { 1411, 58, 56.1 }, obj = "Vaincre 10 × Marin de Kul Tiras ; Vaincre 8 × Soldat de marine de Kul Tiras ; Vaincre Lieutenant Benedict", oe = "Kill 10 × Kul Tiras Sailor ; Kill 8 × Kul Tiras Marine ; Kill Lieutenant Benedict" }
D[786] = { t = "Déjouer l'agression des Kolkar", nv = 8, min = 5, te = "Thwarting Kolkar Aggression", g = { "Lar Fouinebroche", "Lar Prowltusk", 1411, 54.2, 73.3 }, r = { "Lar Fouinebroche", "Lar Prowltusk", 1411, 54.2, 73.3 }, c = { 1411, 47.9, 79.2 }, obj = "Activer Plan d'attaque : Vallée des Épreuves ; Activer Plan d'attaque : Village de Sen’jin ; Activer Plan d'attaque : Orgrimmar", oe = "Use Attack Plan: Valley of Trials ; Use Attack Plan: Sen'jin Village ; Use Attack Plan: Orgrimmar" }
D[788] = { t = "La dent tranchante", nv = 2, min = 1, te = "Cutting Teeth", g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, c = { 1411, 44.6, 65.8 }, obj = "Vaincre 10 × Sanglier tacheté", oe = "Kill 10 × Mottled Boar" }
D[789] = { t = "L'aiguillon du scorpide", nv = 3, min = 1, te = "Sting of the Scorpid", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, c = { 1411, 43, 61.5 }, obj = "Rapporter 10 × Queue de scorpide ouvrier", oe = "Bring 10 × Scorpid Worker Tail" }
D[790] = { t = "Sarkoth", nv = 5, min = 1, g = { "Hana'zua", "Hana'zua", 1411, 40.6, 62.6 }, r = { "Hana'zua", "Hana'zua", 1411, 40.6, 62.6 }, c = { 1411, 40.5, 66.8 }, obj = "Rapporter Pince abîmée de Sarkoth", oe = "Bring Sarkoth's Mangled Claw" }
D[791] = { t = "Assumer ses responsabilités", nv = 7, min = 4, te = "Carry Your Weight", g = { "Furl Morguefront", "Furl Scornbrow", 1411, 51.9, 43.5 }, r = { "Furl Morguefront", "Furl Scornbrow", 1411, 51.9, 43.5 }, c = { 1411, 58.3, 56.7 }, obj = "Rapporter 8 × Morceaux de canevas", oe = "Bring 8 × Canvas Scraps" }
D[793] = { t = "Alliances rompues", nv = 50, min = 40, te = "Broken Alliances", av = 782, g = { "Gorn", "Gorn", 1427, 82, 36.7 }, r = { "Gorn", "Gorn", 1427, 82, 36.7 }, obj = "Rapporter Liens de Cinglenoir ; Rapporter Entraves de Hematus ; Rapporter Signe de la Terre", oe = "Bring Blacklash's Bindings ; Bring Chains of Hematus ; Bring Sign of the Earth" }
D[794] = { t = "Le médaillon de la Lame ardente", nv = 5, min = 1, te = "Burning Blade Medallion", g = { "Zureetha Mireloin", "Zureetha Fargaze", 1411, 42.1, 68.3 }, r = { "Zureetha Mireloin", "Zureetha Fargaze", 1411, 42.1, 68.3 }, c = { 1411, 42.7, 53 }, obj = "Rapporter Médaillon de la Lame ardente", oe = "Bring Burning Blade Medallion" }
D[804] = { t = "Sarkoth", nv = 5, min = 1, av = 790, g = { "Hana'zua", "Hana'zua", 1411, 40.6, 62.6 }, r = { "Gornek", "Gornek", 1411, 42.1, 68.3 } }
D[805] = { t = "Faire un rapport au Village de Sen'jin", nv = 5, min = 1, te = "Report to Sen'jin Village", av = 794, g = { "Zureetha Mireloin", "Zureetha Fargaze", 1411, 42.1, 68.3 }, r = { "Maître Gadrin", "Master Gadrin", 1411, 54.2, 73.3 } }
D[806] = { t = "De sombres orages", nv = 12, min = 4, te = "Dark Storms", av = 823, g = { "Orgnil Marque-l'âme", "Orgnil Soulscar", 1411, 51.9, 43.5 }, r = { "Orgnil Marque-l'âme", "Orgnil Soulscar", 1411, 51.9, 43.5 }, c = { 1411, 42.1, 26.7 }, obj = "Rapporter Griffe de Fizzle", oe = "Bring Fizzle's Claw" }
D[808] = { t = "Le crâne de Minshina", nv = 9, min = 4, te = "Minshina's Skull", g = { "Maître Gadrin", "Master Gadrin", 1411, 54.2, 73.3 }, r = { "Maître Gadrin", "Master Gadrin", 1411, 54.2, 73.3 }, c = { 1411, 67.5, 87.8 }, obj = "Rapporter Crâne de Minshina", oe = "Bring Minshina's Skull" }
D[812] = { t = "Besoin d'un remède", nv = 9, min = 7, te = "Need for a Cure", g = { "Rhinag", "Rhinag", 1411, 41.5, 18.6 }, r = { "Rhinag", "Rhinag", 1411, 41.5, 18.6 }, obj = "Rapporter Antidote du queue-venin", oe = "Bring Venomtail Antidote" }
D[815] = { t = "Des œufs pour l'omelette", nv = 8, min = 6, te = "Break a Few Eggs", g = { "Cuisinier Torka", "Cook Torka", 1411, 51.9, 43.5 }, r = { "Cuisinier Torka", "Cook Torka", 1411, 51.9, 43.5 }, c = { 1411, 68.2, 74.7 }, obj = "Rapporter 3 × Oeuf de fouette-queue", oe = "Bring 3 × Taillasher Egg" }
D[816] = { t = "L'égaré", nv = 11, min = 8, te = "Lost But Not Forgotten", g = { "Misha Tor'kren", "Misha Tor'kren", 1411, 43.1, 30.2 }, r = { "Misha Tor'kren", "Misha Tor'kren", 1411, 43.1, 30.2 }, c = { 1411, 34.9, 31.6 }, obj = "Rapporter Amulette de Kron", oe = "Bring Kron's Amulet" }
D[817] = { t = "Proie nécessaire", nv = 8, min = 5, te = "Practical Prey", g = { "Vel'rin Croc", "Vel'rin Fang", 1411, 54.2, 73.3 }, r = { "Vel'rin Croc", "Vel'rin Fang", 1411, 54.2, 73.3 }, c = { 1411, 62.8, 87.9 }, obj = "Rapporter 4 × Fourrure de tigre de Durotar", oe = "Bring 4 × Durotar Tiger Fur" }
D[818] = { t = "Un esprit parfaitement éduqué", nv = 7, min = 5, te = "A Solvent Spirit", g = { "Maître Vornal", "Master Vornal", 1411, 54.2, 73.3 }, r = { "Maître Vornal", "Master Vornal", 1411, 54.2, 73.3 }, c = { 1411, 64.2, 74.6 }, obj = "Rapporter 4 × Oeil de makrura intact ; Rapporter 8 × Mucus de clampant", oe = "Bring 4 × Intact Makrura Eye ; Bring 8 × Crawler Mucus" }
D[821] = { t = "Tonneau vide de Chen", nv = 15, min = 11, te = "Chen's Empty Keg", av = 819, g = { "Brasseur Drohn", "Brewmaster Drohn", 1413, 62.3, 38.4 }, r = { "Brasseur Drohn", "Brewmaster Drohn", 1413, 62.3, 38.4 }, c = { 1413, 51.4, 19.4 }, obj = "Rapporter 5 × Canine de lion des savanes ; Rapporter 5 × Rognon de trotteur des plaines ; Rapporter Corne de lézard-tonnerre", oe = "Bring 5 × Savannah Lion Tusk ; Bring 5 × Plainstrider Kidney ; Bring Thunder Lizard Horn" }
D[823] = { t = "Un rapport à Orgnil", nv = 7, min = 4, te = "Report to Orgnil", g = { "Maître Gadrin", "Master Gadrin", 1411, 54.2, 73.3 }, r = { "Orgnil Marque-l'âme", "Orgnil Soulscar", 1411, 51.9, 43.5 } }
D[824] = { t = "Je'neu du Cercle terrestre", nv = 27, min = 23, te = "Je'neu of the Earthen Ring", av = 1918, g = { "Mastok Torvesiffle", "Mastok Wrilehiss", 1440, 73.7, 60 }, r = { "Je'neu Sancrea", "Je'neu Sancrea", 1440, 11.9, 34.5 }, c = { 1440, 45.9, 70.6 }, obj = "Rapporter Globe d'eau souillée", oe = "Bring Befouled Water Globe" }
D[825] = { t = "Des épaves", nv = 8, min = 3, te = "From The Wreckage....", av = 784, g = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, r = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, c = { 1411, 63.4, 55.7 }, obj = "Rapporter 3 × Outils gnomes", oe = "Bring 3 × Gnomish Tools" }
D[826] = { t = "Zalazane", nv = 10, min = 4, g = { "Maître Gadrin", "Master Gadrin", 1411, 54.2, 73.3 }, r = { "Maître Gadrin", "Master Gadrin", 1411, 54.2, 73.3 }, c = { 1411, 67.4, 85.8 }, obj = "Rapporter Tête de Zalazane ; Vaincre 8 × Troll maléficié ; Vaincre 8 × Troll vaudou", oe = "Bring Zalazane's Head ; Kill 8 × Hexed Troll ; Kill 8 × Voodoo Troll" }
D[827] = { t = "Le rocher du Crâne", nv = 12, min = 4, te = "Skull Rock", av = 828, g = { "Margoz", "Margoz", 1411, 56.4, 20 }, r = { "Margoz", "Margoz", 1411, 56.4, 20 }, c = { 1411, 52.8, 27 }, obj = "Rapporter 6 × Collier brûlant", oe = "Bring 6 × Searing Collar" }
D[828] = { t = "Margoz", nv = 12, min = 4, av = 806, g = { "Orgnil Marque-l'âme", "Orgnil Soulscar", 1411, 51.9, 43.5 }, r = { "Margoz", "Margoz", 1411, 56.4, 20 } }
D[829] = { t = "Neeru Lamefeu", nv = 12, min = 4, te = "Neeru Fireblade", av = 827, g = { "Margoz", "Margoz", 1411, 56.4, 20 }, obj = "Rapporter Spécimen de collier", oe = "Bring Example Collar" }
D[831] = { t = "Les ordres de l'amiral", nv = 7, min = 1, te = "The Admiral's Orders", av = 830, g = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, obj = "Rapporter Ordres de l'amiral Proudmoore", oe = "Bring Admiral Proudmoore's Orders" }
D[833] = { t = "Le cimetière sacré", nv = 10, min = 7, te = "A Sacred Burial", g = { "Gardien du savoir Totem-de-pluie", "Lorekeeper Raintotem", 1412, 57, 34.5 }, r = { "Gardien du savoir Totem-de-pluie", "Lorekeeper Raintotem", 1412, 57, 34.5 }, c = { 1412, 58.2, 30.9 }, obj = "Vaincre 8 × Intrus Dos-hirsute", oe = "Kill 8 × Bristleback Interloper" }
D[834] = { t = "Des vents dans le désert", nv = 9, min = 7, te = "Winds in the Desert", g = { "Rezlak", "Rezlak", 1411, 46.4, 22.9 }, r = { "Rezlak", "Rezlak", 1411, 46.4, 22.9 }, c = { 1411, 49.3, 28.4 }, obj = "Rapporter 5 × Sac de ravitaillement", oe = "Bring 5 × Sack of Supplies" }
D[835] = { t = "Des lignes sécurisées", nv = 11, min = 7, te = "Securing the Lines", av = 834, g = { "Rezlak", "Rezlak", 1411, 46.4, 22.9 }, r = { "Rezlak", "Rezlak", 1411, 46.4, 22.9 }, c = { 1411, 53.2, 24.2 }, obj = "Vaincre 12 × Terrevent sauvage ; Vaincre 8 × Sorcière des tempêtes Terrevent", oe = "Kill 12 × Dustwind Savage ; Kill 8 × Dustwind Storm Witch" }
D[836] = { t = "À la rescousse de OOX-09/HL !", nv = 48, min = 43, te = "Rescue OOX-09/HL!", av = 485, g = { "Robot guidé OOX-09/HL", "Homing Robot OOX-09/HL", 1425, 49.4, 37.7 } }
D[837] = { t = "Empiètement", nv = 10, min = 6, te = "Encroachment", g = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, r = { "Gar'Thok", "Gar'Thok", 1411, 51.9, 43.5 }, c = { 1411, 45.4, 50.6 }, obj = "Vaincre 4 × Huran Tranchecrin ; Vaincre 4 × Eclaireur Tranchecrin ; Vaincre 4 × Lève-poussière Tranchecrin ; Vaincre 4 × Garde de guerre Tranchecrin", oe = "Kill 4 × Razormane Quilboar ; Kill 4 × Razormane Scout ; Kill 4 × Razormane Dustrunner ; Kill 4 × Razormane Battleguard" }
D[838] = { t = "Scholomance", nv = 55, min = 55, av = 5098, g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Apothicaire Dithers", "Apothecary Dithers", 1422, 26.5, 56 } }
D[840] = { t = "Sous les drapeaux de la Horde", nv = 12, min = 10, te = "Conscript of the Horde", g = { "Takrin Cherchevoie", "Takrin Pathseeker", 1411, 51.9, 43.5 }, r = { "Kargal Balafre-glorieuse", "Kargal Battlescar", 1411, 32.6, 42.7 }, obj = "Rapporter Lettre de recrutement", oe = "Bring Recruitment Letter" }
D[842] = { t = "Conscription à la Croisée", nv = 12, min = 10, te = "Crossroads Conscription", av = 840, g = { "Kargal Balafre-glorieuse", "Kargal Battlescar", 1411, 32.6, 42.7 }, obj = "Rapporter Lettre de recrutement signée", oe = "Bring Signed Recruitment Letter" }
D[843] = { t = "La reconquête de Gann", nv = 23, min = 17, te = "Gann's Reclamation", g = { "Gann Cime-de-pierre", "Gann Stonespire", 1413, 45.9, 77 }, r = { "Gann Cime-de-pierre", "Gann Stonespire", 1413, 45.9, 77 }, c = { 1413, 47.6, 85.4 }, obj = "Rapporter Journal de Khazgorm ; Vaincre 15 × Excavateur de Bael'dun ; Vaincre 5 × Contremaître de Bael'dun", oe = "Bring Khazgorm's Journal ; Kill 15 × Bael'dun Excavator ; Kill 5 × Bael'dun Foreman" }
D[844] = { t = "La menace des trotteurs des plaines", nv = 12, min = 10, te = "Plainstrider Menace", g = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, r = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, c = { 1413, 52.1, 27.6 }, obj = "Rapporter 7 × Bec de trotteur des plaines", oe = "Bring 7 × Plainstrider Beak" }
D[845] = { t = "Les zhévras", nv = 13, min = 10, te = "The Zhevra", av = 844, g = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, r = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, c = { 1413, 45.2, 30.7 }, obj = "Rapporter 4 × Sabots de zhévra", oe = "Bring 4 × Zhevra Hooves" }
D[846] = { t = "La revanche de Gann", nv = 26, min = 17, te = "Revenge of Gann", av = 843, g = { "Gann Cime-de-pierre", "Gann Stonespire", 1413, 45.9, 77 }, r = { "Gann Cime-de-pierre", "Gann Stonespire", 1413, 45.9, 77 }, c = { 1413, 48.2, 84.8 }, obj = "Rapporter 6 × Nitroglycérine ; Rapporter 6 × Pulpe de bois ; Rapporter 6 × Nitrate de sodium", oe = "Bring 6 × Nitroglycerin ; Bring 6 × Wood Pulp ; Bring 6 × Sodium Nitrate" }
D[847] = { t = "La ruse du raptor", nv = 37, min = 29, te = "Guile of the Raptor", av = 702, g = { "Gor'mul", "Gor'mul", 1417, 73.8, 34 }, r = { "Tor'gan", "Tor'gan", 1417, 73.8, 34 } }
D[848] = { t = "Spores fongiques", nv = 15, min = 10, te = "Fungal Spores", g = { "Apothicaire Helbrim", "Apothecary Helbrim", 1413, 52.2, 31 }, r = { "Apothicaire Helbrim", "Apothecary Helbrim", 1413, 52.2, 31 }, c = { 1413, 48.7, 40.3 }, obj = "Rapporter 4 × Spores fongiques", oe = "Bring 4 × Fungal Spores" }
D[849] = { t = "La revanche de Gann", nv = 26, min = 17, te = "Revenge of Gann", av = 846, g = { "Gann Cime-de-pierre", "Gann Stonespire", 1413, 45.9, 77 }, r = { "Gann Cime-de-pierre", "Gann Stonespire", 1413, 45.9, 77 }, c = { 1413, 47, 85.6 }, obj = "Activer Machine volante de Bael Modan", oe = "Use Bael Modan Flying Machine" }
D[850] = { t = "Les chefs des Kolkars", nv = 16, min = 11, te = "Kolkar Leaders", g = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, r = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, c = { 1413, 42.8, 23.5 }, obj = "Rapporter Tête de Plaie-des-kodos", oe = "Bring Kodobane's Head" }
D[851] = { t = "Verog le Derviche", nv = 18, min = 11, te = "Verog the Dervish", av = 850, g = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, r = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, obj = "Rapporter Tête de Verog", oe = "Bring Verog's Head" }
D[852] = { t = "Hezrul Marque-de-sang", nv = 19, min = 11, te = "Hezrul Bloodmark", av = 851, g = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, r = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, c = { 1413, 46, 41.1 }, obj = "Rapporter Tête d'Hezrul", oe = "Bring Hezrul's Head" }
D[853] = { t = "L'apothicaire Zamah", nv = 15, min = 10, te = "Apothecary Zamah", av = 848, g = { "Apothicaire Helbrim", "Apothecary Helbrim", 1413, 52.2, 31 }, obj = "Rapporter Spores fondues", oe = "Bring Rendered Spores" }
D[854] = { t = "Un voyage à la Croisée", nv = 12, min = 9, te = "Journey to the Crossroads", g = { "Kirge Corne-sévère", "Kirge Sternhorn", 1412, 71.6, 63.7 } }
D[855] = { t = "Les bracelets de centaure", nv = 14, min = 9, te = "Centaur Bracers", g = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, r = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, c = { 1413, 52.6, 41.2 }, obj = "Rapporter 15 × Bracelets de centaure", oe = "Bring 15 × Centaur Bracers" }
D[857] = { t = "La larme des lunes", nv = 30, min = 22, te = "The Tear of the Moons", g = { "Feegly l'Exilé", "Feegly the Exiled", 1413, 49, 86.3 }, r = { "Feegly l'Exilé", "Feegly the Exiled", 1413, 49, 86.3 }, c = { 1413, 49.1, 84.3 }, obj = "Rapporter Larme des lunes", oe = "Bring Tear of the Moons" }
D[858] = { t = "Contact", nv = 18, min = 13, te = "Ignition", g = { "Déchiqueteur de Crackelevier", "Wizzlecrank's Shredder", 1413, 56.5, 7.5 }, r = { "Déchiqueteur de Crackelevier", "Wizzlecrank's Shredder", 1413, 56.5, 7.5 }, c = { 1413, 56.3, 8.6 }, obj = "Rapporter Clé de contact", oe = "Bring Ignition Key" }
D[861] = { t = "Le chemin du chasseur", nv = 10, min = 10, te = "The Hunter's Way", g = { "Skorn Nuage-blanc", "Skorn Whitecloud", 1412, 46.5, 64.9 }, c = { 1412, 44, 24.3 }, obj = "Rapporter 4 × Griffe de Rôdeur des basses plaines", oe = "Bring 4 × Flatland Prowler Claw" }
D[862] = { t = "Brouet de rat", nv = 23, min = 15, te = "Dig Rat Stew", g = { "Boustiff'", "Grub", 1413, 52.2, 31 }, r = { "Boustiff'", "Grub", 1413, 52.2, 31 }, c = { 1413, 48.6, 84.6 }, obj = "Rapporter 8 × Rat fouisseur", oe = "Bring 8 × Dig Rat" }
D[863] = { t = "La fuite", nv = 18, min = 13, te = "The Escape", av = 858, g = { "Déchiqueteur de Crackelevier", "Wizzlecrank's Shredder", 1413, 56.5, 7.5 }, r = { "Krachevalve", "Sputtervalve", 1413, 63, 37.2 } }
D[864] = { t = "De retour vers l'apothicaire Zinge", nv = 46, min = 38, te = "Return to Apothecary Zinge", av = 654, g = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, obj = "Rapporter Trousse d'analyse de terrain verrouillée", oe = "Bring Sealed Field Testing Kit" }
D[865] = { t = "La corne, c'est le pied", nv = 18, min = 13, te = "Raptor Horns", g = { "Mebok Mizzyrix", "Mebok Mizzyrix", 1413, 63, 37.2 }, r = { "Mebok Mizzyrix", "Mebok Mizzyrix", 1413, 63, 37.2 }, c = { 1413, 52.3, 48.6 }, obj = "Rapporter 5 × Corne de raptor intacte", oe = "Bring 5 × Intact Raptor Horn" }
D[866] = { t = "Les échantillons de racines", nv = 16, min = 9, te = "Root Samples", g = { "Mebok Mizzyrix", "Mebok Mizzyrix", 1413, 63, 37.2 }, r = { "Mebok Mizzyrix", "Mebok Mizzyrix", 1413, 63, 37.2 }, c = { 1413, 50, 26.1 }, obj = "Rapporter 8 × Echantillon de racines", oe = "Bring 8 × Root Sample" }
D[867] = { t = "Les harpies pillardes", nv = 15, min = 12, te = "Harpy Raiders", g = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, r = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, c = { 1413, 39.6, 15.8 }, obj = "Rapporter 8 × Griffe d'Ensorçaile", oe = "Bring 8 × Witchwing Talon" }
D[868] = { t = "La chasse aux œufs", nv = 22, min = 17, te = "Egg Hunt", g = { "Korran", "Korran", 1413, 52.2, 31 }, r = { "Korran", "Korran", 1413, 52.2, 31 }, c = { 1413, 45.1, 70.6 }, obj = "Rapporter 12 × Oeuf de silithide ; Rapporter Griffe d'excavation", oe = "Bring 12 × Silithid Egg ; Bring Digging Claw" }
D[869] = { t = "Sur la piste du voleur", nv = 13, min = 9, te = "Raptor Thieves", g = { "Gazrog", "Gazrog", 1413, 52.2, 31 }, r = { "Gazrog", "Gazrog", 1413, 52.2, 31 }, c = { 1413, 55.3, 15.1 }, obj = "Rapporter 12 × Tête de raptor", oe = "Bring 12 × Raptor Head" }
D[870] = { t = "Les bassins Oubliés", nv = 13, min = 10, te = "The Forgotten Pools", g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, r = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 } }
D[871] = { t = "La défense du poste de Guet-Lointain", nv = 12, min = 9, te = "Disrupt the Attacks", g = { "Thork", "Thork", 1413, 52.2, 31 }, r = { "Thork", "Thork", 1413, 52.2, 31 }, c = { 1413, 57.2, 25.3 }, obj = "Vaincre 8 × Sourcier Tranchecrin ; Vaincre 8 × Tisseuse d'épines Tranchecrin ; Vaincre 3 × Chasseur Tranchecrin", oe = "Kill 8 × Razormane Water Seeker ; Kill 8 × Razormane Thornweaver ; Kill 3 × Razormane Hunter" }
D[872] = { t = "L'offensive du poste de Guet-Lointain", nv = 15, min = 9, te = "The Disruption Ends", av = 871, g = { "Thork", "Thork", 1413, 52.2, 31 }, r = { "Thork", "Thork", 1413, 52.2, 31 }, c = { 1413, 58.4, 25.9 }, obj = "Rapporter Défense de Kreenig Grondegroin ; Vaincre 8 × Géomancienne Tranchecrin ; Vaincre 8 × Défenseur Tranchecrin", oe = "Bring Kreenig Snarlsnout's Tusk ; Kill 8 × Razormane Geomancer ; Kill 8 × Razormane Defender" }
D[873] = { t = "Isha Awak", nv = 27, min = 10, av = 874, g = { "Mahren Oeil-des-cieux", "Mahren Skyseer", 1413, 65.8, 43.9 }, r = { "Mahren Oeil-des-cieux", "Mahren Skyseer", 1413, 65.8, 43.9 }, c = { 1413, 63.5, 53.9 }, obj = "Rapporter Coeur d'Isha Awak", oe = "Bring Heart of Isha Awak" }
D[874] = { t = "Mahren Œil-des-cieux", nv = 27, min = 9, te = "Mahren Skyseer", av = 913, g = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, r = { "Mahren Oeil-des-cieux", "Mahren Skyseer", 1413, 65.8, 43.9 } }
D[875] = { t = "Lieutenants harpies", nv = 16, min = 12, te = "Harpy Lieutenants", av = 867, g = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, r = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, c = { 1413, 39.2, 14.5 }, obj = "Rapporter 6 × Anneau de lieutenant harpie", oe = "Bring 6 × Harpy Lieutenant Ring" }
D[876] = { t = "Serena Plumesang", nv = 20, min = 12, te = "Serena Bloodfeather", av = 875, g = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, r = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, c = { 1413, 39.2, 12.2 }, obj = "Rapporter Tête de Serena", oe = "Bring Serena's Head" }
D[877] = { t = "L'oasis Stagnante", nv = 16, min = 10, te = "The Stagnant Oasis", av = 870, g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, r = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, c = { 1413, 55.6, 42.7 }, obj = "Utiliser Graines de plante sur Fissure bouillonnante", oe = "Use Plant Seeds on Bubbling Fissure" }
D[878] = { t = "Tribus en guerre", nv = 21, min = 14, te = "Tribes at War", g = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, r = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, c = { 1413, 47.4, 53.6 }, obj = "Vaincre 6 × Sourcier Dos-hirsute ; Vaincre 12 × Tisseur d'épines Dos-hirsute ; Vaincre 12 × Géomancienne Dos-hirsute", oe = "Kill 6 × Bristleback Water Seeker ; Kill 12 × Bristleback Thornweaver ; Kill 12 × Bristleback Geomancer" }
D[879] = { t = "Une trahison de l'intérieur", nv = 25, min = 17, te = "Betrayal from Within", av = 5052, g = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, r = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, c = { 1413, 43, 81.3 }, obj = "Rapporter Crâne de Kuz ; Rapporter Crâne de Nak ; Rapporter Crâne de Lok", oe = "Bring Kuz's Skull ; Bring Nak's Skull ; Bring Lok's Skull" }
D[880] = { t = "Source de vie", nv = 16, min = 10, te = "Altered Beings", av = 877, g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, r = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, c = { 1413, 46.5, 39.6 }, obj = "Rapporter 8 × Carapace de Gueule d'acier altérée", oe = "Bring 8 × Altered Snapjaw Shell" }
D[881] = { t = "Echeyakee", nv = 16, min = 10, av = 903, g = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, r = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, obj = "Rapporter Peau d'Echeyakee", oe = "Bring Echeyakee's Hide" }
D[882] = { t = "Ishamuhale", nv = 19, min = 10, av = 3261, g = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, r = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, obj = "Rapporter Croc d'Ishamuhale", oe = "Bring Ishamuhale's Fang" }
D[887] = { t = "Les flibustiers des mers du Sud", nv = 14, min = 9, te = "Southsea Freebooters", g = { "Gazleu", "Gazlowe", 1411, 33.4, 75 }, r = { "Gazleu", "Gazlowe", 1411, 33.4, 75 }, obj = "Vaincre 12 × Brigand des mers du Sud ; Vaincre 6 × Canonnier des mers du Sud", oe = "Kill 12 × Southsea Brigand ; Kill 6 × Southsea Cannoneer" }
D[888] = { t = "Course à la lentille", nv = 16, min = 9, te = "Stolen Booty", av = 892, g = { "Gazleu", "Gazlowe", 1411, 33.4, 75 }, r = { "Gazleu", "Gazlowe", 1411, 33.4, 75 }, obj = "Rapporter Cargaison de bottes ; Rapporter Lentille du télescope", oe = "Bring Shipment of Boots ; Bring Telescopic Lens" }
D[890] = { t = "La livraison perdue", nv = 14, min = 9, te = "The Missing Shipment", av = 887, g = { "Gazleu", "Gazlowe", 1411, 33.4, 75 }, obj = "Rapporter Livre de compte de Gazlowe", oe = "Bring Gazlowe's Ledger" }
D[891] = { t = "La vengeance d'un capitaine", nv = 20, min = 13, te = "The Guns of Northwatch", g = { "Capitaine Thalo'thas Brillesoleil", "Captain Thalo'thas Brightsun", 1413, 62.3, 38.4 }, r = { "Capitaine Thalo'thas Brillesoleil", "Captain Thalo'thas Brightsun", 1413, 62.3, 38.4 }, c = { 1413, 61.6, 54 }, obj = "Rapporter 10 × Médaille de Theramore ; Vaincre Capitaine Beaumont ; Vaincre Canonnier Whessan ; Vaincre Canonnier Smythe", oe = "Bring 10 × Theramore Medal ; Kill Captain Fairmount ; Kill Cannoneer Whessan ; Kill Cannoneer Smythe" }
D[892] = { t = "La livraison perdue", nv = 14, min = 9, te = "The Missing Shipment", av = 890, g = { "Maître des quais Tournoupette", "Wharfmaster Dizzywig", 1413, 63, 37.2 }, obj = "Rapporter Livre de compte de Gazlowe", oe = "Bring Gazlowe's Ledger" }
D[893] = { t = "Des armes de choix", nv = 24, min = 17, te = "Weapons of Choice", g = { "Tatternack Forgacier", "Tatternack Steelforge", 1413, 44.9, 59.1 }, r = { "Tatternack Forgacier", "Tatternack Steelforge", 1413, 44.9, 59.1 }, c = { 1413, 43.2, 81.8 }, obj = "Rapporter Poignard de Tranchecrin ; Rapporter Baguette Tranchecrin carbonisée ; Rapporter Bouclier Tranchecrin", oe = "Bring Razormane Backstabber ; Bring Charred Razormane Wand ; Bring Razormane War Shield" }
D[894] = { t = "Samophlange", nv = 14, min = 10, g = { "Krachevalve", "Sputtervalve", 1413, 63, 37.2 }, r = { "Console de contrôle", "Control Console", 1413, 52.4, 11.6 } }
D[895] = { t = "ON RECHERCHE : cap'taine Garvey", nv = 16, min = 11, te = "WANTED: Baron Longshore", g = { "AVIS DE RECHERCHE", "WANTED", 1413, 63, 37.2 }, c = { 1413, 63.9, 48.1 }, obj = "Rapporter Tête du baron de Longrivage", oe = "Bring Baron Longshore's Head" }
D[896] = { t = "La bonne fortune d'un mineur pauvre", nv = 18, min = 13, te = "Miner's Fortune", g = { "Maître des quais Tournoupette", "Wharfmaster Dizzywig", 1413, 63, 37.2 }, r = { "Maître des quais Tournoupette", "Wharfmaster Dizzywig", 1413, 63, 37.2 }, c = { 1413, 61.4, 5.3 }, obj = "Rapporter Emeraude oeil-de-chat", oe = "Bring Cats Eye Emerald" }
D[898] = { t = "Hors du fort", nv = 20, min = 13, te = "Free From the Hold", g = { "Gilthares Ramefeu", "Gilthares Firebough", 1413, 62, 55 }, r = { "Capitaine Thalo'thas Brillesoleil", "Captain Thalo'thas Brightsun", 1413, 62.3, 38.4 } }
D[899] = { t = "Consumé par la haine", nv = 20, min = 14, te = "Consumed by Hatred", g = { "Mankrik", "Mankrik", 1413, 52.2, 31 }, r = { "Mankrik", "Mankrik", 1413, 52.2, 31 }, c = { 1413, 47.4, 53.3 }, obj = "Rapporter 60 × Défense de huran Dos-hirsute", oe = "Bring 60 × Bristleback Quilboar Tusk" }
D[900] = { t = "Samophlange", nv = 14, min = 10, av = 894, g = { "Console de contrôle", "Control Console", 1413, 52.4, 11.6 }, r = { "Console de contrôle", "Control Console", 1413, 52.4, 11.6 }, c = { 1413, 52.3, 11.6 }, obj = "Activer Valve de contrôle principale ; Activer Valve de contrôle du carburant ; Activer Valve de réglage", oe = "Use Main Control Valve ; Use Fuel Control Valve ; Use Regulator Valve" }
D[901] = { t = "Samophlange", nv = 14, min = 10, av = 900, g = { "Console de contrôle", "Control Console", 1413, 52.4, 11.6 }, r = { "Console de contrôle", "Control Console", 1413, 52.4, 11.6 }, c = { 1413, 52.8, 10.4 }, obj = "Rapporter Clé de la console", oe = "Bring Console Key" }
D[902] = { t = "Samophlange", nv = 16, min = 10, av = 901, g = { "Console de contrôle", "Control Console", 1413, 52.4, 11.6 }, r = { "Krachevalve", "Sputtervalve", 1413, 63, 37.2 }, obj = "Rapporter Samophlange", oe = "Bring Samophlange" }
D[903] = { t = "La chasse aux chasseresses", nv = 15, min = 10, te = "Prowlers of the Barrens", av = 845, g = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, r = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, c = { 1413, 42.1, 28.5 }, obj = "Rapporter 7 × Griffe de Rôdeur", oe = "Bring 7 × Prowler Claws" }
D[905] = { t = "Dans l'antre du raptor", nv = 17, min = 10, te = "The Angry Scytheclaws", av = 881, g = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, r = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, c = { 1413, 52.6, 46.1 }, obj = "Utiliser Plume de raptor sur Blue Raptor Nest ; Utiliser Plume de raptor sur Yellow Raptor Nest ; Utiliser Plume de raptor sur Red Raptor Nest", oe = "Use Raptor Feather on Blue Raptor Nest ; Use Raptor Feather on Yellow Raptor Nest ; Use Raptor Feather on Red Raptor Nest" }
D[906] = { t = "Une trahison de l'intérieur", nv = 25, min = 17, te = "Betrayal from Within", av = 879, g = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, r = { "Thork", "Thork", 1413, 52.2, 31 }, c = { 1413, 40.1, 80.5 }, obj = "Rapporter Crâne de Lok", oe = "Bring Lok's Skull" }
D[907] = { t = "Les lézards-tonnerre enragés", nv = 18, min = 10, te = "Enraged Thunder Lizards", av = 882, g = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, r = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, c = { 1413, 47, 52.5 }, obj = "Rapporter 3 × Sang de lézard-tonnerre", oe = "Bring 3 × Thunder Lizard Blood" }
D[913] = { t = "Le cri du faucon-tonnerre", nv = 20, min = 10, te = "Cry of the Thunderhawk", av = 907, g = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, r = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 }, c = { 1413, 47.7, 56.9 }, obj = "Rapporter Ailes de faucon-tonnerre", oe = "Bring Thunderhawk Wings" }
D[916] = { t = "La corruption des Tissebois", nv = 4, min = 3, te = "Webwood Venom", g = { "Gilshalan Marche-vent", "Gilshalan Windwalker", 1438, 58.7, 44.3 }, r = { "Gilshalan Marche-vent", "Gilshalan Windwalker", 1438, 58.7, 44.3 }, c = { 1438, 57, 29.4 }, obj = "Rapporter 10 × Glande à venin Tissebois", oe = "Bring 10 × Webwood Venom Sac" }
D[917] = { t = "L'œuf d'araignée Tissebois", nv = 5, min = 1, te = "Webwood Egg", av = 916, g = { "Gilshalan Marche-vent", "Gilshalan Windwalker", 1438, 58.7, 44.3 }, r = { "Gilshalan Marche-vent", "Gilshalan Windwalker", 1438, 58.7, 44.3 }, c = { 1438, 57, 26.5 }, obj = "Rapporter Oeuf d'araignée Tissebois", oe = "Bring Webwood Egg" }
D[918] = { t = "Les graines de sylvain", nv = 7, min = 4, te = "Timberling Seeds", av = 997, g = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, r = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, c = { 1438, 56.4, 69.1 }, obj = "Rapporter 8 × Graine de sylvain", oe = "Bring 8 × Timberling Seed" }
D[919] = { t = "Les pousses de sylvain", nv = 7, min = 4, te = "Timberling Sprouts", g = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, r = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, c = { 1438, 56.5, 69 }, obj = "Rapporter 12 × Pousse de sylvain", oe = "Bring 12 × Timberling Sprout" }
D[920] = { t = "Les appels de Tenaron", nv = 5, min = 1, te = "Tenaron's Summons", av = 917, g = { "Gilshalan Marche-vent", "Gilshalan Windwalker", 1438, 58.7, 44.3 }, r = { "Tenaron Poignorage", "Tenaron Stormgrip", 1438, 59.1, 39.4 } }
D[921] = { t = "Teldrassil : la couronne d'Azeroth", nv = 5, min = 1, te = "Crown of the Earth", av = 920, g = { "Tenaron Poignorage", "Tenaron Stormgrip", 1438, 59.1, 39.4 }, r = { "Tenaron Poignorage", "Tenaron Stormgrip", 1438, 59.1, 39.4 }, obj = "Rapporter Fiole de cristal remplie", oe = "Bring Filled Crystal Phial" }
D[922] = { t = "Rellian Vertecime", nv = 7, min = 4, te = "Rellian Greenspyre", av = 918, g = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, c = { 1438, 56.4, 69.1 }, obj = "Rapporter Graine de sylvain", oe = "Bring Timberling Seed" }
D[924] = { t = "La Graine démoniaque", nv = 14, min = 9, te = "The Demon Seed", av = 809, g = { "Ak'Zeloth", "Ak'Zeloth", 1411, 32.6, 42.7 }, r = { "Ak'Zeloth", "Ak'Zeloth", 1411, 32.6, 42.7 }, obj = "Activer L'Autel de feu", oe = "Use The Altar of Fire" }
D[928] = { t = "Teldrassil : transmettre la conscience", nv = 5, min = 1, te = "Crown of the Earth", av = 921, g = { "Tenaron Poignorage", "Tenaron Stormgrip", 1438, 59.1, 39.4 }, r = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, obj = "Rapporter Récipient à moitié plein", oe = "Bring Partially Filled Vessel" }
D[929] = { t = "Teldrassil : le rejet des Aspects", nv = 5, min = 1, te = "Crown of the Earth", av = 928, g = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, r = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, obj = "Rapporter Fiole de jade remplie", oe = "Bring Filled Jade Phial" }
D[930] = { t = "Le fruit luminescent", nv = 10, min = 4, te = "The Glowing Fruit", g = { "Plante aux fruits étranges", "Strange Fruited Plant", 1438, 42.6, 76.2 }, r = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, obj = "Rapporter Fruit luminescent", oe = "Bring Glowing Fruit" }
D[931] = { t = "Les racines chatoyantes", nv = 10, min = 4, te = "The Shimmering Frond", g = { "Plantes aux feuilles étranges", "Strange Fronded Plant", 1438, 34.6, 28.8 }, r = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, obj = "Rapporter Racines flamboyantes", oe = "Bring Shimmering Frond" }
D[932] = { t = "Haine folle", nv = 7, min = 4, te = "Twisted Hatred", g = { "Tallonkai Viveracine", "Tallonkai Swiftroot", 1438, 56, 57.3 }, r = { "Tallonkai Viveracine", "Tallonkai Swiftroot", 1438, 56, 57.3 }, c = { 1438, 52, 50.5 }, obj = "Rapporter Tête de Melenas", oe = "Bring Melenas' Head" }
D[933] = { t = "Teldrassil : l'aube se lève", nv = 9, min = 1, te = "Crown of the Earth", av = 929, g = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, r = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, obj = "Rapporter Fiole de tourmaline remplie", oe = "Bring Filled Tourmaline Phial" }
D[935] = { t = "Les eaux de Teldrassil", nv = 11, min = 1, te = "Crown of the Earth", av = 7383, g = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, obj = "Rapporter Vase rempli", oe = "Bring Filled Vessel" }
D[937] = { t = "La clairière enchantée", nv = 11, min = 6, te = "The Enchanted Glade", g = { "Sentinelle Arynia Eclairciel", "Sentinel Arynia Cloudsbreak", 1438, 38.3, 34.4 }, r = { "Sentinelle Arynia Eclairciel", "Sentinel Arynia Cloudsbreak", 1438, 38.3, 34.4 }, c = { 1438, 34.7, 32.3 }, obj = "Rapporter 6 × Ceinture plumesang", oe = "Bring 6 × Bloodfeather Belt" }
D[938] = { t = "Brume", nv = 12, min = 7, te = "Mist", g = { "Brume", "Mist", 1438, 31.5, 31.6 }, r = { "Sentinelle Arynia Eclairciel", "Sentinel Arynia Cloudsbreak", 1438, 38.3, 34.4 } }
D[940] = { t = "Teldrassil", nv = 11, min = 6, av = 937, g = { "Sentinelle Arynia Eclairciel", "Sentinel Arynia Cloudsbreak", 1438, 38.3, 34.4 }, obj = "Rapporter Ecorce gravée", oe = "Bring Inscribed Bark" }
D[941] = { t = "Une belle plante", nv = 12, min = 9, te = "Planting the Heart", av = 927, g = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, r = { "Pot de Denalan", "Denalan's Planter", 1438, 60.9, 68.5 }, obj = "Rapporter Coeur corrompu", oe = "Bring Tainted Heart" }
D[943] = { t = "Les absences du Prospecteur", nv = 24, min = 15, te = "The Absent Minded Prospector", av = 942, g = { "Archéologue Outrepanse", "Archaeologist Flagongut", 1437, 8.3, 58.6 }, r = { "Archéologue Outrepanse", "Archaeologist Flagongut", 1437, 8.3, 58.6 }, c = { 1437, 29.9, 47.1 }, obj = "Rapporter Pierre de Relu ; Rapporter Fossile de Flagongut", oe = "Bring Stone of Relu ; Bring Flagongut's Fossil" }
D[944] = { t = "Le Glaive du Maître", nv = 17, min = 12, te = "The Master's Glaive", av = 948, g = { "Onu", "Onu", 1439, 43.6, 76.3 }, r = { "Coupe de divination", "Scrying Bowl", 1439, 43.6, 76.3 } }
D[945] = { t = "L'évasion de Therylune", nv = 18, min = 10, te = "Therylune's Escape", g = { "Therylune", "Therylune", 1439, 38.6, 87.3 } }
D[947] = { t = "La caverne aux champignons", nv = 17, min = 12, te = "Cave Mushrooms", g = { "Barithras Lunombrage", "Barithras Moonshade", 1439, 37.4, 41.8 }, r = { "Barithras Lunombrage", "Barithras Moonshade", 1439, 37.4, 41.8 }, c = { 1439, 55.3, 34.8 }, obj = "Rapporter 5 × Pédoncule d'amanite ; Rapporter Amanite phalloïde", oe = "Bring 5 × Scaber Stalk ; Bring Death Cap" }
D[948] = { t = "Onu", nv = 17, min = 12, av = 947, g = { "Barithras Lunombrage", "Barithras Moonshade", 1439, 37.4, 41.8 }, r = { "Onu", "Onu", 1439, 43.6, 76.3 } }
D[950] = { t = "Retourner voir Onu", nv = 17, min = 12, te = "Return to Onu", av = 949, g = { "Twilight Tome", "Twilight Tome", 1439, 35.7, 83.7 }, r = { "Onu", "Onu", 1439, 43.6, 76.3 }, obj = "Rapporter Gribouillages déments", oe = "Bring Insane Scribbles" }
D[951] = { t = "Les Reliques de Mathystra", nv = 20, min = 12, te = "Mathystra Relics", av = 950, g = { "Onu", "Onu", 1439, 43.6, 76.3 }, r = { "Onu", "Onu", 1439, 43.6, 76.3 }, c = { 1439, 59.1, 21.5 }, obj = "Rapporter 6 × Relique de Mathystra", oe = "Bring 6 × Mathystra Relic" }
D[953] = { t = "La chute d'Ameth'Aran", nv = 12, min = 9, te = "The Fall of Ameth'Aran", g = { "Sentinelle Tysha Lamelune", "Sentinel Tysha Moonblade", 1439, 40.3, 59.7 }, r = { "Sentinelle Tysha Lamelune", "Sentinel Tysha Moonblade", 1439, 40.3, 59.7 }, c = { 1439, 43, 60.9 }, obj = "Activer The Lay of Ameth'Aran ; Activer The Fall of Ameth'Aran", oe = "Use The Lay of Ameth'Aran ; Use The Fall of Ameth'Aran" }
D[954] = { t = "Bashal'Aran", nv = 12, min = 7, g = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, r = { "Asterion", "Asterion", 1439, 44.2, 36.3 } }
D[955] = { t = "Bashal'Aran", nv = 12, min = 7, av = 954, g = { "Asterion", "Asterion", 1439, 44.2, 36.3 }, r = { "Asterion", "Asterion", 1439, 44.2, 36.3 }, c = { 1439, 46.3, 37.9 }, obj = "Rapporter 8 × Boucle d'oreille de grell", oe = "Bring 8 × Grell Earring" }
D[956] = { t = "Bashal'Aran", nv = 13, min = 7, av = 955, g = { "Asterion", "Asterion", 1439, 44.2, 36.3 }, r = { "Asterion", "Asterion", 1439, 44.2, 36.3 }, c = { 1439, 46.1, 37.6 }, obj = "Rapporter Ancien sceau de pierre de lune", oe = "Bring Ancient Moonstone Seal" }
D[957] = { t = "Bashal'Aran", nv = 13, min = 7, av = 956, g = { "Asterion", "Asterion", 1439, 44.2, 36.3 }, r = { "Asterion", "Asterion", 1439, 44.2, 36.3 }, c = { 1439, 42.4, 61.8 }, obj = "Activer Flamme antique", oe = "Use Ancient Flame" }
D[958] = { t = "Les outils des Bien-nés", nv = 12, min = 9, te = "Tools of the Highborne", g = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, r = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, c = { 1439, 42.5, 59.7 }, obj = "Rapporter 7 × Relique de bien-Né", oe = "Bring 7 × Highborne Relic" }
D[959] = { t = "Fuite de porto aux docks", nv = 18, min = 14, te = "Trouble at the Docks", g = { "Grutier Bigglefuzz", "Crane Operator Bigglefuzz", 1413, 63, 37.2 }, r = { "Grutier Bigglefuzz", "Crane Operator Bigglefuzz", 1413, 63, 37.2 }, c = { 1413, 45.7, 33.6 }, obj = "Rapporter Porto vieux de 99 ans", oe = "Bring 99-Year-Old Port" }
D[963] = { t = "Un amour éternel", nv = 16, min = 11, te = "For Love Eternal", g = { "Cerellean Blanchegriffe", "Cerellean Whiteclaw", 1439, 37.4, 41.8 }, r = { "Cerellean Blanchegriffe", "Cerellean Whiteclaw", 1439, 37.4, 41.8 }, c = { 1439, 41.8, 60.7 }, obj = "Rapporter Pendentif d'Anaya", oe = "Bring Anaya's Pendant" }
D[964] = { t = "Fragments de squelette", nv = 57, min = 55, te = "Skeletal Fragments", av = 838, g = { "Apothicaire Dithers", "Apothecary Dithers", 1422, 26.5, 56 }, r = { "Apothicaire Dithers", "Apothecary Dithers", 1422, 26.5, 56 }, c = { 1422, 44.3, 67.6 }, obj = "Rapporter 15 × Fragments de squelette", oe = "Bring 15 × Skeletal Fragments" }
D[965] = { t = "La Tour d'Althalaxx", nv = 18, min = 13, te = "The Tower of Althalaxx", g = { "Sentinelle Elissa Brise-stellaire", "Sentinel Elissa Starbreeze", 1439, 37.4, 41.8 }, r = { "Balthule Frappelombre", "Balthule Shadowstrike", 1439, 55, 24.9 } }
D[966] = { t = "La Tour d'Althalaxx", nv = 18, min = 13, te = "The Tower of Althalaxx", av = 965, g = { "Balthule Frappelombre", "Balthule Shadowstrike", 1439, 55, 24.9 }, r = { "Balthule Frappelombre", "Balthule Shadowstrike", 1439, 55, 24.9 }, c = { 1439, 56.2, 26.6 }, obj = "Rapporter 4 × Parchemin déchiré", oe = "Bring 4 × Worn Parchment" }
D[967] = { t = "La Tour d'Althalaxx", nv = 18, min = 13, te = "The Tower of Althalaxx", av = 966, g = { "Balthule Frappelombre", "Balthule Shadowstrike", 1439, 55, 24.9 }, obj = "Rapporter Lettre à Delgren", oe = "Bring Letter to Delgren" }
D[969] = { t = "Que la chance soit avec vous", nv = 60, min = 55, te = "Luck Be With You", g = { "Féticheuse Mau'ari", "Witch Doctor Mau'ari", 1452, 61.9, 38.3 }, r = { "Féticheuse Mau'ari", "Witch Doctor Mau'ari", 1452, 61.9, 38.3 }, c = { 1452, 62.1, 69.2 }, obj = "Rapporter 4 × Eclats cognegivre", oe = "Bring 4 × Frostmaul Shards" }
D[970] = { t = "La Tour d'Althalaxx", nv = 21, min = 13, te = "The Tower of Althalaxx", av = 967, g = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 }, r = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 }, c = { 1440, 31.9, 30.5 }, obj = "Rapporter Gemme d'âme luminescente", oe = "Bring Glowing Soul Gem" }
D[973] = { t = "La Tour d'Althalaxx", nv = 24, min = 13, te = "The Tower of Althalaxx", av = 970, g = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 }, r = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 }, c = { 1440, 25.3, 60.7 }, obj = "Rapporter Tome d'Ilkrud Magthrull", oe = "Bring Ilkrud Magthrull's Tome" }
D[974] = { t = "À la recherche de la source", nv = 55, min = 51, te = "Finding the Source", g = { "Krakle", "Krakle", 1449, 30.9, 50.4 }, r = { "Krakle", "Krakle", 1449, 30.9, 50.4 }, c = { 1449, 49.3, 50.7 }, obj = "Rapporter Thermomètre de Krakle ; Vaincre Thermomètre de Krakle", oe = "Bring Krakle's Thermometer ; Kill Krakle's Thermometer" }
D[975] = { t = "Cache de Mau'ari", nv = 60, min = 55, te = "Cache of Mau'ari", av = 969, g = { "Féticheuse Mau'ari", "Witch Doctor Mau'ari", 1452, 61.9, 38.3 }, r = { "Féticheuse Mau'ari", "Witch Doctor Mau'ari", 1452, 61.9, 38.3 } }
D[976] = { t = "De l’approvisionnement pour Auberdine", nv = 24, min = 19, te = "Supplies to Auberdine", av = 973, g = { "Feero Main-de-fer", "Feero Ironhand", 1440, 26.2, 38.7 }, r = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 } }
D[977] = { t = "Yéti ? Y es-tu ?", nv = 58, min = 52, te = "Are We There, Yeti?", av = 3783, g = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, r = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, c = { 1452, 67.9, 41.6 }, obj = "Rapporter 2 × Corne de yéti en parfait état", oe = "Bring 2 × Pristine Yeti Horn" }
D[980] = { t = "Les nouvelles sources", nv = 55, min = 51, te = "The New Springs", av = 974, g = { "Krakle", "Krakle", 1449, 30.9, 50.4 } }
D[982] = { t = "Océan profond, mer immense", nv = 17, min = 13, te = "Deep Ocean, Vast Sea", g = { "Gorbold Main-d'acier", "Gorbold Steelhand", 1439, 37.4, 41.8 }, r = { "Gorbold Main-d'acier", "Gorbold Steelhand", 1439, 37.4, 41.8 }, c = { 1439, 39.6, 27.5 }, obj = "Rapporter Coffret de l'Aube argentée ; Rapporter Coffret du Voile de brume", oe = "Bring Silver Dawning's Lockbox ; Bring Mist Veil's Lockbox" }
D[983] = { t = "Bigobox 827", nv = 10, min = 7, te = "Buzzbox 827", g = { "Crackboum Tournelevier", "Wizbang Cranktoggle", 1439, 37.4, 41.8 }, r = { "Bigobox 827", "Buzzbox 827", 1439, 36.6, 46.3 }, c = { 1439, 35.9, 50.7 }, obj = "Rapporter 6 × Patte de clampant", oe = "Bring 6 × Crawler Leg" }
D[984] = { t = "Quelle est l'ampleur de la menace ?", nv = 14, min = 10, te = "How Big a Threat?", g = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, r = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 } }
D[985] = { t = "Quelle est l'ampleur de la menace ?", nv = 14, min = 10, te = "How Big a Threat?", av = 984, g = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, r = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, c = { 1439, 39.4, 54.1 }, obj = "Vaincre 8 × Guide Noirbois ; Vaincre 5 × Messager du Vent Noirbois", oe = "Kill 8 × Blackwood Pathfinder ; Kill 5 × Blackwood Windtalker" }
D[986] = { t = "Un maître perdu", nv = 20, min = 10, te = "A Lost Master", av = 985, g = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, r = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, c = { 1439, 39.6, 84.2 }, obj = "Rapporter 5 × Belle peau de traquelune", oe = "Bring 5 × Fine Moonstalker Pelt" }
D[991] = { t = "Recherche Teronis désespérément", nv = 19, min = 18, te = "Raene's Cleansing", g = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, r = { "Cadavre de Teronis", "Teronis' Corpse", 1440, 20.3, 42.3 } }
D[992] = { t = "Étude des eaux de Gadgetzan", nv = 46, min = 38, te = "Gadgetzan Water Survey", g = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, r = { "Grand Géomètre Radiésthéflop", "Senior Surveyor Fizzledowser", 1446, 50.2, 27.5 }, obj = "Rapporter Fiole de sourcier pleine", oe = "Bring Tapped Dowsing Widget" }
D[993] = { t = "Un maître perdu", nv = 20, min = 10, te = "A Lost Master", av = 986, g = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, obj = "Rapporter objet 5387", oe = "Bring item 5387" }
D[997] = { t = "La terre de Denalan", nv = 5, min = 4, te = "Denalan's Earth", g = { "Syral Feuillelame", "Syral Bladeleaf", 1438, 56, 57.3 }, r = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, obj = "Rapporter Terre rare", oe = "Bring Rare Earth" }
D[1001] = { t = "Bigobox 411", nv = 12, min = 7, te = "Buzzbox 411", av = 983, g = { "Bigobox 827", "Buzzbox 827", 1439, 36.6, 46.3 }, r = { "Bigobox 411", "Buzzbox 411", 1439, 42, 28.6 }, c = { 1439, 36.4, 32.3 }, obj = "Rapporter 3 × Oeil de batteur", oe = "Bring 3 × Thresher Eye" }
D[1002] = { t = "Bigobox 323", nv = 14, min = 7, te = "Buzzbox 323", av = 1001, g = { "Bigobox 411", "Buzzbox 411", 1439, 42, 28.6 }, r = { "Buzzbox 323", "Buzzbox 323", 1439, 55, 24.9 }, c = { 1439, 43.3, 41.5 }, obj = "Rapporter 6 × Croc de traquelune", oe = "Bring 6 × Moonstalker Fang" }
D[1003] = { t = "Bigobox 525", nv = 16, min = 7, te = "Buzzbox 525", av = 1002, g = { "Buzzbox 323", "Buzzbox 323", 1439, 55, 24.9 }, r = { "Bigobox 525", "Buzzbox 525", 1439, 41.4, 80.6 }, c = { 1439, 40.4, 79.1 }, obj = "Rapporter 4 × Scalp vieilli", oe = "Bring 4 × Grizzled Scalp" }
D[1007] = { t = "Les statuettes antiques", nv = 20, min = 19, te = "The Ancient Statuette", g = { "Talen", "Talen", 1440, 14.8, 31.3 }, r = { "Talen", "Talen", 1440, 14.8, 31.3 }, c = { 1440, 14.2, 20.6 }, obj = "Rapporter Ancienne statuette", oe = "Bring Ancient Statuette" }
D[1008] = { t = "La grève de Zoram", nv = 19, min = 14, te = "The Zoram Strand", g = { "Shindrell Prestefeu", "Shindrell Swiftfire", 1440, 36.6, 49.6 }, r = { "Shindrell Prestefeu", "Shindrell Swiftfire", 1440, 36.6, 49.6 }, c = { 1440, 13.2, 23.3 }, obj = "Rapporter 20 × Tête d'Irequeue", oe = "Bring 20 × Wrathtail Head" }
D[1009] = { t = "Ruuzel", nv = 25, min = 20, av = 1007, g = { "Talen", "Talen", 1440, 14.8, 31.3 }, r = { "Talen", "Talen", 1440, 14.8, 31.3 }, c = { 1440, 8.6, 13.7 }, obj = "Rapporter Anneau de Zoram", oe = "Bring Ring of Zoram" }
D[1010] = { t = "Les cheveux de Bathran", nv = 20, min = 20, te = "Bathran's Hair", g = { "Orendil Largefeuille", "Orendil Broadleaf", 1440, 26.2, 38.7 }, r = { "Orendil Largefeuille", "Orendil Broadleaf", 1440, 26.2, 38.7 }, c = { 1440, 31.8, 22.6 }, obj = "Rapporter 5 × Cheveu de Bathran", oe = "Bring 5 × Bathran's Hair" }
D[1011] = { t = "Les maladies des Réprouvés", nv = 29, min = 24, te = "Forsaken Diseases", g = { "Kayneth Mortebrise", "Kayneth Stillwind", 1440, 85.2, 44.7 }, r = { "Kayneth Mortebrise", "Kayneth Stillwind", 1440, 85.2, 44.7 }, c = { 1440, 75.3, 71.9 }, obj = "Rapporter Bouteille des maladies", oe = "Bring Bottle of Disease" }
D[1012] = { t = "Les druides fous", nv = 32, min = 24, te = "Insane Druids", av = 1011, g = { "Kayneth Mortebrise", "Kayneth Stillwind", 1440, 85.2, 44.7 }, r = { "Kayneth Mortebrise", "Kayneth Stillwind", 1440, 85.2, 44.7 }, c = { 1440, 76.2, 74.1 }, obj = "Vaincre Taneel Sombrebois ; Vaincre Uthil Huchelune ; Vaincre Mavoris Eclairciel", oe = "Kill Taneel Darkwood ; Kill Uthil Mooncall ; Kill Mavoris Cloudsbreak" }
D[1016] = { t = "Mystral gagnant", nv = 24, min = 20, te = "Elemental Bracers", g = { "Sentinelle Vélène Heurtétoile", "Sentinel Velene Starstrike", 1440, 49.8, 67.2 }, r = { "Sentinelle Vélène Heurtétoile", "Sentinel Velene Starstrike", 1440, 49.8, 67.2 }, obj = "Rapporter Parchemin divin", oe = "Bring Divined Scroll" }
D[1017] = { t = "Mage invocateur", nv = 25, min = 20, te = "Mage Summoner", av = 1016, g = { "Sentinelle Vélène Heurtétoile", "Sentinel Velene Starstrike", 1440, 49.8, 67.2 }, r = { "Sentinelle Vélène Heurtétoile", "Sentinel Velene Starstrike", 1440, 49.8, 67.2 }, obj = "Rapporter Tête de Sarilus Foulborne", oe = "Bring Sarilus Foulborne's Head" }
D[1020] = { t = "La jouvence d'Orendil", nv = 20, min = 20, te = "Orendil's Cure", av = 1010, g = { "Orendil Largefeuille", "Orendil Broadleaf", 1440, 26.2, 38.7 }, r = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, obj = "Rapporter Jouvence d'Orendil", oe = "Bring Orendil's Cure" }
D[1021] = { t = "Vil satyre ! Dryades en danger !", nv = 32, min = 26, te = "Vile Satyr! Dryads in Danger!", g = { "Illiyana", "Illiyana", 1440, 21.7, 53.3 }, r = { "Anilia", "Anilia", 1440, 78.3, 44.8 } }
D[1022] = { t = "Le val Hurlant", nv = 30, min = 25, te = "The Howling Vale", g = { "Sentinelle Melyria Ombregivre", "Sentinel Melyria Frostshadow", 1440, 21.7, 53.3 }, r = { "Sentinelle Melyria Ombregivre", "Sentinel Melyria Frostshadow", 1440, 21.7, 53.3 }, c = { 1440, 50.5, 39.1 }, obj = "Activer Tome de Mel'Thandris", oe = "Use Tome of Mel'Thandris" }
D[1023] = { t = "L’aventurier de la gemme perdue", nv = 21, min = 18, te = "Raene's Cleansing", av = 991, g = { "Cadavre de Teronis", "Teronis' Corpse", 1440, 20.3, 42.3 }, r = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, c = { 1440, 20.2, 41.8 }, obj = "Rapporter Gemme luminescente", oe = "Bring Glowing Gem" }
D[1024] = { t = "La nymphe de ces bois", nv = 21, min = 18, te = "Raene's Cleansing", av = 1023, g = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, r = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, c = { 1440, 20.2, 41.8 }, obj = "Rapporter Gemme luminescente", oe = "Bring Glowing Gem" }
D[1025] = { t = "Une défense agressive", nv = 24, min = 18, te = "An Aggressive Defense", av = 1023, g = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, r = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, c = { 1440, 54.4, 62.6 }, obj = "Vaincre Protecteur Vile-sylve ; Vaincre 2 × Ursa Vile-sylve ; Vaincre 10 × Totémique Vile-sylve ; Vaincre 12 × Guerrier Vile-sylve", oe = "Kill Foulweald Den Watcher ; Kill 2 × Foulweald Ursa ; Kill 10 × Foulweald Totemic ; Kill 12 × Foulweald Warrior" }
D[1026] = { t = "Ô, ma chère cassette !", nv = 27, min = 18, te = "Raene's Cleansing", av = 1024, g = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, r = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, c = { 1440, 54.4, 35.4 }, obj = "Rapporter Hampe en fer", oe = "Bring Iron Shaft" }
D[1027] = { t = "Faire le mort", nv = 28, min = 18, te = "Raene's Cleansing", av = 1026, g = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, r = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, obj = "Rapporter Pommeau en fer", oe = "Bring Iron Pommel" }
D[1028] = { t = "Le nettoyage selon Raene", nv = 28, min = 18, te = "Raene's Cleansing", av = 1027, g = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, r = { "Autel caché", "Hidden Shrine", 1440, 56.4, 49.2 }, obj = "Rapporter Bâtonnet reconstitué", oe = "Bring Reconstructed Rod" }
D[1029] = { t = "Retourner voir Raene", nv = 28, min = 18, te = "Raene's Cleansing", av = 1055, g = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 }, r = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 } }
D[1030] = { t = "Le bâtonnet de Dartol", nv = 28, min = 18, te = "Raene's Cleansing", av = 1029, g = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, r = { "Krolg", "Krolg", 1440, 50.8, 75.1 } }
D[1031] = { t = "La branche de Cénarius", nv = 32, min = 26, te = "The Branch of Cenarius", av = 1021, g = { "Anilia", "Anilia", 1440, 78.3, 44.8 }, r = { "Illiyana", "Illiyana", 1440, 21.7, 53.3 }, c = { 1440, 79.2, 45.8 }, obj = "Rapporter Branche de Cénarius", oe = "Bring Branch of Cenarius" }
D[1032] = { t = "Mort aux satyres !", nv = 32, min = 26, te = "Satyr Slaying!", av = 1031, g = { "Illiyana", "Illiyana", 1440, 21.7, 53.3 }, r = { "Illiyana", "Illiyana", 1440, 21.7, 53.3 }, c = { 1440, 80.2, 48.1 }, obj = "Rapporter 16 × Cornes de satyre", oe = "Bring 16 × Satyr Horns" }
D[1033] = { t = "La larme d'Élune", nv = 22, min = 20, te = "Elune's Tear", av = 1020, g = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, r = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, c = { 1440, 46.3, 45.9 }, obj = "Rapporter Larme d'Elune", oe = "Bring Elune's Tear" }
D[1034] = { t = "Les ruines de Chimétoile", nv = 23, min = 20, te = "The Ruins of Stardust", av = 1033, g = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, r = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, c = { 1440, 33.5, 67.6 }, obj = "Rapporter 5 × Poignée de poussière d'étoile", oe = "Bring 5 × Handful of Stardust" }
D[1035] = { t = "Le lac Tombeciel", nv = 30, min = 20, te = "Fallen Sky Lake", av = 1034, g = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, r = { "Pelturas Blanchelune", "Pelturas Whitemoon", 1440, 36.6, 49.6 }, c = { 1440, 66.7, 82.2 }, obj = "Rapporter Pierre de lune tombée", oe = "Bring Fallen Moonstone" }
D[1037] = { t = "Velinde Chantétoile", nv = 30, min = 25, te = "Velinde Starsong", av = 1022, g = { "Sentinelle Melyria Ombregivre", "Sentinel Melyria Frostshadow", 1440, 21.7, 53.3 } }
D[1040] = { t = "Passage à Baie-du-Butin", nv = 30, min = 25, te = "Passage to Booty Bay", av = 1039, g = { "Maître des quais Tournoupette", "Wharfmaster Dizzywig", 1413, 63, 37.2 } }
D[1041] = { t = "La route de la caravane", nv = 30, min = 25, te = "The Caravan Road", av = 1040, g = { "Caravanier Ruzzgot", "Caravaneer Ruzzgot", 1434, 27, 77.1 } }
D[1042] = { t = "La famille Carevin", nv = 30, min = 25, te = "The Carevin Family", av = 1041, g = { "Greffier Daltry", "Clerk Daltry", 1431, 73.8, 43.5 }, r = { "Jonathan Carevin", "Jonathan Carevin", 1431, 75.3, 48.7 } }
D[1043] = { t = "La faux d'Élune", nv = 30, min = 25, te = "The Scythe of Elune", av = 1042, g = { "Jonathan Carevin", "Jonathan Carevin", 1431, 75.3, 48.7 }, r = { "Jonathan Carevin", "Jonathan Carevin", 1431, 75.3, 48.7 }, c = { 1431, 73.5, 79.1 }, obj = "Activer Monticule de poussière", oe = "Use Mound of Dirt" }
D[1044] = { t = "Réponses aux questions", nv = 30, min = 25, te = "Answered Questions", av = 1043, g = { "Jonathan Carevin", "Jonathan Carevin", 1431, 75.3, 48.7 } }
D[1052] = { t = "Sur le chemin écarlate", nv = 40, min = 34, te = "Down the Scarlet Path", av = 261, g = { "Frère Anton", "Brother Anton", 1443, 66.5, 7.9 }, obj = "Rapporter Lettre de recommandation", oe = "Bring Letter of Commendation" }
D[1054] = { t = "Diminution de la menace", nv = 25, min = 18, te = "Culling the Threat", g = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, r = { "Raene Mène-loup", "Raene Wolfrunner", 1440, 36.6, 49.6 }, c = { 1440, 37.7, 34.7 }, obj = "Rapporter Crâne de Dal Griffesang", oe = "Bring Dal Bloodclaw's Skull" }
D[1055] = { t = "Le nettoyage selon Raene", nv = 28, min = 18, te = "Raene's Cleansing", av = 1028, g = { "Autel caché", "Hidden Shrine", 1440, 56.4, 49.2 }, r = { "Shael'dryn", "Shael'dryn", 1440, 53.5, 46.2 } }
D[1056] = { t = "Voyage au pic des Serres-Rocheuses", nv = 18, min = 18, te = "Journey to Stonetalon Peak", g = { "Faldreas Goeth'Shael", "Faldreas Goeth'Shael", 1440, 36.6, 49.6 } }
D[1057] = { t = "À la reconquête du Val calciné", nv = 27, min = 20, te = "Reclaiming the Charred Vale", g = { "Gardien Albagorm", "Keeper Albagorm", 1442, 37.1, 8.1 }, r = { "Gardien Albagorm", "Keeper Albagorm", 1442, 37.1, 8.1 }, c = { 1442, 32.6, 65.9 }, obj = "Vaincre 7 × Harpie Rougefurie ; Vaincre 7 × Embusquée Rougefurie ; Vaincre 7 × Tueuse Rougefurie ; Vaincre 7 × Volplume Rougefurie", oe = "Kill 7 × Bloodfury Harpy ; Kill 7 × Bloodfury Ambusher ; Kill 7 × Bloodfury Slayer ; Kill 7 × Bloodfury Roguefeather" }
D[1058] = { t = "Magie de la forêt de Jin'Zil", nv = 26, min = 20, te = "Jin'Zil's Forest Magic", g = { "Féticheur Jin'Zil", "Witch Doctor Jin'Zil", 1442, 74.5, 97.9 }, r = { "Féticheur Jin'Zil", "Witch Doctor Jin'Zil", 1442, 74.5, 97.9 }, c = { 1442, 35, 13 }, obj = "Rapporter 5 × Sève des Serres-Rocheuses ; Rapporter 5 × Moustache crépusculaire ; Rapporter 30 × Oeil de coursier ; Rapporter Ecaille de dragon-faë", oe = "Bring 5 × Stonetalon Sap ; Bring 5 × Twilight Whisker ; Bring 30 × Courser Eye ; Bring Fey Dragon Scale" }
D[1059] = { t = "À la reconquête du Val calciné", nv = 27, min = 20, te = "Reclaiming the Charred Vale", av = 1057, g = { "Gardien Albagorm", "Keeper Albagorm", 1442, 37.1, 8.1 } }
D[1060] = { t = "Lettre à Jin'Zil", nv = 20, min = 15, te = "Letter to Jin'Zil", av = 876, g = { "Darsok Vivedague", "Darsok Swiftdagger", 1413, 52.2, 31 }, obj = "Rapporter Lettre à Jin'Zil", oe = "Bring Letter to Jin'Zil" }
D[1062] = { t = "Les invasions gobelines", nv = 19, min = 13, te = "Goblin Invaders", g = { "Seereth Bris-de-pierre", "Seereth Stonebreak", 1442, 85.9, 97.9 }, r = { "Seereth Bris-de-pierre", "Seereth Stonebreak", 1442, 85.9, 97.9 }, c = { 1442, 66.8, 52.2 }, obj = "Vaincre 15 × Déboiseur de la KapitalRisk", oe = "Kill 15 × Venture Co. Logger" }
D[1063] = { t = "L'Ancienne", nv = 18, min = 13, te = "The Elder Crone", av = 1062, g = { "Seereth Bris-de-pierre", "Seereth Stonebreak", 1442, 85.9, 97.9 } }
D[1066] = { t = "Le sang des innocents", nv = 23, min = 13, te = "Blood of Innocents", av = 1065, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, r = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, c = { 1424, 79.9, 41.7 }, obj = "Rapporter 5 × Fiole de sang d'innocent", oe = "Bring 5 × Vial of Innocent Blood" }
D[1067] = { t = "Le retour aux Pitons-du-Tonnerre", nv = 23, min = 13, te = "Return to Thunder Bluff", av = 1066, g = { "Apothicaire Lydon", "Apothecary Lydon", 1424, 62.3, 20.5 }, obj = "Rapporter Toxine de Lydon", oe = "Bring Lydon's Toxin" }
D[1068] = { t = "Les machines à déchiqueter", nv = 23, min = 13, te = "Shredding Machines", av = 1062, g = { "Seereth Bris-de-pierre", "Seereth Stonebreak", 1442, 85.9, 97.9 }, r = { "Seereth Bris-de-pierre", "Seereth Stonebreak", 1442, 85.9, 97.9 }, c = { 1442, 64.1, 46.4 }, obj = "Vaincre XT4 ; Vaincre XT9", oe = "Kill XT:4 ; Kill XT:9" }
D[1069] = { t = "Omelette de mousses-profondes", nv = 20, min = 15, te = "Deepmoss Spider Eggs", g = { "Mebok Mizzyrix", "Mebok Mizzyrix", 1413, 63, 37.2 }, r = { "Mebok Mizzyrix", "Mebok Mizzyrix", 1413, 63, 37.2 }, obj = "Rapporter 15 × Oeuf des mousses profondes", oe = "Bring 15 × Deepmoss Egg" }
D[1070] = { t = "De garde dans les Serres-Rocheuses", nv = 21, min = 17, te = "On Guard in Stonetalon", g = { "Sentinelle Thenysil", "Sentinel Thenysil", 1440, 36.6, 49.6 } }
D[1071] = { t = "Du répit pour un gnome", nv = 21, min = 17, te = "A Gnome's Respite", av = 1085, g = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, r = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, c = { 1442, 67, 52.1 }, obj = "Vaincre 10 × Déboiseur de la KapitalRisk ; Vaincre 10 × Défricheur de la KapitalRisk", oe = "Kill 10 × Venture Co. Logger ; Kill 10 × Venture Co. Deforester" }
D[1072] = { t = "Un vieux collègue", nv = 21, min = 17, te = "An Old Colleague", av = 1071, g = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 } }
D[1075] = { t = "Un parchemin de Collin Mauren", nv = 21, min = 17, te = "A Scroll from Mauren", av = 1071, g = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 } }
D[1079] = { t = "Opérations spéciales – Plan A", nv = 22, min = 17, te = "Covert Ops - Alpha", av = 1074, g = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, r = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, c = { 1442, 66.1, 51.3 }, obj = "Rapporter Plans d'ingénieur de la KapitalRisk", oe = "Bring Venture Co. Engineering Plans" }
D[1080] = { t = "Opérations spéciales – Plan B", nv = 22, min = 17, te = "Covert Ops - Beta", av = 1077, g = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, r = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, c = { 1442, 74.5, 59.3 }, obj = "Rapporter Lettres de la KapitalRisk", oe = "Bring Venture Co. Letters" }
D[1081] = { t = "Réception par Tyrande", nv = 28, min = 17, te = "Reception from Tyrande", av = 1082, g = { "Sentinelle Thenysil", "Sentinel Thenysil", 1440, 36.6, 49.6 } }
D[1082] = { t = "Une mise à jour pour la Sentinelle Thenysil", nv = 22, min = 17, te = "Update for Sentinel Thenysil", g = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 } }
D[1083] = { t = "Esprits enragés", nv = 26, min = 20, te = "Enraged Spirits", av = 1091, g = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 }, r = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 }, c = { 1442, 32.4, 67.5 }, obj = "Rapporter 8 × Braises ardentes", oe = "Bring 8 × Smoldering Embers" }
D[1084] = { t = "Les Anciens blessés", nv = 28, min = 22, te = "Wounded Ancients", av = 1091, g = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 }, r = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 }, c = { 1442, 32.2, 67.3 }, obj = "Rapporter Shrapnel abîmé", oe = "Bring Corroded Shrapnel" }
D[1085] = { t = "De garde dans les Serres-Rocheuses", nv = 21, min = 17, te = "On Guard in Stonetalon", g = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 }, r = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 } }
D[1087] = { t = "L'héritage de Cénarius", nv = 25, min = 20, te = "Cenarius' Legacy", g = { "Braelyn Brasemain", "Braelyn Firehand", 1442, 45.9, 60.4 }, r = { "Braelyn Brasemain", "Braelyn Firehand", 1442, 45.9, 60.4 }, c = { 1442, 36.6, 12.6 }, obj = "Vaincre 4 × Fils de Cénarius ; Vaincre 4 × Fille de Cénarius ; Vaincre 4 × Botaniste cénarien", oe = "Kill 4 × Son of Cenarius ; Kill 4 × Daughter of Cenarius ; Kill 4 × Cenarion Botanist" }
D[1088] = { t = "Ordanus", nv = 29, min = 20, av = 1087, g = { "Braelyn Brasemain", "Braelyn Firehand", 1442, 45.9, 60.4 }, r = { "Braelyn Brasemain", "Braelyn Firehand", 1442, 45.9, 60.4 }, obj = "Rapporter Tête d'Ordanus", oe = "Bring Ordanus' Head" }
D[1089] = { t = "L'Antre", nv = 29, min = 20, te = "The Den", av = 1088, g = { "Braelyn Brasemain", "Braelyn Firehand", 1442, 45.9, 60.4 }, r = { "Provision du corbeau", "Talon Den Hoard", 1442, 26.6, 10.9 }, c = { 1442, 27.7, 13.7 }, obj = "Rapporter Clé du dormeur ; Rapporter Clé des griffes ; Rapporter Clé du refuge", oe = "Bring Sleepers' Key ; Bring Claw Key ; Bring Barrow Key" }
D[1090] = { t = "Les ordres de Gerenzo", nv = 22, min = 17, te = "Gerenzo's Orders", g = { "Piznik", "Piznik", 1442, 71.9, 60 }, r = { "Piznik", "Piznik", 1442, 71.9, 60 } }
D[1091] = { t = "Des nouvelles pour Kaela", nv = 22, min = 17, te = "Kaela's Update", g = { "Gaxim Larguerouille", "Gaxim Rustfizzle", 1442, 59.5, 67.1 }, r = { "Kaela Ombrelance", "Kaela Shadowspear", 1442, 59.5, 67.1 }, c = { 1442, 74.5, 59.3 }, obj = "Rapporter Lettres de la KapitalRisk", oe = "Bring Venture Co. Letters" }
D[1092] = { t = "Les ordres de Gerenzo", nv = 22, min = 17, te = "Gerenzo's Orders", av = 1090, g = { "Piznik", "Piznik", 1442, 71.9, 60 }, r = { "Ziz Fizzik", "Ziz Fizziks", 1442, 59, 62.6 }, obj = "Rapporter Minerai non identifié", oe = "Bring Unidentified Ore" }
D[1093] = { t = "Super-Découpeur 6000", nv = 21, min = 16, te = "Super Reaper 6000", g = { "Ziz Fizzik", "Ziz Fizziks", 1442, 59, 62.6 }, r = { "Ziz Fizzik", "Ziz Fizziks", 1442, 59, 62.6 }, c = { 1442, 68.6, 52 }, obj = "Rapporter Plan du Super-Découpeur 6000", oe = "Bring Super Reaper 6000 Blueprints" }
D[1094] = { t = "D'autres instructions", nv = 21, min = 16, te = "Further Instructions", av = 1093, g = { "Ziz Fizzik", "Ziz Fizziks", 1442, 59, 62.6 }, obj = "Rapporter Enveloppe scellée", oe = "Bring Sealed Envelope" }
D[1095] = { t = "D'autres instructions", nv = 27, min = 16, te = "Further Instructions", av = 1094, g = { "Krachevalve", "Sputtervalve", 1413, 63, 37.2 } }
D[1096] = { t = "Gerenzo Siffleclef", nv = 27, min = 16, te = "Gerenzo Wrenchwhistle", av = 1095, g = { "Ziz Fizzik", "Ziz Fizziks", 1442, 59, 62.6 }, r = { "Ziz Fizzik", "Ziz Fizziks", 1442, 59, 62.6 }, c = { 1442, 64.5, 40.3 }, obj = "Rapporter Bras mécanique de Gerenzo", oe = "Bring Gerenzo's Mechanical Arm" }
D[1097] = { t = "La quête d'Elmore", nv = 15, min = 9, te = "Elmore's Task", g = { "Argus le forgeron", "Smith Argus", 1429, 42.1, 65.9 } }
D[1104] = { t = "Le venin acide des salines", nv = 30, min = 28, te = "Salt Flat Venom", g = { "Féplouf Zéboulon", "Fizzle Brassbolts", 1441, 78.1, 77.1 }, r = { "Féplouf Zéboulon", "Fizzle Brassbolts", 1441, 78.1, 77.1 }, c = { 1441, 75.2, 57.1 }, obj = "Rapporter 6 × Venin de scorpide acide", oe = "Bring 6 × Salty Scorpid Venom" }
D[1105] = { t = "Les carapaces durcies", nv = 30, min = 28, te = "Hardened Shells", g = { "Lachnouf Zéboulon", "Wizzle Brassbolts", 1441, 78.1, 77.1 }, r = { "Lachnouf Zéboulon", "Wizzle Brassbolts", 1441, 78.1, 77.1 }, c = { 1441, 77.5, 57.1 }, obj = "Rapporter 9 × Carapace de tortue durcie", oe = "Bring 9 × Hardened Tortoise Shell" }
D[1106] = { t = "Martek l'Exilé", nv = 35, min = 26, te = "Martek the Exiled", g = { "Féplouf Zéboulon", "Fizzle Brassbolts", 1441, 78.1, 77.1 }, obj = "Rapporter Lettre de Fizzle Brassbolts", oe = "Bring Fizzle Brassbolts' Letter" }
D[1107] = { t = "Les nageoires incrustées", nv = 35, min = 28, te = "Encrusted Tail Fins", av = 1105, g = { "Lachnouf Zéboulon", "Wizzle Brassbolts", 1441, 78.1, 77.1 }, r = { "Lachnouf Zéboulon", "Wizzle Brassbolts", 1441, 78.1, 77.1 }, obj = "Rapporter 10 × Nageoire incrustée", oe = "Bring 10 × Encrusted Tail Fin" }
D[1108] = { t = "Indurium", nv = 39, min = 28, av = 1106, g = { "Martek l'Exilé", "Martek the Exiled", 1418, 42.4, 52.9 }, r = { "Martek l'Exilé", "Martek the Exiled", 1418, 42.4, 52.9 }, c = { 1418, 50.4, 68.5 }, obj = "Rapporter 10 × Flocon d'Indurium", oe = "Bring 10 × Indurium Flake" }
D[1110] = { t = "Pièces de chariot explosif", nv = 31, min = 28, te = "Rocket Car Parts", g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, r = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, c = { 1441, 72.2, 65.1 }, obj = "Rapporter 30 × Pièces de chariot explosif", oe = "Bring 30 × Rocket Car Parts" }
D[1111] = { t = "Maître des quais Tournoupette", nv = 36, min = 30, te = "Wharfmaster Dizzywig", g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, obj = "Rapporter Commande de Kravel", oe = "Bring Kravel's Parts Order" }
D[1114] = { t = "Une livraison pour les gnomes", nv = 36, min = 30, te = "Delivery to the Gnomes", av = 1112, g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, r = { "Féplouf Zéboulon", "Fizzle Brassbolts", 1441, 78.1, 77.1 }, obj = "Rapporter Pièces de chariot fragiles", oe = "Bring Delicate Car Parts" }
D[1115] = { t = "Le marchand de rumeurs", nv = 36, min = 30, te = "The Rumormonger", av = 1114, g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 } }
D[1116] = { t = "De la poussière de rêve dans les marécages", nv = 36, min = 30, te = "Dream Dust in the Swamp", av = 1115, g = { "Krazek", "Krazek", 1434, 27, 77.1 }, r = { "Krazek", "Krazek", 1434, 27, 77.1 }, obj = "Rapporter 10 × Grain de poussière de rêve", oe = "Bring 10 × Speck of Dream Dust" }
D[1117] = { t = "Des rumeurs pour Kravel", nv = 36, min = 30, te = "Rumors for Kravel", av = 1116, g = { "Krazek", "Krazek", 1434, 27, 77.1 }, obj = "Rapporter Rumeurs gobelines", oe = "Bring Goblin Rumors" }
D[1118] = { t = "Retour à Baie-du-Butin", nv = 43, min = 35, te = "Back to Booty Bay", av = 1117, g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, obj = "Rapporter Plan de Kravel", oe = "Bring Kravel's Scheme" }
D[1119] = { t = "La mixture de Zanzil et la bière brune du Sot", nv = 44, min = 35, te = "Zanzil's Mixture and a Fool's Stout", g = { "Grincheux Bullévente", "Crank Fizzlebub", 1434, 27, 77.1 }, obj = "Rapporter Bière du sot", oe = "Bring Fool's Stout" }
D[1120] = { t = "Saoulez les gnomes", nv = 44, min = 35, te = "Get the Gnomes Drunk", av = 1119, g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, r = { "Chef-mécanicien gnome", "Gnome Pit Boss", 1441, 78.1, 77.1 }, obj = "Rapporter Bière du sot", oe = "Bring Fool's Stout" }
D[1121] = { t = "Saoulez les gobelins", nv = 44, min = 35, te = "Get the Goblins Drunk", av = 1119, g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, r = { "Chef-mécanicien gobelin", "Goblin Pit Boss", 1441, 78.1, 77.1 }, obj = "Rapporter Bière du sot", oe = "Bring Fool's Stout" }
D[1122] = { t = "Retourner voir Bullévente", nv = 44, min = 35, te = "Report Back to Fizzlebub", g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, obj = "Rapporter Rapport sur la bière du sot", oe = "Bring Fool's Stout Report" }
D[1124] = { t = "La dévastation", nv = 55, min = 54, te = "Wasteland", g = { "Rabine Saturna", "Rabine Saturna", 1450, 51.7, 45.1 }, obj = "Rapporter Lettre de Rabine", oe = "Bring Rabine's Letter" }
D[1125] = { t = "Les esprits de Sudevent", nv = 55, min = 54, te = "The Spirits of Southwind", av = 1124, g = { "Layo Heurtétoile", "Layo Starstrike", 1451, 81.9, 18.9 }, r = { "Layo Heurtétoile", "Layo Starstrike", 1451, 81.9, 18.9 }, c = { 1451, 62.8, 53 }, obj = "Vaincre 8 × Druide torturé ; Vaincre 8 × Sentinelle torturée", oe = "Kill 8 × Tortured Druid ; Kill 8 × Tortured Sentinel" }
D[1126] = { t = "Une ruche dans la tour", nv = 57, min = 54, te = "Hive in the Tower", av = 1125, g = { "Layo Heurtétoile", "Layo Starstrike", 1451, 81.9, 18.9 }, r = { "Layo Heurtétoile", "Layo Starstrike", 1451, 81.9, 18.9 }, obj = "Rapporter Objet silithide incrusté", oe = "Bring Encrusted Silithid Object" }
D[1130] = { t = "Melor envoie un message", nv = 30, min = 20, te = "Melor Sends Word", g = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 } }
D[1132] = { t = "Fiora Grandes-oreilles", nv = 20, min = 18, te = "Fiora Longears", g = { "Jack Flint le rouge", "Red Jack Flint", 1437, 8.3, 58.6 } }
D[1134] = { t = "Les Ailes-fières des Serres-Rocheuses", nv = 21, min = 18, te = "Pridewings of Stonetalon", av = 1008, g = { "Shindrell Prestefeu", "Shindrell Swiftfire", 1440, 36.6, 49.6 }, r = { "Shindrell Prestefeu", "Shindrell Swiftfire", 1440, 36.6, 49.6 }, obj = "Rapporter 12 × Glande à venin d'Aile-fière", oe = "Bring 12 × Pridewing Venom Sac" }
D[1137] = { t = "Des nouvelles pour Féplouf", nv = 38, min = 28, te = "News for Fizzle", av = 1108, g = { "Martek l'Exilé", "Martek the Exiled", 1418, 42.4, 52.9 } }
D[1138] = { t = "Fruit de la mer", nv = 17, min = 15, te = "Fruit of the Sea", g = { "Gubber Blump", "Gubber Blump", 1439, 37.4, 41.8 }, r = { "Gubber Blump", "Gubber Blump", 1439, 37.4, 41.8 }, c = { 1439, 49.1, 20.7 }, obj = "Rapporter 6 × Belle chair de crabe", oe = "Bring 6 × Fine Crab Chunks" }
D[1140] = { t = "La Tour d'Althalaxx", nv = 28, min = 13, te = "The Tower of Althalaxx", av = 973, g = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 }, r = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 }, c = { 1440, 66.6, 57 }, obj = "Activer Circle of Imprisonment ; Activer Circle of Imprisonment", oe = "Use Circle of Imprisonment ; Use Circle of Imprisonment" }
D[1141] = { t = "La famille à la canne à pêche", nv = 14, min = 10, te = "The Family and the Fishing Pole", g = { "Gubber Blump", "Gubber Blump", 1439, 37.4, 41.8 }, r = { "Gubber Blump", "Gubber Blump", 1439, 37.4, 41.8 }, obj = "Rapporter 6 × Mérou de Sombrivage", oe = "Bring 6 × Darkshore Grouper" }
D[1147] = { t = "L'essaim s'agrandit", nv = 35, min = 29, te = "The Swarm Grows", av = 1146, g = { "Moktar Krin", "Moktar Krin", 1441, 67.6, 63.9 }, r = { "Moktar Krin", "Moktar Krin", 1441, 67.6, 63.9 }, c = { 1441, 68.7, 85.1 }, obj = "Vaincre 5 × Chercheur silithide ; Vaincre 5 × Bourdon silithide ; Vaincre 5 × Envahisseur silithide", oe = "Kill 5 × Silithid Searcher ; Kill 5 × Silithid Hive Drone ; Kill 5 × Silithid Invader" }
D[1149] = { t = "L'épreuve de la Foi", nv = 26, min = 25, te = "Test of Faith", g = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 }, r = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 } }
D[1150] = { t = "L’épreuve de l’Endurance", nv = 30, min = 25, te = "Test of Endurance", av = 1149, g = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 }, r = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 }, obj = "Rapporter Griffes de Grenka", oe = "Bring Grenka's Claw" }
D[1151] = { t = "L'épreuve de la Force", nv = 30, min = 25, te = "Test of Strength", av = 1150, g = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 }, r = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 }, c = { 1441, 25.8, 42.1 }, obj = "Rapporter Fragments de Rok'Alim", oe = "Bring Fragments of Rok'Alim" }
D[1152] = { t = "L'épreuve de la Connaissance", nv = 30, min = 25, te = "Test of Lore", av = 1151, g = { "Dorn Traqueur-des-plaines", "Dorn Plainstalker", 1441, 53.9, 41.5 } }
D[1153] = { t = "Un nouveau minerai", nv = 29, min = 25, te = "A New Ore Sample", av = 893, g = { "Tatternack Forgacier", "Tatternack Steelforge", 1413, 44.9, 59.1 }, r = { "Tatternack Forgacier", "Tatternack Steelforge", 1413, 44.9, 59.1 }, obj = "Rapporter Echantillon de minerai brut", oe = "Bring Unrefined Ore Sample" }
D[1154] = { t = "L'épreuve de la Connaissance", nv = 30, min = 25, te = "Test of Lore", av = 1152, g = { "Braug Esprit-troublé", "Braug Dimspirit", 1442, 78.8, 45.7 }, r = { "Braug Esprit-troublé", "Braug Dimspirit", 1442, 78.8, 45.7 }, obj = "Rapporter Héritage des Aspects", oe = "Bring Legacy of the Aspects" }
D[1159] = { t = "L'épreuve de la Connaissance", nv = 30, min = 25, te = "Test of Lore", av = 6627, g = { "Braug Esprit-troublé", "Braug Dimspirit", 1442, 78.8, 45.7 } }
D[1166] = { t = "Les soucis du Seigneur Mok'Morokk", nv = 43, min = 38, te = "Overlord Mok'Morokk's Concern", g = { "Seigneur Mok'Morokk", "Overlord Mok'Morokk", 1445, 36.3, 31.4 }, r = { "Seigneur Mok'Morokk", "Overlord Mok'Morokk", 1445, 36.3, 31.4 }, c = { 1445, 39.9, 67.1 }, obj = "Rapporter Tabac de Mok'Morokk ; Rapporter Tafia de Mok'Morokk ; Rapporter Coffre de Mok'Morokk", oe = "Bring Mok'Morokk's Snuff ; Bring Mok'Morokk's Grog ; Bring Mok'Morokk's Strongbox" }
D[1167] = { t = "La Tour d'Althalaxx", nv = 28, min = 13, te = "The Tower of Althalaxx", av = 1140, g = { "Delgren le Purificateur", "Delgren the Purifier", 1440, 26.2, 38.7 } }
D[1168] = { t = "L'armée des dragons noirs", nv = 43, min = 38, te = "Army of the Black Dragon", g = { "Tharg", "Tharg", 1445, 36.3, 31.4 }, r = { "Tharg", "Tharg", 1445, 36.3, 31.4 }, c = { 1445, 43.3, 68 }, obj = "Vaincre 10 × Eclaireur Crins-de-feu ; Vaincre 10 × Queue-cendrée Crins-de-feu ; Vaincre 5 × Plaiedécaille Crins-de-feu", oe = "Kill 10 × Firemane Scout ; Kill 10 × Firemane Ash Tail ; Kill 5 × Firemane Scalebane" }
D[1169] = { t = "L'identification de la portée", nv = 43, min = 38, te = "Identifying the Brood", g = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 }, r = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 }, c = { 1445, 46.5, 71.5 }, obj = "Rapporter 15 × Langue d'incendiaire ; Rapporter 15 × Coeur d'incendiaire", oe = "Bring 15 × Searing Tongue ; Bring 15 × Searing Heart" }
D[1170] = { t = "La portée d'Onyxia", nv = 43, min = 38, te = "The Brood of Onyxia", av = 1169, g = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 }, r = { "Seigneur Mok'Morokk", "Overlord Mok'Morokk", 1445, 36.3, 31.4 } }
D[1171] = { t = "La portée d'Onyxia", nv = 43, min = 38, te = "The Brood of Onyxia", av = 1170, g = { "Seigneur Mok'Morokk", "Overlord Mok'Morokk", 1445, 36.3, 31.4 }, r = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 } }
D[1172] = { t = "La portée d'Onyxia", nv = 45, min = 38, te = "The Brood of Onyxia", av = 1171, g = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 }, r = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 }, c = { 1445, 51.8, 74.4 }, obj = "Activer 5 × Œuf d'Onyxia", oe = "Use 5 × Egg of Onyxia" }
D[1173] = { t = "Défier le Seigneur Mok'Morokk", nv = 45, min = 38, te = "Challenge Overlord Mok'Morokk", av = 1172, g = { "Seigneur Mok'Morokk", "Overlord Mok'Morokk", 1445, 36.3, 31.4 }, r = { "Draz'Zilb", "Draz'Zilb", 1445, 36.3, 31.4 } }
D[1175] = { t = "Les cahots de la piste", nv = 33, min = 28, te = "A Bump in the Road", g = { "Maître pisteur Zherin", "Trackmaster Zherin", 1441, 78.1, 77.1 }, r = { "Maître pisteur Zherin", "Trackmaster Zherin", 1441, 78.1, 77.1 }, c = { 1441, 80.3, 64.3 }, obj = "Vaincre 10 × Basilic du sel gemme ; Vaincre 10 × Peau de cristal du sel gemme ; Vaincre 6 × Contemplateur du sel gemme", oe = "Kill 10 × Saltstone Basilisk ; Kill 10 × Saltstone Crystalhide ; Kill 6 × Saltstone Gazer" }
D[1176] = { t = "Allégement de la structure", nv = 30, min = 29, te = "Load Lightening", g = { "Pozzik", "Pozzik", 1441, 78.1, 77.1 }, r = { "Pozzik", "Pozzik", 1441, 78.1, 77.1 }, c = { 1441, 70.9, 74.5 }, obj = "Rapporter 10 × Os creux de vautour", oe = "Bring 10 × Hollow Vulture Bone" }
D[1177] = { t = "Faim !", nv = 36, min = 32, te = "Hungry!", g = { "Pilebou Piessale", "Mudcrush Durtfeet", 1445, 35.2, 38.3 }, r = { "Pilebou Piessale", "Mudcrush Durtfeet", 1445, 35.2, 38.3 }, c = { 1445, 61, 8.2 }, obj = "Rapporter 8 × Tête d'Aileron boueux", oe = "Bring 8 × Mirefin Head" }
D[1178] = { t = "Mécénat gobelin", nv = 37, min = 29, te = "Goblin Sponsorship", av = 1176, g = { "Pozzik", "Pozzik", 1441, 78.1, 77.1 } }
D[1181] = { t = "Mécénat gobelin", nv = 37, min = 29, te = "Goblin Sponsorship", av = 1180, g = { "Maître des quais Lozouïe", "Wharfmaster Lozgil", 1434, 27, 77.1 }, r = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 } }
D[1182] = { t = "Mécénat gobelin", nv = 37, min = 29, te = "Goblin Sponsorship", av = 1181, g = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, r = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, c = { 1434, 43.3, 20.3 }, obj = "Rapporter Plan de régulateur de fuel", oe = "Bring Fuel Regulator Blueprints" }
D[1183] = { t = "Mécénat gobelin", nv = 37, min = 29, te = "Goblin Sponsorship", av = 1182, g = { "Baron Revilgaz", "Baron Revilgaz", 1434, 27, 77.1 }, c = { 1434, 43.3, 20.3 }, obj = "Rapporter Plan de régulateur de fuel", oe = "Bring Fuel Regulator Blueprints" }
D[1185] = { t = "Sous la chitine...", nv = 57, min = 54, te = "Under the Chitin Was...", av = 6845, g = { "Umber", "Umber", 1450, 44.9, 35.6 }, r = { "Umber", "Umber", 1450, 44.9, 35.6 } }
D[1186] = { t = "Le dix-huitième pilote", nv = 37, min = 29, te = "The Eighteenth Pilot", av = 1183, g = { "Pozzik", "Pozzik", 1441, 78.1, 77.1 }, r = { "Razzeric", "Razzeric", 1441, 78.1, 77.1 } }
D[1187] = { t = "Les trucs de Razzeric", nv = 41, min = 29, te = "Razzeric's Tweaking", av = 1186, g = { "Razzeric", "Razzeric", 1441, 78.1, 77.1 }, r = { "Razzeric", "Razzeric", 1441, 78.1, 77.1 }, obj = "Rapporter Lance-hydroglycérine", oe = "Bring Seaforium Booster" }
D[1188] = { t = "La sécurité d'abord", nv = 41, min = 29, te = "Safety First", av = 1187, g = { "Razzeric", "Razzeric", 1441, 78.1, 77.1 }, obj = "Rapporter Lance-hydroglycérine", oe = "Bring Seaforium Booster" }
D[1190] = { t = "Rester dans la course", nv = 41, min = 29, te = "Keeping Pace", av = 1137, g = { "Pozzik", "Pozzik", 1441, 78.1, 77.1 }, r = { "Plans de Séhouf", "Rizzle's Unguarded Plans", 1441, 78.1, 77.1 } }
D[1194] = { t = "Les schémas de Tropp", nv = 41, min = 29, te = "Rizzle's Schematics", av = 1190, g = { "Plans de Séhouf", "Rizzle's Unguarded Plans", 1441, 78.1, 77.1 }, r = { "Pozzik", "Pozzik", 1441, 78.1, 77.1 } }
D[1197] = { t = "La flamme sacrée", nv = 29, min = 20, te = "The Sacred Flame", av = 1196, g = { "Rau Cours-les-falaises", "Rau Cliffrunner", 1441, 46.1, 51.7 }, r = { "Rau Cours-les-falaises", "Rau Cliffrunner", 1441, 46.1, 51.7 }, c = { 1441, 42, 31.5 }, obj = "Rapporter Sabot fendu", oe = "Bring Cloven Hoof" }
D[1201] = { t = "Les espions de Theramore", nv = 35, min = 30, te = "Theramore Spies", g = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, r = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, c = { 1445, 40.1, 31.5 }, obj = "Vaincre 9 × Infiltrateur de Theramore", oe = "Kill 9 × Theramore Infiltrator" }
D[1202] = { t = "Les docks de Theramore", nv = 35, min = 30, te = "The Theramore Docks", av = 1201, g = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, r = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, c = { 1445, 71.5, 51.2 }, obj = "Rapporter Documents du capitaine", oe = "Bring Captain's Documents" }
D[1203] = { t = "Jarl a besoin d'une épée", nv = 35, min = 30, te = "Jarl Needs a Blade", av = 1206, g = { "Jarl « Oeil-des-marais »", "\"Swamp Eye\" Jarl", 1445, 55.4, 26.3 }, r = { "Jarl « Oeil-des-marais »", "\"Swamp Eye\" Jarl", 1445, 55.4, 26.3 }, obj = "Rapporter Epée d'acier lunaire", oe = "Bring Moonsteel Broadsword" }
D[1204] = { t = "Soupe de Rochefange aux insectes", nv = 38, min = 33, te = "Mudrock Soup and Bugs", g = { "Morgan Stern", "Morgan Stern", 1445, 66.3, 45.5 }, r = { "Morgan Stern", "Morgan Stern", 1445, 66.3, 45.5 }, c = { 1445, 61.5, 13.5 }, obj = "Rapporter 8 × Langue fourchue de Rochefange", oe = "Bring 8 × Forked Mudrock Tongue" }
D[1206] = { t = "Jarl a besoin d’yeux", nv = 35, min = 30, te = "Jarl Needs Eyes", av = 1218, g = { "Jarl « Oeil-des-marais »", "\"Swamp Eye\" Jarl", 1445, 55.4, 26.3 }, r = { "Jarl « Oeil-des-marais »", "\"Swamp Eye\" Jarl", 1445, 55.4, 26.3 }, obj = "Rapporter 20 × Oeil de Sombrebrume", oe = "Bring 20 × Unpopped Darkmist Eye" }
D[1218] = { t = "Les cuisses de grenouille des marais", nv = 35, min = 30, te = "Soothing Spices", g = { "Jarl « Oeil-des-marais »", "\"Swamp Eye\" Jarl", 1445, 55.4, 26.3 }, r = { "Jarl « Oeil-des-marais »", "\"Swamp Eye\" Jarl", 1445, 55.4, 26.3 }, obj = "Rapporter 3 × Epices apaisantes", oe = "Bring 3 × Soothing Spices" }
D[1219] = { t = "Le rapport orc", nv = 35, min = 30, te = "The Orc Report", g = { "Poussière flottante", "Loose Dirt", 1445, 55.4, 26.3 }, r = { "Lieutenant de Theramore", "Theramore Lieutenant", 1445, 67.1, 53.2 }, obj = "Rapporter Rapport d'espion", oe = "Bring Spy's Report" }
D[1220] = { t = "Le capitaine Vimaire", nv = 35, min = 30, te = "Captain Vimes", av = 1219, g = { "Lieutenant de Theramore", "Theramore Lieutenant", 1445, 67.1, 53.2 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 }, obj = "Rapporter Rapport d'espion", oe = "Bring Spy's Report" }
D[1222] = { t = "Sauvetage du Puant", nv = 37, min = 30, te = "Stinky's Escape", g = { "Ignatz « Puant »", "\"Stinky\" Ignatz", 1445, 46.9, 17.5 }, r = { "Morgan Stern", "Morgan Stern", 1445, 66.3, 45.5 } }
D[1238] = { t = "Le rapport perdu", nv = 35, min = 30, te = "The Lost Report", g = { "Poussière flottante", "Loose Dirt", 1445, 55.4, 26.3 }, r = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, obj = "Rapporter Rapport d'espion", oe = "Bring Spy's Report" }
D[1239] = { t = "La tête coupée", nv = 35, min = 30, te = "The Severed Head", av = 1238, g = { "Poussière flottante", "Loose Dirt", 1445, 55.4, 26.3 }, r = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, obj = "Rapporter Tête d'orc défiant", oe = "Bring Defiant Orc Head" }
D[1240] = { t = "Le féticheur troll", nv = 35, min = 30, te = "The Troll Witchdoctor", av = 1239, g = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, obj = "Rapporter Tête d'orc défiant", oe = "Bring Defiant Orc Head" }
D[1244] = { t = "Un diplomate a disparu", nv = 30, min = 28, te = "The Missing Diplomat", av = 1243, g = { "Gardien Backus", "Watcher Backus", 1431, 73.8, 43.5 }, r = { "Gardien Backus", "Watcher Backus", 1431, 73.8, 43.5 }, c = { 1431, 23.9, 72.1 }, obj = "Rapporter Registre des Défias", oe = "Bring Defias Docket" }
D[1245] = { t = "Un diplomate a disparu", nv = 30, min = 28, te = "The Missing Diplomat", av = 1244, g = { "Gardien Backus", "Watcher Backus", 1431, 73.8, 43.5 }, c = { 1431, 23.9, 72.1 }, obj = "Rapporter Registre des Défias", oe = "Bring Defias Docket" }
D[1249] = { t = "Un diplomate a disparu", nv = 33, min = 28, te = "The Missing Diplomat", av = 1248, g = { "Mikhail", "Mikhail", 1437, 8.3, 58.6 }, r = { "Mikhail", "Mikhail", 1437, 8.3, 58.6 } }
D[1250] = { t = "Un diplomate a disparu", nv = 33, min = 28, te = "The Missing Diplomat", av = 1249, g = { "Tapoke « le Mince » Jahn", "Tapoke \"Slim\" Jahn", 1437, 8.3, 58.6 }, r = { "Mikhail", "Mikhail", 1437, 8.3, 58.6 } }
D[1251] = { t = "Le bouclier noir", nv = 35, min = 30, te = "The Black Shield", g = { "Bouclier noir", "Black Shield", 1445, 29.6, 48.6 }, r = { "Krog", "Krog", 1445, 36.3, 31.4 }, obj = "Rapporter Bouclier en fer noirci", oe = "Bring Blackened Iron Shield" }
D[1252] = { t = "Le lieutenant Paval Reethe", nv = 40, min = 30, te = "Lieutenant Paval Reethe", g = { "Ecusson de la garde de Theramore", "Theramore Guard Badge", 1445, 29.8, 48.2 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 }, obj = "Rapporter Insigne de Reethe", oe = "Bring Reethe's Badge" }
D[1253] = { t = "Le Bouclier noir", nv = 35, min = 30, te = "The Black Shield", g = { "Bouclier noir", "Black Shield", 1445, 29.8, 48.2 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 }, obj = "Rapporter Bouclier en fer noirci", oe = "Bring Blackened Iron Shield" }
D[1258] = { t = "... Et des bestioles", nv = 40, min = 33, te = "... and Bugs", av = 1204, g = { "Morgan Stern", "Morgan Stern", 1445, 66.3, 45.5 }, r = { "Morgan Stern", "Morgan Stern", 1445, 66.3, 45.5 }, obj = "Rapporter 12 × Patte de clampant en parfait état", oe = "Bring 12 × Pristine Crawler Leg" }
D[1259] = { t = "Le lieutenant Paval Reethe", nv = 40, min = 30, te = "Lieutenant Paval Reethe", av = 1252, g = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 }, r = { "Adjudant Tesoran", "Adjutant Tesoran", 1445, 66.3, 45.5 } }
D[1261] = { t = "Marg parle", nv = 40, min = 30, te = "Marg Speaks", av = 1240, g = { "Chaudron bouillonnant", "Bubbling Cauldron", 1434, 32.2, 28.9 }, obj = "Rapporter Pendentif serti", oe = "Bring Jeweled Pendant" }
D[1262] = { t = "Rapport à Zor", nv = 40, min = 30, te = "Report to Zor", av = 1261, g = { "Nazeer Pique-sanglante", "Nazeer Bloodpike", 1445, 36.3, 31.4 }, c = { 1445, 55.3, 44.2 }, obj = "Rapporter Pendentif serti", oe = "Bring Jeweled Pendant" }
D[1264] = { t = "Un diplomate a disparu", nv = 33, min = 28, te = "The Missing Diplomat", av = 1250, g = { "Mikhail", "Mikhail", 1437, 8.3, 58.6 } }
D[1265] = { t = "Un diplomate a disparu", nv = 35, min = 28, te = "The Missing Diplomat", av = 1264, g = { "Commandant Samaul", "Commander Samaul", 1445, 66.3, 45.5 }, r = { "Archimage Tervosh", "Archmage Tervosh", 1445, 66.3, 45.5 } }
D[1266] = { t = "Un diplomate a disparu", nv = 36, min = 28, te = "The Missing Diplomat", av = 1265, g = { "Archimage Tervosh", "Archmage Tervosh", 1445, 66.3, 45.5 }, r = { "Soldat Hendel", "Private Hendel", 1445, 45.2, 24.7 } }
D[1267] = { t = "Un diplomate a disparu", nv = 38, min = 28, te = "The Missing Diplomat", av = 1324, g = { "Archimage Tervosh", "Archmage Tervosh", 1445, 66.3, 45.5 }, r = { "Dame Jaina Portvaillant", "Lady Jaina Proudmoore", 1445, 66.3, 45.5 } }
D[1268] = { t = "Des empreintes de sabots suspectes", nv = 35, min = 30, te = "Suspicious Hoofprints", g = { "Empreinte de sabot suspecte", "Suspicious Hoofprint", 1445, 29.6, 48.6 }, r = { "Krog", "Krog", 1445, 36.3, 31.4 } }
D[1269] = { t = "Le lieutenant Paval Reethe", nv = 37, min = 30, te = "Lieutenant Paval Reethe", g = { "Ecusson de la garde de Theramore", "Theramore Guard Badge", 1445, 29.6, 48.6 }, r = { "Krog", "Krog", 1445, 36.3, 31.4 }, obj = "Rapporter Insigne de Reethe", oe = "Bring Reethe's Badge" }
D[1270] = { t = "Sauvetage du Puant", nv = 37, min = 30, te = "Stinky's Escape", g = { "Ignatz « Puant »", "\"Stinky\" Ignatz", 1445, 46.9, 17.5 } }
D[1273] = { t = "Questionner Reethe", nv = 37, min = 30, te = "Questioning Reethe", av = 1269, g = { "Ogron", "Ogron", 1445, 41, 36.7 }, r = { "Krog", "Krog", 1445, 36.3, 31.4 } }
D[1276] = { t = "Le Bouclier noir", nv = 37, min = 30, te = "The Black Shield", av = 1323, g = { "Krog", "Krog", 1445, 36.3, 31.4 }, obj = "Rapporter Bouclier en fer noirci", oe = "Bring Blackened Iron Shield" }
D[1282] = { t = "Ils l'appellent Jim le Souriant", nv = 35, min = 30, te = "They Call Him Smiling Jim", g = { "Garde Byron", "Guard Byron", 1445, 66.3, 45.5 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 } }
D[1284] = { t = "Des empreintes de sabots suspectes", nv = 35, min = 30, te = "Suspicious Hoofprints", g = { "Empreinte de sabot suspecte", "Suspicious Hoofprint", 1445, 29.8, 48.2 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 } }
D[1285] = { t = "Les hommes de Daelin", nv = 38, min = 30, te = "Daelin's Men", av = 1259, g = { "Adjudant Tesoran", "Adjutant Tesoran", 1445, 66.3, 45.5 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 } }
D[1286] = { t = "Les déserteurs", nv = 38, min = 30, te = "The Deserters", av = 1285, g = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 }, r = { "Balos Jacken", "Balos Jacken", 1445, 36.1, 54.3 } }
D[1302] = { t = "James Hyal", nv = 35, min = 30, g = { "Vincent Hyal", "Vincent Hyal", 1437, 8.3, 58.6 } }
D[1319] = { t = "Le Bouclier noir", nv = 35, min = 30, te = "The Black Shield", av = 1253, g = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 }, r = { "Caz Bi-douille", "Caz Twosprocket", 1445, 67.1, 53.2 }, obj = "Rapporter Bouclier en fer noirci", oe = "Bring Blackened Iron Shield" }
D[1320] = { t = "Le Bouclier noir", nv = 35, min = 30, te = "The Black Shield", av = 1319, g = { "Caz Bi-douille", "Caz Twosprocket", 1445, 67.1, 53.2 }, r = { "Capitaine Garran Vimaire", "Captain Garran Vimes", 1445, 66.3, 45.5 } }
D[1321] = { t = "Le Bouclier noir", nv = 35, min = 30, te = "The Black Shield", av = 1251, g = { "Krog", "Krog", 1445, 36.3, 31.4 }, r = { "Do'gol", "Do'gol", 1445, 36.3, 31.4 }, obj = "Rapporter Bouclier en fer noirci", oe = "Bring Blackened Iron Shield" }
D[1322] = { t = "Le Bouclier noir", nv = 37, min = 30, te = "The Black Shield", av = 1321, g = { "Do'gol", "Do'gol", 1445, 36.3, 31.4 }, r = { "Do'gol", "Do'gol", 1445, 36.3, 31.4 }, c = { 1445, 41.3, 51.6 }, obj = "Rapporter 5 × Sac de venin acide", oe = "Bring 5 × Acidic Venom Sac" }
D[1323] = { t = "Le Bouclier noir", nv = 37, min = 30, te = "The Black Shield", av = 1322, g = { "Do'gol", "Do'gol", 1445, 36.3, 31.4 }, r = { "Krog", "Krog", 1445, 36.3, 31.4 } }
D[1324] = { t = "Un diplomate a disparu", nv = 38, min = 28, te = "The Missing Diplomat", av = 1266, g = { "Soldat Hendel", "Private Hendel", 1445, 45.2, 24.7 }, r = { "Archimage Tervosh", "Archmage Tervosh", 1445, 66.3, 45.5 } }
D[1338] = { t = "La mission de Foudrepique", nv = 14, min = 9, te = "Stormpike's Order", g = { "Montagnard foudrepique", "Mountaineer Stormpike", 1432, 24.8, 18.4 }, obj = "Rapporter Requête de Foudrepique", oe = "Bring Stormpike's Request" }
D[1339] = { t = "La mission du Montagnard Foudrepique", nv = 15, min = 9, te = "Mountaineer Stormpike's Task", g = { "Montagnard Kadrell", "Mountaineer Kadrell", 1432, 34.6, 44.5 }, r = { "Montagnard foudrepique", "Mountaineer Stormpike", 1432, 24.8, 18.4 } }
D[1359] = { t = "Une livraison pour Zinge", nv = 15, min = 10, te = "Zinge's Delivery", av = 3221, g = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 }, obj = "Rapporter Echantillons de coeur de loup", oe = "Bring Wolf Heart Samples" }
D[1361] = { t = "Regthar Seuil-de-mort", nv = 32, min = 30, te = "Regthar Deathgate", g = { "Krusk", "Krusk", 1424, 62.3, 20.5 } }
D[1365] = { t = "Khan Dez'hepah", nv = 35, min = 30, g = { "Felgur Doublecoupe", "Felgur Twocuts", 1443, 56.2, 59.6 }, r = { "Felgur Doublecoupe", "Felgur Twocuts", 1443, 56.2, 59.6 }, c = { 1443, 73.4, 41.6 }, obj = "Rapporter Tête du khan Dez'hepah", oe = "Bring Khan Dez'hepah's Head" }
D[1366] = { t = "La prime aux centaures", nv = 31, min = 30, te = "Centaur Bounty", av = 1365, g = { "Felgur Doublecoupe", "Felgur Twocuts", 1443, 56.2, 59.6 }, r = { "Felgur Doublecoupe", "Felgur Twocuts", 1443, 56.2, 59.6 }, obj = "Rapporter 15 × Oreille de centaure", oe = "Bring 15 × Centaur Ear" }
D[1367] = { t = "L'alliance avec les Magram", nv = 33, min = 30, te = "Magram Alliance", g = { "Gurda Crin-sauvage", "Gurda Wildmane", 1443, 56.2, 59.6 }, r = { "Warug", "Warug", 1443, 75, 68.2 } }
D[1368] = { t = "L'alliance avec les Gelkis", nv = 33, min = 30, te = "Gelkis Alliance", g = { "Gurda Crin-sauvage", "Gurda Wildmane", 1443, 56.2, 59.6 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 } }
D[1369] = { t = "Larmes brisées", nv = 33, min = 30, te = "Broken Tears", g = { "Warug", "Warug", 1443, 75, 68.2 }, r = { "Warug", "Warug", 1443, 75, 68.2 }, c = { 1443, 39.9, 93.4 }, obj = "Rapporter 3 × Larmes brisées", oe = "Bring 3 × Broken Tears" }
D[1370] = { t = "Voleur de viande", nv = 35, min = 30, te = "Stealing Supplies", g = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, c = { 1443, 71.1, 76.8 }, obj = "Rapporter 6 × Viande grossièrement séchée", oe = "Bring 6 × Crudely Dried Meat" }
D[1371] = { t = "Un bidule pour Warug", nv = 35, min = 30, te = "Gizmo for Warug", av = 1369, g = { "Warug", "Warug", 1443, 75, 68.2 }, r = { "Warug", "Warug", 1443, 75, 68.2 }, obj = "Rapporter Leurre perfectionné", oe = "Bring Advanced Target Dummy" }
D[1373] = { t = "Ongeku", nv = 37, min = 30, av = 1370, g = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, obj = "Rapporter Fragment de draenéthyste", oe = "Bring Draenethyst Shard" }
D[1374] = { t = "Khan Jehn", nv = 37, min = 30, av = 1373, g = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, c = { 1443, 65.9, 80.4 }, obj = "Rapporter Tête du khan Jehn", oe = "Bring Khan Jehn's Head" }
D[1375] = { t = "Khan Shaka", nv = 37, min = 30, av = 1371, g = { "Warug", "Warug", 1443, 75, 68.2 }, r = { "Warug", "Warug", 1443, 75, 68.2 }, c = { 1443, 40.5, 95.5 }, obj = "Rapporter Tête du khan Shaka", oe = "Bring Khan Shaka's Head" }
D[1380] = { t = "Khan Hratha", nv = 42, min = 30, av = 1374, g = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, obj = "Rapporter Fragment de clé des Maraudine", oe = "Bring Maraudine Key Fragment" }
D[1381] = { t = "Khan Hratha", nv = 42, min = 30, av = 1375, g = { "Warug", "Warug", 1443, 75, 68.2 }, r = { "Warug", "Warug", 1443, 75, 68.2 }, obj = "Rapporter Fragment de clé des Maraudine", oe = "Bring Maraudine Key Fragment" }
D[1382] = { t = "Une étrange alliance", nv = 35, min = 30, te = "Strange Alliance", g = { "Capitaine Pentigast", "Captain Pentigast", 1443, 66.5, 7.9 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 } }
D[1384] = { t = "Raid sur les Kolkars", nv = 32, min = 30, te = "Raid on the Kolkar", av = 1382, g = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, r = { "Uthek la Sage", "Uthek the Wise", 1443, 36.2, 79.2 }, c = { 1443, 71.2, 45.4 }, obj = "Rapporter 10 × Charme brut", oe = "Bring 10 × Crude Charm" }
D[1385] = { t = "Une violente politique", nv = 35, min = 30, te = "Brutal Politics", g = { "Capitaine Pentigast", "Captain Pentigast", 1443, 66.5, 7.9 }, r = { "Warug", "Warug", 1443, 75, 68.2 } }
D[1386] = { t = "Assaut sur les Kolkars", nv = 32, min = 30, te = "Assault on the Kolkar", av = 1385, g = { "Warug", "Warug", 1443, 75, 68.2 }, r = { "Warug", "Warug", 1443, 75, 68.2 }, c = { 1443, 70.6, 45.2 }, obj = "Vaincre 12 × Centaure kolkar ; Vaincre 12 × Eclaireur kolkar ; Vaincre 6 × Marteleur kolkar", oe = "Kill 12 × Kolkar Centaur ; Kill 12 × Kolkar Scout ; Kill 6 × Kolkar Mauler" }
D[1387] = { t = "La prime aux centaures", nv = 31, min = 30, te = "Centaur Bounty", g = { "Caporal Melkins", "Corporal Melkins", 1443, 66.5, 7.9 }, r = { "Caporal Melkins", "Corporal Melkins", 1443, 66.5, 7.9 }, obj = "Rapporter 15 × Oreille de centaure", oe = "Bring 15 × Centaur Ear" }
D[1419] = { t = "Les coyotes voleurs", nv = 40, min = 30, te = "Coyote Thieves", g = { "Neeka Balafre-sanglante", "Neeka Bloodscar", 1418, 6.5, 47.2 }, r = { "Neeka Balafre-sanglante", "Neeka Bloodscar", 1418, 6.5, 47.2 }, c = { 1418, 57.3, 56.5 }, obj = "Rapporter 30 × Mâchoire de coyote", oe = "Bring 30 × Coyote Jawbone" }
D[1420] = { t = "Le rapport à Helgrum", nv = 40, min = 30, te = "Report to Helgrum", g = { "Neeka Balafre-sanglante", "Neeka Bloodscar", 1418, 6.5, 47.2 }, obj = "Rapporter Rapport de Neeka", oe = "Bring Neeka's Report" }
D[1422] = { t = "Le danger venu des flots", nv = 45, min = 35, te = "Threat From the Sea", av = 699, g = { "Tok'Kar", "Tok'Kar", 1435, 81.3, 81 }, r = { "Katar", "Katar", 1435, 81.3, 81 } }
D[1424] = { t = "Le bassin des larmes", nv = 43, min = 38, te = "Pool of Tears", g = { "Fel'zerul", "Fel'zerul", 1435, 47.9, 54.8 }, r = { "Fel'zerul", "Fel'zerul", 1435, 47.9, 54.8 }, c = { 1435, 72.2, 54 }, obj = "Rapporter 10 × Artefact atal'ai", oe = "Bring 10 × Atal'ai Artifact" }
D[1426] = { t = "Le danger venu des flots", nv = 43, min = 35, te = "Threat From the Sea", av = 1422, g = { "Katar", "Katar", 1435, 81.3, 81 }, r = { "Katar", "Katar", 1435, 81.3, 81 }, c = { 1435, 86.3, 83.5 }, obj = "Vaincre 10 × Murloc des marais ; Vaincre 10 × Cracheur des marais ; Vaincre 10 × Dévoreur des marais", oe = "Kill 10 × Marsh Murloc ; Kill 10 × Marsh Inkspewer ; Kill 10 × Marsh Flesheater" }
D[1427] = { t = "Le danger venu des flots", nv = 43, min = 35, te = "Threat From the Sea", av = 1426, g = { "Katar", "Katar", 1435, 81.3, 81 }, r = { "Tok'Kar", "Tok'Kar", 1435, 81.3, 81 } }
D[1428] = { t = "Le danger permanent", nv = 45, min = 35, te = "Continued Threat", av = 1427, g = { "Katar", "Katar", 1435, 81.3, 81 }, r = { "Katar", "Katar", 1435, 81.3, 81 }, c = { 1435, 65, 82.4 }, obj = "Vaincre 10 × Cracheur des marais ; Vaincre 10 × Dévoreur des marais ; Vaincre 10 × Oracle des marais", oe = "Kill 10 × Marsh Inkspewer ; Kill 10 × Marsh Flesheater ; Kill 10 × Marsh Oracle" }
D[1429] = { t = "L'Exilé atal'ai", nv = 44, min = 38, te = "The Atal'ai Exile", av = 1424, g = { "Fel'zerul", "Fel'zerul", 1435, 47.9, 54.8 }, obj = "Rapporter Artefacts atal'ai", oe = "Bring Bundle of Atal'ai Artifacts" }
D[1430] = { t = "Viande fraîche", nv = 44, min = 35, te = "Fresh Meat", g = { "Dar", "Dar", 1435, 44.7, 57.2 }, r = { "Dar", "Dar", 1435, 44.7, 57.2 }, c = { 1435, 93.9, 62.8 }, obj = "Rapporter 10 × Patte de clampant monstrueux", oe = "Bring 10 × Monstrous Crawler Leg" }
D[1433] = { t = "Les relations de l'Alliance", nv = 33, min = 30, te = "Alliance Relations", av = 1432, g = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 }, r = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 } }
D[1434] = { t = "Souillé par les satyres", nv = 33, min = 25, te = "Befouled by Satyr", g = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 }, r = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 }, c = { 1443, 75.5, 18.3 }, obj = "Vaincre 7 × Voleur Fielfurie ; Vaincre 7 × Gangrelige Fielfurie ; Vaincre 7 × Traître Fielfurie ; Vaincre 7 × Implorateur de l'enfer Fielfurie", oe = "Kill 7 × Hatefury Rogue ; Kill 7 × Hatefury Felsworn ; Kill 7 × Hatefury Betrayer ; Kill 7 × Hatefury Hellcaller" }
D[1435] = { t = "Esprits consumés", nv = 33, min = 25, te = "The Burning of Spirits", av = 1433, g = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, r = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, obj = "Rapporter Gemme ardente ; Rapporter 15 × Gemme ardente canalisée", oe = "Bring Burning Gem ; Bring 15 × Infused Burning Gem" }
D[1436] = { t = "Les relations de l'Alliance", nv = 33, min = 30, te = "Alliance Relations", av = 1435, g = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 } }
D[1437] = { t = "La recherche de Vahlarriel", nv = 33, min = 30, te = "Vahlarriel's Search", g = { "Vahlarriel Tueur-de-démons", "Vahlarriel Demonslayer", 1443, 66.5, 7.9 }, r = { "Coffre de Malem", "Malem Chest", 1443, 56.5, 17.8 } }
D[1438] = { t = "La recherche de Vahlarriel", nv = 33, min = 30, te = "Vahlarriel's Search", av = 1465, g = { "Vahlarriel Tueur-de-démons", "Vahlarriel Demonslayer", 1443, 66.5, 7.9 }, r = { "Dalinda Malem", "Dalinda Malem", 1443, 54.9, 26.1 } }
D[1439] = { t = "À la recherche de Tyranis", nv = 33, min = 30, te = "Search for Tyranis", av = 1438, g = { "Dalinda Malem", "Dalinda Malem", 1443, 54.9, 26.1 }, r = { "Dalinda Malem", "Dalinda Malem", 1443, 54.9, 26.1 }, c = { 1443, 53, 29.1 }, obj = "Rapporter Pendentif de Tyranis", oe = "Bring Tyranis' Pendant" }
D[1440] = { t = "Le retour vers Vahlarriel", nv = 33, min = 30, te = "Return to Vahlarriel", av = 1439, g = { "Dalinda Malem", "Dalinda Malem", 1443, 54.9, 26.1 }, r = { "Vahlarriel Tueur-de-démons", "Vahlarriel Demonslayer", 1443, 66.5, 7.9 } }
D[1444] = { t = "De retour vers Fel’Zerul", nv = 44, min = 38, te = "Return to Fel'Zerul", av = 1429, g = { "Exilé atal'ai", "Atal'ai Exile", 1425, 33.8, 75.2 } }
D[1450] = { t = "Le maître des griffons Hachegriffe", nv = 43, min = 38, te = "Gryphon Master Talonaxe", av = 1449, g = { "Falstad Marteau-hardi", "Falstad Wildhammer", 1425, 11.8, 46.8 }, r = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 } }
D[1451] = { t = "Rhapsody Croquejarret", nv = 43, min = 38, te = "Rhapsody Shindigger", av = 1450, g = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, r = { "Rhapsody Croquejarret", "Rhapsody Shindigger", 1425, 26.9, 48.6 } }
D[1452] = { t = "Le Kocktail Kalimdor de Rhapsody", nv = 43, min = 38, te = "Rhapsody's Kalimdor Kocktail", av = 1451, g = { "Rhapsody Croquejarret", "Rhapsody Shindigger", 1425, 26.9, 48.6 }, r = { "Rhapsody Croquejarret", "Rhapsody Shindigger", 1425, 26.9, 48.6 }, obj = "Rapporter 3 × Gésier de Roc ; Rapporter 3 × Foie de Ferpoil ; Rapporter 3 × Foie de Groddoc", oe = "Bring 3 × Roc Gizzard ; Bring 3 × Ironfur Liver ; Bring 3 × Groddoc Liver" }
D[1454] = { t = "L'épave de Karnitol", nv = 39, min = 30, te = "The Karnitol Shipwreck", av = 1453, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, r = { "Coffre de Karnitol", "Karnitol's Chest", 1443, 36.1, 30.5 } }
D[1455] = { t = "L'épave de Karnitol", nv = 39, min = 30, te = "The Karnitol Shipwreck", av = 1454, g = { "Coffre de Karnitol", "Karnitol's Chest", 1443, 36.1, 30.5 }, r = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 } }
D[1456] = { t = "L'épave de Karnitol", nv = 39, min = 30, te = "The Karnitol Shipwreck", av = 1455, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, r = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, c = { 1443, 31.7, 11.3 }, obj = "Rapporter Sacoche de Karnitol", oe = "Bring Karnitol's Satchel" }
D[1457] = { t = "L'épave de Karnitol", nv = 39, min = 30, te = "The Karnitol Shipwreck", av = 1456, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, c = { 1443, 31.7, 11.3 }, obj = "Rapporter Sacoche de Karnitol", oe = "Bring Karnitol's Satchel" }
D[1458] = { t = "Des réactifs pour les Récupérateurs", nv = 33, min = 30, te = "Reagents for Reclaimers Inc.", av = 1453, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, r = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, c = { 1443, 76.1, 19.4 }, obj = "Rapporter 10 × Griffe de Fielfurie ; Rapporter 10 × Corne de Fielfurie", oe = "Bring 10 × Hatefury Claw ; Bring 10 × Hatefury Horn" }
D[1459] = { t = "Des réactifs pour les Récupérateurs", nv = 35, min = 30, te = "Reagents for Reclaimers Inc.", av = 1458, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, r = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, c = { 1443, 66, 28.6 }, obj = "Rapporter 7 × Venin scorpashi ; Rapporter 3 × Peau de vieux kodo", oe = "Bring 7 × Scorpashi Venom ; Bring 3 × Aged Kodo Hide" }
D[1465] = { t = "La recherche de Vahlarriel", nv = 33, min = 30, te = "Vahlarriel's Search", av = 1437, g = { "Coffre de Malem", "Malem Chest", 1443, 56.5, 17.8 }, r = { "Vahlarriel Tueur-de-démons", "Vahlarriel Demonslayer", 1443, 66.5, 7.9 }, obj = "Rapporter Pendentif de Malem", oe = "Bring Malem Pendant" }
D[1466] = { t = "Des réactifs pour les Récupérateurs", nv = 40, min = 30, te = "Reagents for Reclaimers Inc.", av = 1459, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, r = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, c = { 1443, 52.7, 77.4 }, obj = "Rapporter 10 × Cervelle de gangrechien ; Rapporter 10 × Aile du Néant ; Rapporter 10 × Sang de garde funeste", oe = "Bring 10 × Felhound Brain ; Bring 10 × Nether Wing ; Bring 10 × Doomwarder Blood" }
D[1467] = { t = "Des réactifs pour les Récupérateurs", nv = 40, min = 30, te = "Reagents for Reclaimers Inc.", av = 1466, g = { "Kreldig Ungor", "Kreldig Ungor", 1443, 66.5, 7.9 }, obj = "Rapporter Caisse de Leftwitch", oe = "Bring Leftwitch's Package" }
D[1469] = { t = "L'histoire de Rhapsody", nv = 43, min = 38, te = "Rhapsody's Tale", av = 1452, g = { "Rhapsody Croquejarret", "Rhapsody Shindigger", 1425, 26.9, 48.6 }, obj = "Rapporter Fragment de tablette atal'ai", oe = "Bring Atal'ai Tablet Fragment" }
D[1470] = { t = "Lever le voile", nv = 3, min = 1, te = "Piercing the Veil", g = { "Venya Marthand", "Venya Marthand", 1420, 30.8, 66.2 }, r = { "Venya Marthand", "Venya Marthand", 1420, 30.8, 66.2 }, c = { 1420, 33.3, 62.2 }, obj = "Rapporter 3 × Crâne de Cliquethorax", oe = "Bring 3 × Rattlecage Skull" }
D[1471] = { t = "Le lien", nv = 10, min = 10, te = "The Binding", g = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, r = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, obj = "Vaincre Marcheur du Vide invoqué", oe = "Kill Summoned Voidwalker" }
D[1472] = { t = "La dévoreuse d'âmes", nv = 20, min = 20, te = "Devourer of Souls", g = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, r = { "Godrick Farsan", "Godrick Farsan", 1458, 84.8, 14.8 } }
D[1473] = { t = "La créature du Vide", nv = 10, min = 10, te = "Creature of the Void", g = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, r = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, obj = "Rapporter Grimoire d'Egalin", oe = "Bring Egalin's Grimoire" }
D[1474] = { t = "Le lien", nv = 20, min = 20, te = "The Binding", g = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, r = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, obj = "Vaincre Succube invoquée", oe = "Kill Summoned Succubus" }
D[1476] = { t = "Des cœurs purs", nv = 20, min = 20, te = "Hearts of the Pure", g = { "Godrick Farsan", "Godrick Farsan", 1458, 84.8, 14.8 }, r = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 }, obj = "Rapporter Coeur de Dalin ; Rapporter Cœur de Corma", oe = "Bring Dalin's Heart ; Bring Corma's Heart" }
D[1478] = { t = "Les invocations de Halgar", nv = 10, min = 10, te = "Halgar's Summons", g = { "Ageron Kargal", "Ageron Kargal", 1420, 61.7, 52 }, r = { "Carendin Halgar", "Carendin Halgar", 1458, 85.1, 26 } }
D[1481] = { t = "Le corrupteur", nv = 33, min = 25, te = "The Corrupter", av = 1480, g = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, r = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, c = { 1443, 76.3, 20 }, obj = "Rapporter Scalp de Traqueur des ténèbres", oe = "Bring Shadowstalker Scalp" }
D[1482] = { t = "Le corrupteur", nv = 35, min = 25, te = "The Corrupter", av = 1481, g = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, r = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, c = { 1443, 31.4, 10.8 }, obj = "Rapporter Cristal d'oracle", oe = "Bring Oracle Crystal" }
D[1483] = { t = "Ziz Fizzik", nv = 21, min = 16, te = "Ziz Fizziks", g = { "Krachevalve", "Sputtervalve", 1413, 63, 37.2 } }
D[1484] = { t = "Le corrupteur", nv = 35, min = 25, te = "The Corrupter", av = 1482, g = { "Maurin Craquossement", "Maurin Bonesplitter", 1443, 52.6, 54.4 }, r = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 } }
D[1485] = { t = "Les vils quasits", nv = 4, min = 1, te = "Vile Familiars", g = { "Ruzan", "Ruzan", 1411, 42.1, 68.3 }, r = { "Ruzan", "Ruzan", 1411, 42.1, 68.3 }, c = { 1411, 44.3, 55.5 }, obj = "Rapporter 6 × Tête de Vil quasit", oe = "Bring 6 × Vile Familiar Head" }
D[1488] = { t = "Le corrupteur", nv = 40, min = 25, te = "The Corrupter", av = 1484, g = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 }, r = { "Takata Lamacier", "Takata Steelblade", 1443, 52.6, 54.4 }, c = { 1443, 56.4, 76.8 }, obj = "Vaincre Seigneur Azrethoc ; Vaincre Jugkar Grim'rod", oe = "Kill Lord Azrethoc ; Kill Jugkar Grim'rod" }
D[1489] = { t = "Hamuul Totem-runique", nv = 16, min = 12, te = "Hamuul Runetotem", av = 880, g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 } }
D[1492] = { t = "Maître des quais Tournoupette", nv = 11, min = 9, te = "Wharfmaster Dizzywig", g = { "Apothicaire Helbrim", "Apothecary Helbrim", 1413, 52.2, 31 }, r = { "Maître des quais Tournoupette", "Wharfmaster Dizzywig", 1413, 62.3, 38.4 }, obj = "Rapporter Caisse sûre", oe = "Bring Secure Crate" }
D[1498] = { t = "La voie de la défense", nv = 10, min = 10, te = "Path of Defense", av = 1505, g = { "Uzzek", "Uzzek", 1413, 61.4, 21.1 }, r = { "Uzzek", "Uzzek", 1413, 61.4, 21.1 }, obj = "Rapporter 5 × Ecaille roussie", oe = "Bring 5 × Singed Scale" }
D[1499] = { t = "Les vils quasits", nv = 4, min = 1, te = "Vile Familiars", av = 1485, g = { "Ruzan", "Ruzan", 1411, 42.1, 68.3 }, r = { "Zureetha Mireloin", "Zureetha Fargaze", 1411, 42.1, 68.3 } }
D[1501] = { t = "La créature du Vide", nv = 11, min = 10, te = "Creature of the Void", g = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, r = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, obj = "Rapporter Tablette de Verga", oe = "Bring Tablet of Verga" }
D[1502] = { t = "Thun'grim Mirefeu", nv = 10, min = 10, te = "Thun'grim Firegaze", av = 1498, g = { "Uzzek", "Uzzek", 1413, 61.4, 21.1 }, r = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 } }
D[1503] = { t = "Acier forgé", nv = 10, min = 10, te = "Forged Steel", av = 1502, g = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, r = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, c = { 1413, 55, 26.7 }, obj = "Rapporter Barres d'acier forgé", oe = "Bring Forged Steel Bars" }
D[1504] = { t = "Le lien", nv = 11, min = 10, te = "The Binding", g = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, r = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, obj = "Vaincre Marcheur du Vide invoqué", oe = "Kill Summoned Voidwalker" }
D[1505] = { t = "Le vétéran Uzzek", nv = 10, min = 10, te = "Veteran Uzzek", g = { "Krang Sabot-de-pierre", "Krang Stonehoof", 1412, 46.5, 64.9 }, r = { "Uzzek", "Uzzek", 1413, 61.4, 21.1 } }
D[1506] = { t = "Les invocations de Gan'rul", nv = 10, min = 10, te = "Gan'rul's Summons", g = { "Ophek", "Ophek", 1411, 51.9, 43.5 }, r = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 } }
D[1507] = { t = "La dévoreuse d'âmes", nv = 20, min = 20, te = "Devourer of Souls", g = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, r = { "Cazul", "Cazul", 1454, 47.1, 46.4 } }
D[1508] = { t = "Cazul l'aveugle", nv = 20, min = 20, te = "Blind Cazul", g = { "Cazul", "Cazul", 1454, 47.1, 46.4 }, r = { "Zankaja", "Zankaja", 1454, 37, 59.4 } }
D[1509] = { t = "Des nouvelles de Dogran", nv = 20, min = 20, te = "News of Dogran", g = { "Zankaja", "Zankaja", 1454, 37, 59.4 }, r = { "Gazrog", "Gazrog", 1413, 51.9, 30.3 } }
D[1510] = { t = "Des nouvelles de Dogran", nv = 20, min = 20, te = "News of Dogran", av = 1509, g = { "Gazrog", "Gazrog", 1413, 52.2, 31 }, r = { "Ken'zigla", "Ken'zigla", 1442, 73.2, 95.1 } }
D[1511] = { t = "Breuvage de Ken'zigla", nv = 20, min = 20, te = "Ken'zigla's Draught", av = 1510, g = { "Ken'zigla", "Ken'zigla", 1442, 74.5, 97.9 }, obj = "Rapporter Breuvage de Ken'zigla", oe = "Bring Ken'zigla's Draught", r = { "Grunt Logmar", "Grunt Logmar", 1413, 44.6, 59.3 } }
D[1512] = { t = "Le cadeau de l'amour", nv = 20, min = 20, te = "Love's Gift", av = 1515, g = { "Grunt Dogran", "Grunt Dogran", 1413, 43.3, 47.9 }, obj = "Rapporter Pendentif de poussière", oe = "Bring Dirt-caked Pendant", r = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 } }
D[1513] = { t = "Le lien", nv = 20, min = 20, te = "The Binding", g = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, r = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, obj = "Vaincre Succube invoquée", oe = "Kill Summoned Succubus" }
D[1515] = { t = "La captivité de Dogran", nv = 20, min = 20, te = "Dogran's Captivity", av = 1511, g = { "Grunt Logmar", "Grunt Logmar", 1413, 44.9, 59.1 }, r = { "Grunt Dogran", "Grunt Dogran", 1413, 43.3, 47.9 }, obj = "Rapporter Breuvage de Ken'zigla", oe = "Bring Ken'zigla's Draught" }
D[1516] = { t = "L'appel de la terre", nv = 4, min = 4, te = "Call of Earth", g = { "Canaga Hucheterre", "Canaga Earthcaller", 1411, 42.1, 68.3 }, r = { "Canaga Hucheterre", "Canaga Earthcaller", 1411, 42.1, 68.3 }, c = { 1411, 44.3, 53.7 }, obj = "Rapporter 2 × Sabot de traqueur corrompu", oe = "Bring 2 × Felstalker Hoof" }
D[1517] = { t = "L'appel de la terre", nv = 4, min = 4, te = "Call of Earth", av = 1516, g = { "Canaga Hucheterre", "Canaga Earthcaller", 1411, 42.1, 68.3 }, r = { "Manifestation de terre mineure", "Minor Manifestation of Earth", 1412, 52, 80.4 } }
D[1518] = { t = "L'appel de la terre", nv = 4, min = 4, te = "Call of Earth", av = 1517, g = { "Manifestation de terre mineure", "Minor Manifestation of Earth", 1412, 48.8, 80.9 }, obj = "Rapporter Quartz brut", oe = "Bring Rough Quartz", r = { "Canaga Hucheterre", "Canaga Earthcaller", 1411, 42.4, 69.2 } }
D[1519] = { t = "L'appel de la terre", nv = 4, min = 4, te = "Call of Earth", g = { "Prophétesse Plume-de-corbeau", "Seer Ravenfeather", 1412, 44.5, 77.5 }, r = { "Prophétesse Plume-de-corbeau", "Seer Ravenfeather", 1412, 44.5, 77.5 }, c = { 1412, 57.5, 77.5 }, obj = "Rapporter 2 × Baume rituel", oe = "Bring 2 × Ritual Salve" }
D[1520] = { t = "L'appel de la terre", nv = 4, min = 4, te = "Call of Earth", av = 1519, g = { "Prophétesse Plume-de-corbeau", "Seer Ravenfeather", 1412, 44.5, 77.5 }, r = { "Manifestation de terre mineure", "Minor Manifestation of Earth", 1412, 48.8, 80.9 } }
D[1521] = { t = "L'appel de la terre", nv = 4, min = 4, te = "Call of Earth", av = 1520, g = { "Manifestation de terre mineure", "Minor Manifestation of Earth", 1412, 48.8, 80.9 }, r = { "Prophétesse Plume-de-corbeau", "Seer Ravenfeather", 1412, 44.5, 77.5 }, obj = "Rapporter Quartz brut", oe = "Bring Rough Quartz" }
D[1522] = { t = "L'appel du feu", nv = 10, min = 10, te = "Call of Fire", g = { "Searn Gardefeux", "Searn Firewarder", 1454, 38, 37.7 }, r = { "Kranal Fiss", "Kranal Fiss", 1413, 56, 19.9 } }
D[1524] = { t = "L'appel du feu", nv = 11, min = 10, te = "Call of Fire", g = { "Kranal Fiss", "Kranal Fiss", 1413, 56, 19.9 }, obj = "Rapporter Torche de la flamme dormante", oe = "Bring Torch of the Dormant Flame", r = { "Telf Joolam", "Telf Joolam", 1411, 38.6, 59 } }
D[1525] = { t = "L'appel du feu", nv = 12, min = 10, te = "Call of Fire", av = 1524, g = { "Telf Joolam", "Telf Joolam", 1411, 38.6, 59 }, r = { "Telf Joolam", "Telf Joolam", 1411, 38.6, 59 }, c = { 1411, 52.7, 25.4 }, obj = "Rapporter Goudron de feu ; Rapporter Bourse de réactifs", oe = "Bring Fire Tar ; Bring Reagent Pouch" }
D[1526] = { t = "L'appel du feu", nv = 13, min = 10, te = "Call of Fire", av = 1525, g = { "Telf Joolam", "Telf Joolam", 1411, 38.6, 59 }, r = { "Brasero de la Flamme Dormante", "Brazier of the Dormant Flame", 1411, 38.6, 59 }, c = { 1411, 38.7, 58.3 }, obj = "Rapporter Torche de la flamme dormante ; Rapporter Braise rougeoyante", oe = "Bring Torch of the Dormant Flame ; Bring Glowing Ember" }
D[1527] = { t = "L'appel du feu", nv = 13, min = 10, te = "Call of Fire", av = 1526, g = { "Brasero de la Flamme Dormante", "Brazier of the Dormant Flame", 1411, 38.6, 59 }, obj = "Rapporter Torche de la flamme éternelle", oe = "Bring Torch of the Eternal Flame", r = { "Kranal Fiss", "Kranal Fiss", 1413, 56, 19.9 } }
D[1528] = { t = "L'appel de l'eau", nv = 20, min = 20, te = "Call of Water", g = { "Searn Gardefeux", "Searn Firewarder", 1454, 38, 37.7 }, r = { "Islen Oeil-des-rivières", "Islen Waterseer", 1413, 65.8, 43.8 } }
D[1530] = { t = "L'appel de l'eau", nv = 22, min = 20, te = "Call of Water", g = { "Islen Oeil-des-rivières", "Islen Waterseer", 1413, 65.8, 43.9 }, r = { "Brine", "Brine", 1413, 45.9, 77 } }
D[1531] = { t = "L'appel de l'air", nv = 30, min = 30, te = "Call of Air", g = { "Searn Gardefeux", "Searn Firewarder", 1454, 38, 37.7 }, r = { "Prate Oeil-des-nuages", "Prate Cloudseer", 1441, 53.5, 42.6 } }
D[1534] = { t = "L'appel de l'eau", nv = 23, min = 20, te = "Call of Water", av = 1536, g = { "Brine", "Brine", 1413, 45.9, 77 }, r = { "Brine", "Brine", 1413, 45.9, 77 }, obj = "Rapporter Outre bleue remplie", oe = "Bring Filled Blue Waterskin" }
D[1535] = { t = "L'appel de l'eau", nv = 22, min = 20, te = "Call of Water", av = 1530, g = { "Brine", "Brine", 1413, 45.9, 77 }, r = { "Brine", "Brine", 1413, 45.9, 77 }, obj = "Rapporter Outre marron remplie", oe = "Bring Filled Brown Waterskin" }
D[1536] = { t = "L'appel de l'eau", nv = 22, min = 20, te = "Call of Water", av = 1535, g = { "Brine", "Brine", 1413, 45.9, 77 }, r = { "Brine", "Brine", 1413, 45.9, 77 }, obj = "Rapporter Outre rouge remplie", oe = "Bring Filled Red Waterskin" }
D[1559] = { t = "La recette de la bombe éclairante", nv = 37, min = 30, te = "Flash Bomb Recipe", av = 705, g = { "Rigglefuzz", "Rigglefuzz", 1418, 42.4, 52.9 }, r = { "Rigglefuzz", "Rigglefuzz", 1418, 42.4, 52.9 } }
D[1560] = { t = "La quête de Tooga", nv = 50, min = 40, te = "Tooga's Quest", g = { "Tooga", "Tooga", 1446, 31.8, 74.1 }, r = { "Torta", "Torta", 1446, 66.6, 25.7 } }
D[1579] = { t = "Rouages électriques", nv = 12, min = 10, te = "Gaffer Jacks", g = { "Crackboum Tournelevier", "Wizbang Cranktoggle", 1439, 37.4, 41.8 }, r = { "Crackboum Tournelevier", "Wizbang Cranktoggle", 1439, 37.4, 41.8 }, obj = "Rapporter 8 × Rouage électrique", oe = "Bring 8 × Gaffer Jack" }
D[1580] = { t = "Pêche aux Electropellers", nv = 12, min = 10, te = "Electropellers", av = 1579, g = { "Crackboum Tournelevier", "Wizbang Cranktoggle", 1439, 37.4, 41.8 }, r = { "Crackboum Tournelevier", "Wizbang Cranktoggle", 1439, 37.4, 41.8 }, obj = "Rapporter 12 × Electropeller", oe = "Bring 12 × Electropeller" }
D[1581] = { t = "Les élixirs pour les Feuillelame", nv = 8, min = 4, te = "Elixirs for the Bladeleafs", g = { "Syral Feuillelame", "Syral Bladeleaf", 1438, 56, 57.3 }, r = { "Syral Feuillelame", "Syral Bladeleaf", 1438, 56, 57.3 }, obj = "Rapporter 6 × Élixir de Force mineure ; Rapporter 2 × Elixir de défense mineure", oe = "Bring 6 × Elixir of Minor Strength ; Bring 2 × Elixir of Minor Defense" }
D[1598] = { t = "Le Tome dérobé", nv = 4, min = 1, te = "The Stolen Tome", g = { "Drusilla La Salle", "Drusilla La Salle", 1429, 48.2, 42.9 }, r = { "Drusilla La Salle", "Drusilla La Salle", 1429, 48.2, 42.9 }, c = { 1429, 56.7, 44 }, obj = "Rapporter Puissance du Vide", oe = "Bring Powers of the Void" }
D[1599] = { t = "Les débuts", nv = 4, min = 1, te = "Beginnings", g = { "Alamar Grimm", "Alamar Grimm", 1426, 28.8, 66.4 }, r = { "Alamar Grimm", "Alamar Grimm", 1426, 28.8, 66.4 }, c = { 1426, 29.7, 81.8 }, obj = "Rapporter 3 × Charme de plume", oe = "Bring 3 × Feather Charm" }
D[1638] = { t = "L'entraînement du guerrier", nv = 10, min = 10, te = "A Warrior's Training", g = { "Lyria Du Lac", "Lyria Du Lac", 1429, 42.1, 65.9 }, r = { "Harry Burlguard", "Harry Burlguard", 1453, 77.1, 53.3 } }
D[1639] = { t = "Bartleby le poivrot", nv = 10, min = 10, te = "Bartleby the Drunk", g = { "Harry Burlguard", "Harry Burlguard", 1453, 77.1, 53.3 }, r = { "Bartleby", "Bartleby", 1453, 76.8, 52.5 } }
D[1640] = { t = "Battre Bartleby", nv = 10, min = 10, te = "Beat Bartleby", g = { "Bartleby", "Bartleby", 1453, 76.8, 52.5 }, r = { "Bartleby", "Bartleby", 1453, 76.8, 52.5 } }
D[1642] = { t = "Le Tome de divinité", nv = 12, min = 12, te = "The Tome of Divinity", r = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 } }
D[1643] = { t = "Le Tome de divinité", nv = 12, min = 12, te = "The Tome of Divinity", g = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 }, r = { "Stephanie Turner", "Stephanie Turner", 1453, 63.8, 72.2 } }
D[1644] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Stephanie Turner", "Stephanie Turner", 1453, 63.8, 72.2 }, r = { "Stephanie Turner", "Stephanie Turner", 1453, 63.8, 72.2 }, obj = "Rapporter 10 × Etoffe de lin", oe = "Bring 10 × Linen Cloth" }
D[1646] = { t = "Le Tome de divinité", nv = 12, min = 12, te = "The Tome of Divinity", r = { "Tiza Forgeguerre", "Tiza Battleforge", 1455, 27.6, 12.2 } }
D[1647] = { t = "Le Tome de divinité", nv = 12, min = 12, te = "The Tome of Divinity", g = { "Tiza Forgeguerre", "Tiza Battleforge", 1455, 27.6, 12.2 }, r = { "John Turner", "John Turner", 1455, 23.3, 61.9 } }
D[1648] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "John Turner", "John Turner", 1455, 23.3, 61.9 }, r = { "John Turner", "John Turner", 1455, 23.3, 61.9 }, obj = "Rapporter 10 × Etoffe de lin", oe = "Bring 10 × Linen Cloth" }
D[1649] = { t = "Le Tome de la bravoure", nv = 20, min = 20, te = "The Tome of Valor", r = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 } }
D[1650] = { t = "Le Tome de la bravoure", nv = 23, min = 20, te = "The Tome of Valor", g = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 }, r = { "Daphne Morpuits", "Daphne Stilwell", 1436, 41.7, 89.2 } }
D[1651] = { t = "Le Tome de la bravoure", nv = 25, min = 20, te = "The Tome of Valor", av = 1650, g = { "Daphne Morpuits", "Daphne Stilwell", 1436, 41.7, 89.2 }, r = { "Daphne Morpuits", "Daphne Stilwell", 1436, 41.7, 89.2 } }
D[1652] = { t = "Le Tome de la bravoure", nv = 25, min = 20, te = "The Tome of Valor", av = 1651, g = { "Daphne Morpuits", "Daphne Stilwell", 1436, 41.7, 89.2 }, r = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 } }
D[1653] = { t = "Le test de droiture", nv = 21, min = 20, te = "The Test of Righteousness", g = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 }, r = { "Jordan Morpuits", "Jordan Stilwell", 1455, 8.8, 98.6 } }
D[1654] = { t = "Le test de droiture", nv = 22, min = 20, te = "The Test of Righteousness", g = { "Jordan Morpuits", "Jordan Stilwell", 1455, 8.8, 98.6 }, r = { "Jordan Morpuits", "Jordan Stilwell", 1455, 8.8, 98.6 }, obj = "Rapporter Bois de chêne de blanchepierre ; Rapporter Cargaison de minerai raffiné de Jordan ; Rapporter Marteau de forge de Jordan ; Rapporter Gemme de Kor purifiée", oe = "Bring Whitestone Oak Lumber ; Bring Jordan's Refined Ore Shipment ; Bring Jordan's Smithing Hammer ; Bring Purified Kor Gem" }
D[1656] = { t = "Une tâche inachevée", nv = 5, min = 1, te = "A Task Unfinished", g = { "Antur Terre-des-friches", "Antur Fallow", 1412, 39.2, 81.2 }, r = { "Kauth l'aubergiste", "Innkeeper Kauth", 1412, 46.5, 64.9 }, obj = "Rapporter Ballot de fourrures", oe = "Bring Bundle of Furs" }
D[1661] = { t = "Le Tome de noblesse", nv = 40, min = 40, te = "The Tome of Nobility", g = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 }, r = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 } }
D[1665] = { t = "Tasse de Bartleby", nv = 10, min = 10, te = "Bartleby's Mug", g = { "Bartleby", "Bartleby", 1453, 76.8, 52.5 }, r = { "Harry Burlguard", "Harry Burlguard", 1453, 77.1, 53.3 }, obj = "Rapporter Tasse de Bartleby", oe = "Bring Bartleby's Mug" }
D[1666] = { t = "Le maréchal Haggard", nv = 10, min = 10, te = "Marshal Haggard", g = { "Harry Burlguard", "Harry Burlguard", 1453, 77.1, 53.3 }, r = { "Maréchal Haggard", "Marshal Haggard", 1429, 84.6, 69.4 } }
D[1667] = { t = "Jack Dent-Morte", nv = 10, min = 10, te = "Dead-tooth Jack", av = 1666, g = { "Maréchal Haggard", "Marshal Haggard", 1429, 84.6, 69.4 }, r = { "Maréchal Haggard", "Marshal Haggard", 1429, 84.6, 69.4 }, c = { 1429, 89.3, 78.9 }, obj = "Rapporter Plaque du maréchal Haggard", oe = "Bring Marshal Haggard's Badge" }
D[1678] = { t = "Vejrek", nv = 11, min = 10, g = { "Muren Foudrepique", "Muren Stormpike", 1455, 70.8, 90.3 }, r = { "Muren Foudrepique", "Muren Stormpike", 1455, 70.8, 90.3 }, obj = "Rapporter Tête de Vejrek", oe = "Bring Vejrek's Head" }
D[1679] = { t = "Muren Foudrepique", nv = 10, min = 10, te = "Muren Stormpike", g = { "Granis Vivehache", "Granis Swiftaxe", 1426, 46.7, 53.8 }, r = { "Muren Foudrepique", "Muren Stormpike", 1455, 70.8, 90.3 } }
D[1680] = { t = "Tormus Forge-profonde", nv = 11, min = 10, te = "Tormus Deepforge", g = { "Muren Foudrepique", "Muren Stormpike", 1455, 70.8, 90.3 }, r = { "Tormus Forge-profonde", "Tormus Deepforge", 1455, 48.6, 42.5 } }
D[1681] = { t = "Base de Baguefer", nv = 11, min = 10, te = "Ironband's Compound", g = { "Tormus Forge-profonde", "Tormus Deepforge", 1455, 48.6, 42.5 }, r = { "Tormus Forge-profonde", "Tormus Deepforge", 1455, 48.6, 42.5 }, obj = "Rapporter Minerai d'Umbral", oe = "Bring Umbral Ore" }
D[1682] = { t = "Armes en fer gris", nv = 10, min = 10, te = "Grey Iron Weapons", g = { "Tormus Forge-profonde", "Tormus Deepforge", 1455, 48.6, 42.5 }, r = { "Tormus Forge-profonde", "Tormus Deepforge", 1455, 48.6, 42.5 } }
D[1683] = { t = "Vorlus Vilsabot", nv = 10, min = 10, te = "Vorlus Vilehoof", g = { "Elanaria", "Elanaria", 1457, 57.3, 34.6 }, r = { "Elanaria", "Elanaria", 1457, 57.3, 34.6 }, obj = "Rapporter Corne de Vorlus", oe = "Bring Horn of Vorlus" }
D[1684] = { t = "Elanaria", nv = 10, min = 10, g = { "Prêtresse de la lune Amara", "Moon Priestess Amara", 1438, 56, 57.3 }, r = { "Elanaria", "Elanaria", 1457, 57.3, 34.6 } }
D[1685] = { t = "Convocation de Gakin", nv = 10, min = 10, te = "Gakin's Summons", g = { "Remen Marcot", "Remen Marcot", 1429, 42.1, 65.9 }, r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 } }
D[1686] = { t = "L'Ombre d'Elura", nv = 10, min = 10, te = "The Shade of Elura", g = { "Elanaria", "Elanaria", 1457, 57.3, 34.6 }, r = { "Elanaria", "Elanaria", 1457, 57.3, 34.6 }, obj = "Rapporter 8 × Minerai d'Elunite ; Rapporter Médaillon d'Elura", oe = "Bring 8 × Elunite Ore ; Bring Elura's Medallion" }
D[1688] = { t = "Surena Caledon", nv = 10, min = 10, g = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, obj = "Rapporter Foulard de Surena", oe = "Bring Surena's Choker" }
D[1689] = { t = "Le lien", nv = 10, min = 10, te = "The Binding", g = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, obj = "Vaincre Marcheur du Vide invoqué", oe = "Kill Summoned Voidwalker" }
D[1690] = { t = "Châtier les Bat-le-désert", nv = 43, min = 40, te = "Wastewander Justice", g = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, r = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, c = { 1446, 62.7, 29 }, obj = "Vaincre 10 × Bandit Bat-le-désert ; Vaincre 10 × Larron Bat-le-désert", oe = "Kill 10 × Wastewander Bandit ; Kill 10 × Wastewander Thief" }
D[1691] = { t = "Continuer à châtier les Bat-le-désert", nv = 44, min = 40, te = "More Wastewander Justice", av = 1690, g = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, r = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, c = { 1446, 62, 37.3 }, obj = "Vaincre 8 × Voleur Bat-le-désert ; Vaincre 6 × Assassin Bat-le-désert ; Vaincre 10 × Mage de l'ombre Bat-le-désert", oe = "Kill 8 × Wastewander Rogue ; Kill 6 × Wastewander Assassin ; Kill 10 × Wastewander Shadow Mage" }
D[1692] = { t = "Forgeron Mathiel", nv = 10, min = 10, te = "Smith Mathiel", g = { "Elanaria", "Elanaria", 1457, 57.3, 34.6 }, r = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 }, obj = "Rapporter Caisse d'Elunite", oe = "Bring Case of Elunite" }
D[1693] = { t = "Armes en élunite", nv = 10, min = 10, te = "Weapons of Elunite", g = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 }, r = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 } }
D[1698] = { t = "Yorus Brasselorge", nv = 20, min = 20, te = "Yorus Barleybrew", g = { "Wu Shen", "Wu Shen", 1453, 80.6, 59.9 }, r = { "Yorus Brasselorge", "Yorus Barleybrew", 1433, 21.5, 44.7 } }
D[1699] = { t = "Le défi de Rethban", nv = 22, min = 20, te = "The Rethban Gauntlet", g = { "Yorus Brasselorge", "Yorus Barleybrew", 1433, 24.6, 44.3 }, r = { "Yorus Brasselorge", "Yorus Barleybrew", 1433, 24.6, 44.3 } }
D[1700] = { t = "Grimand Elmore", nv = 28, min = 20, g = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 }, r = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, obj = "Rapporter Notes de Furen", oe = "Bring Furen's Notes" }
D[1701] = { t = "Une cotte de mailles en acier trempé", nv = 28, min = 20, te = "Fire Hardened Mail", g = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 }, r = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 }, obj = "Rapporter 50 × Croc d'araignée brûlé ; Rapporter 12 × Corne carbonisée ; Rapporter Corne galvanisée ; Rapporter Fiole de Phlogiston", oe = "Bring 50 × Scorched Spider Fang ; Bring 12 × Charred Horn ; Bring Galvanized Horn ; Bring Vial of Phlogiston" }
D[1702] = { t = "Fabricant de bouclier", nv = 22, min = 20, te = "The Shieldsmith", av = 1699, g = { "Yorus Brasselorge", "Yorus Barleybrew", 1433, 24.6, 44.3 }, obj = "Rapporter Barrique de Scalder", oe = "Bring Cask of Scalder", r = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 } }
D[1703] = { t = "Mathiel", nv = 28, min = 20, g = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 }, r = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 }, obj = "Rapporter Notes de Furen", oe = "Bring Furen's Notes" }
D[1704] = { t = "Pléthorloge Cléventail", nv = 28, min = 20, te = "Klockmort Spannerspan", g = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 }, r = { "Pléthorloge Cléventail", "Klockmort Spannerspan", 1455, 67.9, 46.1 }, obj = "Rapporter Notes de Furen", oe = "Bring Furen's Notes" }
D[1705] = { t = "Le sang ardent", nv = 28, min = 20, te = "Burning Blood", g = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, r = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, obj = "Rapporter 20 × Sang ardent ; Rapporter Roc ardent", oe = "Bring 20 × Burning Blood ; Bring Burning Rock" }
D[1706] = { t = "L'armure de Grimand", nv = 30, min = 20, te = "Grimand's Armor", g = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, r = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 } }
D[1707] = { t = "Une prime pour les outres", nv = 44, min = 40, te = "Water Pouch Bounty", g = { "Opérateur du robinet Trimballot", "Spigot Operator Luglunket", 1446, 50.2, 27.5 }, r = { "Opérateur du robinet Trimballot", "Spigot Operator Luglunket", 1446, 50.2, 27.5 }, c = { 1446, 62.7, 35.5 }, obj = "Rapporter 5 × Outre de Bat-le-désert", oe = "Bring 5 × Wastewander Water Pouch" }
D[1708] = { t = "Le corail de fer", nv = 29, min = 20, te = "Iron Coral", g = { "Pléthorloge Cléventail", "Klockmort Spannerspan", 1455, 67.9, 46.1 }, r = { "Pléthorloge Cléventail", "Klockmort Spannerspan", 1455, 67.9, 46.1 }, obj = "Rapporter 20 × Corail torride", oe = "Bring 20 × Searing Coral" }
D[1709] = { t = "La création de Pléthorloge", nv = 30, min = 20, te = "Klockmort's Creation", g = { "Pléthorloge Cléventail", "Klockmort Spannerspan", 1455, 67.9, 46.1 }, r = { "Pléthorloge Cléventail", "Klockmort Spannerspan", 1455, 67.9, 46.1 } }
D[1710] = { t = "Coquilles desséchées au soleil", nv = 30, min = 20, te = "Sunscorched Shells", g = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 }, r = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 }, obj = "Rapporter 20 × Coquille brûlée par le soleil", oe = "Bring 20 × Sunscorched Shell" }
D[1711] = { t = "L'armure de Mathiel", nv = 30, min = 20, te = "Mathiel's Armor", g = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 }, r = { "Mathiel", "Mathiel", 1457, 59.5, 45.4 } }
D[1712] = { t = "Cyclonien", nv = 40, min = 30, te = "Cyclonian", g = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, obj = "Rapporter 8 × Vietérule ; Rapporter 30 × Défense de Bloodscalp ; Rapporter Essence d'exil", oe = "Bring 8 × Liferoot ; Bring 30 × Bloodscalp Tusk ; Bring Essence of the Exile" }
D[1713] = { t = "L'invocation", nv = 40, min = 30, te = "The Summoning", g = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, obj = "Rapporter Coeur de tourbillon", oe = "Bring Whirlwind Heart" }
D[1715] = { t = "L'Agneau assassiné", nv = 10, min = 10, te = "The Slaughtered Lamb", g = { "Lago Tournevice", "Lago Blackwrench", 1455, 47.6, 9.3 }, r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 } }
D[1716] = { t = "La dévoreuse d'âmes", nv = 20, min = 20, te = "Devourer of Souls", g = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, r = { "Takar le Prophète", "Takar the Seer", 1413, 49.3, 57.1 } }
D[1717] = { t = "Convocation de Gakin", nv = 20, min = 20, te = "Gakin's Summons", g = { "Lago Tournevice", "Lago Blackwrench", 1455, 47.6, 9.3 }, r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 } }
D[1718] = { t = "L'île mortelle", nv = 30, min = 30, te = "The Islander", g = { "Torm Totem-de-rage", "Torm Ragetotem", 1456, 57.2, 87.4 }, r = { "Klannoc Macleod", "Klannoc Macleod", 1413, 68.6, 49.2 } }
D[1719] = { t = "La Dispute", nv = 30, min = 30, te = "The Affray", av = 1718, g = { "Klannoc Macleod", "Klannoc Macleod", 1413, 68.6, 49.2 }, r = { "Klannoc Macleod", "Klannoc Macleod", 1413, 68.6, 49.2 }, obj = "Vaincre Grand Will", oe = "Kill Big Will" }
D[1738] = { t = "Le cœur du bois", nv = 20, min = 20, te = "Heartswood", av = 1716, g = { "Takar le Prophète", "Takar the Seer", 1413, 49.3, 57.1 }, obj = "Rapporter Coeur du bois", oe = "Bring Heartswood", r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 } }
D[1739] = { t = "Le lien", nv = 20, min = 20, te = "The Binding", g = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, r = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, obj = "Vaincre Succube invoquée", oe = "Kill Summoned Succubus" }
D[1740] = { t = "L'Orbe de Soran'ruk", nv = 25, min = 20, te = "The Orb of Soran'ruk", g = { "Doan Karhan", "Doan Karhan", 1413, 49.3, 57.1 }, r = { "Doan Karhan", "Doan Karhan", 1413, 49.3, 57.1 }, obj = "Rapporter 3 × Fragment de Soran'ruk ; Rapporter Grand fragment de Soran'ruk", oe = "Bring 3 × Soran'ruk Fragment ; Bring Large Soran'ruk Fragment" }
D[1758] = { t = "Tome de la Cabale", nv = 30, min = 30, te = "Tome of the Cabal", g = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, r = { "Krom Rudebras", "Krom Stoutarm", 1455, 74.2, 9.4 } }
D[1778] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "John Turner", "John Turner", 1455, 23.3, 61.9 }, r = { "Tiza Forgeguerre", "Tiza Battleforge", 1455, 27.6, 12.2 } }
D[1779] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Tiza Forgeguerre", "Tiza Battleforge", 1455, 27.6, 12.2 }, r = { "Muiredon Forgeguerre", "Muiredon Battleforge", 1455, 23.5, 8.3 } }
D[1780] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Stephanie Turner", "Stephanie Turner", 1453, 63.8, 72.2 }, r = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 } }
D[1781] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 }, r = { "Gazin Tenorm", "Gazin Tenorm", 1453, 49.5, 45 } }
D[1782] = { t = "L'armure de Furen", nv = 28, min = 20, te = "Furen's Armor", g = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 }, r = { "Furen Barbe-longue", "Furen Longbeard", 1453, 64.6, 37.2 } }
D[1783] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Muiredon Forgeguerre", "Muiredon Battleforge", 1455, 23.5, 8.3 }, r = { "Narm Faulk", "Narm Faulk", 1426, 78.3, 58.1 }, obj = "Utiliser Symbole de vie sur Narm Faulk", oe = "Use Symbol of Life on Narm Faulk" }
D[1784] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", av = 1783, g = { "Narm Faulk", "Narm Faulk", 1426, 78.3, 58.1 }, c = { 1426, 77.5, 60.9 }, obj = "Rapporter Script sombrefer", oe = "Bring Dark Iron Script", r = { "Muiredon Forgeguerre", "Muiredon Battleforge", 1455, 23.5, 8.3 } }
D[1785] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Muiredon Forgeguerre", "Muiredon Battleforge", 1455, 23.5, 8.3 }, r = { "Tiza Forgeguerre", "Tiza Battleforge", 1455, 27.6, 12.2 } }
D[1786] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Gazin Tenorm", "Gazin Tenorm", 1453, 49.5, 45 }, r = { "Henze Faulk", "Henze Faulk", 1429, 72.6, 51.4 }, obj = "Utiliser Symbole de vie sur Henze Faulk", oe = "Use Symbol of Life on Henze Faulk" }
D[1787] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", av = 1786, g = { "Henze Faulk", "Henze Faulk", 1429, 72.6, 51.4 }, c = { 1429, 74.1, 51.5 }, obj = "Rapporter Script défias", oe = "Bring Defias Script", r = { "Gazin Tenorm", "Gazin Tenorm", 1453, 49.5, 45 } }
D[1788] = { t = "Le Tome de divinité", nv = 13, min = 12, te = "The Tome of Divinity", g = { "Gazin Tenorm", "Gazin Tenorm", 1453, 49.5, 45 }, r = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 } }
D[1791] = { t = "La Vigie des vents", nv = 30, min = 30, te = "The Windwatcher", av = 1719, g = { "Klannoc Macleod", "Klannoc Macleod", 1413, 68.6, 49.2 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 } }
D[1792] = { t = "Arme Tourbillon", nv = 40, min = 30, te = "Whirlwind Weapon", g = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 } }
D[1795] = { t = "Le lien", nv = 30, min = 30, te = "The Binding", g = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, obj = "Rapporter Tome de la Cabale ; Vaincre Chasseur corrompu invoqué", oe = "Bring Tome of the Cabal ; Kill Summoned Felhunter" }
D[1796] = { t = "Les composants de la robe sanglante dorée enchantée", nv = 31, min = 31, te = "Components for the Enchanted Gold Bloodrobe", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, obj = "Rapporter Robe d'Arcana", oe = "Bring Robes of Arcana" }
D[1798] = { t = "À la recherche de Strahad", nv = 30, min = 30, te = "Seeking Strahad", g = { "Gakin le Tisse-noir", "Gakin the Darkbinder", 1453, 39.2, 85.2 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 } }
D[1799] = { t = "Fragments de l'Orbe d'Orahil", nv = 40, min = 35, te = "Fragments of the Orb of Orahil", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Rapporter Orbe infernal", oe = "Bring Infernal Orb" }
D[1801] = { t = "Tome de la Cabale", nv = 30, min = 30, te = "Tome of the Cabal", g = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, r = { "Jorah Annison", "Jorah Annison", 1458, 75.9, 37.9 } }
D[1802] = { t = "Tome de la Cabale", nv = 30, min = 30, te = "Tome of the Cabal", g = { "Krom Rudebras", "Krom Stoutarm", 1455, 74.2, 9.4 }, r = { "Krom Rudebras", "Krom Stoutarm", 1455, 74.2, 9.4 }, obj = "Rapporter Tome moisi ; Rapporter Manuscrit en lambeaux", oe = "Bring Moldy Tome ; Bring Tattered Manuscript" }
D[1803] = { t = "Tome de la Cabale", nv = 30, min = 30, te = "Tome of the Cabal", g = { "Jorah Annison", "Jorah Annison", 1458, 75.9, 37.9 }, r = { "Jorah Annison", "Jorah Annison", 1458, 75.9, 37.9 }, obj = "Rapporter Tome moisi ; Rapporter Manuscrit en lambeaux", oe = "Bring Moldy Tome ; Bring Tattered Manuscript" }
D[1804] = { t = "Tome de la Cabale", nv = 30, min = 30, te = "Tome of the Cabal", g = { "Krom Rudebras", "Krom Stoutarm", 1455, 74.2, 9.4 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, obj = "Rapporter Tome recomposé ; Rapporter 3 × Bâtonnet de canalisation", oe = "Bring Reconstructed Tome ; Bring 3 × Rod of Channeling" }
D[1805] = { t = "Tome de la Cabale", nv = 30, min = 30, te = "Tome of the Cabal", g = { "Jorah Annison", "Jorah Annison", 1458, 75.9, 37.9 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, obj = "Rapporter Tome recomposé ; Rapporter 3 × Bâtonnet de canalisation", oe = "Bring Reconstructed Tome ; Bring 3 × Rod of Channeling" }
D[1806] = { t = "Le test de droiture", nv = 22, min = 20, te = "The Test of Righteousness", g = { "Jordan Morpuits", "Jordan Stilwell", 1455, 8.8, 98.6 }, r = { "Jordan Morpuits", "Jordan Stilwell", 1455, 8.8, 98.6 } }
D[1818] = { t = "Parler à Dillinger", nv = 10, min = 10, te = "Speak with Dillinger", g = { "Austil de Mon", "Austil de Mon", 1420, 61.7, 52 }, r = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 } }
D[1819] = { t = "Ulag le Fendeur", nv = 10, min = 10, te = "Ulag the Cleaver", av = 1818, g = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, r = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, obj = "Vaincre Ulag le Fendeur", oe = "Kill Ulag the Cleaver" }
D[1820] = { t = "Parler à Coleman", nv = 10, min = 10, te = "Speak with Coleman", av = 1819, g = { "Nécrogarde Dillinger", "Deathguard Dillinger", 1420, 61.7, 52 }, r = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 } }
D[1821] = { t = "L'héritage des Agamand", nv = 11, min = 10, te = "Agamand Heirlooms", av = 1820, g = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, r = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, c = { 1420, 51.7, 25.7 }, obj = "Rapporter Hache de la famille Agamand ; Rapporter Dague de la famille Agamand ; Rapporter Masse de la famille Agamand ; Rapporter Epée de la famille Agamand", oe = "Bring Agamand Family Axe ; Bring Agamand Family Dagger ; Bring Agamand Family Mace ; Bring Agamand Family Sword" }
D[1822] = { t = "Une arme en héritage", nv = 11, min = 10, te = "Heirloom Weapon", av = 1821, g = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 }, r = { "Coleman Farthing", "Coleman Farthing", 1420, 61.7, 52 } }
D[1823] = { t = "Parler à Ruga", nv = 20, min = 20, te = "Speak with Ruga", g = { "Sorek", "Sorek", 1454, 80.4, 32.4 }, r = { "Ruga Totem-de-rage", "Ruga Ragetotem", 1413, 44.7, 59.4 } }
D[1824] = { t = "L'épreuve du Champ des géants", nv = 20, min = 20, te = "Trial at the Field of Giants", g = { "Ruga Totem-de-rage", "Ruga Ragetotem", 1413, 44.9, 59.1 }, r = { "Ruga Totem-de-rage", "Ruga Ragetotem", 1413, 44.9, 59.1 }, c = { 1413, 45.3, 70.7 }, obj = "Rapporter 5 × Antenne mobile", oe = "Bring 5 × Twitching Antenna" }
D[1825] = { t = "Parler à Thun'grim", nv = 20, min = 20, te = "Speak with Thun'grim", av = 1824, g = { "Ruga Totem-de-rage", "Ruga Ragetotem", 1413, 44.9, 59.1 }, r = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 } }
D[1838] = { t = "Armure de brutalité", nv = 30, min = 20, te = "Brutal Armor", av = 1825, g = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, r = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, obj = "Rapporter 15 × Lingot de fer cendré ; Rapporter 10 × Azurite en poudre ; Rapporter 10 × Barre de fer ; Rapporter Fiole de Phlogiston", oe = "Bring 15 × Smoky Iron Ingot ; Bring 10 × Powdered Azurite ; Bring 10 × Iron Bar ; Bring Vial of Phlogiston" }
D[1839] = { t = "Ula'elek et les Gantelets de brutalité", nv = 30, min = 20, te = "Ula'elek and the Brutal Gauntlets", av = 1838, g = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, r = { "Ula'elek", "Ula'elek", 1411, 56.3, 74.3 } }
D[1840] = { t = "Orm Sabot-de-pierre et le Camail de brutalité", nv = 30, min = 20, te = "Orm Stonehoof and the Brutal Helm", av = 1838, g = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, r = { "Orm Sabot-de-pierre", "Orm Stonehoof", 1456, 39, 56 } }
D[1841] = { t = "Velora Nitely et les garde-jambes de brutalité", nv = 30, min = 20, te = "Velora Nitely and the Brutal Legguards", av = 1838, g = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, r = { "Velora Nitely", "Velora Nitely", 1458, 62.1, 39.1 } }
D[1842] = { t = "Les sabots de satyre", nv = 30, min = 20, te = "Satyr Hooves", g = { "Ula'elek", "Ula'elek", 1411, 56.3, 74.3 }, r = { "Ula'elek", "Ula'elek", 1411, 56.3, 74.3 }, obj = "Rapporter 7 × Sabot fendu de satyre", oe = "Bring 7 × Uncloven Satyr Hoof" }
D[1843] = { t = "Gantelets de brutalité", nv = 30, min = 20, te = "Brutal Gauntlets", g = { "Ula'elek", "Ula'elek", 1411, 56.3, 74.3 }, r = { "Ula'elek", "Ula'elek", 1411, 56.3, 74.3 } }
D[1844] = { t = "La corne de chimère", nv = 30, min = 20, te = "Chimaeric Horn", g = { "Orm Sabot-de-pierre", "Orm Stonehoof", 1456, 39, 56 }, r = { "Orm Sabot-de-pierre", "Orm Stonehoof", 1456, 39, 56 }, obj = "Rapporter Corne galvanisée", oe = "Bring Galvanized Horn" }
D[1845] = { t = "Camail de brutalité", nv = 30, min = 20, te = "Brutal Helm", g = { "Orm Sabot-de-pierre", "Orm Stonehoof", 1456, 39, 56 }, r = { "Orm Sabot-de-pierre", "Orm Stonehoof", 1456, 39, 56 } }
D[1846] = { t = "Les tibias de Gueule-de-dragon", nv = 30, min = 20, te = "Dragonmaw Shinbones", g = { "Velora Nitely", "Velora Nitely", 1458, 62.1, 39.1 }, r = { "Velora Nitely", "Velora Nitely", 1458, 62.1, 39.1 }, obj = "Rapporter 8 × Solide tibia de Dragonmaw", oe = "Bring 8 × Sturdy Dragonmaw Shinbone" }
D[1847] = { t = "Les garde-jambes de brutalité", nv = 30, min = 20, te = "Brutal Legguards", g = { "Velora Nitely", "Velora Nitely", 1458, 62.1, 39.1 }, r = { "Velora Nitely", "Velora Nitely", 1458, 62.1, 39.1 } }
D[1848] = { t = "Le haubert de brutalité", nv = 30, min = 20, te = "Brutal Hauberk", av = 1838, g = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 }, r = { "Thun'grim Mirefeu", "Thun'grim Firegaze", 1413, 57.2, 30.3 } }
D[1858] = { t = "La Main brisée", nv = 13, min = 10, te = "The Shattered Hand", g = { "Therzok", "Therzok", 1454, 42.7, 53.6 }, r = { "Therzok", "Therzok", 1454, 42.7, 53.6 }, obj = "Rapporter Journal des messages de Tazan", oe = "Bring Tazan's Logbook" }
D[1859] = { t = "Therzok", nv = 10, min = 10, g = { "Kaplak", "Kaplak", 1411, 51.9, 43.5 }, r = { "Therzok", "Therzok", 1454, 42.7, 53.6 } }
D[1860] = { t = "Parler à Jennea", nv = 10, min = 10, te = "Speak with Jennea", g = { "Zaldimar Wefhellt", "Zaldimar Wefhellt", 1429, 42.1, 65.9 }, r = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 } }
D[1861] = { t = "Le lac Miroir", nv = 10, min = 10, te = "Mirror Lake", g = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, r = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, obj = "Rapporter Echantillon d'eau du lac Miroir", oe = "Bring Mirror Lake Water Sample" }
D[1879] = { t = "Parler à Bink", nv = 10, min = 10, te = "Speak with Bink", g = { "Magis Mantincelle", "Magis Sparkmantle", 1426, 46.7, 53.8 }, r = { "Bink", "Bink", 1455, 27.2, 8.3 } }
D[1880] = { t = "Le Bidulotron de youplala", nv = 10, min = 10, te = "Mage-tastic Gizmonitor", g = { "Bink", "Bink", 1455, 27.2, 8.3 }, r = { "Bink", "Bink", 1455, 27.2, 8.3 }, obj = "Rapporter Bidulotron de youplala", oe = "Bring Mage-tastic Gizmonitor" }
D[1881] = { t = "Parler à Anastasia", nv = 10, min = 10, te = "Speak with Anastasia", g = { "Cain Chantefeu", "Cain Firesong", 1420, 61.7, 52 }, r = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 } }
D[1882] = { t = "La ferme des Balnir", nv = 10, min = 10, te = "The Balnir Farmstead", g = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, r = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, obj = "Rapporter Gueules-de-loup de Balnir", oe = "Bring Balnir Snapdragons" }
D[1883] = { t = "Parler à Un'thuwa", nv = 10, min = 10, te = "Speak with Un'thuwa", g = { "Uthel'nay", "Uthel'nay", 1454, 39.2, 86.3 }, r = { "Un'Thuwa", "Un'Thuwa", 1411, 56.3, 75.1 } }
D[1884] = { t = "Les Tas de Ju-Ju", nv = 10, min = 10, te = "Ju-Ju Heaps", g = { "Un'Thuwa", "Un'Thuwa", 1411, 54.2, 73.3 }, r = { "Un'Thuwa", "Un'Thuwa", 1411, 54.2, 73.3 }, c = { 1411, 67.6, 84.8 }, obj = "Activer 4 × Monceau Ju-Ju", oe = "Use 4 × Ju-Ju Heap" }
D[1885] = { t = "Mennet Carkad", nv = 10, min = 10, g = { "Marion Call", "Marion Call", 1420, 61.7, 52 }, r = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 } }
D[1886] = { t = "Les nécrotraqueurs", nv = 13, min = 10, te = "The Deathstalkers", g = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, r = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, obj = "Rapporter Lettre d'introduction d'Astor", oe = "Bring Astor's Letter of Introduction" }
D[1898] = { t = "Les nécrotraqueurs", nv = 13, min = 10, te = "The Deathstalkers", g = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, r = { "Andron Gant", "Andron Gant", 1458, 54.8, 76.3 }, obj = "Rapporter Lettre d'introduction d'Astor", oe = "Bring Astor's Letter of Introduction" }
D[1899] = { t = "Les nécrotraqueurs", nv = 13, min = 10, te = "The Deathstalkers", g = { "Andron Gant", "Andron Gant", 1458, 54.8, 76.3 }, r = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, obj = "Rapporter Grand Livre d’Andron", oe = "Bring Andron's Ledger" }
D[1919] = { t = "Rendre compte à Jennea", nv = 15, min = 15, te = "Report to Jennea", g = { "Zaldimar Wefhellt", "Zaldimar Wefhellt", 1429, 42.1, 65.9 }, r = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 } }
D[1920] = { t = "Trouver le Solitaire bleu", nv = 16, min = 15, te = "Investigate the Blue Recluse", g = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, r = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, obj = "Rapporter 3 × Coffre de stockage rempli ; Rapporter Caisse de coffres de stockage ; Rapporter Chants de manifestation", oe = "Bring 3 × Filled Containment Coffer ; Bring Chest of Containment Coffers ; Bring Cantation of Manifestation" }
D[1921] = { t = "Rassembler les matériaux", nv = 15, min = 15, te = "Gathering Materials", g = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, r = { "Wynne Larson", "Wynne Larson", 1453, 51.8, 83.5 }, obj = "Rapporter 10 × Etoffe de lin ; Rapporter 6 × Gemme chargée de la faille", oe = "Bring 10 × Linen Cloth ; Bring 6 × Charged Rift Gem" }
D[1938] = { t = "Traité d'Ur sur la Magie des Ombres", nv = 28, min = 26, te = "Ur's Treatise on Shadow Magic", g = { "Grand sorcier Andromath", "High Sorcerer Andromath", 1453, 48.7, 87.6 }, r = { "Grand sorcier Andromath", "High Sorcerer Andromath", 1453, 48.7, 87.6 }, obj = "Rapporter Traité d'Ur sur la Magie des Ombres", oe = "Bring Ur's Treatise on Shadow Magic" }
D[1939] = { t = "Grand sorcier Andromath", nv = 26, min = 26, te = "High Sorcerer Andromath", g = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, r = { "Grand sorcier Andromath", "High Sorcerer Andromath", 1453, 48.7, 87.6 } }
D[1940] = { t = "Soie d'araignée en parfait état", nv = 26, min = 26, te = "Pristine Spider Silk", g = { "Grand sorcier Andromath", "High Sorcerer Andromath", 1453, 48.7, 87.6 }, r = { "Wynne Larson", "Wynne Larson", 1453, 51.8, 83.5 }, obj = "Rapporter 8 × Soie d'araignée en parfait état", oe = "Bring 8 × Pristine Spider Silk" }
D[1941] = { t = "La robe en tisse-mana", nv = 15, min = 15, te = "Manaweave Robe", g = { "Wynne Larson", "Wynne Larson", 1453, 51.8, 83.5 }, r = { "Wynne Larson", "Wynne Larson", 1453, 51.8, 83.5 } }
D[1942] = { t = "L'Habit du noeud astral", nv = 26, min = 26, te = "Astral Knot Garment", g = { "Wynne Larson", "Wynne Larson", 1453, 51.8, 83.5 }, r = { "Wynne Larson", "Wynne Larson", 1453, 51.8, 83.5 } }
D[1943] = { t = "Parler à Deino", nv = 26, min = 26, te = "Speak with Deino", g = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, r = { "Deino", "Deino", 1454, 38.4, 86.1 } }
D[1944] = { t = "Les Eaux de Xavian", nv = 26, min = 26, te = "Waters of Xavian", g = { "Deino", "Deino", 1454, 38.4, 86.1 }, r = { "Deino", "Deino", 1454, 38.4, 86.1 }, obj = "Rapporter Echantillon d'eau de Xavian", oe = "Bring Xavian Water Sample" }
D[1945] = { t = "Les sœurs rieuses", nv = 26, min = 26, te = "Laughing Sisters", g = { "Deino", "Deino", 1454, 38.4, 86.1 }, r = { "Kil'hala", "Kil'hala", 1413, 52.2, 31.7 }, obj = "Rapporter 12 × Cheveu de Soeur rieuse", oe = "Bring 12 × Laughing Sister's Hair" }
D[1946] = { t = "L'Habit du néant", nv = 26, min = 26, te = "Nether-lace Garment", av = 1945, g = { "Kil'hala", "Kil'hala", 1413, 52.2, 31 }, r = { "Kil'hala", "Kil'hala", 1413, 52.2, 31 } }
D[1947] = { t = "Voyager vers le Marais", nv = 38, min = 30, te = "Journey to the Marsh", g = { "Jennea Cannon", "Jennea Cannon", 1453, 49.6, 85.8 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 } }
D[1948] = { t = "Les Objets de Puissance", nv = 40, min = 30, te = "Items of Power", g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Rapporter Jade ; Rapporter Roncier de foudre", oe = "Bring Jade ; Bring Bolt Charged Bramble" }
D[1949] = { t = "Des secrets cachés", nv = 38, min = 30, te = "Hidden Secrets", av = 1947, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Magus Tirth", "Magus Tirth", 1441, 78.3, 75.7 } }
D[1950] = { t = "Trouver le Scoop", nv = 30, min = 30, te = "Get the Scoop", av = 1949, g = { "Magus Tirth", "Magus Tirth", 1441, 78.1, 77.1 }, r = { "Magus Tirth", "Magus Tirth", 1441, 78.1, 77.1 } }
D[1951] = { t = "Rituels du Pouvoir", nv = 40, min = 30, te = "Rituals of Power", av = 1950, g = { "Magus Tirth", "Magus Tirth", 1441, 78.1, 77.1 }, obj = "Rapporter Rituels du Pouvoir", oe = "Bring Rituals of Power", r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 } }
D[1952] = { t = "La baguette du mage", nv = 40, min = 30, te = "Mage's Wand", av = 1951, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 } }
D[1953] = { t = "Retourner dans le Marais", nv = 40, min = 35, te = "Return to the Marsh", g = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 } }
D[1954] = { t = "L'orbe infernal", nv = 40, min = 35, te = "The Infernal Orb", av = 1953, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Rapporter Orbe infernal", oe = "Bring Infernal Orb" }
D[1955] = { t = "L'Exorcisme", nv = 40, min = 35, te = "The Exorcism", av = 1954, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Vaincre Démon de l'Orbe", oe = "Kill Demon of the Orb" }
D[1956] = { t = "L'énergie d'Uldaman", nv = 40, min = 35, te = "Power in Uldaman", av = 1955, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Rapporter Source d'énergie en obsidienne", oe = "Bring Obsidian Power Source" }
D[1957] = { t = "Les éruptions de mana", nv = 40, min = 35, te = "Mana Surges", av = 1956, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Vaincre 12 × Eruption de mana", oe = "Kill 12 × Mana Surge" }
D[1958] = { t = "L'énergie céleste", nv = 40, min = 35, te = "Celestial Power", av = 1957, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 } }
D[1959] = { t = "Rendre compte à Anastasia", nv = 15, min = 15, te = "Report to Anastasia", g = { "Uthel'nay", "Uthel'nay", 1454, 39.2, 86.3 }, r = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 } }
D[1960] = { t = "Enquêter dans le magasin de l'Alchimiste", nv = 16, min = 15, te = "Investigate the Alchemist Shop", g = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, r = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, obj = "Rapporter 3 × Coffre de stockage rempli ; Rapporter Caisse de coffres de stockage ; Rapporter Chants de manifestation", oe = "Bring 3 × Filled Containment Coffer ; Bring Chest of Containment Coffers ; Bring Cantation of Manifestation" }
D[1961] = { t = "Rassembler les matériaux", nv = 15, min = 15, te = "Gathering Materials", g = { "Anastasia Hartwell", "Anastasia Hartwell", 1458, 85.1, 10 }, r = { "Josef Gregorian", "Josef Gregorian", 1458, 70.8, 30.7 }, obj = "Rapporter 10 × Etoffe de lin ; Rapporter 6 × Gemme de mana de Dalaran", oe = "Bring 10 × Linen Cloth ; Bring 6 × Dalaran Mana Gem" }
D[1962] = { t = "Robe du feu-sorcier", nv = 15, min = 15, te = "Spellfire Robes", g = { "Josef Gregorian", "Josef Gregorian", 1458, 70.8, 30.7 }, r = { "Josef Gregorian", "Josef Gregorian", 1458, 70.8, 30.7 } }
D[1963] = { t = "La Main brisée", nv = 13, min = 10, te = "The Shattered Hand", g = { "Therzok", "Therzok", 1454, 42.7, 53.6 }, r = { "Therzok", "Therzok", 1454, 42.7, 53.6 }, obj = "Rapporter Sacoche de Tazan", oe = "Bring Tazan's Satchel" }
D[1978] = { t = "Les nécrotraqueurs", nv = 13, min = 10, te = "The Deathstalkers", g = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, r = { "Varimathras", "Varimathras", 1458, 56.3, 92.2 }, obj = "Rapporter Grand Livre d’Andron", oe = "Bring Andron's Ledger" }
D[1998] = { t = "Fenwick Thatros", nv = 16, min = 16, g = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, r = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, obj = "Rapporter Tête de Fenwick", oe = "Bring Fenwick's Head" }
D[1999] = { t = "Les outils du métier", nv = 20, min = 16, te = "Tools of the Trade", g = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, r = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, obj = "Rapporter Rapport de situation de Dalaran", oe = "Bring Dalaran Status Report" }
D[2038] = { t = "Les fournitures perdues de Bingles", nv = 15, min = 12, te = "Bingles' Missing Supplies", g = { "Bingles Explonheimer", "Bingles Blastenheimer", 1432, 63.6, 47.9 }, r = { "Bingles Explonheimer", "Bingles Blastenheimer", 1432, 63.6, 47.9 }, c = { 1432, 50.8, 25.3 }, obj = "Rapporter Clé de Bingles ; Rapporter Tournevis de Bingles ; Rapporter Marteau de Bingles ; Rapporter Capsuleur soufflant de Bingles", oe = "Bring Bingles' Wrench ; Bring Bingles' Screwdriver ; Bring Bingles' Hammer ; Bring Bingles' Blastencapper" }
D[2078] = { t = "La vengeance de Gyromast", nv = 20, min = 14, te = "Gyromast's Revenge", av = 2098, g = { "Gelkak Gyromast", "Gelkak Gyromast", 1439, 56.7, 13.5 }, r = { "Gelkak Gyromast", "Gelkak Gyromast", 1439, 56.7, 13.5 }, c = { 1439, 55.8, 18.3 }, obj = "Vaincre Le Destructomembreur 4100", oe = "Kill The Threshwackonator 4100" }
D[2098] = { t = "La recherche de Gyromast", nv = 20, min = 14, te = "Gyromast's Retrieval", g = { "Gelkak Gyromast", "Gelkak Gyromast", 1439, 56.7, 13.5 }, r = { "Gelkak Gyromast", "Gelkak Gyromast", 1439, 56.7, 13.5 }, c = { 1439, 37.2, 83.9 }, obj = "Rapporter Clé supérieure de Gelkak ; Rapporter Clé médiane de Gelkak ; Rapporter Clé inférieure de Gelkak", oe = "Bring Top of Gelkak's Key ; Bring Middle of Gelkak's Key ; Bring Bottom of Gelkak's Key" }
D[2118] = { t = "Terres malades", nv = 14, min = 10, te = "Plagued Lands", g = { "Tharnariun Soigneflore", "Tharnariun Treetender", 1439, 37.4, 41.8 }, r = { "Tharnariun Soigneflore", "Tharnariun Treetender", 1439, 37.4, 41.8 }, obj = "Vaincre Ours des chardons enragé capturé", oe = "Kill Captured Rabid Thistle Bear" }
D[2138] = { t = "Nettoyage de l'infection", nv = 16, min = 10, te = "Cleansing of the Infected", av = 2118, g = { "Tharnariun Soigneflore", "Tharnariun Treetender", 1439, 37.4, 41.8 }, r = { "Tharnariun Soigneflore", "Tharnariun Treetender", 1439, 37.4, 41.8 }, c = { 1439, 48, 29.7 }, obj = "Vaincre 20 × Ours des chardons enragé", oe = "Kill 20 × Rabid Thistle Bear" }
D[2139] = { t = "Espoir de Tharnariun", nv = 18, min = 10, te = "Tharnariun's Hope", av = 2138, g = { "Tharnariun Soigneflore", "Tharnariun Treetender", 1439, 37.4, 41.8 }, r = { "Tharnariun Soigneflore", "Tharnariun Treetender", 1439, 37.4, 41.8 }, c = { 1439, 51.5, 38.3 }, obj = "Vaincre Mère de la tanière", oe = "Kill Den Mother" }
D[2158] = { t = "Repos et détente", nv = 5, min = 1, te = "Rest and Relaxation", g = { "Falkhaan Isenrôde", "Falkhaan Isenstrider", 1429, 45.6, 47.7 }, r = { "Aubergiste Farley", "Innkeeper Farley", 1429, 42.1, 65.9 } }
D[2159] = { t = "Livraison pour Dolanaar", nv = 5, min = 1, te = "Dolanaar Delivery", g = { "Porthannius", "Porthannius", 1438, 61.2, 47.6 }, r = { "Keldamyr l'aubergiste", "Innkeeper Keldamyr", 1438, 56, 57.3 }, obj = "Rapporter Livraison de Dolanaar", oe = "Bring Dolanaar Delivery" }
D[2160] = { t = "Des provisions pour Tannok", nv = 5, min = 1, te = "Supplies to Tannok", g = { "Mano Engrenaressort", "Hands Springsprocket", 1426, 33.8, 72.2 }, r = { "Tannok Martel-de-givre", "Tannok Frosthammer", 1426, 46.7, 53.8 }, obj = "Rapporter Caisse de ravitaillement de l'auberge", oe = "Bring Crate of Inn Supplies" }
D[2161] = { t = "Un fardeau de péon", nv = 5, min = 1, te = "A Peon's Burden", g = { "Ukor", "Ukor", 1411, 52.1, 68.3 }, r = { "Grosk l'aubergiste", "Innkeeper Grosk", 1411, 51.9, 43.5 }, obj = "Rapporter Fardeau d'Ukor", oe = "Bring Ukor's Burden" }
D[2178] = { t = "Brouet de trotteur", nv = 12, min = 9, te = "Easy Strider Living", g = { "Alanndarian Chantenuit", "Alanndarian Nightsong", 1439, 37.4, 41.8 }, r = { "Alanndarian Chantenuit", "Alanndarian Nightsong", 1439, 37.4, 41.8 }, c = { 1439, 46.4, 33.8 }, obj = "Rapporter 5 × Viande de trotteur", oe = "Bring 5 × Strider Meat" }
D[2203] = { t = "Les réactifs des Terres ingrates II", nv = 44, min = 40, te = "Badlands Reagent Run II", av = 2202, g = { "Jarkal Fondemousse", "Jarkal Mossmeld", 1427, 82, 36.7 }, r = { "Jarkal Fondemousse", "Jarkal Mossmeld", 1427, 82, 36.7 }, obj = "Rapporter 3 × Récipient de sang du dragon", oe = "Bring 3 × Vessel of Dragon's Blood" }
D[2205] = { t = "Chercher le SI:7", nv = 10, min = 10, te = "Seek out SI: 7", g = { "Keryn Sylvius", "Keryn Sylvius", 1429, 42.1, 65.9 }, obj = "Rapporter Livraison pour Mathias", oe = "Bring Delivery to Mathias", r = { "Maître Mathias Shaw", "Master Mathias Shaw", 1453, 78.3, 70.7 } }
D[2206] = { t = "Effraction", nv = 10, min = 10, te = "Snatch and Grab", g = { "Maître Mathias Shaw", "Master Mathias Shaw", 1453, 78.3, 70.7 }, r = { "Maître Mathias Shaw", "Master Mathias Shaw", 1453, 78.3, 70.7 }, obj = "Rapporter Programme d'embarquement des Défias", oe = "Bring Defias Shipping Schedule" }
D[2218] = { t = "La voie du salut", nv = 10, min = 10, te = "Road to Salvation", g = { "Hogral Bakkan", "Hogral Bakkan", 1426, 46.7, 53.8 }, r = { "Hulfdan Barbe-noire", "Hulfdan Blackbeard", 1455, 52, 14.8 } }
D[2238] = { t = "Simple subterfuge", nv = 10, min = 10, te = "Simple Subterfugin'", g = { "Hulfdan Barbe-noire", "Hulfdan Blackbeard", 1455, 52, 14.8 }, r = { "Onin MacHammar", "Onin MacHammar", 1426, 25.2, 44.5 } }
D[2239] = { t = "Rapport d'Onin", nv = 10, min = 10, te = "Onin's Report", av = 2238, g = { "Onin MacHammar", "Onin MacHammar", 1426, 25.2, 44.5 }, obj = "Rapporter Rapport d'Onin", oe = "Bring Onin's Report", r = { "Hulfdan Barbe-noire", "Hulfdan Blackbeard", 1455, 52, 14.8 } }
D[2241] = { t = "Pomme d'amour", nv = 10, min = 10, te = "The Apple Falls", g = { "Jannok Chantebrise", "Jannok Breezesong", 1438, 56, 57.3 }, obj = "Rapporter Rose de Jannok", oe = "Bring Jannok's Rose", r = { "Syurna", "Syurna", 1457, 37, 21.9 } }
D[2242] = { t = "L'appel du destin", nv = 10, min = 10, te = "Destiny Calls", g = { "Syurna", "Syurna", 1457, 37, 21.9 }, r = { "Syurna", "Syurna", 1457, 37, 21.9 }, obj = "Rapporter Journal de Sethir", oe = "Bring Sethir's Journal" }
D[2259] = { t = "Erion Murmombre", nv = 16, min = 16, te = "Erion Shadewhisper", g = { "Jannok Chantebrise", "Jannok Breezesong", 1438, 56, 57.3 }, r = { "Erion Murmombre", "Erion Shadewhisper", 1457, 34.5, 25.9 } }
D[2260] = { t = "L'ordre d'Erion", nv = 16, min = 16, te = "Erion's Behest", g = { "Erion Murmombre", "Erion Shadewhisper", 1457, 34.5, 25.9 }, r = { "Renzik « le kriss »", "Renzik \"The Shiv\"", 1453, 78.3, 71.1 } }
D[2281] = { t = "Le Rendez-vous des Carmines", nv = 16, min = 16, te = "Redridge Rendezvous", g = { "Renzik « le kriss »", "Renzik \"The Shiv\"", 1453, 78.3, 71.1 }, r = { "Lucius", "Lucius", 1433, 23, 52 } }
D[2282] = { t = "La scierie d'Alther", nv = 20, min = 16, te = "Alther's Mill", av = 2281, g = { "Lucius", "Lucius", 1433, 24.2, 53.6 }, r = { "Lucius", "Lucius", 1433, 24.2, 53.6 }, c = { 1433, 47, 44.7 }, obj = "Rapporter Gage de voleur", oe = "Bring Token of Thievery" }
D[2298] = { t = "Extorsion royale", nv = 16, min = 16, te = "Kingly Shakedown", g = { "Hulfdan Barbe-noire", "Hulfdan Blackbeard", 1455, 52, 14.8 }, r = { "Renzik « le kriss »", "Renzik \"The Shiv\"", 1453, 78.3, 71.1 } }
D[2299] = { t = "Cap sur Hulfdan !", nv = 16, min = 16, te = "To Hulfdan!", g = { "Hogral Bakkan", "Hogral Bakkan", 1426, 46.7, 53.8 }, r = { "Hulfdan Barbe-noire", "Hulfdan Blackbeard", 1455, 52, 14.8 } }
D[2300] = { t = "SI:7", nv = 16, min = 16, g = { "Keryn Sylvius", "Keryn Sylvius", 1429, 42.1, 65.9 }, r = { "Renzik « le kriss »", "Renzik \"The Shiv\"", 1453, 78.3, 71.1 } }
D[2358] = { t = "Cornes de Nez'ra", nv = 22, min = 16, te = "Horns of Nez'ra", g = { "Arantir", "Arantir", 1433, 24.2, 53.6 }, r = { "Arantir", "Arantir", 1433, 24.2, 53.6 }, c = { 1433, 69.4, 75.1 }, obj = "Rapporter Cornes de Nez'ra", oe = "Bring Horns of Nez'ra" }
D[2359] = { t = "La tour de Klaven", nv = 24, min = 20, te = "Klaven's Tower", av = 2360, g = { "Agent Kearnen", "Agent Kearnen", 1436, 68.5, 70.1 }, c = { 1436, 69.5, 74 }, obj = "Rapporter Journal de Klaven Mortwake ; Rapporter Clé de la tour défias", oe = "Bring Klaven Mortwake's Journal ; Bring Defias Tower Key", r = { "Maître Mathias Shaw", "Master Mathias Shaw", 1453, 78.3, 70.7 } }
D[2360] = { t = "Mathias et les Défias", nv = 20, min = 20, te = "Mathias and the Defias", g = { "Maître Mathias Shaw", "Master Mathias Shaw", 1453, 78.3, 70.7 }, r = { "Agent Kearnen", "Agent Kearnen", 1436, 68.5, 70.1 } }
D[2378] = { t = "Trouver la Main brisée", nv = 16, min = 16, te = "Find the Shattered Hand", g = { "Mennet Carkad", "Mennet Carkad", 1458, 83.5, 69.1 }, r = { "Shenthul", "Shenthul", 1454, 43, 53.7 } }
D[2379] = { t = "Zando'zan", nv = 16, min = 16, g = { "Shenthul", "Shenthul", 1454, 43, 53.7 }, r = { "Zando'zan", "Zando'zan", 1454, 42.7, 53 } }
D[2380] = { t = "Cap sur Orgrimmar !", nv = 16, min = 16, te = "To Orgrimmar!", g = { "Kaplak", "Kaplak", 1411, 51.9, 43.5 }, r = { "Shenthul", "Shenthul", 1454, 43, 53.7 } }
D[2381] = { t = "Piller les pilleurs", nv = 18, min = 16, te = "Plundering the Plunderers", av = 2382, g = { "Wrenix le Misérable", "Wrenix the Wretched", 1413, 62.3, 38.4 }, r = { "Wrenix le Misérable", "Wrenix the Wretched", 1413, 62.3, 38.4 }, obj = "Rapporter Trésor des Mers du sud", oe = "Bring Southsea Treasure" }
D[2382] = { t = "Wrenix de Cabestan", nv = 16, min = 16, te = "Wrenix of Ratchet", g = { "Zando'zan", "Zando'zan", 1454, 42.7, 53 }, r = { "Wrenix le Misérable", "Wrenix the Wretched", 1413, 63.1, 36.3 } }
D[2383] = { t = "Parchemin simple", nv = 1, min = 1, te = "Simple Parchment", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Frang", "Frang", 1411, 42.1, 68.3 }, obj = "Rapporter Parchemin simple", oe = "Bring Simple Parchment" }
D[2399] = { t = "Les racines ont poussé", nv = 10, min = 4, te = "The Sprouted Fronds", av = 931, g = { "Racine éclose", "Sprouted Frond", 1438, 60.9, 68.5 }, r = { "Racine éclose", "Sprouted Frond", 1438, 60.9, 68.5 } }
D[2438] = { t = "Le Capturêve d'émeraude", nv = 6, min = 1, te = "The Emerald Dreamcatcher", g = { "Tallonkai Viveracine", "Tallonkai Swiftroot", 1438, 56, 57.3 }, r = { "Tallonkai Viveracine", "Tallonkai Swiftroot", 1438, 56, 57.3 }, c = { 1438, 68, 59.7 }, obj = "Rapporter Capturêve d'émeraude", oe = "Bring Emerald Dreamcatcher" }
D[2458] = { t = "Sous le couvert de la nuit", nv = 20, min = 20, te = "Deep Cover", g = { "Shenthul", "Shenthul", 1454, 43, 53.7 }, r = { "Sous-chef Fizzule", "Taskmaster Fizzule", 1413, 55.4, 5.6 } }
D[2459] = { t = "Ferocitas le Mangeur de rêves", nv = 8, min = 1, te = "Ferocitas the Dream Eater", av = 2438, g = { "Tallonkai Viveracine", "Tallonkai Swiftroot", 1438, 56, 57.3 }, r = { "Tallonkai Viveracine", "Tallonkai Swiftroot", 1438, 56, 57.3 }, c = { 1438, 69.1, 53.8 }, obj = "Rapporter Joyau de Tallonkai ; Vaincre 7 × Mystique Pin-tordu", oe = "Bring Tallonkai's Jewel ; Kill 7 × Gnarlpine Mystic" }
D[2460] = { t = "Le Salut brisé", nv = 20, min = 20, te = "The Shattered Salute", g = { "Shenthul", "Shenthul", 1454, 43, 53.7 }, r = { "Shenthul", "Shenthul", 1454, 43, 53.7 } }
D[2478] = { t = "Mission : Possible mais non probable", nv = 24, min = 20, te = "Mission: Possible But Not Probable", g = { "Sous-chef Fizzule", "Taskmaster Fizzule", 1413, 55.4, 5.6 }, r = { "Shenthul", "Shenthul", 1454, 43, 53.7 }, obj = "Rapporter Tête de Gallywix ; Rapporter Clé de la tour de Silixiz ; Rapporter Cache de mixture altérée de Zanzil ; Vaincre 2 × Pantin muté de la KapitalRisk ; Vaincre 2 × Sentinelle de la KapitalRisk ; Vaincre 2 × Patrouilleur de la KapitalRisk", oe = "Bring Gallywix's Head ; Bring Silixiz's Tower Key ; Bring Cache of Zanzil's Altered Mixture ; Kill 2 × Mutated Venture Co. Drone ; Kill 2 × Venture Co. Lookout ; Kill 2 × Venture Co. Patroller" }
D[2479] = { t = "L'aide d'Hinott", nv = 26, min = 20, te = "Hinott's Assistance", g = { "Shenthul", "Shenthul", 1454, 43, 53.7 }, r = { "Serge Hinott", "Serge Hinott", 1424, 61.6, 19.2 }, obj = "Rapporter Echantillon de la mixture altérée de Zanzil", oe = "Bring Sample of Zanzil's Altered Mixture" }
D[2480] = { t = "L'aide d'Hinott", nv = 20, min = 20, te = "Hinott's Assistance", av = 2479, g = { "Serge Hinott", "Serge Hinott", 1424, 62.3, 20.5 }, r = { "Serge Hinott", "Serge Hinott", 1424, 62.3, 20.5 } }
D[2499] = { t = "Froncechêne", nv = 9, min = 4, te = "Oakenscowl", av = 2498, g = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, r = { "Denalan", "Denalan", 1438, 60.9, 68.5 }, c = { 1438, 53.8, 75.1 }, obj = "Rapporter Tumeur gargantuesque", oe = "Bring Gargantuan Tumor" }
D[2521] = { t = "Au service de Kum'isha", nv = 55, min = 45, te = "To Serve Kum'isha", g = { "Kum'isha le collecteur", "Kum'isha the Collector", 1419, 52, 35.6 }, r = { "Kum'isha le collecteur", "Kum'isha the Collector", 1419, 52, 35.6 }, obj = "Rapporter Sphère de draenéthyste sans défaut", oe = "Bring Flawless Draenethyst Sphere" }
D[2541] = { t = "Le druide dormant", nv = 8, min = 3, te = "The Sleeping Druid", g = { "Oben Grifferage", "Oben Rageclaw", 1438, 44.9, 61.6 }, r = { "Oben Grifferage", "Oben Rageclaw", 1438, 44.9, 61.6 }, c = { 1438, 47.4, 62 }, obj = "Rapporter Charme vaudou des chamans", oe = "Bring Shaman Voodoo Charm" }
D[2561] = { t = "Le druide de la Griffe", nv = 10, min = 3, te = "Druid of the Claw", av = 2541, g = { "Oben Grifferage", "Oben Rageclaw", 1438, 44.9, 61.6 }, r = { "Oben Grifferage", "Oben Rageclaw", 1438, 44.9, 61.6 }, c = { 1438, 45.5, 58.6 }, obj = "Vaincre Grifferage", oe = "Kill Rageclaw" }
D[2581] = { t = "Joues de Raillecroc", nv = 50, min = 45, te = "Snickerfang Jowls", g = { "Mage de sang Drazial", "Bloodmage Drazial", 1419, 50.6, 14.2 }, r = { "Mage de sang Drazial", "Bloodmage Drazial", 1419, 50.6, 14.2 }, c = { 1419, 56.7, 31.7 }, obj = "Rapporter 3 × Joues de Raillecroc ; Rapporter 2 × Poumon de sanglier éclaté ; Rapporter Pince de scorpok", oe = "Bring 3 × Snickerfang Jowl ; Bring 2 × Blasted Boar Lung ; Bring Scorpok Pincer" }
D[2583] = { t = "La vitalité du sanglier", nv = 50, min = 45, te = "A Boar's Vitality", g = { "Mage de sang Drazial", "Bloodmage Drazial", 1419, 50.6, 14.2 }, r = { "Mage de sang Drazial", "Bloodmage Drazial", 1419, 50.6, 14.2 }, c = { 1419, 57.5, 28.8 }, obj = "Rapporter 3 × Poumon de sanglier éclaté ; Rapporter 2 × Pince de scorpok ; Rapporter Cerveau de basilic", oe = "Bring 3 × Blasted Boar Lung ; Bring 2 × Scorpok Pincer ; Bring Basilisk Brain" }
D[2585] = { t = "Le coup décisif", nv = 50, min = 45, te = "The Decisive Striker", g = { "Mage de sang Drazial", "Bloodmage Drazial", 1419, 50.6, 14.2 }, r = { "Mage de sang Drazial", "Bloodmage Drazial", 1419, 50.6, 14.2 }, c = { 1419, 57.5, 28.8 }, obj = "Rapporter 3 × Pince de scorpok ; Rapporter 2 × Gésier de vautour ; Rapporter Poumon de sanglier éclaté", oe = "Bring 3 × Scorpok Pincer ; Bring 2 × Vulture Gizzard ; Bring Blasted Boar Lung" }
D[2601] = { t = "La morsure du basilic", nv = 50, min = 45, te = "The Basilisk's Bite", g = { "Mage de sang Lynnore", "Bloodmage Lynnore", 1419, 50.6, 14.2 }, r = { "Mage de sang Lynnore", "Bloodmage Lynnore", 1419, 50.6, 14.2 }, c = { 1419, 46.1, 23.6 }, obj = "Rapporter 10 × Cerveau de basilic ; Rapporter 2 × Gésier de vautour", oe = "Bring 10 × Basilisk Brain ; Bring 2 × Vulture Gizzard" }
D[2603] = { t = "La vigueur du vautour", nv = 50, min = 45, te = "Vulture's Vigor", g = { "Mage de sang Lynnore", "Bloodmage Lynnore", 1419, 50.6, 14.2 }, r = { "Mage de sang Lynnore", "Bloodmage Lynnore", 1419, 50.6, 14.2 }, c = { 1419, 53.2, 37.2 }, obj = "Rapporter 10 × Gésier de vautour ; Rapporter 2 × Joues de Raillecroc", oe = "Bring 10 × Vulture Gizzard ; Bring 2 × Snickerfang Jowl" }
D[2605] = { t = "Le gobelin assoiffé", nv = 49, min = 44, te = "The Thirsty Goblin", g = { "Marin Brouillecaboche", "Marin Noggenfogger", 1446, 50.2, 27.5 }, r = { "Marin Brouillecaboche", "Marin Noggenfogger", 1446, 50.2, 27.5 }, c = { 1446, 29.2, 66 }, obj = "Rapporter Glande de rosée remplie", oe = "Bring Laden Dew Gland" }
D[2606] = { t = "De bon goût", nv = 49, min = 44, te = "In Good Taste", av = 2605, g = { "Marin Brouillecaboche", "Marin Noggenfogger", 1446, 50.2, 27.5 }, r = { "Saupoudr", "Sprinkle", 1446, 50.2, 27.5 }, obj = "Rapporter Rosée des chardonniers", oe = "Bring Thistleshrub Dew" }
D[2607] = { t = "Le toucher de Zanzil", nv = 20, min = 20, te = "The Touch of Zanzil", g = { "Maître Mathias Shaw", "Master Mathias Shaw", 1453, 78.3, 70.7 }, r = { "Doc Mixilpixil", "Doc Mixilpixil", 1453, 80.1, 69.9 } }
D[2608] = { t = "Le toucher de Zanzil", nv = 20, min = 20, te = "The Touch of Zanzil", g = { "Doc Mixilpixil", "Doc Mixilpixil", 1453, 80.1, 69.9 }, r = { "Doc Mixilpixil", "Doc Mixilpixil", 1453, 80.1, 69.9 } }
D[2609] = { t = "Le toucher de Zanzil", nv = 20, min = 20, te = "The Touch of Zanzil", g = { "Doc Mixilpixil", "Doc Mixilpixil", 1453, 80.1, 69.9 }, r = { "Doc Mixilpixil", "Doc Mixilpixil", 1453, 80.1, 69.9 }, obj = "Rapporter Fleurs sauvages simples ; Rapporter Fiole plombée ; Rapporter Tube en bronze ; Rapporter Bobine de fil de soie chartreuse", oe = "Bring Simple Wildflowers ; Bring Leaded Vial ; Bring Bronze Tube ; Bring Spool of Light Chartreuse Silk Thread" }
D[2621] = { t = "Le déshonoré", nv = 50, min = 45, te = "The Disgraced One", av = 2784, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Commandant d'ordonnance Ruag", "Dispatch Commander Ruag", 1435, 44.7, 57.2 } }
D[2622] = { t = "Les ordres disparus", nv = 50, min = 45, te = "The Missing Orders", av = 2621, g = { "Commandant d'ordonnance Ruag", "Dispatch Commander Ruag", 1435, 44.7, 57.2 }, r = { "Bengor", "Bengor", 1435, 44.7, 57.2 } }
D[2623] = { t = "Le Parleur des marécages", nv = 55, min = 45, te = "The Swamp Talker", av = 2622, g = { "Bengor", "Bengor", 1435, 44.7, 57.2 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Rapporter Ordres du chef de guerre", oe = "Bring Warchief's Orders" }
D[2641] = { t = "L'ingrédient secret de Saupoudr", nv = 49, min = 44, te = "Sprinkle's Secret Ingredient", av = 2606, g = { "Saupoudr", "Sprinkle", 1446, 50.2, 27.5 }, r = { "Saupoudr", "Sprinkle", 1446, 50.2, 27.5 }, obj = "Rapporter Tragan violet", oe = "Bring Violet Tragan" }
D[2661] = { t = "Livraison pour Marin", nv = 49, min = 44, te = "Delivery for Marin", av = 2641, g = { "Saupoudr", "Sprinkle", 1446, 50.2, 27.5 }, r = { "Marin Brouillecaboche", "Marin Noggenfogger", 1446, 50.2, 27.5 }, obj = "Rapporter Poudre violette", oe = "Bring Violet Powder" }
D[2662] = { t = "Elixir Brouillecaboche", nv = 49, min = 44, te = "Noggenfogger Elixir", av = 2661, g = { "Marin Brouillecaboche", "Marin Noggenfogger", 1446, 50.2, 27.5 }, r = { "Marin Brouillecaboche", "Marin Noggenfogger", 1446, 50.2, 27.5 } }
D[2681] = { t = "Les pierres qui nous lient", nv = 57, min = 45, te = "The Stones That Bind Us", av = 2801, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Vaincre 9 × Serviteur de Razelikh ; Vaincre 3 × Serviteur de Grol ; Vaincre 3 × Serviteur d'Allistarj ; Vaincre 3 × Serviteur de Sevine", oe = "Kill 9 × Servant of Razelikh ; Kill 3 × Servant of Grol ; Kill 3 × Servant of Allistarj ; Kill 3 × Servant of Sevine" }
D[2702] = { t = "Les héros des Anciens", nv = 57, min = 45, te = "Heroes of Old", av = 2681, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Caporal Thund Sabot-fendu", "Corporal Thund Splithoof", 1435, 34.3, 66.1 } }
D[2721] = { t = "Kirith", nv = 58, min = 45, av = 2701, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Esprit de Kirith", "Spirit of Kirith", 1435, 34.3, 66.1 } }
D[2741] = { t = "Le Super-Oeuf-O-Matic", nv = 60, min = 42, te = "The Super Egg-O-Matic", g = { "Egg-O-Matic", "Egg-O-Matic", 1446, 50.2, 27.5 }, r = { "Egg-O-Matic", "Egg-O-Matic", 1446, 50.2, 27.5 }, obj = "Rapporter Oeuf d'hippogryphe", oe = "Bring Hippogryph Egg" }
D[2742] = { t = "Rin'ji est pris au piège !", nv = 47, min = 42, te = "Rin'ji is Trapped!", g = { "Rin'ji", "Rin'ji", 1425, 30.7, 46.9 }, r = { "Secret de Rin'ji", "Rin'ji's Secret", 1425, 86.3, 59 } }
D[2744] = { t = "Le chasseur de démons", nv = 60, min = 45, te = "The Demon Hunter", av = 2743, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 } }
D[2760] = { t = "L'ordre du Mithril", nv = 40, min = 40, te = "The Mithril Order", g = { "McGavan", "McGavan", 1434, 27, 77.1 }, r = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, obj = "Rapporter Pendentif en mithril", oe = "Bring Mithril Pendant" }
D[2761] = { t = "Ça fond, ça ne fond pas", nv = 45, min = 40, te = "Smelt On, Smelt Off", av = 2760, g = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, r = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, obj = "Rapporter 40 × Barre de fer ; Rapporter 40 × Barre de mithril", oe = "Bring 40 × Iron Bar ; Bring 40 × Mithril Bar" }
D[2762] = { t = "Le vif-argent n’est pas de l'argent", nv = 45, min = 40, te = "The Great Silver Deceiver", av = 2760, g = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, r = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, c = { 1434, 43.6, 45.2 }, obj = "Rapporter 40 × Barre de mithril ; Rapporter 5 × Barre de vrai-argent", oe = "Bring 40 × Mithril Bar ; Bring 5 × Truesilver Bar" }
D[2763] = { t = "L'art de l'imprégnation", nv = 45, min = 40, te = "The Art of the Imbue", av = 2760, g = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, r = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, obj = "Rapporter 40 × Barre de mithril ; Rapporter 4 × Citrine", oe = "Bring 40 × Mithril Bar ; Bring 4 × Citrine" }
D[2764] = { t = "Le meilleur disciple de Galvan", nv = 45, min = 40, te = "Galvan's Finest Pupil", g = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 } }
D[2765] = { t = "Maître Forgeron !", nv = 45, min = 40, te = "Expert Blacksmith!", av = 3321, g = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 }, r = { "Galvan l'Ancien", "Galvan the Ancient", 1434, 50.6, 20.5 } }
D[2767] = { t = "À la rescousse de OOX-22/FE !", nv = 45, min = 40, te = "Rescue OOX-22/FE!", av = 2766, g = { "Robot guidé OOX-22/FE", "Homing Robot OOX-22/FE", 1444, 53.4, 55.7 } }
D[2771] = { t = "Une tête bien faite sur les épaules", nv = 45, min = 40, te = "A Good Head On Your Shoulders", av = 2764, g = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, r = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, obj = "Rapporter 2 × Camail en mithril ; Rapporter Épaulières ornées en mithril", oe = "Bring 2 × Mithril Coif ; Bring Ornate Mithril Shoulders" }
D[2772] = { t = "Le monde à vos pieds", nv = 45, min = 40, te = "The World At Your Feet", av = 2764, g = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, r = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, obj = "Rapporter 2 × Bottes lourdes en mithril ; Rapporter Jambières ornées en mithril", oe = "Bring 2 × Heavy Mithril Boots ; Bring Ornate Mithril Pants" }
D[2773] = { t = "Le gars du mithril", nv = 45, min = 40, te = "The Mithril Kid", av = 2764, g = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, r = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, obj = "Rapporter 2 × Cuirasse lourde en mithril ; Rapporter Gants ornés en mithril", oe = "Bring 2 × Heavy Mithril Breastplate ; Bring Ornate Mithril Gloves" }
D[2781] = { t = "ON RECHERCHE : Caliph Dard-de-Scorpide", nv = 46, min = 39, te = "WANTED: Caliph Scorpidsting", g = { "Wanted Poster", "Wanted Poster", 1446, 50.2, 27.5 }, r = { "Ingénieur en chef Vizisanie", "Chief Engineer Bilgewhizzle", 1446, 50.2, 27.5 }, c = { 1446, 61.8, 38.2 }, obj = "Rapporter Tête de Caliph Dard-de-scorpide", oe = "Bring Caliph Scorpidsting's Head" }
D[2782] = { t = "Secret de Rin'ji", nv = 47, min = 42, te = "Rin'ji's Secret", av = 2742, g = { "Secret de Rin'ji", "Rin'ji's Secret", 1425, 86.3, 59 }, obj = "Rapporter Secret de Rin'ji", oe = "Bring Rin'ji's Secret" }
D[2783] = { t = "Querelles mesquines", nv = 57, min = 50, te = "Petty Squabbles", g = { "Ambassadeur Ardalan", "Ambassador Ardalan", 1419, 67.6, 19.3 } }
D[2784] = { t = "Perte d'honneur", nv = 50, min = 45, te = "Fall From Grace", g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 } }
D[2801] = { t = "Une histoire de chagrin", nv = 57, min = 45, te = "A Tale of Sorrow", g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 } }
D[2821] = { t = "La marque de la qualité", nv = 46, min = 40, te = "The Mark of Quality", g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 53.7, 58.2 }, obj = "Rapporter 10 × Peau de yéti épaisse", oe = "Bring 10 × Thick Yeti Hide" }
D[2822] = { t = "La marque de la qualité", nv = 46, min = 40, te = "The Mark of Quality", g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 53.7, 58.2 }, obj = "Rapporter 10 × Peau de yéti épaisse", oe = "Bring 10 × Thick Yeti Hide" }
D[2844] = { t = "Le garde géant", nv = 49, min = 44, te = "The Giant Guardian", g = { "Croque-roc", "Rockbiter", 1444, 42.4, 22 }, r = { "Shay Coursefeuille", "Shay Leafrunner", 1444, 38.2, 10.3 } }
D[2845] = { t = "Shay l'égarée", nv = 49, min = 44, te = "Wandering Shay", av = 2844, g = { "Shay Coursefeuille", "Shay Leafrunner", 1444, 38.2, 10.3 }, r = { "Croque-roc", "Rockbiter", 1444, 42.4, 22 }, c = { 1444, 38.3, 10.3 }, obj = "Rapporter Cloche de Shay", oe = "Bring Shay's Bell" }
D[2847] = { t = "L'armure en cuir fauve", nv = 45, min = 30, te = "Wild Leather Armor", g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, obj = "Rapporter 10 × Cuir épais", oe = "Bring 10 × Thick Leather" }
D[2848] = { t = "Les épaulières en cuir fauve", nv = 45, min = 30, te = "Wild Leather Shoulders", av = 2847, g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 6 × Renfort d'armure épais ; Rapporter Sauvageonne", oe = "Bring 6 × Thick Armor Kit ; Bring Wildvine" }
D[2849] = { t = "Le gilet en cuir fauve", nv = 45, min = 30, te = "Wild Leather Vest", av = 2847, g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Cuirasse en écailles de tortue ; Rapporter 2 × Gants en écailles de tortue ; Rapporter Sauvageonne", oe = "Bring 2 × Turtle Scale Breastplate ; Bring 2 × Turtle Scale Gloves ; Bring Wildvine" }
D[2850] = { t = "Le casque en cuir fauve", nv = 45, min = 30, te = "Wild Leather Helmet", av = 2847, g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Tunique de la nuit ; Rapporter 2 × Bandeau de la nuit ; Rapporter Sauvageonne", oe = "Bring 2 × Nightscape Tunic ; Bring 2 × Nightscape Headband ; Bring Wildvine" }
D[2851] = { t = "Les bottes en cuir fauve", nv = 45, min = 30, te = "Wild Leather Boots", av = 2847, g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Pantalon de la nuit ; Rapporter 2 × Bottes de la nuit ; Rapporter 2 × Sauvageonne", oe = "Bring 2 × Nightscape Pants ; Bring 2 × Nightscape Boots ; Bring 2 × Wildvine" }
D[2852] = { t = "Les jambières en cuir fauve", nv = 45, min = 30, te = "Wild Leather Leggings", av = 2847, g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Casque en écailles de tortue ; Rapporter 2 × Brassards en écailles de tortue ; Rapporter 2 × Sauvageonne", oe = "Bring 2 × Turtle Scale Helm ; Bring 2 × Turtle Scale Bracers ; Bring 2 × Wildvine" }
D[2853] = { t = "Maître du cuir fauve", nv = 45, min = 30, te = "Master of the Wild Leather", g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, obj = "Rapporter Lettre de Pratt", oe = "Bring Pratt's Letter" }
D[2854] = { t = "L'armure en cuir fauve", nv = 45, min = 30, te = "Wild Leather Armor", g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, obj = "Rapporter 10 × Cuir épais", oe = "Bring 10 × Thick Leather" }
D[2855] = { t = "Les épaulières en cuir fauve", nv = 45, min = 30, te = "Wild Leather Shoulders", av = 2854, g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 6 × Renfort d'armure épais ; Rapporter Sauvageonne", oe = "Bring 6 × Thick Armor Kit ; Bring Wildvine" }
D[2856] = { t = "Le gilet en cuir fauve", nv = 45, min = 30, te = "Wild Leather Vest", av = 2854, g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Cuirasse en écailles de tortue ; Rapporter 2 × Gants en écailles de tortue ; Rapporter Sauvageonne", oe = "Bring 2 × Turtle Scale Breastplate ; Bring 2 × Turtle Scale Gloves ; Bring Wildvine" }
D[2857] = { t = "Le casque en cuir fauve", nv = 45, min = 30, te = "Wild Leather Helmet", av = 2854, g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Tunique de la nuit ; Rapporter 2 × Bandeau de la nuit ; Rapporter Sauvageonne", oe = "Bring 2 × Nightscape Tunic ; Bring 2 × Nightscape Headband ; Bring Wildvine" }
D[2858] = { t = "Les bottes en cuir fauve", nv = 48, min = 30, te = "Wild Leather Boots", av = 2854, g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Pantalon de la nuit ; Rapporter 2 × Bottes de la nuit ; Rapporter 2 × Sauvageonne", oe = "Bring 2 × Nightscape Pants ; Bring 2 × Nightscape Boots ; Bring 2 × Wildvine" }
D[2859] = { t = "Les jambières en cuir fauve", nv = 45, min = 30, te = "Wild Leather Leggings", av = 2854, g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 60, 67.5 }, obj = "Rapporter 2 × Casque en écailles de tortue ; Rapporter 2 × Brassards en écailles de tortue ; Rapporter 2 × Sauvageonne", oe = "Bring 2 × Turtle Scale Helm ; Bring 2 × Turtle Scale Bracers ; Bring 2 × Wildvine" }
D[2860] = { t = "Maître du cuir fauve", nv = 45, min = 30, te = "Master of the Wild Leather", g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, obj = "Rapporter Lettre de Jangdor", oe = "Bring Jangdor's Letter" }
D[2862] = { t = "La guerre avec les Griffebois", nv = 42, min = 39, te = "War on the Woodpaw", g = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, r = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 71.7, 54.9 }, obj = "Rapporter 10 × Crinière de gnoll Griffebois", oe = "Bring 10 × Woodpaw Gnoll Mane" }
D[2863] = { t = "Frappe sur les Alphas", nv = 43, min = 39, te = "Alpha Strike", av = 2862, g = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, r = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 72, 55.4 }, obj = "Vaincre 5 × Alpha Griffebois", oe = "Kill 5 × Woodpaw Alpha" }
D[2866] = { t = "Les ruines de Solarsal", nv = 43, min = 40, te = "The Ruins of Solarsal ", g = { "Shandris Pennelune", "Shandris Feathermoon", 1444, 30.6, 42.7 }, r = { "Belvédère de Solarsal", "Solarsal Gazebo", 1444, 26.3, 52.3 } }
D[2867] = { t = "Retourner au bastion de Pennelune", nv = 43, min = 40, te = "Return to Feathermoon Stronghold", av = 2866, g = { "Belvédère de Solarsal", "Solarsal Gazebo", 1444, 26.3, 52.3 }, r = { "Shandris Pennelune", "Shandris Feathermoon", 1444, 30.6, 42.7 } }
D[2869] = { t = "Contre les Hainecrêtes", nv = 43, min = 40, te = "Against the Hatecrest", av = 3130, g = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 }, r = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 }, c = { 1444, 28.8, 56.7 }, obj = "Rapporter 10 × Ecaille de naga Hainecrête", oe = "Bring 10 × Hatecrest Naga Scale" }
D[2870] = { t = "Contre le seigneur Shalzaru", nv = 45, min = 40, te = "Against Lord Shalzaru", av = 2869, g = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 }, r = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 }, c = { 1444, 28.5, 70.5 }, obj = "Rapporter Relique mystérieuse", oe = "Bring Mysterious Relic" }
D[2871] = { t = "Livraison de la relique", nv = 45, min = 40, te = "Delivering the Relic", av = 2870, g = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 }, r = { "Vestia Lancelune", "Vestia Moonspear", 1444, 30.6, 42.7 }, c = { 1444, 28.5, 70.5 }, obj = "Rapporter Relique mystérieuse", oe = "Bring Mysterious Relic" }
D[2872] = { t = "Les dettes de Stoley", nv = 45, min = 40, te = "Stoley's Debt", g = { "MacKinley « Loup des mers »", "\"Sea Wolf\" MacKinley", 1434, 27, 77.1 } }
D[2873] = { t = "La cargaison de Stoley", nv = 45, min = 40, te = "Stoley's Shipment", av = 2872, g = { "Stoley", "Stoley", 1446, 66.6, 25.7 }, r = { "Stoley", "Stoley", 1446, 66.6, 25.7 }, c = { 1446, 72.2, 46.8 }, obj = "Rapporter Chargement de Stoley", oe = "Bring Stoley's Shipment" }
D[2874] = { t = "Livraison à MacKinley", nv = 45, min = 40, te = "Deliver to MacKinley", av = 2873, g = { "Stoley", "Stoley", 1446, 66.6, 25.7 }, obj = "Rapporter Bouteille de Stoley", oe = "Bring Stoley's Bottle" }
D[2875] = { t = "ON RECHERCHE : André Barbe-en-feu", nv = 45, min = 40, te = "WANTED: Andre Firebeard", g = { "Avis de recherche", "Wanted Poster", 1446, 66.6, 25.7 }, r = { "Chef de la sécurité Vizisanie", "Security Chief Bilgewhizzle", 1446, 66.6, 25.7 }, c = { 1446, 73.4, 47.1 }, obj = "Rapporter Tête de Barbe-en-feu", oe = "Bring Firebeard's Head" }
D[2877] = { t = "Nettoyer le rocher de l'Affût", nv = 48, min = 40, te = "Skulk Rock Clean-up", g = { "Fraggar Tonnemante", "Fraggar Thundermantle", 1425, 11.8, 46.8 }, r = { "Fraggar Tonnemante", "Fraggar Thundermantle", 1425, 11.8, 46.8 }, c = { 1425, 48.8, 49 }, obj = "Vaincre 10 × Limace verte ; Vaincre 10 × Limon de jade", oe = "Kill 10 × Green Sludge ; Kill 10 × Jade Ooze" }
D[2879] = { t = "Le Bâton d'Equinex", nv = 50, min = 42, te = "The Stave of Equinex", av = 2943, g = { "Troyas Lunebise", "Troyas Moonbreeze", 1444, 30.6, 42.7 }, r = { "Monolithe d'Equinex", "Equinex Monolith", 1444, 38.2, 10.3 }, obj = "Rapporter Bâton d'Equinex", oe = "Bring Stave of Equinex" }
D[2880] = { t = "Chasse au collier troll", nv = 45, min = 40, te = "Troll Necklace Bounty", g = { "Fraggar Tonnemante", "Fraggar Thundermantle", 1425, 11.8, 46.8 }, r = { "Fraggar Tonnemante", "Fraggar Thundermantle", 1425, 11.8, 46.8 }, obj = "Rapporter 5 × Collier tribal troll", oe = "Bring 5 × Troll Tribal Necklace" }
D[2902] = { t = "Enquête chez les Griffebois", nv = 43, min = 39, te = "Woodpaw Investigation", av = 2863, g = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, r = { "Plan de bataille des Griffebois", "Woodpaw Battle Map", 1444, 71.6, 55.9 } }
D[2903] = { t = "Les plans de bataille", nv = 43, min = 39, te = "The Battle Plans", av = 2902, g = { "Plan de bataille des Griffebois", "Woodpaw Battle Map", 1444, 71.6, 55.9 }, r = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, obj = "Rapporter Plans de bataille des Griffebois", oe = "Bring Woodpaw Battle Plans" }
D[2932] = { t = "Sinistre message", nv = 42, min = 35, te = "Grim Message", g = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 }, r = { "Nimboya", "Nimboya", 1434, 32.2, 28.9 } }
D[2939] = { t = "En savoir plus", nv = 47, min = 42, te = "In Search of Knowledge", g = { "Troyas Lunebise", "Troyas Moonbreeze", 1444, 30.6, 42.7 } }
D[2942] = { t = "La Pierre du matin", nv = 50, min = 42, te = "The Morrow Stone", av = 2879, g = { "Monolithe d'Equinex", "Equinex Monolith", 1444, 38.2, 10.3 }, r = { "Troyas Lunebise", "Troyas Moonbreeze", 1444, 30.6, 42.7 }, obj = "Rapporter Une Pierre étincelante ; Rapporter Bâton d'Equinex", oe = "Bring A Sparkling Stone ; Bring Stave of Equinex" }
D[2944] = { t = "Le Preneur d'images FX", nv = 48, min = 42, te = "The Super Snapper FX", av = 2941, g = { "Gruzouille Sautelevier", "Curgle Cranklehop", 1446, 50.2, 27.5 }, obj = "Rapporter Photo de Gammerita ; Rapporter Le Preneur d'images FX", oe = "Bring Snapshot of Gammerita ; Bring Super Snapper FX" }
D[2967] = { t = "Le retour aux Pitons-du-Tonnerre", nv = 50, min = 45, te = "Return to Thunder Bluff", av = 2954, g = { "Piédestal d'Uldum", "Uldum Pedestal", 1446, 37.6, 81.4 }, obj = "Rapporter Disques de platine miniature", oe = "Bring Miniature Platinum Discs" }
D[2969] = { t = "Liberté pour toutes les créatures", nv = 47, min = 38, te = "Freedom for All Creatures", g = { "Kindal Tisselune", "Kindal Moonweaver", 1444, 65.9, 45.7 }, r = { "Kindal Tisselune", "Kindal Moonweaver", 1444, 65.9, 45.7 } }
D[2970] = { t = "Justice de châtiment", nv = 47, min = 38, te = "Doling Justice", av = 2969, g = { "Jer'kai Tisselune", "Jer'kai Moonweaver", 1444, 65.9, 45.7 }, r = { "Jer'kai Tisselune", "Jer'kai Moonweaver", 1444, 65.9, 45.7 }, c = { 1444, 68.4, 42.8 }, obj = "Vaincre 12 × Naturaliste du Totem-sinistre ; Vaincre 10 × Ecumeur du Totem-sinistre ; Vaincre 6 × Chaman du Totem-sinistre", oe = "Kill 12 × Grimtotem Naturalist ; Kill 10 × Grimtotem Raider ; Kill 6 × Grimtotem Shaman" }
D[2972] = { t = "Justice de châtiment", nv = 47, min = 38, te = "Doling Justice", av = 2970, g = { "Jer'kai Tisselune", "Jer'kai Moonweaver", 1444, 65.9, 45.7 }, obj = "Rapporter Chevalière de Jer'kai", oe = "Bring Jer'kai's Signet Ring" }
D[2973] = { t = "Une nouvelle cape", nv = 45, min = 38, te = "A New Cloak's Sheen", g = { "Krueg Casse-crâne", "Krueg Skullsplitter", 1444, 74.4, 42.9 }, r = { "Krueg Casse-crâne", "Krueg Skullsplitter", 1444, 74.4, 42.9 }, c = { 1444, 67.4, 47.3 }, obj = "Rapporter 10 × Aile iridescente de fée fléchetteuse", oe = "Bring 10 × Iridescent Sprite Darter Wing" }
D[2974] = { t = "Une découverte sinistre", nv = 45, min = 38, te = "A Grim Discovery", av = 2973, g = { "Krueg Casse-crâne", "Krueg Skullsplitter", 1444, 74.4, 42.9 }, r = { "Krueg Casse-crâne", "Krueg Skullsplitter", 1444, 74.4, 42.9 }, c = { 1444, 68, 43.2 }, obj = "Rapporter 20 × Corne de Totem sinistre", oe = "Bring 20 × Grimtotem Horn" }
D[2975] = { t = "Les ogres de Féralas", nv = 43, min = 38, te = "The Ogres of Feralas", g = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, r = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, c = { 1444, 76.8, 32.1 }, obj = "Vaincre 10 × Ogre Gordunni ; Vaincre 10 × Ogre-mage Gordunni ; Vaincre 5 × Brute Gordunni", oe = "Kill 10 × Gordunni Ogre ; Kill 10 × Gordunni Ogre Mage ; Kill 5 × Gordunni Brute" }
D[2976] = { t = "Une découverte sinistre", nv = 45, min = 37, te = "A Grim Discovery", av = 2974, g = { "Krueg Casse-crâne", "Krueg Skullsplitter", 1444, 74.4, 42.9 }, obj = "Rapporter Caisse de cornes de Totem sinistre", oe = "Bring Crate of Grimtotem Horns" }
D[2977] = { t = "Retour à Forgefer", nv = 50, min = 45, te = "Return to Ironforge", av = 2954, g = { "Piédestal d'Uldum", "Uldum Pedestal", 1446, 37.6, 81.4 }, obj = "Rapporter Disques de platine miniature", oe = "Bring Miniature Platinum Discs" }
D[2979] = { t = "Sombre cérémonie", nv = 46, min = 38, te = "Dark Ceremony", av = 2978, g = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, r = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, c = { 1444, 60.1, 71.1 }, obj = "Rapporter Orbe Gordunni", oe = "Bring Gordunni Orb" }
D[2980] = { t = "Les ogres de Féralas", nv = 44, min = 38, te = "The Ogres of Feralas", av = 2975, g = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, r = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, c = { 1444, 60.4, 67.5 }, obj = "Vaincre 10 × Chaman Gordunni ; Vaincre 10 × Démoniste Gordunni ; Vaincre 5 × Marteleur Gordunni", oe = "Kill 10 × Gordunni Shaman ; Kill 10 × Gordunni Warlock ; Kill 5 × Gordunni Mauler" }
D[2982] = { t = "Les plateaux Sauvages", nv = 44, min = 39, te = "The High Wilderness", g = { "Angelas Lunebise", "Angelas Moonbreeze", 1444, 30.6, 42.7 }, r = { "Angelas Lunebise", "Angelas Moonbreeze", 1444, 30.6, 42.7 }, c = { 1444, 60.3, 68.4 }, obj = "Vaincre 8 × Démoniste Gordunni ; Vaincre 8 × Chaman Gordunni ; Vaincre 8 × Brute Gordunni", oe = "Kill 8 × Gordunni Warlock ; Kill 8 × Gordunni Shaman ; Kill 8 × Gordunni Brute" }
D[2987] = { t = "Cobalt gordunni", nv = 43, min = 38, te = "Gordunni Cobalt", g = { "Orwin Azztuche", "Orwin Gizzmick", 1444, 74.4, 42.9 }, r = { "Orwin Azztuche", "Orwin Gizzmick", 1444, 74.4, 42.9 }, obj = "Rapporter 12 × Cobalt Gordunni ; Rapporter Pelle d'Orwin", oe = "Bring 12 × Gordunni Cobalt ; Bring Orwin's Shovel" }
D[2988] = { t = "Les cages des Fanécorces", nv = 45, min = 40, te = "Witherbark Cages", g = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, r = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, c = { 1425, 23.3, 58.8 }, obj = "Activer Première cage de Fanécorce ; Activer Deuxième cage de Fanécorce ; Activer Troisième cage de Fanécorce", oe = "Use First Witherbark Cage ; Use Second Witherbark Cage ; Use Third Witherbark Cage" }
D[2989] = { t = "L'autel de Zul", nv = 48, min = 40, te = "The Altar of Zul", av = 2988, g = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, r = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 } }
D[2990] = { t = "Thadius Sinissombre", nv = 47, min = 40, te = "Thadius Grimshade", av = 2989, g = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, obj = "Rapporter Plume de Bec-tranchant", oe = "Bring Sharpbeak's Feather" }
D[2992] = { t = "La Divination", nv = 47, min = 40, te = "The Divination", av = 2991, g = { "Thadius Sinissombre", "Thadius Grimshade", 1419, 67.6, 19.3 }, r = { "Thadius Sinissombre", "Thadius Grimshade", 1419, 67.6, 19.3 } }
D[2993] = { t = "Retour dans les Hinterlands", nv = 47, min = 40, te = "Return to the Hinterlands", av = 2992, g = { "Thadius Sinissombre", "Thadius Grimshade", 1419, 67.6, 19.3 } }
D[2994] = { t = "Sauver Bec-tranchant", nv = 53, min = 40, te = "Saving Sharpbeak", av = 2993, g = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, r = { "Maître des griffons Hachegriffe", "Gryphon Master Talonaxe", 1425, 11.8, 46.8 }, c = { 1425, 53.4, 67.1 }, obj = "Utiliser Ouverture de la Cage sur Cage de Bec-tranchant", oe = "Use Opening Cage on Sharpbeak's Cage" }
D[2996] = { t = "À la recherche de Strahad", nv = 30, min = 30, te = "Seeking Strahad", g = { "Gan'rul Oeil-sanglant", "Gan'rul Bloodeye", 1454, 48.2, 45.3 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 } }
D[3002] = { t = "L'Orbe Gordunni", nv = 47, min = 38, te = "The Gordunni Orb", av = 2979, g = { "Rok Orhan", "Rok Orhan", 1444, 74.4, 42.9 }, c = { 1444, 60.1, 71.1 }, obj = "Rapporter Orbe Gordunni", oe = "Bring Gordunni Orb" }
D[3022] = { t = "À manipuler avec soin", nv = 47, min = 42, te = "Handle With Care", g = { "Gruzouille Sautelevier", "Curgle Cranklehop", 1446, 50.2, 27.5 }, obj = "Rapporter Caisse soigneusement empaquetée", oe = "Bring A Carefully-packed Crate" }
D[3062] = { t = "Cœur noir", nv = 50, min = 45, te = "Dark Heart", g = { "Talo Sabot-de-ronce", "Talo Thornhoof", 1444, 74.4, 42.9 }, r = { "Talo Sabot-de-ronce", "Talo Thornhoof", 1444, 74.4, 42.9 }, obj = "Rapporter Coeur noir d'Edana", oe = "Bring Edana's Dark Heart" }
D[3063] = { t = "Se venger des Ruissenord", nv = 50, min = 45, te = "Vengeance on the Northspring", g = { "Talo Sabot-de-ronce", "Talo Thornhoof", 1444, 74.4, 42.9 }, r = { "Talo Sabot-de-ronce", "Talo Thornhoof", 1444, 74.4, 42.9 }, c = { 1444, 39.5, 13.4 }, obj = "Vaincre 4 × Harpie Ruissenord ; Vaincre 4 × Volplume Ruissenord ; Vaincre 4 × Pourfendeuse Ruissenord ; Vaincre 4 × Imploratrice céleste Ruissenord", oe = "Kill 4 × Northspring Harpy ; Kill 4 × Northspring Roguefeather ; Kill 4 × Northspring Slayer ; Kill 4 × Northspring Windcaller" }
D[3065] = { t = "Tablette simple", nv = 1, min = 1, te = "Simple Tablet", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Frang", "Frang", 1411, 42.1, 68.3 }, obj = "Rapporter Tablette simple", oe = "Bring Simple Tablet" }
D[3082] = { t = "Tablette gravée", nv = 1, min = 1, te = "Etched Tablet", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Jen'shan", "Jen'shan", 1411, 42.1, 68.3 }, obj = "Rapporter Tablette gravée", oe = "Bring Etched Tablet" }
D[3083] = { t = "Tablette codée", nv = 1, min = 1, te = "Encrypted Tablet", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Rwag", "Rwag", 1411, 42.1, 68.3 }, obj = "Rapporter Tablette codée", oe = "Bring Encrypted Tablet" }
D[3084] = { t = "Tablette runique", nv = 1, min = 1, te = "Rune-Inscribed Tablet", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Shikrik", "Shikrik", 1411, 42.1, 68.3 }, obj = "Rapporter Tablette runique", oe = "Bring Rune-Inscribed Tablet" }
D[3085] = { t = "Tablette bénie", nv = 1, min = 1, te = "Hallowed Tablet", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Ken'jai", "Ken'jai", 1411, 42.1, 68.3 }, obj = "Rapporter Tablette bénie", oe = "Bring Hallowed Tablet" }
D[3086] = { t = "Tablette glyphée", nv = 1, min = 1, te = "Glyphic Tablet", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Mai'ah", "Mai'ah", 1411, 42.1, 68.3 }, obj = "Rapporter Tablette glyphée", oe = "Bring Glyphic Tablet" }
D[3087] = { t = "Parchemin gravé", nv = 1, min = 1, te = "Etched Parchment", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Jen'shan", "Jen'shan", 1411, 42.1, 68.3 }, obj = "Rapporter Parchemin gravé", oe = "Bring Etched Parchment" }
D[3088] = { t = "Parchemin codé", nv = 1, min = 1, te = "Encrypted Parchment", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Rwag", "Rwag", 1411, 42.1, 68.3 }, obj = "Rapporter Parchemin codé", oe = "Bring Encrypted Parchment" }
D[3089] = { t = "Parchemin runique", nv = 1, min = 1, te = "Rune-Inscribed Parchment", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Shikrik", "Shikrik", 1411, 42.1, 68.3 }, obj = "Rapporter Parchemin runique", oe = "Bring Rune-Inscribed Parchment" }
D[3090] = { t = "Parchemin contaminé", nv = 1, min = 1, te = "Tainted Parchment", av = 788, g = { "Gornek", "Gornek", 1411, 42.1, 68.3 }, r = { "Nartok", "Nartok", 1411, 42.1, 68.3 }, obj = "Rapporter Parchemin contaminé", oe = "Bring Tainted Parchment" }
D[3091] = { t = "Note simple", nv = 1, min = 1, te = "Simple Note", av = 747, g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Harutt Corne-tonnerre", "Harutt Thunderhorn", 1412, 44.5, 77.5 }, obj = "Rapporter Note simple", oe = "Bring Simple Note" }
D[3092] = { t = "Note gravée", nv = 1, min = 1, te = "Etched Note", av = 747, g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Lanka Vise-loin", "Lanka Farshot", 1412, 44.5, 77.5 }, obj = "Rapporter Note gravée", oe = "Bring Etched Note" }
D[3093] = { t = "Note runique", nv = 1, min = 1, te = "Rune-Inscribed Note", av = 747, g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Meela Aube-glorieuse", "Meela Dawnstrider", 1412, 44.5, 77.5 }, obj = "Rapporter Note runique", oe = "Bring Rune-Inscribed Note" }
D[3094] = { t = "Note verdoyante", nv = 1, min = 1, te = "Verdant Note", av = 747, g = { "Grull Vent-du-faucon", "Grull Hawkwind", 1412, 44.5, 77.5 }, r = { "Gart Cours-la-brume", "Gart Mistrunner", 1412, 44.5, 77.5 }, obj = "Rapporter Note verdoyante", oe = "Bring Verdant Note" }
D[3095] = { t = "Parchemin simple", nv = 1, min = 1, te = "Simple Scroll", av = 364, g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "Dannal Stern", "Dannal Stern", 1420, 30.8, 66.2 }, obj = "Rapporter Parchemin simple", oe = "Bring Simple Scroll" }
D[3096] = { t = "Parchemin codé", nv = 1, min = 1, te = "Encrypted Scroll", av = 364, g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "David Trias", "David Trias", 1420, 30.8, 66.2 }, obj = "Rapporter Parchemin codé", oe = "Bring Encrypted Scroll" }
D[3097] = { t = "Parchemin béni", nv = 1, min = 1, te = "Hallowed Scroll", av = 364, g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "Sombre clerc Duesten", "Dark Cleric Duesten", 1420, 30.8, 66.2 }, obj = "Rapporter Parchemin béni", oe = "Bring Hallowed Scroll" }
D[3098] = { t = "Rouleau glyphé", nv = 1, min = 1, te = "Glyphic Scroll", av = 364, g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "Isabella", "Isabella", 1420, 30.8, 66.2 }, obj = "Rapporter Parchemin glyphé", oe = "Bring Glyphic Scroll" }
D[3099] = { t = "Rouleau contaminé", nv = 1, min = 1, te = "Tainted Scroll", av = 364, g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "Maximillion", "Maximillion", 1420, 30.8, 66.2 }, obj = "Rapporter Rouleau contaminé", oe = "Bring Tainted Scroll" }
D[3100] = { t = "Une lettre simple", nv = 1, min = 1, te = "Simple Letter", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Llane Beshere", "Llane Beshere", 1429, 48.2, 42.9 }, obj = "Rapporter Lettre simple", oe = "Bring Simple Letter" }
D[3101] = { t = "La lettre consacrée", nv = 1, min = 1, te = "Consecrated Letter", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Frère Sammuel", "Brother Sammuel", 1429, 48.2, 42.9 }, obj = "Rapporter Lettre consacrée", oe = "Bring Consecrated Letter" }
D[3102] = { t = "La lettre codée", nv = 1, min = 1, te = "Encrypted Letter", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Jorik Kerridan", "Jorik Kerridan", 1429, 48.2, 42.9 }, obj = "Rapporter Lettre codée", oe = "Bring Encrypted Letter" }
D[3103] = { t = "La lettre bénie", nv = 1, min = 1, te = "Hallowed Letter", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Prêtresse Anetta", "Priestess Anetta", 1429, 48.2, 42.9 }, obj = "Rapporter Lettre bénie", oe = "Bring Hallowed Letter" }
D[3104] = { t = "La lettre glyphée", nv = 1, min = 1, te = "Glyphic Letter", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Khelden Bremen", "Khelden Bremen", 1429, 48.2, 42.9 }, obj = "Rapporter Lettre glyphée", oe = "Bring Glyphic Letter" }
D[3105] = { t = "La lettre contaminée", nv = 1, min = 1, te = "Tainted Letter", av = 7, g = { "Maréchal McBride", "Marshal McBride", 1429, 48.2, 42.9 }, r = { "Drusilla La Salle", "Drusilla La Salle", 1429, 48.2, 42.9 }, obj = "Rapporter Lettre contaminée", oe = "Bring Tainted Letter" }
D[3106] = { t = "Rune simple", nv = 1, min = 1, te = "Simple Rune", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Thran Khorman", "Thran Khorman", 1426, 28.8, 66.4 }, obj = "Rapporter Rune simple", oe = "Bring Simple Rune" }
D[3107] = { t = "Rune consacrée", nv = 1, min = 1, te = "Consecrated Rune", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Bromos Grummneur", "Bromos Grummner", 1426, 29.7, 71.3 }, obj = "Rapporter Rune consacrée", oe = "Bring Consecrated Rune" }
D[3108] = { t = "Rune gravée", nv = 1, min = 1, te = "Etched Rune", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Thorgas Grimson", "Thorgas Grimson", 1426, 29.7, 71.3 }, obj = "Rapporter Rune gravée", oe = "Bring Etched Rune" }
D[3109] = { t = "Rune codée", nv = 1, min = 1, te = "Encrypted Rune", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Solm Hargrin", "Solm Hargrin", 1426, 28.8, 66.4 }, obj = "Rapporter Rune codée", oe = "Bring Encrypted Rune" }
D[3110] = { t = "Rune bénie", nv = 1, min = 1, te = "Hallowed Rune", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Branstock Khalder", "Branstock Khalder", 1426, 28.8, 66.4 }, obj = "Rapporter Rune bénie", oe = "Bring Hallowed Rune" }
D[3112] = { t = "Note de service simple", nv = 1, min = 1, te = "Simple Memorandum", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Thran Khorman", "Thran Khorman", 1426, 28.8, 66.4 }, obj = "Rapporter Note de service simple", oe = "Bring Simple Memorandum" }
D[3113] = { t = "Note de service codée", nv = 1, min = 1, te = "Encrypted Memorandum", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Solm Hargrin", "Solm Hargrin", 1426, 28.8, 66.4 }, obj = "Rapporter Note de service codée", oe = "Bring Encrypted Memorandum" }
D[3114] = { t = "Note de service glyphée", nv = 1, min = 1, te = "Glyphic Memorandum", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Marryk Nurribit", "Marryk Nurribit", 1426, 28.8, 66.4 }, obj = "Rapporter Note de service glyphée", oe = "Bring Glyphic Memorandum" }
D[3115] = { t = "Rune contaminée", nv = 1, min = 1, te = "Tainted Memorandum", av = 179, g = { "Sten Rudebras", "Sten Stoutarm", 1426, 29.7, 71.3 }, r = { "Alamar Grimm", "Alamar Grimm", 1426, 28.8, 66.4 }, obj = "Rapporter Note de service contaminée", oe = "Bring Tainted Memorandum" }
D[3116] = { t = "Le cachet simple", nv = 1, min = 1, te = "Simple Sigil", av = 456, g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Alyissia", "Alyissia", 1438, 59.1, 39.4 }, obj = "Rapporter Sceau simple", oe = "Bring Simple Sigil" }
D[3117] = { t = "Le cachet gravé", nv = 1, min = 1, te = "Etched Sigil", av = 456, g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Ayanna Vassanfin", "Ayanna Everstride", 1438, 58.7, 44.3 }, obj = "Rapporter Sceau gravé", oe = "Bring Etched Sigil" }
D[3118] = { t = "Le cachet codé", nv = 1, min = 1, te = "Encrypted Sigil", av = 456, g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Frahun Murmombre", "Frahun Shadewhisper", 1438, 59.1, 39.4 }, obj = "Rapporter Sceau codé", oe = "Bring Encrypted Sigil" }
D[3119] = { t = "Le cachet béni", nv = 1, min = 1, te = "Hallowed Sigil", av = 456, g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Shanda", "Shanda", 1438, 58.7, 44.3 }, obj = "Rapporter Sceau béni", oe = "Bring Hallowed Sigil" }
D[3120] = { t = "Le cachet verdoyant", nv = 1, min = 1, te = "Verdant Sigil", av = 456, g = { "Conservateur Ilthalaine", "Conservator Ilthalaine", 1438, 58.7, 44.3 }, r = { "Mardant Chênefort", "Mardant Strongoak", 1438, 59.1, 39.4 }, obj = "Rapporter Sceau verdoyant", oe = "Bring Verdant Sigil" }
D[3121] = { t = "Une Requête étrange", nv = 45, min = 40, te = "A Strange Request", g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, obj = "Rapporter Une tête réduite", oe = "Bring A Shrunken Head" }
D[3123] = { t = "Test du récipient", nv = 47, min = 40, te = "Testing the Vessel", av = 3122, g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, obj = "Rapporter 10 × Indomptable miniaturisé ; Rapporter Récipient d'Indomptable miniaturisé", oe = "Bring 10 × Wildkin Muisek ; Bring Wildkin Muisek Vessel" }
D[3124] = { t = "Muisek d'hippogriffe", nv = 47, min = 40, te = "Hippogryph Muisek", av = 3123, g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, obj = "Rapporter 10 × Hippogryphe miniaturisé ; Rapporter Récipient d'hippogryphe miniaturisé", oe = "Bring 10 × Hippogryph Muisek ; Bring Hippogryph Muisek Vessel" }
D[3125] = { t = "Muisek de dragon féerique", nv = 45, min = 40, te = "Faerie Dragon Muisek", av = 3124, g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, obj = "Rapporter 8 × Dragon féérique miniaturisé ; Rapporter Récipient de dragon féérique miniaturisé", oe = "Bring 8 × Faerie Dragon Muisek ; Bring Faerie Dragon Muisek Vessel" }
D[3126] = { t = "Muisek de tréant", nv = 50, min = 40, te = "Treant Muisek", av = 3125, g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, obj = "Rapporter 3 × Tréant miniaturisé ; Rapporter Récipient de tréant miniaturisé", oe = "Bring 3 × Treant Muisek ; Bring Treant Muisek Vessel" }
D[3127] = { t = "Muisek de géant des montagnes", nv = 50, min = 40, te = "Mountain Giant Muisek", av = 3126, g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, obj = "Rapporter 7 × Géant des montagnes miniaturisé ; Rapporter Récipient de géant des montagnes miniaturisé", oe = "Bring 7 × Mountain Giant Muisek ; Bring Mountain Giant Muisek Vessel" }
D[3128] = { t = "Matériaux naturels", nv = 50, min = 40, te = "Natural Materials", g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, c = { 1444, 55.7, 68.1 }, obj = "Rapporter 2 × Bûches fendues ; Rapporter 6 × Minerais incrustés ; Rapporter 20 × Tendon résistant ; Rapporter 40 × Fragments métalliques", oe = "Bring 2 × Splintered Log ; Bring 6 × Encrusted Minerals ; Bring 20 × Resilient Sinew ; Bring 40 × Metallic Fragments" }
D[3129] = { t = "Armes de l'Esprit", nv = 50, min = 40, te = "Weapons of Spirit", g = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 }, r = { "Féticheur Uzer'i", "Witch Doctor Uzer'i", 1444, 74.4, 42.9 } }
D[3130] = { t = "Contre les Hainecrêtes", nv = 43, min = 40, te = "Against the Hatecrest", av = 2867, g = { "Shandris Pennelune", "Shandris Feathermoon", 1444, 30.6, 42.7 }, r = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 } }
D[3141] = { t = "Loramus", nv = 57, min = 45, av = 2744, g = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, r = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 } }
D[3161] = { t = "La gahz'ridienne", nv = 48, min = 43, te = "Gahz'ridian", g = { "Marvon Chercherivet", "Marvon Rivetseeker", 1446, 52.7, 45.9 }, r = { "Marvon Chercherivet", "Marvon Rivetseeker", 1446, 52.7, 45.9 }, c = { 1446, 44.3, 71.4 }, obj = "Rapporter 30 × Ornement Gahz'ridian ; Rapporter Détecteur Gahz'ridian", oe = "Bring 30 × Gahz'ridian Ornament ; Bring Gahz'ridian Detector" }
D[3221] = { t = "Parler à Renferrel", nv = 12, min = 10, te = "Speak with Renferrel", av = 449, g = { "Grand exécuteur Hadrec", "High Executor Hadrec", 1421, 44.2, 39.8 }, r = { "Apothicaire Renferrel", "Apothecary Renferrel", 1421, 44.2, 39.8 } }
D[3261] = { t = "[PÉRIMÉ 4].xJorn Œil-des-cieux", nv = 18, min = 10, te = "Jorn Skyseer", av = 905, g = { "Sergra Sombreronce", "Sergra Darkthorn", 1413, 52.2, 31 }, r = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 } }
D[3281] = { t = "Argent volé", nv = 18, min = 9, te = "Stolen Silver", av = 869, g = { "Gazrog", "Gazrog", 1413, 52.2, 31 }, r = { "Gazrog", "Gazrog", 1413, 52.2, 31 }, c = { 1413, 58, 53.9 }, obj = "Rapporter Argent volé", oe = "Bring Stolen Silver" }
D[3301] = { t = "Mura Totem-runique", nv = 15, min = 10, te = "Mura Runetotem", av = 880, g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, obj = "Rapporter Echantillon de carapace de Gueule d'acier", oe = "Bring Sample Snapjaw Shell" }
D[3321] = { t = "Est-ce que ceci est à vous ?", nv = 50, min = 40, te = "Did You Lose This?", g = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 }, r = { "Trenton Martelume", "Trenton Lighthammer", 1446, 50.2, 27.5 } }
D[3361] = { t = "Les malheurs d'un réfugié", nv = 3, min = 3, te = "A Refugee's Quandary", g = { "Felix Chouineboulon", "Felix Whindlebolt", 1426, 29.7, 71.3 }, r = { "Felix Chouineboulon", "Felix Whindlebolt", 1426, 29.7, 71.3 }, c = { 1426, 23.3, 78.5 }, obj = "Rapporter Boîte de Felix ; Rapporter Coffre de Felix ; Rapporter Seau de boulons de Felix", oe = "Bring Felix's Box ; Bring Felix's Chest ; Bring Felix's Bucket of Bolts" }
D[3362] = { t = "La vallée des Chardonniers", nv = 50, min = 45, te = "Thistleshrub Valley", g = { "Tran'rek", "Tran'rek", 1446, 50.2, 27.5 }, r = { "Tran'rek", "Tran'rek", 1446, 50.2, 27.5 }, c = { 1446, 29, 65.5 }, obj = "Vaincre 8 × Chardonnier noueux ; Vaincre 8 × Chardonnier taille-racine", oe = "Kill 8 × Gnarled Thistleshrub ; Kill 8 × Thistleshrub Rootshaper" }
D[3364] = { t = "Une livraison de thé brûlant", nv = 5, min = 4, te = "Scalding Mornbrew Delivery", g = { "Nori Fièroblique", "Nori Pridedrift", 1426, 25.1, 75.7 }, r = { "Durnan Coupefourrure", "Durnan Furcutter", 1426, 28.8, 66.4 }, obj = "Rapporter Thé brûlant de Durnan", oe = "Bring Durnan's Scalding Mornbrew" }
D[3365] = { t = "Rapporter la Tasse", nv = 5, min = 4, te = "Bring Back the Mug", av = 3364, g = { "Durnan Coupefourrure", "Durnan Furcutter", 1426, 28.8, 66.4 }, r = { "Nori Fièroblique", "Nori Pridedrift", 1426, 25.1, 75.7 }, obj = "Rapporter Chope de Nori", oe = "Bring Nori's Mug" }
D[3367] = { t = "Les pierres de Suntara", nv = 48, min = 40, te = "Suntara Stones", g = { "Dorius Soignepierre", "Dorius Stonetender", 1427, 63.9, 61 }, r = { "Lettre roussie", "Singed Letter", 1427, 74.4, 19.3 } }
D[3368] = { t = "Les pierres de Suntara", nv = 48, min = 40, te = "Suntara Stones", av = 3367, g = { "Lettre roussie", "Singed Letter", 1427, 74.4, 19.3 }, obj = "Rapporter Lettre roussie", oe = "Bring Singed Letter" }
D[3369] = { t = "Au cœur des cauchemars", nv = 25, min = 15, te = "In Nightmares", av = 6981, g = { "Falla Vent-de-sagesse", "Falla Sagewind", 1413, 48.2, 32.8 }, obj = "Rapporter Eclat de cauchemar", oe = "Bring Nightmare Shard" }
D[3370] = { t = "Au cœur des cauchemars", nv = 25, min = 15, te = "In Nightmares", av = 6981, g = { "Falla Vent-de-sagesse", "Falla Sagewind", 1413, 48.2, 32.8 }, obj = "Rapporter Eclat de cauchemar", oe = "Bring Nightmare Shard" }
D[3372] = { t = "La libération", nv = 52, min = 40, te = "Release Them", av = 3371, g = { "Archéologue mourant", "Dying Archaeologist", 1427, 41.1, 25.6 }, r = { "Autel de Suntara", "Altar of Suntara", 1427, 41.1, 25.6 }, c = { 1427, 29.1, 25.9 }, obj = "Rapporter Artefact mystérieux", oe = "Bring Mysterious Artifact" }
D[3376] = { t = "La fin de Brochaigu !", nv = 5, min = 3, te = "Break Sharptusk!", g = { "Brave Plume-des-vents", "Brave Windfeather", 1412, 44.5, 77.5 }, r = { "Brave Plume-des-vents", "Brave Windfeather", 1412, 44.5, 77.5 }, obj = "Rapporter Tête du chef Brochaigu Mantépine", oe = "Bring Chief Sharptusk Thornmantle's Head" }
D[3377] = { t = "Prière à Élune", nv = 50, min = 40, te = "Prayer to Elune", g = { "Zamael Chardelune", "Zamael Lunthistle", 1427, 29.6, 26.3 }, r = { "Zamael Chardelune", "Zamael Lunthistle", 1427, 29.6, 26.3 } }
D[3378] = { t = "Prière à Élune", nv = 50, min = 40, te = "Prayer to Elune", av = 3377, g = { "Zamael Chardelune", "Zamael Lunthistle", 1427, 29.6, 26.3 }, c = { 1427, 19.3, 38.4 }, obj = "Rapporter Prière à Elune", oe = "Bring Prayer to Elune" }
D[3379] = { t = "Les tisseuses d'ombre", nv = 50, min = 46, te = "Shadoweaver", g = { "Nilith Lokrav", "Nilith Lokrav", 1427, 41, 74.9 }, r = { "Nilith Lokrav", "Nilith Lokrav", 1427, 41, 74.9 }, c = { 1427, 59.6, 25.3 }, obj = "Vaincre 5 × Braconnier Ombresoie", oe = "Kill 5 × Shadowsilk Poacher" }
D[3382] = { t = "Doux whisky", nv = 57, min = 48, te = "A Crew Under Fire", g = { "Capitaine Vanessa Beltis", "Captain Vanessa Beltis", 1447, 53.1, 87.8 }, r = { "Capitaine Vanessa Beltis", "Captain Vanessa Beltis", 1447, 53.1, 87.8 } }
D[3385] = { t = "Le Sous-marché", nv = 50, min = 46, te = "The Undermarket", av = 3379, g = { "Nilith Lokrav", "Nilith Lokrav", 1427, 41, 74.9 }, r = { "Nilith Lokrav", "Nilith Lokrav", 1427, 41, 74.9 }, c = { 1427, 34.7, 52 }, obj = "Rapporter Sacoche du marchand ; Vaincre Maître d'artisanat Kovic ; Vaincre Clonk", oe = "Bring Trader's Satchel ; Kill Trade Master Kovic ; Kill Clunk" }
D[3402] = { t = "Le Sous-marché", nv = 50, min = 43, te = "The Undermarket", av = 3385, g = { "Nilith Lokrav", "Nilith Lokrav", 1427, 41, 74.9 } }
D[3441] = { t = "Châtiment divin", nv = 48, min = 40, te = "Divine Retribution", g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 } }
D[3442] = { t = "La flamme parfaite", nv = 48, min = 40, te = "The Flawless Flame", av = 3441, g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, c = { 1427, 54.3, 47.6 }, obj = "Rapporter 4 × Coeur des flammes ; Rapporter 4 × Huile de golem", oe = "Bring 4 × Heart of Flame ; Bring 4 × Golem Oil" }
D[3443] = { t = "Forger le manche", nv = 48, min = 40, te = "Forging the Shaft", av = 3442, g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, c = { 1427, 43, 34.1 }, obj = "Rapporter 8 × Dague plaquée en thorium", oe = "Bring 8 × Thorium Plated Dagger" }
D[3444] = { t = "Le Cercle de pierres", nv = 51, min = 46, te = "The Stone Circle", g = { "Marvon Chercherivet", "Marvon Rivetseeker", 1446, 52.7, 45.9 }, r = { "Marvon Chercherivet", "Marvon Rivetseeker", 1446, 52.7, 45.9 }, obj = "Rapporter Cercle de pierres", oe = "Bring Stone Circle" }
D[3445] = { t = "Le Temple englouti", nv = 51, min = 46, te = "The Sunken Temple", g = { "Angelas Lunebise", "Angelas Moonbreeze", 1444, 30.6, 42.7 } }
D[3452] = { t = "L'enveloppe de la flamme", nv = 50, min = 40, te = "The Flame's Casing", av = 3443, g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, c = { 1427, 19.3, 38.4 }, obj = "Rapporter Symbole de Ragnaros", oe = "Bring Symbol of Ragnaros" }
D[3453] = { t = "La Torche de vindicte", nv = 50, min = 40, te = "The Torch of Retribution", av = 3452, g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 } }
D[3454] = { t = "La Torche de vindicte", nv = 50, min = 40, te = "The Torch of Retribution", av = 3453, g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Torche de vindicte", "Torch of Retribution", 1427, 39.1, 39 } }
D[3462] = { t = "L'écuyer Maltrake", nv = 50, min = 40, te = "Squire Maltrake", av = 3454, g = { "Velarok Lamevent", "Kalaran Windblade", 1427, 39.1, 39 }, r = { "Ecuyer Maltrake", "Squire Maltrake", 1427, 39.1, 39 } }
D[3463] = { t = "Allumer le feu !", nv = 52, min = 40, te = "Set Them Ablaze!", av = 3462, g = { "Ecuyer Maltrake", "Squire Maltrake", 1427, 39.1, 39 }, r = { "Ecuyer Maltrake", "Squire Maltrake", 1427, 39.1, 39 }, c = { 1427, 34.5, 57.6 }, obj = "Activer Brasero de sentinelle ; Activer Brasero de sentinelle ; Activer Brasero de sentinelle ; Activer Brasero de sentinelle", oe = "Use Sentry Brazier ; Use Sentry Brazier ; Use Sentry Brazier ; Use Sentry Brazier" }
D[3481] = { t = "Bibelots...", nv = 50, min = 40, te = "Trinkets...", av = 3463, g = { "Trésor du Vol noir", "Hoard of the Black Dragonflight", 1427, 39.1, 39 }, r = { "Trésor du Vol noir", "Hoard of the Black Dragonflight", 1427, 39.1, 39 } }
D[3501] = { t = "Tout se compte en grandes quantités", nv = 55, min = 45, te = "Everything Counts In Large Amounts", g = { "Kum'isha le collecteur", "Kum'isha the Collector", 1419, 52, 35.6 }, r = { "Kum'isha le collecteur", "Kum'isha the Collector", 1419, 52, 35.6 }, obj = "Rapporter Fragment de draenéthyste imparfait", oe = "Bring Imperfect Draenethyst Fragment" }
D[3505] = { t = "Trahison", nv = 53, min = 44, te = "Betrayed", av = 3504, g = { "Ag'tor Poing-de-sang", "Ag'tor Bloodfist", 1447, 22.3, 51.5 }, r = { "Kaldorei Tome of Summoning", "Kaldorei Tome of Summoning", 1447, 59.5, 31.3 }, c = { 1447, 57.2, 28.2 }, obj = "Vaincre 10 × Vengeur elfe de sang ; Vaincre 10 × Géomètre elfe de sang", oe = "Kill 10 × Blood Elf Reclaimer ; Kill 10 × Blood Elf Surveyor" }
D[3506] = { t = "Trahison", nv = 56, min = 44, te = "Betrayed", av = 3505, g = { "Kaldorei Tome of Summoning", "Kaldorei Tome of Summoning", 1447, 59.5, 31.3 }, r = { "Ag'tor Poing-de-sang", "Ag'tor Bloodfist", 1447, 22.3, 51.5 }, obj = "Rapporter Tête du magus Rimtori", oe = "Bring Head of Magus Rimtori" }
D[3507] = { t = "Trahison", nv = 56, min = 44, te = "Betrayed", av = 3506, g = { "Ag'tor Poing-de-sang", "Ag'tor Bloodfist", 1447, 22.3, 51.5 }, obj = "Rapporter Tête du magus Rimtori", oe = "Bring Head of Magus Rimtori" }
D[3508] = { t = "Briser l'Amulette", nv = 58, min = 45, te = "Breaking the Ward", av = 3141, g = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, r = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 } }
D[3509] = { t = "Le nom de la bête", nv = 58, min = 45, te = "The Name of the Beast", av = 3508, g = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, r = { "Seigneur Arkkoroc", "Lord Arkkoroc", 1447, 77.1, 42.8 } }
D[3510] = { t = "Le nom de la bête", nv = 58, min = 45, te = "The Name of the Beast", av = 3509, g = { "Seigneur Arkkoroc", "Lord Arkkoroc", 1447, 77.1, 42.8 }, r = { "Seigneur Arkkoroc", "Lord Arkkoroc", 1447, 77.1, 42.8 }, c = { 1447, 56.7, 44.8 }, obj = "Rapporter Tête battue d'Hetaera ; Rapporter Tête ensanglantée d'Hetaera ; Rapporter Tête meurtrie d'Hetaera", oe = "Bring Hetaera's Beaten Head ; Bring Hetaera's Bloodied Head ; Bring Hetaera's Bruised Head" }
D[3511] = { t = "Le nom de la bête", nv = 58, min = 45, te = "The Name of the Beast", av = 3510, g = { "Seigneur Arkkoroc", "Lord Arkkoroc", 1447, 77.1, 42.8 }, r = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, obj = "Rapporter Sang d'Hetaera", oe = "Bring Hetaera's Blood" }
D[3512] = { t = "Par les mots d'Eranikus", nv = 55, min = 48, te = "In Eranikus' Own Words", av = 3374, g = { "Itharius", "Itharius", 1435, 13.7, 71.7 } }
D[3514] = { t = "Présence de la Horde", nv = 29, min = 15, te = "Horde Presence", av = 3513, g = { "Kadrak", "Kadrak", 1413, 48.1, 5.4 }, r = { "Kadrak", "Kadrak", 1413, 48.1, 5.4 }, obj = "Vaincre Rynthariel le Maître des clés", oe = "Kill Rynthariel the Keymaster" }
D[3517] = { t = "L'art du vol", nv = 52, min = 45, te = "Stealing Knowledge", g = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, r = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, c = { 1447, 38.1, 53.3 }, obj = "Rapporter Tablette de Beth'Amara ; Rapporter Tablette de Jin'yael ; Rapporter Tablette de Markri ; Rapporter Tablette de Sael'hai", oe = "Bring Tablet of Beth'Amara ; Bring Tablet of Jin'yael ; Bring Tablet of Markri ; Bring Tablet of Sael'hai" }
D[3518] = { t = "Livraison à Magatha", nv = 52, min = 45, te = "Delivery to Magatha", av = 3517, g = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, c = { 1447, 37.6, 51.4 }, obj = "Rapporter Tablette de Beth'Amara", oe = "Bring Tablet of Beth'Amara" }
D[3519] = { t = "Un ami dans le besoin", nv = 4, min = 2, te = "A Friend in Need", av = 4495, g = { "Iverron", "Iverron", 1438, 54.6, 33 }, r = { "Dirania Brillargent", "Dirania Silvershine", 1438, 58.7, 44.3 } }
D[3520] = { t = "Esprits de Hurleurs", nv = 44, min = 40, te = "Screecher Spirits", g = { "Yeh'kinya", "Yeh'kinya", 1446, 66.6, 25.7 }, r = { "Yeh'kinya", "Yeh'kinya", 1446, 66.6, 25.7 }, obj = "Rapporter Ronce de Yeh'kinya ; Vaincre 3 × Esprit de Hurleur", oe = "Bring Yeh'kinya's Bramble ; Kill 3 × Screecher Spirit" }
D[3521] = { t = "L'antidote d'Iverron", nv = 4, min = 2, te = "Iverron's Antidote", av = 3519, g = { "Dirania Brillargent", "Dirania Silvershine", 1438, 58.7, 44.3 }, r = { "Dirania Brillargent", "Dirania Silvershine", 1438, 58.7, 44.3 }, c = { 1438, 58.9, 40.7 }, obj = "Rapporter 7 × Champignon jacinthe ; Rapporter 4 × Lys pétale de lune ; Rapporter Ichor d'araignée Tissebois", oe = "Bring 7 × Hyacinth Mushroom ; Bring 4 × Moonpetal Lily ; Bring Webwood Ichor" }
D[3522] = { t = "L'antidote d'Iverron", nv = 4, min = 2, te = "Iverron's Antidote", av = 3521, g = { "Dirania Brillargent", "Dirania Silvershine", 1438, 58.7, 44.3 }, r = { "Iverron", "Iverron", 1438, 54.6, 33 }, obj = "Rapporter Antidote d'Iverron", oe = "Bring Iverron's Antidote" }
D[3524] = { t = "Échouage", nv = 13, min = 11, te = "Washed Ashore", g = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, c = { 1439, 36.4, 50.9 }, obj = "Rapporter Os de créature marine", oe = "Bring Sea Creature Bones" }
D[3541] = { t = "Livraison pour Jes'rimon", nv = 52, min = 45, te = "Delivery to Jes'rimon", av = 3517, g = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, c = { 1447, 38.6, 58.7 }, obj = "Rapporter Tablette de Jin'yael", oe = "Bring Tablet of Jin'yael" }
D[3542] = { t = "Livraison à Andron Gant", nv = 52, min = 45, te = "Delivery to Andron Gant", av = 3517, g = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, c = { 1447, 38.1, 54.2 }, obj = "Rapporter Tablette de Markri", oe = "Bring Tablet of Markri" }
D[3561] = { t = "Livraison à l'archimage Xylem", nv = 52, min = 45, te = "Delivery to Archmage Xylem", av = 3517, g = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, c = { 1447, 38.8, 59.1 }, obj = "Rapporter Tablette de Sael'hai", oe = "Bring Tablet of Sael'hai" }
D[3565] = { t = "Le paiement de Xylem à Jediga", nv = 52, min = 45, te = "Xylem's Payment to Jediga", av = 3561, g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Jediga", "Jediga", 1447, 22.3, 51.5 }, obj = "Rapporter Note de Xylem", oe = "Bring Xylem's Note" }
D[3566] = { t = "Debout, Obsidion !", nv = 52, min = 45, te = "Rise, Obsidion!", av = 3372, g = { "Archéologue mourant", "Dying Archaeologist", 1427, 41.1, 25.6 }, c = { 1427, 41.8, 24.3 }, obj = "Rapporter Tête de Lathoric le Noir ; Rapporter Coeur d'Obsidion", oe = "Bring Head of Lathoric the Black ; Bring Heart of Obsidion" }
D[3601] = { t = "Kim'jael évidemment !", nv = 53, min = 47, te = "Kim'jael Indeed!", g = { "Kim'jael", "Kim'jael", 1447, 53.5, 21.8 }, r = { "Kim'jael", "Kim'jael", 1447, 53.5, 21.8 }, c = { 1447, 57.9, 28.7 }, obj = "Rapporter Boussole de Kim'Jael ; Rapporter Lunette de Kim'Jael ; Rapporter Poulet farci de Kim'Jael ; Rapporter Wizzlegoober de Kim'Jael", oe = "Bring Kim'Jael's Compass ; Bring Kim'Jael's Scope ; Bring Kim'Jael's Stuffed Chicken ; Bring Kim'Jael's Wizzlegoober" }
D[3602] = { t = "Azsharite", nv = 58, min = 45, av = 3511, g = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, r = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, c = { 1447, 54.2, 84.7 }, obj = "Rapporter 20 × Azsharite cristallisée", oe = "Bring 20 × Crystallized Azsharite" }
D[3621] = { t = "La formation du gangreplaie", nv = 58, min = 45, te = "The Formation of Felbane", av = 3602, g = { "Loramus Thalipedes", "Loramus Thalipedes", 1447, 60.8, 66.4 }, obj = "Rapporter Chargement pour Galvan", oe = "Bring Shipment to Galvan" }
D[3627] = { t = "Réunir les morceaux de l'amulette brisée", nv = 60, min = 45, te = "Uniting the Shattered Amulet", av = 3626, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Rapporter Amulette d'Allistarj ; Rapporter Amulette de Grol ; Rapporter Amulette de Sevine", oe = "Bring Amulet of Allistarj ; Bring Amulet of Grol ; Bring Amulet of Sevine" }
D[3628] = { t = "Son nom est Rakh’likh", nv = 60, min = 45, te = "You Are Rakh'likh, Demon", av = 3627, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Rapporter Corne brisée du Souilleur ; Rapporter Amulette du Souilleur", oe = "Bring Severed Horn of the Defiler ; Bring Ward of the Defiler" }
D[3631] = { t = "Invoquer un Palefroi corrompu", nv = 40, min = 40, te = "Summon Felsteed", g = { "Zevrost", "Zevrost", 1454, 48.5, 45.4 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 } }
D[3638] = { t = "Le Vœu du secret", nv = 47, min = 30, te = "The Pledge of Secrecy", g = { "Nixx Elastirouage", "Nixx Sprocketspring", 1446, 50.2, 27.5 }, r = { "Nixx Elastirouage", "Nixx Sprocketspring", 1446, 50.2, 27.5 }, obj = "Rapporter Promesse écrite de Nixx", oe = "Bring Nixx's Signed Pledge" }
D[3639] = { t = "Montrez votre travail", nv = 47, min = 30, te = "Show Your Work", av = 3638, g = { "Nixx Elastirouage", "Nixx Sprocketspring", 1446, 50.2, 27.5 }, r = { "Nixx Elastirouage", "Nixx Sprocketspring", 1446, 50.2, 27.5 }, obj = "Rapporter 20 × Grande bombe en fer ; Rapporter 20 × Dynamite solide ; Rapporter 5 × Mouton explosif", oe = "Bring 20 × Big Iron Bomb ; Bring 20 × Solid Dynamite ; Bring 5 × Explosive Sheep" }
D[3642] = { t = "Le vœu du secret", nv = 47, min = 30, te = "The Pledge of Secrecy", g = { "Orguignard Odipnoticus", "Oglethorpe Obnoticus", 1434, 27, 77.1 }, r = { "Orguignard Odipnoticus", "Oglethorpe Obnoticus", 1434, 27, 77.1 }, obj = "Rapporter Promesse écrite d'Oglethorpe", oe = "Bring Oglethorpe's Signed Pledge" }
D[3643] = { t = "Montrez votre travail", nv = 47, min = 30, te = "Show Your Work", av = 3642, g = { "Orguignard Odipnoticus", "Oglethorpe Obnoticus", 1434, 27, 77.1 }, r = { "Orguignard Odipnoticus", "Oglethorpe Obnoticus", 1434, 27, 77.1 }, obj = "Rapporter 6 × Tube en mithril ; Rapporter Lunette de précision ; Rapporter 2 × Leurre perfectionné", oe = "Bring 6 × Mithril Tube ; Bring Accurate Scope ; Bring 2 × Advanced Target Dummy" }
D[3721] = { t = "Un OOX rien que pour vous", nv = 50, min = 45, te = "An OOX of Your Own", g = { "Orguignard Odipnoticus", "Oglethorpe Obnoticus", 1434, 27, 77.1 }, r = { "Orguignard Odipnoticus", "Oglethorpe Obnoticus", 1434, 27, 77.1 } }
D[3741] = { t = "Le collier d'Hilary", nv = 15, min = 12, te = "Hilary's Necklace", g = { "Shawn", "Shawn", 1433, 24.2, 53.6 }, r = { "Nida", "Hilary", 1433, 24.2, 53.6 }, c = { 1433, 24.3, 54.3 }, obj = "Rapporter Collier d'Hilary", oe = "Bring Hilary's Necklace" }
D[3783] = { t = "Yéti ? Y es-tu ?", nv = 56, min = 52, te = "Are We There, Yeti?", g = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, r = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, c = { 1452, 44.9, 38.6 }, obj = "Rapporter 10 × Fourrure épaisse de yéti", oe = "Bring 10 × Thick Yeti Fur" }
D[3788] = { t = "La requête de Gentecime", nv = 50, min = 47, te = "Jonespyre's Request", av = 3785, g = { "Aubergiste Shyria", "Innkeeper Shyria", 1444, 30.6, 42.7 }, r = { "Quintis Gentecime", "Quintis Jonespyre", 1444, 30.6, 42.7 } }
D[3791] = { t = "Le Mystère des Fibres d'aurore", nv = 50, min = 47, te = "The Mystery of Morrowgrain", g = { "Quintis Gentecime", "Quintis Jonespyre", 1444, 30.6, 42.7 }, r = { "Quintis Gentecime", "Quintis Jonespyre", 1444, 30.6, 42.7 }, obj = "Rapporter 10 × Fibre d'aurore", oe = "Bring 10 × Morrowgrain" }
D[3821] = { t = "Le Rocher des Cognepeurs", nv = 52, min = 48, te = "Dreadmaul Rock", g = { "Thal'trak Fière-défense", "Thal'trak Proudtusk", 1427, 82, 36.7 }, r = { "Sha'ni Fière-défense", "Sha'ni Proudtusk", 1427, 82, 36.7 } }
D[3823] = { t = "Exterminer les Brûlentrailles", nv = 52, min = 48, te = "Extinguish the Firegut", g = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, r = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, c = { 1428, 78.8, 42.1 }, obj = "Vaincre 15 × Ogre-mage Brûlentrailles ; Vaincre 7 × Ogre Brûlentrailles ; Vaincre 7 × Brute Brûlentrailles", oe = "Kill 15 × Firegut Ogre Mage ; Kill 7 × Firegut Ogre ; Kill 7 × Firegut Brute" }
D[3824] = { t = "Le seigneur-brute Gor'tesh", nv = 53, min = 48, te = "Gor'tesh the Brute Lord", av = 3823, g = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, r = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, c = { 1428, 39.3, 55.3 }, obj = "Rapporter Tête coupée de Gor'tesh", oe = "Bring Gor'tesh's Lopped Off Head" }
D[3825] = { t = "Une tête d'ogre au bout d'une pique = une fête", nv = 53, min = 48, te = "Ogre Head On A Stick = Party", av = 3824, g = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, r = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, c = { 1428, 81, 46.8 }, obj = "Utiliser Planter la Tête de Gor'tesh sur Monticule de terre", oe = "Use Plant Gor'tesh Head on Soft Dirt Mound" }
D[3841] = { t = "Un orphelin à la recherche d'un foyer", nv = 47, min = 38, te = "An Orphan Looking For a Home", av = 2972, g = { "Kindal Tisselune", "Kindal Moonweaver", 1444, 65.9, 45.7 }, obj = "Rapporter Oeuf non-éclos de Fée fléchetteuse", oe = "Bring Unhatched Sprite Darter Egg" }
D[3842] = { t = "Une courte incubation", nv = 47, min = 38, te = "A Short Incubation", av = 3841, g = { "Quentin", "Quentin", 1441, 78.1, 77.1 }, r = { "Quentin", "Quentin", 1441, 78.1, 77.1 }, obj = "Rapporter 2 × Élixir de robustesse inférieure", oe = "Bring 2 × Elixir of Lesser Fortitude" }
D[3843] = { t = "Un tout nouveau membre dans la famille", nv = 47, min = 38, te = "The Newest Member of the Family", av = 3842, g = { "Quentin", "Quentin", 1441, 78.1, 77.1 }, obj = "Rapporter Oeuf fragile de Fée fléchetteuse", oe = "Bring Fragile Sprite Darter Egg" }
D[3844] = { t = "C'est un secret pour tout le monde", nv = 52, min = 47, te = "It's a Secret to Everybody", g = { "Une épave de radeau", "A Wrecked Raft", 1449, 63, 68.6 }, r = { "Un petit paquet", "A Small Pack", 1449, 63, 68.6 } }
D[3845] = { t = "C'est un secret pour tout le monde", nv = 52, min = 47, te = "It's a Secret to Everybody", av = 3844, g = { "Un petit paquet", "A Small Pack", 1449, 63, 68.6 }, r = { "Linken", "Linken", 1449, 44.7, 8.1 }, obj = "Rapporter Grande boussole ; Rapporter Carte enroulée ; Rapporter Clé à tête de lion", oe = "Bring Large Compass ; Bring Curled Map Parchment ; Bring Lion-headed Key" }
D[3881] = { t = "Le sauvetage de l'expédition", nv = 53, min = 48, te = "Expedition Salvation", g = { "Williden Marshal", "Williden Marshal", 1449, 44.7, 8.1 }, r = { "Williden Marshal", "Williden Marshal", 1449, 44.7, 8.1 }, c = { 1449, 68.5, 36.5 }, obj = "Rapporter Caisse de nourriture ; Rapporter Equipement de recherche", oe = "Bring Crate of Foodstuffs ; Bring Research Equipment" }
D[3882] = { t = "Faites rouler les os", nv = 51, min = 49, te = "Roll the Bones", g = { "Etincelle Minerien", "Spark Nilminer", 1449, 44.7, 8.1 }, r = { "Etincelle Minerien", "Spark Nilminer", 1449, 44.7, 8.1 }, c = { 1449, 33.5, 68 }, obj = "Rapporter 8 × Os de dinosaure", oe = "Bring 8 × Dinosaur Bone" }
D[3883] = { t = "Écologie étrangère", nv = 52, min = 48, te = "Alien Ecology", g = { "Hol'anyee Marshal", "Hol'anyee Marshal", 1449, 44.7, 8.1 }, r = { "Hol'anyee Marshal", "Hol'anyee Marshal", 1449, 44.7, 8.1 }, obj = "Rapporter Echantillon de paroi de la ruche", oe = "Bring Hive Wall Sample" }
D[3901] = { t = "Faites cliqueter les thorax !", nv = 3, min = 1, te = "Rattling the Rattlecages", av = 364, g = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, r = { "Prêtre des ombres Sarvis", "Shadow Priest Sarvis", 1420, 30.8, 66.2 }, c = { 1420, 33.3, 62.2 }, obj = "Vaincre 12 × Squelette Cliquethorax", oe = "Kill 12 × Rattlecage Skeleton" }
D[3902] = { t = "La chasse aux trésors", nv = 3, min = 2, te = "Scavenging Deathknell", av = 376, g = { "Nécrogarde Saltain", "Deathguard Saltain", 1420, 30.8, 66.2 }, r = { "Nécrogarde Saltain", "Deathguard Saltain", 1420, 30.8, 66.2 }, c = { 1420, 32.1, 63.5 }, obj = "Rapporter 6 × Fournitures de récupération", oe = "Bring 6 × Scavenged Goods" }
D[3903] = { t = "Milly Osworth", nv = 4, min = 2, av = 33, g = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, r = { "Milly Osworth", "Milly Osworth", 1429, 50.7, 39.3 } }
D[3904] = { t = "Les vendanges de Milly", nv = 4, min = 2, te = "Milly's Harvest", av = 3903, g = { "Milly Osworth", "Milly Osworth", 1429, 50.7, 39.3 }, r = { "Milly Osworth", "Milly Osworth", 1429, 50.7, 39.3 }, c = { 1429, 53.8, 49 }, obj = "Rapporter 8 × Récolte de Milly", oe = "Bring 8 × Milly's Harvest" }
D[3905] = { t = "Le manifeste des vendanges", nv = 4, min = 2, te = "Grape Manifest", av = 3904, g = { "Milly Osworth", "Milly Osworth", 1429, 50.7, 39.3 }, r = { "Frère Neals", "Brother Neals", 1429, 48.2, 42.9 }, obj = "Rapporter Manifeste des vendanges", oe = "Bring Grape Manifest" }
D[3908] = { t = "C'est un secret pour tout le monde", nv = 52, min = 47, te = "It's a Secret to Everybody", av = 3845, g = { "Linken", "Linken", 1449, 44.7, 8.1 }, obj = "Rapporter Epée d'entraînement de Linken", oe = "Bring Linken's Training Sword" }
D[3909] = { t = "L'élixir de Videre", nv = 52, min = 47, te = "The Videre Elixir", av = 3908, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, obj = "Rapporter Elixir de Videre", oe = "Bring Videre Elixir" }
D[3912] = { t = "Rendez-vous à la tombe", nv = 52, min = 47, te = "Meet at the Grave", av = 3909, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 } }
D[3913] = { t = "Une situation grave", nv = 52, min = 47, te = "A Grave Situation", av = 3912, g = { "Gaeriyan", "Gaeriyan", 1446, 53.9, 23.3 }, r = { "Une tombe ostentatoire", "A Conspicuous Gravestone", 1446, 50.2, 27.5 }, obj = "Rapporter Epée trempée de Linken", oe = "Bring Linken's Tempered Sword" }
D[3914] = { t = "L'épée de Linken", nv = 52, min = 47, te = "Linken's Sword", av = 3913, g = { "Une tombe ostentatoire", "A Conspicuous Gravestone", 1446, 50.2, 27.5 }, obj = "Rapporter Epée excellente de Linken", oe = "Bring Linken's Superior Sword" }
D[3921] = { t = "Wenikee Bakaboulon", nv = 14, min = 10, te = "Wenikee Boltbucket", av = 902, g = { "Krachevalve", "Sputtervalve", 1413, 62.3, 38.4 }, r = { "Wenikee Bakaboulon", "Wenikee Boltbucket", 1413, 52.4, 11.6 }, obj = "Rapporter Samophlange cassé", oe = "Bring Broken Samophlange" }
D[3922] = { t = "Les petites pièces", nv = 15, min = 10, te = "Nugget Slugs", av = 3921, g = { "Wenikee Bakaboulon", "Wenikee Boltbucket", 1413, 52.4, 11.6 }, r = { "Wenikee Bakaboulon", "Wenikee Boltbucket", 1413, 52.4, 11.6 }, c = { 1413, 56, 7.7 }, obj = "Rapporter 15 × Rondelle de métal", oe = "Bring 15 × Nugget Slug" }
D[3923] = { t = "Rilli Grassougob", nv = 18, min = 10, te = "Rilli Greasygob", av = 3922, g = { "Wenikee Bakaboulon", "Wenikee Boltbucket", 1413, 52.4, 11.6 }, obj = "Rapporter Samophlange cassé", oe = "Bring Broken and Battered Samophlange" }
D[3941] = { t = "Un gnome dans le besoin", nv = 52, min = 47, te = "A Gnome's Assistance", av = 3914, g = { "Linken", "Linken", 1449, 44.7, 8.1 }, r = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 } }
D[3942] = { t = "Les souvenirs de Linken", nv = 54, min = 47, te = "Linken's Memory", av = 3941, g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 } }
D[3961] = { t = "L'aventure de Linken", nv = 54, min = 47, te = "Linken's Adventure", av = 4005, g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, r = { "Linken", "Linken", 1449, 44.7, 8.1 }, obj = "Rapporter Totem en argent d'Aquementas", oe = "Bring Silver Totem of Aquementas" }
D[3962] = { t = "C'est dangereux d'y aller seul", nv = 56, min = 47, te = "It's Dangerous to Go Alone", av = 3961, g = { "Linken", "Linken", 1449, 44.7, 8.1 }, r = { "Linken", "Linken", 1449, 44.7, 8.1 }, c = { 1449, 49.4, 49.3 }, obj = "Rapporter Flamme dorée ; Rapporter Totem en argent d'Aquementas ; Vaincre Coursembrase", oe = "Bring Golden Flame ; Bring Silver Totem of Aquementas ; Kill Blazerunner" }
D[4005] = { t = "Aquementas", nv = 54, min = 47, av = 4084, g = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, obj = "Rapporter Totem en argent d'Aquementas", oe = "Bring Silver Totem of Aquementas" }
D[4021] = { t = "La contre-attaque !", nv = 20, min = 11, te = "Counterattack!", av = 852, g = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, r = { "Regthar Seuil-de-mort", "Regthar Deathgate", 1413, 45.3, 28.4 }, obj = "Rapporter Morceau de la bannière de Krom'zar", oe = "Bring Piece of Krom'zar's Banner" }
D[4022] = { t = "Un goût de flammes", nv = 54, min = 52, te = "A Taste of Flame", av = 3481, g = { "Cyrus Lerepenti", "Cyrus Therepentous", 1428, 95.1, 31.6 }, r = { "Cyrus Lerepenti", "Cyrus Therepentous", 1428, 95.1, 31.6 }, obj = "Rapporter Cuir de dragon noir", oe = "Bring Black Dragonflight Molt" }
D[4023] = { t = "Un goût de flammes", nv = 54, min = 52, te = "A Taste of Flame", g = { "Cyrus Lerepenti", "Cyrus Therepentous", 1428, 95.1, 31.6 }, r = { "Cyrus Lerepenti", "Cyrus Therepentous", 1428, 95.1, 31.6 }, obj = "Rapporter Cuir de dragon noir", oe = "Bring Black Dragonflight Molt" }
D[4061] = { t = "La révolte des machines", nv = 54, min = 52, te = "The Rise of the Machines", g = { "Hiérophante Theodora Mulvadania", "Hierophant Theodora Mulvadania", 1427, 82, 36.7 }, r = { "Hiérophante Theodora Mulvadania", "Hierophant Theodora Mulvadania", 1427, 82, 36.7 }, obj = "Rapporter 10 × Fragment d'élémentaire fracturé", oe = "Bring 10 × Fractured Elemental Shard" }
D[4062] = { t = "La révolte des machines", nv = 54, min = 52, te = "The Rise of the Machines", av = 4061, g = { "Hiérophante Theodora Mulvadania", "Hierophant Theodora Mulvadania", 1427, 82, 36.7 }, obj = "Rapporter Echantillon de Fragment d'élémentaire", oe = "Bring Elemental Shard Sample" }
D[4084] = { t = "Cœur d'argent", nv = 55, min = 47, te = "Silver Heart", av = 3942, g = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, r = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, c = { 1448, 56.6, 20.1 }, obj = "Rapporter 11 × Griffes argentées ; Rapporter Coeur d'Arbrefer", oe = "Bring 11 × Silvery Claws ; Bring Irontree Heart" }
D[4101] = { t = "Purifiez Gangrebois", nv = 55, min = 48, te = "Cleansing Felwood", g = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, r = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, c = { 1448, 56.8, 18.8 }, obj = "Rapporter 15 × Ambre de sang", oe = "Bring 15 × Blood Amber" }
D[4102] = { t = "Purifiez Gangrebois", nv = 55, min = 48, te = "Cleansing Felwood", g = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, r = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, c = { 1448, 56.8, 18.8 }, obj = "Rapporter 15 × Ambre de sang", oe = "Bring 15 × Blood Amber" }
D[4120] = { t = "La force de la corruption", nv = 52, min = 47, te = "The Strength of Corruption", g = { "Talo Sabot-de-ronce", "Talo Thornhoof", 1444, 74.4, 42.9 }, r = { "Talo Sabot-de-ronce", "Talo Thornhoof", 1444, 74.4, 42.9 }, obj = "Vaincre 12 × Grizzly de la griffe colérique ; Vaincre 12 × Ravageur Gangrepatte", oe = "Kill 12 × Angerclaw Grizzly ; Kill 12 × Felpaw Ravager" }
D[4124] = { t = "Le messager disparu", nv = 43, min = 40, te = "The Missing Courier", g = { "Latronicus Lancelune", "Latronicus Moonspear", 1444, 30.6, 42.7 }, r = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 } }
D[4125] = { t = "Le messager disparu", nv = 43, min = 40, te = "The Missing Courier", av = 4124, g = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 }, r = { "Épave de barque", "Wrecked Row Boat", 1444, 45.4, 65 } }
D[4127] = { t = "Débris de bateau", nv = 44, min = 40, te = "Boat Wreckage", av = 4125, g = { "Épave de barque", "Wrecked Row Boat", 1444, 45.4, 65 }, r = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 }, obj = "Rapporter Couteau de rebut", oe = "Bring Discarded Knife" }
D[4129] = { t = "Le couteau révélé", nv = 44, min = 40, te = "The Knife Revealed", av = 4127, g = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 }, r = { "Quintis Gentecime", "Quintis Jonespyre", 1444, 30.6, 42.7 }, obj = "Rapporter Couteau de rebut", oe = "Bring Discarded Knife" }
D[4130] = { t = "La lecture psychométrique", nv = 44, min = 40, te = "Psychometric Reading", av = 4129, g = { "Quintis Gentecime", "Quintis Jonespyre", 1444, 30.6, 42.7 }, r = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 } }
D[4131] = { t = "Les gnolls griffebois", nv = 44, min = 40, te = "The Woodpaw Gnolls", av = 4130, g = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 }, r = { "Grands sacs à dos en cuir", "Large Leather Backpacks", 1444, 73.3, 56.3 } }
D[4135] = { t = "Le gouffre Grouillant", nv = 46, min = 40, te = "The Writhing Deep", av = 4131, g = { "Grands sacs à dos en cuir", "Large Leather Backpacks", 1444, 73.3, 56.3 }, r = { "Alvéole de Zukk'ash", "Zukk'ash Pod", 1444, 72.1, 63.7 } }
D[4141] = { t = "Muigin et Larion", nv = 52, min = 47, te = "Muigin and Larion", g = { "Muigin", "Muigin", 1449, 44.7, 8.1 }, r = { "Muigin", "Muigin", 1449, 44.7, 8.1 }, c = { 1449, 66.7, 31.1 }, obj = "Rapporter 15 × Pétale-de-sang", oe = "Bring 15 × Bloodpetal" }
D[4142] = { t = "Visite à Gregan", nv = 52, min = 47, te = "A Visit to Gregan", av = 4141, g = { "Muigin", "Muigin", 1449, 44.7, 8.1 }, c = { 1449, 66.7, 31.1 }, obj = "Rapporter Pétale-de-sang", oe = "Bring Bloodpetal" }
D[4144] = { t = "Les pousses de Pétales-de-sang", nv = 53, min = 47, te = "Bloodpetal Sprouts", av = 4143, g = { "Muigin", "Muigin", 1449, 44.7, 8.1 }, r = { "Muigin", "Muigin", 1449, 44.7, 8.1 }, c = { 1449, 32.4, 44 }, obj = "Rapporter 3 × Pousse de Pétale-de-sang", oe = "Bring 3 × Bloodpetal Sprout" }
D[4145] = { t = "Larion et Muigin", nv = 52, min = 47, te = "Larion and Muigin", g = { "Larion", "Larion", 1449, 44.7, 8.1 }, r = { "Larion", "Larion", 1449, 44.7, 8.1 }, c = { 1449, 66.7, 31.1 }, obj = "Vaincre 5 × Flagellant Pétale-de-sang ; Vaincre 5 × Trappeur Pétale-de-sang ; Vaincre 5 × Ecorcheur Pétale-de-sang ; Vaincre 5 × Batteur Pétale-de-sang", oe = "Kill 5 × Bloodpetal Lasher ; Kill 5 × Bloodpetal Trapper ; Kill 5 × Bloodpetal Flayer ; Kill 5 × Bloodpetal Thresher" }
D[4147] = { t = "Atelier de Marvon", nv = 52, min = 47, te = "Marvon's Workshop", av = 4145, g = { "Larion", "Larion", 1449, 44.7, 8.1 } }
D[4161] = { t = "Une recette kaldorei", nv = 7, min = 1, te = "Recipe of the Kaldorei", g = { "Zarrin", "Zarrin", 1438, 56.1, 61.7 }, r = { "Zarrin", "Zarrin", 1438, 56.1, 61.7 }, c = { 1438, 64.1, 60.2 }, obj = "Rapporter 7 × Petite patte d'araignée", oe = "Bring 7 × Small Spider Leg" }
D[4182] = { t = "La menace des draconiens", nv = 54, min = 48, te = "Dragonkin Menace", g = { "Helendis Ruissecorne", "Helendis Riverhorn", 1428, 84.6, 68.7 }, r = { "Helendis Ruissecorne", "Helendis Riverhorn", 1428, 84.6, 68.7 }, c = { 1428, 80.1, 62.1 }, obj = "Vaincre 15 × Rejeton noir ; Vaincre 10 × Draconide noir ; Vaincre Drake noir ; Vaincre 4 × Wyrmide noir", oe = "Kill 15 × Black Broodling ; Kill 10 × Black Dragonspawn ; Kill Black Drake ; Kill 4 × Black Wyrmkin" }
D[4183] = { t = "Les véritables maîtres", nv = 54, min = 48, te = "The True Masters", av = 4182, g = { "Helendis Ruissecorne", "Helendis Riverhorn", 1428, 84.6, 68.7 }, obj = "Rapporter Lettre d'Helendis Riverhorn", oe = "Bring Helendis Riverhorn's Letter" }
D[4224] = { t = "Les véritables maîtres", nv = 54, min = 48, te = "The True Masters", av = 4223, g = { "Maréchal Maxwell", "Marshal Maxwell", 1428, 84.6, 68.7 }, r = { "Maréchal Maxwell", "Marshal Maxwell", 1428, 84.6, 68.7 } }
D[4243] = { t = "À la poursuite d'A-Mi 01", nv = 53, min = 48, te = "Chasing A-Me 01", g = { "Karna Songerrance", "Karna Remtravel", 1449, 46.4, 13.4 }, r = { "A-mi 01", "A-Me 01", 1449, 67.7, 16.8 } }
D[4244] = { t = "À la poursuite d'A-Mi 01", nv = 53, min = 48, te = "Chasing A-Me 01", av = 4243, g = { "A-mi 01", "A-Me 01", 1449, 67.7, 16.8 }, r = { "A-mi 01", "A-Me 01", 1449, 67.7, 16.8 }, obj = "Rapporter Caisse en mithril", oe = "Bring Mithril Casing" }
D[4245] = { t = "À la poursuite d'A-Mi 01", nv = 53, min = 48, te = "Chasing A-Me 01", av = 4244, g = { "A-mi 01", "A-Me 01", 1449, 67.7, 16.8 }, r = { "Karna Songerrance", "Karna Remtravel", 1449, 46.4, 13.4 } }
D[4265] = { t = "L'évasion de la ruche", nv = 46, min = 40, te = "Freed from the Hive", av = 4135, g = { "Alvéole de Zukk'ash", "Zukk'ash Pod", 1444, 72.1, 63.7 }, r = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 } }
D[4266] = { t = "Accueil d'un héros", nv = 46, min = 40, te = "A Hero's Welcome", av = 4265, g = { "Ginro Attisâtre", "Ginro Hearthkindle", 1444, 30.6, 42.7 }, r = { "Shandris Pennelune", "Shandris Feathermoon", 1444, 30.6, 42.7 } }
D[4267] = { t = "L'ascension des silithides", nv = 46, min = 40, te = "Rise of the Silithid", av = 4266, g = { "Shandris Pennelune", "Shandris Feathermoon", 1444, 30.6, 42.7 }, obj = "Rapporter Rapport de Raschal", oe = "Bring Raschal's Report" }
D[4283] = { t = "CINQUANTE ! OUI !", nv = 56, min = 50, te = "FIFTY! YEP!", g = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, r = { "Oralius", "Oralius", 1428, 84.6, 68.7 }, c = { 1428, 48.3, 55.9 }, obj = "Rapporter 50 × Médaillon de Rochenoire", oe = "Bring 50 × Blackrock Medallion" }
D[4284] = { t = "Cristaux de puissance", nv = 53, min = 47, te = "Crystals of Power", g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, r = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, c = { 1449, 51.7, 14.4 }, obj = "Rapporter 7 × Cristal de puissance rouge ; Rapporter 7 × Cristal de puissance jaune ; Rapporter 7 × Cristal de puissance vert ; Rapporter 7 × Cristal de puissance bleu", oe = "Bring 7 × Red Power Crystal ; Bring 7 × Yellow Power Crystal ; Bring 7 × Green Power Crystal ; Bring 7 × Blue Power Crystal" }
D[4285] = { t = "Le Pylône nord", nv = 53, min = 47, te = "The Northern Pylon", av = 4284, g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, r = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 } }
D[4287] = { t = "Le Pylône est", nv = 53, min = 47, te = "The Eastern Pylon", av = 4284, g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, r = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 } }
D[4288] = { t = "Le Pylône ouest", nv = 53, min = 47, te = "The Western Pylon", av = 4284, g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, r = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 } }
D[4289] = { t = "Les gorilles d'Un'Goro", nv = 55, min = 47, te = "The Apes of Un'Goro", g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, c = { 1449, 65.6, 16.9 }, obj = "Rapporter 2 × Peau de gorille d'Un'Goro ; Rapporter 2 × Peau de Marteleur d'Un'Goro ; Rapporter 2 × Peau de Foudroyeur d'Un'Goro", oe = "Bring 2 × Un'Goro Gorilla Pelt ; Bring 2 × Un'Goro Stomper Pelt ; Bring 2 × Un'Goro Thunderer Pelt" }
D[4290] = { t = "La nourriture de Lar'korwi", nv = 53, min = 48, te = "The Fare of Lar'korwi", g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, c = { 1449, 68.7, 56.7 }, obj = "Rapporter Morceau de carcasse d'un battrodon", oe = "Bring Piece of Threshadon Carcass" }
D[4291] = { t = "Un parfum pour Lar'korwi", nv = 53, min = 48, te = "The Scent of Lar'korwi", av = 4290, g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, obj = "Rapporter 2 × Glande de phéromone de ravasaure", oe = "Bring 2 × Ravasaur Pheromone Gland" }
D[4292] = { t = "Un appât pour Lar'korwi", nv = 56, min = 48, te = "The Bait for Lar'korwi", av = 4291, g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, obj = "Rapporter Tête de Lar'korwi", oe = "Bring Lar'korwi's Head" }
D[4296] = { t = "La tablette des Sept", nv = 50, min = 50, te = "Tablet of the Seven", g = { "Maxwort Uberbrille", "Maxwort Uberglint", 1428, 65.2, 23.9 }, r = { "Maxwort Uberbrille", "Maxwort Uberglint", 1428, 65.2, 23.9 }, obj = "Rapporter Transcription de la tablette", oe = "Bring Tablet Transcript" }
D[4297] = { t = "Nourriture pour bébé", nv = 47, min = 38, te = "Food for Baby", av = 3843, g = { "Agnar Domptebêtes", "Agnar Beastamer", 1425, 11.8, 46.8 }, r = { "Agnar Domptebêtes", "Agnar Beastamer", 1425, 11.8, 46.8 }, c = { 1425, 69.8, 53.5 }, obj = "Rapporter 5 × Flanc de Traqueur Crins-d'argent", oe = "Bring 5 × Silvermane Stalker Flank" }
D[4298] = { t = "L'amour d'un parent", nv = 48, min = 37, te = "Becoming a Parent", av = 4297, g = { "Agnar Domptebêtes", "Agnar Beastamer", 1425, 11.8, 46.8 }, r = { "Agnar Domptebêtes", "Agnar Beastamer", 1425, 11.8, 46.8 } }
D[4301] = { t = "Le puissant U'cha", nv = 55, min = 50, te = "The Mighty U'cha", av = 4289, g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, c = { 1449, 68.1, 12.6 }, obj = "Rapporter Peau d'U'cha", oe = "Bring U'cha's Pelt" }
D[4321] = { t = "Ceci explique cela", nv = 53, min = 47, te = "Making Sense of It", g = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 }, r = { "J.D. Collie", "J.D. Collie", 1449, 41.9, 2.7 } }
D[4402] = { t = "Surprise aux pommes de cactus de Galgar", nv = 3, min = 1, te = "Galgar's Cactus Apple Surprise", av = 788, g = { "Galgar", "Galgar", 1411, 42.1, 68.3 }, r = { "Galgar", "Galgar", 1411, 42.1, 68.3 }, c = { 1411, 43.5, 63.5 }, obj = "Rapporter 10 × Pomme de cactus", oe = "Bring 10 × Cactus Apple" }
D[4421] = { t = "La corruption des Jadefeu", nv = 54, min = 49, te = "The Corruption of the Jadefire", g = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, r = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, c = { 1448, 41.9, 85.4 }, obj = "Vaincre 11 × Gangrelige Jadefeu ; Vaincre 9 × Traqueur des ombres Jadefeu ; Vaincre 9 × Voleur Jadefeu ; Vaincre Xavathras", oe = "Kill 11 × Jadefire Felsworn ; Kill 9 × Jadefire Shadowstalker ; Kill 9 × Jadefire Rogue ; Kill Xavathras" }
D[4441] = { t = "Anciens corrompus", nv = 54, min = 49, te = "Felbound Ancients", av = 939, g = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, r = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, obj = "Rapporter Fiole d'eau bénite", oe = "Bring Vial of Blessed Water" }
D[4442] = { t = "Purifié !", nv = 54, min = 49, te = "Purified!", av = 4441, g = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, r = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 } }
D[4449] = { t = "Piégé !", nv = 45, min = 43, te = "Caught!", g = { "Toilettes en bois", "Wooden Outhouse", 1427, 63.9, 61 }, r = { "Toilettes en bois", "Wooden Outhouse", 1427, 63.9, 61 }, c = { 1427, 69.3, 33.5 }, obj = "Rapporter 15 × Etoffe de soie ; Vaincre 8 × Géologue Sombrefer", oe = "Bring 15 × Silk Cloth ; Kill 8 × Dark Iron Geologist" }
D[4450] = { t = "Grand livre de Tanaris", nv = 46, min = 43, te = "Ledger from Tanaris", av = 4449, g = { "Toilettes en bois", "Wooden Outhouse", 1427, 63.9, 61 }, c = { 1427, 64.6, 50.9 }, obj = "Rapporter Livre de Goodsteel ; Rapporter 20 × Patte cristalline solide ; Rapporter Paquet en retard de livraison ; Rapporter Flamberge de Goodsteel", oe = "Bring Goodsteel Ledger ; Bring 20 × Solid Crystal Leg Shaft ; Bring Overdue Package ; Bring Goodsteel's Balanced Flameberge" }
D[4487] = { t = "Invoquer un Palefroi corrompu", nv = 40, min = 40, te = "Summon Felsteed", g = { "Eglantin", "Briarthorn", 1455, 50.3, 5.7 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 } }
D[4490] = { t = "Invoquer un Palefroi corrompu", nv = 40, min = 40, te = "Summon Felsteed", g = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 }, r = { "Strahad Farsan", "Strahad Farsan", 1411, 33.3, 73.6 } }
D[4491] = { t = "Un peu d'aide de mes amis", nv = 55, min = 50, te = "A Little Help From My Friends", av = 4492, g = { "Ringo", "Ringo", 1449, 51.9, 49.8 }, r = { "Spraggle Frock", "Spraggle Frock", 1449, 44.7, 8.1 } }
D[4492] = { t = "Perdu !", nv = 55, min = 50, te = "Lost!", g = { "Spraggle Frock", "Spraggle Frock", 1449, 44.7, 8.1 }, r = { "Ringo", "Ringo", 1449, 51.9, 49.8 }, obj = "Rapporter Gourde de Spraggle", oe = "Bring Spraggle's Canteen" }
D[4495] = { t = "Un bon ami", nv = 4, min = 2, te = "A Good Friend", g = { "Dirania Brillargent", "Dirania Silvershine", 1438, 58.7, 44.3 }, r = { "Iverron", "Iverron", 1438, 54.6, 33 } }
D[4496] = { t = "Fiasco dans la jungle", nv = 53, min = 50, te = "Bungle in the Jungle", g = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, r = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, c = { 1446, 27.5, 42.7 }, obj = "Rapporter Glande olfactive Gorishi ; Rapporter 5 × Humus d'Un'Goro", oe = "Bring Gorishi Scent Gland ; Bring 5 × Un'Goro Soil" }
D[4501] = { t = "Attention aux pterreurdactyles", nv = 55, min = 49, te = "Beware of Pterrordax", g = { "Attention aux pterreurdactyles", "Beware of Pterrordax", 1449, 44.7, 8.1 }, r = { "Spraggle Frock", "Spraggle Frock", 1449, 44.7, 8.1 }, c = { 1449, 26, 62.4 }, obj = "Vaincre 10 × Pterreurdactyle ; Vaincre 15 × Pterreurdactyle frénétique", oe = "Kill 10 × Pterrordax ; Kill 15 × Frenzied Pterrordax" }
D[4503] = { t = "La machine volante de Shizzle", nv = 51, min = 49, te = "Shizzle's Flyer", g = { "Shizzle", "Shizzle", 1449, 44.7, 8.1 }, r = { "Shizzle", "Shizzle", 1449, 44.7, 8.1 }, c = { 1449, 48.9, 65.3 }, obj = "Rapporter 8 × Ecaille étoilée de dimeurtrodon ; Rapporter 8 × Ecaille étoilée de pterreurdactyle", oe = "Bring 8 × Webbed Diemetradon Scale ; Bring 8 × Webbed Pterrordax Scale" }
D[4504] = { t = "Ultra collant", nv = 54, min = 48, te = "Super Sticky", g = { "Tran'rek", "Tran'rek", 1446, 50.2, 27.5 }, r = { "Tran'rek", "Tran'rek", 1446, 50.2, 27.5 }, obj = "Rapporter 12 × Goudron ultra collant", oe = "Bring 12 × Super Sticky Tar" }
D[4505] = { t = "Puits de la corruption", nv = 54, min = 49, te = "Well of Corruption", g = { "Winna Hazzard", "Winna Hazzard", 1448, 34.2, 52.3 }, r = { "Winna Hazzard", "Winna Hazzard", 1448, 34.2, 52.3 }, obj = "Rapporter Flacon rempli", oe = "Bring Filled Flasket" }
D[4506] = { t = "Sabres corrompus", nv = 54, min = 49, te = "Corrupted Sabers", av = 4505, g = { "Winna Hazzard", "Winna Hazzard", 1448, 34.2, 52.3 }, r = { "Winna Hazzard", "Winna Hazzard", 1448, 34.2, 52.3 } }
D[4507] = { t = "Le pion prend la reine", nv = 54, min = 50, te = "Pawn Captures Queen", av = 4496, g = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, r = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, obj = "Rapporter Cerveau de Reine Gorishi", oe = "Bring Gorishi Queen Brain" }
D[4508] = { t = "Le calme avant la tempête", nv = 54, min = 50, te = "Calm Before the Storm", av = 4507, g = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, obj = "Rapporter Rapport de Pestlezugg sur Un'Goro", oe = "Bring Pestlezugg's Un'Goro Report" }
D[4509] = { t = "Le calme avant la tempête", nv = 54, min = 50, te = "Calm Before the Storm", av = 4507, g = { "Alchimiste Pilonzugg", "Alchemist Pestlezugg", 1446, 50.2, 27.5 }, obj = "Rapporter Rapport de Pestlezugg sur Un'Goro", oe = "Bring Pestlezugg's Un'Goro Report" }
D[4521] = { t = "Gardiens sauvages", nv = 56, min = 52, te = "Wild Guardians", g = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, r = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, obj = "Vaincre 15 × Chouettard déchaîné ; Vaincre 15 × Chouettard éreinté", oe = "Kill 15 × Raging Owlbeast ; Kill 15 × Ragged Owlbeast" }
D[4542] = { t = "Un message pour le poste de Librevent", nv = 25, min = 23, te = "Message to Freewind Post", g = { "Brave Corne-de-lune", "Brave Moonhorn", 1441, 32.2, 22.2 }, r = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, obj = "Rapporter Message urgent", oe = "Bring Urgent Message" }
D[4581] = { t = "Kayneth Mortebrise", nv = 29, min = 24, te = "Kayneth Stillwind", g = { "Shindrell Prestefeu", "Shindrell Swiftfire", 1440, 36.6, 49.6 }, r = { "Kayneth Mortebrise", "Kayneth Stillwind", 1440, 85.2, 44.7 }, obj = "Rapporter Note de Shindrell", oe = "Bring Shindrell's Note" }
D[4641] = { t = "Votre place en ce monde", nv = 1, min = 1, te = "Your Place In The World", g = { "Kaltunk", "Kaltunk", 1411, 42.1, 68.3 }, r = { "Gornek", "Gornek", 1411, 42.1, 68.3 } }
D[4681] = { t = "Échouage", nv = 14, min = 11, te = "Washed Ashore", av = 3524, g = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, obj = "Rapporter Restes de tortue de mer", oe = "Bring Sea Turtle Remains" }
D[4721] = { t = "Les gardiens sauvages", nv = 59, min = 52, te = "Wild Guardians", av = 4741, g = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, r = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, obj = "Vaincre 10 × Chouettard berserk", oe = "Kill 10 × Berserk Owlbeast" }
D[4722] = { t = "La tortue de mer échouée", nv = 13, min = 11, te = "Beached Sea Turtle", av = 4681, g = { "Tortue de mer échouée", "Beached Sea Turtle", 1439, 37.1, 62.2 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, obj = "Rapporter Restes de tortue de mer", oe = "Bring Sea Turtle Remains" }
D[4723] = { t = "La créature marine échouée", nv = 13, min = 11, te = "Beached Sea Creature", av = 4681, g = { "Beached Sea Creature", "Beached Sea Creature", 1439, 42, 28.6 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, c = { 1439, 36.4, 50.9 }, obj = "Rapporter Os de créature marine", oe = "Bring Sea Creature Bones" }
D[4725] = { t = "La tortue de mer échouée", nv = 15, min = 12, te = "Beached Sea Turtle", av = 4681, g = { "Beached Sea Turtle", "Beached Sea Turtle", 1439, 44.2, 20.6 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, obj = "Rapporter Boîte aux marques étranges", oe = "Bring Strangely Marked Box" }
D[4726] = { t = "L'essence de rejeton", nv = 52, min = 50, te = "Broodling Essence", g = { "Brikolette Toutevapeur", "Tinkee Steamboil", 1428, 65.2, 23.9 }, r = { "Brikolette Toutevapeur", "Tinkee Steamboil", 1428, 65.2, 23.9 }, obj = "Rapporter 8 × Essence de Rejeton ; Rapporter Draco-Incarcinatrix 900", oe = "Bring 8 × Broodling Essence ; Bring Draco-Incarcinatrix 900" }
D[4727] = { t = "La tortue de mer échouée", nv = 15, min = 12, te = "Beached Sea Turtle", av = 4681, g = { "Tortue de mer échouée", "Beached Sea Turtle", 1439, 53.1, 18.1 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, obj = "Rapporter Restes de tortue de mer", oe = "Bring Sea Turtle Remains" }
D[4728] = { t = "La créature marine échouée", nv = 14, min = 12, te = "Beached Sea Creature", av = 4681, g = { "Beached Sea Creature", "Beached Sea Creature", 1439, 36, 70.9 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, c = { 1439, 36.4, 50.9 }, obj = "Rapporter Os de créature marine", oe = "Bring Sea Creature Bones" }
D[4730] = { t = "La créature marine échouée", nv = 16, min = 12, te = "Beached Sea Creature", av = 4681, g = { "Créature marine échouée", "Beached Sea Creature", 1439, 32.7, 80.8 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, c = { 1439, 36.4, 50.9 }, obj = "Rapporter Os de créature marine", oe = "Bring Sea Creature Bones" }
D[4731] = { t = "La tortue de mer échouée", nv = 19, min = 13, te = "Beached Sea Turtle", av = 4681, g = { "Beached Sea Turtle", "Beached Sea Turtle", 1439, 32.7, 80.8 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, obj = "Rapporter Boîte aux marques étranges", oe = "Bring Strangely Marked Box" }
D[4732] = { t = "La tortue de mer échouée", nv = 19, min = 13, te = "Beached Sea Turtle", av = 4681, g = { "Beached Sea Turtle", "Beached Sea Turtle", 1439, 31.2, 85.6 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, obj = "Rapporter Restes de tortue de mer", oe = "Bring Sea Turtle Remains" }
D[4733] = { t = "La créature marine échouée", nv = 19, min = 13, te = "Beached Sea Creature", av = 4681, g = { "Beached Sea Creature", "Beached Sea Creature", 1439, 31.2, 85.6 }, r = { "Gwennyth Bly'Leggonde", "Gwennyth Bly'Leggonde", 1439, 37.4, 41.8 }, c = { 1439, 36.4, 50.9 }, obj = "Rapporter Os de créature marine", oe = "Bring Sea Creature Bones" }
D[4736] = { t = "À la recherche de Menara Taillevide", nv = 31, min = 31, te = "In Search of Menara Voidrender", g = { "Eglantin", "Briarthorn", 1455, 50.3, 5.7 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4737] = { t = "À la recherche de Menara Taillevide", nv = 31, min = 31, te = "In Search of Menara Voidrender", g = { "Zevrost", "Zevrost", 1454, 48.5, 45.4 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4740] = { t = "On recherche : Fondeboue !", nv = 18, min = 15, te = "WANTED: Murkdeep!", g = { "WANTED: Murkdeep!", "WANTED: Murkdeep!", 1439, 37.4, 41.8 }, r = { "Sentinelle Glynda Nal'Shea", "Sentinel Glynda Nal'Shea", 1439, 37.4, 41.8 }, obj = "Vaincre Fondeboue", oe = "Kill Murkdeep" }
D[4741] = { t = "Les gardiens sauvages", nv = 58, min = 52, te = "Wild Guardians", av = 4521, g = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, r = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, obj = "Vaincre 13 × Chouettard lunaire", oe = "Kill 13 × Moontouched Owlbeast" }
D[4761] = { t = "Thundris Tissevent", nv = 15, min = 11, te = "Thundris Windweaver", av = 984, g = { "Terenthis", "Terenthis", 1439, 37.4, 41.8 }, r = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 } }
D[4762] = { t = "La Bondissante", nv = 15, min = 11, te = "The Cliffspring River", av = 4761, g = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, r = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, obj = "Rapporter Prélèvement de la Bondissante", oe = "Bring Cliffspring River Sample" }
D[4763] = { t = "La corruption des Noirbois", nv = 18, min = 15, te = "The Blackwood Corrupted", av = 4762, g = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, r = { "Thundris Tissevent", "Thundris Windweaver", 1439, 37.4, 41.8 }, obj = "Rapporter Talisman de corruption", oe = "Bring Talisman of Corruption" }
D[4765] = { t = "La livraison à Bellornière", nv = 60, min = 57, te = "Delivery to Ridgewell", av = 4764, g = { "Mayara Luisaile", "Mayara Brightwing", 1428, 84.6, 68.7 }, obj = "Rapporter Caisse de Ridgewell", oe = "Bring Ridgewell's Crate" }
D[4767] = { t = "Le coursier du vent", nv = 29, min = 25, te = "Wind Rider", g = { "Elu", "Elu", 1441, 46.1, 51.7 }, r = { "Elu", "Elu", 1441, 46.1, 51.7 }, c = { 1441, 14.4, 39 }, obj = "Rapporter 10 × Oeuf de wyverne de Haut-perchoir", oe = "Bring 10 × Highperch Wyvern Egg" }
D[4770] = { t = "Vers le pays natal", nv = 29, min = 25, te = "Homeward Bound", g = { "Pao'ka Montagne-agile", "Pao'ka Swiftmountain", 1441, 17.9, 40.6 }, r = { "Motega Crin-de-feu", "Motega Firemane", 1441, 21.5, 32.3 } }
D[4781] = { t = "Les composants de la robe sanglante dorée enchantée", nv = 34, min = 31, te = "Components for the Enchanted Gold Bloodrobe", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Xizk Beaupiqué", "Xizk Goodstitch", 1434, 28.7, 76.9 }, obj = "Rapporter Barre d'or", oe = "Bring Gold Bar" }
D[4782] = { t = "Les composants de la robe sanglante dorée enchantée", nv = 34, min = 31, te = "Components for the Enchanted Gold Bloodrobe", av = 4781, g = { "Xizk Beaupiqué", "Xizk Goodstitch", 1434, 27, 77.1 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4783] = { t = "Les composants de la robe sanglante dorée enchantée", nv = 37, min = 31, te = "Components for the Enchanted Gold Bloodrobe", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, obj = "Rapporter 10 × Fiole de sang de Fielfurie ; Rapporter Pierre d'Infernal inférieure", oe = "Bring 10 × Vial of Hatefury Blood ; Bring Lesser Infernal Stone" }
D[4784] = { t = "Les composants de la robe sanglante dorée enchantée", nv = 37, min = 31, te = "Components for the Enchanted Gold Bloodrobe", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, obj = "Rapporter Fil d'or fin ; Rapporter 2 × Charbon ardent ; Rapporter Fragment d'âme", oe = "Bring Fine Gold Thread ; Bring 2 × Smoldering Coal ; Bring Soul Shard" }
D[4786] = { t = "La Robe terminée", nv = 38, min = 31, te = "The Completed Robe", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4787] = { t = "L'œuf antique", nv = 50, min = 40, te = "The Ancient Egg", av = 3527, g = { "Yeh'kinya", "Yeh'kinya", 1446, 66.6, 25.7 }, r = { "Yeh'kinya", "Yeh'kinya", 1446, 66.6, 25.7 }, obj = "Rapporter Oeuf antique", oe = "Bring Ancient Egg" }
D[4808] = { t = "Felnok Ressordacier", nv = 54, min = 50, te = "Felnok Steelspring", av = 4726, g = { "Brikolette Toutevapeur", "Tinkee Steamboil", 1428, 65.2, 23.9 }, obj = "Rapporter Lettre de Tinkee", oe = "Bring Tinkee's Letter" }
D[4809] = { t = "Cornes de Noroît", nv = 54, min = 50, te = "Chillwind Horns", av = 4808, g = { "Felnok Ressordacier", "Felnok Steelspring", 1452, 61.9, 38.3 }, r = { "Felnok Ressordacier", "Felnok Steelspring", 1452, 61.9, 38.3 }, c = { 1452, 57.5, 42.6 }, obj = "Rapporter 8 × Corne intacte de Noroît", oe = "Bring 8 × Uncracked Chillwind Horn" }
D[4810] = { t = "Retourner voir Brikolette", nv = 54, min = 50, te = "Return to Tinkee", av = 4809, g = { "Felnok Ressordacier", "Felnok Steelspring", 1452, 61.9, 38.3 }, obj = "Rapporter Paquet de Felnok", oe = "Bring Felnok's Package" }
D[4811] = { t = "Le cristal rouge", nv = 14, min = 12, te = "The Red Crystal", g = { "Sentinelle Glynda Nal'Shea", "Sentinel Glynda Nal'Shea", 1439, 37.4, 41.8 }, r = { "Sentinelle Glynda Nal'Shea", "Sentinel Glynda Nal'Shea", 1439, 37.4, 41.8 } }
D[4812] = { t = "Comme l'eau tombe en cascade", nv = 14, min = 12, te = "As Water Cascades", av = 4811, g = { "Sentinelle Glynda Nal'Shea", "Sentinel Glynda Nal'Shea", 1439, 37.4, 41.8 }, r = { "Mystérieux cristal rouge", "Mysterious Red Crystal", 1439, 47.3, 48.7 }, obj = "Rapporter Tube d'eau du Puits de lune", oe = "Bring Moonwell Water Tube" }
D[4813] = { t = "Les fragments à l'intérieur", nv = 14, min = 12, te = "The Fragments Within", av = 4812, g = { "Mystérieux cristal rouge", "Mysterious Red Crystal", 1439, 47.3, 48.7 }, r = { "Sentinelle Glynda Nal'Shea", "Sentinel Glynda Nal'Shea", 1439, 37.4, 41.8 } }
D[4821] = { t = "L’œuf étrange", nv = 26, min = 24, te = "Alien Egg", g = { "Hagar Sabot-de-foudre", "Hagar Lightninghoof", 1441, 46.1, 51.7 }, r = { "Hagar Sabot-de-foudre", "Hagar Lightninghoof", 1441, 46.1, 51.7 }, c = { 1441, 54.4, 52.8 }, obj = "Rapporter Oeuf étrange", oe = "Bring Alien Egg" }
D[4841] = { t = "Pacifier les centaures", nv = 25, min = 23, te = "Pacify the Centaur", av = 4542, g = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, r = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, obj = "Vaincre 12 × Eclaireur galak ; Vaincre 10 × Querelleur galak ; Vaincre 6 × Chasse-vent galak", oe = "Kill 12 × Galak Scout ; Kill 10 × Galak Wrangler ; Kill 6 × Galak Windchaser" }
D[4842] = { t = "Sources étranges", nv = 56, min = 51, te = "Strange Sources", av = 980, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 } }
D[4861] = { t = "Les Indomptables enragés", nv = 59, min = 53, te = "Enraged Wildkin", g = { "Jaron Sculptepierre", "Jaron Stoneshaper", 1452, 52.1, 30.4 }, r = { "Caisse endommagée", "Damaged Crate", 1452, 59, 59.8 } }
D[4863] = { t = "Les Indomptables enragés", nv = 59, min = 53, te = "Enraged Wildkin", av = 4861, g = { "Caisse endommagée", "Damaged Crate", 1452, 59, 59.8 }, r = { "Chariot de Jaron", "Jaron's Wagon", 1452, 59, 59.8 } }
D[4864] = { t = "Les Indomptables enragés", nv = 59, min = 53, te = "Enraged Wildkin", av = 4863, g = { "Chariot de Jaron", "Jaron's Wagon", 1452, 59, 59.8 }, r = { "Jaron Sculptepierre", "Jaron Stoneshaper", 1452, 52.1, 30.4 }, c = { 1452, 64.9, 21.4 }, obj = "Rapporter Fournitures de Jaron ; Rapporter Amulette de la plume bleue", oe = "Bring Jaron's Supplies ; Bring Blue-feathered Amulet" }
D[4865] = { t = "Serpent sauvage", nv = 26, min = 24, te = "Serpent Wild", av = 4821, g = { "Hagar Sabot-de-foudre", "Hagar Lightninghoof", 1441, 46.1, 51.7 }, r = { "Motega Crin-de-feu", "Motega Firemane", 1441, 21.5, 32.3 } }
D[4883] = { t = "Secrets gardés", nv = 59, min = 52, te = "Guarding Secrets", av = 4882, g = { "Trull Faillemort", "Trull Failbane", 1448, 34.2, 52.3 }, obj = "Rapporter Collier de plumes bleues", oe = "Bring Blue-feathered Necklace" }
D[4901] = { t = "Les gardiens de l'autel", nv = 59, min = 52, te = "Guardians of the Altar", av = 979, g = { "Ranshalla", "Ranshalla", 1452, 63.1, 59.5 } }
D[4904] = { t = "Libre, enfin !", nv = 29, min = 25, te = "Free at Last", g = { "Lakota Chant-du-vent", "Lakota Windsong", 1441, 37.9, 26.4 }, r = { "Thalia Peau-d'ambre", "Thalia Amberhide", 1441, 46.1, 51.7 } }
D[4906] = { t = "Plus de corruption", nv = 54, min = 49, te = "Further Corruption", av = 4421, g = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, r = { "Eridan Ventebleu", "Eridan Bluewind", 1448, 51.3, 81.5 }, c = { 1448, 42, 18.1 }, obj = "Vaincre 8 × Implorateur de l'enfer Jadefeu ; Vaincre 8 × Traître Jadefeu ; Vaincre 8 × Entourloupeur Jadefeu ; Vaincre Xavaric", oe = "Kill 8 × Jadefire Hellcaller ; Kill 8 × Jadefire Betrayer ; Kill 8 × Jadefire Trickster ; Kill Xavaric" }
D[4921] = { t = "Portée disparue", nv = 20, min = 14, te = "Lost in Battle", g = { "Mankrik", "Mankrik", 1413, 52.2, 31 }, r = { "Mankrik", "Mankrik", 1413, 52.2, 31 }, c = { 1413, 49.3, 50.3 }, obj = "Vaincre Cadavre battu", oe = "Kill Beaten Corpse" }
D[4961] = { t = "La purification de l'Orbe d'Orahil", nv = 40, min = 35, te = "Cleansing of the Orb of Orahil", av = 1799, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, r = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Vaincre Démon de l'Orbe", oe = "Kill Demon of the Orb" }
D[4962] = { t = "Un éclat de gangrechien", nv = 40, min = 35, te = "Shard of a Felhound", g = { "Acolyte Wytula", "Acolyte Wytula", 1411, 33.3, 73.2 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, obj = "Rapporter Rubis de Felhas ; Rapporter Esprit de gangrechien emprisonné", oe = "Bring Felhas Ruby ; Bring Imprisoned Felhound Spirit" }
D[4963] = { t = "Un éclat d'infernal", nv = 40, min = 35, te = "Shard of an Infernal", g = { "Acolyte Magaz", "Acolyte Magaz", 1411, 33.2, 73.1 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, obj = "Rapporter Emeraude d'Infus ; Rapporter Esprit infernal emprisonné", oe = "Bring Infus Emerald ; Bring Imprisoned Infernal Spirit" }
D[4964] = { t = "L'Orbe complet de Dar'Orahil", nv = 40, min = 35, te = "The Completed Orb of Dar'Orahil", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4965] = { t = "Connaissance de l'Orbe d'Orahil", nv = 35, min = 35, te = "Knowledge of the Orb of Orahil", g = { "Eglantin", "Briarthorn", 1455, 50.3, 5.7 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4966] = { t = "Protéger Kanati Nuage-gris", nv = 28, min = 23, te = "Protect Kanati Greycloud", av = 4881, g = { "Kanati Nuage-gris", "Kanati Greycloud", 1441, 21.5, 32.3 }, r = { "Kanati Nuage-gris", "Kanati Greycloud", 1441, 21.5, 32.3 } }
D[4968] = { t = "Connaissance de l'Orbe d'Orahil", nv = 35, min = 35, te = "Knowledge of the Orb of Orahil", g = { "Demisette Cloyce", "Demisette Cloyce", 1453, 39.2, 85 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4971] = { t = "Une question de temps", nv = 56, min = 53, te = "A Matter of Time", g = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, r = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, obj = "Rapporter Déplaceur temporel ; Vaincre 10 × Parasite temporel", oe = "Bring Temporal Displacer ; Kill 10 × Temporal Parasite" }
D[4972] = { t = "Arrêt du temps", nv = 56, min = 53, te = "Counting Out Time", av = 4971, g = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, r = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, c = { 1422, 43.3, 69.6 }, obj = "Rapporter 5 × Montre d'Andorhal", oe = "Bring 5 × Andorhal Watch" }
D[4975] = { t = "L'Orbe complet de Noh'Orahil", nv = 40, min = 35, te = "The Completed Orb of Noh'Orahil", g = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 }, r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4976] = { t = "Rapporter l’Orbe purifié", nv = 40, min = 35, te = "Returning the Cleansed Orb", av = 4961, g = { "Tabetha", "Tabetha", 1445, 46.1, 57.1 }, obj = "Rapporter Orbe infernal purifié", oe = "Bring Cleansed Infernal Orb", r = { "Menara Taillevide", "Menara Voidrender", 1411, 33.1, 73.5 } }
D[4984] = { t = "La faune et la flore souffrent aussi", nv = 54, min = 51, te = "The Wildlife Suffers Too", g = { "Mulgris Rivière-profonde", "Mulgris Deepriver", 1422, 53.7, 64.7 }, r = { "Mulgris Rivière-profonde", "Mulgris Deepriver", 1422, 53.7, 64.7 }, obj = "Vaincre 8 × Loup malade", oe = "Kill 8 × Diseased Wolf" }
D[4985] = { t = "La faune et la flore souffrent aussi", nv = 56, min = 51, te = "The Wildlife Suffers Too", av = 4984, g = { "Mulgris Rivière-profonde", "Mulgris Deepriver", 1422, 53.7, 64.7 }, r = { "Mulgris Rivière-profonde", "Mulgris Deepriver", 1422, 53.7, 64.7 }, obj = "Vaincre 8 × Grizzly malade", oe = "Kill 8 × Diseased Grizzly" }
D[4986] = { t = "La branche de chêne glyphée", nv = 56, min = 51, te = "Glyphed Oaken Branch", av = 4985, g = { "Mulgris Rivière-profonde", "Mulgris Deepriver", 1422, 53.7, 64.7 }, obj = "Rapporter Branche de chêne glyphée", oe = "Bring Glyphed Oaken Branch" }
D[4987] = { t = "La branche de chêne glyphée", nv = 56, min = 51, te = "Glyphed Oaken Branch", av = 4985, g = { "Mulgris Rivière-profonde", "Mulgris Deepriver", 1422, 53.7, 64.7 }, obj = "Rapporter Branche de chêne glyphée", oe = "Bring Glyphed Oaken Branch" }
D[5021] = { t = "Mieux vaut tard que jamais", nv = 52, min = 50, te = "Better Late Than Never", g = { "Janice Gangrepierre", "Janice Felstone", 1422, 38.4, 54.1 }, r = { "Colis de Janice", "Janice's Parcel", 1422, 38.4, 54.1 } }
D[5022] = { t = "Mieux vaut tard que jamais", nv = 52, min = 50, te = "Better Late Than Never", av = 5021, g = { "Colis de Janice", "Janice's Parcel", 1422, 38.4, 54.1 }, obj = "Rapporter Colis de Janice", oe = "Bring Janice's Parcel" }
D[5023] = { t = "Mieux vaut tard que jamais", nv = 52, min = 50, te = "Better Late Than Never", av = 5021, g = { "Colis de Janice", "Janice's Parcel", 1422, 38.4, 54.1 }, obj = "Rapporter Colis de Janice", oe = "Bring Janice's Parcel" }
D[5041] = { t = "Ravitaillement pour la Croisée", nv = 14, min = 9, te = "Supplies for the Crossroads", av = 871, g = { "Thork", "Thork", 1413, 52.2, 31 }, r = { "Thork", "Thork", 1413, 52.2, 31 }, c = { 1413, 58.9, 26.1 }, obj = "Rapporter Caisses de ravitaillement de la Croisée", oe = "Bring Crossroads' Supply Crates" }
D[5051] = { t = "Deux moitiés deviennent Une", nv = 54, min = 50, te = "Two Halves Become One", av = 5050, g = { "Janice Gangrepierre", "Janice Felstone", 1422, 38.4, 54.1 }, r = { "Janice Gangrepierre", "Janice Felstone", 1422, 38.4, 54.1 }, obj = "Rapporter Charme porte-bonheur", oe = "Bring Good Luck Charm" }
D[5052] = { t = "Joyaux de sang d'Agammagan", nv = 21, min = 14, te = "Blood Shards of Agamaggan", av = 878, g = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, r = { "Mutiledent", "Mangletooth", 1413, 44.9, 59.1 }, c = { 1413, 47.4, 53.3 }, obj = "Rapporter Joyau de sang", oe = "Bring Blood Shard" }
D[5054] = { t = "Ursius des Crocs acérés", nv = 56, min = 53, te = "Ursius of the Shardtooth", g = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, r = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, c = { 1452, 64, 24.1 }, obj = "Vaincre Ursius", oe = "Kill Ursius" }
D[5055] = { t = "Brumeran des Noroît", nv = 58, min = 53, te = "Brumeran of the Chillwind", av = 5054, g = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, r = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, c = { 1452, 62.5, 57.9 }, obj = "Vaincre Brumeran", oe = "Kill Brumeran" }
D[5056] = { t = "Shy-Rotam", nv = 60, min = 53, av = 5055, g = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, r = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, obj = "Vaincre Shy-Rotam", oe = "Kill Shy-Rotam" }
D[5057] = { t = "Essais passés", nv = 60, min = 53, te = "Past Endeavors", av = 5056, g = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 }, r = { "Storm Sabot-d'ombre", "Storm Shadowhoof", 1452, 61.9, 38.3 } }
D[5058] = { t = "Journal de Mme Dalson", nv = 55, min = 52, te = "Mrs. Dalson's Diary", g = { "Journal de Mme Dalson", "Mrs. Dalson's Diary", 1422, 47.8, 50.7 }, r = { "Journal de Mme Dalson", "Mrs. Dalson's Diary", 1422, 47.8, 50.7 } }
D[5060] = { t = "Enfermé", nv = 55, min = 52, te = "Locked Away", g = { "Cabinet verrouillé", "Locked Cabinet", 1422, 47.8, 50.7 }, r = { "Cabinet verrouillé", "Locked Cabinet", 1422, 47.8, 50.7 }, obj = "Rapporter Clé du cabinet de Dalson", oe = "Bring Dalson Cabinet Key" }
D[5061] = { t = "Forme aquatique", nv = 16, min = 16, te = "Aquatic Form", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 }, obj = "Rapporter Pendentif du lion de mer", oe = "Bring Pendant of the Sea Lion" }
D[5062] = { t = "Feu sacré", nv = 27, min = 24, te = "Sacred Fire", av = 4865, g = { "Motega Crin-de-feu", "Motega Firemane", 1441, 21.5, 32.3 }, c = { 1441, 35.4, 35.1 }, obj = "Rapporter 10 × Agave d’incendia", oe = "Bring 10 × Incendia Agave" }
D[5064] = { t = "Espionner le Totem-sinistre", nv = 28, min = 24, te = "Grimtotem Spying", av = 4841, g = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, r = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, c = { 1441, 35, 38 }, obj = "Rapporter Note secrète n°1 ; Rapporter Note secrète n°2 ; Rapporter Note secrète n°3", oe = "Bring Secret Note #1 ; Bring Secret Note #2 ; Bring Secret Note #3" }
D[5065] = { t = "Les tablettes perdues de Mosh'aru", nv = 58, min = 40, te = "The Lost Tablets of Mosh'aru", av = 3528, g = { "Prospecteur Botte-de-fer", "Prospector Ironboot", 1446, 66.6, 25.7 }, r = { "Prospecteur Botte-de-fer", "Prospector Ironboot", 1446, 66.6, 25.7 }, obj = "Rapporter Troisième Tablette Mosh'aru ; Rapporter Quatrième Tablette Mosh'aru", oe = "Bring Third Mosh'aru Tablet ; Bring Fourth Mosh'aru Tablet" }
D[5082] = { t = "La menace des Tombe-hiver", nv = 56, min = 52, te = "Threat of the Winterfall", g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, c = { 1452, 39.8, 42.5 }, obj = "Vaincre 8 × Guide tombe-hiver ; Vaincre 8 × Protecteur tombe-hiver ; Vaincre 8 × Totémique tombe-hiver", oe = "Kill 8 × Winterfall Pathfinder ; Kill 8 × Winterfall Den Watcher ; Kill 8 × Winterfall Totemic" }
D[5084] = { t = "Corrompu", nv = 56, min = 52, te = "Falling to Corruption", av = 5083, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 } }
D[5085] = { t = "Gelée mystère", nv = 56, min = 52, te = "Mystery Goo", av = 5084, g = { "Chaudron des Mort-bois", "Deadwood Cauldron", 1448, 60.2, 5.8 }, obj = "Rapporter Flacon de Vase mystérieuse", oe = "Bring Flask of Mystery Goo" }
D[5086] = { t = "Horreurs toxiques", nv = 56, min = 52, te = "Toxic Horrors", av = 5085, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, obj = "Rapporter 3 × Gouttelette d'Horreur toxique", oe = "Bring 3 × Toxic Horror Droplet" }
D[5087] = { t = "Les messagers des Tombe-hiver", nv = 57, min = 52, te = "Winterfall Runners", av = 5086, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, c = { 1452, 27.9, 34.4 }, obj = "Rapporter Caisse des Tombe-hiver", oe = "Bring Winterfall Crate" }
D[5092] = { t = "Nettoyer le passage", nv = 52, min = 50, te = "Clear the Way", g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, c = { 1422, 49.6, 80.5 }, obj = "Vaincre 10 × Ecorcheur Squelette ; Vaincre 10 × Goule écumante", oe = "Kill 10 × Skeletal Flayer ; Kill 10 × Slavering Ghoul" }
D[5096] = { t = "Diversions écarlates", nv = 53, min = 50, te = "Scarlet Diversions", g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 } }
D[5097] = { t = "Tout au long des tours de guet", nv = 56, min = 50, te = "All Along the Watchtowers", av = 5092, g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, c = { 1422, 43.3, 68 }, obj = "Vaincre Andorhal Tour un ; Vaincre Andorhal Tour deux ; Vaincre Andorhal Tour trois ; Vaincre Andorhal Tour quatre", oe = "Kill Andorhal Tower One ; Kill Andorhal Tower Two ; Kill Andorhal Tower Three ; Kill Andorhal Tower Four" }
D[5098] = { t = "Tout au long des tours de guet", nv = 56, min = 50, te = "All Along the Watchtowers", av = 5096, g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, c = { 1422, 43.3, 68 }, obj = "Vaincre Andorhal Tour un ; Vaincre Andorhal Tour deux ; Vaincre Andorhal Tour trois ; Vaincre Andorhal Tour quatre", oe = "Kill Andorhal Tower One ; Kill Andorhal Tower Two ; Kill Andorhal Tower Three ; Kill Andorhal Tower Four" }
D[5121] = { t = "Le grand chef tombe-hiver", nv = 59, min = 52, te = "High Chief Winterfall", av = 5087, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, c = { 1452, 69.9, 38.2 }, obj = "Vaincre Grand chef Tombe-hiver", oe = "Kill High Chief Winterfall" }
D[5124] = { t = "Gantelets en plaques de feu", nv = 60, min = 55, te = "Fiery Plate Gauntlets", av = 5103, g = { "Malyfous Sombremartel", "Malyfous Darkhammer", 1452, 61.9, 38.3 }, r = { "Malyfous Sombremartel", "Malyfous Darkhammer", 1452, 61.9, 38.3 }, obj = "Rapporter Gantelets en plaques inachevés ; Rapporter 6 × Barre de thorium enchanté ; Rapporter 2 × Essence de feu ; Rapporter 4 × Rubis étoilé", oe = "Bring Unfired Plate Gauntlets ; Bring 6 × Enchanted Thorium Bar ; Bring 2 × Essence of Fire ; Bring 4 × Star Ruby" }
D[5126] = { t = "L'histoire de Lorax", nv = 60, min = 55, te = "Lorax's Tale", g = { "Lorax", "Lorax", 1452, 63.8, 73.8 }, r = { "Lorax", "Lorax", 1452, 63.8, 73.8 } }
D[5128] = { t = "Paroles du Grand Chef", nv = 59, min = 52, te = "Words of the High Chief", av = 5123, g = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 }, c = { 1452, 69.9, 38.2 }, obj = "Rapporter Journal mal écrit", oe = "Bring Crudely-written Log" }
D[5141] = { t = "Travail du cuir de dragon", nv = 55, min = 40, te = "Dragonscale Leatherworking", g = { "Peter Galen", "Peter Galen", 1447, 37.6, 65.4 }, r = { "Peter Galen", "Peter Galen", 1447, 37.6, 65.4 }, c = { 1447, 8.8, 61.9 }, obj = "Rapporter 2 × Cuirasse armée du scorpide ; Rapporter 2 × Gants armés du scorpide ; Rapporter 10 × Ecaille de dragon usée", oe = "Bring 2 × Tough Scorpid Breastplate ; Bring 2 × Tough Scorpid Gloves ; Bring 10 × Worn Dragonscale" }
D[5142] = { t = "La petite Pamela", nv = 55, min = 50, te = "Little Pamela", g = { "Marlene Senterouge", "Marlene Redpath", 1422, 49.2, 78.6 } }
D[5143] = { t = "Travail du cuir tribal", nv = 55, min = 40, te = "Tribal Leatherworking", g = { "Caryssia Chasselune", "Caryssia Moonhunter", 1444, 89.4, 46.6 }, r = { "Caryssia Chasselune", "Caryssia Moonhunter", 1444, 89.4, 46.6 }, obj = "Rapporter Gilet en cuir sauvage ; Rapporter Casque en cuir sauvage", oe = "Bring Wild Leather Vest ; Bring Wild Leather Helmet" }
D[5144] = { t = "Travail du cuir élémentaire", nv = 55, min = 40, te = "Elemental Leatherworking", g = { "Sarah Tanneur", "Sarah Tanner", 1427, 63.6, 76 }, r = { "Sarah Tanneur", "Sarah Tanner", 1427, 63.6, 76 }, c = { 1427, 15.6, 38 }, obj = "Rapporter 2 × Coeur de feu ; Rapporter 2 × Globe d'eau ; Rapporter 2 × Noyau de terre ; Rapporter 2 × Souffle de vent", oe = "Bring 2 × Heart of Fire ; Bring 2 × Globe of Water ; Bring 2 × Core of Earth ; Bring 2 × Breath of Wind" }
D[5147] = { t = "On recherche : Arnak Totem-Sinistre", nv = 29, min = 25, te = "Wanted - Arnak Grimtotem", g = { "Avis de recherche : Arnak Totem-Sinistre", "Wanted Poster - Arnak Grimtotem", 1441, 46.1, 51.7 }, r = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, c = { 1441, 38.1, 26.9 }, obj = "Rapporter Sabot d'Arnak", oe = "Bring Arnak's Hoof" }
D[5149] = { t = "La poupée de Pamela", nv = 55, min = 50, te = "Pamela's Doll", g = { "Pamela Senterouge", "Pamela Redpath", 1423, 31.2, 78 }, r = { "Pamela Senterouge", "Pamela Redpath", 1423, 31.2, 78 }, obj = "Rapporter Poupée de Pamela", oe = "Bring Pamela's Doll" }
D[5151] = { t = "Hypercapaciteur bidulotron", nv = 30, min = 24, te = "Hypercapacitor Gizmo", g = { "Wizlo Braquecoquard", "Wizlo Bearingshiner", 1441, 21.5, 32.3 }, r = { "Wizlo Braquecoquard", "Wizlo Bearingshiner", 1441, 21.5, 32.3 }, c = { 1441, 22.8, 24.6 }, obj = "Rapporter Clé de la cage des panthères ; Rapporter Hypercapaciteur bidulotron", oe = "Bring Panther Cage Key ; Bring Hypercapacitor Gizmo" }
D[5152] = { t = "Tante Marlene", nv = 56, min = 50, te = "Auntie Marlene", av = 5149, g = { "Pamela Senterouge", "Pamela Redpath", 1423, 31.2, 78 } }
D[5153] = { t = "Un étrange historien", nv = 56, min = 50, te = "A Strange Historian", av = 5152, g = { "Marlene Senterouge", "Marlene Redpath", 1422, 49.2, 78.6 }, r = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, c = { 1422, 49.7, 76.8 }, obj = "Rapporter Alliance de Joseph", oe = "Bring Joseph's Wedding Ring" }
D[5154] = { t = "Les annales de Comté-de-Darrow", nv = 56, min = 50, te = "The Annals of Darrowshire", av = 5153, g = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, r = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, obj = "Rapporter Annales de Darrowshire", oe = "Bring Annals of Darrowshire" }
D[5155] = { t = "Les forces de Jaedenar", nv = 51, min = 48, te = "Forces of Jaedenar", g = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, r = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, c = { 1448, 37.6, 60.2 }, obj = "Vaincre 4 × Molosse de Jaedenar ; Vaincre 4 × Gardien de Jaedenar ; Vaincre 6 × Adepte de Jaedenar ; Vaincre 6 × Sectateur de Jaedenar", oe = "Kill 4 × Jaedenar Hound ; Kill 4 × Jaedenar Guardian ; Kill 6 × Jaedenar Adept ; Kill 6 × Jaedenar Cultist" }
D[5156] = { t = "Enquête sur la corruption", nv = 54, min = 48, te = "Verifying the Corruption", g = { "Taronn Plume-rouge", "Taronn Redfeather", 1448, 51.3, 81.5 }, r = { "Taronn Plume-rouge", "Taronn Redfeather", 1448, 51.3, 81.5 }, c = { 1448, 42.5, 40.1 }, obj = "Vaincre 2 × Bête d'entropie ; Vaincre 2 × Horreur d'entropie", oe = "Kill 2 × Entropic Beast ; Kill 2 × Entropic Horror" }
D[5157] = { t = "Recueillir de l'eau souillée", nv = 52, min = 48, te = "Collection of the Corrupt Water", av = 5155, g = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, r = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, obj = "Rapporter Eau de Puits de lune corrompue", oe = "Bring Corrupt Moonwell Water" }
D[5158] = { t = "À la recherche de soutien spirituel", nv = 52, min = 48, te = "Seeking Spiritual Aid", av = 5157, g = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, obj = "Rapporter Eau de Puits de lune corrompue", oe = "Bring Corrupt Moonwell Water" }
D[5161] = { t = "La colère du vol bleu", nv = 60, min = 57, te = "Wrath of the Blue Flight", av = 5160, g = { "Haleh", "Haleh", 1452, 54.5, 51.2 }, r = { "Haleh", "Haleh", 1452, 54.5, 51.2 } }
D[5162] = { t = "La colère du vol bleu", nv = 60, min = 57, te = "Wrath of the Blue Flight", av = 5161, g = { "Haleh", "Haleh", 1452, 54.5, 51.2 } }
D[5163] = { t = "Yéti ? Y es-tu ?", nv = 58, min = 52, te = "Are We There, Yeti?", av = 977, g = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, r = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, c = { 1452, 61.5, 38.6 }, obj = "Rapporter Yéti mécanique d'Umi ; Utiliser Libérer le yéti d'Umi sur Legacki ; Utiliser Libérer le yéti d'Umi sur Saupoudr ; Utiliser Libérer le yéti d'Umi sur Quixxil", oe = "Bring Umi's Mechanical Yeti ; Use Release Umi's Yeti on Legacki ; Use Release Umi's Yeti on Sprinkle ; Use Release Umi's Yeti on Quixxil" }
D[5164] = { t = "Guide de l'Indocile", nv = 60, min = 57, te = "Catalogue of the Wayward", av = 5162, g = { "Jeziba", "Jeziba", 1422, 39.5, 66.8 }, r = { "Catalogue de l'Indocile", "Catalogue of the Wayward", 1422, 39.5, 66.8 } }
D[5165] = { t = "Éteindre les flammes de protection", nv = 55, min = 48, te = "Dousing the Flames of Protection", av = 5159, g = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, r = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, c = { 1448, 37, 54.5 }, obj = "Utiliser Eau purifiée pétillante sur Brasero de la Douleur ; Utiliser Eau purifiée pétillante sur Brasero de la Malice ; Utiliser Eau purifiée pétillante sur Brasero de la Souffrance ; Utiliser Eau purifiée pétillante sur Brasero de la Haine", oe = "Use Sprinkling Purified Water on Brazier of Pain ; Use Sprinkling Purified Water on Brazier of Malice ; Use Sprinkling Purified Water on Brazier of Suffering ; Use Sprinkling Purified Water on Brazier of Hatred" }
D[5166] = { t = "La cuirasse du vol chromatique", nv = 60, min = 57, te = "Breastplate of the Chromatic Flight", av = 5164, g = { "Catalogue de l'Indocile", "Catalogue of the Wayward", 1422, 39.5, 66.8 }, r = { "Jeziba", "Jeziba", 1422, 39.5, 66.8 }, c = { 1422, 46, 66.8 }, obj = "Rapporter objet 12871 ; Rapporter 10 × Ecaille chromatique brillante ; Rapporter 10 × Sang des héros ; Rapporter 10 × Couture d'Abomination effilochée", oe = "Bring item 12871 ; Bring 10 × Brilliant Chromatic Scale ; Bring 10 × Blood of Heroes ; Bring 10 × Frayed Abomination Stitching" }
D[5167] = { t = "Les cuissards du duelliste chromatique", nv = 60, min = 57, te = "Legplates of the Chromatic Defier", av = 5164, g = { "Catalogue de l'Indocile", "Catalogue of the Wayward", 1422, 39.5, 66.8 }, r = { "Jeziba", "Jeziba", 1422, 39.5, 66.8 }, c = { 1422, 46, 66.8 }, obj = "Rapporter objet 12871 ; Rapporter 10 × Ecaille chromatique brillante ; Rapporter 10 × Sang des héros ; Rapporter 5 × Peau des ombres", oe = "Bring item 12871 ; Bring 10 × Brilliant Chromatic Scale ; Bring 10 × Blood of Heroes ; Bring 5 × Skin of Shadow" }
D[5168] = { t = "Les héros de Comté-de-Darrow", nv = 56, min = 50, te = "Heroes of Darrowshire", av = 5210, g = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, r = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, obj = "Rapporter Libram de Davil ; Rapporter Bouclier de Redpath", oe = "Bring Davil's Libram ; Bring Redpath's Shield" }
D[5181] = { t = "Les vilains de Comté-de-Darrow", nv = 57, min = 50, te = "Villains of Darrowshire", av = 5210, g = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, r = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, c = { 1423, 44.3, 41.2 }, obj = "Rapporter Crâne d'Horgus ; Rapporter Epée brisée de Marduk", oe = "Bring Skull of Horgus ; Bring Shattered Sword of Marduk" }
D[5203] = { t = "Sauvetage à Jaedenar", nv = 55, min = 49, te = "Rescue From Jaedenar", av = 5202, g = { "Arko'narin captive", "Captured Arko'narin", 1448, 36.2, 55.5 }, r = { "Jessir Arquelune", "Jessir Moonbow", 1448, 51.3, 81.5 } }
D[5204] = { t = "Le châtiment de la Lumière", nv = 57, min = 49, te = "Retribution of the Light", av = 5203, g = { "Jessir Arquelune", "Jessir Moonbow", 1448, 51.3, 81.5 }, r = { "Cadavre de Trey Sancteforge", "Remains of Trey Lightforge", 1448, 38.5, 50.4 }, c = { 1448, 38.3, 50.5 }, obj = "Vaincre Rakaiah", oe = "Kill Rakaiah" }
D[5206] = { t = "Les maraudeurs de Comté-de-Darrow", nv = 60, min = 50, te = "Marauders of Darrowshire", g = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, r = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, obj = "Rapporter 5 × Crâne résonant ; Rapporter Cristal mystique", oe = "Bring 5 × Resonating Skull ; Bring Mystic Crystal" }
D[5210] = { t = "Frère Carlin", nv = 56, min = 50, te = "Brother Carlin", av = 5154, g = { "Chromie", "Chromie", 1422, 39.5, 66.8 }, obj = "Rapporter Annales complètes de Darrowshire", oe = "Bring Extended Annals of Darrowshire" }
D[5211] = { t = "Les défenseurs de Comté-de-Darrow", nv = 55, min = 50, te = "Defenders of Darrowshire", av = 5241, g = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, r = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, obj = "Vaincre 15 × Esprit de Comté-de-Darrow", oe = "Kill 15 × Darrowshire Spirit" }
D[5215] = { t = "Les chaudrons du Fléau", nv = 53, min = 50, te = "The Scourge Cauldrons", av = 5092, g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 } }
D[5216] = { t = "Cible : le Champ de Gangrepierre", nv = 53, min = 50, te = "Target: Felstone Field", av = 5215, g = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, r = { "Scourge Cauldron", "Scourge Cauldron", 1422, 38.4, 54.1 }, obj = "Rapporter Clé du chaudron du Champ de Felstone ; Rapporter Bouteille d'échantillon du Champ de Felstone vide", oe = "Bring Felstone Field Cauldron Key ; Bring Empty Felstone Field Bottle" }
D[5217] = { t = "Retour au camp du Noroît", nv = 53, min = 50, te = "Return to Chillwind Camp", av = 5216, g = { "Scourge Cauldron", "Scourge Cauldron", 1422, 38.4, 54.1 }, r = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, obj = "Rapporter Bouteille du Champ de Felstone remplie", oe = "Bring Filled Felstone Field Bottle" }
D[5219] = { t = "Cible : les Larmes de Dalson", nv = 55, min = 50, te = "Target: Dalson's Tears", av = 5217, g = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, r = { "Scourge Cauldron", "Scourge Cauldron", 1422, 47.8, 50.7 }, obj = "Rapporter Clé du chaudron des Larmes de Dalson ; Rapporter Bouteille des larmes de Dalson vide", oe = "Bring Dalson's Tears Cauldron Key ; Bring Empty Dalson's Tears Bottle" }
D[5220] = { t = "Retour au camp du Noroît", nv = 55, min = 50, te = "Return to Chillwind Camp", av = 5219, g = { "Scourge Cauldron", "Scourge Cauldron", 1422, 47.8, 50.7 }, r = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, obj = "Rapporter Bouteille des Larmes de Dalson remplie", oe = "Bring Filled Dalson's Tears Bottle" }
D[5222] = { t = "Cible : le Repaire putride", nv = 55, min = 50, te = "Target: Writhing Haunt", av = 5220, g = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, r = { "Scourge Cauldron", "Scourge Cauldron", 1422, 53.7, 64.7 }, obj = "Rapporter Clé du chaudron du Repaire putride ; Rapporter Bouteille vide du Repaire putride", oe = "Bring Writhing Haunt Cauldron Key ; Bring Empty Writhing Haunt Bottle" }
D[5223] = { t = "Retour au camp du Noroît", nv = 55, min = 50, te = "Return to Chillwind Camp", av = 5222, g = { "Scourge Cauldron", "Scourge Cauldron", 1422, 53.7, 64.7 }, r = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, obj = "Rapporter Bouteille du Repaire putride remplie", oe = "Bring Filled Writhing Haunt Bottle" }
D[5225] = { t = "Cible : la Flétrissure de Gahrron", nv = 58, min = 50, te = "Target: Gahrron's Withering", av = 5223, g = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, r = { "Chaudron du Fléau", "Scourge Cauldron", 1422, 62.5, 58.5 }, obj = "Rapporter Clé du chaudron de la Flétrissure de Gahrron ; Rapporter Bouteille vide de la Flétrissure de Gahrron", oe = "Bring Gahrron's Withering Cauldron Key ; Bring Empty Gahrron's Withering Bottle" }
D[5226] = { t = "Retour au camp du Noroît", nv = 58, min = 50, te = "Return to Chillwind Point", av = 5225, g = { "Chaudron du Fléau", "Scourge Cauldron", 1422, 62.5, 58.5 }, r = { "Grande prêtresse MacDonnell", "High Priestess MacDonnell", 1422, 42.7, 84 }, obj = "Rapporter Bouteille de la Flétrissure de Gahrron remplie", oe = "Bring Filled Gahrron's Withering Bottle" }
D[5228] = { t = "Les chaudrons du Fléau", nv = 53, min = 50, te = "The Scourge Cauldrons", av = 5096, g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 } }
D[5229] = { t = "Cible : le Champ de Gangrepierre", nv = 53, min = 50, te = "Target: Felstone Field", av = 5228, g = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, r = { "Scourge Cauldron", "Scourge Cauldron", 1422, 38.4, 54.1 }, obj = "Rapporter Clé du chaudron du Champ de Felstone ; Rapporter Bouteille d'échantillon du Champ de Felstone vide", oe = "Bring Felstone Field Cauldron Key ; Bring Empty Felstone Field Bottle" }
D[5230] = { t = "Retour à la Barricade", nv = 53, min = 50, te = "Return to the Bulwark", av = 5229, g = { "Scourge Cauldron", "Scourge Cauldron", 1422, 38.4, 54.1 }, r = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, obj = "Rapporter Bouteille du Champ de Felstone remplie", oe = "Bring Filled Felstone Field Bottle" }
D[5231] = { t = "Cible : les Larmes de Dalson", nv = 55, min = 50, te = "Target: Dalson's Tears", av = 5230, g = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, r = { "Scourge Cauldron", "Scourge Cauldron", 1422, 47.8, 50.7 }, obj = "Rapporter Clé du chaudron des Larmes de Dalson ; Rapporter Bouteille des larmes de Dalson vide", oe = "Bring Dalson's Tears Cauldron Key ; Bring Empty Dalson's Tears Bottle" }
D[5232] = { t = "Retour à la Barricade", nv = 55, min = 50, te = "Return to the Bulwark", av = 5231, g = { "Scourge Cauldron", "Scourge Cauldron", 1422, 47.8, 50.7 }, r = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, obj = "Rapporter Bouteille des Larmes de Dalson remplie", oe = "Bring Filled Dalson's Tears Bottle" }
D[5233] = { t = "Cible : le Repaire putride", nv = 55, min = 50, te = "Target: Writhing Haunt", av = 5232, g = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, r = { "Scourge Cauldron", "Scourge Cauldron", 1422, 53.7, 64.7 }, obj = "Rapporter Clé du chaudron du Repaire putride ; Rapporter Bouteille vide du Repaire putride", oe = "Bring Writhing Haunt Cauldron Key ; Bring Empty Writhing Haunt Bottle" }
D[5234] = { t = "Retour à la Barricade", nv = 55, min = 50, te = "Return to the Bulwark", av = 5233, g = { "Scourge Cauldron", "Scourge Cauldron", 1422, 53.7, 64.7 }, r = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.4, 59.1 }, obj = "Rapporter Bouteille du Repaire putride remplie", oe = "Bring Filled Writhing Haunt Bottle" }
D[5235] = { t = "Cible : la Flétrissure de Gahrron", nv = 58, min = 50, te = "Target: Gahrron's Withering", av = 5234, g = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, r = { "Chaudron du Fléau", "Scourge Cauldron", 1422, 62.5, 58.5 }, obj = "Rapporter Clé du chaudron de la Flétrissure de Gahrron ; Rapporter Bouteille vide de la Flétrissure de Gahrron", oe = "Bring Gahrron's Withering Cauldron Key ; Bring Empty Gahrron's Withering Bottle" }
D[5236] = { t = "Retour à la Barricade", nv = 58, min = 50, te = "Return to the Bulwark", av = 5235, g = { "Chaudron du Fléau", "Scourge Cauldron", 1422, 62.5, 58.5 }, r = { "Prêtresse des ombres Vandis", "Shadow Priestess Vandis", 1422, 26.5, 56 }, obj = "Rapporter Bouteille de la Flétrissure de Gahrron remplie", oe = "Bring Filled Gahrron's Withering Bottle" }
D[5237] = { t = "Mission accomplie !", nv = 58, min = 50, te = "Mission Accomplished!", av = 5226, g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 } }
D[5238] = { t = "Mission accomplie !", nv = 58, min = 50, te = "Mission Accomplished!", av = 5236, g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 } }
D[5241] = { t = "Oncle Carlin", nv = 56, min = 50, te = "Uncle Carlin", av = 5149, g = { "Pamela Senterouge", "Pamela Redpath", 1423, 31.2, 78 }, r = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 } }
D[5242] = { t = "Un coup final", nv = 58, min = 48, te = "A Final Blow", av = 5165, g = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, r = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.3, 81.5 }, c = { 1448, 38.8, 46.9 }, obj = "Rapporter Tête du Seigneur des ténèbres Fel'dan ; Vaincre Moora ; Vaincre Salia", oe = "Bring Shadow Lord Fel'dan's Head ; Kill Moora ; Kill Salia" }
D[5244] = { t = "Les ruines de Kel'Theril", nv = 56, min = 53, te = "The Ruins of Kel'Theril", g = { "Wynd Pistenuit", "Wynd Nightchaser", 1452, 52.1, 30.4 }, r = { "Jaron Sculptepierre", "Jaron Stoneshaper", 1452, 52.1, 30.4 } }
D[5245] = { t = "Les esprits troublés de Kel'Theril", nv = 56, min = 53, te = "Troubled Spirits of Kel'Theril", av = 5244, g = { "Jaron Sculptepierre", "Jaron Stoneshaper", 1452, 52.1, 30.4 }, c = { 1452, 52.9, 42.4 }, obj = "Rapporter Fragment de la première relique ; Rapporter Fragment de la deuxième relique ; Rapporter Fragment de la troisième relique ; Rapporter Fragment de la quatrième relique", oe = "Bring First Relic Fragment ; Bring Second Relic Fragment ; Bring Third Relic Fragment ; Bring Fourth Relic Fragment" }
D[5246] = { t = "Fragments du passé", nv = 56, min = 53, te = "Fragments of the Past", av = 5245, g = { "Aurora Mandeciel", "Aurora Skycaller", 1423, 46.5, 16 }, r = { "Aurora Mandeciel", "Aurora Skycaller", 1423, 46.5, 16 }, obj = "Rapporter Textes sacrés des Bien-nés", oe = "Bring Sacred Highborne Writings" }
D[5247] = { t = "Fragments du passé", nv = 57, min = 53, te = "Fragments of the Past", av = 5246, g = { "Aurora Mandeciel", "Aurora Skycaller", 1423, 46.5, 16 }, r = { "Aurora Mandeciel", "Aurora Skycaller", 1423, 46.5, 16 }, obj = "Rapporter Barre de thorium enchanté ; Rapporter 5 × Cristal de restauration ; Rapporter Fiole d'eau redoutable", oe = "Bring Enchanted Thorium Bar ; Bring 5 × Crystal Restore ; Bring Vial of Dire Water" }
D[5248] = { t = "Tourmentée par le passé", nv = 58, min = 53, te = "Tormented By the Past", av = 5247, g = { "Aurora Mandeciel", "Aurora Skycaller", 1423, 46.5, 16 }, obj = "Rapporter Cristal de Zin-Malor", oe = "Bring Crystal of Zin-Malor" }
D[5249] = { t = "Au Berceau-de-l'Hiver", nv = 56, min = 53, te = "To Winterspring!", g = { "Ivy Coursefeuille", "Ivy Leafrunner", 1448, 51.3, 81.5 } }
D[5252] = { t = "Une Bien-née pleine de remords", nv = 58, min = 53, te = "Remorseful Highborne", av = 5248, g = { "Bien-née pénitente", "Remorseful Highborne", 1452, 56.1, 44.4 }, r = { "Wynd Pistenuit", "Wynd Nightchaser", 1452, 52.1, 30.4 }, obj = "Rapporter Cristal de Zin-Malor", oe = "Bring Crystal of Zin-Malor" }
D[5253] = { t = "Le Cristal de Zin-Malor", nv = 58, min = 53, te = "The Crystal of Zin-Malor", av = 5252, g = { "Wynd Pistenuit", "Wynd Nightchaser", 1452, 52.1, 30.4 }, obj = "Rapporter Cristal de Zin-Malor", oe = "Bring Crystal of Zin-Malor" }
D[5261] = { t = "Eagan Tannepeau", nv = 2, min = 1, te = "Eagan Peltskinner", av = 783, g = { "Adjoint Willem", "Deputy Willem", 1429, 48.2, 42.9 }, r = { "Eagan Tannepeau", "Eagan Peltskinner", 1429, 48.2, 42.9 } }
D[5264] = { t = "Seigneur Maxwell Tyrosus", nv = 60, min = 55, te = "Lord Maxwell Tyrosus", av = 5263, g = { "Duc Nicholas Zverenhoff", "Duke Nicholas Zverenhoff", 1423, 71.7, 50 }, r = { "Seigneur Maxwell Tyrosus", "Lord Maxwell Tyrosus", 1423, 71.7, 50 } }
D[5265] = { t = "Le Coffre d'argent", nv = 60, min = 55, te = "The Argent Hold", av = 5264, g = { "Seigneur Maxwell Tyrosus", "Lord Maxwell Tyrosus", 1423, 71.7, 50 }, r = { "Le Coffre d'argent", "The Argent Hold", 1423, 71.7, 50 } }
D[5321] = { t = "Le dormeur s'est éveillé", nv = 20, min = 17, te = "The Sleeper Has Awakened", g = { "Kerlonian Eternombre", "Kerlonian Evershade", 1439, 43.6, 76.3 }, c = { 1439, 44.4, 76.3 }, obj = "Rapporter Corne de l'éveil", oe = "Bring Horn of Awakening" }
D[5342] = { t = "Le dernier Barov", nv = 60, min = 52, te = "The Last Barov", av = 5341, g = { "Alexi Barov", "Alexi Barov", 1422, 26.5, 56 }, r = { "Alexi Barov", "Alexi Barov", 1422, 26.5, 56 }, c = { 1422, 43.5, 83.7 }, obj = "Rapporter Tête de Weldon Barov", oe = "Bring Head of Weldon Barov" }
D[5344] = { t = "Le dernier Barov", nv = 60, min = 52, te = "The Last Barov", av = 5343, g = { "Weldon Barov", "Weldon Barov", 1422, 42.7, 84 }, r = { "Weldon Barov", "Weldon Barov", 1422, 42.7, 84 }, c = { 1422, 26.4, 58.8 }, obj = "Rapporter Tête d'Alexi Barov", oe = "Bring Head of Alexi Barov" }
D[5361] = { t = "Arbre familial", nv = 35, min = 32, te = "Family Tree", g = { "Garde-falaise Longue-corne", "Cliffwatcher Longhorn", 1441, 46.1, 51.7 }, obj = "Rapporter Rapport du garde-falaise Longhorn", oe = "Bring Cliffwatcher Longhorn Report" }
D[5381] = { t = "La Main d'Iruxos", nv = 38, min = 32, te = "Hand of Iruxos", g = { "Taiga Crin-sage", "Taiga Wisemane", 1443, 25.8, 68.2 }, r = { "Taiga Crin-sage", "Taiga Wisemane", 1443, 25.8, 68.2 }, obj = "Rapporter Boîte démoniaque ; Rapporter Pioche démoniaque", oe = "Bring Demon Box ; Bring Demon Pick" }
D[5385] = { t = "Les restes de Trey Sancteforge", nv = 57, min = 49, te = "The Remains of Trey Lightforge", av = 5204, g = { "Cadavre de Trey Sancteforge", "Remains of Trey Lightforge", 1448, 38.5, 50.4 }, r = { "Jessir Arquelune", "Jessir Moonbow", 1448, 51.3, 81.5 }, obj = "Rapporter Cadavre de Trey Lightforge", oe = "Bring Remains of Trey Lightforge" }
D[5386] = { t = "La prise du jour", nv = 37, min = 32, te = "Catch of the Day", g = { "Nataka Longue-corne", "Nataka Longhorn", 1443, 56.2, 59.6 }, r = { "Nataka Longue-corne", "Nataka Longhorn", 1443, 56.2, 59.6 }, obj = "Rapporter 2 × Ventre-rouge", oe = "Bring 2 × Bloodbelly Fish" }
D[5401] = { t = "Brevet de l'Aube d'argent", nv = 55, min = 50, te = "Argent Dawn Commission", g = { "Officier de l'Aube d'argent Purecarde", "Argent Officer Pureheart", 1422, 42.7, 84 }, r = { "Officier de l'Aube d'argent Purecarde", "Argent Officer Pureheart", 1422, 42.7, 84 } }
D[5405] = { t = "Brevet de l'Aube d'argent", nv = 55, min = 50, te = "Argent Dawn Commission", g = { "Officier de l'Aube d'argent Garush", "Argent Officer Garush", 1422, 26.4, 59.1 }, r = { "Officier de l'Aube d'argent Garush", "Argent Officer Garush", 1422, 26.4, 59.1 } }
D[5441] = { t = "Les péons paresseux", nv = 4, min = 3, te = "Lazy Peons", g = { "Contremaître Thazz'ril", "Foreman Thazz'ril", 1411, 42.1, 68.3 }, r = { "Contremaître Thazz'ril", "Foreman Thazz'ril", 1411, 42.1, 68.3 }, c = { 1411, 44.8, 64.8 }, obj = "Rapporter Masse de contremaître ; Vaincre 5 × Péon fainéant", oe = "Bring Foreman's Blackjack ; Kill 5 × Lazy Peon" }
D[5461] = { t = "L'humain, Ras Murmegivre", nv = 60, min = 57, te = "The Human, Ras Frostwhisper", av = 5384, g = { "Magistrat Marduke", "Magistrate Marduke", 1422, 70.6, 74.1 }, r = { "Magistrat Marduke", "Magistrate Marduke", 1422, 70.6, 74.1 }, obj = "Rapporter Livre du souvenir", oe = "Bring Keepsake of Remembrance" }
D[5462] = { t = "Le moribond, Ras Murmegivre", nv = 60, min = 57, te = "The Dying, Ras Frostwhisper", av = 5461, g = { "Magistrat Marduke", "Magistrate Marduke", 1422, 70.6, 74.1 }, obj = "Rapporter Livre du souvenir", oe = "Bring Keepsake of Remembrance" }
D[5465] = { t = "Souvenir lié", nv = 60, min = 57, te = "Soulbound Keepsake", av = 5464, g = { "Leonid Barthalomew le Révéré", "Leonid Barthalomew the Revered", 1423, 71.7, 50 }, obj = "Rapporter Souvenir lié", oe = "Bring Soulbound Keepsake" }
D[5481] = { t = "La tâche de Gordo", nv = 5, min = 5, te = "Gordo's Task", g = { "Gordo", "Gordo", 1420, 43.1, 54.7 }, r = { "Apprenti apothicaire Holland", "Junior Apothecary Holland", 1420, 57.4, 48.8 }, c = { 1420, 46.6, 56.7 }, obj = "Rapporter 3 × Herbe des ténèbres", oe = "Bring 3 × Gloom Weed" }
D[5482] = { t = "Herbe maléfique", nv = 6, min = 5, te = "Doom Weed", av = 5481, g = { "Apprenti apothicaire Holland", "Junior Apothecary Holland", 1420, 57.4, 48.8 }, r = { "Apprenti apothicaire Holland", "Junior Apothecary Holland", 1420, 57.4, 48.8 }, c = { 1420, 56.9, 39.4 }, obj = "Rapporter 10 × Herbe maléfique", oe = "Bring 10 × Doom Weed" }
D[5501] = { t = "Collectionneur d'os", nv = 39, min = 33, te = "Bone Collector", g = { "Bibbly F'ibulleur", "Bibbly F'utzbuckle", 1443, 62.3, 39 }, r = { "Bibbly F'ibulleur", "Bibbly F'utzbuckle", 1443, 62.3, 39 }, c = { 1443, 50.9, 59.4 }, obj = "Rapporter 10 × Os de kodo", oe = "Bring 10 × Kodo Bone" }
D[5503] = { t = "Brevet de l'Aube d'argent", nv = 55, min = 50, te = "Argent Dawn Commission", g = { "Duc Nicholas Zverenhoff", "Duke Nicholas Zverenhoff", 1423, 71.7, 50 }, r = { "Duc Nicholas Zverenhoff", "Duke Nicholas Zverenhoff", 1423, 71.7, 50 } }
D[5504] = { t = "Les mantelets de l'Aube", nv = 60, min = 55, te = "Mantles of the Dawn", g = { "Intendante de l'Aube d'argent Hasana", "Argent Quartermaster Hasana", 1422, 26.5, 56 }, r = { "Intendante de l'Aube d'argent Hasana", "Argent Quartermaster Hasana", 1422, 26.5, 56 }, obj = "Rapporter 10 × Marque de valeur de l'Aube d'argent", oe = "Bring 10 × Argent Dawn Valor Token" }
D[5505] = { t = "La clé de Scholomance", nv = 60, min = 55, te = "The Key to Scholomance", av = 5803, g = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 }, r = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 } }
D[5507] = { t = "Les mantelets de l'aube", nv = 60, min = 55, te = "Mantles of the Dawn", g = { "Intendant de l'Aube d'argent Feuzopoudre", "Argent Quartermaster Lightspark", 1422, 42.7, 84 }, r = { "Intendant de l'Aube d'argent Feuzopoudre", "Argent Quartermaster Lightspark", 1422, 42.7, 84 }, obj = "Rapporter 10 × Marque de valeur de l'Aube d'argent", oe = "Bring 10 × Argent Dawn Valor Token" }
D[5511] = { t = "La clé de Scholomance", nv = 60, min = 55, te = "The Key to Scholomance", av = 5804, g = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 }, r = { "Grand exécuteur Derrington", "High Executor Derrington", 1422, 26.5, 56 } }
D[5513] = { t = "Les mantelets de l'aube", nv = 60, min = 55, te = "Mantles of the Dawn", g = { "Intendante Miranda Breechlock", "Quartermaster Miranda Breechlock", 1423, 71.7, 50 }, r = { "Intendante Miranda Breechlock", "Quartermaster Miranda Breechlock", 1423, 71.7, 50 }, obj = "Rapporter 10 × Marque de valeur de l'Aube d'argent", oe = "Bring 10 × Argent Dawn Valor Token" }
D[5514] = { t = "À la pêche au moule…", nv = 57, min = 55, te = "Mold Rhymes With...", av = 964, g = { "Apothicaire Dithers", "Apothecary Dithers", 1422, 26.5, 56 }, obj = "Rapporter Fragments de squelette imprégnés", oe = "Bring Imbued Skeletal Fragments" }
D[5517] = { t = "Le mantelet de l’Aube chromatique", nv = 60, min = 55, te = "Chromatic Mantle of the Dawn", g = { "Intendante Miranda Breechlock", "Quartermaster Miranda Breechlock", 1423, 71.7, 50 }, r = { "Intendante Miranda Breechlock", "Quartermaster Miranda Breechlock", 1423, 71.7, 50 }, obj = "Rapporter 25 × Marque de valeur de l'Aube d'argent", oe = "Bring 25 × Argent Dawn Valor Token" }
D[5521] = { t = "Le mantelet de l'Aube chromatique", nv = 60, min = 55, te = "Chromatic Mantle of the Dawn", g = { "Intendant de l'Aube d'argent Feuzopoudre", "Argent Quartermaster Lightspark", 1422, 42.7, 84 }, r = { "Intendant de l'Aube d'argent Feuzopoudre", "Argent Quartermaster Lightspark", 1422, 42.7, 84 }, obj = "Rapporter 25 × Marque de valeur de l'Aube d'argent", oe = "Bring 25 × Argent Dawn Valor Token" }
D[5524] = { t = "Le mantelet de l'Aube chromatique", nv = 60, min = 55, te = "Chromatic Mantle of the Dawn", g = { "Intendante de l'Aube d'argent Hasana", "Argent Quartermaster Hasana", 1422, 26.5, 56 }, r = { "Intendante de l'Aube d'argent Hasana", "Argent Quartermaster Hasana", 1422, 26.5, 56 }, obj = "Rapporter 25 × Marque de valeur de l'Aube d'argent", oe = "Bring 25 × Argent Dawn Valor Token" }
D[5527] = { t = "Un reliquaire de pureté", nv = 60, min = 56, te = "A Reliquary of Purity", g = { "Rabine Saturna", "Rabine Saturna", 1450, 51.7, 45.1 }, r = { "Rabine Saturna", "Rabine Saturna", 1450, 51.7, 45.1 }, obj = "Rapporter Reliquaire de pureté", oe = "Bring Reliquary of Purity" }
D[5533] = { t = "Scholomance", nv = 55, min = 55, av = 5097, g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 } }
D[5534] = { t = "L'équipement « manquant » de Kim'jael", nv = 53, min = 47, te = "Kim'jael's \"Missing\" Equipment", av = 3601, g = { "Kim'jael", "Kim'jael", 1447, 53.5, 21.8 }, r = { "Kim'jael", "Kim'jael", 1447, 53.5, 21.8 }, c = { 1447, 46.1, 56.6 }, obj = "Rapporter Une rune", oe = "Bring Some Rune" }
D[5535] = { t = "Agitation spirituelle", nv = 47, min = 45, te = "Spiritual Unrest", g = { "Loh'atu", "Loh'atu", 1447, 11.4, 78.2 }, r = { "Loh'atu", "Loh'atu", 1447, 11.4, 78.2 }, c = { 1447, 16.5, 69.8 }, obj = "Vaincre 6 × Apparition bien-née ; Vaincre 6 × Jeune liche bien-née", oe = "Kill 6 × Highborne Apparition ; Kill 6 × Highborne Lichling" }
D[5536] = { t = "Un pays plein de haine", nv = 47, min = 45, te = "A Land Filled with Hatred", g = { "Loh'atu", "Loh'atu", 1447, 11.4, 78.2 }, r = { "Loh'atu", "Loh'atu", 1447, 11.4, 78.2 }, c = { 1447, 20.2, 62.3 }, obj = "Vaincre 6 × Satyre Haldarr ; Vaincre 2 × Entourloupeur Haldarr ; Vaincre 2 × Gangrelige Haldarr", oe = "Kill 6 × Haldarr Satyr ; Kill 2 × Haldarr Trickster ; Kill 2 × Haldarr Felsworn" }
D[5537] = { t = "Fragments de squelette", nv = 57, min = 55, te = "Skeletal Fragments", av = 5533, g = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 }, r = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 }, c = { 1422, 44.3, 67.6 }, obj = "Rapporter 15 × Fragments de squelette", oe = "Bring 15 × Skeletal Fragments" }
D[5538] = { t = "À la pêche au moule…", nv = 57, min = 55, te = "Mold Rhymes With...", av = 5537, g = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 }, obj = "Rapporter Fragments de squelette imprégnés", oe = "Bring Imbued Skeletal Fragments" }
D[5541] = { t = "Munitions pour Grondetrait", nv = 6, min = 5, te = "Ammo for Rumbleshot", g = { "Loslor Rudge", "Loslor Rudge", 1426, 49.6, 48.6 }, r = { "Hegnar Grondetrait", "Hegnar Rumbleshot", 1426, 40.7, 65.1 }, c = { 1426, 44.1, 56.9 }, obj = "Rapporter Munitions de Rumbleshot", oe = "Bring Rumbleshot's Ammo" }
D[5542] = { t = "Chiens-démons", nv = 56, min = 52, te = "Demon Dogs", g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, c = { 1422, 75, 55.6 }, obj = "Vaincre 20 × Chien pestiféré chétif ; Vaincre 5 × Chien pestiféré ; Vaincre 5 × Chien pestiféré frénétique", oe = "Kill 20 × Plaguehound Runt ; Kill 5 × Plaguehound ; Kill 5 × Frenzied Plaguehound" }
D[5543] = { t = "Ciel couleur de sang", nv = 56, min = 52, te = "Blood Tinged Skies", g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, c = { 1422, 76.5, 52.1 }, obj = "Vaincre 30 × Chauve-souris pestiférée", oe = "Kill 30 × Plaguebat" }
D[5544] = { t = "Larve putride", nv = 56, min = 52, te = "Carrion Grubbage", g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, c = { 1422, 76.1, 55 }, obj = "Rapporter 15 × Chair de Ver putride", oe = "Bring 15 × Slab of Carrion Worm Meat" }
D[5545] = { t = "Un sac d'embrouilles", nv = 9, min = 5, te = "A Bundle of Trouble", g = { "Superviseur Raelen", "Supervisor Raelen", 1429, 79.5, 68.8 }, r = { "Superviseur Raelen", "Supervisor Raelen", 1429, 79.5, 68.8 }, c = { 1429, 80.5, 58.4 }, obj = "Rapporter 8 × Fagot de bois", oe = "Bring 8 × Bundle of Wood" }
D[5561] = { t = "Le rassemblement des kodos", nv = 34, min = 30, te = "Kodo Roundup", g = { "Smeed Fouillevis", "Smeed Scrabblescrew", 1443, 60.9, 61.9 }, r = { "Smeed Fouillevis", "Smeed Scrabblescrew", 1443, 60.9, 61.9 }, obj = "Rapporter Kombobulateur Kodo ; Vaincre 5 × Kodo dompté", oe = "Bring Kodo Kombobulator ; Kill 5 × Tamed Kodo" }
D[5581] = { t = "Les portails de la Légion", nv = 38, min = 32, te = "Portals of the Legion", av = 5381, g = { "Taiga Crin-sage", "Taiga Wisemane", 1443, 25.8, 68.2 }, r = { "Taiga Crin-sage", "Taiga Wisemane", 1443, 25.8, 68.2 }, obj = "Rapporter Main d'Iruxos ; Vaincre 6 × Gardien du Portail démoniaque", oe = "Bring Hand of Iruxos ; Kill 6 × Demon Portal Guardian" }
D[5601] = { t = "Pamela, ma sœur", nv = 55, min = 50, te = "Sister Pamela", g = { "Jessica Senterouge", "Jessica Redpath", 1452, 61.9, 38.3 } }
D[5621] = { t = "Vêtements de la lune", nv = 4, min = 5, te = "Garments of the Moon", av = 5622, g = { "Laurna Clairematin", "Laurna Morninglight", 1438, 56, 57.3 }, r = { "Laurna Clairematin", "Laurna Morninglight", 1438, 56, 57.3 }, c = { 1438, 57.2, 63.5 }, obj = "Vaincre Sentinelle Shaya", oe = "Kill Sentinel Shaya" }
D[5622] = { t = "Au service d'Élune", nv = 4, min = 5, te = "In Favor of Elune", g = { "Shanda", "Shanda", 1438, 58.7, 44.3 }, r = { "Laurna Clairematin", "Laurna Morninglight", 1438, 56, 57.3 } }
D[5623] = { t = "Au service de la Lumière", nv = 4, min = 5, te = "In Favor of the Light", g = { "Prêtresse Anetta", "Priestess Anetta", 1429, 48.2, 42.9 }, r = { "Prêtresse Josetta", "Priestess Josetta", 1429, 42.1, 65.9 } }
D[5624] = { t = "Vêtements de la Lumière", nv = 4, min = 5, te = "Garments of the Light", av = 5623, g = { "Prêtresse Josetta", "Priestess Josetta", 1429, 42.1, 65.9 }, r = { "Prêtresse Josetta", "Priestess Josetta", 1429, 42.1, 65.9 }, c = { 1429, 48.1, 68 }, obj = "Vaincre Garde Roberts", oe = "Kill Guard Roberts" }
D[5625] = { t = "Vêtements de la Lumière", nv = 4, min = 5, te = "Garments of the Light", av = 5626, g = { "Maxan Anvol", "Maxan Anvol", 1426, 46.7, 53.8 }, r = { "Maxan Anvol", "Maxan Anvol", 1426, 46.7, 53.8 }, c = { 1426, 45.8, 54.6 }, obj = "Vaincre Montagnard Dolf", oe = "Kill Mountaineer Dolf" }
D[5626] = { t = "Au service de la Lumière", nv = 4, min = 5, te = "In Favor of the Light", g = { "Branstock Khalder", "Branstock Khalder", 1426, 28.8, 66.4 }, r = { "Maxan Anvol", "Maxan Anvol", 1426, 46.7, 53.8 } }
D[5627] = { t = "Étoiles d'Élune", nv = 10, min = 10, te = "Stars of Elune", g = { "Prêtresse Alathea", "Priestess Alathea", 1457, 39.5, 81.2 }, r = { "Prêtresse Alathea", "Priestess Alathea", 1457, 39.5, 81.2 } }
D[5628] = { t = "Retour à la maison", nv = 10, min = 10, te = "Returning Home", g = { "Prêtresse Josetta", "Priestess Josetta", 1429, 42.1, 65.9 }, r = { "Prêtresse Alathea", "Priestess Alathea", 1457, 39.5, 81.2 } }
D[5629] = { t = "Retour à la maison", nv = 10, min = 10, te = "Returning Home", g = { "Laurna Clairematin", "Laurna Morninglight", 1438, 56, 57.3 } }
D[5630] = { t = "Retour à la maison", nv = 10, min = 10, te = "Returning Home", g = { "Maxan Anvol", "Maxan Anvol", 1426, 46.7, 53.8 } }
D[5634] = { t = "Prière du désespoir", nv = 10, min = 10, te = "Desperate Prayer", g = { "Lariia", "Lariia", 1457, 40.3, 88.7 }, r = { "Grande prêtresse Laurena", "High Priestess Laurena", 1453, 49.5, 44.6 } }
D[5635] = { t = "Prière du désespoir", nv = 10, min = 10, te = "Desperate Prayer", g = { "Maxan Anvol", "Maxan Anvol", 1426, 46.7, 53.8 } }
D[5636] = { t = "Prière du désespoir", nv = 10, min = 10, te = "Desperate Prayer", g = { "Laurna Clairematin", "Laurna Morninglight", 1438, 56, 57.3 } }
D[5637] = { t = "Prière du désespoir", nv = 10, min = 10, te = "Desperate Prayer", g = { "Prêtresse Josetta", "Priestess Josetta", 1429, 42.1, 65.9 } }
D[5641] = { t = "Un manque de peur", nv = 20, min = 20, te = "A Lack of Fear", g = { "Grande prêtresse Laurena", "High Priestess Laurena", 1453, 49.5, 44.6 }, r = { "Grand prêtre Rohan", "High Priest Rohan", 1455, 24.7, 8.2 } }
D[5642] = { t = "Garde de l'ombre", nv = 20, min = 20, te = "Shadowguard", g = { "Miles Welsh", "Miles Welsh", 1456, 25.3, 15.3 }, r = { "Ur'kyo", "Ur'kyo", 1454, 35.6, 87.8 } }
D[5644] = { t = "Peste dévorante", nv = 20, min = 20, te = "Devouring Plague", g = { "Zayus", "Zayus", 1454, 35.7, 86.9 }, r = { "Aelthalyste", "Aelthalyste", 1458, 49.3, 17.1 } }
D[5648] = { t = "Vêtements de la spiritualité", nv = 4, min = 5, te = "Garments of Spirituality", av = 5649, g = { "Tai'jin", "Tai'jin", 1411, 51.9, 43.5 }, r = { "Tai'jin", "Tai'jin", 1411, 51.9, 43.5 }, c = { 1411, 53.1, 46.5 }, obj = "Vaincre Grunt Kor'ja", oe = "Kill Grunt Kor'ja" }
D[5649] = { t = "Au service de la spiritualité", nv = 4, min = 5, te = "In Favor of Spirituality", g = { "Ken'jai", "Ken'jai", 1411, 42.1, 68.3 }, r = { "Tai'jin", "Tai'jin", 1411, 51.9, 43.5 } }
D[5650] = { t = "Vêtements des ténèbres", nv = 4, min = 5, te = "Garments of Darkness", av = 5651, g = { "Sombre clerc Beryl", "Dark Cleric Beryl", 1420, 61.7, 52 }, r = { "Sombre clerc Beryl", "Dark Cleric Beryl", 1420, 61.7, 52 }, c = { 1420, 59.2, 46.5 }, obj = "Vaincre Nécrogarde Kel", oe = "Kill Deathguard Kel" }
D[5651] = { t = "Au service des ténèbres", nv = 4, min = 5, te = "In Favor of Darkness", g = { "Sombre clerc Duesten", "Dark Cleric Duesten", 1420, 30.8, 66.2 }, r = { "Sombre clerc Beryl", "Dark Cleric Beryl", 1420, 61.7, 52 } }
D[5652] = { t = "Le maléfice de faiblesse", nv = 10, min = 10, te = "Hex of Weakness", g = { "Ur'kyo", "Ur'kyo", 1454, 35.6, 87.8 }, r = { "Ur'kyo", "Ur'kyo", 1454, 35.6, 87.8 } }
D[5655] = { t = "Le maléfice de faiblesse", nv = 10, min = 10, te = "Hex of Weakness", g = { "Tai'jin", "Tai'jin", 1411, 51.9, 43.5 } }
D[5657] = { t = "Le maléfice de faiblesse", nv = 10, min = 10, te = "Hex of Weakness", g = { "Ken'jai", "Ken'jai", 1411, 42.1, 68.3 } }
D[5658] = { t = "Toucher de faiblesse", nv = 10, min = 10, te = "Touch of Weakness", g = { "Père Lankester", "Father Lankester", 1458, 49.1, 14.6 }, r = { "Aelthalyste", "Aelthalyste", 1458, 49.3, 17.1 } }
D[5660] = { t = "Toucher de faiblesse", nv = 10, min = 10, te = "Touch of Weakness", g = { "Tai'jin", "Tai'jin", 1411, 51.9, 43.5 } }
D[5663] = { t = "Toucher de faiblesse", nv = 10, min = 10, te = "Touch of Weakness", g = { "Sombre clerc Beryl", "Dark Cleric Beryl", 1420, 61.7, 52 } }
D[5672] = { t = "Grâce d'Élune", nv = 20, min = 20, te = "Elune's Grace", g = { "Laurna Clairematin", "Laurna Morninglight", 1438, 55.6, 56.7 }, r = { "Prêtresse Alathea", "Priestess Alathea", 1457, 39.5, 81.2 } }
D[5676] = { t = "Retour d’information de l’Arcane", nv = 20, min = 20, te = "Arcane Feedback", g = { "Frère Joshua", "Brother Joshua", 1453, 49.5, 45.2 }, r = { "Grande prêtresse Laurena", "High Priestess Laurena", 1453, 49.5, 44.6 } }
D[5713] = { t = "Un tir. Un tué.", nv = 15, min = 10, te = "One Shot. One Kill.", g = { "Sentinelle Aynasha", "Sentinel Aynasha", 1439, 45.9, 90.3 } }
D[5741] = { t = "Sceptre de lumière", nv = 33, min = 30, te = "Sceptre of Light", g = { "Azore Aldamort", "Azore Aldamort", 1443, 38.9, 27.2 }, r = { "Azore Aldamort", "Azore Aldamort", 1443, 38.9, 27.2 }, c = { 1443, 55.2, 30.1 }, obj = "Rapporter Sceptre de lumière", oe = "Bring Sceptre of Light" }
D[5742] = { t = "Rédemption", nv = 56, min = 52, te = "Redemption", g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 } }
D[5762] = { t = "Hemet Nesingwary junior", nv = 31, min = 28, te = "Hemet Nesingwary", g = { "Kravel Koalbarbe", "Kravel Koalbeard", 1441, 78.1, 77.1 }, obj = "Rapporter Caisse de Kravel", oe = "Bring Kravel's Crate" }
D[5763] = { t = "Chasse à Strangleronce", nv = 31, min = 28, te = "Hunting in Stranglethorn", g = { "Roon Crin-sauvage", "Roon Wildmane", 1443, 25, 72.3 }, obj = "Rapporter Corne de kodo de Roon", oe = "Bring Roon's Kodo Horn" }
D[5781] = { t = "Aux mémoires perdues", nv = 57, min = 52, te = "Of Forgotten Memories", av = 5742, g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, obj = "Rapporter Marteau de Taelan", oe = "Bring Taelan's Hammer" }
D[5801] = { t = "Forgée dans la Fournaise", nv = 57, min = 55, te = "Fire Plume Forged", av = 5538, g = { "Froisse Bonnacier", "Krinkle Goodsteel", 1446, 50.2, 27.5 }, obj = "Rapporter Clé squelette inachevée", oe = "Bring Unfinished Skeleton Key" }
D[5802] = { t = "Forgée dans la Fournaise", nv = 57, min = 55, te = "Fire Plume Forged", av = 5514, g = { "Froisse Bonnacier", "Krinkle Goodsteel", 1446, 50.2, 27.5 }, obj = "Rapporter Clé squelette inachevée", oe = "Bring Unfinished Skeleton Key" }
D[5803] = { t = "Le Scarabée d'Araj", nv = 60, min = 55, te = "Araj's Scarab", av = 5801, g = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 }, r = { "Alchimiste Arbington", "Alchemist Arbington", 1422, 42.7, 84 }, obj = "Rapporter Scarabée d'Araj", oe = "Bring Araj's Scarab" }
D[5804] = { t = "Le Scarabée d'Araj", nv = 60, min = 55, te = "Araj's Scarab", av = 5802, g = { "Apothicaire Dithers", "Apothecary Dithers", 1422, 26.5, 56 }, r = { "Apothicaire Dithers", "Apothecary Dithers", 1422, 26.5, 56 }, obj = "Rapporter Scarabée d'Araj", oe = "Bring Araj's Scarab" }
D[5821] = { t = "On engage : gardes du corps", nv = 35, min = 30, te = "Bodyguard for Hire ", g = { "Cork Gizelton", "Cork Gizelton", 1443, 62.3, 39 }, r = { "Smeed Fouillevis", "Smeed Scrabblescrew", 1443, 60.9, 61.9 } }
D[5845] = { t = "De l'honneur perdu", nv = 58, min = 52, te = "Of Lost Honor", av = 5781, g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, obj = "Rapporter Symbole de l’honneur perdu", oe = "Bring Symbol of Lost Honor" }
D[5846] = { t = "L'amour et la famille", nv = 58, min = 52, te = "Of Love and Family", av = 5845, g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Artiste Renfray", "Artist Renfray", 1422, 65.8, 75.4 } }
D[5861] = { t = "Trouver Myranda", nv = 60, min = 52, te = "Find Myranda", av = 5848, g = { "Tirion Fordring", "Tirion Fordring", 1422, 67.3, 24.2 }, r = { "Myranda la Mégère", "Myranda the Hag", 1422, 49.2, 78.6 }, obj = "Rapporter Don de Tirion", oe = "Bring Tirion's Gift" }
D[5862] = { t = "Le subterfuge écarlate", nv = 60, min = 52, te = "Scarlet Subterfuge", av = 5861, g = { "Myranda la Mégère", "Myranda the Hag", 1422, 49.2, 78.6 }, r = { "Généralissime Taelan Fordring", "Highlord Taelan Fordring", 1422, 42, 14.8 }, obj = "Rapporter Don de Tirion", oe = "Bring Tirion's Gift" }
D[5863] = { t = "La base des Cognedunes", nv = 49, min = 44, te = "The Dunemaul Compound", g = { "Andi Lynn", "Andi Lynn", 1446, 50.2, 27.5 }, r = { "Andi Lynn", "Andi Lynn", 1446, 50.2, 27.5 }, c = { 1446, 39.9, 54.7 }, obj = "Vaincre 10 × Brute Cognedune ; Vaincre 10 × Massacreur Cognedune ; Vaincre Gor'marok le Ravageur", oe = "Kill 10 × Dunemaul Brute ; Kill 10 × Dunemaul Enforcer ; Kill Gor'marok the Ravager" }
D[5881] = { t = "Puiser dans les réserves", nv = 28, min = 23, te = "Calling in the Reserves", g = { "Maggran Lieur-de-terre", "Maggran Earthbinder", 1442, 45.9, 60.4 }, obj = "Rapporter Lettre de réserve de Maggran", oe = "Bring Maggran's Reserve Letter" }
D[5882] = { t = "Du baume en chassant", nv = 55, min = 48, te = "Salve via Hunting", av = 4101, g = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, r = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, obj = "Rapporter 6 × Fragment d'âme corrompue", oe = "Bring 6 × Corrupted Soul Shard" }
D[5883] = { t = "Du baume par la pioche", nv = 55, min = 48, te = "Salve via Mining", av = 4101, g = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, r = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, c = { 1448, 45.6, 14.2 }, obj = "Rapporter 4 × Vitriol contaminé", oe = "Bring 4 × Tainted Vitriol" }
D[5884] = { t = "Du baume contre une récolte", nv = 55, min = 48, te = "Salve via Gathering", av = 4101, g = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, r = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, c = { 1448, 49.4, 32.1 }, obj = "Rapporter 4 × Gangrimpante", oe = "Bring 4 × Fel Creep" }
D[5885] = { t = "Du baume contre des peaux", nv = 55, min = 48, te = "Salve via Skinning", av = 4101, g = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, r = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, obj = "Rapporter 5 × Morceau de peau contaminée", oe = "Bring 5 × Patch of Tainted Skin" }
D[5886] = { t = "Du baume contre des désenchantements", nv = 55, min = 48, te = "Salve via Disenchanting", av = 4101, g = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, r = { "Arathandris Argeciel", "Arathandris Silversky", 1448, 54.1, 86.8 }, obj = "Rapporter Essence du néant inférieure", oe = "Bring Lesser Nether Essence" }
D[5887] = { t = "Du baume en chassant", nv = 55, min = 48, te = "Salve via Hunting", av = 4102, g = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, r = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, obj = "Rapporter 6 × Fragment d'âme corrompue", oe = "Bring 6 × Corrupted Soul Shard" }
D[5888] = { t = "Du baume par la pioche", nv = 55, min = 48, te = "Salve via Mining", av = 4102, g = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, r = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, c = { 1448, 45.6, 14.2 }, obj = "Rapporter 4 × Vitriol contaminé", oe = "Bring 4 × Tainted Vitriol" }
D[5889] = { t = "Du baume contre une récolte", nv = 55, min = 48, te = "Salve via Gathering", av = 4102, g = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, r = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, c = { 1448, 49.4, 32.1 }, obj = "Rapporter 4 × Gangrimpante", oe = "Bring 4 × Fel Creep" }
D[5890] = { t = "Du baume contre des peaux", nv = 55, min = 48, te = "Salve via Skinning", av = 4102, g = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, r = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, obj = "Rapporter 5 × Morceau de peau contaminée", oe = "Bring 5 × Patch of Tainted Skin" }
D[5891] = { t = "Du baume contre des désenchantements", nv = 55, min = 48, te = "Salve via Disenchanting", av = 4102, g = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, r = { "Maybess Brise-des-rivières", "Maybess Riverbreeze", 1448, 46.7, 83.1 }, obj = "Rapporter Essence du néant inférieure", oe = "Bring Lesser Nether Essence" }
D[5901] = { t = "Une Plaie sur la Croisade", nv = 55, min = 48, te = "A Plague Upon Thee", g = { "Mickey Levine", "Mickey Levine", 1422, 26.5, 56 }, r = { "Mickey Levine", "Mickey Levine", 1422, 26.5, 56 }, obj = "Rapporter Pot de Termites vide ; Rapporter 100 × Termites des Maleterres", oe = "Bring Empty Termite Jar ; Bring 100 × Plagueland Termites" }
D[5902] = { t = "Une Plaie sur la Croisade", nv = 55, min = 48, te = "A Plague Upon Thee", av = 5901, g = { "Mickey Levine", "Mickey Levine", 1422, 26.5, 56 }, r = { "Tonneau de termites", "Termite Barrel", 1422, 48.3, 32 } }
D[5903] = { t = "Une Plaie sur la Croisade", nv = 55, min = 48, te = "A Plague Upon Thee", g = { "Nathaniel Dumah", "Nathaniel Dumah", 1422, 42.7, 84 }, r = { "Nathaniel Dumah", "Nathaniel Dumah", 1422, 42.7, 84 }, obj = "Rapporter Pot de Termites vide ; Rapporter 100 × Termites des Maleterres", oe = "Bring Empty Termite Jar ; Bring 100 × Plagueland Termites" }
D[5904] = { t = "Une Plaie sur la Croisade", nv = 55, min = 48, te = "A Plague Upon Thee", av = 5903, g = { "Nathaniel Dumah", "Nathaniel Dumah", 1422, 42.7, 84 }, r = { "Tonneau de termites", "Termite Barrel", 1422, 48.3, 32 } }
D[5921] = { t = "Reflet-de-Lune", nv = 10, min = 10, te = "Moonglade", g = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[5922] = { t = "Reflet-de-Lune", nv = 10, min = 10, te = "Moonglade", g = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[5923] = { t = "Écouter l'appel", nv = 10, min = 10, te = "Heeding the Call", g = { "Kal", "Kal", 1438, 56.1, 61.7 }, r = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 } }
D[5926] = { t = "Écouter l'appel", nv = 10, min = 10, te = "Heeding the Call", g = { "Gennia Totem-runique", "Gennia Runetotem", 1412, 46.5, 64.9 }, r = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 } }
D[5927] = { t = "Écouter l'appel", nv = 10, min = 10, te = "Heeding the Call", g = { "Gart Cours-la-brume", "Gart Mistrunner", 1412, 44.5, 77.5 } }
D[5929] = { t = "L'esprit du Grand ours", nv = 10, min = 10, te = "Great Bear Spirit", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[5930] = { t = "Esprit du Grand ours", nv = 10, min = 10, te = "Great Bear Spirit", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[5931] = { t = "Retour à Darnassus", nv = 10, min = 10, te = "Back to Darnassus", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 } }
D[5932] = { t = "Retour vers les Pitons-du-Tonnerre", nv = 10, min = 10, te = "Back to Thunder Bluff", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 } }
D[5941] = { t = "Retourner voir Chromie", nv = 60, min = 50, te = "Return to Chromie", av = 5206, g = { "Carlin Senterouge", "Carlin Redpath", 1423, 71.7, 50 }, obj = "Rapporter Liasse de reliques", oe = "Bring Bundle of Relics" }
D[5942] = { t = "Trésors cachés", nv = 60, min = 50, te = "Hidden Treasures", av = 5721, g = { "Pamela Senterouge", "Pamela Redpath", 1423, 31.2, 78 }, r = { "Coffre de Joseph", "Joseph's Chest", 1423, 31.2, 78 }, obj = "Rapporter Clé de Joseph", oe = "Bring Joseph's Key" }
D[5943] = { t = "La caravane de Gizelton", nv = 38, min = 32, te = "Gizelton Caravan", g = { "Gréeur Gizelton", "Rigger Gizelton", 1443, 62.3, 39 }, r = { "Smeed Fouillevis", "Smeed Scrabblescrew", 1443, 60.9, 61.9 } }
D[6001] = { t = "Corps et cœur", nv = 10, min = 10, te = "Body and Heart", g = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 }, r = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 } }
D[6002] = { t = "Corps et cœur", nv = 10, min = 10, te = "Body and Heart", g = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 }, r = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 } }
D[6004] = { t = "Un travail inachevé", nv = 56, min = 50, te = "Unfinished Business", g = { "Kirsta Fondombre", "Kirsta Deepshadow", 1422, 51.9, 28.1 }, r = { "Kirsta Fondombre", "Kirsta Deepshadow", 1422, 51.9, 28.1 }, c = { 1422, 50.7, 35.4 }, obj = "Vaincre 2 × Médecin écarlate ; Vaincre 2 × Chasseur écarlate ; Vaincre 2 × Mage écarlate ; Vaincre 2 × Chevalier écarlate", oe = "Kill 2 × Scarlet Medic ; Kill 2 × Scarlet Hunter ; Kill 2 × Scarlet Mage ; Kill 2 × Scarlet Knight" }
D[6021] = { t = "Zaeldarr le Banni", nv = 55, min = 50, te = "Zaeldarr the Outcast", g = { "Conservateur Alen", "Caretaker Alen", 1423, 69.9, 53.7 }, r = { "Conservateur Alen", "Caretaker Alen", 1423, 69.9, 53.7 }, c = { 1423, 23.1, 72.6 }, obj = "Rapporter Tête de Zaeldarr", oe = "Bring Zaeldarr's Head" }
D[6022] = { t = "Tuer utile", nv = 58, min = 54, te = "To Kill With Purpose", g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, obj = "Rapporter Pourriture coagulée", oe = "Bring Coagulated Rot" }
D[6023] = { t = "Un travail inachevé", nv = 57, min = 50, te = "Unfinished Business", av = 6004, g = { "Kirsta Fondombre", "Kirsta Deepshadow", 1422, 51.9, 28.1 }, r = { "Kirsta Fondombre", "Kirsta Deepshadow", 1422, 51.9, 28.1 }, c = { 1422, 57.8, 36.1 }, obj = "Vaincre Veneur Radley ; Vaincre Cavalier Durgen", oe = "Kill Huntsman Radley ; Kill Cavalier Durgen" }
D[6024] = { t = "L'appel d'Hameya", nv = 60, min = 54, te = "Hameya's Plea", g = { "Parchemin déchiré", "Torn Scroll", 1423, 22.9, 73 }, r = { "Monticule de poussière", "Mound of Dirt", 1423, 22.9, 73 }, c = { 1423, 62, 11.1 }, obj = "Rapporter Clé d'Hameya", oe = "Bring Hameya's Key" }
D[6025] = { t = "Un travail inachevé", nv = 58, min = 50, te = "Unfinished Business", av = 6023, g = { "Kirsta Fondombre", "Kirsta Deepshadow", 1422, 51.9, 28.1 }, r = { "Kirsta Fondombre", "Kirsta Deepshadow", 1422, 51.9, 28.1 } }
D[6026] = { t = "Voilà qui est beaucoup demander", nv = 58, min = 54, te = "That's Asking A Lot", g = { "Smokey LaRue", "Smokey LaRue", 1423, 71.7, 50 }, r = { "Smokey LaRue", "Smokey LaRue", 1423, 71.7, 50 }, obj = "Rapporter 2 × Barre de thorium ; Rapporter Bâtonnet doré ; Rapporter 8 × Bombe explosive ; Rapporter 8 × Déclencheur instable", oe = "Bring 2 × Thorium Bar ; Bring Golden Rod ; Bring 8 × Hi-Explosive Bomb ; Bring 8 × Unstable Trigger" }
D[6027] = { t = "Le livre des Anciens", nv = 38, min = 30, te = "Book of the Ancients", av = 5741, g = { "Azore Aldamort", "Azore Aldamort", 1443, 38.9, 27.2 }, r = { "Azore Aldamort", "Azore Aldamort", 1443, 38.9, 27.2 }, obj = "Rapporter Livre des Anciens ; Rapporter Gemme du serpent", oe = "Bring Book of the Ancients ; Bring Gem of the Serpent" }
D[6028] = { t = "Le rapport de Long-Guet", nv = 52, min = 50, te = "The Everlook Report", g = { "Gregor Grispierre", "Gregor Greystone", 1452, 61.9, 38.3 }, obj = "Rapporter Rapport de Long-guet", oe = "Bring Everlook Report" }
D[6029] = { t = "Le rapport de Long-Guet", nv = 52, min = 50, te = "The Everlook Report", g = { "Gregor Grispierre", "Gregor Greystone", 1452, 61.9, 38.3 }, obj = "Rapporter Rapport de Long-guet", oe = "Bring Everlook Report" }
D[6030] = { t = "Le duc Nicholas Zverenhoff", nv = 52, min = 50, te = "Duke Nicholas Zverenhoff", g = { "Gregor Grispierre", "Gregor Greystone", 1452, 61.9, 38.3 }, obj = "Rapporter Etudes sur la langue des Esprits", oe = "Bring Studies in Spirit Speaking" }
D[6041] = { t = "Quand Smokey chante, je deviens violent", nv = 58, min = 54, te = "When Smokey Sings, I Get Violent", av = 6026, g = { "Smokey LaRue", "Smokey LaRue", 1423, 71.7, 50 }, r = { "Smokey LaRue", "Smokey LaRue", 1423, 71.7, 50 }, c = { 1423, 25.7, 22.2 }, obj = "Vaincre 8 × Bâtiment du Fléau", oe = "Kill 8 × Scourge Structure" }
D[6042] = { t = "Les petits soucis de la non-vie", nv = 58, min = 54, te = "Un-Life's Little Annoyances", g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, c = { 1423, 45.3, 50.1 }, obj = "Vaincre 20 × Chauve-souris pestiférée nocive ; Vaincre 10 × Chauve-souris pestiférée monstrueuse", oe = "Kill 20 × Noxious Plaguebat ; Kill 10 × Monstrous Plaguebat" }
D[6061] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", g = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, r = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6062] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", g = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, r = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6063] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", g = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, r = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6064] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", g = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, r = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6065] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Kary Corne-tonnerre", "Kary Thunderhorn", 1456, 58.5, 88.3 }, r = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.9, 59.6 } }
D[6066] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Lanka Vise-loin", "Lanka Farshot", 1412, 44.5, 77.5 }, r = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 } }
D[6067] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Thotar", "Thotar", 1411, 51.9, 43.5 } }
D[6068] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Jen'shan", "Jen'shan", 1411, 42.1, 68.3 }, r = { "Thotar", "Thotar", 1411, 51.9, 43.5 } }
D[6071] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Jocaste", "Jocaste", 1457, 40.4, 8.5 }, r = { "Dazalar", "Dazalar", 1438, 56.7, 59.5 } }
D[6072] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Ayanna Vassanfin", "Ayanna Everstride", 1438, 58.7, 44.3 }, r = { "Dazalar", "Dazalar", 1438, 56, 57.3 } }
D[6074] = { t = "La voie du chasseur", nv = 10, min = 10, te = "The Hunter's Path", g = { "Thorgas Grimson", "Thorgas Grimson", 1426, 29.7, 71.3 }, r = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 } }
D[6081] = { t = "Entraîner la bête", nv = 10, min = 10, te = "Training the Beast", av = 6082, g = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, r = { "Ormak Trait-sinistre", "Ormak Grimshot", 1454, 66, 18.5 } }
D[6082] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6083, g = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, r = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6083] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6062, g = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, r = { "Thotar", "Thotar", 1411, 51.9, 43.5 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6084] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6064, g = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, r = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6085] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6084, g = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, r = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6086] = { t = "Entraîner la bête", nv = 10, min = 10, te = "Training the Beast", av = 6085, g = { "Grif Cœur-sauvage", "Grif Wildheart", 1426, 46.7, 53.8 }, r = { "Belia Tonnegranit", "Belia Thundergranite", 1455, 70.9, 85.8 } }
D[6087] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6061, g = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, r = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6088] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6087, g = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, r = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6089] = { t = "Entraîner la bête", nv = 10, min = 10, te = "Training the Beast", av = 6088, g = { "Yaw Crin-tranchant", "Yaw Sharpmane", 1412, 46.2, 60.8 }, r = { "Holt Corne-tonnerre", "Holt Thunderhorn", 1456, 57.3, 89.8 } }
D[6101] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6063, g = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, r = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6102] = { t = "Dompter la bête", nv = 10, min = 10, te = "Taming the Beast", av = 6101, g = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, r = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, obj = "Rapporter Bâtonnet de domptage", oe = "Bring Taming Rod" }
D[6103] = { t = "Entraîner la bête", nv = 10, min = 10, te = "Training the Beast", av = 6102, g = { "Dazalar", "Dazalar", 1438, 56, 57.3 }, r = { "Jocaste", "Jocaste", 1457, 40.4, 8.5 } }
D[6121] = { t = "Nouvelles leçons", nv = 14, min = 14, te = "Lessons Anew", g = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[6122] = { t = "Le principe originel", nv = 14, min = 14, te = "The Principal Source", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Alanndarian Chantenuit", "Alanndarian Nightsong", 1439, 37.7, 40.7 }, obj = "Rapporter Fiole d'échantillon des Chutes de la Bondissante remplie", oe = "Bring Filled Cliffspring Falls Sampler" }
D[6123] = { t = "Rassembler les ingrédients du remède", nv = 14, min = 14, te = "Gathering the Cure", av = 6122, g = { "Alanndarian Chantenuit", "Alanndarian Nightsong", 1439, 37.4, 41.8 }, r = { "Alanndarian Chantenuit", "Alanndarian Nightsong", 1439, 37.4, 41.8 }, c = { 1439, 38.1, 86.7 }, obj = "Rapporter 5 × Terrestrine ; Rapporter 12 × Champignon lunaire", oe = "Bring 5 × Earthroot ; Bring 12 × Lunar Fungus" }
D[6124] = { t = "Soigner la maladie", nv = 14, min = 14, te = "Curing the Sick", av = 6123, g = { "Alanndarian Chantenuit", "Alanndarian Nightsong", 1439, 37.4, 41.8 }, obj = "Vaincre 10 × Daim soigné", oe = "Kill 10 × Cured Deer", r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[6125] = { t = "Pouvoir contre le poison", nv = 14, min = 14, te = "Power over Poison", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Mathrengyl Pasdelours", "Mathrengyl Bearwalker", 1457, 35.4, 8.4 } }
D[6126] = { t = "Nouvelles leçons", nv = 14, min = 14, te = "Lessons Anew", g = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 }, r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[6127] = { t = "Le principe originel", nv = 14, min = 14, te = "The Principal Source", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.3, 31.9 }, obj = "Rapporter Fiole d'échantillon du Pic de Brume-funeste remplie", oe = "Bring Filled Dreadmist Peak Sampler" }
D[6128] = { t = "Rassembler les ingrédients du remède", nv = 14, min = 14, te = "Gathering the Cure", av = 6127, g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, r = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, c = { 1413, 59.2, 44.6 }, obj = "Rapporter 5 × Terrestrine ; Rapporter 5 × Corne de kodo", oe = "Bring 5 × Earthroot ; Bring 5 × Kodo Horn" }
D[6129] = { t = "Soigner la maladie", nv = 14, min = 14, te = "Curing the Sick", av = 6128, g = { "Tonga Totem-runique", "Tonga Runetotem", 1413, 52.2, 31 }, obj = "Vaincre 10 × Gazelle soignée", oe = "Kill 10 × Cured Gazelle", r = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 } }
D[6130] = { t = "Pouvoir contre le poison", nv = 14, min = 14, te = "Power over Poison", g = { "Dendrite Brasétoile", "Dendrite Starblaze", 1450, 56.2, 30.6 }, r = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 } }
D[6132] = { t = "Faites-moi sortir de là !", nv = 39, min = 34, te = "Get Me Out of Here!", g = { "Melizza Razzkankan", "Melizza Brimbuzzle", 1443, 33.9, 53.5 }, r = { "Hornizz Razzkankan", "Hornizz Brimbuzzle", 1443, 47.8, 61.8 } }
D[6133] = { t = "L'ordre du seigneur forestier", nv = 60, min = 54, te = "The Ranger Lord's Behest", g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, c = { 1423, 45.7, 12.8 }, obj = "Rapporter Registre de Quel'Thalas ; Vaincre 8 × Eclaireur ; Vaincre 8 × Forestier ; Vaincre 8 × Bûcheron", oe = "Bring Quel'Thalas Registry ; Kill 8 × Pathstrider ; Kill 8 × Ranger ; Kill 8 × Woodsman" }
D[6134] = { t = "Chasse à l'ectoplasme", nv = 39, min = 34, te = "Ghost-o-plasm Round Up", g = { "Hornizz Razzkankan", "Hornizz Brimbuzzle", 1443, 47.8, 61.8 }, r = { "Hornizz Razzkankan", "Hornizz Brimbuzzle", 1443, 47.8, 61.8 }, obj = "Rapporter Caisse d'aimants fantômes ; Rapporter 8 × Fantôm-o-plasme", oe = "Bring Crate of Ghost Magnets ; Bring 8 × Ghost-o-plasm" }
D[6135] = { t = "Crépuscaile, oh comme je te hais !", nv = 60, min = 56, te = "Duskwing, Oh How I Hate Thee...", av = 6133, g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, c = { 1423, 26.1, 59 }, obj = "Rapporter Touffe de fourrure de Crépuscaile", oe = "Bring Patch of Duskwing's Fur" }
D[6136] = { t = "Le corpulent", nv = 60, min = 56, te = "The Corpulent One", g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, c = { 1423, 47.7, 24.9 }, obj = "Vaincre Creusechair", oe = "Kill Borelgore" }
D[6142] = { t = "Des praires comme appât", nv = 35, min = 31, te = "Clam Bait", g = { "Mai'Lahii", "Mai'Lahii", 1443, 25, 72.3 }, r = { "Mai'Lahii", "Mai'Lahii", 1443, 25, 72.3 }, c = { 1443, 21.4, 78.2 }, obj = "Rapporter 10 × Chair de praire", oe = "Bring 10 × Soft-shelled Clam Meat" }
D[6143] = { t = "D'autres poissons-chats à fouetter", nv = 36, min = 32, te = "Other Fish to Fry ", g = { "Drulzegar Krochekou", "Drulzegar Skraghook", 1443, 25, 72.3 }, r = { "Drulzegar Krochekou", "Drulzegar Skraghook", 1443, 25, 72.3 }, c = { 1443, 35.3, 20.7 }, obj = "Vaincre 7 × Myrmidon Ondulame ; Vaincre 7 × Naga Ondulame ; Vaincre 5 × Sorcière Ondulame", oe = "Kill 7 × Slitherblade Myrmidon ; Kill 7 × Slitherblade Naga ; Kill 5 × Slitherblade Sorceress" }
D[6144] = { t = "L'appel du commandement", nv = 60, min = 56, te = "The Call to Command", g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 } }
D[6146] = { t = "La ruse de Nathanos", nv = 60, min = 56, te = "Nathanos' Ruse", av = 6145, g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Seigneur croisé Valdelmar", "Crusader Lord Valdelmar", 1423, 75.2, 71.2 }, obj = "Rapporter Les ordres du Grand croisé", oe = "Bring The Grand Crusader's Command" }
D[6148] = { t = "L'Oracle écarlate, Demetria", nv = 60, min = 56, te = "The Scarlet Oracle, Demetria", av = 6147, g = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, r = { "Nathanos le Flétrisseur", "Nathanos Blightcaller", 1423, 22.2, 63.5 }, c = { 1423, 74.7, 71.6 }, obj = "Vaincre Demetria", oe = "Kill Demetria" }
D[6161] = { t = "Revendiquer le trésor de Rackmore !", nv = 36, min = 30, te = "Claim Rackmore's Treasure!", g = { "Journal de Rackmore", "Rackmore's Log", 1443, 36.1, 30.5 }, r = { "Coffre de Rackmore", "Rackmore's Chest", 1443, 30, 8.7 }, c = { 1443, 21.4, 78.2 }, obj = "Rapporter Clé d'argent de Rackmore ; Rapporter Clé d'or de Rackmore", oe = "Bring Rackmore's Silver Key ; Bring Rackmore's Golden Key" }
D[6162] = { t = "La dernière bataille d'un mari", nv = 51, min = 46, te = "A Husband's Last Battle", g = { "Dreka'Sur", "Dreka'Sur", 1448, 34.2, 52.3 }, r = { "Dreka'Sur", "Dreka'Sur", 1448, 34.2, 52.3 }, c = { 1448, 48.2, 94.3 }, obj = "Rapporter Griffe du Seigneur Ror", oe = "Bring Overlord Ror's Claw" }
D[6164] = { t = "Le livre de compte d'Augustus", nv = 55, min = 50, te = "Augustus' Receipt Book", g = { "Augustus le Touché", "Augustus the Touched", 1423, 11.4, 26.4 }, r = { "Augustus le Touché", "Augustus the Touched", 1423, 11.4, 26.4 }, c = { 1423, 14, 24.2 }, obj = "Rapporter Livre de compte d'Augustus", oe = "Bring Augustus' Receipt Book" }
D[6181] = { t = "Un message rapide", nv = 10, min = 10, te = "A Swift Message", g = { "Intendant Lewis", "Quartermaster Lewis", 1436, 56.3, 47.5 }, r = { "Thor", "Thor", 1436, 54, 53 }, obj = "Rapporter Note de Lewis", oe = "Bring Lewis' Note" }
D[6185] = { t = "Les Maleterres de l'Est", nv = 60, min = 56, te = "The Eastern Plagues", av = 6184, g = { "Flint Ombrelongue", "Flint Shadowmore", 1422, 42.7, 84 }, r = { "Flint Ombrelongue", "Flint Shadowmore", 1422, 42.7, 84 }, obj = "Rapporter Insigne du SI:7 (Rutger) ; Rapporter Insigne du SI:7 (Fredo) ; Rapporter Insigne du SI:7 (Turyen)", oe = "Bring SI:7 Insignia (Rutger) ; Bring SI:7 Insignia (Fredo) ; Bring SI:7 Insignia (Turyen)" }
D[6186] = { t = "La venue du Flétrisseur", nv = 60, min = 56, te = "The Blightcaller Cometh", av = 6185, g = { "Flint Ombrelongue", "Flint Shadowmore", 1422, 42.7, 84 } }
D[6281] = { t = "Continuer vers Hurlevent", nv = 10, min = 10, te = "Continue to Stormwind", av = 6181, g = { "Thor", "Thor", 1436, 54, 53 }, obj = "Rapporter Note de Lewis", oe = "Bring Lewis' Note" }
D[6282] = { t = "La menace des harpies", nv = 26, min = 18, te = "Harpies Threaten", g = { "Maggran Lieur-de-terre", "Maggran Earthbinder", 1442, 45.9, 60.4 }, r = { "Maggran Lieur-de-terre", "Maggran Earthbinder", 1442, 45.9, 60.4 }, c = { 1442, 32.6, 65.9 }, obj = "Vaincre 7 × Harpie Rougefurie ; Vaincre 7 × Embusquée Rougefurie ; Vaincre 7 × Tueuse Rougefurie ; Vaincre 7 × Volplume Rougefurie", oe = "Kill 7 × Bloodfury Harpy ; Kill 7 × Bloodfury Ambusher ; Kill 7 × Bloodfury Slayer ; Kill 7 × Bloodfury Roguefeather" }
D[6283] = { t = "La lignée Rougefurie", nv = 26, min = 18, te = "Bloodfury Bloodline", av = 6282, g = { "Maggran Lieur-de-terre", "Maggran Earthbinder", 1442, 45.9, 60.4 }, r = { "Maggran Lieur-de-terre", "Maggran Earthbinder", 1442, 45.9, 60.4 }, c = { 1442, 30.8, 61.9 }, obj = "Rapporter Cadavre de Déchiqueteuse Rougefurie", oe = "Bring Bloodfury Ripper's Remains" }
D[6284] = { t = "Arachnophobie", nv = 21, min = 15, te = "Arachnophobia", g = { "Avis de recherche : Besseleth", "Wanted Poster: Besseleth", 1442, 59.1, 75.7 }, r = { "Maggran Lieur-de-terre", "Maggran Earthbinder", 1442, 45.9, 60.4 }, c = { 1442, 53.1, 72.5 }, obj = "Rapporter Croc de Besseleth", oe = "Bring Besseleth's Fang" }
D[6301] = { t = "Cycle de la renaissance", nv = 23, min = 17, te = "Cycle of Rebirth", g = { "Tammra Champ-des-vents", "Tammra Windfield", 1442, 45.9, 60.4 }, r = { "Tammra Champ-des-vents", "Tammra Windfield", 1442, 45.9, 60.4 }, c = { 1442, 48.8, 40.7 }, obj = "Rapporter 10 × Graine de Gaea", oe = "Bring 10 × Gaea Seed" }
D[6321] = { t = "Approvisionner Brill", nv = 10, min = 10, te = "Supplying the Sepulcher", g = { "Nécrogarde Podrig", "Deathguard Podrig", 1421, 44.2, 39.8 }, r = { "Karos Razok", "Karos Razok", 1421, 44.2, 39.8 }, obj = "Rapporter Ordre de Podrig", oe = "Bring Podrig's Order" }
D[6323] = { t = "Voyage vers Fossoyeuse", nv = 10, min = 10, te = "Ride to the Undercity", av = 6321, g = { "Karos Razok", "Karos Razok", 1421, 44.2, 39.8 }, obj = "Rapporter Ordre de Podrig", oe = "Bring Podrig's Order" }
D[6341] = { t = "Dolanaar-Darnassus sans escale", nv = 10, min = 10, te = "The Bounty of Teldrassil", av = 6344, g = { "Nessa Chantelombre", "Nessa Shadowsong", 1438, 56.3, 92.4 }, r = { "Vesprystus", "Vesprystus", 1438, 56.3, 92.4 }, obj = "Rapporter Collection de Nessa", oe = "Bring Nessa's Collection" }
D[6342] = { t = "Le présent inattendu", nv = 10, min = 10, te = "Flight to Auberdine", av = 6341, g = { "Vesprystus", "Vesprystus", 1438, 56.3, 92.4 }, obj = "Rapporter Collection de Nessa", oe = "Bring Nessa's Collection" }
D[6343] = { t = "Retourner voir Nyoma", nv = 10, min = 10, te = "Return to Nessa", av = 6342, g = { "Laird", "Laird", 1439, 37.4, 41.8 }, obj = "Rapporter Réponse de Laird", oe = "Bring Laird's Response" }
D[6361] = { t = "Un tas de peaux", nv = 10, min = 10, te = "A Bundle of Hides", g = { "Jahan Aile-de-faucon", "Jahan Hawkwing", 1413, 52.2, 31 }, r = { "Devrak", "Devrak", 1413, 52.2, 31 }, obj = "Rapporter Tas de peaux", oe = "Bring Bundle of Hides" }
D[6362] = { t = "Voyage vers les Pitons-du-Tonnerre", nv = 10, min = 10, te = "Ride to Thunder Bluff", av = 6361, g = { "Devrak", "Devrak", 1413, 52.2, 31 }, obj = "Rapporter Tas de peaux", oe = "Bring Bundle of Hides" }
D[6365] = { t = "De la viande pour Orgrimmar", nv = 10, min = 10, te = "Meats to Orgrimmar", g = { "Zargh", "Zargh", 1413, 52.2, 31 }, r = { "Devrak", "Devrak", 1413, 52.2, 31 }, obj = "Rapporter Chair de Zargh", oe = "Bring Zargh's Meats" }
D[6381] = { t = "Nouvelle vie", nv = 25, min = 17, te = "New Life", av = 6301, g = { "Tammra Champ-des-vents", "Tammra Windfield", 1442, 45.9, 60.4 }, r = { "Tammra Champ-des-vents", "Tammra Windfield", 1442, 45.9, 60.4 }, c = { 1442, 33.4, 68.1 }, obj = "Rapporter Graines de Gaea enchantées ; Utiliser Graine de Gaea enchantée sur 10 × Monticule de poussière de Gaïa", oe = "Bring Enchanted Gaea Seeds ; Use Enchanted Gaea Seed on 10 × Gaea Dirt Mound" }
D[6382] = { t = "La Chasse d'Orneval", nv = 20, min = 20, te = "The Ashenvale Hunt", g = { "Jorn Oeil-des-cieux", "Jorn Skyseer", 1413, 44.9, 59.1 } }
D[6383] = { t = "La Chasse d'Orneval", nv = 20, min = 20, te = "The Ashenvale Hunt", g = { "Senani Cœur-de-tonnerre", "Senani Thunderheart", 1440, 73.7, 60 }, r = { "Senani Cœur-de-tonnerre", "Senani Thunderheart", 1440, 73.7, 60 } }
D[6384] = { t = "Trajet vers Orgrimmar", nv = 10, min = 10, te = "Ride to Orgrimmar", av = 6365, g = { "Devrak", "Devrak", 1413, 52.2, 31 }, obj = "Rapporter Chair de Zargh", oe = "Bring Zargh's Meats" }
D[6387] = { t = "L'honneur des étudiants", nv = 10, min = 10, te = "Honor Students", g = { "Brock Cherchepierre", "Brock Stoneseeker", 1432, 34.8, 49.3 }, r = { "Thorgrum Borrelson", "Thorgrum Borrelson", 1432, 34.8, 49.3 }, obj = "Rapporter Liste de Brock", oe = "Bring Brock's List" }
D[6389] = { t = "Une Plaie sur la Croisade", nv = 55, min = 48, te = "A Plague Upon Thee", av = 5904, g = { "Tonneau de termites", "Termite Barrel", 1422, 48.3, 32 }, r = { "Nathaniel Dumah", "Nathaniel Dumah", 1422, 42.7, 84 }, obj = "Rapporter Tonneau de termites des Maleterres", oe = "Bring Barrel of Plagueland Termites" }
D[6390] = { t = "Une Plaie sur la Croisade", nv = 55, min = 48, te = "A Plague Upon Thee", av = 5902, g = { "Tonneau de termites", "Termite Barrel", 1422, 48.3, 32 }, r = { "Mickey Levine", "Mickey Levine", 1422, 26.5, 56 }, obj = "Rapporter Tonneau de termites des Maleterres", oe = "Bring Barrel of Plagueland Termites" }
D[6391] = { t = "Voyage vers Forgefer", nv = 10, min = 10, te = "Ride to Ironforge", av = 6387, g = { "Thorgrum Borrelson", "Thorgrum Borrelson", 1432, 34.8, 49.3 }, obj = "Rapporter Liste de Brock", oe = "Bring Brock's List" }
D[6393] = { t = "Guerre élémentaire", nv = 25, min = 19, te = "Elemental War", g = { "Tsunaman", "Tsunaman", 1442, 47.4, 64.2 }, r = { "Tsunaman", "Tsunaman", 1442, 47.4, 64.2 }, c = { 1442, 32.4, 67.5 }, obj = "Rapporter 10 × Incendrites", oe = "Bring 10 × Incendrites" }
D[6394] = { t = "La pioche de Thazz'ril", nv = 4, min = 3, te = "Thazz'ril's Pick", av = 5441, g = { "Contremaître Thazz'ril", "Foreman Thazz'ril", 1411, 42.1, 68.3 }, r = { "Contremaître Thazz'ril", "Foreman Thazz'ril", 1411, 42.1, 68.3 }, c = { 1411, 43.7, 53.8 }, obj = "Rapporter Pioche de Thazz'ril", oe = "Bring Thazz'ril's Pick" }
D[6395] = { t = "La dernière volonté de Marla", nv = 5, min = 3, te = "Marla's Last Wish", av = 376, g = { "Novice Elreth", "Novice Elreth", 1420, 30.8, 66.2 }, r = { "Novice Elreth", "Novice Elreth", 1420, 30.8, 66.2 }, c = { 1420, 31.2, 65.1 }, obj = "Utiliser Enterrer le Cadavre de Samuel sur Tombe de Marla", oe = "Use Bury Samuel's Remains on Marla's Grave" }
D[6401] = { t = "Kaya est en vie", nv = 18, min = 12, te = "Kaya's Alive", av = 6523, g = { "Makaba Sabot-plat", "Makaba Flathoof", 1442, 85.9, 97.9 }, r = { "Tammra Champ-des-vents", "Tammra Windfield", 1442, 45.9, 60.4 } }
D[6421] = { t = "Le ravin des Éboulis", nv = 18, min = 14, te = "Boulderslide Ravine", g = { "Mor'rogal", "Mor'rogal", 1442, 45.9, 60.4 }, r = { "Mor'rogal", "Mor'rogal", 1442, 45.9, 60.4 }, obj = "Rapporter 10 × Cristal de résonite", oe = "Bring 10 × Resonite Crystal" }
D[6441] = { t = "Cornes de satyre", nv = 26, min = 21, te = "Satyr Horns", g = { "Pixel", "Pixel", 1440, 73.7, 60 }, r = { "Pixel", "Pixel", 1440, 73.7, 60 }, c = { 1440, 80.2, 48.1 }, obj = "Rapporter 16 × Cornes de satyre", oe = "Bring 16 × Satyr Horns" }
D[6442] = { t = "Des nagas sur la grève de Zoram", nv = 19, min = 14, te = "Naga at the Zoram Strand", g = { "Marukai", "Marukai", 1440, 11.9, 34.5 }, r = { "Marukai", "Marukai", 1440, 11.9, 34.5 }, c = { 1440, 13.2, 23.3 }, obj = "Rapporter 20 × Tête d'Irequeue", oe = "Bring 20 × Wrathtail Head" }
D[6461] = { t = "Suceurs de sang", nv = 19, min = 13, te = "Blood Feeders", g = { "Xen'Zilla", "Xen'Zilla", 1442, 71.2, 95 }, r = { "Xen'Zilla", "Xen'Zilla", 1442, 71.2, 95 }, c = { 1442, 58.1, 76.5 }, obj = "Vaincre 10 × Rampant des mousses profondes ; Vaincre 7 × Venimeux des mousses profondes", oe = "Kill 10 × Deepmoss Creeper ; Kill 7 × Deepmoss Venomspitter" }
D[6462] = { t = "Charme troll", nv = 24, min = 19, te = "Troll Charm", g = { "Mitsuwa", "Mitsuwa", 1440, 11.9, 34.5 }, r = { "Mitsuwa", "Mitsuwa", 1440, 11.9, 34.5 }, c = { 1440, 41.1, 33.4 }, obj = "Rapporter 8 × Charme troll", oe = "Bring 8 × Troll Charm" }
D[6481] = { t = "Un Terrestre se lève", nv = 20, min = 14, te = "Earthen Arise", av = 6421, g = { "Mor'rogal", "Mor'rogal", 1442, 45.9, 60.4 }, r = { "Mor'rogal", "Mor'rogal", 1442, 45.9, 60.4 }, obj = "Rapporter Cristal de résonite enchanté ; Vaincre Goggeroc", oe = "Bring Enchanted Resonite Crystal ; Kill Goggeroc" }
D[6482] = { t = "Liberté pour Ruul", nv = 24, min = 19, te = "Freedom to Ruul", g = { "Ruul Sabot-de-neige", "Ruul Snowhoof", 1440, 41.5, 34.5 }, r = { "Yama Sabot-de-neige", "Yama Snowhoof", 1440, 73.7, 60 } }
D[6503] = { t = "Les estafettes d'Orneval", nv = 24, min = 19, te = "Ashenvale Outrunners", g = { "Kuray'bin", "Kuray'bin", 1440, 71.1, 68.1 }, r = { "Kuray'bin", "Kuray'bin", 1440, 71.1, 68.1 }, c = { 1440, 73.5, 73 }, obj = "Vaincre 9 × Estafette d'Orneval", oe = "Kill 9 × Ashenvale Outrunner" }
D[6504] = { t = "Les pages perdues", nv = 30, min = 23, te = "The Lost Pages", g = { "Gurda Ragentaille", "Gurda Ragescar", 1440, 71.1, 68.1 }, r = { "Gurda Ragentaille", "Gurda Ragescar", 1440, 71.1, 68.1 }, obj = "Rapporter Manuel d'utilisation du Déchiqueteur - Chapitre 1 ; Rapporter Manuel d'utilisation du Déchiqueteur - Chapitre 2 ; Rapporter Manuel d'utilisation du Déchiqueteur - Chapitre 3", oe = "Bring Shredder Operating Manual - Chapter 1 ; Bring Shredder Operating Manual - Chapter 2 ; Bring Shredder Operating Manual - Chapter 3" }
D[6523] = { t = "Protéger Kaya", nv = 18, min = 12, te = "Protect Kaya", g = { "Kaya Sabot-plat", "Kaya Flathoof", 1442, 73.5, 85.6 }, r = { "Makaba Sabot-plat", "Makaba Flathoof", 1442, 85.9, 97.9 } }
D[6541] = { t = "Rapport à Kadrak", nv = 19, min = 17, te = "Report to Kadrak", g = { "Thork", "Thork", 1413, 52.2, 31 }, r = { "Kadrak", "Kadrak", 1413, 48.1, 5.4 } }
D[6542] = { t = "Rapport à Kadrak", nv = 19, min = 17, te = "Report to Kadrak", g = { "Darn Poignegriffe", "Darn Talongrip", 1442, 74.5, 97.9 } }
D[6543] = { t = "Les rapports Chanteguerre", nv = 19, min = 17, te = "The Warsong Reports", g = { "Kadrak", "Kadrak", 1413, 48.1, 5.4 }, r = { "Kadrak", "Kadrak", 1413, 48.1, 5.4 }, obj = "Rapporter Mise à jour de l'Eclaireur chanteguerre ; Rapporter Mise à jour du Messager chanteguerre ; Rapporter Mise à jour du Voltigeur chanteguerre", oe = "Bring Warsong Scout Update ; Bring Warsong Runner Update ; Bring Warsong Outrider Update" }
D[6544] = { t = "L'assaut de Torek", nv = 24, min = 20, te = "Torek's Assault", g = { "Torek", "Torek", 1440, 68.3, 75.3 }, r = { "Ertog Ragembroche", "Ertog Ragetusk", 1440, 73.7, 60 } }
D[6548] = { t = "Vengez mon village !", nv = 18, min = 12, te = "Avenge My Village", g = { "Makaba Sabot-plat", "Makaba Flathoof", 1442, 85.9, 97.9 }, r = { "Makaba Sabot-plat", "Makaba Flathoof", 1442, 85.9, 97.9 }, c = { 1442, 80.7, 88.6 }, obj = "Vaincre 8 × Ruffian du Totem-sinistre ; Vaincre 6 × Mercenaire du Totem-sinistre", oe = "Kill 8 × Grimtotem Ruffian ; Kill 6 × Grimtotem Mercenary" }
D[6570] = { t = "Brandeguerre", nv = 60, min = 55, te = "Emberstrife", av = 6569, g = { "Myranda la Mégère", "Myranda the Hag", 1422, 49.2, 78.6 } }
D[6571] = { t = "Fournitures Chanteguerre", nv = 27, min = 22, te = "Warsong Supplies", g = { "Locke Okarr", "Locke Okarr", 1440, 71.1, 68.1 }, r = { "Locke Okarr", "Locke Okarr", 1440, 71.1, 68.1 }, c = { 1440, 36.7, 36.2 }, obj = "Rapporter Lames du clan Chanteguerre ; Rapporter Cargaison de haches des Chanteguerres ; Rapporter Huile des Chanteguerres ; Rapporter Corde de bûcheron", oe = "Bring Warsong Saw Blades ; Bring Warsong Axe Shipment ; Bring Warsong Oil ; Bring Logging Rope" }
D[6603] = { t = "Troubles au Berceau-de-l’Hiver", nv = 56, min = 52, te = "Trouble in Winterspring!", g = { "Meggi Bringueballot", "Meggi Peppinrocker", 1452, 61.9, 38.3 }, r = { "Donova Antreneige", "Donova Snowden", 1452, 31.3, 45.2 } }
D[6604] = { t = "Les Indomptables enragés", nv = 59, min = 53, te = "Enraged Wildkin", g = { "Harlo Valtrémousse", "Harlo Wigglesworth", 1452, 61.9, 38.3 }, r = { "Jaron Sculptepierre", "Jaron Stoneshaper", 1452, 52.1, 30.4 } }
D[6605] = { t = "Une étrange personne", nv = 54, min = 49, te = "A Strange One", g = { "Harlo Valtrémousse", "Harlo Wigglesworth", 1452, 61.9, 38.3 } }
D[6606] = { t = "Un peu de chance", nv = 60, min = 55, te = "A Little Luck", g = { "Harlo Valtrémousse", "Harlo Wigglesworth", 1452, 61.9, 38.3 }, r = { "Féticheuse Mau'ari", "Witch Doctor Mau'ari", 1452, 61.9, 38.3 } }
D[6607] = { t = "Nat Pagle, pêcheur de l'extrême", nv = 45, min = 35, te = "Nat Pagle, Angler Extreme", g = { "Nat Pagle", "Nat Pagle", 1445, 58.6, 60.1 }, r = { "Nat Pagle", "Nat Pagle", 1445, 58.6, 60.1 }, obj = "Rapporter Ahi de Feralas ; Rapporter Mahi Mahi de Brumejonc ; Rapporter Frappeur Sar'theris ; Rapporter Sailfin bleu de la Côte sauvage", oe = "Bring Feralas Ahi ; Bring Misty Reed Mahi Mahi ; Bring Sar'theris Striker ; Bring Savage Coast Blue Sailfin" }
D[6610] = { t = "La surprise de palourdes", nv = 45, min = 35, te = "Clamlette Surprise", g = { "Dirge Hachillico", "Dirge Quikcleave", 1446, 50.2, 27.5 }, r = { "Dirge Hachillico", "Dirge Quikcleave", 1446, 50.2, 27.5 }, c = { 1446, 72.9, 46.1 }, obj = "Rapporter 12 × Oeuf géant ; Rapporter 10 × Chair de palourde piquante ; Rapporter 20 × Emmental d'Alterac", oe = "Bring 12 × Giant Egg ; Bring 10 × Zesty Clam Meat ; Bring 20 × Alterac Swiss" }
D[6621] = { t = "Le roi des Vile-sylve", nv = 26, min = 21, te = "King of the Foulweald", av = 216, g = { "Karang Amakkar", "Karang Amakkar", 1440, 11.9, 34.5 }, r = { "Karang Amakkar", "Karang Amakkar", 1440, 11.9, 34.5 }, obj = "Rapporter Totem de Murgut", oe = "Bring Murgut's Totem" }
D[6622] = { t = "Triage", nv = 45, min = 35, g = { "Docteur Gregory Victor", "Doctor Gregory Victor", 1417, 73.8, 34 }, r = { "Docteur Gregory Victor", "Doctor Gregory Victor", 1417, 73.8, 34 } }
D[6624] = { t = "Triage", nv = 45, min = 35, g = { "Docteur Gustaf VanHowzen", "Doctor Gustaf VanHowzen", 1445, 66.3, 45.5 }, r = { "Docteur Gustaf VanHowzen", "Doctor Gustaf VanHowzen", 1445, 66.3, 45.5 } }
D[6627] = { t = "L'épreuve de la Connaissance", nv = 30, min = 25, te = "Test of Lore", av = 1154, g = { "Braug Esprit-troublé", "Braug Dimspirit", 1442, 78.8, 45.7 }, r = { "Braug Esprit-troublé", "Braug Dimspirit", 1442, 78.8, 45.7 } }
D[6629] = { t = "Tuer Grundig Noir-nuage", nv = 18, min = 12, te = "Kill Grundig Darkcloud", av = 6548, g = { "Makaba Sabot-plat", "Makaba Flathoof", 1442, 85.9, 97.9 }, r = { "Makaba Sabot-plat", "Makaba Flathoof", 1442, 85.9, 97.9 }, c = { 1442, 76.7, 86.4 }, obj = "Vaincre Grundig Noir-nuage ; Vaincre 6 × Brute du Totem-sinistre", oe = "Kill Grundig Darkcloud ; Kill 6 × Grimtotem Brute" }
D[6641] = { t = "Vorsha la Flagellante", nv = 23, min = 20, te = "Vorsha the Lasher", g = { "Muglash", "Muglash", 1440, 11.9, 34.5 }, r = { "Messager chanteguerre", "Warsong Runner", 1440, 11.9, 34.5 } }
D[6681] = { t = "Ravenholdt, le manoir", nv = 24, min = 24, te = "The Manor, Ravenholdt", r = { "Fahrad", "Fahrad", 1416, 84.4, 80.3 }, obj = "Rapporter Sceau de Ravenholdt ; Vaincre Ravenholdt", oe = "Bring Seal of Ravenholdt ; Kill Ravenholdt" }
D[6804] = { t = "Eau empoisonnée", nv = 56, min = 55, te = "Poisoned Water", g = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 }, r = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 }, obj = "Rapporter 12 × Bracelets discordants ; Rapporter Aspect de Neptulon", oe = "Bring 12 × Discordant Bracers ; Bring Aspect of Neptulon" }
D[6805] = { t = "Tempêtes", nv = 57, min = 55, te = "Stormers and Rumblers", g = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 }, r = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 }, obj = "Vaincre 15 × Tempétueux de poussière ; Vaincre 15 × Grondeur du désert", oe = "Kill 15 × Dust Stormer ; Kill 15 × Desert Rumbler" }
D[6823] = { t = "Agent de Hydraxis", nv = 60, min = 60, te = "Agent of Hydraxis", av = 6822, g = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 }, r = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 } }
D[6844] = { t = "Umber, Archiviste", nv = 57, min = 54, te = "Umber, Archivist", av = 1126, g = { "Layo Heurtétoile", "Layo Starstrike", 1451, 81.9, 18.9 }, obj = "Rapporter Objet silithide incrusté", oe = "Bring Encrusted Silithid Object" }
D[6845] = { t = "Les secrets du passé", nv = 57, min = 54, te = "Uncovering Past Secrets", av = 6844, g = { "Umber", "Umber", 1450, 44.9, 35.6 }, r = { "Rabine Saturna", "Rabine Saturna", 1450, 51.7, 45.1 } }
D[7003] = { t = "Géants rétrécis", nv = 48, min = 45, te = "Zapped Giants", g = { "Zorbin Poudrozieu", "Zorbin Fandazzle", 1444, 44.8, 43.4 }, r = { "Zorbin Poudrozieu", "Zorbin Fandazzle", 1444, 44.8, 43.4 }, obj = "Rapporter 15 × Résidus de miniaturisation", oe = "Bring 15 × Miniaturization Residue" }
D[7321] = { t = "Bisque de tortue apaisante", nv = 31, min = 28, te = "Soothing Turtle Bisque", g = { "Christoph Jeffcoat", "Christoph Jeffcoat", 1424, 62.3, 20.5 }, r = { "Christoph Jeffcoat", "Christoph Jeffcoat", 1424, 62.3, 20.5 }, c = { 1424, 66.7, 34.8 }, obj = "Rapporter 10 × Viande de tortue ; Rapporter Epices apaisantes", oe = "Bring 10 × Turtle Meat ; Bring Soothing Spices" }
D[7383] = { t = "Teldrassil : le fardeau des Kaldorei", nv = 11, min = 1, te = "Crown of the Earth", av = 933, g = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, r = { "Corithras Ragelune", "Corithras Moonrage", 1438, 56.1, 61.7 }, obj = "Rapporter Fiole d'améthyste remplie", oe = "Bring Filled Amethyst Phial" }
D[7463] = { t = "Rafraîchissement arcanique", nv = 60, min = 60, te = "Arcane Refreshment", obj = "Rapporter Essence d'Hydrogénos", oe = "Bring Hydrospawn Essence" }
D[7486] = { t = "La récompense du héros", nv = 60, min = 60, te = "A Hero's Reward", av = 6824, g = { "Duc Hydraxis", "Duke Hydraxis", 1447, 79.3, 73.7 }, r = { "Coffre d'Hydraxis", "Hydraxis' Coffer", 1447, 79.3, 73.7 } }
D[7498] = { t = "Garona : une étude en discrétion et en trahison", nv = 60, min = 54, te = "Garona: A Study on Stealth and Treachery", obj = "Rapporter Garona : une étude en discrétion et en trahison", oe = "Bring Garona: A Study on Stealth and Treachery" }
D[7499] = { t = "Le codex de défense", nv = 60, min = 54, te = "Codex of Defense", obj = "Rapporter Le codex de défense", oe = "Bring Codex of Defense" }
D[7500] = { t = "Les recettes de l’arcaniste", nv = 60, min = 54, te = "The Arcanist's Cookbook", obj = "Rapporter Les recettes de l’arcaniste", oe = "Bring The Arcanist's Cookbook" }
D[7501] = { t = "La lumière et comment l'altérer", nv = 60, min = 54, te = "The Light and How To Swing It", obj = "Rapporter La lumière et comment l'altérer", oe = "Bring The Light and How to Swing It" }
D[7502] = { t = "Contrôler les ombres", nv = 60, min = 54, te = "Harnessing Shadows", obj = "Rapporter Contrôler les ombres", oe = "Bring Harnessing Shadows" }
D[7503] = { t = "La plus grande race de chasseurs", nv = 60, min = 54, te = "The Greatest Race of Hunters", obj = "Rapporter La plus grande race de chasseurs", oe = "Bring The Greatest Race of Hunters" }
D[7504] = { t = "Sainte Bolognaise : Ce que la lumière ne vous dit pas", nv = 60, min = 54, te = "Holy Bologna: What the Light Won't Tell You", obj = "Rapporter Sainte Bolognaise : Ce que la lumière ne vous dit pas", oe = "Bring Holy Bologna: What the Light Won't Tell You" }
D[7505] = { t = "Le horion de givre et vous", nv = 60, min = 54, te = "Frost Shock and You", obj = "Rapporter Le Horion de givre et vous", oe = "Bring Frost Shock and You" }
D[7506] = { t = "Le Rêve d'Emeraude…", nv = 60, min = 54, te = "The Emerald Dream...", obj = "Rapporter Le Rêve d'Emeraude", oe = "Bring The Emerald Dream" }
D[7562] = { t = "Mor'zul Porte-sang", nv = 58, min = 60, te = "Mor'zul Bloodbringer", g = { "Crépi Roncebaie", "Spackle Thornberry", 1453, 39.5, 84.5 }, r = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 } }
D[7563] = { t = "Rage de sang", nv = 58, min = 60, te = "Rage of Blood", av = 7562, g = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, r = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, obj = "Rapporter 30 × Sang de bêtes enragées", oe = "Bring 30 × Raging Beast's Blood" }
D[7564] = { t = "Gorzeeki Fouregard", nv = 58, min = 60, te = "Wildeyes", av = 7563, g = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.7, 31.6 }, obj = "Rapporter Caisse de sang", oe = "Bring Case of Blood" }
D[7581] = { t = "Les ancrages de la prison", nv = 60, min = 60, te = "The Prison's Bindings", g = { "Daio le Décrépit", "Daio the Decrepit", 1419, 34.1, 50.1 }, r = { "Daio le Décrépit", "Daio the Decrepit", 1419, 34.1, 50.1 }, obj = "Rapporter 15 × Sang de satyre", oe = "Bring 15 × Satyr Blood" }
D[7582] = { t = "Les parois de la prison", nv = 60, min = 60, te = "The Prison's Casing", g = { "Daio le Décrépit", "Daio the Decrepit", 1419, 34.1, 50.1 }, r = { "Daio le Décrépit", "Daio the Decrepit", 1419, 34.1, 50.1 }, obj = "Rapporter 5 × Larmes de l'Hederine", oe = "Bring 5 × Tears of the Hederine" }
D[7583] = { t = "Suppression", nv = 60, min = 60, g = { "Daio le Décrépit", "Daio the Decrepit", 1419, 34.1, 50.1 }, r = { "Daio le Décrépit", "Daio the Decrepit", 1419, 34.1, 50.1 }, obj = "Rapporter Garde funeste emprisonné ; Rapporter Prison de cristal luminescente", oe = "Bring Imprisoned Doomguard ; Bring Glowing Crystal Prison" }
D[7601] = { t = "Les Commandements de Niby", nv = 50, min = 50, te = "What Niby Commands", g = { "Niby le Tout-puissant", "Niby the Almighty", 1448, 41.6, 45.1 }, r = { "Démonet", "Impsy", 1448, 41.6, 45.1 } }
D[7602] = { t = "La gangressence parfaite", nv = 55, min = 50, te = "Flawless Fel Essence", av = 7601, g = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, r = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, c = { 1448, 37.8, 50.4 }, obj = "Rapporter Gangressence parfaite (Azshara) ; Rapporter Gangressence parfaite (Jaedenar) ; Rapporter Gangressence parfaite (Porte des ténèbres)", oe = "Bring Flawless Fel Essence (Azshara) ; Bring Flawless Fel Essence (Jaedenar) ; Bring Flawless Fel Essence (Dark Portal)" }
D[7603] = { t = "Le noyau infernal de Kroshius", nv = 55, min = 50, te = "Kroshius' Infernal Core", av = 7602, g = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, r = { "Niby le Tout-puissant", "Niby the Almighty", 1448, 41.6, 45.1 }, c = { 1448, 45.3, 35.3 }, obj = "Rapporter Noyau infernal de Kroshius ; Vaincre Kroshius", oe = "Bring Kroshius' Infernal Core ; Kill Kroshius" }
D[7621] = { t = "Un avertissement", nv = 60, min = 60, te = "A Warning", g = { "Eris Havrefeu", "Eris Havenfire", 1423, 17.2, 12.8 }, r = { "Eris Havrefeu", "Eris Havenfire", 1423, 17.2, 12.8 } }
D[7622] = { t = "L’équilibre de la Lumière et de l’Ombre", nv = 60, min = 60, te = "The Balance of Light and Shadow", g = { "Eris Havrefeu", "Eris Havenfire", 1423, 17.2, 12.8 }, r = { "Eris Havrefeu", "Eris Havenfire", 1423, 17.2, 12.8 } }
D[7623] = { t = "Le seigneur Creuseplaie", nv = 58, min = 60, te = "Lord Banehollow", g = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.7, 31.6 }, r = { "Seigneur Creuseplaie", "Lord Banehollow", 1448, 35.9, 44.4 } }
D[7624] = { t = "Ulathek le traître", nv = 58, min = 60, te = "Ulathek the Traitor", g = { "Seigneur Creuseplaie", "Lord Banehollow", 1448, 35.9, 44.4 }, r = { "Seigneur Creuseplaie", "Lord Banehollow", 1448, 35.9, 44.4 }, obj = "Rapporter Le Coeur du traître", oe = "Bring The Traitor's Heart" }
D[7625] = { t = "Poussière d'étoile xorothienne", nv = 60, min = 60, te = "Xorothian Stardust", g = { "Seigneur Creuseplaie", "Lord Banehollow", 1448, 35.9, 44.4 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, obj = "Rapporter Poussière d'étoile xorothienne", oe = "Bring Xorothian Stardust" }
D[7626] = { t = "La Cloche de Dethmoora", nv = 60, min = 60, te = "Bell of Dethmoora", g = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, obj = "Rapporter 10 × Elixir de Puissance de l'ombre", oe = "Bring 10 × Elixir of Shadow Power" }
D[7627] = { t = "La Roue de la Marche noire", nv = 60, min = 60, te = "Wheel of the Black March", g = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, obj = "Rapporter 6 × Grand éclat brillant ; Rapporter 25 × Minerai de sombrefer", oe = "Bring 6 × Large Brilliant Shard ; Bring 25 × Dark Iron Ore" }
D[7628] = { t = "La Chandelle de l'apocalypse", nv = 60, min = 60, te = "Doomsday Candle", g = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, obj = "Rapporter 35 × Ecaille de dragon noir", oe = "Bring 35 × Black Dragonscale" }
D[7629] = { t = "Livraison de diablotin", nv = 60, min = 60, te = "Imp Delivery", g = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, obj = "Rapporter Diablotin en bouteille ; Vaincre J'eevee", oe = "Bring Imp in a Jar ; Kill J'eevee" }
D[7630] = { t = "L'arcanite", nv = 60, min = 60, te = "Arcanite", g = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, r = { "Gorzeeki Fouregard", "Gorzeeki Wildeyes", 1428, 12.4, 31.6 }, obj = "Rapporter 3 × Barre d'arcanite", oe = "Bring 3 × Arcanite Bar" }
D[7631] = { t = "Le destrier de l'effroi de Xoroth", nv = 60, min = 60, te = "Dreadsteed of Xoroth", g = { "Mor'zul Porte-sang", "Mor'zul Bloodbringer", 1428, 12.7, 31.6 }, obj = "Vaincre Destrier de l'effroi xorothien", oe = "Kill Xorothian Dreadsteed" }
D[7632] = { t = "La feuille ancienne", nv = 60, min = 60, te = "The Ancient Leaf", obj = "Rapporter Feuille ancienne pétrifiée", oe = "Bring Ancient Petrified Leaf" }
D[7633] = { t = "Une rencontre", nv = 60, min = 60, te = "An Introduction" }
D[7634] = { t = "Feuille d'Ancien cousue de tendons", nv = 60, min = 60, te = "Ancient Sinew Wrapped Lamina", obj = "Rapporter Tendon de dragon bleu adulte", oe = "Bring Mature Blue Dragon Sinew" }
D[7635] = { t = "La bonne corde", nv = 60, min = 60, te = "A Proper String", obj = "Rapporter Tendon de dragon noir adulte", oe = "Bring Mature Black Dragon Sinew" }
D[7636] = { t = "Le bâton des Anciens", nv = 60, min = 60, te = "Stave of the Ancients", obj = "Rapporter Tête de Simona ; Rapporter Tête de Klinfran ; Rapporter Tête de Solenor ; Rapporter Tête d'Artorius", oe = "Bring Simone's Head ; Bring Klinfran's Head ; Bring Solenor's Head ; Bring Artorius's Head" }
D[7637] = { t = "L'accent sur le sacrifice", nv = 60, min = 60, te = "Emphasis on Sacrifice", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, r = { "Grand prêtre Rohan", "High Priest Rohan", 1455, 24.7, 8.2 } }
D[7638] = { t = "Le seigneur Grayson Brisombre", nv = 60, min = 60, te = "Lord Grayson Shadowbreaker", g = { "Duthorian Rall", "Duthorian Rall", 1453, 50.5, 47.5 }, r = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 } }
D[7639] = { t = "Des preuves de jugement", nv = 60, min = 60, te = "To Show Due Judgment", g = { "Grand prêtre Rohan", "High Priest Rohan", 1455, 24.7, 8.2 }, r = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Encensoir d'exorcisme de Rohan", oe = "Bring Rohan's Exorcism Censer" }
D[7640] = { t = "Exorciser Val-Terreur", nv = 60, min = 60, te = "Exorcising Terrordale", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, r = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Encensoir d'exorcisme ; Vaincre 25 × Esprit de Val-Terreur", oe = "Bring Exorcism Censer ; Kill 25 × Terrordale Spirit" }
D[7641] = { t = "L'œuvre de Grimand Elmore", nv = 60, min = 60, te = "The Work of Grimand Elmore", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, r = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 } }
D[7642] = { t = "Une ribambelle d'objets", nv = 60, min = 60, te = "Collection of Goods", g = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, r = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, obj = "Rapporter 5 × Eau sacrée de Stratholme ; Rapporter 10 × Larmes d'Arthas ; Rapporter 40 × Etoffe runique ; Rapporter 6 × Barre d'arcanite", oe = "Bring 5 × Stratholme Holy Water ; Bring 10 × Arthas' Tears ; Bring 40 × Runecloth ; Bring 6 × Arcanite Bar" }
D[7643] = { t = "L'ancien esprit équin", nv = 60, min = 60, te = "Ancient Equine Spirit", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Caparaçon en arcanite ; Rapporter Fourrage enrichi en manne", oe = "Bring Arcanite Barding ; Bring Manna-Enriched Horse Feed" }
D[7644] = { t = "Le caparaçon en arcanite béni", nv = 60, min = 60, te = "Blessed Arcanite Barding", r = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Caparaçon en arcanite béni", oe = "Bring Blessed Arcanite Barding" }
D[7645] = { t = "Fourrage enrichi en manne", nv = 60, min = 60, te = "Manna-Enriched Horse Feed", g = { "Merideth Carlson", "Merideth Carlson", 1424, 52.2, 55.5 }, r = { "Merideth Carlson", "Merideth Carlson", 1424, 52.2, 55.5 }, obj = "Rapporter 20 × Biscuit enrichi en manne", oe = "Bring 20 × Enriched Manna Biscuit" }
D[7646] = { t = "Le Clairvoyant", nv = 60, min = 60, te = "The Divination Scryer", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, r = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Diamant d'Azeroth ; Rapporter Diamant noir parfait", oe = "Bring Azerothian Diamond ; Bring Pristine Black Diamond" }
D[7647] = { t = "Jugement et rédemption", nv = 60, min = 60, te = "Judgment and Redemption", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Âme rachetée du destrier ; Rapporter Caparaçon en arcanite béni", oe = "Bring Charger's Redeemed Soul ; Bring Blessed Arcanite Barding" }
D[7648] = { t = "Le chef-d'œuvre de Grimand", nv = 60, min = 60, te = "Grimand's Finest Work", g = { "Grimand Elmore", "Grimand Elmore", 1453, 59.7, 33.8 }, r = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, obj = "Rapporter Caparaçon en arcanite", oe = "Bring Arcanite Barding" }
D[7652] = { t = "Une affaire en thorium", nv = 60, min = 50, te = "A Blue Light Bargain", g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 } }
D[7653] = { t = "La ceinture impériale en plaques", nv = 60, min = 50, te = "Imperial Plate Belt", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 20 × Barre de thorium", oe = "Bring 20 × Thorium Bar" }
D[7654] = { t = "Les bottes impériales en plaques", nv = 60, min = 50, te = "Imperial Plate Boots", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 40 × Barre de thorium", oe = "Bring 40 × Thorium Bar" }
D[7655] = { t = "Les brassards impériaux en plaques", nv = 60, min = 50, te = "Imperial Plate Bracer", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 20 × Barre de thorium", oe = "Bring 20 × Thorium Bar" }
D[7656] = { t = "La pansière impériale", nv = 60, min = 50, te = "Imperial Plate Chest", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 60 × Barre de thorium", oe = "Bring 60 × Thorium Bar" }
D[7657] = { t = "Le heaume impérial en plaques", nv = 60, min = 50, te = "Imperial Plate Helm", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 50 × Barre de thorium", oe = "Bring 50 × Thorium Bar" }
D[7658] = { t = "Les jambières impériales en plaques", nv = 60, min = 50, te = "Imperial Plate Leggings", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 60 × Barre de thorium", oe = "Bring 60 × Thorium Bar" }
D[7659] = { t = "Les épaulières impériales en plaques", nv = 60, min = 50, te = "Imperial Plate Shoulders", av = 7652, g = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, r = { "Derotain Siroteboue", "Derotain Mudsipper", 1446, 50.2, 27.5 }, obj = "Rapporter 20 × Barre de thorium", oe = "Bring 20 × Thorium Bar" }
D[7667] = { t = "Assistance matérielle", nv = 60, min = 58, te = "Material Assistance", g = { "Sagorne Rôdeur-des-crêtes", "Sagorne Creststrider", 1454, 38.7, 35.9 }, r = { "Sagorne Rôdeur-des-crêtes", "Sagorne Creststrider", 1454, 38.7, 35.9 }, obj = "Rapporter Diamant d'Azeroth ; Rapporter Diamant noir parfait", oe = "Bring Azerothian Diamond ; Bring Pristine Black Diamond" }
D[7701] = { t = "ON RECHERCHE : Surveillant Maltorius", nv = 50, min = 45, te = "WANTED: Overseer Maltorius", g = { "Avis de recherche / Disparu / Trouvé & Perdu", "Wanted/Missing/Lost & Found", 1427, 41.1, 25.6 }, r = { "Capitaine de guet Lolo Heurteloin", "Lookout Captain Lolo Longstriker", 1427, 41.1, 25.6 }, c = { 1427, 40.8, 35.9 }, obj = "Rapporter Tête du surveillant Maltorius", oe = "Bring Head of Overseer Maltorius" }
D[7721] = { t = "Du carburant pour la zappette", nv = 48, min = 45, te = "Fuel for the Zapping", g = { "Zorbin Poudrozieu", "Zorbin Fandazzle", 1444, 44.8, 43.4 }, r = { "Zorbin Poudrozieu", "Zorbin Fandazzle", 1444, 44.8, 43.4 }, c = { 1444, 46.6, 53.1 }, obj = "Rapporter 10 × Noyau d'élémentaire d'eau", oe = "Bring 10 × Water Elemental Core" }
D[7722] = { t = "Le flux embrasé", nv = 50, min = 45, te = "What the Flux?", g = { "Maître forgeron Brûlotin", "Master Smith Burninate", 1427, 41.1, 25.6 }, r = { "Maître forgeron Brûlotin", "Master Smith Burninate", 1427, 41.1, 25.6 }, c = { 1427, 40.4, 35.7 }, obj = "Rapporter Plans secrets : Flux embrasé", oe = "Bring Secret Plans: Fiery Flux" }
D[7723] = { t = "Maudits gros doigts", nv = 49, min = 45, te = "Curse These Fat Fingers", g = { "Hansel Lourdemains", "Hansel Heavyhands", 1427, 41.1, 25.6 }, r = { "Hansel Lourdemains", "Hansel Heavyhands", 1427, 41.1, 25.6 }, c = { 1427, 37.3, 46.4 }, obj = "Vaincre 20 × Golem de guerre lourd", oe = "Kill 20 × Heavy War Golem" }
D[7724] = { t = "Une menace incandescente", nv = 49, min = 45, te = "Fiery Menace!", g = { "Hansel Lourdemains", "Hansel Heavyhands", 1427, 41.1, 25.6 }, r = { "Hansel Lourdemains", "Hansel Heavyhands", 1427, 41.1, 25.6 }, c = { 1427, 27.6, 71.2 }, obj = "Vaincre 20 × Grande araignée de lave", oe = "Kill 20 × Greater Lava Spider" }
D[7727] = { t = "Incendosaures ? N'importosaures, plutôt", nv = 49, min = 45, te = "Incendosaurs? Whateverosaur is More Like It", g = { "Hansel Lourdemains", "Hansel Heavyhands", 1427, 41.1, 25.6 }, r = { "Hansel Lourdemains", "Hansel Heavyhands", 1427, 41.1, 25.6 }, c = { 1427, 47.8, 26 }, obj = "Vaincre 20 × Incendosaure", oe = "Kill 20 × Incendosaur" }
D[7728] = { t = "OBJETS VOLES : Tuyère et longue-vue", nv = 48, min = 45, te = "STOLEN: Smithing Tuyere and Lookout's Spyglass", g = { "Avis de recherche / Disparu / Trouvé & Perdu", "Wanted/Missing/Lost & Found", 1427, 41.1, 25.6 }, r = { "Sous-chef Scrange", "Taskmaster Scrange", 1427, 41.1, 25.6 }, c = { 1427, 37.6, 51.1 }, obj = "Rapporter Tuyère de forge ; Rapporter Longue-vue de guetteur", oe = "Bring Smithing Tuyere ; Bring Lookout's Spyglass" }
D[7729] = { t = "OFFRE D'EMPLOI : Réduire la concurrence", nv = 48, min = 45, te = "JOB OPPORTUNITY: Culling the Competition", g = { "Avis de recherche / Disparu / Trouvé & Perdu", "Wanted/Missing/Lost & Found", 1427, 41.1, 25.6 }, r = { "Sous-chef Scrange", "Taskmaster Scrange", 1427, 41.1, 25.6 }, c = { 1427, 43.1, 34 }, obj = "Vaincre 15 × Sous-chef Sombrefer ; Vaincre 15 × Esclavagiste Sombrefer", oe = "Kill 15 × Dark Iron Taskmaster ; Kill 15 × Dark Iron Slaver" }
D[7730] = { t = "Infestation de Zukk'ash", nv = 45, min = 39, te = "Zukk'ash Infestation", av = 2903, g = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, r = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 75.4, 62.9 }, obj = "Rapporter 20 × Carapace de Zukk'ash", oe = "Bring 20 × Zukk'ash Carapace" }
D[7731] = { t = "Fouet-cuisant", nv = 47, min = 39, te = "Stinglasher", av = 2903, g = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, r = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 77, 61.6 }, obj = "Rapporter Glandes de Fouet-cuisant", oe = "Bring Stinglasher's Glands" }
D[7732] = { t = "Le rapport sur les Zukk'ash", nv = 48, min = 39, te = "Zukk'ash Report", g = { "Hadoken Rôdeur-agile", "Hadoken Swiftstrider", 1444, 74.4, 42.9 }, obj = "Rapporter Rapport sur les  Zukk'ash du camp Mojache", oe = "Bring Camp Mojache Zukk'ash Report" }
D[7733] = { t = "Qualité améliorée", nv = 48, min = 40, te = "Improved Quality", av = 2821, g = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, r = { "Pratt McGrubben", "Pratt McGrubben", 1444, 30.6, 42.7 }, c = { 1444, 53.1, 31.4 }, obj = "Rapporter 10 × Peau de yéti Griffe féroce", oe = "Bring 10 × Rage Scar Yeti Hide" }
D[7734] = { t = "Qualité améliorée", nv = 48, min = 40, te = "Improved Quality", av = 2822, g = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, r = { "Jangdor Rôdeur-agile", "Jangdor Swiftstrider", 1444, 74.4, 42.9 }, c = { 1444, 53.1, 31.4 }, obj = "Rapporter 10 × Peau de yéti Griffe féroce", oe = "Bring 10 × Rage Scar Yeti Hide" }
D[7815] = { t = "Les Gueules d'acier, l'ami !", nv = 50, min = 44, te = "Snapjaws, Mon!", g = { "Katoom le pêcheur", "Katoom the Angler", 1425, 80.3, 81.5 }, r = { "Katoom le pêcheur", "Katoom the Angler", 1425, 80.3, 81.5 }, c = { 1425, 80.8, 65.4 }, obj = "Vaincre 15 × Gueule d'acier des mers", oe = "Kill 15 × Saltwater Snapjaw" }
D[7816] = { t = "Gammerita, l'ami !", nv = 48, min = 44, te = "Gammerita, Mon!", av = 7815, g = { "Katoom le pêcheur", "Katoom the Angler", 1425, 80.3, 81.5 }, r = { "Katoom le pêcheur", "Katoom the Angler", 1425, 80.3, 81.5 }, c = { 1425, 80.4, 58.2 }, obj = "Rapporter Le meilleur appât de Katoom", oe = "Bring Katoom's Best Lure" }
D[7828] = { t = "Traquer les traqueurs", nv = 48, min = 44, te = "Stalking the Stalkers", g = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, r = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, c = { 1425, 69.8, 53.5 }, obj = "Vaincre 10 × Traqueur Crins-d'argent ; Vaincre 10 × Hurleur Crins-d'argent", oe = "Kill 10 × Silvermane Stalker ; Kill 10 × Silvermane Howler" }
D[7829] = { t = "Chasser les sauvages", nv = 48, min = 44, te = "Hunt the Savages", g = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, r = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, c = { 1425, 58.6, 47.6 }, obj = "Vaincre 20 × Chouettard sauvage", oe = "Kill 20 × Savage Owlbeast" }
D[7830] = { t = "Venger les victimes", nv = 48, min = 44, te = "Avenging the Fallen", g = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, r = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, c = { 1425, 63.8, 51.9 }, obj = "Rapporter Plume de Seigneur du ciel", oe = "Bring Skylord Plume" }
D[7839] = { t = "Les voyous vilebranches", nv = 48, min = 44, te = "Vilebranch Hooligans", g = { "Forgeron Boiscorie", "Smith Slagtree", 1425, 80.3, 81.5 }, r = { "Forgeron Boiscorie", "Smith Slagtree", 1425, 80.3, 81.5 }, c = { 1425, 70, 48.8 }, obj = "Rapporter Outils perdus de Slagtree", oe = "Bring Slagtree's Lost Tools" }
D[7840] = { t = "Lard a perdu son déjeuner !", nv = 49, min = 44, te = "Lard Lost His Lunch", g = { "Lard", "Lard", 1425, 80.3, 81.5 }, r = { "Lard", "Lard", 1425, 80.3, 81.5 }, obj = "Rapporter Repas de Lard", oe = "Bring Lard's Lunch" }
D[7844] = { t = "Les cousins cannibales", nv = 48, min = 44, te = "Cannibalistic Cousins", g = { "Yayo'jin la Mystique", "Mystic Yayo'jin", 1425, 80.3, 81.5 }, r = { "Yayo'jin la Mystique", "Mystic Yayo'jin", 1425, 80.3, 81.5 }, c = { 1425, 47.4, 66.2 }, obj = "Vaincre 30 × Scalpeur vilebranche ; Vaincre 15 × Devin vilebranche", oe = "Kill 30 × Vilebranch Scalper ; Kill 15 × Vilebranch Soothsayer" }
D[7845] = { t = "L’ancien Brocherompue a été enlevé !", nv = 51, min = 46, te = "Kidnapped Elder Torntusk!", g = { "L'Aînée Brocherompue", "Primal Torntusk", 1425, 80.3, 81.5 }, r = { "Ancien Brocherompue", "Elder Torntusk", 1425, 59.7, 77.8 } }
D[7846] = { t = "Récupérez la clé !", nv = 51, min = 46, te = "Recover the Key!", av = 7845, g = { "Ancien Brocherompue", "Elder Torntusk", 1425, 59.7, 77.8 }, r = { "Ancien Brocherompue", "Elder Torntusk", 1425, 59.7, 77.8 }, obj = "Rapporter Clé des menottes", oe = "Bring Shackle Key" }
D[7847] = { t = "Retourner voir l’Aînée Brocherompue", nv = 51, min = 46, te = "Return to Primal Torntusk", av = 7846, g = { "Ancien Brocherompue", "Elder Torntusk", 1425, 59.7, 77.8 }, r = { "L'Aînée Brocherompue", "Primal Torntusk", 1425, 80.3, 81.5 } }
D[7849] = { t = "L’angoisse de la séparation", nv = 50, min = 46, te = "Separation Anxiety", g = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, r = { "Veneur Markhor", "Huntsman Markhor", 1425, 80.3, 81.5 }, c = { 1425, 58.6, 64.8 }, obj = "Rapporter Crâne du veneur Malkhor ; Rapporter Os du veneur Malkhor", oe = "Bring Huntsman Malkhor's Skull ; Bring Huntsman Malkhor's Bones" }
D[7850] = { t = "Les calices ténébreux", nv = 50, min = 46, te = "Dark Vessels", g = { "L'Aînée Brocherompue", "Primal Torntusk", 1425, 80.3, 81.5 }, r = { "L'Aînée Brocherompue", "Primal Torntusk", 1425, 80.3, 81.5 }, c = { 1425, 63.1, 72.4 }, obj = "Rapporter 10 × Calice de sang corrompu", oe = "Bring 10 × Vessel of Tainted Blood" }
D[7861] = { t = "On recherche : La vile prêtresse Maléficia et ses sbires", nv = 51, min = 46, te = "Wanted: Vile Priestess Hexx and Her Minions", g = { "Aux armes !", "Call to Arms!", 1425, 80.3, 81.5 }, r = { "L'Aînée Brocherompue", "Primal Torntusk", 1425, 80.3, 81.5 }, c = { 1425, 59.2, 81.1 }, obj = "Vaincre Vile prêtresse Maléficia ; Vaincre 20 × Garde Aman'zasi vilebranche", oe = "Kill Vile Priestess Hexx ; Kill 20 × Vilebranch Aman'zasi Guard" }
D[7862] = { t = "Offre d’emploi : capitaine de la garde du village des Vengebroches", nv = 51, min = 46, te = "Job Opening: Guard Captain of Revantusk Village", g = { "Aux armes !", "Call to Arms!", 1425, 80.3, 81.5 }, r = { "L'Aînée Brocherompue", "Primal Torntusk", 1425, 80.3, 81.5 }, c = { 1425, 63.4, 72.9 }, obj = "Vaincre 20 × Berserker vilebranche ; Vaincre 20 × Chasseur des ombres vilebranche ; Vaincre 20 × Sanguinaire vilebranche ; Vaincre 20 × Mangeur d'âmes Vilebranche", oe = "Kill 20 × Vilebranch Berserker ; Kill 20 × Vilebranch Shadow Hunter ; Kill 20 × Vilebranch Blood Drinker ; Kill 20 × Vilebranch Soul Eater" }
D[7863] = { t = "Paquetage de base de sentinelle", nv = 34, min = 25, te = "Sentinel Basic Care Package", g = { "Illiyana Braselune", "Illiyana Moonblaze", 1440, 61.5, 83.9 }, r = { "Illiyana Braselune", "Illiyana Moonblaze", 1440, 61.5, 83.9 } }
D[8041] = { t = "La force du mont Mugamba", nv = 60, min = 60, te = "Strength of Mount Mugamba", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 } }
D[8042] = { t = "La force du mont Mugamba", nv = 60, min = 60, te = "Strength of Mount Mugamba", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Force de Mugamba", oe = "Bring Strength of Mugamba" }
D[8043] = { t = "La force du mont Mugamba", nv = 60, min = 60, te = "Strength of Mount Mugamba", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Force de Mugamba", oe = "Bring Strength of Mugamba" }
D[8044] = { t = "La rage de Mugamba", nv = 60, min = 60, te = "The Rage of Mount Mugamba", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Force de Mugamba", oe = "Bring Strength of Mugamba" }
D[8045] = { t = "La marque du païen", nv = 60, min = 60, te = "The Heathen's Brand", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 } }
D[8046] = { t = "La marque du païen", nv = 60, min = 60, te = "The Heathen's Brand", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Marque du païen", oe = "Bring Heathen's Brand" }
D[8047] = { t = "La marque du païen", nv = 60, min = 60, te = "The Heathen's Brand", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Marque du païen", oe = "Bring Heathen's Brand" }
D[8048] = { t = "La marque du héros", nv = 60, min = 60, te = "The Hero's Brand", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Marque du païen", oe = "Bring Heathen's Brand" }
D[8049] = { t = "L'œil de Zuldazar", nv = 60, min = 60, te = "The Eye of Zuldazar", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 } }
D[8050] = { t = "L'œil de Zuldazar", nv = 60, min = 60, te = "The Eye of Zuldazar", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter L'Oeil de Zuldazar", oe = "Bring The Eye of Zuldazar" }
D[8051] = { t = "L'œil de Zuldazar", nv = 60, min = 60, te = "The Eye of Zuldazar", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter L'Oeil de Zuldazar", oe = "Bring The Eye of Zuldazar" }
D[8052] = { t = "L'Œil omnivoyant de Zuldazar", nv = 60, min = 60, te = "The All-Seeing Eye of Zuldazar", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter L'Oeil de Zuldazar", oe = "Bring The Eye of Zuldazar" }
D[8053] = { t = "Parangons de puissance : les garde-bras de libre-penseur", nv = 61, min = 60, te = "Paragons of Power: The Freethinker's Armguards", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Manchettes primordiales hakkari", oe = "Bring Primal Hakkari Bindings" }
D[8054] = { t = "Parangons de puissance : la ceinture de libre-penseur", nv = 61, min = 60, te = "Paragons of Power: The Freethinker's Belt", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Châle primordial hakkari", oe = "Bring Primal Hakkari Shawl" }
D[8055] = { t = "Parangons de puissance : la cuirasse de libre-penseur", nv = 61, min = 60, te = "Paragons of Power: The Freethinker's Breastplate", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Tabard primordial hakkari", oe = "Bring Primal Hakkari Tabard" }
D[8056] = { t = "Parangons de puissance : les brassards d'augure", nv = 60, min = 60, te = "Paragons of Power: The Augur's Bracers", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Brachiales primordiales hakkari", oe = "Bring Primal Hakkari Armsplint" }
D[8057] = { t = "Parangons de puissance : les brassards d'haruspice", nv = 60, min = 60, te = "Paragons of Power: The Haruspex's Bracers", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Etançon primordial hakkari", oe = "Bring Primal Hakkari Stanchion" }
D[8058] = { t = "Parangons de puissance : les garde-bras de redresseur de torts", nv = 60, min = 60, te = "Paragons of Power: The Vindicator's Armguards", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Brachiales primordiales hakkari", oe = "Bring Primal Hakkari Armsplint" }
D[8059] = { t = "Parangons de puissance : les couvre-bras de démoniaque", nv = 60, min = 60, te = "Paragons of Power: The Demoniac's Wraps", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Etançon primordial hakkari", oe = "Bring Primal Hakkari Stanchion" }
D[8060] = { t = "Parangons de puissance : les couvre-bras d’illusionniste", nv = 60, min = 60, te = "Paragons of Power: The Illusionist's Wraps", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Manchettes primordiales hakkari", oe = "Bring Primal Hakkari Bindings" }
D[8061] = { t = "Parangons de puissance : les couvre-bras de confesseur", nv = 60, min = 60, te = "Paragons of Power: The Confessor's Wraps", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Etançon primordial hakkari", oe = "Bring Primal Hakkari Stanchion" }
D[8062] = { t = "Parangons de puissance : les brassards de prédateur", nv = 60, min = 60, te = "Paragons of Power: The Predator's Bracers", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Manchettes primordiales hakkari", oe = "Bring Primal Hakkari Bindings" }
D[8063] = { t = "Parangons de puissance : les brassards d'insensé", nv = 60, min = 60, te = "Paragons of Power: The Madcap's Bracers", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Brachiales primordiales hakkari", oe = "Bring Primal Hakkari Armsplint" }
D[8064] = { t = "Parangons de puissance : la ceinture d'haruspice", nv = 60, min = 60, te = "Paragons of Power: The Haruspex's Belt", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Echarpe primordiale hakkari", oe = "Bring Primal Hakkari Sash" }
D[8065] = { t = "Parangons de puissance : la tunique d'haruspice", nv = 60, min = 60, te = "Paragons of Power: The Haruspex's Tunic", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Tabard primordial hakkari", oe = "Bring Primal Hakkari Tabard" }
D[8066] = { t = "Parangons de puissance : la ceinture de prédateur", nv = 60, min = 60, te = "Paragons of Power: The Predator's Belt", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Châle primordial hakkari", oe = "Bring Primal Hakkari Shawl" }
D[8067] = { t = "Parangons de puissance : le mantelet de prédateur", nv = 60, min = 60, te = "Paragons of Power: The Predator's Mantle", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Egide primordiale hakkari", oe = "Bring Primal Hakkari Aegis" }
D[8068] = { t = "Parangons de puissance : le mantelet d’illusionniste", nv = 60, min = 60, te = "Paragons of Power: The Illusionist's Mantle", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Châle primordial hakkari", oe = "Bring Primal Hakkari Shawl" }
D[8069] = { t = "Parangons de puissance : la robe d’illusionniste", nv = 60, min = 60, te = "Paragons of Power: The Illusionist's Robes", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Casaque primordiale hakkari", oe = "Bring Primal Hakkari Kossack" }
D[8070] = { t = "Parangons de puissance : le cordon de confesseur", nv = 60, min = 60, te = "Paragons of Power: The Confessor's Bindings", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Echarpe primordiale hakkari", oe = "Bring Primal Hakkari Sash" }
D[8071] = { t = "Parangons de puissance : le mantelet de confesseur", nv = 60, min = 60, te = "Paragons of Power: The Confessor's Mantle", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Egide primordiale hakkari", oe = "Bring Primal Hakkari Aegis" }
D[8072] = { t = "Parangons de puissance : le mantelet d'insensé", nv = 60, min = 60, te = "Paragons of Power: The Madcap's Mantle", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Ceinturon primordial hakkari", oe = "Bring Primal Hakkari Girdle" }
D[8073] = { t = "Parangons de puissance : la tunique d'insensé", nv = 60, min = 60, te = "Paragons of Power: The Madcap's Tunic", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Egide primordiale hakkari", oe = "Bring Primal Hakkari Aegis" }
D[8074] = { t = "Parangons de puissance : la ceinture d'augure", nv = 60, min = 60, te = "Paragons of Power: The Augur's Belt", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Ceinturon primordial hakkari", oe = "Bring Primal Hakkari Girdle" }
D[8075] = { t = "Parangons de puissance : le haubert d'augure", nv = 60, min = 60, te = "Paragons of Power: The Augur's Hauberk", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Tabard primordial hakkari", oe = "Bring Primal Hakkari Tabard" }
D[8076] = { t = "Parangons de puissance : le mantelet de démoniaque", nv = 60, min = 60, te = "Paragons of Power: The Demoniac's Mantle", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Echarpe primordiale hakkari", oe = "Bring Primal Hakkari Sash" }
D[8077] = { t = "Parangons de puissance : la robe de démoniaque", nv = 60, min = 60, te = "Paragons of Power: The Demoniac's Robes", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Casaque primordiale hakkari", oe = "Bring Primal Hakkari Kossack" }
D[8078] = { t = "Parangons de puissance : la ceinture de redresseur de torts", nv = 60, min = 60, te = "Paragons of Power: The Vindicator's Belt", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Ceinturon primordial hakkari", oe = "Bring Primal Hakkari Girdle" }
D[8079] = { t = "Parangons de puissance : la cuirasse de redresseur de torts", nv = 60, min = 60, te = "Paragons of Power: The Vindicator's Breastplate", g = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, r = { "Jin'rokh le Briseur", "Jin'rokh the Breaker", 1434, 15.3, 14.4 }, obj = "Rapporter Casaque primordiale hakkari", oe = "Bring Primal Hakkari Kossack" }
D[8101] = { t = "Le caillou du Kajaro", nv = 60, min = 60, te = "The Pebble of Kajaro", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 } }
D[8102] = { t = "Le caillou du Kajaro", nv = 60, min = 60, te = "The Pebble of Kajaro", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Caillou de Kajaro", oe = "Bring Pebble of Kajaro" }
D[8103] = { t = "Le caillou du Kajaro", nv = 60, min = 60, te = "The Pebble of Kajaro", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Caillou de Kajaro", oe = "Bring Pebble of Kajaro" }
D[8104] = { t = "Le joyau du Kajaro", nv = 60, min = 60, te = "The Jewel of Kajaro", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Caillou de Kajaro", oe = "Bring Pebble of Kajaro" }
D[8106] = { t = "La souillure de Kezan", nv = 60, min = 60, te = "Kezan's Taint", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 } }
D[8107] = { t = "La souillure de Kezan", nv = 60, min = 60, te = "Kezan's Taint", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Souillure de Kezan", oe = "Bring Kezan's Taint" }
D[8108] = { t = "La souillure de Kezan", nv = 60, min = 60, te = "Kezan's Taint", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Souillure de Kezan", oe = "Bring Kezan's Taint" }
D[8109] = { t = "La souillure irrésistible de Kezan", nv = 60, min = 60, te = "Kezan's Unstoppable Taint", g = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, r = { "Al'tabim Qui-voit-tout", "Al'tabim the All-Seeing", 1434, 15.3, 16.1 }, obj = "Rapporter Souillure de Kezan", oe = "Bring Kezan's Taint" }
D[8110] = { t = "Le varech enchanté des mers du Sud", nv = 60, min = 60, te = "Enchanted South Seas Kelp", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 } }
D[8111] = { t = "Le varech enchanté des mers du Sud", nv = 60, min = 60, te = "Enchanted South Seas Kelp", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Varech enchanté des Mers du sud", oe = "Bring Enchanted South Seas Kelp" }
D[8112] = { t = "Le varech enchanté des mers du Sud", nv = 60, min = 60, te = "Enchanted South Seas Kelp", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Varech enchanté des Mers du sud", oe = "Bring Enchanted South Seas Kelp" }
D[8113] = { t = "Le varech enchanté des mers du Sud en parfait état", nv = 60, min = 60, te = "Pristine Enchanted South Seas Kelp", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Varech enchanté des Mers du sud", oe = "Bring Enchanted South Seas Kelp" }
D[8116] = { t = "Vision de Voodress", nv = 60, min = 60, te = "Vision of Voodress", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 } }
D[8117] = { t = "Vision de Voodress", nv = 60, min = 60, te = "Vision of Voodress", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Vision de Voodress", oe = "Bring Vision of Voodress" }
D[8118] = { t = "Vision de Voodress", nv = 60, min = 60, te = "Vision of Voodress", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Vision de Voodress", oe = "Bring Vision of Voodress" }
D[8119] = { t = "La vision limpide de Voodress", nv = 60, min = 60, te = "The Unmarred Vision of Voodress", g = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, r = { "Maywiki de Zuldazar", "Maywiki of Zuldazar", 1434, 15.3, 16 }, obj = "Rapporter Vision de Voodress", oe = "Bring Vision of Voodress" }
D[8141] = { t = "Le talisman de l'ombre zandalarien", nv = 60, min = 60, te = "Zandalarian Shadow Talisman", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 } }
D[8142] = { t = "Le talisman de l'ombre zandalarien", nv = 60, min = 60, te = "Zandalarian Shadow Talisman", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Talisman de l'ombre zandalarien", oe = "Bring Zandalarian Shadow Talisman" }
D[8143] = { t = "Le talisman de l'ombre zandalarien", nv = 60, min = 60, te = "Zandalarian Shadow Talisman", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Talisman de l'ombre zandalarien", oe = "Bring Zandalarian Shadow Talisman" }
D[8144] = { t = "Le talisman de maîtrise de l'ombre zandalarien", nv = 60, min = 60, te = "Zandalarian Shadow Mastery Talisman", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Talisman de l'ombre zandalarien", oe = "Bring Zandalarian Shadow Talisman" }
D[8145] = { t = "Les Vrilles du maelström", nv = 60, min = 60, te = "The Maelstrom's Tendril", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 } }
D[8146] = { t = "Les Vrilles du maelström", nv = 60, min = 60, te = "The Maelstrom's Tendril", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Vrille du maelström", oe = "Bring Maelstrom's Tendril" }
D[8147] = { t = "Les Vrilles du maelström", nv = 60, min = 60, te = "The Maelstrom's Tendril", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Vrille du maelström", oe = "Bring Maelstrom's Tendril" }
D[8148] = { t = "Le courroux du maelström", nv = 60, min = 60, te = "The Maelstrom's Wrath", g = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, r = { "Falthir le Sans-vue", "Falthir the Sightless", 1434, 14.1, 13.7 }, obj = "Rapporter Vrille du maelström", oe = "Bring Maelstrom's Tendril" }
D[8151] = { t = "Le charme du chasseur", nv = 52, min = 50, te = "The Hunter's Charm", g = { "Kary Corne-tonnerre", "Kary Thunderhorn", 1456, 58.5, 88.3 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 } }
D[8153] = { t = "La ramure de coursier", nv = 52, min = 50, te = "Courser Antlers", av = 8151, g = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, c = { 1447, 52.5, 24.5 }, obj = "Rapporter 2 × Ramure de coursier parfaite", oe = "Bring 2 × Perfect Courser Antler" }
D[8231] = { t = "Vandales des flots", nv = 52, min = 50, te = "Wavethrashing", av = 8153, g = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, c = { 1447, 87.6, 31.8 }, obj = "Rapporter 6 × Ecailles de vandale des flots", oe = "Bring 6 × Wavethrasher Scales" }
D[8232] = { t = "Le drake vert", nv = 52, min = 50, te = "The Green Drake", av = 8231, g = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, obj = "Rapporter Dent de Morphaz", oe = "Bring Tooth of Morphaz" }
D[8233] = { t = "Une requête toute simple", nv = 52, min = 50, te = "A Simple Request", g = { "Ormok", "Ormok", 1454, 43.9, 54.6 }, r = { "Seigneur Jorach Ravenholdt", "Lord Jorach Ravenholdt", 1416, 86, 78.9 } }
D[8234] = { t = "Sac azur scellé", nv = 52, min = 50, te = "Sealed Azure Bag", g = { "Seigneur Jorach Ravenholdt", "Lord Jorach Ravenholdt", 1416, 86, 78.9 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, obj = "Rapporter Sac azur scellé", oe = "Bring Sealed Azure Bag" }
D[8235] = { t = "Les fragments codés", nv = 52, min = 50, te = "Encoded Fragments", av = 8234, g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, c = { 1447, 41.1, 37.2 }, obj = "Rapporter 10 × Fragment codé", oe = "Bring 10 × Encoded Fragment" }
D[8236] = { t = "La clé d’azur", nv = 52, min = 50, te = "The Azure Key", av = 8235, g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, obj = "Rapporter Clé azur", oe = "Bring Azure Key", r = { "Seigneur Jorach Ravenholdt", "Lord Jorach Ravenholdt", 1416, 86, 78.9 } }
D[8249] = { t = "Demande de coffrets", nv = 60, min = 50, te = "Junkboxes Needed", g = { "Fahrad", "Fahrad", 1416, 84.4, 80.3 }, r = { "Fahrad", "Fahrad", 1416, 84.4, 80.3 }, obj = "Rapporter 5 × Coffret lourd", oe = "Bring 5 × Heavy Junkbox" }
D[8250] = { t = "L'art du mage", nv = 52, min = 50, te = "Magecraft", g = { "Thurston Xane", "Thurston Xane", 1456, 25.2, 21 }, r = { "Sanath Lim-Yo", "Sanath Lim-yo", 1447, 28.1, 50.1 } }
D[8251] = { t = "La poussière magique", nv = 52, min = 50, te = "Magic Dust", av = 8250, g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, c = { 1447, 57.2, 28.2 }, obj = "Rapporter 10 × Poussière lumineuse", oe = "Bring 10 × Glittering Dust" }
D[8252] = { t = "Le corail des sirènes", nv = 52, min = 50, te = "The Siren's Coral", av = 8251, g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, c = { 1447, 40.7, 53.7 }, obj = "Rapporter 6 × Corail enchanté", oe = "Bring 6 × Enchanted Coral" }
D[8253] = { t = "Détruire Morphaz", nv = 52, min = 50, te = "Destroy Morphaz", av = 8252, g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, obj = "Rapporter Fragment d'arcane", oe = "Bring Arcane Shard" }
D[8254] = { t = "Aider le Cercle", nv = 52, min = 50, te = "Cenarion Aid", g = { "Grande prêtresse Laurena", "High Priestess Laurena", 1453, 49.5, 44.6 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 } }
D[8255] = { t = "Courser les coursiers", nv = 52, min = 50, te = "Of Coursers We Know", av = 8254, g = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, c = { 1447, 52.5, 24.5 }, obj = "Rapporter 4 × Glande de coursier en bonne santé", oe = "Bring 4 × Healthy Courser Gland" }
D[8256] = { t = "L'ichor de non-mort", nv = 52, min = 50, te = "The Ichor of Undeath", av = 8255, g = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, r = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, obj = "Rapporter Ichor de non-mort", oe = "Bring Ichor of Undeath" }
D[8257] = { t = "Le sang de Morphaz", nv = 52, min = 50, te = "Blood of Morphaz", av = 8256, g = { "Ogtinc", "Ogtinc", 1447, 42.4, 42.6 }, obj = "Rapporter Sang de Morphaz", oe = "Bring Blood of Morphaz", r = { "Greta Sabot-de-mousse", "Greta Mosshoof", 1448, 51.2, 82.1 } }
D[8258] = { t = "La menace de Ravassombre", nv = 60, min = 60, te = "The Darkreaver Menace", g = { "Sagorne Rôdeur-des-crêtes", "Sagorne Creststrider", 1454, 38.7, 35.9 }, r = { "Sagorne Rôdeur-des-crêtes", "Sagorne Creststrider", 1454, 38.7, 35.9 }, obj = "Rapporter Tête de Ravassombre", oe = "Bring Darkreaver's Head" }
D[8277] = { t = "Venin mortel du désert", nv = 55, min = 54, te = "Deadly Desert Venom", g = { "Beetix Kalefragile", "Beetix Ficklespragg", 1451, 51.6, 38.6 }, r = { "Beetix Kalefragile", "Beetix Ficklespragg", 1451, 51.6, 38.6 }, c = { 1451, 35.3, 23.8 }, obj = "Rapporter 8 × Dard de scorpide Cinglepierre ; Rapporter 8 × Croc de Glisseuse du sable", oe = "Bring 8 × Stonelash Scorpid Stinger ; Bring 8 × Sand Skitterer Fang" }
D[8278] = { t = "Le dernier espoir de Noggle", nv = 57, min = 54, te = "Noggle's Last Hope", av = 8277, g = { "Beetix Kalefragile", "Beetix Ficklespragg", 1451, 51.6, 38.6 }, r = { "Beetix Kalefragile", "Beetix Ficklespragg", 1451, 51.6, 38.6 }, c = { 1451, 29.2, 78.3 }, obj = "Rapporter 3 × Dard d'écorcheur Cinglepierre ; Rapporter 3 × Dard de pinceur Cinglepierre ; Rapporter 3 × Croc de traqueuse des rochers", oe = "Bring 3 × Stonelash Flayer Stinger ; Bring 3 × Stonelash Pincer Stinger ; Bring 3 × Rock Stalker Fang" }
D[8279] = { t = "Le lexique du Crépuscule", nv = 60, min = 54, te = "The Twilight Lexicon", av = 8285, g = { "Ortell l'ermite", "Hermit Ortell", 1451, 67.2, 69.8 }, r = { "Ortell l'ermite", "Hermit Ortell", 1451, 67.2, 69.8 }, c = { 1451, 26.3, 36.6 }, obj = "Rapporter Lexique du crépuscule - Chapitre 1 ; Rapporter Lexique du crépuscule - Chapitre 2 ; Rapporter Lexique du crépuscule - Chapitre 3", oe = "Bring Twilight Lexicon - Chapter 1 ; Bring Twilight Lexicon - Chapter 2 ; Bring Twilight Lexicon - Chapter 3" }
D[8280] = { t = "Sécuriser les lignes d'approvisionnement", nv = 55, min = 54, te = "Securing the Supply Lines", g = { "Imploratrice céleste Corne-fière", "Windcaller Proudhorn", 1451, 51.6, 38.6 }, r = { "Imploratrice céleste Corne-fière", "Windcaller Proudhorn", 1451, 51.6, 38.6 }, c = { 1451, 55.8, 15.1 }, obj = "Vaincre 15 × Frappeur térébrant", oe = "Kill 15 × Dredge Striker" }
D[8281] = { t = "Améliorer la sécurité", nv = 57, min = 54, te = "Stepping Up Security", av = 8280, g = { "Imploratrice céleste Corne-fière", "Windcaller Proudhorn", 1451, 51.6, 38.6 }, r = { "Imploratrice céleste Corne-fière", "Windcaller Proudhorn", 1451, 51.6, 38.6 }, c = { 1451, 31.7, 41.6 }, obj = "Vaincre 20 × Ecraseur térébrant", oe = "Kill 20 × Dredge Crusher" }
D[8282] = { t = "La sacoche perdue de Noggle", nv = 58, min = 54, te = "Noggle's Lost Satchel", av = 8278, g = { "Noggle Kalefragile", "Noggle Ficklespragg", 1451, 51.6, 38.6 }, r = { "Noggle Kalefragile", "Noggle Ficklespragg", 1451, 51.6, 38.6 }, c = { 1451, 44.6, 91.4 }, obj = "Rapporter Sacoche de Noggle", oe = "Bring Noggle's Satchel" }
D[8283] = { t = "On recherche : Poigne-de-mort, Terreur des sables", nv = 59, min = 54, te = "Wanted - Deathclasp, Terror of the Sands", g = { "Avis de recherche : Poigne-de-mort", "Wanted Poster: Deathclasp", 1451, 51.6, 38.6 }, r = { "Vish Kozus", "Vish Kozus", 1451, 50.8, 33.7 }, c = { 1451, 44.9, 92.8 }, obj = "Rapporter Pince de Poigne-de-mort", oe = "Bring Deathclasp's Pincer" }
D[8284] = { t = "Le mystère du Crépuscule", nv = 58, min = 54, te = "The Twilight Mystery", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 51.6, 38.6 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 51.6, 38.6 }, c = { 1451, 23.8, 13.7 }, obj = "Rapporter 8 × Fragment de la Tablette du crépuscule", oe = "Bring 8 × Twilight Tablet Fragment" }
D[8285] = { t = "Le déserteur", nv = 59, min = 54, te = "The Deserter", av = 8284, g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 51.6, 38.6 }, r = { "Ortell l'ermite", "Hermit Ortell", 1451, 67.2, 69.8 }, obj = "Rapporter Tablette du crépuscule réparée", oe = "Bring Restored Twilight Tablet" }
D[8286] = { t = "Ce que demain apportera", nv = 60, min = 60, te = "What Tomorrow Brings", g = { "Baristolth des Sables changeants", "Baristolth of the Shifting Sands", 1451, 51.6, 38.6 }, r = { "Baristolth des Sables changeants", "Baristolth of the Shifting Sands", 1451, 51.6, 38.6 } }
D[8287] = { t = "Un terrible but", nv = 60, min = 54, te = "A Terrible Purpose", av = 8279, g = { "Ortell l'ermite", "Hermit Ortell", 1451, 67.2, 69.8 }, r = { "Commandant Mar'alith", "Commander Mar'alith", 1451, 50.8, 33.7 }, obj = "Rapporter Transcription décodée de la tablette", oe = "Bring Decoded Tablet Transcription" }
D[8301] = { t = "Le Chemin des Justes", nv = 60, min = 60, te = "The Path of the Righteous", av = 8288, g = { "Baristolth des Sables changeants", "Baristolth of the Shifting Sands", 1451, 51.6, 38.6 }, r = { "Baristolth des Sables changeants", "Baristolth of the Shifting Sands", 1451, 51.6, 38.6 }, c = { 1451, 32.2, 60.7 }, obj = "Rapporter 200 × Fragment de carapace de silithide", oe = "Bring 200 × Silithid Carapace Fragment" }
D[8303] = { t = "Anachronos", nv = 60, min = 60, av = 8301, g = { "Baristolth des Sables changeants", "Baristolth of the Shifting Sands", 1451, 51.6, 38.6 } }
D[8304] = { t = "Chère Natalia", nv = 60, min = 60, te = "Dearest Natalia", g = { "Commandant Mar'alith", "Commander Mar'alith", 1451, 50.8, 33.7 }, r = { "Commandant Mar'alith", "Commander Mar'alith", 1451, 50.8, 33.7 }, c = { 1451, 40.6, 89.2 }, obj = "Vaincre Déclencheur invisible de Frankal ; Vaincre Déclencheur invisible de Rutgar", oe = "Kill Frankal Invisible Trigger ; Kill Rutgar Invisible Trigger" }
D[8305] = { t = "Des souvenirs oubliés depuis longtemps", nv = 60, min = 60, te = "Long Forgotten Memories", av = 8303, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 } }
D[8306] = { t = "L'antre de la folie", nv = 60, min = 58, te = "Into The Maw of Madness", av = 8304, g = { "Commandant Mar'alith", "Commander Mar'alith", 1451, 50.8, 33.7 }, r = { "Commandant Mar'alith", "Commander Mar'alith", 1451, 50.8, 33.7 }, obj = "Vaincre Dame Natalia Mar'alith", oe = "Kill Mistress Natalia Mar'alith" }
D[8307] = { t = "Recette du désert", nv = 57, min = 54, te = "Desert Recipe", g = { "Calandrath", "Calandrath", 1451, 51.6, 38.6 }, r = { "Livre de cuisine sableux", "Sandy Cookbook", 1451, 37.9, 45.3 } }
D[8309] = { t = "À la poursuite des glyphes", nv = 60, min = 58, te = "Glyph Chasing", av = 8304, g = { "Rutgar Formeglyphe", "Rutgar Glyphshaper", 1451, 41.3, 88.5 }, r = { "Rutgar Formeglyphe", "Rutgar Glyphshaper", 1451, 41.3, 88.5 }, obj = "Rapporter Reproduction de la Ruche'Ashi ; Rapporter Reproduction de la Ruche'Zora ; Rapporter Reproduction de la Ruche'Regal ; Rapporter Trousse de transcription du géologue", oe = "Bring Hive'Ashi Rubbing ; Bring Hive'Zora Rubbing ; Bring Hive'Regal Rubbing ; Bring Geologist's Transcription Kit" }
D[8310] = { t = "Déchiffrer le code", nv = 60, min = 58, te = "Breaking the Code", av = 8304, g = { "Frankal Pont-de-pierre", "Frankal Stonebridge", 1451, 41.3, 88.5 }, r = { "Frankal Pont-de-pierre", "Frankal Stonebridge", 1451, 41.3, 88.5 }, c = { 1451, 45, 23.1 }, obj = "Rapporter Cerveau de silithide de la Ruche'Ashi ; Rapporter Cerveau de silithide de la Ruche'Zora ; Rapporter Cerveau de silithide de la Ruche'Regal", oe = "Bring Hive'Ashi Silithid Brain ; Bring Hive'Zora Silithid Brain ; Bring Hive'Regal Silithid Brain" }
D[8313] = { t = "Partager la connaissance", nv = 57, min = 54, te = "Sharing the Knowledge", av = 8307, g = { "Livre de cuisine sableux", "Sandy Cookbook", 1451, 37.9, 45.3 }, r = { "Calandrath", "Calandrath", 1451, 51.6, 38.6 }, obj = "Rapporter Page de recette déchirée", oe = "Bring Torn Recipe Page" }
D[8314] = { t = "Dévoiler le mystère", nv = 60, min = 58, te = "Unraveling the Mystery", g = { "Rutgar Formeglyphe", "Rutgar Glyphshaper", 1451, 41.3, 88.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 51.6, 38.6 }, obj = "Rapporter Prisme cristallin orné de glyphes", oe = "Bring Glyphed Crystal Prism" }
D[8315] = { t = "L'appel", nv = 60, min = 58, te = "The Calling", av = 8314, g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 51.6, 38.6 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 51.6, 38.6 }, obj = "Rapporter Mécanisme de déverrouillage du cristal", oe = "Bring Crystal Unlocking Mechanism" }
D[8316] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8317] = { t = "Un coup de main à la cuisine", nv = 57, min = 54, te = "Kitchen Assistance", av = 8313, g = { "Calandrath", "Calandrath", 1451, 51.6, 38.6 }, r = { "Calandrath", "Calandrath", 1451, 51.6, 38.6 }, obj = "Rapporter 10 × Boulettes fumées du désert", oe = "Bring 10 × Smoked Desert Dumplings" }
D[8318] = { t = "Communications secrètes", nv = 60, min = 57, te = "Secret Communication", g = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 }, r = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 }, c = { 1451, 68.1, 17.3 }, obj = "Rapporter 10 × Texte du crépuscule crypté", oe = "Bring 10 × Encrypted Twilight Text" }
D[8320] = { t = "Les géoseigneurs du Crépuscule", nv = 60, min = 60, te = "Twilight Geolords", g = { "Huum Crin-sauvage", "Huum Wildmane", 1451, 51.6, 38.6 }, r = { "Huum Crin-sauvage", "Huum Wildmane", 1451, 51.6, 38.6 }, c = { 1451, 26, 34.9 }, obj = "Vaincre 10 × Géoseigneur du crépuscule", oe = "Kill 10 × Twilight Geolord" }
D[8321] = { t = "Vyral le Vil", nv = 60, min = 60, te = "Vyral the Vile", av = 8320, g = { "Huum Crin-sauvage", "Huum Wildmane", 1451, 51.6, 38.6 }, r = { "Huum Crin-sauvage", "Huum Wildmane", 1451, 51.6, 38.6 }, c = { 1451, 72.4, 15.6 }, obj = "Rapporter Chevalière de Vyral", oe = "Bring Vyral's Signet Ring" }
D[8323] = { t = "Les vrais croyants", nv = 59, min = 54, te = "True Believers", av = 8279, g = { "Ortell l'ermite", "Hermit Ortell", 1451, 67.2, 69.8 }, r = { "Ortell l'ermite", "Hermit Ortell", 1451, 67.2, 69.8 }, c = { 1451, 68.1, 17.3 }, obj = "Rapporter 10 × Texte du crépuscule crypté", oe = "Bring 10 × Encrypted Twilight Text" }
D[8331] = { t = "Aurel Feuilledor", nv = 60, min = 60, te = "Aurel Goldleaf", g = { "Huum Crin-sauvage", "Huum Wildmane", 1451, 51.6, 38.6 }, r = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 } }
D[8332] = { t = "Les ducs du Conseil", nv = 60, min = 60, te = "Dukes of the Council", av = 8331, g = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, r = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, obj = "Rapporter Grand éclat brillant ; Rapporter 3 × Blason abyssal", oe = "Bring Large Brilliant Shard ; Bring 3 × Abyssal Crest" }
D[8341] = { t = "Les seigneurs du conseil", nv = 60, min = 60, te = "Lords of the Council", g = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, r = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, obj = "Rapporter 5 × Grand éclat brillant ; Rapporter 3 × Chevalière abyssale", oe = "Bring 5 × Large Brilliant Shard ; Bring 3 × Abyssal Signet" }
D[8343] = { t = "La découverte de Feuilledor", nv = 60, min = 60, te = "Goldleaf's Discovery", g = { "Huum Crin-sauvage", "Huum Wildmane", 1451, 51.6, 38.6 }, r = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 } }
D[8348] = { t = "La chevalière des ducs", nv = 60, min = 60, te = "Signet of the Dukes", av = 8349, g = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 }, r = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 }, obj = "Rapporter Chevalière abyssale", oe = "Bring Abyssal Signet" }
D[8349] = { t = "Bor Crin-sauvage", nv = 60, min = 60, te = "Bor Wildmane", av = 8332, g = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, r = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 } }
D[8361] = { t = "Des contacts abyssaux", nv = 60, min = 60, te = "Abyssal Contacts", g = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 }, r = { "Bor Crin-sauvage", "Bor Wildmane", 1451, 51.6, 38.6 }, obj = "Rapporter Blason abyssal", oe = "Bring Abyssal Crest" }
D[8365] = { t = "Ohé, des chapeaux de pirate !", nv = 45, min = 40, te = "Pirate Hats Ahoy!", g = { "Hautaine Lamodiste", "Haughty Modiste", 1446, 66.6, 25.7 }, r = { "Hautaine Lamodiste", "Haughty Modiste", 1446, 66.6, 25.7 }, c = { 1446, 72.9, 46.3 }, obj = "Rapporter 20 × Chapeau de pirate des Mers du sud", oe = "Bring 20 × Southsea Pirate Hat" }
D[8366] = { t = "Le racket des mers du Sud", nv = 45, min = 40, te = "Southsea Shakedown", g = { "Chef de la sécurité Vizisanie", "Security Chief Bilgewhizzle", 1446, 66.6, 25.7 }, r = { "Chef de la sécurité Vizisanie", "Security Chief Bilgewhizzle", 1446, 66.6, 25.7 }, c = { 1446, 73, 45.9 }, obj = "Vaincre 10 × Pirate des mers du Sud ; Vaincre 10 × Flibustier des mers du Sud ; Vaincre 10 × Portefaix des mers du Sud ; Vaincre 10 × Bretteur des mers du Sud", oe = "Kill 10 × Southsea Pirate ; Kill 10 × Southsea Freebooter ; Kill 10 × Southsea Dock Worker ; Kill 10 × Southsea Swashbuckler" }
D[8376] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8377] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8378] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8379] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8380] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8381] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8382] = { t = "Armes de guerre", nv = 60, min = 58, te = "Armaments of War", g = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 }, r = { "Géologue Fablemort", "Geologist Larksbane", 1451, 49.7, 37.5 } }
D[8410] = { t = "La maîtrise des éléments", nv = 50, min = 50, te = "Elemental Mastery", g = { "Haromm", "Haromm", 1435, 44.7, 57.2 }, obj = "Rapporter Air élémentaire ; Rapporter Feu élémentaire ; Rapporter Terre élémentaire ; Rapporter Eau élémentaire", oe = "Bring Elemental Air ; Bring Elemental Fire ; Bring Elemental Earth ; Bring Elemental Water", r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 } }
D[8411] = { t = "Maîtriser les éléments", nv = 50, min = 50, te = "Mastering the Elements", g = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, obj = "Rapporter Air élémentaire ; Rapporter Terre élémentaire ; Rapporter Feu élémentaire ; Rapporter Eau élémentaire", oe = "Bring Elemental Air ; Bring Elemental Earth ; Bring Elemental Fire ; Bring Elemental Water" }
D[8412] = { t = "Le totem des esprits", nv = 52, min = 50, te = "Spirit Totem", g = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, obj = "Rapporter 8 × Oeil d'araignée injecté de sang ; Rapporter 8 × Griffe noire épaisse", oe = "Bring 8 × Bloodshot Spider Eye ; Bring 8 × Thick Black Claw" }
D[8413] = { t = "Vaudou !", nv = 52, min = 50, te = "Da Voodoo", g = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, r = { "Bath'rah la Vigie des vents", "Bath'rah the Windwatcher", 1416, 80.5, 66.9 }, obj = "Rapporter 2 × Plume vaudou ambre ; Rapporter 2 × Plume vaudou bleue ; Rapporter 2 × Plume vaudou verte", oe = "Bring 2 × Amber Voodoo Feather ; Bring 2 × Blue Voodoo Feather ; Bring 2 × Green Voodoo Feather" }
D[8414] = { t = "La dissipation du mal", nv = 52, min = 50, te = "Dispelling Evil", g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Grand prêtre Thel'danis", "High Priest Thel'danis", 1422, 52.1, 83.3 }, obj = "Rapporter 20 × Pierre du Fléau des serviteurs", oe = "Bring 20 × Minion's Scourgestone" }
D[8415] = { t = "La pointe du Noroît", nv = 52, min = 50, te = "Chillwind Point", g = { "Seigneur Grayson Brisombre", "Lord Grayson Shadowbreaker", 1453, 48.4, 50.2 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 } }
D[8416] = { t = "Pierres du Fléau inertes", nv = 52, min = 50, te = "Inert Scourgestones", av = 8414, g = { "Grand prêtre Thel'danis", "High Priest Thel'danis", 1422, 52.1, 83.3 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, obj = "Rapporter Pierre du Fléau inerte", oe = "Bring Inert Scourgestone" }
D[8417] = { t = "Un esprit troublé", nv = 50, min = 50, te = "A Troubled Spirit", g = { "Torm Totem-de-rage", "Torm Ragetotem", 1456, 57.2, 87.4 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 } }
D[8418] = { t = "Forger la pierre de pouvoir", nv = 52, min = 50, te = "Forging the Mightstone", av = 8416, g = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, r = { "Commandant Ashlam Vaillepoing", "Commander Ashlam Valorfist", 1422, 42.7, 84 }, obj = "Rapporter 2 × Plume vaudou ambre ; Rapporter 2 × Plume vaudou bleue ; Rapporter 2 × Plume vaudou verte", oe = "Bring 2 × Amber Voodoo Feather ; Bring 2 × Blue Voodoo Feather ; Bring 2 × Green Voodoo Feather" }
D[8419] = { t = "La demande d'un diablotin", nv = 52, min = 50, te = "An Imp's Request", g = { "Kartosh", "Kartosh", 1435, 47.9, 54.8 }, obj = "Rapporter Gangrétoffe", oe = "Bring Felcloth", r = { "Démonet", "Impsy", 1448, 41.5, 45 } }
D[8420] = { t = "Chaud et piquant", nv = 52, min = 50, te = "Hot and Itchy", g = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, r = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, obj = "Rapporter Gangrétoffe", oe = "Bring Felcloth" }
D[8421] = { t = "L'anti-étoffe des héros", nv = 52, min = 50, te = "The Wrong Stuff", g = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, r = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, c = { 1448, 49.8, 23.5 }, obj = "Rapporter 10 × Bois pourri ; Rapporter 4 × Essence de Vénéneuse", oe = "Bring 10 × Rotting Wood ; Bring 4 × Bloodvenom Essence" }
D[8422] = { t = "Les trolls d'un même plumage…", nv = 52, min = 50, te = "Trolls of a Feather", av = 8421, g = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, r = { "Démonet", "Impsy", 1448, 41.6, 45.1 }, obj = "Rapporter 2 × Plume vaudou ambre ; Rapporter 2 × Plume vaudou bleue ; Rapporter 2 × Plume vaudou verte", oe = "Bring 2 × Amber Voodoo Feather ; Bring 2 × Blue Voodoo Feather ; Bring 2 × Green Voodoo Feather" }
D[8423] = { t = "Fraternité entre guerriers", nv = 52, min = 50, te = "Warrior Kinship", g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Vaincre 7 × Sanglier infernal", oe = "Kill 7 × Helboar" }
D[8424] = { t = "La guerre contre les liges d'ombre", nv = 52, min = 50, te = "War on the Shadowsworn", av = 8423, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Vaincre 20 × Adepte lige d'ombre ; Vaincre 10 × Sectateur lige d'ombre ; Vaincre 20 × Nervi lige d'ombre", oe = "Kill 20 × Shadowsworn Adept ; Kill 10 × Shadowsworn Cultist ; Kill 20 × Shadowsworn Thug" }
D[8425] = { t = "Plumes vaudou", nv = 52, min = 50, te = "Voodoo Feathers", av = 8424, g = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, r = { "Héros de la Horde tombé au combat", "Fallen Hero of the Horde", 1435, 34.3, 66.1 }, obj = "Rapporter 2 × Plume vaudou ambre ; Rapporter 2 × Plume vaudou bleue ; Rapporter 2 × Plume vaudou verte", oe = "Bring 2 × Amber Voodoo Feather ; Bring 2 × Blue Voodoo Feather ; Bring 2 × Green Voodoo Feather" }
D[8447] = { t = "L'éveil des légendes", nv = 60, min = 60, te = "Waking Legends", av = 8446, g = { "Gardien Remulos", "Keeper Remulos", 1450, 36.2, 41.8 }, r = { "Gardien Remulos", "Keeper Remulos", 1450, 36.2, 41.8 } }
D[8460] = { t = "Allié des Grumegueules", nv = 48, min = 45, te = "Timbermaw Ally", g = { "Grifleur", "Grazle", 1448, 51.3, 81.5 }, r = { "Grifleur", "Grazle", 1448, 51.3, 81.5 }, c = { 1448, 47.9, 90.7 }, obj = "Vaincre 6 × Guerrier Mort-bois ; Vaincre 6 × Guide Mort-bois ; Vaincre 6 × Jardinier Mort-bois", oe = "Kill 6 × Deadwood Warrior ; Kill 6 × Deadwood Pathfinder ; Kill 6 × Deadwood Gardener" }
D[8461] = { t = "Les Mort-bois du nord", nv = 55, min = 45, te = "Deadwood of the North", g = { "Nafien", "Nafien", 1452, 24.9, 36.2 }, r = { "Nafien", "Nafien", 1452, 24.9, 36.2 }, c = { 1452, 23.8, 37.3 }, obj = "Vaincre 6 × Protecteur Mort-bois ; Vaincre 6 × Vengeur Mort-bois ; Vaincre 6 × Chaman Mort-bois", oe = "Kill 6 × Deadwood Den Watcher ; Kill 6 × Deadwood Avenger ; Kill 6 × Deadwood Shaman" }
D[8462] = { t = "Parler à Nafien", nv = 55, min = 45, te = "Speak to Nafien", av = 8460, g = { "Grifleur", "Grazle", 1448, 51.3, 81.5 } }
D[8464] = { t = "Les Tombe-hiver s'agitent", nv = 58, min = 45, te = "Winterfall Activity", g = { "Salfa", "Salfa", 1452, 24.9, 36.2 }, r = { "Salfa", "Salfa", 1452, 24.9, 36.2 }, c = { 1452, 67.1, 36.8 }, obj = "Vaincre 8 × Chaman tombe-hiver ; Vaincre 8 × Protecteur tombe-hiver ; Vaincre 8 × Ursa tombe-hiver", oe = "Kill 8 × Winterfall Shaman ; Kill 8 × Winterfall Den Watcher ; Kill 8 × Winterfall Ursa" }
D[8465] = { t = "Parler à Salfa", nv = 55, min = 45, te = "Speak to Salfa", av = 8461, g = { "Nafien", "Nafien", 1452, 24.9, 36.2 }, r = { "Salfa", "Salfa", 1452, 24.9, 36.2 } }
D[8519] = { t = "Un pion sur l'Echiquier éternel", nv = 60, min = 60, te = "A Pawn on the Eternal Board", av = 8305, g = { "Larme cristalline", "Crystalline Tear", 1451, 28.7, 89.1 } }
D[8551] = { t = "Le coffre du capitaine", nv = 47, min = 40, te = "The Captain's Chest", g = { "Capitaine Hecklebury Smotts", "Captain Hecklebury Smotts", 1434, 27, 77.1 }, r = { "Capitaine Hecklebury Smotts", "Captain Hecklebury Smotts", 1434, 27, 77.1 }, c = { 1434, 37, 69.7 }, obj = "Rapporter Coffre de Smotts", oe = "Bring Smotts' Chest" }
D[8553] = { t = "Le sabre du capitaine Smotts", nv = 50, min = 40, te = "The Captain's Cutlass", av = 8552, g = { "Capitaine Hecklebury Smotts", "Captain Hecklebury Smotts", 1434, 27, 77.1 }, r = { "Bizutard", "Sprogger", 1434, 27, 77.1 } }
D[8554] = { t = "Face à Negolash", nv = 50, min = 40, te = "Facing Negolash", av = 8553, g = { "Bizutard", "Sprogger", 1434, 27, 77.1 }, r = { "Capitaine Hecklebury Smotts", "Captain Hecklebury Smotts", 1434, 27, 77.1 }, obj = "Rapporter Coutelas de Smotts", oe = "Bring Smotts' Cutlass" }
D[8555] = { t = "Le fardeau des Vols draconiques", nv = 60, min = 60, te = "The Charge of the Dragonflights", av = 8519, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 } }
D[8556] = { t = "Chevalière de force inflexible", nv = 60, min = 60, te = "Signet of Unyielding Strength", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de magistrat qiraji ; Rapporter 2 × Idole brillante ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Magisterial Ring ; Bring 2 × Lambent Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8557] = { t = "Drapé de force inflexible", nv = 60, min = 60, te = "Drape of Unyielding Strength", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé martial qiraji ; Rapporter 2 × Idole d'onyx ; Rapporter 5 × Scarabée d'os ; Rapporter 5 × Scarabée d'argent", oe = "Bring Qiraji Martial Drape ; Bring 2 × Onyx Idol ; Bring 5 × Bone Scarab ; Bring 5 × Silver Scarab" }
D[8558] = { t = "La faucille de force inflexible", nv = 60, min = 60, te = "Sickle of Unyielding Strength", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche à pointes qiraji ; Rapporter 2 × Idole d'albâtre ; Rapporter 5 × Scarabée de cristal ; Rapporter 5 × Scarabée de pierre", oe = "Bring Qiraji Spiked Hilt ; Bring 2 × Alabaster Idol ; Bring 5 × Crystal Scarab ; Bring 5 × Stone Scarab" }
D[8576] = { t = "La traduction du grand livre", nv = 60, min = 60, te = "Translating the Ledger", av = 8575, g = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, r = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 } }
D[8577] = { t = "Stewvul, ex-M.A.P.V.", nv = 60, min = 60, te = "Stewvul, Ex-B.F.F.", av = 8576, g = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 } }
D[8584] = { t = "On ne parle jamais de mon boulot", nv = 60, min = 60, te = "Never Ask Me About My Business", av = 8576, g = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, r = { "Dirge Hachillico", "Dirge Quikcleave", 1446, 50.2, 27.5 } }
D[8586] = { t = "Pyro-côtelettes de chimaerok à la Dirge", nv = 60, min = 60, te = "Dirge's Kickin' Chimaerok Chops", av = 8585, g = { "Dirge Hachillico", "Dirge Quikcleave", 1446, 50.2, 27.5 }, r = { "Dirge Hachillico", "Dirge Quikcleave", 1446, 50.2, 27.5 }, obj = "Rapporter 20 × Carburant de fusée des gobelins ; Rapporter 20 × Sel de Fonderoc", oe = "Bring 20 × Goblin Rocket Fuel ; Bring 20 × Deeprock Salt" }
D[8587] = { t = "Retour vers Narain", nv = 60, min = 60, te = "Return to Narain", av = 8586, g = { "Dirge Hachillico", "Dirge Quikcleave", 1446, 50.2, 27.5 }, r = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, obj = "Rapporter Poulet de 500 livres", oe = "Bring 500 Pound Chicken" }
D[8597] = { t = "Le draconique pour les nuls", nv = 60, min = 60, te = "Draconic for Dummies", av = 8576, g = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, r = { "Terre fraîchement remuée", "Freshly Dug Dirt", 1446, 65.2, 18.6 } }
D[8599] = { t = "Une chanson d'amour pour Narain", nv = 60, min = 60, te = "Love Song for Narain", g = { "Meridith la Vierge de mer", "Meridith the Mermaiden", 1446, 59.4, 96 }, r = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, obj = "Rapporter Lettre d'amour de Meridith", oe = "Bring Meridith's Love Letter" }
D[8606] = { t = "Un leurre !", nv = 60, min = 60, te = "Decoy!", av = 8598, g = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, r = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, obj = "Vaincre Numéro Deux", oe = "Kill Number Two" }
D[8689] = { t = "Le voile de sagesse infinie", nv = 60, min = 60, te = "Shroud of Infinite Wisdom", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé martial qiraji ; Rapporter 2 × Idole de jaspe ; Rapporter 5 × Scarabée d'or ; Rapporter 5 × Scarabée d'argile", oe = "Bring Qiraji Martial Drape ; Bring 2 × Jasper Idol ; Bring 5 × Gold Scarab ; Bring 5 × Clay Scarab" }
D[8690] = { t = "La cape de la tempête imminente", nv = 60, min = 60, te = "Cloak of the Gathering Storm", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé royal qiraji ; Rapporter 2 × Idole en obsidienne ; Rapporter 5 × Scarabée d'argile ; Rapporter 5 × Scarabée d'or", oe = "Bring Qiraji Regal Drape ; Bring 2 × Obsidian Idol ; Bring 5 × Clay Scarab ; Bring 5 × Gold Scarab" }
D[8691] = { t = "Le drapé des secrets scellés", nv = 60, min = 60, te = "Drape of Vaulted Secrets", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé martial qiraji ; Rapporter 2 × Idole d'albâtre ; Rapporter 5 × Scarabée de pierre ; Rapporter 5 × Scarabée de cristal", oe = "Bring Qiraji Martial Drape ; Bring 2 × Alabaster Idol ; Bring 5 × Stone Scarab ; Bring 5 × Crystal Scarab" }
D[8692] = { t = "La cape de vie interminable", nv = 60, min = 60, te = "Cloak of Unending Life", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé royal qiraji ; Rapporter 2 × Idole vermillon ; Rapporter 5 × Scarabée d'os ; Rapporter 5 × Scarabée d'argent", oe = "Bring Qiraji Regal Drape ; Bring 2 × Vermillion Idol ; Bring 5 × Bone Scarab ; Bring 5 × Silver Scarab" }
D[8693] = { t = "La cape des ombres voilées", nv = 60, min = 60, te = "Cloak of Veiled Shadows", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé martial qiraji ; Rapporter 2 × Idole azur ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Martial Drape ; Bring 2 × Azure Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8694] = { t = "Le voile des noms inexprimés", nv = 60, min = 60, te = "Shroud of Unspoken Names", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé royal qiraji ; Rapporter 2 × Idole d'ambre ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Regal Drape ; Bring 2 × Amber Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8695] = { t = "La cape de justice éternelle", nv = 60, min = 60, te = "Cape of Eternal Justice", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé royal qiraji ; Rapporter 2 × Idole en obsidienne ; Rapporter 5 × Scarabée d'or ; Rapporter 5 × Scarabée d'argile", oe = "Bring Qiraji Regal Drape ; Bring 2 × Obsidian Idol ; Bring 5 × Gold Scarab ; Bring 5 × Clay Scarab" }
D[8696] = { t = "La cape du sentier invisible", nv = 60, min = 60, te = "Cloak of the Unseen Path", g = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, r = { "Keyl Vivegriffe", "Keyl Swiftclaw", 1451, 51.8, 39.5 }, obj = "Rapporter Drapé royal qiraji ; Rapporter 2 × Idole brillante ; Rapporter 5 × Scarabée de pierre ; Rapporter 5 × Scarabée de cristal", oe = "Bring Qiraji Regal Drape ; Bring 2 × Lambent Idol ; Bring 5 × Stone Scarab ; Bring 5 × Crystal Scarab" }
D[8697] = { t = "L’anneau de sagesse infinie", nv = 60, min = 60, te = "Ring of Infinite Wisdom", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de cérémonie qiraji ; Rapporter 2 × Idole en obsidienne ; Rapporter 5 × Scarabée d'argent ; Rapporter 5 × Scarabée d'os", oe = "Bring Qiraji Ceremonial Ring ; Bring 2 × Obsidian Idol ; Bring 5 × Silver Scarab ; Bring 5 × Bone Scarab" }
D[8698] = { t = "L’anneau de la tempête imminente", nv = 60, min = 60, te = "Ring of the Gathering Storm", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de magistrat qiraji ; Rapporter 2 × Idole vermillon ; Rapporter 5 × Scarabée d'argent ; Rapporter 5 × Scarabée d'os", oe = "Bring Qiraji Magisterial Ring ; Bring 2 × Vermillion Idol ; Bring 5 × Silver Scarab ; Bring 5 × Bone Scarab" }
D[8699] = { t = "La bague des secrets scellés", nv = 60, min = 60, te = "Band of Vaulted Secrets", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de magistrat qiraji ; Rapporter 2 × Idole azur ; Rapporter 5 × Scarabée d'or ; Rapporter 5 × Scarabée d'argile", oe = "Bring Qiraji Magisterial Ring ; Bring 2 × Azure Idol ; Bring 5 × Gold Scarab ; Bring 5 × Clay Scarab" }
D[8700] = { t = "La bague de vie interminable", nv = 60, min = 60, te = "Band of Unending Life", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de magistrat qiraji ; Rapporter 2 × Idole d'albâtre ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Magisterial Ring ; Bring 2 × Alabaster Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8701] = { t = "La bague des ombres voilées", nv = 60, min = 60, te = "Band of Veiled Shadows", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de cérémonie qiraji ; Rapporter 2 × Idole d'onyx ; Rapporter 5 × Scarabée de pierre ; Rapporter 5 × Scarabée de cristal", oe = "Bring Qiraji Ceremonial Ring ; Bring 2 × Onyx Idol ; Bring 5 × Stone Scarab ; Bring 5 × Crystal Scarab" }
D[8702] = { t = "L’anneau des noms inexprimés", nv = 60, min = 60, te = "Ring of Unspoken Names", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de cérémonie qiraji ; Rapporter 2 × Idole de jaspe ; Rapporter 5 × Scarabée de pierre ; Rapporter 5 × Scarabée de cristal", oe = "Bring Qiraji Ceremonial Ring ; Bring 2 × Jasper Idol ; Bring 5 × Stone Scarab ; Bring 5 × Crystal Scarab" }
D[8703] = { t = "L’anneau de justice éternelle", nv = 60, min = 60, te = "Ring of Eternal Justice", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de magistrat qiraji ; Rapporter 2 × Idole vermillon ; Rapporter 5 × Scarabée d'argent ; Rapporter 5 × Scarabée d'os", oe = "Bring Qiraji Magisterial Ring ; Bring 2 × Vermillion Idol ; Bring 5 × Silver Scarab ; Bring 5 × Bone Scarab" }
D[8704] = { t = "La chevalière du sentier invisible", nv = 60, min = 60, te = "Signet of the Unseen Path", g = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, r = { "Imploratrice céleste Yessendra", "Windcaller Yessendra", 1451, 52, 38.2 }, obj = "Rapporter Anneau de cérémonie qiraji ; Rapporter 2 × Idole d'ambre ; Rapporter 5 × Scarabée d'or ; Rapporter 5 × Scarabée d'argile", oe = "Bring Qiraji Ceremonial Ring ; Bring 2 × Amber Idol ; Bring 5 × Gold Scarab ; Bring 5 × Clay Scarab" }
D[8705] = { t = "Le martelet de sagesse infinie", nv = 60, min = 60, te = "Gavel of Infinite Wisdom", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche orné qiraji ; Rapporter 2 × Idole brillante ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Ornate Hilt ; Bring 2 × Lambent Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8706] = { t = "Le marteau de la tempête imminente", nv = 60, min = 60, te = "Hammer of the Gathering Storm", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche à pointes qiraji ; Rapporter 2 × Idole d'ambre ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Spiked Hilt ; Bring 2 × Amber Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8707] = { t = "La lame des secrets scellés", nv = 60, min = 60, te = "Blade of Vaulted Secrets", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche orné qiraji ; Rapporter 2 × Idole en obsidienne ; Rapporter 5 × Scarabée d'argent ; Rapporter 5 × Scarabée d'os", oe = "Bring Qiraji Ornate Hilt ; Bring 2 × Obsidian Idol ; Bring 5 × Silver Scarab ; Bring 5 × Bone Scarab" }
D[8708] = { t = "La masse de vie interminable", nv = 60, min = 60, te = "Mace of Unending Life", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche orné qiraji ; Rapporter 2 × Idole de jaspe ; Rapporter 5 × Scarabée de cristal ; Rapporter 5 × Scarabée de pierre", oe = "Bring Qiraji Ornate Hilt ; Bring 2 × Jasper Idol ; Bring 5 × Crystal Scarab ; Bring 5 × Stone Scarab" }
D[8709] = { t = "La dague des ombres voilées", nv = 60, min = 60, te = "Dagger of Veiled Shadows", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche à pointes qiraji ; Rapporter 2 × Idole vermillon ; Rapporter 5 × Scarabée d'or ; Rapporter 5 × Scarabée d'argile", oe = "Bring Qiraji Spiked Hilt ; Bring 2 × Vermillion Idol ; Bring 5 × Gold Scarab ; Bring 5 × Clay Scarab" }
D[8710] = { t = "Le kriss des noms inexprimés", nv = 60, min = 60, te = "Kris of Unspoken Names", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche orné qiraji ; Rapporter 2 × Idole d'onyx ; Rapporter 5 × Scarabée d'or ; Rapporter 5 × Scarabée d'argile", oe = "Bring Qiraji Ornate Hilt ; Bring 2 × Onyx Idol ; Bring 5 × Gold Scarab ; Bring 5 × Clay Scarab" }
D[8711] = { t = "La lame de justice éternelle", nv = 60, min = 60, te = "Blade of Eternal Justice", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche à pointes qiraji ; Rapporter 2 × Idole d'ambre ; Rapporter 5 × Scarabée en bronze ; Rapporter 5 × Scarabée d'ivoire", oe = "Bring Qiraji Spiked Hilt ; Bring 2 × Amber Idol ; Bring 5 × Bronze Scarab ; Bring 5 × Ivory Scarab" }
D[8712] = { t = "La faux du sentier invisible", nv = 60, min = 60, te = "Scythe of the Unseen Path", g = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, r = { "Gardien Haro", "Warden Haro", 1451, 51.1, 38.9 }, obj = "Rapporter Manche à pointes qiraji ; Rapporter 2 × Idole azur ; Rapporter 5 × Scarabée d'argent ; Rapporter 5 × Scarabée d'os", oe = "Bring Qiraji Spiked Hilt ; Bring 2 × Azure Idol ; Bring 5 × Silver Scarab ; Bring 5 × Bone Scarab" }
D[8728] = { t = "La bonne nouvelle et la mauvaise nouvelle", nv = 60, min = 60, te = "The Good News and The Bad News", av = 8620, g = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, r = { "Narain Divinambolesque", "Narain Soothfancy", 1446, 65.2, 18.6 }, c = { 1446, 72.9, 46.1 }, obj = "Rapporter 20 × Barre d'arcanite ; Rapporter 10 × Minerai d'élémentium ; Rapporter 10 × Diamant d'Azeroth ; Rapporter 10 × Saphir bleu", oe = "Bring 20 × Arcanite Bar ; Bring 10 × Elementium Ore ; Bring 10 × Azerothian Diamond ; Bring 10 × Blue Sapphire" }
D[8741] = { t = "Le retour du champion", nv = 60, min = 60, te = "The Champion Returns", av = 8736, g = { "Gardien Remulos", "Keeper Remulos", 1450, 36.2, 41.8 }, obj = "Rapporter Fragment de sceptre vert", oe = "Bring Green Scepter Shard" }
D[8742] = { t = "La puissance de Kalimdor", nv = 60, min = 60, te = "The Might of Kalimdor", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 } }
D[8743] = { t = "Faites résonner le gong !", nv = 60, min = 60, te = "Bang a Gong!", av = 8742, g = { "Le gong du Scarabée", "The Scarab Gong", 1451, 28.7, 89.1 }, r = { "Le gong du Scarabée", "The Scarab Gong", 1451, 28.7, 89.1 }, obj = "Rapporter Le Sceptre des Sables changeants", oe = "Bring The Scepter of the Shifting Sands" }
D[8745] = { t = "Le trésor de l'Intemporel", nv = 60, min = 60, te = "Treasure of the Timeless One", av = 8742, g = { "Jonathan le Révélateur", "Jonathan the Revelator", 1451, 28.7, 89.1 }, r = { "Jonathan le Révélateur", "Jonathan the Revelator", 1451, 28.7, 89.1 } }
D[8747] = { t = "La voie du Protecteur", nv = 60, min = 60, te = "The Path of the Protector", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 } }
D[8748] = { t = "La voie du Protecteur", nv = 60, min = 60, te = "The Path of the Protector", av = 8747, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8749] = { t = "La voie du Protecteur", nv = 60, min = 60, te = "The Path of the Protector", av = 8748, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8750] = { t = "La voie du Protecteur", nv = 60, min = 60, te = "The Path of the Protector", av = 8749, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8751] = { t = "Le Protecteur de Kalimdor", nv = 60, min = 60, te = "The Protector of Kalimdor", av = 8750, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8752] = { t = "La voie du conquérant", nv = 60, min = 60, te = "The Path of the Conqueror", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 } }
D[8753] = { t = "La voie du conquérant", nv = 60, min = 60, te = "The Path of the Conqueror", av = 8752, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8754] = { t = "La voie du conquérant", nv = 60, min = 60, te = "The Path of the Conqueror", av = 8753, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8755] = { t = "La voie du conquérant", nv = 60, min = 60, te = "The Path of the Conqueror", av = 8754, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8756] = { t = "Le conquérant qiraji", nv = 60, min = 60, te = "The Qiraji Conqueror", av = 8755, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8757] = { t = "La voie de l'Invocateur", nv = 60, min = 60, te = "The Path of the Invoker", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 } }
D[8758] = { t = "La voie de l'Invocateur", nv = 60, min = 60, te = "The Path of the Invoker", av = 8757, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8759] = { t = "La voie de l'Invocateur", nv = 60, min = 60, te = "The Path of the Invoker", av = 8758, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8760] = { t = "La voie de l'Invocateur", nv = 60, min = 60, te = "The Path of the Invoker", av = 8759, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8761] = { t = "Le Grand Invocateur", nv = 60, min = 60, te = "The Grand Invoker", av = 8760, g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Chevalière du Vol de bronze", oe = "Bring Signet Ring of the Bronze Dragonflight" }
D[8798] = { t = "Un yéti rien que pour vous", nv = 60, min = 55, te = "A Yeti of Your Own", av = 5163, g = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 }, r = { "Umi Sarcafroisse", "Umi Rumplesnicker", 1452, 61.9, 38.3 } }
D[8800] = { t = "La tenue de combat cénarienne", nv = 60, min = 60, te = "Cenarion Battlegear", g = { "Implorateur céleste Kaldon", "Windcaller Kaldon", 1451, 51.6, 38.6 }, r = { "Vargus", "Vargus", 1451, 51.6, 38.6 } }
D[8857] = { t = "Les secrets du Colosse - Ashi", nv = 60, min = 51, te = "Secrets of the Colossus - Ashi", g = { "Chercheur du colosse Nestor", "Colossus Researcher Nestor", 1451, 51.6, 38.6 }, obj = "Rapporter Carcasse du colosse d'Ashi", oe = "Bring Colossus of Ashi's Husk" }
D[8858] = { t = "Les secrets du Colosse - Regal", nv = 60, min = 51, te = "Secrets of the Colossus - Regal", g = { "Chercheur du colosse Eazel", "Colossus Researcher Eazel", 1451, 51.6, 38.6 }, obj = "Rapporter Carcasse du colosse de Regal", oe = "Bring Colossus of Regal's Husk" }
D[8859] = { t = "Les secrets du Colosse - Zora", nv = 60, min = 51, te = "Secrets of the Colossus - Zora", g = { "Chercheuse du colosse Sophia", "Colossus Researcher Sophia", 1451, 51.6, 38.6 }, obj = "Rapporter Carcasse du colosse de Zora", oe = "Bring Colossus of Zora's Husk" }
D[8905] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16714", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16714" }
D[8906] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16681", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16681" }
D[8907] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16683", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16683" }
D[8908] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16722", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16722" }
D[8909] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16697", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16697" }
D[8910] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16710", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16710" }
D[8911] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16703", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16703" }
D[8912] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter 15 × Echantillon de sang de Berceau-de-l'Hiver ; Rapporter objet 16735", oe = "Bring 15 × Winterspring Blood Sample ; Bring item 16735" }
D[8913] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16714", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16714" }
D[8914] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16681", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16681" }
D[8915] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16683", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16683" }
D[8916] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16697", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16697" }
D[8917] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16710", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16710" }
D[8918] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16671", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16671" }
D[8919] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16703", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16703" }
D[8920] = { t = "Une proposition sérieuse", nv = 60, min = 58, te = "An Earnest Proposition", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter 15 × Echantillon de venin de Silithus ; Rapporter objet 16735", oe = "Bring 15 × Silithus Venom Sample ; Bring item 16735" }
D[8921] = { t = "L'alambic ectoplasmique", nv = 60, min = 58, te = "The Ectoplasmic Distiller", g = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, r = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, obj = "Rapporter Convertisseur d'arcanite délicat ; Rapporter 4 × Essence éternelle supérieure ; Rapporter 10 × Huile de pierre-écaille ; Rapporter 25 × Cendre volcanique", oe = "Bring Delicate Arcanite Converter ; Bring 4 × Greater Eternal Essence ; Bring 10 × Stonescale Oil ; Bring 25 × Volcanic Ash" }
D[8924] = { t = "La chasse aux ectoplasmes", nv = 60, min = 58, te = "Hunting for Ectoplasm", av = 8921, g = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, r = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, obj = "Rapporter 12 × Ectoplasme brûlé ; Rapporter 12 × Ectoplasme glacé ; Rapporter 12 × Ectoplasme stable ; Rapporter Alambic ectoplasmique", oe = "Bring 12 × Scorched Ectoplasm ; Bring 12 × Frozen Ectoplasm ; Bring 12 × Stable Ectoplasm ; Bring Ectoplasmic Distiller" }
D[8925] = { t = "Une source d’énergie portable", nv = 60, min = 58, te = "A Portable Power Source", av = 8924, g = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, r = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, obj = "Rapporter Coeur de magma", oe = "Bring Magma Core" }
D[8926] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16716 ; Rapporter objet 16717", oe = "Bring item 16716 ; Bring item 16717" }
D[8927] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16716 ; Rapporter objet 16717", oe = "Bring item 16716 ; Bring item 16717" }
D[8928] = { t = "Un marchand à éclipses", nv = 60, min = 58, te = "A Shifty Merchant", av = 8925, g = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, r = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, obj = "Rapporter Bâtonnet élémentaire de corruption", oe = "Bring Fel Elemental Rod" }
D[8931] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16680 ; Rapporter objet 16676", oe = "Bring item 16680 ; Bring item 16676" }
D[8932] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16685 ; Rapporter objet 16684", oe = "Bring item 16685 ; Bring item 16684" }
D[8933] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16723 ; Rapporter objet 16724", oe = "Bring item 16723 ; Bring item 16724" }
D[8934] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16696 ; Rapporter objet 16692", oe = "Bring item 16696 ; Bring item 16692" }
D[8935] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16713 ; Rapporter objet 16712", oe = "Bring item 16713 ; Bring item 16712" }
D[8936] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16702 ; Rapporter objet 16705", oe = "Bring item 16702 ; Bring item 16705" }
D[8937] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16736 ; Rapporter objet 16737", oe = "Bring item 16736 ; Bring item 16737" }
D[8938] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16680 ; Rapporter objet 16676", oe = "Bring item 16680 ; Bring item 16676" }
D[8939] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16685 ; Rapporter objet 16684", oe = "Bring item 16685 ; Bring item 16684" }
D[8940] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16696 ; Rapporter objet 16692", oe = "Bring item 16696 ; Bring item 16692" }
D[8941] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16713 ; Rapporter objet 16712", oe = "Bring item 16713 ; Bring item 16712" }
D[8942] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16673 ; Rapporter objet 16672", oe = "Bring item 16673 ; Bring item 16672" }
D[8943] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16702 ; Rapporter objet 16705", oe = "Bring item 16702 ; Bring item 16705" }
D[8944] = { t = "Une juste compensation", nv = 60, min = 58, te = "Just Compensation", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16736 ; Rapporter objet 16737", oe = "Bring item 16736 ; Bring item 16737" }
D[8947] = { t = "L'étonnante requête d'Anthion", nv = 60, min = 58, te = "Anthion's Strange Request", av = 8946, g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, obj = "Rapporter 3 × Barre de sombrefer ; Rapporter 20 × Cuir enchanté ; Rapporter 3 × Etoffe lunaire ; Rapporter 4 × Peau robuste traitée", oe = "Bring 3 × Dark Iron Bar ; Bring 20 × Enchanted Leather ; Bring 3 × Mooncloth ; Bring 4 × Cured Rugged Hide" }
D[8951] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16715 ; Rapporter objet 16719 ; Rapporter objet 16718", oe = "Bring item 16715 ; Bring item 16719 ; Bring item 16718" }
D[8952] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16675 ; Rapporter objet 16678 ; Rapporter objet 16679", oe = "Bring item 16675 ; Bring item 16678 ; Bring item 16679" }
D[8953] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16682 ; Rapporter objet 16687 ; Rapporter objet 16689", oe = "Bring item 16682 ; Bring item 16687 ; Bring item 16689" }
D[8954] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16725 ; Rapporter objet 16728 ; Rapporter objet 16729", oe = "Bring item 16725 ; Bring item 16728 ; Bring item 16729" }
D[8955] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16691 ; Rapporter objet 16694 ; Rapporter objet 16695", oe = "Bring item 16691 ; Bring item 16694 ; Bring item 16695" }
D[8956] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16711 ; Rapporter objet 16709 ; Rapporter objet 16708", oe = "Bring item 16711 ; Bring item 16709 ; Bring item 16708" }
D[8957] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16670 ; Rapporter objet 16668 ; Rapporter objet 16669", oe = "Bring item 16670 ; Bring item 16668 ; Bring item 16669" }
D[8958] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16704 ; Rapporter objet 16699 ; Rapporter objet 16701", oe = "Bring item 16704 ; Bring item 16699 ; Bring item 16701" }
D[8959] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16734 ; Rapporter objet 16732 ; Rapporter objet 16733", oe = "Bring item 16734 ; Bring item 16732 ; Bring item 16733" }
D[8962] = { t = "Des composants importants", nv = 60, min = 58, te = "Components of Importance", av = 8961, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Restes druidiques", oe = "Bring Druidical Remains" }
D[8963] = { t = "Des composants importants", nv = 60, min = 58, te = "Components of Importance", av = 8961, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Relique de Brise-stellaire", oe = "Bring Starbreeze Village Relic" }
D[8964] = { t = "Des composants importants", nv = 60, min = 58, te = "Components of Importance", av = 8961, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Epée brillante de fanatisme", oe = "Bring Brilliant Sword of Zealotry" }
D[8965] = { t = "Des composants importants", nv = 60, min = 58, te = "Components of Importance", av = 8961, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Cendres d'âme de banni", oe = "Bring Soul Ashes of the Banished" }
D[8970] = { t = "Votre avenir passe par l'île d'Alcaz", nv = 60, min = 58, te = "I See Alcaz Island In Your Future...", g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter 20 × Varech de sang", oe = "Bring 20 × Bloodkelp" }
D[8977] = { t = "Retourner voir Deliana", nv = 60, min = 58, te = "Return to Deliana", av = 8928, g = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, obj = "Rapporter Révélateur de fantômes extradimensionnel", oe = "Bring Extra-Dimensional Ghost Revealer" }
D[8978] = { t = "Retourner voir Mokvar", nv = 60, min = 58, te = "Return to Mokvar", av = 8928, g = { "Mux Brouillemana", "Mux Manascrambler", 1446, 50.2, 27.5 }, obj = "Rapporter Révélateur de fantômes extradimensionnel", oe = "Bring Extra-Dimensional Ghost Revealer" }
D[8985] = { t = "D'autres composants importants", nv = 60, min = 58, te = "More Components of Importance", av = 8970, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Relique de Brise-stellaire", oe = "Bring Starbreeze Village Relic" }
D[8986] = { t = "D'autres composants importants", nv = 60, min = 58, te = "More Components of Importance", av = 8970, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Restes druidiques", oe = "Bring Druidical Remains" }
D[8987] = { t = "D'autres composants importants", nv = 60, min = 58, te = "More Components of Importance", av = 8970, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Epée brillante de fanatisme", oe = "Bring Brilliant Sword of Zealotry" }
D[8988] = { t = "D'autres composants importants", nv = 60, min = 58, te = "More Components of Importance", av = 8970, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, r = { "Bodley", "Bodley", 1428, 32.3, 25.8 }, obj = "Rapporter Cendres d'âme de banni", oe = "Bring Soul Ashes of the Banished" }
D[8997] = { t = "Retour au commencement", nv = 60, min = 58, te = "Back to the Beginning", av = 8996, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 } }
D[8998] = { t = "Retour au commencement", nv = 60, min = 58, te = "Back to the Beginning", av = 8996, g = { "Bodley", "Bodley", 1428, 32.3, 25.8 } }
D[8999] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16720 ; Rapporter objet 16706", oe = "Bring item 16720 ; Bring item 16706" }
D[9000] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16677 ; Rapporter objet 16674", oe = "Bring item 16677 ; Bring item 16674" }
D[9001] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16686 ; Rapporter objet 16688", oe = "Bring item 16686 ; Bring item 16688" }
D[9002] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16727 ; Rapporter objet 16726", oe = "Bring item 16727 ; Bring item 16726" }
D[9003] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16693 ; Rapporter objet 16690", oe = "Bring item 16693 ; Bring item 16690" }
D[9004] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16707 ; Rapporter objet 16721", oe = "Bring item 16707 ; Bring item 16721" }
D[9005] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16698 ; Rapporter objet 16700", oe = "Bring item 16698 ; Bring item 16700" }
D[9006] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, r = { "Deliana", "Deliana", 1455, 43.5, 52.6 }, obj = "Rapporter objet 16731 ; Rapporter objet 16730", oe = "Bring item 16731 ; Bring item 16730" }
D[9007] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16720 ; Rapporter objet 16706", oe = "Bring item 16720 ; Bring item 16706" }
D[9008] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16677 ; Rapporter objet 16674", oe = "Bring item 16677 ; Bring item 16674" }
D[9009] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16693 ; Rapporter objet 16690", oe = "Bring item 16693 ; Bring item 16690" }
D[9010] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16707 ; Rapporter objet 16721", oe = "Bring item 16707 ; Bring item 16721" }
D[9011] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16667 ; Rapporter objet 16666", oe = "Bring item 16667 ; Bring item 16666" }
D[9012] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16698 ; Rapporter objet 16700", oe = "Bring item 16698 ; Bring item 16700" }
D[9013] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16731 ; Rapporter objet 16730", oe = "Bring item 16731 ; Bring item 16730" }
D[9014] = { t = "Garder le meilleur pour la fin", nv = 60, min = 58, te = "Saving the Best for Last", g = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16686 ; Rapporter objet 16688", oe = "Bring item 16686 ; Bring item 16688" }
D[9016] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16715 ; Rapporter objet 16719 ; Rapporter objet 16718", oe = "Bring item 16715 ; Bring item 16719 ; Bring item 16718" }
D[9017] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16675 ; Rapporter objet 16678 ; Rapporter objet 16679", oe = "Bring item 16675 ; Bring item 16678 ; Bring item 16679" }
D[9018] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16682 ; Rapporter objet 16687 ; Rapporter objet 16689", oe = "Bring item 16682 ; Bring item 16687 ; Bring item 16689" }
D[9019] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16691 ; Rapporter objet 16694 ; Rapporter objet 16695", oe = "Bring item 16691 ; Bring item 16694 ; Bring item 16695" }
D[9020] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16711 ; Rapporter objet 16709 ; Rapporter objet 16708", oe = "Bring item 16711 ; Bring item 16709 ; Bring item 16708" }
D[9021] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16704 ; Rapporter objet 16699 ; Rapporter objet 16701", oe = "Bring item 16704 ; Bring item 16699 ; Bring item 16701" }
D[9022] = { t = "Les adieux d'Anthion", nv = 60, min = 58, te = "Anthion's Parting Words", g = { "Anthion Harmon", "Anthion Harmon", 1423, 26.1, 11.3 }, r = { "Mokvar", "Mokvar", 1454, 34.9, 38.3 }, obj = "Rapporter objet 16734 ; Rapporter objet 16732 ; Rapporter objet 16733", oe = "Bring item 16734 ; Bring item 16732 ; Bring item 16733" }
D[9051] = { t = "Test de toxicité", nv = 52, min = 50, te = "Toxic Test", av = 9052, g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 } }
D[9052] = { t = "Le poison de Pétale-de-sang", nv = 52, min = 50, te = "Bloodpetal Poison", g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, c = { 1449, 49, 79.9 }, obj = "Rapporter 8 × Dard de Gorishi ; Rapporter 8 × Chapeau de sang", oe = "Bring 8 × Gorishi Sting ; Bring 8 × Bloodcap" }
D[9053] = { t = "Un meilleur ingrédient", nv = 52, min = 50, te = "A Better Ingredient", av = 9051, g = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 }, obj = "Rapporter Liane putride", oe = "Bring Putrid Vine" }
D[9063] = { t = "Torwa le Guide", nv = 52, min = 50, te = "Torwa Pathfinder", g = { "Turak Totem-runique", "Turak Runetotem", 1456, 76.5, 27.2 }, r = { "Torwa le Guide", "Torwa Pathfinder", 1449, 71.6, 76 } }
D[9085] = { t = "Les ombres du destin", nv = 60, min = 55, te = "Shadows of Doom", g = { "Commandant Thomas Helleran", "Commander Thomas Helleran", 1423, 71.7, 50 }, r = { "Commandant Thomas Helleran", "Commander Thomas Helleran", 1423, 71.7, 50 }, obj = "Vaincre Ombre funeste", oe = "Kill Shadow of Doom" }
D[9121] = { t = "Naxxramas, la citadelle de l'effroi", nv = 60, min = 60, te = "The Dread Citadel - Naxxramas", g = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, r = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, c = { 1423, 74.7, 71.6 }, obj = "Rapporter 5 × Cristal des arcanes ; Rapporter 2 × Cristal de nexus ; Rapporter Orbe de piété", oe = "Bring 5 × Arcane Crystal ; Bring 2 × Nexus Crystal ; Bring Righteous Orb" }
D[9122] = { t = "Naxxramas, la citadelle de l'effroi", nv = 60, min = 60, te = "The Dread Citadel - Naxxramas", g = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, r = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, obj = "Rapporter 2 × Cristal des arcanes ; Rapporter Cristal de nexus", oe = "Bring 2 × Arcane Crystal ; Bring Nexus Crystal" }
D[9123] = { t = "Naxxramas, la citadelle de l'effroi", nv = 60, min = 60, te = "The Dread Citadel - Naxxramas", g = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, r = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 } }
D[9124] = { t = "L'armure de traqueur des cryptes ne se fabrique pas toute seule", nv = 60, min = 55, te = "Cryptstalker Armor Doesn't Make Itself...", g = { "Veneur Leopold", "Huntsman Leopold", 1423, 71.7, 50 }, r = { "Veneur Leopold", "Huntsman Leopold", 1423, 71.7, 50 }, c = { 1423, 34.7, 42.3 }, obj = "Rapporter 30 × Morceaux de démon des cryptes", oe = "Bring 30 × Crypt Fiend Parts" }
D[9126] = { t = "Des morceaux pour la faucheuse d'os", nv = 60, min = 55, te = "Bonescythe Digs", g = { "Rohan l'Assassin", "Rohan the Assassin", 1423, 71.7, 50 }, r = { "Rohan l'Assassin", "Rohan the Assassin", 1423, 71.7, 50 }, obj = "Rapporter 30 × Fragments d'os", oe = "Bring 30 × Bone Fragments" }
D[9128] = { t = "L'équation élémentaire", nv = 60, min = 55, te = "The Elemental Equation", g = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, r = { "Archimage Angela Dosantos", "Archmage Angela Dosantos", 1423, 71.7, 50 }, obj = "Rapporter 30 × Noyau des éléments", oe = "Bring 30 × Core of Elements" }
D[9131] = { t = "Armer un cuirassier", nv = 60, min = 55, te = "Binding the Dreadnaught", g = { "Korfax, Champion de la Lumière", "Korfax, Champion of the Light", 1423, 71.7, 50 }, r = { "Korfax, Champion de la Lumière", "Korfax, Champion of the Light", 1423, 71.7, 50 }, obj = "Rapporter 30 × Morceaux de sombrefer", oe = "Bring 30 × Dark Iron Scraps" }
D[9136] = { t = "La flore sauvage", nv = 60, min = 55, te = "Savage Flora", g = { "Rayne", "Rayne", 1423, 71.7, 50 }, r = { "Rayne", "Rayne", 1423, 71.7, 50 }, obj = "Rapporter 30 × Palme sauvage", oe = "Bring 30 × Savage Frond" }
D[9141] = { t = "On m'appelle « Le Coq »", nv = 60, min = 55, te = "They Call Me \"The Rooster\"", g = { "Commandant d'ordonnance Metz", "Dispatch Commander Metz", 1423, 71.7, 50 }, r = { "Commandant d'ordonnance Metz", "Dispatch Commander Metz", 1423, 71.7, 50 }, obj = "Rapporter Marque de valeur de l'Aube d'argent", oe = "Bring Argent Dawn Valor Token" }
D[9153] = { t = "Sous les ombres", nv = 60, min = 58, te = "Under the Shadow", g = { "Commandant Thomas Helleran", "Commander Thomas Helleran", 1423, 71.7, 50 }, r = { "Commandant Thomas Helleran", "Commander Thomas Helleran", 1423, 71.7, 50 }, obj = "Rapporter 10 × Rune nécrotique", oe = "Bring 10 × Necrotic Rune" }
D[9248] = { t = "Une humble offrande", nv = 60, min = 58, te = "A Humble Offering", g = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, r = { "Aurel Feuilledor", "Aurel Goldleaf", 1451, 51.6, 38.6 }, obj = "Rapporter Sceptre abyssal", oe = "Bring Abyssal Scepter" }
D[9257] = { t = "Atiesh, le grand bâton du Gardien", nv = 60, min = 60, te = "Atiesh, Greatstaff of the Guardian", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Atiesh, grand bâton du Gardien ; Vaincre Atiesh", oe = "Bring Atiesh, Greatstaff of the Guardian ; Kill Atiesh" }
D[9269] = { t = "Atiesh, le grand bâton du Gardien", nv = 60, min = 60, te = "Atiesh, Greatstaff of the Guardian", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Atiesh, grand bâton du Gardien ; Vaincre Atiesh", oe = "Bring Atiesh, Greatstaff of the Guardian ; Kill Atiesh" }
D[9270] = { t = "Atiesh, le grand bâton du Gardien", nv = 60, min = 60, te = "Atiesh, Greatstaff of the Guardian", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Atiesh, grand bâton du Gardien ; Vaincre Atiesh", oe = "Bring Atiesh, Greatstaff of the Guardian ; Kill Atiesh" }
D[9271] = { t = "Atiesh, le grand bâton du Gardien", nv = 60, min = 60, te = "Atiesh, Greatstaff of the Guardian", g = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, r = { "Anachronos", "Anachronos", 1446, 65.3, 50 }, obj = "Rapporter Atiesh, grand bâton du Gardien ; Vaincre Atiesh", oe = "Bring Atiesh, Greatstaff of the Guardian ; Kill Atiesh" }
D[9362] = { t = "Le seigneur de guerre Krellian", nv = 60, min = 60, te = "Warlord Krellian", g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, obj = "Rapporter Coquille prismatique", oe = "Bring Prismatic Shell" }
D[9364] = { t = "Magie morcelée", nv = 60, min = 60, te = "Fragmented Magic", g = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, r = { "Archimage Xylem", "Archmage Xylem", 1447, 29.2, 40.2 }, obj = "Rapporter Coquille prismatique ; Vaincre 50 × Clone de métamorphose", oe = "Bring Prismatic Shell ; Kill 50 × Polymorph Clone" }
D[9415] = { t = "Se présenter au maréchal Murbleu", nv = 60, min = 53, te = "Report to Marshal Bluewall", g = { "Fusilier Torrig", "Rifleman Torrig", 1451, 50.8, 33.7 }, r = { "Maréchal Murbleu", "Marshal Bluewall", 1451, 33.3, 51.1 } }
D[9416] = { t = "Se présenter au général Kirika", nv = 60, min = 53, te = "Report to General Kirika", g = { "Eclaireur Poing-de-sang", "Scout Bloodfist", 1451, 51.6, 38.6 }, r = { "Général Kirika", "General Kirika", 1451, 50.8, 69.5 } }

-- Quêtes réservées à des classes ou à des races (masques du jeu).
-- Classes : guerrier 1, paladin 2, chasseur 4, voleur 8, prêtre 16, chaman 64, mage 128, démoniste 256, druide 1024.
-- Races : humain 1, orc 2, nain 4, elfe de la nuit 8, mort-vivant 16, tauren 32, gnome 64, troll 128.
ns.questClassMask = ns.questClassMask or {}
ns.questClassMask[26] = 1024
ns.questClassMask[27] = 1024
ns.questClassMask[28] = 1024
ns.questClassMask[29] = 1024
ns.questClassMask[30] = 1024
ns.questClassMask[31] = 1024
ns.questClassMask[63] = 64
ns.questClassMask[96] = 64
ns.questClassMask[100] = 64
ns.questClassMask[220] = 64
ns.questClassMask[272] = 1024
ns.questClassMask[397] = 256
ns.questClassMask[1470] = 256
ns.questClassMask[1471] = 256
ns.questClassMask[1472] = 256
ns.questClassMask[1473] = 256
ns.questClassMask[1474] = 256
ns.questClassMask[1476] = 256
ns.questClassMask[1478] = 256
ns.questClassMask[1485] = 256
ns.questClassMask[1498] = 1
ns.questClassMask[1499] = 256
ns.questClassMask[1501] = 256
ns.questClassMask[1502] = 1
ns.questClassMask[1503] = 1
ns.questClassMask[1504] = 256
ns.questClassMask[1505] = 1
ns.questClassMask[1506] = 256
ns.questClassMask[1507] = 256
ns.questClassMask[1508] = 256
ns.questClassMask[1509] = 256
ns.questClassMask[1510] = 256
ns.questClassMask[1511] = 256
ns.questClassMask[1512] = 256
ns.questClassMask[1513] = 256
ns.questClassMask[1515] = 256
ns.questClassMask[1516] = 64
ns.questClassMask[1517] = 64
ns.questClassMask[1518] = 64
ns.questClassMask[1519] = 64
ns.questClassMask[1520] = 64
ns.questClassMask[1521] = 64
ns.questClassMask[1522] = 64
ns.questClassMask[1524] = 64
ns.questClassMask[1525] = 64
ns.questClassMask[1526] = 64
ns.questClassMask[1527] = 64
ns.questClassMask[1528] = 64
ns.questClassMask[1530] = 64
ns.questClassMask[1531] = 64
ns.questClassMask[1534] = 64
ns.questClassMask[1535] = 64
ns.questClassMask[1536] = 64
ns.questClassMask[1598] = 256
ns.questClassMask[1599] = 256
ns.questClassMask[1638] = 1
ns.questClassMask[1639] = 1
ns.questClassMask[1640] = 1
ns.questClassMask[1642] = 2
ns.questClassMask[1643] = 2
ns.questClassMask[1644] = 2
ns.questClassMask[1646] = 2
ns.questClassMask[1647] = 2
ns.questClassMask[1648] = 2
ns.questClassMask[1649] = 2
ns.questClassMask[1650] = 2
ns.questClassMask[1651] = 2
ns.questClassMask[1652] = 2
ns.questClassMask[1653] = 2
ns.questClassMask[1654] = 2
ns.questClassMask[1661] = 2
ns.questClassMask[1665] = 1
ns.questClassMask[1666] = 1
ns.questClassMask[1667] = 1
ns.questClassMask[1678] = 1
ns.questClassMask[1679] = 1
ns.questClassMask[1680] = 1
ns.questClassMask[1681] = 1
ns.questClassMask[1682] = 1
ns.questClassMask[1683] = 1
ns.questClassMask[1684] = 1
ns.questClassMask[1685] = 256
ns.questClassMask[1686] = 1
ns.questClassMask[1688] = 256
ns.questClassMask[1689] = 256
ns.questClassMask[1692] = 1
ns.questClassMask[1693] = 1
ns.questClassMask[1698] = 1
ns.questClassMask[1699] = 1
ns.questClassMask[1700] = 1
ns.questClassMask[1701] = 1
ns.questClassMask[1702] = 1
ns.questClassMask[1703] = 1
ns.questClassMask[1704] = 1
ns.questClassMask[1705] = 1
ns.questClassMask[1706] = 1
ns.questClassMask[1708] = 1
ns.questClassMask[1709] = 1
ns.questClassMask[1710] = 1
ns.questClassMask[1711] = 1
ns.questClassMask[1712] = 1
ns.questClassMask[1713] = 1
ns.questClassMask[1715] = 256
ns.questClassMask[1716] = 256
ns.questClassMask[1717] = 256
ns.questClassMask[1718] = 1
ns.questClassMask[1719] = 1
ns.questClassMask[1738] = 256
ns.questClassMask[1739] = 256
ns.questClassMask[1740] = 256
ns.questClassMask[1758] = 256
ns.questClassMask[1778] = 2
ns.questClassMask[1779] = 2
ns.questClassMask[1780] = 2
ns.questClassMask[1781] = 2
ns.questClassMask[1782] = 1
ns.questClassMask[1783] = 2
ns.questClassMask[1784] = 2
ns.questClassMask[1785] = 2
ns.questClassMask[1786] = 2
ns.questClassMask[1787] = 2
ns.questClassMask[1788] = 2
ns.questClassMask[1791] = 1
ns.questClassMask[1792] = 1
ns.questClassMask[1795] = 256
ns.questClassMask[1796] = 256
ns.questClassMask[1798] = 256
ns.questClassMask[1799] = 256
ns.questClassMask[1801] = 256
ns.questClassMask[1802] = 256
ns.questClassMask[1803] = 256
ns.questClassMask[1804] = 256
ns.questClassMask[1805] = 256
ns.questClassMask[1806] = 2
ns.questClassMask[1818] = 1
ns.questClassMask[1819] = 1
ns.questClassMask[1820] = 1
ns.questClassMask[1821] = 1
ns.questClassMask[1822] = 1
ns.questClassMask[1823] = 1
ns.questClassMask[1824] = 1
ns.questClassMask[1825] = 1
ns.questClassMask[1838] = 1
ns.questClassMask[1839] = 1
ns.questClassMask[1840] = 1
ns.questClassMask[1841] = 1
ns.questClassMask[1842] = 1
ns.questClassMask[1843] = 1
ns.questClassMask[1844] = 1
ns.questClassMask[1845] = 1
ns.questClassMask[1846] = 1
ns.questClassMask[1847] = 1
ns.questClassMask[1848] = 1
ns.questClassMask[1858] = 8
ns.questClassMask[1859] = 8
ns.questClassMask[1860] = 128
ns.questClassMask[1861] = 128
ns.questClassMask[1879] = 128
ns.questClassMask[1880] = 128
ns.questClassMask[1881] = 128
ns.questClassMask[1882] = 128
ns.questClassMask[1883] = 128
ns.questClassMask[1884] = 128
ns.questClassMask[1885] = 8
ns.questClassMask[1886] = 8
ns.questClassMask[1898] = 8
ns.questClassMask[1899] = 8
ns.questClassMask[1919] = 128
ns.questClassMask[1920] = 128
ns.questClassMask[1921] = 128
ns.questClassMask[1938] = 128
ns.questClassMask[1939] = 128
ns.questClassMask[1940] = 128
ns.questClassMask[1941] = 128
ns.questClassMask[1942] = 128
ns.questClassMask[1943] = 128
ns.questClassMask[1944] = 128
ns.questClassMask[1945] = 128
ns.questClassMask[1946] = 128
ns.questClassMask[1947] = 128
ns.questClassMask[1948] = 128
ns.questClassMask[1949] = 128
ns.questClassMask[1950] = 128
ns.questClassMask[1951] = 128
ns.questClassMask[1952] = 128
ns.questClassMask[1953] = 128
ns.questClassMask[1954] = 128
ns.questClassMask[1955] = 128
ns.questClassMask[1956] = 128
ns.questClassMask[1957] = 128
ns.questClassMask[1958] = 128
ns.questClassMask[1959] = 128
ns.questClassMask[1960] = 128
ns.questClassMask[1961] = 128
ns.questClassMask[1962] = 128
ns.questClassMask[1963] = 8
ns.questClassMask[1978] = 8
ns.questClassMask[1998] = 8
ns.questClassMask[1999] = 8
ns.questClassMask[2205] = 8
ns.questClassMask[2206] = 8
ns.questClassMask[2218] = 8
ns.questClassMask[2238] = 8
ns.questClassMask[2239] = 8
ns.questClassMask[2241] = 8
ns.questClassMask[2242] = 8
ns.questClassMask[2259] = 8
ns.questClassMask[2260] = 8
ns.questClassMask[2281] = 8
ns.questClassMask[2282] = 8
ns.questClassMask[2298] = 8
ns.questClassMask[2299] = 8
ns.questClassMask[2300] = 8
ns.questClassMask[2358] = 8
ns.questClassMask[2359] = 8
ns.questClassMask[2360] = 8
ns.questClassMask[2378] = 8
ns.questClassMask[2379] = 8
ns.questClassMask[2380] = 8
ns.questClassMask[2381] = 8
ns.questClassMask[2382] = 8
ns.questClassMask[2383] = 1
ns.questClassMask[2458] = 8
ns.questClassMask[2460] = 8
ns.questClassMask[2478] = 8
ns.questClassMask[2479] = 8
ns.questClassMask[2480] = 8
ns.questClassMask[2607] = 8
ns.questClassMask[2608] = 8
ns.questClassMask[2609] = 8
ns.questClassMask[2996] = 256
ns.questClassMask[3065] = 1
ns.questClassMask[3082] = 4
ns.questClassMask[3083] = 8
ns.questClassMask[3084] = 64
ns.questClassMask[3085] = 16
ns.questClassMask[3086] = 128
ns.questClassMask[3087] = 4
ns.questClassMask[3088] = 8
ns.questClassMask[3089] = 64
ns.questClassMask[3090] = 256
ns.questClassMask[3091] = 1
ns.questClassMask[3092] = 4
ns.questClassMask[3093] = 64
ns.questClassMask[3094] = 1024
ns.questClassMask[3095] = 1
ns.questClassMask[3096] = 8
ns.questClassMask[3097] = 16
ns.questClassMask[3098] = 128
ns.questClassMask[3099] = 256
ns.questClassMask[3100] = 1
ns.questClassMask[3101] = 2
ns.questClassMask[3102] = 8
ns.questClassMask[3103] = 16
ns.questClassMask[3104] = 128
ns.questClassMask[3105] = 256
ns.questClassMask[3106] = 1
ns.questClassMask[3107] = 2
ns.questClassMask[3108] = 4
ns.questClassMask[3109] = 8
ns.questClassMask[3110] = 16
ns.questClassMask[3112] = 1
ns.questClassMask[3113] = 8
ns.questClassMask[3114] = 128
ns.questClassMask[3115] = 256
ns.questClassMask[3116] = 1
ns.questClassMask[3117] = 4
ns.questClassMask[3118] = 8
ns.questClassMask[3119] = 16
ns.questClassMask[3120] = 1024
ns.questClassMask[3631] = 256
ns.questClassMask[4487] = 256
ns.questClassMask[4490] = 256
ns.questClassMask[4736] = 256
ns.questClassMask[4737] = 256
ns.questClassMask[4781] = 256
ns.questClassMask[4782] = 256
ns.questClassMask[4783] = 256
ns.questClassMask[4784] = 256
ns.questClassMask[4786] = 256
ns.questClassMask[4961] = 256
ns.questClassMask[4962] = 256
ns.questClassMask[4963] = 256
ns.questClassMask[4964] = 256
ns.questClassMask[4965] = 256
ns.questClassMask[4968] = 256
ns.questClassMask[4975] = 256
ns.questClassMask[4976] = 256
ns.questClassMask[5061] = 1024
ns.questClassMask[5621] = 16
ns.questClassMask[5622] = 16
ns.questClassMask[5623] = 16
ns.questClassMask[5624] = 16
ns.questClassMask[5625] = 16
ns.questClassMask[5626] = 16
ns.questClassMask[5627] = 16
ns.questClassMask[5628] = 16
ns.questClassMask[5629] = 16
ns.questClassMask[5630] = 16
ns.questClassMask[5634] = 16
ns.questClassMask[5635] = 16
ns.questClassMask[5636] = 16
ns.questClassMask[5637] = 16
ns.questClassMask[5641] = 16
ns.questClassMask[5642] = 16
ns.questClassMask[5644] = 16
ns.questClassMask[5648] = 16
ns.questClassMask[5649] = 16
ns.questClassMask[5650] = 16
ns.questClassMask[5651] = 16
ns.questClassMask[5652] = 16
ns.questClassMask[5655] = 16
ns.questClassMask[5657] = 16
ns.questClassMask[5658] = 16
ns.questClassMask[5660] = 16
ns.questClassMask[5663] = 16
ns.questClassMask[5672] = 16
ns.questClassMask[5676] = 16
ns.questClassMask[5921] = 1024
ns.questClassMask[5922] = 1024
ns.questClassMask[5923] = 1024
ns.questClassMask[5926] = 1024
ns.questClassMask[5927] = 1024
ns.questClassMask[5929] = 1024
ns.questClassMask[5930] = 1024
ns.questClassMask[5931] = 1024
ns.questClassMask[5932] = 1024
ns.questClassMask[6001] = 1024
ns.questClassMask[6002] = 1024
ns.questClassMask[6061] = 4
ns.questClassMask[6062] = 4
ns.questClassMask[6063] = 4
ns.questClassMask[6064] = 4
ns.questClassMask[6065] = 4
ns.questClassMask[6066] = 4
ns.questClassMask[6067] = 4
ns.questClassMask[6068] = 4
ns.questClassMask[6071] = 4
ns.questClassMask[6072] = 4
ns.questClassMask[6074] = 4
ns.questClassMask[6081] = 4
ns.questClassMask[6082] = 4
ns.questClassMask[6083] = 4
ns.questClassMask[6084] = 4
ns.questClassMask[6085] = 4
ns.questClassMask[6086] = 4
ns.questClassMask[6087] = 4
ns.questClassMask[6088] = 4
ns.questClassMask[6089] = 4
ns.questClassMask[6101] = 4
ns.questClassMask[6102] = 4
ns.questClassMask[6103] = 4
ns.questClassMask[6121] = 1024
ns.questClassMask[6122] = 1024
ns.questClassMask[6123] = 1024
ns.questClassMask[6124] = 1024
ns.questClassMask[6125] = 1024
ns.questClassMask[6126] = 1024
ns.questClassMask[6127] = 1024
ns.questClassMask[6128] = 1024
ns.questClassMask[6129] = 1024
ns.questClassMask[6130] = 1024
ns.questClassMask[6681] = 8
ns.questClassMask[7463] = 128
ns.questClassMask[7498] = 8
ns.questClassMask[7499] = 1
ns.questClassMask[7500] = 128
ns.questClassMask[7501] = 2
ns.questClassMask[7502] = 256
ns.questClassMask[7503] = 4
ns.questClassMask[7504] = 16
ns.questClassMask[7505] = 64
ns.questClassMask[7506] = 1024
ns.questClassMask[7562] = 256
ns.questClassMask[7563] = 256
ns.questClassMask[7564] = 256
ns.questClassMask[7581] = 256
ns.questClassMask[7582] = 256
ns.questClassMask[7583] = 256
ns.questClassMask[7601] = 256
ns.questClassMask[7602] = 256
ns.questClassMask[7603] = 256
ns.questClassMask[7621] = 16
ns.questClassMask[7622] = 16
ns.questClassMask[7623] = 256
ns.questClassMask[7624] = 256
ns.questClassMask[7625] = 256
ns.questClassMask[7626] = 256
ns.questClassMask[7627] = 256
ns.questClassMask[7628] = 256
ns.questClassMask[7629] = 256
ns.questClassMask[7630] = 256
ns.questClassMask[7631] = 256
ns.questClassMask[7632] = 4
ns.questClassMask[7633] = 4
ns.questClassMask[7634] = 4
ns.questClassMask[7635] = 4
ns.questClassMask[7636] = 4
ns.questClassMask[7637] = 2
ns.questClassMask[7638] = 2
ns.questClassMask[7639] = 2
ns.questClassMask[7640] = 2
ns.questClassMask[7641] = 2
ns.questClassMask[7642] = 2
ns.questClassMask[7643] = 2
ns.questClassMask[7644] = 2
ns.questClassMask[7645] = 2
ns.questClassMask[7646] = 2
ns.questClassMask[7647] = 2
ns.questClassMask[7648] = 2
ns.questClassMask[7667] = 64
ns.questClassMask[8041] = 1
ns.questClassMask[8042] = 1
ns.questClassMask[8043] = 1
ns.questClassMask[8044] = 1
ns.questClassMask[8045] = 2
ns.questClassMask[8046] = 2
ns.questClassMask[8047] = 2
ns.questClassMask[8048] = 2
ns.questClassMask[8049] = 16
ns.questClassMask[8050] = 16
ns.questClassMask[8051] = 16
ns.questClassMask[8052] = 16
ns.questClassMask[8053] = 2
ns.questClassMask[8054] = 2
ns.questClassMask[8055] = 2
ns.questClassMask[8056] = 64
ns.questClassMask[8057] = 1024
ns.questClassMask[8058] = 1
ns.questClassMask[8059] = 256
ns.questClassMask[8060] = 128
ns.questClassMask[8061] = 16
ns.questClassMask[8062] = 4
ns.questClassMask[8063] = 8
ns.questClassMask[8064] = 1024
ns.questClassMask[8065] = 1024
ns.questClassMask[8066] = 4
ns.questClassMask[8067] = 4
ns.questClassMask[8068] = 128
ns.questClassMask[8069] = 128
ns.questClassMask[8070] = 16
ns.questClassMask[8071] = 16
ns.questClassMask[8072] = 8
ns.questClassMask[8073] = 8
ns.questClassMask[8074] = 64
ns.questClassMask[8075] = 64
ns.questClassMask[8076] = 256
ns.questClassMask[8077] = 256
ns.questClassMask[8078] = 1
ns.questClassMask[8079] = 1
ns.questClassMask[8101] = 128
ns.questClassMask[8102] = 128
ns.questClassMask[8103] = 128
ns.questClassMask[8104] = 128
ns.questClassMask[8106] = 256
ns.questClassMask[8107] = 256
ns.questClassMask[8108] = 256
ns.questClassMask[8109] = 256
ns.questClassMask[8110] = 1024
ns.questClassMask[8111] = 1024
ns.questClassMask[8112] = 1024
ns.questClassMask[8113] = 1024
ns.questClassMask[8116] = 64
ns.questClassMask[8117] = 64
ns.questClassMask[8118] = 64
ns.questClassMask[8119] = 64
ns.questClassMask[8141] = 8
ns.questClassMask[8142] = 8
ns.questClassMask[8143] = 8
ns.questClassMask[8144] = 8
ns.questClassMask[8145] = 4
ns.questClassMask[8146] = 4
ns.questClassMask[8147] = 4
ns.questClassMask[8148] = 4
ns.questClassMask[8151] = 4
ns.questClassMask[8153] = 4
ns.questClassMask[8231] = 4
ns.questClassMask[8232] = 4
ns.questClassMask[8233] = 8
ns.questClassMask[8234] = 8
ns.questClassMask[8235] = 8
ns.questClassMask[8236] = 8
ns.questClassMask[8249] = 8
ns.questClassMask[8250] = 128
ns.questClassMask[8251] = 128
ns.questClassMask[8252] = 128
ns.questClassMask[8253] = 128
ns.questClassMask[8254] = 16
ns.questClassMask[8255] = 16
ns.questClassMask[8256] = 16
ns.questClassMask[8257] = 16
ns.questClassMask[8258] = 64
ns.questClassMask[8316] = 1
ns.questClassMask[8376] = 2
ns.questClassMask[8377] = 4
ns.questClassMask[8378] = 8
ns.questClassMask[8379] = 16
ns.questClassMask[8380] = 64
ns.questClassMask[8381] = 128
ns.questClassMask[8382] = 1024
ns.questClassMask[8410] = 64
ns.questClassMask[8411] = 64
ns.questClassMask[8412] = 64
ns.questClassMask[8413] = 64
ns.questClassMask[8414] = 2
ns.questClassMask[8415] = 2
ns.questClassMask[8416] = 2
ns.questClassMask[8417] = 1
ns.questClassMask[8418] = 2
ns.questClassMask[8419] = 256
ns.questClassMask[8420] = 256
ns.questClassMask[8421] = 256
ns.questClassMask[8422] = 256
ns.questClassMask[8423] = 1
ns.questClassMask[8424] = 1
ns.questClassMask[8425] = 1
ns.questClassMask[8556] = 1
ns.questClassMask[8557] = 1
ns.questClassMask[8558] = 1
ns.questClassMask[8689] = 16
ns.questClassMask[8690] = 64
ns.questClassMask[8691] = 128
ns.questClassMask[8692] = 1024
ns.questClassMask[8693] = 8
ns.questClassMask[8694] = 256
ns.questClassMask[8695] = 2
ns.questClassMask[8696] = 4
ns.questClassMask[8697] = 16
ns.questClassMask[8698] = 64
ns.questClassMask[8699] = 128
ns.questClassMask[8700] = 1024
ns.questClassMask[8701] = 8
ns.questClassMask[8702] = 256
ns.questClassMask[8703] = 2
ns.questClassMask[8704] = 4
ns.questClassMask[8705] = 16
ns.questClassMask[8706] = 64
ns.questClassMask[8707] = 128
ns.questClassMask[8708] = 1024
ns.questClassMask[8709] = 8
ns.questClassMask[8710] = 256
ns.questClassMask[8711] = 2
ns.questClassMask[8712] = 4
ns.questClassMask[8905] = 1024
ns.questClassMask[8906] = 4
ns.questClassMask[8907] = 128
ns.questClassMask[8908] = 2
ns.questClassMask[8909] = 16
ns.questClassMask[8910] = 8
ns.questClassMask[8911] = 256
ns.questClassMask[8912] = 1
ns.questClassMask[8913] = 1024
ns.questClassMask[8914] = 4
ns.questClassMask[8915] = 128
ns.questClassMask[8916] = 16
ns.questClassMask[8917] = 8
ns.questClassMask[8918] = 64
ns.questClassMask[8919] = 256
ns.questClassMask[8920] = 1
ns.questClassMask[8926] = 1024
ns.questClassMask[8927] = 1024
ns.questClassMask[8931] = 4
ns.questClassMask[8932] = 128
ns.questClassMask[8933] = 2
ns.questClassMask[8934] = 16
ns.questClassMask[8935] = 8
ns.questClassMask[8936] = 256
ns.questClassMask[8937] = 1
ns.questClassMask[8938] = 4
ns.questClassMask[8939] = 128
ns.questClassMask[8940] = 16
ns.questClassMask[8941] = 8
ns.questClassMask[8942] = 64
ns.questClassMask[8943] = 256
ns.questClassMask[8944] = 1
ns.questClassMask[8951] = 1024
ns.questClassMask[8952] = 4
ns.questClassMask[8953] = 128
ns.questClassMask[8954] = 2
ns.questClassMask[8955] = 16
ns.questClassMask[8956] = 8
ns.questClassMask[8957] = 64
ns.questClassMask[8958] = 256
ns.questClassMask[8959] = 1
ns.questClassMask[8999] = 1024
ns.questClassMask[9000] = 4
ns.questClassMask[9001] = 128
ns.questClassMask[9002] = 2
ns.questClassMask[9003] = 16
ns.questClassMask[9004] = 8
ns.questClassMask[9005] = 256
ns.questClassMask[9006] = 1
ns.questClassMask[9007] = 1024
ns.questClassMask[9008] = 4
ns.questClassMask[9009] = 16
ns.questClassMask[9010] = 8
ns.questClassMask[9011] = 64
ns.questClassMask[9012] = 256
ns.questClassMask[9013] = 1
ns.questClassMask[9014] = 128
ns.questClassMask[9016] = 1024
ns.questClassMask[9017] = 4
ns.questClassMask[9018] = 128
ns.questClassMask[9019] = 16
ns.questClassMask[9020] = 8
ns.questClassMask[9021] = 256
ns.questClassMask[9022] = 1
ns.questClassMask[9051] = 1024
ns.questClassMask[9052] = 1024
ns.questClassMask[9053] = 1024
ns.questClassMask[9063] = 1024
ns.questClassMask[9257] = 16
ns.questClassMask[9269] = 1024
ns.questClassMask[9270] = 128
ns.questClassMask[9271] = 256
ns.questClassMask[9362] = 128
ns.questClassMask[9364] = 128
ns.questRaceMask = ns.questRaceMask or {}
ns.questRaceMask[5] = 77
ns.questRaceMask[6] = 77
ns.questRaceMask[7] = 77
ns.questRaceMask[8] = 178
ns.questRaceMask[9] = 77
ns.questRaceMask[10] = 255
ns.questRaceMask[11] = 77
ns.questRaceMask[12] = 77
ns.questRaceMask[13] = 77
ns.questRaceMask[14] = 77
ns.questRaceMask[15] = 77
ns.questRaceMask[18] = 77
ns.questRaceMask[19] = 77
ns.questRaceMask[20] = 77
ns.questRaceMask[21] = 77
ns.questRaceMask[22] = 77
ns.questRaceMask[25] = 178
ns.questRaceMask[26] = 32
ns.questRaceMask[27] = 8
ns.questRaceMask[28] = 32
ns.questRaceMask[29] = 8
ns.questRaceMask[30] = 32
ns.questRaceMask[31] = 32
ns.questRaceMask[32] = 178
ns.questRaceMask[33] = 77
ns.questRaceMask[34] = 77
ns.questRaceMask[35] = 77
ns.questRaceMask[36] = 77
ns.questRaceMask[37] = 77
ns.questRaceMask[38] = 77
ns.questRaceMask[39] = 77
ns.questRaceMask[40] = 77
ns.questRaceMask[45] = 77
ns.questRaceMask[46] = 77
ns.questRaceMask[47] = 77
ns.questRaceMask[52] = 77
ns.questRaceMask[54] = 77
ns.questRaceMask[55] = 77
ns.questRaceMask[56] = 77
ns.questRaceMask[57] = 77
ns.questRaceMask[58] = 77
ns.questRaceMask[59] = 77
ns.questRaceMask[60] = 77
ns.questRaceMask[61] = 77
ns.questRaceMask[62] = 77
ns.questRaceMask[63] = 178
ns.questRaceMask[64] = 77
ns.questRaceMask[65] = 77
ns.questRaceMask[66] = 77
ns.questRaceMask[67] = 77
ns.questRaceMask[69] = 77
ns.questRaceMask[71] = 77
ns.questRaceMask[76] = 77
ns.questRaceMask[77] = 178
ns.questRaceMask[79] = 77
ns.questRaceMask[80] = 77
ns.questRaceMask[81] = 178
ns.questRaceMask[82] = 255
ns.questRaceMask[83] = 77
ns.questRaceMask[84] = 77
ns.questRaceMask[85] = 77
ns.questRaceMask[86] = 77
ns.questRaceMask[87] = 77
ns.questRaceMask[88] = 77
ns.questRaceMask[89] = 77
ns.questRaceMask[90] = 77
ns.questRaceMask[91] = 77
ns.questRaceMask[92] = 77
ns.questRaceMask[93] = 77
ns.questRaceMask[95] = 77
ns.questRaceMask[96] = 178
ns.questRaceMask[97] = 77
ns.questRaceMask[98] = 77
ns.questRaceMask[99] = 178
ns.questRaceMask[100] = 178
ns.questRaceMask[101] = 77
ns.questRaceMask[102] = 77
ns.questRaceMask[105] = 178
ns.questRaceMask[106] = 77
ns.questRaceMask[107] = 77
ns.questRaceMask[109] = 77
ns.questRaceMask[110] = 255
ns.questRaceMask[111] = 77
ns.questRaceMask[112] = 77
ns.questRaceMask[113] = 255
ns.questRaceMask[114] = 77
ns.questRaceMask[115] = 77
ns.questRaceMask[116] = 77
ns.questRaceMask[118] = 77
ns.questRaceMask[120] = 77
ns.questRaceMask[122] = 77
ns.questRaceMask[124] = 77
ns.questRaceMask[125] = 77
ns.questRaceMask[126] = 77
ns.questRaceMask[127] = 77
ns.questRaceMask[128] = 77
ns.questRaceMask[129] = 77
ns.questRaceMask[130] = 77
ns.questRaceMask[131] = 77
ns.questRaceMask[132] = 77
ns.questRaceMask[133] = 77
ns.questRaceMask[134] = 77
ns.questRaceMask[135] = 77
ns.questRaceMask[138] = 255
ns.questRaceMask[139] = 255
ns.questRaceMask[140] = 255
ns.questRaceMask[142] = 77
ns.questRaceMask[143] = 77
ns.questRaceMask[144] = 77
ns.questRaceMask[145] = 77
ns.questRaceMask[146] = 77
ns.questRaceMask[147] = 77
ns.questRaceMask[148] = 77
ns.questRaceMask[149] = 77
ns.questRaceMask[150] = 77
ns.questRaceMask[151] = 77
ns.questRaceMask[153] = 77
ns.questRaceMask[154] = 77
ns.questRaceMask[155] = 77
ns.questRaceMask[156] = 77
ns.questRaceMask[157] = 77
ns.questRaceMask[158] = 77
ns.questRaceMask[159] = 77
ns.questRaceMask[160] = 77
ns.questRaceMask[161] = 77
ns.questRaceMask[162] = 77
ns.questRaceMask[163] = 77
ns.questRaceMask[164] = 77
ns.questRaceMask[165] = 77
ns.questRaceMask[169] = 77
ns.questRaceMask[170] = 77
ns.questRaceMask[173] = 77
ns.questRaceMask[174] = 77
ns.questRaceMask[175] = 77
ns.questRaceMask[176] = 77
ns.questRaceMask[177] = 77
ns.questRaceMask[179] = 77
ns.questRaceMask[180] = 77
ns.questRaceMask[181] = 77
ns.questRaceMask[182] = 77
ns.questRaceMask[183] = 77
ns.questRaceMask[185] = 255
ns.questRaceMask[186] = 255
ns.questRaceMask[187] = 255
ns.questRaceMask[188] = 255
ns.questRaceMask[189] = 255
ns.questRaceMask[190] = 255
ns.questRaceMask[191] = 255
ns.questRaceMask[192] = 255
ns.questRaceMask[193] = 255
ns.questRaceMask[194] = 255
ns.questRaceMask[195] = 255
ns.questRaceMask[196] = 255
ns.questRaceMask[197] = 255
ns.questRaceMask[198] = 77
ns.questRaceMask[199] = 77
ns.questRaceMask[200] = 77
ns.questRaceMask[201] = 255
ns.questRaceMask[202] = 77
ns.questRaceMask[203] = 77
ns.questRaceMask[204] = 77
ns.questRaceMask[205] = 77
ns.questRaceMask[206] = 77
ns.questRaceMask[207] = 77
ns.questRaceMask[208] = 255
ns.questRaceMask[209] = 255
ns.questRaceMask[210] = 77
ns.questRaceMask[211] = 77
ns.questRaceMask[213] = 255
ns.questRaceMask[215] = 77
ns.questRaceMask[216] = 178
ns.questRaceMask[217] = 77
ns.questRaceMask[218] = 77
ns.questRaceMask[219] = 77
ns.questRaceMask[220] = 178
ns.questRaceMask[221] = 77
ns.questRaceMask[222] = 77
ns.questRaceMask[223] = 77
ns.questRaceMask[224] = 77
ns.questRaceMask[225] = 77
ns.questRaceMask[226] = 77
ns.questRaceMask[227] = 77
ns.questRaceMask[228] = 77
ns.questRaceMask[229] = 77
ns.questRaceMask[230] = 77
ns.questRaceMask[231] = 77
ns.questRaceMask[233] = 77
ns.questRaceMask[234] = 77
ns.questRaceMask[237] = 77
ns.questRaceMask[239] = 77
ns.questRaceMask[240] = 77
ns.questRaceMask[244] = 77
ns.questRaceMask[245] = 77
ns.questRaceMask[246] = 77
ns.questRaceMask[247] = 178
ns.questRaceMask[248] = 77
ns.questRaceMask[249] = 77
ns.questRaceMask[250] = 77
ns.questRaceMask[251] = 77
ns.questRaceMask[252] = 77
ns.questRaceMask[253] = 77
ns.questRaceMask[255] = 77
ns.questRaceMask[256] = 77
ns.questRaceMask[257] = 77
ns.questRaceMask[258] = 77
ns.questRaceMask[261] = 77
ns.questRaceMask[262] = 77
ns.questRaceMask[263] = 77
ns.questRaceMask[265] = 77
ns.questRaceMask[266] = 77
ns.questRaceMask[267] = 77
ns.questRaceMask[268] = 77
ns.questRaceMask[269] = 77
ns.questRaceMask[271] = 77
ns.questRaceMask[272] = 8
ns.questRaceMask[273] = 77
ns.questRaceMask[274] = 77
ns.questRaceMask[275] = 77
ns.questRaceMask[276] = 77
ns.questRaceMask[277] = 77
ns.questRaceMask[278] = 77
ns.questRaceMask[279] = 77
ns.questRaceMask[280] = 77
ns.questRaceMask[281] = 77
ns.questRaceMask[282] = 77
ns.questRaceMask[283] = 77
ns.questRaceMask[284] = 77
ns.questRaceMask[285] = 77
ns.questRaceMask[286] = 77
ns.questRaceMask[287] = 77
ns.questRaceMask[288] = 77
ns.questRaceMask[289] = 77
ns.questRaceMask[290] = 77
ns.questRaceMask[291] = 77
ns.questRaceMask[292] = 77
ns.questRaceMask[293] = 77
ns.questRaceMask[294] = 77
ns.questRaceMask[295] = 77
ns.questRaceMask[296] = 77
ns.questRaceMask[297] = 77
ns.questRaceMask[298] = 77
ns.questRaceMask[299] = 77
ns.questRaceMask[301] = 77
ns.questRaceMask[303] = 77
ns.questRaceMask[304] = 77
ns.questRaceMask[305] = 77
ns.questRaceMask[306] = 77
ns.questRaceMask[307] = 77
ns.questRaceMask[309] = 77
ns.questRaceMask[310] = 77
ns.questRaceMask[311] = 77
ns.questRaceMask[312] = 77
ns.questRaceMask[313] = 77
ns.questRaceMask[314] = 77
ns.questRaceMask[315] = 77
ns.questRaceMask[317] = 77
ns.questRaceMask[318] = 77
ns.questRaceMask[319] = 77
ns.questRaceMask[320] = 77
ns.questRaceMask[321] = 77
ns.questRaceMask[322] = 77
ns.questRaceMask[323] = 77
ns.questRaceMask[324] = 77
ns.questRaceMask[328] = 77
ns.questRaceMask[329] = 77
ns.questRaceMask[330] = 77
ns.questRaceMask[331] = 77
ns.questRaceMask[338] = 255
ns.questRaceMask[339] = 255
ns.questRaceMask[340] = 255
ns.questRaceMask[341] = 255
ns.questRaceMask[342] = 255
ns.questRaceMask[347] = 77
ns.questRaceMask[348] = 255
ns.questRaceMask[354] = 178
ns.questRaceMask[355] = 178
ns.questRaceMask[356] = 178
ns.questRaceMask[358] = 178
ns.questRaceMask[359] = 178
ns.questRaceMask[360] = 178
ns.questRaceMask[362] = 178
ns.questRaceMask[363] = 16
ns.questRaceMask[364] = 178
ns.questRaceMask[365] = 178
ns.questRaceMask[367] = 16
ns.questRaceMask[368] = 16
ns.questRaceMask[369] = 16
ns.questRaceMask[370] = 178
ns.questRaceMask[371] = 178
ns.questRaceMask[372] = 178
ns.questRaceMask[374] = 178
ns.questRaceMask[375] = 178
ns.questRaceMask[376] = 178
ns.questRaceMask[379] = 178
ns.questRaceMask[380] = 178
ns.questRaceMask[381] = 178
ns.questRaceMask[382] = 178
ns.questRaceMask[383] = 178
ns.questRaceMask[384] = 77
ns.questRaceMask[385] = 77
ns.questRaceMask[397] = 65
ns.questRaceMask[398] = 178
ns.questRaceMask[400] = 77
ns.questRaceMask[401] = 77
ns.questRaceMask[404] = 178
ns.questRaceMask[405] = 178
ns.questRaceMask[407] = 178
ns.questRaceMask[408] = 178
ns.questRaceMask[409] = 178
ns.questRaceMask[411] = 178
ns.questRaceMask[412] = 77
ns.questRaceMask[413] = 77
ns.questRaceMask[414] = 77
ns.questRaceMask[415] = 77
ns.questRaceMask[416] = 77
ns.questRaceMask[417] = 77
ns.questRaceMask[418] = 77
ns.questRaceMask[419] = 77
ns.questRaceMask[420] = 77
ns.questRaceMask[421] = 178
ns.questRaceMask[422] = 178
ns.questRaceMask[423] = 178
ns.questRaceMask[424] = 178
ns.questRaceMask[425] = 178
ns.questRaceMask[426] = 178
ns.questRaceMask[427] = 178
ns.questRaceMask[428] = 178
ns.questRaceMask[429] = 178
ns.questRaceMask[430] = 178
ns.questRaceMask[432] = 77
ns.questRaceMask[433] = 77
ns.questRaceMask[435] = 178
ns.questRaceMask[436] = 77
ns.questRaceMask[437] = 178
ns.questRaceMask[438] = 178
ns.questRaceMask[439] = 178
ns.questRaceMask[440] = 178
ns.questRaceMask[441] = 178
ns.questRaceMask[442] = 178
ns.questRaceMask[443] = 178
ns.questRaceMask[444] = 178
ns.questRaceMask[445] = 178
ns.questRaceMask[447] = 178
ns.questRaceMask[448] = 178
ns.questRaceMask[449] = 178
ns.questRaceMask[451] = 178
ns.questRaceMask[452] = 178
ns.questRaceMask[453] = 77
ns.questRaceMask[454] = 77
ns.questRaceMask[455] = 77
ns.questRaceMask[456] = 77
ns.questRaceMask[457] = 77
ns.questRaceMask[458] = 77
ns.questRaceMask[459] = 77
ns.questRaceMask[461] = 178
ns.questRaceMask[463] = 77
ns.questRaceMask[464] = 77
ns.questRaceMask[465] = 77
ns.questRaceMask[467] = 77
ns.questRaceMask[468] = 77
ns.questRaceMask[469] = 77
ns.questRaceMask[470] = 77
ns.questRaceMask[471] = 77
ns.questRaceMask[472] = 77
ns.questRaceMask[473] = 77
ns.questRaceMask[474] = 77
ns.questRaceMask[475] = 77
ns.questRaceMask[476] = 77
ns.questRaceMask[477] = 178
ns.questRaceMask[478] = 178
ns.questRaceMask[479] = 178
ns.questRaceMask[480] = 178
ns.questRaceMask[481] = 178
ns.questRaceMask[482] = 178
ns.questRaceMask[483] = 77
ns.questRaceMask[484] = 77
ns.questRaceMask[486] = 77
ns.questRaceMask[487] = 77
ns.questRaceMask[488] = 77
ns.questRaceMask[489] = 77
ns.questRaceMask[491] = 178
ns.questRaceMask[492] = 178
ns.questRaceMask[493] = 178
ns.questRaceMask[494] = 178
ns.questRaceMask[496] = 178
ns.questRaceMask[498] = 178
ns.questRaceMask[499] = 178
ns.questRaceMask[500] = 77
ns.questRaceMask[501] = 178
ns.questRaceMask[502] = 178
ns.questRaceMask[503] = 178
ns.questRaceMask[504] = 77
ns.questRaceMask[505] = 77
ns.questRaceMask[509] = 178
ns.questRaceMask[512] = 77
ns.questRaceMask[513] = 178
ns.questRaceMask[514] = 77
ns.questRaceMask[516] = 178
ns.questRaceMask[517] = 178
ns.questRaceMask[518] = 178
ns.questRaceMask[519] = 178
ns.questRaceMask[523] = 77
ns.questRaceMask[524] = 178
ns.questRaceMask[526] = 77
ns.questRaceMask[527] = 178
ns.questRaceMask[528] = 178
ns.questRaceMask[529] = 178
ns.questRaceMask[531] = 77
ns.questRaceMask[532] = 178
ns.questRaceMask[533] = 178
ns.questRaceMask[536] = 77
ns.questRaceMask[537] = 77
ns.questRaceMask[539] = 178
ns.questRaceMask[540] = 77
ns.questRaceMask[541] = 178
ns.questRaceMask[542] = 77
ns.questRaceMask[544] = 178
ns.questRaceMask[545] = 178
ns.questRaceMask[546] = 178
ns.questRaceMask[547] = 178
ns.questRaceMask[549] = 178
ns.questRaceMask[550] = 178
ns.questRaceMask[552] = 178
ns.questRaceMask[553] = 178
ns.questRaceMask[554] = 77
ns.questRaceMask[555] = 77
ns.questRaceMask[556] = 178
ns.questRaceMask[557] = 178
ns.questRaceMask[559] = 77
ns.questRaceMask[560] = 77
ns.questRaceMask[561] = 77
ns.questRaceMask[562] = 77
ns.questRaceMask[563] = 77
ns.questRaceMask[564] = 77
ns.questRaceMask[565] = 77
ns.questRaceMask[566] = 178
ns.questRaceMask[567] = 178
ns.questRaceMask[568] = 178
ns.questRaceMask[569] = 178
ns.questRaceMask[570] = 178
ns.questRaceMask[571] = 178
ns.questRaceMask[572] = 178
ns.questRaceMask[573] = 178
ns.questRaceMask[574] = 77
ns.questRaceMask[575] = 255
ns.questRaceMask[576] = 255
ns.questRaceMask[577] = 255
ns.questRaceMask[578] = 77
ns.questRaceMask[580] = 255
ns.questRaceMask[581] = 178
ns.questRaceMask[582] = 178
ns.questRaceMask[583] = 255
ns.questRaceMask[584] = 178
ns.questRaceMask[585] = 178
ns.questRaceMask[586] = 178
ns.questRaceMask[587] = 255
ns.questRaceMask[588] = 178
ns.questRaceMask[589] = 178
ns.questRaceMask[590] = 178
ns.questRaceMask[591] = 178
ns.questRaceMask[592] = 178
ns.questRaceMask[595] = 255
ns.questRaceMask[596] = 178
ns.questRaceMask[597] = 255
ns.questRaceMask[598] = 178
ns.questRaceMask[599] = 255
ns.questRaceMask[600] = 255
ns.questRaceMask[601] = 77
ns.questRaceMask[602] = 77
ns.questRaceMask[604] = 255
ns.questRaceMask[605] = 255
ns.questRaceMask[606] = 255
ns.questRaceMask[607] = 255
ns.questRaceMask[608] = 255
ns.questRaceMask[609] = 255
ns.questRaceMask[610] = 77
ns.questRaceMask[611] = 77
ns.questRaceMask[613] = 255
ns.questRaceMask[616] = 77
ns.questRaceMask[617] = 255
ns.questRaceMask[621] = 255
ns.questRaceMask[622] = 77
ns.questRaceMask[623] = 77
ns.questRaceMask[625] = 255
ns.questRaceMask[626] = 255
ns.questRaceMask[627] = 77
ns.questRaceMask[628] = 255
ns.questRaceMask[629] = 178
ns.questRaceMask[630] = 255
ns.questRaceMask[631] = 77
ns.questRaceMask[632] = 77
ns.questRaceMask[633] = 77
ns.questRaceMask[634] = 77
ns.questRaceMask[638] = 178
ns.questRaceMask[639] = 178
ns.questRaceMask[640] = 178
ns.questRaceMask[641] = 178
ns.questRaceMask[642] = 255
ns.questRaceMask[643] = 178
ns.questRaceMask[644] = 178
ns.questRaceMask[645] = 178
ns.questRaceMask[646] = 178
ns.questRaceMask[647] = 77
ns.questRaceMask[648] = 255
ns.questRaceMask[651] = 255
ns.questRaceMask[652] = 255
ns.questRaceMask[653] = 77
ns.questRaceMask[655] = 178
ns.questRaceMask[657] = 77
ns.questRaceMask[658] = 77
ns.questRaceMask[659] = 77
ns.questRaceMask[660] = 77
ns.questRaceMask[661] = 77
ns.questRaceMask[662] = 255
ns.questRaceMask[663] = 255
ns.questRaceMask[664] = 255
ns.questRaceMask[665] = 255
ns.questRaceMask[666] = 255
ns.questRaceMask[667] = 255
ns.questRaceMask[668] = 255
ns.questRaceMask[669] = 255
ns.questRaceMask[670] = 255
ns.questRaceMask[671] = 178
ns.questRaceMask[672] = 178
ns.questRaceMask[673] = 178
ns.questRaceMask[674] = 178
ns.questRaceMask[675] = 178
ns.questRaceMask[676] = 178
ns.questRaceMask[677] = 178
ns.questRaceMask[678] = 178
ns.questRaceMask[679] = 178
ns.questRaceMask[680] = 178
ns.questRaceMask[682] = 77
ns.questRaceMask[684] = 77
ns.questRaceMask[685] = 77
ns.questRaceMask[687] = 255
ns.questRaceMask[688] = 178
ns.questRaceMask[691] = 77
ns.questRaceMask[692] = 255
ns.questRaceMask[693] = 77
ns.questRaceMask[694] = 77
ns.questRaceMask[695] = 77
ns.questRaceMask[696] = 77
ns.questRaceMask[697] = 77
ns.questRaceMask[698] = 178
ns.questRaceMask[699] = 178
ns.questRaceMask[701] = 178
ns.questRaceMask[702] = 178
ns.questRaceMask[703] = 255
ns.questRaceMask[705] = 255
ns.questRaceMask[706] = 77
ns.questRaceMask[710] = 255
ns.questRaceMask[711] = 255
ns.questRaceMask[712] = 255
ns.questRaceMask[713] = 255
ns.questRaceMask[714] = 255
ns.questRaceMask[715] = 255
ns.questRaceMask[716] = 255
ns.questRaceMask[717] = 77
ns.questRaceMask[718] = 77
ns.questRaceMask[719] = 77
ns.questRaceMask[720] = 77
ns.questRaceMask[724] = 77
ns.questRaceMask[727] = 77
ns.questRaceMask[728] = 178
ns.questRaceMask[729] = 77
ns.questRaceMask[731] = 77
ns.questRaceMask[732] = 77
ns.questRaceMask[733] = 77
ns.questRaceMask[734] = 255
ns.questRaceMask[739] = 77
ns.questRaceMask[741] = 77
ns.questRaceMask[743] = 178
ns.questRaceMask[745] = 178
ns.questRaceMask[746] = 178
ns.questRaceMask[747] = 178
ns.questRaceMask[748] = 32
ns.questRaceMask[749] = 178
ns.questRaceMask[750] = 178
ns.questRaceMask[751] = 178
ns.questRaceMask[752] = 178
ns.questRaceMask[753] = 178
ns.questRaceMask[754] = 32
ns.questRaceMask[755] = 178
ns.questRaceMask[756] = 32
ns.questRaceMask[757] = 178
ns.questRaceMask[758] = 32
ns.questRaceMask[759] = 32
ns.questRaceMask[760] = 32
ns.questRaceMask[761] = 178
ns.questRaceMask[763] = 178
ns.questRaceMask[764] = 178
ns.questRaceMask[765] = 178
ns.questRaceMask[766] = 178
ns.questRaceMask[767] = 178
ns.questRaceMask[771] = 178
ns.questRaceMask[772] = 178
ns.questRaceMask[775] = 178
ns.questRaceMask[777] = 255
ns.questRaceMask[778] = 255
ns.questRaceMask[780] = 178
ns.questRaceMask[782] = 178
ns.questRaceMask[783] = 77
ns.questRaceMask[784] = 178
ns.questRaceMask[786] = 178
ns.questRaceMask[788] = 178
ns.questRaceMask[789] = 178
ns.questRaceMask[790] = 178
ns.questRaceMask[791] = 178
ns.questRaceMask[793] = 178
ns.questRaceMask[794] = 178
ns.questRaceMask[804] = 178
ns.questRaceMask[805] = 178
ns.questRaceMask[806] = 178
ns.questRaceMask[808] = 178
ns.questRaceMask[812] = 178
ns.questRaceMask[815] = 178
ns.questRaceMask[816] = 178
ns.questRaceMask[817] = 178
ns.questRaceMask[818] = 178
ns.questRaceMask[821] = 178
ns.questRaceMask[823] = 178
ns.questRaceMask[824] = 178
ns.questRaceMask[825] = 178
ns.questRaceMask[826] = 178
ns.questRaceMask[827] = 178
ns.questRaceMask[828] = 178
ns.questRaceMask[829] = 178
ns.questRaceMask[831] = 178
ns.questRaceMask[833] = 178
ns.questRaceMask[834] = 178
ns.questRaceMask[835] = 178
ns.questRaceMask[836] = 255
ns.questRaceMask[837] = 178
ns.questRaceMask[838] = 178
ns.questRaceMask[840] = 178
ns.questRaceMask[842] = 178
ns.questRaceMask[843] = 178
ns.questRaceMask[844] = 178
ns.questRaceMask[845] = 178
ns.questRaceMask[846] = 178
ns.questRaceMask[847] = 178
ns.questRaceMask[848] = 178
ns.questRaceMask[849] = 178
ns.questRaceMask[850] = 178
ns.questRaceMask[851] = 178
ns.questRaceMask[852] = 178
ns.questRaceMask[853] = 178
ns.questRaceMask[854] = 32
ns.questRaceMask[855] = 178
ns.questRaceMask[857] = 178
ns.questRaceMask[858] = 255
ns.questRaceMask[861] = 178
ns.questRaceMask[862] = 178
ns.questRaceMask[863] = 255
ns.questRaceMask[864] = 178
ns.questRaceMask[865] = 255
ns.questRaceMask[866] = 255
ns.questRaceMask[867] = 178
ns.questRaceMask[868] = 178
ns.questRaceMask[869] = 178
ns.questRaceMask[870] = 178
ns.questRaceMask[871] = 178
ns.questRaceMask[872] = 178
ns.questRaceMask[873] = 178
ns.questRaceMask[874] = 178
ns.questRaceMask[875] = 178
ns.questRaceMask[876] = 178
ns.questRaceMask[877] = 178
ns.questRaceMask[878] = 178
ns.questRaceMask[879] = 178
ns.questRaceMask[880] = 178
ns.questRaceMask[881] = 178
ns.questRaceMask[882] = 178
ns.questRaceMask[887] = 255
ns.questRaceMask[888] = 255
ns.questRaceMask[890] = 255
ns.questRaceMask[891] = 178
ns.questRaceMask[892] = 255
ns.questRaceMask[893] = 178
ns.questRaceMask[894] = 255
ns.questRaceMask[895] = 255
ns.questRaceMask[896] = 255
ns.questRaceMask[898] = 178
ns.questRaceMask[899] = 178
ns.questRaceMask[900] = 255
ns.questRaceMask[901] = 255
ns.questRaceMask[902] = 255
ns.questRaceMask[903] = 178
ns.questRaceMask[905] = 178
ns.questRaceMask[906] = 178
ns.questRaceMask[907] = 178
ns.questRaceMask[913] = 178
ns.questRaceMask[916] = 77
ns.questRaceMask[917] = 77
ns.questRaceMask[918] = 77
ns.questRaceMask[919] = 77
ns.questRaceMask[920] = 77
ns.questRaceMask[921] = 77
ns.questRaceMask[922] = 77
ns.questRaceMask[924] = 178
ns.questRaceMask[928] = 77
ns.questRaceMask[929] = 77
ns.questRaceMask[930] = 77
ns.questRaceMask[931] = 77
ns.questRaceMask[932] = 77
ns.questRaceMask[933] = 77
ns.questRaceMask[935] = 77
ns.questRaceMask[937] = 77
ns.questRaceMask[938] = 77
ns.questRaceMask[940] = 77
ns.questRaceMask[941] = 77
ns.questRaceMask[943] = 77
ns.questRaceMask[944] = 77
ns.questRaceMask[945] = 77
ns.questRaceMask[947] = 77
ns.questRaceMask[948] = 77
ns.questRaceMask[950] = 77
ns.questRaceMask[951] = 77
ns.questRaceMask[953] = 77
ns.questRaceMask[954] = 77
ns.questRaceMask[955] = 77
ns.questRaceMask[956] = 77
ns.questRaceMask[957] = 77
ns.questRaceMask[958] = 77
ns.questRaceMask[959] = 255
ns.questRaceMask[963] = 77
ns.questRaceMask[964] = 178
ns.questRaceMask[965] = 77
ns.questRaceMask[966] = 77
ns.questRaceMask[967] = 77
ns.questRaceMask[969] = 255
ns.questRaceMask[970] = 77
ns.questRaceMask[973] = 77
ns.questRaceMask[974] = 255
ns.questRaceMask[975] = 255
ns.questRaceMask[976] = 77
ns.questRaceMask[977] = 255
ns.questRaceMask[980] = 255
ns.questRaceMask[982] = 77
ns.questRaceMask[983] = 77
ns.questRaceMask[984] = 77
ns.questRaceMask[985] = 77
ns.questRaceMask[986] = 77
ns.questRaceMask[991] = 77
ns.questRaceMask[992] = 255
ns.questRaceMask[993] = 77
ns.questRaceMask[997] = 77
ns.questRaceMask[1001] = 77
ns.questRaceMask[1002] = 77
ns.questRaceMask[1003] = 77
ns.questRaceMask[1007] = 77
ns.questRaceMask[1008] = 77
ns.questRaceMask[1009] = 77
ns.questRaceMask[1010] = 77
ns.questRaceMask[1011] = 77
ns.questRaceMask[1012] = 77
ns.questRaceMask[1016] = 77
ns.questRaceMask[1017] = 77
ns.questRaceMask[1020] = 77
ns.questRaceMask[1021] = 77
ns.questRaceMask[1022] = 77
ns.questRaceMask[1023] = 77
ns.questRaceMask[1024] = 77
ns.questRaceMask[1025] = 77
ns.questRaceMask[1026] = 77
ns.questRaceMask[1027] = 77
ns.questRaceMask[1028] = 77
ns.questRaceMask[1029] = 77
ns.questRaceMask[1030] = 77
ns.questRaceMask[1031] = 77
ns.questRaceMask[1032] = 77
ns.questRaceMask[1033] = 77
ns.questRaceMask[1034] = 77
ns.questRaceMask[1035] = 77
ns.questRaceMask[1037] = 77
ns.questRaceMask[1040] = 77
ns.questRaceMask[1041] = 77
ns.questRaceMask[1042] = 77
ns.questRaceMask[1043] = 77
ns.questRaceMask[1044] = 77
ns.questRaceMask[1052] = 77
ns.questRaceMask[1054] = 77
ns.questRaceMask[1055] = 77
ns.questRaceMask[1056] = 77
ns.questRaceMask[1057] = 77
ns.questRaceMask[1058] = 178
ns.questRaceMask[1059] = 77
ns.questRaceMask[1060] = 178
ns.questRaceMask[1062] = 178
ns.questRaceMask[1063] = 178
ns.questRaceMask[1066] = 178
ns.questRaceMask[1067] = 178
ns.questRaceMask[1068] = 178
ns.questRaceMask[1069] = 255
ns.questRaceMask[1070] = 77
ns.questRaceMask[1071] = 77
ns.questRaceMask[1072] = 77
ns.questRaceMask[1075] = 77
ns.questRaceMask[1079] = 77
ns.questRaceMask[1080] = 77
ns.questRaceMask[1081] = 77
ns.questRaceMask[1082] = 77
ns.questRaceMask[1083] = 77
ns.questRaceMask[1084] = 77
ns.questRaceMask[1085] = 77
ns.questRaceMask[1087] = 178
ns.questRaceMask[1088] = 178
ns.questRaceMask[1089] = 178
ns.questRaceMask[1090] = 255
ns.questRaceMask[1091] = 77
ns.questRaceMask[1092] = 255
ns.questRaceMask[1093] = 255
ns.questRaceMask[1094] = 255
ns.questRaceMask[1095] = 255
ns.questRaceMask[1096] = 255
ns.questRaceMask[1097] = 77
ns.questRaceMask[1104] = 255
ns.questRaceMask[1105] = 255
ns.questRaceMask[1106] = 255
ns.questRaceMask[1107] = 255
ns.questRaceMask[1108] = 255
ns.questRaceMask[1110] = 255
ns.questRaceMask[1111] = 255
ns.questRaceMask[1114] = 255
ns.questRaceMask[1115] = 255
ns.questRaceMask[1116] = 255
ns.questRaceMask[1117] = 255
ns.questRaceMask[1118] = 255
ns.questRaceMask[1119] = 255
ns.questRaceMask[1120] = 255
ns.questRaceMask[1121] = 255
ns.questRaceMask[1122] = 255
ns.questRaceMask[1124] = 255
ns.questRaceMask[1125] = 255
ns.questRaceMask[1126] = 255
ns.questRaceMask[1130] = 178
ns.questRaceMask[1132] = 77
ns.questRaceMask[1134] = 77
ns.questRaceMask[1137] = 255
ns.questRaceMask[1138] = 77
ns.questRaceMask[1140] = 77
ns.questRaceMask[1141] = 77
ns.questRaceMask[1147] = 178
ns.questRaceMask[1149] = 178
ns.questRaceMask[1150] = 178
ns.questRaceMask[1151] = 178
ns.questRaceMask[1152] = 178
ns.questRaceMask[1153] = 178
ns.questRaceMask[1154] = 178
ns.questRaceMask[1159] = 178
ns.questRaceMask[1166] = 178
ns.questRaceMask[1167] = 77
ns.questRaceMask[1168] = 178
ns.questRaceMask[1169] = 178
ns.questRaceMask[1170] = 178
ns.questRaceMask[1171] = 178
ns.questRaceMask[1172] = 178
ns.questRaceMask[1173] = 178
ns.questRaceMask[1175] = 255
ns.questRaceMask[1176] = 255
ns.questRaceMask[1177] = 255
ns.questRaceMask[1178] = 255
ns.questRaceMask[1181] = 255
ns.questRaceMask[1182] = 255
ns.questRaceMask[1183] = 255
ns.questRaceMask[1185] = 255
ns.questRaceMask[1186] = 255
ns.questRaceMask[1187] = 255
ns.questRaceMask[1188] = 255
ns.questRaceMask[1190] = 255
ns.questRaceMask[1194] = 255
ns.questRaceMask[1197] = 178
ns.questRaceMask[1201] = 178
ns.questRaceMask[1202] = 178
ns.questRaceMask[1203] = 255
ns.questRaceMask[1204] = 77
ns.questRaceMask[1206] = 255
ns.questRaceMask[1218] = 255
ns.questRaceMask[1219] = 77
ns.questRaceMask[1220] = 77
ns.questRaceMask[1222] = 77
ns.questRaceMask[1238] = 178
ns.questRaceMask[1239] = 178
ns.questRaceMask[1240] = 178
ns.questRaceMask[1244] = 77
ns.questRaceMask[1245] = 77
ns.questRaceMask[1249] = 77
ns.questRaceMask[1250] = 77
ns.questRaceMask[1251] = 178
ns.questRaceMask[1252] = 77
ns.questRaceMask[1253] = 77
ns.questRaceMask[1258] = 77
ns.questRaceMask[1259] = 77
ns.questRaceMask[1261] = 178
ns.questRaceMask[1262] = 178
ns.questRaceMask[1264] = 77
ns.questRaceMask[1265] = 77
ns.questRaceMask[1266] = 77
ns.questRaceMask[1267] = 77
ns.questRaceMask[1268] = 178
ns.questRaceMask[1269] = 178
ns.questRaceMask[1270] = 178
ns.questRaceMask[1273] = 178
ns.questRaceMask[1276] = 178
ns.questRaceMask[1282] = 77
ns.questRaceMask[1284] = 77
ns.questRaceMask[1285] = 77
ns.questRaceMask[1286] = 77
ns.questRaceMask[1302] = 77
ns.questRaceMask[1319] = 77
ns.questRaceMask[1320] = 77
ns.questRaceMask[1321] = 178
ns.questRaceMask[1322] = 178
ns.questRaceMask[1323] = 178
ns.questRaceMask[1324] = 77
ns.questRaceMask[1338] = 77
ns.questRaceMask[1339] = 77
ns.questRaceMask[1359] = 178
ns.questRaceMask[1361] = 178
ns.questRaceMask[1365] = 178
ns.questRaceMask[1366] = 178
ns.questRaceMask[1367] = 178
ns.questRaceMask[1368] = 178
ns.questRaceMask[1369] = 255
ns.questRaceMask[1370] = 255
ns.questRaceMask[1371] = 255
ns.questRaceMask[1373] = 255
ns.questRaceMask[1374] = 255
ns.questRaceMask[1375] = 255
ns.questRaceMask[1380] = 255
ns.questRaceMask[1381] = 255
ns.questRaceMask[1382] = 77
ns.questRaceMask[1384] = 77
ns.questRaceMask[1385] = 77
ns.questRaceMask[1386] = 77
ns.questRaceMask[1387] = 77
ns.questRaceMask[1419] = 178
ns.questRaceMask[1420] = 178
ns.questRaceMask[1422] = 178
ns.questRaceMask[1424] = 178
ns.questRaceMask[1426] = 178
ns.questRaceMask[1427] = 178
ns.questRaceMask[1428] = 178
ns.questRaceMask[1429] = 178
ns.questRaceMask[1430] = 178
ns.questRaceMask[1433] = 178
ns.questRaceMask[1434] = 178
ns.questRaceMask[1435] = 178
ns.questRaceMask[1436] = 178
ns.questRaceMask[1437] = 77
ns.questRaceMask[1438] = 77
ns.questRaceMask[1439] = 77
ns.questRaceMask[1440] = 77
ns.questRaceMask[1444] = 178
ns.questRaceMask[1450] = 77
ns.questRaceMask[1451] = 77
ns.questRaceMask[1452] = 77
ns.questRaceMask[1454] = 77
ns.questRaceMask[1455] = 77
ns.questRaceMask[1456] = 77
ns.questRaceMask[1457] = 77
ns.questRaceMask[1458] = 77
ns.questRaceMask[1459] = 77
ns.questRaceMask[1465] = 77
ns.questRaceMask[1466] = 77
ns.questRaceMask[1467] = 77
ns.questRaceMask[1469] = 77
ns.questRaceMask[1470] = 178
ns.questRaceMask[1471] = 16
ns.questRaceMask[1472] = 178
ns.questRaceMask[1473] = 16
ns.questRaceMask[1474] = 178
ns.questRaceMask[1476] = 178
ns.questRaceMask[1478] = 178
ns.questRaceMask[1481] = 178
ns.questRaceMask[1482] = 178
ns.questRaceMask[1483] = 255
ns.questRaceMask[1484] = 178
ns.questRaceMask[1485] = 178
ns.questRaceMask[1488] = 178
ns.questRaceMask[1489] = 178
ns.questRaceMask[1492] = 178
ns.questRaceMask[1498] = 178
ns.questRaceMask[1499] = 178
ns.questRaceMask[1501] = 178
ns.questRaceMask[1502] = 178
ns.questRaceMask[1503] = 178
ns.questRaceMask[1504] = 178
ns.questRaceMask[1505] = 178
ns.questRaceMask[1506] = 178
ns.questRaceMask[1507] = 178
ns.questRaceMask[1508] = 178
ns.questRaceMask[1509] = 178
ns.questRaceMask[1510] = 178
ns.questRaceMask[1511] = 178
ns.questRaceMask[1512] = 178
ns.questRaceMask[1513] = 178
ns.questRaceMask[1515] = 178
ns.questRaceMask[1516] = 178
ns.questRaceMask[1517] = 178
ns.questRaceMask[1518] = 178
ns.questRaceMask[1519] = 32
ns.questRaceMask[1520] = 178
ns.questRaceMask[1521] = 178
ns.questRaceMask[1522] = 178
ns.questRaceMask[1524] = 178
ns.questRaceMask[1525] = 178
ns.questRaceMask[1526] = 178
ns.questRaceMask[1527] = 178
ns.questRaceMask[1528] = 178
ns.questRaceMask[1530] = 178
ns.questRaceMask[1531] = 178
ns.questRaceMask[1534] = 178
ns.questRaceMask[1535] = 178
ns.questRaceMask[1536] = 178
ns.questRaceMask[1560] = 255
ns.questRaceMask[1579] = 77
ns.questRaceMask[1580] = 77
ns.questRaceMask[1598] = 77
ns.questRaceMask[1599] = 77
ns.questRaceMask[1638] = 77
ns.questRaceMask[1639] = 77
ns.questRaceMask[1640] = 77
ns.questRaceMask[1642] = 1
ns.questRaceMask[1643] = 1
ns.questRaceMask[1644] = 1
ns.questRaceMask[1646] = 4
ns.questRaceMask[1647] = 4
ns.questRaceMask[1648] = 4
ns.questRaceMask[1649] = 5
ns.questRaceMask[1650] = 5
ns.questRaceMask[1651] = 5
ns.questRaceMask[1652] = 5
ns.questRaceMask[1653] = 5
ns.questRaceMask[1654] = 5
ns.questRaceMask[1656] = 178
ns.questRaceMask[1661] = 5
ns.questRaceMask[1665] = 77
ns.questRaceMask[1666] = 77
ns.questRaceMask[1667] = 77
ns.questRaceMask[1678] = 77
ns.questRaceMask[1679] = 77
ns.questRaceMask[1680] = 77
ns.questRaceMask[1681] = 77
ns.questRaceMask[1682] = 77
ns.questRaceMask[1683] = 77
ns.questRaceMask[1684] = 77
ns.questRaceMask[1685] = 77
ns.questRaceMask[1686] = 77
ns.questRaceMask[1688] = 77
ns.questRaceMask[1689] = 77
ns.questRaceMask[1690] = 255
ns.questRaceMask[1691] = 255
ns.questRaceMask[1692] = 77
ns.questRaceMask[1693] = 77
ns.questRaceMask[1698] = 77
ns.questRaceMask[1699] = 77
ns.questRaceMask[1700] = 1
ns.questRaceMask[1701] = 77
ns.questRaceMask[1702] = 77
ns.questRaceMask[1703] = 8
ns.questRaceMask[1704] = 68
ns.questRaceMask[1705] = 77
ns.questRaceMask[1706] = 77
ns.questRaceMask[1707] = 255
ns.questRaceMask[1708] = 77
ns.questRaceMask[1709] = 77
ns.questRaceMask[1710] = 77
ns.questRaceMask[1711] = 77
ns.questRaceMask[1715] = 77
ns.questRaceMask[1716] = 77
ns.questRaceMask[1717] = 77
ns.questRaceMask[1738] = 77
ns.questRaceMask[1739] = 77
ns.questRaceMask[1740] = 255
ns.questRaceMask[1758] = 77
ns.questRaceMask[1778] = 4
ns.questRaceMask[1779] = 4
ns.questRaceMask[1780] = 1
ns.questRaceMask[1781] = 1
ns.questRaceMask[1782] = 77
ns.questRaceMask[1783] = 4
ns.questRaceMask[1784] = 4
ns.questRaceMask[1785] = 4
ns.questRaceMask[1786] = 1
ns.questRaceMask[1787] = 1
ns.questRaceMask[1788] = 1
ns.questRaceMask[1798] = 77
ns.questRaceMask[1801] = 178
ns.questRaceMask[1802] = 77
ns.questRaceMask[1803] = 178
ns.questRaceMask[1804] = 77
ns.questRaceMask[1805] = 178
ns.questRaceMask[1806] = 5
ns.questRaceMask[1818] = 178
ns.questRaceMask[1819] = 178
ns.questRaceMask[1820] = 178
ns.questRaceMask[1821] = 178
ns.questRaceMask[1822] = 178
ns.questRaceMask[1823] = 178
ns.questRaceMask[1824] = 178
ns.questRaceMask[1825] = 178
ns.questRaceMask[1838] = 178
ns.questRaceMask[1839] = 178
ns.questRaceMask[1840] = 178
ns.questRaceMask[1841] = 178
ns.questRaceMask[1842] = 178
ns.questRaceMask[1843] = 178
ns.questRaceMask[1844] = 178
ns.questRaceMask[1845] = 178
ns.questRaceMask[1846] = 178
ns.questRaceMask[1847] = 178
ns.questRaceMask[1848] = 178
ns.questRaceMask[1858] = 130
ns.questRaceMask[1859] = 2
ns.questRaceMask[1860] = 65
ns.questRaceMask[1861] = 65
ns.questRaceMask[1879] = 65
ns.questRaceMask[1880] = 65
ns.questRaceMask[1881] = 144
ns.questRaceMask[1882] = 144
ns.questRaceMask[1883] = 144
ns.questRaceMask[1884] = 144
ns.questRaceMask[1885] = 16
ns.questRaceMask[1886] = 16
ns.questRaceMask[1898] = 16
ns.questRaceMask[1899] = 16
ns.questRaceMask[1919] = 65
ns.questRaceMask[1920] = 65
ns.questRaceMask[1921] = 65
ns.questRaceMask[1938] = 65
ns.questRaceMask[1939] = 65
ns.questRaceMask[1940] = 65
ns.questRaceMask[1941] = 65
ns.questRaceMask[1942] = 65
ns.questRaceMask[1943] = 144
ns.questRaceMask[1944] = 144
ns.questRaceMask[1945] = 144
ns.questRaceMask[1946] = 144
ns.questRaceMask[1959] = 144
ns.questRaceMask[1960] = 144
ns.questRaceMask[1961] = 144
ns.questRaceMask[1962] = 144
ns.questRaceMask[1963] = 130
ns.questRaceMask[1978] = 16
ns.questRaceMask[1998] = 16
ns.questRaceMask[1999] = 16
ns.questRaceMask[2038] = 77
ns.questRaceMask[2078] = 77
ns.questRaceMask[2098] = 77
ns.questRaceMask[2118] = 77
ns.questRaceMask[2138] = 77
ns.questRaceMask[2139] = 77
ns.questRaceMask[2158] = 77
ns.questRaceMask[2159] = 77
ns.questRaceMask[2160] = 77
ns.questRaceMask[2161] = 178
ns.questRaceMask[2178] = 77
ns.questRaceMask[2203] = 178
ns.questRaceMask[2205] = 77
ns.questRaceMask[2206] = 77
ns.questRaceMask[2218] = 77
ns.questRaceMask[2238] = 77
ns.questRaceMask[2239] = 77
ns.questRaceMask[2241] = 77
ns.questRaceMask[2242] = 77
ns.questRaceMask[2259] = 77
ns.questRaceMask[2260] = 77
ns.questRaceMask[2281] = 77
ns.questRaceMask[2282] = 77
ns.questRaceMask[2298] = 77
ns.questRaceMask[2299] = 77
ns.questRaceMask[2300] = 77
ns.questRaceMask[2359] = 77
ns.questRaceMask[2360] = 77
ns.questRaceMask[2378] = 178
ns.questRaceMask[2379] = 178
ns.questRaceMask[2380] = 178
ns.questRaceMask[2381] = 178
ns.questRaceMask[2382] = 178
ns.questRaceMask[2383] = 2
ns.questRaceMask[2399] = 77
ns.questRaceMask[2438] = 77
ns.questRaceMask[2458] = 178
ns.questRaceMask[2459] = 77
ns.questRaceMask[2460] = 178
ns.questRaceMask[2478] = 178
ns.questRaceMask[2479] = 178
ns.questRaceMask[2480] = 178
ns.questRaceMask[2499] = 77
ns.questRaceMask[2521] = 255
ns.questRaceMask[2541] = 77
ns.questRaceMask[2561] = 77
ns.questRaceMask[2581] = 255
ns.questRaceMask[2583] = 255
ns.questRaceMask[2585] = 255
ns.questRaceMask[2601] = 255
ns.questRaceMask[2603] = 255
ns.questRaceMask[2605] = 255
ns.questRaceMask[2606] = 255
ns.questRaceMask[2607] = 77
ns.questRaceMask[2608] = 77
ns.questRaceMask[2609] = 77
ns.questRaceMask[2621] = 178
ns.questRaceMask[2622] = 178
ns.questRaceMask[2623] = 178
ns.questRaceMask[2641] = 255
ns.questRaceMask[2661] = 255
ns.questRaceMask[2662] = 255
ns.questRaceMask[2681] = 255
ns.questRaceMask[2702] = 255
ns.questRaceMask[2721] = 255
ns.questRaceMask[2741] = 255
ns.questRaceMask[2742] = 178
ns.questRaceMask[2744] = 255
ns.questRaceMask[2760] = 255
ns.questRaceMask[2761] = 255
ns.questRaceMask[2762] = 255
ns.questRaceMask[2763] = 255
ns.questRaceMask[2764] = 255
ns.questRaceMask[2765] = 255
ns.questRaceMask[2767] = 255
ns.questRaceMask[2771] = 255
ns.questRaceMask[2772] = 255
ns.questRaceMask[2773] = 255
ns.questRaceMask[2781] = 255
ns.questRaceMask[2782] = 178
ns.questRaceMask[2783] = 77
ns.questRaceMask[2784] = 178
ns.questRaceMask[2801] = 255
ns.questRaceMask[2821] = 77
ns.questRaceMask[2822] = 178
ns.questRaceMask[2844] = 77
ns.questRaceMask[2845] = 77
ns.questRaceMask[2847] = 77
ns.questRaceMask[2848] = 77
ns.questRaceMask[2849] = 77
ns.questRaceMask[2850] = 77
ns.questRaceMask[2851] = 77
ns.questRaceMask[2852] = 77
ns.questRaceMask[2853] = 77
ns.questRaceMask[2854] = 178
ns.questRaceMask[2855] = 178
ns.questRaceMask[2856] = 178
ns.questRaceMask[2857] = 178
ns.questRaceMask[2858] = 178
ns.questRaceMask[2859] = 178
ns.questRaceMask[2860] = 178
ns.questRaceMask[2862] = 178
ns.questRaceMask[2863] = 178
ns.questRaceMask[2866] = 77
ns.questRaceMask[2867] = 77
ns.questRaceMask[2869] = 77
ns.questRaceMask[2870] = 77
ns.questRaceMask[2871] = 77
ns.questRaceMask[2872] = 255
ns.questRaceMask[2873] = 255
ns.questRaceMask[2874] = 255
ns.questRaceMask[2875] = 255
ns.questRaceMask[2877] = 77
ns.questRaceMask[2879] = 77
ns.questRaceMask[2880] = 77
ns.questRaceMask[2902] = 178
ns.questRaceMask[2903] = 178
ns.questRaceMask[2932] = 178
ns.questRaceMask[2939] = 77
ns.questRaceMask[2942] = 77
ns.questRaceMask[2944] = 77
ns.questRaceMask[2967] = 178
ns.questRaceMask[2969] = 77
ns.questRaceMask[2970] = 77
ns.questRaceMask[2972] = 77
ns.questRaceMask[2973] = 178
ns.questRaceMask[2974] = 178
ns.questRaceMask[2975] = 178
ns.questRaceMask[2976] = 178
ns.questRaceMask[2977] = 77
ns.questRaceMask[2979] = 178
ns.questRaceMask[2980] = 178
ns.questRaceMask[2982] = 77
ns.questRaceMask[2987] = 178
ns.questRaceMask[2988] = 77
ns.questRaceMask[2989] = 77
ns.questRaceMask[2990] = 77
ns.questRaceMask[2992] = 77
ns.questRaceMask[2993] = 77
ns.questRaceMask[2994] = 77
ns.questRaceMask[2996] = 178
ns.questRaceMask[3002] = 178
ns.questRaceMask[3022] = 77
ns.questRaceMask[3062] = 178
ns.questRaceMask[3063] = 178
ns.questRaceMask[3065] = 128
ns.questRaceMask[3082] = 128
ns.questRaceMask[3083] = 128
ns.questRaceMask[3084] = 128
ns.questRaceMask[3085] = 128
ns.questRaceMask[3086] = 128
ns.questRaceMask[3087] = 2
ns.questRaceMask[3088] = 2
ns.questRaceMask[3089] = 2
ns.questRaceMask[3090] = 178
ns.questRaceMask[3091] = 32
ns.questRaceMask[3092] = 32
ns.questRaceMask[3093] = 32
ns.questRaceMask[3094] = 32
ns.questRaceMask[3095] = 16
ns.questRaceMask[3096] = 16
ns.questRaceMask[3097] = 16
ns.questRaceMask[3098] = 16
ns.questRaceMask[3099] = 16
ns.questRaceMask[3100] = 1
ns.questRaceMask[3101] = 1
ns.questRaceMask[3102] = 1
ns.questRaceMask[3103] = 1
ns.questRaceMask[3104] = 1
ns.questRaceMask[3105] = 1
ns.questRaceMask[3106] = 4
ns.questRaceMask[3107] = 4
ns.questRaceMask[3108] = 4
ns.questRaceMask[3109] = 4
ns.questRaceMask[3110] = 4
ns.questRaceMask[3112] = 64
ns.questRaceMask[3113] = 64
ns.questRaceMask[3114] = 64
ns.questRaceMask[3115] = 64
ns.questRaceMask[3116] = 8
ns.questRaceMask[3117] = 8
ns.questRaceMask[3118] = 8
ns.questRaceMask[3119] = 8
ns.questRaceMask[3120] = 8
ns.questRaceMask[3121] = 178
ns.questRaceMask[3123] = 178
ns.questRaceMask[3124] = 178
ns.questRaceMask[3125] = 178
ns.questRaceMask[3126] = 178
ns.questRaceMask[3127] = 178
ns.questRaceMask[3128] = 178
ns.questRaceMask[3129] = 178
ns.questRaceMask[3130] = 77
ns.questRaceMask[3141] = 255
ns.questRaceMask[3161] = 255
ns.questRaceMask[3221] = 178
ns.questRaceMask[3261] = 178
ns.questRaceMask[3281] = 178
ns.questRaceMask[3301] = 178
ns.questRaceMask[3321] = 255
ns.questRaceMask[3361] = 77
ns.questRaceMask[3362] = 255
ns.questRaceMask[3364] = 77
ns.questRaceMask[3365] = 77
ns.questRaceMask[3367] = 77
ns.questRaceMask[3368] = 77
ns.questRaceMask[3369] = 178
ns.questRaceMask[3370] = 77
ns.questRaceMask[3372] = 77
ns.questRaceMask[3376] = 178
ns.questRaceMask[3377] = 77
ns.questRaceMask[3378] = 77
ns.questRaceMask[3382] = 255
ns.questRaceMask[3441] = 255
ns.questRaceMask[3442] = 255
ns.questRaceMask[3443] = 255
ns.questRaceMask[3444] = 255
ns.questRaceMask[3445] = 77
ns.questRaceMask[3452] = 255
ns.questRaceMask[3453] = 255
ns.questRaceMask[3454] = 255
ns.questRaceMask[3462] = 255
ns.questRaceMask[3463] = 255
ns.questRaceMask[3481] = 255
ns.questRaceMask[3501] = 255
ns.questRaceMask[3505] = 178
ns.questRaceMask[3506] = 178
ns.questRaceMask[3507] = 178
ns.questRaceMask[3509] = 255
ns.questRaceMask[3510] = 255
ns.questRaceMask[3511] = 255
ns.questRaceMask[3512] = 255
ns.questRaceMask[3514] = 178
ns.questRaceMask[3517] = 178
ns.questRaceMask[3518] = 178
ns.questRaceMask[3519] = 77
ns.questRaceMask[3520] = 255
ns.questRaceMask[3521] = 77
ns.questRaceMask[3522] = 77
ns.questRaceMask[3524] = 77
ns.questRaceMask[3541] = 178
ns.questRaceMask[3542] = 178
ns.questRaceMask[3561] = 178
ns.questRaceMask[3565] = 178
ns.questRaceMask[3566] = 77
ns.questRaceMask[3601] = 255
ns.questRaceMask[3602] = 255
ns.questRaceMask[3621] = 255
ns.questRaceMask[3627] = 255
ns.questRaceMask[3628] = 255
ns.questRaceMask[3631] = 178
ns.questRaceMask[3638] = 255
ns.questRaceMask[3639] = 255
ns.questRaceMask[3642] = 178
ns.questRaceMask[3643] = 178
ns.questRaceMask[3721] = 255
ns.questRaceMask[3783] = 255
ns.questRaceMask[3788] = 77
ns.questRaceMask[3791] = 77
ns.questRaceMask[3821] = 178
ns.questRaceMask[3823] = 77
ns.questRaceMask[3824] = 77
ns.questRaceMask[3825] = 77
ns.questRaceMask[3841] = 77
ns.questRaceMask[3842] = 77
ns.questRaceMask[3843] = 77
ns.questRaceMask[3844] = 255
ns.questRaceMask[3845] = 255
ns.questRaceMask[3881] = 255
ns.questRaceMask[3882] = 255
ns.questRaceMask[3883] = 255
ns.questRaceMask[3901] = 178
ns.questRaceMask[3902] = 178
ns.questRaceMask[3903] = 77
ns.questRaceMask[3904] = 77
ns.questRaceMask[3905] = 77
ns.questRaceMask[3908] = 255
ns.questRaceMask[3909] = 255
ns.questRaceMask[3912] = 255
ns.questRaceMask[3913] = 255
ns.questRaceMask[3914] = 255
ns.questRaceMask[3921] = 178
ns.questRaceMask[3922] = 178
ns.questRaceMask[3923] = 178
ns.questRaceMask[3941] = 255
ns.questRaceMask[3942] = 255
ns.questRaceMask[3961] = 255
ns.questRaceMask[3962] = 255
ns.questRaceMask[4005] = 255
ns.questRaceMask[4021] = 178
ns.questRaceMask[4022] = 255
ns.questRaceMask[4023] = 255
ns.questRaceMask[4061] = 178
ns.questRaceMask[4062] = 178
ns.questRaceMask[4084] = 255
ns.questRaceMask[4101] = 77
ns.questRaceMask[4102] = 178
ns.questRaceMask[4120] = 178
ns.questRaceMask[4124] = 77
ns.questRaceMask[4125] = 77
ns.questRaceMask[4127] = 77
ns.questRaceMask[4129] = 77
ns.questRaceMask[4130] = 77
ns.questRaceMask[4131] = 77
ns.questRaceMask[4135] = 77
ns.questRaceMask[4141] = 77
ns.questRaceMask[4142] = 77
ns.questRaceMask[4144] = 77
ns.questRaceMask[4145] = 178
ns.questRaceMask[4147] = 178
ns.questRaceMask[4161] = 77
ns.questRaceMask[4182] = 77
ns.questRaceMask[4183] = 77
ns.questRaceMask[4224] = 77
ns.questRaceMask[4243] = 255
ns.questRaceMask[4244] = 255
ns.questRaceMask[4245] = 255
ns.questRaceMask[4265] = 77
ns.questRaceMask[4266] = 77
ns.questRaceMask[4267] = 77
ns.questRaceMask[4283] = 77
ns.questRaceMask[4284] = 255
ns.questRaceMask[4285] = 255
ns.questRaceMask[4287] = 255
ns.questRaceMask[4288] = 255
ns.questRaceMask[4289] = 255
ns.questRaceMask[4290] = 255
ns.questRaceMask[4291] = 255
ns.questRaceMask[4292] = 255
ns.questRaceMask[4296] = 255
ns.questRaceMask[4297] = 77
ns.questRaceMask[4298] = 77
ns.questRaceMask[4301] = 255
ns.questRaceMask[4321] = 255
ns.questRaceMask[4402] = 178
ns.questRaceMask[4421] = 77
ns.questRaceMask[4441] = 77
ns.questRaceMask[4442] = 77
ns.questRaceMask[4449] = 255
ns.questRaceMask[4450] = 255
ns.questRaceMask[4487] = 77
ns.questRaceMask[4491] = 255
ns.questRaceMask[4492] = 255
ns.questRaceMask[4495] = 77
ns.questRaceMask[4496] = 255
ns.questRaceMask[4501] = 255
ns.questRaceMask[4503] = 255
ns.questRaceMask[4504] = 255
ns.questRaceMask[4505] = 178
ns.questRaceMask[4506] = 178
ns.questRaceMask[4507] = 255
ns.questRaceMask[4508] = 77
ns.questRaceMask[4509] = 178
ns.questRaceMask[4521] = 178
ns.questRaceMask[4542] = 178
ns.questRaceMask[4581] = 77
ns.questRaceMask[4641] = 130
ns.questRaceMask[4681] = 77
ns.questRaceMask[4721] = 178
ns.questRaceMask[4722] = 77
ns.questRaceMask[4723] = 77
ns.questRaceMask[4725] = 77
ns.questRaceMask[4726] = 255
ns.questRaceMask[4727] = 77
ns.questRaceMask[4728] = 77
ns.questRaceMask[4730] = 77
ns.questRaceMask[4731] = 77
ns.questRaceMask[4732] = 77
ns.questRaceMask[4733] = 77
ns.questRaceMask[4736] = 178
ns.questRaceMask[4737] = 77
ns.questRaceMask[4740] = 77
ns.questRaceMask[4741] = 178
ns.questRaceMask[4761] = 77
ns.questRaceMask[4762] = 77
ns.questRaceMask[4763] = 77
ns.questRaceMask[4765] = 77
ns.questRaceMask[4767] = 178
ns.questRaceMask[4770] = 178
ns.questRaceMask[4782] = 255
ns.questRaceMask[4787] = 255
ns.questRaceMask[4808] = 255
ns.questRaceMask[4809] = 255
ns.questRaceMask[4810] = 255
ns.questRaceMask[4811] = 77
ns.questRaceMask[4812] = 77
ns.questRaceMask[4813] = 77
ns.questRaceMask[4821] = 178
ns.questRaceMask[4841] = 178
ns.questRaceMask[4842] = 255
ns.questRaceMask[4861] = 77
ns.questRaceMask[4863] = 77
ns.questRaceMask[4864] = 77
ns.questRaceMask[4865] = 178
ns.questRaceMask[4883] = 178
ns.questRaceMask[4901] = 77
ns.questRaceMask[4904] = 178
ns.questRaceMask[4906] = 77
ns.questRaceMask[4921] = 178
ns.questRaceMask[4961] = 255
ns.questRaceMask[4965] = 77
ns.questRaceMask[4966] = 178
ns.questRaceMask[4968] = 178
ns.questRaceMask[4971] = 255
ns.questRaceMask[4972] = 255
ns.questRaceMask[4976] = 255
ns.questRaceMask[4984] = 255
ns.questRaceMask[4985] = 255
ns.questRaceMask[4986] = 77
ns.questRaceMask[4987] = 178
ns.questRaceMask[5021] = 255
ns.questRaceMask[5022] = 77
ns.questRaceMask[5023] = 178
ns.questRaceMask[5041] = 178
ns.questRaceMask[5051] = 255
ns.questRaceMask[5052] = 178
ns.questRaceMask[5054] = 178
ns.questRaceMask[5055] = 178
ns.questRaceMask[5056] = 178
ns.questRaceMask[5057] = 255
ns.questRaceMask[5058] = 255
ns.questRaceMask[5060] = 255
ns.questRaceMask[5061] = 8
ns.questRaceMask[5062] = 178
ns.questRaceMask[5064] = 178
ns.questRaceMask[5065] = 255
ns.questRaceMask[5082] = 255
ns.questRaceMask[5084] = 255
ns.questRaceMask[5085] = 255
ns.questRaceMask[5086] = 255
ns.questRaceMask[5087] = 255
ns.questRaceMask[5092] = 77
ns.questRaceMask[5096] = 178
ns.questRaceMask[5097] = 77
ns.questRaceMask[5098] = 178
ns.questRaceMask[5121] = 255
ns.questRaceMask[5124] = 255
ns.questRaceMask[5126] = 255
ns.questRaceMask[5128] = 255
ns.questRaceMask[5141] = 77
ns.questRaceMask[5142] = 255
ns.questRaceMask[5143] = 77
ns.questRaceMask[5144] = 77
ns.questRaceMask[5147] = 178
ns.questRaceMask[5149] = 255
ns.questRaceMask[5151] = 178
ns.questRaceMask[5152] = 255
ns.questRaceMask[5153] = 255
ns.questRaceMask[5154] = 255
ns.questRaceMask[5155] = 255
ns.questRaceMask[5156] = 255
ns.questRaceMask[5157] = 255
ns.questRaceMask[5158] = 255
ns.questRaceMask[5161] = 255
ns.questRaceMask[5162] = 255
ns.questRaceMask[5163] = 255
ns.questRaceMask[5164] = 255
ns.questRaceMask[5165] = 255
ns.questRaceMask[5166] = 255
ns.questRaceMask[5167] = 255
ns.questRaceMask[5168] = 255
ns.questRaceMask[5181] = 255
ns.questRaceMask[5203] = 255
ns.questRaceMask[5204] = 255
ns.questRaceMask[5206] = 255
ns.questRaceMask[5210] = 255
ns.questRaceMask[5211] = 255
ns.questRaceMask[5215] = 77
ns.questRaceMask[5216] = 77
ns.questRaceMask[5217] = 77
ns.questRaceMask[5219] = 77
ns.questRaceMask[5220] = 77
ns.questRaceMask[5222] = 77
ns.questRaceMask[5223] = 77
ns.questRaceMask[5225] = 77
ns.questRaceMask[5226] = 77
ns.questRaceMask[5228] = 178
ns.questRaceMask[5229] = 178
ns.questRaceMask[5230] = 178
ns.questRaceMask[5231] = 178
ns.questRaceMask[5232] = 178
ns.questRaceMask[5233] = 178
ns.questRaceMask[5235] = 178
ns.questRaceMask[5236] = 178
ns.questRaceMask[5237] = 77
ns.questRaceMask[5238] = 178
ns.questRaceMask[5241] = 255
ns.questRaceMask[5242] = 255
ns.questRaceMask[5244] = 77
ns.questRaceMask[5245] = 77
ns.questRaceMask[5246] = 77
ns.questRaceMask[5247] = 77
ns.questRaceMask[5248] = 77
ns.questRaceMask[5249] = 77
ns.questRaceMask[5252] = 77
ns.questRaceMask[5253] = 77
ns.questRaceMask[5261] = 77
ns.questRaceMask[5264] = 255
ns.questRaceMask[5265] = 255
ns.questRaceMask[5321] = 77
ns.questRaceMask[5342] = 178
ns.questRaceMask[5344] = 77
ns.questRaceMask[5361] = 178
ns.questRaceMask[5381] = 178
ns.questRaceMask[5385] = 255
ns.questRaceMask[5386] = 178
ns.questRaceMask[5441] = 178
ns.questRaceMask[5461] = 255
ns.questRaceMask[5462] = 255
ns.questRaceMask[5465] = 255
ns.questRaceMask[5481] = 178
ns.questRaceMask[5482] = 178
ns.questRaceMask[5501] = 255
ns.questRaceMask[5504] = 178
ns.questRaceMask[5505] = 77
ns.questRaceMask[5507] = 77
ns.questRaceMask[5511] = 178
ns.questRaceMask[5513] = 255
ns.questRaceMask[5514] = 178
ns.questRaceMask[5517] = 255
ns.questRaceMask[5521] = 77
ns.questRaceMask[5524] = 178
ns.questRaceMask[5527] = 255
ns.questRaceMask[5533] = 77
ns.questRaceMask[5534] = 255
ns.questRaceMask[5535] = 255
ns.questRaceMask[5536] = 255
ns.questRaceMask[5537] = 77
ns.questRaceMask[5538] = 77
ns.questRaceMask[5541] = 77
ns.questRaceMask[5542] = 255
ns.questRaceMask[5543] = 255
ns.questRaceMask[5544] = 255
ns.questRaceMask[5545] = 77
ns.questRaceMask[5561] = 255
ns.questRaceMask[5581] = 178
ns.questRaceMask[5601] = 255
ns.questRaceMask[5621] = 8
ns.questRaceMask[5622] = 8
ns.questRaceMask[5623] = 1
ns.questRaceMask[5624] = 1
ns.questRaceMask[5625] = 4
ns.questRaceMask[5626] = 4
ns.questRaceMask[5627] = 8
ns.questRaceMask[5628] = 8
ns.questRaceMask[5629] = 8
ns.questRaceMask[5630] = 8
ns.questRaceMask[5634] = 5
ns.questRaceMask[5635] = 5
ns.questRaceMask[5636] = 5
ns.questRaceMask[5637] = 5
ns.questRaceMask[5641] = 4
ns.questRaceMask[5642] = 128
ns.questRaceMask[5644] = 16
ns.questRaceMask[5648] = 128
ns.questRaceMask[5649] = 128
ns.questRaceMask[5650] = 16
ns.questRaceMask[5651] = 16
ns.questRaceMask[5652] = 128
ns.questRaceMask[5655] = 128
ns.questRaceMask[5657] = 128
ns.questRaceMask[5658] = 16
ns.questRaceMask[5660] = 16
ns.questRaceMask[5663] = 16
ns.questRaceMask[5672] = 8
ns.questRaceMask[5676] = 1
ns.questRaceMask[5713] = 77
ns.questRaceMask[5741] = 255
ns.questRaceMask[5742] = 255
ns.questRaceMask[5762] = 255
ns.questRaceMask[5763] = 178
ns.questRaceMask[5781] = 255
ns.questRaceMask[5801] = 77
ns.questRaceMask[5802] = 178
ns.questRaceMask[5803] = 77
ns.questRaceMask[5804] = 178
ns.questRaceMask[5821] = 255
ns.questRaceMask[5845] = 255
ns.questRaceMask[5846] = 255
ns.questRaceMask[5861] = 255
ns.questRaceMask[5862] = 255
ns.questRaceMask[5863] = 255
ns.questRaceMask[5881] = 178
ns.questRaceMask[5882] = 77
ns.questRaceMask[5883] = 77
ns.questRaceMask[5884] = 77
ns.questRaceMask[5885] = 77
ns.questRaceMask[5886] = 77
ns.questRaceMask[5887] = 178
ns.questRaceMask[5888] = 178
ns.questRaceMask[5889] = 178
ns.questRaceMask[5890] = 178
ns.questRaceMask[5891] = 178
ns.questRaceMask[5901] = 178
ns.questRaceMask[5902] = 178
ns.questRaceMask[5903] = 77
ns.questRaceMask[5904] = 77
ns.questRaceMask[5921] = 8
ns.questRaceMask[5922] = 32
ns.questRaceMask[5923] = 8
ns.questRaceMask[5926] = 32
ns.questRaceMask[5927] = 32
ns.questRaceMask[5929] = 8
ns.questRaceMask[5930] = 32
ns.questRaceMask[5931] = 8
ns.questRaceMask[5932] = 32
ns.questRaceMask[5941] = 255
ns.questRaceMask[5942] = 255
ns.questRaceMask[5943] = 255
ns.questRaceMask[6001] = 8
ns.questRaceMask[6002] = 32
ns.questRaceMask[6004] = 255
ns.questRaceMask[6021] = 255
ns.questRaceMask[6022] = 178
ns.questRaceMask[6023] = 255
ns.questRaceMask[6024] = 255
ns.questRaceMask[6025] = 255
ns.questRaceMask[6026] = 255
ns.questRaceMask[6027] = 255
ns.questRaceMask[6028] = 77
ns.questRaceMask[6029] = 178
ns.questRaceMask[6030] = 255
ns.questRaceMask[6041] = 255
ns.questRaceMask[6042] = 178
ns.questRaceMask[6061] = 32
ns.questRaceMask[6062] = 130
ns.questRaceMask[6063] = 8
ns.questRaceMask[6064] = 4
ns.questRaceMask[6065] = 32
ns.questRaceMask[6066] = 32
ns.questRaceMask[6067] = 32
ns.questRaceMask[6068] = 130
ns.questRaceMask[6071] = 8
ns.questRaceMask[6072] = 8
ns.questRaceMask[6074] = 4
ns.questRaceMask[6081] = 130
ns.questRaceMask[6082] = 130
ns.questRaceMask[6083] = 130
ns.questRaceMask[6084] = 4
ns.questRaceMask[6085] = 4
ns.questRaceMask[6086] = 4
ns.questRaceMask[6087] = 32
ns.questRaceMask[6088] = 32
ns.questRaceMask[6089] = 32
ns.questRaceMask[6101] = 8
ns.questRaceMask[6102] = 8
ns.questRaceMask[6103] = 8
ns.questRaceMask[6121] = 8
ns.questRaceMask[6122] = 8
ns.questRaceMask[6123] = 8
ns.questRaceMask[6124] = 8
ns.questRaceMask[6125] = 8
ns.questRaceMask[6126] = 32
ns.questRaceMask[6127] = 32
ns.questRaceMask[6128] = 32
ns.questRaceMask[6129] = 32
ns.questRaceMask[6130] = 32
ns.questRaceMask[6132] = 255
ns.questRaceMask[6133] = 178
ns.questRaceMask[6134] = 255
ns.questRaceMask[6135] = 178
ns.questRaceMask[6136] = 178
ns.questRaceMask[6142] = 178
ns.questRaceMask[6143] = 178
ns.questRaceMask[6144] = 178
ns.questRaceMask[6146] = 178
ns.questRaceMask[6148] = 178
ns.questRaceMask[6161] = 255
ns.questRaceMask[6162] = 178
ns.questRaceMask[6164] = 255
ns.questRaceMask[6181] = 1
ns.questRaceMask[6185] = 77
ns.questRaceMask[6186] = 77
ns.questRaceMask[6281] = 1
ns.questRaceMask[6282] = 178
ns.questRaceMask[6283] = 178
ns.questRaceMask[6284] = 178
ns.questRaceMask[6301] = 178
ns.questRaceMask[6321] = 16
ns.questRaceMask[6323] = 16
ns.questRaceMask[6341] = 8
ns.questRaceMask[6342] = 8
ns.questRaceMask[6343] = 8
ns.questRaceMask[6361] = 32
ns.questRaceMask[6362] = 32
ns.questRaceMask[6365] = 130
ns.questRaceMask[6381] = 178
ns.questRaceMask[6382] = 178
ns.questRaceMask[6383] = 178
ns.questRaceMask[6384] = 130
ns.questRaceMask[6387] = 68
ns.questRaceMask[6389] = 77
ns.questRaceMask[6390] = 178
ns.questRaceMask[6391] = 68
ns.questRaceMask[6393] = 178
ns.questRaceMask[6394] = 178
ns.questRaceMask[6395] = 178
ns.questRaceMask[6401] = 178
ns.questRaceMask[6421] = 178
ns.questRaceMask[6441] = 178
ns.questRaceMask[6442] = 178
ns.questRaceMask[6461] = 178
ns.questRaceMask[6462] = 178
ns.questRaceMask[6481] = 178
ns.questRaceMask[6482] = 178
ns.questRaceMask[6503] = 178
ns.questRaceMask[6504] = 178
ns.questRaceMask[6523] = 178
ns.questRaceMask[6541] = 178
ns.questRaceMask[6542] = 178
ns.questRaceMask[6543] = 178
ns.questRaceMask[6544] = 178
ns.questRaceMask[6548] = 178
ns.questRaceMask[6570] = 178
ns.questRaceMask[6571] = 178
ns.questRaceMask[6603] = 255
ns.questRaceMask[6604] = 77
ns.questRaceMask[6605] = 178
ns.questRaceMask[6606] = 255
ns.questRaceMask[6607] = 255
ns.questRaceMask[6610] = 255
ns.questRaceMask[6621] = 178
ns.questRaceMask[6622] = 178
ns.questRaceMask[6624] = 77
ns.questRaceMask[6627] = 178
ns.questRaceMask[6629] = 178
ns.questRaceMask[6641] = 178
ns.questRaceMask[6804] = 255
ns.questRaceMask[6805] = 255
ns.questRaceMask[6823] = 255
ns.questRaceMask[6844] = 255
ns.questRaceMask[6845] = 255
ns.questRaceMask[7003] = 255
ns.questRaceMask[7321] = 178
ns.questRaceMask[7383] = 77
ns.questRaceMask[7486] = 255
ns.questRaceMask[7563] = 255
ns.questRaceMask[7564] = 255
ns.questRaceMask[7602] = 255
ns.questRaceMask[7603] = 255
ns.questRaceMask[7623] = 255
ns.questRaceMask[7637] = 5
ns.questRaceMask[7638] = 5
ns.questRaceMask[7639] = 5
ns.questRaceMask[7640] = 5
ns.questRaceMask[7641] = 5
ns.questRaceMask[7642] = 5
ns.questRaceMask[7643] = 5
ns.questRaceMask[7644] = 5
ns.questRaceMask[7645] = 5
ns.questRaceMask[7646] = 5
ns.questRaceMask[7647] = 5
ns.questRaceMask[7648] = 5
ns.questRaceMask[7652] = 255
ns.questRaceMask[7653] = 255
ns.questRaceMask[7654] = 255
ns.questRaceMask[7655] = 255
ns.questRaceMask[7656] = 255
ns.questRaceMask[7657] = 255
ns.questRaceMask[7658] = 255
ns.questRaceMask[7659] = 255
ns.questRaceMask[7667] = 178
ns.questRaceMask[7701] = 255
ns.questRaceMask[7721] = 255
ns.questRaceMask[7722] = 255
ns.questRaceMask[7723] = 255
ns.questRaceMask[7724] = 255
ns.questRaceMask[7727] = 255
ns.questRaceMask[7728] = 255
ns.questRaceMask[7729] = 255
ns.questRaceMask[7730] = 178
ns.questRaceMask[7731] = 178
ns.questRaceMask[7732] = 178
ns.questRaceMask[7733] = 77
ns.questRaceMask[7734] = 178
ns.questRaceMask[7815] = 178
ns.questRaceMask[7816] = 178
ns.questRaceMask[7828] = 178
ns.questRaceMask[7829] = 178
ns.questRaceMask[7830] = 178
ns.questRaceMask[7839] = 178
ns.questRaceMask[7840] = 178
ns.questRaceMask[7844] = 178
ns.questRaceMask[7845] = 178
ns.questRaceMask[7846] = 178
ns.questRaceMask[7847] = 178
ns.questRaceMask[7849] = 178
ns.questRaceMask[7850] = 178
ns.questRaceMask[7861] = 178
ns.questRaceMask[7862] = 178
ns.questRaceMask[7863] = 77
ns.questRaceMask[8045] = 77
ns.questRaceMask[8046] = 77
ns.questRaceMask[8047] = 77
ns.questRaceMask[8048] = 77
ns.questRaceMask[8116] = 178
ns.questRaceMask[8117] = 178
ns.questRaceMask[8118] = 178
ns.questRaceMask[8119] = 178
ns.questRaceMask[8153] = 255
ns.questRaceMask[8231] = 255
ns.questRaceMask[8232] = 255
ns.questRaceMask[8235] = 255
ns.questRaceMask[8236] = 255
ns.questRaceMask[8251] = 255
ns.questRaceMask[8252] = 255
ns.questRaceMask[8253] = 255
ns.questRaceMask[8255] = 255
ns.questRaceMask[8256] = 255
ns.questRaceMask[8257] = 255
ns.questRaceMask[8258] = 178
ns.questRaceMask[8277] = 255
ns.questRaceMask[8278] = 255
ns.questRaceMask[8279] = 255
ns.questRaceMask[8280] = 255
ns.questRaceMask[8281] = 255
ns.questRaceMask[8282] = 255
ns.questRaceMask[8283] = 255
ns.questRaceMask[8284] = 255
ns.questRaceMask[8285] = 255
ns.questRaceMask[8286] = 255
ns.questRaceMask[8287] = 255
ns.questRaceMask[8301] = 255
ns.questRaceMask[8303] = 255
ns.questRaceMask[8304] = 255
ns.questRaceMask[8305] = 255
ns.questRaceMask[8306] = 255
ns.questRaceMask[8307] = 255
ns.questRaceMask[8309] = 255
ns.questRaceMask[8310] = 255
ns.questRaceMask[8313] = 255
ns.questRaceMask[8314] = 255
ns.questRaceMask[8315] = 255
ns.questRaceMask[8317] = 255
ns.questRaceMask[8318] = 255
ns.questRaceMask[8320] = 255
ns.questRaceMask[8321] = 255
ns.questRaceMask[8323] = 255
ns.questRaceMask[8331] = 255
ns.questRaceMask[8332] = 255
ns.questRaceMask[8341] = 255
ns.questRaceMask[8343] = 255
ns.questRaceMask[8348] = 255
ns.questRaceMask[8349] = 255
ns.questRaceMask[8361] = 255
ns.questRaceMask[8365] = 255
ns.questRaceMask[8366] = 255
ns.questRaceMask[8376] = 77
ns.questRaceMask[8380] = 178
ns.questRaceMask[8410] = 178
ns.questRaceMask[8411] = 178
ns.questRaceMask[8412] = 178
ns.questRaceMask[8413] = 178
ns.questRaceMask[8414] = 5
ns.questRaceMask[8415] = 5
ns.questRaceMask[8416] = 5
ns.questRaceMask[8418] = 5
ns.questRaceMask[8420] = 255
ns.questRaceMask[8421] = 255
ns.questRaceMask[8422] = 255
ns.questRaceMask[8423] = 255
ns.questRaceMask[8424] = 255
ns.questRaceMask[8425] = 255
ns.questRaceMask[8460] = 255
ns.questRaceMask[8461] = 255
ns.questRaceMask[8462] = 255
ns.questRaceMask[8464] = 255
ns.questRaceMask[8465] = 255
ns.questRaceMask[8519] = 255
ns.questRaceMask[8551] = 255
ns.questRaceMask[8553] = 255
ns.questRaceMask[8554] = 255
ns.questRaceMask[8555] = 255
ns.questRaceMask[8576] = 255
ns.questRaceMask[8577] = 255
ns.questRaceMask[8584] = 255
ns.questRaceMask[8586] = 255
ns.questRaceMask[8587] = 255
ns.questRaceMask[8597] = 255
ns.questRaceMask[8599] = 255
ns.questRaceMask[8606] = 255
ns.questRaceMask[8690] = 178
ns.questRaceMask[8695] = 77
ns.questRaceMask[8698] = 178
ns.questRaceMask[8703] = 77
ns.questRaceMask[8706] = 178
ns.questRaceMask[8711] = 77
ns.questRaceMask[8728] = 255
ns.questRaceMask[8741] = 255
ns.questRaceMask[8742] = 255
ns.questRaceMask[8743] = 255
ns.questRaceMask[8745] = 255
ns.questRaceMask[8747] = 255
ns.questRaceMask[8748] = 255
ns.questRaceMask[8749] = 255
ns.questRaceMask[8750] = 255
ns.questRaceMask[8751] = 255
ns.questRaceMask[8752] = 255
ns.questRaceMask[8753] = 255
ns.questRaceMask[8754] = 255
ns.questRaceMask[8755] = 255
ns.questRaceMask[8756] = 255
ns.questRaceMask[8757] = 255
ns.questRaceMask[8758] = 255
ns.questRaceMask[8759] = 255
ns.questRaceMask[8760] = 255
ns.questRaceMask[8761] = 255
ns.questRaceMask[8798] = 255
ns.questRaceMask[8800] = 255
ns.questRaceMask[8857] = 255
ns.questRaceMask[8858] = 255
ns.questRaceMask[8859] = 255
ns.questRaceMask[8905] = 77
ns.questRaceMask[8906] = 77
ns.questRaceMask[8907] = 77
ns.questRaceMask[8908] = 77
ns.questRaceMask[8909] = 77
ns.questRaceMask[8910] = 77
ns.questRaceMask[8911] = 77
ns.questRaceMask[8912] = 77
ns.questRaceMask[8913] = 178
ns.questRaceMask[8914] = 178
ns.questRaceMask[8915] = 178
ns.questRaceMask[8916] = 178
ns.questRaceMask[8917] = 178
ns.questRaceMask[8918] = 178
ns.questRaceMask[8919] = 178
ns.questRaceMask[8920] = 178
ns.questRaceMask[8921] = 255
ns.questRaceMask[8924] = 255
ns.questRaceMask[8925] = 255
ns.questRaceMask[8926] = 77
ns.questRaceMask[8927] = 178
ns.questRaceMask[8928] = 255
ns.questRaceMask[8931] = 77
ns.questRaceMask[8932] = 77
ns.questRaceMask[8933] = 77
ns.questRaceMask[8934] = 77
ns.questRaceMask[8935] = 77
ns.questRaceMask[8936] = 77
ns.questRaceMask[8937] = 77
ns.questRaceMask[8938] = 178
ns.questRaceMask[8939] = 178
ns.questRaceMask[8940] = 178
ns.questRaceMask[8941] = 178
ns.questRaceMask[8942] = 178
ns.questRaceMask[8943] = 178
ns.questRaceMask[8944] = 178
ns.questRaceMask[8947] = 255
ns.questRaceMask[8951] = 77
ns.questRaceMask[8952] = 77
ns.questRaceMask[8953] = 77
ns.questRaceMask[8954] = 77
ns.questRaceMask[8955] = 77
ns.questRaceMask[8956] = 77
ns.questRaceMask[8957] = 178
ns.questRaceMask[8958] = 77
ns.questRaceMask[8959] = 77
ns.questRaceMask[8962] = 255
ns.questRaceMask[8963] = 255
ns.questRaceMask[8964] = 255
ns.questRaceMask[8965] = 255
ns.questRaceMask[8970] = 255
ns.questRaceMask[8977] = 77
ns.questRaceMask[8978] = 178
ns.questRaceMask[8985] = 255
ns.questRaceMask[8986] = 255
ns.questRaceMask[8987] = 255
ns.questRaceMask[8988] = 255
ns.questRaceMask[8997] = 77
ns.questRaceMask[8998] = 178
ns.questRaceMask[8999] = 77
ns.questRaceMask[9000] = 77
ns.questRaceMask[9001] = 77
ns.questRaceMask[9002] = 77
ns.questRaceMask[9003] = 77
ns.questRaceMask[9004] = 77
ns.questRaceMask[9005] = 77
ns.questRaceMask[9006] = 77
ns.questRaceMask[9007] = 178
ns.questRaceMask[9008] = 178
ns.questRaceMask[9009] = 178
ns.questRaceMask[9010] = 178
ns.questRaceMask[9011] = 178
ns.questRaceMask[9012] = 178
ns.questRaceMask[9013] = 178
ns.questRaceMask[9014] = 178
ns.questRaceMask[9016] = 178
ns.questRaceMask[9017] = 178
ns.questRaceMask[9018] = 178
ns.questRaceMask[9019] = 178
ns.questRaceMask[9020] = 178
ns.questRaceMask[9021] = 178
ns.questRaceMask[9022] = 178
ns.questRaceMask[9051] = 255
ns.questRaceMask[9052] = 255
ns.questRaceMask[9053] = 255
ns.questRaceMask[9121] = 255
ns.questRaceMask[9122] = 255
ns.questRaceMask[9123] = 255
ns.questRaceMask[9124] = 255
ns.questRaceMask[9126] = 255
ns.questRaceMask[9128] = 255
ns.questRaceMask[9131] = 255
ns.questRaceMask[9136] = 255
ns.questRaceMask[9141] = 255
ns.questRaceMask[9248] = 255
ns.questRaceMask[9415] = 77
ns.questRaceMask[9416] = 178

-- Version anglaise : nom des cartes (UiMap) et des sorts des classes ({ nom, rang }), lus dans les fichiers du jeu.
ns.zoneNamesEn = ns.zoneNamesEn or {}
ns.zoneNamesEn[1411] = "Durotar"
ns.zoneNamesEn[1412] = "Mulgore"
ns.zoneNamesEn[1413] = "The Barrens"
ns.zoneNamesEn[1414] = "Kalimdor"
ns.zoneNamesEn[1415] = "Eastern Kingdoms"
ns.zoneNamesEn[1416] = "Alterac Mountains"
ns.zoneNamesEn[1417] = "Arathi Highlands"
ns.zoneNamesEn[1418] = "Badlands"
ns.zoneNamesEn[1419] = "Blasted Lands"
ns.zoneNamesEn[1420] = "Tirisfal Glades"
ns.zoneNamesEn[1421] = "Silverpine Forest"
ns.zoneNamesEn[1422] = "Western Plaguelands"
ns.zoneNamesEn[1423] = "Eastern Plaguelands"
ns.zoneNamesEn[1424] = "Hillsbrad Foothills"
ns.zoneNamesEn[1425] = "The Hinterlands"
ns.zoneNamesEn[1426] = "Dun Morogh"
ns.zoneNamesEn[1427] = "Searing Gorge"
ns.zoneNamesEn[1428] = "Burning Steppes"
ns.zoneNamesEn[1429] = "Elwynn Forest"
ns.zoneNamesEn[1430] = "Deadwind Pass"
ns.zoneNamesEn[1431] = "Duskwood"
ns.zoneNamesEn[1432] = "Loch Modan"
ns.zoneNamesEn[1433] = "Redridge Mountains"
ns.zoneNamesEn[1434] = "Stranglethorn Vale"
ns.zoneNamesEn[1435] = "Swamp of Sorrows"
ns.zoneNamesEn[1436] = "Westfall"
ns.zoneNamesEn[1437] = "Wetlands"
ns.zoneNamesEn[1438] = "Teldrassil"
ns.zoneNamesEn[1439] = "Darkshore"
ns.zoneNamesEn[1440] = "Ashenvale"
ns.zoneNamesEn[1441] = "Thousand Needles"
ns.zoneNamesEn[1442] = "Stonetalon Mountains"
ns.zoneNamesEn[1443] = "Desolace"
ns.zoneNamesEn[1444] = "Feralas"
ns.zoneNamesEn[1445] = "Dustwallow Marsh"
ns.zoneNamesEn[1446] = "Tanaris"
ns.zoneNamesEn[1447] = "Azshara"
ns.zoneNamesEn[1448] = "Felwood"
ns.zoneNamesEn[1449] = "Un'Goro Crater"
ns.zoneNamesEn[1450] = "Moonglade"
ns.zoneNamesEn[1451] = "Silithus"
ns.zoneNamesEn[1452] = "Winterspring"
ns.zoneNamesEn[1453] = "Stormwind City"
ns.zoneNamesEn[1454] = "Orgrimmar"
ns.zoneNamesEn[1455] = "Ironforge"
ns.zoneNamesEn[1456] = "Thunder Bluff"
ns.zoneNamesEn[1457] = "Darnassus"
ns.zoneNamesEn[1458] = "Undercity"
ns.zoneNamesEn[2482] = "Mount Hyjal"
ns.zoneNamesEn[2521] = "Zephras Isle"
ns.zoneNamesEn[2548] = "Riverglades"
ns.zoneNamesEn[2652] = "Shen'dralas"
ns.spellNamesEn = ns.spellNamesEn or {}
ns.spellNamesEn[10] = { "Blizzard", 1 }
ns.spellNamesEn[17] = { "Power Word: Shield", 1 }
ns.spellNamesEn[53] = { "Backstab", 1 }
ns.spellNamesEn[71] = { "Defensive Stance" }
ns.spellNamesEn[72] = { "Shield Bash", 1 }
ns.spellNamesEn[75] = { "Auto Shot" }
ns.spellNamesEn[78] = { "Heroic Strike", 1 }
ns.spellNamesEn[99] = { "Demoralizing Roar", 1 }
ns.spellNamesEn[100] = { "Charge", 1 }
ns.spellNamesEn[116] = { "Frostbolt", 1 }
ns.spellNamesEn[118] = { "Polymorph", 1 }
ns.spellNamesEn[120] = { "Cone of Cold", 1 }
ns.spellNamesEn[122] = { "Frost Nova", 1 }
ns.spellNamesEn[130] = { "Slow Fall" }
ns.spellNamesEn[131] = { "Water Breathing" }
ns.spellNamesEn[132] = { "Detect Invisibility", 1 }
ns.spellNamesEn[133] = { "Fireball", 1 }
ns.spellNamesEn[136] = { "Mend Pet", 1 }
ns.spellNamesEn[139] = { "Renew", 1 }
ns.spellNamesEn[143] = { "Fireball", 2 }
ns.spellNamesEn[145] = { "Fireball", 3 }
ns.spellNamesEn[168] = { "Frost Armor", 1 }
ns.spellNamesEn[172] = { "Corruption", 1 }
ns.spellNamesEn[205] = { "Frostbolt", 2 }
ns.spellNamesEn[284] = { "Heroic Strike", 2 }
ns.spellNamesEn[285] = { "Heroic Strike", 3 }
ns.spellNamesEn[324] = { "Lightning Shield", 1 }
ns.spellNamesEn[325] = { "Lightning Shield", 2 }
ns.spellNamesEn[331] = { "Healing Wave", 1 }
ns.spellNamesEn[332] = { "Healing Wave", 2 }
ns.spellNamesEn[339] = { "Entangling Roots", 1 }
ns.spellNamesEn[348] = { "Immolate", 1 }
ns.spellNamesEn[355] = { "Taunt" }
ns.spellNamesEn[370] = { "Purge", 1 }
ns.spellNamesEn[403] = { "Lightning Bolt", 1 }
ns.spellNamesEn[408] = { "Kidney Shot", 1 }
ns.spellNamesEn[421] = { "Chain Lightning", 1 }
ns.spellNamesEn[453] = { "Mind Soothe", 1 }
ns.spellNamesEn[465] = { "Devotion Aura", 1 }
ns.spellNamesEn[467] = { "Thorns", 1 }
ns.spellNamesEn[475] = { "Remove Lesser Curse" }
ns.spellNamesEn[498] = { "Divine Protection", 1 }
ns.spellNamesEn[526] = { "Cure Poison" }
ns.spellNamesEn[527] = { "Dispel Magic", 1 }
ns.spellNamesEn[528] = { "Cure Disease" }
ns.spellNamesEn[529] = { "Lightning Bolt", 2 }
ns.spellNamesEn[543] = { "Fire Ward", 1 }
ns.spellNamesEn[546] = { "Water Walking" }
ns.spellNamesEn[547] = { "Healing Wave", 3 }
ns.spellNamesEn[548] = { "Lightning Bolt", 3 }
ns.spellNamesEn[552] = { "Abolish Disease" }
ns.spellNamesEn[556] = { "Astral Recall" }
ns.spellNamesEn[585] = { "Smite", 1 }
ns.spellNamesEn[586] = { "Fade", 1 }
ns.spellNamesEn[587] = { "Conjure Food", 1 }
ns.spellNamesEn[588] = { "Inner Fire", 1 }
ns.spellNamesEn[589] = { "Shadow Word: Pain", 1 }
ns.spellNamesEn[591] = { "Smite", 2 }
ns.spellNamesEn[592] = { "Power Word: Shield", 2 }
ns.spellNamesEn[594] = { "Shadow Word: Pain", 2 }
ns.spellNamesEn[596] = { "Prayer of Healing", 1 }
ns.spellNamesEn[597] = { "Conjure Food", 2 }
ns.spellNamesEn[598] = { "Smite", 3 }
ns.spellNamesEn[600] = { "Power Word: Shield", 3 }
ns.spellNamesEn[602] = { "Inner Fire", 3 }
ns.spellNamesEn[603] = { "Bane of Doom" }
ns.spellNamesEn[604] = { "Dampen Magic", 1 }
ns.spellNamesEn[605] = { "Mind Control", 1 }
ns.spellNamesEn[633] = { "Lay on Hands", 1 }
ns.spellNamesEn[635] = { "Holy Light", 1 }
ns.spellNamesEn[639] = { "Holy Light", 2 }
ns.spellNamesEn[642] = { "Divine Shield", 1 }
ns.spellNamesEn[643] = { "Devotion Aura", 3 }
ns.spellNamesEn[647] = { "Holy Light", 3 }
ns.spellNamesEn[676] = { "Disarm" }
ns.spellNamesEn[678] = { "Holy Strike", 2 }
ns.spellNamesEn[679] = { "Holy Strike", 1 }
ns.spellNamesEn[680] = { "Holy Strike", 4 }
ns.spellNamesEn[686] = { "Shadow Bolt", 1 }
ns.spellNamesEn[687] = { "Demon Skin", 1 }
ns.spellNamesEn[688] = { "Summon Imp" }
ns.spellNamesEn[689] = { "Drain Life", 1 }
ns.spellNamesEn[691] = { "Summon Felhunter" }
ns.spellNamesEn[693] = { "Create Soulstone", 1 }
ns.spellNamesEn[694] = { "Mocking Blow", 1 }
ns.spellNamesEn[695] = { "Shadow Bolt", 2 }
ns.spellNamesEn[696] = { "Demon Skin", 2 }
ns.spellNamesEn[697] = { "Summon Voidwalker" }
ns.spellNamesEn[698] = { "Ritual of Summoning" }
ns.spellNamesEn[699] = { "Drain Life", 2 }
ns.spellNamesEn[702] = { "Curse of Weakness", 1 }
ns.spellNamesEn[703] = { "Garrote", 1 }
ns.spellNamesEn[704] = { "Curse of Recklessness", 1 }
ns.spellNamesEn[705] = { "Shadow Bolt", 3 }
ns.spellNamesEn[706] = { "Demon Armor", 1 }
ns.spellNamesEn[707] = { "Immolate", 2 }
ns.spellNamesEn[709] = { "Drain Life", 3 }
ns.spellNamesEn[710] = { "Banish", 1 }
ns.spellNamesEn[712] = { "Summon Succubus" }
ns.spellNamesEn[713] = { "Summon Incubus" }
ns.spellNamesEn[724] = { "Lightwell", 1 }
ns.spellNamesEn[740] = { "Tranquility", 1 }
ns.spellNamesEn[755] = { "Health Funnel", 1 }
ns.spellNamesEn[759] = { "Conjure Mana Agate" }
ns.spellNamesEn[768] = { "Cat Form" }
ns.spellNamesEn[769] = { "Swipe", 3 }
ns.spellNamesEn[770] = { "Faerie Fire", 1 }
ns.spellNamesEn[772] = { "Rend", 1 }
ns.spellNamesEn[774] = { "Rejuvenation", 1 }
ns.spellNamesEn[778] = { "Faerie Fire", 2 }
ns.spellNamesEn[779] = { "Swipe", 1 }
ns.spellNamesEn[780] = { "Swipe", 2 }
ns.spellNamesEn[781] = { "Disengage", 1 }
ns.spellNamesEn[782] = { "Thorns", 2 }
ns.spellNamesEn[783] = { "Travel Form" }
ns.spellNamesEn[837] = { "Frostbolt", 3 }
ns.spellNamesEn[845] = { "Cleave", 1 }
ns.spellNamesEn[853] = { "Hammer of Justice", 1 }
ns.spellNamesEn[865] = { "Frost Nova", 2 }
ns.spellNamesEn[871] = { "Shield Wall" }
ns.spellNamesEn[879] = { "Exorcism", 1 }
ns.spellNamesEn[883] = { "Call Pet" }
ns.spellNamesEn[905] = { "Lightning Shield", 3 }
ns.spellNamesEn[913] = { "Healing Wave", 4 }
ns.spellNamesEn[915] = { "Lightning Bolt", 4 }
ns.spellNamesEn[921] = { "Pick Pocket" }
ns.spellNamesEn[930] = { "Chain Lightning", 2 }
ns.spellNamesEn[939] = { "Healing Wave", 5 }
ns.spellNamesEn[943] = { "Lightning Bolt", 5 }
ns.spellNamesEn[945] = { "Lightning Shield", 4 }
ns.spellNamesEn[959] = { "Healing Wave", 6 }
ns.spellNamesEn[970] = { "Shadow Word: Pain", 3 }
ns.spellNamesEn[976] = { "Shadow Protection", 1 }
ns.spellNamesEn[980] = { "Bane of Agony", 1 }
ns.spellNamesEn[982] = { "Revive Pet" }
ns.spellNamesEn[984] = { "Smite", 4 }
ns.spellNamesEn[988] = { "Dispel Magic", 2 }
ns.spellNamesEn[990] = { "Conjure Food", 3 }
ns.spellNamesEn[992] = { "Shadow Word: Pain", 4 }
ns.spellNamesEn[996] = { "Prayer of Healing", 2 }
ns.spellNamesEn[1004] = { "Smite", 5 }
ns.spellNamesEn[1006] = { "Inner Fire", 4 }
ns.spellNamesEn[1008] = { "Amplify Magic", 1 }
ns.spellNamesEn[1014] = { "Bane of Agony", 2 }
ns.spellNamesEn[1020] = { "Divine Shield", 2 }
ns.spellNamesEn[1022] = { "Blessing of Protection", 1 }
ns.spellNamesEn[1026] = { "Holy Light", 4 }
ns.spellNamesEn[1032] = { "Devotion Aura", 5 }
ns.spellNamesEn[1042] = { "Holy Light", 5 }
ns.spellNamesEn[1044] = { "Blessing of Freedom" }
ns.spellNamesEn[1058] = { "Rejuvenation", 2 }
ns.spellNamesEn[1062] = { "Entangling Roots", 2 }
ns.spellNamesEn[1064] = { "Chain Heal", 1 }
ns.spellNamesEn[1066] = { "Aquatic Form" }
ns.spellNamesEn[1075] = { "Thorns", 3 }
ns.spellNamesEn[1079] = { "Rip", 1 }
ns.spellNamesEn[1082] = { "Claw", 1 }
ns.spellNamesEn[1086] = { "Demon Armor", 2 }
ns.spellNamesEn[1088] = { "Shadow Bolt", 4 }
ns.spellNamesEn[1094] = { "Immolate", 3 }
ns.spellNamesEn[1098] = { "Subjugate Demon", 1 }
ns.spellNamesEn[1106] = { "Shadow Bolt", 5 }
ns.spellNamesEn[1108] = { "Curse of Weakness", 2 }
ns.spellNamesEn[1120] = { "Drain Soul", 1 }
ns.spellNamesEn[1122] = { "Inferno" }
ns.spellNamesEn[1126] = { "Mark of the Wild", 1 }
ns.spellNamesEn[1130] = { "Hunter's Mark", 1 }
ns.spellNamesEn[1152] = { "Purify" }
ns.spellNamesEn[1160] = { "Demoralizing Shout", 1 }
ns.spellNamesEn[1161] = { "Challenging Shout" }
ns.spellNamesEn[1243] = { "Power Word: Fortitude", 1 }
ns.spellNamesEn[1244] = { "Power Word: Fortitude", 2 }
ns.spellNamesEn[1245] = { "Power Word: Fortitude", 3 }
ns.spellNamesEn[1430] = { "Rejuvenation", 3 }
ns.spellNamesEn[1449] = { "Arcane Explosion", 1 }
ns.spellNamesEn[1454] = { "Life Tap", 1 }
ns.spellNamesEn[1455] = { "Life Tap", 2 }
ns.spellNamesEn[1456] = { "Life Tap", 3 }
ns.spellNamesEn[1459] = { "Arcane Intellect", 1 }
ns.spellNamesEn[1460] = { "Arcane Intellect", 2 }
ns.spellNamesEn[1461] = { "Arcane Intellect", 3 }
ns.spellNamesEn[1462] = { "Beast Lore" }
ns.spellNamesEn[1463] = { "Mana Shield", 1 }
ns.spellNamesEn[1464] = { "Slam", 2 }
ns.spellNamesEn[1494] = { "Track Beasts" }
ns.spellNamesEn[1495] = { "Mongoose Bite", 1 }
ns.spellNamesEn[1499] = { "Freezing Trap", 1 }
ns.spellNamesEn[1510] = { "Volley", 1 }
ns.spellNamesEn[1513] = { "Scare Beast", 1 }
ns.spellNamesEn[1515] = { "Tame Beast" }
ns.spellNamesEn[1543] = { "Flare" }
ns.spellNamesEn[1608] = { "Heroic Strike", 4 }
ns.spellNamesEn[1671] = { "Shield Bash", 2 }
ns.spellNamesEn[1672] = { "Shield Bash", 3 }
ns.spellNamesEn[1680] = { "Whirlwind" }
ns.spellNamesEn[1706] = { "Levitate" }
ns.spellNamesEn[1714] = { "Curse of Tongues", 1 }
ns.spellNamesEn[1715] = { "Hamstring", 1 }
ns.spellNamesEn[1719] = { "Recklessness" }
ns.spellNamesEn[1725] = { "Distract" }
ns.spellNamesEn[1735] = { "Demoralizing Roar", 2 }
ns.spellNamesEn[1752] = { "Sinister Strike", 1 }
ns.spellNamesEn[1757] = { "Sinister Strike", 2 }
ns.spellNamesEn[1758] = { "Sinister Strike", 3 }
ns.spellNamesEn[1759] = { "Sinister Strike", 4 }
ns.spellNamesEn[1760] = { "Sinister Strike", 5 }
ns.spellNamesEn[1766] = { "Kick", 1 }
ns.spellNamesEn[1767] = { "Kick", 2 }
ns.spellNamesEn[1768] = { "Kick", 3 }
ns.spellNamesEn[1769] = { "Kick", 4 }
ns.spellNamesEn[1776] = { "Gouge", 1 }
ns.spellNamesEn[1777] = { "Gouge", 2 }
ns.spellNamesEn[1784] = { "Stealth", 1 }
ns.spellNamesEn[1785] = { "Stealth", 2 }
ns.spellNamesEn[1786] = { "Stealth", 3 }
ns.spellNamesEn[1787] = { "Stealth", 4 }
ns.spellNamesEn[1822] = { "Rake", 1 }
ns.spellNamesEn[1823] = { "Rake", 2 }
ns.spellNamesEn[1824] = { "Rake", 3 }
ns.spellNamesEn[1833] = { "Cheap Shot" }
ns.spellNamesEn[1842] = { "Disarm Trap" }
ns.spellNamesEn[1850] = { "Dash", 1 }
ns.spellNamesEn[1856] = { "Vanish", 1 }
ns.spellNamesEn[1857] = { "Vanish", 2 }
ns.spellNamesEn[1866] = { "Holy Strike", 3 }
ns.spellNamesEn[1943] = { "Rupture", 1 }
ns.spellNamesEn[1949] = { "Hellfire", 1 }
ns.spellNamesEn[1953] = { "Blink" }
ns.spellNamesEn[1966] = { "Feint", 1 }
ns.spellNamesEn[1978] = { "Serpent Sting", 1 }
ns.spellNamesEn[2006] = { "Resurrection", 1 }
ns.spellNamesEn[2008] = { "Ancestral Spirit", 1 }
ns.spellNamesEn[2010] = { "Resurrection", 2 }
ns.spellNamesEn[2050] = { "Lesser Heal", 1 }
ns.spellNamesEn[2052] = { "Lesser Heal", 2 }
ns.spellNamesEn[2053] = { "Lesser Heal", 3 }
ns.spellNamesEn[2054] = { "Heal", 1 }
ns.spellNamesEn[2055] = { "Heal", 2 }
ns.spellNamesEn[2060] = { "Greater Heal", 1 }
ns.spellNamesEn[2061] = { "Flash Heal", 1 }
ns.spellNamesEn[2070] = { "Sap", 2 }
ns.spellNamesEn[2090] = { "Rejuvenation", 4 }
ns.spellNamesEn[2091] = { "Rejuvenation", 5 }
ns.spellNamesEn[2094] = { "Blind" }
ns.spellNamesEn[2096] = { "Mind Vision", 1 }
ns.spellNamesEn[2098] = { "Eviscerate", 1 }
ns.spellNamesEn[2120] = { "Flamestrike", 1 }
ns.spellNamesEn[2121] = { "Flamestrike", 2 }
ns.spellNamesEn[2136] = { "Fire Blast", 1 }
ns.spellNamesEn[2137] = { "Fire Blast", 2 }
ns.spellNamesEn[2138] = { "Fire Blast", 3 }
ns.spellNamesEn[2139] = { "Counterspell" }
ns.spellNamesEn[2362] = { "Create Spellstone", 1 }
ns.spellNamesEn[2457] = { "Battle Stance" }
ns.spellNamesEn[2458] = { "Berserker Stance" }
ns.spellNamesEn[2484] = { "Earthbind Totem" }
ns.spellNamesEn[2495] = { "Holy Strike", 5 }
ns.spellNamesEn[2565] = { "Shield Block" }
ns.spellNamesEn[2589] = { "Backstab", 2 }
ns.spellNamesEn[2590] = { "Backstab", 3 }
ns.spellNamesEn[2591] = { "Backstab", 4 }
ns.spellNamesEn[2637] = { "Hibernate", 1 }
ns.spellNamesEn[2641] = { "Dismiss Pet" }
ns.spellNamesEn[2643] = { "Multi-Shot" }
ns.spellNamesEn[2645] = { "Ghost Wolf" }
ns.spellNamesEn[2651] = { "Elune's Grace" }
ns.spellNamesEn[2652] = { "Touch of Weakness", 1 }
ns.spellNamesEn[2687] = { "Bloodrage" }
ns.spellNamesEn[2767] = { "Shadow Word: Pain", 5 }
ns.spellNamesEn[2782] = { "Remove Curse" }
ns.spellNamesEn[2791] = { "Power Word: Fortitude", 4 }
ns.spellNamesEn[2800] = { "Lay on Hands", 2 }
ns.spellNamesEn[2812] = { "Holy Wrath", 1 }
ns.spellNamesEn[2860] = { "Chain Lightning", 3 }
ns.spellNamesEn[2870] = { "Cure Disease" }
ns.spellNamesEn[2878] = { "Turn Undead", 1 }
ns.spellNamesEn[2893] = { "Abolish Poison" }
ns.spellNamesEn[2908] = { "Soothe Animal", 1 }
ns.spellNamesEn[2912] = { "Starfire", 1 }
ns.spellNamesEn[2941] = { "Immolate", 4 }
ns.spellNamesEn[2944] = { "Devouring Plague", 1 }
ns.spellNamesEn[2948] = { "Scorch", 1 }
ns.spellNamesEn[2970] = { "Detect Invisibility", 2 }
ns.spellNamesEn[2973] = { "Raptor Strike", 1 }
ns.spellNamesEn[2974] = { "Wing Clip", 1 }
ns.spellNamesEn[2983] = { "Sprint", 1 }
ns.spellNamesEn[3029] = { "Claw", 2 }
ns.spellNamesEn[3034] = { "Viper Sting", 1 }
ns.spellNamesEn[3043] = { "Scorpid Sting" }
ns.spellNamesEn[3044] = { "Arcane Shot", 1 }
ns.spellNamesEn[3045] = { "Rapid Fire" }
ns.spellNamesEn[3111] = { "Mend Pet", 2 }
ns.spellNamesEn[3140] = { "Fireball", 4 }
ns.spellNamesEn[3472] = { "Holy Light", 6 }
ns.spellNamesEn[3552] = { "Conjure Mana Jade" }
ns.spellNamesEn[3561] = { "Teleport: Stormwind" }
ns.spellNamesEn[3562] = { "Teleport: Ironforge" }
ns.spellNamesEn[3563] = { "Teleport: Undercity" }
ns.spellNamesEn[3565] = { "Teleport: Darnassus" }
ns.spellNamesEn[3566] = { "Teleport: Thunder Bluff" }
ns.spellNamesEn[3567] = { "Teleport: Orgrimmar" }
ns.spellNamesEn[3599] = { "Searing Totem", 1 }
ns.spellNamesEn[3627] = { "Rejuvenation", 6 }
ns.spellNamesEn[3661] = { "Mend Pet", 3 }
ns.spellNamesEn[3662] = { "Mend Pet", 4 }
ns.spellNamesEn[3674] = { "Black Arrow", 1 }
ns.spellNamesEn[3698] = { "Health Funnel", 2 }
ns.spellNamesEn[3699] = { "Health Funnel", 3 }
ns.spellNamesEn[3700] = { "Health Funnel", 4 }
ns.spellNamesEn[3747] = { "Power Word: Shield", 4 }
ns.spellNamesEn[4987] = { "Cleanse" }
ns.spellNamesEn[5116] = { "Concussive Shot" }
ns.spellNamesEn[5118] = { "Aspect of the Cheetah" }
ns.spellNamesEn[5138] = { "Drain Mana", 1 }
ns.spellNamesEn[5143] = { "Arcane Missiles", 1 }
ns.spellNamesEn[5144] = { "Arcane Missiles", 2 }
ns.spellNamesEn[5145] = { "Arcane Missiles", 3 }
ns.spellNamesEn[5171] = { "Slice and Dice", 1 }
ns.spellNamesEn[5176] = { "Wrath", 1 }
ns.spellNamesEn[5177] = { "Wrath", 2 }
ns.spellNamesEn[5178] = { "Wrath", 3 }
ns.spellNamesEn[5179] = { "Wrath", 4 }
ns.spellNamesEn[5180] = { "Wrath", 5 }
ns.spellNamesEn[5185] = { "Healing Touch", 1 }
ns.spellNamesEn[5186] = { "Healing Touch", 2 }
ns.spellNamesEn[5187] = { "Healing Touch", 3 }
ns.spellNamesEn[5188] = { "Healing Touch", 4 }
ns.spellNamesEn[5189] = { "Healing Touch", 5 }
ns.spellNamesEn[5195] = { "Entangling Roots", 3 }
ns.spellNamesEn[5196] = { "Entangling Roots", 4 }
ns.spellNamesEn[5201] = { "Claw", 3 }
ns.spellNamesEn[5209] = { "Challenging Roar" }
ns.spellNamesEn[5211] = { "Bash", 1 }
ns.spellNamesEn[5215] = { "Prowl", 1 }
ns.spellNamesEn[5221] = { "Shred", 1 }
ns.spellNamesEn[5225] = { "Track Humanoids" }
ns.spellNamesEn[5229] = { "Enrage" }
ns.spellNamesEn[5232] = { "Mark of the Wild", 2 }
ns.spellNamesEn[5234] = { "Mark of the Wild", 4 }
ns.spellNamesEn[5242] = { "Battle Shout", 2 }
ns.spellNamesEn[5246] = { "Intimidating Shout" }
ns.spellNamesEn[5277] = { "Evasion" }
ns.spellNamesEn[5308] = { "Execute", 1 }
ns.spellNamesEn[5384] = { "Feign Death" }
ns.spellNamesEn[5394] = { "Healing Stream Totem", 1 }
ns.spellNamesEn[5484] = { "Howl of Terror", 1 }
ns.spellNamesEn[5487] = { "Bear Form" }
ns.spellNamesEn[5500] = { "Sense Demons" }
ns.spellNamesEn[5504] = { "Conjure Water", 1 }
ns.spellNamesEn[5505] = { "Conjure Water", 2 }
ns.spellNamesEn[5506] = { "Conjure Water", 3 }
ns.spellNamesEn[5569] = { "Holy Strike", 6 }
ns.spellNamesEn[5570] = { "Insect Swarm", 1 }
ns.spellNamesEn[5573] = { "Divine Protection", 2 }
ns.spellNamesEn[5588] = { "Hammer of Justice", 2 }
ns.spellNamesEn[5589] = { "Hammer of Justice", 3 }
ns.spellNamesEn[5599] = { "Blessing of Protection", 2 }
ns.spellNamesEn[5614] = { "Exorcism", 2 }
ns.spellNamesEn[5615] = { "Exorcism", 3 }
ns.spellNamesEn[5627] = { "Turn Undead", 2 }
ns.spellNamesEn[5675] = { "Mana Spring Totem", 1 }
ns.spellNamesEn[5676] = { "Searing Pain", 1 }
ns.spellNamesEn[5697] = { "Unending Breath" }
ns.spellNamesEn[5699] = { "Create Healthstone", 3 }
ns.spellNamesEn[5730] = { "Stoneclaw Totem", 1 }
ns.spellNamesEn[5740] = { "Rain of Fire", 1 }
ns.spellNamesEn[5782] = { "Fear", 1 }
ns.spellNamesEn[6041] = { "Lightning Bolt", 6 }
ns.spellNamesEn[6060] = { "Smite", 6 }
ns.spellNamesEn[6063] = { "Heal", 3 }
ns.spellNamesEn[6064] = { "Heal", 4 }
ns.spellNamesEn[6065] = { "Power Word: Shield", 5 }
ns.spellNamesEn[6066] = { "Power Word: Shield", 6 }
ns.spellNamesEn[6074] = { "Renew", 2 }
ns.spellNamesEn[6075] = { "Renew", 3 }
ns.spellNamesEn[6076] = { "Renew", 4 }
ns.spellNamesEn[6077] = { "Renew", 5 }
ns.spellNamesEn[6078] = { "Renew", 6 }
ns.spellNamesEn[6117] = { "Mage Armor", 1 }
ns.spellNamesEn[6127] = { "Conjure Water", 4 }
ns.spellNamesEn[6129] = { "Conjure Food", 4 }
ns.spellNamesEn[6131] = { "Frost Nova", 3 }
ns.spellNamesEn[6141] = { "Blizzard", 2 }
ns.spellNamesEn[6143] = { "Frost Ward", 1 }
ns.spellNamesEn[6178] = { "Charge", 2 }
ns.spellNamesEn[6190] = { "Demoralizing Shout", 2 }
ns.spellNamesEn[6192] = { "Battle Shout", 3 }
ns.spellNamesEn[6201] = { "Create Healthstone", 1 }
ns.spellNamesEn[6202] = { "Create Healthstone", 2 }
ns.spellNamesEn[6205] = { "Curse of Weakness", 3 }
ns.spellNamesEn[6213] = { "Fear", 2 }
ns.spellNamesEn[6215] = { "Fear", 3 }
ns.spellNamesEn[6217] = { "Bane of Agony", 3 }
ns.spellNamesEn[6219] = { "Rain of Fire", 2 }
ns.spellNamesEn[6222] = { "Corruption", 2 }
ns.spellNamesEn[6223] = { "Corruption", 3 }
ns.spellNamesEn[6226] = { "Drain Mana", 2 }
ns.spellNamesEn[6229] = { "Shadow Ward", 1 }
ns.spellNamesEn[6343] = { "Thunder Clap", 1 }
ns.spellNamesEn[6346] = { "Fear Ward" }
ns.spellNamesEn[6353] = { "Soul Fire", 1 }
ns.spellNamesEn[6363] = { "Searing Totem", 2 }
ns.spellNamesEn[6364] = { "Searing Totem", 3 }
ns.spellNamesEn[6365] = { "Searing Totem", 4 }
ns.spellNamesEn[6366] = { "Create Firestone", 1 }
ns.spellNamesEn[6375] = { "Healing Stream Totem", 2 }
ns.spellNamesEn[6377] = { "Healing Stream Totem", 3 }
ns.spellNamesEn[6390] = { "Stoneclaw Totem", 2 }
ns.spellNamesEn[6391] = { "Stoneclaw Totem", 3 }
ns.spellNamesEn[6392] = { "Stoneclaw Totem", 4 }
ns.spellNamesEn[6495] = { "Sentry Totem" }
ns.spellNamesEn[6546] = { "Rend", 2 }
ns.spellNamesEn[6547] = { "Rend", 3 }
ns.spellNamesEn[6548] = { "Rend", 4 }
ns.spellNamesEn[6552] = { "Pummel", 1 }
ns.spellNamesEn[6554] = { "Pummel", 2 }
ns.spellNamesEn[6572] = { "Revenge", 1 }
ns.spellNamesEn[6574] = { "Revenge", 2 }
ns.spellNamesEn[6673] = { "Battle Shout", 1 }
ns.spellNamesEn[6756] = { "Mark of the Wild", 3 }
ns.spellNamesEn[6760] = { "Eviscerate", 2 }
ns.spellNamesEn[6761] = { "Eviscerate", 3 }
ns.spellNamesEn[6762] = { "Eviscerate", 4 }
ns.spellNamesEn[6768] = { "Feint", 2 }
ns.spellNamesEn[6770] = { "Sap", 1 }
ns.spellNamesEn[6774] = { "Slice and Dice", 2 }
ns.spellNamesEn[6778] = { "Healing Touch", 6 }
ns.spellNamesEn[6780] = { "Wrath", 6 }
ns.spellNamesEn[6783] = { "Prowl", 2 }
ns.spellNamesEn[6785] = { "Ravage", 1 }
ns.spellNamesEn[6787] = { "Ravage", 2 }
ns.spellNamesEn[6789] = { "Death Coil", 1 }
ns.spellNamesEn[6795] = { "Growl" }
ns.spellNamesEn[6798] = { "Bash", 2 }
ns.spellNamesEn[6800] = { "Shred", 2 }
ns.spellNamesEn[6807] = { "Maul", 1 }
ns.spellNamesEn[6808] = { "Maul", 2 }
ns.spellNamesEn[6809] = { "Maul", 3 }
ns.spellNamesEn[6940] = { "Blessing of Sacrifice", 1 }
ns.spellNamesEn[6991] = { "Feed Pet" }
ns.spellNamesEn[7001] = { "Lightwell Renew", 1 }
ns.spellNamesEn[7128] = { "Inner Fire", 2 }
ns.spellNamesEn[7294] = { "Retribution Aura", 1 }
ns.spellNamesEn[7300] = { "Frost Armor", 2 }
ns.spellNamesEn[7301] = { "Frost Armor", 3 }
ns.spellNamesEn[7302] = { "Ice Armor", 1 }
ns.spellNamesEn[7320] = { "Ice Armor", 2 }
ns.spellNamesEn[7322] = { "Frostbolt", 4 }
ns.spellNamesEn[7328] = { "Redemption", 1 }
ns.spellNamesEn[7369] = { "Cleave", 2 }
ns.spellNamesEn[7372] = { "Hamstring", 2 }
ns.spellNamesEn[7373] = { "Hamstring", 3 }
ns.spellNamesEn[7379] = { "Revenge", 3 }
ns.spellNamesEn[7384] = { "Overpower", 1 }
ns.spellNamesEn[7386] = { "Sunder Armor", 1 }
ns.spellNamesEn[7400] = { "Mocking Blow", 2 }
ns.spellNamesEn[7402] = { "Mocking Blow", 3 }
ns.spellNamesEn[7405] = { "Sunder Armor", 2 }
ns.spellNamesEn[7641] = { "Shadow Bolt", 6 }
ns.spellNamesEn[7646] = { "Curse of Weakness", 4 }
ns.spellNamesEn[7648] = { "Corruption", 4 }
ns.spellNamesEn[7651] = { "Drain Life", 4 }
ns.spellNamesEn[7658] = { "Curse of Recklessness", 2 }
ns.spellNamesEn[7659] = { "Curse of Recklessness", 3 }
ns.spellNamesEn[7887] = { "Overpower", 2 }
ns.spellNamesEn[8004] = { "Lesser Healing Wave", 1 }
ns.spellNamesEn[8005] = { "Healing Wave", 7 }
ns.spellNamesEn[8008] = { "Lesser Healing Wave", 2 }
ns.spellNamesEn[8010] = { "Lesser Healing Wave", 3 }
ns.spellNamesEn[8012] = { "Purge", 2 }
ns.spellNamesEn[8017] = { "Rockbiter Weapon", 1 }
ns.spellNamesEn[8018] = { "Rockbiter Weapon", 2 }
ns.spellNamesEn[8019] = { "Rockbiter Weapon", 3 }
ns.spellNamesEn[8024] = { "Flametongue Weapon", 1 }
ns.spellNamesEn[8027] = { "Flametongue Weapon", 2 }
ns.spellNamesEn[8030] = { "Flametongue Weapon", 3 }
ns.spellNamesEn[8033] = { "Frostbrand Weapon", 1 }
ns.spellNamesEn[8038] = { "Frostbrand Weapon", 2 }
ns.spellNamesEn[8042] = { "Earth Shock", 1 }
ns.spellNamesEn[8044] = { "Earth Shock", 2 }
ns.spellNamesEn[8045] = { "Earth Shock", 3 }
ns.spellNamesEn[8046] = { "Earth Shock", 4 }
ns.spellNamesEn[8050] = { "Flame Shock", 1 }
ns.spellNamesEn[8052] = { "Flame Shock", 2 }
ns.spellNamesEn[8053] = { "Flame Shock", 3 }
ns.spellNamesEn[8056] = { "Frost Shock", 1 }
ns.spellNamesEn[8058] = { "Frost Shock", 2 }
ns.spellNamesEn[8071] = { "Stoneskin Totem", 1 }
ns.spellNamesEn[8075] = { "Strength of Earth Totem", 1 }
ns.spellNamesEn[8092] = { "Mind Blast", 1 }
ns.spellNamesEn[8102] = { "Mind Blast", 2 }
ns.spellNamesEn[8103] = { "Mind Blast", 3 }
ns.spellNamesEn[8104] = { "Mind Blast", 4 }
ns.spellNamesEn[8105] = { "Mind Blast", 5 }
ns.spellNamesEn[8106] = { "Mind Blast", 6 }
ns.spellNamesEn[8122] = { "Psychic Scream", 1 }
ns.spellNamesEn[8124] = { "Psychic Scream", 2 }
ns.spellNamesEn[8129] = { "Mana Burn", 1 }
ns.spellNamesEn[8131] = { "Mana Burn", 2 }
ns.spellNamesEn[8134] = { "Lightning Shield", 5 }
ns.spellNamesEn[8143] = { "Tremor Totem" }
ns.spellNamesEn[8154] = { "Stoneskin Totem", 2 }
ns.spellNamesEn[8155] = { "Stoneskin Totem", 3 }
ns.spellNamesEn[8160] = { "Strength of Earth Totem", 2 }
ns.spellNamesEn[8161] = { "Strength of Earth Totem", 3 }
ns.spellNamesEn[8166] = { "Poison Cleansing Totem" }
ns.spellNamesEn[8170] = { "Disease Cleansing Totem" }
ns.spellNamesEn[8177] = { "Grounding Totem" }
ns.spellNamesEn[8181] = { "Frost Resistance Totem", 1 }
ns.spellNamesEn[8184] = { "Fire Resistance Totem", 1 }
ns.spellNamesEn[8190] = { "Magma Totem", 1 }
ns.spellNamesEn[8192] = { "Mind Soothe", 2 }
ns.spellNamesEn[8198] = { "Thunder Clap", 2 }
ns.spellNamesEn[8204] = { "Thunder Clap", 3 }
ns.spellNamesEn[8205] = { "Thunder Clap", 4 }
ns.spellNamesEn[8227] = { "Flametongue Totem", 1 }
ns.spellNamesEn[8232] = { "Windfury Weapon", 1 }
ns.spellNamesEn[8235] = { "Windfury Weapon", 2 }
ns.spellNamesEn[8249] = { "Flametongue Totem", 2 }
ns.spellNamesEn[8288] = { "Drain Soul", 2 }
ns.spellNamesEn[8289] = { "Drain Soul", 3 }
ns.spellNamesEn[8380] = { "Sunder Armor", 3 }
ns.spellNamesEn[8400] = { "Fireball", 5 }
ns.spellNamesEn[8401] = { "Fireball", 6 }
ns.spellNamesEn[8402] = { "Fireball", 7 }
ns.spellNamesEn[8406] = { "Frostbolt", 5 }
ns.spellNamesEn[8408] = { "Frostbolt", 7 }
ns.spellNamesEn[8412] = { "Fire Blast", 4 }
ns.spellNamesEn[8413] = { "Fire Blast", 5 }
ns.spellNamesEn[8416] = { "Arcane Missiles", 4 }
ns.spellNamesEn[8417] = { "Arcane Missiles", 5 }
ns.spellNamesEn[8422] = { "Flamestrike", 3 }
ns.spellNamesEn[8423] = { "Flamestrike", 4 }
ns.spellNamesEn[8427] = { "Blizzard", 3 }
ns.spellNamesEn[8437] = { "Arcane Explosion", 2 }
ns.spellNamesEn[8438] = { "Arcane Explosion", 3 }
ns.spellNamesEn[8439] = { "Arcane Explosion", 4 }
ns.spellNamesEn[8444] = { "Scorch", 2 }
ns.spellNamesEn[8445] = { "Scorch", 3 }
ns.spellNamesEn[8446] = { "Scorch", 4 }
ns.spellNamesEn[8450] = { "Dampen Magic", 2 }
ns.spellNamesEn[8451] = { "Dampen Magic", 3 }
ns.spellNamesEn[8455] = { "Amplify Magic", 2 }
ns.spellNamesEn[8457] = { "Fire Ward", 2 }
ns.spellNamesEn[8458] = { "Fire Ward", 3 }
ns.spellNamesEn[8461] = { "Frost Ward", 2 }
ns.spellNamesEn[8462] = { "Frost Ward", 3 }
ns.spellNamesEn[8492] = { "Cone of Cold", 2 }
ns.spellNamesEn[8494] = { "Mana Shield", 2 }
ns.spellNamesEn[8495] = { "Mana Shield", 3 }
ns.spellNamesEn[8512] = { "Windfury Totem", 1 }
ns.spellNamesEn[8621] = { "Sinister Strike", 6 }
ns.spellNamesEn[8623] = { "Eviscerate", 5 }
ns.spellNamesEn[8624] = { "Eviscerate", 6 }
ns.spellNamesEn[8629] = { "Gouge", 3 }
ns.spellNamesEn[8631] = { "Garrote", 2 }
ns.spellNamesEn[8632] = { "Garrote", 3 }
ns.spellNamesEn[8633] = { "Garrote", 4 }
ns.spellNamesEn[8637] = { "Feint", 3 }
ns.spellNamesEn[8639] = { "Rupture", 2 }
ns.spellNamesEn[8640] = { "Rupture", 3 }
ns.spellNamesEn[8643] = { "Kidney Shot", 2 }
ns.spellNamesEn[8647] = { "Expose Armor", 1 }
ns.spellNamesEn[8649] = { "Expose Armor", 2 }
ns.spellNamesEn[8650] = { "Expose Armor", 3 }
ns.spellNamesEn[8676] = { "Ambush", 1 }
ns.spellNamesEn[8696] = { "Sprint", 2 }
ns.spellNamesEn[8721] = { "Backstab", 5 }
ns.spellNamesEn[8724] = { "Ambush", 2 }
ns.spellNamesEn[8725] = { "Ambush", 3 }
ns.spellNamesEn[8820] = { "Slam", 3 }
ns.spellNamesEn[8835] = { "Grace of Air Totem", 1 }
ns.spellNamesEn[8903] = { "Healing Touch", 7 }
ns.spellNamesEn[8905] = { "Wrath", 7 }
ns.spellNamesEn[8907] = { "Mark of the Wild", 5 }
ns.spellNamesEn[8910] = { "Rejuvenation", 7 }
ns.spellNamesEn[8914] = { "Thorns", 4 }
ns.spellNamesEn[8918] = { "Tranquility", 2 }
ns.spellNamesEn[8921] = { "Moonfire", 1 }
ns.spellNamesEn[8924] = { "Moonfire", 2 }
ns.spellNamesEn[8925] = { "Moonfire", 3 }
ns.spellNamesEn[8926] = { "Moonfire", 4 }
ns.spellNamesEn[8927] = { "Moonfire", 5 }
ns.spellNamesEn[8928] = { "Moonfire", 6 }
ns.spellNamesEn[8929] = { "Moonfire", 7 }
ns.spellNamesEn[8936] = { "Regrowth", 1 }
ns.spellNamesEn[8938] = { "Regrowth", 2 }
ns.spellNamesEn[8939] = { "Regrowth", 3 }
ns.spellNamesEn[8940] = { "Regrowth", 4 }
ns.spellNamesEn[8941] = { "Regrowth", 5 }
ns.spellNamesEn[8946] = { "Cure Poison" }
ns.spellNamesEn[8949] = { "Starfire", 2 }
ns.spellNamesEn[8950] = { "Starfire", 3 }
ns.spellNamesEn[8951] = { "Starfire", 4 }
ns.spellNamesEn[8955] = { "Soothe Animal", 2 }
ns.spellNamesEn[8972] = { "Maul", 4 }
ns.spellNamesEn[8983] = { "Bash", 3 }
ns.spellNamesEn[8992] = { "Shred", 3 }
ns.spellNamesEn[8998] = { "Cower", 1 }
ns.spellNamesEn[9000] = { "Cower", 2 }
ns.spellNamesEn[9005] = { "Pounce", 1 }
ns.spellNamesEn[9035] = { "Hex of Weakness", 1 }
ns.spellNamesEn[9472] = { "Flash Heal", 2 }
ns.spellNamesEn[9473] = { "Flash Heal", 3 }
ns.spellNamesEn[9474] = { "Flash Heal", 4 }
ns.spellNamesEn[9484] = { "Shackle Undead", 1 }
ns.spellNamesEn[9485] = { "Shackle Undead", 2 }
ns.spellNamesEn[9490] = { "Demoralizing Roar", 3 }
ns.spellNamesEn[9492] = { "Rip", 2 }
ns.spellNamesEn[9493] = { "Rip", 3 }
ns.spellNamesEn[9578] = { "Fade", 2 }
ns.spellNamesEn[9579] = { "Fade", 3 }
ns.spellNamesEn[9592] = { "Fade", 4 }
ns.spellNamesEn[9634] = { "Dire Bear Form" }
ns.spellNamesEn[9745] = { "Maul", 5 }
ns.spellNamesEn[9747] = { "Demoralizing Roar", 4 }
ns.spellNamesEn[9749] = { "Faerie Fire", 3 }
ns.spellNamesEn[9750] = { "Regrowth", 6 }
ns.spellNamesEn[9752] = { "Rip", 4 }
ns.spellNamesEn[9754] = { "Swipe", 4 }
ns.spellNamesEn[9756] = { "Thorns", 5 }
ns.spellNamesEn[9758] = { "Healing Touch", 8 }
ns.spellNamesEn[9821] = { "Dash", 2 }
ns.spellNamesEn[9823] = { "Pounce", 2 }
ns.spellNamesEn[9827] = { "Pounce", 3 }
ns.spellNamesEn[9829] = { "Shred", 4 }
ns.spellNamesEn[9830] = { "Shred", 5 }
ns.spellNamesEn[9833] = { "Moonfire", 8 }
ns.spellNamesEn[9834] = { "Moonfire", 9 }
ns.spellNamesEn[9835] = { "Moonfire", 10 }
ns.spellNamesEn[9839] = { "Rejuvenation", 8 }
ns.spellNamesEn[9840] = { "Rejuvenation", 9 }
ns.spellNamesEn[9841] = { "Rejuvenation", 10 }
ns.spellNamesEn[9849] = { "Claw", 4 }
ns.spellNamesEn[9850] = { "Claw", 5 }
ns.spellNamesEn[9852] = { "Entangling Roots", 5 }
ns.spellNamesEn[9853] = { "Entangling Roots", 6 }
ns.spellNamesEn[9856] = { "Regrowth", 7 }
ns.spellNamesEn[9857] = { "Regrowth", 8 }
ns.spellNamesEn[9858] = { "Regrowth", 9 }
ns.spellNamesEn[9862] = { "Tranquility", 3 }
ns.spellNamesEn[9863] = { "Tranquility", 4 }
ns.spellNamesEn[9866] = { "Ravage", 3 }
ns.spellNamesEn[9867] = { "Ravage", 4 }
ns.spellNamesEn[9875] = { "Starfire", 5 }
ns.spellNamesEn[9876] = { "Starfire", 6 }
ns.spellNamesEn[9880] = { "Maul", 6 }
ns.spellNamesEn[9881] = { "Maul", 7 }
ns.spellNamesEn[9884] = { "Mark of the Wild", 6 }
ns.spellNamesEn[9885] = { "Mark of the Wild", 7 }
ns.spellNamesEn[9888] = { "Healing Touch", 9 }
ns.spellNamesEn[9889] = { "Healing Touch", 10 }
ns.spellNamesEn[9892] = { "Cower", 3 }
ns.spellNamesEn[9894] = { "Rip", 5 }
ns.spellNamesEn[9896] = { "Rip", 6 }
ns.spellNamesEn[9898] = { "Demoralizing Roar", 5 }
ns.spellNamesEn[9901] = { "Soothe Animal", 3 }
ns.spellNamesEn[9904] = { "Rake", 4 }
ns.spellNamesEn[9907] = { "Faerie Fire", 4 }
ns.spellNamesEn[9908] = { "Swipe", 5 }
ns.spellNamesEn[9910] = { "Thorns", 6 }
ns.spellNamesEn[9912] = { "Wrath", 8 }
ns.spellNamesEn[9913] = { "Prowl", 3 }
ns.spellNamesEn[10053] = { "Conjure Mana Citrine" }
ns.spellNamesEn[10054] = { "Conjure Mana Ruby" }
ns.spellNamesEn[10059] = { "Portal: Stormwind" }
ns.spellNamesEn[10060] = { "Power Infusion" }
ns.spellNamesEn[10138] = { "Conjure Water", 5 }
ns.spellNamesEn[10139] = { "Conjure Water", 6 }
ns.spellNamesEn[10140] = { "Conjure Water", 7 }
ns.spellNamesEn[10144] = { "Conjure Food", 5 }
ns.spellNamesEn[10145] = { "Conjure Food", 6 }
ns.spellNamesEn[10148] = { "Fireball", 8 }
ns.spellNamesEn[10149] = { "Fireball", 9 }
ns.spellNamesEn[10150] = { "Fireball", 10 }
ns.spellNamesEn[10151] = { "Fireball", 11 }
ns.spellNamesEn[10156] = { "Arcane Intellect", 4 }
ns.spellNamesEn[10157] = { "Arcane Intellect", 5 }
ns.spellNamesEn[10159] = { "Cone of Cold", 3 }
ns.spellNamesEn[10160] = { "Cone of Cold", 4 }
ns.spellNamesEn[10161] = { "Cone of Cold", 5 }
ns.spellNamesEn[10169] = { "Amplify Magic", 3 }
ns.spellNamesEn[10170] = { "Amplify Magic", 4 }
ns.spellNamesEn[10173] = { "Dampen Magic", 4 }
ns.spellNamesEn[10174] = { "Dampen Magic", 5 }
ns.spellNamesEn[10177] = { "Frost Ward", 4 }
ns.spellNamesEn[10179] = { "Frostbolt", 8 }
ns.spellNamesEn[10180] = { "Frostbolt", 9 }
ns.spellNamesEn[10181] = { "Frostbolt", 10 }
ns.spellNamesEn[10185] = { "Blizzard", 4 }
ns.spellNamesEn[10186] = { "Blizzard", 5 }
ns.spellNamesEn[10187] = { "Blizzard", 6 }
ns.spellNamesEn[10191] = { "Mana Shield", 4 }
ns.spellNamesEn[10192] = { "Mana Shield", 5 }
ns.spellNamesEn[10193] = { "Mana Shield", 6 }
ns.spellNamesEn[10197] = { "Fire Blast", 6 }
ns.spellNamesEn[10199] = { "Fire Blast", 7 }
ns.spellNamesEn[10201] = { "Arcane Explosion", 5 }
ns.spellNamesEn[10202] = { "Arcane Explosion", 6 }
ns.spellNamesEn[10205] = { "Scorch", 5 }
ns.spellNamesEn[10206] = { "Scorch", 6 }
ns.spellNamesEn[10207] = { "Scorch", 7 }
ns.spellNamesEn[10211] = { "Arcane Missiles", 6 }
ns.spellNamesEn[10212] = { "Arcane Missiles", 7 }
ns.spellNamesEn[10215] = { "Flamestrike", 5 }
ns.spellNamesEn[10216] = { "Flamestrike", 6 }
ns.spellNamesEn[10219] = { "Ice Armor", 3 }
ns.spellNamesEn[10220] = { "Ice Armor", 4 }
ns.spellNamesEn[10223] = { "Fire Ward", 4 }
ns.spellNamesEn[10225] = { "Fire Ward", 5 }
ns.spellNamesEn[10230] = { "Frost Nova", 4 }
ns.spellNamesEn[10278] = { "Blessing of Protection", 3 }
ns.spellNamesEn[10290] = { "Devotion Aura", 2 }
ns.spellNamesEn[10291] = { "Devotion Aura", 4 }
ns.spellNamesEn[10292] = { "Devotion Aura", 6 }
ns.spellNamesEn[10293] = { "Devotion Aura", 7 }
ns.spellNamesEn[10298] = { "Retribution Aura", 2 }
ns.spellNamesEn[10299] = { "Retribution Aura", 3 }
ns.spellNamesEn[10300] = { "Retribution Aura", 4 }
ns.spellNamesEn[10301] = { "Retribution Aura", 5 }
ns.spellNamesEn[10308] = { "Hammer of Justice", 4 }
ns.spellNamesEn[10310] = { "Lay on Hands", 3 }
ns.spellNamesEn[10312] = { "Exorcism", 4 }
ns.spellNamesEn[10313] = { "Exorcism", 5 }
ns.spellNamesEn[10314] = { "Exorcism", 6 }
ns.spellNamesEn[10318] = { "Holy Wrath", 2 }
ns.spellNamesEn[10322] = { "Redemption", 2 }
ns.spellNamesEn[10324] = { "Redemption", 3 }
ns.spellNamesEn[10326] = { "Turn Undead", 3 }
ns.spellNamesEn[10328] = { "Holy Light", 7 }
ns.spellNamesEn[10329] = { "Holy Light", 8 }
ns.spellNamesEn[10332] = { "Holy Strike", 7 }
ns.spellNamesEn[10333] = { "Holy Strike", 8 }
ns.spellNamesEn[10391] = { "Lightning Bolt", 7 }
ns.spellNamesEn[10392] = { "Lightning Bolt", 8 }
ns.spellNamesEn[10395] = { "Healing Wave", 8 }
ns.spellNamesEn[10396] = { "Healing Wave", 9 }
ns.spellNamesEn[10399] = { "Rockbiter Weapon", 4 }
ns.spellNamesEn[10406] = { "Stoneskin Totem", 4 }
ns.spellNamesEn[10407] = { "Stoneskin Totem", 5 }
ns.spellNamesEn[10408] = { "Stoneskin Totem", 6 }
ns.spellNamesEn[10412] = { "Earth Shock", 5 }
ns.spellNamesEn[10413] = { "Earth Shock", 6 }
ns.spellNamesEn[10414] = { "Earth Shock", 7 }
ns.spellNamesEn[10427] = { "Stoneclaw Totem", 5 }
ns.spellNamesEn[10428] = { "Stoneclaw Totem", 6 }
ns.spellNamesEn[10431] = { "Lightning Shield", 6 }
ns.spellNamesEn[10432] = { "Lightning Shield", 7 }
ns.spellNamesEn[10437] = { "Searing Totem", 5 }
ns.spellNamesEn[10438] = { "Searing Totem", 6 }
ns.spellNamesEn[10442] = { "Strength of Earth Totem", 4 }
ns.spellNamesEn[10447] = { "Flame Shock", 4 }
ns.spellNamesEn[10448] = { "Flame Shock", 5 }
ns.spellNamesEn[10456] = { "Frostbrand Weapon", 3 }
ns.spellNamesEn[10462] = { "Healing Stream Totem", 4 }
ns.spellNamesEn[10463] = { "Healing Stream Totem", 5 }
ns.spellNamesEn[10466] = { "Lesser Healing Wave", 4 }
ns.spellNamesEn[10467] = { "Lesser Healing Wave", 5 }
ns.spellNamesEn[10468] = { "Lesser Healing Wave", 6 }
ns.spellNamesEn[10472] = { "Frost Shock", 3 }
ns.spellNamesEn[10473] = { "Frost Shock", 4 }
ns.spellNamesEn[10478] = { "Frost Resistance Totem", 2 }
ns.spellNamesEn[10479] = { "Frost Resistance Totem", 3 }
ns.spellNamesEn[10486] = { "Windfury Weapon", 3 }
ns.spellNamesEn[10495] = { "Mana Spring Totem", 2 }
ns.spellNamesEn[10496] = { "Mana Spring Totem", 3 }
ns.spellNamesEn[10497] = { "Mana Spring Totem", 4 }
ns.spellNamesEn[10526] = { "Flametongue Totem", 3 }
ns.spellNamesEn[10537] = { "Fire Resistance Totem", 2 }
ns.spellNamesEn[10538] = { "Fire Resistance Totem", 3 }
ns.spellNamesEn[10585] = { "Magma Totem", 2 }
ns.spellNamesEn[10586] = { "Magma Totem", 3 }
ns.spellNamesEn[10587] = { "Magma Totem", 4 }
ns.spellNamesEn[10595] = { "Nature Resistance Totem", 1 }
ns.spellNamesEn[10600] = { "Nature Resistance Totem", 2 }
ns.spellNamesEn[10601] = { "Nature Resistance Totem", 3 }
ns.spellNamesEn[10605] = { "Chain Lightning", 4 }
ns.spellNamesEn[10613] = { "Windfury Totem", 2 }
ns.spellNamesEn[10614] = { "Windfury Totem", 3 }
ns.spellNamesEn[10622] = { "Chain Heal", 2 }
ns.spellNamesEn[10623] = { "Chain Heal", 3 }
ns.spellNamesEn[10627] = { "Grace of Air Totem", 2 }
ns.spellNamesEn[10797] = { "Starshards", 1 }
ns.spellNamesEn[10874] = { "Mana Burn", 3 }
ns.spellNamesEn[10875] = { "Mana Burn", 4 }
ns.spellNamesEn[10876] = { "Mana Burn", 5 }
ns.spellNamesEn[10880] = { "Resurrection", 3 }
ns.spellNamesEn[10881] = { "Resurrection", 4 }
ns.spellNamesEn[10888] = { "Psychic Scream", 3 }
ns.spellNamesEn[10890] = { "Psychic Scream", 4 }
ns.spellNamesEn[10892] = { "Shadow Word: Pain", 6 }
ns.spellNamesEn[10893] = { "Shadow Word: Pain", 7 }
ns.spellNamesEn[10894] = { "Shadow Word: Pain", 8 }
ns.spellNamesEn[10898] = { "Power Word: Shield", 7 }
ns.spellNamesEn[10899] = { "Power Word: Shield", 8 }
ns.spellNamesEn[10900] = { "Power Word: Shield", 9 }
ns.spellNamesEn[10901] = { "Power Word: Shield", 10 }
ns.spellNamesEn[10911] = { "Mind Control", 2 }
ns.spellNamesEn[10912] = { "Mind Control", 3 }
ns.spellNamesEn[10915] = { "Flash Heal", 5 }
ns.spellNamesEn[10916] = { "Flash Heal", 6 }
ns.spellNamesEn[10917] = { "Flash Heal", 7 }
ns.spellNamesEn[10927] = { "Renew", 7 }
ns.spellNamesEn[10928] = { "Renew", 8 }
ns.spellNamesEn[10929] = { "Renew", 9 }
ns.spellNamesEn[10933] = { "Smite", 7 }
ns.spellNamesEn[10934] = { "Smite", 8 }
ns.spellNamesEn[10937] = { "Power Word: Fortitude", 5 }
ns.spellNamesEn[10938] = { "Power Word: Fortitude", 6 }
ns.spellNamesEn[10941] = { "Fade", 5 }
ns.spellNamesEn[10942] = { "Fade", 6 }
ns.spellNamesEn[10945] = { "Mind Blast", 7 }
ns.spellNamesEn[10946] = { "Mind Blast", 8 }
ns.spellNamesEn[10947] = { "Mind Blast", 9 }
ns.spellNamesEn[10951] = { "Inner Fire", 5 }
ns.spellNamesEn[10952] = { "Inner Fire", 6 }
ns.spellNamesEn[10953] = { "Mind Soothe", 3 }
ns.spellNamesEn[10955] = { "Shackle Undead", 3 }
ns.spellNamesEn[10957] = { "Shadow Protection", 2 }
ns.spellNamesEn[10958] = { "Shadow Protection", 3 }
ns.spellNamesEn[10960] = { "Prayer of Healing", 3 }
ns.spellNamesEn[10961] = { "Prayer of Healing", 4 }
ns.spellNamesEn[10963] = { "Greater Heal", 2 }
ns.spellNamesEn[10964] = { "Greater Heal", 3 }
ns.spellNamesEn[10965] = { "Greater Heal", 4 }
ns.spellNamesEn[11113] = { "Blast Wave", 1 }
ns.spellNamesEn[11129] = { "Combustion" }
ns.spellNamesEn[11197] = { "Expose Armor", 4 }
ns.spellNamesEn[11198] = { "Expose Armor", 5 }
ns.spellNamesEn[11267] = { "Ambush", 4 }
ns.spellNamesEn[11268] = { "Ambush", 5 }
ns.spellNamesEn[11269] = { "Ambush", 6 }
ns.spellNamesEn[11273] = { "Rupture", 4 }
ns.spellNamesEn[11274] = { "Rupture", 5 }
ns.spellNamesEn[11275] = { "Rupture", 6 }
ns.spellNamesEn[11279] = { "Backstab", 6 }
ns.spellNamesEn[11280] = { "Backstab", 7 }
ns.spellNamesEn[11281] = { "Backstab", 8 }
ns.spellNamesEn[11285] = { "Gouge", 4 }
ns.spellNamesEn[11286] = { "Gouge", 5 }
ns.spellNamesEn[11289] = { "Garrote", 5 }
ns.spellNamesEn[11290] = { "Garrote", 6 }
ns.spellNamesEn[11293] = { "Sinister Strike", 7 }
ns.spellNamesEn[11294] = { "Sinister Strike", 8 }
ns.spellNamesEn[11297] = { "Sap", 3 }
ns.spellNamesEn[11299] = { "Eviscerate", 7 }
ns.spellNamesEn[11300] = { "Eviscerate", 8 }
ns.spellNamesEn[11303] = { "Feint", 4 }
ns.spellNamesEn[11305] = { "Sprint", 3 }
ns.spellNamesEn[11366] = { "Pyroblast", 1 }
ns.spellNamesEn[11416] = { "Portal: Ironforge" }
ns.spellNamesEn[11417] = { "Portal: Orgrimmar" }
ns.spellNamesEn[11418] = { "Portal: Undercity" }
ns.spellNamesEn[11419] = { "Portal: Darnassus" }
ns.spellNamesEn[11420] = { "Portal: Thunder Bluff" }
ns.spellNamesEn[11426] = { "Ice Barrier", 1 }
ns.spellNamesEn[11549] = { "Battle Shout", 4 }
ns.spellNamesEn[11550] = { "Battle Shout", 5 }
ns.spellNamesEn[11551] = { "Battle Shout", 6 }
ns.spellNamesEn[11554] = { "Demoralizing Shout", 3 }
ns.spellNamesEn[11555] = { "Demoralizing Shout", 4 }
ns.spellNamesEn[11556] = { "Demoralizing Shout", 5 }
ns.spellNamesEn[11564] = { "Heroic Strike", 5 }
ns.spellNamesEn[11565] = { "Heroic Strike", 6 }
ns.spellNamesEn[11566] = { "Heroic Strike", 7 }
ns.spellNamesEn[11567] = { "Heroic Strike", 8 }
ns.spellNamesEn[11572] = { "Rend", 5 }
ns.spellNamesEn[11573] = { "Rend", 6 }
ns.spellNamesEn[11574] = { "Rend", 7 }
ns.spellNamesEn[11578] = { "Charge", 3 }
ns.spellNamesEn[11580] = { "Thunder Clap", 5 }
ns.spellNamesEn[11581] = { "Thunder Clap", 6 }
ns.spellNamesEn[11584] = { "Overpower", 3 }
ns.spellNamesEn[11585] = { "Overpower", 4 }
ns.spellNamesEn[11596] = { "Sunder Armor", 4 }
ns.spellNamesEn[11597] = { "Sunder Armor", 5 }
ns.spellNamesEn[11600] = { "Revenge", 4 }
ns.spellNamesEn[11601] = { "Revenge", 5 }
ns.spellNamesEn[11604] = { "Slam", 4 }
ns.spellNamesEn[11605] = { "Slam", 5 }
ns.spellNamesEn[11608] = { "Cleave", 3 }
ns.spellNamesEn[11609] = { "Cleave", 4 }
ns.spellNamesEn[11659] = { "Shadow Bolt", 7 }
ns.spellNamesEn[11660] = { "Shadow Bolt", 8 }
ns.spellNamesEn[11661] = { "Shadow Bolt", 9 }
ns.spellNamesEn[11665] = { "Immolate", 5 }
ns.spellNamesEn[11667] = { "Immolate", 6 }
ns.spellNamesEn[11668] = { "Immolate", 7 }
ns.spellNamesEn[11671] = { "Corruption", 5 }
ns.spellNamesEn[11672] = { "Corruption", 6 }
ns.spellNamesEn[11675] = { "Drain Soul", 4 }
ns.spellNamesEn[11677] = { "Rain of Fire", 3 }
ns.spellNamesEn[11678] = { "Rain of Fire", 4 }
ns.spellNamesEn[11683] = { "Hellfire", 2 }
ns.spellNamesEn[11684] = { "Hellfire", 3 }
ns.spellNamesEn[11687] = { "Life Tap", 4 }
ns.spellNamesEn[11688] = { "Life Tap", 5 }
ns.spellNamesEn[11689] = { "Life Tap", 6 }
ns.spellNamesEn[11693] = { "Health Funnel", 5 }
ns.spellNamesEn[11694] = { "Health Funnel", 6 }
ns.spellNamesEn[11695] = { "Health Funnel", 7 }
ns.spellNamesEn[11699] = { "Drain Life", 5 }
ns.spellNamesEn[11700] = { "Drain Life", 6 }
ns.spellNamesEn[11703] = { "Drain Mana", 3 }
ns.spellNamesEn[11704] = { "Drain Mana", 4 }
ns.spellNamesEn[11707] = { "Curse of Weakness", 5 }
ns.spellNamesEn[11708] = { "Curse of Weakness", 6 }
ns.spellNamesEn[11711] = { "Bane of Agony", 4 }
ns.spellNamesEn[11712] = { "Bane of Agony", 5 }
ns.spellNamesEn[11713] = { "Bane of Agony", 6 }
ns.spellNamesEn[11717] = { "Curse of Recklessness", 4 }
ns.spellNamesEn[11719] = { "Curse of Tongues", 2 }
ns.spellNamesEn[11725] = { "Subjugate Demon", 2 }
ns.spellNamesEn[11726] = { "Subjugate Demon", 3 }
ns.spellNamesEn[11729] = { "Create Healthstone", 4 }
ns.spellNamesEn[11730] = { "Create Healthstone", 5 }
ns.spellNamesEn[11733] = { "Demon Armor", 3 }
ns.spellNamesEn[11734] = { "Demon Armor", 4 }
ns.spellNamesEn[11735] = { "Demon Armor", 5 }
ns.spellNamesEn[11739] = { "Shadow Ward", 2 }
ns.spellNamesEn[11740] = { "Shadow Ward", 3 }
ns.spellNamesEn[11743] = { "Detect Invisibility", 3 }
ns.spellNamesEn[11958] = { "Ice Block" }
ns.spellNamesEn[12042] = { "Arcane Power" }
ns.spellNamesEn[12043] = { "Presence of Mind" }
ns.spellNamesEn[12051] = { "Evocation" }
ns.spellNamesEn[12292] = { "Sweeping Strikes" }
ns.spellNamesEn[12294] = { "Mortal Strike", 1 }
ns.spellNamesEn[12323] = { "Piercing Howl" }
ns.spellNamesEn[12328] = { "Death Wish" }
ns.spellNamesEn[12472] = { "Cold Snap" }
ns.spellNamesEn[12505] = { "Pyroblast", 2 }
ns.spellNamesEn[12522] = { "Pyroblast", 3 }
ns.spellNamesEn[12523] = { "Pyroblast", 4 }
ns.spellNamesEn[12524] = { "Pyroblast", 5 }
ns.spellNamesEn[12525] = { "Pyroblast", 6 }
ns.spellNamesEn[12526] = { "Pyroblast", 7 }
ns.spellNamesEn[12809] = { "Concussion Blow" }
ns.spellNamesEn[12824] = { "Polymorph", 2 }
ns.spellNamesEn[12825] = { "Polymorph", 3 }
ns.spellNamesEn[12826] = { "Polymorph", 4 }
ns.spellNamesEn[12975] = { "Last Stand" }
ns.spellNamesEn[13018] = { "Blast Wave", 2 }
ns.spellNamesEn[13019] = { "Blast Wave", 3 }
ns.spellNamesEn[13020] = { "Blast Wave", 4 }
ns.spellNamesEn[13021] = { "Blast Wave", 5 }
ns.spellNamesEn[13031] = { "Ice Barrier", 2 }
ns.spellNamesEn[13032] = { "Ice Barrier", 3 }
ns.spellNamesEn[13033] = { "Ice Barrier", 4 }
ns.spellNamesEn[13159] = { "Aspect of the Pack" }
ns.spellNamesEn[13161] = { "Aspect of the Beast", 1 }
ns.spellNamesEn[13163] = { "Aspect of the Monkey" }
ns.spellNamesEn[13165] = { "Aspect of the Hawk", 1 }
ns.spellNamesEn[13542] = { "Mend Pet", 5 }
ns.spellNamesEn[13543] = { "Mend Pet", 6 }
ns.spellNamesEn[13544] = { "Mend Pet", 7 }
ns.spellNamesEn[13549] = { "Serpent Sting", 2 }
ns.spellNamesEn[13550] = { "Serpent Sting", 3 }
ns.spellNamesEn[13551] = { "Serpent Sting", 4 }
ns.spellNamesEn[13552] = { "Serpent Sting", 5 }
ns.spellNamesEn[13553] = { "Serpent Sting", 6 }
ns.spellNamesEn[13554] = { "Serpent Sting", 7 }
ns.spellNamesEn[13555] = { "Serpent Sting", 8 }
ns.spellNamesEn[13795] = { "Immolation Trap", 1 }
ns.spellNamesEn[13809] = { "Frost Trap" }
ns.spellNamesEn[13813] = { "Explosive Trap", 1 }
ns.spellNamesEn[13877] = { "Blade Flurry" }
ns.spellNamesEn[13896] = { "Feedback", 1 }
ns.spellNamesEn[13908] = { "Desperate Prayer", 1 }
ns.spellNamesEn[14183] = { "Premeditation" }
ns.spellNamesEn[14260] = { "Raptor Strike", 2 }
ns.spellNamesEn[14261] = { "Raptor Strike", 3 }
ns.spellNamesEn[14262] = { "Raptor Strike", 4 }
ns.spellNamesEn[14263] = { "Raptor Strike", 5 }
ns.spellNamesEn[14264] = { "Raptor Strike", 6 }
ns.spellNamesEn[14265] = { "Raptor Strike", 7 }
ns.spellNamesEn[14266] = { "Raptor Strike", 8 }
ns.spellNamesEn[14267] = { "Wing Clip", 2 }
ns.spellNamesEn[14268] = { "Wing Clip", 3 }
ns.spellNamesEn[14269] = { "Mongoose Bite", 2 }
ns.spellNamesEn[14270] = { "Mongoose Bite", 3 }
ns.spellNamesEn[14271] = { "Mongoose Bite", 4 }
ns.spellNamesEn[14272] = { "Disengage", 2 }
ns.spellNamesEn[14273] = { "Disengage", 3 }
ns.spellNamesEn[14274] = { "Distracting Shot", 2 }
ns.spellNamesEn[14279] = { "Viper Sting", 2 }
ns.spellNamesEn[14280] = { "Viper Sting", 3 }
ns.spellNamesEn[14281] = { "Arcane Shot", 2 }
ns.spellNamesEn[14282] = { "Arcane Shot", 3 }
ns.spellNamesEn[14283] = { "Arcane Shot", 4 }
ns.spellNamesEn[14284] = { "Arcane Shot", 5 }
ns.spellNamesEn[14285] = { "Arcane Shot", 6 }
ns.spellNamesEn[14286] = { "Arcane Shot", 7 }
ns.spellNamesEn[14287] = { "Arcane Shot", 8 }
ns.spellNamesEn[14294] = { "Volley", 2 }
ns.spellNamesEn[14295] = { "Volley", 3 }
ns.spellNamesEn[14296] = { "Black Arrow", 2 }
ns.spellNamesEn[14298] = { "Immolation Trap", 2 }
ns.spellNamesEn[14299] = { "Immolation Trap", 3 }
ns.spellNamesEn[14300] = { "Immolation Trap", 4 }
ns.spellNamesEn[14301] = { "Immolation Trap", 5 }
ns.spellNamesEn[14310] = { "Freezing Trap", 2 }
ns.spellNamesEn[14311] = { "Freezing Trap", 3 }
ns.spellNamesEn[14316] = { "Explosive Trap", 2 }
ns.spellNamesEn[14317] = { "Explosive Trap", 3 }
ns.spellNamesEn[14318] = { "Aspect of the Hawk", 2 }
ns.spellNamesEn[14319] = { "Aspect of the Hawk", 3 }
ns.spellNamesEn[14320] = { "Aspect of the Hawk", 4 }
ns.spellNamesEn[14321] = { "Aspect of the Hawk", 5 }
ns.spellNamesEn[14322] = { "Aspect of the Hawk", 6 }
ns.spellNamesEn[14323] = { "Hunter's Mark", 2 }
ns.spellNamesEn[14324] = { "Hunter's Mark", 3 }
ns.spellNamesEn[14325] = { "Hunter's Mark", 4 }
ns.spellNamesEn[14326] = { "Scare Beast", 2 }
ns.spellNamesEn[14327] = { "Scare Beast", 3 }
ns.spellNamesEn[14752] = { "Divine Spirit", 1 }
ns.spellNamesEn[14818] = { "Divine Spirit", 2 }
ns.spellNamesEn[14819] = { "Divine Spirit", 3 }
ns.spellNamesEn[14914] = { "Holy Fire", 1 }
ns.spellNamesEn[15107] = { "Windwall Totem", 1 }
ns.spellNamesEn[15111] = { "Windwall Totem", 2 }
ns.spellNamesEn[15112] = { "Windwall Totem", 3 }
ns.spellNamesEn[15207] = { "Lightning Bolt", 9 }
ns.spellNamesEn[15208] = { "Lightning Bolt", 10 }
ns.spellNamesEn[15237] = { "Holy Nova", 1 }
ns.spellNamesEn[15261] = { "Holy Fire", 8 }
ns.spellNamesEn[15262] = { "Holy Fire", 2 }
ns.spellNamesEn[15263] = { "Holy Fire", 3 }
ns.spellNamesEn[15264] = { "Holy Fire", 4 }
ns.spellNamesEn[15265] = { "Holy Fire", 5 }
ns.spellNamesEn[15266] = { "Holy Fire", 6 }
ns.spellNamesEn[15267] = { "Holy Fire", 7 }
ns.spellNamesEn[15286] = { "Vampiric Embrace" }
ns.spellNamesEn[15407] = { "Mind Flay", 1 }
ns.spellNamesEn[15430] = { "Holy Nova", 2 }
ns.spellNamesEn[15431] = { "Holy Nova", 3 }
ns.spellNamesEn[15629] = { "Distracting Shot", 3 }
ns.spellNamesEn[15630] = { "Distracting Shot", 4 }
ns.spellNamesEn[15631] = { "Distracting Shot", 5 }
ns.spellNamesEn[15632] = { "Distracting Shot", 6 }
ns.spellNamesEn[16166] = { "Lightning Mastery" }
ns.spellNamesEn[16188] = { "Nature's Swiftness" }
ns.spellNamesEn[16190] = { "Mana Tide Totem", 1 }
ns.spellNamesEn[16314] = { "Rockbiter Weapon", 5 }
ns.spellNamesEn[16315] = { "Rockbiter Weapon", 6 }
ns.spellNamesEn[16316] = { "Rockbiter Weapon", 7 }
ns.spellNamesEn[16339] = { "Flametongue Weapon", 4 }
ns.spellNamesEn[16341] = { "Flametongue Weapon", 5 }
ns.spellNamesEn[16342] = { "Flametongue Weapon", 6 }
ns.spellNamesEn[16355] = { "Frostbrand Weapon", 4 }
ns.spellNamesEn[16356] = { "Frostbrand Weapon", 5 }
ns.spellNamesEn[16362] = { "Windfury Weapon", 4 }
ns.spellNamesEn[16387] = { "Flametongue Totem", 4 }
ns.spellNamesEn[16511] = { "Hemorrhage" }
ns.spellNamesEn[16689] = { "Nature's Grasp", 1 }
ns.spellNamesEn[16810] = { "Nature's Grasp", 2 }
ns.spellNamesEn[16811] = { "Nature's Grasp", 3 }
ns.spellNamesEn[16812] = { "Nature's Grasp", 4 }
ns.spellNamesEn[16813] = { "Nature's Grasp", 5 }
ns.spellNamesEn[16914] = { "Hurricane", 1 }
ns.spellNamesEn[17116] = { "Nature's Swiftness" }
ns.spellNamesEn[17311] = { "Mind Flay", 2 }
ns.spellNamesEn[17312] = { "Mind Flay", 3 }
ns.spellNamesEn[17313] = { "Mind Flay", 4 }
ns.spellNamesEn[17314] = { "Mind Flay", 5 }
ns.spellNamesEn[17329] = { "Nature's Grasp", 6 }
ns.spellNamesEn[17354] = { "Mana Tide Totem", 2 }
ns.spellNamesEn[17359] = { "Mana Tide Totem", 3 }
ns.spellNamesEn[17364] = { "Stormstrike" }
ns.spellNamesEn[17401] = { "Hurricane", 2 }
ns.spellNamesEn[17402] = { "Hurricane", 3 }
ns.spellNamesEn[17727] = { "Create Spellstone", 2 }
ns.spellNamesEn[17728] = { "Create Spellstone", 3 }
ns.spellNamesEn[17877] = { "Shadowburn", 1 }
ns.spellNamesEn[17919] = { "Searing Pain", 2 }
ns.spellNamesEn[17920] = { "Searing Pain", 3 }
ns.spellNamesEn[17921] = { "Searing Pain", 4 }
ns.spellNamesEn[17922] = { "Searing Pain", 5 }
ns.spellNamesEn[17923] = { "Searing Pain", 6 }
ns.spellNamesEn[17924] = { "Soul Fire", 2 }
ns.spellNamesEn[17925] = { "Death Coil", 2 }
ns.spellNamesEn[17926] = { "Death Coil", 3 }
ns.spellNamesEn[17928] = { "Howl of Terror", 2 }
ns.spellNamesEn[17951] = { "Create Firestone", 2 }
ns.spellNamesEn[17952] = { "Create Firestone", 3 }
ns.spellNamesEn[17953] = { "Create Firestone", 4 }
ns.spellNamesEn[17962] = { "Conflagrate", 3 }
ns.spellNamesEn[18265] = { "Siphon Life", 1 }
ns.spellNamesEn[18499] = { "Berserker Rage" }
ns.spellNamesEn[18540] = { "Ritual of Doom" }
ns.spellNamesEn[18562] = { "Swiftmend" }
ns.spellNamesEn[18647] = { "Banish", 2 }
ns.spellNamesEn[18657] = { "Hibernate", 2 }
ns.spellNamesEn[18658] = { "Hibernate", 3 }
ns.spellNamesEn[18807] = { "Mind Flay", 6 }
ns.spellNamesEn[18809] = { "Pyroblast", 8 }
ns.spellNamesEn[18867] = { "Shadowburn", 2 }
ns.spellNamesEn[18868] = { "Shadowburn", 3 }
ns.spellNamesEn[18869] = { "Shadowburn", 4 }
ns.spellNamesEn[18870] = { "Shadowburn", 5 }
ns.spellNamesEn[18871] = { "Shadowburn", 6 }
ns.spellNamesEn[18879] = { "Siphon Life", 2 }
ns.spellNamesEn[18880] = { "Siphon Life", 3 }
ns.spellNamesEn[18881] = { "Siphon Life", 4 }
ns.spellNamesEn[18930] = { "Conflagrate", 4 }
ns.spellNamesEn[18931] = { "Conflagrate", 5 }
ns.spellNamesEn[18932] = { "Conflagrate", 6 }
ns.spellNamesEn[18960] = { "Teleport: Moonglade" }
ns.spellNamesEn[19028] = { "Soul Link" }
ns.spellNamesEn[19236] = { "Desperate Prayer", 2 }
ns.spellNamesEn[19238] = { "Desperate Prayer", 3 }
ns.spellNamesEn[19240] = { "Desperate Prayer", 4 }
ns.spellNamesEn[19241] = { "Desperate Prayer", 5 }
ns.spellNamesEn[19242] = { "Desperate Prayer", 6 }
ns.spellNamesEn[19243] = { "Desperate Prayer", 7 }
ns.spellNamesEn[19261] = { "Touch of Weakness", 2 }
ns.spellNamesEn[19262] = { "Touch of Weakness", 3 }
ns.spellNamesEn[19263] = { "Deterrence" }
ns.spellNamesEn[19264] = { "Touch of Weakness", 4 }
ns.spellNamesEn[19265] = { "Touch of Weakness", 5 }
ns.spellNamesEn[19266] = { "Touch of Weakness", 6 }
ns.spellNamesEn[19271] = { "Feedback", 2 }
ns.spellNamesEn[19273] = { "Feedback", 3 }
ns.spellNamesEn[19274] = { "Feedback", 4 }
ns.spellNamesEn[19275] = { "Feedback", 5 }
ns.spellNamesEn[19276] = { "Devouring Plague", 2 }
ns.spellNamesEn[19277] = { "Devouring Plague", 3 }
ns.spellNamesEn[19278] = { "Devouring Plague", 4 }
ns.spellNamesEn[19279] = { "Devouring Plague", 5 }
ns.spellNamesEn[19280] = { "Devouring Plague", 6 }
ns.spellNamesEn[19281] = { "Hex of Weakness", 2 }
ns.spellNamesEn[19282] = { "Hex of Weakness", 3 }
ns.spellNamesEn[19283] = { "Hex of Weakness", 4 }
ns.spellNamesEn[19284] = { "Hex of Weakness", 5 }
ns.spellNamesEn[19285] = { "Hex of Weakness", 6 }
ns.spellNamesEn[19296] = { "Starshards", 2 }
ns.spellNamesEn[19299] = { "Starshards", 3 }
ns.spellNamesEn[19302] = { "Starshards", 4 }
ns.spellNamesEn[19303] = { "Starshards", 5 }
ns.spellNamesEn[19304] = { "Starshards", 6 }
ns.spellNamesEn[19305] = { "Starshards", 7 }
ns.spellNamesEn[19306] = { "Counterattack", 1 }
ns.spellNamesEn[19308] = { "Shadowguard", 2 }
ns.spellNamesEn[19309] = { "Shadowguard", 3 }
ns.spellNamesEn[19310] = { "Shadowguard", 4 }
ns.spellNamesEn[19311] = { "Shadowguard", 5 }
ns.spellNamesEn[19312] = { "Shadowguard", 6 }
ns.spellNamesEn[19434] = { "Aimed Shot", 1 }
ns.spellNamesEn[19503] = { "Scatter Shot" }
ns.spellNamesEn[19506] = { "Trueshot Aura", 3 }
ns.spellNamesEn[19574] = { "Bestial Wrath" }
ns.spellNamesEn[19577] = { "Intimidation" }
ns.spellNamesEn[19740] = { "Blessing of Might", 1 }
ns.spellNamesEn[19742] = { "Blessing of Wisdom", 1 }
ns.spellNamesEn[19746] = { "Concentration Aura" }
ns.spellNamesEn[19750] = { "Flash of Light", 1 }
ns.spellNamesEn[19752] = { "Divine Intervention" }
ns.spellNamesEn[19801] = { "Tranquilizing Shot" }
ns.spellNamesEn[19834] = { "Blessing of Might", 2 }
ns.spellNamesEn[19835] = { "Blessing of Might", 3 }
ns.spellNamesEn[19836] = { "Blessing of Might", 4 }
ns.spellNamesEn[19837] = { "Blessing of Might", 5 }
ns.spellNamesEn[19838] = { "Blessing of Might", 6 }
ns.spellNamesEn[19850] = { "Blessing of Wisdom", 2 }
ns.spellNamesEn[19852] = { "Blessing of Wisdom", 3 }
ns.spellNamesEn[19853] = { "Blessing of Wisdom", 4 }
ns.spellNamesEn[19854] = { "Blessing of Wisdom", 5 }
ns.spellNamesEn[19876] = { "Shadow Resistance Aura", 1 }
ns.spellNamesEn[19878] = { "Track Demons" }
ns.spellNamesEn[19879] = { "Track Dragonkin" }
ns.spellNamesEn[19880] = { "Track Elementals" }
ns.spellNamesEn[19882] = { "Track Giants" }
ns.spellNamesEn[19883] = { "Track Humanoids" }
ns.spellNamesEn[19884] = { "Track Undead" }
ns.spellNamesEn[19885] = { "Track Hidden" }
ns.spellNamesEn[19888] = { "Frost Resistance Aura", 1 }
ns.spellNamesEn[19891] = { "Fire Resistance Aura", 1 }
ns.spellNamesEn[19895] = { "Shadow Resistance Aura", 2 }
ns.spellNamesEn[19896] = { "Shadow Resistance Aura", 3 }
ns.spellNamesEn[19897] = { "Frost Resistance Aura", 2 }
ns.spellNamesEn[19898] = { "Frost Resistance Aura", 3 }
ns.spellNamesEn[19899] = { "Fire Resistance Aura", 2 }
ns.spellNamesEn[19900] = { "Fire Resistance Aura", 3 }
ns.spellNamesEn[19939] = { "Flash of Light", 2 }
ns.spellNamesEn[19940] = { "Flash of Light", 3 }
ns.spellNamesEn[19941] = { "Flash of Light", 4 }
ns.spellNamesEn[19942] = { "Flash of Light", 5 }
ns.spellNamesEn[19943] = { "Flash of Light", 6 }
ns.spellNamesEn[20043] = { "Aspect of the Wild", 1 }
ns.spellNamesEn[20066] = { "Repentance" }
ns.spellNamesEn[20116] = { "Consecration", 2 }
ns.spellNamesEn[20154] = { "Seal of Righteousness", 1 }
ns.spellNamesEn[20162] = { "Seal of the Crusader", 2 }
ns.spellNamesEn[20163] = { "Seal of Fury", 3 }
ns.spellNamesEn[20164] = { "Seal of Justice" }
ns.spellNamesEn[20165] = { "Seal of Light", 1 }
ns.spellNamesEn[20166] = { "Seal of Wisdom", 1 }
ns.spellNamesEn[20190] = { "Aspect of the Wild", 2 }
ns.spellNamesEn[20217] = { "Blessing of Kings" }
ns.spellNamesEn[20230] = { "Retaliation" }
ns.spellNamesEn[20252] = { "Intercept", 1 }
ns.spellNamesEn[20271] = { "Judgement" }
ns.spellNamesEn[20287] = { "Seal of Righteousness", 2 }
ns.spellNamesEn[20288] = { "Seal of Righteousness", 3 }
ns.spellNamesEn[20289] = { "Seal of Righteousness", 4 }
ns.spellNamesEn[20290] = { "Seal of Righteousness", 5 }
ns.spellNamesEn[20291] = { "Seal of Righteousness", 6 }
ns.spellNamesEn[20292] = { "Seal of Righteousness", 7 }
ns.spellNamesEn[20293] = { "Seal of Righteousness", 8 }
ns.spellNamesEn[20305] = { "Seal of the Crusader", 3 }
ns.spellNamesEn[20306] = { "Seal of the Crusader", 4 }
ns.spellNamesEn[20307] = { "Seal of the Crusader", 5 }
ns.spellNamesEn[20308] = { "Seal of the Crusader", 6 }
ns.spellNamesEn[20347] = { "Seal of Light", 2 }
ns.spellNamesEn[20348] = { "Seal of Light", 3 }
ns.spellNamesEn[20349] = { "Seal of Light", 4 }
ns.spellNamesEn[20356] = { "Seal of Wisdom", 2 }
ns.spellNamesEn[20357] = { "Seal of Wisdom", 3 }
ns.spellNamesEn[20375] = { "Seal of Command", 1 }
ns.spellNamesEn[20419] = { "Seal of Fury", 4 }
ns.spellNamesEn[20421] = { "Seal of Fury", 5 }
ns.spellNamesEn[20422] = { "Seal of Fury", 6 }
ns.spellNamesEn[20423] = { "Seal of Fury", 7 }
ns.spellNamesEn[20473] = { "Holy Shock", 2 }
ns.spellNamesEn[20484] = { "Rebirth", 1 }
ns.spellNamesEn[20559] = { "Mocking Blow", 4 }
ns.spellNamesEn[20560] = { "Mocking Blow", 5 }
ns.spellNamesEn[20569] = { "Cleave", 5 }
ns.spellNamesEn[20609] = { "Ancestral Spirit", 2 }
ns.spellNamesEn[20610] = { "Ancestral Spirit", 3 }
ns.spellNamesEn[20616] = { "Intercept", 2 }
ns.spellNamesEn[20617] = { "Intercept", 3 }
ns.spellNamesEn[20658] = { "Execute", 2 }
ns.spellNamesEn[20660] = { "Execute", 3 }
ns.spellNamesEn[20661] = { "Execute", 4 }
ns.spellNamesEn[20662] = { "Execute", 5 }
ns.spellNamesEn[20729] = { "Blessing of Sacrifice", 2 }
ns.spellNamesEn[20736] = { "Distracting Shot", 1 }
ns.spellNamesEn[20739] = { "Rebirth", 2 }
ns.spellNamesEn[20742] = { "Rebirth", 3 }
ns.spellNamesEn[20747] = { "Rebirth", 4 }
ns.spellNamesEn[20748] = { "Rebirth", 5 }
ns.spellNamesEn[20752] = { "Create Soulstone", 2 }
ns.spellNamesEn[20755] = { "Create Soulstone", 3 }
ns.spellNamesEn[20756] = { "Create Soulstone", 4 }
ns.spellNamesEn[20757] = { "Create Soulstone", 5 }
ns.spellNamesEn[20770] = { "Resurrection", 5 }
ns.spellNamesEn[20772] = { "Redemption", 4 }
ns.spellNamesEn[20773] = { "Redemption", 5 }
ns.spellNamesEn[20776] = { "Ancestral Spirit", 4 }
ns.spellNamesEn[20777] = { "Ancestral Spirit", 5 }
ns.spellNamesEn[20900] = { "Aimed Shot", 2 }
ns.spellNamesEn[20901] = { "Aimed Shot", 3 }
ns.spellNamesEn[20902] = { "Aimed Shot", 4 }
ns.spellNamesEn[20903] = { "Aimed Shot", 5 }
ns.spellNamesEn[20904] = { "Aimed Shot", 6 }
ns.spellNamesEn[20905] = { "Trueshot Aura", 4 }
ns.spellNamesEn[20906] = { "Trueshot Aura", 5 }
ns.spellNamesEn[20909] = { "Counterattack", 3 }
ns.spellNamesEn[20910] = { "Counterattack", 4 }
ns.spellNamesEn[20915] = { "Seal of Command", 2 }
ns.spellNamesEn[20918] = { "Seal of Command", 3 }
ns.spellNamesEn[20919] = { "Seal of Command", 4 }
ns.spellNamesEn[20920] = { "Seal of Command", 5 }
ns.spellNamesEn[20922] = { "Consecration", 3 }
ns.spellNamesEn[20923] = { "Consecration", 4 }
ns.spellNamesEn[20924] = { "Consecration", 5 }
ns.spellNamesEn[20925] = { "Holy Shield", 1 }
ns.spellNamesEn[20927] = { "Holy Shield", 2 }
ns.spellNamesEn[20928] = { "Holy Shield", 3 }
ns.spellNamesEn[20929] = { "Holy Shock", 3 }
ns.spellNamesEn[20930] = { "Holy Shock", 4 }
ns.spellNamesEn[21082] = { "Seal of the Crusader", 1 }
ns.spellNamesEn[21169] = { "Reincarnation" }
ns.spellNamesEn[21551] = { "Mortal Strike", 2 }
ns.spellNamesEn[21552] = { "Mortal Strike", 3 }
ns.spellNamesEn[21553] = { "Mortal Strike", 4 }
ns.spellNamesEn[21562] = { "Prayer of Fortitude", 1 }
ns.spellNamesEn[21564] = { "Prayer of Fortitude", 2 }
ns.spellNamesEn[21849] = { "Gift of the Wild", 1 }
ns.spellNamesEn[21850] = { "Gift of the Wild", 2 }
ns.spellNamesEn[22568] = { "Ferocious Bite", 2 }
ns.spellNamesEn[22782] = { "Mage Armor", 2 }
ns.spellNamesEn[22783] = { "Mage Armor", 3 }
ns.spellNamesEn[22812] = { "Barkskin" }
ns.spellNamesEn[22827] = { "Ferocious Bite", 3 }
ns.spellNamesEn[22828] = { "Ferocious Bite", 4 }
ns.spellNamesEn[22829] = { "Ferocious Bite", 5 }
ns.spellNamesEn[22842] = { "Frenzied Regeneration" }
ns.spellNamesEn[23028] = { "Arcane Brilliance" }
ns.spellNamesEn[23881] = { "Bloodthirst", 1 }
ns.spellNamesEn[23892] = { "Bloodthirst", 2 }
ns.spellNamesEn[23893] = { "Bloodthirst", 3 }
ns.spellNamesEn[23894] = { "Bloodthirst", 4 }
ns.spellNamesEn[23922] = { "Shield Slam", 1 }
ns.spellNamesEn[23923] = { "Shield Slam", 2 }
ns.spellNamesEn[23924] = { "Shield Slam", 3 }
ns.spellNamesEn[23925] = { "Shield Slam", 4 }
ns.spellNamesEn[24118] = { "Lacerate", 1 }
ns.spellNamesEn[24119] = { "Lacerate", 2 }
ns.spellNamesEn[24120] = { "Lacerate", 3 }
ns.spellNamesEn[24239] = { "Hammer of Wrath", 3 }
ns.spellNamesEn[24274] = { "Hammer of Wrath", 2 }
ns.spellNamesEn[24275] = { "Hammer of Wrath", 1 }
ns.spellNamesEn[24406] = { "Improved Mend Pet" }
ns.spellNamesEn[24858] = { "Moonkin Form" }
ns.spellNamesEn[24974] = { "Insect Swarm", 2 }
ns.spellNamesEn[24975] = { "Insect Swarm", 3 }
ns.spellNamesEn[24976] = { "Insect Swarm", 4 }
ns.spellNamesEn[24977] = { "Insect Swarm", 5 }
ns.spellNamesEn[25286] = { "Heroic Strike", 9 }
ns.spellNamesEn[25288] = { "Revenge", 6 }
ns.spellNamesEn[25289] = { "Battle Shout", 7 }
ns.spellNamesEn[25290] = { "Blessing of Wisdom", 6 }
ns.spellNamesEn[25291] = { "Blessing of Might", 7 }
ns.spellNamesEn[25292] = { "Holy Light", 9 }
ns.spellNamesEn[25295] = { "Serpent Sting", 9 }
ns.spellNamesEn[25296] = { "Aspect of the Hawk", 7 }
ns.spellNamesEn[25297] = { "Healing Touch", 11 }
ns.spellNamesEn[25298] = { "Starfire", 7 }
ns.spellNamesEn[25299] = { "Rejuvenation", 11 }
ns.spellNamesEn[25300] = { "Backstab", 9 }
ns.spellNamesEn[25302] = { "Feint", 5 }
ns.spellNamesEn[25304] = { "Frostbolt", 11 }
ns.spellNamesEn[25306] = { "Fireball", 12 }
ns.spellNamesEn[25307] = { "Shadow Bolt", 10 }
ns.spellNamesEn[25309] = { "Immolate", 8 }
ns.spellNamesEn[25311] = { "Corruption", 7 }
ns.spellNamesEn[25314] = { "Greater Heal", 5 }
ns.spellNamesEn[25315] = { "Renew", 10 }
ns.spellNamesEn[25316] = { "Prayer of Healing", 5 }
ns.spellNamesEn[25345] = { "Arcane Missiles", 8 }
ns.spellNamesEn[25357] = { "Healing Wave", 10 }
ns.spellNamesEn[25359] = { "Grace of Air Totem", 3 }
ns.spellNamesEn[25361] = { "Strength of Earth Totem", 5 }
ns.spellNamesEn[25780] = { "Righteous Fury" }
ns.spellNamesEn[25782] = { "Greater Blessing of Might", 1 }
ns.spellNamesEn[25894] = { "Greater Blessing of Wisdom", 1 }
ns.spellNamesEn[25898] = { "Greater Blessing of Kings" }
ns.spellNamesEn[25916] = { "Greater Blessing of Might", 2 }
ns.spellNamesEn[25918] = { "Greater Blessing of Wisdom", 2 }
ns.spellNamesEn[26573] = { "Consecration", 1 }
ns.spellNamesEn[27681] = { "Prayer of Spirit", 1 }
ns.spellNamesEn[27683] = { "Prayer of Shadow Protection" }
ns.spellNamesEn[27799] = { "Holy Nova", 4 }
ns.spellNamesEn[27800] = { "Holy Nova", 5 }
ns.spellNamesEn[27801] = { "Holy Nova", 6 }
ns.spellNamesEn[27841] = { "Divine Spirit", 4 }
ns.spellNamesEn[27870] = { "Lightwell", 2 }
ns.spellNamesEn[27871] = { "Lightwell", 3 }
ns.spellNamesEn[28270] = { "Polymorph: Cow" }
ns.spellNamesEn[28271] = { "Polymorph" }
ns.spellNamesEn[28377] = { "Shadowguard", 1 }
ns.spellNamesEn[28609] = { "Frost Ward", 5 }
ns.spellNamesEn[28610] = { "Shadow Ward", 4 }
ns.spellNamesEn[28612] = { "Conjure Food", 7 }
ns.spellNamesEn[29166] = { "Innervate" }
ns.spellNamesEn[29228] = { "Flame Shock", 6 }
ns.spellNamesEn[31016] = { "Eviscerate", 9 }
ns.spellNamesEn[31018] = { "Ferocious Bite", 6 }
ns.spellNamesEn[36936] = { "Totemic Recall" }
ns.spellNamesEn[66842] = { "Call of the Elements" }
ns.spellNamesEn[66843] = { "Call of the Ancestors" }
ns.spellNamesEn[66844] = { "Call of the Spirits" }
ns.spellNamesEn[399956] = { "Mutilate", 1 }
ns.spellNamesEn[400574] = { "Arcane Blast", 1 }
ns.spellNamesEn[400640] = { "Ice Lance", 2 }
ns.spellNamesEn[401502] = { "Frostfire Bolt", 1 }
ns.spellNamesEn[401859] = { "Prayer of Mending", 1 }
ns.spellNamesEn[401977] = { "Shadowfiend" }
ns.spellNamesEn[402174] = { "Penance", 1 }
ns.spellNamesEn[402927] = { "Victory Rush" }
ns.spellNamesEn[407632] = { "Hammer of the Righteous" }
ns.spellNamesEn[407995] = { "Primal Bite", 1 }
ns.spellNamesEn[408120] = { "Wild Growth", 1 }
ns.spellNamesEn[408341] = { "Fire Nova", 1 }
ns.spellNamesEn[408342] = { "Fire Nova", 2 }
ns.spellNamesEn[408343] = { "Fire Nova", 3 }
ns.spellNamesEn[408344] = { "Fire Nova", 4 }
ns.spellNamesEn[408345] = { "Fire Nova", 5 }
ns.spellNamesEn[408521] = { "Riptide", 1 }
ns.spellNamesEn[409580] = { "Heart of the Lion" }
ns.spellNamesEn[412758] = { "Incinerate", 1 }
ns.spellNamesEn[414644] = { "Lacerate", 3 }
ns.spellNamesEn[415423] = { "Aspect of the Viper" }
ns.spellNamesEn[425336] = { "Rage of the Farseer" }
ns.spellNamesEn[437009] = { "Totemic Call" }
ns.spellNamesEn[437138] = { "Revive", 1 }
ns.spellNamesEn[437169] = { "Portal of Summoning" }
ns.spellNamesEn[438040] = { "Redirect" }
ns.spellNamesEn[440892] = { "Curse of the Elements", 1 }
ns.spellNamesEn[468766] = { "Conjure Water", 8 }
ns.spellNamesEn[469145] = { "Aspect of the Falcon" }
ns.spellNamesEn[1221404] = { "Enchanted Flare" }
ns.spellNamesEn[1225228] = { "Bane of Havoc" }
ns.spellNamesEn[1235826] = { "Lacerate", 4 }
ns.spellNamesEn[1235827] = { "Lacerate", 5 }
ns.spellNamesEn[1237312] = { "Frostfire Bolt", 2 }
ns.spellNamesEn[1237313] = { "Frostfire Bolt", 3 }
ns.spellNamesEn[1237948] = { "Revive", 2 }
ns.spellNamesEn[1237949] = { "Revive", 3 }
ns.spellNamesEn[1237950] = { "Revive", 4 }
ns.spellNamesEn[1237951] = { "Revive", 5 }
ns.spellNamesEn[1238069] = { "Primal Bite", 2 }
ns.spellNamesEn[1238070] = { "Primal Bite", 3 }
ns.spellNamesEn[1238122] = { "Feral Charge" }
ns.spellNamesEn[1238214] = { "Wild Growth", 2 }
ns.spellNamesEn[1238215] = { "Wild Growth", 3 }
ns.spellNamesEn[1239242] = { "Riptide", 2 }
ns.spellNamesEn[1239243] = { "Riptide", 3 }
ns.spellNamesEn[1239570] = { "Holy Shield", 4 }
ns.spellNamesEn[1239696] = { "Arcane Blast", 2 }
ns.spellNamesEn[1239697] = { "Arcane Blast", 3 }
ns.spellNamesEn[1239699] = { "Arcane Blast", 4 }
ns.spellNamesEn[1239700] = { "Arcane Blast", 5 }
ns.spellNamesEn[1240044] = { "Ice Lance", 3 }
ns.spellNamesEn[1240045] = { "Ice Lance", 4 }
ns.spellNamesEn[1240046] = { "Ice Lance", 5 }
ns.spellNamesEn[1240047] = { "Ice Lance", 6 }
ns.spellNamesEn[1240193] = { "Slam", 1 }
ns.spellNamesEn[1240720] = { "Penance", 2 }
ns.spellNamesEn[1240721] = { "Penance", 3 }
ns.spellNamesEn[1240826] = { "Prayer of Mending", 2 }
ns.spellNamesEn[1240827] = { "Prayer of Mending", 3 }
ns.spellNamesEn[1241582] = { "Mutilate", 2 }
ns.spellNamesEn[1241584] = { "Mutilate", 3 }
ns.spellNamesEn[1242634] = { "Counterattack", 2 }
ns.spellNamesEn[1277324] = { "Dark Sacrifice", 1 }
ns.spellNamesEn[1277325] = { "Dark Sacrifice", 2 }
ns.spellNamesEn[1277326] = { "Dark Sacrifice", 3 }
ns.spellNamesEn[1277327] = { "Dark Sacrifice", 4 }
ns.spellNamesEn[1277328] = { "Dark Sacrifice", 5 }
ns.spellNamesEn[1277331] = { "Chastise", 1 }
ns.spellNamesEn[1277332] = { "Chastise", 2 }
ns.spellNamesEn[1277333] = { "Chastise", 3 }
ns.spellNamesEn[1277334] = { "Chastise", 4 }
ns.spellNamesEn[1277335] = { "Chastise", 5 }
ns.spellNamesEn[1277370] = { "Divine Grace", 1 }
ns.spellNamesEn[1277371] = { "Divine Grace", 2 }
ns.spellNamesEn[1277372] = { "Divine Grace", 3 }
ns.spellNamesEn[1277374] = { "Divine Grace", 4 }
ns.spellNamesEn[1277376] = { "Divine Grace", 5 }
ns.spellNamesEn[1277377] = { "Divine Grace", 6 }
ns.spellNamesEn[1277378] = { "Divine Grace", 7 }
ns.spellNamesEn[1277455] = { "Confounding Flash" }
ns.spellNamesEn[1277462] = { "Contingency Plan", 1 }
ns.spellNamesEn[1277634] = { "Contingency Plan", 2 }
ns.spellNamesEn[1277638] = { "Contingency Plan", 3 }
ns.spellNamesEn[1277639] = { "Contingency Plan", 4 }
ns.spellNamesEn[1277640] = { "Contingency Plan", 5 }
ns.spellNamesEn[1293241] = { "Summon Hawk", 1 }
ns.spellNamesEn[1293525] = { "Summon Hawk", 2 }
ns.spellNamesEn[1293526] = { "Summon Hawk", 3 }
ns.spellNamesEn[1293527] = { "Summon Hawk", 4 }
ns.spellNamesEn[1293812] = { "Incinerate", 2 }
ns.spellNamesEn[1293813] = { "Incinerate", 3 }
ns.spellNamesEn[1293817] = { "Conflagrate", 1 }
ns.spellNamesEn[1293818] = { "Conflagrate", 2 }
ns.spellNamesEn[1297659] = { "Teleport: Dalaran" }
ns.spellNamesEn[1299332] = { "Lacerate", 4 }
ns.spellNamesEn[1299346] = { "Trueshot Aura", 1 }
ns.spellNamesEn[1299348] = { "Trueshot Aura", 2 }
ns.spellNamesEn[1299445] = { "Aspect of the Beast", 2 }
ns.spellNamesEn[1299446] = { "Aspect of the Beast", 3 }
ns.spellNamesEn[1299447] = { "Aspect of the Beast", 4 }
ns.spellNamesEn[1309595] = { "Shadow Word: Death", 1 }
ns.spellNamesEn[1309633] = { "Shadow Word: Death", 2 }
ns.spellNamesEn[1309635] = { "Shadow Word: Death", 3 }
ns.spellNamesEn[1309636] = { "Shadow Word: Death", 4 }
ns.spellNamesEn[1310222] = { "Spearing Strike" }
ns.spellNamesEn[1310687] = { "Sniper Shot", 1 }
ns.spellNamesEn[1310785] = { "Sniper Shot", 2 }
ns.spellNamesEn[1310786] = { "Sniper Shot", 3 }
ns.spellNamesEn[1310897] = { "Voice of Truth" }
ns.spellNamesEn[1310911] = { "Light's Vigil", 1 }
ns.spellNamesEn[1310994] = { "Swift Judgement" }
ns.spellNamesEn[1311590] = { "Light's Vigil", 2 }
ns.spellNamesEn[1311595] = { "Light's Vigil", 3 }
ns.spellNamesEn[1311606] = { "Holy Shock", 1 }
ns.spellNamesEn[1311649] = { "Seal of Fury", 1 }
ns.spellNamesEn[1311656] = { "Seal of Fury", 2 }
ns.spellNamesEn[1311676] = { "Curse of the Elements", 2 }
ns.spellNamesEn[1311677] = { "Curse of the Elements", 3 }
ns.spellNamesEn[1311680] = { "Curse of the Elements", 4 }
ns.spellNamesEn[1312002] = { "Ice Lance", 1 }
ns.spellNamesEn[1316697] = { "Wrack", 1 }
ns.spellNamesEn[1316709] = { "Death Mark", 1 }
ns.spellNamesEn[1316995] = { "Penance", 4 }
ns.spellNamesEn[1317257] = { "Strider Kick" }
ns.spellNamesEn[1325256] = { "Mana Tide Totem", 4 }
ns.spellNamesEn[1325756] = { "Death Mark", 2 }
ns.spellNamesEn[1325757] = { "Death Mark", 3 }
ns.spellNamesEn[1325758] = { "Death Mark", 4 }
ns.spellNamesEn[1326079] = { "Arcane Wrath", 1 }
ns.spellNamesEn[1326080] = { "Arcane Wrath", 2 }
ns.spellNamesEn[1326081] = { "Arcane Wrath", 3 }
ns.spellNamesEn[1326082] = { "Arcane Wrath", 4 }
ns.spellNamesEn[1328616] = { "Lacerate", 2 }
ns.spellNamesEn[1328617] = { "Lacerate", 1 }
ns.spellNamesEn[1328618] = { "Ferocious Bite", 1 }
ns.spellNamesEn[1329283] = { "Shank" }

-- Contenus propres à Forever (content/traductions-forever-en.ts) : nom affiché par le client français → nom anglais.
ns.traductionsEn = ns.traductionsEn or {}
