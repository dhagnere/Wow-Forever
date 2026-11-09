import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fichierCartes, fichierGuide, guidesAddon, nomFichierGuide, tocAvecGuides } from "@/lib/addon";

/**
 * Écrit les guides de 1 à 60 du site dans le dossier de l'addon EternalRoutes :
 *   npm run addon:guides -- <dossier EternalRoutes>
 * Produit Guides/site/<race>-<classe>.lua (un par race et classe), Maps.lua (carte du jeu par nom de zone)
 * et met à jour la liste des fichiers dans EternalRoutes.toc. Les guides enregistrés avec RouteProbe ne sont pas touchés.
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

const guides = guidesAddon();
const vides = guides.filter((g) => g.steps.length === 0);
if (vides.length) {
  console.error(`Guides vides : ${vides.map((g) => g.id).join(", ")}. Lancer npm run base:quetes avant.`);
  process.exit(1);
}

const site = path.join(dossier, "Guides", "site");
rmSync(site, { recursive: true, force: true });
mkdirSync(site, { recursive: true });

const fichiers: string[] = [];
for (const g of guides) {
  const nom = nomFichierGuide(g);
  writeFileSync(path.join(dossier, nom), fichierGuide(g), "utf8");
  fichiers.push(nom);
  console.log(`${nom} : ${g.steps.length} étapes, ${g.zoneCount} zones`);
}
writeFileSync(path.join(dossier, "Maps.lua"), fichierCartes(), "utf8");
writeFileSync(toc, tocAvecGuides(readFileSync(toc, "utf8"), fichiers), "utf8");
console.log(`${guides.length} guides écrits, EternalRoutes.toc mis à jour.`);
