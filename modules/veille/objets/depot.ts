import sharp from "sharp";
import { pool } from "../db/pool";
import { normaliser } from "../collecte/texte";
import { decoderBlp } from "./blp";
import { convertirCategories, convertirEnsembles, convertirObjets, type LigneObjet } from "./conversion";
import { derniereVersion, fichierBrut, tableCsv } from "./wago";

/** Base d'objets de WoW Forever : import depuis wago.tools, lecture pour le site, icônes en cache. */

export const OBJETS_PAR_PAGE = 50;

export interface ObjetResume {
  id: number;
  nom: string;
  qualite: number;
  niveauObjet: number;
  niveauRequis: number;
  classe: number;
  sousClasse: number;
  emplacement: number;
  icone: number;
  categorie: string;
}

export interface Objet extends ObjetResume {
  description: string;
  lien: number;
  classesAutorisees: number;
  prixVente: number;
  prixAchat: number;
  pile: number;
  exemplairesMax: number;
  vitesseMs: number;
  casesSac: number;
  nomClasse: string;
  ensemble: { id: number; nom: string; objets: ObjetResume[] } | null;
}

export interface Categorie {
  classe: number;
  nom: string;
  total: number;
  sous: { sousClasse: number; nom: string; total: number }[];
}

export interface EtatBase { version: string; nombre: number; importeLe: Date }

export interface FiltresObjets {
  q?: string;
  classe?: number;
  sousClasse?: number;
  qualite?: number;
  niveauMin?: number;
  niveauMax?: number;
  page?: number;
}

// ---------------------------------------------------------------- Import

export interface BilanImport { version: string; nombre: number; ignore: boolean; icones?: number }

const COLONNES_OBJETS = [
  "id", "nom", "nom_recherche", "description", "classe", "sous_classe", "qualite", "niveau_objet", "niveau_requis",
  "emplacement", "lien", "classes_autorisees", "prix_vente", "prix_achat", "pile", "exemplaires_max", "vitesse_ms",
  "cases_sac", "ensemble", "icone",
] as const;

function valeursObjet(o: LigneObjet): unknown[] {
  return [
    o.id, o.nom, o.nomRecherche, o.description, o.classe, o.sousClasse, o.qualite, o.niveauObjet, o.niveauRequis,
    o.emplacement, o.lien, o.classesAutorisees, o.prixVente, o.prixAchat, o.pile, o.exemplairesMax, o.vitesseMs,
    o.casesSac, o.ensemble, o.icone,
  ];
}

/** Insertion par paquets : une requête pour plusieurs centaines de lignes. */
async function insererParPaquets(
  client: import("pg").PoolClient, table: string, colonnes: readonly string[], lignes: unknown[][], taille = 500,
): Promise<void> {
  for (let i = 0; i < lignes.length; i += taille) {
    const paquet = lignes.slice(i, i + taille);
    const valeurs: unknown[] = [];
    const tuples = paquet.map((l) => {
      const debut = valeurs.length;
      valeurs.push(...l);
      return `(${l.map((_, j) => `$${debut + j + 1}`).join(", ")})`;
    });
    await client.query(`INSERT INTO ${table} (${colonnes.join(", ")}) VALUES ${tuples.join(", ")}`, valeurs);
  }
}

/**
 * Importe la base d'objets de la dernière version du jeu. Sans changement de version, rien n'est refait
 * (sauf avec forcer). Le remplacement se fait en une transaction : le site ne voit jamais une base à moitié remplie.
 */
