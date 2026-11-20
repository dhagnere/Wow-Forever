import { readFileSync } from "node:fs";
import path from "node:path";
import { FICHES_ORIGINE, type DonjonReference } from "@/content/reference";

/**
 * Donjons et raids de l'Azeroth d'origine : boss dans l'ordre des rencontres, butin, rares, entrées et quêtes, lus dans
 * content/donjons-jeu.json (npm run base:donjons, bases libres CMaNGOS et AzerothCore). Le butin est celui de l'Azeroth
 * d'origine : la page lit chaque objet dans la base d'objets du site (fichiers de Forever) ; un objet que Forever ne décrit
 * pas s'affiche avec le nom et la qualité des bases libres (objetOrigine), signalé comme à confirmer. Un relevé en jeu
 * (TaverneTrace, table butin_releve) remplace le butin d'origine boss par boss.
 */

/** Objet du butin tel que les bases libres le décrivent : n nom français, en nom anglais, q qualité, c/sc classe, s emplacement. */
export interface ObjetOrigine { n: string; en: string; q: number; c: number; sc: number; s: number; nv: number; req: number }

export interface ButinBoss { i: number; p: number; q?: 1 }
export interface BossDonjon { id: number; n: string; en: string; nv: [number, number]; r: number; butin: ButinBoss[] }
export interface QueteDonjon { id: number; fr: string; en: string; nv: number; min: number; camp: 0 | 1 | 2 }
export interface DonneesDonjon {
  carte: number;
  niveaux: [number, number] | null;
  entrees: { zone: string; x: number; y: number }[];
  boss: BossDonjon[];
  rares: BossDonjon[];
  quetes: QueteDonjon[];
  /** Quêtes filtrées sur les fichiers de Forever. */
  qv?: boolean;
}
interface Fichier {
  version: { source: string; quetes: string };
  quetesVerifiees: boolean;
  donjons: Record<string, DonneesDonjon>;
  objets?: Record<string, ObjetOrigine>;
}

let cache: Fichier | null | undefined;
function fichier(): Fichier | null {
  if (cache !== undefined) return cache;
  try {
    cache = JSON.parse(readFileSync(path.join(process.cwd(), "content/donjons-jeu.json"), "utf8")) as Fichier;
  } catch {
    cache = null;
  }
  return cache;
}

export function donneesDonjon(slug: string): DonneesDonjon | null {
  return fichier()?.donjons[slug] ?? null;
}

/** Les quêtes d'un donjon (ou de tous, sans slug) viennent-elles d'un passage filtré sur les fichiers de Forever ? */
export function quetesDonjonsVerifiees(slug?: string): boolean {
  const f = fichier();
  if (!f) return false;
  return slug ? f.donjons[slug]?.qv ?? f.quetesVerifiees : f.quetesVerifiees;
}

/** Description d'origine d'un objet du butin (bases libres), pour ceux que la base d'objets du site ne connaît pas. */
export function objetOrigine(id: number): ObjetOrigine | null {
  return fichier()?.objets?.[String(id)] ?? null;
}

export function sourceDonjons(): string {
  return fichier()?.version.source ?? "CMaNGOS classic-db (GPL v3), AzerothCore (GPL v2)";
}

export function donjonOrigine(slug: string): DonjonReference | undefined {
  return FICHES_ORIGINE.find((d) => d.slug === slug);
}

/** Identifiants de tous les objets cités par un donjon (boss et rares), pour une seule lecture de la base. */
export function objetsDuDonjon(d: DonneesDonjon): number[] {
  return [...new Set([...d.boss, ...d.rares].flatMap((b) => b.butin.map((x) => x.i)))];
}

/** Rang d'un monstre (CMaNGOS) : 1 élite, 2 élite rare, 3 boss, 4 rare. */
export function rangMonstre(r: number, langue: "fr" | "en" = "fr"): string {
  const fr = ["Normal", "Élite", "Élite rare", "Boss", "Rare"];
  const en = ["Normal", "Elite", "Rare elite", "Boss", "Rare"];
  return (langue === "en" ? en : fr)[r] ?? "";
}

/** « 19 » ou « 18-21 ». */
export const niveaux = ([a, b]: [number, number]) => (a === b ? String(a) : `${a}-${b}`);

/** Nombre de boss d'un donjon, pour la liste ; null sans données. */
export function nombreDeBoss(slug: string): number | null {
  const d = donneesDonjon(slug);
  return d ? d.boss.length : null;
}
