/**
 * Journal des passages de veille et lancement à la demande depuis le tableau de bord.
 */
import { spawn } from "node:child_process";
import { pool } from "./db/pool";
import { config } from "./config";

export type ModePassage = "essai" | "quotidien";

export interface PassageJournal {
  id: number;
  mode: ModePassage;
  declencheur: string;
  debut: Date;
  fin: Date | null;
  statut: "en_cours" | "termine" | "echec";
  resume: string | null;
  erreur: string | null;
}

/** Au-delà de cette durée, un passage resté « en cours » est considéré comme interrompu. */
const DUREE_MAX_MIN = 45;

export async function passageEnCours(): Promise<PassageJournal | null> {
  const { rows } = await pool().query<PassageJournal>(
    `SELECT * FROM veille_passages WHERE statut='en_cours' AND debut > now() - make_interval(mins => $1)
     ORDER BY debut DESC LIMIT 1`,
    [DUREE_MAX_MIN],
  );
  return rows[0] ?? null;
}

/** Ouvre une entrée de journal ; renvoie null si un autre passage tourne déjà. */
export async function ouvrirPassage(mode: ModePassage, declencheur: string): Promise<number | null> {
  if (await passageEnCours()) return null;
  await pool().query(
    `UPDATE veille_passages SET statut='echec', fin=now(), erreur='Interrompu (délai dépassé).'
     WHERE statut='en_cours' AND debut <= now() - make_interval(mins => $1)`,
    [DUREE_MAX_MIN],
  );
  const { rows } = await pool().query<{ id: number }>(
    "INSERT INTO veille_passages (mode, declencheur) VALUES ($1, $2) RETURNING id",
    [mode, declencheur.slice(0, 60)],
  );
  return rows[0].id;
}

export async function fermerPassage(id: number, r: { resume?: string; erreur?: string }): Promise<void> {
  await pool().query("UPDATE veille_passages SET fin=now(), statut=$2, resume=$3, erreur=$4 WHERE id=$1", [
    id,
    r.erreur ? "echec" : "termine",
    r.resume?.slice(0, 500) ?? null,
    r.erreur?.slice(0, 1000) ?? null,
  ]);
}

export async function historiquePassages(limite = 8): Promise<PassageJournal[]> {
  const { rows } = await pool().query<PassageJournal>("SELECT * FROM veille_passages ORDER BY debut DESC LIMIT $1", [limite]);
  return rows;
}

/**
 * Lance un passage dans un processus séparé (même commande que le planificateur Scalingo).
 * La sortie rejoint les journaux de l'application. Renvoie un message d'erreur, ou null si lancé.
 */
export async function lancerPassage(mode: ModePassage, declencheur: string): Promise<string | null> {
  if (mode === "quotidien" && !config.anthropicConfigure())
    return "La clé ANTHROPIC_API_KEY n'est pas renseignée : la rédaction est impossible. Le classement seul reste disponible.";
  const enCours = await passageEnCours();
  if (enCours) return "Un passage est déjà en cours. Patientez quelques minutes.";
  const script = mode === "quotidien" ? "veille:quotidien" : "veille:essai";
  const enfant = spawn("npm", ["run", script], {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit",
    env: { ...process.env, VEILLE_DECLENCHEUR: declencheur },
  });
  enfant.on("error", (e) => console.error(`[${script}] lancement impossible :`, e.message));
  enfant.unref();
  return null;
}