export async function importerObjets(options: { forcer?: boolean; version?: string } = {}): Promise<BilanImport> {
  const version = options.version ?? (await derniereVersion());
  const actuel = await etatBase();
  if (!options.forcer && actuel?.version === version) return { version, nombre: actuel.nombre, ignore: true };

  const [sparse, item, classes, sousClasses, ensemblesCsv] = await Promise.all(
    ["ItemSparse", "Item", "ItemClass", "ItemSubClass", "ItemSet"].map((t) => tableCsv(t, version)),
  );
  const objets = convertirObjets(sparse, item);
  const categories = convertirCategories(classes, sousClasses);
  const ensembles = convertirEnsembles(ensemblesCsv);
  // Garde-fou : une table quasi vide signale un incident chez wago.tools, pas une base de jeu vidée.
  if (objets.length < 1000) throw new Error(`Seulement ${objets.length} objets lus : import annulé, base inchangée.`);

  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    await client.query("TRUNCATE objets, objets_categories, objets_ensembles");
    await insererParPaquets(client, "objets", COLONNES_OBJETS, objets.map(valeursObjet));
    await insererParPaquets(client, "objets_categories", ["classe", "sous_classe", "nom", "nom_long"],
      categories.map((c) => [c.classe, c.sousClasse, c.nom, c.nomLong]));
    await insererParPaquets(client, "objets_ensembles", ["id", "nom"], ensembles.map((e) => [e.id, e.nom]));
    await client.query(
      `INSERT INTO objets_import (id, version, nombre, importe_le) VALUES (1, $1, $2, now())
       ON CONFLICT (id) DO UPDATE SET version = EXCLUDED.version, nombre = EXCLUDED.nombre, importe_le = now()`,
      [version, objets.length],
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  return { version, nombre: objets.length, ignore: false };
}

export async function etatBase(): Promise<EtatBase | null> {
  const { rows } = await pool().query<{ version: string; nombre: number; importe_le: Date }>(
    "SELECT version, nombre, importe_le FROM objets_import WHERE id = 1",
  );
  return rows[0] ? { version: rows[0].version, nombre: rows[0].nombre, importeLe: rows[0].importe_le } : null;
}

// ---------------------------------------------------------------- Lecture

interface LigneResume {
  id: number; nom: string; qualite: number; niveau_objet: number; niveau_requis: number; classe: number;
  sous_classe: number; emplacement: number; icone: number; categorie: string | null;
}

function versResume(l: LigneResume): ObjetResume {
  return {
    id: l.id, nom: l.nom, qualite: l.qualite, niveauObjet: l.niveau_objet, niveauRequis: l.niveau_requis, classe: l.classe,
    sousClasse: l.sous_classe, emplacement: l.emplacement, icone: l.icone, categorie: l.categorie ?? "",
  };
}

const SELECT_RESUME = `
  SELECT o.id, o.nom, o.qualite, o.niveau_objet, o.niveau_requis, o.classe, o.sous_classe, o.emplacement, o.icone,
         COALESCE(NULLIF(sc.nom_long, ''), sc.nom, c.nom) AS categorie
    FROM objets o
    LEFT JOIN objets_categories c ON c.classe = o.classe AND c.sous_classe = -1
    LEFT JOIN objets_categories sc ON sc.classe = o.classe AND sc.sous_classe = o.sous_classe`;

/** Arbre des catégories qui contiennent au moins un objet, avec leurs compteurs. */
export async function categoriesObjets(): Promise<Categorie[]> {
  const { rows } = await pool().query<{ classe: number; sous_classe: number; total: number; nom_classe: string | null; nom_sous: string | null }>(`
    SELECT o.classe, o.sous_classe, count(*)::int AS total, c.nom AS nom_classe,
           COALESCE(NULLIF(sc.nom_long, ''), sc.nom) AS nom_sous
      FROM objets o
      LEFT JOIN objets_categories c ON c.classe = o.classe AND c.sous_classe = -1
      LEFT JOIN objets_categories sc ON sc.classe = o.classe AND sc.sous_classe = o.sous_classe
     GROUP BY o.classe, o.sous_classe, c.nom, sc.nom_long, sc.nom
     ORDER BY o.classe, o.sous_classe`);
  const parClasse = new Map<number, Categorie>();
  for (const r of rows) {
    let cat = parClasse.get(r.classe);
    if (!cat) {
      cat = { classe: r.classe, nom: r.nom_classe ?? `Catégorie ${r.classe}`, total: 0, sous: [] };
      parClasse.set(r.classe, cat);
    }
    cat.total += r.total;
    cat.sous.push({ sousClasse: r.sous_classe, nom: r.nom_sous ?? cat.nom, total: r.total });
  }
  return [...parClasse.values()];
}

/** Recherche et filtres de la liste d'objets, par pages de OBJETS_PAR_PAGE. */
export async function chercherObjets(f: FiltresObjets): Promise<{ objets: ObjetResume[]; total: number }> {
  const conditions: string[] = [];
  const valeurs: unknown[] = [];
  const param = (v: unknown) => {
    valeurs.push(v);
    return `$${valeurs.length}`;
  };
  // Le texte cherché est normalisé comme les noms (minuscules, sans accents ni ponctuation) : chaque mot doit apparaître.
  const mots = normaliser(f.q ?? "").split(" ").filter(Boolean).slice(0, 6);
  for (const m of mots) conditions.push(`o.nom_recherche LIKE ${param(`%${m}%`)}`);
  if (f.classe !== undefined) conditions.push(`o.classe = ${param(f.classe)}`);
  if (f.classe !== undefined && f.sousClasse !== undefined) conditions.push(`o.sous_classe = ${param(f.sousClasse)}`);
  if (f.qualite !== undefined) conditions.push(`o.qualite = ${param(f.qualite)}`);
  if (f.niveauMin !== undefined) conditions.push(`o.niveau_requis >= ${param(f.niveauMin)}`);
  if (f.niveauMax !== undefined) conditions.push(`o.niveau_requis <= ${param(f.niveauMax)}`);
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { rows: compte } = await pool().query<{ n: number }>(`SELECT count(*)::int AS n FROM objets o ${where}`, valeurs);
  const page = Math.max(1, Math.floor(f.page ?? 1));
  const phrase = mots.join(" ");
  // Avec une recherche : le nom exact d'abord, puis les noms qui commencent par le texte cherché.
  const ordre = phrase
    ? `(o.nom_recherche = ${param(phrase)}) DESC, (o.nom_recherche LIKE ${param(`${phrase}%`)}) DESC, o.qualite DESC, o.niveau_objet DESC, o.nom`
    : "o.niveau_objet DESC, o.qualite DESC, o.nom";
  const { rows } = await pool().query<LigneResume>(
    `${SELECT_RESUME} ${where} ORDER BY ${ordre} LIMIT ${OBJETS_PAR_PAGE} OFFSET ${param((page - 1) * OBJETS_PAR_PAGE)}`,
    valeurs,
  );
  return { objets: rows.map(versResume), total: compte[0]?.n ?? 0 };
}

export async function lireObjet(id: number): Promise<Objet | null> {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const { rows } = await pool().query<LigneResume & {
    description: string; lien: number; classes_autorisees: number; prix_vente: string; prix_achat: string; pile: number;
    exemplaires_max: number; vitesse_ms: number; cases_sac: number; ensemble: number | null; nom_classe: string | null; nom_ensemble: string | null;
  }>(
    `SELECT o.*, COALESCE(NULLIF(sc.nom_long, ''), sc.nom, c.nom) AS categorie, c.nom AS nom_classe, e.nom AS nom_ensemble
       FROM objets o
       LEFT JOIN objets_categories c ON c.classe = o.classe AND c.sous_classe = -1
       LEFT JOIN objets_categories sc ON sc.classe = o.classe AND sc.sous_classe = o.sous_classe
       LEFT JOIN objets_ensembles e ON e.id = o.ensemble
      WHERE o.id = $1`,
    [id],
  );
  const l = rows[0];
  if (!l) return null;
  let ensemble: Objet["ensemble"] = null;
  if (l.ensemble && l.nom_ensemble) {
    const { rows: pieces } = await pool().query<LigneResume>(`${SELECT_RESUME} WHERE o.ensemble = $1 ORDER BY o.emplacement, o.nom`, [l.ensemble]);
    ensemble = { id: l.ensemble, nom: l.nom_ensemble, objets: pieces.map(versResume) };
  }
  return {
    ...versResume(l),
    description: l.description, lien: l.lien, classesAutorisees: l.classes_autorisees,
    prixVente: Number(l.prix_vente), prixAchat: Number(l.prix_achat), pile: l.pile, exemplairesMax: l.exemplaires_max,
    vitesseMs: l.vitesse_ms, casesSac: l.cases_sac, nomClasse: l.nom_classe ?? "", ensemble,
  };
}

/** Pour le plan du site : les objets de bonne qualité et au-delà. */
export async function listerObjetsPourPlan(limite = 20000): Promise<{ id: number }[]> {
  const { rows } = await pool().query<{ id: number }>("SELECT id FROM objets WHERE qualite >= 2 ORDER BY id LIMIT $1", [limite]);
  return rows;
}

// ---------------------------------------------------------------- Icônes

/** Icône de l'objet en PNG 64 × 64, convertie à la première demande puis gardée en base. */
export async function iconeObjet(id: number): Promise<Buffer | null> {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const { rows } = await pool().query<{ png: Buffer }>("SELECT png FROM objets_icones WHERE id = $1", [id]);
  if (rows[0]) return rows[0].png;
  // Seules les icônes d'objets connus sont demandées à wago.tools : pas de relais ouvert vers leurs fichiers.
  const { rows: connue } = await pool().query("SELECT 1 FROM objets WHERE icone = $1 LIMIT 1", [id]);
  if (!connue.length) return null;
  const etat = await etatBase();
  if (!etat) return null;
  const png = await convertirIcone(await fichierBrut(id, etat.version));
  await pool().query("INSERT INTO objets_icones (id, png) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING", [id, png]);
  return png;
}

export async function convertirIcone(blp: Buffer): Promise<Buffer> {
  const img = decoderBlp(blp);
  return sharp(img.pixels, { raw: { width: img.largeur, height: img.hauteur, channels: 4 } })
    .resize(64, 64, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Remplit le cache des icônes manquantes, quelques téléchargements à la fois. */
export async function prechargerIcones(simultanes = 4): Promise<{ ajoutees: number; echecs: number }> {
  const { rows } = await pool().query<{ icone: number }>(
    "SELECT DISTINCT o.icone FROM objets o LEFT JOIN objets_icones i ON i.id = o.icone WHERE i.id IS NULL AND o.icone > 0",
  );
  let ajoutees = 0;
  let echecs = 0;
  const file = rows.map((r) => r.icone);
  await Promise.all(
    Array.from({ length: simultanes }, async () => {
      for (let id = file.shift(); id !== undefined; id = file.shift()) {
        try {
          if (await iconeObjet(id)) ajoutees++;
        } catch {
          echecs++;
        }
      }
    }),
  );
  return { ajoutees, echecs };
}
