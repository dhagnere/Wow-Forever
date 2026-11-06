"use server";

import { redirect } from "next/navigation";
import { inscrire } from "@/lib/lettre";
import { confirmerAbonnement, desinscrireParLien, PAGES_LETTRE } from "@/modules/veille";

export type EtatLettre = { message: string; courriel?: string } | null;

export async function sInscrire(_etat: EtatLettre, donnees: FormData): Promise<EtatLettre> {
  // Édition anglaise (/en/newsletter/) : champ caché « langue ».
  const en = donnees.get("langue") === "en";
  const confirmer = en ? "/en/newsletter/check-your-inbox/" : "/lettre/confirmer/";
  // Champ piège invisible : un robot le remplit, un humain non.
  if (String(donnees.get("site_web") ?? "")) redirect(confirmer);
  const courriel = String(donnees.get("courriel") ?? "").slice(0, 254);
  if (donnees.get("accord") !== "oui") return { message: en ? "Tick the consent box to receive the newsletter." : "Cochez la case d'accord pour recevoir la Lettre.", courriel };
  const r = await inscrire(courriel, en ? "en" : "fr");
  if (!r.ok) return { message: r.message, courriel };
  redirect(confirmer);
}

/** Clic sur « Confirmer mon inscription » (lien reçu par courriel). Un bouton plutôt qu'une simple visite du lien :
 *  les robots des messageries qui ouvrent les liens ne peuvent pas inscrire quelqu'un à sa place. */
export async function confirmerLettre(donnees: FormData): Promise<void> {
  const en = donnees.get("langue") === "en";
  const langue = await confirmerAbonnement(String(donnees.get("jeton") ?? "").slice(0, 100));
  if (!langue) redirect(en ? "/en/newsletter/confirm/?invalide=1" : "/lettre/confirmation/?invalide=1");
  redirect(PAGES_LETTRE[langue].merci);
}

/** Clic sur « Me désinscrire » (lien en bas de chaque Lettre). */
export async function seDesinscrire(donnees: FormData): Promise<void> {
  const en = donnees.get("langue") === "en";
  const ok = await desinscrireParLien(Number(donnees.get("a")), String(donnees.get("s") ?? "").slice(0, 100));
  const page = en ? "/en/newsletter/unsubscribe/" : "/lettre/desinscription/";
  redirect(`${page}?${ok ? "fait" : "invalide"}=1`);
}
