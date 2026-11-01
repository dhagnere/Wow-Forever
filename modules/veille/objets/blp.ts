/**
 * Décodeur BLP2 (format des textures du jeu) vers des pixels RGBA.
 * Prend en charge la palette (encodage 1), DXT1/DXT3/DXT5 (encodage 2) et le non-compressé (encodage 3).
 * Seul le premier niveau de détail est lu : c'est l'image en pleine taille.
 */

export interface ImageRgba { largeur: number; hauteur: number; pixels: Buffer }

export class ErreurBlp extends Error {}

function couleur565(c: number): [number, number, number] {
  return [((c >> 11) & 0x1f) * 255 / 31, ((c >> 5) & 0x3f) * 255 / 63, (c & 0x1f) * 255 / 31].map(Math.round) as [number, number, number];
}

/** Décode un bloc de couleurs DXT (4 × 4 pixels). */
function blocCouleurs(src: Buffer, o: number, dxt1: boolean): number[][] {
  const c0 = src.readUInt16LE(o);
  const c1 = src.readUInt16LE(o + 2);
  const a = couleur565(c0);
  const b = couleur565(c1);
  const p: number[][] = [[...a, 255], [...b, 255]];
  if (c0 > c1 || !dxt1) {
    p.push([0, 1, 2].map((i) => Math.round((2 * a[i] + b[i]) / 3)).concat(255));
    p.push([0, 1, 2].map((i) => Math.round((a[i] + 2 * b[i]) / 3)).concat(255));
  } else {
    p.push([0, 1, 2].map((i) => Math.round((a[i] + b[i]) / 2)).concat(255));
    p.push([0, 0, 0, 0]);
  }
  const indices = src.readUInt32LE(o + 4);
  return Array.from({ length: 16 }, (_, i) => p[(indices >> (2 * i)) & 3]);
}

function alphaDxt3(src: Buffer, o: number): number[] {
  return Array.from({ length: 16 }, (_, i) => ((src[o + (i >> 1)] >> ((i & 1) * 4)) & 0xf) * 17);
}

function alphaDxt5(src: Buffer, o: number): number[] {
  const a0 = src[o];
  const a1 = src[o + 1];
  const t: number[] = [a0, a1];
  if (a0 > a1) for (let i = 1; i <= 6; i++) t.push(Math.round(((7 - i) * a0 + i * a1) / 7));
  else {
    for (let i = 1; i <= 4; i++) t.push(Math.round(((5 - i) * a0 + i * a1) / 5));
    t.push(0, 255);
  }
  let bits = 0n;
  for (let i = 0; i < 6; i++) bits |= BigInt(src[o + 2 + i]) << BigInt(8 * i);
  return Array.from({ length: 16 }, (_, i) => t[Number((bits >> BigInt(3 * i)) & 7n)]);
}

export function decoderBlp(src: Buffer): ImageRgba {
  if (src.length < 148 || src.toString("ascii", 0, 4) !== "BLP2") throw new ErreurBlp("Fichier BLP2 attendu.");
  const encodage = src[8];
  const profondeurAlpha = src[9];
  const encodageAlpha = src[10];
  const largeur = src.readUInt32LE(12);
  const hauteur = src.readUInt32LE(16);
  const debut = src.readUInt32LE(20);
  const taille = src.readUInt32LE(84);
  if (!largeur || !hauteur || largeur > 1024 || hauteur > 1024) throw new ErreurBlp("Dimensions inattendues.");
  if (debut + taille > src.length) throw new ErreurBlp("Fichier tronqué.");
  const pixels = Buffer.alloc(largeur * hauteur * 4);
  const ecrire = (x: number, y: number, rgba: number[]) => {
    if (x >= largeur || y >= hauteur) return;
    pixels.set(rgba, (y * largeur + x) * 4);
  };

  if (encodage === 2) {
    const dxt = encodageAlpha === 7 ? 5 : encodageAlpha === 1 ? 3 : 1;
    const tailleBloc = dxt === 1 ? 8 : 16;
    let o = debut;
    for (let by = 0; by < Math.ceil(hauteur / 4); by++) {
      for (let bx = 0; bx < Math.ceil(largeur / 4); bx++) {
        const alpha = dxt === 3 ? alphaDxt3(src, o) : dxt === 5 ? alphaDxt5(src, o) : null;
        const couleurs = blocCouleurs(src, dxt === 1 ? o : o + 8, dxt === 1);
        for (let i = 0; i < 16; i++) {
          const c = couleurs[i];
          ecrire(bx * 4 + (i & 3), by * 4 + (i >> 2), [c[0], c[1], c[2], alpha ? alpha[i] : c[3]]);
        }
        o += tailleBloc;
      }
    }
  } else if (encodage === 1) {
    const n = largeur * hauteur;
    for (let i = 0; i < n; i++) {
      const p = 148 + src[debut + i] * 4; // palette BGRA
      let a = 255;
      if (profondeurAlpha === 8) a = src[debut + n + i];
      else if (profondeurAlpha === 1) a = (src[debut + n + (i >> 3)] >> (i & 7)) & 1 ? 255 : 0;
      else if (profondeurAlpha === 4) a = ((src[debut + n + (i >> 1)] >> ((i & 1) * 4)) & 0xf) * 17;
      ecrire(i % largeur, Math.floor(i / largeur), [src[p + 2], src[p + 1], src[p], a]);
    }
  } else if (encodage === 3) {
    for (let i = 0; i < largeur * hauteur; i++) {
      const o = debut + i * 4; // BGRA
      ecrire(i % largeur, Math.floor(i / largeur), [src[o + 2], src[o + 1], src[o], src[o + 3]]);
    }
  } else {
    throw new ErreurBlp(`Encodage BLP non pris en charge (${encodage}).`);
  }
  return { largeur, hauteur, pixels };
}
