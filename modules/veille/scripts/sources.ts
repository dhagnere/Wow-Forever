import { SOURCES } from "@/config/sources";
import { lireToutes } from "../collecte/flux";
import { lancer } from "./_lanceur";

// Vérifie chaque flux de config/sources.ts. Aucune écriture en base, aucun coût d'API.
lancer("veille:sources", async () => {
  const resultats = await lireToutes(SOURCES);
  let echecs = 0;
  for (const r of resultats) {
    if (r.erreur) {
      echecs++;
      console.log(`ÉCHEC  ${r.source.id.padEnd(18)} ${r.erreur}\n       ${r.source.url}`);
    } else {
      const recent = r.elements[0]?.publieLe.toISOString().slice(0, 10) ?? "—";
      console.log(`OK     ${r.source.id.padEnd(18)} ${String(r.elements.length).padStart(3)} éléments, le plus récent : ${recent}`);
    }
  }
  console.log(`\n${resultats.length - echecs} sources valides, ${echecs} en échec. Retirez ou corrigez les sources en échec dans config/sources.ts.`);
});
