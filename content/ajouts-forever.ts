/**
 * Quêtes ajoutées par Forever dans l'Azeroth d'origine, à saisir à la main : les bases libres (CMaNGOS, AzerothCore) ne les
 * connaissent pas, et les fichiers du jeu n'en donnent que le numéro, sans titre, donneur ni objectif. Elles sont relevées
 * en jeu, sur des parties jouées sans guide commercial (jamais d'après Zygor, Wowhead ou un autre guide), puis insérées par
 * lib/guide.ts dans la zone indiquée ; le guide calcule lui-même leur place dans l'ordre de passage.
 *
 * Comment remplir (une quête par entrée) :
 *  - id : 9100001, 9100002… (unique, jamais réutilisé : il sert à sauvegarder la progression des joueurs) ;
 *  - lieu : slug de la carte de la zone (« durotar », « clairieres-de-tirisfal »…) ;
 *  - positions x et y : coordonnées en jeu sur la carte de la zone (0 à 100) ;
 *  - objectifs : rédigés avec nos mots (« Rapporter 6 × … », « Vaincre 10 × … »), jamais le texte du jeu ;
 *  - cibles : quelques points où se trouvent les monstres ou objets ; sans cibles, l'objectif est marqué « à relever » et le
 *    guide le compte comme fait dès la prise (comme une lettre à remettre) ;
 *  - faction : "alliance", "horde" ou null ; classes : slugs, seulement pour une quête de classe ;
 *  - avant : id de la quête à rendre avant de pouvoir prendre celle-ci ;
 *  - en : titre et objectifs anglais quand on les connaît (sinon le français s'affiche, signalé) ;
 *  - source : la vidéo ou la partie où la quête a été vue, pour la retrouver.
 */

export interface QueteForever {
  id: number;
  lieu: string;
  titre: string;
  /** Niveau de la quête ; à défaut, celui auquel elle a été prise en jeu. */
  niveau: number;
  min?: number;
  donneur: { nom: string; x: number; y: number };
  objectifs: string[];
  cibles?: [number, number][];
  /** À qui rendre la quête ; par défaut, au donneur. */
  rendre?: { nom: string; x: number; y: number };
  faction: "alliance" | "horde" | null;
  classes?: string[];
  avant?: number;
  groupe?: boolean;
  en?: { titre: string; objectifs?: string[] };
  source: string;
}

