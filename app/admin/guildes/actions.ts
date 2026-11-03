"use server";

import { revalidatePath } from "next/cache";
import { deciderGuilde } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

export async function decider(form: FormData): Promise<void> {
  await exigerAdmin();
  const id = Number(form.get("id"));
  const decision = String(form.get("decision"));
  if (!Number.isInteger(id) || !["publier", "refuser", "supprimer"].includes(decision)) return;
  await deciderGuilde(id, decision as "publier" | "refuser" | "supprimer");
  revalidatePath("/admin/guildes/");
  revalidatePath("/guildes/");
}
