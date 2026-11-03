/**
 * Règles du calculateur de talents, comme dans le jeu :
 *  - un point par niveau à partir du niveau 10, soit 51 points au niveau 60 ;
 *  - le palier p (0 en haut) demande 5 × p points dépensés dans les paliers au-dessus, dans le même arbre ;
 *  - un talent à prérequis demande le prérequis rempli au maximum ;
 *  - un point ne se retire que si l'arbre reste valable sans lui.
 * Un build s'écrit « 0503-…-… » : un chiffre par talent (dans l'ordre palier puis colonne), un groupe par arbre.
 */

export const NIVEAU_MAX = 60;
export const POINTS_MAX = NIVEAU_MAX - 9;

export interface TalentCalcul {
  id: number;
  palier: number;
  colonne: number;
  rangs: number;
  prerequisId: number | null;
}

export type Points = number[][];

export const somme = (l: number[]) => l.reduce((a, b) => a + b, 0);
export const total = (p: Points) => somme(p.map(somme));
export const vide = (arbres: TalentCalcul[][]): Points => arbres.map((a) => a.map(() => 0));

/** Niveau minimal du personnage pour dépenser ces points. */
export const niveauRequis = (points: number) => (points > 0 ? points + 9 : 10);

function pointsAuDessus(arbre: TalentCalcul[], pts: number[], palier: number): number {
  let s = 0;
  arbre.forEach((t, i) => {
    if (t.palier < palier) s += pts[i];
  });
  return s;
}

function prerequisRempli(arbre: TalentCalcul[], pts: number[], t: TalentCalcul): boolean {
  if (!t.prerequisId) return true;
  const j = arbre.findIndex((x) => x.id === t.prerequisId);
  return j < 0 || pts[j] >= arbre[j].rangs;
}

export function arbreValable(arbre: TalentCalcul[], pts: number[]): boolean {
  return arbre.every((t, i) =>
    pts[i] === 0 || (pts[i] <= t.rangs && pointsAuDessus(arbre, pts, t.palier) >= t.palier * 5 && prerequisRempli(arbre, pts, t)));
}

/** Pourquoi un point ne peut pas être ajouté (null : il peut l'être). */
export function blocageAjout(arbres: TalentCalcul[][], points: Points, a: number, i: number, noms?: { arbre: string; talent: (id: number) => string }): string | null {
  const arbre = arbres[a];
  const t = arbre[i];
  if (points[a][i] >= t.rangs) return "Talent au maximum.";
  if (total(points) >= POINTS_MAX) return `Les ${POINTS_MAX} points du niveau ${NIVEAU_MAX} sont dépensés.`;
  const requis = t.palier * 5;
  if (pointsAuDessus(arbre, points[a], t.palier) < requis) return `Demande ${requis} points dans ${noms?.arbre ?? "cet arbre"}.`;
  if (!prerequisRempli(arbre, points[a], t)) return `Demande d'abord ${noms?.talent(t.prerequisId!) ?? "son prérequis"} au maximum.`;
  return null;
}

export function blocageRetrait(arbres: TalentCalcul[][], points: Points, a: number, i: number): string | null {
  if (points[a][i] <= 0) return "Aucun point à retirer.";
  const essai = [...points[a]];
  essai[i]--;
  return arbreValable(arbres[a], essai) ? null : "D'autres talents de l'arbre dépendent de ce point.";
}

export function modifier(points: Points, a: number, i: number, delta: number): Points {
  return points.map((arbre, k) => (k === a ? arbre.map((v, j) => (j === i ? v + delta : v)) : arbre));
}

export function encoder(points: Points): string {
  return points.map((arbre) => arbre.join("").replace(/0+$/, "")).join("-").replace(/-+$/, "");
}

/** Lit un build ; renvoie null si le code ne correspond pas aux arbres ou viole une règle. */
export function decoder(code: string, arbres: TalentCalcul[][]): Points | null {
  if (!/^[0-9-]*$/.test(code)) return null;
  const groupes = code.split("-");
  if (groupes.length > arbres.length) return null;
  const points = arbres.map((arbre, a) => arbre.map((_, i) => Number(groupes[a]?.[i] ?? 0)));
  if (groupes.some((g, a) => g.length > arbres[a].length)) return null;
  if (total(points) > POINTS_MAX) return null;
  if (!arbres.every((arbre, a) => arbreValable(arbre, points[a]))) return null;
  return points;
}
