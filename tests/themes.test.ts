import { describe, expect, it } from "vitest";
import { detecterTheme, selectionVariee } from "@/modules/veille/collecte/themes";
import { noter } from "@/modules/veille/collecte/tri";
import type { Element } from "@/modules/veille/types";

describe("classement par thème", () => {
  it.each([
    ["WoW Forever: Hall of Thanes dungeon guide and loot table", "", "donjons-raids", "donjons/salle-des-thanes"],
    ["WoW Forever : le Druide gagne de nouveaux talents", "", "classes", "classes/druide"],
    ["Skyborne racial abilities revealed for WoW Forever", "", "races", "races/skyborne"],
    ["WoW Forever: Mount Hyjal zone preview", "", "zones", "zones/mont-hyjal"],
    ["WoW Forever patch notes: hotfix for login bug", "", "patchs", null],
    ["World PvP erupts in Hillsbrad during WoW Forever beta", "", "jcj", null],
    ["WoW Forever: best professions for gold and the auction house", "", "metiers", null],
    ["WoW Forever release date and editions explained", "", "actualites", null],
  ])("« %s »", (titre, texte, rubrique, pilier) => {
    expect(detecterTheme({ titre, texte })).toEqual({ rubrique, pilier });
  });

  it("préfère un thème précis à l'actualité générale", () => {
    expect(detecterTheme({ titre: "WoW Forever launch: new raid revealed", texte: "release date, editions, raid boss" }).rubrique).toBe("donjons-raids");
  });

  it("tient compte du thème de la recherche ciblée", () => {
    expect(detecterTheme({ titre: "WoW Forever: what we know", texte: "", themesSources: ["metiers"] }).rubrique).toBe("metiers");
  });

  it("ne désigne aucune page pilier quand plusieurs classes sont citées à égalité", () => {
    expect(detecterTheme({ titre: "WoW Forever: warrior vs paladin, which tank?", texte: "" }).pilier).toBeNull();
  });

  it("ne confond pas « mage » et « image »", () => {
    expect(detecterTheme({ titre: "WoW Forever : la nouvelle image de connexion", texte: "" }).pilier).toBeNull();
  });
});

describe("sélection variée", () => {
  const s = (theme: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${theme}${i}`, theme: theme as never }));
  it("plafonne chaque thème pour alimenter toutes les pages", () => {
    const sujets = [...s("actualites", 8), ...s("classes", 3), ...s("donjons-raids", 3)];
    const choix = selectionVariee(sujets, 9);
    expect(choix).toHaveLength(9);
    expect(choix.filter((x) => x.theme === "actualites")).toHaveLength(3);
  });
  it("lève le plafond si les autres thèmes ne suffisent pas", () => {
    expect(selectionVariee(s("actualites", 10), 6)).toHaveLength(6);
  });
});

describe("score par site éditeur", () => {
  const el = (p: Partial<Element>): Element => ({
    sourceId: "gnews-en", sourceNom: "Wowhead", langue: "en", poids: 1, video: false,
    titre: "WoW Forever: Hall of Thanes dungeon", url: "https://news.google.com/a", resume: "", publieLe: new Date("2026-11-01T08:00:00Z"), ...p,
  });
  it("compte une seule fois un site remonté par plusieurs flux", () => {
    const sujet = noter([el({}), el({ sourceId: "theme-donjons-raids", url: "https://news.google.com/b" }), el({ sourceId: "wowhead", poids: 3, url: "https://wowhead.com/x" })], new Date("2026-11-01T09:00:00Z"), 36);
    expect(sujet.detailScore.sources).toBe(3);
    expect(sujet.theme).toBe("donjons-raids");
    expect(sujet.pilier).toBe("donjons/salle-des-thanes");
  });
});
