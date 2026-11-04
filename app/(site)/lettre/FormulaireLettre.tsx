"use client";

import { useActionState } from "react";
import { sInscrire, type EtatLettre } from "./actions";

const TXT = {
  fr: {
    courriel: "Votre adresse électronique", exemple: "prenom@exemple.fr", piege: "Ne pas remplir",
    accord: "J'accepte de recevoir la Lettre de la Taverne chaque dimanche. Je peux me désinscrire en un clic à tout moment.",
    envoi: "Inscription…", bouton: "Recevoir la Lettre",
  },
  en: {
    courriel: "Your email address", exemple: "name@example.com", piege: "Leave empty",
    accord: "I agree to receive the Tavern's newsletter every Sunday. I can unsubscribe in one click at any time.",
    envoi: "Signing up…", bouton: "Get the newsletter",
  },
} as const;

export function FormulaireLettre({ langue = "fr" }: { langue?: "fr" | "en" }) {
  const [etat, action, enCours] = useActionState<EtatLettre, FormData>(sInscrire, null);
  const t = TXT[langue];
  return (
    <form action={action} className="formulaire-lettre">
      <input type="hidden" name="langue" value={langue} />
      <div className="champ">
        <label htmlFor="courriel">{t.courriel}</label>
        <input id="courriel" name="courriel" type="email" autoComplete="email" required maxLength={254} placeholder={t.exemple} defaultValue={etat?.courriel} />
      </div>
      <div className="piege" aria-hidden="true">
        <label htmlFor="site_web">{t.piege}</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="case">
        <input type="checkbox" name="accord" value="oui" required />
        <span>{t.accord}</span>
      </label>
      {etat ? <p className="alerte" role="alert">{etat.message}</p> : null}
      <button type="submit" className="btn btn-or" disabled={enCours} data-cta={langue === "en" ? "lettre-page-en" : "lettre-page"}>
        {enCours ? t.envoi : t.bouton}
      </button>
    </form>
  );
}
