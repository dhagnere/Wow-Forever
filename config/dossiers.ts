/**
 * Dossiers de référence : recherches ciblées sur des sujets durables (zones de départ, donjons, zones par niveau),
 * sur une fenêtre longue. Lancement : `npm run veille:dossier` ou bouton « Rechercher les dossiers » de la revue.
 * Les résultats arrivent dans la revue du jour, pour rédiger les pages de référence.
 */

import type { Source } from "./sources";

function googleNews(requete: string, langue: "fr" | "en" | "de"): string {
  const reglages = { fr: "hl=fr&gl=FR&ceid=FR:fr", en: "hl=en-US&gl=US&ceid=US:en", de: "hl=de&gl=DE&ceid=DE:de" }[langue];
  return `https://news.google.com/rss/search?q=${encodeURIComponent(requete)}&${reglages}`;
}

const FOREVER_EN = '("WoW Forever" OR "Warcraft: Forever")';

export interface Dossier {
  id: string;
  nom: string;
  sources: Source[];
}

function recherche(dossier: string, n: number, requete: string, langue: "fr" | "en" | "de", theme: Source["theme"], poids = 1): Source {
  return { id: `dossier-${dossier}-${n}`, nom: `Google News (dossier ${dossier})`, url: googleNews(requete, langue), langue, poids, filtrer: true, theme };
}

export const DOSSIERS: Dossier[] = [
  {
    id: "zones-depart",
    nom: "Zones de départ",
    sources: [
      recherche("zones-depart", 1, `${FOREVER_EN} ("starting zone" OR "starting zones" OR "starter zone" OR "starting area")`, "en", "zones"),
      recherche("zones-depart", 2, `${FOREVER_EN} (Skyborne OR Zephras OR Thendal) start`, "en", "zones"),
      recherche("zones-depart", 3, `"WoW Forever" ("zone de départ" OR "zones de départ" OR "commencer")`, "fr", "zones"),
      recherche("zones-depart", 4, `site:wowhead.com Forever ("starting zone" OR "new players")`, "en", "zones", 2),
    ],
  },
  {
    id: "donjons",
    nom: "Donjons et raids",
    sources: [
      recherche("donjons", 1, `${FOREVER_EN} (dungeon OR dungeons OR "dungeon list" OR "new dungeons")`, "en", "donjons-raids"),
      recherche("donjons", 2, `${FOREVER_EN} (raid OR raids OR "10-player" OR "20-player")`, "en", "donjons-raids"),
      recherche("donjons", 3, `"WoW Forever" (donjon OR donjons OR raid)`, "fr", "donjons-raids"),
      recherche("donjons", 4, `"WoW Forever" (Dungeon OR Dungeons OR Raid)`, "de", "donjons-raids"),
      recherche("donjons", 5, `site:wowhead.com Forever (dungeon OR raid)`, "en", "donjons-raids", 2),
      recherche("donjons", 6, `site:icy-veins.com Forever (dungeon OR raid)`, "en", "donjons-raids", 2),
    ],
  },
  {
    id: "zones-niveaux",
    nom: "Zones par niveau",
    sources: [
      recherche("zones-niveaux", 1, `${FOREVER_EN} ("leveling guide" OR "leveling route" OR "leveling zones" OR "level range" OR "zone levels")`, "en", "zones"),
      recherche("zones-niveaux", 2, `${FOREVER_EN} (zone OR zones) (level OR levels)`, "en", "zones"),
      recherche("zones-niveaux", 3, `"WoW Forever" ("guide de leveling" OR "zones par niveau" OR "monter de niveau")`, "fr", "zones"),
      recherche("zones-niveaux", 4, `site:wowhead.com Forever (leveling OR "zone guide")`, "en", "zones", 2),
    ],
  },
];

/** Fenêtre des dossiers : 60 jours. */
export const FENETRE_DOSSIERS_HEURES = 60 * 24;
