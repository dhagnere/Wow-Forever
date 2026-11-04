import { readFileSync } from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";

/**
 * « Où le trouver » : sources de chaque objet (npm run base:butin) — monstres et taux de butin, coffres et gisements,
 * marchands, quêtes, butin aléatoire —, avec la position sur les cartes des zones (en % de la carte).
 * Données de l'Azeroth d'origine (CMaNGOS classic-db, GPL v3 ; noms français AzerothCore, GPL v2) : à confirmer dans Forever.
 */

type Points = [number, number][];
interface Lieu { z?: Record<string, Points>; d?: [string, string | null] }
interface Donnees {
  version: { jeu: string; source: string };
  creatures: Record<string, Lieu & { n: string; nv: [number, number]; r: number }>;
  decor: Record<string, Lieu & { n: string }>;
  quetes: Record<string, { n: string; nv: number; p: number[] }>;
  objets: Record<string, { m: [number, number, number][]; o: [number, number][]; v: number[]; q: number[]; a?: [number, number, number]; mt?: number }>;
}

/** Version anglaise du site : butin.en.json.gz (noms d'origine de CMaNGOS). */
type Langue = "fr" | "en";
const cache = new Map<Langue, Donnees | null>();
function donnees(langue: Langue = "fr"): Donnees | null {
  if (!cache.has(langue)) {
    try {
      const f = langue === "en" ? "butin.en.json.gz" : "butin.json.gz";
      cache.set(langue, JSON.parse(gunzipSync(readFileSync(path.join(process.cwd(), "modules/veille/objets/donnees", f))).toString("utf8")) as Donnees);
    } catch {
      cache.set(langue, null);
    }
  }
  return cache.get(langue)!;
}

export interface Emplacement {
  /** Zones et points (en % de la carte de la zone). */
  zones: { lieu: string; points: Points }[];
  /** Donjon ou raid : nom, et écran de chargement s'il est connu. */
  donjon?: { nom: string; ecran: string | null };
}

export interface SourceMonstre extends Emplacement { id: number; nom: string; niveaux: [number, number]; rang: number; chance: number; quete: boolean }
export interface SourceDecor extends Emplacement { id: number; nom: string; chance: number }
export interface SourceMarchand extends Emplacement { id: number; nom: string }
export interface SourceQuete { id: number; titre: string; niveau: number; donneurs: SourceMarchand[] }

export interface OuTrouver {
  monstres: SourceMonstre[];
  /** Nombre total de monstres qui le portent (10 affichés au plus). */
  monstresTotal: number;
  decor: SourceDecor[];
  marchands: SourceMarchand[];
  quetes: SourceQuete[];
  /** Butin aléatoire « mondial » : fourchette de niveaux et nombre de monstres concernés. */
  aleatoire?: { min: number; max: number; monstres: number };
}

function emplacement(l: Lieu | undefined): Emplacement {
  return {
    zones: Object.entries(l?.z ?? {}).map(([lieu, points]) => ({ lieu, points })).sort((a, b) => b.points.length - a.points.length),
    ...(l?.d ? { donjon: { nom: l.d[0], ecran: l.d[1] } } : {}),
  };
}

export const RANGS: Record<number, string> = { 1: "Élite", 2: "Rare élite", 3: "Boss", 4: "Rare" };
export const RANGS_EN: Record<number, string> = { 1: "Elite", 2: "Rare Elite", 3: "Boss", 4: "Rare" };

export function ouTrouver(idObjet: number, langue: Langue = "fr"): OuTrouver | null {
  const d = donnees(langue);
  const o = d?.objets[String(idObjet)];
  if (!d || !o) return null;
  const marchand = (id: number): SourceMarchand | null => {
    const c = d.creatures[String(id)];
    return c ? { id, nom: c.n, ...emplacement(c) } : null;
  };
  return {
    monstres: o.m.flatMap(([id, chance, quete]) => {
      const c = d.creatures[String(id)];
      return c ? [{ id, nom: c.n, niveaux: c.nv, rang: c.r, chance, quete: quete === 1, ...emplacement(c) }] : [];
    }),
    monstresTotal: o.mt ?? o.m.length,
    decor: o.o.flatMap(([id, chance]) => {
      const g = d.decor[String(id)];
      return g?.n ? [{ id, nom: g.n, chance, ...emplacement(g) }] : [];
    }),
    marchands: o.v.map(marchand).filter((x): x is SourceMarchand => !!x),
    quetes: o.q.flatMap((id) => {
      const q = d.quetes[String(id)];
      return q ? [{ id, titre: q.n, niveau: q.nv, donneurs: q.p.map(marchand).filter((x): x is SourceMarchand => !!x) }] : [];
    }),
    ...(o.a ? { aleatoire: { min: o.a[0], max: o.a[1], monstres: o.a[2] } } : {}),
  };
}

export function sourceDesDonnees(): string | null {
  return donnees()?.version.source ?? null;
}
