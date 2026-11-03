import { afterEach, describe, expect, it, vi } from "vitest";
import { adresseDirecte, crediterEditeur, entreesGoogleNews, estGoogleNews, ressemblance, siteParNom } from "@/modules/veille/collecte/liens";
import { editeurGoogleNews } from "@/modules/veille/collecte/flux";

describe("adresses directes des liens Google News", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reconnaît les liens Google News et compare les titres", () => {
    expect(estGoogleNews("https://news.google.com/rss/articles/CBMi…")).toBe(true);
    expect(estGoogleNews("https://www.wowhead.com/news/x")).toBe(false);
    expect(ressemblance("WoW Forever : Blizzard dévoile les chiffres de la bêta", "WoW Forever : Blizzard dévoile les chiffres stratosphériques de la bêta")).toBeGreaterThanOrEqual(0.75);
    expect(ressemblance("Patch notes du 4 novembre", "Le guide du chasseur")).toBeLessThan(0.3);
  });

  it("retrouve le site d'un éditeur connu, y compris d'une recherche « site: »", () => {
    expect(siteParNom("JudgeHype")).toBe("https://judgehype.com");
    expect(siteParNom("Icy Veins")).toBe("https://icy-veins.com");
  });

  it("crédite l'éditeur réel des anciennes sources « Google News »", () => {
    const s = crediterEditeur({ nom: "Google News (français)", url: "https://news.google.com/rss/articles/x", titre: "WoW Forever: le guide des neuf classes - GeeksLands", titreFr: "WoW Forever : le guide des neuf classes - GeeksLands" });
    expect(s).toMatchObject({ nom: "GeeksLands", titre: "WoW Forever: le guide des neuf classes", titreFr: "WoW Forever : le guide des neuf classes" });
    expect(crediterEditeur({ nom: "Wowhead", url: "u", titre: "Patch - notes" }).nom).toBe("Wowhead");
  });

  it("lit le site de l'éditeur dans le XML de Google News", () => {
    const xml = `<rss><channel><item><title>Le guide des classes - GeeksLands</title><link>https://news.google.com/rss/articles/A?oc=5</link><source url="https://geekslands.fr">GeeksLands</source></item></channel></rss>`;
    expect(entreesGoogleNews(xml)).toEqual([{ titre: "Le guide des classes - GeeksLands", lien: "https://news.google.com/rss/articles/A?oc=5", editeur: "GeeksLands", site: "https://geekslands.fr" }]);
  });

  it("garde le site de l'éditeur indiqué par Google News", () => {
    const r = editeurGoogleNews("Le bilan de la bêta - Gamewave", { _: "Gamewave", $: { url: "https://www.gamewave.fr" } });
    expect(r).toEqual({ editeur: "Gamewave", site: "https://www.gamewave.fr", titre: "Le bilan de la bêta" });
  });

  it("trouve l'article dans le flux public de l'éditeur, et rien sinon", async () => {
    const flux = `<?xml version="1.0"?><rss version="2.0"><channel><title>G</title>
      <item><title>WoW Forever : Blizzard dévoile les chiffres stratosphériques de la bêta</title><link>https://www.gamewave.fr/wow/bilan-beta/</link></item>
      <item><title>Un autre sujet sans rapport</title><link>https://www.gamewave.fr/autre/</link></item>
    </channel></rss>`;
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url === "https://gamewave.fr/") return new Response('<link rel="alternate" type="application/rss+xml" href="/rss/">', { status: 200 });
      if (url === "https://gamewave.fr/rss/") return new Response(flux, { status: 200 });
      return new Response("", { status: 404 });
    }));
    const gn = "https://news.google.com/rss/articles/CBMiXYZ";
    expect(await adresseDirecte({ url: gn, titre: "WoW Forever : Blizzard dévoile les chiffres de la bêta", site: "https://www.gamewave.fr" }))
      .toBe("https://www.gamewave.fr/wow/bilan-beta/");
    expect(await adresseDirecte({ url: gn, titre: "Titre absent du flux de ce site", site: "https://www.gamewave.fr" })).toBeNull();
    expect(await adresseDirecte({ url: "https://www.wowhead.com/news/1", titre: "x" })).toBe("https://www.wowhead.com/news/1");
  });

  it("retrouve un article plus ancien que le flux par son adresse dans le plan du site, sans faux positif", async () => {
    const plan = `<urlset><url><loc>https://exemple.fr/actu/wow-forever/</loc></url>
      <url><loc>https://exemple.fr/actu/wow-forever-blizzard-devoile-les-chiffres-stratospheriques-de-la-beta/</loc></url></urlset>`;
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url === "https://exemple.fr/robots.txt") return new Response("Sitemap: https://exemple.fr/plan.xml", { status: 200 });
      if (url === "https://exemple.fr/plan.xml") return new Response(plan, { status: 200 });
      return new Response("", { status: 404 });
    }));
    const gn = "https://news.google.com/rss/articles/CBMiABC";
    expect(await adresseDirecte({ url: gn, titre: "WoW Forever : Blizzard dévoile les chiffres stratosphériques de la bêta", site: "https://exemple.fr" }))
      .toBe("https://exemple.fr/actu/wow-forever-blizzard-devoile-les-chiffres-stratospheriques-de-la-beta/");
    expect(await adresseDirecte({ url: gn, titre: "WoW Forever : tout savoir sur les nouvelles montures volantes", site: "https://exemple.fr" })).toBeNull();
  });
});
