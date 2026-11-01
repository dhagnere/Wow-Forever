import type { Pilier, SlugRubrique } from "@/config/taxonomie";
import { normaliser } from "./texte";

/**
 * Classement d'un sujet par thème (rubrique) et page pilier, par mots-clés français et anglais.
 * Aucun appel d'API : le résultat sert à filtrer la revue et oriente la rédaction.
 */

/** Mots-clés par rubrique, déjà sous forme normalisée (minuscules, sans accents). Les expressions de plusieurs mots sont permises. */
const MOTS_THEMES: Partial<Record<SlugRubrique, string[]>> = {
  "donjons-raids": [
    "donjon", "donjons", "dungeon", "dungeons", "raid", "raids", "boss", "instance", "instances", "loot", "butin",
    "salle des thanes", "hall of thanes", "attunement", "wipe",
  ],
  classes: [
    "classe", "classes", "class", "talent", "talents", "spec", "specialisation", "specialization", "build", "rotation",
    "guerrier", "warrior", "paladin", "chasseur", "hunter", "voleur", "rogue", "pretre", "priest", "chaman", "shaman",
    "mage", "demoniste", "warlock", "druide", "druid", "tank", "healer", "soigneur",
  ],
  races: [
    "race", "races", "racial", "raciale", "raciaux", "skyborne", "eolide", "eolides", "elfe de la nuit", "night elf",
    "tauren", "troll", "gnome", "nain", "dwarf", "orc", "undead", "mort vivant", "humain", "human",
  ],
  zones: [
    "zone", "zones", "map", "carte", "region", "hyjal", "mont hyjal", "mount hyjal", "zephras", "ile de zephras",
    "shen dralar", "rives claires", "kalimdor", "royaumes de l est", "eastern kingdoms", "exploration",
  ],
  quetes: ["quete", "quetes", "quest", "quests", "questline", "leveling", "levelling", "level up", "1 60", "xp", "experience"],
  metiers: [
    "metier", "metiers", "profession", "professions", "crafting", "artisanat", "auction house", "hotel des ventes",
    "economy", "economie", "gold", "recette", "recipe", "herboristerie", "herbalism", "mining", "minage", "forge", "blacksmithing",
  ],
  jcj: [
    "jcj", "pvp", "battleground", "battlegrounds", "champ de bataille", "champs de bataille", "world pvp", "duel", "duels",
    "honor", "honneur", "hillsbrad", "arena", "arene", "ganking", "gank",
  ],
  lore: ["lore", "histoire", "story", "storyline", "cinematique", "cinematic", "legende", "legend"],
  patchs: [
    "patch", "patchs", "hotfix", "hotfixes", "correctif", "correctifs", "notes de mise a jour", "patch notes", "update",
    "maintenance", "bug", "bugs", "nerf", "buff", "build",
  ],
  videos: ["trailer", "bande annonce", "video", "videos", "teaser"],
  communaute: ["communaute", "community", "streamer", "streamers", "twitch", "guilde", "guild", "reddit", "sondage", "poll"],
  actualites: [
    "sortie", "release", "launch", "lancement", "date", "edition", "editions", "precommande", "pre order", "preorder",
    "prix", "price", "beta", "abonnement", "subscription", "serveurs", "servers", "royaume", "realm", "file d attente", "queue",
  ],
};

/** Mots-clés désignant une page pilier précise. */
const MOTS_PILIERS: [Pilier, string[]][] = [
  ["classes/guerrier", ["guerrier", "guerriers", "warrior", "warriors"]],
  ["classes/paladin", ["paladin", "paladins"]],
  ["classes/chasseur", ["chasseur", "chasseurs", "hunter", "hunters"]],
  ["classes/voleur", ["voleur", "voleurs", "rogue", "rogues"]],
  ["classes/pretre", ["pretre", "pretres", "priest", "priests"]],
  ["classes/chaman", ["chaman", "chamans", "shaman", "shamans"]],
  ["classes/mage", ["mage", "mages"]],
  ["classes/demoniste", ["demoniste", "demonistes", "warlock", "warlocks"]],
  ["classes/druide", ["druide", "druides", "druid", "druids"]],
  ["races/skyborne", ["skyborne", "eolide", "eolides"]],
  ["zones/mont-hyjal", ["hyjal"]],
  ["zones/ile-de-zephras", ["zephras"]],
  ["zones/shendralar", ["shen dralar", "shendralar"]],
  ["zones/rives-claires", ["rives claires"]],
  ["donjons/salle-des-thanes", ["salle des thanes", "hall of thanes"]],
  ["donjons/ruines-de-lordaeron", ["ruines de lordaeron", "ruins of lordaeron"]],
  ["donjons/cite-de-dalaran", ["cite de dalaran", "city of dalaran", "dalaran"]],
  ["donjons/excavations-les-paluns", ["paluns"]],
];

