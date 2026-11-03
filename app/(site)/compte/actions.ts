"use server";

import { redirect } from "next/navigation";
import {
  ErreurCompte, changerMotDePasse, connecter, creerCompte, demanderReinitialisation, erreurMotDePasse, fermerSession,
  modifierCompte, reinitialiser, supprimerCompte, validerInscription,
} from "@/modules/veille";
import { empreinteConnexion, joueurConnecte, jetonSession, oublierSession, poserSession, retourSur } from "@/lib/joueur";
import { desinscrire, inscrire } from "@/lib/lettre";
import { envoyerCourriel } from "@/lib/courriel";
import { SITE } from "@/lib/site";
import { erreursEn, messageEn } from "@/lib/messages-en";

export type EtatCompte = { message?: string; erreurs?: Record<string, string>; saisie?: Record<string, string>; ok?: boolean } | null;

const champ = (d: FormData, nom: string, max = 254) => String(d.get(nom) ?? "").slice(0, max);
/** Formulaires de la version anglaise (/en/account/) : messages traduits, retour par défaut sur la page anglaise. */
const anglais = (d: FormData) => d.get("langue") === "en";
const traduire = (d: FormData, e: EtatCompte): EtatCompte =>
  e && anglais(d) ? { ...e, message: e.message ? messageEn(e.message) : e.message, erreurs: erreursEn(e.erreurs) } : e;

export async function creer(e: EtatCompte, d: FormData): Promise<EtatCompte> {
  return traduire(d, await creerCompteJoueur(e, d));
}

async function creerCompteJoueur(_e: EtatCompte, d: FormData): Promise<EtatCompte> {
  // Champ piège invisible : un robot le remplit, un humain non.
  if (champ(d, "site_web")) redirect("/");
  const saisie = { pseudo: champ(d, "pseudo", 40), courriel: champ(d, "courriel") };
  const v = validerInscription({
    pseudo: saisie.pseudo, courriel: saisie.courriel, motDePasse: champ(d, "mot_de_passe", 200), confirmation: champ(d, "confirmation", 200),
    lettre: d.get("lettre") === "oui" ? "oui" : "",
  });
  if (!v.ok) return { erreurs: v.erreurs, saisie };
  try {
    const { jeton } = await creerCompte(v.valeur, await empreinteConnexion());
    await poserSession(jeton);
  } catch (e) {
    if (e instanceof ErreurCompte) return { message: e.message, saisie };
    throw e;
  }
  // La Lettre demande sa propre confirmation par courriel (double validation Brevo).
  let lettre = "";
  if (v.valeur.lettre) {
    const r = await inscrire(v.valeur.courriel, SITE.url);
    lettre = r.ok ? "lettre" : "lettre-plus-tard";
  }
  const u = new URL(retourSur(d.get("retour"), anglais(d) ? "/en/account/" : "/compte/"), SITE.url);
  u.searchParams.set("bienvenue", lettre || "compte");
  redirect(`${u.pathname}${u.search}`);
}

export async function seConnecter(_e: EtatCompte, d: FormData): Promise<EtatCompte> {
  const saisie = { courriel: champ(d, "courriel") };
  const r = await connecter(saisie.courriel, champ(d, "mot_de_passe", 200));
  if (!r.ok) return traduire(d, { message: r.message, saisie });
  await poserSession(r.jeton);
  redirect(retourSur(d.get("retour"), anglais(d) ? "/en/account/" : "/compte/"));
}

export async function seDeconnecter(): Promise<void> {
  await fermerSession(await jetonSession());
  await oublierSession();
  redirect("/compte/");
}

export async function seDeconnecterEn(): Promise<void> {
  await fermerSession(await jetonSession());
  await oublierSession();
  redirect("/en/account/");
}

export async function demanderOubli(_e: EtatCompte, d: FormData): Promise<EtatCompte> {
  const courriel = champ(d, "courriel");
  const demande = await demanderReinitialisation(courriel);
  if (demande) {
    const lien = `${SITE.url}/compte/reinitialiser/?jeton=${encodeURIComponent(demande.jeton)}`;
    const envoye = await envoyerCourriel(
      { courriel, nom: demande.pseudo },
      "Votre nouveau mot de passe pour la Taverne Éternelle",
      `Bonjour ${demande.pseudo},\n\nPour choisir un nouveau mot de passe, ouvrez ce lien dans l'heure :\n${lien}\n\nSi vous n'avez rien demandé, ignorez ce message : votre mot de passe ne change pas.\n\nJobwow, de la Taverne Éternelle`,
      `<p>Bonjour ${demande.pseudo.replace(/[<>&"]/g, "")},</p><p>Pour choisir un nouveau mot de passe, ouvrez ce lien dans l'heure :</p><p><a href="${lien}">Choisir un nouveau mot de passe</a></p><p>Si vous n'avez rien demandé, ignorez ce message : votre mot de passe ne change pas.</p><p>Jobwow, de la Taverne Éternelle</p>`,
    );
    if (!envoye) return { message: "L'envoi des messages n'est pas encore ouvert. Écrivez-nous depuis la page Contact pour retrouver l'accès à votre compte.", saisie: { courriel } };
  }
  // Même réponse que l'adresse ait un compte ou non.
  return { ok: true, message: "Si un compte existe avec cette adresse, un lien vient de partir. Il est valable une heure.", saisie: { courriel } };
}

export async function choisirMotDePasse(_e: EtatCompte, d: FormData): Promise<EtatCompte> {
  const jeton = champ(d, "jeton", 100);
  const m = champ(d, "mot_de_passe", 200);
  const erreur = erreurMotDePasse(m);
  if (erreur) return { erreurs: { motDePasse: erreur } };
  if (m !== champ(d, "confirmation", 200)) return { erreurs: { confirmation: "Les deux mots de passe ne sont pas identiques." } };
  if (!(await reinitialiser(jeton, m))) return { message: "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau." };
  redirect("/compte/?mot-de-passe=change");
}

export async function changerMonMotDePasse(_e: EtatCompte, d: FormData): Promise<EtatCompte> {
  const j = await joueurConnecte();
  if (!j) redirect("/compte/");
  const m = champ(d, "mot_de_passe", 200);
  const erreur = erreurMotDePasse(m, j.courriel, j.pseudo);
  if (erreur) return { erreurs: { motDePasse: erreur } };
  if (m !== champ(d, "confirmation", 200)) return { erreurs: { confirmation: "Les deux mots de passe ne sont pas identiques." } };
  await changerMotDePasse(j.id, m);
  // Les autres sessions sont fermées ; celle-ci est rouverte par une connexion.
  redirect("/compte/?mot-de-passe=change");
}

export async function basculerLettre(): Promise<void> {
  const j = await joueurConnecte();
  if (!j) redirect("/compte/");
  if (!j.lettre) {
    const r = await inscrire(j.courriel, SITE.url);
    await modifierCompte(j.id, { lettre: true });
    redirect(`/compte/?bienvenue=${r.ok ? "lettre" : "lettre-plus-tard"}`);
  }
  await desinscrire(j.courriel);
  await modifierCompte(j.id, { lettre: false });
  redirect("/compte/?lettre=arretee");
}

export async function supprimerMonCompte(_e: EtatCompte, d: FormData): Promise<EtatCompte> {
  const j = await joueurConnecte();
  if (!j) redirect("/compte/");
  if (champ(d, "confirmation", 40).trim().toUpperCase() !== "SUPPRIMER") return { erreurs: { confirmation: "Écrivez SUPPRIMER pour confirmer." } };
  await supprimerCompte(j.id);
  await oublierSession();
  redirect("/compte/?compte=supprime");
}
