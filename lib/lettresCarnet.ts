import type { LettreParue, OptionsTraductionLettre } from "@/modules/veille";
import type { LettrePreparee } from "@/content/lettres-preparees";
import { cheminAnglais } from "@/lib/anglais";
import { SITE } from "@/lib/site";

const meme = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Lettres du Carnet anglais : les Lettres anglaises enregistrées, plus, pour chaque Lettre française enregistrée qui vient
 * des brouillons préparés et dont l'édition anglaise n'est pas encore en base, l'édition anglaise préparée de la même
 * semaine (datée comme la française). Ainsi le Carnet anglais suit le français sans attendre l'import de l'anglaise.
 */
export function lettresCarnetEn(en: LettreParue[], fr: LettreParue[], preparees: LettrePreparee[], limite = 12): LettreParue[] {
  const ajouts: LettreParue[] = [];
  for (const l of fr) {
    const source = preparees.find((p) => p.langue === "fr" && meme(p.sujet, l.sujet));
    const anglaise = source && preparees.find((p) => p.langue === "en" && p.semaine === source.semaine);
    if (!anglaise || en.some((e) => e.traductionDe === l.id || meme(e.sujet, anglaise.sujet)) || ajouts.some((e) => meme(e.sujet, anglaise.sujet))) continue;
    ajouts.push({ id: -l.id, sujet: anglaise.sujet, corps: anglaise.corps, parueLe: l.parueLe });
  }
  return [...en, ...ajouts]
    .sort((a, b) => new Date(b.parueLe).getTime() - new Date(a.parueLe).getTime())
    .slice(0, limite);
}

/** Édition préparée de l'autre langue, même semaine, à importer avec celle qu'on importe. */
export function pairePreparee(l: LettrePreparee, preparees: LettrePreparee[]): LettrePreparee | undefined {
  return preparees.find((p) => p.semaine === l.semaine && p.langue !== l.langue);
}

/**
 * Liens d'une Lettre traduite : une page française du site qui a son équivalent anglais (cheminAnglais) est remplacée
 * par celui-ci, en lien relatif ou absolu ; les autres liens ne changent pas.
 */
export function liensVersAnglais(markdown: string, versAnglais: (chemin: string) => string | null, sites: string[]): string {
  const bases = sites.map((x) => x.replace(/\/+$/, ""));
  return markdown.replace(/\]\(([^)\s]+)\)/g, (tout, cible: string) => {
    const base = bases.find((b) => cible.startsWith(b + "/")) ?? "";
    if (!base && !cible.startsWith("/")) return tout;
    const m = /^([^?#]*)(.*)$/.exec(cible.slice(base.length))!;
    if (m[1].startsWith("/en/")) return tout;
    const en = versAnglais(m[1]);
    return en ? `](${base}${en}${m[2]})` : tout;
  });
}

/** Sujets des Lettres françaises préparées qui ont leur édition anglaise préparée : pas de traduction automatique. */
export function sujetsAvecAnglaisPrepare(preparees: LettrePreparee[]): Set<string> {
  return new Set(preparees.filter((p) => p.langue === "fr" && pairePreparee(p, preparees)).map((p) => p.sujet.trim().toLowerCase()));
}

/** Réglages de la traduction automatique des Lettres : Lettres préparées écartées, liens vers les pages anglaises. */
export function optionsTraductionLettre(preparees: LettrePreparee[]): OptionsTraductionLettre {
  const ecartees = sujetsAvecAnglaisPrepare(preparees);
  return {
    ignorer: (sujet) => ecartees.has(sujet.trim().toLowerCase()),
    adapterLiens: (markdown) => liensVersAnglais(markdown, cheminAnglais, [SITE.url, "https://www.taverne-eternelle.fr", "https://taverne-eternelle.fr"]),
  };
}
