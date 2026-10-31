import Parser from "rss-parser";
import type { Source } from "@/config/sources";
import type { Element } from "../types";
import { texteBrut } from "../rendu/html";

// Le téléchargement passe par fetch (délai maximal, erreurs réseau interceptées) ;
// rss-parser ne sert qu'à analyser le XML.
const parser = new Parser();

async function telecharger(url: string): Promise<string> {
  const r = await fetch(url, {
    headers: { "User-Agent": "AzerothForeverVeille/1.0 (+site de fans non officiel)", Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(15_000),
    redirect: "follow",
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export interface ResultatFlux {
  source: Source;
  elements: Element[];
  erreur?: string;
}

function dateDe(item: Parser.Item): Date | null {
  const brut = item.isoDate ?? item.pubDate;
  if (!brut) return null;
  const d = new Date(brut);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function lireFlux(source: Source): Promise<ResultatFlux> {
  try {
    const flux = await parser.parseString(await telecharger(source.url));
    const elements: Element[] = [];
    for (const item of flux.items ?? []) {
      const publieLe = dateDe(item);
      if (!item.title || !item.link || !publieLe) continue;
      elements.push({
        sourceId: source.id,
        sourceNom: source.nom,
        langue: source.langue,
        poids: source.poids,
        video: !!source.video,
        titre: texteBrut(item.title).slice(0, 300),
        url: item.link,
        resume: texteBrut(item.content ?? item.summary ?? item.contentSnippet ?? "").slice(0, 1500),
        publieLe,
      });
    }
    return { source, elements };
  } catch (e) {
    const cause = e instanceof Error && e.cause instanceof Error ? ` (${e.cause.message})` : "";
    return { source, elements: [], erreur: `${e instanceof Error ? e.message : String(e)}${cause}` };
  }
}

/** Lit toutes les sources en parallèle, par lots de 4 pour rester courtois. */
export async function lireToutes(sources: Source[]): Promise<ResultatFlux[]> {
  const resultats: ResultatFlux[] = [];
  for (let i = 0; i < sources.length; i += 4) {
    resultats.push(...(await Promise.all(sources.slice(i, i + 4).map(lireFlux))));
  }
  return resultats;
}
