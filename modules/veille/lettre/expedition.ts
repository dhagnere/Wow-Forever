import { config } from "../config";
import { courrielConfigure, envoyerCourriel, envoyerLot, TAILLE_LOT } from "../courriel/resend";
import {
  cloreEnvois, confirmerAbonnement, courrielAbonne, demanderAbonnement, desabonnerAdresse, envoyesAujourdhui, messagesEnFile, noterEnvois,
  oublierDemande, purgerDemandes, supprimerAbonne,
} from "./depot";
import { messageConfirmation, messageLettre, plafondJour, resteDuJour, signatureValide, type LangueLettre } from "./messages";

export type ResultatInscription = { ok: true } | { ok: false; raison: "configuration" | "sature" | "envoi" };

/**
 * Demande d'inscription : enregistre l'adresse en attente et envoie le lien de confirmation. Une adresse déjà abonnée,
 * ou qui vient de recevoir un lien, obtient la même réponse qu'une nouvelle : on ne dit pas qui est inscrit.
 */
export async function inscrireALaLettre(courriel: string, langue: LangueLettre, site = config.siteUrl()): Promise<ResultatInscription> {
  if (!courrielConfigure()) return { ok: false, raison: "configuration" };
  const d = await demanderAbonnement(courriel, langue);
  if (d.etat === "sature") return { ok: false, raison: "sature" };
  if (d.etat !== "envoyer") return { ok: true };
  if (await envoyerCourriel(messageConfirmation(site, langue, courriel, d.jeton))) return { ok: true };
  await oublierDemande(courriel);
  return { ok: false, raison: "envoi" };
}

export { confirmerAbonnement, desabonnerAdresse };

/** Désinscription par un lien signé (page ou en-tête « List-Unsubscribe »). Renvoie false si le lien n'est pas valable. */
export async function desinscrireParLien(id: number, signature: string): Promise<boolean> {
  const courriel = await courrielAbonne(id);
  if (!courriel || !signature || !signatureValide(id, courriel, signature)) return false;
  await supprimerAbonne(id);
  return true;
}

/** Envoie un numéro à une seule adresse, pour relecture avant le lancement. */
export async function envoyerEssai(envoi: { langue: LangueLettre; sujet: string; corps: string }, courriel: string, site = config.siteUrl()): Promise<boolean> {
  // Lien de désinscription factice : l'adresse d'essai n'est pas forcément abonnée.
  const m = messageLettre(site, envoi, { id: 0, courriel });
  return envoyerCourriel({ ...m, sujet: `[Essai] ${m.sujet}` });
}

/**
 * Envoie les numéros en file, par lots, dans la limite du plafond quotidien (LETTRE_PLAFOND_JOUR, 80 par défaut, sous
 * les 100 messages par jour du niveau gratuit de Resend, pour laisser la place aux confirmations et aux mots de passe).
 */
export async function expedierLettres(site = config.siteUrl()): Promise<{ envoyes: number; echecs: number; reste: number }> {
  await purgerDemandes();
  if (!courrielConfigure()) return { envoyes: 0, echecs: 0, reste: 0 };
  let permis = resteDuJour(plafondJour(), await envoyesAujourdhui());
  let envoyes = 0;
  let echecs = 0;
  while (permis > 0) {
    const lot = await messagesEnFile(Math.min(TAILLE_LOT, permis));
    if (!lot.length) break;
    const ok = await envoyerLot(lot.map((m) => messageLettre(site, m, { id: m.abonneId, courriel: m.courriel })));
    await noterEnvois(lot, ok);
    if (!ok) {
      echecs += lot.length;
      break;
    }
    envoyes += lot.length;
    permis -= lot.length;
  }
  await cloreEnvois();
  const reste = (await messagesEnFile(1)).length;
  return { envoyes, echecs, reste };
}
