import { ErreurVideo, lireParId, videoReel } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Vidéo du Reel d'un article (MP4 1080 × 1920), à télécharger pour la poster à la main (Instagram, TikTok…). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const a = await lireParId(Number((await params).id));
  if (!a) return new Response("Article introuvable", { status: 404 });
  try {
    const origine = new URL(req.url).origin;
    const video = await videoReel(`${origine}/articles/${a.slug}/reel/`, req.headers.get("cookie") ?? undefined);
    return new Response(new Uint8Array(video), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="reel-${a.slug}.mp4"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    if (e instanceof ErreurVideo) return new Response(`Vidéo impossible à fabriquer : ${e.message}`, { status: 500 });
    throw e;
  }
}
