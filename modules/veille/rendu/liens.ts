/**
 * Liens « version française » des sources citées.
 * 1. Version officielle en français quand le site en publie une (pages Blizzard en fr-fr).
 * 2. Sinon, la page traduite à la volée par Google Traduction (le site d'origine reste crédité).
 * 3. Les pages déjà en français, les vidéos et les liens Google News restent tels quels.
 */

export type ModeLien = "original" | "officiel" | "traduction";

export interface LienSource {
  url: string;
  mode: ModeLien;
}

const NOMS_LANGUES: Record<string, string> = {
  fr: "français", en: "anglais", de: "allemand", es: "espagnol", ko: "coréen", ru: "russe",
};

export function nomLangue(code: string | undefined): string {
  return (code && NOMS_LANGUES[code]) || "langue étrangère";
}

/** Sites qui ne passent pas par la traduction automatique : vidéos, redirections Google News. */
const SANS_TRADUCTION = /(^|\.)(youtube\.com|youtu\.be|news\.google\.com)$/i;

/** Adresse Google Traduction : sous-domaine translate.goog, paramètres _x_tr_*. */
export function urlTraduite(url: string): string {
  const u = new URL(url);
  const hote = u.hostname.replace(/-/g, "--").replace(/\./g, "-");
  const params = new URLSearchParams(u.search);
  params.set("_x_tr_sl", "auto");
  params.set("_x_tr_tl", "fr");
  params.set("_x_tr_hl", "fr");
  return `https://${hote}.translate.goog${u.pathname}?${params.toString()}${u.hash}`;
}

export function lienFrancais(url: string, langue: string | undefined): LienSource {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return { url, mode: "original" };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return { url, mode: "original" };

  // Blizzard publie ses actualités et pages de jeu en français : /fr-fr/ remplace la locale d'origine.
  if (/(^|\.)blizzard\.com$/i.test(u.hostname) && /^\/[a-z]{2}-[a-z]{2}(\/|$)/i.test(u.pathname)) {
    if (/^\/fr-fr(\/|$)/i.test(u.pathname)) return { url, mode: "original" };
    u.pathname = u.pathname.replace(/^\/[a-z]{2}-[a-z]{2}/i, "/fr-fr");
    return { url: u.toString(), mode: "officiel" };
  }

  if (langue === "fr" || SANS_TRADUCTION.test(u.hostname)) return { url, mode: "original" };
  return { url: urlTraduite(url), mode: "traduction" };
}
