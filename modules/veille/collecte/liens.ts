import Parser from "rss-parser";
import { SOURCES } from "@/config/sources";
import { normaliser } from "./texte";
import type { SourceCitee } from "../types";

/**
 * Adresse directe d'un article cité par Google News.
 * Les liens de Google News (news.google.com/rss/articles/…) ne contiennent plus l'adresse de l'article :
 * on la retrouve dans le flux RSS public du site d'origine, en cherchant l'article par son titre.
 * Aucun contournement : seuls des flux publics sont lus. Introuvable : le lien Google News est gardé.
 */

const AGENT = "TaverneEternelleVeille/1.0 (+site de fans non officiel)";
const parser = new Parser();

export function estGoogleNews(url: string): boolean {
  try {
    return new URL(url).hostname === "news.google.com";
  } catch {
    return false;
  }
}

/** Ressemblance de deux titres : part des mots du plus court présents dans l'autre (mots de 3 lettres et plus). */
export function ressemblance(a: string, b: string): number {
  const mots = (t: string) => new Set(normaliser(t).split(" ").filter((m) => m.length >= 3));
  const [x, y] = [mots(a), mots(b)];
  const [petit, grand] = x.size <= y.size ? [x, y] : [y, x];
  if (!petit.size) return 0;
  let communs = 0;
  for (const m of petit) if (grand.has(m)) communs++;
  return communs / petit.size;
}

/** Ressemblance stricte : mots communs rapportés au plus long des deux textes (une adresse courte ne suffit pas). */
export function ressemblanceStricte(a: string, b: string): number {
  const mots = (t: string) => new Set(normaliser(t).split(" ").filter((m) => m.length >= 3));
  const [x, y] = [mots(a), mots(b)];
  if (!x.size || !y.size) return 0;
  let communs = 0;
  for (const m of x) if (y.has(m)) communs++;
  return communs / Math.max(x.size, y.size);
}

/** Hôte sans « www. ». */
function hote(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Site d'un éditeur connu de config/sources.ts, retrouvé par son nom (y compris les recherches « site:… »). */
export function siteParNom(nom: string): string | undefined {
  const n = normaliser(nom);
  for (const s of SOURCES) {
    if (normaliser(s.nom) !== n) continue;
    const recherche = decodeURIComponent(s.url).match(/site:([a-z0-9.-]+)/i)?.[1];
    if (recherche) return `https://${recherche}`;
    if (!estGoogleNews(s.url)) return new URL(s.url).origin;
  }
  return undefined;
}

async function lire(url: string, delai = 12_000): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": AGENT }, signal: AbortSignal.timeout(delai), redirect: "follow" });
    return r.ok ? await r.text() : null;
  } catch {
    return null;
  }
}

/** Flux candidats d'un site : ceux de config/sources.ts, celui annoncé par sa page d'accueil, puis les adresses usuelles. */
async function fluxDuSite(site: string): Promise<string[]> {
  const h = hote(site);
  const connus = SOURCES.filter((s) => !estGoogleNews(s.url) && hote(s.url) === h).map((s) => s.url);
  const accueil = await lire(`https://${h}/`, 10_000);
  const annonces = accueil
    ? [...accueil.matchAll(/<link[^>]+type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi)]
        .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1])
        .filter((x): x is string => !!x)
        .map((x) => new URL(x, `https://${h}/`).href)
    : [];
  const usuels = ["/feed/", "/rss/", "/rss.xml", "/feed.xml", "/index.xml"].map((p) => `https://${h}${p}`);
  return [...new Set([...connus, ...annonces, ...usuels])];
}

export interface Cherche {
  url: string;
  titre: string;
  /** Site de l'éditeur (attribut url de <source> dans Google News), ou à défaut son nom. */
  site?: string;
  nom?: string;
}

const cacheFlux = new Map<string, Promise<Parser.Item[]>>();

