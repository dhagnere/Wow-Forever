"use server";

import { redirect } from "next/navigation";
import { inscrire } from "@/lib/lettre";
import { SITE } from "@/lib/site";

export type EtatLettre = { message: string; courriel?: string } | null;

export async function sInscrire(_etat: EtatLettre, donnees: FormData): Promise<EtatLettre> {
  // Champ piège invisible : un robot le remplit, un humain non.
  if (String(donnees.get("site_web") ?? "")) redirect("/lettre/confirmer/");
  const courriel = String(donnees.get("courriel") ?? "").slice(0, 254);
  if (donnees.get("accord") !== "oui") return { message: "Cochez la case d'accord pour recevoir la Lettre.", courriel };
  const r = await inscrire(courriel, SITE.url);
  if (!r.ok) return { message: r.message, courriel };
  redirect("/lettre/confirmer/");
}
