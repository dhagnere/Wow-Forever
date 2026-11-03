import { passage } from "../passage";
import { corrigerLiensArticles } from "../collecte/liens";
import { lancer } from "./_lanceur";

// Passage quotidien : collecte, classement, rédaction des brouillons. Lancé par cron.json chaque matin.
lancer("veille:quotidien", async () => {
  const bilan = await passage("quotidien");
  console.log(`${bilan.brouillons.length} brouillons créés, ${bilan.echecs.length} échecs.`);
  for (const s of bilan.sources.filter((x) => x.erreur)) console.log(`Source en échec : ${s.nom} — ${s.erreur}`);
  // Les éditeurs publient parfois leur flux après Google News : on retente chaque matin les liens restés indirects.
  const liens = await corrigerLiensArticles();
  if (liens.articles) console.log(`Liens Google News : ${liens.corriges} remplacé(s), ${liens.restants.length} encore indirect(s).`);
});
