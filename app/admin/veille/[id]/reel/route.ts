import { after } from "next/server";
import { ErreurVideo, lireParId, lireVideoStockee, obtenirVideo } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { imageReel } from "@/lib/imageReel";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Fabrications en cours ou échouées, par article. La vidéo se fabrique après la réponse (`after`) : une requête
 * qui attendrait ffmpeg dépasserait le délai de l'hébergeur et s'arrêterait sans fichier.
 */
const enCours = new Set<number>();
const echecs = new Map<number, string>();

function echapper(t: string): string {
  return t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function page(titre: string, texte: string, recharger: boolean, id: number): Response {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${recharger ? '<meta http-equiv="refresh" content="4">' : ""}<meta name="robots" content="noindex, nofollow"><title>${echapper(titre)}</title>
<style>body{font-family:system-ui,sans-serif;background:#141312;color:#fbf1da;max-width:560px;margin:15vh auto;padding:0 16px;line-height:1.5}a{color:#e8c06a}</style></head>
<body><h1 style="font-size:1.4rem">${echapper(titre)}</h1><p>${echapper(texte)}</p><p><a href="/admin/veille/${id}/">← Retour à l'article</a></p></body></html>`;
  return new Response(html, { status: recharger ? 202 : 500, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

/**
 * Vidéo du Reel d'un article (MP4 1080 × 1920), à télécharger pour la poster à la main (Instagram, TikTok…).
 * Déjà fabriquée : envoyée tout de suite. Sinon : fabrication lancée en arrière-plan et page d'attente qui se
 * recharge toutes les 4 secondes ; le fichier part dès qu'il est prêt.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new Response("Article introuvable", { status: 404 });
  const a = await lireParId(id);
  if (!a) return new Response("Article introuvable", { status: 404 });

  const video = await lireVideoStockee(a.id);
  if (video) {
    echecs.delete(a.id);
    return new Response(new Uint8Array(video), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(video.length),
        "Content-Disposition": `attachment; filename="reel-${a.slug}.mp4"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  const echec = echecs.get(a.id);
  if (echec && !enCours.has(a.id)) {
    echecs.delete(a.id); // Le prochain clic relance la fabrication.
    return page("Vidéo impossible à fabriquer", echec, false, a.id);
  }

  if (!enCours.has(a.id)) {
    enCours.add(a.id);
    after(async () => {
      try {
        await obtenirVideo(a, { image: () => imageReel(a) });
      } catch (e) {
        echecs.set(a.id, e instanceof ErreurVideo || e instanceof Error ? e.message : String(e));
      } finally {
        enCours.delete(a.id);
      }
    });
  }
  return page("Vidéo en préparation…", "La vidéo du Reel se fabrique (une minute au plus la première fois). Le téléchargement démarre tout seul quand elle est prête : gardez cette page ouverte.", true, a.id);
}
