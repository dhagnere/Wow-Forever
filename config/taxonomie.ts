/**
 * Taxonomie éditoriale d'Azeroth Forever : rubriques et pages piliers.
 * Partagée par le site (menus, pages) et par le module de veille (classement des brouillons).
 */

export type Famille = "fil" | "guides" | "silfax";

export interface Rubrique {
  slug: string;
  nom: string;
  famille: Famille;
  description: string;
}

export const RUBRIQUES = [
  { slug: "actualites", nom: "Actualités", famille: "fil", description: "Annonces, dates, éditions : l'actualité de WoW Forever." },
  { slug: "patchs", nom: "Patchs et correctifs", famille: "fil", description: "Notes de mise à jour et correctifs, expliqués en français." },
  { slug: "videos", nom: "Vidéos", famille: "fil", description: "Bandes-annonces et vidéos officielles, présentées et commentées." },
  { slug: "communaute", nom: "Communauté", famille: "fil", description: "Ce qui anime les joueurs : découvertes, débats, événements." },
  { slug: "classes", nom: "Classes", famille: "guides", description: "Rôles, talents et équipement des neuf classes." },
  { slug: "races", nom: "Races", famille: "guides", description: "Races jouables, traits raciaux et combinaisons race et classe." },
  { slug: "quetes", nom: "Quêtes", famille: "guides", description: "Chaînes de quêtes, récompenses et pièges à éviter." },
  { slug: "donjons-raids", nom: "Donjons et raids", famille: "guides", description: "Nouveaux donjons, raids à 10 et 20 joueurs, stratégies." },
  { slug: "zones", nom: "Zones", famille: "guides", description: "Les terres d'Azeroth, anciennes et nouvelles." },
  { slug: "metiers", nom: "Métiers et économie", famille: "guides", description: "Métiers, hôtel des ventes et bons plans." },
  { slug: "jcj", nom: "JcJ", famille: "guides", description: "Champs de bataille et combats entre joueurs." },
  { slug: "lore", nom: "Histoire et lore", famille: "guides", description: "L'histoire d'Azeroth et de ses peuples." },
  { slug: "carnet", nom: "Le carnet de Silfax", famille: "silfax", description: "De 1 à 60, une semaine après l'autre." },
  { slug: "tests", nom: "Tests et avis", famille: "silfax", description: "Le regard de Silfax sur les éditions, addons et nouveautés." },
] as const satisfies readonly Rubrique[];

export type SlugRubrique = (typeof RUBRIQUES)[number]["slug"];

export const SLUGS_RUBRIQUES = RUBRIQUES.map((r) => r.slug) as [SlugRubrique, ...SlugRubrique[]];

export function trouverRubrique(slug: string): Rubrique | undefined {
  return RUBRIQUES.find((r) => r.slug === slug);
}

/**
 * Pages piliers : une page durable par classe, race, zone ou donjon.
 * Un article rattaché à un pilier apparaît dans la section « Derniers articles » de cette page.
 * La clé est le chemin de la page, sans barre initiale ni finale.
 */
export const PILIERS = [
  "classes/guerrier",
  "classes/paladin",
  "classes/chasseur",
  "classes/voleur",
  "classes/pretre",
  "classes/chaman",
  "classes/mage",
  "classes/demoniste",
  "classes/druide",
  "races/skyborne",
  "zones/mont-hyjal",
  "zones/rives-claires",
  "zones/ile-de-zephras",
  "zones/shendralar",
  "donjons/salle-des-thanes",
  "donjons/ruines-de-lordaeron",
  "donjons/excavations-les-paluns",
  "donjons/cite-de-dalaran",
  "guides/bien-demarrer",
  "guides/zones-de-depart",
  "guides/zones-par-niveau",
  "guides/liste-des-donjons",
] as const;

export type Pilier = (typeof PILIERS)[number];

export function estPilier(valeur: string | null | undefined): valeur is Pilier {
  return !!valeur && (PILIERS as readonly string[]).includes(valeur);
}

