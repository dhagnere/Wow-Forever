/**
 * Journal d'analyse des vidéos de jeu → guide de 1 à 60 (procédure : VIDEOS.md).
 *
 * Chaque vidéo, jouée sans guide commercial, donne trois résultats :
 *  1. le parcours relevé (etapes) — reporté dans content/parcours-releves.ts ;
 *  2. les quêtes de Forever manquantes (ajouts, ids 9100001+) — reportées dans content/ajouts-forever.ts ;
 *  3. le bloc de remarques (remarques) — appliqué dans la relecture du guide (/admin/guides/<race>/<classe>/).
 *
 * Ce fichier est le brouillon de travail, relu dans /admin/testguide avant chaque report. Il n'est pas affiché sur le
 * site public : seuls parcours-releves.ts et ajouts-forever.ts le sont, après un commit sur `dev`.
 *
 * Les sept vidéos ci-dessous sont celles fournies le 7 novembre 2026. Le personnage est un orc chasseur qui progresse
 * dans Durotar (Vallée des Épreuves → Sen'jin → Îles de l'Écho). L'analyse est faite par OCR des images extraites : les
 * titres et l'ordre sont fiables, les coordonnées et certains donneurs restent à relever en jeu.
 *
 * IMPORTANT — l'ordre de progression est celui des vidéos 01 → 05 (Vallée des Épreuves → Sen'jin → Îles de l'Écho), conservé
 * tel quel pour construire le parcours (content/parcours-releves.ts). La vidéo 06 est l'escorte de « Perdue dans les ombres » ;
 * la vidéo 07 est une reprise (quêtes déjà rendues dans les vidéos 01–03), pas un retour en arrière.
 */

export type StatutVideo = "a-traiter" | "traitee" | "ecartee";

export interface EtapeVideo {
  a: "prendre" | "faire" | "rendre";
  /** id de la quête dans le guide, ou 9100001… pour une quête de content/ajouts-forever.ts. */
  q: number;
  moment?: string;
  note?: string;
}

export interface RemarqueVideo {
  etape: string; // « prendre:4641 »
  verifie: boolean; // « oui » coche « vérifié en jeu »
  remarque: string;
}

export interface VideoAnalysee {
  id: string;
  titre: string;
  source: string;
  date: string;
  duree: string;
  lieu: string;
  race: string;
  classe: string | null;
  statut: StatutVideo;
  motif?: string;
  etapes: EtapeVideo[];
  ajouts: number[];
  remarques: RemarqueVideo[];
  observations?: string[];
}

const lien = (drive: string) => `https://drive.google.com/file/d/${drive}/view`;

