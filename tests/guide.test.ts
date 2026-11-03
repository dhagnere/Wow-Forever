import { describe, expect, it } from "vitest";
import { combinaisons, guidePour, guidesPassantPar, planifier, raceGuide, cleGuide, libelleGuide, BITS_CLASSES } from "@/lib/guide";
import { courbe, segment } from "@/components/GuideParcours";
import { carte } from "@/lib/cartes";
import { cleGuideValide } from "@/modules/veille/joueurs/validation";

describe("guide de 1 à 60", () => {
  it("propose chaque combinaison race et classe jouable, avec une clé de sauvegarde valide", () => {
    const c = combinaisons();
    expect(c.length).toBeGreaterThanOrEqual(30);
    expect(c.some((x) => x.race.slug === "humain" && x.classe.slug === "mage")).toBe(true);
    expect(c.some((x) => x.race.slug === "tauren" && x.classe.slug === "mage")).toBe(false);
    for (const x of c) {
      expect(cleGuideValide(cleGuide(x.race, x.classe.slug))).toBe(true);
      expect(libelleGuide(cleGuide(x.race, x.classe.slug)).lien).toBe(`/guides/parcours/${x.race.slug}/${x.classe.slug}/`);
    }
  });

  it("part de la zone de la race, reste sur son continent avant 30 et garde les seules quêtes de sa classe", () => {
    const humain = raceGuide("humain")!;
    const zones = guidePour(humain, "mage");
    expect(zones[0].lieu).toBe("foret-d-elwynn");
    const lieux = zones.map((z) => z.lieu);
    expect(lieux).not.toContain("dun-morogh");
    expect(lieux).not.toContain("teldrassil");
    for (const z of zones) {
      if (z.niveaux[1] < 30) expect(carte(z.lieu)?.continent).toBe(carte("foret-d-elwynn")?.continent);
      for (const e of z.etapes) {
        expect(!e.cl || (e.cl & BITS_CLASSES.mage) !== 0).toBe(true);
        expect(!e.ra || (e.ra & humain.bit) !== 0).toBe(true);
      }
    }
    expect(zones.at(-1)!.niveaux[1]).toBe(60);
    // La lettre de classe du mage humain est là, pas celle du guerrier.
    const premieres = zones[0].etapes.map((e) => e.t);
    expect(premieres).toContain("La lettre glyphée");
    expect(premieres).not.toContain("Une lettre simple");
  });

  it("place chaque PNJ sur la carte et range une suite après sa quête préalable", () => {
    for (const r of ["humain", "orc", "mort-vivant"]) {
      for (const z of guidePour(raceGuide(r)!, "guerrier")) {
        for (const h of z.hubs) {
          expect(h.x).toBeGreaterThanOrEqual(0);
          expect(h.x).toBeLessThanOrEqual(100);
          expect(h.y).toBeGreaterThanOrEqual(0);
          expect(h.y).toBeLessThanOrEqual(100);
        }
        const rang = new Map(z.etapes.map((e, i) => [e.id, i]));
        for (const e of z.etapes) if (e.av && rang.has(e.av)) expect(rang.get(e.av)!).toBeLessThan(rang.get(e.id)!);
      }
    }
  });

  it("suit un ordre logique pour chaque race et chaque classe : prendre, faire, rendre, puis la suite", () => {
    for (const { race, classe } of combinaisons()) {
      for (const z of guidePour(race, classe.slug)) {
        const arrets = planifier(z);
        const ordre = new Map<string, number>();
        let rang = 0;
        for (const a of arrets) for (const x of a.actions) ordre.set(`${x.a}:${z.etapes[x.q].id}`, rang++);
        const ids = new Set(z.etapes.map((e) => e.id));
        for (const e of z.etapes) {
          const prise = ordre.get(`prendre:${e.id}`);
          const rendue = ordre.get(`rendre:${e.id}`);
          // Chaque quête est prise puis rendue, une fois, dans cet ordre.
          expect(prise, `${z.lieu} « ${e.t} » prise`).toBeDefined();
          expect(rendue, `${z.lieu} « ${e.t} » rendue`).toBeDefined();
          expect(rendue!).toBeGreaterThan(prise!);
          // Les objectifs se font entre la prise et le rendu.
          const faite = ordre.get(`faire:${e.id}`);
          if (faite !== undefined) expect(faite > prise! && faite < rendue!).toBe(true);
          if (e.cib) expect(faite, `${z.lieu} « ${e.t} » objectifs`).toBeDefined();
          // Une suite ne se prend qu'après avoir rendu la quête qui l'ouvre.
          if (e.av && ids.has(e.av)) expect(prise!).toBeGreaterThan(ordre.get(`rendre:${e.av}`)!);
        }
        // Une quête n'est rendue qu'une seule fois.
        const rendus = arrets.flatMap((a) => a.actions.filter((x) => x.a === "rendre").map((x) => x.q));
        expect(new Set(rendus).size).toBe(rendus.length);
      }
    }
  });

  it("raccourcit les flèches pour laisser voir la pointe, et n'en trace pas entre deux points confondus", () => {
    const s = segment({ x: 10, y: 10 }, { x: 50, y: 10 })!;
    expect(s[0]).toBeCloseTo(12.2);
    expect(s[2]).toBeCloseTo(47.8);
    expect(segment({ x: 10, y: 10 }, { x: 11, y: 10 })).toBeNull();
  });

  it("écarte l'aller et le retour entre deux mêmes points", () => {
    const aller = courbe({ x: 10, y: 10 }, { x: 50, y: 10 })!;
    const retour = courbe({ x: 50, y: 10 }, { x: 10, y: 10 })!;
    const cy = (d: string) => Number(d.split("Q")[1].split(" ")[0].split(",")[1]);
    expect(cy(aller)).not.toBeCloseTo(cy(retour));
    expect(aller.startsWith("M")).toBe(true);
  });

  it("propose depuis chaque zone les guides qui y passent, et seulement ceux-là", () => {
    const races = (lieu: string) => guidesPassantPar(lieu).map((g) => g.race.slug).sort();
    expect(races("durotar")).toEqual(["orc", "troll"]);
    expect(races("foret-d-elwynn")).toEqual(["humain"]);
    expect(races("dun-morogh")).toEqual(["gnome", "nain"]);
    const tanaris = guidesPassantPar("tanaris");
    expect(tanaris.length).toBeGreaterThanOrEqual(6);
    // Chaque classe proposée existe bien pour cette race.
    for (const g of tanaris) for (const c of g.classes) expect(combinaisons().some((x) => x.race.slug === g.race.slug && x.classe.slug === c)).toBe(true);
    expect(guidesPassantPar("lieu-inconnu")).toEqual([]);
  });
});
