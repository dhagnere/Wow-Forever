import { describe, expect, it } from "vitest";
import { REPLIQUES, GENRES_MOMENT, replique } from "@/content/repliques-jobwow";
import { choisirClips, evenementsSonde, grapheRendu, preparerNarration, typographie, verifierNarration, type Moment } from "@/lib/incrustation";
import { heureLocale, lireSauvegardeSonde, positionDans, type Seance } from "@/lib/videoCarnet";

// Jobwow incrusté dans les vidéos (npm run carnet:incrustation) : narration tirée des repères de la sonde, graphe ffmpeg.

const SAUVEGARDE = `EternalProbeDB = {
["personnage"] = "Jobwow-Forever",
["events"] = {
"100.0|clock|debut|2026-11-13 20:59:50",
"101.0|zone|Clairières de Tirisfal|1420|0.3|0.6",
"101.5|level|3|nouveau",
"115.0|zone|Clairières de Tirisfal|1420|0.3|0.6",
"118.0|turnin|364|Le réveil des morts",
"125.0|exploit|Capitaine Perrine|elite|1420|0.4|0.5",
"135.0|turnin|376|La faim maudite",
"140.0|level|4|nouveau",
"150.0|trainer|Dannal Stern|0|1420|0.6|0.5|4|Entraîneur de démons",
"160.0|mort|Clairières de Tirisfal|1420|0.4|0.4",
"170.0|livre|16321|Grimoire d'Éclair de feu|Kazrogal|Entraîneur de démons|1420|0.6|0.5|4",
},
}`;
const DEBUT = heureLocale("2026-11-13 21-00-00")!;

describe("Narration d'une vidéo", () => {
  const evts = evenementsSonde(lireSauvegardeSonde(SAUVEGARDE));
  const n = preparerNarration({ video: "essai.mp4", debut: DEBUT, dureeVideo: 75, evenements: evts, miniature: "mini.jpg", titre: "Essai" });

  it("lit les événements de la sonde, sans répéter une zone déjà annoncée", () => {
    expect(evts.map((e) => e.genre)).toEqual(["reprise", "zone", "niveau", "quete", "exploit", "quete", "niveau", "entraineur", "mort", "grimoire"]);
    expect(evts.find((e) => e.genre === "entraineur")?.valeurs.demons).toBe(true);
  });

  it("ouvre par une intro, puis un moment par repère fort, aux bonnes secondes et sans chevauchement", () => {
    expect(n.moments.map((m) => [m.seconde, m.genre])).toEqual([
      [0, "intro"], [8, "quete"], [15, "exploit"], [30, "niveau"], [40, "entraineur"], [50, "mort"], [60, "grimoire"],
    ]);
    expect(n.moments[0].sousTitre).toBe("Journal de Jobwow · Clairières de Tirisfal · niveau 3");
    expect(n.moments[2].bulle).toContain("Capitaine Perrine");
    expect(n.moments[4].bulle).toBe(REPLIQUES.entraineur[3]);
    expect(n.introSecondes).toBe(4);
    for (let i = 1; i < n.moments.length; i++) expect(n.moments[i].seconde).toBeGreaterThanOrEqual(n.moments[i - 1].seconde + n.moments[i - 1].duree);
  });

  it("ne commente qu'une quête rendue toutes les deux minutes", () => {
    expect(n.moments.filter((m) => m.genre === "quete")).toHaveLength(1);
  });

  it("donne les mêmes répliques à la même vidéo, d'autres à une autre", () => {
    const encore = preparerNarration({ video: "essai.mp4", debut: DEBUT, dureeVideo: 75, evenements: evts, miniature: null, titre: "Essai" });
    expect(encore.moments.map((m) => m.bulle)).toEqual(n.moments.map((m) => m.bulle));
    expect(encore.introSecondes).toBe(0); // pas de miniature, pas d'image de départ
    const autre = preparerNarration({ video: "autre.mp4", debut: DEBUT, dureeVideo: 75, evenements: evts, miniature: null, titre: "Essai" });
    expect(autre.moments.map((m) => m.bulle)).not.toEqual(n.moments.map((m) => m.bulle));
  });

  it("choisit des clips verticaux de 30 s autour des moments forts, dans la vidéo", () => {
    expect(n.clips).toEqual([{ debut: 18, duree: 30, titre: "Niveau 4 atteint" }]);
    const longs: Moment[] = [10, 200, 400, 600].map((s) => ({ seconde: s, duree: 5, genre: "niveau", bulle: "", sousTitre: `Niveau ${s}` }));
    const c = choisirClips(longs, 610);
    expect(c).toHaveLength(3);
    expect(c.every((x) => x.debut >= 0 && x.debut + x.duree <= 610)).toBe(true);
  });

  it("place les moments d'une séance de plusieurs fichiers, et laisse ceux qui tombent entre deux fichiers", () => {
    const debut = heureLocale("2026-11-13 21-00-00")!;
    const seance: Seance = {
      clips: [{ fichier: "a.mp4", debut, duree: 20 }, { fichier: "b.mp4", debut: debut + 300_000, duree: 20 }],
      debut, fin: debut + 320_000, duree: 40,
    };
    const e = (s: number, genre: "niveau" | "exploit" | "mort") => ({ heure: debut + s * 1000, genre, valeurs: { zone: "Durotar", niveau: "5", nom: "Gros dur" }, personnage: "J" });
    const m = preparerNarration({
      video: "s.mp4", debut, dureeVideo: 40, fin: seance.fin, position: (h) => positionDans(seance, h),
      evenements: [e(10, "niveau"), e(100, "exploit"), e(308, "mort")], miniature: null, titre: "S",
    }).moments;
    expect(m.map((x) => [x.seconde, x.genre])).toEqual([[0, "intro"], [10, "niveau"], [28, "mort"]]);
  });

  it("accepte la narration préparée et signale un fichier abîmé", () => {
    expect(verifierNarration(n)).toEqual([]);
    expect(verifierNarration({ ...n, moments: [{ seconde: 90, duree: 0, genre: "danse", bulle: "", sousTitre: "" }] })).toEqual([
      "Moment 1 : genre inconnu « danse ».", "Moment 1 : début ou durée invalide.", "Moment 1 : après la fin de la vidéo.",
    ]);
  });
});

