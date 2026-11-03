"use server";

import { redirect } from "next/navigation";
import { inscrire } from "@/lib/lettre";
import { SITE } from "@/lib/site";

export type EtatLettre = { message: string } | null;

export async function sInscrire(_etat: EtatLettre, donnees: FormData): Promise<EtatLettre> {
  // Champ piège invisible : un robot le remplit, un humain non.
  if (String(donnees.get("site_web") ?? "")) redirect("/lettre/confirmer/");
  if (donnees.get("accord") !== "oui") return { message: "Cochez la case d'accord pour recevoir la Lettre." };
  const r = await inscrire(String(donnees.get("courriel") ?? ""), SITE.url);
  if (!r.ok) return { message: r.message };
  redirect("/lettre/confirmer/");
}
