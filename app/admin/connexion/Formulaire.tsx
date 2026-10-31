"use client";

import { useActionState } from "react";
import { seConnecter } from "./actions";

export function FormulaireConnexion() {
  const [erreur, action, enCours] = useActionState(seConnecter, null);
  return (
    <form action={action} className="formulaire" style={{ maxWidth: 420 }}>
      {erreur ? <p className="alerte" role="alert">{erreur}</p> : null}
      <div className="champ">
        <label htmlFor="motdepasse">Mot de passe</label>
        <input id="motdepasse" name="motdepasse" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="btn btn-or" disabled={enCours}>Se connecter</button>
    </form>
  );
}
