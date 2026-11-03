import type { CSSProperties } from "react";
import { ECRANS, type SlugEcran } from "@/config/ecrans";

/**
 * Illustrations tirées des écrans de chargement du jeu (npm run ecrans:jeu), choisies selon le thème de chaque page.
 * Images © Blizzard Entertainment, lues grâce à wago.tools.
 */

export function urlEcran(slug: SlugEcran, largeur: 800 | 1600 = 1600): string {
  return `/images/jeu/ecrans/${slug}-${largeur}.jpg`;
}

export function nomEcran(slug: SlugEcran): string {
  return ECRANS.find((e) => e.slug === slug)?.nom ?? "";
}

/** Fond de la bannière d'une page (variable --image-bandeau de .bandeau-page). */
export function fondBandeau(slug: SlugEcran): CSSProperties {
  return { ["--image-bandeau" as string]: `url("${urlEcran(slug)}")` } as CSSProperties;
}

/** Zones de Forever : écran propre quand il existe, sinon celui du lieu le plus proche (légende explicite). */
export const ECRAN_ZONE: Record<string, SlugEcran> = {
  "mont-hyjal": "kalimdor",
  "ile-de-zephras": "ile-de-zephras",
  // Les Shen'dralar sont les gardiens de la bibliothèque de Hache-Tripes.
  shendralar: "hache-tripes",
  "rives-claires": "royaumes-de-l-est",
};

/** Nouveaux donjons de Forever : chacun a son écran. */
export const ECRAN_DONJON: Record<string, SlugEcran> = {
  "salle-des-thanes": "salle-des-thanes",
  "ruines-de-lordaeron": "ruines-de-lordaeron",
  "excavations-les-paluns": "excavations-les-paluns",
  "cite-de-dalaran": "cite-de-dalaran",
};

/** Donjons et raids de l'Azeroth d'origine, par leur nom affiché dans content/reference.ts. */
const ECRAN_PAR_NOM: Record<string, SlugEcran> = {
  "Gouffre de Ragefeu": "gouffre-de-ragefeu",
  "Les Mortemines": "mortemines",
  "Cavernes des Lamentations": "cavernes-des-lamentations",
  "Donjon d'Ombrecroc": "donjon-d-ombrecroc",
  "Profondeurs de Brassenoire": "profondeurs-de-brassenoire",
  "La Prison": "prison",
  Gnomeregan: "gnomeregan",
  "Kraal de Tranchebauge": "kraal-de-tranchebauge",
  "Monastère écarlate": "monastere-ecarlate",
  "Souilles de Tranchebauge": "souilles-de-tranchebauge",
  Uldaman: "uldaman",
  "Zul'Farrak": "zul-farrak",
  Maraudon: "maraudon",
  "Temple d'Atal'Hakkar": "temple-englouti",
  "Profondeurs de Rochenoire": "profondeurs-de-rochenoire",
  "Pic de Rochenoire (inférieur et supérieur)": "pic-de-rochenoire",
  "Hache-Tripes": "hache-tripes",
  Scholomance: "scholomance",
  Stratholme: "stratholme",
  "Repaire d'Onyxia": "repaire-d-onyxia",
  "Cœur du Magma": "coeur-du-magma",
  "Repaire de l'Aile noire": "repaire-de-l-aile-noire",
  "Zul'Gurub": "zul-gurub",
  "Ruines d'Ahn'Qiraj": "ruines-d-ahn-qiraj",
  "Temple d'Ahn'Qiraj": "temple-d-ahn-qiraj",
  Naxxramas: "naxxramas",
};

export function ecranParNom(nom: string): SlugEcran | undefined {
  return ECRAN_PAR_NOM[nom];
}

/** Fiches de classe : un lieu emblématique de chaque classe. */
export const ECRAN_CLASSE: Record<string, SlugEcran> = {
  guerrier: "pic-de-rochenoire", paladin: "stratholme", chasseur: "zul-gurub", voleur: "mortemines", pretre: "monastere-ecarlate",
  chaman: "kalimdor", mage: "cite-de-dalaran", demoniste: "scholomance", druide: "maraudon",
};

/** Thème d'une rubrique d'articles. */
const ECRAN_RUBRIQUE: Record<string, SlugEcran> = {
  actualites: "cite-de-dalaran",
  patchs: "excavations-les-paluns",
  videos: "royaumes-de-l-est",
  communaute: "iles-des-sombrelances",
  classes: "salle-des-thanes",
  races: "ile-de-zephras",
  quetes: "excavations-les-paluns",
  "donjons-raids": "coeur-du-magma",
  zones: "kalimdor",
  metiers: "gnomeregan",
  jcj: "vallee-d-alterac",
  lore: "ruines-de-lordaeron",
  carnet: "royaumes-de-l-est",
  tests: "cite-de-dalaran",
};

/** Illustration d'un article sans image : sa page de référence d'abord, sa rubrique ensuite. */
export function ecranArticle(a: { pilier: string | null; rubrique: string }): SlugEcran {
  const [famille, slug] = (a.pilier ?? "").split("/");
  if (famille === "zones" && ECRAN_ZONE[slug]) return ECRAN_ZONE[slug];
  if (famille === "donjons" && ECRAN_DONJON[slug]) return ECRAN_DONJON[slug];
  if (famille === "races") return "ile-de-zephras";
  if (a.pilier === "guides/liste-des-donjons") return "profondeurs-de-rochenoire";
  if (a.pilier === "guides/zones-de-depart") return "ile-de-zephras";
  return ECRAN_RUBRIQUE[a.rubrique] ?? "royaumes-de-l-est";
}
