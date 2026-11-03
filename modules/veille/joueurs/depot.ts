import { pool } from "../db/pool";
import { empreinteJeton, hacherMotDePasse, nouveauJeton, verifierMotDePasse } from "./motdepasse";
import { cleGuideValide, normaliserCourriel, type Inscription } from "./validation";

/**
 * Comptes joueurs. Le compte sert à se connecter, à recevoir la Lettre (si le joueur l'a demandé) et à sauvegarder
 * sa progression dans le guide de 1 à 60. Cinq mots de passe faux de suite bloquent le compte quinze minutes.
 */

export const COOKIE_JOUEUR = "taverne_joueur";
export const DUREE_SESSION_JOUEUR_S = 60 * 60 * 24 * 30;
const DUREE_REINIT_S = 60 * 60;
const ECHECS_MAX = 5;
const BLOCAGE_MIN = 15;
const INSCRIPTIONS_PAR_JOUR = 5;

export interface Joueur {
  id: number;
  pseudo: string;
  courriel: string;
  lettre: boolean;
  race: string;
  classe: string;
  creeLe: Date;
}

export class ErreurCompte extends Error {}

interface Ligne { id: number; pseudo: string; courriel: string; lettre: boolean; race: string; classe: string; cree_le: Date }
const versJoueur = (l: Ligne): Joueur => ({ id: l.id, pseudo: l.pseudo, courriel: l.courriel, lettre: l.lettre, race: l.race, classe: l.classe, creeLe: l.cree_le });
const COLONNES = "id, pseudo, courriel, lettre, race, classe, cree_le";

export async function creerCompte(i: Inscription, depot: string): Promise<{ joueur: Joueur; jeton: string }> {
  const { rows: recents } = await pool().query<{ n: number }>(
    "SELECT count(*)::int AS n FROM joueurs WHERE depot_empreinte = $1 AND cree_le > now() - interval '1 day'",
    [depot],
  );
  if (recents[0].n >= INSCRIPTIONS_PAR_JOUR) throw new ErreurCompte("Trop de comptes créés depuis cette connexion aujourd'hui. Réessayez demain.");
  const empreinte = await hacherMotDePasse(i.motDePasse);
  try {
    const { rows } = await pool().query<Ligne>(
      `INSERT INTO joueurs (pseudo, courriel, mot_de_passe, lettre, depot_empreinte) VALUES ($1, $2, $3, $4, $5) RETURNING ${COLONNES}`,
      [i.pseudo, i.courriel, empreinte, i.lettre, depot],
    );
    return { joueur: versJoueur(rows[0]), jeton: await ouvrirSession(rows[0].id) };
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      const pseudo = String((e as { constraint?: string }).constraint ?? "").includes("pseudo");
      throw new ErreurCompte(pseudo ? "Ce pseudo est déjà pris." : "Un compte existe déjà avec cette adresse. Connectez-vous.");
    }
    throw e;
  }
}

async function ouvrirSession(joueurId: number): Promise<string> {
  const { jeton, empreinte } = nouveauJeton();
  await pool().query(
    "INSERT INTO joueurs_sessions (empreinte, joueur_id, expire) VALUES ($1, $2, now() + make_interval(secs => $3))",
    [empreinte, joueurId, DUREE_SESSION_JOUEUR_S],
  );
  // Ménage : sessions expirées de tous les joueurs.
  await pool().query("DELETE FROM joueurs_sessions WHERE expire < now()");
  return jeton;
}

