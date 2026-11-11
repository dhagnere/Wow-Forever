import { pool } from "../db/pool";
import { empreinteJeton, nouveauJeton } from "../joueurs/motdepasse";
import type { LangueLettre } from "./messages";

/**
 * Abonnés de la Lettre et numéros envoyés. Le site gère lui-même la double validation : une adresse n'est abonnée qu'après
 * le clic sur le lien de confirmation. Une désinscription efface l'adresse ; une demande jamais confirmée est effacée
 * au bout de sept jours.
 */

const VALIDITE_CONFIRMATION_H = 48;
/** Délai avant de renvoyer une confirmation à la même adresse. */
const ATTENTE_RENVOI_MIN = 10;
/** Demandes non confirmées acceptées par heure, toutes adresses confondues (protège le quota d'envoi). */
const DEMANDES_PAR_HEURE = 40;
/** Un message qui échoue trois fois n'est plus retenté. */
const ECHECS_MAX = 3;

export type DemandeAbonnement =
  | { etat: "envoyer"; jeton: string }
  | { etat: "deja" }
  | { etat: "patienter" }
  | { etat: "sature" };

export async function demanderAbonnement(courriel: string, langue: LangueLettre): Promise<DemandeAbonnement> {
  const { rows } = await pool().query<{ id: number; confirme: boolean; recente: boolean }>(
    `SELECT id, confirme_le IS NOT NULL AS confirme, demande_le > now() - make_interval(mins => $2) AS recente
       FROM lettre_abonnes WHERE courriel = $1`,
    [courriel, ATTENTE_RENVOI_MIN],
  );
  if (rows[0]?.confirme) return { etat: "deja" };
  if (rows[0]?.recente) return { etat: "patienter" };
  const { rows: n } = await pool().query<{ n: number }>(
    "SELECT count(*)::int AS n FROM lettre_abonnes WHERE confirme_le IS NULL AND demande_le > now() - interval '1 hour'",
  );
  if (n[0].n >= DEMANDES_PAR_HEURE) return { etat: "sature" };
  const { jeton, empreinte } = nouveauJeton();
  await pool().query(
    `INSERT INTO lettre_abonnes (courriel, langue, jeton_empreinte, jeton_expire, demande_le)
     VALUES ($1, $2, $3, now() + make_interval(hours => $4), now())
     ON CONFLICT (courriel) DO UPDATE SET langue = EXCLUDED.langue, jeton_empreinte = EXCLUDED.jeton_empreinte,
       jeton_expire = EXCLUDED.jeton_expire, demande_le = now()
     WHERE lettre_abonnes.confirme_le IS NULL`,
    [courriel, langue, empreinte, VALIDITE_CONFIRMATION_H],
  );
  return { etat: "envoyer", jeton };
}

/** Retire une demande dont le message de confirmation n'a pas pu partir : l'adresse pourra redemander aussitôt. */
export async function oublierDemande(courriel: string): Promise<void> {
  await pool().query("DELETE FROM lettre_abonnes WHERE courriel = $1 AND confirme_le IS NULL", [courriel]);
}

/** Confirme l'inscription liée au jeton. Renvoie la langue de l'abonné, ou null si le lien a expiré ou a déjà servi. */
export async function confirmerAbonnement(jeton: string): Promise<LangueLettre | null> {
  if (!jeton) return null;
  const { rows } = await pool().query<{ langue: LangueLettre }>(
    `UPDATE lettre_abonnes SET confirme_le = now(), jeton_empreinte = NULL, jeton_expire = NULL
      WHERE jeton_empreinte = $1 AND jeton_expire > now() RETURNING langue`,
    [empreinteJeton(jeton)],
  );
  return rows[0]?.langue ?? null;
}

/** Adresse d'un abonné, pour vérifier la signature d'un lien de désinscription. */
export async function courrielAbonne(id: number): Promise<string | null> {
  if (!Number.isInteger(id) || id < 1) return null;
  const { rows } = await pool().query<{ courriel: string }>("SELECT courriel FROM lettre_abonnes WHERE id = $1", [id]);
  return rows[0]?.courriel ?? null;
}

export async function supprimerAbonne(id: number): Promise<void> {
  await pool().query("DELETE FROM lettre_abonnes WHERE id = $1", [id]);
}

/** Désinscription depuis le compte joueur : l'adresse quitte la Lettre, quelle que soit sa langue. */
export async function desabonnerAdresse(courriel: string): Promise<void> {
  await pool().query("DELETE FROM lettre_abonnes WHERE courriel = $1", [courriel]);
}

