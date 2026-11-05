import { lirePublie, lireVideoStockee, obtenirVideo } from "@/modules/veille";
import { imageReel } from "@/lib/imageReel";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Vidéo du Reel d'un article en ligne : adresse publique où Instagram vient la chercher. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await lirePublie((await params).slug);
  if (!article) return new Response("Introuvable", { status: 404 });
  const video = (await lireVideoStockee(article.id)) ?? (await obtenirVideo(article, { image: () => imageReel(article) }));
  return new Response(new Uint8Array(video), {
    headers: { "Content-Type": "video/mp4", "Content-Length": String(video.length), "Cache-Control": "public, max-age=3600" },
  });
}
