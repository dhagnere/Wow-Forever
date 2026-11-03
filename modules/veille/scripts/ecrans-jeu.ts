import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import sharp, { type Sharp } from "sharp";
import { ECRANS, LARGEURS_ECRANS } from "@/config/ecrans";
import { decoderBlp } from "../objets/blp";
import { derniereVersion, fichierBrut, tableCsv } from "../objets/wago";
import { lancer } from "./_lanceur";

/**
 * Écrans de chargement du jeu, recadrés et convertis en JPEG pour illustrer le site.
 *   npm run ecrans:jeu
 * Pour chaque écran de config/ecrans.ts : public/images/jeu/ecrans/<slug>-1600.jpg et <slug>-800.jpg.
 *  - écrans de Forever (grand format) : bandes noires du cadre retirées ;
 *  - écrans de l'époque (carrés étirés, logo et cadre autour) : bande centrale gardée, proportions rétablies.
 */

type Ligne = Record<string, string>;
const lire = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Ligne[];
const SORTIE = path.join(process.cwd(), "public/images/jeu/ecrans");

/** Bande utile d'un écran de l'époque, en part de la hauteur du fichier carré (le cadre et le logo sont dehors). */
const BANDE_CLASSIQUE = { haut: 0.222, hauteur: 0.555 };

/** Premières et dernières lignes où l'image est opaque (moyenne d'opacité de la ligne au-dessus de 50 %). */
function bandeOpaque(pixels: Buffer, largeur: number, hauteur: number): { haut: number; bas: number } {
  const opaque = (y: number) => {
    let s = 0;
    for (let x = 0; x < largeur; x += 8) s += pixels[(y * largeur + x) * 4 + 3];
    return s / Math.ceil(largeur / 8) > 128;
  };
  let haut = 0;
  while (haut < hauteur - 1 && !opaque(haut)) haut++;
  let bas = hauteur - 1;
  while (bas > haut && !opaque(bas)) bas--;
  // Quelques lignes de marge : le bord de l'illustration est souvent adouci.
  return { haut: Math.min(haut + 4, bas), bas: Math.max(bas - 4, haut) };
}

lancer("ecrans:jeu", async () => {
  const version = await derniereVersion();
  const [cartesCsv, ecransCsv] = await Promise.all([tableCsv("Map", version), tableCsv("LoadingScreens", version)]);
  const cartes = new Map(lire(cartesCsv).map((c) => [Number(c.ID), c]));
  const ecrans = new Map(lire(ecransCsv).map((e) => [e.ID, e]));
  await mkdir(SORTIE, { recursive: true });

  const manquants: string[] = [];
  const faits: string[] = [];
  for (const e of ECRANS) {
    const ecran = ecrans.get(cartes.get(e.carte)?.LoadingScreenID ?? "");
    const principal = Number(ecran?.MainImageFileDataID ?? 0);
    const classique = Number(ecran?.NarrowScreenFileDataID ?? 0);
    const fichier = principal || classique;
    if (!fichier) {
      manquants.push(e.nom);
      continue;
    }
    const brut = await fichierBrut(fichier, version);
    if (brut.subarray(0, 4).toString("ascii") !== "BLP2") {
      // Fichier encore chiffré par Blizzard (contenu pas encore ouvert) : on réessaiera à la prochaine version.
      manquants.push(`${e.nom} (fichier pas encore disponible)`);
      continue;
    }
    const img = decoderBlp(brut);
    const brutRgba = sharp(img.pixels, { raw: { width: img.largeur, height: img.hauteur, channels: 4 } });
    let base: Sharp;
    if (principal) {
      // Écran de Forever : l'illustration occupe une bande, le reste est transparent.
      const { haut, bas } = bandeOpaque(img.pixels, img.largeur, img.hauteur);
      const bande = await brutRgba.extract({ left: 0, top: haut, width: img.largeur, height: bas - haut + 1 }).flatten({ background: "#000000" }).png().toBuffer();
      base = sharp(bande);
    } else {
      const haut = Math.round(img.hauteur * BANDE_CLASSIQUE.haut);
      const hauteur = Math.round(img.hauteur * BANDE_CLASSIQUE.hauteur);
      // Le fichier carré contient une image 4:3 étirée : on rend à la bande ses proportions d'origine.
      // Sortie en PNG : un tampon « brut » ne se relit pas sans ses dimensions.
      const bande = await brutRgba.removeAlpha().extract({ left: 0, top: haut, width: img.largeur, height: hauteur }).png().toBuffer();
      base = sharp(bande).resize(img.largeur, Math.round(hauteur * 0.75), { fit: "fill" });
    }
    const source = await base.jpeg({ quality: 95 }).toBuffer();
    for (const largeur of LARGEURS_ECRANS) {
      await sharp(source).resize({ width: largeur, withoutEnlargement: true }).jpeg({ quality: largeur > 1000 ? 78 : 74, progressive: true, mozjpeg: true })
        .toFile(path.join(SORTIE, `${e.slug}-${largeur}.jpg`));
    }
    faits.push(e.slug);
    console.log(`${e.slug} ← ${principal ? "écran Forever" : "écran de l'époque"} ${fichier}`);
  }
  await writeFile(
    path.join(process.cwd(), "content/ecrans-jeu.ts"),
    `/** Fichier généré par npm run ecrans:jeu : ne pas modifier à la main. Images © Blizzard Entertainment, lues grâce à wago.tools. */\n` +
      `export const VERSION_ECRANS_JEU = ${JSON.stringify(version)};\n` +
      `export const ECRANS_DISPONIBLES: string[] = ${JSON.stringify(faits)};\n`,
  );
  if (manquants.length) console.log(`Non extraits : ${manquants.join(", ")}.`);
  console.log(`Version du jeu : ${version}.`);
});
