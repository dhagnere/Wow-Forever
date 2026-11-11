import type { LettrePreparee } from "@/content/lettres-preparees";
import type { VideoPreparee } from "@/content/videos-preparees";

/** Contrôles des vidéos et des Lettres préparées (limites et règles de YouTube, paires de langues). */

const SECONDES = (h: string): number => h.split(":").reduce((t, n) => t * 60 + Number(n), 0);

/** Chapitres lus dans une description : lignes « 0:00 Titre », « 1:02:05 Titre ». */
export function chapitresDe(description: string): { seconde: number; titre: string }[] {
  return description.split("\n").flatMap((l) => {
    const m = /^((?:\d+:)?\d{1,2}:\d{2})\s+(.+)$/.exec(l.trim());
    return m ? [{ seconde: SECONDES(m[1]), titre: m[2] }] : [];
  });
}

/** Problèmes d'une vidéo préparée (liste vide si tout va bien). */
export function problemesVideo(v: VideoPreparee): string[] {
  const p: string[] = [];
  if (!v.titre.trim() || v.titre.length > 100) p.push("titre vide ou de plus de 100 caractères");
  if (v.description.length > 5000) p.push("description de plus de 5 000 caractères");
  if (/[<>]/.test(v.titre + v.description)) p.push("YouTube refuse les caractères < et >");
  if (!/^\d{4}-S\d{2}$/.test(v.semaine)) p.push("semaine au format AAAA-SNN");
  if (!v.fichiers.length || v.fichiers.length !== v.liens.length) p.push("un lien par fichier");
  if (!/^\/images\/videos\/[a-z0-9-]+\.(jpg|png)$/.test(v.miniature)) p.push("miniature manquante ou hors de /images/videos/ (jpg ou png)");
  const c = chapitresDe(v.description);
  if (c.length) {
    if (c[0].seconde !== 0) p.push("le premier chapitre doit être à 0:00");
    if (c.length < 3) p.push("trois chapitres au moins");
    c.forEach((x, i) => { if (i > 0 && x.seconde - c[i - 1].seconde < 10) p.push(`chapitre « ${x.titre} » à moins de 10 s du précédent`); });
    if (v.duree && c[c.length - 1].seconde >= SECONDES(v.duree)) p.push("chapitre au-delà de la fin de la vidéo");
  }
  return p;
}

/** Problèmes d'une liste de Lettres : identifiants uniques, chaque semaine en français et en anglais. */
export function problemesLettres(lettres: LettrePreparee[]): string[] {
  const p: string[] = [];
  const ids = new Set<string>();
  for (const l of lettres) {
    if (ids.has(l.id)) p.push(`identifiant en double : ${l.id}`);
    ids.add(l.id);
    if (!l.sujet.trim() || l.sujet.length > 200) p.push(`${l.id} : sujet vide ou trop long`);
    if (!l.corps.trim()) p.push(`${l.id} : texte vide`);
  }
  for (const s of new Set(lettres.map((l) => l.semaine))) {
    const langues = new Set(lettres.filter((l) => l.semaine === s).map((l) => l.langue));
    if (!langues.has("fr") || !langues.has("en")) p.push(`semaine ${s} : il faut une Lettre française et une anglaise`);
  }
  return p;
}

/** Comparaison des titres sans casse, accents ni espaces superflus. */
export const titreNormalise = (t: string): string =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

/** Début d'un titre du Journal : « journal de jobwow · 11 novembre 2026 » (série et date), ou null. */
const debutTitre = (t: string): string | null => {
  const parties = titreNormalise(t).split(" · ");
  return parties.length >= 2 && /\d{4}$/.test(parties[1]) ? parties.slice(0, 2).join(" · ") : null;
};

/**
 * Vidéo publique de la chaîne correspondant à une vidéo préparée : même titre, ou, si Jobwow a retouché la fin du titre
 * dans YouTube Studio, même série et même date, quand une seule vidéo préparée porte cette date.
 */
export function publication<T extends { titre: string }>(v: VideoPreparee, chaine: T[], toutes: VideoPreparee[] = [v]): T | undefined {
  const t = titreNormalise(v.titre);
  const exacte = chaine.find((c) => titreNormalise(c.titre) === t);
  if (exacte) return exacte;
  const debut = debutTitre(v.titre);
  if (!debut || toutes.filter((x) => debutTitre(x.titre) === debut).length > 1) return undefined;
  const memeDate = chaine.filter((c) => debutTitre(c.titre) === debut);
  return memeDate.length === 1 ? memeDate[0] : undefined;
}

/** Vidéo préparée (et donc sa miniature) d'une vidéo de la chaîne, s'il y en a une. */
export function prepareeDe<T extends { titre: string }>(video: T, toutes: VideoPreparee[]): VideoPreparee | undefined {
  return toutes.find((v) => publication(v, [video], toutes) === video);
}
