/**
 * Réseaux sociaux : phrase d'appel à l'action et règles de chaque réseau.
 * La phrase est UNIQUE et identique partout (Facebook, Reels, X, Instagram, TikTok) : la modifier ici la change partout.
 */

/** Domaine affiché dans la phrase, tiré de SITE_URL (ex. « taverne-eternelle.fr »). */
export function domaineSite(): string {
  const url = (process.env.SITE_URL ?? "https://www.taverne-eternelle.fr").replace(/\/+$/, "");
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "taverne-eternelle.fr";
  }
}

/**
 * Phrase d'appel à l'action, ajoutée à chaque post. Sans domaine (`avecDomaine = false`) pour la Page Facebook en mode
 * sans lien : Facebook transforme un nom de domaine écrit en lien, qui compterait dans la limite de Meta One.
 */
export function phraseAppel(avecDomaine = true): string {
  const ou = avecDomaine ? domaineSite() : "notre site (bouton « Visiter le site » de la Page)";
  return `👉 Abonne-toi à la Taverne Éternelle pour ne rien rater de WoW Forever, et retrouve tous nos guides sur ${ou}`;
}

/**
 * Posts de la Page Facebook avec ou sans lien. Depuis Meta One (automne 2026), une Page non abonnée n'a que deux posts ou
 * commentaires avec lien externe par mois : par défaut, la Page publie sans lien (image, texte et renvoi vers le site par
 * son nom). FACEBOOK_LIENS=oui rétablit le lien (Page abonnée, ou limite levée). Les partages depuis un profil personnel
 * (bouton « Partager sur Facebook » des articles) gardent toujours le lien : ils ne sont pas limités.
 */
export function pageFacebookAvecLien(): boolean {
  return (process.env.FACEBOOK_LIENS ?? "").trim().toLowerCase() === "oui";
}

export const MOTS_DIESE = ["#WoWForever", "#WorldofWarcraft"];

export type Reseau = "facebook" | "page-facebook" | "reel" | "x" | "instagram" | "tiktok";

export const RESEAUX: Record<Reseau, { nom: string; limite: number; lienCliquable: boolean; actif: boolean }> = {
  facebook: { nom: "Facebook", limite: 63206, lienCliquable: true, actif: true },
  "page-facebook": { nom: "Page Facebook", limite: 63206, lienCliquable: false, actif: true },
  reel: { nom: "Reel Facebook", limite: 2200, lienCliquable: false, actif: true },
  x: { nom: "X", limite: 280, lienCliquable: true, actif: false },
  instagram: { nom: "Instagram", limite: 2200, lienCliquable: false, actif: true },
  tiktok: { nom: "TikTok", limite: 2200, lienCliquable: false, actif: true },
};
