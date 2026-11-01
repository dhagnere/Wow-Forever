import { SLUGS_RUBRIQUES } from "@/config/taxonomie";
import type { Article } from "../types";

/** Longueur minimale de l'avis de Silfax pour autoriser la publication. */
export const AVIS_MINIMUM = 80;

/** Texte à remplacer, du type « [Votre ressenti de joueur…] » (un lien Markdown « [texte](url) » n'est pas concerné). */
const TEXTE_A_REMPLACER = /\[[^\]]{12,}\](?!\()/;

/**
 * Règles de publication. Garde-fou à ne jamais affaiblir (voir CLAUDE.md) :
 * sans avis de Silfax, pas de publication. La base de données applique la même règle.
 */
/** Sources affichées sur le site. */
export function sourcesPubliees<T extends { publiee?: boolean }>(sources: T[]): T[] {
  return sources.filter((s) => s.publiee !== false);
}

export function verifierPublication(
  a: Pick<Article, "titre" | "corps" | "avisSilfax" | "rubrique" | "description"> & {
    image?: Article["image"];
    sources?: Article["sources"];
    origine?: Article["origine"];
  },
): string[] {
  const erreurs: string[] = [];
  if (a.titre.trim().length < 10) erreurs.push("Le titre est trop court.");
  if (a.corps.trim().length < 300) erreurs.push("Le corps de l'article est trop court (300 caractères minimum).");
  if (a.avisSilfax.trim().length < AVIS_MINIMUM)
    erreurs.push(`« L'avis de Silfax » est vide ou trop court (${AVIS_MINIMUM} caractères minimum) : la publication est refusée.`);
  if (TEXTE_A_REMPLACER.test(a.avisSilfax)) erreurs.push("« L'avis de Silfax » contient encore un texte à remplacer entre crochets.");
  if (TEXTE_A_REMPLACER.test(a.corps)) erreurs.push("Le corps contient encore un texte à remplacer entre crochets.");
  if (!(SLUGS_RUBRIQUES as string[]).includes(a.rubrique)) erreurs.push("Rubrique inconnue.");
  if (a.description.trim().length < 50) erreurs.push("La description pour Google est trop courte (50 caractères minimum).");
  // Droit d'auteur : un article tiré de la veille crédite au moins une des sources dont il reprend l'information.
  if (a.origine === "veille" && a.sources?.length && !sourcesPubliees(a.sources).length)
    erreurs.push("Affichez au moins une source : l'article reprend des informations d'autres sites, il doit les créditer.");
  if (a.image && a.image.alt.trim().length < 5)
    erreurs.push("Décrivez l'image d'en-tête en quelques mots (texte alternatif), pour les lecteurs malvoyants et pour Google.");
  return erreurs;
}
