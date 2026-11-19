import { describe, expect, it } from "vitest";
import {
  evenementsDepuisAnalyse, nettoyerLieu, nettoyerNom, personnageDeLAnalyse, reperesDepuisAnalyse, semblables, signauxDepuisEvenements,
  VERSION_ANALYSE, type Analyse, type Echantillon,
} from "@/lib/analyseVideo";
import { zoneALEchelle, ANALYSE_VIDEO } from "@/config/analyse-video";

const DEBUT = Date.UTC(2026, 10, 18, 21, 16, 50);
/** Une analyse fabriquée : `n` secondes, valeurs données par seconde. */
function analyse(n: number, f: (t: number) => Partial<Echantillon>): Analyse {
  const echantillons = Array.from({ length: n }, (_, t) => ({ t, lieu: "Durotar", niveau: 8, nom: "Jobwow TheSham", saturation: 0.4, cible: true, ...f(t) }));
  return { version: VERSION_ANALYSE, fichier: "x.mp4", taille: 1, duree: n, echantillons };
}
const genres = (a: Analyse) => evenementsDepuisAnalyse(a, DEBUT).map((e) => e.genre);

describe("lecture du texte", () => {
  it("nettoie le lieu lu au-dessus de la minicarte", () => {
    expect(nettoyerLieu("Tranchecolline")).toBe("Tranchecolline");
    expect(nettoyerLieu(" | Terres des Tranchec... 21:43 ")).toBe("Terres des Tranchec…");
    expect(nettoyerLieu("lles de l’Écho")).toBe("Îles de l'Écho");
    expect(nettoyerLieu("~ . ")).toBeNull();
  });
  it("rapproche le nom lu des noms connus des personnages", () => {
    expect(nettoyerNom("i Jobwow Thesham .")).toBe("Jobwow TheSham");
    expect(nettoyerNom("Jobw0w Thesharn")).toBe("Jobwow TheSham");
    expect(nettoyerNom("@#")).toBeNull();
  });
  it("tolère une lettre mal lue, pas un autre nom", () => {
    expect(semblables("Tranchecoiline", "Tranchecolline")).toBe(true);
    expect(semblables("Durotar", "Orgrimmar")).toBe(false);
  });
  it("met les zones à l'échelle de la vidéo, en nombres pairs", () => {
    const z = zoneALEchelle(ANALYSE_VIDEO.zones.lieu, 1920, 810);
    expect(z.w % 2 + z.h % 2 + z.x % 2 + z.y % 2).toBe(0);
    expect(z.x).toBeCloseTo(2158 * 0.75, -1);
  });
});

describe("événements tirés de l'image", () => {
  it("donne le personnage le plus souvent lu", () => {
    expect(personnageDeLAnalyse(analyse(10, (t) => ({ nom: t < 3 ? "Autre" : "Jobwow TheSham" })))).toBe("Jobwow TheSham");
  });
  it("annonce un lieu nouveau une fois stable, pas une lecture isolée", () => {
    const a = analyse(300, (t) => ({ lieu: t < 120 ? "Durotar" : t === 150 ? "Orgrimmar" : "Tranchecolline" }));
    const zones = evenementsDepuisAnalyse(a, DEBUT).filter((e) => e.genre === "zone").map((e) => e.valeurs.zone);
    expect(zones).toEqual(["Durotar", "Tranchecolline"]);
  });
  it("ne réannonce pas un lieu déjà vu dans la soirée", () => {
    const vus = new Set<string>();
    evenementsDepuisAnalyse(analyse(30, () => ({})), DEBUT, vus);
    expect(evenementsDepuisAnalyse(analyse(30, () => ({})), DEBUT + 60000, vus).filter((e) => e.genre === "zone")).toHaveLength(0);
  });
  it("complète un nom de lieu coupé par un nom entier vu ailleurs", () => {
    const a = analyse(200, (t) => ({ lieu: t < 100 ? "Terres des Tranchec…" : "Terres des Tranchecollines" }));
    const zones = evenementsDepuisAnalyse(a, DEBUT).filter((e) => e.genre === "zone").map((e) => e.valeurs.zone);
    expect(zones).toEqual(["Terres des Tranchecollines"]);
  });
  it("repère un niveau gagné, pas un chiffre aberrant", () => {
    const a = analyse(100, (t) => ({ niveau: t < 50 ? 8 : t === 60 ? 38 : 9 }));
    const niv = evenementsDepuisAnalyse(a, DEBUT).filter((e) => e.genre === "niveau");
    expect(niv.map((e) => e.valeurs.niveau)).toEqual(["9"]);
    expect(niv[0].heure).toBe(DEBUT + 51000);
  });
  it("repère une mort quand le monde passe au gris, pas une scène de nuit", () => {
    expect(genres(analyse(60, (t) => ({ saturation: t >= 20 && t < 40 ? 0.03 : 0.4 })))).toContain("mort");
    expect(genres(analyse(60, (t) => ({ saturation: t >= 20 && t < 40 ? 0.14 : 0.4 })))).not.toContain("mort");
    expect(genres(analyse(60, (t) => ({ saturation: t >= 20 && t < 23 ? 0.03 : 0.4 })))).not.toContain("mort");
  });
  it("tire l'hécatombe de trois morts rapprochées", () => {
    const gris = (t: number) => [100, 300, 500].some((d) => t >= d && t < d + 10);
    const g = genres(analyse(600, (t) => ({ saturation: gris(t) ? 0.02 : 0.4 })));
    expect(g.filter((x) => x === "mort")).toHaveLength(3);
    expect(g).toContain("hecatombe");
  });
  it("repère six minutes sans cible ni événement", () => {
    const a = analyse(900, (t) => ({ cible: t < 100 || t > 600 }));
    const eg = evenementsDepuisAnalyse(a, DEBUT).filter((e) => e.genre === "egare");
    expect(eg).toHaveLength(1);
    expect(eg[0].valeurs.duree).toBeTruthy();
  });
  it("tous les événements portent le nom lu à l'image", () => {
    expect(new Set(evenementsDepuisAnalyse(analyse(30, () => ({})), DEBUT).map((e) => e.personnage))).toEqual(new Set(["Jobwow TheSham"]));
  });
});

describe("découpage et chapitres", () => {
  it("donne les signaux de lieu, de niveau et de mort", () => {
    const a = analyse(200, (t) => ({ lieu: t < 100 ? "Durotar" : "Tranchecolline", niveau: t < 150 ? 8 : 9, saturation: t > 170 && t < 190 ? 0.02 : 0.4 }));
    const s = signauxDepuisEvenements(evenementsDepuisAnalyse(a, DEBUT)).map((x) => x.genre);
    expect(s).toEqual(expect.arrayContaining(["zone", "niveau", "mort"]));
  });
  it("donne l'état de départ et les repères des chapitres", () => {
    const a = analyse(200, (t) => ({ niveau: t < 150 ? 8 : 9 }));
    const r = reperesDepuisAnalyse(a, DEBUT, evenementsDepuisAnalyse(a, DEBUT));
    expect(r[0]).toMatchObject({ type: "etat", texte: "Durotar|8", personnage: "Jobwow TheSham" });
    expect(r.some((x) => x.type === "niveau" && x.texte === "9")).toBe(true);
  });
});
