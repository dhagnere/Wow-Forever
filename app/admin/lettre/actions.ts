"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { enregistrerEnvoi, envoyerEssai, expedierLettres, importerAbonnes, lancerEnvoi, lireEnvoi, listerEnvois, normaliserCourriel, supprimerEnvoi, type LangueLettre } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { adresseValide } from "@/lib/lettre";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { pairePreparee } from "@/lib/lettresCarnet";

const langueDe = (f: FormData): LangueLettre => (f.get("langue") === "en" ? "en" : "fr");
const texte = (f: FormData, nom: string, max: number) => String(f.get(nom) ?? "").slice(0, max);

function retour(params: Record<string, string | number>): never {
  revalidatePath("/admin/lettre/");
  redirect(`/admin/lettre/?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}`);
}

/** Enregistre le brouillon, puis, selon le bouton : rien de plus, un essai, ou le lancement de l'envoi. */
export async function enregistrerLettre(f: FormData): Promise<void> {
  await exigerAdmin();
  const sujet = texte(f, "sujet", 200).trim();
  const corps = texte(f, "corps", 60_000).trim();
  const idSaisi = Number(f.get("id")) || undefined;
  if (!sujet || !corps) retour({ ...(idSaisi ? { id: idSaisi } : {}), erreur: "vide" });
  const id = await enregistrerEnvoi({ id: idSaisi, langue: langueDe(f), sujet, corps });
  const action = String(f.get("action") ?? "");

  if (action === "essai") {
    const adresse = normaliserCourriel(texte(f, "essai", 254));
    if (!adresseValide(adresse)) retour({ id, erreur: "essai-adresse" });
    const e = await lireEnvoi(id);
    const ok = e ? await envoyerEssai(e, adresse) : false;
    retour({ id, [ok ? "ok" : "erreur"]: ok ? "essai" : "envoi" });
  }
  if (action === "lancer") {
    if (f.get("relu") !== "oui") retour({ id, erreur: "relu" });
    const n = await lancerEnvoi(id);
    // Premier lot tout de suite (dans la limite du plafond du jour) ; la tâche horaire envoie le reste.
    if (n) await expedierLettres();
    retour({ ok: "lance", n });
  }
  retour({ id, ok: "enregistre" });
}

export async function supprimerLettre(f: FormData): Promise<void> {
  await exigerAdmin();
  const id = Number(f.get("id"));
  if (Number.isInteger(id) && id > 0) await supprimerEnvoi(id);
  retour({ ok: "supprime" });
}

/** Importe comme brouillon une Lettre préparée (content/lettres-preparees.ts) ; l'essai et le lancement restent à faire. */
export async function importerPreparee(f: FormData): Promise<void> {
  await exigerAdmin();
  const l = LETTRES_PREPAREES.find((x) => x.id === String(f.get("preparee") ?? ""));
  if (!l) retour({ erreur: "preparee-inconnue" });
  const deja = await listerEnvois();
  const absente = (x: { langue: LangueLettre; sujet: string }) => !deja.some((e) => e.langue === x.langue && e.sujet === x.sujet);
  const id = absente(l) ? await enregistrerEnvoi({ langue: l.langue, sujet: l.sujet, corps: l.corps }) : deja.find((e) => e.langue === l.langue && e.sujet === l.sujet)!.id;
  // l'édition de l'autre langue arrive avec elle : le Carnet anglais suit le français
  const paire = pairePreparee(l, LETTRES_PREPAREES);
  if (paire && absente(paire)) await enregistrerEnvoi({ langue: paire.langue, sujet: paire.sujet, corps: paire.corps });
  revalidatePath("/carnet/");
  revalidatePath("/en/notebook/");
  retour({ id, ok: "preparee" });
}

/** Reprise des abonnés de l'ancien prestataire (adresses déjà confirmées), collées depuis un export CSV. */
export async function importerLettre(f: FormData): Promise<void> {
  await exigerAdmin();
  if (f.get("consentement") !== "oui") retour({ erreur: "consentement" });
  const brut = texte(f, "adresses", 2_000_000);
  const adresses = [...new Set((brut.match(/[^\s,;:"'<>()[\]]+@[^\s,;:"'<>()[\]]+\.[a-z]{2,24}/gi) ?? []).map(normaliserCourriel))].filter(adresseValide);
  const n = await importerAbonnes(adresses, langueDe(f));
  retour({ ok: "import", n });
}
