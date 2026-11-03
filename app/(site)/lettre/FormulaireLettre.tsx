"use client";

import { useActionState } from "react";
import { sInscrire, type EtatLettre } from "./actions";

export function FormulaireLettre() {
  const [etat, action, enCours] = useActionState<EtatLettre, FormData>(sInscrire, null);
  return (
    <form action={action} className="formulaire-lettre">
      <div className="champ">
        <label htmlFor="courriel">Votre adresse électronique</label>
        <input id="courriel" name="courriel" type="email" autoComplete="email" required maxLength={254} placeholder="prenom@exemple.fr" />
      </div>
      <div className="piege" aria-hidden="true">
        <label htmlFor="site_web">Ne pas remplir</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="case">
        <input type="checkbox" name="accord" value="oui" required />
        <span>J&apos;accepte de recevoir la Lettre de la Taverne chaque dimanche. Je peux me désinscrire en un clic à tout moment.</span>
      </label>
      {etat ? <p className="alerte" role="alert">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours} data-cta="lettre-page">
        {enCours ? "Inscription…" : "Recevoir la Lettre"}
      </button>
    </form>
  );
}
