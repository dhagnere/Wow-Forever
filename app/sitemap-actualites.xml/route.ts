import { listerPublies } from "@/modules/veille";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const xml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plan « actualités » pour Google News : les articles publiés depuis moins de 48 heures. */
export async function GET() {
  const limite = Date.now() - 48 * 3_600_000;
  const articles = (await listerPublies({ limite: 100 })).filter((a) => a.publieLe && a.publieLe.getTime() >= limite);
  const corps = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles.map((a) => `<url><loc>${SITE.url}/articles/${a.slug}/</loc><news:news><news:publication><news:name>${xml(SITE.nom)}</news:name><news:language>fr</news:language></news:publication><news:publication_date>${a.publieLe!.toISOString()}</news:publication_date><news:title>${xml(a.titre)}</news:title></news:news></url>`).join("\n")}
</urlset>`;
  return new Response(corps, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
}
