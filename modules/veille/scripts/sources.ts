import { SOURCES } from "@/config/sources";
import { lireToutes } from "../collecte/flux";
import { lancer } from "./_lanceur";

// Vérifie chaque flux de config/sources.ts. Aucune écriture en base, aucun coût d'API.
lancer("veille:sources", async () => {
  const resultats = await lireToutes(SOURCES);
  let echecs = 0;
  let vides = 0;
  for (const r of resultats) {
    const id = r.source.id.padEnd(18);
    if (r.erreur) {
      echecs++;
      console.log(`ÉCHEC  ${id} ${r.erreur.split("\n")[0]}\n       ${r.source.url}`);
    } else if (r.elements.length === 0) {
      vides++;
      const raison = r.entrees === 0 ? "le flux ne contient aucune entrée" : `${r.entrees} entrées, toutes sans titre, lien ou date`;
      console.log(`VIDE   ${id} ${raison}\n       ${r.source.url}`);
    } else {
      const recent = new Date(Math.max(...r.elements.map((e) => e.publieLe.getTime()))).toISOString().slice(0, 10);
      console.log(`OK     ${id} ${String(r.elements.length).padStart(3)} éléments, le plus récent : ${recent}`);
    }
  }
  console.log(
    `\n${resultats.length - echecs - vides} sources valides, ${vides} vides, ${echecs} en échec. Corrigez ou retirez les sources VIDE et ÉCHEC dans config/sources.ts.`,
  );
});
