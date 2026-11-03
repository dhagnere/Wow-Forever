import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { decrire, dureeFr, evaluer, lireVariables, type DonneesSort, type EffetSort } from "@/modules/veille/sorts/description";
import { SPECIALISATIONS } from "@/modules/veille/sorts/conversion";
import type { Familiers, Specialisation } from "@/modules/veille";

const effet = (index: number, base: number, autres: Partial<EffetSort> = {}): EffetSort => ({
  index, effet: 2, aura: 0, base, variance: 0, periode: 0, ciblesChainees: 0, rayon: 0, pointsParRessource: 0,
  amplitude: 0, misc: 0, declencheur: 0, coefficientChaine: 0, ...autres,
});

const sort = (description: string, effets: EffetSort[], autres: Partial<DonneesSort> = {}): DonneesSort => ({
  id: 1, nom: "Essai", description, duree: null, effets, charges: 0, chance: 0, cumul: 0, ciblesMax: 0, niveauMaxCible: 0,
  portee: 0, variables: "", ...autres,
});

const rien = () => undefined;

describe("descriptions des sorts", () => {
  it("donne une fourchette pour un effet à variance, et la durée en clair", () => {
    // Boule de feu, rang 12 de Forever : 483 de base, variance 0,2419.
    const s = sort("Inflige $s1 points de dégâts de Feu et $o2 points supplémentaires en $d.", [
      effet(0, 483, { variance: 0.24188791215 }),
      effet(1, 15, { periode: 2000 }),
    ], { duree: 8000 });
    expect(decrire(s, rien)).toEqual({ texte: "Inflige 425 à 541 points de dégâts de Feu et 60 points supplémentaires en 8 s.", complet: true });
  });

  it("évalue les formules et les variables partagées, sans talent", () => {
    const communes = lireVariables("$frostdamage1=$?s11151[${1.02}][${1.0}]\n$frostdamage=$?s12953[${1.06}][${$<frostdamage1>}]");
    const s = sort("inflige de ${$m2$*$<frostdamage>} à ${$M2*$<frostdamage>} $lpoint:points; et ralentit de $s1 %.", [
      effet(0, -40), effet(1, 386, { variance: 0.0762 }),
    ]);
    expect(decrire(s, rien, undefined, communes).texte).toBe("inflige de 371 à 401 points et ralentit de 40 %.");
  });

  it("gère divisions, multiplications, singulier et sorts cités", () => {
    const autre = sort("", [effet(0, 10)], { id: 28682 });
    const s = sort("Réduit de $/1000;S1 s. Chaque point de rage vaut $*10;F1 points. Gagne $28682s1 % et $s2 $lcharge:charges;.", [
      effet(0, -500, { coefficientChaine: 0.3 }), effet(1, 1),
    ]);
    expect(decrire(s, (id) => (id === 28682 ? autre : undefined)).texte)
      .toBe("Réduit de 0,5 s. Chaque point de rage vaut 3 points. Gagne 10 % et 1 charge.");
  });

  it("affiche « X » pour ce qui dépend du personnage, au pluriel", () => {
    const s = sort("Inflige ${1+$apm*$m3/100} $lpoint:points; de dégâts.", [effet(0, 1), effet(1, 1), effet(2, 50)]);
    expect(decrire(s, rien)).toEqual({ texte: "Inflige X points de dégâts.", complet: false });
  });

  it("ne double pas l'unité d'une durée suivie de « s »", () => {
    const s = sort("pendant $d s. Puis", [effet(0, 1)], { duree: 6000 });
    expect(decrire(s, rien).texte).toBe("pendant 6 s. Puis");
  });

  it("formate les durées et calcule sans eval", () => {
    expect(dureeFr(1500)).toBe("1,5 s");
    expect(dureeFr(180000)).toBe("3 min");
    expect(dureeFr(3600000)).toBe("1 h");
    expect(evaluer("(371)*1")).toBe(371);
    expect(evaluer("cond(gt(2,1),5,7)+max(1,3)")).toBe(8);
    expect(evaluer("alert(1)")).toBeNull();
  });
});