async function articlesDuSite(site: string): Promise<Parser.Item[]> {
  const h = hote(site);
  if (!cacheFlux.has(h)) {
    cacheFlux.set(h, (async () => {
      for (const f of await fluxDuSite(site)) {
        const xml = await lire(f);
        if (!xml || /^\s*(<!doctype html|<html)/i.test(xml)) continue;
        try {
          const items = (await parser.parseString(xml)).items ?? [];
          if (items.length) return items;
        } catch {
          // flux illisible : adresse suivante
        }
      }
      return [];
    })());
  }
  return cacheFlux.get(h)!;
}

const cacheSitemap = new Map<string, Promise<string[]>>();

/**
 * Adresses publiées par un site dans son plan du site (sitemap annoncé par robots.txt) : les articles plus anciens
 * que son flux RSS y figurent encore. Lecture bornée : dix fichiers au plus, les plus récents d'abord.
 */
async function adressesDuSitemap(site: string): Promise<string[]> {
  const h = hote(site);
  if (!cacheSitemap.has(h)) {
    cacheSitemap.set(h, (async () => {
      const robots = (await lire(`https://${h}/robots.txt`, 8_000)) ?? "";
      const file = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
      if (!file.length) file.push(`https://${h}/sitemap.xml`, `https://${h}/sitemap_index.xml`, `https://${h}/wp-sitemap.xml`);
      const adresses: string[] = [];
      let lus = 0;
      while (file.length && lus < 10) {
        const xml = await lire(file.shift()!, 12_000);
        lus++;
        if (!xml) continue;
        const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
        if (/<sitemapindex/i.test(xml)) {
          // Index : d'abord les fichiers d'articles, les plus récents en tête.
          const tries = locs.filter((l) => !/(image|video|tag|categor|author|auteur|page-sitemap)/i.test(l))
            .sort((a, b) => Number(/(post|news|article|actu)/i.test(b)) - Number(/(post|news|article|actu)/i.test(a)) || b.localeCompare(a));
          file.unshift(...tries.slice(0, 10));
        } else {
          adresses.push(...locs);
        }
      }
      return adresses;
    })());
  }
  return cacheSitemap.get(h)!;
}

/** Mots du chemin d'une adresse (« /wow-forever-blizzard-devoile-les-chiffres/ » → « wow forever blizzard… »). */
function motsDuChemin(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname).replace(/\.[a-z]{2,5}$/i, "").replace(/[\/_-]+/g, " ");
  } catch {
    return "";
  }
}

/** Adresse directe de l'article, ou null si elle n'a pas pu être retrouvée. */
export async function adresseDirecte(c: Cherche): Promise<string | null> {
  if (!estGoogleNews(c.url)) return c.url;
  const site = c.site || (c.nom ? siteParNom(c.nom) : undefined);
  if (!site) return null;
  const h = hote(site);
  let meilleur: { lien: string; score: number } | null = null;
  for (const item of await articlesDuSite(site)) {
    if (!item.link || !item.title || !hote(item.link).endsWith(h)) continue;
    // Les deux mesures : l'une tolère un mot changé, l'autre écarte un titre beaucoup plus court.
    const score = Math.min(ressemblance(c.titre, item.title), ressemblanceStricte(c.titre, item.title) + 0.25);
    if (!meilleur || score > meilleur.score) meilleur = { lien: item.link, score };
  }
  if (meilleur && meilleur.score >= 0.75) return meilleur.lien;
  // Plus ancien que le flux : par les mots de l'adresse, dans le plan du site.
  const motsTitre = normaliser(c.titre).split(" ").filter((m) => m.length >= 3).length;
  if (motsTitre < 4) return null;
  let parAdresse: { lien: string; score: number } | null = null;
  for (const lien of await adressesDuSitemap(site)) {
    const chemin = motsDuChemin(lien);
    if (normaliser(chemin).split(" ").filter((m) => m.length >= 3).length < 4) continue;
    const score = ressemblanceStricte(c.titre, chemin);
    if (!parAdresse || score > parAdresse.score) parAdresse = { lien, score };
  }
  return parAdresse && parAdresse.score >= 0.6 ? parAdresse.lien : null;
}

