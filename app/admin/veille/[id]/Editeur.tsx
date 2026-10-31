"use client";

import { useActionState } from "react";
import type { EtatEdition } from "../actions";

interface Valeurs {
  titre: string; chapo: string; corps: string; avisSilfax: string; rubrique: string; etiquettes: string;
  pilier: string; description: string; accrocheFacebook: string; texteFacebook: string;
}

export function Editeur({
  action, valeurs, rubriques, piliers, publie, avisMinimum, programmeLe, programmeParDefaut,
}: {
  action: (etat: EtatEdition, form: FormData) => Promise<EtatEdition>;
  valeurs: Valeurs;
  rubriques: { slug: string; nom: string }[];
  piliers: readonly string[];
  publie: boolean;
  avisMinimum: number;
  /** Date programmée (heure de Paris, « AAAA-MM-JJTHH:MM »), ou "" si l'article n'est pas programmé. */
  programmeLe: string;
  programmeParDefaut: string;
}) {
  const [etat, envoyer, enCours] = useActionState(action, { erreurs: [] });
  return (
    <form action={envoyer} className="formulaire">
      {etat.erreurs.length ? (
        <div className="alerte" role="alert">
          <strong>Publication impossible :</strong>
          <ul>{etat.erreurs.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      ) : null}
      {etat.message ? <p className="info" role="status">{etat.message}</p> : null}

      <div className="champ">
        <label htmlFor="titre">Titre</label>
        <input id="titre" name="titre" type="text" defaultValue={valeurs.titre} required maxLength={160} />
      </div>
      <div className="champ">
        <label htmlFor="chapo">Chapô</label>
        <textarea id="chapo" name="chapo" defaultValue={valeurs.chapo} style={{ minHeight: 80 }} />
      </div>
      <div className="champ">
        <label htmlFor="corps">Corps de l&apos;article (Markdown)</label>
        <small>Intertitres avec « ## », listes avec « - ». Une vidéo YouTube : coller le code d&apos;intégration (iframe youtube-nocookie.com).</small>
        <textarea id="corps" name="corps" className="grand" defaultValue={valeurs.corps} />
      </div>
      <div className="champ">
        <label htmlFor="avisSilfax">L&apos;avis de Silfax</label>
        <small>Obligatoire pour publier ({avisMinimum} caractères minimum) : ressenti de joueur, ce qui donne envie, ce qui inquiète.</small>
        <textarea id="avisSilfax" name="avisSilfax" defaultValue={valeurs.avisSilfax} style={{ minHeight: 140 }} />
      </div>

      <div className="g2">
        <div className="champ">
          <label htmlFor="rubrique">Rubrique</label>
          <select id="rubrique" name="rubrique" defaultValue={valeurs.rubrique}>
            {rubriques.map((r) => <option key={r.slug} value={r.slug}>{r.nom}</option>)}
          </select>
        </div>
        <div className="champ">
          <label htmlFor="pilier">Page pilier liée</label>
          <select id="pilier" name="pilier" defaultValue={valeurs.pilier}>
            <option value="">Aucune</option>
            {piliers.map((p) => <option key={p} value={p}>/{p}/</option>)}
          </select>
        </div>
      </div>
      <div className="champ">
        <label htmlFor="etiquettes">Étiquettes</label>
        <small>3 à 6, séparées par des virgules.</small>
        <input id="etiquettes" name="etiquettes" type="text" defaultValue={valeurs.etiquettes} />
      </div>
      <div className="champ">
        <label htmlFor="description">Description pour Google</label>
        <small>120 à 155 caractères.</small>
        <textarea id="description" name="description" defaultValue={valeurs.description} style={{ minHeight: 70 }} maxLength={200} />
      </div>

      <fieldset className="encadre" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <legend className="surtitre" style={{ padding: "0 6px" }}>Post Facebook</legend>
        <div className="champ">
          <label htmlFor="accrocheFacebook">Accroche</label>
          <small>90 caractères maximum, un emoji au plus.</small>
          <input id="accrocheFacebook" name="accrocheFacebook" type="text" defaultValue={valeurs.accrocheFacebook} maxLength={90} />
        </div>
        <div className="champ">
          <label htmlFor="texteFacebook">Texte de présentation</label>
          <small>2 à 3 phrases simples. Le lien « La suite ici » et les mots-dièse sont ajoutés automatiquement.</small>
          <textarea id="texteFacebook" name="texteFacebook" defaultValue={valeurs.texteFacebook} style={{ minHeight: 90 }} />
        </div>
      </fieldset>

      {!publie ? (
        <fieldset className="encadre" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <legend className="surtitre" style={{ padding: "0 6px" }}>Programmer la publication</legend>
          <p className="doux" style={{ margin: 0, fontSize: 15 }}>
            {programmeLe
              ? "Publication programmée. Vous pouvez changer l'heure ou annuler. Tant qu'il est programmé, l'article doit rester complet à chaque enregistrement."
              : "L'article sera mis en ligne automatiquement à l'heure choisie (heure de Paris), au passage horaire suivant, avec les mêmes contrôles qu'une publication immédiate."}
          </p>
          <div className="actions-ligne">
            <label htmlFor="programmeLe" className="sr-only">Date et heure de publication</label>
            <input id="programmeLe" name="programmeLe" type="datetime-local" defaultValue={programmeLe || programmeParDefaut} />
            <button type="submit" name="intention" value="programmer" className="btn btn-contour" disabled={enCours}>
              {programmeLe ? "Changer l'heure" : "Programmer"}
            </button>
            {programmeLe ? (
              <button type="submit" name="intention" value="annuler-programmation" className="btn btn-danger" disabled={enCours}>Annuler la programmation</button>
            ) : null}
          </div>
        </fieldset>
      ) : null}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="submit" name="intention" value="enregistrer" className="btn btn-contour" disabled={enCours}>Enregistrer</button>
        {!publie ? (
          <button type="submit" name="intention" value="publier" className="btn btn-or" disabled={enCours}>Enregistrer et publier maintenant</button>
        ) : null}
      </div>
    </form>
  );
}
