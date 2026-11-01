export const SITE = {
  nom: "Azeroth Forever",
  signature: "WoW Forever en français, de 1 à 60",
  auteur: "Silfax",
  url: (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/",
  /** Conteneur Google Tag Manager. NEXT_PUBLIC_GTM_ID=off le désactive (développement local, par exemple). */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID === "off" ? "" : (process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KMGBD5FD"),
  mentionBlizzard:
    "World of Warcraft et Blizzard Entertainment sont des marques de Blizzard Entertainment, Inc. Azeroth Forever est un site de fans non officiel, sans lien avec Blizzard.",
};

const FORMAT_JOUR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
const FORMAT_COURT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

export function dateLongue(d: Date | string): string {
  return FORMAT_JOUR.format(new Date(d));
}

export function dateCourte(d: Date | string): string {
  return FORMAT_COURT.format(new Date(d));
}

export function tempsDeLecture(markdown: string): number {
  return Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 220));
}
