/**
 * Classement des visites, sans réseau ni base : origine, appareil, robots, empreinte du jour.
 * Fonctions pures, testées.
 */
import { PAYS_PAR_FUSEAU } from "./fuseaux";
import { createHash } from "node:crypto";

export const SOURCES = ["google", "moteurs", "facebook", "instagram", "tiktok", "x", "discord", "lettre", "sites", "direct", "interne"] as const;
export type Source = (typeof SOURCES)[number];

export const NOMS_SOURCES: Record<Source, string> = {
  google: "Google", moteurs: "Autres moteurs", facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", x: "X",
  discord: "Discord", lettre: "La Lettre", sites: "Autres sites", direct: "Accès direct", interne: "Navigation interne",
};

const PAR_UTM: [RegExp, Source][] = [
  [/^(facebook|fb)$/i, "facebook"], [/^(instagram|ig)$/i, "instagram"], [/^tiktok$/i, "tiktok"], [/^(x|twitter)$/i, "x"],
  [/^discord$/i, "discord"], [/^(lettre|newsletter|brevo|sendinblue|email|courriel)$/i, "lettre"], [/^google$/i, "google"],
];

const PAR_HOTE: [RegExp, Source][] = [
  [/(^|\.)google\.[a-z.]+$/i, "google"],
  [/(^|\.)(bing\.com|duckduckgo\.com|qwant\.com|ecosia\.org|yahoo\.[a-z.]+|search\.brave\.com|yandex\.[a-z.]+)$/i, "moteurs"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/i, "facebook"],
  [/(^|\.)instagram\.com$/i, "instagram"], [/(^|\.)tiktok\.com$/i, "tiktok"], [/(^|\.)(x\.com|twitter\.com|t\.co)$/i, "x"],
  [/(^|\.)(discord\.com|discord\.gg|discordapp\.com)$/i, "discord"],
  [/(^|\.)(brevo\.com|sendibt\d*\.com|sendinblue\.com|r\.\w+\.brevo\.com)$/i, "lettre"],
];

/** Origine d'une page vue : le marqueur utm_source l'emporte, puis le site d'où vient le visiteur. */
export function classerSource(referent: string | undefined, utmSource: string | undefined, hoteSite: string): Source {
  if (utmSource) {
    for (const [m, s] of PAR_UTM) if (m.test(utmSource.trim())) return s;
  }
  if (!referent) return "direct";
  let hote: string;
  try {
    hote = new URL(referent).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  if (hote === hoteSite.toLowerCase() || hote.replace(/^www\./, "") === hoteSite.toLowerCase().replace(/^www\./, "")) return "interne";
  for (const [m, s] of PAR_HOTE) if (m.test(hote)) return s;
  return "sites";
}

export function classerAppareil(ua: string): "mobile" | "tablette" | "ordinateur" {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablette";
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) return "mobile";
  return "ordinateur";
}

export function estRobot(ua: string): boolean {
  return !ua || /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|headless|curl|wget|python|node-fetch|axios|monitor/i.test(ua);
}

/** Jour à Paris, « 2026-11-03 ». */
export function jourParis(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/**
 * Code du visiteur pour la journée : empreinte salée de l'adresse IP et du navigateur, qui change chaque jour.
 * L'adresse IP n'est jamais enregistrée ; deux jours de visite ne peuvent pas être reliés.
 */
export function empreinteDuJour(sel: string, ip: string, ua: string, d = new Date()): string {
  return createHash("sha256").update(`${sel}|${jourParis(d)}|${ip}|${ua}`).digest("hex").slice(0, 20);
}

/** Chemin mesuré : pages publiques seulement, sans paramètres, borné. */
export function cheminMesurable(chemin: unknown): string | null {
  if (typeof chemin !== "string" || !chemin.startsWith("/") || chemin.startsWith("//")) return null;
  const propre = chemin.split(/[?#]/)[0].slice(0, 300);
  // /guildes/modifier/… contient le lien secret d'une fiche : jamais mesuré.
  if (/^\/(admin|reseaux|api|_next|medias)(\/|$)/.test(propre) || propre.startsWith("/guildes/modifier") || propre.startsWith("/en/guilds/edit")) return null;
  return propre;
}

/** Pays estimé d'après le fuseau horaire du navigateur (« Europe/Brussels » → BE) ; '' si inconnu. Aucune adresse IP. */
export function paysDuFuseau(fuseau: unknown): string {
  return typeof fuseau === "string" && fuseau.length < 60 ? PAYS_PAR_FUSEAU[fuseau] ?? "" : "";
}

/** Langue du navigateur, réduite à sa forme courte (« fr-FR », « fr », « en-US ») ; '' sinon. */
export function langueMesurable(langue: unknown): string {
  if (typeof langue !== "string") return "";
  const m = /^([a-z]{2,3})(?:-([A-Za-z]{2}))?/.exec(langue.trim());
  return m ? (m[2] ? `${m[1]}-${m[2].toUpperCase()}` : m[1]) : "";
}

/**
 * Terme de recherche gardé pour les statistiques : minuscules, espaces réduits, 2 à 60 caractères, lettres, chiffres et
 * ponctuation simple. Une adresse électronique, un lien ou un nombre de cinq chiffres ou plus (téléphone, code) est refusé.
 */
export function termeMesurable(terme: unknown): string | null {
  if (typeof terme !== "string") return null;
  const t = terme.normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
  if (t.length < 2 || t.length > 60) return null;
  if (/[@<>{}\\]|https?:|www\.|\d{5,}/.test(t)) return null;
  if (!/^[\p{L}\p{N} '’:,.!?()&+-]+$/u.test(t)) return null;
  return t;
}
