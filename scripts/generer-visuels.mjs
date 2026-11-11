/**
 * Génère les images de la marque à partir de visuels/ : enseigne de la Taverne (logo) et chope (icône du site), dessins
 * vectoriels ; avatar de Jobwow, d'après sa capture en jeu (visuels/jobwow-capture.webp, son mort-vivant de la Horde).
 *   npm run visuels:generer
 */
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const rendre = async (source, sortie, taille, fond) => {
  const svg = await readFile(new URL(`../visuels/${source}`, import.meta.url));
  let img = sharp(svg, { density: 300 }).resize(taille, taille, { fit: "contain", background: fond ?? { r: 0, g: 0, b: 0, alpha: 0 } });
  if (fond) img = img.flatten({ background: fond });
  await img.png({ compressionLevel: 9 }).toFile(new URL(`../${sortie}`, import.meta.url).pathname);
  console.log(sortie);
};

await rendre("enseigne.svg", "public/images/logo-taverne-96.png", 96);
await rendre("enseigne.svg", "public/images/logo-taverne-192.png", 192);
await rendre("enseigne.svg", "public/images/logo-taverne-512.png", 512, "#2b1d14");
await rendre("chope.svg", "app/icon.png", 256);
await rendre("chope.svg", "app/apple-icon.png", 180);
// Avatar : buste recadré sur le visage pour les portraits ronds du site, personnage entier en 1080 (réseaux)
const capture = new URL("../visuels/jobwow-capture.webp", import.meta.url).pathname;
const BUSTE = { left: 175, top: 10, width: 360, height: 360 };
const avatar = async (sortie, taille, buste = true) => {
  let img = sharp(capture);
  if (buste) img = img.extract(BUSTE);
  await img.resize(taille, taille, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(new URL(`../${sortie}`, import.meta.url).pathname);
  console.log(sortie);
};
await avatar("public/images/jobwow-192.png", 192);
await avatar("public/images/jobwow-512.png", 512);
await avatar("public/images/jobwow-1080.png", 1080, false);
