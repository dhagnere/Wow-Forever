/**
 * Analyse des vidéos (demandée par Jobwow le 19/11/2026) : où lire, à l'image, ce qui se passe dans la partie, quand
 * la sonde n'a rien noté. Zones relevées sur l'interface de Jobwow, enregistrée en 2560 × 1080 par Warcraft Recorder ;
 * pour une autre taille d'image, les positions sont mises à l'échelle (même disposition de l'interface).
 *
 * - lieu : le nom du lieu au-dessus de la minicarte (texte doré ; l'heure, en blanc, est écartée par la couleur) ;
 * - niveau : le chiffre du médaillon de niveau, sous le portrait du personnage ;
 * - nom : le nom du personnage, sur son cadre (« Jobwow Thesham ») ;
 * - cible : la barre de vie de la cible (verte quand une cible est prise : combat ou PNJ).
 */
export interface Zone { x: number; y: number; w: number; h: number }

export const ANALYSE_VIDEO = {
  largeur: 2560,
  hauteur: 1080,
  zones: {
    lieu: { x: 2158, y: 66, w: 182, h: 26 },
    niveau: { x: 582, y: 852, w: 36, h: 36 },
    nom: { x: 650, y: 822, w: 130, h: 20 },
    cible: { x: 1425, y: 840, w: 115, h: 14 },
  } satisfies Record<string, Zone>,
  /**
   * Centre de l'image (sans l'interface, dont les icônes restent en couleur), réduit, pour la couleur : en esprit,
   * le monde passe au gris. Mesuré le 19/11 : une scène de nuit violette reste au-dessus de 0,17, un fantôme est
   * presque à 0 (SEUIL_GRIS).
   */
  vue: { x: 640, y: 162, w: 1280, h: 594, sortieW: 128, sortieH: 54 },
  seuilGris: 0.08,
} as const;

/** Une zone à la taille réelle de la vidéo (nombres pairs, comme le veut ffmpeg). */
export function zoneALEchelle(z: Zone, largeur: number, hauteur: number): Zone {
  const sx = largeur / ANALYSE_VIDEO.largeur, sy = hauteur / ANALYSE_VIDEO.hauteur;
  const pair = (v: number) => Math.max(2, Math.round(v / 2) * 2);
  return { x: pair(z.x * sx), y: pair(z.y * sy), w: pair(z.w * sx), h: pair(z.h * sy) };
}
