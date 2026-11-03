import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CLASSES } from "@/content/classes";
import { carte } from "@/lib/cartes";

interface Donnees {
  classes: Record<string, { titre: string; niveaux: [number, number]; races: string[] | null; quetes: number[] }[]>;
  quetes: Record<string, { titre: string; niveau: number; donneurs: { n: string; l?: { lieu: string } }[]; objectifs: string[] }>;
  parcours: Record<"alliance" | "horde", { lieu: string; niveaux: [number, number]; quetes: number }[]>;
}
const d = JSON.parse(readFileSync(path.join(process.cwd(), "content/quetes-jeu.json"), "utf8")) as Donnees;

describe("guides de quêtes (content/quetes-jeu.json)", () => {
  it("donne des chaînes de quêtes à chaque classe", () => {
    expect(Object.keys(d.classes).sort()).toEqual(CLASSES.map((c) => c.slug).sort());
    for (const chaines of Object.values(d.classes)) {
      expect(chaines.reduce((s, c) => s + c.quetes.length, 0)).toBeGreaterThanOrEqual(30);
      for (const c of chaines) for (const id of c.quetes) expect(d.quetes[String(id)]).toBeDefined();
    }
  });

  it("ne reprend aucun texte de quête : objectifs rédigés à partir des données", () => {
    for (const q of Object.values(d.quetes)) {
      for (const o of q.objectifs) expect(o).toMatch(/^(Rapporter|Vaincre|Activer|Utiliser) /);
      expect(q.titre.length).toBeLessThan(90);
    }
  });

  it("garde les grandes chaînes connues, sans doublon ni quête saisonnière", () => {
    const druide = d.classes.druide.map((c) => c.quetes.map((id) => d.quetes[String(id)].titre));
    expect(druide.filter((t) => t[0] === "Écouter l'appel")).toHaveLength(2); // elfe de la nuit, tauren
    expect(druide.flat()).toContain("Forme aquatique");
    expect(Object.values(d.classes).flat().some((c) => d.quetes[String(c.quetes[0])].titre === "Un cadeau secoué doucement")).toBe(false);
  });

  it("trace une route par faction, des zones de départ à Silithus, sur des cartes connues", () => {
    for (const camp of ["alliance", "horde"] as const) {
      const route = d.parcours[camp];
      expect(route.length).toBeGreaterThanOrEqual(20);
      expect(route[0].niveaux[0]).toBeLessThanOrEqual(5);
      expect(route.at(-1)!.niveaux[1]).toBe(60);
      for (const e of route) expect(carte(e.lieu)).toBeDefined();
    }
    const alliance = d.parcours.alliance.map((e) => e.lieu);
    expect(alliance).not.toContain("durotar");
    expect(alliance).not.toContain("hurlevent");
    expect(d.parcours.horde.map((e) => e.lieu)).not.toContain("foret-d-elwynn");
  });
});
