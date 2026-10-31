"use server";

import { after } from "next/server";
import { preparerRedaction, redigerSujets } from "@/modules/veille";
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
