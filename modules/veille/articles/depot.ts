import type { PoolClient } from "pg";
import { estPilier, type SlugRubrique } from "@/config/taxonomie";
import { pool } from "../db/pool";
import type { Article, SourceCitee, Statut } from "../types";
import { slugifier } from "./slug";
import { verifierPublication } from "./publication";
import { supprimerSiOrpheline } from "../medias/images";

interface Ligne {
  id: number; slug: string; titre: string; chapo: string; corps: string; avis_silfax: string;
  rubrique: string; etiquettes: string[]; pilier: string | null; description: string;
  accroche_facebook: string; texte_facebook: string; sources: SourceCitee[]; statut: Statut;
  score: number | null; origine: "veille" | "manuel"; cree_le: Date; modifie_le: Date;
  publie_le: Date | null; facebook_post_id: string | null; facebook_publie_le: Date | null;
  facebook_tentatives: number; facebook_erreur: string | null;
  image_id: number | null; image_alt: string; image_credit: string; image_facebook_id: number | null;
}

function versArticle(l: Ligne): Article {
  return {
    id: l.id, slug: l.slug, titre: l.titre, chapo: l.chapo, corps: l.corps, avisSilfax: l.avis_silfax,
    rubrique: l.rubrique as SlugRubrique, etiquettes: l.etiquettes, pilier: estPilier(l.pilier) ? l.pilier : null,
    description: l.description, accrocheFacebook: l.accroche_facebook, texteFacebook: l.texte_facebook,
    sources: l.sources,
    image: l.image_id ? { id: l.image_id, alt: l.image_alt, credit: l.image_credit } : null,
    imageFacebookId: l.image_facebook_id,
    statut: l.statut, score: l.score, origine: l.origine, creeLe: l.cree_le,
    modifieLe: l.modifie_le, publieLe: l.publie_le, facebookPostId: l.facebook_post_id,
    facebookPublieLe: l.facebook_publie_le, facebookTentatives: l.facebook_tentatives, facebookErreur: l.facebook_erreur,
  };
}

/** Slug unique : ajoute -2, -3… si nécessaire. */
async function slugLibre(client: PoolClient, titre: string, sauf?: number): Promise<string> {
  const base = slugifier(titre);
  const { rows } = await client.query<{ slug: string }>(
    "SELECT slug FROM articles WHERE (slug = $1 OR slug LIKE $1 || '-%') AND ($2::int IS NULL OR id <> $2)",
    [base, sauf ?? null],
  );
  const pris = new Set(rows.map((r) => r.slug));
  if (!pris.has(base)) return base;
  for (let i = 2; ; i++) if (!pris.has(`${base}-${i}`)) return `${base}-${i}`;
}

export type NouveauBrouillon = Pick<Article, "titre" | "chapo" | "corps" | "rubrique" | "etiquettes" | "pilier" | "description" | "accrocheFacebook" | "texteFacebook" | "sources" | "origine"> & { score?: number | null };

