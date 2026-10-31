"use client";

import { useActionState } from "react";
import { modifierMotDePasse } from "../actions";

export function FormulaireMotDePasse({ minimum }: { minimum: number }) {
  const [erreur, action, enCours] = useActionState(modifierMotDePasse, null);
  return (
    <form action={action} className="formulaire" style={{ maxWidth: 460 }}>
      {erreur ? <p className="alerte" role="alert">{erreur}</p> : null}
      <div className="champ">
        <label htmlFor="actuel">Mot de passe actuel</label>
        <input id="actuel" name="actuel" type="password" autoComplete="current-password" required />
      </div>
      <div className="champ">
        <label htmlFor="nouveau">Nouveau mot de passe</label>
        <small>{minimum} caractères minimum. Une phrase de quatre ou cinq mots se retient mieux qu&apos;un code compliqué.</small>
        <input id="nouveau" name="nouveau" type="password" autoComplete="new-password" minLength={minimum} required />
      </div>
      <div className="champ">
        <label htmlFor="confirmation">Confirmer le nouveau mot de passe</label>
        <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={minimum} required />
      </div>
      <button type="submit" className="btn btn-or" disabled={enCours}>Changer le mot de passe</button>
    </form>
  );
}