describe("sorts produits (content/sorts-jeu.json)", () => {
  const donnees = JSON.parse(readFileSync(path.join(process.cwd(), "content/sorts-jeu.json"), "utf8")) as {
    version: string; classes: Record<string, Specialisation[]>; familiers: Record<string, Familiers>;
  };

  it("couvre les neuf classes, trois spécialisations chacune", () => {
    expect(Object.keys(donnees.classes).sort()).toEqual(Object.keys(SPECIALISATIONS).sort());
    for (const specs of Object.values(donnees.classes)) {
      expect(specs).toHaveLength(3);
      for (const s of specs) {
        expect(s.sorts.length).toBeGreaterThanOrEqual(5);
        expect(s.talents.length).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it("ne laisse aucun jeton du jeu dans les textes et a toutes ses icônes", () => {
    const textes: string[] = [];
    const icones = new Set<number>();
    for (const specs of Object.values(donnees.classes)) {
      for (const s of specs) {
        icones.add(s.icone);
        for (const x of s.sorts) {
          icones.add(x.icone);
          for (const r of x.rangs) textes.push(r.description);
        }
        for (const t of s.talents) {
          icones.add(t.icone);
          textes.push(t.premier);
          expect(t.descriptions).toHaveLength(t.rangs);
          expect(t.descriptions[0]).toBe(t.premier);
          for (const d of t.descriptions) if (d) textes.push(d);
        }
      }
    }
    for (const f of Object.values(donnees.familiers)) {
      for (const g of f.familles) icones.add(g.icone);
      for (const t of f.techniques) {
        icones.add(t.icone);
        for (const r of t.rangs) textes.push(r.description);
      }
    }
    expect(textes.filter((t) => /\$|\{|\}/.test(t))).toEqual([]);
    const manquantes = [...icones].filter((id) => id && !existsSync(path.join(process.cwd(), `public/images/jeu/sorts/${id}.png`)));
    expect(manquantes).toEqual([]);
  });

  it("reprend les valeurs de Forever (Boule de feu, Éclair de givrefeu)", () => {
    const feu = donnees.classes.mage.find((s) => s.nom === "Feu")!;
    const boule = feu.sorts.find((s) => s.nom === "Boule de feu")!;
    expect(boule.rangs[0]).toMatchObject({ rang: 1, niveau: 1 });
    expect(boule.rangs.at(-1)!.description).toContain("425 à 541");
    expect(feu.sorts.some((s) => s.nom === "Éclair de givrefeu")).toBe(true);
  });

  it("liste les familles de bêtes du chasseur et leurs techniques", () => {
    const f = donnees.familiers.chasseur;
    expect(f.mode).toBe("partage");
    expect(f.familles.length).toBeGreaterThanOrEqual(15);
    const loup = f.familles.find((x) => x.nom === "Loup")!;
    expect(loup.techniques).toEqual(expect.arrayContaining(["Morsure", "Hurlement furieux"]));
    const hurlement = f.techniques.find((t) => t.nom === "Hurlement furieux")!;
    expect(hurlement.familles).toEqual(["Loup"]);
    // Les techniques communes viennent du dressage ; les sorts internes et les talents du chasseur n'y figurent pas.
    const noms = f.techniques.map((t) => t.nom);
    expect(f.techniques.find((t) => t.nom === "Grondement")!.familles).toBeNull();
    expect(noms).not.toContain("Intimidation");
    expect(noms.some((n) => /^Attaque (rapide|lente)/.test(n))).toBe(false);
  });

  it("donne ses sorts à chaque démon du démoniste", () => {
    const f = donnees.familiers.demoniste;
    expect(f.mode).toBe("groupe");
    expect(f.familles.map((x) => x.nom)).toEqual(expect.arrayContaining(["Diablotin", "Marcheur du Vide", "Chasseur corrompu"]));
    for (const d of f.familles) expect(d.techniques.length).toBeGreaterThanOrEqual(3);
    expect(f.techniques.find((t) => t.nom === "Verrou magique")!.familles).toEqual(["Chasseur corrompu"]);
  });

  it("donne ses traits à chaque race, variantes de classe comprises", () => {
    const races = (donnees as unknown as { races: Record<string, { nom: string; passif: boolean; variantes: { classes: string[] | null; description: string }[] }[]> }).races;
    expect(Object.keys(races).sort()).toEqual(["elfe-de-la-nuit", "gnome", "humain", "mort-vivant", "nain", "orc", "skyborne", "tauren", "troll"]);
    for (const traits of Object.values(races)) {
      expect(traits.length).toBeGreaterThanOrEqual(4);
      for (const t of traits) for (const v of t.variantes) expect(v.description).not.toMatch(/\$/);
    }
    // Même texte pour toutes les classes : une seule variante, sans liste de classes.
    expect(races.orc.find((t) => t.nom === "Ordre")!.variantes).toEqual([expect.objectContaining({ classes: null })]);
    const pensee = races.gnome.find((t) => t.nom === "Pensée expansive")!;
    expect(pensee.passif).toBe(true);
    expect(pensee.variantes.map((v) => v.classes)).toContainEqual(["Voleur"]);
    expect(races.skyborne.map((t) => t.nom)).toEqual(expect.arrayContaining(["Marche sur l'air", "Vue céleste", "Lecture des lignes telluriques"]));
  });
});
