"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { enregistrerEnvoi, envoyerEssai, importerAbonnes, lancerEnvoi, lireEnvoi, normaliserCourriel, supprimerEnvoi, type LangueLettre } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { adresseValide } from "@/lib/lettre";

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

/** Reprise des abonnés de l'ancien prestataire (adresses déjà confirmées), collées depuis un export CSV. */
export async function importerLettre(f: FormData): Promise<void> {
  await exigerAdmin();
  if (f.get("consentement") !== "oui") retour({ erreur: "consentement" });
  const brut = texte(f, "adresses", 2_000_000);
  const adresses = [...new Set((brut.match(/[^\s,;:"'<>()[\]]+@[^\s,;:"'<>()[\]]+\.[a-z]{2,24}/gi) ?? []).map(normaliserCourriel))].filter(adresseValide);
  const n = await importerAbonnes(adresses, langueDe(f));
  retour({ ok: "import", n });
}