/** Reprise d'abonnés déjà confirmés ailleurs (export de l'ancien prestataire). Renvoie le nombre d'adresses ajoutées. */
export async function importerAbonnes(adresses: string[], langue: LangueLettre): Promise<number> {
  if (!adresses.length) return 0;
  const { rowCount } = await pool().query(
    `INSERT INTO lettre_abonnes (courriel, langue, confirme_le)
     SELECT a, $2, now() FROM unnest($1::text[]) AS a
     ON CONFLICT (courriel) DO UPDATE SET confirme_le = COALESCE(lettre_abonnes.confirme_le, now()),
       jeton_empreinte = NULL, jeton_expire = NULL`,
    [adresses, langue],
  );
  return rowCount ?? 0;
}

export interface ChiffresAbonnes { fr: number; en: number; enAttente: number }

export async function chiffresAbonnes(): Promise<ChiffresAbonnes> {
  const { rows } = await pool().query<ChiffresAbonnes>(
    `SELECT count(*) FILTER (WHERE confirme_le IS NOT NULL AND langue = 'fr')::int AS fr,
            count(*) FILTER (WHERE confirme_le IS NOT NULL AND langue = 'en')::int AS en,
            count(*) FILTER (WHERE confirme_le IS NULL)::int AS "enAttente"
       FROM lettre_abonnes`,
  );
  return rows[0];
}

/** Efface les demandes jamais confirmées de plus de sept jours. */
export async function purgerDemandes(): Promise<number> {
  const { rowCount } = await pool().query("DELETE FROM lettre_abonnes WHERE confirme_le IS NULL AND demande_le < now() - interval '7 days'");
  return rowCount ?? 0;
}

// ——— Numéros de la Lettre ———

export interface EnvoiLettre {
  id: number;
  langue: LangueLettre;
  sujet: string;
  corps: string;
  statut: "brouillon" | "en_cours" | "termine";
  creeLe: Date;
  lanceLe: Date | null;
  termineLe: Date | null;
  destinataires: number;
  envoyes: number;
  echecs: number;
}

const SELECT_ENVOI = `SELECT e.id, e.langue, e.sujet, e.corps, e.statut, e.cree_le AS "creeLe", e.lance_le AS "lanceLe", e.termine_le AS "termineLe",
  count(f.abonne_id)::int AS destinataires,
  count(f.envoye_le)::int AS envoyes,
  count(*) FILTER (WHERE f.envoye_le IS NULL AND f.echecs >= ${ECHECS_MAX})::int AS echecs
  FROM lettre_envois e LEFT JOIN lettre_file f ON f.envoi_id = e.id`;

export async function listerEnvois(): Promise<EnvoiLettre[]> {
  const { rows } = await pool().query<EnvoiLettre>(`${SELECT_ENVOI} GROUP BY e.id ORDER BY e.cree_le DESC LIMIT 50`);
  return rows;
}

export async function lireEnvoi(id: number): Promise<EnvoiLettre | null> {
  const { rows } = await pool().query<EnvoiLettre>(`${SELECT_ENVOI} WHERE e.id = $1 GROUP BY e.id`, [id]);
  return rows[0] ?? null;
}

/** Numéros déjà lancés d'une édition, du plus récent au plus ancien : ce que les comptes connectés relisent. */
export interface LettreParue { id: number; sujet: string; corps: string; parueLe: Date }

export async function lettresParues(langue: LangueLettre, limite = 30): Promise<LettreParue[]> {
  const { rows } = await pool().query<LettreParue>(
    `SELECT id, sujet, corps, lance_le AS "parueLe" FROM lettre_envois
     WHERE langue = $1 AND statut <> 'brouillon' AND lance_le IS NOT NULL ORDER BY lance_le DESC LIMIT $2`,
    [langue, limite],
  );
  return rows;
}

/**
 * Lettres affichées sous les épisodes du Carnet : brouillons compris (Jobwow le veut ainsi), datées du lancement ou,
 * pour un brouillon, de sa création. Les brouillons vides ne sont pas montrés.
 */
export async function lettresCarnet(langue: LangueLettre, limite = 12): Promise<LettreParue[]> {
  const { rows } = await pool().query<LettreParue>(
    `SELECT id, sujet, corps, COALESCE(lance_le, cree_le) AS "parueLe" FROM lettre_envois
     WHERE langue = $1 AND btrim(corps) <> '' ORDER BY COALESCE(lance_le, cree_le) DESC LIMIT $2`,
    [langue, limite],
  );
  return rows;
}

/** Abonnés à la Lettre sans compte joueur (administration seulement). */
export interface AbonneSansCompte { courriel: string; langue: LangueLettre; confirmeLe: Date | null; demandeLe: Date }

