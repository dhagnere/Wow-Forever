import { describe, expect, it } from "vitest";
import { titreAffichable } from "@/lib/miniatureVideo";

describe("titreAffichable", () => {
  it("retire un marqueur de gabarit resté dans le titre YouTube", () => {
    expect(titreAffichable("[TITRE :Journal de Jobwow TheSham … ]")).toBe("Journal de Jobwow TheSham");
    expect(titreAffichable("[TITRE : Journal de Jobwow · 17 novembre – partie 3 ]")).toBe("Journal de Jobwow · 17 novembre – partie 3");
  });
  it("laisse un titre normal intact", () => {
    expect(titreAffichable("Journal de Jobwow · 13 novembre – partie 1 · Clairières de Tirisfal")).toBe("Journal de Jobwow · 13 novembre – partie 1 · Clairières de Tirisfal");
  });
});
