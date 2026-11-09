import { CLASSES } from "@/content/classes";
import { CARTES_EN } from "@/content/lieux-en";
import { carte } from "./cartes";
import { combinaisons, guidePour, nomRace, ordreDuGuide, versionGuide, type Arret, type RaceGuide, type TypeAction, type ZoneGuide } from "./guide";
import { nomLieu } from "./quetes";

/**
 * Guides de 1 à 60 du site au format de l'addon EternalRoutes (npm run addon:guides -- <dossier de l'addon>).
 * Même ordre que les pages du guide : parcours relevés en jeu d'abord, puis l'ordre calculé par planifier.
 * Les quêtes saisies à la main (île de Zéphras, ajouts Forever) n'ont pas d'identifiant connu du jeu : l'addon les suit
 * par leur nom.
 */

/** Premier identifiant saisi à la main (Zéphras 9000001 et suivants, ajouts Forever 9100001 et suivants). */
export const PREMIER_ID_SAISI = 9_000_000;

/** Race telle que la renvoie UnitRace("player") (deuxième valeur). Skyborne : à relever en jeu, guide ouvert à la faction. */
export const RACE_JEU: Record<string, string | null> = {
  humain: "Human",
  nain: "Dwarf",
  "elfe-de-la-nuit": "NightElf",
  gnome: "Gnome",
  orc: "Orc",
  "mort-vivant": "Scourge",
  tauren: "Tauren",
  troll: "Troll",
  "skyborne-alliance": null,
  "skyborne-horde": null,
};

/** Classe telle que la renvoie UnitClass("player") (deuxième valeur). */
export const CLASSE_JEU: Record<string, string> = {
  guerrier: "WARRIOR",
  paladin: "PALADIN",
  chasseur: "HUNTER",
  voleur: "ROGUE",
  pretre: "PRIEST",
  chaman: "SHAMAN",
  mage: "MAGE",
  demoniste: "WARLOCK",
  druide: "DRUID",
};

export interface QueteAddon { kind: TypeAction; name: string; id?: number; level: number; objectives?: string[]; group?: boolean }
export interface EtapeAddon {
  zone: string;
  zoneIndex: number;
  location?: string;
  map?: number;
  x?: number;
  y?: number;
  quests: QueteAddon[];
  accepts?: string[];
  turnins?: string[];
}
export interface GuideAddon {
  id: string;
  name: string;
  faction: "Alliance" | "Horde";
  race?: string;
  class: string;
  minLevel: number;
  maxLevel: number;
  priority: number;
  zoneCount: number;
  steps: EtapeAddon[];
}

const unique = <T>(l: T[]) => [...new Set(l)];
const arrondi = (v: number) => Math.round(v * 10) / 10;

function etape(z: ZoneGuide, zoneIndex: number, ar: Arret): EtapeAddon {
  const quests: QueteAddon[] = ar.actions.map(({ a, q }) => {
    const e = z.etapes[q];
    const qa: QueteAddon = { kind: a, name: e.t, level: e.nv };
    if (e.id < PREMIER_ID_SAISI) qa.id = e.id;
    if (a !== "rendre" && e.obj.length) qa.objectives = e.obj;
    if (e.grp) qa.group = true;
    return qa;
  });
  const e0 = z.etapes[ar.actions[0].q];
  const s: EtapeAddon = { zone: nomLieu(z.lieu), zoneIndex, quests };

  if (ar.type === "ailleurs") {
    // Quête à rendre hors de la zone : PNJ et lieu connus, pas de coordonnées.
    const ailleurs = e0.rl ?? "";
    s.location = [e0.rn, ailleurs && nomLieu(ailleurs)].filter(Boolean).join(" · ");
    const id = ailleurs ? carte(ailleurs)?.id : undefined;
    if (id) s.map = id;
  } else {
    const pnj = unique(
      ar.actions.map(({ a, q }) => (a === "prendre" ? z.etapes[q].gn : a === "rendre" ? z.etapes[q].rn : "")).filter(Boolean),
    );
    if (pnj.length) s.location = pnj.slice(0, 2).join(", ") + (pnj.length > 2 ? "…" : "");
    const id = carte(z.lieu)?.id;
    if (id) s.map = id;
    if (ar.x !== null && ar.y !== null) {
      s.x = arrondi(ar.x);
      s.y = arrondi(ar.y);
    }
  }

  const prises = unique(quests.filter((q) => q.kind === "prendre").map((q) => q.name));
  const rendues = unique(quests.filter((q) => q.kind === "rendre").map((q) => q.name));
  if (prises.length) s.accepts = prises;
  if (rendues.length) s.turnins = rendues;
  return s;
}

export const idGuideAddon = (race: RaceGuide, classe: string) => `site-${race.slug}-${classe}`;

