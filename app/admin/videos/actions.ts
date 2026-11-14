"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { TAG_VIDEOS_CHAINE } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

/** Relit tout de suite les vidéos de la chaîne : cache du flux vidé, pages des vidéos et du Carnet recalculées. */
export async function rafraichirVideos(): Promise<void> {
  await exigerAdmin();
  revalidateTag(TAG_VIDEOS_CHAINE, { expire: 0 });
  for (const page of ["/carnet/videos/", "/en/notebook/videos/", "/carnet/", "/en/notebook/"]) revalidatePath(page);
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/en/articles/[slug]", "page");
  redirect("/admin/videos/?rafraichi=1");
}
