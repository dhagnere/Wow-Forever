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

/** Dernières vidéos de la chaîne ; liste vide si la chaîne n'est pas réglée ou si YouTube ne répond pas. */
export async function videosChaine(chaineId: string): Promise<VideoChaine[]> {
  if (!idChaineValide(chaineId)) return [];
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${chaineId}`, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    } as RequestInit);
    if (!r.ok) return [];
    return await videosDepuisFlux(await r.text());
  } catch {
    return [];
  }
}
