import { describe, expect, it } from "vitest";
import { miniatureDe } from "@/lib/miniatureVideo";
import { idVideoValide } from "@/modules/veille";
import type { VideoPreparee } from "@/content/videos-preparees";

const preparee = { titre: "Journal de Jobwow · 13 novembre 2026 · Clairières de Tirisfal · niveaux 1 à 5", miniature: "/images/videos/journal-2026-11-13.jpg" } as VideoPreparee;

describe("image des vidéos de la chaîne", () => {
  it("prend la miniature gardée par le site quand la vidéo a été préparée", () => {
    expect(miniatureDe({ id: "jQJ2kDbuUUM", titre: preparee.titre }, [preparee])).toBe("/images/videos/journal-2026-11-13.jpg");
  });

  it("sinon, sert celle de YouTube depuis le site, jamais une adresse de Google", () => {
    const src = miniatureDe({ id: "ZoMQeq9FRPM", titre: "Journal de Jobwow · 14 novembre 2026 · Durotar · niveaux 5 à 12" }, [preparee]);
    expect(src).toBe("/carnet/videos/miniature/ZoMQeq9FRPM/");
    expect(src).not.toMatch(/ytimg|google|youtube/);
  });

  it("n'accepte que des identifiants de vidéo YouTube", () => {
    expect(idVideoValide("ZoMQeq9FRPM")).toBe(true);
    expect(idVideoValide("../../etc")).toBe(false);
    expect(idVideoValide("abc")).toBe(false);
  });
});
