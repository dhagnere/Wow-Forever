import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Garde-fou « Accès réservé » : chaque page d'administration appelle exigerAdmin() (proxy.ts protège déjà l'entrée).
function pages(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) return pages(chemin);
    return nom === "page.tsx" ? [chemin] : [];
  });
}

describe("pages d'administration", () => {
  const liste = pages(path.join(process.cwd(), "app/admin")).filter((p) => !p.includes(`${path.sep}connexion${path.sep}`));

  it("trouve les pages, dont celle des comptes", () => {
    expect(liste.some((p) => p.endsWith(path.join("comptes", "page.tsx")))).toBe(true);
  });

  it.each(liste.map((p) => [path.relative(process.cwd(), p)]))("%s appelle exigerAdmin()", (p) => {
    expect(readFileSync(path.join(process.cwd(), p), "utf8")).toMatch(/await exigerAdmin\(\)/);
  });
});
