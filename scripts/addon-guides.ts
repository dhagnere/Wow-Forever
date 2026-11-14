import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fichierCartes, tocAvecGuides } from "@/lib/addon";

/**
 * Prépare le dossier de l'addon EternalRoutes :
 *   npm run addon:guides -- <dossier EternalRoutes>
 * Écrit Maps.lua (carte du jeu par nom de zone), retire les anciens guides du site (Guides/site) et met à jour la liste
 * des fichiers dans EternalRoutes.toc. Les routes enregistrées en jeu ne sont pas touchées.
 */

const dossier = process.argv[2];
if (!dossier) {
  console.error("Usage : npm run addon:guides -- <dossier de l'addon EternalRoutes>");
  process.exit(1);
}
const toc = path.join(dossier, "EternalRoutes.toc");
if (!existsSync(toc)) {
  console.error(`${toc} introuvable : indiquer le dossier qui contient EternalRoutes.toc.`);
  process.exit(1);
}

// Les guides de 1 à 60 du site ne partent plus dans l'addon (demande de Jobwow, 14/11/2026) : seules les routes
// enregistrées en jeu (une par zone de départ, race et classe, puis les routes de faction) servent de référence.
// Le dossier Guides/site est vidé et le .toc ne garde que Maps.lua entre ses repères.
const site = path.join(dossier, "Guides", "site");
rmSync(site, { recursive: true, force: true });
const fichiers: string[] = [];
writeFileSync(path.join(dossier, "Maps.lua"), fichierCartes(), "utf8");
writeFileSync(toc, tocAvecGuides(readFileSync(toc, "utf8"), fichiers), "utf8");
console.log("Maps.lua écrit, guides du site retirés, EternalRoutes.toc mis à jour.");
