import { MOTS_CLES } from "@/config/sources";
import type { Element, Sujet } from "../types";

import { normaliser } from "./texte";
import { detecterTheme } from "./themes";

export { normaliser };

function contientUn(texte: string, termes: string[]): boolean {
  const mots = ` ${normaliser(texte)} `;
  return termes.some((t) => {
    const n = normaliser(t);
    // Les écritures sans espaces entre les mots (coréen) se cherchent en sous-chaîne.
    return /[\p{Script=Hangul}]/u.test(n) ? mots.includes(n) : mots.includes(` ${n} `);
  });
}

export function parleDeForever(e: Pick<Element, "titre" | "resume">): boolean {
  const texte = `${e.titre} ${e.resume}`;
  return contientUn(texte, MOTS_CLES.forever) && contientUn(texte, MOTS_CLES.jeu);
}

export function dansLaFenetre(e: Pick<Element, "publieLe">, maintenant: Date, heures: number): boolean {
  const age = maintenant.getTime() - e.publieLe.getTime();
  return age >= -60 * 60 * 1000 && age <= heures * 60 * 60 * 1000;
}

/** URL canonique : sans paramètres de suivi, sans fragment ni barre finale. */
export function cleUrl(url: string): string {
  try {
    const u = new URL(url);
    for (const p of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref$|oc$)/i.test(p)) u.searchParams.delete(p);
    }
    u.hash = "";
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}${u.search}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

const MOTS_VIDES = new Set(
  "le la les un une des de du et en au aux a pour sur dans par avec est sont the a an of to in on for and is are with at by from der die das und ein eine ist im mit von zu el los las y del con para wow world warcraft forever".split(" "),
);

function signature(titre: string): Set<string> {
  return new Set(normaliser(titre).split(" ").filter((m) => m.length > 2 && !MOTS_VIDES.has(m)));
}

export function similarite(a: string, b: string): number {
  const sa = signature(a);
  const sb = signature(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let communs = 0;
  for (const m of sa) if (sb.has(m)) communs++;
  return communs / (sa.size + sb.size - communs);
}

/** Regroupe les éléments qui parlent du même sujet : même URL, ou titres très proches. */
export function regrouper(elements: Element[], seuil = 0.5): Element[][] {
  const groupes: Element[][] = [];
  const vus = new Set<string>();
  const tries = [...elements].sort((a, b) => b.poids - a.poids || b.publieLe.getTime() - a.publieLe.getTime());
  for (const e of tries) {
    const cle = cleUrl(e.url);
    if (vus.has(cle)) continue;
    vus.add(cle);
    const groupe = groupes.find((g) => g.some((x) => similarite(x.titre, e.titre) >= seuil));
    if (groupe) groupe.push(e);
    else groupes.push([e]);
  }
  return groupes;
}

/**
 * Score du jour :
 *  - sources : somme des poids des sources distinctes (un sujet repris par trois sites passe devant une rumeur isolée) ;
 *  - fraîcheur : jusqu'à 3 points, décroissant sur la fenêtre de collecte ;
 *  - vidéo : 1,5 point si une vidéo est disponible ;
 *  - étranger : 1 point par source en langue étrangère (max 2), pour devancer les sites français.
 */
export function noter(groupe: Element[], maintenant: Date, fenetreHeures: number): Sujet {
  // Un site éditeur compte une fois, même s'il remonte par plusieurs flux (son flux direct et des recherches Google News).
  const parSite = new Map<string, Element>();
  for (const e of groupe) {
    const cle = normaliser(e.sourceNom);
    const deja = parSite.get(cle);
    if (!deja || e.poids > deja.poids) parSite.set(cle, e);
  }
  const distincts = [...parSite.values()];

  const sources = distincts.reduce((s, e) => s + e.poids, 0);
  const plusRecent = Math.max(...groupe.map((e) => e.publieLe.getTime()));
  const ageHeures = Math.max(0, (maintenant.getTime() - plusRecent) / 3_600_000);
  const fraicheur = Math.max(0, 3 * (1 - ageHeures / fenetreHeures));
  const video = groupe.some((e) => e.video) ? 1.5 : 0;
  const etranger = Math.min(2, distincts.filter((e) => e.langue !== "fr").length);

  const principal = [...groupe].sort((a, b) => b.poids - a.poids)[0];
  const arrondi = (n: number) => Math.round(n * 100) / 100;
  const theme = detecterTheme({
    titre: principal.titre,
    texte: groupe.map((e) => `${e.titre} ${e.resume}`).join(" "),
    themesSources: groupe.flatMap((e) => (e.theme ? [e.theme] : [])),
    video: groupe.some((e) => e.video),
  });
  return {
    cle: cleUrl(principal.url),
    titre: principal.titre,
    theme: theme.rubrique,
    pilier: theme.pilier,
    elements: groupe,
    score: arrondi(sources + fraicheur + video + etranger),
    detailScore: { sources, fraicheur: arrondi(fraicheur), video, etranger },
  };
}

export function classer(elements: Element[], maintenant: Date, fenetreHeures: number): Sujet[] {
  const retenus = elements.filter((e) => dansLaFenetre(e, maintenant, fenetreHeures) && parleDeForever(e));
  return regrouper(retenus)
    .map((g) => noter(g, maintenant, fenetreHeures))
    .sort((a, b) => b.score - a.score);
}
