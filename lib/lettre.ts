import "server-only";
import { courrielConfigure, desabonnerAdresse, inscrireALaLettre, normaliserCourriel, type LangueLettre } from "@/modules/veille";
import { SITE } from "@/lib/site";

/**
 * Inscription à la Lettre en double validation, gérée par le site : l'adresse attend en base, un lien de confirmation part
 * par Resend, et l'abonné n'est inscrit qu'après son clic. Réglages : RESEND_API_KEY et COURRIEL_EXPEDITEUR (LETTRE.md).
 * Éditions française et anglaise : chaque abonné reçoit la Lettre dans la langue de la page où il s'est inscrit.
 */

export type { LangueLettre };
export type ResultatInscription = { ok: true } | { ok: false; message: string };

const COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i;

export function lettreConfiguree(): boolean {
  return courrielConfigure();
}

const MESSAGES = {
  fr: {
    invalide: "Cette adresse ne semble pas valide. Vérifiez-la et réessayez.",
    bientot: "Les inscriptions ouvrent dans quelques jours. Revenez bientôt !",
    sature: "Beaucoup d'inscriptions en ce moment : réessayez dans une heure.",
    echec: "L'inscription n'a pas abouti. Réessayez dans quelques minutes.",
  },
  en: {
    invalide: "This email address does not look valid. Please check it and try again.",
    bientot: "Sign-ups open in a few days. Come back soon!",
    sature: "Lots of sign-ups right now: please try again in an hour.",
    echec: "The sign-up did not go through. Please try again in a few minutes.",
  },
} as const;

export function adresseValide(courriel: string): boolean {
  return courriel.length <= 254 && COURRIEL.test(courriel);
}

export async function inscrire(courriel: string, langue: LangueLettre = "fr"): Promise<ResultatInscription> {
  const m = MESSAGES[langue];
  const adresse = normaliserCourriel(courriel);
  if (!adresseValide(adresse)) return { ok: false, message: m.invalide };
  const r = await inscrireALaLettre(adresse, langue, SITE.url);
  if (r.ok) return r;
  return { ok: false, message: r.raison === "configuration" ? m.bientot : r.raison === "sature" ? m.sature : m.echec };
}

/** Retire l'adresse de la Lettre (choix fait depuis le compte joueur), dans les deux langues. */
export async function desinscrire(courriel: string): Promise<void> {
  await desabonnerAdresse(normaliserCourriel(courriel));
}
