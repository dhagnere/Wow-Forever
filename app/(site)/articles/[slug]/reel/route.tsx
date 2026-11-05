import { cookies } from "next/headers";
import { COOKIE_SESSION, jetonValide, lireParSlug } from "@/modules/veille";
import { reponseImageReel } from "@/lib/imageReel";

export const dynamic = "force-dynamic";

/**
 * Image verticale du Reel (lib/imageReel.tsx). Publique pour un article en ligne ; réservée à l'administration
 * pour un brouillon. Elle sert de base à la vidéo (modules/veille/reels/video.ts).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await lireParSlug((await params).slug);
  if (!article || article.statut === "supprime") return new Response("Introuvable", { status: 404 });
  if (article.statut !== "publie" && !(await jetonValide((await cookies()).get(COOKIE_SESSION)?.value))) {
    return new Response("Introuvable", { status: 404 });
  }
  return reponseImageReel(article);
}
