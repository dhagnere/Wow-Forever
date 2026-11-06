/**
 * Envoi des courriels du site par l'API de Resend (resend.com) : confirmations d'inscription à la Lettre, Lettre elle-même,
 * messages « mot de passe oublié ».
 *   RESEND_API_KEY        clé d'API (Resend › API Keys), droit « Sending access » suffisant
 *   COURRIEL_EXPEDITEUR   adresse d'un domaine vérifié chez Resend (ex. lettre@taverne-eternelle.fr)
 *   COURRIEL_REPONSE      facultatif : adresse où arrivent les réponses (ex. contact@taverne-eternelle.fr)
 * Sans les deux premières, rien n'est envoyé et le site le dit. Ni la clé ni l'adresse du destinataire ne sont journalisées.
 */

const API = "https://api.resend.com";
const NOM_EXPEDITEUR = "La Taverne Éternelle";
/** Nombre de messages par appel à l'envoi groupé de Resend (100 au plus). */
export const TAILLE_LOT = 50;

export interface Courriel {
  a: string;
  sujet: string;
  texte: string;
  html: string;
  /** En-têtes supplémentaires (désinscription en un clic de la Lettre). */
  entetes?: Record<string, string>;
}

export function courrielConfigure(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.COURRIEL_EXPEDITEUR);
}

function corps(c: Courriel): Record<string, unknown> {
  return {
    from: `${NOM_EXPEDITEUR} <${process.env.COURRIEL_EXPEDITEUR}>`,
    to: [c.a],
    subject: c.sujet,
    text: c.texte,
    html: c.html,
    ...(process.env.COURRIEL_REPONSE ? { reply_to: process.env.COURRIEL_REPONSE } : {}),
    ...(c.entetes ? { headers: c.entetes } : {}),
  };
}

async function appeler(chemin: string, charge: unknown): Promise<Response | null> {
  return fetch(`${API}${chemin}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(charge),
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
}

/** Envoie un message. Renvoie false si l'envoi n'est pas configuré ou a échoué (le code de Resend part au journal). */
export async function envoyerCourriel(c: Courriel): Promise<boolean> {
  if (!courrielConfigure()) return false;
  const r = await appeler("/emails", corps(c));
  if (r && r.ok) return true;
  console.error(`[courriel] Resend a répondu ${r ? r.status : "sans réponse"}.`);
  return false;
}

/** Envoie jusqu'à TAILLE_LOT messages en un seul appel. Tout le lot réussit ou échoue ensemble. */
export async function envoyerLot(lot: Courriel[]): Promise<boolean> {
  if (!courrielConfigure() || !lot.length) return false;
  if (lot.length > TAILLE_LOT) throw new Error(`Lot de ${lot.length} messages : ${TAILLE_LOT} au plus.`);
  const r = await appeler("/emails/batch", lot.map(corps));
  if (r && r.ok) return true;
  console.error(`[courriel] Resend (envoi groupé) a répondu ${r ? r.status : "sans réponse"}.`);
  return false;
}
