import { describe, expect, it } from "vitest";
import { langueMesurable, paysDuFuseau, termeMesurable } from "@/modules/veille/statistiques/classement";

describe("statistiques : pays, langue, recherches", () => {
  it("estime le pays d'après le fuseau horaire, sans adresse IP", () => {
    expect(paysDuFuseau("Europe/Paris")).toBe("FR");
    expect(paysDuFuseau("Europe/Brussels")).toBe("BE");
    expect(paysDuFuseau("America/Toronto")).toBe("CA");
    expect(paysDuFuseau("Europe/Kiev")).toBe("UA");
    expect(paysDuFuseau("Lune/Base")).toBe("");
    expect(paysDuFuseau(undefined)).toBe("");
  });

  it("réduit la langue du navigateur à sa forme courte", () => {
    expect(langueMesurable("fr-FR")).toBe("fr-FR");
    expect(langueMesurable("fr-ca")).toBe("fr-CA");
    expect(langueMesurable("fr")).toBe("fr");
    expect(langueMesurable("en-US-u-ca-gregory")).toBe("en-US");
    expect(langueMesurable("<script>")).toBe("");
  });

  it("ne garde que des termes de recherche ordinaires", () => {
    expect(termeMesurable("  Boule   de FEU ")).toBe("boule de feu");
    expect(termeMesurable("Déchireuse en arcanite")).toBe("déchireuse en arcanite");
    expect(termeMesurable("a")).toBeNull();
    expect(termeMesurable("moi@exemple.fr")).toBeNull();
    expect(termeMesurable("0612345678")).toBeNull();
    expect(termeMesurable("https://site.fr")).toBeNull();
    expect(termeMesurable("x".repeat(61))).toBeNull();
    expect(termeMesurable(42)).toBeNull();
  });
});
