import { describe, expect, it } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { debutDuNom, episodeSuivant, episodesDuDossier, journeeDe, lireRegistre, numeroDe, numeroter, ecrireRegistre } from "@/lib/episodes";

const J = (jour: number, h = 20) => Date.UTC(2026, 10, jour, h, 0, 0);
const ep = (base: string, debut: number) => ({ base, journee: journeeDe(base), debut });

describe("Numérotation continue des vidéos d'un personnage", () => {
  it("numérote dans l'ordre du jeu, d'une soirée et d'un jour à l'autre", () => {
    let r = numeroter({ format: 1, episodes: [] }, [ep("x_2026-11-18_p1", J(18)), ep("x_2026-11-18_p2", J(18) + 900000)], () => false);
    expect(r.episodes.map((e) => [e.base, e.numero])).toEqual([["x_2026-11-18_p1", 1], ["x_2026-11-18_p2", 2]]);
    // série déposée le lendemain : la numérotation reprend
    r = numeroter(r, [ep("x_2026-11-19", J(19))], () => false);
    expect(numeroDe(r, "x_2026-11-19")).toBe(3);
    // seconde série le même jour (autre heure) : elle suit
    r = numeroter(r, [ep("x_2026-11-19_22h00", J(19, 22))], () => false);
    expect(numeroDe(r, "x_2026-11-19_22h00")).toBe(4);
    expect(episodeSuivant(r, "x_2026-11-18_p2")?.base).toBe("x_2026-11-19");
    expect(episodeSuivant(r, "x_2026-11-19_22h00")).toBeNull();
  });

  it("garde le numéro d'une vidéo déjà rendue, et remplace les parties d'une soirée redécoupée", () => {
    let r = numeroter({ format: 1, episodes: [] }, [ep("x_2026-11-18", J(18)), ep("x_2026-11-19", J(19))], () => false);
    // la soirée du 18 est découpée en deux après coup, celle du 19 est déjà rendue : elle garde le numéro 2
    r = numeroter(r, [ep("x_2026-11-18_p1", J(18)), ep("x_2026-11-18_p2", J(18) + 900000)], (b) => b === "x_2026-11-19");
    expect(r.episodes.map((e) => [e.base, e.numero])).toEqual([["x_2026-11-18_p1", 1], ["x_2026-11-18_p2", 2], ["x_2026-11-19", 2]]);
    // pas rendue : elle suit
    r = numeroter({ format: 1, episodes: [{ ...ep("x_2026-11-18", J(18)), numero: 1 }, { ...ep("x_2026-11-19", J(19)), numero: 2 }] },
      [ep("x_2026-11-18_p1", J(18)), ep("x_2026-11-18_p2", J(18) + 900000)], () => false);
    expect(numeroDe(r, "x_2026-11-19")).toBe(3);
  });

  it("reprend les vidéos déjà rangées avant le registre, et le garde dans le dossier", () => {
    const d = mkdtempSync(path.join(tmpdir(), "episodes-"));
    writeFileSync(path.join(d, "journal-thesham_2026-11-17.narration.json"), "{}");
    writeFileSync(path.join(d, "journal-thesham_2026-11-18_p2.narration.json"), JSON.stringify({ extrait: { debut: 900, duree: 900 } }));
    writeFileSync(path.join(d, "journal-thesham_2026-11-18_p2.narration.avant.json"), "{}");
    const anciennes = episodesDuDossier(d, "journal-thesham");
    expect(anciennes.map((e) => e.base).sort()).toEqual(["journal-thesham_2026-11-17", "journal-thesham_2026-11-18_p2"]);
    expect(debutDuNom("journal-thesham_2026-11-18_20h30_p2", 60)).toBe(Date.UTC(2026, 10, 18, 20, 31, 0));
    const r = numeroter({ format: 1, episodes: anciennes.map((e) => ({ ...e, numero: 0 })) }, [ep("journal-thesham_2026-11-19", J(19))], () => false);
    ecrireRegistre(d, r);
    expect(lireRegistre(d).episodes.map((e) => e.numero)).toEqual([1, 2, 3]);
  });
});
