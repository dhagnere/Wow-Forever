import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Garde-fou « Accès réservé » : chaque page d'administration appelle exigerAdmin() (proxy.ts protège déjà l'entrée).
function fichiers(dossier: string, nom: string): string[] {
  return readdirSync(dossier).flatMap((n) => {
    const chemin = path.join(dossier, n);
    if (statSync(chemin).isDirectory()) return fichiers(chemin, nom);
    return n === nom ? [chemin] : [];
  });
}
const pages = (dossier: string) => fichiers(dossier, "page.tsx");

describe("pages d'administration", () => {
  const liste = pages(path.join(process.cwd(), "app/admin")).filter((p) => !p.includes(`${path.sep}connexion${path.sep}`));

  it("trouve les pages, dont celle des comptes", () => {
    expect(liste.some((p) => p.endsWith(path.join("comptes", "page.tsx")))).toBe(true);
  });

  it.each(liste.map((p) => [path.relative(process.cwd(), p)]))("%s appelle exigerAdmin()", (p) => {
    expect(readFileSync(path.join(process.cwd(), p), "utf8")).toMatch(/await exigerAdmin\(\)/);
  });
});

describe("actions serveur d'administration", () => {
  const actions = fichiers(path.join(process.cwd(), "app/admin"), "actions.ts").filter((p) => !p.includes(`${path.sep}connexion${path.sep}`));

  it.each(actions.map((p) => [path.relative(process.cwd(), p)]))("chaque action exportée de %s commence par exigerAdmin()", (p) => {
    const source = readFileSync(path.join(process.cwd(), p), "utf8");
    const corps = source.split(/export async function /).slice(1);
    expect(corps.length).toBeGreaterThan(0);
    for (const c of corps) {
      const nom = c.slice(0, c.indexOf("("));
      // fin de la signature (une ou plusieurs lignes) : la ligne qui ouvre le corps de la fonction
      const lignes = c.split("\n");
      const ouverture = lignes.findIndex((l, i) => l.trimEnd().endsWith("{") && (i === 0 || l.startsWith(")")));
      const premiere = lignes.slice(ouverture + 1).find((l) => l.trim() !== "");
      expect(premiere?.trim(), nom).toBe("await exigerAdmin();");
    }
  });
});

