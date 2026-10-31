/**
 * Fiches de classe. Les données marquées « Azeroth d'origine » sont celles de WoW Classic ;
 * les ajouts de Forever sont complétés au fil des annonces.
 */

export interface Classe {
  slug: string;
  nom: string;
  couleur: string; // couleur d'emblème
  roles: string[];
  resume: string; // une ligne pour les listes
  presentation: string;
  armure: string;
  pourVous: { titre: string; texte: string }[];
  races: { race: string; faction: string; statut: string; lien?: string }[];
  debuter: { titre: string; texte: string }[];
  misAJour: string;
}

const ORIGINE = "Héritée de l'Azeroth d'origine";

function races(liste: [string, string][], skyborne?: string) {
  const lignes: Classe["races"] = liste.map(([race, faction]) => ({ race, faction, statut: ORIGINE }));
  if (skyborne) lignes.push({ race: "Skyborne", faction: skyborne, statut: "Nouvelle race de Forever", lien: "/races/skyborne/" });
  return lignes;
}

const A_COMPLETER = "[Conseil de Silfax à compléter après les premières heures de jeu.]";

export const CLASSES: Classe[] = [
  {
    slug: "guerrier", nom: "Guerrier", couleur: "#a8794f", roles: ["Tank", "Dégâts"],
    resume: "Tank · Dégâts au corps à corps",
    presentation: "Le pilier des groupes : il encaisse les coups, tient les ennemis et frappe fort une fois bien équipé. Exigeant en solo, incontournable en donjon.",
    armure: "Mailles, puis plaques au niveau 40",
    pourVous: [
      { titre: "Vous aimez être en première ligne", texte: "Le guerrier protège le groupe et dicte le rythme des combats." },
      { titre: "Vous visez les raids", texte: "Tank ou dégâts, sa place est assurée dans les raids à 10 et 20 joueurs." },
      { titre: "Vous acceptez un départ lent", texte: "Sans soins, il dépend de la nourriture et de son équipement pour enchaîner." },
    ],
    races: races([["Humain", "Alliance"], ["Nain", "Alliance"], ["Elfe de la nuit", "Alliance"], ["Gnome", "Alliance"], ["Orc", "Horde"], ["Mort-vivant", "Horde"], ["Tauren", "Horde"], ["Troll", "Horde"]], "Alliance ou Horde"),
    debuter: [
      { titre: "Soigner son arme avant son armure.", texte: A_COMPLETER },
      { titre: "Apprendre les postures tôt.", texte: "Combat, défense, berserker : chaque posture débloque ses propres techniques." },
      { titre: "Prévoir de quoi récupérer.", texte: "Gardez toujours de la nourriture et des bandages sur vous." },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "paladin", nom: "Paladin", couleur: "#d9a94a", roles: ["Tank", "Soins", "Dégâts"],
    resume: "Tank · Soins · Dégâts",
    presentation: "Guerrier de la Lumière, il soigne, protège et renforce ses alliés par ses bénédictions. Solide en solo grâce à ses soins.",
    armure: "Mailles, puis plaques au niveau 40",
    pourVous: [
      { titre: "Vous aimez soutenir le groupe", texte: "Bénédictions et auras profitent à tous vos compagnons." },
      { titre: "Vous voulez survivre seul", texte: "Soins, bouclier divin : le paladin se tire de bien des mauvais pas." },
      { titre: "Vous jouez dans l'Alliance", texte: "Dans l'Azeroth d'origine, la classe est réservée à l'Alliance." },
    ],
    races: races([["Humain", "Alliance"], ["Nain", "Alliance"]]),
    debuter: [
      { titre: "Choisir sa voie de talents.", texte: A_COMPLETER },
      { titre: "Garder la bonne bénédiction active.", texte: "Elle dure plusieurs minutes : pensez à la renouveler avant un combat." },
      { titre: "Se soigner entre les combats.", texte: "Une pause courte vaut mieux qu'une mort coûteuse en réparations." },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "chasseur", nom: "Chasseur", couleur: "#7c9a48", roles: ["Dégâts"],
    resume: "Dégâts à distance · Familier",
    presentation: "Tireur accompagné d'un familier apprivoisé, il frappe de loin et laisse sa bête tenir l'ennemi. La classe la plus confortable pour monter de niveau.",
    armure: "Cuir, puis mailles au niveau 40",
    pourVous: [
      { titre: "Vous débutez", texte: "Le familier encaisse pour vous : idéal pour découvrir le jeu." },
      { titre: "Vous aimez collectionner", texte: "Chaque familier apprivoisable a son apparence et ses techniques." },
      { titre: "Vous jouez souvent en solo", texte: "Peu de temps morts, une progression régulière." },
    ],
    races: races([["Nain", "Alliance"], ["Elfe de la nuit", "Alliance"], ["Orc", "Horde"], ["Tauren", "Horde"], ["Troll", "Horde"]], "Alliance ou Horde"),
    debuter: [
      { titre: "Apprivoiser un familier dès le niveau 10.", texte: "La quête de classe est disponible auprès de votre maître des chasseurs." },
      { titre: "Garder des munitions d'avance.", texte: "Flèches ou balles s'épuisent vite : prévoyez large." },
      { titre: "Nourrir son familier.", texte: A_COMPLETER },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "voleur", nom: "Voleur", couleur: "#c9c25a", roles: ["Dégâts"],
    resume: "Dégâts au corps à corps · Furtivité",
    presentation: "Maître de la furtivité et des poisons, il choisit ses combats et frappe le premier. Redoutable en JcJ.",
    armure: "Cuir",
    pourVous: [
      { titre: "Vous aimez surprendre", texte: "Camouflage, assommer, attaques sournoises : le voleur ouvre chaque combat à son avantage." },
      { titre: "Vous visez le JcJ", texte: "Contrôle et mobilité en font une classe redoutée sur les champs de bataille." },
      { titre: "Vous aimez l'exploration", texte: "Se faufiler entre les ennemis permet d'atteindre des lieux hors de portée." },
    ],
    races: races([["Humain", "Alliance"], ["Nain", "Alliance"], ["Elfe de la nuit", "Alliance"], ["Gnome", "Alliance"], ["Orc", "Horde"], ["Mort-vivant", "Horde"], ["Troll", "Horde"]], "Alliance ou Horde"),
    debuter: [
      { titre: "Obtenir les poisons au niveau 20.", texte: "Une quête de classe les débloque : un gain de dégâts net." },
      { titre: "Ne pas négliger les bandages.", texte: "Le secourisme compense l'absence de soins." },
      { titre: "Choisir ses combats.", texte: A_COMPLETER },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "pretre", nom: "Prêtre", couleur: "#e3ddd0", roles: ["Soins", "Dégâts"],
    resume: "Soins · Dégâts à distance",
    presentation: "Le soigneur par excellence, capable aussi de basculer dans l'Ombre pour infliger de lourds dégâts. Toujours recherché pour les donjons.",
    armure: "Tissu",
    pourVous: [
      { titre: "Vous aimez soigner", texte: "Le prêtre a la plus large palette de soins du jeu." },
      { titre: "Vous voulez trouver un groupe vite", texte: "Un soigneur ne reste jamais longtemps seul en recherche de donjon." },
      { titre: "Vous aimez les deux faces", texte: "Sacré pour soigner, Ombre pour attaquer : deux styles en un." },
    ],
    races: races([["Humain", "Alliance"], ["Nain", "Alliance"], ["Elfe de la nuit", "Alliance"], ["Mort-vivant", "Horde"], ["Troll", "Horde"]]),
    debuter: [
      { titre: "Monter de niveau en Ombre.", texte: A_COMPLETER },
      { titre: "Utiliser la baguette.", texte: "Elle économise la mana pour finir les combats." },
      { titre: "Garder le mot de pouvoir : Bouclier.", texte: "Il évite bien des interruptions pendant les soins." },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "chaman", nom: "Chaman", couleur: "#3f7fbf", roles: ["Soins", "Dégâts"],
    resume: "Soins · Dégâts · Totems",
    presentation: "Lié aux éléments, il pose des totems qui renforcent le groupe, soigne et frappe au corps à corps comme à distance.",
    armure: "Cuir, puis mailles au niveau 40",
    pourVous: [
      { titre: "Vous aimez la polyvalence", texte: "Soins, sorts élémentaires ou corps à corps : trois façons de jouer." },
      { titre: "Vous jouez dans la Horde", texte: "Dans l'Azeroth d'origine, la classe est réservée à la Horde." },
      { titre: "Vous aimez soutenir sans tout sacrifier", texte: "Les totems aident le groupe tout en laissant frapper." },
    ],
    races: races([["Orc", "Horde"], ["Tauren", "Horde"], ["Troll", "Horde"]], "Horde (ordre des vents)"),
    debuter: [
      { titre: "Récupérer chaque totem par sa quête.", texte: "Terre, feu, eau et air s'obtiennent par des quêtes de classe." },
      { titre: "Choisir son arme.", texte: A_COMPLETER },
      { titre: "Adapter ses totems au combat.", texte: "Un totem bien choisi vaut mieux que quatre posés au hasard." },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "mage", nom: "Mage", couleur: "#5fb8d6", roles: ["Dégâts"],
    resume: "Dégâts à distance · Contrôle",
    presentation: "Maître des arcanes, du feu et du givre. Dégâts élevés, contrôle des foules, et nourriture et eau à volonté pour le groupe.",
    armure: "Tissu",
    pourVous: [
      { titre: "Vous aimez les gros dégâts", texte: "Le mage est l'une des meilleures classes de dégâts à distance." },
      { titre: "Vous voyagez beaucoup", texte: "Portails et téléportations vers les capitales." },
      { titre: "Vous aimez contrôler le combat", texte: "Métamorphose, nova de givre : le mage garde ses ennemis à distance." },
    ],
    races: races([["Humain", "Alliance"], ["Gnome", "Alliance"], ["Mort-vivant", "Horde"], ["Troll", "Horde"]], "Alliance (ordre des savants)"),
    debuter: [
      { titre: "Monter en Givre.", texte: A_COMPLETER },
      { titre: "Conjurer sa nourriture et son eau.", texte: "Aucune dépense, et de quoi dépanner le groupe." },
      { titre: "Garder ses distances.", texte: "Le tissu protège peu : ralentissez, puis reculez." },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "demoniste", nom: "Démoniste", couleur: "#8a62c4", roles: ["Dégâts"],
    resume: "Dégâts à distance · Serviteurs",
    presentation: "Il invoque des démons et ronge ses ennemis par des malédictions. Solide en solo grâce à ses serviteurs.",
    armure: "Tissu",
    pourVous: [
      { titre: "Vous aimez les dégâts sur la durée", texte: "Corruption, malédictions : l'ennemi s'use avant même le contact." },
      { titre: "Vous jouez seul", texte: "Le marcheur du Vide encaisse à votre place." },
      { titre: "Vous aimez rendre service", texte: "Pierres de soins, rituel d'invocation : le groupe vous attend." },
    ],
    races: races([["Humain", "Alliance"], ["Gnome", "Alliance"], ["Orc", "Horde"], ["Mort-vivant", "Horde"]]),
    debuter: [
      { titre: "Obtenir le marcheur du Vide au niveau 10.", texte: "Une quête de classe le débloque : votre meilleur allié pour progresser." },
      { titre: "Gérer ses fragments d'âme.", texte: "Gardez-en toujours quelques-uns en réserve." },
      { titre: "Utiliser Connexion.", texte: A_COMPLETER },
    ],
    misAJour: "2026-10-31",
  },
  {
    slug: "druide", nom: "Druide", couleur: "#d9822b", roles: ["Tank", "Soins", "Dégâts"],
    resume: "Tank · Soins · Dégâts · Formes",
    presentation: "La classe qui sait tout faire : protéger le groupe sous forme d'ours, soigner, frapper au corps à corps ou à distance. Le prix de cette polyvalence : beaucoup de formes à maîtriser.",
    armure: "Cuir",
    pourVous: [
      { titre: "Vous aimez changer de rôle", texte: "Un seul personnage peut tanker un donjon un soir et soigner le lendemain." },
      { titre: "Vous voyagez beaucoup", texte: "Formes de voyage et aquatique : le Druide se déplace vite, sur terre comme dans l'eau." },
      { titre: "Vous jouez souvent en solo", texte: "Se soigner entre deux combats évite les temps morts." },
    ],
    races: races([["Elfe de la nuit", "Alliance"], ["Tauren", "Horde"]], "Alliance ou Horde"),
    debuter: [
      { titre: "Choisir une voie pour monter de niveau.", texte: "[Conseil de Silfax : forme et branche de talents recommandées pour les niveaux 1 à 60.]" },
      { titre: "Récupérer chaque forme au bon moment.", texte: "Dans l'Azeroth d'origine, les formes s'obtiennent par des quêtes de classe. [Niveaux exacts dans Forever : à vérifier en jeu.]" },
      { titre: "Garder de la mana pour se soigner.", texte: "[Astuce de rotation hors combat, tirée du carnet de Silfax.]" },
    ],
    misAJour: "2026-10-31",
  },
];

export function trouverClasse(slug: string) {
  return CLASSES.find((c) => c.slug === slug);
}
