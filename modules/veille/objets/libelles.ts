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

export function qualite(code: number): Qualite {
  return QUALITES[code] ?? QUALITES[1];
}

/** Emplacement d'équipement (InventoryType). 0 : objet non équipable. */
export const EMPLACEMENTS: Record<number, string> = {
  1: "Tête", 2: "Cou", 3: "Épaules", 4: "Chemise", 5: "Torse", 6: "Taille", 7: "Jambes", 8: "Pieds",
  9: "Poignets", 10: "Mains", 11: "Doigt", 12: "Bijou", 13: "Une main", 14: "Main gauche", 15: "À distance",
  16: "Dos", 17: "Deux mains", 18: "Sac", 19: "Tabard", 20: "Torse", 21: "Main droite", 22: "Main gauche",
  23: "Tenu(e) en main gauche", 24: "Projectile", 25: "Armes de jet", 26: "À distance", 27: "Carquois", 28: "Relique",
};

export function emplacement(code: number): string | null {
  return EMPLACEMENTS[code] ?? null;
}

export const LIENS: Record<number, string> = {
  1: "Lié quand ramassé",
  2: "Lié quand équipé",
  3: "Lié quand utilisé",
  4: "Objet de quête",
  5: "Objet de quête",
};

export function lien(code: number): string | null {
  return LIENS[code] ?? null;
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

/** « 25 po 53 pa 55 pc » ; les montants nuls sont omis. */
export function prixEnTexte(cuivre: number): string {
  const p = decouperPrix(cuivre);
  const morceaux = [p.or ? `${p.or} po` : "", p.argent ? `${p.argent} pa` : "", p.cuivre ? `${p.cuivre} pc` : ""].filter(Boolean);
  return morceaux.join(" ") || "0 pc";
}

/** Vitesse d'arme : 1900 ms → « 1,90 ». */
export function vitesse(ms: number): string {
  return (ms / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Nom de catégorie lisible : les catégories abandonnées par le jeu sont marquées « (OBSOLETE) ». */
export function nomCategorie(nom: string): string {
  return nom.replace(/\s*\(OBSOLETE\)\s*$/i, "").trim();
}
