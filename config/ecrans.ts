/**
 * Écrans de chargement du jeu utilisés comme illustrations (npm run ecrans:jeu → public/images/jeu/ecrans/).
 * Chaque écran est retrouvé par la carte (table Map) qui l'affiche : l'identifiant d'une carte ne change pas d'une version à l'autre.
 * Images © Blizzard Entertainment, lues dans les fichiers de WoW Forever grâce à wago.tools.
 */

export interface Ecran {
  slug: string;
  /** Nom affiché dans la légende. */
  nom: string;
  /** Identifiant de la carte dans la table Map. */
  carte: number;
}

export const ECRANS = [
  // Illustrations propres à Forever.
  { slug: "royaumes-de-l-est", nom: "Royaumes de l'Est", carte: 0 },
  { slug: "kalimdor", nom: "Kalimdor", carte: 1 },
  { slug: "ile-de-zephras", nom: "Île de Zéphras", carte: 2991 },
  { slug: "salle-des-thanes", nom: "La salle des Thanes", carte: 3065 },
  { slug: "ruines-de-lordaeron", nom: "Ruines de Lordaeron", carte: 2999 },
  { slug: "excavations-les-paluns", nom: "Excavations : les Paluns", carte: 2998 },
  { slug: "cite-de-dalaran", nom: "Cité de Dalaran", carte: 2959 },
  { slug: "iles-des-sombrelances", nom: "Îles des Sombrelances", carte: 2997 },
  // Donjons de l'Azeroth d'origine.
  { slug: "gouffre-de-ragefeu", nom: "Gouffre de Ragefeu", carte: 389 },
  { slug: "mortemines", nom: "Les Mortemines", carte: 36 },
  { slug: "cavernes-des-lamentations", nom: "Cavernes des Lamentations", carte: 43 },
  { slug: "donjon-d-ombrecroc", nom: "Donjon d'Ombrecroc", carte: 33 },
  { slug: "profondeurs-de-brassenoire", nom: "Profondeurs de Brassenoire", carte: 48 },
  { slug: "prison", nom: "La Prison", carte: 34 },
  { slug: "gnomeregan", nom: "Gnomeregan", carte: 90 },
  { slug: "kraal-de-tranchebauge", nom: "Kraal de Tranchebauge", carte: 47 },
  { slug: "monastere-ecarlate", nom: "Monastère écarlate", carte: 189 },
  { slug: "souilles-de-tranchebauge", nom: "Souilles de Tranchebauge", carte: 129 },
  { slug: "uldaman", nom: "Uldaman", carte: 70 },
  { slug: "zul-farrak", nom: "Zul'Farrak", carte: 209 },
  { slug: "maraudon", nom: "Maraudon", carte: 349 },
  { slug: "temple-englouti", nom: "Temple d'Atal'Hakkar", carte: 109 },
  { slug: "profondeurs-de-rochenoire", nom: "Profondeurs de Rochenoire", carte: 230 },
  { slug: "pic-de-rochenoire", nom: "Pic de Rochenoire", carte: 229 },
  { slug: "hache-tripes", nom: "Hache-Tripes", carte: 429 },
  { slug: "scholomance", nom: "Scholomance", carte: 289 },
  { slug: "stratholme", nom: "Stratholme", carte: 329 },
  // Raids et champs de bataille.
  { slug: "coeur-du-magma", nom: "Cœur du Magma", carte: 409 },
  { slug: "repaire-d-onyxia", nom: "Repaire d'Onyxia", carte: 249 },
  { slug: "repaire-de-l-aile-noire", nom: "Repaire de l'Aile noire", carte: 469 },
  { slug: "zul-gurub", nom: "Zul'Gurub", carte: 309 },
  { slug: "ruines-d-ahn-qiraj", nom: "Ruines d'Ahn'Qiraj", carte: 509 },
  { slug: "temple-d-ahn-qiraj", nom: "Temple d'Ahn'Qiraj", carte: 531 },
  { slug: "naxxramas", nom: "Naxxramas", carte: 533 },
  { slug: "vallee-d-alterac", nom: "Vallée d'Alterac", carte: 30 },
  { slug: "goulet-des-chanteguerres", nom: "Goulet des Chanteguerres", carte: 489 },
  { slug: "bassin-d-arathi", nom: "Bassin d'Arathi", carte: 529 },
] as const satisfies readonly Ecran[];

export type SlugEcran = (typeof ECRANS)[number]["slug"];

/** Largeurs produites : grande (bannières) et petite (cartes, vignettes). */
export const LARGEURS_ECRANS = [1600, 800] as const;
