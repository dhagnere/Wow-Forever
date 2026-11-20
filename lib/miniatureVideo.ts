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

/**
 * Titre d'une vidéo de la chaîne prêt à afficher : un marqueur de gabarit resté dans le titre YouTube
 * (« [TITRE : Journal de Jobwow … ] ») est retiré, pour ne jamais montrer de texte provisoire sur le site.
 * Le titre est à corriger dans YouTube Studio ; ceci n'est qu'un filet de sécurité.
 */
export function titreAffichable(titre: string): string {
  const propre = titre
    .replace(/\[\s*TITRE\s*:?\s*/gi, "")
    .replace(/\s*…?\s*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return propre || titre.trim();
}
