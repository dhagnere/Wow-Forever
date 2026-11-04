import { writeFile } from "node:fs/promises";
import path from "node:path";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { derniereVersion, tableCsv } from "../objets/wago";
import { lancer } from "./_lanceur";
import { lireCsv, slugLieu } from "./_bases-libres";

/**
 * Noms anglais des lieux (version anglaise du site) : chaque carte du site (slug tiré de son nom français) reçoit le nom
 * anglais de la même carte du jeu (UiMap enUS), chaque lieu de l'île de Zéphras le sien (AreaTable enUS), et chaque donjon
 * ou raid le sien (Map enUS, clé : nom français normalisé, sans article).
 *   npm run lieux:en
 * Écrit content/lieux-en.ts.
 */

lancer("lieux:en", async () => {
  const version = await derniereVersion();
  const [cartesFr, cartesEn, airesFr, airesEn, mapsFr, mapsEn] = await Promise.all([
    tableCsv("UiMap", version), tableCsv("UiMap", version, "enUS"), tableCsv("AreaTable", version), tableCsv("AreaTable", version, "enUS"),
    tableCsv("Map", version), tableCsv("Map", version, "enUS"),
  ]);
  const mapsEnParId = new Map(lireCsv(mapsEn).map((m) => [m.ID, m.MapName_lang]));
  const donjons: Record<string, string> = {};
  for (const m of lireCsv(mapsFr)) {
    const en = mapsEnParId.get(m.ID);
    const cle = slugLieu(m.MapName_lang ?? "").replace(/^(les?|la|l)-/, "");
    // Donjons (1) et raids (2), hors cartes de test.
    if (["1", "2"].includes(m.InstanceType) && en && cle && !/test|unused/i.test(en) && !donjons[cle]) donjons[cle] = en;
  }
  const en = new Map(lireCsv(cartesEn).map((u) => [u.ID, u.Name_lang]));
  const cartes: Record<string, string> = {};
  for (const u of lireCsv(cartesFr)) {
    const slug = slugLieu(u.Name_lang ?? "");
    if (CARTES_JEU[slug] && !cartes[slug] && en.get(u.ID)) cartes[slug] = en.get(u.ID)!;
  }
  const airesEnParId = new Map(lireCsv(airesEn).map((a) => [a.ID, a.AreaName_lang]));
  const aires: Record<string, string> = {};
  for (const a of lireCsv(airesFr)) if (a.ParentAreaID === "16593" || a.ID === "16593") aires[a.AreaName_lang] = airesEnParId.get(a.ID) ?? a.AreaName_lang;
  const manquantes = Object.keys(CARTES_JEU).filter((s) => !cartes[s]);
  await writeFile(
    path.join(process.cwd(), "content/lieux-en.ts"),
    `/** Fichier généré par npm run lieux:en : ne pas modifier à la main. Noms © Blizzard Entertainment, lus grâce à wago.tools. */\n\n` +
      `/** Nom anglais de chaque carte du site, par slug. */\n` +
      `export const CARTES_EN: Record<string, string> = ${JSON.stringify(cartes, null, 2)};\n\n` +
      `/** Lieux de l'île de Zéphras : nom français → nom anglais. */\n` +
      `export const LIEUX_ZEPHRAS_EN: Record<string, string> = ${JSON.stringify(aires, null, 2)};\n\n` +
      `/** Donjons et raids : nom français normalisé (sans article) → nom anglais. */\n` +
      `export const DONJONS_EN: Record<string, string> = ${JSON.stringify(donjons, null, 2)};\n`,
  );
  console.log(`${Object.keys(cartes).length} cartes nommées en anglais${manquantes.length ? `, sans nom : ${manquantes.join(", ")}` : ""} ; ${Object.keys(aires).length} lieux de Zéphras ; ${Object.keys(donjons).length} donjons et raids.`);
});
