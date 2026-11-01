import { afterEach, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { phraseAppel } from "@/config/reseaux";
import { longueurX, texteReseau } from "@/modules/veille/reseaux/textes";
import { videoDepuisImage } from "@/modules/veille/reels/video";
import { publierReel } from "@/modules/veille/reels/publication";

process.env.SITE_URL = "https://azeroth-forever.fr";
const article = {
  accrocheFacebook: "Le mineur kobold, tueur numéro 1 de la bêta",
  texteFacebook: "Blizzard dévoile le bilan de la bêta : près de 9 millions de personnages, un million de chutes mortelles et un kobold redoutable. ".repeat(3),
  slug: "bilan-beta",
  titre: "Bêta de WoW Forever : le bilan",
};

afterEach(() => vi.unstubAllGlobals());

describe("phrase d'appel à l'action", () => {
  it("est la même, mot pour mot, sur tous les réseaux", () => {
    expect(phraseAppel()).toBe("👉 Abonne-toi à Azeroth Forever pour ne rien rater de WoW Forever, et retrouve tous nos guides sur azeroth-forever.fr");
    for (const r of ["facebook", "reel", "x", "instagram", "tiktok"] as const) expect(texteReseau(r, article)).toContain(phraseAppel());
  });
  it("garde le lien vers l'article sur Facebook et X, et renvoie vers le site ailleurs", () => {
    expect(texteReseau("facebook", article)).toContain("La suite ici : https://azeroth-forever.fr/articles/bilan-beta/");
    expect(texteReseau("x", article)).toContain("https://azeroth-forever.fr/articles/bilan-beta/");
    expect(texteReseau("instagram", article)).toContain("lien dans la bio");
    expect(texteReseau("instagram", article)).not.toContain("https://");
  });
  it("tient dans les 280 caractères de X", () => {
    expect(longueurX(texteReseau("x", article))).toBeLessThanOrEqual(280);
  });
});

describe("vidéo du Reel", () => {
  it("fabrique un MP4 vertical 1080 × 1920 en H.264 avec piste audio", async () => {
    const image = await sharp({ create: { width: 1080, height: 1920, channels: 3, background: "#182a48" } }).png().toBuffer();
    const video = await videoDepuisImage(image, 3);
    expect(video.subarray(4, 8).toString()).toBe("ftyp");
    const fichier = path.join(mkdtempSync(path.join(tmpdir(), "reel-test-")), "r.mp4");
    writeFileSync(fichier, video);
    let infos = "";
    try {
      execFileSync(ffmpeg.path, ["-hide_banner", "-i", fichier], { stdio: "pipe" });
    } catch (e) {
      infos = String((e as { stderr?: Buffer }).stderr ?? "");
    }
    expect(infos).toMatch(/Video: h264/);
    expect(infos).toMatch(/1080x1920/);
    expect(infos).toMatch(/Audio: aac/);
  }, 60_000);
});

describe("publication du Reel", () => {
  it("enchaîne ouverture, envoi du fichier et publication avec la description", async () => {
    process.env.FACEBOOK_PAGE_ID = "123";
    process.env.FACEBOOK_PAGE_TOKEN = "jeton";
    const appels: { url: string; corps: string }[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit) => {
      appels.push({ url, corps: init.body instanceof URLSearchParams ? init.body.toString() : `${(init.body as Uint8Array).length} octets` });
      if (url.includes("rupload")) return new Response(JSON.stringify({ success: true }));
      if (String(init.body).includes("upload_phase=start")) return new Response(JSON.stringify({ video_id: "987", upload_url: "https://rupload.facebook.com/video-upload/v21.0/987" }));
      return new Response(JSON.stringify({ success: true }));
    }));
    const id = await publierReel(Buffer.alloc(2048), texteReseau("reel", article));
    expect(id).toBe("987");
    expect(appels.map((a) => a.url)).toEqual([
      "https://graph.facebook.com/v21.0/123/video_reels",
      "https://rupload.facebook.com/video-upload/v21.0/987",
      "https://graph.facebook.com/v21.0/123/video_reels",
    ]);
    expect(appels[1].corps).toBe("2048 octets");
    expect(decodeURIComponent(appels[2].corps.replace(/\+/g, " "))).toContain("Abonne-toi à Azeroth Forever");
  });
});
