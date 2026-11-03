import { readFileSync } from "node:fs";
import path from "node:path";
import { carte } from "./cartes";
import { suffixe, type Langue } from "./langue";
import { CARTES_EN } from "@/content/lieux-en";

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

const cache = new Map<Langue, DonneesQuetes | null>();
function donnees(langue: Langue = "fr"): DonneesQuetes | null {
  if (!cache.has(langue)) {
    try {
      cache.set(langue, JSON.parse(readFileSync(path.join(process.cwd(), `content/quetes-jeu${suffixe(langue)}.json`), "utf8")) as DonneesQuetes);
    } catch {
      cache.set(langue, null);
    }
  }
  return cache.get(langue)!;
}

export const versionQuetes = (langue: Langue = "fr") => donnees(langue)?.version ?? null;
export const chainesDeClasse = (slug: string, langue: Langue = "fr"): Chaine[] => donnees(langue)?.classes[slug] ?? [];
export const ficheQuete = (id: number, langue: Langue = "fr"): FicheQuete | undefined => donnees(langue)?.quetes[String(id)];
export const parcours = (camp: "alliance" | "horde", langue: Langue = "fr"): EtapeParcours[] => donnees(langue)?.parcours[camp] ?? [];

export const nomLieu = (slug: string, langue: Langue = "fr") => (langue === "en" ? CARTES_EN[slug] : undefined) ?? carte(slug)?.nom ?? slug;

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
