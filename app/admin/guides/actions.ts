"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { enregistrerRelecture, etapeValide, guideValide } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

/** Enregistre les cases « vérifié en jeu » et les remarques d'une zone du guide. */
export async function enregistrerZone(f: FormData): Promise<void> {
  await exigerAdmin();
  const guide = String(f.get("guide") ?? "");
  const chemin = String(f.get("chemin") ?? "");
  const zone = String(f.get("zone") ?? "").replace(/[^a-z0-9-]/g, "");
  if (!guideValide(guide) || !/^\/admin\/guides\/[a-z-]+\/[a-z-]+\/$/.test(chemin)) return;
  const etapes = String(f.get("etapes") ?? "").split(",").filter(etapeValide).slice(0, 2000);
  await enregistrerRelecture(guide, etapes.map((e) => ({
    etape: e,
    verifie: f.get(`v:${e}`) === "oui",
    remarque: String(f.get(`r:${e}`) ?? "").slice(0, 1000),
  })));
  revalidatePath(chemin);
  revalidatePath("/admin/guides/");
  redirect(`${chemin}?ok=${zone}#zone-${zone}`);
}
