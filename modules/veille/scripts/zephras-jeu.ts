import { writeFile } from "node:fs/promises";
import path from "node:path";
import { derniereVersion, tableCsv } from "../objets/wago";
import { lancer } from "./_lanceur";
import { lireCsv } from "./_bases-libres";

/**
 * Lieux de l'île de Zéphras, lus dans les fichiers du jeu (wago.tools) : noms (AreaTable) et position sur la carte de
 * l'île, d'après le centre de leur zone d'exploration (WorldMapOverlay, carte de 1002 × 668).
 *   npm run zephras:jeu
 * Écrit content/zephras-jeu.ts. Les quêtes de l'île ne figurent pas dans les fichiers : voir content/zephras.ts.
 */

const ZEPHRAS = 16593;
const CARTE_ZEPHRAS = 2521;
const LARGEUR = 1002;
const HAUTEUR = 668;

lancer("zephras:jeu", async () => {
  const version = await derniereVersion();
  const [aires, liens, calques] = await Promise.all(["AreaTable", "UiMapXMapArt", "WorldMapOverlay"].map((t) => tableCsv(t, version)));
  const noms = new Map(lireCsv(aires).filter((a) => a.ID === String(ZEPHRAS) || a.ParentAreaID === String(ZEPHRAS)).map((a) => [a.ID, a.AreaName_lang]));
  const arts = new Set(lireCsv(liens).filter((l) => l.UiMapID === String(CARTE_ZEPHRAS)).map((l) => l.UiMapArtID));
  const places = new Map<string, { nom: string; x: number; y: number }>();
  for (const o of lireCsv(calques)) {
    if (!arts.has(o.UiMapArtID) || !noms.has(o.AreaID_0)) continue;
    const l = Number(o.TextureWidth), h = Number(o.TextureHeight), x = Number(o.OffsetX), y = Number(o.OffsetY);
    if (!l || !h || (!x && !y)) continue;
    places.set(o.AreaID_0, {
      nom: noms.get(o.AreaID_0)!,
      x: Math.round(((x + l / 2) / LARGEUR) * 1000) / 10,
      y: Math.round(((y + h / 2) / HAUTEUR) * 1000) / 10,
    });
  }
  const lieux = [...places.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const autres = [...noms.entries()].filter(([id]) => id !== String(ZEPHRAS) && !places.has(id)).map(([, n]) => n).sort((a, b) => a.localeCompare(b, "fr"));
  if (lieux.length < 5) throw new Error(`Trop peu de lieux placés (${lieux.length}) : fichier non remplacé.`);
  await writeFile(
    path.join(process.cwd(), "content/zephras-jeu.ts"),
    `/** Fichier généré par npm run zephras:jeu : ne pas modifier à la main. Noms et carte © Blizzard Entertainment, lus grâce à wago.tools. */\n\n` +
      `export const VERSION_ZEPHRAS_JEU = ${JSON.stringify(version)};\n\n` +
      `/** Lieux de l'île placés sur sa carte (centre de leur zone d'exploration, en % de la carte). */\n` +
      `export const LIEUX_ZEPHRAS: { nom: string; x: number; y: number }[] = ${JSON.stringify(lieux, null, 2)};\n\n` +
      `/** Lieux nommés dans les fichiers, sans position connue sur la carte. */\n` +
      `export const AUTRES_LIEUX_ZEPHRAS: string[] = ${JSON.stringify(autres, null, 2)};\n`,
  );
  console.log(`${lieux.length} lieux placés, ${autres.length} sans position. Version ${version}.`);
});
