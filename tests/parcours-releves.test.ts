import { describe, expect, it } from "vitest";
import { PARCOURS_RELEVES } from "@/content/parcours-releves";
import { combinaisons, guidePour, ordreDuGuide, planifier, raceGuide, RACES_GUIDE } from "@/lib/guide";

const cles = (z: ReturnType<typeof guidePour>[number], arrets: ReturnType<typeof planifier>) =>
  arrets.flatMap((a) => a.actions.map((x) => `${x.a}:${z.etapes[x.q].id}`));

describe("parcours relevés en jeu", () => {
  it("désignent une race, une zone et des étapes qui existent dans le guide", () => {
    for (const p of PARCOURS_RELEVES) {
      const race = raceGuide(p.race);
      expect(race, p.race).toBeTruthy();
      const classes = combinaisons().filter((c) => c.race.slug === p.race && (!p.classe || c.classe.slug === p.classe));
      expect(classes.length, `${p.race} ${p.classe}`).toBeGreaterThan(0);
      for (const { classe } of classes) {
        const z = guidePour(race!, classe.slug).find((x) => x.lieu === p.lieu);
        expect(z, `${p.race} ${classe.slug} ${p.lieu}`).toBeTruthy();
        const ids = new Set(z!.etapes.map((e) => e.id));
        for (const e of p.etapes) {
          expect(e).toMatch(/^(prendre|faire|rendre):\d+$/);
          expect(ids.has(Number(e.split(":")[1])), `${e} absente du guide ${p.race} ${classe.slug}`).toBe(true);
        }
      }
      expect(p.source.length).toBeGreaterThan(10);
    }
  });

  it("passent en tête de la zone, sans perdre ni doubler une étape", () => {
    const race = raceGuide("orc")!;
    const z = guidePour(race, "chasseur")[0];
    const ordre = cles(z, ordreDuGuide(z, race, "chasseur"));
    expect(ordre.slice(0, 4)).toEqual(["prendre:4641", "rendre:4641", "prendre:788", "prendre:9100001"]);
    expect([...ordre].sort()).toEqual([...cles(z, planifier(z))].sort());
  });

  it("gardent un ordre jouable dans chaque guide : prendre, faire, rendre, et la quête préalable d'abord", () => {
    for (const { race, classe } of combinaisons()) {
      for (const z of guidePour(race, classe.slug)) {
        const ordre = cles(z, ordreDuGuide(z, race, classe.slug));
        const rang = new Map(ordre.map((c, i) => [c, i]));
        for (const e of z.etapes) {
          const p = rang.get(`prendre:${e.id}`), f = rang.get(`faire:${e.id}`), r = rang.get(`rendre:${e.id}`);
          if (p !== undefined && f !== undefined) expect(f, `${race.slug} ${classe.slug} ${e.t}`).toBeGreaterThan(p);
          if (p !== undefined && r !== undefined) expect(r, `${race.slug} ${classe.slug} ${e.t}`).toBeGreaterThan(p);
          if (f !== undefined && r !== undefined) expect(r, `${race.slug} ${classe.slug} ${e.t}`).toBeGreaterThan(f);
          const avant = e.av ? rang.get(`rendre:${e.av}`) : undefined;
          if (avant !== undefined && p !== undefined) expect(p, `${race.slug} ${classe.slug} ${e.t} après sa quête préalable`).toBeGreaterThan(avant);
        }
      }
    }
    expect(RACES_GUIDE.length).toBeGreaterThan(0);
  });
});
