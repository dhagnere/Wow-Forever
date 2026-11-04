import { createHash } from "node:crypto";
import { pool } from "../db/pool";
import type { Article } from "../types";

/**
 * Version anglaise des articles : table articles_en, liée à l'article français. Un article anglais n'est visible que
 * si l'article français est en ligne (même garde-fou de l'avis), et son avis est la traduction de celui de Jobwow.
 */

export interface Traduction {
  articleId: number;
  titre: string;
  chapo: string;
  corps: string;
  avis: string;
  description: string;
  etiquettes: string[];
  /** Légende de l'image d'en-tête, traduite. */
  legende: string;
  empreinte: string;
  manuel: boolean;
  traduitLe: Date;
  erreur: string | null;
}

/** Condensé des champs français traduits : s'il change, la traduction est à refaire. */
export function empreinte(a: Pick<Article, "titre" | "chapo" | "corps" | "avisSilfax" | "description" | "etiquettes"> & { image?: Article["image"] }): string {
  // La légende n'entre dans l'empreinte que si elle existe : les traductions faites avant elle restent à jour.
  const legende = a.image?.legende?.trim();
  return createHash("sha256").update(JSON.stringify([a.titre, a.chapo, a.corps, a.avisSilfax, a.description, a.etiquettes, ...(legende ? [legende] : [])])).digest("hex").slice(0, 32);
}

interface LigneEn {
  article_id: number; titre: string; chapo: string; corps: string; avis: string; description: string; etiquettes: string[]; legende: string;
  empreinte: string; manuel: boolean; traduit_le: Date; erreur: string | null;
}
const versTraduction = (l: LigneEn): Traduction => ({
  articleId: l.article_id, titre: l.titre, chapo: l.chapo, corps: l.corps, avis: l.avis, description: l.description,
  etiquettes: l.etiquettes, legende: l.legende ?? "", empreinte: l.empreinte, manuel: l.manuel, traduitLe: l.traduit_le, erreur: l.erreur,
});

export async function lireTraduction(articleId: number): Promise<Traduction | null> {
  const { rows } = await pool().query<LigneEn>("SELECT * FROM articles_en WHERE article_id = $1", [articleId]);
  return rows[0] ? versTraduction(rows[0]) : null;
}

export async function enregistrerTraduction(
  articleId: number,
  t: Pick<Traduction, "titre" | "chapo" | "corps" | "avis" | "description" | "etiquettes" | "empreinte"> & { legende?: string },
  manuel = false,
): Promise<void> {
  await pool().query(
    `INSERT INTO articles_en (article_id, titre, chapo, corps, avis, description, etiquettes, empreinte, manuel, traduit_le, erreur, legende)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),NULL,$10)
     ON CONFLICT (article_id) DO UPDATE SET titre=EXCLUDED.titre, chapo=EXCLUDED.chapo, corps=EXCLUDED.corps, avis=EXCLUDED.avis,
       description=EXCLUDED.description, etiquettes=EXCLUDED.etiquettes, empreinte=EXCLUDED.empreinte, manuel=EXCLUDED.manuel,
       traduit_le=now(), erreur=NULL, legende=EXCLUDED.legende`,
    [articleId, t.titre, t.chapo, t.corps, t.avis, t.description, t.etiquettes, t.empreinte, manuel, (t.legende ?? "").slice(0, 220)],
  );
}

/** Échec de traduction : gardé pour l'administration, sans toucher à une traduction existante. */
export async function noterEchecTraduction(articleId: number, erreur: string): Promise<void> {
  await pool().query("UPDATE articles_en SET erreur = $2 WHERE article_id = $1", [articleId, erreur.slice(0, 500)]);
}

export async function supprimerTraduction(articleId: number): Promise<void> {
  await pool().query("DELETE FROM articles_en WHERE article_id = $1", [articleId]);
}

/**
 * Articles en ligne à traduire : sans version anglaise, ou dont le texte français a changé depuis la traduction
 * (sauf traduction reprise à la main, que la machine n'écrase pas). Les plus récents d'abord.
 */
export async function articlesATraduire(limite: number): Promise<number[]> {
  const { rows } = await pool().query<{ id: number; titre: string; chapo: string; corps: string; avis_silfax: string; description: string; etiquettes: string[]; image_legende: string; empreinte: string | null; manuel: boolean | null }>(
    `SELECT a.id, a.titre, a.chapo, a.corps, a.avis_silfax, a.description, a.etiquettes, a.image_legende, e.empreinte, e.manuel
       FROM articles a LEFT JOIN articles_en e ON e.article_id = a.id
      WHERE a.statut = 'publie' AND (e.manuel IS NULL OR e.manuel = false)
      ORDER BY a.publie_le DESC LIMIT 500`,
  );
  return rows
    .filter((r) => r.empreinte !== empreinte({
      titre: r.titre, chapo: r.chapo, corps: r.corps, avisSilfax: r.avis_silfax, description: r.description, etiquettes: r.etiquettes,
      image: r.image_legende ? { id: 0, alt: "", credit: "", legende: r.image_legende } : null,
    }))
    .slice(0, limite)
    .map((r) => r.id);
}

/** Remplace les champs français d'un article par leur traduction anglaise (pour réutiliser l'affichage). */
export function enAnglais(a: Article, t: Traduction): Article {
  return {
    ...a, titre: t.titre, chapo: t.chapo, corps: t.corps, avisSilfax: t.avis, description: t.description, etiquettes: t.etiquettes,
    image: a.image ? { ...a.image, legende: t.legende } : null,
  };
}
