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
    acces: "Par le sud du Berceau-de-l'Hiver, en traversant Darkwhisper Gorge [nom français à confirmer]",
    resume: "La montagne sacrée de Kalimdor s'ouvre enfin aux joueurs de l'Azeroth d'origine. Une zone pensée pour les personnages arrivés au niveau maximal.",
    paragraphes: [
      "Mont Hyjal fait partie des quatre zones ajoutées par Forever, avec les Rives Claires, l'île de Zéphras et Shen'dralar. Contrairement aux trois autres, elle ne sert pas à monter de niveau : elle accompagne le contenu de fin de jeu, aux côtés des donjons et des raids.",
      "Le mont Hyjal se gagne par le sud du Berceau-de-l'Hiver. La montagne panse ses plaies après la chute d'Archimonde ; ses quêtes visent les personnages de niveau 60, et deux raids s'y ouvrent le 9 décembre. Le récit de Jobwow viendra quand ses personnages y monteront.",
    ],
    activites: [
      { titre: "Quêtes", texte: "[Chaînes de quêtes principales et récompenses : à relever en jeu.]" },
      { titre: "Réputation", texte: "[Faction liée à la zone, s'il y en a une : à confirmer.]" },
      { titre: "Raids", texte: "Le sommet d'Hyjal (20 joueurs, 13 boss), près de Nordrassil, ouvre le 9 décembre 2026, avec les profondeurs des Saisons (10 joueurs, 8 boss), dont une entrée se trouve sur la montagne, et le repaire d'Onyxia (40 joueurs)." },
    ],
    fiabilite: "Continent et statut relevés pendant la bêta. Niveau, accès et raids d'après Blizzard et la presse spécialisée (Icy Veins, Warcraft Tavern).",
    misAJour: "2026-11-20",
  },
  {
    slug: "rives-claires", nom: "Rives Claires", nouvelle: true, continent: "Royaumes de l'Est (carte du jeu)", niveau: "35 à 45", statut: "[À confirmer]",
    acces: "Au nord des Carmines : prendre à droite juste avant les steppes Ardentes",
    resume: "Nouvelle zone de progression de Forever, pour les niveaux 35 à 45, entre les Carmines et les steppes Ardentes.",
    paragraphes: [
      "Les Rives Claires font partie des quatre zones ajoutées par Forever. Elles s'étendent entre les Carmines et les steppes Ardentes, et comptent plus de 150 quêtes.",
      "La zone abrite le bastion Krol'dok, forteresse ogre en plein air, l'un des neuf nouveaux donjons (niveaux 40 à 45).",
    ],
    activites: [
      { titre: "Quêtes", texte: "[Chaînes principales et récompenses : à relever en jeu.]" },
      { titre: "Donjon", texte: "Bastion Krol'dok, niveaux 40 à 45." },
    ],
    fiabilite: "Niveaux et accès d'après la presse spécialisée (Icy Veins, eXputer) ; donjon d'après Blizzard.",
    misAJour: "2026-11-20",
  },
  {
    slug: "ile-de-zephras", nom: "Île de Zéphras", nouvelle: true, continent: "Île à l'écart des continents (carte du jeu)", niveau: "1 à 12", statut: "Une version par faction",
    acces: "Zone de départ des Skyborne",
    resume: "Terre natale des Skyborne : tous y commencent leur aventure, au village de Thendal.",
    paragraphes: [
      "L'île de Zéphras est la terre natale des Skyborne. Chaque faction y dispose de sa propre version de la zone.",
      "Zéphras flotte dans le plan de l'Air et se délite : ses esprits du vent ont disparu, ses pylônes cèdent un à un. Les Skyborne y font leurs douze premiers niveaux, puis rejoignent Hurlevent ou Orgrimmar en passant par Dalaran. Ni Jobwow ni Jobwow TheSham n'y ont encore mis les pieds.",
      "Aucune quête n'est requise pour quitter l'île : aux quais de Valanaar, au sud, on embarque pour Dalaran, puis un portail mène à Hurlevent (Alliance) ou à Orgrimmar (Horde).",
    ],
    activites: [{ titre: "Quêtes de départ", texte: "[À relever en jeu.]" }],
    fiabilite: "Informations relevées pendant la bêta ; niveaux d'après Blizzard ; sortie de l'île d'après Blizzard Watch.",
    misAJour: "2026-11-20",
  },
  {
    slug: "shendralar", nom: "Shen'dralas", nouvelle: true, continent: "Kalimdor (carte du jeu)", niveau: "Encore incertain", statut: "Contestée",
    acces: "Entre Mulgore et Désolace",
    resume: "La quatrième nouvelle zone de Forever, terre des Shen'dralar, entre Mulgore et Désolace.",
    paragraphes: [
      "Shen'dralas raconte l'histoire des Shen'dralar, ces Bien-nés liés à Eldre'Thalas et à Hache-Tripes, et prolonge celle des centaures Gelkis et Magram.",
      "Ses quêtes mènent aussi à Maraudon et aux Souilles de Tranchebauge. Les niveaux publiés ne concordent pas encore (40 à 45 selon les uns, 45 à 53 selon les autres) : à vérifier en jeu.",
    ],
    activites: [{ titre: "Quêtes", texte: "[Chaînes principales et récompenses : à relever en jeu.]" }],
    fiabilite: "Emplacement et histoire d'après Blizzard ; statut et quêtes de donjon d'après la presse spécialisée (Icy Veins) ; niveaux encore incertains.",
    misAJour: "2026-11-20",
  },
];

