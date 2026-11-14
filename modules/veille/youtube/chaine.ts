import Parser from "rss-parser";
import { texteBrut } from "../rendu/html";

/**
 * Vidéos de la chaîne YouTube de la Taverne, lues dans le flux public de la chaîne (15 dernières vidéos) :
 * ni clé d'API, ni quota, ni compte relié. La page du site n'intègre aucun lecteur : elle renvoie vers YouTube.
 */

export interface VideoChaine {
  id: string;
  titre: string;
  publieLe: string;
  lien: string;
  /** Début de la description, en texte brut, sans la liste des chapitres. */
  resume: string;
}

/** Identifiant de chaîne YouTube (« UC… », 24 caractères). */
export const idChaineValide = (id: string): boolean => /^UC[\w-]{22}$/.test(id);

type Entree = { id?: string; title?: string; link?: string; isoDate?: string; pubDate?: string; videoId?: string; media?: { "media:description"?: string[] } };
const lecteur = new Parser<Record<string, never>, Entree>({ customFields: { item: [["yt:videoId", "videoId"], ["media:group", "media"]] } });

/** Résumé : le texte avant la liste des chapitres, ramené à 240 caractères. */
export function resumeDescription(description: string): string {
  const avant = description.split(/\n\s*(?:Chapitres|Chapters)\s*:|\n\s*0:00\s/)[0];
  const t = texteBrut(avant).replace(/\s+/g, " ").trim();
  return t.length <= 240 ? t : `${t.slice(0, 239).replace(/\s+\S*$/, "")}…`;
}

export async function videosDepuisFlux(xml: string): Promise<VideoChaine[]> {
  const flux = await lecteur.parseString(xml);
  return (flux.items ?? []).flatMap((e) => {
    const id = e.videoId ?? e.id?.replace(/^yt:video:/, "");
    if (!id || !/^[\w-]{6,20}$/.test(id) || !e.title) return [];
    return [{
      id,
      titre: e.title,
      publieLe: e.isoDate ?? e.pubDate ?? "",
      lien: `https://www.youtube.com/watch?v=${id}`,
      resume: resumeDescription(e.media?.["media:description"]?.[0] ?? ""),
    }];
  });
}

/** Étiquette du cache des vidéos de la chaîne : « Rafraîchir » dans /admin/videos la vide. */
export const TAG_VIDEOS_CHAINE = "videos-chaine";

/** Flux de la chaîne, puis, s'il ne répond pas ou reste vide, celui de sa liste « Mises en ligne » (UU…), parfois plus à jour. */
const fluxDe = (chaineId: string) => [
  `https://www.youtube.com/feeds/videos.xml?channel_id=${chaineId}`,
  `https://www.youtube.com/feeds/videos.xml?playlist_id=UU${chaineId.slice(2)}`,
];

/**
 * Dernières vidéos publiques de la chaîne ; liste vide si la chaîne n'est pas réglée ou si YouTube ne répond pas.
 * Gardées 10 minutes en cache (YouTube met lui-même de quelques minutes à une heure à ajouter une vidéo à son flux).
 */
export async function videosChaine(chaineId: string): Promise<VideoChaine[]> {
  if (!idChaineValide(chaineId)) return [];
  for (const url of fluxDe(chaineId)) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 600, tags: [TAG_VIDEOS_CHAINE] } } as RequestInit);
      if (!r.ok) continue;
      const videos = await videosDepuisFlux(await r.text());
      if (videos.length) return videos;
    } catch {
      // flux suivant
    }
  }
  return [];
}

export interface EtatFlux { url: string; statut: number | null; videos: number; titres: string[]; erreur: string | null }

/** Diagnostic, sans cache, des deux flux de la chaîne (page /admin/videos) : réponse de YouTube et vidéos lues. */
export async function etatFluxChaine(chaineId: string): Promise<EtatFlux[]> {
  if (!idChaineValide(chaineId)) return [{ url: "", statut: null, videos: 0, titres: [], erreur: `Identifiant de chaîne invalide : « ${chaineId} ».` }];
  return Promise.all(fluxDe(chaineId).map(async (url): Promise<EtatFlux> => {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (!r.ok) return { url, statut: r.status, videos: 0, titres: [], erreur: `YouTube répond ${r.status}.` };
      const v = await videosDepuisFlux(await r.text());
      return { url, statut: r.status, videos: v.length, titres: v.slice(0, 5).map((x) => x.titre), erreur: null };
    } catch (e) {
      return { url, statut: null, videos: 0, titres: [], erreur: e instanceof Error ? e.message : "YouTube ne répond pas." };
    }
  }));
}
