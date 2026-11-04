import "server-only";

/**
 * Inscription à la Lettre de la Taverne par Brevo, en double validation : Brevo envoie un message de confirmation,
 * l'abonné clique, puis arrive sur /lettre/merci/. Le site ne garde aucune adresse.
 *   BREVO_API_KEY      clé d'API (Brevo › SMTP & API › Clés API)
 *   BREVO_LISTE_ID     numéro de la liste des abonnés
 *   BREVO_MODELE_DOI   numéro du modèle de message de confirmation (modèle « double opt-in »)
 * Édition anglaise (/en/newsletter/) : sa propre liste et son modèle de confirmation en anglais,
 *   BREVO_LISTE_ID_EN et BREVO_MODELE_DOI_EN ; à défaut, la liste et le modèle français servent.
 */

export type ResultatInscription = { ok: true } | { ok: false; message: string };

const COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i;

export type LangueLettre = "fr" | "en";

export function lettreConfiguree(): boolean {
  return !!(process.env.BREVO_API_KEY && process.env.BREVO_LISTE_ID && process.env.BREVO_MODELE_DOI);
}

/** L'édition anglaise a-t-elle sa liste et son modèle de confirmation en anglais ? */
export function lettreAnglaiseConfiguree(): boolean {
  return lettreConfiguree() && !!(process.env.BREVO_LISTE_ID_EN && process.env.BREVO_MODELE_DOI_EN);
}

function reglages(langue: LangueLettre): { liste: number; modele: number; merci: string } {
  if (langue === "en" && lettreAnglaiseConfiguree()) {
    return { liste: Number(process.env.BREVO_LISTE_ID_EN), modele: Number(process.env.BREVO_MODELE_DOI_EN), merci: "/en/newsletter/thanks/" };
  }
  return { liste: Number(process.env.BREVO_LISTE_ID), modele: Number(process.env.BREVO_MODELE_DOI), merci: langue === "en" ? "/en/newsletter/thanks/" : "/lettre/merci/" };
}

const MESSAGES = {
  fr: { invalide: "Cette adresse ne semble pas valide. Vérifiez-la et réessayez.", bientot: "Les inscriptions ouvrent dans quelques jours. Revenez bientôt !", echec: "L'inscription n'a pas abouti. Réessayez dans quelques minutes." },
  en: { invalide: "This email address does not look valid. Please check it and try again.", bientot: "Sign-ups open in a few days. Come back soon!", echec: "The sign-up did not go through. Please try again in a few minutes." },
} as const;

export function adresseValide(courriel: string): boolean {
  return courriel.length <= 254 && COURRIEL.test(courriel);
}

export async function inscrire(courriel: string, siteUrl: string, langue: LangueLettre = "fr"): Promise<ResultatInscription> {
  const m = MESSAGES[langue];
  const adresse = courriel.trim().toLowerCase();
  if (!adresseValide(adresse)) return { ok: false, message: m.invalide };
  if (!lettreConfiguree()) return { ok: false, message: m.bientot };
  const r0 = reglages(langue);
  const r = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: adresse,
      includeListIds: [r0.liste],
      templateId: r0.modele,
      redirectionUrl: `${siteUrl}${r0.merci}`,
    }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  // 201 : message envoyé ; 204 : déjà abonné. L'adresse n'apparaît pas dans le journal.
  if (r && (r.status === 201 || r.status === 204)) return { ok: true };
  console.error(`[lettre] Brevo a répondu ${r ? r.status : "sans réponse"}.`);
  return { ok: false, message: m.echec };
}

/** Retire l'adresse de la liste des abonnés (choix fait depuis le compte joueur). Sans effet si la Lettre n'est pas configurée. */
export async function desinscrire(courriel: string): Promise<boolean> {
  if (!lettreConfiguree()) return false;
  // L'abonné quitte les deux éditions, française et anglaise.
  const listes = [...new Set([Number(process.env.BREVO_LISTE_ID), Number(process.env.BREVO_LISTE_ID_EN) || 0].filter(Boolean))];
  let ok = true;
  for (const liste of listes) {
    const r = await fetch(`https://api.brevo.com/v3/contacts/lists/${liste}/contacts/remove`, {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ emails: [courriel.trim().toLowerCase()] }),
      signal: AbortSignal.timeout(15_000),
    }).catch(() => null);
    // 201 : retiré ; 400 : l'adresse n'était pas dans la liste.
    ok &&= !!r && (r.status === 201 || r.status === 400);
  }
  return ok;
}
