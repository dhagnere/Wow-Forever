import { describe, expect, it } from "vitest";
import { sourcesPubliees, verifierPublication } from "@/modules/veille/articles/publication";

const article = {
  titre: "WoW Forever sort le 5 novembre",
  corps: "x".repeat(400),
  avisSilfax: "J'attends surtout les nouveaux donjons : la salle des Thanes m'intrigue, et je commencerai en Druide tauren.",
  rubrique: "actualites" as const,
  description: "Tout savoir sur la sortie de WoW Forever le 5 novembre : horaire, abonnement, codes d'invitation.",
};
const source = (publiee?: boolean) => ({ nom: "Wowhead", url: "https://wowhead.com/x", titre: "t", publiee });

describe("sources affichées", () => {
  it("affiche par défaut les sources des articles antérieurs (sans réglage)", () => {
    expect(sourcesPubliees([source(), source(false), source(true)])).toHaveLength(2);
  });

  it("exige au moins une source affichée pour un article tiré de la veille", () => {
    expect(verifierPublication({ ...article, origine: "veille", sources: [source(false), source(false)] }).join(" ")).toMatch(/au moins une source/);
    expect(verifierPublication({ ...article, origine: "veille", sources: [source(false), source(true)] })).toEqual([]);
  });

  it("n'exige rien d'un article écrit à la main sans source", () => {
    expect(verifierPublication({ ...article, origine: "manuel", sources: [] })).toEqual([]);
  });
});
