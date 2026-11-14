import { describe, expect, it } from "vitest";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { CONSIGNES_TRADUCTION_LETTRE, empreinteLettre } from "@/modules/veille";
import { cheminAnglais } from "@/lib/anglais";
import { lettresCarnetEn, liensVersAnglais, optionsTraductionLettre, sujetsAvecAnglaisPrepare } from "@/lib/lettresCarnet";

const SITES = ["https://www.taverne-eternelle.fr", "https://taverne-eternelle.fr"];

describe("traduction automatique des Lettres", () => {
  it("renvoie les liens du site vers les pages anglaises, sans toucher aux autres", () => {
    const md = "[Le Carnet](https://www.taverne-eternelle.fr/carnet/) · [vidéos](/carnet/videos/?x=1#haut) · [YouTube](https://www.youtube.com/@Jobwow-taverne) · [déjà](https://www.taverne-eternelle.fr/en/notebook/) · [page sans anglais](/admin/lettre/)";
    expect(liensVersAnglais(md, cheminAnglais, SITES)).toBe(
      "[Le Carnet](https://www.taverne-eternelle.fr/en/notebook/) · [vidéos](/en/notebook/videos/?x=1#haut) · [YouTube](https://www.youtube.com/@Jobwow-taverne) · [déjà](https://www.taverne-eternelle.fr/en/notebook/) · [page sans anglais](/admin/lettre/)",
    );
  });

  it("écarte les Lettres préparées qui ont leur édition anglaise", () => {
    const fr = LETTRES_PREPAREES.find((l) => l.id === "2026-S46-fr")!;
    expect(sujetsAvecAnglaisPrepare(LETTRES_PREPAREES).has(fr.sujet.toLowerCase())).toBe(true);
    const o = optionsTraductionLettre(LETTRES_PREPAREES);
    expect(o.ignorer?.(fr.sujet)).toBe(true);
    expect(o.ignorer?.("Une Lettre écrite à la main")).toBe(false);
  });

  it("une traduction automatique reliée remplace l'édition préparée dans le Carnet anglais, sans doublon", () => {
    const fr = LETTRES_PREPAREES.find((l) => l.id === "2026-S46-fr")!;
    const date = new Date("2026-11-11T20:00:00Z");
    const traduite = { id: 12, sujet: "Translated", corps: "Text", parueLe: date, traductionDe: 7 };
    expect(lettresCarnetEn([traduite], [{ id: 7, sujet: fr.sujet, corps: fr.corps, parueLe: date }], LETTRES_PREPAREES)).toEqual([traduite]);
  });

  it("l'empreinte change avec le sujet ou le texte, pas avec les espaces autour", () => {
    expect(empreinteLettre("Sujet", "Texte")).toBe(empreinteLettre(" Sujet ", "Texte\n"));
    expect(empreinteLettre("Sujet", "Texte")).not.toBe(empreinteLettre("Sujet", "Texte modifié"));
  });

  it("les consignes gardent les faits, la voix de Jobwow sans classe, et les liens", () => {
    expect(CONSIGNES_TRADUCTION_LETTRE).toContain("ne change ni le sens, ni les faits, ni les chiffres");
    expect(CONSIGNES_TRADUCTION_LETTRE).toContain("sa classe n'est jamais précisée");
    expect(CONSIGNES_TRADUCTION_LETTRE).toContain("Ne modifie aucune adresse de lien");
  });
});
