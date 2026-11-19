/**
 * Numérotation continue des vidéos de chaque personnage (demandée par Jobwow le 19/11/2026) : partie 1, 2, 3…, d'une
 * soirée à l'autre et d'un jour à l'autre, même quand une série est déposée après une autre le même jour. Le registre
 * `episodes.json` est gardé dans le dossier du personnage (D:\WOW\Journal de Jobwow, …\Journal de Jobwow TheSham) :
 * il se souvient des vidéos déjà numérotées même quand leurs enregistrements ont quitté D:\WOW.
 *
 * Règles : les vidéos se numérotent dans l'ordre où elles ont été jouées ; une vidéo déjà rendue garde son numéro
 * (son titre est peut-être déjà sur YouTube) ; les autres suivent. Une soirée redécoupée remplace ses anciennes parties.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export interface Episode {
  base: string;       // nom de la vidéo sans extension (« journal-thesham_2026-11-19_p2 »)
  journee: string;    // sa journée (« journal-thesham_2026-11-19 »)
  debut: number;      // heure du début de la vidéo (heure du PC, ms) : l'ordre de la numérotation
  numero: number;
}
export interface Registre { format: 1; episodes: Episode[] }

export const FICHIER_REGISTRE = "episodes.json";

export function lireRegistre(dossier: string): Registre {
  const f = path.join(dossier, FICHIER_REGISTRE);
  try {
    const r = JSON.parse(readFileSync(f, "utf8")) as Registre;
    if (r && Array.isArray(r.episodes)) return { format: 1, episodes: r.episodes.filter((e) => e && typeof e.base === "string") };
  } catch { /* absent ou illisible : registre neuf */ }
  return { format: 1, episodes: [] };
}

export function ecrireRegistre(dossier: string, r: Registre): void {
  writeFileSync(path.join(dossier, FICHIER_REGISTRE), JSON.stringify(r, null, 2), "utf8");
}

/** Journée d'une base : sans le « _p<n> » final. */
export const journeeDe = (base: string) => base.replace(/_p\d+$/i, "");

/**
 * Début d'une vidéo déjà rangée, d'après son nom (« _2026-11-19 », « _2026-11-19_20h30 ») et le début de sa partie :
 * sert à reprendre dans le registre les vidéos préparées avant lui.
 */
export function debutDuNom(base: string, debutPartie = 0): number | null {
  const m = /_(\d{4})-(\d{2})-(\d{2})(?:_(\d{2})h(\d{2}))?(?:_p\d+)?$/i.exec(base);
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0) + Math.round(debutPartie * 1000);
}

/**
 * Numérote : les vidéos de ce passage (actuelles) remplacent celles de leurs journées, les autres restent ; l'ordre est
 * celui du jeu ; une vidéo figée (déjà rendue) garde son numéro, les suivantes continuent après lui.
 */
export function numeroter(r: Registre, actuelles: Omit<Episode, "numero">[], figee: (base: string) => boolean): Registre {
  const journees = new Set(actuelles.map((a) => a.journee));
  const anciens = new Map(r.episodes.map((e) => [e.base, e]));
  const gardes = r.episodes.filter((e) => !journees.has(e.journee));
  const tous: Episode[] = [...gardes, ...actuelles.map((a) => ({ ...a, numero: anciens.get(a.base)?.numero ?? 0 }))]
    .sort((a, b) => a.debut - b.debut || a.base.localeCompare(b.base));
  let compteur = 0;
  for (const e of tous) {
    if (e.numero && figee(e.base) && e.numero > compteur) { compteur = e.numero; continue; }
    if (e.numero && figee(e.base)) continue; // numéro figé plus petit (rare) : gardé tel quel
    e.numero = ++compteur;
  }
  return { format: 1, episodes: tous };
}

/** Vidéos déjà rangées dans le dossier d'un personnage mais absentes du registre (préparées avant lui). */
export function episodesDuDossier(dossier: string, prefixe: string): Omit<Episode, "numero">[] {
  if (!existsSync(dossier)) return [];
  const out: Omit<Episode, "numero">[] = [];
  for (const f of readdirSync(dossier)) {
    const m = new RegExp(`^(${prefixe.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}_[^.]+)\\.narration\\.json$`, "i").exec(f);
    if (!m) continue;
    let debutPartie = 0;
    try { debutPartie = (JSON.parse(readFileSync(path.join(dossier, f), "utf8")) as { extrait?: { debut: number } }).extrait?.debut ?? 0; } catch { /* nom seul */ }
    const debut = debutDuNom(m[1], debutPartie);
    if (debut !== null) out.push({ base: m[1], journee: journeeDe(m[1]), debut });
  }
  return out;
}

export const numeroDe = (r: Registre, base: string) => r.episodes.find((e) => e.base === base)?.numero ?? null;

/** La vidéo qui suit dans la série du personnage (même soirée ou soirée suivante). */
export function episodeSuivant(r: Registre, base: string): Episode | null {
  const n = numeroDe(r, base);
  if (n === null) return null;
  return r.episodes.filter((e) => e.numero > n).sort((a, b) => a.numero - b.numero)[0] ?? null;
}
