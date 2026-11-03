import { describe, expect, it } from "vitest";
import { invitationDiscord, siteWeb, slugGuilde, validerFiche } from "@/modules/veille/guildes/validation";
import { cheminMesurable } from "@/modules/veille/statistiques/classement";

const base = {
  nom: "Les Chopes de Hurlevent", faction: "alliance", serveur: "Éternité", typeRoyaume: "jce",
  description: "Guilde détendue de joueurs adultes, on monte ensemble puis on attaque les raids à 20.", horaires: "Soirs 21 h – minuit",
  discord: "https://discord.gg/abc123", site: "", contactJeu: "", recrute: "oui",
};

describe("fiches de guilde", () => {
  it("accepte une fiche complète et ne garde que les choix permis", () => {
    const r = validerFiche(base, { objectifs: ["raids", "piratage"], classes: ["mage", "chevalier-de-la-mort"], roles: ["tank"] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.valeur.objectifs).toEqual(["raids"]);
      expect(r.valeur.classes).toEqual(["mage"]);
      expect(r.valeur.recrute).toBe(true);
    }
  });

  it("refuse les liens dans les textes libres et l'absence de contact", () => {
    const r = validerFiche({ ...base, description: "Rejoignez-nous sur www.vente-or-pas-cher.com pour des bons plans en jeu, vite !", discord: "" }, {});
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.erreurs.join(" ")).toMatch(/Pas de lien/);
      expect(r.erreurs.join(" ")).toMatch(/moyen de contact/);
    }
  });

  it("n'accepte que de vraies invitations Discord et des sites https", () => {
    expect(invitationDiscord("discord.gg/Taverne")).toBe("https://discord.gg/Taverne");
    expect(invitationDiscord("https://discord.com/invite/abc-12")).toBe("https://discord.gg/abc-12");
    expect(invitationDiscord("https://evil.example/discord.gg/x")).toBeNull();
    expect(invitationDiscord("javascript:alert(1)")).toBeNull();
    expect(siteWeb("guilde.fr")).toBe("https://guilde.fr/");
    expect(siteWeb("http://guilde.fr")).toBeNull();
    expect(siteWeb("https://user:mdp@guilde.fr")).toBeNull();
    expect(siteWeb("https://192.168.0.1/")).toBeNull();
  });

  it("nettoie les caractères invisibles et fabrique une adresse lisible", () => {
    const r = validerFiche({ ...base, nom: "Les‮ Chopes\u0000 " }, {});
    expect(r.ok && r.valeur.nom).toBe("Les Chopes");
    expect(slugGuilde("Les Chopes de Hurlevent", "Éternité")).toBe("les-chopes-de-hurlevent-eternite");
  });

  it("ne mesure jamais la page de modification, qui contient le lien secret", () => {
    expect(cheminMesurable("/guildes/modifier/jeton-secret-123456789/")).toBeNull();
    expect(cheminMesurable("/guildes/les-chopes/")).toBe("/guildes/les-chopes/");
  });
});
