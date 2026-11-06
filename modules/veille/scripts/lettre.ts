import { expedierLettres } from "../lettre/expedition";
import { lancer } from "./_lanceur";

/**
 * Envoie la Lettre aux abonnés en file, dans la limite du plafond quotidien (LETTRE_PLAFOND_JOUR, 80 par défaut),
 * et efface les demandes d'inscription jamais confirmées. Lancé toutes les 15 minutes par cron.json.
 *   npm run veille:lettre
 */
lancer("veille:lettre", async () => {
  const r = await expedierLettres();
  console.log(`${r.envoyes} message(s) envoyé(s), ${r.echecs} en échec${r.reste ? ", d'autres attendent le prochain passage" : ""}.`);
});
