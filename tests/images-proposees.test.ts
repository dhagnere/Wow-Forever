import { describe, expect, it } from "vitest";
import { imageProposeeDepuisCle, proposerImages } from "@/lib/imagesProposees";
import { existsSync } from "node:fs";
import path from "node:path";

const article = (titre: string, corps = "", pilier: string | null = null, rubrique = "actualites") => ({ titre, chapo: "", corps, etiquettes: [], pilier, rubrique });

describe("images proposées pour un brouillon", () => {
  it("met en tête le donjon ou le lieu cité dans le titre", () => {
    const i = proposerImages(article("Les Mortemines revues dans WoW Forever", "Le donjon de la Marche de l'Ouest change.", null, "donjons-raids"));
    expect(i[0].cle).toBe("ecran:mortemines");
    expect(i.some((x) => x.cle === "carte:marche-de-l-ouest")).toBe(true);
  });

  it("propose toujours au moins l'illustration de la rubrique, sans doublon", () => {
    const i = proposerImages(article("Une annonce sans lieu précis"));
    expect(i.length).toBeGreaterThanOrEqual(1);
    expect(new Set(i.map((x) => x.cle)).size).toBe(i.length);
  });

  it("ne prend que des fichiers du site, crédités à Blizzard, jamais un chemin libre", () => {
    for (const x of proposerImages(article("Mage, Stratholme et Tanaris", "Durotar et Orgrimmar"))) {
      expect(existsSync(path.join(process.cwd(), "public", x.fichier)), x.fichier).toBe(true);
      expect(x.credit).toMatch(/© Blizzard Entertainment/);
      expect(x.alt.length).toBeGreaterThan(5);
    }
    expect(imageProposeeDepuisCle("ecran:../../etc/passwd")).toBeNull();
    expect(imageProposeeDepuisCle("fichier:/tmp/x.jpg")).toBeNull();
    expect(imageProposeeDepuisCle("carte:durotar")?.fichier).toBe("images/jeu/cartes/durotar-1000.jpg");
  });
});
