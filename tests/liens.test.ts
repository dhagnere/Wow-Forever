import { describe, expect, it } from "vitest";
import { lienFrancais, nomLangue, urlTraduite } from "@/modules/veille/rendu/liens";

describe("lien vers la version française d'une source", () => {
  it("bascule les pages Blizzard sur leur version française officielle", () => {
    expect(lienFrancais("https://news.blizzard.com/en-us/article/24303862/forever", "en")).toEqual({
      url: "https://news.blizzard.com/fr-fr/article/24303862/forever",
      mode: "officiel",
    });
    expect(lienFrancais("https://news.blizzard.com/fr-fr/article/1", "fr").mode).toBe("original");
  });

  it("passe les pages étrangères par Google Traduction", () => {
    expect(urlTraduite("https://www.wowhead.com/news/forever-dungeon-123?x=1")).toBe(
      "https://www-wowhead-com.translate.goog/news/forever-dungeon-123?x=1&_x_tr_sl=auto&_x_tr_tl=fr&_x_tr_hl=fr",
    );
    expect(urlTraduite("https://mein-mmo.de/wow-forever/").startsWith("https://mein--mmo-de.translate.goog/wow-forever/?")).toBe(true);
    expect(lienFrancais("https://mein-mmo.de/wow-forever/", "de").mode).toBe("traduction");
  });

  it("laisse tels quels les pages françaises, les vidéos et les liens Google News", () => {
    expect(lienFrancais("https://www.judgehype.com/news/1", "fr").mode).toBe("original");
    expect(lienFrancais("https://www.youtube.com/watch?v=abc", "en").mode).toBe("original");
    expect(lienFrancais("https://news.google.com/rss/articles/abc", "en").mode).toBe("original");
    expect(lienFrancais("javascript:alert(1)", "en").mode).toBe("original");
  });

  it("nomme les langues en français", () => {
    expect(nomLangue("ko")).toBe("coréen");
    expect(nomLangue(undefined)).toBe("langue étrangère");
  });
});