export function guideAddon(race: RaceGuide, classe: string): GuideAddon {
  const zones = guidePour(race, classe);
  const steps: EtapeAddon[] = [];
  zones.forEach((z, i) => {
    for (const ar of ordreDuGuide(z, race, classe)) steps.push(etape(z, i + 1, ar));
  });
  const nomClasse = CLASSES.find((c) => c.slug === classe)?.nom.toLowerCase() ?? classe;
  const raceJeu = RACE_JEU[race.slug] ?? undefined;
  return {
    id: idGuideAddon(race, classe),
    name: `${nomRace(race)} ${nomClasse} 1-60`,
    faction: race.faction === "alliance" ? "Alliance" : "Horde",
    ...(raceJeu ? { race: raceJeu } : {}),
    class: CLASSE_JEU[classe],
    minLevel: 1,
    maxLevel: 60,
    // Un parcours enregistré avec RouteProbe (priorité 10) passe avant ; le guide de sa race passe avant celui des Skyborne.
    priority: raceJeu ? 1 : 0,
    zoneCount: zones.length,
    steps,
  };
}

export const guidesAddon = () => combinaisons().map(({ race, classe }) => guideAddon(race, classe.slug));

// --- Écriture en Lua

const CLE_LUA = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function chaineLua(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n")}"`;
}

export function valeurLua(v: unknown): string {
  if (typeof v === "string") return chaineLua(v);
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "nil";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (v === null || v === undefined) return "nil";
  if (Array.isArray(v)) return `{ ${v.map(valeurLua).join(", ")} }`;
  const champs = Object.entries(v as Record<string, unknown>)
    .filter(([, x]) => x !== undefined)
    .map(([k, x]) => `${CLE_LUA.test(k) ? k : `[${chaineLua(k)}]`} = ${valeurLua(x)}`);
  return `{ ${champs.join(", ")} }`;
}

const ENTETE = (detail: string) =>
  [
    `-- Généré par npm run addon:guides (La Taverne Éternelle) : ne pas modifier à la main.`,
    `-- ${detail}`,
    `-- Données : content/guide-jeu.json, version du jeu ${versionGuide()?.jeu ?? "?"} ; bases libres CMaNGOS classic-db (GPL v3) et AzerothCore (GPL v2).`,
    `local ns = EternalRoutes`,
  ].join("\n");

/** Fichier Lua d'un guide. Il ne se charge que pour un personnage de sa classe et de sa faction (mémoire). */
export function fichierGuide(g: GuideAddon): string {
  const { steps, ...entete } = g;
  const lignes = [
    ENTETE(`${g.name} · ${steps.length} étapes, ${g.zoneCount} zones`),
    `ns.guides = ns.guides or {}`,
    `local _, classe = UnitClass("player")`,
    `if classe and classe ~= ${chaineLua(g.class)} then return end`,
    `local faction = UnitFactionGroup("player")`,
    `if faction and faction ~= ${chaineLua(g.faction)} then return end`,
    ``,
    `local guide = ${valeurLua(entete)}`,
    `guide.steps = {`,
    ...steps.map((s) => `  ${valeurLua(s)},`),
    `}`,
    `ns.guides[guide.id] = guide`,
    ``,
  ];
  return lignes.join("\n");
}

/** Identifiant de carte du jeu par nom de zone (français et anglais), pour les étapes enregistrées sans carte. */
export function fichierCartes(): string {
  const noms: [string, number][] = [];
  for (const slug of Object.keys(CARTES_EN)) {
    const c = carte(slug);
    if (!c || c.type !== "zone") continue;
    noms.push([c.nom, c.id], [CARTES_EN[slug], c.id]);
  }
  const vus = new Set<string>();
  const lignes = noms
    .filter(([n]) => n && !vus.has(n) && vus.add(n))
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([n, id]) => `ns.zoneMaps[${chaineLua(n)}] = ${id}`);
  return [ENTETE("Cartes du jeu (UiMap) par nom de zone"), `ns.zoneMaps = ns.zoneMaps or {}`, ...lignes, ``].join("\n");
}

export const nomFichierGuide = (g: GuideAddon) => `Guides/site/${g.id.replace(/^site-/, "")}.lua`;

const DEBUT_TOC = "# --- Guides du site (npm run addon:guides) ---";
const FIN_TOC = "# --- Fin des guides du site ---";

/** Liste des fichiers du site dans le .toc, entre deux repères, avant le moteur (GuideEngine.lua). */
export function tocAvecGuides(toc: string, fichiers: string[]): string {
  const bloc = [DEBUT_TOC, "Maps.lua", ...fichiers, FIN_TOC];
  const lignes = toc.replace(/\r\n/g, "\n").split("\n");
  const debut = lignes.indexOf(DEBUT_TOC);
  const fin = lignes.indexOf(FIN_TOC);
  if (debut >= 0 && fin > debut) {
    lignes.splice(debut, fin - debut + 1, ...bloc);
  } else {
    const moteur = lignes.findIndex((l) => l.trim() === "GuideEngine.lua");
    if (moteur < 0) throw new Error("GuideEngine.lua introuvable dans le .toc");
    lignes.splice(moteur, 0, ...bloc);
  }
  return lignes.join("\n");
}
