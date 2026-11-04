import "server-only";

/**
 * Messages transactionnels (réinitialisation du mot de passe) par l'API Brevo.
 *   BREVO_API_KEY        clé d'API (la même que pour la Lettre)
 *   BREVO_EXPEDITEUR     adresse d'expédition validée dans Brevo (par exemple contact@taverne-eternelle.fr)
 * Sans ces variables, le message n'est pas envoyé et le site le dit. L'adresse du destinataire n'est pas journalisée.
 */

export function courrielConfigure(): boolean {
  return !!(process.env.BREVO_API_KEY && process.env.BREVO_EXPEDITEUR);
}

export async function envoyerCourriel(a: { courriel: string; nom: string }, sujet: string, texte: string, html: string): Promise<boolean> {
  if (!courrielConfigure()) return false;
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { email: process.env.BREVO_EXPEDITEUR, name: "La Taverne Éternelle" },
      to: [{ email: a.courriel, name: a.nom }],
      subject: sujet,
      textContent: texte,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  if (r && r.status >= 200 && r.status < 300) return true;
  console.error(`[courriel] Brevo a répondu ${r ? r.status : "sans réponse"}.`);
  return false;
}
