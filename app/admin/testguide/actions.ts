"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { enregistrerRelecture } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { cleGuide, raceGuide } from "@/lib/guide";
import { trouverClasse } from "@/content/classes";
import { VIDEOS_ANALYSEES } from "@/content/analyses-videos";

/**
 * Applique au guide le bloc de remarques d'une vidéo analysée (même chemin que « Importer des remarques » de la
 * relecture : enregistrerRelecture). Les remarques restent en admin, jamais sur le site public.
 */
export async function appliquerRemarques(f: FormData): Promise<void> {
  await exigerAdmin();
  const id = String(f.get("video") ?? "");
  const v = VIDEOS_ANALYSEES.find((x) => x.id === id);
  const race = v ? raceGuide(v.race) : undefined;
  const classe = v && v.classe ? trouverClasse(v.classe) : undefined;
  if (!v || !race || !classe || v.statut !== "traitee" || !v.remarques.length) return;
  await enregistrerRelecture(cleGuide(race, classe.slug), v.remarques);
  revalidatePath("/admin/testguide/");
  revalidatePath("/admin/guides/");
  redirect(`/admin/testguide/?ok=${encodeURIComponent(v.id)}`);
}