/** Connexion : renvoie un jeton de session, ou un message d'erreur qui ne dit pas si l'adresse existe. */
export async function connecter(courriel: string, motDePasse: string): Promise<{ ok: true; jeton: string } | { ok: false; message: string }> {
  const adresse = normaliserCourriel(courriel);
  const { rows } = await pool().query<{ id: number; mot_de_passe: string; echecs: number; bloque_jusqu: Date | null }>(
    "SELECT id, mot_de_passe, echecs, bloque_jusqu FROM joueurs WHERE courriel = $1",
    [adresse],
  );
  const j = rows[0];
  const refus = { ok: false as const, message: "Adresse ou mot de passe incorrect." };
  if (!j) {
    // Même temps de réponse qu'avec un compte existant.
    await verifierMotDePasse(motDePasse, "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAA");
    return refus;
  }
  if (j.bloque_jusqu && j.bloque_jusqu > new Date()) {
    return { ok: false, message: `Trop d'essais : réessayez dans ${BLOCAGE_MIN} minutes, ou choisissez un nouveau mot de passe.` };
  }
  if (!(await verifierMotDePasse(motDePasse, j.mot_de_passe))) {
    const echecs = j.echecs + 1;
    if (echecs >= ECHECS_MAX) {
      // Cinquième erreur : compte bloqué un quart d'heure, compteur remis à zéro.
      await pool().query("UPDATE joueurs SET echecs = 0, bloque_jusqu = now() + make_interval(mins => $2) WHERE id = $1", [j.id, BLOCAGE_MIN]);
    } else {
      await pool().query("UPDATE joueurs SET echecs = $2 WHERE id = $1", [j.id, echecs]);
    }
    return refus;
  }
  await pool().query("UPDATE joueurs SET echecs = 0, bloque_jusqu = NULL, vu_le = now() WHERE id = $1", [j.id]);
  return { ok: true, jeton: await ouvrirSession(j.id) };
}

export async function joueurDeSession(jeton: string | undefined): Promise<Joueur | null> {
  if (!jeton || jeton.length > 100) return null;
  const { rows } = await pool().query<Ligne>(
    `SELECT ${COLONNES.split(", ").map((c) => `j.${c}`).join(", ")} FROM joueurs_sessions s JOIN joueurs j ON j.id = s.joueur_id
     WHERE s.empreinte = $1 AND s.expire > now()`,
    [empreinteJeton(jeton)],
  );
  return rows[0] ? versJoueur(rows[0]) : null;
}

export async function fermerSession(jeton: string | undefined): Promise<void> {
  if (jeton) await pool().query("DELETE FROM joueurs_sessions WHERE empreinte = $1", [empreinteJeton(jeton)]);
}

export async function modifierCompte(joueurId: number, m: { lettre?: boolean; race?: string; classe?: string }): Promise<void> {
  await pool().query(
    "UPDATE joueurs SET lettre = COALESCE($2, lettre), race = COALESCE($3, race), classe = COALESCE($4, classe) WHERE id = $1",
    [joueurId, m.lettre ?? null, m.race ?? null, m.classe ?? null],
  );
}

export async function changerMotDePasse(joueurId: number, motDePasse: string): Promise<void> {
  await pool().query("UPDATE joueurs SET mot_de_passe = $2, echecs = 0, bloque_jusqu = NULL WHERE id = $1", [joueurId, await hacherMotDePasse(motDePasse)]);
  // Toutes les sessions ouvertes ailleurs sont fermées.
  await pool().query("DELETE FROM joueurs_sessions WHERE joueur_id = $1", [joueurId]);
}

/** Suppression du compte : sessions, progression et journal disparaissent avec lui. */
export async function supprimerCompte(joueurId: number): Promise<void> {
  await pool().query("DELETE FROM joueurs WHERE id = $1", [joueurId]);
}

/** Lien de réinitialisation (valable une heure) ; null si l'adresse n'a pas de compte. */
export async function demanderReinitialisation(courriel: string): Promise<{ jeton: string; pseudo: string } | null> {
  const { rows } = await pool().query<{ id: number; pseudo: string }>("SELECT id, pseudo FROM joueurs WHERE courriel = $1", [normaliserCourriel(courriel)]);
  if (!rows[0]) return null;
  const { jeton, empreinte } = nouveauJeton();
  await pool().query("DELETE FROM joueurs_reinitialisations WHERE joueur_id = $1 OR expire < now()", [rows[0].id]);
  await pool().query(
    "INSERT INTO joueurs_reinitialisations (empreinte, joueur_id, expire) VALUES ($1, $2, now() + make_interval(secs => $3))",
    [empreinte, rows[0].id, DUREE_REINIT_S],
  );
  return { jeton, pseudo: rows[0].pseudo };
}