export const VIDEOS_ANALYSEES: VideoAnalysee[] = [
  {
    id: "video-01",
    titre: "Vallée des Épreuves (niveaux 1–3)",
    source: lien("13vaHIAEoqL7Xfj6NKAjeRcDj8Tp9HR1b"),
    date: "7 novembre 2026",
    duree: "10 min 05 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 4641, note: "Votre place en ce monde" },
      { a: "rendre", q: 4641, note: "à Gornek" },
      { a: "prendre", q: 788, note: "La dent tranchante" },
      { a: "prendre", q: 9100001, note: "Armes égarées (Forever)" },
      { a: "faire", q: 788, note: "sangliers tachetés" },
      { a: "faire", q: 9100001, note: "armes d'entraînement" },
      { a: "prendre", q: 790, note: "Sarkoth, auprès de Hana'zua" },
      { a: "faire", q: 790, note: "pince de Sarkoth" },
      { a: "rendre", q: 790, note: "à Hana'zua" },
      { a: "prendre", q: 804, note: "Sarkoth (suite)" },
      { a: "prendre", q: 789, note: "L'aiguillon du scorpide" },
      { a: "prendre", q: 3087, note: "Parchemin gravé (quête de classe chasseur orc)" },
      { a: "rendre", q: 9100001, note: "Armes égarées rendue dans l'Antre" },
      { a: "prendre", q: 4402, note: "Surprise aux pommes de cactus de Galgar" },
    ],
    ajouts: [9100001],
    remarques: [],
    observations: [
      "Personnage : Jobwow (orc chasseur). Présence d'erreurs d'interface (addon) en début de vidéo, sans incidence sur le parcours.",
      "« Armes égarées » (9100001) déjà saisie dans content/ajouts-forever.ts.",
    ],
  },
  {
    id: "video-02",
    titre: "Vallée des Épreuves → Sen'jin (niveaux 3–5)",
    source: lien("14PHGMYuIM4P02bEmhR16E9XOBs55fqsk"),
    date: "7 novembre 2026",
    duree: "5 min 22 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 794, note: "Le médaillon de la Lame ardente" },
      { a: "prendre", q: 805, note: "Faire un rapport au Village de Sen'jin" },
      { a: "prendre", q: 6394, note: "La pioche de Thazz'ril" },
      { a: "rendre", q: 6394, note: "La pioche de Thazz'ril terminée" },
      { a: "prendre", q: 2161, note: "Un fardeau de péon" },
      { a: "prendre", q: 786, note: "Déjouer l'agression des Kolkar" },
      { a: "prendre", q: 817, note: "Proie nécessaire" },
      { a: "prendre", q: 808, note: "Le crâne de Minshina" },
      { a: "prendre", q: 823, note: "Un rapport à Orgnil" },
      { a: "prendre", q: 826, note: "Zalazane" },
    ],
    ajouts: [],
    remarques: [],
    observations: [
      "Quêtes Forever confirmées (Wowhead/ForeverChanges/WCLBox) : « La matriarche griffesang » = 97223 (Matriarch Bloodclaw, donnée par Xar'Ti 55,3 / 75,5), « Toutes pattes dehors » = 96821 (Legging It). « Trouver le camp des chasseurs » est un objectif de quête, pas une quête à part entière.",
      "Orc (réputation Orgrimmar) ; la route passe par le Village de Sen'jin, accessible aux orcs dans Forever (Zalazane, Crâne de Minshina).",
    ],
  },
  {
    id: "video-03",
    titre: "Vallée des Épreuves / Sen'jin (niveaux 4–5)",
    source: lien("1WpGVd2aalJa2mwSlZGnGlp8GRanHsLuj"),
    date: "7 novembre 2026",
    duree: "15 min 43 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 4402, note: "Surprise aux pommes de cactus de Galgar" },
      { a: "prendre", q: 9100003, note: "Les vils quasits (id interne 9100003, réel Forever 792)" },
      { a: "rendre", q: 3087, note: "Parchemin gravé terminée" },
      { a: "prendre", q: 5441, note: "Les péons paresseux" },
    ],
    ajouts: [9100001],
    remarques: [],
    observations: [
      "« Les vils quasits » : version générale (id réel 792, orc + troll) absente des bases libres (qui n'ont que la version démoniste 1485/1499) ; ajoutée dans content/ajouts-forever.ts sous l'id interne 9100003.",
      "Rappels de butin : pommes de cactus, queues de scorpide, yeux de bestiole, étoffe de lin.",
    ],
  },
  {
    id: "video-04",
    titre: "Îles de l'Écho (niveaux 5–8)",
    source: lien("1WwEs5YDaWvy97EPmqEwrRGctFGtoV5K3"),
    date: "7 novembre 2026",
    duree: "20 min 31 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 818, note: "Un esprit parfaitement éduqué (makrura, mucus de clampant)" },
    ],
    ajouts: [],
    remarques: [],
    observations: [
      "Quête Forever confirmée : « Idoles de Loa oubliées » = 97225 (Forgotten Loa Idols).",
      "Butin des Îles de l'Écho : maquereau ombre, bigorneaux secs, œil de makrura, mucus de clampant, arêtes propres.",
      "Niveau 6 atteint pendant la vidéo.",
    ],
  },
  {
    id: "video-05",
    titre: "Îles de l'Écho (niveaux 8–9)",
    source: lien("1aqWPO0uggt7ejsOVNFX2RNuLqUputplH"),
    date: "7 novembre 2026",
    duree: "11 min 42 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [],
    ajouts: [],
    remarques: [],
    observations: [
      "Quête Forever confirmée : « Perdue dans les ombres » = 99123 (Lost in the Shadows, niv. 8).",
      "Beaucoup de ramassage (bigorneaux secs) : la vidéo suit surtout les objectifs des Îles de l'Écho.",
    ],
  },
  {
    id: "video-06",
    titre: "Dialogue d'escorte (extrait court)",
    source: lien("1sECdLtRR6l2gS5iU0OV3jrxZqK23mej_"),
    date: "7 novembre 2026",
    duree: "47 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [],
    ajouts: [],
    remarques: [],
    observations: [
      "Escorte de la quête « Perdue dans les ombres » (99123, ajoutée sous 9100006) : Pal'juh accompagne le personnage hors du Kraal des Kolkar.",
    ],
  },
  {
    id: "video-07",
    titre: "Vallée des Épreuves (niveau 5, reprise — quêtes déjà rendues)",
    source: lien("1z5jS1OooGOKln5x9GpOTQ2LxpYrPU5Dw"),
    date: "7 novembre 2026",
    duree: "16 min 50 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 789, note: "L'aiguillon du scorpide terminé" },
      { a: "prendre", q: 794, note: "Le médaillon de la Lame ardente" },
      { a: "rendre", q: 5441, note: "Les péons paresseux terminé" },
      { a: "prendre", q: 6394, note: "La pioche de Thazz'ril" },
    ],
    ajouts: [],
    remarques: [],
    observations: ["Reprise / doublon : mêmes quêtes que les vidéos 01–03, déjà rendues. La route ne repasse pas dans la Vallée des Épreuves (pas de retour)."],
  },
  {
    id: "video-08",
    titre: "Sen'jin → Tranchecolline (niveaux 7–8)",
    source: "https://drive.google.com/file/d/1vRUfKj8D7QCDBBpD-KOGmiOzTAusWs39/view",
    date: "7 novembre 2026",
    duree: "21 min 38 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 9100006, note: "Perdue dans les ombres terminée" },
      { a: "rendre", q: 786, note: "Déjouer l'agression des Kolkar terminée" },
      { a: "prendre", q: 9100012, note: "Les grands espaces sauvages (camping)" },
      { a: "faire", q: 9100012 },
      { a: "rendre", q: 9100012 },
      { a: "prendre", q: 9100013, note: "Introduction au camping : la cuisine" },
      { a: "rendre", q: 9100005, note: "Toutes pattes dehors terminée" },
      { a: "prendre", q: 784, note: "Vaincre les traîtres" },
    ],
    ajouts: [9100012, 9100013],
    remarques: [],
    observations: ["Fin des quêtes de Sen'jin / Îles de l'Écho, introduction au camping, départ vers Tranchecolline."],
  },
  {
    id: "video-09",
    titre: "Tranchecolline (niveaux 8–9)",
    source: "https://drive.google.com/file/d/15YES1A_BcP7Sa2HS_SZKITnipk0RDLFN/view",
    date: "7 novembre 2026",
    duree: "16 min 44 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 9100007, note: "Pour l'honneur" },
      { a: "rendre", q: 9100013, note: "Introduction au camping : la cuisine terminée" },
      { a: "prendre", q: 815, note: "Des œufs pour l'omelette" },
      { a: "prendre", q: 9100008, note: "Ces fruits pourraient se défendre" },
      { a: "faire", q: 9100007, note: "Hache de guerre" },
    ],
    ajouts: [],
    remarques: [],
    observations: ["Quêtes de Tranchecolline : Pour l'honneur, Des œufs pour l'omelette, Ces fruits pourraient se défendre."],
  },
  {
    id: "video-10",
    titre: "Tranchecolline (niveaux 8–11)",
    source: "https://drive.google.com/file/d/1-3wdSb3wLuVPDXPAx3gNjsby2p53j5-6/view",
    date: "7 novembre 2026",
    duree: "28 min 42 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 791, note: "Assumer ses responsabilités" },
      { a: "faire", q: 791, note: "Morceaux de canevas" },
      { a: "rendre", q: 9100008, note: "Ces fruits pourraient se défendre terminée" },
      { a: "rendre", q: 784, note: "Vaincre les traîtres terminée" },
      { a: "prendre", q: 825, note: "Des épaves" },
      { a: "rendre", q: 831, note: "Les ordres de l'amiral terminée" },
      { a: "rendre", q: 791, note: "Assumer ses responsabilités terminée" },
    ],
    ajouts: [],
    remarques: [],
    observations: [
      "Quête « Les ordres de l'amiral » (830) proposée par Gar'Thok : absente du guide (elle est le prérequis de 831). À ajouter ou corriger dans les données.",
    ],
  },
  {
    id: "video-11",
    titre: "Côte des naufrages (objectifs, niveaux 9–11)",
    source: "https://drive.google.com/file/d/1dlsofMltcSHyuFmg6XqliqV-yzdW7SaF/view",
    date: "7 novembre 2026",
    duree: "32 min 07 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "faire", q: 784, note: "Marins de Kul Tiras (Vaincre les traîtres)" },
      { a: "faire", q: 825, note: "Outils gnomes (Des épaves)" },
      { a: "faire", q: 817, note: "Fourrure de tigre de Durotar (Proie nécessaire)" },
      { a: "faire", q: 815, note: "Œufs de fouette-queue (Des œufs pour l'omelette)" },
    ],
    ajouts: [],
    remarques: [],
    observations: [
      "Session d'objectifs, aucune nouvelle quête : Durotar, Côte des naufrages. Confirme la route et l'emplacement des mobs.",
    ],
  },
  {
    id: "video-12",
    titre: "Îles de l'Écho → Tiragarde (niveaux 9–11)",
    source: "https://drive.google.com/file/d/1Y6ut-phZWSFDtcwW89aJJBKX4qGT-iR3/view",
    date: "7 novembre 2026",
    duree: "28 min 59 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "faire", q: 826, note: "Troll vaudou (Zalazane)" },
      { a: "faire", q: 9100004, note: "Idoles de Loa oubliées" },
      { a: "faire", q: 808, note: "Crâne de Minshina" },
      { a: "rendre", q: 817, note: "Proie nécessaire terminée" },
      { a: "rendre", q: 9100002, note: "La matriarche griffesang terminée" },
      { a: "rendre", q: 825, note: "Des épaves terminée" },
      { a: "prendre", q: 9100014, note: "Une main en moins" },
      { a: "prendre", q: 9100015, note: "Une menace venue d'en bas" },
    ],
    ajouts: [9100014, 9100015],
    remarques: [],
    observations: [
      "Fin des quêtes des Îles de l'Écho, puis enchaînement naga (99048 → 99049) au nord de Tiragarde. Niveau 10 atteint.",
    ],
  },
  {
    id: "video-13",
    titre: "Orgrimmar — familier et cuisine (niveaux 10–11)",
    source: "https://drive.google.com/file/d/1-EcE7ay_gs2Ll51QLPdioeWs2KAt9S7M/view",
    date: "7 novembre 2026",
    duree: "14 min 57 s",
    lieu: "orgrimmar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 6062, note: "Dompter la bête terminée" },
      { a: "prendre", q: 6081, note: "Entraîner la bête" },
      { a: "prendre", q: 812, note: "Besoin d'un remède" },
      { a: "prendre", q: 9100016, note: "En souffrance de pitance (97246)" },
      { a: "prendre", q: 9100017, note: "Son plat préféré (97249)" },
      { a: "prendre", q: 9100018, note: "Le mélange de Yelmak (97242)" },
    ],
    ajouts: [9100016, 9100017, 9100018],
    remarques: [],
    observations: ["Quêtes de familier du chasseur (6062 → 6081) et chaîne de cuisine d'Orgrimmar (97246 → 97249 → 97242). Niveau 11 atteint."],
  },
  {
    id: "video-14",
    titre: "Durotar nord (niveaux 11–12)",
    source: "https://drive.google.com/file/d/1HPjV5vvAaOPCD28uAbp0vAq6h-j9sESA/view",
    date: "7 novembre 2026",
    duree: "11 min 27 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 835, note: "Des lignes sécurisées" },
      { a: "prendre", q: 9100021, note: "Une tempête en approche (97281)" },
    ],
    ajouts: [9100021],
    remarques: [],
    observations: ["Suite au nord de Durotar : Des lignes sécurisées (835) et Une tempête en approche (97281). Niveau 12 atteint."],
  },
  {
    id: "video-15",
    titre: "Durotar — familier et naga (niveaux 11–12)",
    source: "https://drive.google.com/file/d/1KWrNg3ozx8E0hYFUos3AMjl3iQR-cp_5/view",
    date: "7 novembre 2026",
    duree: "11 min 24 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 6082, note: "Dompter la bête (2e)" },
      { a: "prendre", q: 6083, note: "Dompter la bête (3e)" },
    ],
    ajouts: [],
    remarques: [],
    observations: ["Suite des quêtes de familier (6082, 6083) et début de la chaîne naga (Aileron épineux)."],
  },
  {
    id: "video-16",
    titre: "Orgrimmar → Durotar nord (niveaux 11–13)",
    source: "https://drive.google.com/file/d/1ZQUpVo-orTLt9Gh-z2w7CqVOCFf7JEbi/view",
    date: "7 novembre 2026",
    duree: "31 min 01 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 9100018, note: "Le mélange de Yelmak terminé" },
      { a: "prendre", q: 9100019, note: "Droit au Whuut (97275)" },
      { a: "rendre", q: 9100017, note: "Son plat préféré terminé" },
      { a: "prendre", q: 9100020, note: "Ameublement rocheux (97326)" },
      { a: "rendre", q: 831, note: "Les ordres de l'amiral terminée" },
      { a: "prendre", q: 5726, note: "Ennemis cachés" },
      { a: "prendre", q: 813, note: "La recherche de l'antidote" },
      { a: "prendre", q: 816, note: "L'égaré" },
      { a: "rendre", q: 837, note: "Empiètement terminée" },
      { a: "prendre", q: 806, note: "Noirs orages" },
      { a: "prendre", q: 834, note: "Des vents dans le désert" },
    ],
    ajouts: [9100019, 9100020],
    remarques: [],
    observations: ["Fin de la cuisine d'Orgrimmar, puis enchaînement Durotar nord : Ennemis cachés (5726), L'égaré (816), Noirs orages (806), Des vents dans le désert (834)."],
  },
  {
    id: "video-17",
    titre: "Durotar nord — naga (niveaux 12–13)",
    source: "https://drive.google.com/file/d/1l969xLnDJ8WHK_g2iwBKgAtOlGmp1eDJ/view",
    date: "7 novembre 2026",
    duree: "7 min 13 s",
    lieu: "durotar",
    race: "orc",
    classe: "chasseur",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 9100015, note: "Une menace venue d'en bas terminée (99049)" },
      { a: "prendre", q: 9100022, note: "Une menace venue d'en bas (99051)" },
      { a: "prendre", q: 861, note: "La voie du chasseur" },
    ],
    ajouts: [9100022],
    remarques: [],
    observations: ["Suite de la chaîne naga (99049 → 99051) et quête d'orientation du chasseur (861 La voie du chasseur)."],
  },
  {
    id: "video-druide-01",
    titre: "Mulgore — Camp Narache (niveau 1)",
    source: "https://drive.google.com/file/d/137Uu1PkDeWvMUrmETpmqPoEmGVKN4Ywt/view",
    date: "8 novembre 2026",
    duree: "30 s",
    lieu: "mulgore",
    race: "tauren",
    classe: "druide",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 747, note: "La chasse commence (Grull Vent-du-faucon)" },
    ],
    ajouts: [],
    remarques: [],
    observations: ["Quête 747 « La chasse commence » : 7 plumes + 7 viandes de trotteur des plaines."],
  },
  {
    id: "video-druide-02",
    titre: "Mulgore — Camp Narache (niveau 2)",
    source: "https://drive.google.com/file/d/1VZT6fq_LnWY6hB5UoFa9tWGqE6BfdUrJ/view",
    date: "8 novembre 2026",
    duree: "12 s",
    lieu: "mulgore",
    race: "tauren",
    classe: "druide",
    statut: "traitee",
    etapes: [
      { a: "prendre", q: 752, note: "Une humble contribution (Chef Vent-du-faucon)" },
    ],
    ajouts: [],
    remarques: [],
    observations: ["Quête 752 « Une humble contribution » : aller voir Grand-mère Vent-du-faucon."],
  },
  {
    id: "video-druide-03",
    titre: "Mulgore — Camp Narache (niveaux 2–3)",
    source: "https://drive.google.com/file/d/1h2modzWhN5IeIuWVsih_MjhpMmW20WW0/view",
    date: "8 novembre 2026",
    duree: "7 min 20 s",
    lieu: "mulgore",
    race: "tauren",
    classe: "druide",
    statut: "traitee",
    etapes: [
      { a: "rendre", q: 752, note: "Une humble contribution (Grand-mère Vent-du-faucon)" },
      { a: "prendre", q: 753, note: "Une humble contribution (cruche d'eau)" },
      { a: "faire", q: 753, note: "Rapporter Cruche d'eau" },
      { a: "rendre", q: 753, note: "Une humble contribution terminée" },
      { a: "faire", q: 747, note: "Plumes et viandes de trotteur des plaines" },
      { a: "rendre", q: 747, note: "La chasse commence terminée" },
      { a: "prendre", q: 3094, note: "Note verdoyante (classe druide)" },
    ],
    ajouts: [],
    remarques: [],
    observations: ["Objectifs de 747 et 753, puis quête de classe druide 3094 « Note verdoyante » (Gart Cours-la-brume). Niveau 2 atteint."],
  },
];
