import { describe, expect, it } from "vitest";
import { cadrer, contenir, glisser, versEcran, VUE_ENTIERE, zoomerAutour, ZOOM_MAX } from "@/components/zoomCarte";

describe("zoom des cartes du guide", () => {
  it("garde fixe le point sous le curseur", () => {
    const v = zoomerAutour(VUE_ENTIERE, 2, 0.25, 0.75);
    // Le point de la carte (25 %, 75 %) reste à 25 % et 75 % du cadre.
    const p = versEcran(v, 25, 75);
    expect(p.gauche).toBeCloseTo(25);
    expect(p.haut).toBeCloseTo(75);
    expect(v.s).toBe(2);
  });

  it("place les points selon le facteur de zoom et masque ceux hors du cadre", () => {
    const v = { s: 4, x: 40, y: 40 };
    expect(versEcran(v, 45, 50)).toEqual({ gauche: 20, haut: 40, visible: true });
    expect(versEcran(v, 10, 10).visible).toBe(false);
  });

  it("ne sort jamais de la carte et borne le zoom", () => {
    expect(contenir({ s: 2, x: 90, y: -5 })).toEqual({ s: 2, x: 50, y: 0 });
    expect(zoomerAutour({ s: 5, x: 0, y: 0 }, 10, 0.5, 0.5).s).toBe(ZOOM_MAX);
    expect(zoomerAutour(VUE_ENTIERE, 0.5, 0.5, 0.5)).toEqual(VUE_ENTIERE);
    expect(glisser({ s: 2, x: 10, y: 10 }, 0.1, 0)).toEqual({ s: 2, x: 5, y: 10 });
    expect(glisser(VUE_ENTIERE, 0.3, 0.3)).toEqual(VUE_ENTIERE);
  });

  it("cadre un groupe de points avec un peu de contexte", () => {
    const v = cadrer([[40, 40], [50, 46]]);
    expect(v.s).toBeGreaterThan(2);
    expect(v.s).toBeLessThanOrEqual(4);
    for (const [x, y] of [[40, 40], [50, 46]]) expect(versEcran(v, x, y).visible).toBe(true);
    expect(cadrer([])).toEqual(VUE_ENTIERE);
  });
});