export async function abonnesSansCompte(limite = 500): Promise<AbonneSansCompte[]> {
  const { rows } = await pool().query<AbonneSansCompte>(
    `SELECT a.courriel, a.langue, a.confirme_le AS "confirmeLe", a.demande_le AS "demandeLe" FROM lettre_abonnes a
     WHERE NOT EXISTS (SELECT 1 FROM joueurs j WHERE j.courriel = a.courriel) ORDER BY a.demande_le DESC LIMIT $1`,
    [limite],
  );
  return rows;
}

export async function enregistrerEnvoi(e: { id?: number; langue: LangueLettre; sujet: string; corps: string }): Promise<number> {
  if (e.id) {
    await pool().query("UPDATE lettre_envois SET langue = $2, sujet = $3, corps = $4 WHERE id = $1 AND statut = 'brouillon'", [e.id, e.langue, e.sujet, e.corps]);
    return e.id;
  }
  const { rows } = await pool().query<{ id: number }>("INSERT INTO lettre_envois (langue, sujet, corps) VALUES ($1, $2, $3) RETURNING id", [e.langue, e.sujet, e.corps]);
  return rows[0].id;
}

export async function supprimerEnvoi(id: number): Promise<void> {
  await pool().query("DELETE FROM lettre_envois WHERE id = $1 AND statut = 'brouillon'", [id]);
}

/** Met le numéro en file pour tous les abonnés confirmés de sa langue. Renvoie le nombre de destinataires. */
export async function lancerEnvoi(id: number): Promise<number> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ langue: LangueLettre }>(
      "UPDATE lettre_envois SET statut = 'en_cours', lance_le = now() WHERE id = $1 AND statut = 'brouillon' RETURNING langue",
      [id],
    );
    if (!rows[0]) {
      await client.query("ROLLBACK");
      return 0;
    }
    const { rowCount } = await client.query(
      `INSERT INTO lettre_file (envoi_id, abonne_id)
       SELECT $1, id FROM lettre_abonnes WHERE confirme_le IS NOT NULL AND langue = $2`,
      [id, rows[0].langue],
    );
    await client.query("COMMIT");
    return rowCount ?? 0;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/** Messages de la Lettre déjà partis aujourd'hui (jour UTC, celui des quotas de Resend). */
export async function envoyesAujourdhui(): Promise<number> {
  const { rows } = await pool().query<{ n: number }>(
    "SELECT count(*)::int AS n FROM lettre_file WHERE envoye_le >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'",
  );
  return rows[0].n;
}

export interface MessageEnFile {
  envoiId: number;
  abonneId: number;
  courriel: string;
  langue: LangueLettre;
  sujet: string;
  corps: string;
}

export async function messagesEnFile(limite: number): Promise<MessageEnFile[]> {
  if (limite < 1) return [];
  const { rows } = await pool().query<MessageEnFile>(
    `SELECT f.envoi_id AS "envoiId", f.abonne_id AS "abonneId", a.courriel, e.langue, e.sujet, e.corps
       FROM lettre_file f JOIN lettre_envois e ON e.id = f.envoi_id JOIN lettre_abonnes a ON a.id = f.abonne_id
      WHERE e.statut = 'en_cours' AND f.envoye_le IS NULL AND f.echecs < $2 AND a.confirme_le IS NOT NULL
      ORDER BY e.lance_le, f.abonne_id LIMIT $1`,
    [limite, ECHECS_MAX],
  );
  return rows;
}

export async function noterEnvois(messages: { envoiId: number; abonneId: number }[], reussi: boolean): Promise<void> {
  if (!messages.length) return;
  await pool().query(
    `UPDATE lettre_file f SET ${reussi ? "envoye_le = now()" : "echecs = f.echecs + 1"}
       FROM unnest($1::int[], $2::int[]) AS m(envoi_id, abonne_id)
      WHERE f.envoi_id = m.envoi_id AND f.abonne_id = m.abonne_id`,
    [messages.map((m) => m.envoiId), messages.map((m) => m.abonneId)],
  );
}

/** Clôt les numéros dont il ne reste plus rien à envoyer. */
export async function cloreEnvois(): Promise<void> {
  await pool().query(
    `UPDATE lettre_envois e SET statut = 'termine', termine_le = now()
      WHERE e.statut = 'en_cours' AND NOT EXISTS (
        SELECT 1 FROM lettre_file f WHERE f.envoi_id = e.id AND f.envoye_le IS NULL AND f.echecs < $1)`,
    [ECHECS_MAX],
  );
}
