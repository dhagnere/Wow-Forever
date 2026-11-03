import { readFileSync } from "node:fs";
import path from "node:path";
import { carte } from "./cartes";

/**
 * Guides de quêtes : content/quetes-jeu.json, produit par npm run base:quetes à partir des bases libres de l'Azeroth
 * d'origine (CMaNGOS, AzerothCore), limité aux quêtes encore présentes dans les fichiers de Forever.
 * Les titres viennent des bases ; les objectifs sont rédigés à partir des données, sans reprendre les textes du jeu.
 */

export interface Personne {
  t: "pnj" | "decor" | "objet";
  id: number;
  n: string;
  /** Objet sans fiche dans la base du site (objet interne) : affiché sans lien. */
  b?: boolean;
  /** Lieu et position (en % de la carte de la zone). */
  l?: { lieu: string; x: number; y: number };
  donjon?: string;
}

export interface FicheQuete {
  titre: string;
  niveau: number;
  min: number;
  races: string[] | null;
  donneurs: Personne[];
  receveurs: Personne[];
  objectifs: string[];
  objets: { id: number; n: string; q: number; choix: boolean; b?: boolean }[];
  sorts: string[];
  argent: number;
}

export interface Chaine {
  titre: string;
  niveaux: [number, number];
  races: string[] | null;
  quetes: number[];
}

export interface EtapeParcours {
  lieu: string;
  quetes: number;
  niveaux: [number, number];
  mediane: number;
  donneurs: { id: number; n: string; quetes: number; x: number; y: number }[];
}

interface DonneesQuetes {
  version: { jeu: string; source: string };
  classes: Record<string, Chaine[]>;
  quetes: Record<string, FicheQuete>;
  parcours: Record<"alliance" | "horde", EtapeParcours[]>;
}

let cache: DonneesQuetes | null | undefined;
function donnees(): DonneesQuetes | null {
  if (cache === undefined) {
    try {
      cache = JSON.parse(readFileSync(path.join(process.cwd(), "content/quetes-jeu.json"), "utf8")) as DonneesQuetes;
    } catch {
      cache = null;
    }
  }
  return cache;
}

export const versionQuetes = () => donnees()?.version ?? null;
export const chainesDeClasse = (slug: string): Chaine[] => donnees()?.classes[slug] ?? [];
export const ficheQuete = (id: number): FicheQuete | undefined => donnees()?.quetes[String(id)];
export const parcours = (camp: "alliance" | "horde"): EtapeParcours[] => donnees()?.parcours[camp] ?? [];

export const nomLieu = (slug: string) => carte(slug)?.nom ?? slug;

/** Tranches d'affichage des quêtes de classe. Le niveau 60 regroupe les quêtes d'équipement de raid. */
export const TRANCHES_QUETES: { titre: string; min: number; max: number }[] = [
  { titre: "Premiers pas (niveaux 1 à 9)", min: 1, max: 9 },
  { titre: "Niveaux 10 à 29", min: 10, max: 29 },
  { titre: "Niveaux 30 à 49", min: 30, max: 49 },
  { titre: "Niveaux 50 à 57", min: 50, max: 57 },
  { titre: "Niveaux 58 à 60 : équipement et raids", min: 58, max: 60 },
];

export function tranche(c: Chaine): number {
  const i = TRANCHES_QUETES.findIndex((t) => c.niveaux[0] >= t.min && c.niveaux[0] <= t.max);
  return i < 0 ? TRANCHES_QUETES.length - 1 : i;
}
