"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  changerMonMotDePasse, choisirMotDePasse, creer, demanderOubli, seConnecter, supprimerMonCompte, type EtatCompte,
} from "./actions";

const MIN = 10;

function Erreur({ e }: { e?: string }) {
  return e ? <span className="erreur-champ" role="alert">{e}</span> : null;
}

function MotsDePasse({ etat, nouveau = false }: { etat: EtatCompte; nouveau?: boolean }) {
  return (
    <>
      <div className="champ">
        <label htmlFor="mot_de_passe">{nouveau ? "Nouveau mot de passe" : "Mot de passe"} <span className="doux">({MIN} caractères au moins)</span></label>
        <input id="mot_de_passe" name="mot_de_passe" type="password" autoComplete="new-password" required minLength={MIN} maxLength={200} />
        <Erreur e={etat?.erreurs?.motDePasse} />
      </div>
      <div className="champ">
        <label htmlFor="confirmation">Confirmez le mot de passe</label>
        <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" required minLength={MIN} maxLength={200} />
        <Erreur e={etat?.erreurs?.confirmation} />
      </div>
    </>
  );
}

function Inscription({ retour }: { retour: string }) {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(creer, null);
  return (
    <form action={action} className="formulaire-compte" key={JSON.stringify(etat?.saisie ?? {})}>
      <input type="hidden" name="retour" value={retour} />
      <div className="champ">
        <label htmlFor="pseudo">Pseudo</label>
        <input id="pseudo" name="pseudo" autoComplete="nickname" required minLength={3} maxLength={24} defaultValue={etat?.saisie?.pseudo} />
        <Erreur e={etat?.erreurs?.pseudo} />
      </div>
      <div className="champ">
        <label htmlFor="courriel-inscription">Adresse électronique</label>
        <input id="courriel-inscription" name="courriel" type="email" autoComplete="email" required maxLength={254} defaultValue={etat?.saisie?.courriel} />
        <Erreur e={etat?.erreurs?.courriel} />
      </div>
      <MotsDePasse etat={etat} />
      <div className="piege" aria-hidden="true">
        <label htmlFor="site_web">Ne pas remplir</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="case">
        <input type="checkbox" name="lettre" value="oui" />
        <span>Je veux aussi recevoir la Lettre de la Taverne chaque dimanche (facultatif, désinscription en un clic).</span>
      </label>
      {etat?.message ? <p className="alerte" role="alert">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours} data-cta="compte-creer">{enCours ? "Création…" : "Créer mon compte"}</button>
      <p className="doux" style={{ fontSize: 13, margin: 0 }}>
        Votre adresse sert à vous connecter, et à recevoir la Lettre si vous l&apos;avez demandée. Détails dans la{" "}
        <Link href="/confidentialite/">politique de confidentialité</Link>.
      </p>
    </form>
  );
}

function Connexion({ retour }: { retour: string }) {
  const [etat, action, enCours] = useActionState<EtatCompte, FormData>(seConnecter, null);
  return (
    <form action={action} className="formulaire-compte" key={etat?.saisie?.courriel ?? ""}>
      <input type="hidden" name="retour" value={retour} />
      <div className="champ">
        <label htmlFor="courriel-connexion">Adresse électronique</label>
        <input id="courriel-connexion" name="courriel" type="email" autoComplete="email" required maxLength={254} defaultValue={etat?.saisie?.courriel} />
      </div>
      <div className="champ">
        <label htmlFor="mot_de_passe_connexion">Mot de passe</label>
        <input id="mot_de_passe_connexion" name="mot_de_passe" type="password" autoComplete="current-password" required maxLength={200} />
      </div>
      {etat?.message ? <p className="alerte" role="alert">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours} data-cta="compte-connexion">{enCours ? "Connexion…" : "Me connecter"}</button>
      <p style={{ margin: 0, fontSize: 14 }}><Link href="/compte/oubli/">Mot de passe oublié ?</Link></p>
    </form>
  );
}

/** Un seul encart : créer son compte (et s'inscrire à la Lettre au passage) ou se connecter. */
export function AccesCompte({ retour, mode = "inscription" }: { retour: string; mode?: "inscription" | "connexion" }) {
  const [onglet, setOnglet] = useState(mode);
  return (
    <div className="acces-compte">
      <div role="tablist" aria-label="Compte" className="onglets-compte">
        <button type="button" role="tab" aria-selected={onglet === "inscription"} onClick={() => setOnglet("inscription")}>Nouveau compte</button>
        <button type="button" role="tab" aria-selected={onglet === "connexion"} onClick={() => setOnglet("connexion")}>J&apos;ai déjà un compte</button>
      </div>
      <div role="tabpanel">{onglet === "inscription" ? <Inscription retour={retour} /> : <Connexion retour={retour} />}</div>
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
