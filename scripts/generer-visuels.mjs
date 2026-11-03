/**
 * Génère les images de la marque à partir des dessins vectoriels de visuels/ :
 * enseigne de la Taverne (logo), chope (icône du site) et avatar de Jobwow.
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
await rendre("jobwow.svg", "public/images/jobwow-192.png", 192);
await rendre("jobwow.svg", "public/images/jobwow-512.png", 512);
await rendre("jobwow.svg", "public/images/jobwow-1080.png", 1080);
