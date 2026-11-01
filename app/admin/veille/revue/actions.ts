"use server";

import { after } from "next/server";
import { DOSSIERS, etatDossier, preparerRedaction, rechercherDossiers, redigerSujets } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

export interface EtatLancement {
  message?: string;
  erreur?: string;
}

/** Lance la rédaction des sujets cochés. Elle se poursuit après la réponse : les brouillons arrivent un à un. */
export async function redigerSelection(revueId: number, _etat: EtatLancement, form: FormData): Promise<EtatLancement> {
  await exigerAdmin();
  const cles = form.getAll("cle").map(String);
  const prep = await preparerRedaction(revueId, cles);
  if (!prep.ok) return { erreur: prep.erreur };
  after(() => redigerSujets(prep.sujets).then(() => undefined));
  const n = prep.sujets.length;
  return {
    message: `Rédaction lancée : ${n} sujet${n > 1 ? "s" : ""}. Comptez environ une minute par brouillon ; ils apparaissent au fur et à mesure dans l'onglet Brouillons.`,
  };
}

/** Lance la recherche des dossiers cochés (60 jours, sans coût d'API). Le résultat devient la revue affichée. */
export async function lancerDossiers(_etat: EtatLancement, form: FormData): Promise<EtatLancement> {
  await exigerAdmin();
  const ids = form.getAll("dossier").map(String).filter((id) => DOSSIERS.some((d) => d.id === id));
  if (!ids.length) return { erreur: "Cochez au moins un dossier." };
  if (etatDossier()) return { erreur: "Une recherche de dossiers est déjà en cours." };
  after(() => rechercherDossiers(ids).then(() => undefined).catch((e) => console.error("[dossiers]", e)));
  return { message: "Recherche lancée. Comptez une à deux minutes, puis rechargez la page : les sujets trouvés remplaceront la revue affichée." };
}
