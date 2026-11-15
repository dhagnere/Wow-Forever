import { idVideoValide, miniatureVideoYoutube } from "@/modules/veille";

export const dynamic = "force-dynamic";

/**
 * Miniature d'une vidéo de la chaîne, servie par le site : le serveur la lit chez YouTube et la renvoie, le navigateur
 * du visiteur ne contacte jamais Google. Repli des vidéos sans miniature gardée dans public/images/videos/.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (!idVideoValide(id)) return new Response("Vidéo inconnue.", { status: 404 });
  let jpg: Buffer | null = null;
  try {
    jpg = await miniatureVideoYoutube(id);
  } catch (e) {
    console.error(`[miniature] ${id} :`, e instanceof Error ? e.message : e);
  }
  if (!jpg) return new Response("Miniature indisponible.", { status: 404, headers: { "Cache-Control": "public, max-age=600" } });
  return new Response(new Uint8Array(jpg), {
    headers: {
      "Content-Type": "image/jpeg",
      // Une miniature peut être changée dans YouTube Studio : relue au plus une fois par jour.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
