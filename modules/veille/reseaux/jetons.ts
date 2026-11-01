import { pool } from "../db/pool";

/** Jetons d'accès renouvelables, gardés en base (TikTok). Jamais affichés ni journalisés. */
export interface Jeton {
  reseau: string;
  compte: string | null;
  acces: string;
  rafraichissement: string | null;
  expireLe: Date;
  rafraichissementExpireLe: Date | null;
}

export async function lireJeton(reseau: string): Promise<Jeton | null> {
  const { rows } = await pool().query(
    "SELECT reseau, compte, acces, rafraichissement, expire_le, rafraichissement_expire_le FROM jetons_reseaux WHERE reseau = $1",
    [reseau],
  );
  const l = rows[0];
  return l
    ? { reseau: l.reseau, compte: l.compte, acces: l.acces, rafraichissement: l.rafraichissement, expireLe: l.expire_le, rafraichissementExpireLe: l.rafraichissement_expire_le }
    : null;
}

export async function enregistrerJeton(j: Jeton): Promise<void> {
  await pool().query(
    `INSERT INTO jetons_reseaux (reseau, compte, acces, rafraichissement, expire_le, rafraichissement_expire_le, modifie_le)
     VALUES ($1,$2,$3,$4,$5,$6,now())
     ON CONFLICT (reseau) DO UPDATE SET compte = COALESCE(EXCLUDED.compte, jetons_reseaux.compte), acces = EXCLUDED.acces,
       rafraichissement = EXCLUDED.rafraichissement, expire_le = EXCLUDED.expire_le,
       rafraichissement_expire_le = EXCLUDED.rafraichissement_expire_le, modifie_le = now()`,
    [j.reseau, j.compte, j.acces, j.rafraichissement, j.expireLe, j.rafraichissementExpireLe],
  );
}

export async function supprimerJeton(reseau: string): Promise<void> {
  await pool().query("DELETE FROM jetons_reseaux WHERE reseau = $1", [reseau]);
}
