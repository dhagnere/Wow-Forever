import { passage } from "../passage";
import { lancer } from "./_lanceur";

// Passage quotidien : collecte, classement, rédaction des brouillons. Lancé par cron.json chaque matin.
lancer("veille:quotidien", async () => {
  const bilan = await passage("quotidien");
  console.log(`${bilan.brouillons.length} brouillons créés, ${bilan.echecs.length} échecs.`);
  for (const s of bilan.sources.filter((x) => x.erreur)) console.log(`Source en échec : ${s.nom} — ${s.erreur}`);
});
