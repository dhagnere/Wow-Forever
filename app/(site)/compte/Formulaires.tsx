"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  changerMonMotDePasse, choisirMotDePasse, creer, demanderOubli, seConnecter, supprimerMonCompte, type EtatCompte,
} from "./actions";

const MIN = 10;

type Langue = "fr" | "en";
const TXT = {
  fr: {
    nouveau: "Nouveau mot de passe", mdp: "Mot de passe", min: `(${MIN} caractères au moins)`, confirmez: "Confirmez le mot de passe", pseudo: "Pseudo",
    courriel: "Adresse électronique", piege: "Ne pas remplir",
    lettre: "Je veux aussi recevoir la Lettre de la Taverne chaque dimanche (facultatif, désinscription en un clic).",
    creation: "Création…", creer: "Créer mon compte", usage: ["Votre adresse sert à vous connecter, et à recevoir la Lettre si vous l'avez demandée. Détails dans la", "politique de confidentialité"],
    connexion: "Connexion…", connecter: "Me connecter", oubli: "Mot de passe oublié ?", compte: "Compte", ongletNouveau: "Nouveau compte", ongletDeja: "J'ai déjà un compte",
  },
  en: {
    nouveau: "New password", mdp: "Password", min: `(at least ${MIN} characters)`, confirmez: "Confirm the password", pseudo: "Username",
    courriel: "Email address", piege: "Leave empty",
    lettre: "I also want to receive the Tavern's Sunday newsletter (in French; optional, one-click unsubscribe).",
    creation: "Creating…", creer: "Create my account", usage: ["Your address is used to log in, and to receive the newsletter if you asked for it. Details in the", "privacy policy (in French)"],
    connexion: "Logging in…", connecter: "Log in", oubli: "Forgot your password? (page in French)", compte: "Account", ongletNouveau: "New account", ongletDeja: "I already have an account",
  },
} as const;

function Erreur({ e }: { e?: string }) {
  return e ? <span className="erreur-champ" role="alert">{e}</span> : null;
}

function MotsDePasse({ etat, nouveau = false, langue = "fr" }: { etat: EtatCompte; nouveau?: boolean; langue?: Langue }) {
  const t = TXT[langue];
  return (
    <>
      <div className="champ">
        <label htmlFor="mot_de_passe">{nouveau ? t.nouveau : t.mdp} <span className="doux">{t.min}</span></label>
        <input id="mot_de_passe" name="mot_de_passe" type="password" autoComplete="new-password" required minLength={MIN} maxLength={200} />
        <Erreur e={etat?.erreurs?.motDePasse} />
      </div>
      <div className="champ">
        <label htmlFor="confirmation">{t.confirmez}</label>
        <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" required minLength={MIN} maxLength={200} />
        <Erreur e={etat?.erreurs?.confirmation} />
      </div>
    </>
  );
}

function Inscription({ retour, langue }: { retour: string; langue: Langue }) {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(creer, null);
  const t = TXT[langue];
  return (
    <form action={action} className="formulaire-compte" key={JSON.stringify(etat?.saisie ?? {})}>
      <input type="hidden" name="retour" value={retour} />
      <input type="hidden" name="langue" value={langue} />
      <div className="champ">
        <label htmlFor="pseudo">{t.pseudo}</label>
        <input id="pseudo" name="pseudo" autoComplete="nickname" required minLength={3} maxLength={24} defaultValue={etat?.saisie?.pseudo} />
        <Erreur e={etat?.erreurs?.pseudo} />
      </div>
      <div className="champ">
        <label htmlFor="courriel-inscription">{t.courriel}</label>
        <input id="courriel-inscription" name="courriel" type="email" autoComplete="email" required maxLength={254} defaultValue={etat?.saisie?.courriel} />
        <Erreur e={etat?.erreurs?.courriel} />
      </div>
      <MotsDePasse etat={etat} langue={langue} />
      <div className="piege" aria-hidden="true">
        <label htmlFor="site_web">{t.piege}</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="case">
        <input type="checkbox" name="lettre" value="oui" />
        <span>{t.lettre}</span>
      </label>
      {etat?.message ? <p className="alerte" role="alert">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours} data-cta="compte-creer">{enCours ? t.creation : t.creer}</button>
      <p className="doux" style={{ fontSize: 13, margin: 0 }}>
        {t.usage[0]}{" "}
        <Link href="/confidentialite/">{t.usage[1]}</Link>.
      </p>
    </form>
  );
}

