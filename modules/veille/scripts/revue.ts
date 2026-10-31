import { preparerRedaction, redigerSujets } from "../passage";
import { lancer } from "./_lanceur";

// Rédige en brouillons les meilleurs sujets non traités de la dernière revue (celle de veille:essai par exemple),
// sans refaire la collecte. Même résultat que le bouton « Rédiger » de /admin/veille/revue.
lancer("veille:revue", async () => {
  const prep = await preparerRedaction();
  if (!prep.ok) throw new Error(prep.erreur);
  const bilan = await redigerSujets(prep.sujets);
  console.log(`${bilan.brouillons.length} brouillons créés, ${bilan.echecs.length} échecs.`);
});