export interface Donjon {
  slug: string;
  nom: string;
  /** Niveau d'entrée (début de la tranche annoncée). */
  niveau: number;
  /** Fin de la tranche de niveaux annoncée. */
  max: number;
  /** Emplacement, tel que Blizzard le décrit. */
  zone: string;
  resume: string;
}

/** Les neuf nouveaux donjons de Forever : noms, niveaux et emplacements de l'annonce de Blizzard (septembre 2026). */
export const DONJONS: Donjon[] = [
  { slug: "salle-des-thanes", nom: "La salle des Thanes", niveau: 13, max: 18, zone: "Sous Forgefer, en Dun Morogh", resume: "Donjon nain creusé sous Forgefer, pour les niveaux 13 à 18." },
  { slug: "ruines-de-lordaeron", nom: "Ruines de Lordaeron", niveau: 15, max: 20, zone: "Ruines au-dessus de Fossoyeuse, clairières de Tirisfal", resume: "Les ruines qui surplombent Fossoyeuse, pour les niveaux 15 à 20." },
  { slug: "excavations-les-paluns", nom: "Excavations : les Paluns", niveau: 24, max: 29, zone: "Au-dessus des excavations de Whelgar, dans les Paluns", resume: "Un chantier de fouilles au-dessus des excavations de Whelgar, pour les niveaux 24 à 29." },
  { slug: "cite-de-dalaran", nom: "Cité de Dalaran", niveau: 28, max: 33, zone: "Montagnes d'Alterac", resume: "La cité des mages, son dôme tombé, encore mal tenue par le Kirin Tor ; on y entre par les égouts, pour les niveaux 28 à 33." },
  { slug: "cite-submergee", nom: "La cité Submergée", niveau: 35, max: 40, zone: "Au large de la vallée de Strangleronce", resume: "Une ancienne ruine trolle sortie des flots, à ciel ouvert ; la pluie tourne à la tempête avant le dernier combat. Niveaux 35 à 40." },
  { slug: "bastion-kroldok", nom: "Bastion Krol'dok", niveau: 40, max: 45, zone: "Rives Claires", resume: "Une forteresse ogre en plein air, ateliers et campements, d'où partent des enlèvements et des chants étranges la nuit. Niveaux 40 à 45." },
  { slug: "prison-d-alcaz", nom: "Prison d'Alcaz", niveau: 48, max: 53, zone: "Île d'Alcaz, marécage d'Âprefange", resume: "L'île mystérieuse devient enfin un donjon : les Defias et des nagas s'y affrontent. Niveaux 48 à 53." },
  { slug: "repaire-des-noiregueules", nom: "Repaire des Noiregueules", niveau: 55, max: 60, zone: "Azshara, derrière les portes furbolgs du nord", resume: "Une grande cité furbolg menacée par une corruption ; ses tunnels mènent vers les profondeurs des Saisons. Niveaux 55 à 60." },
  { slug: "terrasse-du-faconneur", nom: "La terrasse du Façonneur", niveau: 58, max: 60, zone: "Collines du nord du cratère d'Un'Goro", resume: "Le donjon de fin de parcours, lié aux titans, dans le cratère d'Un'Goro. Niveaux 58 à 60." },
];

export const NOTE_DONJONS = "Noms, niveaux et emplacements d'après l'annonce de Blizzard (septembre 2026) ; à confirmer en jeu.";

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
  /**
   * Capacités propres à une faction, relevées pendant la bêta (Read Ley Line : Alliance ; Skysight : Horde). Les fichiers
   * du jeu donnent les noms français et les effets, pas la faction. Les autres capacités sont communes aux deux.
   */
  factionsCapacites: { "Lecture des lignes telluriques": "Alliance", "Vue céleste": "Horde" } as Record<string, string>,
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
