import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { decoderBlp } from "../objets/blp";
import { derniereVersion, fichierBrut, tableCsv } from "../objets/wago";
import { convertirSorts, TABLES_SORTS, type TablesSorts } from "../sorts/conversion";
import { lancer } from "./_lanceur";

/**
 * Sorts et talents de chaque classe, par spécialisation, lus dans les fichiers du jeu (wago.tools, WoW Forever).
 *   npm run sorts:jeu
 * Écrit content/sorts-jeu.json (lu par les pages de classe, familiers du chasseur et du démoniste compris), sa version anglaise
 * content/sorts-jeu.en.json et les icônes public/images/jeu/sorts/<fichier>.png (64 × 64).
 * Une icône déjà présente n'est pas retéléchargée. Noms, textes et icônes : © Blizzard Entertainment.
 */

const ICONES = path.join(process.cwd(), "public/images/jeu/sorts");
const TAILLE = 64;

const existe = (f: string) => access(f).then(() => true, () => false);

lancer("sorts:jeu", async () => {
  const version = await derniereVersion();
  console.log(`Version du jeu : ${version}. Lecture de ${TABLES_SORTS.length} tables…`);
  const csv = Object.fromEntries(
    await Promise.all(TABLES_SORTS.map(async (t) => [t, await tableCsv(t, version)] as const)),
  ) as TablesSorts;

  const bilan = convertirSorts(csv);
  let sorts = 0;
  let talents = 0;
  for (const [classe, specs] of Object.entries(bilan.classes)) {
    console.log(`${classe} : ${specs.map((s) => `${s.nom} ${s.sorts.length} sorts, ${s.talents.length} talents`).join(" · ")}`);
    for (const s of specs) {
      sorts += s.sorts.length;
      talents += s.talents.length;
    }
  }
  console.log(`traits raciaux : ${Object.entries(bilan.races).map(([r, t]) => `${r} ${t.length}`).join(", ")}`);
  for (const [classe, f] of Object.entries(bilan.familiers)) {
    console.log(`familiers du ${classe} : ${f.familles.length} familles, ${f.techniques.length} techniques`);
  }
  if (sorts < 200 || talents < 200) throw new Error(`Lecture incomplète (${sorts} sorts, ${talents} talents) : fichier non remplacé.`);

  await writeFile(
    path.join(process.cwd(), "content/sorts-jeu.json"),
    JSON.stringify({ version, genere: new Date().toISOString().slice(0, 10), classes: bilan.classes, races: bilan.races, familiers: bilan.familiers }),
  );
  console.log(`${sorts} sorts, ${talents} talents ; ${bilan.incompletes} descriptions avec une valeur propre au personnage (« X »).`);

  // Version anglaise du site : mêmes sorts, mêmes identifiants, tables du jeu en anglais.
  const csvEn = Object.fromEntries(
    await Promise.all(TABLES_SORTS.map(async (t) => [t, await tableCsv(t, version, "enUS")] as const)),
  ) as TablesSorts;
  const en = convertirSorts(csvEn, "en");
  convertirSorts(csv, "fr"); // la langue par défaut redevient le français pour la suite
  await writeFile(
    path.join(process.cwd(), "content/sorts-jeu.en.json"),
    JSON.stringify({ version, genere: new Date().toISOString().slice(0, 10), classes: en.classes, races: en.races, familiers: en.familiers }),
  );
  console.log(`Version anglaise écrite (${Object.values(en.classes).flat().reduce((n, s) => n + s.sorts.length, 0)} sorts).`);

  await mkdir(ICONES, { recursive: true });
  const aFaire: number[] = [];
  for (const id of bilan.icones) if (!(await existe(path.join(ICONES, `${id}.png`)))) aFaire.push(id);
  console.log(`Icônes : ${bilan.icones.length}, dont ${aFaire.length} à télécharger.`);
  const echecs: number[] = [];
  let suivant = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (suivant < aFaire.length) {
      const id = aFaire[suivant++];
      try {
        const img = decoderBlp(await fichierBrut(id, version));
        const png = await sharp(img.pixels, { raw: { width: img.largeur, height: img.hauteur, channels: 4 } })
          .resize(TAILLE, TAILLE, { kernel: "lanczos3" })
          .png({ compressionLevel: 9, palette: true, quality: 92 })
          .toBuffer();
        await writeFile(path.join(ICONES, `${id}.png`), png);
      } catch {
        echecs.push(id);
      }
    }
  }));
  if (echecs.length) console.log(`Icônes illisibles (fichiers chiffrés ou absents) : ${echecs.join(", ")}.`);
});
