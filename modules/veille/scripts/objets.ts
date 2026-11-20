import { importerObjets, prechargerIcones } from "../objets/depot";
import { majIconesOrigine } from "../objets/origine";
import { lancer } from "./_lanceur";

/**
 * Import de la base d'objets depuis wago.tools (dernière version de WoW Forever).
 *   npm run base:importer                 → importe si une nouvelle version du jeu est sortie
 *   npm run base:importer -- --forcer     → réimporte même sans nouvelle version
 *   npm run base:importer -- --icones     → convertit aussi toutes les icônes manquantes (sinon : à la première visite)
 * À chaque passage, l'icône des objets du butin d'origine absents de Forever est relue dans les fichiers de Classic Era
 * (majIconesOrigine), puis les icônes encore manquantes du butin sont converties ; un échec n'arrête pas l'import.
 */
const args = process.argv.slice(2);

lancer("base:importer", async () => {
  const bilan = await importerObjets({ forcer: args.includes("--forcer") });
  console.log(bilan.ignore
    ? `Version ${bilan.version} déjà importée (${bilan.nombre} objets) : rien à faire.`
    : `Version ${bilan.version} importée : ${bilan.nombre} objets.`);
  try {
    const o = await majIconesOrigine();
    console.log(`Butin d'origine : ${o.trouves} icônes trouvées pour ${o.cherches} objets absents de Forever (${o.version}).`);
  } catch (e) {
    console.error(`Butin d'origine : icônes non relues (${e instanceof Error ? e.message : e}).`);
  }
  // Les icônes manquantes sont converties à chaque passage : la première fois, cela peut prendre plusieurs minutes ;
  // ensuite il n'y a plus rien à faire. --icones reste accepté (même effet).
  const i = await prechargerIcones();
  console.log(`Icônes : ${i.ajoutees} ajoutées, ${i.echecs} en échec (réessayées à la première visite).`);
});
