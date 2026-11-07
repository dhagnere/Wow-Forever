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
];
