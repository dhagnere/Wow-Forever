import { describe, expect, it } from "vitest";
import { CLASSES } from "@/content/classes";
import { cheminAnglais, cheminFrancais, CLASSES_EN, languesDe, lienGuideEn, RACES_EN } from "@/lib/anglais";
import { combinaisons, guidePour } from "@/lib/guide";
import { messageEn, erreursEn } from "@/lib/messages-en";
import { blocageAjout, blocageRetrait } from "@/lib/calculateur";

describe("version anglaise", () => {
  it("relie chaque page française traduite à sa page anglaise, et retour", () => {
    const pages = [
      "/", "/guides/parcours/", "/classes/", "/races/",
      ...CLASSES.flatMap((c) => [`/classes/${c.slug}/`, `/classes/${c.slug}/talents/`]),
      ...combinaisons().map((c) => `/guides/parcours/${c.race.slug}/${c.classe.slug}/`),
    ];
    for (const fr of pages) {
      const en = cheminAnglais(fr);
      expect(en, fr).toMatch(/^\/en\//);
      expect(cheminFrancais(en!)).toBe(fr);
    }
    expect(cheminAnglais("/guides/parcours/humain/guerrier")).toBe("/en/leveling-guide/human/warrior/");
    expect(cheminAnglais("/classes/demoniste/talents/")).toBe("/en/classes/warlock/talents/");
  });

  it("n'invente pas de page anglaise", () => {
    expect(cheminAnglais("/actualites/")).toBeNull();
    expect(cheminAnglais("/classes/inconnue/")).toBeNull();
    expect(languesDe("/actualites/")).toBeUndefined();
    expect(cheminFrancais("/en/inconnue/")).toBe("/");
    expect(languesDe("/races/")).toEqual({ fr: "/races/", en: "/en/races/", "x-default": "/races/" });
  });

  it("donne des adresses anglaises uniques à toutes les classes et races", () => {
    const slugs = (t: Record<string, { slug: string }>) => Object.values(t).map((x) => x.slug);
    expect(new Set(slugs(CLASSES_EN)).size).toBe(Object.keys(CLASSES_EN).length);
    expect(new Set(slugs(RACES_EN)).size).toBe(Object.keys(RACES_EN).length);
    for (const c of CLASSES) expect(CLASSES_EN[c.slug], c.slug).toBeDefined();
    const liens = combinaisons().map((c) => lienGuideEn(c.race.slug, c.classe.slug));
    expect(new Set(liens).size).toBe(liens.length);
  });

  it("garde dans le guide anglais les mêmes quêtes que dans le guide français", () => {
    for (const { race, classe } of combinaisons().slice(0, 6)) {
      const ids = (l: "fr" | "en") => guidePour(race, classe.slug, l).flatMap((z) => z.etapes.map((e) => e.id)).sort((a, b) => a - b);
      const fr = new Set(ids("fr"));
      const en = ids("en");
      // Quelques quêtes peuvent manquer d'un côté (nom absent d'une base) : au moins 98 % en commun.
      expect(en.filter((id) => fr.has(id)).length / Math.max(fr.size, en.length)).toBeGreaterThan(0.98);
    }
  });

  it("traduit les messages du compte et laisse les inconnus tels quels", () => {
    expect(messageEn("Adresse ou mot de passe incorrect.")).toBe("Incorrect email address or password.");
    expect(messageEn("Trop d'essais : réessayez dans 15 minutes, ou choisissez un nouveau mot de passe.")).toMatch(/^Too many attempts: try again in 15 minutes/);
    expect(erreursEn({ motDePasse: "Au moins 10 caractères." })).toEqual({ motDePasse: "At least 10 characters." });
    expect(messageEn("Message nouveau.")).toBe("Message nouveau.");
  });

  it("explique en anglais pourquoi un point de talent est refusé", () => {
    const arbre = [{ id: 1, palier: 0, colonne: 0, rangs: 1, prerequisId: null }, { id: 2, palier: 1, colonne: 0, rangs: 1, prerequisId: null }];
    expect(blocageAjout([arbre], [[0, 0]], 0, 1, { arbre: "Fire", talent: () => "", en: true })).toBe("Requires 5 points in Fire.");
    expect(blocageRetrait([arbre], [[0, 0]], 0, 0, true)).toBe("No point to remove.");
  });
});
