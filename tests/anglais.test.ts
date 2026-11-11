import { describe, expect, it } from "vitest";
import { CLASSES } from "@/content/classes";
import { cheminAnglais, cheminFrancais, CLASSES_EN, languesDe, lienGuideEn, LIEUX_EN, nomDonjonEn, RACES_EN } from "@/lib/anglais";
import { tousLesLieux } from "@/lib/cartes";
import { DONJONS, ZONES } from "@/content/monde";
import { ZONES_EN } from "@/content/monde-en";
import { DONJONS_ORIGINE, RAIDS } from "@/content/reference";
import { prixEnTexte, qualite, emplacement } from "@/modules/veille";
import { combinaisons, guidePour } from "@/lib/guide";
import { messageEn, erreursEn } from "@/lib/messages-en";
import { blocageAjout, blocageRetrait } from "@/lib/calculateur";

describe("version anglaise", () => {
  it("relie chaque page française traduite à sa page anglaise, et retour", () => {
    const pages = [
      "/", "/guides/parcours/", "/classes/", "/races/",
      ...CLASSES.flatMap((c) => [`/classes/${c.slug}/`, `/classes/${c.slug}/talents/`]),
      ...combinaisons().map((c) => `/guides/parcours/${c.race.slug}/${c.classe.slug}/`),
      "/cartes/", "/base-de-donnees/", "/base-de-donnees/objets/", "/base-de-donnees/objets/19019/",
      "/zones/", "/donjons/", "/races/skyborne/", "/guides/bien-demarrer/", "/guides/zones-de-depart/", "/guides/zones-par-niveau/",
      "/guides/liste-des-donjons/", "/guides/quetes-de-classe/",
      ...ZONES.map((z) => `/zones/${z.slug}/`), ...DONJONS.map((d) => `/donjons/${d.slug}/`),
      ...CLASSES.map((c) => `/guides/quetes-de-classe/${c.slug}/`),
      ...tousLesLieux().map((l) => `/cartes/${l}/`),
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
    expect(cheminAnglais("/admin/veille/")).toBeNull();
    expect(cheminAnglais("/lettre/")).toBe("/en/newsletter/");
    expect(cheminAnglais("/carnet/")).toBe("/en/notebook/");
    expect(cheminAnglais("/carnet/videos/")).toBe("/en/notebook/videos/");
    expect(cheminFrancais("/en/notebook/videos/")).toBe("/carnet/videos/");
    expect(cheminAnglais("/classes/inconnue/")).toBeNull();
    expect(languesDe("/guildes/modifier/abc/")).toBeUndefined();
    expect(cheminAnglais("/soutenir/")).toBe("/en/support/");
    expect(cheminAnglais("/a-propos/")).toBe("/en/about/");
    expect(cheminAnglais("/plan-du-site/")).toBe("/en/sitemap/");
    expect(cheminAnglais("/recherche/")).toBe("/en/search/");
    expect(cheminAnglais("/calendrier/")).toBe("/en/calendar/");
    expect(cheminAnglais("/communaute/")).toBe("/en/community/");
    expect(cheminAnglais("/contact/")).toBe("/en/contact/");
    expect(cheminAnglais("/guildes/modifier/")).toBeNull();
    expect(cheminAnglais("/guildes/les-gardiens/")).toBe("/en/guilds/les-gardiens/");
    expect(cheminAnglais("/mentions-legales/")).toBe("/en/legal-notice/");
    expect(cheminAnglais("/confidentialite/")).toBe("/en/privacy/");
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

  it("donne une adresse anglaise unique à chaque carte, tirée de son nom anglais", () => {
    expect(Object.keys(LIEUX_EN).length).toBe(tousLesLieux().length);
    expect(new Set(Object.values(LIEUX_EN)).size).toBe(tousLesLieux().length);
    expect(LIEUX_EN["foret-d-elwynn"]).toBe("elwynn-forest");
    expect(cheminAnglais("/cartes/royaumes-de-l-est/")).toBe("/en/maps/eastern-kingdoms/");
  });

  it("trouve dans les fichiers du jeu le nom anglais de chaque donjon et raid des guides", () => {
    for (const d of [...DONJONS_ORIGINE, ...RAIDS].filter((x) => !x.nom.startsWith("["))) expect(nomDonjonEn(d.nom), d.nom).toBeTruthy();
    expect(nomDonjonEn("Les Mortemines")).toBe("Deadmines");
    expect(nomDonjonEn("Temple d'Atal'Hakkar")).toBe("Sunken Temple");
    expect(nomDonjonEn("[Raid du Mont Hyjal, nom à confirmer]")).toBeNull();
  });

  it("a une fiche anglaise pour chaque zone et chaque nouveau donjon de Forever", () => {
    for (const z of ZONES) expect(ZONES_EN[z.slug], z.slug).toBeDefined();
    for (const d of DONJONS) expect(nomDonjonEn(d.nom), d.nom).toBeTruthy();
    expect(cheminAnglais("/zones/rives-claires/")).toBe("/en/zones/riverglades/");
    expect(cheminAnglais("/guides/quetes-de-classe/demoniste/")).toBe("/en/guides/class-quests/warlock/");
  });

  it("traduit les libellés des objets", () => {
    expect(qualite(4, "en").nom).toBe("Epic");
    expect(qualite(4).nom).toBe("Épique");
    expect(emplacement(17, "en")).toBe("Two-Hand");
    expect(prixEnTexte(25_53_55, "en")).toBe("25g 53s 55c");
    expect(prixEnTexte(25_53_55)).toBe("25 po 53 pa 55 pc");
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

describe("articles en anglais", () => {
  it("relie actualités, rubriques et articles à leur page anglaise", async () => {
    const { cheminAnglais, cheminFrancais, RUBRIQUES_EN } = await import("@/lib/anglais");
    const { RUBRIQUES } = await import("@/config/taxonomie");
    expect(cheminAnglais("/actualites/")).toBe("/en/news/");
    expect(cheminAnglais("/articles/bilan-beta/")).toBe("/en/articles/bilan-beta/");
    expect(cheminFrancais("/en/articles/bilan-beta/")).toBe("/articles/bilan-beta/");
    for (const r of RUBRIQUES) {
      expect(RUBRIQUES_EN[r.slug], r.slug).toBeDefined();
      expect(cheminFrancais(cheminAnglais(`/rubriques/${r.slug}/`)!)).toBe(`/rubriques/${r.slug}/`);
    }
    expect(new Set(Object.values(RUBRIQUES_EN).map((r) => r.slug)).size).toBe(RUBRIQUES.length);
  });

  it("refait la traduction quand le texte français change, avis compris", async () => {
    const { empreinteTraduction } = await import("@/modules/veille");
    const a = { titre: "Titre", chapo: "Chapô", corps: "Corps", avisSilfax: "Avis de Jobwow", description: "Description", etiquettes: ["a"] };
    expect(empreinteTraduction(a)).toBe(empreinteTraduction({ ...a }));
    expect(empreinteTraduction({ ...a, avisSilfax: "Autre avis" })).not.toBe(empreinteTraduction(a));
    expect(empreinteTraduction({ ...a, corps: "Corps corrigé" })).not.toBe(empreinteTraduction(a));
  });

  it("ne traduit jamais un brouillon : l'avis anglais suit toujours un avis validé par Jobwow", async () => {
    const { traduireArticle } = await import("@/modules/veille");
    const brouillon = { id: 1, statut: "brouillon", avisSilfax: "", titre: "t", chapo: "", corps: "", description: "", etiquettes: [] } as never;
    expect(await traduireArticle(brouillon)).toEqual({ ok: false, raison: "Seuls les articles en ligne sont traduits." });
  });

  it("garde dans les consignes de traduction la fidélité et la citation unique", async () => {
    const { CONSIGNES_TRADUCTION } = await import("@/modules/veille/traduction/consignes");
    expect(CONSIGNES_TRADUCTION).toMatch(/ne change ni le sens, ni les faits, ni les chiffres/);
    expect(CONSIGNES_TRADUCTION).toMatch(/unique citation/);
    expect(CONSIGNES_TRADUCTION).toMatch(/N'invente aucune opinion/);
  });
});

describe("guildes en anglais", () => {
  it("traduit les erreurs de la fiche, nom de champ compris", async () => {
    const { messageEn } = await import("@/lib/messages-en");
    const { validerFiche } = await import("@/modules/veille");
    const r = validerFiche({ nom: "", faction: "", serveur: "", typeRoyaume: "", description: "voir https://exemple.fr", discord: "", site: "", contactJeu: "", horaires: "", recrute: "" }, { objectifs: [], classes: [], roles: [] });
    expect(r.ok).toBe(false);
    const en = (r as { erreurs: string[] }).erreurs.map(messageEn);
    for (const m of en) expect(m, m).not.toMatch(/[éèà]|Choisissez|Indiquez/);
    expect(en).toContain("No link in the “presentation” field: use the Discord and website fields.");
  });

  it("ne mesure jamais la page anglaise de modification d'une guilde, qui contient un secret", async () => {
    const { cheminMesurable } = await import("@/modules/veille/statistiques/classement");
    expect(cheminMesurable("/en/guilds/edit/abc/")).toBeNull();
    expect(cheminMesurable("/guildes/modifier/abc/")).toBeNull();
    expect(cheminMesurable("/en/guilds/")).toBe("/en/guilds/");
  });
});

describe("calendrier en anglais", () => {
  it("donne un agenda anglais, liens vers les pages anglaises, mêmes dates", async () => {
    const { fichierAgenda } = await import("@/lib/agenda");
    const { ECHEANCES } = await import("@/content/calendrier");
    const ics = fichierAgenda("https://www.taverne-eternelle.fr", new Date("2026-11-03T12:00:00Z"), "en");
    expect(ics).toContain("SUMMARY:WoW Forever launch — WoW Forever");
    expect(ics).toContain("URL:https://www.taverne-eternelle.fr/en/guides/getting-started/");
    expect(ics).toContain("URL:https://www.taverne-eternelle.fr/en/dungeons/#raids");
    expect(ics).toContain("DTSTART;TZID=Europe/Paris:20261105T000000");
    for (const e of ECHEANCES) expect(e.en.titre.length, e.id).toBeGreaterThan(3);
    for (const ligne of ics.split("\r\n")) expect(Buffer.byteLength(ligne)).toBeLessThanOrEqual(75);
  });
});
