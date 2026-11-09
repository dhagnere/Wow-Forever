import { describe, expect, it } from "vitest";
import { CLASSE_JEU, PREMIER_ID_SAISI, chaineLua, fichierCartes, fichierGuide, guidesAddon, tocAvecGuides, valeurLua } from "@/lib/addon";
import { combinaisons } from "@/lib/guide";

const guides = guidesAddon();

describe("guides de l'addon EternalRoutes", () => {
  it("un guide par race et par classe, chacun non vide", () => {
    expect(guides).toHaveLength(combinaisons().length);
    for (const g of guides) {
      expect(g.steps.length, g.id).toBeGreaterThan(100);
      expect(Object.values(CLASSE_JEU)).toContain(g.class);
    }
  });

  it("chaque étape placée sur la carte porte l'identifiant de la carte du jeu", () => {
    for (const g of guides) {
      for (const s of g.steps) {
        if (s.x !== undefined) {
          expect(s.map, `${g.id} ${s.zone}`).toBeGreaterThan(0);
          expect(s.x).toBeGreaterThanOrEqual(0);
          expect(s.x).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it("aucun identifiant saisi à la main n'est envoyé au jeu", () => {
    for (const g of guides) for (const s of g.steps) for (const q of s.quests) if (q.id) expect(q.id).toBeLessThan(PREMIER_ID_SAISI);
  });

  it("une quête se prend avant d'être faite et rendue", () => {
    for (const g of guides) {
      const prises = new Set<string>();
      for (const s of g.steps) {
        for (const q of s.quests) {
          if (q.kind === "prendre") prises.add(q.name);
          else expect(prises.has(q.name), `${g.id} : ${q.kind} « ${q.name} » avant de la prendre`).toBe(true);
        }
      }
    }
  });

  it("le fichier Lua ne se charge que pour sa classe et sa faction", () => {
    const g = guides.find((x) => x.id === "site-orc-chasseur")!;
    const lua = fichierGuide(g);
    expect(lua).toContain('if classe and classe ~= "HUNTER" then return end');
    expect(lua).toContain('if faction and faction ~= "Horde" then return end');
    expect(lua).toContain('ns.guides[guide.id] = guide');
  });

  it("les cartes des zones sont connues en français et en anglais", () => {
    const lua = fichierCartes();
    expect(lua).toContain('ns.zoneMaps["Durotar"] = 1411');
    expect(lua).toContain('ns.zoneMaps["Dun Morogh"] = 1426');
  });
});

describe("écriture en Lua", () => {
  it("échappe les guillemets, les barres obliques inverses et les retours à la ligne", () => {
    expect(chaineLua('Le "grand" \\ chef\nsuite')).toBe('"Le \\"grand\\" \\\\ chef\\nsuite"');
    expect(valeurLua({ a: 1, b: ["x", true], "c-d": undefined })).toBe('{ a = 1, b = { "x", true } }');
    expect(valeurLua({ "clé spéciale": 2 })).toBe('{ ["clé spéciale"] = 2 }');
  });

  it("met à jour la liste des fichiers du .toc entre ses repères", () => {
    const toc = "## Title: EternalRoutes\nCore.lua\nGuides/orc.lua\nGuideEngine.lua\nGuideWindow.lua";
    const une = tocAvecGuides(toc, ["Guides/site/a.lua"]);
    expect(une.split("\n").indexOf("Maps.lua")).toBeLessThan(une.split("\n").indexOf("GuideEngine.lua"));
    const deux = tocAvecGuides(une, ["Guides/site/b.lua"]);
    expect(deux).not.toContain("Guides/site/a.lua");
    expect(deux).toContain("Guides/site/b.lua");
    expect(deux.match(/Maps\.lua/g)).toHaveLength(1);
  });
});
