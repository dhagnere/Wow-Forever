import { relayer } from "../facebook/relais";
import { lancer } from "./_lanceur";

// Relais Facebook : lancé chaque heure par cron.json ; ne publie qu'entre 8h et 22h (Paris), 3 posts par heure au plus.
lancer("veille:facebook", async () => {
  const bilan = await relayer();
  console.log(`Statut : ${bilan.statut}. Publiés : ${bilan.publies.length}. Échecs : ${bilan.echecs.length}.`);
  for (const e of bilan.echecs) console.log(`  ${e.slug} : ${e.erreur}`);
  console.log(`Reels publiés : ${bilan.reels.length}. Échecs : ${bilan.echecsReels.length}.`);
  for (const e of bilan.echecsReels) console.log(`  ${e.slug} : ${e.erreur}`);
  console.log(`Instagram : ${bilan.instagram.length}. TikTok : ${bilan.tiktok.length}. Échecs : ${bilan.echecsReseaux.length}.`);
  for (const e of bilan.echecsReseaux) console.log(`  [${e.reseau}] ${e.slug} : ${e.erreur}`);
});
