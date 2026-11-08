import { writeFileSync, mkdirSync } from "fs";
import { guidePour, ordreDuGuide, raceGuide } from "./lib/guide";
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

const sortie = [
  '-- Généré automatiquement depuis content/guide-jeu.json (multi-parcours). Ne pas éditer à la main.',
  'print("TavernGuide: data.lua chargé")',
  'TavernGuideRoutes = TavernGuideRoutes or {}',
  '',
  '-- Orc chasseur — Durotar',
  'TavernGuideRoutes["Orc"] = TavernGuideRoutes["Orc"] or {}',
  'TavernGuideRoutes["Orc"]["HUNTER"] = {',
  '  etapes = {',
  etapesRoute("orc", "chasseur"),
  '  },',
  '}',
  '',
  '-- Humain guerrier — parcours complet (toutes les zones)',
  'TavernGuideRoutes["Human"] = TavernGuideRoutes["Human"] or {}',
  'TavernGuideRoutes["Human"]["WARRIOR"] = {',
  '  etapes = {',
  etapesRoute("humain", "guerrier"),
  '  },',
  '}',
  '',
  '-- Tauren druide — parcours complet (toutes les zones)',
  'TavernGuideRoutes["Tauren"] = TavernGuideRoutes["Tauren"] or {}',
  'TavernGuideRoutes["Tauren"]["DRUID"] = {',
  '  etapes = {',
  etapesRoute("tauren", "druide"),
  '  },',
  '}',
].join("\n") + "\n";

const dir = "TavernGuide";
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/data.lua`, sortie, "utf8");
const lignes = sortie.split("\n").filter((l) => l.trim().startsWith('{ a =')).length;
console.log(`OK -> TavernGuide/data.lua (${lignes} étapes au total)`);
