import { demanderVideo, etatVideo, lireParId, lireVideoStockee } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

function echapper(t: string): string {
  return t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function page(id: number, titre: string, paragraphes: string[], opts: { recharger?: boolean; reessayer?: boolean } = {}): Response {
  const adresse = `/admin/veille/${id}/reel/`;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${opts.recharger ? `<meta http-equiv="refresh" content="30;url=${adresse}">` : ""}<meta name="robots" content="noindex, nofollow"><title>${echapper(titre)}</title>
<style>body{font-family:system-ui,sans-serif;background:#141312;color:#fbf1da;max-width:560px;margin:15vh auto;padding:0 16px;line-height:1.5}a{color:#e8c06a}</style></head>
<body><h1 style="font-size:1.4rem">${echapper(titre)}</h1>${paragraphes.map((p) => `<p>${echapper(p)}</p>`).join("")}
${opts.reessayer ? `<p><a href="${adresse}?relancer=1">Relancer la fabrication</a></p>` : ""}<p><a href="/admin/veille/${id}/">← Retour à l'article</a></p></body></html>`;
  return new Response(html, { status: opts.recharger ? 202 : 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

/**
 * Vidéo du Reel d'un article (MP4 1080 × 1920), à télécharger pour la poster à la main (Instagram, TikTok…).
 * Prête : envoyée tout de suite. Sinon : demande déposée pour la tâche planifiée veille:videos, qui la fabrique dans
 * son propre conteneur (ffmpeg ferait tomber celui du site) ; la page d'attente revérifie toutes les 30 secondes.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new Response("Article introuvable", { status: 404 });
  const a = await lireParId(id);
  if (!a) return new Response("Article introuvable", { status: 404 });

  const video = await lireVideoStockee(a.id);
  if (video) {
    return new Response(new Uint8Array(video), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(video.length),
        "Content-Disposition": `attachment; filename="reel-${a.slug}.mp4"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  const etat = await etatVideo(a.id);
  const relancer = new URL(req.url).searchParams.has("relancer");
  if (etat.erreur && !relancer) {
    return page(a.id, "Vidéo impossible à fabriquer", [etat.erreur], { reessayer: true });
  }
  if (!etat.demandeLe || relancer) await demanderVideo(a.id);
  return page(a.id, "Vidéo en préparation…", [
    "La vidéo se fabrique en arrière-plan, par une tâche qui passe toutes les dix minutes : comptez dix à quinze minutes au plus.",
    "Vous pouvez garder cette page ouverte (elle revérifie toutes les 30 secondes et le téléchargement démarre tout seul) ou revenir plus tard : la demande est enregistrée.",
  ], { recharger: true });
}
