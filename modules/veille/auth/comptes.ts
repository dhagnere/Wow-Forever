/**
 * Comptes d'administration : identifiant + mot de passe haché (scrypt), blocage des essais répétés.
 * Garde-fou à ne jamais affaiblir (voir CLAUDE.md) : aucun mot de passe en clair, en base ni dans les journaux.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { pool } from "../db/pool";
import { creerJeton, lireJeton, motDePasseCorrect, type Porteur } from "./session";

const scrypt = promisify(scryptCb) as (mdp: string, sel: Buffer, longueur: number) => Promise<Buffer>;

/** Longueur minimale d'un mot de passe d'administration. */
export const MOT_DE_PASSE_MINIMUM = 16;
/** Au-delà de ESSAIS_MAX échecs en BLOCAGE_MIN minutes, l'identifiant et l'adresse sont bloqués. */
export const ESSAIS_MAX = 5;
export const BLOCAGE_MIN = 15;

export interface Admin {
  id: number;
  identifiant: string;
  version: number;
  derniereConnexion: Date | null;
}

interface Ligne {
  id: number;
  identifiant: string;
  empreinte: string;
  version_session: number;
  derniere_connexion: Date | null;
}

const versAdmin = (l: Ligne): Admin => ({ id: l.id, identifiant: l.identifiant, version: l.version_session, derniereConnexion: l.derniere_connexion });

export const normaliserIdentifiant = (s: string) => s.trim().toLowerCase();

export async function hacher(mdp: string): Promise<string> {
  const sel = randomBytes(16);
  const cle = await scrypt(mdp, sel, 64);
  return `scrypt$${sel.toString("base64url")}$${cle.toString("base64url")}`;
}

export async function verifierEmpreinte(mdp: string, empreinte: string): Promise<boolean> {
  const [algo, sel, cle] = empreinte.split("$");
  if (algo !== "scrypt" || !sel || !cle) return false;
  const attendu = Buffer.from(cle, "base64url");
  const calcule = await scrypt(mdp, Buffer.from(sel, "base64url"), attendu.length);
  return timingSafeEqual(attendu, calcule);
}

export function controlerNouveauMotDePasse(mdp: string, identifiant: string): string | null {
  if (mdp.length < MOT_DE_PASSE_MINIMUM) return `Le mot de passe doit faire au moins ${MOT_DE_PASSE_MINIMUM} caractères.`;
  if (mdp.toLowerCase().includes(normaliserIdentifiant(identifiant))) return "Le mot de passe ne doit pas contenir l'identifiant.";
  return null;
}

async function parIdentifiant(identifiant: string): Promise<Ligne | null> {
  const { rows } = await pool().query<Ligne>("SELECT * FROM admins WHERE identifiant = $1", [normaliserIdentifiant(identifiant)]);
  return rows[0] ?? null;
}

export async function nombreAdmins(): Promise<number> {
  const { rows } = await pool().query<{ n: string }>("SELECT count(*) AS n FROM admins");
  return Number(rows[0].n);
}

/** Crée le compte, ou remplace son mot de passe s'il existe (les sessions ouvertes sont alors fermées). */
export async function enregistrerAdmin(identifiant: string, mdp: string): Promise<{ admin: Admin; cree: boolean }> {
  const id = normaliserIdentifiant(identifiant);
  if (!/^[a-z0-9._-]{3,40}$/.test(id)) throw new Error("Identifiant invalide : 3 à 40 caractères, lettres, chiffres, point, tiret.");
  const erreur = controlerNouveauMotDePasse(mdp, id);
  if (erreur) throw new Error(erreur);
  const empreinte = await hacher(mdp);
  const { rows } = await pool().query<Ligne & { cree: boolean }>(
    `INSERT INTO admins (identifiant, empreinte) VALUES ($1, $2)
     ON CONFLICT (identifiant) DO UPDATE SET empreinte = EXCLUDED.empreinte, version_session = admins.version_session + 1
     RETURNING *, (xmax = 0) AS cree`,
    [id, empreinte],
  );
  return { admin: versAdmin(rows[0]), cree: rows[0].cree };
}

// --- Blocage des essais répétés --------------------------------------------------------------

async function estBloque(cles: string[]): Promise<boolean> {
  const { rows } = await pool().query(
    `SELECT 1 FROM admin_echecs WHERE cle = ANY($1) AND n >= $2 AND depuis > now() - make_interval(mins => $3) LIMIT 1`,
    [cles, ESSAIS_MAX, BLOCAGE_MIN],
  );
  return rows.length > 0;
}

