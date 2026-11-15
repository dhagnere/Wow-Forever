import { describe, expect, it } from "vitest";
import { preparerNarration, evenementsSonde, verifierNarration } from "@/lib/incrustation";
import {
  choisirParties, coupesPossibles, coupesProposees, memesBornes, nomPartie, PARTIE_MAX, PARTIE_PLANCHER, seanceDePartie, signauxSonde, verifierDecoupage,
} from "@/lib/parties";
import { descriptionVideo, heureLocale, lireSauvegardeSonde, positionDans, titreVideo, type Seance } from "@/lib/videoCarnet";

// Découpage des longues soirées en parties de 15 à 20 minutes (npm run carnet, lib/parties.ts).

const SAUVEGARDE = `EternalProbeDB = {
["personnage"] = "Jobwow-Forever",
["events"] = {
"0.0|clock|debut|2026-11-15 20:00:00",
"5.0|zone|Clairières de Tirisfal|1420|0.3|0.6",
"300.0|accept|101|Les pommes de Brill",
"400.0|obj|101|1|1|8|item|1420|0.5|0.5|Pomme",
"500.0|obj|101|1|4|8|item|1420|0.5|0.5|Pomme",
"600.0|obj|101|1|8|8|item|1420|0.5|0.5|Pomme",
"650.0|turnin|101|Les pommes de Brill",
"900.0|level|6|nouveau",
"1000.0|accept|102|Les rats du moulin",
"1050.0|obj|102|1|1|10|monster|1420|0.5|0.5|Rat",
"1100.0|obj|102|1|3|10|monster|1420|0.5|0.5|Rat",
"1060.0|trajet|debut|Zeppelin pour Orgrimmar|Clairières de Tirisfal|1420|0.6|0.6",
"1300.0|zone|Durotar|1411|0.4|0.4",
"1700.0|mort|Durotar|1411|0.4|0.4",
"1900.0|obj|103|1|2|10|monster|1411|0.5|0.5|Scorpide",
"2100.0|vol|depart|1411|0.5|0.5",
"2400.0|zone|Les Tarides|1413|0.5|0.5",
"2600.0|level|7|nouveau",
},
}`;
const DEBUT = heureLocale("2026-11-15 20-00-00")!;
const UNE: Seance = { clips: [{ fichier: "a.mp4", debut: DEBUT, duree: 3000 }], debut: DEBUT, fin: DEBUT + 3000_000, duree: 3000 };
const db = lireSauvegardeSonde(SAUVEGARDE);
const signaux = signauxSonde(db);

describe("Signaux de la sonde", () => {
  it("lit les fins de chapitre et l'activité, sans compter la première zone d'un enregistrement", () => {
    expect(signaux.map((s) => s.genre)).toEqual([
      "accepte", "objectif", "objectif", "objectif", "quete", "niveau", "accepte", "objectif", "trajet", "objectif",
      "zone", "mort", "objectif", "vol", "zone", "niveau",
    ]);
    expect(signaux.find((s) => s.genre === "trajet")?.texte).toBe("Zeppelin pour Orgrimmar");
    expect(signaux.find((s) => s.genre === "objectif")?.objectif).toEqual({ rang: 1, fait: 1, requis: 8 });
  });
});

describe("Coupes possibles", () => {
  const coupes = coupesPossibles({ seance: UNE, dureeVideo: 3000, signaux });
  const a = (t: number) => coupes.find((c) => Math.abs(c.seconde - t) < 0.2)!;

  it("place la coupe après l'événement, le temps que la bulle finisse", () => {
    expect(a(1068)).toMatchObject({ raison: "Embarquement : Zeppelin pour Orgrimmar", score: 100 });
    expect(a(2108)).toMatchObject({ raison: "Départ en vol", score: 90 });
    expect(a(1300.5).raison).toBe("Arrivée : Durotar");
  });

  it("préfère une quête rendue quand plus rien n'est entamé", () => {
    expect(a(656)).toMatchObject({ raison: "Quête rendue : Les pommes de Brill", score: 75 });
  });

  it("évite la mort et le retour au corps, et pénalise un objectif à moitié fait", () => {
    expect(a(1710).score).toBeLessThan(-100);
    expect(a(1710).raison).toContain("pendant une mort");
    expect(a(1110).raison).toContain("objectif de quête à moitié fait");
    expect(a(1110).score).toBeLessThan(0);
  });

  it("garde dans le fichier les fins de chapitre et les coupes choisies, pas toute la grille", () => {
    const parties = choisirParties(coupes, 3000);
    const gardees = coupesProposees(coupes, parties);
    expect(gardees.length).toBeLessThan(coupes.length / 3);
    expect(gardees.every((c) => !c.raison.startsWith("Moment calme") || c.score >= 20)).toBe(true);
    for (const p of parties.slice(1)) expect(gardees.some((c) => Math.abs(c.seconde - p.debut) < 0.2)).toBe(true);
  });
});

