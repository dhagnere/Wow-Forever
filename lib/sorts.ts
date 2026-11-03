import { readFileSync } from "node:fs";
import path from "node:path";
import type { Familiers, Specialisation, TraitRacial } from "@/modules/veille";

/**
 * Sorts et talents des classes, par spécialisation : content/sorts-jeu.json, produit par npm run sorts:jeu
 * à partir des fichiers du jeu (wago.tools). Lu une fois par processus.
 */

interface DonneesSorts {
  version: string;
  genere: string;
  classes: Record<string, Specialisation[]>;
  familiers?: Record<string, Familiers>;
  races?: Record<string, TraitRacial[]>;
}

let cache: DonneesSorts | null | undefined;
function donnees(): DonneesSorts | null {
  if (cache === undefined) {
    try {
      cache = JSON.parse(readFileSync(path.join(process.cwd(), "content/sorts-jeu.json"), "utf8")) as DonneesSorts;
    } catch {
      cache = null;
    }
  }
  return cache;
}

export function sortsDeClasse(slug: string): { version: string; specialisations: Specialisation[] } | null {
  const d = donnees();
  const specialisations = d?.classes[slug];
  return d && specialisations?.length ? { version: d.version, specialisations } : null;
}

/** Traits raciaux d'une race (slug du site : humain, elfe-de-la-nuit, skyborne…). */
export function traitsDeRace(slug: string): TraitRacial[] {
  return donnees()?.races?.[slug] ?? [];
}

/** Nom de la race sur le site (« Elfe de la nuit ») → slug des traits raciaux (« elfe-de-la-nuit »). */
export const slugRace = (nom: string) => nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]+/g, "-");

export function versionSorts(): string | null {
  return donnees()?.version ?? null;
}

/** Familiers du chasseur (bêtes) et du démoniste (démons), avec leurs techniques. */
export function familiersDeClasse(slug: string): Familiers | null {
  const f = donnees()?.familiers?.[slug];
  return f?.familles.length ? f : null;
}

export const iconeSort = (fichier: number) => `/images/jeu/sorts/${fichier}.png`;
