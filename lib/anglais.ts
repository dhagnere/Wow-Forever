/**
 * Version anglaise du site (/en/) : noms et adresses anglais des classes et des races, et correspondance des pages
 * françaises et anglaises (lien de changement de langue, balises hreflang). Aucun accès disque : utilisable côté navigateur.
 */

import { CARTES_EN, DONJONS_EN } from "@/content/lieux-en";

/** Menu de la version anglaise. */
export const MENU_EN: { href: string; label: string }[] = [
  { href: "/en/", label: "Home" },
  { href: "/en/leveling-guide/", label: "Leveling guide 1-60" },
  { href: "/en/classes/", label: "Classes & talents" },
  { href: "/en/races/", label: "Races" },
  { href: "/en/maps/", label: "Maps" },
  { href: "/en/item-database/", label: "Item database" },
];

/** Classes : slug français → slug et nom anglais. */
export const CLASSES_EN: Record<string, { slug: string; nom: string }> = {
  guerrier: { slug: "warrior", nom: "Warrior" },
  paladin: { slug: "paladin", nom: "Paladin" },
  chasseur: { slug: "hunter", nom: "Hunter" },
  voleur: { slug: "rogue", nom: "Rogue" },
  pretre: { slug: "priest", nom: "Priest" },
  chaman: { slug: "shaman", nom: "Shaman" },
  mage: { slug: "mage", nom: "Mage" },
  demoniste: { slug: "warlock", nom: "Warlock" },
  druide: { slug: "druid", nom: "Druid" },
};

/** Races du guide et des traits raciaux : slug français → slug et nom anglais. */
export const RACES_EN: Record<string, { slug: string; nom: string }> = {
  humain: { slug: "human", nom: "Human" },
  nain: { slug: "dwarf", nom: "Dwarf" },
  "elfe-de-la-nuit": { slug: "night-elf", nom: "Night Elf" },
  gnome: { slug: "gnome", nom: "Gnome" },
  orc: { slug: "orc", nom: "Orc" },
  "mort-vivant": { slug: "undead", nom: "Undead" },
  tauren: { slug: "tauren", nom: "Tauren" },
  troll: { slug: "troll", nom: "Troll" },
  skyborne: { slug: "skyborne", nom: "Skyborne" },
  "skyborne-alliance": { slug: "skyborne-alliance", nom: "Skyborne (Alliance)" },
  "skyborne-horde": { slug: "skyborne-horde", nom: "Skyborne (Horde)" },
};

/** Ordres Skyborne : nom anglais connu de la bêta. */
export const ORDRES_EN: Record<"alliance" | "horde", string> = { alliance: "High Order", horde: "Windshapers" };

const inverse = (t: Record<string, { slug: string }>) => Object.fromEntries(Object.entries(t).map(([fr, v]) => [v.slug, fr]));
const CLASSES_FR = inverse(CLASSES_EN);
const RACES_FR = inverse(RACES_EN);

/** Slug anglais → slug français (undefined si inconnu). */
export const classeDepuisEn = (slug: string): string | undefined => CLASSES_FR[slug];
export const raceDepuisEn = (slug: string): string | undefined => RACES_FR[slug];
export const nomClasseEn = (slugFr: string) => CLASSES_EN[slugFr]?.nom ?? slugFr;
export const nomRaceEn = (slugFr: string) => RACES_EN[slugFr]?.nom ?? slugFr;

// ---------------------------------------------------------------- Lieux et donjons

const slug = (nom: string) =>
  nom.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Lieux (cartes) : slug français → slug anglais, tiré du nom anglais de la carte (« foret-d-elwynn » → « elwynn-forest »). */
export const LIEUX_EN: Record<string, string> = Object.fromEntries(Object.entries(CARTES_EN).map(([fr, nom]) => [fr, slug(nom)]));
const LIEUX_FR: Record<string, string> = Object.fromEntries(Object.entries(LIEUX_EN).map(([fr, en]) => [en, fr]));
export const lieuDepuisEn = (s: string): string | undefined => LIEUX_FR[s];
/** Page anglaise d'un lieu (slug français), ou la page française si la carte n'a pas de nom anglais. */
export const pageLieuEn = (fr: string) => (LIEUX_EN[fr] ? `/en/maps/${LIEUX_EN[fr]}/` : `/cartes/${fr}/`);
/** Nom anglais d'une carte, d'après son slug français. */
export const nomLieuEn = (fr: string): string | undefined => CARTES_EN[fr];

/** Continents des cartes, en anglais. */
export const CONTINENTS_EN: Record<string, string> = {
  Kalimdor: "Kalimdor", "Royaumes de l'Est": "Eastern Kingdoms", "Hors des continents": "Outside the continents",
};

/** Noms des guides qui diffèrent du nom du donjon en jeu. */
const ALIAS_DONJONS: Record<string, string> = { prison: "prison-de-hurlevent", "pic-de-rochenoire": "pic-rochenoire", "temple-d-atal-hakkar": "temple-englouti" };

