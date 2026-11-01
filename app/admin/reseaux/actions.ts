"use server";

import { revalidatePath } from "next/cache";
import { supprimerJeton } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

export async function deconnecterTiktok(): Promise<void> {
  await exigerAdmin();
  await supprimerJeton("tiktok");
  revalidatePath("/admin/reseaux/");
}
