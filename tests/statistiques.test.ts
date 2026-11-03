import { describe, expect, it } from "vitest";
import { cheminMesurable, classerAppareil, classerSource, empreinteDuJour, estRobot } from "@/modules/veille/statistiques/classement";
import { csvParJour, enseignements, evolution } from "@/modules/veille/statistiques/tableau";
import { fichierAgenda } from "@/lib/agenda";

describe("origine des visites", () => {
  const hote = "www.taverne-eternelle.fr";
  it("donne la priorité au marqueur utm_source", () => {
    expect(classerSource("https://www.google.com/", "facebook", hote)).toBe("facebook");
    expect(classerSource(undefined, "lettre", hote)).toBe("lettre");
  });
  it("reconnaît les moteurs, réseaux et la navigation interne", () => {
    expect(classerSource("https://www.google.fr/", undefined, hote)).toBe("google");
    expect(classerSource("https://duckduckgo.com/", undefined, hote)).toBe("moteurs");
    expect(classerSource("https://l.facebook.com/l.php?u=x", undefined, hote)).toBe("facebook");
    expect(classerSource("https://discord.com/channels/1", undefined, hote)).toBe("discord");
    expect(classerSource("https://taverne-eternelle.fr/actualites/", undefined, hote)).toBe("interne");
    expect(classerSource("https://www.judgehype.com/", undefined, hote)).toBe("sites");
    expect(classerSource("", undefined, hote)).toBe("direct");
  });
});

describe("visiteurs sans cookie", () => {
  it("change d'empreinte chaque jour et ne contient pas l'adresse IP", () => {
    const a = empreinteDuJour("sel-de-test-tres-long", "203.0.113.7", "Firefox", new Date("2026-11-05T10:00:00Z"));
    const b = empreinteDuJour("sel-de-test-tres-long", "203.0.113.7", "Firefox", new Date("2026-11-05T20:00:00Z"));
    const c = empreinteDuJour("sel-de-test-tres-long", "203.0.113.7", "Firefox", new Date("2026-11-06T10:00:00Z"));
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).not.toContain("203");
    expect(a).toHaveLength(20);
  });
  it("écarte robots, administration et paramètres d'adresse", () => {
    expect(estRobot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(estRobot("facebookexternalhit/1.1")).toBe(true);
    expect(estRobot("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Mobile/15E148 Safari/604.1")).toBe(false);
    expect(cheminMesurable("/admin/veille/")).toBeNull();
    expect(cheminMesurable("//evil.example/")).toBeNull();
    expect(cheminMesurable("/articles/a/?courriel=x@y.fr")).toBe("/articles/a/");
  });
  it("classe les appareils", () => {
    expect(classerAppareil("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Mobile")).toBe("mobile");
    expect(classerAppareil("Mozilla/5.0 (iPad; CPU OS 18_0)")).toBe("tablette");
    expect(classerAppareil("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("ordinateur");
  });
});

describe("tableau de bord", () => {
  const vide = { visiteurs: 0, visites: 0, pagesVues: 0, lectureMoyenneS: 0, pagesParVisite: 0, partUnePage: 0 };
  it("calcule l'évolution et tire des enseignements des chiffres", () => {
    expect(evolution(120, 100)).toBeCloseTo(0.2);
    expect(evolution(5, 0)).toBeNull();
    const creneaux = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
    creneaux[6][21] = 40;
    const phrases = enseignements({
      actuel: { ...vide, visiteurs: 120, pagesVues: 300 },
      precedent: { ...vide, visiteurs: 100 },
      sources: [{ cle: "facebook", nom: "Facebook", nombre: 80, part: 0.8 }, { cle: "google", nom: "Google", nombre: 5, part: 0.05 }],
      ctas: [{ nom: "lettre-article", affichages: 400, clics: 2, taux: 0.005 }],
      creneaux,
      pages: [],
    });
    expect(phrases.join(" ")).toContain("20 %");
    expect(phrases.join(" ")).toContain("Facebook");
    expect(phrases.join(" ")).toContain("dimanche vers 21 h");
    expect(phrases.join(" ")).toContain("« lettre-article » sous 1 %");
  });
  it("exporte un CSV lisible par Excel", () => {
    expect(csvParJour({ parJour: [{ jour: "2026-11-05", visiteurs: 3, visites: 4, pagesVues: 9 }] })).toBe("﻿jour;visiteurs;visites;pages vues\r\n2026-11-05;3;4;9\r\n");
  });
});

describe("fichier d'agenda", () => {
  it("contient la sortie à minuit (Paris) et l'ouverture des raids, avec un lien vers la Taverne", () => {
    const ics = fichierAgenda("https://www.taverne-eternelle.fr", new Date("2026-11-03T12:00:00Z"));
    expect(ics).toContain("DTSTART;TZID=Europe/Paris:20261105T000000");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261209");
    expect(ics).toContain("URL:https://www.taverne-eternelle.fr/guides/bien-demarrer/");
    expect(ics).not.toContain("Hardcore —"); // pas de date annoncée : hors agenda
    for (const ligne of ics.split("\r\n")) expect(Buffer.byteLength(ligne)).toBeLessThanOrEqual(75);
  });
});
