/** Fiches de race, zones et donjons. */

export interface Zone {
  slug: string;
  nom: string;
  nouvelle: boolean;
  continent: string;
  niveau: string;
  statut: string;
  acces: string;
  resume: string;
  paragraphes: string[];
  activites: { titre: string; texte: string }[];
  fiabilite: string;
  misAJour: string;
}

export const ZONES: Zone[] = [
  {
    slug: "mont-hyjal", nom: "Mont Hyjal", nouvelle: true, continent: "Kalimdor", niveau: "60", statut: "Contestée",
    acces: "[Point d'entrée à confirmer]",
    resume: "La montagne sacrée de Kalimdor s'ouvre enfin aux joueurs de l'Azeroth d'origine. Une zone pensée pour les personnages arrivés au niveau maximal.",
    paragraphes: [
      "Mont Hyjal fait partie des quatre zones ajoutées par Forever, avec les Rives Claires, l'île de Zéphras et Shen'dralar. Contrairement aux trois autres, elle ne sert pas à monter de niveau : elle accompagne le contenu de fin de jeu, aux côtés des donjons et des raids.",
      "[Récit de la première visite de Silfax : ambiance, premières quêtes, ennemis rencontrés.]",
    ],
    activites: [
      { titre: "Quêtes", texte: "[Chaînes de quêtes principales et récompenses : à relever en jeu.]" },
      { titre: "Réputation", texte: "[Faction liée à la zone, s'il y en a une : à confirmer.]" },
      { titre: "Raid", texte: "Un raid à 20 joueurs porte le nom du sommet. Ouverture annoncée pour décembre, date à confirmer." },
    ],
    fiabilite: "Continent et statut relevés pendant la bêta. Niveau et raid d'après la feuille de route publiée par Blizzard. Fiche revue à l'ouverture des serveurs.",
    misAJour: "2026-10-31",
  },
  {
    slug: "rives-claires", nom: "Rives Claires", nouvelle: true, continent: "[À confirmer]", niveau: "Environ 35 à 45", statut: "[À confirmer]",
    acces: "[À confirmer]",
    resume: "Nouvelle zone de progression de Forever, pour les personnages de milieu de parcours.",
    paragraphes: ["Les Rives Claires font partie des quatre zones ajoutées par Forever. Fiche complétée dès l'ouverture des serveurs."],
    activites: [{ titre: "Quêtes", texte: "[À relever en jeu.]" }],
    fiabilite: "Fourchette de niveaux relevée pendant la bêta, susceptible d'évoluer.",
    misAJour: "2026-10-31",
  },
  {
    slug: "ile-de-zephras", nom: "Île de Zéphras", nouvelle: true, continent: "[À confirmer]", niveau: "Zone de départ", statut: "Une version par faction",
    acces: "Zone de départ des Skyborne",
    resume: "Terre natale des Skyborne : tous y commencent leur aventure, au village de Thendal.",
    paragraphes: [
      "L'île de Zéphras est la terre natale des Skyborne. Chaque faction y dispose de sa propre version de la zone.",
      "[Récit de la découverte de l'île par Silfax.]",
    ],
    activites: [{ titre: "Quêtes de départ", texte: "[À relever en jeu.]" }],
    fiabilite: "Informations relevées pendant la bêta.",
    misAJour: "2026-10-31",
  },
  {
    slug: "shendralar", nom: "Shen'dralar", nouvelle: true, continent: "[À confirmer]", niveau: "Encore incertain", statut: "[À confirmer]",
    acces: "[À confirmer]",
    resume: "La quatrième nouvelle zone de Forever, dont les niveaux restent incertains.",
    paragraphes: ["Fiche complétée dès que Blizzard ou les premiers joueurs en diront plus."],
    activites: [{ titre: "Quêtes", texte: "[À relever en jeu.]" }],
    fiabilite: "Niveaux encore incertains.",
    misAJour: "2026-10-31",
  },
];

export interface Donjon {
  slug: string;
  nom: string;
  niveau: number;
  resume: string;
}

