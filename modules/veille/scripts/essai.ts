import { passage } from "../passage";
import { derniereRevue } from "../passage";
import { lancer } from "./_lanceur";

// Collecte et classement du jour, sans rédaction ni coût d'API. Affiche les 20 premiers sujets.
lancer("veille:essai", async () => {
  await passage("essai");
  const revue = await derniereRevue();
  for (const [i, s] of (revue?.sujets ?? []).slice(0, 20).entries()) {
    const sources = [...new Set(s.elements.map((e) => e.source))].join(", ");
    console.log(`${String(i + 1).padStart(2)}. [${s.score.toFixed(2)}] ${s.titre}\n    ${sources}${s.dejaTraite ? " — déjà traité" : ""}`);
  }
});
