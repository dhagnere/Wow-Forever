"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import type { EtatEdition } from "../actions";

interface Valeurs {
  titre: string; chapo: string; corps: string; avisSilfax: string; rubrique: string; etiquettes: string;
  pilier: string; description: string; accrocheFacebook: string; texteFacebook: string;
  imageId: number | null; imageAlt: string; imageCredit: string; imageFacebookId: number | null;
  avisPropose: string;
}

const TYPES_IMAGES = "image/jpeg,image/png,image/webp";

function champ(form: HTMLFormElement | null, nom: string): string {
  const el = form?.elements.namedItem(nom);
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : "";
}

/** Proposition d'avis par l'IA : affichée à côté du champ, reprise seulement sur un clic de Silfax. */
function PropositionAvis({
  initiale, proposer, avisRef,
}: {
  initiale: string;
  proposer: (contenu: { titre: string; chapo: string; corps: string }) => Promise<{ avis?: string; erreur?: string }>;
  avisRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [proposition, setProposition] = useState(initiale);
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const boite = useRef<HTMLDivElement>(null);

  function demander() {
    const form = boite.current?.closest("form") ?? null;
    setErreur("");
    demarrer(async () => {
      const r = await proposer({ titre: champ(form, "titre"), chapo: champ(form, "chapo"), corps: champ(form, "corps") });
      if (r.avis) setProposition(r.avis);
      else setErreur(r.erreur ?? "Proposition impossible.");
    });
  }

  function reprendre() {
    const zone = avisRef.current;
    if (!zone) return;
    zone.value = proposition;
    zone.focus();
  }

  return (
    <div ref={boite} className="encadre" style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-live="polite">
      <p className="surtitre" style={{ margin: 0 }}>Proposition de l&apos;IA</p>
      {proposition ? (
        <p style={{ margin: 0, fontStyle: "italic", color: "var(--texte-chaud)" }}>{proposition}</p>
      ) : (
        <p className="doux" style={{ margin: 0, fontSize: 15 }}>Aucune proposition pour l&apos;instant.</p>
      )}
      {erreur ? <p className="alerte" role="alert" style={{ margin: 0 }}>{erreur}</p> : null}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {proposition ? (
          <button type="button" className="btn btn-or" onClick={reprendre} disabled={enCours}>Reprendre dans mon avis</button>
        ) : null}
        <button type="button" className="btn btn-contour" onClick={demander} disabled={enCours}>
          {enCours ? "Rédaction…" : proposition ? "Une autre proposition" : "Proposer un avis"}
        </button>
      </div>
      <small className="doux">
        Une suggestion, rédigée d&apos;après le texte de l&apos;article. Relisez-la : une fois reprise et publiée, c&apos;est votre avis.
      </small>
    </div>
  );
}

export function Editeur({
  action, proposerAvis, valeurs, rubriques, piliers, publie, avisMinimum,
}: {
  action: (etat: EtatEdition, form: FormData) => Promise<EtatEdition>;
  proposerAvis: (contenu: { titre: string; chapo: string; corps: string }) => Promise<{ avis?: string; erreur?: string }>;
  valeurs: Valeurs;
  rubriques: { slug: string; nom: string }[];
  piliers: readonly string[];
  publie: boolean;
  avisMinimum: number;
}) {
  const [etat, envoyer, enCours] = useActionState(action, { erreurs: [] });
  const avisRef = useRef<HTMLTextAreaElement>(null);
  return (
    <form action={envoyer} className="formulaire">
      {etat.erreurs.length ? (
        <div className="alerte" role="alert">
          <strong>À corriger :</strong>
          <ul>{etat.erreurs.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      ) : null}
      {etat.message ? <p className="info" role="status">{etat.message}</p> : null}

      <fieldset className="encadre" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <legend className="surtitre" style={{ padding: "0 6px" }}>Image d&apos;en-tête</legend>
        {valeurs.imageId ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/medias/${valeurs.imageId}/`} alt={valeurs.imageAlt} style={{ width: 280, maxWidth: "100%", borderRadius: 6, display: "block" }} />
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="retirerImage" style={{ width: 20, height: 20 }} /> Retirer cette image
            </label>
          </div>
        ) : (
          <small className="doux">Aucune image : le site affiche un visuel généré, et Facebook une image aux couleurs du site.</small>
        )}
        <div className="champ">
          <label htmlFor="image">{valeurs.imageId ? "Remplacer par une autre image" : "Envoyer une image"}</label>
          <small>JPEG, PNG ou WebP, 8 Mo au maximum, 1200 px de large conseillés. L&apos;image est recadrée automatiquement pour Facebook.</small>
          <input id="image" name="image" type="file" accept={TYPES_IMAGES} />
        </div>
        <div className="champ">
          <label htmlFor="imageAlt">Description de l&apos;image</label>
          <small>Obligatoire avec une image : ce qu&apos;elle montre, en une phrase (lue aux malvoyants et par Google).</small>
          <input id="imageAlt" name="imageAlt" type="text" defaultValue={valeurs.imageAlt} maxLength={200} />
        </div>
        <div className="champ">
          <label htmlFor="imageCredit">Crédit</label>
          <small>Affiché sous l&apos;image. Exemple : « Capture de Silfax · © Blizzard Entertainment ».</small>
          <input id="imageCredit" name="imageCredit" type="text" defaultValue={valeurs.imageCredit} maxLength={160} />
        </div>
      </fieldset>

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
        <textarea id="avisSilfax" name="avisSilfax" ref={avisRef} defaultValue={valeurs.avisSilfax} style={{ minHeight: 140 }} />
      </div>
      <PropositionAvis initiale={valeurs.avisPropose} proposer={proposerAvis} avisRef={avisRef} />

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
        {valeurs.imageFacebookId ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/medias/${valeurs.imageFacebookId}/`} alt="Image du post Facebook" style={{ width: 200, maxWidth: "100%", borderRadius: 6, display: "block" }} />
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="retirerImageFacebook" style={{ width: 20, height: 20 }} /> Retirer cette image
            </label>
          </div>
        ) : null}
        <div className="champ">
          <label htmlFor="imageFacebook">{valeurs.imageFacebookId ? "Remplacer l'image du post" : "Image propre au post (facultatif)"}</label>
          <small>
            Avec une image ici, le post Facebook devient un post photo : l&apos;image en grand, le lien vers l&apos;article dans le texte.
            Sans image, Facebook affiche l&apos;aperçu du lien avec l&apos;image d&apos;en-tête.
          </small>
          <input id="imageFacebook" name="imageFacebook" type="file" accept={TYPES_IMAGES} />
        </div>
      </fieldset>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15 }}>
        <input type="checkbox" name="droitsImages" style={{ width: 20, height: 20, flex: "none", marginTop: 2 }} />
        <span>
          Les images que j&apos;envoie sont les miennes (captures d&apos;écran, créations) ou utilisées avec l&apos;accord de leur auteur.
          Aucune image copiée sur un autre site. <span className="doux">(Obligatoire pour envoyer une image.)</span>
        </span>
      </label>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="submit" name="intention" value="enregistrer" className="btn btn-contour" disabled={enCours}>Enregistrer</button>
        {!publie ? (
          <button type="submit" name="intention" value="publier" className="btn btn-or" disabled={enCours}>Enregistrer et publier</button>
        ) : null}
      </div>
    </form>
  );
}
