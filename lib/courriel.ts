import "server-only";
import { courrielConfigure, envoyerCourriel as envoyer } from "@/modules/veille";

/**
 * Messages transactionnels (réinitialisation du mot de passe), envoyés par Resend (voir LETTRE.md) :
 *   RESEND_API_KEY, COURRIEL_EXPEDITEUR (et COURRIEL_REPONSE, facultatif).
 * Sans ces variables, le message n'est pas envoyé et le site le dit. L'adresse du destinataire n'est pas journalisée.
 */

export { courrielConfigure };

export async function envoyerCourriel(a: { courriel: string; nom: string }, sujet: string, texte: string, html: string): Promise<boolean> {
  return envoyer({ a: a.courriel, sujet, texte, html });
}
