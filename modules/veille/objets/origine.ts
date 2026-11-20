/**
 * Icônes des objets de l'Azeroth d'origine que les fichiers de Forever ne décrivent plus (butin des donjons et raids).
 * L'identifiant du fichier d'icône est lu dans la table Item des fichiers de Classic Era (wago.tools), pour les seuls objets
 * du butin des bases libres (butin.json.gz) absents de la base d'objets. L'image elle-même passe ensuite par le même cache
 * que les autres icônes (objets_icones, `iconeObjet`), à la première demande.
 */
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { pool } from "../db/pool";
import { lignes } from "./conversion";
import { iconeFichier } from "./depot";
import { derniereVersion, produitOrigine, tableCsv } from "./wago";

/**
 * Objets de l'Azeroth d'origine connus des bases libres : butin des donjons et raids (content/donjons-jeu.json, npm run base:donjons)
 * et objets de « Où le trouver » (butin.json.gz).
 */
export function idsButinOrigine(): number[] {
  const ids = new Set<number>();
  const lire = (fichier: string, gz: boolean) => {
    try {
      const brut = readFileSync(path.join(process.cwd(), fichier));
      const donnees = JSON.parse((gz ? gunzipSync(brut) : brut).toString("utf8")) as { objets?: Record<string, unknown> };
      for (const k of Object.keys(donnees.objets ?? {})) ids.add(Number(k));
    } catch {
      // Fichier absent : l'autre suffit.
    }
  };
  lire("content/donjons-jeu.json", false);
  lire("modules/veille/objets/donnees/butin.json.gz", true);
  return [...ids].filter((n) => Number.isSafeInteger(n) && n > 0);
}

export interface BilanIconesOrigine {
  version: string;
  cherches: number;
  trouves: number;
}

/**
 * Relit la table Item de Classic Era et note l'icône de chaque objet du butin d'origine absent de la base d'objets.
 * Rien n'est effacé : une icône déjà notée est mise à jour si le fichier a changé.
 */
export async function majIconesOrigine(): Promise<BilanIconesOrigine> {
  const tous = idsButinOrigine();
  const { rows } = await pool().query<{ id: number }>("SELECT id FROM objets WHERE id = ANY($1::int[])", [tous]);
  const connus = new Set(rows.map((r) => r.id));
  const cherches = new Set(tous.filter((id) => !connus.has(id)));
  const version = await derniereVersion(produitOrigine());
  const items = lignes(await tableCsv("Item", version, "enUS"));
  if (items.length < 1000 || !items[0] || !("IconFileDataID" in items[0])) {
    throw new Error(`Table Item de ${produitOrigine()} illisible (${items.length} lignes) : rien n'est modifié.`);
  }
  const ids: number[] = [];
  const icones: number[] = [];
  for (const l of items) {
    const id = Number(l.ID);
    const icone = Number(l.IconFileDataID);
    if (cherches.has(id) && Number.isSafeInteger(icone) && icone > 0) {
      ids.push(id);
      icones.push(icone);
    }
  }
  if (ids.length) {
    await pool().query(
      `INSERT INTO objets_origine_icones (id, icone)
         SELECT * FROM UNNEST($1::int[], $2::int[])
       ON CONFLICT (id) DO UPDATE SET icone = EXCLUDED.icone, maj_le = now()
         WHERE objets_origine_icones.icone <> EXCLUDED.icone`,
      [ids, icones],
    );
  }
  return { version, cherches: cherches.size, trouves: ids.length };
}

/** Icônes notées pour des objets d'origine : identifiant de l'objet → identifiant du fichier d'icône. */
export async function iconesOrigine(ids: number[]): Promise<Map<number, number>> {
  const propres = ids.filter((n) => Number.isSafeInteger(n) && n > 0);
  if (!propres.length) return new Map();
  const { rows } = await pool().query<{ id: number; icone: number }>(
    "SELECT id, icone FROM objets_origine_icones WHERE id = ANY($1::int[])",
    [propres],
  );
  return new Map(rows.map((r) => [r.id, r.icone]));
}

/** Icône (PNG 64 × 64) d'un objet d'origine par l'identifiant de l'objet ; null tant que son icône n'est pas notée. */
export async function iconeObjetOrigine(idObjet: number): Promise<Buffer | null> {
  if (!Number.isSafeInteger(idObjet) || idObjet <= 0) return null;
  const { rows } = await pool().query<{ icone: number }>("SELECT icone FROM objets_origine_icones WHERE id = $1", [idObjet]);
  return rows[0] ? iconeFichier(rows[0].icone) : null;
}
