import { describe, expect, it } from "vitest";
import { DONJONS_ORIGINE } from "@/content/reference";
import { DONJONS } from "@/content/monde";
import { carte } from "@/lib/cartes";
import { DONJONS_ORIGINE_EN, nomDonjonEn, pageDonjonEn } from "@/lib/anglais";
import { donneesDonjon, objetsDuDonjon } from "@/lib/donjons";

describe("donjons de l'Azeroth d'origine", () => {
  it("chaque donjon a son slug unique, distinct des nouveaux donjons de Forever", () => {
    const slugs = [...DONJONS_ORIGINE.map((d) => d.slug), ...DONJONS.map((d) => d.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("chaque donjon a ses données (npm run base:donjons) : boss, butin, entrée sur une carte du site", () => {
    for (const d of DONJONS_ORIGINE) {
      const x = donneesDonjon(d.slug);
      expect(x, d.slug).not.toBeNull();
      expect(x!.boss.length, d.slug).toBeGreaterThanOrEqual(3);
      expect(objetsDuDonjon(x!).length, d.slug).toBeGreaterThan(0);
      expect(x!.entrees.length, d.slug).toBeGreaterThan(0);
      for (const e of x!.entrees) {
        expect(carte(e.zone), `${d.slug} ${e.zone}`).toBeDefined();
        expect(e.x).toBeGreaterThanOrEqual(0); expect(e.x).toBeLessThanOrEqual(100);
        expect(e.y).toBeGreaterThanOrEqual(0); expect(e.y).toBeLessThanOrEqual(100);
      }
      for (const b of x!.boss) for (const l of b.butin) expect(l.p, `${d.slug} ${b.en}`).toBeGreaterThan(0);
    }
  });

  it("chaque donjon a un nom anglais du jeu et une page anglaise propre", () => {
    const en = DONJONS_ORIGINE.map((d) => pageDonjonEn(d.slug));
    for (const d of DONJONS_ORIGINE) {
      expect(nomDonjonEn(d.nom), d.nom).not.toBeNull();
      expect(pageDonjonEn(d.slug), d.slug).toBe(`/en/dungeons/${DONJONS_ORIGINE_EN[d.slug]}/`);
    }
    expect(new Set(en).size).toBe(en.length);
    expect(pageDonjonEn("mortemines")).toBe("/en/dungeons/deadmines/");
  });
});
