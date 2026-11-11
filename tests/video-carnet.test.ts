import { describe, expect, it } from "vitest";
import { chapitres, descriptionVideo, heureLocale, horodatage, lireTableLua, positionDans, reperesRouteProbe, seances, titreVideo, type Clip } from "@/lib/videoCarnet";

// Sauvegarde de RouteProbe telle que le jeu l'écrit : un orc en cours, un démoniste mis de côté.
const SAUVEGARDE = `
RouteProbeDB = {
	["personnage"] = "Grosorc-Forever",
	["events"] = {
		"1000.0|clock|debut|2026-11-11 21:00:00", -- [1]
		"1001.0|zone|Durotar|1411|0.42|0.68", -- [2]
		"1300.0|level|3", -- [3]
		"1305.0|mark|Sortie de la \\"Vallée\\"", -- [4]
		"1900.0|zone|Les Tarides|1413|0.5|0.5", -- [5]
		"2500.0|level|4", -- [6]
		"3000.0|zone|Les Tarides|1413|0.5|0.5", -- [7]
	},
	["horloges"] = {
		{
			["quoi"] = "debut",
			["t"] = 1000,
			["heure"] = "2026-11-11 21:00:00",
		}, -- [1]
	},
	["archives"] = {
		["Mortdemo-Forever"] = {
			["events"] = {
				"50.0|clock|debut|2026-11-10 20:00:00",
				"60.0|zone|Clairières de Tirisfal|1420|0.3|0.7",
			},
		},
	},
	["mmX"] = -78.5,
	["enCours"] = true,
}
`;

describe("sauvegarde de RouteProbe", () => {
  it("lit la table Lua écrite par le jeu (commentaires, guillemets échappés, tableaux)", () => {
    const db = lireTableLua(SAUVEGARDE) as Record<string, unknown>;
    expect(db.personnage).toBe("Grosorc-Forever");
    expect(db.mmX).toBe(-78.5);
    expect(db.enCours).toBe(true);
    expect((db.events as string[])[3]).toBe('1305.0|mark|Sortie de la "Vallée"');
    expect(((db.horloges as unknown[])[0] as Record<string, unknown>).t).toBe(1000);
  });

  it("date les zones, niveaux et marqueurs en heure du PC, archives comprises", () => {
    const r = reperesRouteProbe(lireTableLua(SAUVEGARDE));
    expect(r[0]).toMatchObject({ type: "zone", texte: "Clairières de Tirisfal", personnage: "Mortdemo-Forever" });
    const marque = r.find((x) => x.type === "marqueur")!;
    expect(marque.heure).toBe(heureLocale("2026-11-11 21:05:05"));
    expect(marque.texte).toBe('Sortie de la "Vallée"');
  });
});

describe("séances et chapitres", () => {
  const h = (s: string) => heureLocale(s)!;
  // Warcraft Recorder : deux fichiers le 11 au soir (avec une pause de 2 min), un autre le lendemain
  const clips: Clip[] = [
    { fichier: "2026-11-12 18-00-00 - Manual.mp4", debut: h("2026-11-12 18-00-00"), duree: 600 },
    { fichier: "2026-11-11 21-00-00 - Manual.mp4", debut: h("2026-11-11 21-00-00"), duree: 1200 },
    { fichier: "2026-11-11 21-22-00 - Manual.mp4", debut: h("2026-11-11 21-22-00"), duree: 1800 },
  ];

  it("range les fichiers dans l'ordre chronologique et les regroupe par séance", () => {
    const s = seances(clips);
    expect(s).toHaveLength(2);
    expect(s[0].clips.map((c) => c.fichier)).toEqual(["2026-11-11 21-00-00 - Manual.mp4", "2026-11-11 21-22-00 - Manual.mp4"]);
    expect(s[0].duree).toBe(3000);
    // pendant la pause entre deux fichiers, aucune position dans la vidéo
    expect(positionDans(s[0], h("2026-11-11 21-21-00"))).toBeNull();
    expect(positionDans(s[0], h("2026-11-11 21-23-00"))).toBe(1260);
  });

  it("calcule les chapitres du personnage joué : départ, niveaux, marqueur, arrivée dans une zone", () => {
    const s = seances(clips)[0];
    const c = chapitres(s, reperesRouteProbe(lireTableLua(SAUVEGARDE)));
    expect(c.personnage).toBe("Grosorc-Forever");
    expect(c.valides).toBe(true);
    expect(c.liste.map((x) => `${horodatage(x.seconde)} ${x.titre}`)).toEqual([
      "0:00 Début de la séance · Durotar",          // zone vue dans la première minute (pas le démoniste de la veille)
      '5:00 Niveau 3 · Sortie de la "Vallée"',       // marqueur 5 s après le niveau : un seul chapitre
      "15:00 Arrivée : Les Tarides",
      "23:00 Niveau 4",                              // 21:25, dans le second fichier : 20 min + 3 min
    ]);
    expect(c.zones).toEqual(["Durotar", "Les Tarides"]);
    expect(c.niveaux).toEqual([3, 4]);
  });

  it("prépare un titre de 100 caractères au plus et une description avec les chapitres", () => {
    const s = seances(clips)[0];
    const c = chapitres(s, reperesRouteProbe(lireTableLua(SAUVEGARDE)));
    const titre = titreVideo(s, c);
    expect(titre).toBe("Journal de Jobwow · 11 novembre 2026 · Durotar → Les Tarides · niveaux 3 à 4");
    expect(titre.length).toBeLessThanOrEqual(100);
    const d = descriptionVideo(s, c, "https://www.taverne-eternelle.fr");
    expect(d).toContain("0:00 Début de la séance · Durotar");
    expect(d).toContain("https://www.taverne-eternelle.fr/carnet/");
  });

  it("sans trois chapitres, la description n'en affiche aucun (YouTube les ignorerait)", () => {
    const s = seances([clips[0]])[0];
    const c = chapitres(s, []);
    expect(c.valides).toBe(false);
    expect(descriptionVideo(s, c, "https://x")).not.toContain("Chapitres");
  });

  it("un marqueur de la première minute garde son chapitre", () => {
    const s = seances([clips[1]])[0];
    const r = [
      { heure: h("2026-11-11 21-00-02"), type: "zone" as const, texte: "Durotar", personnage: "A" },
      { heure: h("2026-11-11 21-00-15"), type: "niveau" as const, texte: "3", personnage: "A" },
      { heure: h("2026-11-11 21-00-30"), type: "marqueur" as const, texte: "Sortie de la Vallée", personnage: "A" },
      { heure: h("2026-11-11 21-05-00"), type: "zone" as const, texte: "Les Tarides", personnage: "A" },
    ];
    expect(chapitres(s, r).liste.map((x) => `${horodatage(x.seconde)} ${x.titre}`)).toEqual([
      "0:00 Début de la séance · Durotar · niveau 3",
      "0:30 Sortie de la Vallée",
      "5:00 Arrivée : Les Tarides",
    ]);
  });

  it("formate les horodatages comme YouTube", () => {
    expect(horodatage(0)).toBe("0:00");
    expect(horodatage(872)).toBe("14:32");
    expect(horodatage(3725)).toBe("1:02:05");
  });
});
