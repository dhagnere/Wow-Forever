import { describe, expect, it } from "vitest";
import { lieu, lieuParNom, normaliserLieu, zonesDuContinent } from "@/lib/cartes";
import { DONJONS_ORIGINE, ZONES_DEPART, ZONES_NIVEAUX } from "@/content/reference";
import { ZONES } from "@/content/monde";

describe("cartes du monde", () => {
  it("relie chaque zone des guides à sa carte", () => {
    const sansCarte = ZONES_NIVEAUX.filter((z) => !lieuParNom(z.nom)).map((z) => z.nom);
    expect(sansCarte).toEqual([]);
    expect(ZONES.filter((z) => !lieuParNom(z.nom)).map((z) => z.nom)).toEqual([]);
    expect(ZONES_DEPART.filter((z) => !lieuParNom(z.zone)).map((z) => z.zone)).toEqual([]);
  });

  it("reconnaît les noms qui diffèrent du jeu", () => {
    expect(normaliserLieu("Contreforts de Hautebrande (Hillsbrad)")).toBe("contreforts-de-hautebrande");
    expect(lieuParNom("Ashenvale")).toBe("orneval");
    expect(lieuParNom("Shen'dralar")).toBe("shen-dralas");
    expect(lieuParNom("Les Pitons-du-Tonnerre")).toBe("thunder-bluff");
    expect(lieuParNom("Mont Rochenoire")).toBeUndefined();
  });

  it("rassemble les donjons, les départs et les voisines d'un lieu", () => {
    const tarides = lieu("les-tarides")!;
    expect(tarides.donjons.map((d) => d.nom)).toEqual(expect.arrayContaining(["Cavernes des Lamentations", "Kraal de Tranchebauge"]));
    expect(lieu("foret-d-elwynn")!.departs[0].races).toBe("Humains");
    expect(lieu("marche-de-l-ouest")!.voisins.length).toBeGreaterThan(0);
    expect(DONJONS_ORIGINE.filter((d) => d.zone === "Mont Rochenoire").length).toBeGreaterThan(0);
  });

  it("range les zones d'un continent par niveau", () => {
    const z = zonesDuContinent("Kalimdor");
    expect(z.length).toBeGreaterThan(15);
    const avecNiveau = z.filter((x) => x.niveau).map((x) => x.niveau!.min);
    expect([...avecNiveau].sort((a, b) => a - b)).toEqual(avecNiveau);
  });
});
