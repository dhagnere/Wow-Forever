import { pool } from "../db/pool";

/**
 * Relecture du guide de 1 à 60 en jeu (/admin/guides) : pour chaque étape d'un guide (« prendre », « faire », « rendre »
 * une quête), une case « vérifié en jeu » et une remarque. Les remarques servent à corriger le calcul du guide ;
 * elles ne sont jamais affichées sur le site public.
 *   guide : clé du guide (« horde:orc:chasseur », cleGuide de lib/guide.ts)
 *   etape : « prendre:123 », « faire:123 » ou « rendre:123 »
 */

export interface NoteEtape { verifie: boolean; remarque: string; majLe: Date }
export interface RemarqueGuide { guide: string; etape: string; remarque: string; majLe: Date }

const ETAPE = /^(prendre|faire|rendre):\d{1,9}$/;
const GUIDE = /^(alliance|horde):[a-z-]{2,40}:[a-z-]{2,20}$/;

export const etapeValide = (e: string) => ETAPE.test(e);
export const guideValide = (g: string) => GUIDE.test(g);

export async function lireRelecture(guide: string): Promise<Map<string, NoteEtape>> {
  const { rows } = await pool().query<{ etape: string; verifie: boolean; remarque: string; maj_le: Date }>(
    "SELECT etape, verifie, remarque, maj_le FROM guides_relecture WHERE guide = $1",
    [guide],
  );
  return new Map(rows.map((r) => [r.etape, { verifie: r.verifie, remarque: r.remarque, majLe: r.maj_le }]));
}

/** Enregistre les notes d'une zone. Une étape ni vérifiée ni commentée est effacée. */
export async function enregistrerRelecture(guide: string, notes: { etape: string; verifie: boolean; remarque: string }[]): Promise<void> {
  if (!guideValide(guide)) throw new Error("Guide inconnu.");
  const valides = notes.filter((n) => etapeValide(n.etape)).map((n) => ({ ...n, remarque: n.remarque.trim().slice(0, 1000) }));
  const garder = valides.filter((n) => n.verifie || n.remarque);
  const effacer = valides.filter((n) => !n.verifie && !n.remarque).map((n) => n.etape);
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    if (effacer.length) await client.query("DELETE FROM guides_relecture WHERE guide = $1 AND etape = ANY($2::text[])", [guide, effacer]);
    if (garder.length) {
      await client.query(
        `INSERT INTO guides_relecture (guide, etape, verifie, remarque)
         SELECT $1, e, v, r FROM unnest($2::text[], $3::boolean[], $4::text[]) AS n(e, v, r)
         ON CONFLICT (guide, etape) DO UPDATE SET verifie = EXCLUDED.verifie, remarque = EXCLUDED.remarque,
           maj_le = CASE WHEN guides_relecture.verifie IS DISTINCT FROM EXCLUDED.verifie OR guides_relecture.remarque IS DISTINCT FROM EXCLUDED.remarque
                         THEN now() ELSE guides_relecture.maj_le END`,
        [guide, garder.map((n) => n.etape), garder.map((n) => n.verifie), garder.map((n) => n.remarque)],
      );
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/** Étapes vérifiées par guide, pour la liste des guides. */
export async function avancementRelecture(): Promise<Map<string, { verifiees: number; remarques: number }>> {
  const { rows } = await pool().query<{ guide: string; verifiees: number; remarques: number }>(
    `SELECT guide, count(*) FILTER (WHERE verifie)::int AS verifiees, count(*) FILTER (WHERE remarque <> '')::int AS remarques
       FROM guides_relecture GROUP BY guide`,
  );
  return new Map(rows.map((r) => [r.guide, { verifiees: r.verifiees, remarques: r.remarques }]));
}

/** Toutes les remarques, les plus récentes d'abord. */
export async function remarquesRelecture(): Promise<RemarqueGuide[]> {
  const { rows } = await pool().query<RemarqueGuide>(
    `SELECT guide, etape, remarque, maj_le AS "majLe" FROM guides_relecture WHERE remarque <> '' ORDER BY maj_le DESC LIMIT 500`,
  );
  return rows;
}
