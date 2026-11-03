import { describe, expect, it } from "vitest";
import { combinaisons, guidePour, raceGuide, cleGuide, libelleGuide, BITS_CLASSES } from "@/lib/guide";
import { routeDesHubs } from "@/components/GuideParcours";
import { carte } from "@/lib/cartes";
import { cleGuideValide } from "@/modules/veille/joueurs/validation";

describe("guide de 1 à 60", () => {
  it("propose chaque combinaison race et classe jouable, avec une clé de sauvegarde valide", () => {
    const c = combinaisons();
    expect(c.length).toBeGreaterThanOrEqual(30);
    expect(c.some((x) => x.race.slug === "humain" && x.classe.slug === "mage")).toBe(true);
    expect(c.some((x) => x.race.slug === "tauren" && x.classe.slug === "mage")).toBe(false);
    for (const x of c) {
      expect(cleGuideValide(cleGuide(x.race, x.classe.slug))).toBe(true);
      expect(libelleGuide(cleGuide(x.race, x.classe.slug)).lien).toBe(`/guides/parcours/${x.race.slug}/${x.classe.slug}/`);
    }
  });

  it("part de la zone de la race, reste sur son continent avant 30 et garde les seules quêtes de sa classe", () => {
    const humain = raceGuide("humain")!;
    const zones = guidePour(humain, "mage");
    expect(zones[0].lieu).toBe("foret-d-elwynn");
    const lieux = zones.map((z) => z.lieu);
    expect(lieux).not.toContain("dun-morogh");
    expect(lieux).not.toContain("teldrassil");
    for (const z of zones) {
      if (z.niveaux[1] < 30) expect(carte(z.lieu)?.continent).toBe(carte("foret-d-elwynn")?.continent);
      for (const e of z.etapes) {
        expect(!e.cl || (e.cl & BITS_CLASSES.mage) !== 0).toBe(true);
        expect(!e.ra || (e.ra & humain.bit) !== 0).toBe(true);
      }
    }
    expect(zones.at(-1)!.niveaux[1]).toBe(60);
    // La lettre de classe du mage humain est là, pas celle du guerrier.
    const premieres = zones[0].etapes.map((e) => e.t);
    expect(premieres).toContain("La lettre glyphée");
    expect(premieres).not.toContain("Une lettre simple");
  });

  it("place chaque PNJ sur la carte et range une suite après sa quête préalable", () => {
    for (const r of ["humain", "orc", "mort-vivant"]) {
      for (const z of guidePour(raceGuide(r)!, "guerrier")) {
        for (const h of z.hubs) {
          expect(h.x).toBeGreaterThanOrEqual(0);
          expect(h.x).toBeLessThanOrEqual(100);
          expect(h.y).toBeGreaterThanOrEqual(0);
          expect(h.y).toBeLessThanOrEqual(100);
        }
        const rang = new Map(z.etapes.map((e, i) => [e.id, i]));
        for (const e of z.etapes) if (e.av && rang.has(e.av)) expect(rang.get(e.av)!).toBeLessThan(rang.get(e.id)!);
      }
    }
  });

  it("trace la route sans repasser deux fois de suite au même point", () => {
    expect(routeDesHubs([{ g: 0, r: 0 }, { g: 0, r: 1 }, { g: -1, r: 2 }, { g: 2, r: 2 }, { g: 0, r: 0 }])).toEqual([0, 1, 2, 0]);
  });
});
