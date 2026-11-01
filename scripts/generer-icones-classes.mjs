/**
 * Génère content/icones-classes.ts à partir de la bibliothèque game-icons.net (paquet @iconify-json/game-icons).
 * Licence des icônes : CC BY 3.0 — attribution obligatoire (voir les mentions légales du site).
 * Pour changer une icône : modifier CHOIX, puis `npm run icones:generer`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const jeu = require("@iconify-json/game-icons/icons.json");
const info = require("@iconify-json/game-icons/info.json");

const CHOIX = {
  guerrier: "crossed-swords",
  paladin: "templar-shield",
  chasseur: "high-shot",
  voleur: "cloak-dagger",
  pretre: "angel-wings",
  chaman: "lightning-storm",
  mage: "fire-ray",
  demoniste: "burning-skull",
  druide: "bear-head",
};

const icones = {};
for (const [classe, nom] of Object.entries(CHOIX)) {
  const icone = jeu.icons[nom];
  if (!icone) throw new Error(`Icône introuvable : ${nom}`);
  const chemins = [...icone.body.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  if (!chemins.length || /<(?!path\b|\/path)/.test(icone.body.replace(/<path[^>]*\/>/g, ""))) {
    throw new Error(`Icône ${nom} : seuls des tracés <path> simples sont pris en charge.`);
  }
  icones[classe] = { icone: nom, chemins };
}

const sortie = `/**
 * Icônes de classes — fichier généré par scripts/generer-icones-classes.mjs, ne pas modifier à la main.
 * Dessins : contributeurs de game-icons.net (${info.author.url}).
 * Licence : ${info.license.title} (${info.license.url}). Attribution affichée dans les mentions légales.
 */

export const TAILLE_ICONES = ${jeu.width ?? 512};

export const ICONES_CLASSES: Record<string, { icone: string; chemins: string[] }> = ${JSON.stringify(icones, null, 2)};
`;
writeFileSync(new URL("../content/icones-classes.ts", import.meta.url), sortie);
console.log(`${Object.keys(icones).length} icônes écrites dans content/icones-classes.ts (${(sortie.length / 1024).toFixed(1)} Ko).`);
