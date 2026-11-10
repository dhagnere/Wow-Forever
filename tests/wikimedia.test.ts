import { describe, expect, it } from "vitest";
import { creditWikimedia, licenceLibre, texteBrut } from "@/lib/wikimediaLicences";

describe("Wikimedia Commons : licences et crédit", () => {
  it("garde le domaine public, CC0, CC BY et CC BY-SA", () => {
    for (const l of ["Public domain", "CC0", "CC BY 4.0", "CC BY-SA 4.0", "CC BY-SA 3.0", "CC-BY-2.0", "PD-self"]) expect(licenceLibre(l), l).toBe(true);
  });

  it("écarte les licences qui interdisent l'usage ou la modification", () => {
    for (const l of ["CC BY-NC 4.0", "CC BY-ND 4.0", "CC BY-NC-SA 3.0", "Fair use", "All rights reserved", ""]) expect(licenceLibre(l), l).toBe(false);
  });

  it("donne l'auteur, la licence et la source dans le crédit", () => {
    expect(creditWikimedia({ auteur: "Jean Dupont", licence: "CC BY-SA 4.0" })).toBe("Jean Dupont · CC BY-SA 4.0 · via Wikimedia Commons");
    expect(creditWikimedia({ auteur: "", licence: "CC0" })).toContain("Auteur inconnu");
  });

  it("transforme les métadonnées HTML en texte brut", () => {
    expect(texteBrut('<a href="//x">Jean&nbsp;Dupont</a> &amp; <b>Marie</b>')).toBe("Jean Dupont & Marie");
    expect(texteBrut("x".repeat(300), 20)).toHaveLength(20);
  });
});
