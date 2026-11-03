import { createHash, randomBytes } from "node:crypto";
import { pool } from "../db/pool";
import { empreinteDuJour } from "../statistiques/classement";
import { slugGuilde, type Faction, type FicheGuilde, type TypeRoyaume } from "./validation";

/**
 * Tableau des guildes. Une fiche déposée attend la relecture de Jobwow avant d'être publiée.
 * Le responsable reçoit un lien secret pour la modifier ; une modification repasse en relecture
 * sans disparaître du tableau. Une fiche non confirmée depuis 90 jours n'est plus affichée.
 */

export const DUREE_VALIDITE_JOURS = 90;
const DEPOTS_PAR_JOUR = 3;

export type StatutGuilde = "en_attente" | "publiee" | "refusee";

export interface Guilde extends FicheGuilde {
  id: number;
  slug: string;
  statut: StatutGuilde;
  aRelire: boolean;
  creeLe: Date;
  majLe: Date;
}

interface Ligne {
  id: number; slug: string; nom: string; faction: Faction; serveur: string; type_royaume: TypeRoyaume; objectifs: string[];
  classes: string[]; roles: string[]; horaires: string; description: string; discord: string; site: string; contact_jeu: string;
  recrute: boolean; statut: StatutGuilde; a_relire: boolean; cree_le: Date; maj_le: Date;
}

const COLONNES =
  "id, slug, nom, faction, serveur, type_royaume, objectifs, classes, roles, horaires, description, discord, site, contact_jeu, recrute, statut, a_relire, cree_le, maj_le";

function versGuilde(l: Ligne): Guilde {
  return {
    id: l.id, slug: l.slug, nom: l.nom, faction: l.faction, serveur: l.serveur, typeRoyaume: l.type_royaume, objectifs: l.objectifs,
    classes: l.classes, roles: l.roles, horaires: l.horaires, description: l.description, discord: l.discord, site: l.site,
    contactJeu: l.contact_jeu, recrute: l.recrute, statut: l.statut, aRelire: l.a_relire, creeLe: l.cree_le, majLe: l.maj_le,
  };
}

const empreinte = (jeton: string) => createHash("sha256").update(jeton).digest("hex");

export class ErreurGuilde extends Error {}

/** Empreinte du jour de la connexion qui dépose, pour limiter les dépôts. L'adresse IP n'est pas conservée. */
export function empreinteDepot(ip: string, ua: string): string {
  const sel = process.env.STATS_SEL ?? process.env.SESSION_SECRET ?? "taverne";
  return empreinteDuJour(`guildes|${sel}`, ip, ua);
}

