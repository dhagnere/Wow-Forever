import { listerPublies } from "@/modules/veille";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

function xml(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Flux RSS des 30 derniers articles publiés. */
export async function GET() {
  const articles = await listerPublies({ limite: 30 });
  const items = articles.map((a) => {
    const url = `${SITE.url}/articles/${a.slug}/`;
    return `<item><title>${xml(a.titre)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid>`
      + `<pubDate>${(a.publieLe ?? a.creeLe).toUTCString()}</pubDate><description>${xml(a.chapo || a.description)}</description>`
      + `<dc:creator>${SITE.auteur}</dc:creator></item>`;
  });
  const corps = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${xml(SITE.nom)}</title><link>${SITE.url}/</link><description>${xml(SITE.signature)}</description><language>fr-FR</language>
<atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
</channel></rss>`;
  return new Response(corps, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
}
