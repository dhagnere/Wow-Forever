import { pool } from "../db/pool";

/**
 * Guides à valider de Probe (/admin/probe) : chaque code collé depuis /ep export devient une ligne de probe_guides,
 * avec le guide analysé (zones, étapes, quêtes inconnues, trajets), le résultat de la vérification et, une fois publié,
 * les parcours relevés qu'il apporte aux pages du guide de 1 à 60. Le module ne connaît pas le format du guide :
 * il garde ce que lui donne lib/probe.ts.
 */

export type EtatProbe = "a_valider" | "publie" | "ecarte" | "retire";
export type PorteeProbe = "classe" | "race" | "faction";

/** Même forme que ParcoursReleve (content/parcours-releves.ts). */
export interface ReleveProbe { race: string; classe: string | null; lieu: string; etapes: string[]; source: string }

export interface LigneProbe {
  id: number;
  recuLe: Date;
  personnage: string;
  race: string | null;
  classe: string | null;
  faction: string | null;
  partie: string | null;
  portee: PorteeProbe;
  etat: EtatProbe;
  guide: unknown;
  verification: unknown;
  releves: ReleveProbe[];
  decideLe: Date | null;
}

type Brut = {
  id: number; recu_le: Date; personnage: string; race: string | null; classe: string | null; faction: string | null;
  partie: string | null; portee: PorteeProbe; etat: EtatProbe; guide: unknown; verification: unknown; releves: ReleveProbe[]; decide_le: Date | null;
};
const ligne = (r: Brut): LigneProbe => ({
  id: r.id, recuLe: r.recu_le, personnage: r.personnage, race: r.race, classe: r.classe, faction: r.faction, partie: r.partie,
  portee: r.portee, etat: r.etat, guide: r.guide, verification: r.verification, releves: r.releves ?? [], decideLe: r.decide_le,
});

export async function deposerGuideProbe(d: {
  personnage: string; race: string | null; classe: string | null; faction: string | null; partie: string | null;
  portee: PorteeProbe; guide: unknown; verification: unknown;
}): Promise<number> {
  const { rows } = await pool().query<{ id: number }>(
    `INSERT INTO probe_guides (personnage, race, classe, faction, partie, portee, guide, verification)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [d.personnage.slice(0, 80), d.race, d.classe, d.faction, d.partie, d.portee, JSON.stringify(d.guide), JSON.stringify(d.verification)],
  );
  return rows[0].id;
}

export async function guidesProbe(etats: EtatProbe[]): Promise<LigneProbe[]> {
  const { rows } = await pool().query<Brut>("SELECT * FROM probe_guides WHERE etat = ANY($1::text[]) ORDER BY recu_le DESC LIMIT 200", [etats]);
  return rows.map(ligne);
}

export async function lireGuideProbe(id: number): Promise<LigneProbe | null> {
  const { rows } = await pool().query<Brut>("SELECT * FROM probe_guides WHERE id = $1", [id]);
  return rows[0] ? ligne(rows[0]) : null;
}

/** Publie un guide : ses parcours relevés passent en ligne. Seul un guide à valider ou retiré peut l'être. */
export async function publierGuideProbe(id: number, portee: PorteeProbe, verification: unknown, releves: ReleveProbe[]): Promise<boolean> {
  const r = await pool().query(
    `UPDATE probe_guides SET etat = 'publie', portee = $2, verification = $3, releves = $4, decide_le = now()
     WHERE id = $1 AND etat IN ('a_valider', 'retire')`,
    [id, portee, JSON.stringify(verification), JSON.stringify(releves)],
  );
  return (r.rowCount ?? 0) > 0;
}

/** Écarte un guide à valider, ou retire un guide publié (il reste dans l'historique et peut être republié). */
export async function decliner(id: number, etat: "ecarte" | "retire"): Promise<boolean> {
  const depuis = etat === "ecarte" ? "a_valider" : "publie";
  const r = await pool().query("UPDATE probe_guides SET etat = $2, decide_le = now() WHERE id = $1 AND etat = $3", [id, etat, depuis]);
  return (r.rowCount ?? 0) > 0;
}

/**
 * Parcours relevés de tous les guides publiés, du plus récent au plus ancien (le plus récent l'emporte pour une même
 * race et une même zone). Lu par les pages du guide ; renvoie une liste vide si la base ne répond pas (compilation).
 */
export async function parcoursProbePublies(): Promise<ReleveProbe[]> {
  try {
    const requete = pool().query<{ releves: ReleveProbe[] }>(
      "SELECT releves FROM probe_guides WHERE etat = 'publie' ORDER BY decide_le DESC NULLS LAST, id DESC",
    );
    requete.catch(() => undefined);
    // pas plus de 3 s : une base injoignable ne doit pas bloquer la compilation des pages
    const delai = new Promise<null>((r) => setTimeout(() => r(null), 3000).unref?.());
    const res = await Promise.race([requete, delai]);
    return res ? res.rows.flatMap((r) => r.releves ?? []) : [];
  } catch {
    return [];
  }
}
