import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import sharp, { type OverlayOptions } from "sharp";
import { decoderBlp } from "../objets/blp";
import { derniereVersion, fichierBrut, tableCsv } from "../objets/wago";
import { lancer } from "./_lanceur";

/**
 * Cartes du monde de WoW Forever, assemblées à partir des tuiles de la carte du jeu (wago.tools).
 *   npm run cartes:jeu
 * Écrit public/images/jeu/cartes/<lieu>-1000.jpg et <lieu>-500.jpg pour les deux continents, toutes leurs zones
 * et l'île de Zéphras, puis content/cartes-jeu.ts (nom en jeu, continent, lieu parent). Images © Blizzard Entertainment.
 */

type Ligne = Record<string, string>;
const lire = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Ligne[];
const SORTIE = path.join(process.cwd(), "public/images/jeu/cartes");

/** Continents d'origine et monde d'Azeroth (parent de l'île de Zéphras). */
const CONTINENTS: Record<string, string> = { "1414": "Kalimdor", "1415": "Royaumes de l'Est" };
const AZEROTH = "947";

export function slugLieu(nom: string): string {
  return nom.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

lancer("cartes:jeu", async () => {
  const version = await derniereVersion();
  const [cartesCsv, liensCsv, tuilesCsv, stylesCsv, artCsv] = await Promise.all(
    ["UiMap", "UiMapXMapArt", "UiMapArtTile", "UiMapArtStyleLayer", "UiMapArt"].map((t) => tableCsv(t, version)),
  );
  const cartes = lire(cartesCsv);
  const artParCarte = new Map<string, string>();
  for (const l of lire(liensCsv)) if (l.PhaseID === "0" && !artParCarte.has(l.UiMapID)) artParCarte.set(l.UiMapID, l.UiMapArtID);
  const tuiles = new Map<string, Ligne[]>();
  for (const t of lire(tuilesCsv)) if (t.LayerIndex === "0") tuiles.set(t.UiMapArtID, [...(tuiles.get(t.UiMapArtID) ?? []), t]);
  const styleDeArt = new Map(lire(artCsv).map((a) => [a.ID, a.UiMapArtStyleID]));
  const styles = new Map(lire(stylesCsv).filter((s) => s.LayerIndex === "0").map((s) => [s.UiMapArtStyleID, s]));

  // Zones des deux continents (type 3, carte « monde » ordinaire), les continents eux-mêmes et les îles rattachées à Azeroth.
  const retenues = cartes.filter((c) =>
    c.System === "0" && ((c.Type === "2" && c.ID in CONTINENTS) || (c.Type === "3" && (c.ParentUiMapID in CONTINENTS || c.ParentUiMapID === AZEROTH))),
  );

  await mkdir(SORTIE, { recursive: true });
  const index: Record<string, { nom: string; continent: string; type: "continent" | "zone" }> = {};
  for (const c of retenues) {
    const art = artParCarte.get(c.ID);
    const lot = art ? tuiles.get(art) ?? [] : [];
    const style = art ? styles.get(styleDeArt.get(art) ?? "") : undefined;
    if (!lot.length || !style) continue;
    const nom = c.Name_lang.replace(/’/g, "'").trim();
    const slug = slugLieu(nom);
    if (index[slug]) continue;
    const tw = Number(style.TileWidth);
    const th = Number(style.TileHeight);
    const colonnes = Math.max(...lot.map((t) => Number(t.ColIndex))) + 1;
    const lignes = Math.max(...lot.map((t) => Number(t.RowIndex))) + 1;
    const morceaux: OverlayOptions[] = [];
    let illisible = false;
    for (const t of lot) {
      const brut = await fichierBrut(Number(t.FileDataID), version);
      if (brut.subarray(0, 4).toString("ascii") !== "BLP2") {
        illisible = true; // tuile encore chiffrée par Blizzard
        break;
      }
      const img = decoderBlp(brut);
      const png = await sharp(img.pixels, { raw: { width: img.largeur, height: img.hauteur, channels: 4 } }).resize(tw, th).png().toBuffer();
      morceaux.push({ input: png, left: Number(t.ColIndex) * tw, top: Number(t.RowIndex) * th });
    }
    if (illisible) {
      console.log(`${nom} : tuiles pas encore disponibles.`);
      continue;
    }
    const assemblee = await sharp({ create: { width: colonnes * tw, height: lignes * th, channels: 4, background: "#000000" } })
      .composite(morceaux)
      .extract({ left: 0, top: 0, width: Math.min(Number(style.LayerWidth), colonnes * tw), height: Math.min(Number(style.LayerHeight), lignes * th) })
      .flatten({ background: "#140d08" })
      .png()
      .toBuffer();
    for (const largeur of [1000, 500]) {
      await sharp(assemblee).resize({ width: largeur }).jpeg({ quality: largeur > 600 ? 80 : 74, progressive: true, mozjpeg: true })
        .toFile(path.join(SORTIE, `${slug}-${largeur}.jpg`));
    }
    const continent = CONTINENTS[c.ID] ? CONTINENTS[c.ID] : CONTINENTS[c.ParentUiMapID] ?? "Hors des continents";
    index[slug] = { nom, continent, type: c.Type === "2" ? "continent" : "zone" };
    console.log(`${slug} ← ${nom} (${continent})`);
  }

  await writeFile(
    path.join(process.cwd(), "content/cartes-jeu.ts"),
    `/** Fichier généré par npm run cartes:jeu : ne pas modifier à la main. Cartes © Blizzard Entertainment, lues grâce à wago.tools. */\n\n` +
      `export const VERSION_CARTES_JEU = ${JSON.stringify(version)};\n\n` +
      `export interface CarteJeu { nom: string; continent: string; type: "continent" | "zone" }\n\n` +
      `export const CARTES_JEU: Record<string, CarteJeu> = ${JSON.stringify(index, null, 2)};\n`,
  );
  console.log(`${Object.keys(index).length} cartes, version ${version}.`);
});
