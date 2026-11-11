import type { LettreParue } from "@/modules/veille";
import type { LettrePreparee } from "@/content/lettres-preparees";

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
    if (!anglaise || en.some((e) => meme(e.sujet, anglaise.sujet)) || ajouts.some((e) => meme(e.sujet, anglaise.sujet))) continue;
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
