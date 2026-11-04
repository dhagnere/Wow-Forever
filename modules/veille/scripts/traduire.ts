import { traduireEnAttente } from "../traduction/traducteur";
import { lancer } from "./_lanceur";

/**
 * Traduit en anglais les articles en ligne sans version anglaise à jour (version /en/ du site).
 *   npm run veille:traduire           (8 articles au plus par passage)
 *   npm run veille:traduire -- 30
 */
lancer("veille:traduire", async () => {
  const limite = Math.max(1, Math.min(100, Number(process.argv[2]) || 8));
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("ANTHROPIC_API_KEY absente : aucune traduction.");
    return;
  }
  const r = await traduireEnAttente(limite);
  console.log(`${r.traduits} article(s) traduit(s).`);
  for (const e of r.echecs) console.log(`  · article ${e.id} : ${e.raison}`);
});
