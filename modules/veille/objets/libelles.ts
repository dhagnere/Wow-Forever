/**
 * Libellés français des codes de la base d'objets (qualité, emplacement, lien, classes, prix).
 * Les codes sont ceux des fichiers du jeu.
 */

export interface Qualite { nom: string; couleur: string }

/** Couleurs du jeu, éclaircies pour le bleu et le violet afin de rester lisibles sur le fond sombre du site (contraste 4,5:1). */
export const QUALITES: Record<number, Qualite> = {
  0: { nom: "Médiocre", couleur: "#9d9d9d" },
  1: { nom: "Classique", couleur: "#ffffff" },
  2: { nom: "Bonne qualité", couleur: "#1eff00" },
  3: { nom: "Rare", couleur: "#2f8ff0" },
  4: { nom: "Épique", couleur: "#b56cf5" },
  5: { nom: "Légendaire", couleur: "#ff8000" },
  6: { nom: "Artefact", couleur: "#e6cc80" },
  7: { nom: "Héritage", couleur: "#00ccff" },
};

/** Noms anglais des qualités (version anglaise du site), tels qu'ils figurent dans le jeu. */
const QUALITES_EN: Record<number, string> = {
  0: "Poor", 1: "Common", 2: "Uncommon", 3: "Rare", 4: "Epic", 5: "Legendary", 6: "Artifact", 7: "Heirloom",
};

export type LangueLibelle = "fr" | "en";

export function qualite(code: number, langue: LangueLibelle = "fr"): Qualite {
  const q = QUALITES[code] ?? QUALITES[1];
  return langue === "en" ? { ...q, nom: QUALITES_EN[code] ?? QUALITES_EN[1] } : q;
}

/** Les qualités dans la langue voulue, pour les listes de filtres. */
export function qualites(langue: LangueLibelle = "fr"): [number, Qualite][] {
  return Object.keys(QUALITES).map((k) => [Number(k), qualite(Number(k), langue)]);
}

/** Emplacement d'équipement (InventoryType). 0 : objet non équipable. */
export const EMPLACEMENTS: Record<number, string> = {
  1: "Tête", 2: "Cou", 3: "Épaules", 4: "Chemise", 5: "Torse", 6: "Taille", 7: "Jambes", 8: "Pieds",
  9: "Poignets", 10: "Mains", 11: "Doigt", 12: "Bijou", 13: "Une main", 14: "Main gauche", 15: "À distance",
  16: "Dos", 17: "Deux mains", 18: "Sac", 19: "Tabard", 20: "Torse", 21: "Main droite", 22: "Main gauche",
  23: "Tenu(e) en main gauche", 24: "Projectile", 25: "Armes de jet", 26: "À distance", 27: "Carquois", 28: "Relique",
};

const EMPLACEMENTS_EN: Record<number, string> = {
  1: "Head", 2: "Neck", 3: "Shoulder", 4: "Shirt", 5: "Chest", 6: "Waist", 7: "Legs", 8: "Feet",
  9: "Wrist", 10: "Hands", 11: "Finger", 12: "Trinket", 13: "One-Hand", 14: "Off Hand", 15: "Ranged",
  16: "Back", 17: "Two-Hand", 18: "Bag", 19: "Tabard", 20: "Chest", 21: "Main Hand", 22: "Off Hand",
  23: "Held In Off-hand", 24: "Projectile", 25: "Thrown", 26: "Ranged", 27: "Quiver", 28: "Relic",
};

export function emplacement(code: number, langue: LangueLibelle = "fr"): string | null {
  return (langue === "en" ? EMPLACEMENTS_EN : EMPLACEMENTS)[code] ?? null;
}

export const LIENS: Record<number, string> = {
  1: "Lié quand ramassé",
  2: "Lié quand équipé",
  3: "Lié quand utilisé",
  4: "Objet de quête",
  5: "Objet de quête",
};

const LIENS_EN: Record<number, string> = {
  1: "Binds when picked up", 2: "Binds when equipped", 3: "Binds when used", 4: "Quest Item", 5: "Quest Item",
};

export function lien(code: number, langue: LangueLibelle = "fr"): string | null {
  return (langue === "en" ? LIENS_EN : LIENS)[code] ?? null;
}

/** Les neuf classes de Forever : bit du masque AllowableClass et page du site. */
export const CLASSES_OBJETS = [
  { bit: 1, nom: "Guerrier", slug: "guerrier" },
  { bit: 2, nom: "Paladin", slug: "paladin" },
  { bit: 4, nom: "Chasseur", slug: "chasseur" },
  { bit: 8, nom: "Voleur", slug: "voleur" },
  { bit: 16, nom: "Prêtre", slug: "pretre" },
  { bit: 64, nom: "Chaman", slug: "chaman" },
  { bit: 128, nom: "Mage", slug: "mage" },
  { bit: 256, nom: "Démoniste", slug: "demoniste" },
  { bit: 1024, nom: "Druide", slug: "druide" },
] as const;

/**
 * Classes autorisées à utiliser l'objet. Tableau vide : toutes les classes.
 * Le masque du jeu couvre aussi des classes absentes de Forever ; seules les neuf classes comptent.
 */
export function classesAutorisees(masque: number): (typeof CLASSES_OBJETS)[number][] {
  if (masque === -1 || masque === 0) return [];
  const retenues = CLASSES_OBJETS.filter((c) => (masque & c.bit) !== 0);
  return retenues.length === CLASSES_OBJETS.length || retenues.length === 0 ? [] : retenues;
}

export interface Prix { or: number; argent: number; cuivre: number }

/** Prix en pièces de cuivre, découpé en or, argent et cuivre. */
export function decouperPrix(cuivre: number): Prix {
  const c = Math.max(0, Math.floor(cuivre));
  return { or: Math.floor(c / 10000), argent: Math.floor((c % 10000) / 100), cuivre: c % 100 };
}

/** « 25 po 53 pa 55 pc » (en anglais « 25g 53s 55c ») ; les montants nuls sont omis. */
export function prixEnTexte(cuivre: number, langue: LangueLibelle = "fr"): string {
  const p = decouperPrix(cuivre);
  const [o, a, c] = langue === "en" ? ["g", "s", "c"] : [" po", " pa", " pc"];
  const morceaux = [p.or ? `${p.or}${o}` : "", p.argent ? `${p.argent}${a}` : "", p.cuivre ? `${p.cuivre}${c}` : ""].filter(Boolean);
  return morceaux.join(" ") || `0${c}`;
}

/** Vitesse d'arme : 1900 ms → « 1,90 » (« 1.90 » en anglais). */
export function vitesse(ms: number, langue: LangueLibelle = "fr"): string {
  return (ms / 1000).toLocaleString(langue === "en" ? "en-GB" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Nom de catégorie lisible : les catégories abandonnées par le jeu sont marquées « (OBSOLETE) ». */
export function nomCategorie(nom: string): string {
  return nom.replace(/\s*\(OBSOLETE\)\s*$/i, "").trim();
}
