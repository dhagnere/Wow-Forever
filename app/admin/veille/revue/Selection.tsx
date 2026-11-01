"use client";

import { useActionState } from "react";
import type { EtatLancement } from "./actions";

export interface LigneRevue {
  cle: string;
  rang: number;
  titre: string;
  theme: string;
  pilier: string | null;
  score: number;
  detail: string;
  dejaTraite: boolean;
  coche: boolean;
  sources: { nom: string; url: string; mention: string; urlOriginal?: string }[];
}

export function SelectionRevue({
  action, lignes, bloque, max,
}: {
  action: (etat: EtatLancement, form: FormData) => Promise<EtatLancement>;
  lignes: LigneRevue[];
  bloque: boolean;
  max: number;
}) {
  const [etat, envoyer, enCours] = useActionState(action, {});
  return (
    <form action={envoyer} className="formulaire">
      {etat.erreur ? <p className="alerte" role="alert">{etat.erreur}</p> : null}
      {etat.message ? <p className="info" role="status">{etat.message}</p> : null}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-or" disabled={enCours || bloque}>Rédiger les sujets cochés</button>
        <span className="doux" style={{ fontSize: 15 }}>
          Chaque sujet coché devient un brouillon rédigé par l&apos;IA (facturé à l&apos;usage). {max} sujets au plus par lancement.
        </span>
      </div>

      <div className="tableau-boite">
        <table className="admin-table">
          <thead>
            <tr><th scope="col">Rédiger</th><th scope="col">#</th><th scope="col">Score</th><th scope="col">Sujet</th><th scope="col">Thème</th><th scope="col">Sources</th></tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.cle}>
                <td>
                  {l.dejaTraite ? (
                    <span className="doux">déjà rédigé</span>
                  ) : (
                    <input type="checkbox" name="cle" value={l.cle} defaultChecked={l.coche} aria-label={`Rédiger : ${l.titre}`} style={{ width: 22, height: 22 }} />
                  )}
                </td>
                <td>{l.rang}</td>
                <td title={l.detail}>{l.score}</td>
                <td>{l.titre}</td>
                <td>
                  {l.theme}
                  {l.pilier ? <div className="doux" style={{ fontSize: 13 }}>/{l.pilier}/</div> : null}
                </td>
                <td>
                  {l.sources.map((s) => (
                    <div key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.nom}</a>{" "}
                      <span className="doux">
                        ({s.mention}
                        {s.urlOriginal ? <> · <a href={s.urlOriginal} target="_blank" rel="noopener noreferrer nofollow">original</a></> : null})
                      </span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
