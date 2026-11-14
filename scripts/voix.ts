/**
 * npm run carnet:voix -- "<vidéo>.narration.json" [options de voix_chatterbox.py]
 *
 * Lance scripts/voix_chatterbox.py avec le Python de l'environnement .voix créé par `npm run voix:installer`
 * (Chatterbox y est installé, quelle que soit la version de Python du PC). Sans cet environnement, essaie le Python
 * du PC.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const racine = process.cwd(); // npm lance les scripts depuis la racine du site
const candidats = [
  path.join(racine, ".voix", "Scripts", "python.exe"),
  path.join(racine, ".voix", "bin", "python"),
];
const python = candidats.find((p) => existsSync(p)) ?? "python";
if (python === "python") {
  console.warn("Environnement .voix introuvable : lancez d'abord npm run voix:installer. Essai avec le Python du PC.");
}

const r = spawnSync(python, [path.join(racine, "scripts", "voix_chatterbox.py"), ...process.argv.slice(2)], {
  stdio: "inherit",
});
if (r.error) {
  console.error(`Python introuvable (${python}) : lancez npm run voix:installer.`);
  process.exit(1);
}
process.exit(r.status ?? 1);
