import "server-only";

/**
 * Images de Wikimedia Commons sous licence libre, cherchées depuis l'éditeur (/admin/veille/<id>).
 * Seules les licences qui permettent la réutilisation sur le site sont gardées (domaine public, CC0, CC BY, CC BY-SA) ;
 * l'auteur et la licence partent dans le crédit de l'image. Le choix reste manuel : rien n'est pris automatiquement,
 * et l'image passe, comme un envoi, par la case de déclaration et par enregistrerImage (réencodage, métadonnées retirées).
 */

import { creditWikimedia, licenceLibre, texteBrut } from "./wikimediaLicences";

export { creditWikimedia, licenceLibre, texteBrut };

const API = "https://commons.wikimedia.org/w/api.php";
/** Wikimedia demande un User-Agent qui identifie l'outil et le moyen de joindre son auteur. */
const AGENT = "LaTaverneEternelle/1.0 (https://www.taverne-eternelle.fr/contact/)";
/** Les fichiers ne se téléchargent que depuis les serveurs d'images de Wikimedia. */
const HOTES_IMAGES = new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);

export interface ImageWikimedia {
  /** « File:… », la seule valeur renvoyée par le formulaire (préfixée de « wikimedia: »). */
  titre: string;
  nom: string;
  apercu: string;
  page: string;
  auteur: string;
  licence: string;
  largeur: number;
  hauteur: number;
  description: string;
}

type InfoImage = {
  thumburl?: string; url?: string; descriptionurl?: string; width?: number; height?: number; mime?: string;
  extmetadata?: Record<string, { value?: string }>;
};

function versImage(titre: string, info: InfoImage): ImageWikimedia | null {
  const m = info.extmetadata ?? {};
  const licence = texteBrut(m.LicenseShortName?.value, 60);
  if (!licence || !licenceLibre(licence)) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(info.mime ?? "")) return null;
  const apercu = info.thumburl ?? info.url;
  if (!apercu) return null;
  return {
    titre,
    nom: titre.replace(/^File:/, "").replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " "),
    apercu,
    page: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(titre)}`,
    auteur: texteBrut(m.Artist?.value, 80),
    licence,
    largeur: info.width ?? 0,
    hauteur: info.height ?? 0,
    description: texteBrut(m.ImageDescription?.value, 150),
  };
}

async function appeler(params: Record<string, string>): Promise<{ query?: { pages?: Record<string, { title: string; imageinfo?: InfoImage[] }> } }> {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "1", origin: "*", ...params })}`;
  const r = await fetch(url, { headers: { "User-Agent": AGENT }, signal: AbortSignal.timeout(15_000), cache: "no-store" });
  if (!r.ok) throw new Error(`Wikimedia Commons a répondu ${r.status}.`);
  return r.json();
}

const INFOS = {
  prop: "imageinfo",
  iiprop: "url|extmetadata|mime|size",
  iiextmetadatafilter: "LicenseShortName|Artist|ImageDescription",
};

/** Recherche d'images libres (24 au plus), les plus grandes d'abord ; les fichiers trop petits pour un en-tête sont écartés. */
export async function chercherWikimedia(terme: string, largeurMin = 800): Promise<ImageWikimedia[]> {
  const q = terme.trim().slice(0, 100);
  if (q.length < 2) return [];
  const d = await appeler({
    action: "query", generator: "search", gsrnamespace: "6", gsrsearch: `${q} filetype:bitmap`, gsrlimit: "40", iiurlwidth: "480", ...INFOS,
  });
  return Object.values(d.query?.pages ?? {})
    .map((p) => (p.imageinfo?.[0] ? versImage(p.title, p.imageinfo[0]) : null))
    .filter((i): i is ImageWikimedia => !!i && i.largeur >= largeurMin)
    .slice(0, 24);
}

/**
 * Relit une image d'après son titre (la valeur du formulaire, jamais une adresse fournie par le navigateur)
 * et télécharge sa version de 1600 pixels de large au plus. Refuse une licence non libre ou un autre serveur.
 */
export async function telechargerWikimedia(titre: string, maxOctets: number): Promise<{ image: ImageWikimedia; octets: Buffer }> {
  if (!/^File:[^|#<>[\]{}]{1,240}$/.test(titre)) throw new Error("Image Wikimedia invalide.");
  const d = await appeler({ action: "query", titles: titre, iiurlwidth: "1600", ...INFOS });
  const page = Object.values(d.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  const image = info ? versImage(page.title, info) : null;
  if (!info || !image) throw new Error("Image introuvable sur Wikimedia Commons, ou licence non libre.");
  const adresse = new URL(info.thumburl ?? info.url ?? "");
  if (adresse.protocol !== "https:" || !HOTES_IMAGES.has(adresse.hostname)) throw new Error("Adresse d'image refusée.");
  const r = await fetch(adresse, { headers: { "User-Agent": AGENT }, signal: AbortSignal.timeout(30_000), cache: "no-store" });
  if (!r.ok) throw new Error(`Téléchargement refusé par Wikimedia (${r.status}).`);
  const octets = Buffer.from(await r.arrayBuffer());
  if (octets.length > maxOctets) throw new Error("Image trop lourde.");
  return { image, octets };
}