describe("Répliques de Jobwow", () => {
  it("existent pour chaque genre, tiennent dans une bulle et ne citent ni classe ni guide", () => {
    for (const g of GENRES_MOMENT) {
      expect(REPLIQUES[g].length).toBeGreaterThanOrEqual(3);
      for (const r of REPLIQUES[g]) {
        expect(r.length).toBeLessThanOrEqual(95);
        expect(r).not.toMatch(/d[ée]moniste|guerrier|\bmage\b|pr[êe]tre|chasseur|voleur|druide|chaman|paladin|diablotin|zygor|wowhead/i);
      }
    }
    expect(replique("niveau", 0, { niveau: 7 })).toContain("Niveau 7");
  });

  it("met la typographie française", () => {
    expect(typographie("Niveau 4 ! C'est l'heure")).toBe("Niveau 4 ! C’est l’heure");
  });
});

describe("Graphe ffmpeg", () => {
  const plan = {
    largeur: 1920, hauteur: 1080, audio: true, dureeJeu: 75,
    intro: { fichier: "mini.jpg", secondes: 4 },
    medaillons: { normal: "n.png", mort: "m.png", niveau: "o.png", x: 50, y: 700, hauteur: 290 },
    etats: { parle: [[30, 35]] as [number, number][], mort: [[50, 61]] as [number, number][], niveau: [[30, 35]] as [number, number][] },
    calques: [{ fichier: "b.png", x: "364", y: "600", debut: 30, fin: 35 }],
  };

  it("met l'image de départ avant la partie, puis décale tout de sa durée", () => {
    const { entrees, graphe } = grapheRendu(plan);
    expect(entrees[0]).toEqual(["-loop", "1", "-framerate", "30", "-t", "4", "-i", "mini.jpg"]);
    expect(graphe).toContain("concat=n=2:v=1:a=1[v0][a0]");
    expect(graphe).toContain("enable='between(t,34,39)'");       // bulle de 30 à 35 s, après 4 s d'image de départ
    expect(graphe).toContain("enable='between(t,54,65)'");       // médaillon gris à la mort
    expect(graphe).toContain("enable='gte(t,4)'");               // médaillon caché pendant l'image de départ
    expect(graphe.trim().endsWith("[a0]anull[af]")).toBe(true);
  });

  it("ajoute un silence quand la vidéo n'a pas de son, et recadre le centre en vertical", () => {
    const { entrees, graphe } = grapheRendu({ ...plan, audio: false, intro: null, largeur: 1080, hauteur: 1920 });
    expect(entrees[0]).toEqual(["-f", "lavfi", "-t", "75", "-i", "anullsrc=r=48000:cl=stereo"]);
    expect(graphe).toContain("[0:v]scale=-2:1920,crop=1080:1920");
    expect(graphe).toContain("[1:a]aresample");
  });
});
