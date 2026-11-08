import { writeFileSync, mkdirSync } from "fs";
import { guidePour, ordreDuGuide, raceGuide, combinaisons } from "./lib/guide";
import { nomLieu } from "./lib/quetes";

const echap = (s: string) => (s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');

function etapesRoute(raceSlug: string, classeSlug: string): string {
  const race = raceGuide(raceSlug)!;
  const zones = guidePour(race, classeSlug);
  const out: string[] = [];
  for (const z of zones) {
    const nom = nomLieu(z.lieu) ?? z.lieu;
    for (const a of ordreDuGuide(z, race, classeSlug)) {
      for (const act of a.actions) {
        const e = z.etapes[act.q];
        const x = a.x != null ? (a.x / 100).toFixed(4) : "nil";
        const y = a.y != null ? (a.y / 100).toFixed(4) : "nil";
        const ch = [`a = "${act.a}"`, `t = "${echap(e.t)}"`, `z = "${echap(nom)}"`, `x = ${x}`, `y = ${y}`];
        if (act.a === "prendre" && e.gn) ch.push(`d = "${echap(e.gn)}"`);
        if (act.a === "rendre" && e.rn) ch.push(`r = "${echap(e.rn)}"`);
        if (act.a === "faire" && e.obj && e.obj.length) ch.push(`o = "${echap(e.obj.join(" ; "))}"`);
        out.push(`    { ${ch.join(", ")} },`);
      }
    }
  }
  return out.join("\n");
}

// Nom de fichier de race tel que le renvoie UnitRace("player") (2e valeur), et classe via UnitClass.
const RACE_FILE: Record<string, string> = {
  humain: "Human",
  nain: "Dwarf",
  "elfe-de-la-nuit": "NightElf",
  gnome: "Gnome",
  orc: "Orc",
  "mort-vivant": "Scourge",
  tauren: "Tauren",
  troll: "Troll",
  "skyborne-alliance": "SkyborneA", // raceFile à confirmer en jeu (/run print(UnitRace("player")))
  "skyborne-horde": "SkyborneH",     // raceFile à confirmer en jeu (/run print(UnitRace("player")))
};

const CLASSE_FILE: Record<string, string> = {
  guerrier: "WARRIOR",
  paladin: "PALADIN",
  chasseur: "HUNTER",
  voleur: "ROGUE",
  pretre: "PRIEST",
  chaman: "SHAMAN",
  mage: "MAGE",
  demoniste: "WARLOCK",
  druide: "DRUID",
};

const lignes: string[] = [
  '-- Généré automatiquement depuis content/guide-jeu.json (multi-parcours). Ne pas éditer à la main.',
  'print("TavernGuide: data.lua chargé")',
  'TavernGuideRoutes = TavernGuideRoutes or {}',
  '',
];

for (const { race, classe } of combinaisons()) {
  const rf = RACE_FILE[race.slug];
  const cf = CLASSE_FILE[classe.slug];
  if (!rf || !cf) continue;
  lignes.push(`-- ${race.nom} ${classe.nom} (${race.slug}/${classe.slug})`);
  lignes.push(`TavernGuideRoutes["${rf}"] = TavernGuideRoutes["${rf}"] or {}`);
  lignes.push(`TavernGuideRoutes["${rf}"]["${cf}"] = {`);
  lignes.push('  etapes = {');
  lignes.push(etapesRoute(race.slug, classe.slug));
  lignes.push('  },');
  lignes.push('}');
  lignes.push('');
}

const sortie = lignes.join("\n") + "\n";

const dir = "TavernGuide";
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/data.lua`, sortie, "utf8");
const nEtapes = sortie.split("\n").filter((l) => l.trim().startsWith('{ a =')).length;
const nRoutes = combinaisons().length;
console.log(`OK -> TavernGuide/data.lua (${nEtapes} étapes, ${nRoutes} parcours)`);
