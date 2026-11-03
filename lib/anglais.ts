/**
 * Version anglaise du site (/en/) : noms et adresses anglais des classes et des races, et correspondance des pages
 * françaises et anglaises (lien de changement de langue, balises hreflang). Aucun accès disque : utilisable côté navigateur.
 */

/** Menu de la version anglaise. */
export const MENU_EN: { href: string; label: string }[] = [
  { href: "/en/", label: "Home" },
  { href: "/en/leveling-guide/", label: "Leveling guide 1-60" },
  { href: "/en/classes/", label: "Classes & talents" },
  { href: "/en/races/", label: "Races" },
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

const DEBUT_GUIDE_FR = "/guides/parcours/";
const DEBUT_GUIDE_EN = "/en/leveling-guide/";

/** Page anglaise correspondant à une page française, ou null si elle n'existe pas encore. */
export function cheminAnglais(chemin: string): string | null {
  const c = chemin.endsWith("/") ? chemin : `${chemin}/`;
  if (c === "/") return "/en/";
  if (c === DEBUT_GUIDE_FR) return DEBUT_GUIDE_EN;
  if (c === "/classes/") return "/en/classes/";
  if (c === "/races/") return "/en/races/";
  let m = /^\/guides\/parcours\/([a-z-]+)\/([a-z]+)\/$/.exec(c);
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
  let m = /^\/en\/leveling-guide\/([a-z-]+)\/([a-z]+)\/$/.exec(c);
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