/** Dépose une fiche. Renvoie le jeton secret de modification, à montrer une seule fois au responsable. */
export async function deposerGuilde(f: FicheGuilde, depot: string): Promise<{ slug: string; jeton: string }> {
  const db = pool();
  const { rows: recents } = await db.query<{ n: number }>(
    "SELECT count(*)::int AS n FROM guildes WHERE depot_empreinte = $1 AND cree_le > now() - interval '1 day'",
    [depot],
  );
  if ((recents[0]?.n ?? 0) >= DEPOTS_PAR_JOUR) throw new ErreurGuilde("Trop de fiches déposées aujourd'hui depuis cette connexion. Réessayez demain.");
  const { rows: doublon } = await db.query(
    "SELECT 1 FROM guildes WHERE lower(nom) = lower($1) AND lower(serveur) = lower($2) AND faction = $3 AND statut <> 'refusee'",
    [f.nom, f.serveur, f.faction],
  );
  if (doublon.length) throw new ErreurGuilde("Cette guilde a déjà sa fiche. Pour la modifier, utilisez le lien reçu à l'inscription, ou écrivez-nous.");

  const base = slugGuilde(f.nom, f.serveur);
  const { rows: pris } = await db.query<{ slug: string }>("SELECT slug FROM guildes WHERE slug = $1 OR slug LIKE $1 || '-%'", [base]);
  const occupes = new Set(pris.map((r) => r.slug));
  let slug = base;
  for (let i = 2; occupes.has(slug); i++) slug = `${base}-${i}`;

  const jeton = randomBytes(24).toString("base64url");
  await db.query(
    `INSERT INTO guildes (slug, nom, faction, serveur, type_royaume, objectifs, classes, roles, horaires, description, discord, site, contact_jeu, recrute, jeton_empreinte, depot_empreinte)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [slug, f.nom, f.faction, f.serveur, f.typeRoyaume, f.objectifs, f.classes, f.roles, f.horaires, f.description, f.discord, f.site, f.contactJeu, f.recrute, empreinte(jeton), depot],
  );
  return { slug, jeton };
}

/** Fiche correspondant à un lien de modification, ou null. Seule l'empreinte du jeton est en base. */
export async function guildeParJeton(jeton: string): Promise<Guilde | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(jeton)) return null;
  const { rows } = await pool().query<Ligne>(`SELECT ${COLONNES} FROM guildes WHERE jeton_empreinte = $1 AND statut <> 'refusee'`, [empreinte(jeton)]);
  return rows[0] ? versGuilde(rows[0]) : null;
}

/** Mise à jour par le responsable : la fiche reste visible si elle l'était, et repasse en relecture. */
export async function modifierGuilde(jeton: string, f: FicheGuilde): Promise<Guilde> {
  const actuelle = await guildeParJeton(jeton);
  if (!actuelle) throw new ErreurGuilde("Lien de modification invalide.");
  const { rows } = await pool().query<Ligne>(
    `UPDATE guildes SET nom=$2, faction=$3, serveur=$4, type_royaume=$5, objectifs=$6, classes=$7, roles=$8, horaires=$9, description=$10,
       discord=$11, site=$12, contact_jeu=$13, recrute=$14, a_relire=true, maj_le=now()
     WHERE id=$1 RETURNING ${COLONNES}`,
    [actuelle.id, f.nom, f.faction, f.serveur, f.typeRoyaume, f.objectifs, f.classes, f.roles, f.horaires, f.description, f.discord, f.site, f.contactJeu, f.recrute],
  );
  return versGuilde(rows[0]);
}

/** « Toujours actifs » : remet la fiche en tête du tableau, sans relecture. */
export async function confirmerGuilde(jeton: string): Promise<void> {
  const g = await guildeParJeton(jeton);
  if (!g) throw new ErreurGuilde("Lien de modification invalide.");
  await pool().query("UPDATE guildes SET maj_le = now() WHERE id = $1", [g.id]);
}

export interface FiltresGuildes { faction?: string; type?: string; objectif?: string; classe?: string; recrute?: boolean }

/** Fiches publiées et confirmées depuis moins de 90 jours, les plus récemment mises à jour d'abord. */
export async function listerGuildes(f: FiltresGuildes = {}): Promise<Guilde[]> {
  const conditions = ["statut = 'publiee'", `maj_le > now() - interval '${DUREE_VALIDITE_JOURS} days'`];
  const valeurs: unknown[] = [];
  const param = (v: unknown) => {
    valeurs.push(v);
    return `$${valeurs.length}`;
  };
  if (f.faction) conditions.push(`faction = ${param(f.faction)}`);
  if (f.type) conditions.push(`type_royaume = ${param(f.type)}`);
  if (f.objectif) conditions.push(`${param(f.objectif)} = ANY(objectifs)`);
  if (f.classe) conditions.push(`${param(f.classe)} = ANY(classes)`);
  if (f.recrute) conditions.push("recrute");
  const { rows } = await pool().query<Ligne>(`SELECT ${COLONNES} FROM guildes WHERE ${conditions.join(" AND ")} ORDER BY maj_le DESC LIMIT 300`, valeurs);
  return rows.map(versGuilde);
}

export async function lireGuilde(slug: string): Promise<Guilde | null> {
  const { rows } = await pool().query<Ligne>(
    `SELECT ${COLONNES} FROM guildes WHERE slug = $1 AND statut = 'publiee' AND maj_le > now() - interval '${DUREE_VALIDITE_JOURS} days'`,
    [slug],
  );
  return rows[0] ? versGuilde(rows[0]) : null;
}

// ---------------------------------------------------------------- Administration

export async function guildesARelire(): Promise<Guilde[]> {
  const { rows } = await pool().query<Ligne>(
    `SELECT ${COLONNES} FROM guildes WHERE statut = 'en_attente' OR (statut = 'publiee' AND a_relire) ORDER BY maj_le`,
  );
  return rows.map(versGuilde);
}

export async function guildesPubliees(): Promise<Guilde[]> {
  const { rows } = await pool().query<Ligne>(`SELECT ${COLONNES} FROM guildes WHERE statut = 'publiee' AND NOT a_relire ORDER BY maj_le DESC`);
  return rows.map(versGuilde);
}

export async function deciderGuilde(id: number, decision: "publier" | "refuser" | "supprimer"): Promise<void> {
  if (!Number.isSafeInteger(id)) return;
  if (decision === "supprimer") {
    await pool().query("DELETE FROM guildes WHERE id = $1", [id]);
    return;
  }
  await pool().query("UPDATE guildes SET statut = $2, a_relire = false WHERE id = $1", [id, decision === "publier" ? "publiee" : "refusee"]);
}

export async function listerGuildesPourPlan(): Promise<{ slug: string; majLe: Date }[]> {
  const { rows } = await pool().query<{ slug: string; maj_le: Date }>(
    `SELECT slug, maj_le FROM guildes WHERE statut = 'publiee' AND maj_le > now() - interval '${DUREE_VALIDITE_JOURS} days'`,
  );
  return rows.map((r) => ({ slug: r.slug, majLe: r.maj_le }));
}
