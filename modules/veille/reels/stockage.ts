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
  await pool().query("DELETE FROM reels_demandes WHERE article_id = $1", [articleId]);
}

/** Vidéo déjà fabriquée, pour la servir publiquement (Instagram la télécharge à cette adresse). */
export async function lireVideoStockee(articleId: number): Promise<Buffer | null> {
  const { rows } = await pool().query<{ donnees: Buffer }>("SELECT donnees FROM reels_videos WHERE article_id = $1", [articleId]);
  return rows[0]?.donnees ?? null;
}

/*
 * Fabrication hors du site. ffmpeg demande plus de 200 Mo : lancé dans le conteneur du site, il le fait tomber
 * (« App faced an error »). Le téléchargement de l'éditeur dépose une demande ; la tâche planifiée veille:videos
 * (toutes les 10 minutes, conteneur à part) fabrique la vidéo et la garde en base.
 */

export interface EtatVideo {
  prete: boolean;
  demandeLe: Date | null;
  erreur: string | null;
}

export async function etatVideo(articleId: number): Promise<EtatVideo> {
  const { rows } = await pool().query<{ prete: boolean; demande_le: Date | null; erreur: string | null }>(
    `SELECT EXISTS (SELECT 1 FROM reels_videos WHERE article_id = $1) AS prete, d.demande_le, d.erreur
       FROM (SELECT 1) x LEFT JOIN reels_demandes d ON d.article_id = $1`,
    [articleId],
  );
  return { prete: rows[0].prete, demandeLe: rows[0].demande_le, erreur: rows[0].erreur };
}

/** Demande (ou redemande, après un échec) la fabrication de la vidéo d'un article. */
export async function demanderVideo(articleId: number): Promise<void> {
  await pool().query(
    `INSERT INTO reels_demandes (article_id) VALUES ($1)
     ON CONFLICT (article_id) DO UPDATE SET demande_le = now(), erreur = NULL`,
    [articleId],
  );
}

/**
 * Vidéos à fabriquer : celles demandées depuis l'éditeur, puis celles des articles en ligne depuis moins de 7 jours
 * (le relais en aura besoin). Un article en échec attend une nouvelle demande.
 */
export async function videosAFabriquer(limite: number): Promise<{ id: number; slug: string; statut: string }[]> {
  const { rows } = await pool().query<{ id: number; slug: string; statut: string }>(
    `SELECT a.id, a.slug, a.statut FROM articles a
       LEFT JOIN reels_demandes d ON d.article_id = a.id
      WHERE a.statut <> 'supprime'
        AND NOT EXISTS (SELECT 1 FROM reels_videos v WHERE v.article_id = a.id)
        AND (d.article_id IS NOT NULL AND d.erreur IS NULL
             OR d.article_id IS NULL AND a.statut = 'publie' AND a.publie_le > now() - interval '7 days')
      ORDER BY d.demande_le ASC NULLS LAST, a.publie_le DESC
      LIMIT $1`,
    [limite],
  );
  return rows;
}

export async function videoFabriquee(articleId: number): Promise<void> {
  await pool().query("DELETE FROM reels_demandes WHERE article_id = $1", [articleId]);
}

export async function videoEchouee(articleId: number, erreur: string): Promise<void> {
  await pool().query(
    `INSERT INTO reels_demandes (article_id, erreur) VALUES ($1, $2)
     ON CONFLICT (article_id) DO UPDATE SET erreur = EXCLUDED.erreur`,
    [articleId, erreur.slice(0, 1000)],
  );
}