async function noterEchec(cles: string[]): Promise<void> {
  for (const cle of cles) {
    await pool().query(
      `INSERT INTO admin_echecs (cle, n, depuis) VALUES ($1, 1, now())
       ON CONFLICT (cle) DO UPDATE SET
         n = CASE WHEN admin_echecs.depuis > now() - make_interval(mins => $2) THEN admin_echecs.n + 1 ELSE 1 END,
         depuis = CASE WHEN admin_echecs.depuis > now() - make_interval(mins => $2) THEN admin_echecs.depuis ELSE now() END`,
      [cle, BLOCAGE_MIN],
    );
  }
}

async function effacerEchecs(cles: string[]): Promise<void> {
  await pool().query("DELETE FROM admin_echecs WHERE cle = ANY($1) OR depuis < now() - interval '1 day'", [cles]);
}

// --- Connexion -------------------------------------------------------------------------------

export type ResultatConnexion =
  | { ok: true; jeton: string; admin: Admin; premierCompte: boolean }
  | { ok: false; raison: "identifiants" | "bloque" | "configuration" };

/**
 * Vérifie identifiant et mot de passe.
 * Premier démarrage : tant qu'aucun compte n'existe, l'identifiant ADMIN_IDENTIFIANT (par défaut « silfax »)
 * et le mot de passe ADMIN_PASSWORD créent le compte. Ensuite, ADMIN_PASSWORD n'est plus lu.
 */
export async function authentifier(identifiant: string, mdp: string, ip: string): Promise<ResultatConnexion> {
  const id = normaliserIdentifiant(identifiant);
  const cles = [`id:${id}`, `ip:${ip}`];
  if (await estBloque(cles)) return { ok: false, raison: "bloque" };

  let ligne = await parIdentifiant(id);
  let premierCompte = false;
  let ok = ligne ? await verifierEmpreinte(mdp, ligne.empreinte) : false;

  if (!ligne && (await nombreAdmins()) === 0) {
    const attendu = normaliserIdentifiant(process.env.ADMIN_IDENTIFIANT ?? "silfax");
    let mdpCorrect = false;
    try {
      mdpCorrect = await motDePasseCorrect(mdp);
    } catch {
      return { ok: false, raison: "configuration" };
    }
    if (id === attendu && mdpCorrect) {
      await enregistrerAdmin(id, mdp);
      ligne = await parIdentifiant(id);
      ok = true;
      premierCompte = true;
    }
  }

  if (!ok || !ligne) {
    await noterEchec(cles);
    await new Promise((r) => setTimeout(r, 600));
    return { ok: false, raison: "identifiants" };
  }

  await effacerEchecs(cles);
  await pool().query("UPDATE admins SET derniere_connexion = now() WHERE id = $1", [ligne.id]);
  const admin = versAdmin(ligne);
  return { ok: true, jeton: await creerJeton({ id: admin.id, version: admin.version }), admin, premierCompte };
}

/** Compte correspondant au jeton, ou null si la session n'est plus valable. */
export async function adminDepuisJeton(jeton: string | undefined): Promise<Admin | null> {
  const p: Porteur | null = await lireJeton(jeton);
  if (!p) return null;
  const { rows } = await pool().query<Ligne>("SELECT * FROM admins WHERE id = $1", [p.id]);
  const l = rows[0];
  return l && l.version_session === p.version ? versAdmin(l) : null;
}

/** Change le mot de passe après vérification de l'actuel. Ferme toutes les sessions ouvertes. */
export async function changerMotDePasse(adminId: number, actuel: string, nouveau: string): Promise<string | null> {
  const { rows } = await pool().query<Ligne>("SELECT * FROM admins WHERE id = $1", [adminId]);
  const l = rows[0];
  if (!l) return "Compte introuvable.";
  if (!(await verifierEmpreinte(actuel, l.empreinte))) return "Le mot de passe actuel est incorrect.";
  const erreur = controlerNouveauMotDePasse(nouveau, l.identifiant);
  if (erreur) return erreur;
  await pool().query("UPDATE admins SET empreinte = $2, version_session = version_session + 1 WHERE id = $1", [adminId, await hacher(nouveau)]);
  return null;
}
