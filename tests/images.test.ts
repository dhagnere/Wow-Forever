import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { ErreurImage, preparerImage } from "@/modules/veille/medias/images";
import { requeteFacebook } from "@/modules/veille/facebook/relais";
import { verifierPublication } from "@/modules/veille/articles/publication";

async function imageTest(largeur: number, hauteur: number, format: "png" | "jpeg" | "webp" = "png", exif = false) {
  let img = sharp({ create: { width: largeur, height: hauteur, channels: 3, background: { r: 200, g: 150, b: 60 } } });
  if (exif) img = img.withMetadata({ exif: { IFD0: { Copyright: "secret", Make: "Téléphone" } } });
  return img.toFormat(format).toBuffer();
}

describe("préparation des images", () => {
  it("redimensionne l'en-tête à 1600 px et produit un recadrage 1200 × 630, en JPEG", async () => {
    const r = await preparerImage(await imageTest(3000, 2000));
    expect(r.largeur).toBe(1600);
    expect(r.hauteur).toBe(1067);
    const og = await sharp(r.donneesOg).metadata();
    expect([og.format, og.width, og.height]).toEqual(["jpeg", 1200, 630]);
    expect((await sharp(r.donnees).metadata()).format).toBe("jpeg");
  });

  it("n'agrandit pas une image plus petite que 1600 px", async () => {
    expect((await preparerImage(await imageTest(900, 600, "webp"))).largeur).toBe(900);
  });

  it("retire les métadonnées de l'appareil", async () => {
    const r = await preparerImage(await imageTest(1300, 800, "jpeg", true));
    const meta = await sharp(r.donnees).metadata();
    expect(meta.exif).toBeUndefined();
  });

  it("refuse les fichiers qui ne sont pas des images, les images trop petites ou trop lourdes", async () => {
    await expect(preparerImage(Buffer.from("<script>alert(1)</script>"))).rejects.toBeInstanceOf(ErreurImage);
    await expect(preparerImage(await imageTest(400, 300))).rejects.toThrow(/trop petite/);
    await expect(preparerImage(Buffer.alloc(9 * 1024 * 1024))).rejects.toThrow(/trop lourde/);
    await expect(preparerImage(Buffer.alloc(0))).rejects.toThrow(/vide/);
  });
});

describe("post Facebook", () => {
  const base = { accrocheFacebook: "Accroche", texteFacebook: "Texte.", slug: "un-article", titre: "Titre" };

  it("publie un post photo quand une image propre au post existe", () => {
    process.env.SITE_URL = "https://azeroth-forever.fr";
    const r = requeteFacebook({ ...base, imageFacebookId: 42 });
    expect(r.chemin).toBe("photos");
    expect(r.params.url).toBe("https://azeroth-forever.fr/medias/42/");
    expect(r.params.message).toContain("La suite ici : https://azeroth-forever.fr/articles/un-article/");
  });

  it("publie un post lien sinon", () => {
    const r = requeteFacebook({ ...base, imageFacebookId: null });
    expect(r.chemin).toBe("feed");
    expect(r.params.link).toBe("https://azeroth-forever.fr/articles/un-article/");
  });
});

describe("description de l'image", () => {
  it("est exigée pour publier un article illustré", () => {
    const article = {
      titre: "WoW Forever sort le 5 novembre",
      corps: "x".repeat(400),
      avisSilfax: "J'attends surtout les nouveaux donjons : la salle des Thanes m'intrigue, et je commencerai en Druide tauren.",
      rubrique: "actualites" as const,
      description: "Tout savoir sur la sortie de WoW Forever le 5 novembre : horaire, abonnement, codes d'invitation.",
    };
    expect(verifierPublication({ ...article, image: { id: 1, alt: "", credit: "" } }).join(" ")).toMatch(/Décrivez l'image/);
    expect(verifierPublication({ ...article, image: { id: 1, alt: "Un tauren druide devant Mulgore", credit: "" } })).toEqual([]);
    expect(verifierPublication({ ...article, image: null })).toEqual([]);
  });
});
