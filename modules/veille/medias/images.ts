import sharp from "sharp";
import { pool } from "../db/pool";

/**
 * Images d'en-tête et images Facebook, envoyées depuis l'espace de relecture.
 * Stockées en base : le disque d'un conteneur Scalingo est effacé à chaque déploiement.
 * Chaque image est réencodée (JPEG), ce qui retire ses métadonnées (position GPS, appareil…).
 */

export const TAILLE_MAX_OCTETS = 8 * 1024 * 1024;
export const LARGEUR_MIN = 600;
const LARGEUR_UNE = 1600;
const OG = { largeur: 1200, hauteur: 630 };
const PIXELS_MAX = 50_000_000;
const FORMATS = new Set(["jpeg", "png", "webp"]);

export class ErreurImage extends Error {}

export interface ImagePreparee {
  donnees: Buffer; // en-tête : 1600 px de large au plus
  donneesOg: Buffer; // recadrage 1200 × 630 pour Facebook et Google
  largeur: number;
  hauteur: number;
}

export async function preparerImage(octets: Buffer): Promise<ImagePreparee> {
  if (octets.length === 0) throw new ErreurImage("Le fichier est vide.");
  if (octets.length > TAILLE_MAX_OCTETS) throw new ErreurImage("Image trop lourde : 8 Mo au maximum.");

  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    meta = await sharp(octets, { limitInputPixels: PIXELS_MAX }).metadata();
  } catch {
    throw new ErreurImage("Ce fichier n'est pas une image lisible. Formats acceptés : JPEG, PNG ou WebP.");
  }
  if (!meta.format || !FORMATS.has(meta.format)) throw new ErreurImage("Format refusé. Formats acceptés : JPEG, PNG ou WebP.");
  if (meta.pages && meta.pages > 1) throw new ErreurImage("Les images animées ne sont pas acceptées.");

  // rotate() applique l'orientation de l'appareil photo avant de retirer les métadonnées.
  const base = sharp(octets, { limitInputPixels: PIXELS_MAX }).rotate();
  const { width = 0 } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  if (width < LARGEUR_MIN) throw new ErreurImage(`Image trop petite : ${LARGEUR_MIN} px de large au minimum (1200 px conseillés).`);

  const une = await base
    .clone()
    .resize({ width: LARGEUR_UNE, withoutEnlargement: true })
    .flatten({ background: "#0b1020" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  const og = await base
    .clone()
    .resize(OG.largeur, OG.hauteur, { fit: "cover", position: "attention" })
    .flatten({ background: "#0b1020" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return { donnees: une.data, donneesOg: og, largeur: une.info.width, hauteur: une.info.height };
}

export async function enregistrerImage(octets: Buffer): Promise<number> {
  const img = await preparerImage(octets);
  const { rows } = await pool().query<{ id: number }>(
    "INSERT INTO medias (largeur, hauteur, donnees, donnees_og) VALUES ($1, $2, $3, $4) RETURNING id",
    [img.largeur, img.hauteur, img.donnees, img.donneesOg],
  );
  return rows[0].id;
}

export interface ImageLue {
  donnees: Buffer;
  /** Vrai si l'image illustre un article en ligne : elle peut alors être servie à tous et mise en cache. */
  publique: boolean;
}

export async function lireImage(id: number, variante: "une" | "og"): Promise<ImageLue | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  const colonne = variante === "og" ? "donnees_og" : "donnees";
  const { rows } = await pool().query<{ donnees: Buffer; publique: boolean }>(
    `SELECT m.${colonne} AS donnees,
            EXISTS (SELECT 1 FROM articles a WHERE (a.image_id = m.id OR a.image_facebook_id = m.id) AND a.statut = 'publie') AS publique
     FROM medias m WHERE m.id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

/** Supprime une image qui n'illustre plus aucun article. */
export async function supprimerSiOrpheline(id: number | null): Promise<void> {
  if (!id) return;
  await pool().query(
    "DELETE FROM medias m WHERE m.id = $1 AND NOT EXISTS (SELECT 1 FROM articles a WHERE a.image_id = m.id OR a.image_facebook_id = m.id)",
    [id],
  );
}
