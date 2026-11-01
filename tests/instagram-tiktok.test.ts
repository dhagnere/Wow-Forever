import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const jetons = new Map<string, Record<string, unknown>>();
vi.mock("@/modules/veille/reseaux/jetons", () => ({
  lireJeton: async (r: string) => jetons.get(r) ?? null,
  enregistrerJeton: async (j: Record<string, unknown>) => void jetons.set(j.reseau as string, j),
  supprimerJeton: async (r: string) => void jetons.delete(r),
}));

const { publierReelInstagram } = await import("@/modules/veille/reseaux/instagram");
const { publierTiktok, jetonTiktok, choisirConfidentialite, urlRetourTiktok, urlAutorisationTiktok } = await import("@/modules/veille/reseaux/tiktok");

type Appel = { url: string; methode: string; corps: string; entetes: Record<string, string> };
let appels: Appel[] = [];
function simuler(reponses: (a: Appel) => unknown) {
  vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit = {}) => {
    const corps = init.body instanceof URLSearchParams ? init.body.toString() : init.body instanceof Uint8Array ? `${init.body.length} octets` : String(init.body ?? "");
    const a = { url: String(url), methode: init.method ?? "GET", corps, entetes: (init.headers ?? {}) as Record<string, string> };
    appels.push(a);
    return new Response(JSON.stringify(reponses(a)));
  }));
}

beforeEach(() => {
  appels = [];
  jetons.clear();
  process.env.SITE_URL = "https://azeroth-forever.fr";
  process.env.FACEBOOK_PAGE_ID = "111";
  process.env.FACEBOOK_PAGE_TOKEN = "jeton-page";
  delete process.env.INSTAGRAM_USER_ID;
  process.env.TIKTOK_CLIENT_KEY = "cle";
  process.env.TIKTOK_CLIENT_SECRET = "secret";
  delete process.env.TIKTOK_MODE;
});
afterEach(() => vi.unstubAllGlobals());

describe("Instagram", () => {
  it("retrouve le compte depuis la Page, attend le traitement puis publie le Reel", async () => {
    let tours = 0;
    simuler((a) => {
      if (a.url.includes("/111?")) return { instagram_business_account: { id: "999" } };
      if (a.url.endsWith("/999/media")) return { id: "conteneur" };
      if (a.url.includes("/conteneur?")) return { status_code: ++tours < 2 ? "IN_PROGRESS" : "FINISHED" };
      if (a.url.endsWith("/999/media_publish")) return { id: "media-42" };
      return {};
    });
    const id = await publierReelInstagram("https://azeroth-forever.fr/articles/a/video/", "Légende", async () => {});
    expect(id).toBe("media-42");
    const creation = new URLSearchParams(appels.find((a) => a.url.endsWith("/999/media"))!.corps);
    expect(creation.get("media_type")).toBe("REELS");
    expect(creation.get("video_url")).toBe("https://azeroth-forever.fr/articles/a/video/");
    expect(creation.get("caption")).toBe("Légende");
    expect(new URLSearchParams(appels.at(-1)!.corps).get("creation_id")).toBe("conteneur");
  });

  it("signale un traitement en échec", async () => {
    process.env.INSTAGRAM_USER_ID = "999";
    simuler((a) => (a.url.endsWith("/media") ? { id: "c" } : { status_code: "ERROR", status: "format refusé" }));
    await expect(publierReelInstagram("https://x/v/", "L", async () => {})).rejects.toThrow(/format refusé/);
  });
});

describe("TikTok", () => {
  const video = Buffer.alloc(3000);
  const jetonValide = () => jetons.set("tiktok", { reseau: "tiktok", compte: "silfax", acces: "acces-ok", rafraichissement: "r1", expireLe: new Date(Date.now() + 3_600_000), rafraichissementExpireLe: null });

  it("prépare une autorisation avec l'adresse de retour hors de /admin", () => {
    expect(urlRetourTiktok()).toBe("https://azeroth-forever.fr/reseaux/tiktok/retour/");
    const u = new URL(urlAutorisationTiktok("etat-1"));
    expect(u.searchParams.get("redirect_uri")).toBe(urlRetourTiktok());
    expect(u.searchParams.get("scope")).toContain("video.upload");
  });

  it("mode brouillon : envoie la vidéo dans la boîte de réception, en un seul morceau", async () => {
    jetonValide();
    simuler((a) => (a.url.includes("/inbox/video/init/") ? { data: { publish_id: "p1", upload_url: "https://upload.tiktok/u" }, error: { code: "ok" } } : {}));
    const r = await publierTiktok(video, "Légende");
    expect(r).toEqual({ publishId: "p1", mode: "brouillon" });
    expect(JSON.parse(appels[0].corps).source_info).toEqual({ source: "FILE_UPLOAD", video_size: 3000, chunk_size: 3000, total_chunk_count: 1 });
    expect(appels[0].entetes.Authorization).toBe("Bearer acces-ok");
    expect(appels[1]).toMatchObject({ url: "https://upload.tiktok/u", methode: "PUT", corps: "3000 octets" });
    expect(appels[1].entetes["Content-Range"]).toBe("bytes 0-2999/3000");
  });

  it("mode direct : légende et confidentialité la plus ouverte permise", async () => {
    process.env.TIKTOK_MODE = "direct";
    jetonValide();
    simuler((a) => {
      if (a.url.includes("creator_info")) return { data: { privacy_level_options: ["SELF_ONLY", "FOLLOWER_OF_CREATOR"] }, error: { code: "ok" } };
      if (a.url.includes("/video/init/")) return { data: { publish_id: "p2", upload_url: "https://upload.tiktok/u" }, error: { code: "ok" } };
      return {};
    });
    await publierTiktok(video, "Légende TikTok");
    const init = JSON.parse(appels[1].corps);
    expect(init.post_info.title).toBe("Légende TikTok");
    expect(init.post_info.privacy_level).toBe("FOLLOWER_OF_CREATOR");
  });

  it("renouvelle un jeton qui expire et garde le nouveau", async () => {
    jetons.set("tiktok", { reseau: "tiktok", compte: "silfax", acces: "vieux", rafraichissement: "r1", expireLe: new Date(Date.now() + 60_000), rafraichissementExpireLe: null });
    simuler(() => ({ access_token: "neuf", refresh_token: "r2", expires_in: 86400, refresh_expires_in: 31536000 }));
    expect(await jetonTiktok()).toBe("neuf");
    expect(new URLSearchParams(appels[0].corps).get("grant_type")).toBe("refresh_token");
    expect(jetons.get("tiktok")).toMatchObject({ acces: "neuf", rafraichissement: "r2", compte: "silfax" });
  });

  it("préfère la publication publique quand elle est permise", () => {
    expect(choisirConfidentialite(["SELF_ONLY", "PUBLIC_TO_EVERYONE"])).toBe("PUBLIC_TO_EVERYONE");
    expect(choisirConfidentialite(["SELF_ONLY"])).toBe("SELF_ONLY");
  });

  it("refuse de publier sans compte relié", async () => {
    await expect(publierTiktok(video, "L")).rejects.toThrow(/Aucun compte TikTok relié/);
  });
});
