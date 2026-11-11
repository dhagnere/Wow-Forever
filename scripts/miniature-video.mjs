/**
 * Miniature YouTube d'une séance du Journal de Jobwow (1280 × 720, JPEG), au gabarit visuels/miniature-video.html :
 *
 *   npm run video:miniature -- --image <image tirée de la vidéo> --haut "DU GLAS" --bas "À BRILL" --niveaux "1 → 8" \
 *     --lieu "Clairières de Tirisfal" --date "11 novembre 2026" --sortie public/images/videos/journal-2026-11-11.jpg \
 *     [--cadrage x,y,largeur,hauteur] [--lueur "rgba(120,255,90,.22)"] [--anglais]
 *
 * L'image vient de la vidéo elle-même (personnage de Jobwow, nom flottant et icônes d'interface effacés au préalable,
 * voir VIDEOS.md). --cadrage découpe la zone du personnage (16:9 de préférence) avant l'agrandissement ; le personnage
 * se place à droite, les textes à gauche. Jamais de nom de classe ni d'addon dans les textes.
 * Le rendu passe par Playwright (navigateur de la session de préparation, pas une dépendance du site).
 */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";

const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const option = (nom) => { const i = process.argv.indexOf(`--${nom}`); return i > 0 ? process.argv[i + 1] : undefined; };

const image = option("image");
const sortie = option("sortie");
if (!image || !sortie || !option("haut")) {
  console.error('Usage : npm run video:miniature -- --image <image> --haut "…" --bas "…" --niveaux "1 → 8" --lieu "…" --date "…" --sortie public/images/videos/<nom>.jpg [--cadrage x,y,l,h]');
  process.exit(1);
}

let fond = sharp(image);
const cadrage = option("cadrage");
if (cadrage) {
  const [left, top, width, height] = cadrage.split(",").map(Number);
  fond = fond.extract({ left, top, width, height });
}
const fondPng = await fond.resize(1280, 720, { fit: "cover", kernel: "lanczos3" }).sharpen({ sigma: 1.2 }).png().toBuffer();
const logo = await readFile(path.join(racine, "public/images/logo-taverne-192.png"));
const anglais = process.argv.includes("--anglais");

const donnees = {
  fond: `data:image/png;base64,${fondPng.toString("base64")}`,
  logo: `data:image/png;base64,${logo.toString("base64")}`,
  serie: anglais ? "JOBWOW'S JOURNAL" : "LE JOURNAL DE JOBWOW",
  motNiveau: anglais ? "LEVEL" : "NIVEAU",
  haut: option("haut"), bas: option("bas"), niveaux: option("niveaux"), lieu: option("lieu"), date: option("date"),
  lueur: option("lueur"),
};

const { chromium } = createRequire(import.meta.url)("playwright");
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const navigateur = await chromium.launch({ proxy });
const page = await navigateur.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
await page.addInitScript((m) => { window.MINIATURE = m; }, donnees);
await page.goto(`file://${path.join(racine, "visuels/miniature-video.html")}`, { waitUntil: "networkidle", timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
const polices = await page.evaluate(() => document.fonts.check('900 40px Cinzel'));
const capture = await page.screenshot({ type: "png" });
await navigateur.close();

await sharp(capture).jpeg({ quality: 90, mozjpeg: true }).toFile(path.resolve(sortie));
const { size } = await import("node:fs").then((fs) => fs.statSync(path.resolve(sortie)));
console.log(`${sortie} : 1280 × 720, ${Math.round(size / 1024)} Ko${polices ? "" : " (attention : police Cinzel non chargée)"}`);
