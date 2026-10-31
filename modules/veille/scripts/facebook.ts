import { relayer } from "../facebook/relais";
import { lancer } from "./_lanceur";

// Relais Facebook : lancé chaque heure par cron.json ; ne publie qu'entre 8h et 22h (Paris), 3 posts par heure au plus.
lancer("veille:facebook", async () => {
  const bilan = await relayer();
  console.log(`Statut : ${bilan.statut}. Publiés : ${bilan.publies.length}. Échecs : ${bilan.echecs.length}.`);
  for (const e of bilan.echecs) console.log(`  ${e.slug} : ${e.erreur}`);
});
