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
    acces: "[Entry point to be confirmed]",
    resume: "Kalimdor's sacred mountain finally opens to players of original Azeroth. A zone built for characters who have reached the level cap.",
    paragraphes: [
      "Mount Hyjal is one of the four zones added by Forever, along with Riverglades, Zephras Isle and Shen'dralar. Unlike the other three, it is not a leveling zone: it comes with the endgame content, alongside dungeons and raids.",
      "[Jobwow's account of a first visit: atmosphere, first quests, enemies met.]",
    ],
    activites: [
      { titre: "Quests", texte: "[Main quest chains and rewards: to be recorded in game.]" },
      { titre: "Reputation", texte: "[Faction tied to the zone, if any: to be confirmed.]" },
      { titre: "Raid", texte: "A 20-player raid bears the name of the summit. Opening announced for December, date to be confirmed." },
    ],
    fiabilite: "Continent and status recorded during the beta. Level and raid from the roadmap published by Blizzard. Page reviewed when the servers open.",
  },
  "rives-claires": {
    slug: "riverglades", nom: "Riverglades", continent: "Eastern Kingdoms (game map)", niveau: "About 35 to 45", statut: "[To be confirmed]",
    acces: "[To be confirmed]",
    resume: "A new Forever leveling zone, for characters in the middle of their journey.",
    paragraphes: ["Riverglades is one of the four zones added by Forever. This page will be completed as soon as the servers open."],
    activites: [{ titre: "Quests", texte: "[To be recorded in game.]" }],
    fiabilite: "Level range recorded during the beta, subject to change.",
  },
  "ile-de-zephras": {
    slug: "zephras-isle", nom: "Zephras Isle", continent: "Island away from the continents (game map)", niveau: "Starting zone", statut: "One version per faction",
    acces: "Skyborne starting zone",
    resume: "Homeland of the Skyborne: they all begin their adventure here, in the village of Thendal.",
    paragraphes: [
      "Zephras Isle is the homeland of the Skyborne. Each faction has its own version of the zone.",
      "[Jobwow's account of discovering the island.]",
    ],
    activites: [{ titre: "Starting quests", texte: "[To be recorded in game.]" }],
    fiabilite: "Information recorded during the beta.",
  },
  shendralar: {
    slug: "shendralar", nom: "Shen'dralar", continent: "Kalimdor (game map)", niveau: "Still uncertain", statut: "[To be confirmed]",
    acces: "[To be confirmed]",
    resume: "Forever's fourth new zone, whose levels remain uncertain.",
    paragraphes: ["This page will be completed as soon as Blizzard or the first players say more."],
    activites: [{ titre: "Quests", texte: "[To be recorded in game.]" }],
    fiabilite: "Levels still uncertain.",
  },
};

/** Nouveaux donjons : par slug français, adresse anglaise /en/dungeons/<slug>/. */
export const DONJONS_TEXTE_EN: Record<string, { slug: string; resume: (niveau: number) => string }> = {
  "salle-des-thanes": { slug: "hall-of-thanes", resume: (n) => `New dungeon spotted in the beta, open from level ${n}.` },
  "ruines-de-lordaeron": { slug: "ruins-of-lordaeron", resume: (n) => `New dungeon spotted in the beta, open from level ${n}.` },
  "excavations-les-paluns": { slug: "excavation-site-wetlands", resume: (n) => `New dungeon spotted in the beta, open from level ${n}.` },
  "cite-de-dalaran": { slug: "city-of-dalaran", resume: (n) => `New dungeon spotted in the beta, open from level ${n}.` },
};

export const NOTE_DONJONS_EN = "Recorded in beta version 1.60.1. Levels may still change at launch.";

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
  "Shen'dralar": "Shen'dralar",
  "[À confirmer]": "[To be confirmed]",
};

/** Statut des raids. */
export const STATUTS_RAIDS_EN: Record<string, string> = {
  "Annoncé dans Forever, ouverture prévue en décembre (date à confirmer)": "Announced in Forever, opening planned for December (date to be confirmed)",
  "Présence dans Forever non confirmée": "Presence in Forever not confirmed",
};