export const DONJONS: Donjon[] = [
  { slug: "salle-des-thanes", nom: "La salle des Thanes", niveau: 13, resume: "Nouveau donjon repéré en bêta, accessible dès le niveau 13." },
  { slug: "ruines-de-lordaeron", nom: "Ruines de Lordaeron", niveau: 15, resume: "Nouveau donjon repéré en bêta, accessible dès le niveau 15." },
  { slug: "excavations-les-paluns", nom: "Excavations : les Paluns", niveau: 26, resume: "Nouveau donjon repéré en bêta, accessible dès le niveau 26." },
  { slug: "cite-de-dalaran", nom: "Cité de Dalaran", niveau: 28, resume: "Nouveau donjon repéré en bêta, accessible dès le niveau 28." },
];

export const NOTE_DONJONS = "Relevés dans la version de bêta 1.60.1. Les niveaux peuvent encore changer au lancement.";

export const SKYBORNE = {
  slug: "skyborne",
  nom: "Les Skyborne",
  resume: "Des elfes venus du ciel, seule race de Forever à pouvoir rejoindre l'Alliance comme la Horde. On les appelle aussi Éolides dans la version française.",
  origine: [
    "Les Skyborne descendent d'une ancienne lignée d'elfes qui s'est réfugiée pendant des millénaires dans les royaumes célestes des élémentaires de l'air. Coupés du monde, ils ont adopté la magie des vents.",
    "Leur terre natale est l'île de Zéphras, l'une des nouvelles zones de Forever. Tous les Skyborne y commencent leur aventure, au village de Thendal, chaque faction dans sa propre version de la zone.",
  ],
  ordres: [
    { faction: "Alliance", nom: "L'ordre des savants", anglais: "High Order", texte: "Tourné vers la redécouverte du savoir arcanique perdu.", classes: ["Druide", "Chasseur", "Mage", "Voleur", "Guerrier"] },
    { faction: "Horde", nom: "L'ordre des vents", anglais: "Windshapers", texte: "Guides spirituels du peuple, au plus près des élémentaires.", classes: ["Druide", "Chasseur", "Chaman", "Voleur", "Guerrier"] },
  ],
  capacites: [
    { nom: "Walk on Air", effet: "Planer en descendant pendant 10 secondes, utilisable en mouvement", faction: "Les deux" },
    { nom: "Wind Blessed", effet: "+2 % de hâte, au corps à corps, à distance et pour les sorts", faction: "Les deux" },
    { nom: "Elemental Insight", effet: "+5 % de dégâts contre les élémentaires", faction: "Les deux" },
    { nom: "Read Ley Line", effet: "+50 % de régénération de vie et de mana pendant 30 secondes", faction: "Alliance" },
    { nom: "Skysight", effet: "+15 % de vitesse de course pendant 15 secondes", faction: "Horde" },
  ],
  acces: [
    "La race n'est pas incluse dans l'abonnement seul. Elle se débloque avec l'une des éditions supérieures de Forever : pack héroïque, pack épique, collection Warcraft Forever ou édition collector.",
    "Sans l'une d'elles, impossible de créer un personnage Skyborne. Les autres races restent accessibles avec l'abonnement.",
  ],
  avis: "[Votre regard de joueur : quelle faction, quelle classe, et l'édition vaut-elle la dépense pour cette seule race ?]",
  sources: [
    "Blizzard Entertainment — présentation de World of Warcraft: Forever et de ses éditions",
    "Warcraft Tavern — fiche de la race Skyborne",
    "Gamewave — origines, classes et capacités des Éolides",
  ],
  misAJour: "2026-10-31",
};

/** Races de l'Azeroth d'origine, présentées sur la page Races. */
export const RACES_ORIGINE = [
  { nom: "Humain", faction: "Alliance" }, { nom: "Nain", faction: "Alliance" },
  { nom: "Elfe de la nuit", faction: "Alliance" }, { nom: "Gnome", faction: "Alliance" },
  { nom: "Orc", faction: "Horde" }, { nom: "Mort-vivant", faction: "Horde" },
  { nom: "Tauren", faction: "Horde" }, { nom: "Troll", faction: "Horde" },
];
