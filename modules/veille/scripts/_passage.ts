import { passage, type BilanPassage } from "../passage";
import { fermerPassage, ouvrirPassage, type ModePassage } from "../journal";

/** Exécute un passage en le consignant dans le journal (verrou : un seul passage à la fois). */
export async function passageJournalise(mode: ModePassage): Promise<BilanPassage | null> {
  const declencheur = process.env.VEILLE_DECLENCHEUR ?? "planificateur";
  const id = await ouvrirPassage(mode, declencheur);
  if (id === null) {
    console.log("Un passage est déjà en cours : celui-ci est abandonné.");
    return null;
  }
  try {
    const b = await passage(mode);
    const resume = mode === "quotidien"
      ? `${b.elementsLus} éléments lus, ${b.sujetsRetenus} sujets, ${b.brouillons.length} brouillons, ${b.echecs.length} échecs de rédaction`
      : `${b.elementsLus} éléments lus, ${b.sujetsRetenus} sujets classés (sans rédaction)`;
    const sourcesKo = b.sources.filter((s) => s.erreur).length;
    await fermerPassage(id, { resume: sourcesKo ? `${resume}, ${sourcesKo} source(s) en échec` : resume });
    return b;
  } catch (e) {
    await fermerPassage(id, { erreur: e instanceof Error ? e.message : String(e) });
    throw e;
  }
}
