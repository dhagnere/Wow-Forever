import { importerObjets, prechargerIcones } from "../objets/depot";
import { lancer } from "./_lanceur";

/**
 * Import de la base d'objets depuis wago.tools (dernière version de WoW Forever).
 *   npm run base:importer                 → importe si une nouvelle version du jeu est sortie
 *   npm run base:importer -- --forcer     → réimporte même sans nouvelle version
 *   npm run base:importer -- --icones     → convertit aussi toutes les icônes manquantes (sinon : à la première visite)
 */
const args = process.argv.slice(2);

lancer("base:importer", async () => {
  const bilan = await importerObjets({ forcer: args.includes("--forcer") });
  console.log(bilan.ignore
    ? `Version ${bilan.version} déjà importée (${bilan.nombre} objets) : rien à faire.`
    : `Version ${bilan.version} importée : ${bilan.nombre} objets.`);
  if (args.includes("--icones")) {
    const i = await prechargerIcones();
    console.log(`Icônes : ${i.ajoutees} ajoutées, ${i.echecs} en échec (réessayées à la première visite).`);
  }
});
