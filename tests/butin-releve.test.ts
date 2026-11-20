import { describe, expect, it } from "vitest";
import { lireReleveButin } from "@/modules/veille";

const TEXTE = [
  "TTB1", "v|1.2.0", "s|1795000000-123456",
  "c|11502|409|Cœur du Magma|Ragnaros|4",
  "o|11502|17204|1|5|Œil de Sulfuras", "o|11502|18814|2|4|Collier du Seigneur du feu",
  "c|g179703|409|Cœur du Magma||3", "o|g179703|16800|1|4|Bracelets d'arcaniste",
  "c|11671|409|Cœur du Magma||12",
  "fin|3",
].join("\n");

describe("relevé du butin de TaverneTrace (format TTB1)", () => {
  it("lit les créatures, les coffres et leurs objets", () => {
    const r = lireReleveButin(TEXTE);
    expect(r.serie).toBe("1795000000-123456");
    expect(r.creatures.map((c) => c.cle)).toEqual(["11502", "g179703", "11671"]);
    expect(r.creatures[0]).toMatchObject({ carte: 409, nom: "Ragnaros", victoires: 4 });
    expect(r.creatures[0].objets[1]).toEqual({ id: 18814, vus: 2, qualite: 4, nom: "Collier du Seigneur du feu" });
    expect(r.creatures[2].objets).toEqual([]);
  });

  it("accepte les fins de ligne Windows et les espaces autour", () => {
    expect(lireReleveButin(`  ${TEXTE.replace(/\n/g, "\r\n")}\r\n`).creatures).toHaveLength(3);
  });

  it("refuse un texte coupé, un autre code ou des chiffres impossibles", () => {
    expect(() => lireReleveButin(TEXTE.replace("fin|3", ""))).toThrow(/incomplet/);
    expect(() => lireReleveButin(TEXTE.replace("fin|3", "fin|4"))).toThrow(/3 créatures lues sur 4/);
    expect(() => lireReleveButin("EP1:abc")).toThrow(/TTB1/);
    expect(() => lireReleveButin(TEXTE.replace("o|11502|18814|2|", "o|11502|18814|9|"))).toThrow(/plus souvent/);
    expect(() => lireReleveButin(TEXTE.replace("c|11671|", "c|abc|"))).toThrow(/créature illisible/);
    expect(() => lireReleveButin(TEXTE.replace("s|1795000000-123456", "s|"))).toThrow(/Série/);
    expect(() => lireReleveButin(TEXTE.replace("o|g179703|", "o|999|"))).toThrow(/créature inconnue/);
  });
});
