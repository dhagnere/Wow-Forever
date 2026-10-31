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
 */

export interface Source {
  id: string;
  nom: string;
  url: string;
  langue: "fr" | "en" | "de" | "es" | "ko" | "ru";
  poids: number;
  filtrer: boolean;
  video?: boolean;
}

function googleNews(requete: string, hl: string, gl: string, ceid: string): string {
  const q = encodeURIComponent(requete);
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

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
