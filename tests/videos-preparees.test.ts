import { existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { VIDEOS_PREPAREES, type VideoPreparee } from "@/content/videos-preparees";
import { markdownVersHtml } from "@/modules/veille";
import { chapitresDe, problemesLettres, problemesVideo, publication } from "@/lib/videosPreparees";

const EXEMPLE: VideoPreparee = {
  id: "2026-11-11-21h00",
  semaine: "2026-S46",
  date: "2026-11-11",
  fichiers: ["2026-11-11 21-00-00 - Manual.mp4"],
  liens: ["https://drive.google.com/file/d/xyz/view"],
  duree: "1:30:00",
  titre: "Journal de Jobwow · 11 novembre 2026 · Durotar → Les Tarides",
  description: "Une séance.\n\nChapitres :\n0:00 Départ\n14:32 Niveau 5\n1:02:05 Arrivée : Les Tarides",
};

describe("vidéos préparées pour YouTube", () => {
  it("lit les chapitres d'une description", () => {
    expect(chapitresDe(EXEMPLE.description)).toEqual([
      { seconde: 0, titre: "Départ" },
      { seconde: 872, titre: "Niveau 5" },
      { seconde: 3725, titre: "Arrivée : Les Tarides" },
    ]);
  });

  it("accepte une fiche conforme et signale les écarts aux règles de YouTube", () => {
    expect(problemesVideo(EXEMPLE)).toEqual([]);
    const mauvais = { ...EXEMPLE, titre: "x".repeat(101), description: "1:00 Trop tard\n1:05 Trop près", liens: [] };
    expect(problemesVideo(mauvais)).toEqual([
      "titre vide ou de plus de 100 caractères",
      "un lien par fichier",
      "le premier chapitre doit être à 0:00",
      "trois chapitres au moins",
      "chapitre « Trop près » à moins de 10 s du précédent",
    ]);
  });

  it("repère la vidéo publiée sur la chaîne d'après son titre", () => {
    const chaine = [{ titre: "journal de jobwow · 11 novembre 2026 · durotar → les tarides", lien: "https://www.youtube.com/watch?v=abc" }];
    expect(publication(EXEMPLE, chaine)?.lien).toBe("https://www.youtube.com/watch?v=abc");
    expect(publication({ ...EXEMPLE, titre: "Autre" }, chaine)).toBeUndefined();
  });

  it("chaque vidéo préparée respecte les règles", () => {
    const ids = new Set<string>();
    for (const v of VIDEOS_PREPAREES) {
      expect(problemesVideo(v), v.id).toEqual([]);
      expect(ids.has(v.id), `identifiant en double : ${v.id}`).toBe(false);
      ids.add(v.id);
    }
  });

  it("chaque miniature existe, au format de YouTube (1280 × 720, 2 Mo au plus)", async () => {
    for (const v of VIDEOS_PREPAREES.filter((x) => x.miniature)) {
      const fichier = path.join(process.cwd(), "public", v.miniature!);
      expect(existsSync(fichier), `${v.id} : ${v.miniature} introuvable`).toBe(true);
      expect(statSync(fichier).size, `${v.id} : miniature trop lourde`).toBeLessThanOrEqual(2 * 1024 * 1024);
      const { width, height } = await sharp(fichier).metadata();
      expect(`${width}×${height}`, v.id).toBe("1280×720");
    }
    expect(problemesVideo({ ...EXEMPLE, miniature: "https://ailleurs.example/image.jpg" })).toEqual(["miniature attendue dans /images/videos/ (jpg ou png)"]);
  });
});

describe("Lettres préparées", () => {
  it("chaque semaine a sa Lettre en français et en anglais, rendue par markdownVersHtml", () => {
    expect(problemesLettres(LETTRES_PREPAREES)).toEqual([]);
    for (const l of LETTRES_PREPAREES) expect(markdownVersHtml(l.corps).length, l.id).toBeGreaterThan(0);
  });

  it("signale une semaine à laquelle manque une langue", () => {
    expect(problemesLettres([{ id: "2026-S46-fr", semaine: "2026-S46", langue: "fr", sujet: "Semaine 46", corps: "Bonjour" }]))
      .toEqual(["semaine 2026-S46 : il faut une Lettre française et une anglaise"]);
  });
});