export const QUETES_FOREVER: QueteForever[] = [
  {
    // Id réel Forever : 97279 (« Wayward Weapons »). On garde 9100001 pour ne pas casser la progression déjà enregistrée.
    id: 9100001,
    lieu: "durotar",
    titre: "Armes égarées",
    niveau: 1,
    min: 1,
    // Gornek et Kzan Tranchecorne sont dans l'Antre : position de Gornek d'après les bases libres.
    donneur: { nom: "Gornek", x: 42.1, y: 68.3 },
    objectifs: ["Rapporter 6 × Arme d'entraînement abandonnée"],
    // Position du personnage relevée sur la carte du jeu au moment du ramassage (2 armes sur 6), vidéo 2.
    cibles: [[44.1, 66.6]],
    rendre: { nom: "Kzan Tranchecorne", x: 42.1, y: 68.3 },
    faction: "horde",
    // Proposée par Gornek après le rendu de « Votre place en ce monde » (vidéo) ; à confirmer si elle l'est aussi avant.
    avant: 4641,
    source: "Vidéos du 6 novembre 2026, chasseur orc : prise auprès de Gornek après « Votre place en ce monde » (vidéo 1, 2:35), armes ramassées en chassant les sangliers tachetés, carte à 44,1 – 66,6 (vidéo 2, 0:20), rendue dans l'Antre (vidéo 2, vers 12:00).",
  },
  {
    // Id réel Forever : 97223 (« Matriarch Bloodclaw »). Id interne 9100002 pour rester dans la plage réservée aux saisies manuelles.
    id: 9100002,
    lieu: "durotar",
    titre: "La matriarche griffesang",
    niveau: 8,
    min: 5,
    donneur: { nom: "Xar'Ti", x: 55.3, y: 75.5 },
    objectifs: ["Rapporter les œufs de la matriarche griffesang"],
    cibles: [[68, 72]],
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 02) ; Wowhead Forever / WCLBox (quête 97223) : donnée par Xar'Ti (55,3 – 75,5), œufs vers 68/72, remise des œufs à Xaldi de Sen'jin.",
  },
  {
    // Id réel Forever : 792 (« Vile Familiars »). Quête générale de la Vallée des Épreuves, absente des bases libres
    // (elles n'ont que la version démoniste 1485/1499). Id interne 9100003.
    id: 9100003,
    lieu: "durotar",
    titre: "Les vils quasits",
    niveau: 4,
    min: 2,
    donneur: { nom: "Zureetha Mireloin", x: 42.1, y: 68.3 },
    objectifs: ["Vaincre 6 × Vil quasit"],
    cibles: [[44.3, 55.5]],
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 03) ; ForeverChanges/WCLBox : quête 792, donnée par Zureetha Mireloin dans la Vallée des Épreuves. Cibles d'après la version démoniste (1485).",
  },
  {
    // Id réel Forever : 97225 (« Forgotten Loa Idols »). Id interne 9100004.
    id: 9100004,
    lieu: "durotar",
    titre: "Idoles de Loa oubliées",
    niveau: 9,
    min: 4,
    donneur: { nom: "Maître Vornal", x: 55.9, y: 74.4 },
    objectifs: ["Rapporter 8 × Idole de loa oubliée"],
    cibles: [[67, 85]],
    rendre: { nom: "Maître Gadrin", x: 56, y: 74.7 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 04, Îles de l'Écho) ; ForeverChanges/WCLBox : quête 97225, donnée par Maître Vornal (55,9 – 74,4), rendue à Maître Gadrin (56 – 74,7), idoles vers 67/85.",
  },
  {
    // Id réel Forever : 96821 (« Legging It »). Id interne 9100005. Donneur « Vel'rin Fang » en anglais, « Vel'rin Croc » en français.
    id: 9100005,
    lieu: "durotar",
    titre: "Toutes pattes dehors",
    niveau: 6,
    min: 1,
    donneur: { nom: "Vel'rin Croc", x: 55.9, y: 74 },
    objectifs: ["Vaincre 6 × Rôdeuse des crêtes ; Vaincre 6 × Rôdeur des crêtes"],
    rendre: { nom: "Gar'Thok", x: 52, y: 43.6 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 02) ; ForeverChanges : quête 96821, donnée par Vel'rin Fang (55,9 – 74), rendue à Gar'Thok (52 – 43,6). Cibles des araignées à confirmer en jeu.",
  },
  {
    // Id réel Forever : 99123 (« Lost in the Shadows »). Id interne 9100006.
    id: 9100006,
    lieu: "durotar",
    titre: "Perdue dans les ombres",
    niveau: 8,
    min: 4,
    donneur: { nom: "Pal'juh", x: 46.3, y: 78.6 },
    objectifs: ["Escorter Pal'juh hors du Kraal des Kolkar"],
    cibles: [[46.3, 78.6]],
    rendre: { nom: "Maître Vornal", x: 55.9, y: 74.5 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 05 prise, vidéo 06 escorte) ; ForeverChanges : quête 99123, donnée par Pal'juh (46,3 – 78,6), rendue à Maître Vornal (55,9 – 74,5).",
  },
  {
    // Id réel Forever : 96822 (« For Honor »). Id interne 9100007.
    id: 9100007,
    lieu: "durotar",
    titre: "Pour l'honneur",
    niveau: 6,
    min: 3,
    donneur: { nom: "Turroc", x: 54, y: 42.7 },
    objectifs: ["Rapporter Hache de bataille de pillard ; Rapporter Arc de pillard ; Rapporter Bouclier de pillard"],
    faction: "horde",
    source: "ForeverChanges : quête 96822, donnée par Turroc (54 – 42,7, Tranchecolline), armes à ramasser près de Tiragarde. Cibles à confirmer en jeu.",
  },
  {
    // Id réel Forever : 96825 (« This Fruit Could Bite Back »). Id interne 9100008.
    id: 9100008,
    lieu: "durotar",
    titre: "Ces fruits pourraient se défendre",
    niveau: 6,
    min: 3,
    donneur: { nom: "Cuisinier Torka", x: 51.2, y: 42.5 },
    objectifs: ["Rapporter 8 × Poire de cactus"],
    faction: "horde",
    source: "ForeverChanges : quête 96825, donnée par Cuisinier Torka (51,2 – 42,5, Tranchecolline), poires à l'ouest. Cibles à confirmer en jeu.",
  },
  {
    // Id réel Forever : 96873 (« A Pain in the Neck »). Id interne 9100009.
    id: 9100009,
    lieu: "durotar",
    titre: "Une douleur dans la nuque",
    niveau: 8,
    min: 5,
    donneur: { nom: "Pa'zula", x: 56.6, y: 73.7 },
    objectifs: ["Rapporter 3 × Résidu luminescent"],
    cibles: [[67, 85]],
    faction: "horde",
    source: "ForeverChanges : quête 96873, donnée par Pa'zula (56,6 – 73,7, Sen'jin), pendules des trolls des Îles de l'Écho.",
  },
  {
    // Id réel Forever : 96876 (« Ukor's Lost Pack »). Id interne 9100010. Commence depuis un objet ramassé.
    id: 9100010,
    lieu: "durotar",
    titre: "Le sac perdu d'Ukor",
    niveau: 8,
    min: 5,
    donneur: { nom: "Ukor", x: 52, y: 68.4 },
    objectifs: ["Rapporter Le sac perdu d'Ukor"],
    faction: "horde",
    source: "ForeverChanges : quête 96876, commence depuis l'objet « Le sac perdu d'Ukor » (sud de Durotar), rendue à Ukor (52 – 68,4).",
  },
  {
    // Id réel Forever : 785 (« A Strategic Alliance »). Id interne 9100011. Quête-pont vers « Déjouer l'agression des Kolkar » (786).
    id: 9100011,
    lieu: "durotar",
    titre: "Alliance stratégique",
    niveau: 8,
    min: 5,
    donneur: { nom: "Lar Fouinebroche", x: 55.9, y: 74 },
    objectifs: ["Parler à Lar Fouinebroche"],
    faction: "horde",
    source: "ForeverChanges : quête 785, mène à Lar Prowltusk (Lar Fouinebroche) à l'ouest de Sen'jin, avant « Déjouer l'agression des Kolkar » (786). Donneur d'origine à confirmer en jeu.",
  },
  {
    // Id réel Forever : 96604 (« The Great Outdoors »). Id interne 9100012. Introduction au camping.
    id: 9100012,
    lieu: "durotar",
    titre: "Les grands espaces sauvages",
    niveau: 6,
    min: 3,
    donneur: { nom: "Brakk", x: 52, y: 43.6 },
    objectifs: ["Utiliser le feu de camp de Brakk jusqu'à recevoir le bonus Repos renforcé"],
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 08) ; ForeverDB : quête 96604, donnée par Brakk (Tranchecolline).",
  },
  {
    // Id réel Forever : 96655 (« Camping 101: Cooking »). Id interne 9100013. Camping : cuisine.
    id: 9100013,
    lieu: "durotar",
    titre: "Introduction au camping : la cuisine",
    niveau: 6,
    min: 3,
    donneur: { nom: "Brakk", x: 52, y: 43.6 },
    objectifs: ["Parler à la Cuisinière Torka à Tranchecolline"],
    rendre: { nom: "Cuisinier Torka", x: 51.2, y: 42.5 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéos 08 et 09) ; ForeverDB : quête 96655, donnée par Brakk, rendue à la Cuisinière Torka.",
  },
  {
    // Id réel Forever : 99048 (« A Missing Hand »). Id interne 9100014.
    id: 9100014,
    lieu: "durotar",
    titre: "Une main en moins",
    niveau: 11,
    min: 9,
    donneur: { nom: "Orgnil Marque-l'âme", x: 52.2, y: 43.1 },
    objectifs: ["Explorer le nord de Tiragarde pour trouver Heglan Shadeeye"],
    cibles: [[58.6, 45.6]],
    rendre: { nom: "Heglan Shadeeye", x: 58.6, y: 45.6 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 12) ; ForeverChanges : quête 99048, donnée par Orgnil Soulscar (52,2 – 43,1), rendue à Heglan Shadeeye (58,6 – 45,6).",
  },
  {
    // Id réel Forever : 99049 (« Threat from Below »). Id interne 9100015. Suite de « Une main en moins » (9100014).
    id: 9100015,
    lieu: "durotar",
    titre: "Une menace venue d'en bas",
    niveau: 11,
    min: 9,
    donneur: { nom: "Heglan Shadeeye", x: 58.6, y: 45.6 },
    objectifs: ["Rapporter Dague orque ; Rapporter Morceau de bannière ; Rapporter Trident d'os brisé"],
    cibles: [[58.6, 45.6]],
    rendre: { nom: "Orgnil Marque-l'âme", x: 52.2, y: 43.1 },
    avant: 9100014,
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 12) ; ForeverChanges : quête 99049, donnée par Heglan Shadeeye, rendue à Orgnil Soulscar (52,2 – 43,1).",
  },
  {
    // Id réel Forever : 97246 (« Meal Appeal »). Id interne 9100016. Orgrimmar.
    id: 9100016,
    lieu: "durotar",
    titre: "En souffrance de pitance",
    niveau: 15,
    min: 10,
    donneur: { nom: "Thatog", x: 52, y: 30 },
    objectifs: ["Parler à Borstan"],
    rendre: { nom: "Borstan", x: 52, y: 30 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéos 13 et 16) ; ForeverDB : quête 97246, à Orgrimmar (entrée en Durotar ~52, 30).",
  },
  {
    // Id réel Forever : 97249 (« Favorite Food »). Id interne 9100017. Orgrimmar.
    id: 9100017,
    lieu: "durotar",
    titre: "Son plat préféré",
    niveau: 15,
    min: 10,
    donneur: { nom: "Borstan", x: 52, y: 30 },
    objectifs: ["Rapporter le déjeuner de Migi"],
    rendre: { nom: "Migi", x: 52, y: 30 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéos 13 et 16) ; ForeverDB : quête 97249, à Orgrimmar (entrée en Durotar ~52, 30).",
  },
  {
    // Id réel Forever : 97242 (« Yelmak's Medley »). Id interne 9100018. Orgrimmar.
    id: 9100018,
    lieu: "durotar",
    titre: "Le mélange de Yelmak",
    niveau: 15,
    min: 10,
    donneur: { nom: "Kor'geld", x: 52, y: 30 },
    objectifs: ["Rapporter 2 × Bouture de cattail ; Rapporter 4 × Bouture de speargrass"],
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéos 13 et 16) ; ForeverDB : quête 97242, à Orgrimmar (entrée en Durotar ~52, 30).",
  },
  {
    // Id réel Forever : 97275 (« Whuut's the Rush »). Id interne 9100019. Orgrimmar.
    id: 9100019,
    lieu: "durotar",
    titre: "Droit au Whuut",
    niveau: 15,
    min: 10,
    donneur: { nom: "Yelmak", x: 52, y: 30 },
    objectifs: ["Remettre la potion de Yelmak à Whuut"],
    rendre: { nom: "Whuut", x: 52, y: 30 },
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 16) ; ForeverDB : quête 97275, à Orgrimmar (entrée en Durotar ~52, 30).",
  },
  {
    // Id réel Forever : 97326 (« Rocks to Rests »). Id interne 9100020. Orgrimmar.
    id: 9100020,
    lieu: "durotar",
    titre: "Ameublement rocheux",
    niveau: 15,
    min: 10,
    donneur: { nom: "Thra", x: 52, y: 30 },
    objectifs: ["Rapporter 8 × Rocher lisse"],
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 16) ; ForeverDB : quête 97326, à Orgrimmar (entrée en Durotar ~52, 30).",
  },
  {
    // Id réel Forever : 97281 (« A Simmering Storm »). Id interne 9100021. Durotar.
    id: 9100021,
    lieu: "durotar",
    titre: "Une tempête en approche",
    niveau: 12,
    min: 11,
    donneur: { nom: "Rezlak", x: 46.4, y: 22.9 },
    objectifs: ["Rapporter Orbe de tempête terne"],
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 14) ; ForeverDB : quête 97281, Durotar (démarre sur l'Orbe de tempête terne).",
  },
  {
    // Id réel Forever : 99051 (« Threat from Below »). Id interne 9100022. Durotar. Suite de 99049.
    id: 9100022,
    lieu: "durotar",
    titre: "Une menace venue d'en bas",
    niveau: 12,
    min: 11,
    donneur: { nom: "Orgnil Marque-l'âme", x: 52.2, y: 43.1 },
    objectifs: ["Rapporter 9 × Aileron épineux de naga"],
    cibles: [[59.2, 25.3]],
    avant: 9100015,
    faction: "horde",
    source: "Vidéos du 7 novembre 2026 (vidéo 17) ; ForeverDB : quête 99051, Durotar, suite de « Une menace venue d'en bas » (99049).",
  },
  {
    // Id réel : 781 (« Attack on Camp Narache »), quête Classic absente du guide-jeu.json. Id interne 9100023. Mulgore.
    id: 9100023,
    lieu: "mulgore",
    titre: "L'attaque du Camp Narache",
    niveau: 4,
    min: 3,
    donneur: { nom: "Chef Vent-du-faucon", x: 44.5, y: 77.5 },
    objectifs: ["Rapporter Plans d'attaque des Dos-hirsutes"],
    faction: "horde",
    source: "Vidéos du 8 novembre 2026 (vidéo druide 05) ; ForeverDB : quête 781, Mulgore (démarre sur un objet de Dos-hirsute).",
  },
  {
    // Id réel Forever : 96130 (« Chakuyak »). Id interne 9100024. Mulgore.
    id: 9100024,
    lieu: "mulgore",
    titre: "Ghakuyak",
    niveau: 5,
    min: 4,
    donneur: { nom: "Maur Appelle-pluie", x: 46.7, y: 63.4 },
    objectifs: ["Vaincre Ghakuyak"],
    faction: "horde",
    source: "Vidéos du 8 novembre 2026 (vidéo druide 05) ; ForeverDB : quête 96130, Mulgore. Coordonnées à confirmer.",
  },
  {
    // Id réel Forever : 99108 (« Sparring Match »). Id interne 9100025. Mulgore.
    id: 9100025,
    lieu: "mulgore",
    titre: "Combat d'entraînement",
    niveau: 6,
    min: 5,
    donneur: { nom: "Krang Stonehoof", x: 46.7, y: 63.4 },
    objectifs: ["Vaincre 3 × Guerrier novice"],
    faction: "horde",
    source: "Vidéos du 8 novembre 2026 (vidéos druide 04 et 05) ; ForeverDB : quête 99108, Mulgore (Village de Sabot-de-sang). Coordonnées à confirmer.",
  },
  {
    // Id réel Forever : 99079 (« Longwalker Malah »). Id interne 9100026. Mulgore.
    id: 9100026,
    lieu: "mulgore",
    titre: "Longue-marche Malah",
    niveau: 9,
    min: 8,
    donneur: { nom: "Brave Plume-des-vents", x: 46.7, y: 63.4 },
    objectifs: ["Parler à Malah Longwind"],
    faction: "horde",
    source: "Vidéos du 8 novembre 2026 (vidéo druide 04) ; ForeverDB : quête 99079, Mulgore. Coordonnées à confirmer.",
  },
];

/** Repère affiché quand l'emplacement des cibles n'a pas encore été relevé en jeu. */
export const SECTEUR_A_RELEVER = { fr: "[secteur à relever en jeu]", en: "[area to be recorded in game]" } as const;
export const TITRE_EN_A_CONFIRMER = "[English name to be confirmed]";