function Connexion({ retour, langue }: { retour: string; langue: Langue }) {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(seConnecter, null);
  const t = TXT[langue];
  return (
    <form action={action} className="formulaire-compte" key={etat?.saisie?.courriel ?? ""}>
      <input type="hidden" name="retour" value={retour} />
      <input type="hidden" name="langue" value={langue} />
      <div className="champ">
        <label htmlFor="courriel-connexion">{t.courriel}</label>
        <input id="courriel-connexion" name="courriel" type="email" autoComplete="email" required maxLength={254} defaultValue={etat?.saisie?.courriel} />
      </div>
      <div className="champ">
        <label htmlFor="mot_de_passe_connexion">{t.mdp}</label>
        <input id="mot_de_passe_connexion" name="mot_de_passe" type="password" autoComplete="current-password" required maxLength={200} />
      </div>
      {etat?.message ? <p className="alerte" role="alert">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours} data-cta="compte-connexion">{enCours ? t.connexion : t.connecter}</button>
      <p style={{ margin: 0, fontSize: 14 }}><Link href="/compte/oubli/">{t.oubli}</Link></p>
    </form>
  );
}

/** Un seul encart : créer son compte (et s'inscrire à la Lettre au passage) ou se connecter. */
export function AccesCompte({ retour, mode = "inscription", langue = "fr" }: { retour: string; mode?: "inscription" | "connexion"; langue?: Langue }) {
  const [onglet, setOnglet] = useState(mode);
  const t = TXT[langue];
  return (
    <div className="acces-compte">
      <div role="tablist" aria-label={t.compte} className="onglets-compte">
        <button type="button" role="tab" aria-selected={onglet === "inscription"} onClick={() => setOnglet("inscription")}>{t.ongletNouveau}</button>
        <button type="button" role="tab" aria-selected={onglet === "connexion"} onClick={() => setOnglet("connexion")}>{t.ongletDeja}</button>
      </div>
      <div role="tabpanel">{onglet === "inscription" ? <Inscription retour={retour} langue={langue} /> : <Connexion retour={retour} langue={langue} />}</div>
    </div>
  );
}

export function FormulaireOubli() {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(demanderOubli, null);
  return (
    <form action={action} className="formulaire-compte">
      <div className="champ">
        <label htmlFor="courriel-oubli">Adresse électronique du compte</label>
        <input id="courriel-oubli" name="courriel" type="email" autoComplete="email" required maxLength={254} defaultValue={etat?.saisie?.courriel} />
      </div>
      {etat?.message ? <p className={etat.ok ? "succes" : "alerte"} role="status">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours}>{enCours ? "Envoi…" : "Recevoir un lien"}</button>
    </form>
  );
}

export function FormulaireReinitialisation({ jeton }: { jeton: string }) {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(choisirMotDePasse, null);
  return (
    <form action={action} className="formulaire-compte">
      <input type="hidden" name="jeton" value={jeton} />
      <MotsDePasse etat={etat} nouveau />
      {etat?.message ? <p className="alerte" role="alert">{etat.message} <Link href="/compte/oubli/">Nouveau lien</Link></p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours}>{enCours ? "Enregistrement…" : "Enregistrer"}</button>
    </form>
  );
}

export function FormulaireMotDePasse() {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(changerMonMotDePasse, null);
  return (
    <form action={action} className="formulaire-compte">
      <MotsDePasse etat={etat} nouveau />
      <button type="submit" className="btn btn-contour" disabled={enCours}>{enCours ? "Enregistrement…" : "Changer de mot de passe"}</button>
    </form>
  );
}

export function FormulaireSuppression() {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(supprimerMonCompte, null);
  return (
    <form action={action} className="formulaire-compte">
      <div className="champ">
        <label htmlFor="confirmation-suppression">Écrivez SUPPRIMER pour effacer votre compte et votre progression</label>
        <input id="confirmation-suppression" name="confirmation" autoComplete="off" required maxLength={40} />
        <Erreur e={etat?.erreurs?.confirmation} />
      </div>
      <button type="submit" className="btn btn-contour" disabled={enCours}>{enCours ? "Suppression…" : "Supprimer mon compte"}</button>
    </form>
  );
}
