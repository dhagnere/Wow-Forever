export const SITE = {
  nom: "La Taverne Éternelle",
  signature: "L'actualité de WoW Forever, servie chaque matin par Jobwow",
  /** Signature de fin d'article. */
  signatureArticle: "— Jobwow, au comptoir de la Taverne",
  auteur: "Jobwow",
  url: (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/",
  /** Conteneur Google Tag Manager. NEXT_PUBLIC_GTM_ID=off le désactive (développement local, par exemple). */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID === "off" ? "" : (process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KMGBD5FD"),
  /** Discord de la Taverne (lien d'invitation) : sans valeur, les boutons Discord ne s'affichent pas. */
  discord: process.env.NEXT_PUBLIC_DISCORD_URL ?? "",
  /** Liens de dons (Tipeee, Ko-fi…). Sans valeur, la page Soutenir annonce une ouverture prochaine. */
  donPonctuel: process.env.NEXT_PUBLIC_DON_PONCTUEL_URL ?? "",
  donMensuel: process.env.NEXT_PUBLIC_DON_MENSUEL_URL ?? "",
  plateformeDon: process.env.NEXT_PUBLIC_DON_PLATEFORME ?? "",
  contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@taverne-eternelle.fr",
  mentionBlizzard:
    "Site de fans indépendant, non affilié à Blizzard Entertainment. World of Warcraft et Warcraft sont des marques de Blizzard Entertainment.",
};

const FORMAT_JOUR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
const FORMAT_COURT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

export function dateLongue(d: Date | string): string {
  // « 1er novembre » et non « 1 novembre ».
  return FORMAT_JOUR.format(new Date(d)).replace(/^1 /, "1er ");
}

export function dateCourte(d: Date | string): string {
  return FORMAT_COURT.format(new Date(d)).replace(/^1 /, "1er ");
}

export function tempsDeLecture(markdown: string): number {
  return Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 220));
}
