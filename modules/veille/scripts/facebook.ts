import { publierProgrammes } from "../articles/depot";
import { relayer } from "../facebook/relais";
import { lancer } from "./_lanceur";

// Passage horaire (cron.json) :
//  1. met en ligne les brouillons programmés arrivés à échéance (même contrôle qu'une publication manuelle) ;
//  2. relais Facebook : ne publie qu'entre 8h et 22h (Paris), 3 posts par heure au plus.
lancer("veille:facebook", async () => {
  const prog = await publierProgrammes();
  if (prog.publies.length) console.log(`Programmés mis en ligne : ${prog.publies.join(", ")}`);
  for (const e of prog.echecs) console.log(`  Programmation annulée (article ${e.id}) : ${e.erreur}`);
  const bilan = await relayer();
  console.log(`Statut : ${bilan.statut}. Publiés : ${bilan.publies.length}. Échecs : ${bilan.echecs.length}.`);
  for (const e of bilan.echecs) console.log(`  ${e.slug} : ${e.erreur}`);
});
