import { readFileSync } from "node:fs";
import path from "node:path";
import type { Specialisation } from "@/modules/veille";

/**
 * Sorts et talents des classes, par spécialisation : content/sorts-jeu.json, produit par npm run sorts:jeu
 * à partir des fichiers du jeu (wago.tools). Lu une fois par processus.
 */

interface DonneesSorts {
  version: string;
  genere: string;
  classes: Record<string, Specialisation[]>;
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

export const iconeSort = (fichier: number) => `/images/jeu/sorts/${fichier}.png`;