describe("Choix des parties", () => {
  it("ne coupe pas une vidéo de 20 minutes ou moins", () => {
    expect(choisirParties([], 1150)).toEqual([{ numero: 1, debut: 0, duree: 1150, coupe: null }]);
  });

  it("coupe une soirée de 50 minutes aux fins de chapitre, chaque partie entre 8 et 20 minutes", () => {
    const parties = choisirParties(coupesPossibles({ seance: UNE, dureeVideo: 3000, signaux }), 3000);
    expect(parties.map((p) => [p.debut, p.duree])).toEqual([[0, 1068], [1068, 1040], [2108, 892]]);
    expect(parties.map((p) => p.coupe)).toEqual(["Embarquement : Zeppelin pour Orgrimmar", "Départ en vol", null]);
    for (const p of parties) {
      expect(p.duree).toBeLessThanOrEqual(PARTIE_MAX);
      expect(p.duree).toBeGreaterThanOrEqual(PARTIE_PLANCHER);
    }
    expect(verifierDecoupage({ format: 1, dureeVideo: 3000, parties, coupes: [] })).toEqual([]);
  });

  it("coupe de préférence entre deux enregistrements", () => {
    const deux: Seance = {
      clips: [{ fichier: "a.mp4", debut: DEBUT, duree: 1100 }, { fichier: "b.mp4", debut: DEBUT + 1400_000, duree: 1100 }],
      debut: DEBUT, fin: DEBUT + 2500_000, duree: 2200,
    };
    const parties = choisirParties(coupesPossibles({ seance: deux, dureeVideo: 2200, signaux: [] }), 2200);
    expect(parties).toEqual([
      { numero: 1, debut: 0, duree: 1100, coupe: "Pause entre deux enregistrements" },
      { numero: 2, debut: 1100, duree: 1100, coupe: null },
    ]);
  });

  it("sans aucun repère, coupe quand même en parties de 20 minutes au plus", () => {
    const longue: Seance = { clips: [{ fichier: "a.mp4", debut: DEBUT, duree: 5000 }], debut: DEBUT, fin: DEBUT + 5000_000, duree: 5000 };
    const parties = choisirParties(coupesPossibles({ seance: longue, dureeVideo: 5000, signaux: [] }), 5000);
    expect(parties.length).toBeGreaterThanOrEqual(5);
    expect(parties.reduce((t, p) => t + p.duree, 0)).toBeCloseTo(5000, 0);
    for (const p of parties) expect(p.duree).toBeLessThanOrEqual(PARTIE_MAX);
  });
});

describe("Une partie, comme une vidéo à part", () => {
  it("donne la séance de la partie, à cheval sur deux fichiers", () => {
    const deux: Seance = {
      clips: [{ fichier: "a.mp4", debut: DEBUT, duree: 1000 }, { fichier: "b.mp4", debut: DEBUT + 1200_000, duree: 1000 }],
      debut: DEBUT, fin: DEBUT + 2200_000, duree: 2000,
    };
    const p = seanceDePartie(deux, { debut: 900, duree: 600 });
    expect(p.clips).toEqual([{ fichier: "a.mp4", debut: DEBUT + 900_000, duree: 100 }, { fichier: "b.mp4", debut: DEBUT + 1200_000, duree: 500 }]);
    expect(p.duree).toBe(600);
    expect(positionDans(p, DEBUT + 1300_000)).toBe(200);
  });

  it("prépare la narration de la partie : secondes depuis son début, ses propres répliques", () => {
    const ps = seanceDePartie(UNE, { debut: 1068, duree: 1040 });
    const evts = evenementsSonde(db);
    const n = preparerNarration({
      video: "journal.mp4", debut: ps.debut, dureeVideo: 1040, evenements: evts, fin: ps.fin, position: (h) => positionDans(ps, h),
      miniature: null, titre: "Partie 2", graine: "journal.mp4#partie-2",
    });
    n.extrait = { debut: 1068, duree: 1040 };
    expect(n.moments[0]).toMatchObject({ seconde: 0, genre: "intro" });
    expect(n.moments[0].sousTitre).toBe("Journal de Jobwow · Clairières de Tirisfal · niveau 6");
    expect(n.moments.find((m) => m.genre === "zone")?.seconde).toBe(232);
    expect(n.moments.every((m) => m.seconde < 1040)).toBe(true);
    expect(verifierNarration(n)).toEqual([]);
    const autre = preparerNarration({ video: "journal.mp4", debut: ps.debut, dureeVideo: 1040, evenements: evts, fin: ps.fin, position: (h) => positionDans(ps, h), miniature: null, titre: "x" });
    expect(autre.moments[0].sousTitre).toBe(n.moments[0].sousTitre);
  });

  it("numérote la partie dans le titre et la situe dans la description", () => {
    const ps = seanceDePartie(UNE, { debut: 1068, duree: 1040 });
    expect(titreVideo(ps, { zones: ["Durotar"], niveaux: [6, 6] }, 2)).toBe("Journal de Jobwow · 15 novembre 2026 – partie 2 · Durotar · niveau 6");
    const d = descriptionVideo(ps, { liste: [], valides: false, zones: ["Durotar"] }, "https://x", {}, { numero: 2, total: 3 });
    expect(d).toContain("Partie 2 sur 3 de la soirée du 15 novembre 2026 : la partie 1 la précède, la partie 3 la suit.");
    expect(descriptionVideo(ps, { liste: [], valides: false, zones: [] }, "https://x", {})).not.toContain("Partie");
  });

  it("nomme les fichiers et repère une coupe déplacée", () => {
    expect(nomPartie("journal-jobwow_2026-11-15", 2)).toBe("journal-jobwow_2026-11-15_p2");
    expect(memesBornes({ debut: 1068, duree: 1040 }, { debut: 1068.05, duree: 1040 })).toBe(true);
    expect(memesBornes({ debut: 1068, duree: 1040 }, { debut: 1100, duree: 1008 })).toBe(false);
    expect(memesBornes(undefined, { debut: 0, duree: 1 })).toBe(false);
  });

  it("refuse un découpage troué ou mal numéroté", () => {
    expect(verifierDecoupage({ format: 1, dureeVideo: 100, parties: [{ numero: 1, debut: 0, duree: 40 }, { numero: 3, debut: 50, duree: 50 }] }))
      .toEqual(["Partie 2 : numéro 3 inattendu.", "Partie 2 : elle doit commencer à la fin de la précédente."]);
  });
});
