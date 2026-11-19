/**
 * npm run carnet:voix -- "<vidéo>.narration.json" [options de voix_chatterbox.py]
 *
 * Lance scripts/voix_chatterbox.py avec le Python de l'environnement .voix créé par `npm run voix:installer`
 * (Chatterbox y est installé, quelle que soit la version de Python du PC). Sans cet environnement, essaie le Python
 * du PC.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { personnageVideo } from "@/content/personnages";

const racine = process.cwd(); // npm lance les scripts depuis la racine du site
const candidats = [
  path.join(racine, ".voix", "Scripts", "python.exe"),
  path.join(racine, ".voix", "bin", "python"),
];
const python = candidats.find((p) => existsSync(p)) ?? "python";
if (python === "python") {
  console.warn("Environnement .voix introuvable : lancez d'abord npm run voix:installer. Essai avec le Python du PC.");
}

// voix du personnage de la narration (content/personnages.ts) : référence, voix abaissée, intensité
const args = process.argv.slice(2);
const narration = args.find((a) => /\.narration\.json$/i.test(a));
const reglages: string[] = [];
if (narration && existsSync(narration)) {
  try {
    const perso = personnageVideo((JSON.parse(readFileSync(narration, "utf8")) as { profil?: string }).profil);
    const v = perso.voix ?? {};
    if (v.reference && !args.includes("--reference")) reglages.push("--reference", path.join(racine, v.reference));
    if (v.grave && !args.includes("--grave")) reglages.push("--grave", String(v.grave));
    if (v.exaggeration && !args.includes("--exaggeration")) reglages.push("--exaggeration", String(v.exaggeration));
    if (reglages.length) console.log(`Voix de ${perso.nom} : ${reglages.join(" ")}`);
  } catch { /* narration illisible : le script Python le dira */ }
}

const r = spawnSync(python, [path.join(racine, "scripts", "voix_chatterbox.py"), ...args, ...reglages], {
  stdio: "inherit",
});
if (r.error) {
  console.error(`Python introuvable (${python}) : lancez npm run voix:installer.`);
  process.exit(1);
}
process.exit(r.status ?? 1);
