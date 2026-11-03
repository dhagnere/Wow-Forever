import { describe, expect, it } from "vitest";
import { empreinteJeton, hacherMotDePasse, nouveauJeton, verifierMotDePasse } from "@/modules/veille/joueurs/motdepasse";
import { cleGuideValide, erreurMotDePasse, validerInscription } from "@/modules/veille/joueurs/validation";

describe("mots de passe des joueurs", () => {
  it("ne garde qu'une empreinte salée, vérifiable", async () => {
    const e = await hacherMotDePasse("Le gnome boit du lait");
    expect(e).toMatch(/^scrypt\$16384\$8\$1\$[\w-]+\$[\w-]+$/);
    expect(e).not.toContain("gnome");
    expect(await verifierMotDePasse("Le gnome boit du lait", e)).toBe(true);
    expect(await verifierMotDePasse("Le gnome boit du thé", e)).toBe(false);
    // Deux empreintes du même mot de passe diffèrent (sel aléatoire).
    expect(await hacherMotDePasse("Le gnome boit du lait")).not.toBe(e);
    expect(await verifierMotDePasse("x", "pas une empreinte")).toBe(false);
  });

  it("donne des jetons dont seule l'empreinte est gardée", () => {
    const { jeton, empreinte } = nouveauJeton();
    expect(jeton.length).toBeGreaterThanOrEqual(40);
    expect(empreinte).toBe(empreinteJeton(jeton));
    expect(empreinte).not.toContain(jeton);
  });
});

describe("formulaire du compte", () => {
  const ok = { pseudo: "Jobwow", courriel: "Jobwow@Exemple.fr ", motDePasse: "chope-de-biere-42", confirmation: "chope-de-biere-42" };

  it("accepte une inscription correcte et normalise l'adresse", () => {
    const r = validerInscription({ ...ok, lettre: "oui" });
    expect(r).toEqual({ ok: true, valeur: { pseudo: "Jobwow", courriel: "jobwow@exemple.fr", motDePasse: "chope-de-biere-42", lettre: true } });
    const sans = validerInscription(ok);
    expect(sans.ok && sans.valeur.lettre).toBe(false);
  });

  it("refuse pseudo, adresse ou mot de passe invalides", () => {
    const r = validerInscription({ pseudo: "<b>", courriel: "pas-une-adresse", motDePasse: "court", confirmation: "court" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erreurs).sort()).toEqual(["courriel", "motDePasse", "pseudo"]);
    const diff = validerInscription({ ...ok, confirmation: "autre-chose-42" });
    expect(!diff.ok && diff.erreurs.confirmation).toBeTruthy();
    expect(erreurMotDePasse("aaaaaaaaaaaa")).toMatch(/facile/);
    expect(erreurMotDePasse("jobwow-1234567", "jobwow@exemple.fr")).toMatch(/pseudo ou votre adresse/);
  });

  it("n'accepte que des clés de guide connues", () => {
    expect(cleGuideValide("alliance:humain:mage")).toBe(true);
    expect(cleGuideValide("horde:mort-vivant:demoniste")).toBe(true);
    expect(cleGuideValide("alliance:humain:mage; DROP TABLE")).toBe(false);
    expect(cleGuideValide("pandarie:humain:mage")).toBe(false);
  });
});
