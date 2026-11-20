/**
 * Version anglaise des fiches de zones, de donjons et des Skyborne (content/monde.ts) et des repères de référence
 * (content/reference.ts). Mêmes faits, mêmes chiffres : une fiche modifiée en français se reporte ici.
 * Les informations non confirmées restent entre crochets.
 */

export interface ZoneEn {
  /** Adresse anglaise : /en/zones/<slug>/. */
  slug: string;
  nom: string;
  continent: string;
  niveau: string;
  statut: string;
  acces: string;
  resume: string;
  paragraphes: string[];
  activites: { titre: string; texte: string }[];
  fiabilite: string;
}

/** Par slug français de la zone. */
export const ZONES_EN: Record<string, ZoneEn> = {
  "mont-hyjal": {
    slug: "mount-hyjal", nom: "Mount Hyjal", continent: "Kalimdor", niveau: "60", statut: "Contested",
    acces: "From southern Winterspring, through Darkwhisper Gorge",
    resume: "Kalimdor's sacred mountain finally opens to players of original Azeroth. A zone built for characters who have reached the level cap.",
    paragraphes: [
      "Mount Hyjal is one of the four zones added by Forever, along with Riverglades, Zephras Isle and Shen'dralas. Unlike the other three, it is not a leveling zone: it comes with the endgame content, alongside dungeons and raids.",
      "Mount Hyjal is reached from southern Winterspring. The mountain is healing after Archimonde's fall; its quests are aimed at level 60 characters, and two raids open there on 9 December. Jobwow's own account will come once his characters climb up there.",
    ],
    activites: [
      { titre: "Quests", texte: "[Main quest chains and rewards: to be recorded in game.]" },
      { titre: "Reputation", texte: "[Faction tied to the zone, if any: to be confirmed.]" },
      { titre: "Raids", texte: "Hyjal Summit (20 players, 13 bosses), near Nordrassil, opens on 9 December 2026, along with Barrow Deeps (10 players, 8 bosses), which has an entrance on the mountain, and Onyxia's Lair (40 players)." },
    ],
    fiabilite: "Continent and status recorded during the beta. Level, access and raids from Blizzard and specialist press (Icy Veins, Warcraft Tavern).",
  },
  "rives-claires": {
    slug: "riverglades", nom: "Riverglades", continent: "Eastern Kingdoms (game map)", niveau: "35 to 45", statut: "[To be confirmed]",
    acces: "North of Redridge Mountains: turn right just before Burning Steppes",
    resume: "A new Forever leveling zone for levels 35 to 45, between Redridge Mountains and Burning Steppes.",
    paragraphes: [
      "Riverglades is one of the four zones added by Forever. It lies between Redridge Mountains and Burning Steppes and holds more than 150 quests.",
      "The zone is home to Krol'dok Stronghold, an open-air ogre fortress and one of the nine new dungeons (levels 40 to 45).",
    ],
    activites: [
      { titre: "Quests", texte: "[Main quest chains and rewards: to be recorded in game.]" },
      { titre: "Dungeon", texte: "Krol'dok Stronghold, levels 40 to 45." },
    ],
    fiabilite: "Levels and access from specialist press (Icy Veins, eXputer); dungeon from Blizzard.",
  },
  "ile-de-zephras": {
    slug: "zephras-isle", nom: "Zephras Isle", continent: "Island away from the continents (game map)", niveau: "1 to 12", statut: "One version per faction",
    acces: "Skyborne starting zone",
    resume: "Homeland of the Skyborne: they all begin their adventure here, in the village of Thendal.",
    paragraphes: [
      "Zephras Isle is the homeland of the Skyborne. Each faction has its own version of the zone.",
      "Zephras floats in the Elemental Plane of Air and is coming apart: its wind spirits have vanished and its pylons are failing one by one. Skyborne spend their first twelve levels there, then reach Stormwind or Orgrimmar by way of Dalaran. Neither Jobwow nor Jobwow TheSham has set foot there yet.",
      "No quest is required to leave the island: at the Valanaar docks, in the south, take the crossing to Dalaran, then a portal to Stormwind (Alliance) or Orgrimmar (Horde).",
    ],
    activites: [{ titre: "Starting quests", texte: "[To be recorded in game.]" }],
    fiabilite: "Information recorded during the beta; levels from Blizzard; leaving the island from Blizzard Watch.",
  },
  shendralar: {
    slug: "shendralar", nom: "Shen'dralas", continent: "Kalimdor (game map)", niveau: "Still uncertain", statut: "Contested",
    acces: "Between Mulgore and Desolace",
    resume: "Forever's fourth new zone, land of the Shen'dralar, between Mulgore and Desolace.",
    paragraphes: [
      "Shen'dralas tells the story of the Shen'dralar, Highborne tied to Eldre'Thalas and Dire Maul, and continues that of the Gelkis and Magram centaurs.",
      "Its quests also lead to Maraudon and Razorfen Downs. Published level ranges do not agree yet (40 to 45 for some, 45 to 53 for others): to be checked in game.",
    ],
    activites: [{ titre: "Quests", texte: "[Main quest chains and rewards: to be recorded in game.]" }],
    fiabilite: "Location and story from Blizzard; status and dungeon quests from specialist press (Icy Veins); levels still uncertain.",
  },
};

