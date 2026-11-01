/**
 * Sources surveillées chaque matin par la veille.
 *
 * Adresses de flux À CONFIRMER avant la mise en service :
 *   npm run veille:sources
 * Retirer ou corriger toute source signalée en échec.
 *
 * - poids : importance de la source dans le classement du jour (1 = faible, 3 = forte).
 * - langue : code ISO. Les sources en langue étrangère reçoivent un bonus (elles publient souvent avant les sites français).
 * - filtrer : true si la source parle d'autre chose que de Forever ; seuls les sujets contenant les mots-clés sont gardés.
 * - video : true pour les chaînes vidéo (bonus au classement).
 * - theme : recherche ciblée sur une rubrique ; les sujets trouvés penchent vers ce thème.
 */

import type { SlugRubrique } from "./taxonomie";

export interface Source {
  id: string;
  nom: string;
  url: string;
  langue: "fr" | "en" | "de" | "es" | "ko" | "ru";
  poids: number;
  filtrer: boolean;
  video?: boolean;
  /** Recherche ciblée sur un thème : oriente le classement des sujets trouvés. */
  theme?: SlugRubrique;
}

function googleNews(requete: string, hl: string, gl: string, ceid: string): string {
  const q = encodeURIComponent(requete);
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

/** Recherches ciblées : un thème, des mots anglais. Les noms anglais non officiels des nouvelles zones sont évités. */
const THEMES_RECHERCHES: [SlugRubrique, string][] = [
  ["donjons-raids", 'dungeon OR raid OR boss OR "Hall of Thanes" OR loot'],
  ["classes", "class OR talents OR druid OR paladin OR warrior OR hunter OR rogue OR priest OR shaman OR mage OR warlock"],
  ["races", 'race OR racial OR Skyborne OR "night elf" OR tauren'],
  ["zones", "zone OR map OR Hyjal OR \"Shen'dralar\" OR Kalimdor"],
  ["quetes", "quest OR questline OR leveling"],
  ["metiers", 'profession OR crafting OR "auction house" OR economy'],
  ["jcj", 'PvP OR battleground OR "world PvP" OR Hillsbrad'],
  ["lore", "lore OR story OR cinematic"],
  ["patchs", '"patch notes" OR hotfix OR maintenance OR bug'],
];

export const SOURCES: Source[] = [
  { id: "wowhead", nom: "Wowhead", url: "https://www.wowhead.com/news/rss/classic", langue: "en", poids: 3, filtrer: true },
  { id: "youtube-wow", nom: "World of Warcraft (YouTube officiel)", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbLj9QP9FAaHs_647QckGtg", langue: "en", poids: 3, filtrer: true, video: true },
  { id: "blizzard-watch", nom: "Blizzard Watch", url: "https://blizzardwatch.com/feed/", langue: "en", poids: 2, filtrer: true },
  // Le flux direct de Warcraft Tavern ne livrait aucun élément exploitable (31/10/2026) : passage par Google News, limité au site.
  { id: "warcraft-tavern", nom: "Warcraft Tavern", url: googleNews("site:warcrafttavern.com Forever", "en-US", "US", "US:en"), langue: "en", poids: 2, filtrer: true },
  { id: "reddit-classicwow", nom: "Reddit r/classicwow", url: "https://www.reddit.com/r/classicwow/.rss", langue: "en", poids: 1, filtrer: true },
  // L'adresse https://www.judgehype.com/rss/news/ renvoie une page web, pas un flux (31/10/2026) : passage par Google News, limité au site.
  { id: "judgehype", nom: "JudgeHype", url: googleNews("site:judgehype.com Forever", "fr", "FR", "FR:fr"), langue: "fr", poids: 2, filtrer: true },
  { id: "gamewave", nom: "Gamewave", url: "https://www.gamewave.fr/rss/", langue: "fr", poids: 2, filtrer: true },
  { id: "mein-mmo", nom: "Mein-MMO", url: "https://mein-mmo.de/feed/", langue: "de", poids: 2, filtrer: true },
  { id: "gnews-fr", nom: "Google News (français)", url: googleNews('"WoW Forever" OR "Warcraft: Forever"', "fr", "FR", "FR:fr"), langue: "fr", poids: 1, filtrer: true },
  { id: "gnews-en", nom: "Google News (anglais)", url: googleNews('"WoW Forever" OR "Warcraft: Forever"', "en-US", "US", "US:en"), langue: "en", poids: 1, filtrer: true },
  { id: "gnews-de", nom: "Google News (allemand)", url: googleNews('"WoW Forever" OR "Warcraft: Forever"', "de", "DE", "DE:de"), langue: "de", poids: 1, filtrer: true },
  { id: "gnews-es", nom: "Google News (espagnol)", url: googleNews('"WoW Forever" OR "Warcraft: Forever"', "es", "ES", "ES:es"), langue: "es", poids: 1, filtrer: true },
  { id: "gnews-ko", nom: "Google News (coréen)", url: googleNews('"WoW Forever" OR "와우 포에버"', "ko", "KR", "KR:ko"), langue: "ko", poids: 1, filtrer: true },
  { id: "gnews-ru", nom: "Google News (russe)", url: googleNews('"WoW Forever" OR "WoW: Forever"', "ru", "RU", "RU:ru"), langue: "ru", poids: 1, filtrer: true },

  // --- Sites américains et britanniques (ajoutés le 01/11/2026, adresses à confirmer avec npm run veille:sources) ---
  { id: "wowhead-all", nom: "Wowhead", url: "https://www.wowhead.com/news/rss/all", langue: "en", poids: 3, filtrer: true },
  { id: "reddit-wow", nom: "Reddit r/wow", url: "https://www.reddit.com/r/wow/.rss", langue: "en", poids: 1, filtrer: true },
  { id: "massively-op", nom: "Massively Overpowered", url: "https://massivelyop.com/feed/", langue: "en", poids: 2, filtrer: true },
  { id: "pc-gamer", nom: "PC Gamer", url: "https://www.pcgamer.com/rss/", langue: "en", poids: 2, filtrer: true },
  { id: "eurogamer", nom: "Eurogamer", url: "https://www.eurogamer.net/feed", langue: "en", poids: 2, filtrer: true },
  { id: "rock-paper-shotgun", nom: "Rock Paper Shotgun", url: "https://www.rockpapershotgun.com/feed", langue: "en", poids: 2, filtrer: true },
  { id: "game-rant", nom: "Game Rant", url: "https://gamerant.com/feed/", langue: "en", poids: 1, filtrer: true },
  { id: "dexerto", nom: "Dexerto", url: "https://www.dexerto.com/feed/", langue: "en", poids: 1, filtrer: true },
  { id: "polygon", nom: "Polygon", url: "https://www.polygon.com/rss/index.xml", langue: "en", poids: 2, filtrer: true },
  // Sites sans flux RSS connu et sûr : recherche Google News limitée au site.
  { id: "icy-veins", nom: "Icy Veins", url: googleNews("site:icy-veins.com Forever", "en-US", "US", "US:en"), langue: "en", poids: 3, filtrer: true },
  { id: "mmo-champion", nom: "MMO-Champion", url: googleNews("site:mmo-champion.com Forever", "en-US", "US", "US:en"), langue: "en", poids: 2, filtrer: true },
  { id: "ign", nom: "IGN", url: googleNews('site:ign.com "WoW Forever" OR site:ign.com "Warcraft: Forever"', "en-US", "US", "US:en"), langue: "en", poids: 2, filtrer: true },
  { id: "gamesradar", nom: "GamesRadar+", url: googleNews('site:gamesradar.com "Warcraft" Forever', "en-GB", "GB", "GB:en"), langue: "en", poids: 2, filtrer: true },
  { id: "forbes-games", nom: "Forbes", url: googleNews('site:forbes.com "World of Warcraft" Forever', "en-US", "US", "US:en"), langue: "en", poids: 1, filtrer: true },
  { id: "gnews-uk", nom: "Google News (Royaume-Uni)", url: googleNews('"WoW Forever" OR "Warcraft: Forever"', "en-GB", "GB", "GB:en"), langue: "en", poids: 1, filtrer: true },

  // --- Recherches ciblées par thème (anglais) : alimentent les pages de thème ---
  ...THEMES_RECHERCHES.map(([theme, mots]) => ({
    id: `theme-${theme}`,
    nom: `Google News (thème ${theme})`,
    url: googleNews(`("WoW Forever" OR "Warcraft: Forever") (${mots})`, "en-US", "US", "US:en"),
    langue: "en" as const,
    poids: 1,
    filtrer: true,
    theme,
  })),
];

/**
 * Un sujet est gardé s'il contient l'un des termes « Forever » ET l'un des termes « jeu ».
 * Les recherches Google News ciblent déjà Forever, mais le filtre écarte les faux positifs.
 */
export const MOTS_CLES = {
  forever: ["forever", "포에버", "форевер"],
  jeu: ["wow", "warcraft", "azeroth", "blizzard", "skyborne", "hyjal", "와우", "워크래프트", "варкрафт"],
};

/** Fenêtre de collecte : sujets publiés depuis moins de 36 heures. */
export const FENETRE_HEURES = 36;
