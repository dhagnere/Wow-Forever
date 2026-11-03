import "server-only";

/**
 * Inscription à la Lettre de la Taverne par Brevo, en double validation : Brevo envoie un message de confirmation,
 * l'abonné clique, puis arrive sur /lettre/merci/. Le site ne garde aucune adresse.
 *   BREVO_API_KEY      clé d'API (Brevo › SMTP & API › Clés API)
 *   BREVO_LISTE_ID     numéro de la liste des abonnés
 *   BREVO_MODELE_DOI   numéro du modèle de message de confirmation (modèle « double opt-in »)
 */

export type ResultatInscription = { ok: true } | { ok: false; message: string };

const COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i;

export function lettreConfiguree(): boolean {
  return !!(process.env.BREVO_API_KEY && process.env.BREVO_LISTE_ID && process.env.BREVO_MODELE_DOI);
}

export function adresseValide(courriel: string): boolean {
  return courriel.length <= 254 && COURRIEL.test(courriel);
}

export async function inscrire(courriel: string, siteUrl: string): Promise<ResultatInscription> {
  const adresse = courriel.trim().toLowerCase();
  if (!adresseValide(adresse)) return { ok: false, message: "Cette adresse ne semble pas valide. Vérifiez-la et réessayez." };
  if (!lettreConfiguree()) return { ok: false, message: "Les inscriptions ouvrent dans quelques jours. Revenez bientôt !" };
  const r = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: adresse,
      includeListIds: [Number(process.env.BREVO_LISTE_ID)],
      templateId: Number(process.env.BREVO_MODELE_DOI),
      redirectionUrl: `${siteUrl}/lettre/merci/`,
    }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  // 201 : message envoyé ; 204 : déjà abonné. L'adresse n'apparaît pas dans le journal.
  if (r && (r.status === 201 || r.status === 204)) return { ok: true };
  console.error(`[lettre] Brevo a répondu ${r ? r.status : "sans réponse"}.`);
  return { ok: false, message: "L'inscription n'a pas abouti. Réessayez dans quelques minutes." };
}
