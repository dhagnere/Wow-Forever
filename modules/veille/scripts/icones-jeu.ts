import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import sharp from "sharp";
import { decoderBlp } from "../objets/blp";
import { derniereVersion, fichierBrut, tableCsv } from "../objets/wago";
import { lancer } from "./_lanceur";

/**
 * Icônes officielles des classes et des races, découpées dans les planches d'interface du jeu (wago.tools, WoW Forever).
 *   npm run icones:jeu
 * Écrit public/images/jeu/classes/<classe>.png et public/images/jeu/races/<race>-<sexe>.png (128 × 128),
 * puis content/icones-jeu.ts (version du jeu utilisée). Les images restent la propriété de Blizzard Entertainment.
 */

const CLASSES: Record<string, string> = {
  warrior: "guerrier", paladin: "paladin", hunter: "chasseur", rogue: "voleur", priest: "pretre",
  shaman: "chaman", mage: "mage", warlock: "demoniste", druid: "druide",
};

/** Nom de la race dans les fichiers du jeu → slug du site. Les Éolides (Skyborne) ont leur planche propre à Forever. */
const RACES: Record<string, string> = {
  human: "humain", dwarf: "nain", nightelf: "elfe-de-la-nuit", gnome: "gnome",
  orc: "orc", undead: "mort-vivant", tauren: "tauren", troll: "troll", "skyborne-*-c60": "skyborne",
};

const TAILLE = 128;
const SORTIE = path.join(process.cwd(), "public/images/jeu");

type Ligne = Record<string, string>;
const lire = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Ligne[];

lancer("icones:jeu", async () => {
  const version = await derniereVersion();
  const [membresCsv, atlasCsv] = await Promise.all([tableCsv("UiTextureAtlasMember", version), tableCsv("UiTextureAtlas", version)]);
  const membres = new Map(lire(membresCsv).map((m) => [m.CommittedName.toLowerCase(), m]));
  const atlas = new Map(lire(atlasCsv).map((a) => [a.ID, a]));

  const voulus: { nom: string; fichier: string }[] = [];
  for (const [jeu, slug] of Object.entries(CLASSES)) voulus.push({ nom: `classicon-${jeu}`, fichier: `classes/${slug}.png` });
  for (const [jeu, slug] of Object.entries(RACES)) {
    for (const sexe of ["male", "female"]) {
      const nom = jeu.includes("*") ? `raceicon128-${jeu.replace("*", sexe)}` : `raceicon128-${jeu}-${sexe}`;
      voulus.push({ nom, fichier: `races/${slug}-${sexe === "male" ? "homme" : "femme"}.png` });
    }
  }

  // Une planche est téléchargée et décodée une seule fois, quel que soit le nombre d'icônes qu'on y découpe.
  const planches = new Map<string, Promise<{ largeur: number; hauteur: number; pixels: Buffer }>>();
  const planche = (id: string) => {
    if (!planches.has(id)) planches.set(id, fichierBrut(Number(id), version).then(decoderBlp));
    return planches.get(id)!;
  };

  await mkdir(path.join(SORTIE, "classes"), { recursive: true });
  await mkdir(path.join(SORTIE, "races"), { recursive: true });
  const manquants: string[] = [];
  for (const v of voulus) {
    const m = membres.get(v.nom);
    const a = m && atlas.get(m.UiTextureAtlasID);
    if (!m || !a) {
      manquants.push(v.nom);
      continue;
    }
    const img = await planche(a.FileDataID);
    // Les coordonnées sont celles de la planche d'origine ; le fichier peut être stocké à une autre échelle.
    const ex = img.largeur / Number(a.AtlasWidth);
    const ey = img.hauteur / Number(a.AtlasHeight);
    const zone = {
      left: Math.round(Number(m.CommittedLeft) * ex),
      top: Math.round(Number(m.CommittedTop) * ey),
      width: Math.round((Number(m.CommittedRight) - Number(m.CommittedLeft)) * ex),
      height: Math.round((Number(m.CommittedBottom) - Number(m.CommittedTop)) * ey),
    };
    const png = await sharp(img.pixels, { raw: { width: img.largeur, height: img.hauteur, channels: 4 } })
      .extract(zone)
      .resize(TAILLE, TAILLE, { kernel: "lanczos3" })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(path.join(SORTIE, v.fichier), png);
    console.log(`${v.fichier} ← ${v.nom}`);
  }
  if (manquants.length) throw new Error(`Icônes introuvables dans la version ${version} : ${manquants.join(", ")}.`);

  await writeFile(
    path.join(process.cwd(), "content/icones-jeu.ts"),
    `/** Fichier généré par npm run icones:jeu : ne pas modifier à la main. Icônes © Blizzard Entertainment, lues grâce à wago.tools. */\n` +
      `export const VERSION_ICONES_JEU = ${JSON.stringify(version)};\n`,
  );
  console.log(`Version du jeu : ${version}.`);
});
