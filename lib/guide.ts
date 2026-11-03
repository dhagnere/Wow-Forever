import { readFileSync } from "node:fs";
import path from "node:path";
import { CLASSES } from "@/content/classes";
import { carte } from "./cartes";

/**
 * Guide de 1 à 60 : content/guide-jeu.json (npm run base:quetes), adapté à une race et une classe.
 *  - départ dans la zone de sa race, sans passer par celles des autres races ;
 *  - jusqu'au niveau 30, zones du continent de départ seulement (on ne traverse pas l'océan au niveau 12) ;
 *  - quêtes réservées à d'autres races ou d'autres classes retirées, quêtes de classe gardées à leur place.
 */

export interface Hub { x: number; y: number; n: string[] }
export interface EtapeGuide {
  id: number; t: string; nv: number; min: number; ra: number; cl: number; grp: 0 | 1; obj: string[];
  g: number; gn: string; r: number; rn: string; rl: string | null; av: number;
}
export interface ZoneGuide { lieu: string; niveaux: [number, number]; hubs: Hub[]; etapes: EtapeGuide[] }

export interface RaceGuide { slug: string; nom: string; faction: "alliance" | "horde"; bit: number; depart: string }

export const RACES_GUIDE: RaceGuide[] = [
  { slug: "humain", nom: "Humain", faction: "alliance", bit: 1, depart: "foret-d-elwynn" },
  { slug: "nain", nom: "Nain", faction: "alliance", bit: 4, depart: "dun-morogh" },
  { slug: "elfe-de-la-nuit", nom: "Elfe de la nuit", faction: "alliance", bit: 8, depart: "teldrassil" },
  { slug: "gnome", nom: "Gnome", faction: "alliance", bit: 64, depart: "dun-morogh" },
  { slug: "orc", nom: "Orc", faction: "horde", bit: 2, depart: "durotar" },
  { slug: "mort-vivant", nom: "Mort-vivant", faction: "horde", bit: 16, depart: "clairieres-de-tirisfal" },
  { slug: "tauren", nom: "Tauren", faction: "horde", bit: 32, depart: "mulgore" },
  { slug: "troll", nom: "Troll", faction: "horde", bit: 128, depart: "durotar" },
];

export const BITS_CLASSES: Record<string, number> = {
  guerrier: 1, paladin: 2, chasseur: 4, voleur: 8, pretre: 16, chaman: 64, mage: 128, demoniste: 256, druide: 1024,
};

const DEPARTS = new Set(RACES_GUIDE.map((r) => r.depart));

let cache: { version: { jeu: string; source: string }; guide: Record<"alliance" | "horde", ZoneGuide[]> } | null | undefined;
function donnees() {
  if (cache === undefined) {
    try {
      cache = JSON.parse(readFileSync(path.join(process.cwd(), "content/guide-jeu.json"), "utf8"));
    } catch {
      cache = null;
    }
  }
  return cache;
}

export const versionGuide = () => donnees()?.version ?? null;
export const raceGuide = (slug: string) => RACES_GUIDE.find((r) => r.slug === slug);

/** Combinaisons jouables (races de chaque classe, hors Skyborne qui démarrent sur l'île de Zéphras). */
export function combinaisons(): { race: RaceGuide; classe: (typeof CLASSES)[number] }[] {
  const res: { race: RaceGuide; classe: (typeof CLASSES)[number] }[] = [];
  for (const race of RACES_GUIDE) {
    for (const c of CLASSES) if (c.races.some((r) => r.race === race.nom)) res.push({ race, classe: c });
  }
  return res;
}

export const cleGuide = (race: RaceGuide, classe: string) => `${race.faction}:${race.slug}:${classe}`;

export function libelleGuide(cle: string): { nom: string; lien: string } {
  const [, race, classe] = cle.split(":");
  const r = raceGuide(race);
  const c = CLASSES.find((x) => x.slug === classe);
  return { nom: `Guide de 1 à 60 · ${r?.nom ?? race} ${c?.nom.toLowerCase() ?? classe}`, lien: `/guides/parcours/${race}/${classe}/` };
}

export function guidePour(race: RaceGuide, classe: string): ZoneGuide[] {
  const d = donnees();
  const bitClasse = BITS_CLASSES[classe] ?? 0;
  const continent = carte(race.depart)?.continent;
  if (!d) return [];
  return d.guide[race.faction]
    .filter((z) => z.lieu === race.depart || !DEPARTS.has(z.lieu) || z.niveaux[0] >= 12)
    .filter((z) => z.lieu === race.depart || z.niveaux[1] >= 30 || carte(z.lieu)?.continent === continent)
    .map((z) => ({ ...z, etapes: z.etapes.filter((e) => (!e.ra || e.ra & race.bit) && (!e.cl || e.cl & bitClasse)) }))
    .filter((z) => z.etapes.length >= 4)
    // La zone de départ ouvre toujours la route.
    .sort((a, b) => Number(b.lieu === race.depart) - Number(a.lieu === race.depart));
}
