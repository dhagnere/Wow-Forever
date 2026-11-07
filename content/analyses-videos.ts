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
 * IMPORTANT — l'ordre des vidéos (video-01 → video-07) est l'ordre de progression réellement joué : il est conservé tel
 * quel, de bout en bout, pour construire le parcours (content/parcours-releves.ts). On ne trie pas par niveau ni par zone,
 * et on ne déduplique pas les allers-retours : chaque étape reste à sa place dans la chronologie des vidéos.
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
    titre: "Vallée des Épreuves (niveau 5, suite du parcours)",
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
    observations: ["Suite du parcours, dans l'ordre des vidéos : la route revient dans la Vallée des Épreuves (rendu de « L'aiguillon du scorpide » 789 et « Les péons paresseux » 5441, reprise de « Le médaillon de la Lame ardente » 794 et « La pioche de Thazz'ril » 6394). Niveau 5 atteint."],
  },
];
