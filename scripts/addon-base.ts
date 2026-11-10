import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fichierBaseQuetes, tocAvecBase } from "@/lib/addon";

/**
 * Écrit la base de quêtes intégrée de l'addon EternalRoutes (QuestDB.lua) :
 *   npm run addon:base -- <dossier EternalRoutes>
 * Titres, niveaux, quête préalable, donneur et receveur placés sur la carte, secteur des objectifs, objectifs rédigés
 * par La Taverne, en français et en anglais, d'après les bases libres CMaNGOS et AzerothCore. Contient aussi les masques
 * de classe et de race (l'ancien QuestRestrictions.lua, retiré du .toc et du dossier).
 */
const dossier = process.argv[2];
const toc = dossier && path.join(dossier, "EternalRoutes.toc");
if (!toc || !existsSync(toc)) {
  console.error("Usage : npm run addon:base -- <dossier contenant EternalRoutes.toc>");
  process.exit(1);
}
const lua = fichierBaseQuetes();
writeFileSync(path.join(dossier, "QuestDB.lua"), lua, "utf8");
rmSync(path.join(dossier, "QuestRestrictions.lua"), { force: true });
writeFileSync(toc, tocAvecBase(readFileSync(toc, "utf8")), "utf8");
console.log(`QuestDB.lua : ${(lua.length / 1024).toFixed(0)} Ko, ${lua.split("\n").filter((l) => l.startsWith("D[")).length} quêtes. EternalRoutes.toc mis à jour.`);