export async function creerBrouillon(b: NouveauBrouillon, cleSujet?: string): Promise<Article> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const slug = await slugLibre(client, b.titre);
    const { rows } = await client.query<Ligne>(
      `INSERT INTO articles (slug, titre, chapo, corps, rubrique, etiquettes, pilier, description,
         accroche_facebook, texte_facebook, sources, score, origine)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [slug, b.titre, b.chapo, b.corps, b.rubrique, b.etiquettes, b.pilier, b.description,
       b.accrocheFacebook, b.texteFacebook, JSON.stringify(b.sources), b.score ?? null, b.origine],
    );
    if (cleSujet) {
      await client.query(
        "INSERT INTO veille_sujets (cle, titre, article_id) VALUES ($1,$2,$3) ON CONFLICT (cle) DO NOTHING",
        [cleSujet, b.titre, rows[0].id],
      );
    }
    await client.query("COMMIT");
    return versArticle(rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export type Modifications = Pick<Article, "titre" | "chapo" | "corps" | "avisSilfax" | "rubrique" | "etiquettes" | "pilier" | "description" | "accrocheFacebook" | "texteFacebook"> & {
  imageAlt: string;
  imageCredit: string;
};

export async function modifier(id: number, m: Modifications): Promise<Article> {
  const client = await pool().connect();
  try {
    const actuel = await client.query<Ligne>("SELECT * FROM articles WHERE id = $1", [id]);
    if (!actuel.rows[0]) throw new Error("Article introuvable.");
    const art = actuel.rows[0];
    if (art.statut === "publie") {
      const erreurs = verifierPublication({ ...m, image: art.image_id ? { id: art.image_id, alt: m.imageAlt, credit: m.imageCredit } : null });
      if (erreurs.length) throw new ErreurPublication(erreurs);
    }
    // Le slug d'un article publié ne change plus : les liens partagés doivent rester valides.
    const slug = art.statut === "publie" ? art.slug : await slugLibre(client, m.titre, id);
    const { rows } = await client.query<Ligne>(
      `UPDATE articles SET slug=$2, titre=$3, chapo=$4, corps=$5, avis_silfax=$6, rubrique=$7, etiquettes=$8,
         pilier=$9, description=$10, accroche_facebook=$11, texte_facebook=$12, image_alt=$13, image_credit=$14,
         modifie_le=now()
       WHERE id=$1 RETURNING *`,
      [id, slug, m.titre, m.chapo, m.corps, m.avisSilfax, m.rubrique, m.etiquettes, m.pilier,
       m.description, m.accrocheFacebook, m.texteFacebook, m.imageAlt.trim(), m.imageCredit.trim()],
    );
    return versArticle(rows[0]);
  } finally {
    client.release();
  }
}

export class ErreurPublication extends Error {
  constructor(public erreurs: string[]) {
    super(erreurs.join(" "));
  }
}

export async function publier(id: number): Promise<Article> {
  const a = await lireParId(id);
  if (!a) throw new Error("Article introuvable.");
  const erreurs = verifierPublication(a);
  if (erreurs.length) throw new ErreurPublication(erreurs);
  const { rows } = await pool().query<Ligne>(
    "UPDATE articles SET statut='publie', publie_le=COALESCE(publie_le, now()), modifie_le=now() WHERE id=$1 RETURNING *",
    [id],
  );
  return versArticle(rows[0]);
}

/**
 * Associe une image (déjà enregistrée) à un article, ou la retire (null).
 * L'image remplacée est supprimée si plus aucun article ne l'utilise.
 */
export async function definirImage(id: number, emplacement: "une" | "facebook", mediaId: number | null): Promise<void> {
  const colonne = emplacement === "une" ? "image_id" : "image_facebook_id";
  const { rows } = await pool().query<{ ancien: number | null }>(
    `UPDATE articles a SET ${colonne} = $2, modifie_le = now()
     FROM (SELECT ${colonne} AS ancien FROM articles WHERE id = $1) avant
     WHERE a.id = $1 RETURNING avant.ancien`,
    [id, mediaId],
  );
  const ancien = rows[0]?.ancien ?? null;
  if (ancien && ancien !== mediaId) await supprimerSiOrpheline(ancien);
}

export async function changerStatut(id: number, statut: Exclude<Statut, "publie">): Promise<void> {
  await pool().query("UPDATE articles SET statut=$2, modifie_le=now() WHERE id=$1", [id, statut]);
}

export async function lireParId(id: number): Promise<Article | null> {
  const { rows } = await pool().query<Ligne>("SELECT * FROM articles WHERE id=$1", [id]);
  return rows[0] ? versArticle(rows[0]) : null;
}

export async function lirePublie(slug: string): Promise<Article | null> {
  const { rows } = await pool().query<Ligne>("SELECT * FROM articles WHERE slug=$1 AND statut='publie'", [slug]);
  return rows[0] ? versArticle(rows[0]) : null;
}

export interface FiltrePublies {
  rubrique?: string;
  pilier?: string;
  limite?: number;
  decalage?: number;
  sauf?: number;
}

export async function listerPublies(f: FiltrePublies = {}): Promise<Article[]> {
  const { rows } = await pool().query<Ligne>(
    `SELECT * FROM articles WHERE statut='publie'
       AND ($1::text IS NULL OR rubrique=$1) AND ($2::text IS NULL OR pilier=$2) AND ($3::int IS NULL OR id<>$3)
     ORDER BY publie_le DESC LIMIT $4 OFFSET $5`,
    [f.rubrique ?? null, f.pilier ?? null, f.sauf ?? null, f.limite ?? 20, f.decalage ?? 0],
  );
  return rows.map(versArticle);
}

export async function compterPublies(rubrique?: string): Promise<number> {
  const { rows } = await pool().query<{ n: string }>(
    "SELECT count(*) AS n FROM articles WHERE statut='publie' AND ($1::text IS NULL OR rubrique=$1)",
    [rubrique ?? null],
  );
  return Number(rows[0].n);
}

export async function listerPourAdmin(statut: Statut): Promise<Article[]> {
  const ordre = statut === "brouillon" ? "score DESC NULLS LAST, cree_le DESC" : "COALESCE(publie_le, modifie_le) DESC";
  const { rows } = await pool().query<Ligne>(`SELECT * FROM articles WHERE statut=$1 ORDER BY ${ordre} LIMIT 200`, [statut]);
  return rows.map(versArticle);
}

/** Pour le plan du site : slugs et dates de tous les articles publiés. */
export async function listerPourPlan(): Promise<{ slug: string; modifieLe: Date }[]> {
  const { rows } = await pool().query<{ slug: string; modifie_le: Date }>(
    "SELECT slug, modifie_le FROM articles WHERE statut='publie' ORDER BY publie_le DESC",
  );
  return rows.map((r) => ({ slug: r.slug, modifieLe: r.modifie_le }));
}

export async function sujetsDejaTraites(cles: string[]): Promise<Set<string>> {
  if (!cles.length) return new Set();
  const { rows } = await pool().query<{ cle: string }>("SELECT cle FROM veille_sujets WHERE cle = ANY($1)", [cles]);
  return new Set(rows.map((r) => r.cle));
}

/** Articles publiés en attente de relais Facebook (7 derniers jours, 3 tentatives au plus). */
export async function enAttenteFacebook(limite: number): Promise<Article[]> {
  const { rows } = await pool().query<Ligne>(
    `SELECT * FROM articles WHERE statut='publie' AND facebook_post_id IS NULL AND facebook_tentatives < 3
       AND publie_le > now() - interval '7 days' ORDER BY publie_le ASC LIMIT $1`,
    [limite],
  );
  return rows.map(versArticle);
}

export async function relaisFacebookReussi(id: number, postId: string): Promise<void> {
  await pool().query(
    "UPDATE articles SET facebook_post_id=$2, facebook_publie_le=now(), facebook_erreur=NULL WHERE id=$1",
    [id, postId],
  );
}

export async function relaisFacebookEchoue(id: number, erreur: string): Promise<void> {
  await pool().query(
    "UPDATE articles SET facebook_tentatives=facebook_tentatives+1, facebook_erreur=$2 WHERE id=$1",
    [id, erreur.slice(0, 1000)],
  );
}

export async function relaisFacebookCetteHeure(): Promise<number> {
  const { rows } = await pool().query<{ n: string }>(
    "SELECT count(*) AS n FROM articles WHERE facebook_publie_le > now() - interval '1 hour'",
  );
  return Number(rows[0].n);
}
