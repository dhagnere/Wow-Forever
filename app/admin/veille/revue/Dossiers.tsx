"use client";

import { useActionState } from "react";
import type { EtatLancement } from "./actions";

/** Recherche de dossiers de référence : zones de départ, donjons, zones par niveau. */
export function RechercheDossiers({
  action, dossiers, enCours,
}: {
  action: (etat: EtatLancement, form: FormData) => Promise<EtatLancement>;
  dossiers: { id: string; nom: string }[];
  enCours: boolean;
}) {
  const [etat, envoyer, envoi] = useActionState(action, {});
  return (
    <details className="encadre" style={{ marginBottom: 24 }}>
      <summary style={{ cursor: "pointer", fontWeight: 700 }}>Dossiers de référence</summary>
      <form action={envoyer} className="formulaire" style={{ marginTop: 12, gap: 12 }}>
        <p className="doux" style={{ margin: 0, fontSize: 15 }}>
          Recherches ciblées sur 60 jours, pour alimenter les pages durables. Sans coût d&apos;API : seule la rédaction des sujets cochés ensuite est facturée.
        </p>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {dossiers.map((d) => (
            <label key={d.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="dossier" value={d.id} defaultChecked style={{ width: 20, height: 20 }} /> {d.nom}
            </label>
          ))}
        </div>
        {etat.erreur ? <p className="alerte" role="alert" style={{ margin: 0 }}>{etat.erreur}</p> : null}
        {etat.message ? <p className="info" role="status" style={{ margin: 0 }}>{etat.message}</p> : null}
        <div>
          <button type="submit" className="btn btn-contour" disabled={envoi || enCours}>
            {enCours ? "Recherche en cours…" : "Rechercher les dossiers"}
          </button>
        </div>
      </form>
    </details>
  );
}