/** Nombre d'occurrences de chaque mot-clé dans un texte normalisé, encadré d'espaces. */
function occurrences(texte: string, mots: string[]): number {
  let n = 0;
  for (const mot of mots) {
    const motif = ` ${mot} `;
    let i = texte.indexOf(motif);
    while (i !== -1) {
      n++;
      i = texte.indexOf(motif, i + motif.length - 1);
    }
  }
  return n;
}

export interface IndicesTheme {
  titre: string;
  texte: string;
  /** Thèmes suggérés par les sources (recherche ciblée par thème). */
  themesSources?: SlugRubrique[];
  video?: boolean;
}

export interface Theme {
  rubrique: SlugRubrique;
  pilier: Pilier | null;
}

export function detecterTheme(i: IndicesTheme): Theme {
  const titre = ` ${normaliser(i.titre)} `;
  const texte = ` ${normaliser(i.texte)} `;

  const scores = new Map<SlugRubrique, number>();
  for (const [rubrique, mots] of Object.entries(MOTS_THEMES) as [SlugRubrique, string[]][]) {
    // Le titre compte triple : c'est lui qui dit de quoi parle le sujet.
    const s = 3 * occurrences(titre, mots) + occurrences(texte, mots);
    if (s) scores.set(rubrique, s);
  }
  for (const t of i.themesSources ?? []) scores.set(t, (scores.get(t) ?? 0) + 2);
  if (i.video) scores.set("videos", (scores.get("videos") ?? 0) + 2);

  // Les annonces générales (date, éditions…) ne l'emportent que faute de thème plus précis.
  const actu = scores.get("actualites") ?? 0;
  scores.set("actualites", actu * 0.5);

  let rubrique: SlugRubrique = "actualites";
  let meilleur = 0;
  for (const [r, s] of scores) {
    if (s > meilleur) {
      meilleur = s;
      rubrique = r;
    }
  }

  // Page pilier : celle qui l'emporte nettement ; à égalité (article qui compare plusieurs classes), aucune.
  const piliers = MOTS_PILIERS.map(([p, mots]) => [p, 3 * occurrences(titre, mots) + occurrences(texte, mots)] as const)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);
  const pilier = piliers.length && (piliers.length === 1 || piliers[0][1] > piliers[1][1]) ? piliers[0][0] : null;

  return { rubrique, pilier };
}

/**
 * Sélection variée pour la rédaction : les meilleurs sujets, avec un plafond par thème,
 * pour alimenter toutes les pages de thème plutôt que la seule actualité.
 * Si les thèmes ne suffisent pas à remplir la sélection, le plafond est levé.
 */
export function selectionVariee<T extends { theme: SlugRubrique }>(sujets: T[], n: number, plafond = Math.max(2, Math.ceil(n / 3))): T[] {
  const choisis: T[] = [];
  const parTheme = new Map<SlugRubrique, number>();
  for (const s of sujets) {
    if (choisis.length >= n) break;
    const k = parTheme.get(s.theme) ?? 0;
    if (k >= plafond) continue;
    choisis.push(s);
    parTheme.set(s.theme, k + 1);
  }
  for (const s of sujets) {
    if (choisis.length >= n) break;
    if (!choisis.includes(s)) choisis.push(s);
  }
  // Ordre d'origine (score décroissant).
  return sujets.filter((s) => choisis.includes(s));
}