function decoderEntites(t: string): string {
  return t.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

/**
 * Entrées d'un flux Google News avec le site de leur éditeur (attribut url de <source>, que l'analyseur RSS ne garde pas).
 */
export function entreesGoogleNews(xml: string): { titre: string; lien: string; editeur: string; site: string }[] {
  const entrees: { titre: string; lien: string; editeur: string; site: string }[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const bloc = m[1];
    const titre = decoderEntites(bloc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").trim();
    const lien = decoderEntites(bloc.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "").trim();
    const source = bloc.match(/<source\s+url="([^"]+)"[^>]*>([\s\S]*?)<\/source>/);
    if (titre && lien && source) entrees.push({ titre, lien, editeur: decoderEntites(source[2]).trim(), site: decoderEntites(source[1]) });
  }
  return entrees;
}

/**
 * Site de l'éditeur d'un article ancien dont on n'a gardé que le titre et le nom : retrouvé par une recherche
 * dans le flux RSS public de Google News (celui que la veille lit déjà), qui indique l'éditeur de chaque résultat.
 */
export async function siteParRecherche(titreBrut: string): Promise<string | undefined> {
  const titre = titreBrut.replace(/\s+-\s+[^-]{2,60}$/, "");
  const q = encodeURIComponent(`"${titre.slice(0, 120)}"`);
  for (const [hl, gl, ceid] of [["fr", "FR", "FR:fr"], ["en-US", "US", "US:en"]]) {
    const xml = await lire(`https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`);
    if (!xml) continue;
    for (const e of entreesGoogleNews(xml)) {
      const sansEditeur = e.titre.endsWith(` - ${e.editeur}`) ? e.titre.slice(0, -(e.editeur.length + 3)) : e.titre;
      if (/^https?:\/\//.test(e.site) && ressemblanceStricte(titre, sansEditeur) >= 0.8) return e.site;
    }
  }
  return undefined;
}

export interface BilanLiens { articles: number; corriges: number; restants: { article: string; source: string }[] }

/**
 * Remplace, dans les articles déjà enregistrés, les liens Google News par l'adresse directe de l'article d'origine.
 * Les liens introuvables sont laissés tels quels et listés.
 */
export async function corrigerLiensArticles(): Promise<BilanLiens> {
  const { articlesAvecLiensGoogleNews, remplacerSourcesCorrigees } = await import("../articles/depot");
  const bilan: BilanLiens = { articles: 0, corriges: 0, restants: [] };
  for (const a of await articlesAvecLiensGoogleNews()) {
    bilan.articles++;
    const sources: SourceCitee[] = [];
    for (const s of a.sources) {
      if (!estGoogleNews(s.url)) {
        sources.push(s);
        continue;
      }
      const propre = crediterEditeur(s);
      const site = siteParNom(propre.nom) ?? (await siteParRecherche(s.titre));
      const directe = site ? await adresseDirecte({ url: s.url, titre: propre.titre, site }) : null;
      if (directe) bilan.corriges++;
      else bilan.restants.push({ article: a.titre, source: `${propre.nom} — ${propre.titre}` });
      sources.push({ ...propre, url: directe ?? s.url });
    }
    await remplacerSourcesCorrigees(a.id, sources);
  }
  return bilan;
}

/**
 * Articles anciens : la source s'appelle « Google News (…) » et l'éditeur réel termine le titre (« … - GeeksLands »).
 * On crédite l'éditeur et on retire le suffixe des titres.
 */
export function crediterEditeur(s: SourceCitee): SourceCitee {
  if (!/^google news/i.test(s.nom)) return s;
  const m = s.titre.match(/^(.*\S)\s+-\s+([^-]{2,60})$/);
  if (!m) return s;
  const [, titre, editeur] = m;
  const fr = s.titreFr?.replace(new RegExp(`\\s+-\\s+${editeur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "");
  return { ...s, nom: editeur.trim(), titre, ...(fr !== undefined ? { titreFr: fr } : {}) };
}
