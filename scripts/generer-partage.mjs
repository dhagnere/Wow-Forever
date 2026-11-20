// Image de partage par défaut du site (1200 × 630) : capture du héros, enseigne et accroche.
// npm run visuels:partage → public/images/partage-taverne-1200x630.jpg
// Les textes utilisent Cinzel et Source Sans 3 installées sur le poste (sinon une police serif de repli).
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const L = 1200;
const H = 630;
const sortie = "public/images/partage-taverne-1200x630.jpg";

const fond = await sharp("public/images/heros-accueil-1920.jpg").resize(L, H, { fit: "cover", position: "right" }).toBuffer();
const enseigne = await sharp(await readFile("public/images/enseigne-taverne.svg"), { density: 300 }).resize(150, 142).png().toBuffer();

const voile = Buffer.from(`<svg width="${L}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#140d08" stop-opacity="0.94"/>
      <stop offset="0.55" stop-color="#140d08" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#140d08" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <rect width="${L}" height="${H}" fill="url(#g)"/>
  <rect x="18" y="18" width="${L - 36}" height="${H - 36}" fill="none" stroke="#e0a23b" stroke-opacity="0.55" stroke-width="2"/>
  <text x="70" y="250" font-family="Cinzel, serif" font-weight="700" font-size="30" letter-spacing="6" fill="#e0a23b">LA TAVERNE ÉTERNELLE</text>
  <text x="68" y="330" font-family="Cinzel, serif" font-weight="800" font-size="62" fill="#fbf1da">WoW Forever</text>
  <text x="68" y="402" font-family="Cinzel, serif" font-weight="800" font-size="62" fill="#ecb85a">de 1 à 60</text>
  <rect x="70" y="432" width="120" height="2" fill="#e0a23b"/>
  <text x="70" y="484" font-family="'Source Sans 3', sans-serif" font-weight="600" font-size="28" fill="#f3e6c8">Guide quête par quête · Talents · Donjons</text>
  <text x="70" y="524" font-family="'Source Sans 3', sans-serif" font-weight="600" font-size="28" fill="#f3e6c8">Actualité chaque matin, en français</text>
  <text x="${L - 40}" y="${H - 36}" text-anchor="end" font-family="'Source Sans 3', sans-serif" font-size="16" fill="#f3e6c8" fill-opacity="0.8">© Blizzard Entertainment · site de fans</text>
</svg>`);

await sharp(fond)
  .composite([
    { input: voile, top: 0, left: 0 },
    { input: enseigne, top: 60, left: 64 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(sortie);

console.log(`Image de partage écrite : ${sortie}`);
