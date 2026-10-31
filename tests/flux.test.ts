import { afterEach, describe, expect, it, vi } from "vitest";
import { lireFlux } from "@/modules/veille/collecte/flux";
import { classer } from "@/modules/veille/collecte/tri";

const XML = `<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>
<item><title>WoW Forever: Hall of Thanes dungeon datamined</title><link>https://example.org/a?utm_source=rss</link><pubDate>Sat, 31 Oct 2026 10:00:00 GMT</pubDate><description>&lt;p&gt;New &lt;b&gt;dungeon&lt;/b&gt; for World of Warcraft Forever&lt;/p&gt;&lt;script&gt;x()&lt;/script&gt;</description></item>
<item><title>Unrelated cooking news</title><link>https://example.org/b</link><pubDate>Sat, 31 Oct 2026 10:00:00 GMT</pubDate></item>
<item><title>Sans date</title><link>https://example.org/c</link></item>
</channel></rss>`;

const source = { id: "test", nom: "Test", url: "https://example.org/rss", langue: "en" as const, poids: 2, filtrer: true };

afterEach(() => vi.unstubAllGlobals());

describe("lecture des flux", () => {
  it("analyse un flux RSS, nettoie les résumés et écarte les éléments sans date", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(XML, { status: 200 })));
    const r = await lireFlux(source);
    expect(r.erreur).toBeUndefined();
    expect(r.elements).toHaveLength(2);
    expect(r.elements[0].resume).toBe("New dungeon for World of Warcraft Forever");
    const sujets = classer(r.elements, new Date("2026-10-31T12:00:00Z"), 36);
    expect(sujets.map((s) => s.cle)).toEqual(["example.org/a"]);
  });

  it("signale une source en panne sans faire échouer le passage", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("fetch failed", { cause: new Error("ECONNRESET") }); }));
    const r = await lireFlux(source);
    expect(r.elements).toEqual([]);
    expect(r.erreur).toBe("fetch failed (ECONNRESET)");
  });

  it("signale une réponse HTTP en erreur", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("non", { status: 404 })));
    expect((await lireFlux(source)).erreur).toBe("HTTP 404");
  });
});
