import Parser from "rss-parser";
import type { Source } from "@/config/sources";
import type { Element } from "../types";
import { texteBrut } from "../rendu/html";

// Le téléchargement passe par fetch (délai maximal, erreurs réseau interceptées) ;
// rss-parser ne sert qu'à analyser le XML.
// « source » : éditeur réel d'un lien Google News (<source url="…">Nom</source>).
const parser = new Parser<Record<string, unknown>, { source?: string | { _?: string } }>({ customFields: { item: ["source"] } });

/** Nom de l'éditeur d'un lien Google News, et titre débarrassé du suffixe « - Éditeur ». */
export function editeurGoogleNews(titre: string, source: unknown): { editeur?: string; titre: string } {
  const editeur = (typeof source === "string" ? source : (source as { _?: string } | undefined)?._)?.trim();
  if (!editeur) return { titre };
  const suffixe = ` - ${editeur}`;
  return { editeur, titre: titre.endsWith(suffixe) ? titre.slice(0, -suffixe.length) : titre };
}

async function telecharger(url: string): Promise<string> {
  const r = await fetch(url, {
    headers: { "User-Agent": "AzerothForeverVeille/1.0 (+site de fans non officiel)", Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(15_000),
    redirect: "follow",
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const texte = await r.text();
  if (/^\s*(<!doctype html|<html)/i.test(texte)) {
    throw new Error("L'adresse renvoie une page web, pas un flux RSS : chercher la bonne adresse du flux sur le site.");
  }
  return texte;
}

export interface ResultatFlux {
  source: Source;
  elements: Element[];
  /** Nombre d'entrées présentes dans le flux, avant tri (sans titre, lien ou date, une entrée est écartée). */
  entrees: number;
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
      if (!item.title || !item.link || !publieLe || !/^https?:\/\//i.test(item.link)) continue;
      const { editeur, titre } = editeurGoogleNews(texteBrut(item.title), item.source);
      elements.push({
        sourceId: source.id,
        // Lien Google News : on crédite le site qui a publié l'article, pas l'agrégateur.
        sourceNom: editeur ?? source.nom,
        langue: source.langue,
        poids: source.poids,
        video: !!source.video,
        titre: titre.slice(0, 300),
        url: item.link,
        resume: texteBrut(item.content ?? item.summary ?? item.contentSnippet ?? "").slice(0, 1500),
        publieLe,
      });
    }
    return { source, elements, entrees: flux.items?.length ?? 0 };
  } catch (e) {
    const cause = e instanceof Error && e.cause instanceof Error ? ` (${e.cause.message})` : "";
    return { source, elements: [], entrees: 0, erreur: `${e instanceof Error ? e.message : String(e)}${cause}` };
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
