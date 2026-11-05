import { lirePublie, lireVideoStockee } from "@/modules/veille";

export const dynamic = "force-dynamic";

/**
 * Vidéo du Reel d'un article en ligne : adresse publique où Instagram vient la chercher. Elle est fabriquée par la
 * tâche planifiée veille:videos ou par le relais, jamais ici (ffmpeg ferait tomber le conteneur du site).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await lirePublie((await params).slug);
  if (!article) return new Response("Introuvable", { status: 404 });
  const video = await lireVideoStockee(article.id);
  if (!video) return new Response("Vidéo pas encore fabriquée", { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(new Uint8Array(video), {
    headers: { "Content-Type": "video/mp4", "Content-Length": String(video.length), "Cache-Control": "public, max-age=3600" },
  });
}
