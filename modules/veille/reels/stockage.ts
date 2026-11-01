import { pool } from "../db/pool";
import { config } from "../config";
import { videoReel } from "./video";

/**
 * Vidéo du Reel d'un article : fabriquée une seule fois (à partir de l'image /articles/<slug>/reel/), puis gardée en base
 * et réutilisée pour Facebook, Instagram, TikTok et le téléchargement.
 */
export async function obtenirVideo(article: { id: number; slug: string }, opts: { origine?: string; cookie?: string } = {}): Promise<Buffer> {
  const { rows } = await pool().query<{ donnees: Buffer }>("SELECT donnees FROM reels_videos WHERE article_id = $1", [article.id]);
  if (rows[0]) return rows[0].donnees;
  const video = await videoReel(`${opts.origine ?? config.siteUrl()}/articles/${article.slug}/reel/`, opts.cookie);
  await pool().query(
    "INSERT INTO reels_videos (article_id, donnees) VALUES ($1, $2) ON CONFLICT (article_id) DO UPDATE SET donnees = EXCLUDED.donnees, cree_le = now()",
    [article.id, video],
  );
  return video;
}

/** À appeler quand l'article change (titre, image…) : la vidéo sera refabriquée au prochain besoin. */
export async function oublierVideo(articleId: number): Promise<void> {
  await pool().query("DELETE FROM reels_videos WHERE article_id = $1", [articleId]);
}

/** Vidéo déjà fabriquée, pour la servir publiquement (Instagram la télécharge à cette adresse). */
export async function lireVideoStockee(articleId: number): Promise<Buffer | null> {
  const { rows } = await pool().query<{ donnees: Buffer }>("SELECT donnees FROM reels_videos WHERE article_id = $1", [articleId]);
  return rows[0]?.donnees ?? null;
}
