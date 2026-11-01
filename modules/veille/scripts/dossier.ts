import { DOSSIERS } from "@/config/dossiers";
import { rechercherDossiers } from "../passage";
import { lancer } from "./_lanceur";

// Recherche de dossiers de référence (zones de départ, donjons, zones par niveau) sur 60 jours, sans coût d'API.
// Usage : npm run veille:dossier            (tous les dossiers)
//         npm run veille:dossier -- donjons (un ou plusieurs : zones-depart, donjons, zones-niveaux)
lancer("veille:dossier", async () => {
  const ids = process.argv.slice(2);
  const bilan = await rechercherDossiers(ids);
  console.log(`${bilan.elementsLus} éléments lus, ${bilan.sujetsRetenus} sujets retenus. Résultat dans /admin/veille/revue/.`);
  for (const s of bilan.sources.filter((x) => x.erreur)) console.log(`Source en échec : ${s.id} — ${s.erreur}`);
  if (!ids.length) console.log(`Dossiers disponibles : ${DOSSIERS.map((d) => d.id).join(", ")}`);
});
