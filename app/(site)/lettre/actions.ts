"use server";

import { redirect } from "next/navigation";
import { inscrire } from "@/lib/lettre";
import { SITE } from "@/lib/site";

export type EtatLettre = { message: string; courriel?: string } | null;

export async function sInscrire(_etat: EtatLettre, donnees: FormData): Promise<EtatLettre> {
  // Édition anglaise (/en/newsletter/) : champ caché « langue ».
  const en = donnees.get("langue") === "en";
  const confirmer = en ? "/en/newsletter/check-your-inbox/" : "/lettre/confirmer/";
  // Champ piège invisible : un robot le remplit, un humain non.
  if (String(donnees.get("site_web") ?? "")) redirect(confirmer);
  const courriel = String(donnees.get("courriel") ?? "").slice(0, 254);
  if (donnees.get("accord") !== "oui") return { message: en ? "Tick the consent box to receive the newsletter." : "Cochez la case d'accord pour recevoir la Lettre.", courriel };
  const r = await inscrire(courriel, SITE.url, en ? "en" : "fr");
  if (!r.ok) return { message: r.message, courriel };
  redirect(confirmer);
}
