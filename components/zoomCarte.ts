/**
 * Zoom des cartes du guide : la vue est un carré de côté 100 / s (en % de la carte), dont le coin haut-gauche est (x, y).
 * Positions des pastilles, tracé des flèches et image suivent la même vue ; les pastilles et l'épaisseur des flèches
 * gardent leur taille à l'écran quel que soit le zoom.
 */

export interface Vue { s: number; x: number; y: number }

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 6;
export const VUE_ENTIERE: Vue = { s: 1, x: 0, y: 0 };

const borne = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Garde la vue dans la carte (pas de bord vide autour). */
export function contenir(v: Vue): Vue {
  const s = borne(v.s, ZOOM_MIN, ZOOM_MAX);
  const cote = 100 / s;
  return { s, x: borne(v.x, 0, 100 - cote), y: borne(v.y, 0, 100 - cote) };
}

/** Position d'un point de la carte (en %) dans le cadre affiché (en %). */
export function versEcran(v: Vue, px: number, py: number): { gauche: number; haut: number; visible: boolean } {
  const gauche = (px - v.x) * v.s;
  const haut = (py - v.y) * v.s;
  return { gauche, haut, visible: gauche > -3 && gauche < 103 && haut > -3 && haut < 103 };
}

/** Zoom de facteur f en gardant fixe le point du cadre situé en (fx, fy), fractions de 0 à 1 (sous le curseur). */
export function zoomerAutour(v: Vue, f: number, fx: number, fy: number): Vue {
  const s = borne(v.s * f, ZOOM_MIN, ZOOM_MAX);
  // Point de la carte sous le curseur, avant et après : il ne bouge pas.
  const px = v.x + (fx * 100) / v.s;
  const py = v.y + (fy * 100) / v.s;
  return contenir({ s, x: px - (fx * 100) / s, y: py - (fy * 100) / s });
}

/** Déplacement de la vue quand on fait glisser la carte de (dx, dy), fractions de la taille du cadre. */
export function glisser(v: Vue, dx: number, dy: number): Vue {
  return contenir({ s: v.s, x: v.x - (dx * 100) / v.s, y: v.y - (dy * 100) / v.s });
}

/** Vue qui montre tous ces points avec une marge, sans dépasser un zoom de 4 (on garde un peu de contexte). */
export function cadrer(points: [number, number][], marge = 8): Vue {
  if (!points.length) return VUE_ENTIERE;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const largeur = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) + marge * 2;
  const s = borne(100 / largeur, ZOOM_MIN, 4);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return contenir({ s, x: cx - 50 / s, y: cy - 50 / s });
}
