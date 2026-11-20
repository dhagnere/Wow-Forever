import { describe, expect, it } from "vitest";
import { DONJONS_ORIGINE, FICHES_ORIGINE, RAIDS, RAIDS_ORIGINE } from "@/content/reference";
import { DONJONS } from "@/content/monde";
import { carte } from "@/lib/cartes";
import { DONJONS_ORIGINE_EN, nomDonjonEn, pageDonjonEn } from "@/lib/anglais";
import { donneesDonjon, objetOrigine, objetsDuDonjon } from "@/lib/donjons";

describe("donjons de l'Azeroth d'origine", () => {
  it("chaque donjon a son slug unique, distinct des nouveaux donjons de Forever", () => {
    const slugs = [...FICHES_ORIGINE.map((d) => d.slug), ...DONJONS.map((d) => d.slug)];
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
    const en = FICHES_ORIGINE.map((d) => pageDonjonEn(d.slug));
    for (const d of FICHES_ORIGINE) {
      expect(nomDonjonEn(d.nom), d.nom).not.toBeNull();
      expect(pageDonjonEn(d.slug), d.slug).toBe(`/en/dungeons/${DONJONS_ORIGINE_EN[d.slug]}/`);
    }
    expect(new Set(en).size).toBe(en.length);
    expect(pageDonjonEn("mortemines")).toBe("/en/dungeons/deadmines/");
  });

  it("chaque raid de l'Azeroth d'origine a sa fiche : boss, butin, lien depuis le tableau des raids", () => {
    for (const r of RAIDS_ORIGINE) {
      const x = donneesDonjon(r.slug);
      expect(x, r.slug).not.toBeNull();
      expect(x!.boss.length, r.slug).toBeGreaterThanOrEqual(1);
      expect(new Set(x!.boss.map((b) => b.id)).size, `${r.slug} : boss en double`).toBe(x!.boss.length);
      expect(objetsDuDonjon(x!).length, r.slug).toBeGreaterThan(0);
      expect(RAIDS.some((t) => t.slug === r.slug), r.slug).toBe(true);
    }
    expect(donneesDonjon("coeur-du-magma")!.boss.at(-1)!.en).toBe("Ragnaros");
    expect(donneesDonjon("repaire-de-l-aile-noire")!.boss.at(-1)!.en).toBe("Nefarian");
  });

  it("chaque objet du butin a un nom d'origine, pour les objets que Forever ne décrit pas", () => {
    for (const d of FICHES_ORIGINE) {
      for (const i of objetsDuDonjon(donneesDonjon(d.slug)!)) {
        const o = objetOrigine(i);
        expect(o, `${d.slug} ${i}`).not.toBeNull();
        expect(o!.n.length, `${d.slug} ${i}`).toBeGreaterThan(0);
      }
    }
    expect(objetOrigine(5191)?.n).toBe("Barbelure cruelle");
  });
});
