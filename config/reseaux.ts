/**
 * Réseaux sociaux : phrase d'appel à l'action et règles de chaque réseau.
 * La phrase est UNIQUE et identique partout (Facebook, Reels, X, Instagram, TikTok) : la modifier ici la change partout.
 */

/** Domaine affiché dans la phrase, tiré de SITE_URL (ex. « azeroth-forever.fr »). */
export function domaineSite(): string {
  const url = (process.env.SITE_URL ?? "https://azeroth-forever.fr").replace(/\/+$/, "");
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "azeroth-forever.fr";
  }
}

/** Phrase d'appel à l'action, ajoutée à chaque post. */
export function phraseAppel(): string {
  return `👉 Abonne-toi à Azeroth Forever pour ne rien rater de WoW Forever, et retrouve tous nos guides sur ${domaineSite()}`;
}

export const MOTS_DIESE = ["#WoWForever", "#WorldofWarcraft"];

export type Reseau = "facebook" | "reel" | "x" | "instagram" | "tiktok";

export const RESEAUX: Record<Reseau, { nom: string; limite: number; lienCliquable: boolean; actif: boolean }> = {
  facebook: { nom: "Facebook", limite: 63206, lienCliquable: true, actif: true },
  reel: { nom: "Reel Facebook", limite: 2200, lienCliquable: false, actif: true },
  x: { nom: "X", limite: 280, lienCliquable: true, actif: false },
  instagram: { nom: "Instagram", limite: 2200, lienCliquable: false, actif: true },
  tiktok: { nom: "TikTok", limite: 2200, lienCliquable: false, actif: true },
};
