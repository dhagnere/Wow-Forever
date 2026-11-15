import type { VideoChaine } from "@/modules/veille";
import { VIDEOS_PREPAREES, type VideoPreparee } from "@/content/videos-preparees";
import { prepareeDe } from "@/lib/videosPreparees";

/**
 * Image d'une vidéo de la chaîne : la miniature gardée par le site quand la vidéo a été préparée ici, sinon celle de
 * YouTube servie par le site (/carnet/videos/miniature/<id>/). Jamais une adresse de Google dans la page.
 */
export function miniatureDe(video: Pick<VideoChaine, "id" | "titre">, preparees: VideoPreparee[] = VIDEOS_PREPAREES): string {
  return prepareeDe(video, preparees)?.miniature ?? `/carnet/videos/miniature/${encodeURIComponent(video.id)}/`;
}
