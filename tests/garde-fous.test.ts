import { beforeAll, describe, expect, it } from "vitest";
import { verifierPublication } from "@/modules/veille/articles/publication";
import { markdownVersHtml, nettoyerHtml } from "@/modules/veille/rendu/html";
import { creerJeton, jetonValide, motDePasseCorrect } from "@/modules/veille/auth/session";
import { dansLaPlageHoraire, messageFacebook } from "@/modules/veille/facebook/relais";
import { slugifier } from "@/modules/veille/articles/slug";

const base = {
  titre: "WoW Forever sort le 5 novembre",
  corps: "x".repeat(400),
  avisSilfax: "J'attends surtout les nouveaux donjons : la salle des Thanes m'intrigue, et je commencerai en Druide tauren.",
  rubrique: "actualites" as const,
  description: "Tout savoir sur la sortie de WoW Forever le 5 novembre : horaire, abonnement, codes d'invitation.",
};

describe("avis de Silfax obligatoire", () => {
  it("autorise un article complet", () => {
    expect(verifierPublication(base)).toEqual([]);
  });
  it("refuse un avis vide", () => {
    expect(verifierPublication({ ...base, avisSilfax: "   " }).join(" ")).toMatch(/avis de Silfax/);
  });
  it("refuse un avis resté en texte à remplacer", () => {
    const avis = "[Votre ressenti de joueur, 2 à 4 phrases : ce qui vous donne envie, ce qui vous inquiète, par quoi commencer.]";
    expect(verifierPublication({ ...base, avisSilfax: avis }).length).toBeGreaterThan(0);
  });
});

describe("filtrage du HTML", () => {
  it("retire scripts, gestionnaires d'événements et liens javascript:", () => {
    const html = nettoyerHtml('<p onclick="x()">a</p><script>alert(1)</script><a href="javascript:alert(1)">b</a><img src=x onerror=alert(1)>');
    expect(html).not.toMatch(/script|onclick|javascript|onerror|<img/);
  });
  it("n'accepte que les vidéos YouTube", () => {
    expect(nettoyerHtml('<iframe src="https://evil.example/x"></iframe>')).not.toContain("evil");
    expect(nettoyerHtml('<iframe src="https://www.youtube-nocookie.com/embed/abc"></iframe>')).toContain("youtube-nocookie");
  });
  it("rend le Markdown et protège les liens externes", () => {
    const html = markdownVersHtml("## Titre\n\n[source](https://wowhead.com)");
    expect(html).toContain("<h2>Titre</h2>");
    expect(html).toContain('rel="noopener noreferrer nofollow"');
  });
});

describe("session d'administration", () => {
  beforeAll(() => {
    process.env.SESSION_SECRET = "s".repeat(40);
    process.env.ADMIN_PASSWORD = "mot-de-passe-de-test-long";
  });
  it("valide un jeton signé et refuse un jeton altéré ou expiré", async () => {
    const jeton = await creerJeton(1_000_000);
    expect(await jetonValide(jeton, 1_000_001)).toBe(true);
    expect(await jetonValide(jeton.replace(/.$/, (c) => (c === "A" ? "B" : "A")), 1_000_001)).toBe(false);
    expect(await jetonValide(`9999999999.${jeton.split(".")[1]}`, 1_000_001)).toBe(false);
    expect(await jetonValide(jeton, 1_000_000 + 13 * 3600)).toBe(false);
    expect(await jetonValide(undefined)).toBe(false);
  });
  it("vérifie le mot de passe", async () => {
    expect(await motDePasseCorrect("mot-de-passe-de-test-long")).toBe(true);
    expect(await motDePasseCorrect("autre")).toBe(false);
  });
});

describe("relais Facebook", () => {
  it("publie seulement entre 8h et 22h, heure de Paris", () => {
    expect(dansLaPlageHoraire(new Date("2026-11-06T06:30:00Z"))).toBe(false); // 7h30 à Paris
    expect(dansLaPlageHoraire(new Date("2026-11-06T07:05:00Z"))).toBe(true); // 8h05
    expect(dansLaPlageHoraire(new Date("2026-11-06T20:59:00Z"))).toBe(true); // 21h59
    expect(dansLaPlageHoraire(new Date("2026-11-06T21:00:00Z"))).toBe(false); // 22h
  });
  it("pointe toujours vers le site et ajoute les mots-dièse", () => {
    process.env.SITE_URL = "https://azeroth-forever.fr";
    const m = messageFacebook({ accrocheFacebook: "Le donjon caché enfin révélé", texteFacebook: "Ce que l'on sait.", slug: "donjon-cache", titre: "t" });
    expect(m).toContain("La suite ici : https://azeroth-forever.fr/articles/donjon-cache/");
    expect(m).toContain("#WoWForever #WorldofWarcraft");
  });
});

describe("adresses", () => {
  it("produit des slugs lisibles", () => {
    expect(slugifier("Skyborne : ce que l'on sait de la nouvelle race jouable !")).toBe("skyborne-ce-que-l-on-sait-de-la-nouvelle-race-jouable");
  });
});