/** Nouveaux donjons : par slug français, adresse anglaise /en/dungeons/<slug>/, emplacement et résumé (annonce de Blizzard). */
export const DONJONS_TEXTE_EN: Record<string, { slug: string; zone: string; resume: (niveau: number, max: number) => string }> = {
  "salle-des-thanes": { slug: "hall-of-thanes", zone: "Beneath Ironforge, Dun Morogh", resume: (n, m) => `A dwarven dungeon dug beneath Ironforge, for levels ${n} to ${m}.` },
  "ruines-de-lordaeron": { slug: "ruins-of-lordaeron", zone: "Ruins above the Undercity, Tirisfal Glades", resume: (n, m) => `The ruins above the Undercity, for levels ${n} to ${m}.` },
  "excavations-les-paluns": { slug: "excavation-site-wetlands", zone: "Above Whelgar's Excavation Site, Wetlands", resume: (n, m) => `A dig site above Whelgar's Excavation, for levels ${n} to ${m}.` },
  "cite-de-dalaran": { slug: "city-of-dalaran", zone: "Alterac Mountains", resume: (n, m) => `The city of mages, its barrier down, not yet under the Kirin Tor's control; you enter through the sewers, for levels ${n} to ${m}.` },
  "cite-submergee": { slug: "the-drowned-city", zone: "Off the coast of Stranglethorn Vale", resume: (n, m) => `An ancient troll ruin risen from the sea, open to the sky; the rain builds into a storm before the final fight. Levels ${n} to ${m}.` },
  "bastion-kroldok": { slug: "kroldok-stronghold", zone: "Riverglades", resume: (n, m) => `An open-air ogre fortress of workshops and camps, behind kidnappings and strange chanting at night. Levels ${n} to ${m}.` },
  "prison-d-alcaz": { slug: "alcaz-prison", zone: "Alcaz Island, Dustwallow Marsh", resume: (n, m) => `The mysterious island finally becomes a dungeon: the Defias and naga fight inside. Levels ${n} to ${m}.` },
  "repaire-des-noiregueules": { slug: "blackmaw-hold", zone: "Azshara, behind the northern furbolg gates", resume: (n, m) => `A great furbolg city threatened by corruption; its tunnels lead towards Barrow Deeps. Levels ${n} to ${m}.` },
  "terrasse-du-faconneur": { slug: "shapers-terrace", zone: "Northern hills of Un'Goro Crater", resume: (n, m) => `The end-of-journey dungeon, tied to the titans, in Un'Goro Crater. Levels ${n} to ${m}.` },
};

export const NOTE_DONJONS_EN = "Names, levels and locations from Blizzard's announcement (September 2026); to be confirmed in game.";

export const SKYBORNE_EN = {
  nom: "The Skyborne",
  resume: "Elves who came from the sky, the only race in Forever that can join either the Alliance or the Horde. The French version also calls them Éolides.",
  origine: [
    "The Skyborne descend from an ancient line of elves who took refuge for millennia in the sky realms of the air elementals. Cut off from the world, they took up the magic of the winds.",
    "Their homeland is Zephras Isle, one of Forever's new zones. Every Skyborne begins the adventure there, in the village of Thendal, each faction in its own version of the zone.",
  ],
  ordres: {
    Alliance: { nom: "High Order", texte: "Devoted to rediscovering lost arcane knowledge." },
    Horde: { nom: "Windshapers", texte: "Spiritual guides of their people, closest to the elementals." },
  } as Record<string, { nom: string; texte: string }>,
  acces: [
    "The race is not included with the subscription alone. It is unlocked with one of Forever's higher editions: the heroic pack, the epic pack, the Warcraft Forever collection or the collector's edition.",
    "Without one of them, you cannot create a Skyborne character. The other races remain available with the subscription.",
  ],
  avis: "[Your view as a player: which faction, which class, and is the edition worth the money for this race alone?]",
  sources: [
    "Blizzard Entertainment — presentation of World of Warcraft: Forever and its editions",
    "Warcraft Tavern — Skyborne race page",
    "Gamewave — origins, classes and abilities of the Éolides",
  ],
};

// ---------------------------------------------------------------- Repères (content/reference.ts)

/** Lieux de départ de chaque race (nom français des repères → nom anglais du jeu). */
export const LIEUX_DEPART_EN: Record<string, string> = {
  "Vallée de Northshire": "Northshire Valley",
  "Vallée de Frigecrête (Coldridge Valley) [nom français à vérifier]": "Coldridge Valley",
  "Sombrevallon (Shadowglen)": "Shadowglen",
  "Vallée des Épreuves": "Valley of Trials",
  "Camp Narache": "Camp Narache",
  "Le Glas (Deathknell)": "Deathknell",
  "Village de Thendal": "Thendal Village",
};

/** Zones et repères qui n'ont pas leur propre carte dans le jeu. */
export const ZONES_HORS_CARTE_EN: Record<string, string> = {
  "Mont Rochenoire": "Blackrock Mountain",
  "Île de Zéphras (une version par faction)": "Zephras Isle (one version per faction)",
  "Valanaar (île de Zéphras)": "Valanaar (Zephras Isle)",
  "Shen'dralas": "Shen'dralas",
  "[À confirmer]": "[To be confirmed]",
};

/** Noms anglais des raids propres à Forever (nom français de Blizzard → nom anglais). */
export const RAIDS_FOREVER_EN: Record<string, string> = {
  "Sommet d'Hyjal": "Hyjal Summit",
  "Les profondeurs des Saisons": "Barrow Deeps",
};

/** Statut des raids. */
export const STATUTS_RAIDS_EN: Record<string, string> = {
  "Annoncé dans Forever, ouverture le 9 décembre 2026": "Announced in Forever, opening on 9 December 2026",
  "Présence dans Forever non confirmée": "Presence in Forever not confirmed",
};