export async function reinitialiser(jeton: string, motDePasse: string): Promise<boolean> {
  const { rows } = await pool().query<{ joueur_id: number }>(
    "DELETE FROM joueurs_reinitialisations WHERE empreinte = $1 AND expire > now() RETURNING joueur_id",
    [empreinteJeton(jeton)],
  );
  if (!rows[0]) return false;
  await changerMotDePasse(rows[0].joueur_id, motDePasse);
  return true;
}

// --- Progression du guide.

export async function lireProgression(joueurId: number, guide: string): Promise<{ quetes: number[]; jours: { jour: string; faites: number }[] }> {
  if (!cleGuideValide(guide)) return { quetes: [], jours: [] };
  const [p, j] = await Promise.all([
    pool().query<{ quetes: number[] }>("SELECT quetes FROM progression WHERE joueur_id = $1 AND guide = $2", [joueurId, guide]),
    pool().query<{ jour: string; faites: number }>(
      "SELECT to_char(jour, 'YYYY-MM-DD') AS jour, faites FROM progression_jours WHERE joueur_id = $1 AND guide = $2 ORDER BY jour DESC LIMIT 14",
      [joueurId, guide],
    ),
  ]);
  return { quetes: p.rows[0]?.quetes ?? [], jours: j.rows };
}

/** Enregistre les quêtes cochées ; les nouvelles du jour s'ajoutent au journal (jour de Paris). */
export async function enregistrerProgression(joueurId: number, guide: string, quetes: number[]): Promise<{ nouvelles: number }> {
  if (!cleGuideValide(guide)) throw new ErreurCompte("Guide inconnu.");
  const propres = [...new Set(quetes.filter((q) => Number.isInteger(q) && q > 0 && q < 10_000_000))].slice(0, 5000);
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ quetes: number[] }>("SELECT quetes FROM progression WHERE joueur_id = $1 AND guide = $2 FOR UPDATE", [joueurId, guide]);
    const avant = new Set(rows[0]?.quetes ?? []);
    const nouvelles = propres.filter((q) => !avant.has(q)).length;
    await client.query(
      `INSERT INTO progression (joueur_id, guide, quetes, maj_le) VALUES ($1, $2, $3, now())
       ON CONFLICT (joueur_id, guide) DO UPDATE SET quetes = EXCLUDED.quetes, maj_le = now()`,
      [joueurId, guide, propres],
    );
    if (nouvelles > 0) {
      await client.query(
        `INSERT INTO progression_jours (joueur_id, guide, jour, faites) VALUES ($1, $2, (now() AT TIME ZONE 'Europe/Paris')::date, $3)
         ON CONFLICT (joueur_id, guide, jour) DO UPDATE SET faites = progression_jours.faites + EXCLUDED.faites`,
        [joueurId, guide, nouvelles],
      );
    }
    await client.query("UPDATE joueurs SET vu_le = now() WHERE id = $1", [joueurId]);
    await client.query("COMMIT");
    return { nouvelles };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/** Guides commencés par le joueur, pour sa page de compte. */
export async function guidesDuJoueur(joueurId: number): Promise<{ guide: string; faites: number; majLe: Date }[]> {
  const { rows } = await pool().query<{ guide: string; faites: number; maj_le: Date }>(
    "SELECT guide, cardinality(quetes) AS faites, maj_le FROM progression WHERE joueur_id = $1 ORDER BY maj_le DESC",
    [joueurId],
  );
  return rows.map((r) => ({ guide: r.guide, faites: r.faites, majLe: r.maj_le }));
}
