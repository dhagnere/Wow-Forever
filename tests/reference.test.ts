import { describe, expect, it } from "vitest";
import { DONJONS_ORIGINE, TRANCHES, ZONES_DEPART, ZONES_NIVEAUX, dansTranche } from "@/content/reference";

describe("pages de référence", () => {
  it("range chaque zone et chaque donjon dans exactement une tranche", () => {
    for (const x of [...ZONES_NIVEAUX, ...DONJONS_ORIGINE]) {
      expect(TRANCHES.filter((t) => dansTranche(x.min, t)), x.nom).toHaveLength(1);
    }
  });
  it("garde des fourchettes cohérentes, entre 1 et 60", () => {
    for (const x of [...ZONES_NIVEAUX, ...DONJONS_ORIGINE]) {
      expect(x.min >= 1 && x.max <= 60 && x.min <= x.max, x.nom).toBe(true);
    }
  });
  it("couvre toutes les races jouables, Skyborne compris", () => {
    const races = ZONES_DEPART.map((z) => z.races).join(" ");
    for (const r of ["Humains", "Nains", "Gnomes", "Elfes de la nuit", "Orcs", "Trolls", "Taurens", "Morts-vivants", "Skyborne"]) expect(races).toContain(r);
  });
  it("n'a pas de doublon", () => {
    const noms = [...ZONES_NIVEAUX.map((z) => z.nom), ...DONJONS_ORIGINE.map((d) => d.nom)];
    expect(new Set(noms).size).toBe(noms.length);
  });
});
