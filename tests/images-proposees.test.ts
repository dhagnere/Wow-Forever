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

describe("légende de l'image d'en-tête", () => {
  it("garde une phrase propre, sans crochets ni guillemets d'encadrement", async () => {
    const { nettoyerLegende } = await import("@/modules/veille");
    expect(nettoyerLegende("« Les Mortemines [à vérifier] : Van Cleef range sa cave. »")).toBe("Les Mortemines à vérifier : Van Cleef range sa cave.");
    expect(nettoyerLegende("x".repeat(400)).length).toBeLessThanOrEqual(160);
  });

  it("ne change pas l'empreinte des traductions faites avant la légende", async () => {
    const { empreinteTraduction } = await import("@/modules/veille");
    const a = { titre: "T", chapo: "C", corps: "Corps", avisSilfax: "Avis", description: "D", etiquettes: [] };
    expect(empreinteTraduction({ ...a, image: { id: 1, alt: "a", credit: "c", legende: "" } })).toBe(empreinteTraduction(a));
    expect(empreinteTraduction({ ...a, image: { id: 1, alt: "a", credit: "c", legende: "Une légende" } })).not.toBe(empreinteTraduction(a));
  });
});

describe("galerie de l'éditeur", () => {
  it("propose toutes les illustrations du site, chacune retrouvable par sa clé", async () => {
    const { toutesLesImages, imageProposeeDepuisCle } = await import("@/lib/imagesProposees");
    const toutes = toutesLesImages();
    expect(toutes.length).toBeGreaterThan(50);
    expect(new Set(toutes.map((i) => i.cle)).size).toBe(toutes.length);
    for (const i of toutes) {
      expect(imageProposeeDepuisCle(i.cle)?.fichier, i.cle).toBe(i.fichier);
      expect(i.fichier.startsWith("images/jeu/")).toBe(true);
    }
  });
});