/** Nom anglais d'un donjon ou d'un raid (nom français des guides), lu dans les fichiers du jeu ; null si inconnu. */
export function nomDonjonEn(nom: string): string | null {
  const cle = nom.replace(/\(.*?\)/g, "").toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[’']/g, "-")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").replace(/^(les?|la|l)-/, "");
  return DONJONS_EN[ALIAS_DONJONS[cle] ?? cle] ?? null;
}

/** Races des zones de départ (content/reference.ts), en anglais. */
export const RACES_DEPART_EN: Record<string, string> = {
  Humains: "Humans", "Nains et Gnomes": "Dwarves and Gnomes", "Elfes de la nuit": "Night Elves", "Orcs et Trolls": "Orcs and Trolls",
  "Morts-vivants": "Undead", Taurens: "Tauren", Skyborne: "Skyborne",
};

const DEBUT_GUIDE_FR = "/guides/parcours/";
const DEBUT_GUIDE_EN = "/en/leveling-guide/";

/** Page anglaise correspondant à une page française, ou null si elle n'existe pas encore. */
export function cheminAnglais(chemin: string): string | null {
  const c = chemin.endsWith("/") ? chemin : `${chemin}/`;
  if (c === "/") return "/en/";
  if (c === DEBUT_GUIDE_FR) return DEBUT_GUIDE_EN;
  if (c === "/classes/") return "/en/classes/";
  if (c === "/races/") return "/en/races/";
  if (c === "/cartes/") return "/en/maps/";
  if (c === "/base-de-donnees/") return "/en/item-database/";
  if (c === "/base-de-donnees/objets/") return "/en/item-database/items/";
  let m = /^\/cartes\/([a-z0-9-]+)\/$/.exec(c);
  if (m && LIEUX_EN[m[1]]) return `/en/maps/${LIEUX_EN[m[1]]}/`;
  m = /^\/base-de-donnees\/objets\/(\d{1,9})\/$/.exec(c);
  if (m) return `/en/item-database/items/${m[1]}/`;
  m = /^\/guides\/parcours\/([a-z-]+)\/([a-z]+)\/$/.exec(c);
  if (m && RACES_EN[m[1]] && CLASSES_EN[m[2]]) return `${DEBUT_GUIDE_EN}${RACES_EN[m[1]].slug}/${CLASSES_EN[m[2]].slug}/`;
  m = /^\/classes\/([a-z]+)\/(talents\/)?$/.exec(c);
  if (m && CLASSES_EN[m[1]]) return `/en/classes/${CLASSES_EN[m[1]].slug}/${m[2] ?? ""}`;
  return null;
}

/** Page française correspondant à une page anglaise. */
export function cheminFrancais(chemin: string): string {
  const c = chemin.endsWith("/") ? chemin : `${chemin}/`;
  if (c === "/en/") return "/";
  if (c === DEBUT_GUIDE_EN) return DEBUT_GUIDE_FR;
  if (c === "/en/classes/") return "/classes/";
  if (c === "/en/races/") return "/races/";
  if (c === "/en/maps/") return "/cartes/";
  if (c === "/en/item-database/") return "/base-de-donnees/";
  if (c === "/en/item-database/items/") return "/base-de-donnees/objets/";
  let m = /^\/en\/maps\/([a-z0-9-]+)\/$/.exec(c);
  if (m && lieuDepuisEn(m[1])) return `/cartes/${lieuDepuisEn(m[1])}/`;
  m = /^\/en\/item-database\/items\/(\d{1,9})\/$/.exec(c);
  if (m) return `/base-de-donnees/objets/${m[1]}/`;
  m = /^\/en\/leveling-guide\/([a-z-]+)\/([a-z]+)\/$/.exec(c);
  if (m && raceDepuisEn(m[1]) && classeDepuisEn(m[2])) return `${DEBUT_GUIDE_FR}${raceDepuisEn(m[1])}/${classeDepuisEn(m[2])}/`;
  m = /^\/en\/classes\/([a-z]+)\/(talents\/)?$/.exec(c);
  if (m && classeDepuisEn(m[1])) return `/classes/${classeDepuisEn(m[1])}/${m[2] ?? ""}`;
  return "/";
}

/** Balises hreflang d'une page française qui a sa version anglaise (à placer dans alternates.languages). */
export function languesDe(cheminFr: string): Record<string, string> | undefined {
  const en = cheminAnglais(cheminFr);
  return en ? { fr: cheminFr, en, "x-default": cheminFr } : undefined;
}

export const ROLES_EN: Record<string, string> = { Tank: "Tank", "Dégâts": "Damage", Soins: "Healing" };
export const ARMURES_EN: Record<string, string> = {
  "Mailles, puis plaques au niveau 40": "Mail, then plate at level 40",
  "Cuir, puis mailles au niveau 40": "Leather, then mail at level 40",
  Cuir: "Leather",
  Tissu: "Cloth",
};
/** Capacités Skyborne propres à une faction (relevées pendant la bêta), sous leur nom anglais. */
export const FACTIONS_CAPACITES_EN: Record<string, string> = { "Read Leyline": "Alliance", Skysight: "Horde" };
/** Lien d'un guide de 1 à 60 en anglais, à partir des slugs français. */
export const lienGuideEn = (raceFr: string, classeFr: string) => `/en/leveling-guide/${RACES_EN[raceFr]?.slug ?? raceFr}/${CLASSES_EN[classeFr]?.slug ?? classeFr}/`;
