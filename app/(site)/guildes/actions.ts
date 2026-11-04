"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { confirmerGuilde, deposerGuilde, empreinteDepot, ErreurGuilde, modifierGuilde, validerFiche } from "@/modules/veille";
import { SITE } from "@/lib/site";
import { messageEn } from "@/lib/messages-en";

/** saisie : ce que la guilde a tapé, réaffiché après une erreur pour ne rien lui faire ressaisir. */
export type EtatGuilde = { erreurs: string[]; lien?: string; message?: string; saisie?: Saisie } | null;
export type Saisie = Record<string, string | string[]>;

const CHAMPS = ["nom", "faction", "serveur", "typeRoyaume", "horaires", "description", "discord", "site", "contactJeu", "recrute"];

function saisie(form: FormData): Saisie {
  const s: Saisie = Object.fromEntries(CHAMPS.map((c) => [c, String(form.get(c) ?? "").slice(0, 1000)]));
  for (const m of ["objectifs", "classes", "roles"]) s[m] = form.getAll(m).map(String).slice(0, 20);
  return s;
}

function lire(form: FormData) {
  const champs = Object.fromEntries(CHAMPS.map((c) => [c, form.get(c)]));
  return validerFiche(champs, { objectifs: form.getAll("objectifs"), classes: form.getAll("classes"), roles: form.getAll("roles") });
}

/** Formulaire de la version anglaise (/en/guilds/) : messages traduits, lien de modification vers la page anglaise. */
const anglais = (form: FormData) => form.get("langue") === "en";
const traduire = (form: FormData, e: EtatGuilde): EtatGuilde =>
  e && anglais(form) ? { ...e, erreurs: e.erreurs.map(messageEn), message: e.message ? messageEn(e.message) : e.message } : e;

export async function inscrireGuilde(etat: EtatGuilde, form: FormData): Promise<EtatGuilde> {
  return traduire(form, await inscrire(etat, form));
}

async function inscrire(_etat: EtatGuilde, form: FormData): Promise<EtatGuilde> {
  // Champ piège invisible : un robot le remplit, un humain non.
  if (String(form.get("site_web") ?? "")) return { erreurs: [], message: "Merci, la fiche est en relecture." };
  if (form.get("charte") !== "oui") return { erreurs: ["Cochez la case : vous représentez la guilde et acceptez les règles du tableau."], saisie: saisie(form) };
  const fiche = lire(form);
  if (!fiche.ok) return { erreurs: fiche.erreurs, saisie: saisie(form) };
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "0.0.0.0";
  try {
    const { jeton } = await deposerGuilde(fiche.valeur, empreinteDepot(ip, h.get("user-agent") ?? ""));
    return { erreurs: [], lien: `${SITE.url}${anglais(form) ? "/en/guilds/edit" : "/guildes/modifier"}/${jeton}/` };
  } catch (e) {
    if (e instanceof ErreurGuilde) return { erreurs: [e.message], saisie: saisie(form) };
    throw e;
  }
}

export async function mettreAJourGuilde(etat: EtatGuilde, form: FormData): Promise<EtatGuilde> {
  return traduire(form, await mettreAJour(etat, form));
}

async function mettreAJour(_etat: EtatGuilde, form: FormData): Promise<EtatGuilde> {
  const jeton = String(form.get("jeton") ?? "");
  const fiche = lire(form);
  if (!fiche.ok) return { erreurs: fiche.erreurs, saisie: saisie(form) };
  try {
    await modifierGuilde(jeton, fiche.valeur);
    return { erreurs: [], message: "Fiche mise à jour. Jobwow relit les modifications ; la fiche reste affichée en attendant.", saisie: saisie(form) };
  } catch (e) {
    if (e instanceof ErreurGuilde) return { erreurs: [e.message], saisie: saisie(form) };
    throw e;
  }
}

export async function confirmerActivite(form: FormData): Promise<void> {
  const jeton = String(form.get("jeton") ?? "");
  try {
    await confirmerGuilde(jeton);
  } catch (e) {
    if (!(e instanceof ErreurGuilde)) throw e;
  }
  redirect(`${anglais(form) ? "/en/guilds/edit" : "/guildes/modifier"}/${encodeURIComponent(jeton)}/?confirme=1`);
}
