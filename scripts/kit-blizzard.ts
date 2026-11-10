import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { KIT_BLIZZARD, type VisuelKit } from "@/config/kit-blizzard";

/**
 * Ajoute à la galerie de l'éditeur les visuels du kit officiel de Blizzard, téléchargés à la main sur le site de Blizzard
 * (espace presse ou kit pour sites de fans) :
 *   npm run kit:blizzard -- <dossier des images>
 * Chaque image (jpg, png, webp) est redimensionnée en 1600 et 800 pixels de large dans public/images/kit/, et la liste
 * config/kit-blizzard.ts est mise à jour. Le nom affiché vient du nom du fichier ; un nom corrigé à la main est gardé.
 */

const dossier = process.argv[2];
if (!dossier || !existsSync(dossier)) {
  console.error("Usage : npm run kit:blizzard -- <dossier contenant les images du kit>");
  process.exit(1);
}

const SORTIE = path.join(process.cwd(), "public/images/kit");
const CREDIT = "Visuel officiel · © Blizzard Entertainment";
const slugDe = (f: string) =>
  path.parse(f).name.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const nomDe = (f: string) => {
  const n = path.parse(f).name.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return n.charAt(0).toUpperCase() + n.slice(1);
};

(async () => {
  mkdirSync(SORTIE, { recursive: true });
  const connus = new Map(KIT_BLIZZARD.map((v) => [v.slug, v]));
  const fichiers = readdirSync(dossier).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (!fichiers.length) {
    console.error(`Aucune image jpg, png ou webp dans ${dossier}.`);
    process.exit(1);
  }
  for (const f of fichiers) {
    const slug = slugDe(f);
    const source = sharp(readFileSync(path.join(dossier, f))).rotate();
    const { width = 0 } = await source.metadata();
    if (width < 800) {
      console.log(`${f} : ignorée (${width} pixels de large, 800 au moins).`);
      continue;
    }
    for (const largeur of [1600, 800]) {
      await source.clone().resize({ width: Math.min(largeur, width), withoutEnlargement: true }).flatten({ background: "#140d08" })
        .jpeg({ quality: largeur > 1000 ? 84 : 78, progressive: true, mozjpeg: true }).toFile(path.join(SORTIE, `${slug}-${largeur}.jpg`));
    }
    if (!connus.has(slug)) connus.set(slug, { slug, nom: nomDe(f), credit: CREDIT });
    console.log(`${f} → images/kit/${slug}`);
  }
  const liste: VisuelKit[] = [...connus.values()].filter((v) => existsSync(path.join(SORTIE, `${v.slug}-1600.jpg`)));
  const texte = readFileSync(path.join(process.cwd(), "config/kit-blizzard.ts"), "utf8")
    .replace(/export const KIT_BLIZZARD: VisuelKit\[\] = [\s\S]*;\n$/, `export const KIT_BLIZZARD: VisuelKit[] = ${JSON.stringify(liste, null, 2)};\n`);
  writeFileSync(path.join(process.cwd(), "config/kit-blizzard.ts"), texte);
  console.log(`${liste.length} visuels dans la galerie.`);
})();
