import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { PERSONNAGES, personnageDuNom } from "@/content/personnages";
import { fichiersDeJournee, nomJournee, personnageDesNarrations, personnagesDesEnregistrements, reclasserJournee } from "@/lib/rangement";
import type { Evenement } from "@/lib/incrustation";

const J = PERSONNAGES.jobwow, T = PERSONNAGES.thesham;
const H = Date.parse("2026-11-18T19:00:00Z");
const evt = (min: number, personnage: string): Evenement => ({ heure: H + min * 60000, genre: "zone", valeurs: {}, personnage } as Evenement);

describe("Rangement des vidéos par personnage", () => {
  it("donne à chaque personnage son dossier, ses noms et son rendu", () => {
    expect(new Set(Object.values(PERSONNAGES).map((p) => p.dossier)).size).toBe(Object.keys(PERSONNAGES).length);
    expect(new Set(Object.values(PERSONNAGES).map((p) => p.prefixe)).size).toBe(Object.keys(PERSONNAGES).length);
    expect([J.dossier, J.prefixe]).toEqual(["Journal de Jobwow", "journal-jobwow"]); // rien ne change pour Jobwow
    expect([T.dossier, T.prefixe]).toEqual(["Journal de Jobwow TheSham", "journal-thesham"]);
    expect(nomJournee(T, "2026-11-18")).toBe("journal-thesham_2026-11-18");
    expect(personnageDuNom("D:\\WOW\\Journal de Jobwow TheSham\\journal-thesham_2026-11-18_p2.narration.json")?.id).toBe("thesham");
    expect(personnageDuNom("journal-jobwow_2026-11-18.mp4")?.id).toBe("jobwow");
    expect(personnageDuNom("2026-11-18 20-00-00.mp4")).toBeNull();
  });

  it("rend chaque enregistrement au personnage vu en jeu, sinon au plus proche du même jour, sinon à Jobwow", () => {
    const clips = [
      { debut: H, duree: 600 },                    // TheSham vu en jeu
      { debut: H + 15 * 60000, duree: 300 },       // sans repère : le plus proche (TheSham)
      { debut: H + 60 * 60000, duree: 600 },       // Jobwow vu en jeu
      { debut: H + 86400000, duree: 300 },         // autre jour, sans repère : Jobwow
    ];
    const evts = [evt(2, "Jobwowthesham-Forever"), evt(5, "Jobwowthesham-Forever"), evt(62, "Jobwow-Forever")];
    expect(personnagesDesEnregistrements(clips, evts).map((p) => p.id)).toEqual(["thesham", "thesham", "jobwow", "jobwow"]);
    expect(personnagesDesEnregistrements(clips, evts, "thesham").map((p) => p.id)).toEqual(["thesham", "thesham", "thesham", "thesham"]);
  });

  it("déplace une journée chez le personnage que dit sa narration, Téléchargements compris", () => {
    const racine = mkdtempSync(path.join(tmpdir(), "rangement-"));
    const dj = path.join(racine, J.dossier), dt = path.join(racine, T.dossier), tel = path.join(racine, "Downloads");
    mkdirSync(dj); mkdirSync(tel);
    const narr = (o: object) => JSON.stringify({ format: 1, titre: "Journal de Jobwow · 18 novembre 2026", moments: [{ seconde: 0, duree: 6, genre: "intro", bulle: "x", sousTitre: "Journal de Jobwow · Durotar" }], clips: [], ...o });
    writeFileSync(path.join(dj, "journal-jobwow_2026-11-18.mp4"), "video");
    writeFileSync(path.join(dj, "journal-jobwow_2026-11-18.parties.json"), JSON.stringify({ format: 1, video: "journal-jobwow_2026-11-18.mp4", parties: [] }));
    writeFileSync(path.join(dj, "journal-jobwow_2026-11-18_p1.narration.json"), narr({ video: "journal-jobwow_2026-11-18.mp4", relue: true, partie: { numero: 1, total: 2, journee: "journal-jobwow_2026-11-18" } }));
    writeFileSync(path.join(dj, "journal-jobwow_2026-11-18_p2.narration.json"), narr({ video: "journal-jobwow_2026-11-18.mp4", partie: { numero: 2, total: 2, journee: "journal-jobwow_2026-11-18" } }));
    writeFileSync(path.join(dj, "journal-jobwow_2026-11-19.mp4"), "autre jour");
    // validée dans l'Atelier pour TheSham
    writeFileSync(path.join(tel, "journal-jobwow_2026-11-18_p1.narration (1).json"), narr({ video: "journal-jobwow_2026-11-18.mp4", valide: "2026-11-18T21:00:00Z", profil: "thesham", miniature: "journal-jobwow_2026-11-18_p1.miniature.jpg" }));

    const fichiers = [...fichiersDeJournee(dj, "journal-jobwow_2026-11-18").map((f) => path.join(dj, f)), ...fichiersDeJournee(tel, "journal-jobwow_2026-11-18").map((f) => path.join(tel, f))];
    expect(fichiers).toHaveLength(5); // l'autre jour n'en fait pas partie
    expect(personnageDesNarrations(fichiers)?.id).toBe("thesham");

    reclasserJournee({ cle: "2026-11-18", de: J, vers: T, dossierDe: dj, dossierVers: dt, telechargements: tel });
    expect(existsSync(path.join(dt, "journal-thesham_2026-11-18.mp4"))).toBe(true);
    expect(existsSync(path.join(dj, "journal-jobwow_2026-11-19.mp4"))).toBe(true);
    const p1 = JSON.parse(readFileSync(path.join(dt, "journal-thesham_2026-11-18_p1.narration.json"), "utf8"));
    expect(p1).toMatchObject({ video: "journal-thesham_2026-11-18.mp4", profil: "thesham", titre: "Journal de Jobwow TheSham · 18 novembre 2026" });
    expect(p1.partie.journee).toBe("journal-thesham_2026-11-18");
    expect(p1.moments[0].sousTitre).toBe("Journal de Jobwow TheSham · Durotar");
    // la partie 2, pas encore relue, sera préparée de nouveau avec les répliques de TheSham
    expect(existsSync(path.join(dt, "journal-thesham_2026-11-18_p2.narration.avant.json"))).toBe(true);
    expect(JSON.parse(readFileSync(path.join(dt, "journal-thesham_2026-11-18.parties.json"), "utf8")).video).toBe("journal-thesham_2026-11-18.mp4");
    // la copie validée reste dans les Téléchargements, sous le nouveau nom, pour être reprise comme d'habitude
    const v = JSON.parse(readFileSync(path.join(tel, "journal-thesham_2026-11-18_p1.narration (1).json"), "utf8"));
    expect(v).toMatchObject({ video: "journal-thesham_2026-11-18.mp4", miniature: "journal-thesham_2026-11-18_p1.miniature.jpg", profil: "thesham" });
  });

  it("recalcule le chemin d'un enregistrement d'origine resté dans D:\\WOW", () => {
    const racine = mkdtempSync(path.join(tmpdir(), "rangement-"));
    const dj = path.join(racine, J.dossier), dt = path.join(racine, T.dossier);
    mkdirSync(dj);
    writeFileSync(path.join(dj, "journal-jobwow_2026-11-20.narration.json"), JSON.stringify({ format: 1, video: path.join("..", "2026-11-20 20-00-00.mp4"), valide: "x", profil: "thesham", titre: "t", moments: [], clips: [] }));
    reclasserJournee({ cle: "2026-11-20", de: J, vers: T, dossierDe: dj, dossierVers: dt });
    const n = JSON.parse(readFileSync(path.join(dt, "journal-thesham_2026-11-20.narration.json"), "utf8"));
    expect(path.resolve(dt, n.video)).toBe(path.join(racine, "2026-11-20 20-00-00.mp4"));
  });
});
