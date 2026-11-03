import { corrigerLiensArticles } from "../collecte/liens";
import { lancer } from "./_lanceur";

/**
 * Remplace les liens Google News des sources par l'adresse directe des articles d'origine.
 *   npm run veille:liens
 */
lancer("veille:liens", async () => {
  const b = await corrigerLiensArticles();
  console.log(`${b.articles} article(s) concerné(s), ${b.corriges} lien(s) remplacé(s) par l'adresse directe.`);
  if (b.restants.length) {
    console.log(`Introuvables dans le flux public de l'éditeur (lien Google News gardé) :`);
    for (const r of b.restants) console.log(`  · ${r.article} : ${r.source}`);
  }
});
