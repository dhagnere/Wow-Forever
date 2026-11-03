import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  POINTS_MAX, arbreValable, blocageAjout, blocageRetrait, decoder, encoder, modifier, niveauRequis, total, vide,
  type TalentCalcul,
} from "@/lib/calculateur";
import type { Specialisation } from "@/modules/veille";

// Petit arbre : palier 0 (5 rangs, 4 rangs), palier 1 (1 rang, prérequis du suivant), palier 2 (1 rang qui demande le précédent).
const arbre: TalentCalcul[] = [
  { id: 1, palier: 0, colonne: 0, rangs: 5, prerequisId: null },
  { id: 2, palier: 0, colonne: 1, rangs: 4, prerequisId: null },
  { id: 3, palier: 1, colonne: 1, rangs: 1, prerequisId: null },
  { id: 4, palier: 2, colonne: 1, rangs: 1, prerequisId: 3 },
];
const arbres = [arbre, arbre, arbre];

describe("règles du calculateur", () => {
  it("compte 51 points au niveau 60", () => {
    expect(POINTS_MAX).toBe(51);
    expect(niveauRequis(0)).toBe(10);
    expect(niveauRequis(1)).toBe(10);
    expect(niveauRequis(51)).toBe(60);
  });

  it("demande 5 points par palier et le prérequis au maximum", () => {
    let p = vide(arbres);
    expect(blocageAjout(arbres, p, 0, 2)).toMatch(/5 points/);
    for (let k = 0; k < 5; k++) p = modifier(p, 0, 0, 1);
    expect(blocageAjout(arbres, p, 0, 0)).toBe("Talent au maximum.");
    expect(blocageAjout(arbres, p, 0, 2)).toBeNull();
    p = modifier(p, 0, 2, 1);
    // Palier 2 : 10 points au-dessus exigés, et le prérequis rempli.
    expect(blocageAjout(arbres, p, 0, 3)).toMatch(/10 points/);
    for (let k = 0; k < 3; k++) p = modifier(p, 0, 1, 1);
    expect(blocageAjout(arbres, p, 0, 3)).toMatch(/10 points/); // 9 points au-dessus
    p = modifier(p, 0, 1, 1);
    expect(blocageAjout(arbres, p, 0, 3)).toBeNull();
  });

  it("refuse un retrait qui casserait l'arbre", () => {
    let p = vide(arbres);
    for (let k = 0; k < 5; k++) p = modifier(p, 0, 0, 1);
    p = modifier(p, 0, 2, 1);
    expect(blocageRetrait(arbres, p, 0, 0)).toMatch(/dépendent/);
    expect(blocageRetrait(arbres, p, 0, 2)).toBeNull();
    expect(blocageRetrait(arbres, p, 0, 1)).toMatch(/Aucun point/);
  });

  it("encode et relit un build, et rejette un build impossible", () => {
    let p = vide(arbres);
    for (let k = 0; k < 5; k++) p = modifier(p, 0, 0, 1);
    p = modifier(p, 0, 2, 1);
    p = modifier(p, 2, 1, 1);
    const code = encoder(p);
    expect(code).toBe("501--01");
    expect(decoder(code, arbres)).toEqual(p);
    expect(decoder("", arbres)).toEqual(vide(arbres));
    expect(decoder("0011", arbres)).toBeNull(); // palier 2 sans les points au-dessus
    expect(decoder("6", arbres)).toBeNull(); // au-delà des rangs
    expect(decoder("abc", arbres)).toBeNull();
    expect(arbreValable(arbre, [5, 4, 1, 1])).toBe(true);
  });

  it("plafonne à 51 points avec les vrais arbres du jeu", () => {
    const donnees = JSON.parse(readFileSync(path.join(process.cwd(), "content/sorts-jeu.json"), "utf8")) as { classes: Record<string, Specialisation[]> };
    for (const specs of Object.values(donnees.classes)) {
      const vrais = specs.map((s) => s.talents);
      // Chaque prérequis est dans le même arbre, à un palier inférieur ou égal.
      for (const t of vrais.flat()) {
        if (!t.prerequisId) continue;
        const p = vrais.flat().find((x) => x.id === t.prerequisId);
        expect(p && p.palier <= t.palier).toBe(true);
      }
      // Remplir glouton l'arbre principal puis les autres ne dépasse jamais 51 points et reste valable.
      let p = vide(vrais);
      for (let tour = 0; tour < 200; tour++) {
        let ajoute = false;
        for (let a = 0; a < vrais.length && !ajoute; a++) {
          for (let i = 0; i < vrais[a].length && !ajoute; i++) {
            if (!blocageAjout(vrais, p, a, i)) { p = modifier(p, a, i, 1); ajoute = true; }
          }
        }
        if (!ajoute) break;
      }
      expect(total(p)).toBe(POINTS_MAX);
      expect(vrais.every((arb, a) => arbreValable(arb, p[a]))).toBe(true);
      expect(decoder(encoder(p), vrais)).toEqual(p);
    }
  });
});
