/**
 * Traduction automatique des Lettres françaises (chaque heure, dans npm run veille:horaire) :
 *
 *   npm run veille:lettres-en
 *
 * Chaque Lettre française enregistrée (brouillon compris) sans édition anglaise reçoit sa traduction, créée en brouillon
 * et reliée à elle ; une traduction automatique jamais retouchée suit les changements du français. Les Lettres préparées
 * qui ont déjà leur édition anglaise (content/lettres-preparees.ts) sont écartées. Rien ne part aux abonnés anglophones
 * sans l'essai et le lancement par Jobwow dans /admin/lettre.
 */
import { fermerBase, traduireLettresEnAttente } from "@/modules/veille";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { optionsTraductionLettre } from "@/lib/lettresCarnet";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("ANTHROPIC_API_KEY absente : aucune traduction de Lettre.");
    return;
  }
  const r = await traduireLettresEnAttente({ ...optionsTraductionLettre(LETTRES_PREPAREES), limite: 5 });
  console.log(`${r.traduites} Lettre(s) traduite(s) en anglais.`);
  for (const e of r.echecs) console.log(`  · Lettre ${e.id} : ${e.raison}`);
}

main()
  .catch((e) => { console.error("[veille:lettres-en] ÉCHEC :", e instanceof Error ? e.message : e); process.exitCode = 1; })
  .finally(() => fermerBase());
