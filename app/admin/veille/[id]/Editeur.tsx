"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import type { EtatEdition } from "../actions";

interface Valeurs {
  titre: string; chapo: string; corps: string; avisSilfax: string; rubrique: string; etiquettes: string;
  pilier: string; description: string; accrocheFacebook: string; texteFacebook: string;
  imageId: number | null; imageAlt: string; imageCredit: string; imageLegende: string; imageFacebookId: number | null;
  avisPropose: string;
}

const TYPES_IMAGES = "image/jpeg,image/png,image/webp";

/** Source telle qu'affichée dans l'éditeur (liens calculés côté serveur). */
export interface SourceEditeur {
  nom: string;
  titre: string;
  url: string;
  mention: string;
  urlOriginal?: string;
  publiee: boolean;
}

function champ(form: HTMLFormElement | null, nom: string): string {
  const el = form?.elements.namedItem(nom);
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : "";
}

/** Proposition d'avis par l'IA : affichée à côté du champ, reprise seulement sur un clic de Jobwow. */
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

/** Image d'en-tête proposée (illustrations du jeu déjà présentes sur le site), calculée côté serveur. */
export interface ImageProposeeEditeur { cle: string; nom: string; apercu: string; alt: string; credit: string; raison: string }

/** Images proposées : la première est cochée d'office quand l'article n'a pas encore d'image ; elle n'est ajoutée qu'à l'enregistrement. */
/** Image trouvée sur Wikimedia Commons (licence libre), telle que la renvoie la recherche de l'éditeur. */
export interface ImageWikimediaEditeur { titre: string; nom: string; apercu: string; page: string; auteur: string; licence: string; largeur: number; hauteur: number }
type ChercherWikimedia = (terme: string) => Promise<{ images?: ImageWikimediaEditeur[]; erreur?: string }>;

function ImagesProposees({ images, toutes, sansImage, choix, setChoix, chercher }: {
  images: ImageProposeeEditeur[]; toutes: ImageProposeeEditeur[]; sansImage: boolean; choix: string; setChoix: (c: string) => void;
  chercher?: ChercherWikimedia;
}) {
  if (!images.length && !toutes.length) return null;
  return (
    <div className="champ">
      <label>{sansImage ? "Images proposées pour cet article" : "Remplacer par une image proposée"}</label>
      <small>
        Illustrations du jeu déjà présentes sur le site (écrans de chargement, cartes), choisies d&apos;après les lieux, donjons et classes cités.
        {sansImage ? " La première est retenue d'office : elle sera ajoutée à l'enregistrement, avec la case de déclaration cochée." : ""}
      </small>
      <div className="images-proposees">
        {images.map((i) => (
          <label key={i.cle} className={`image-proposee${choix === i.cle ? " image-choisie" : ""}`}>
            <input type="radio" name="imageProposee" value={i.cle} checked={choix === i.cle} onChange={() => setChoix(i.cle)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.apercu} alt="" loading="lazy" />
            <span><strong>{i.nom}</strong><small className="doux">{i.raison}</small></span>
          </label>
        ))}
        <label className={`image-proposee image-aucune${choix === "" ? " image-choisie" : ""}`}>
          <input type="radio" name="imageProposee" value="" checked={choix === ""} onChange={() => setChoix("")} />
          <span><strong>Aucune</strong><small className="doux">{sansImage ? "visuel généré par le site" : "garder l'image actuelle"}</small></span>
        </label>
      </div>
      <GalerieImages images={toutes.filter((t) => !images.some((i) => i.cle === t.cle))} nom="imageProposee" choix={choix} setChoix={setChoix} />
      {chercher ? <RechercheWikimedia chercher={chercher} choix={choix} setChoix={setChoix} /> : null}
    </div>
  );
}

/**
 * Recherche sur Wikimedia Commons, licences libres seulement (domaine public, CC0, CC BY, CC BY-SA). L'image choisie est
 * téléchargée à l'enregistrement, case de déclaration cochée, et son crédit (auteur, licence, source) est ajouté d'office.
 */
function RechercheWikimedia({ chercher, choix, setChoix }: { chercher: ChercherWikimedia; choix: string; setChoix: (c: string) => void }) {
  const [terme, setTerme] = useState("");
  const [resultats, setResultats] = useState<ImageWikimediaEditeur[] | null>(null);
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const lancer = () => {
    if (terme.trim().length < 2) return;
    setErreur("");
    demarrer(async () => {
      const r = await chercher(terme);
      if (r.images) setResultats(r.images);
      else setErreur(r.erreur ?? "Recherche impossible.");
    });
  };
  return (
    <details style={{ marginTop: 12 }} open={choix.startsWith("wikimedia:")}>
      <summary>Chercher sur Wikimedia Commons (licences libres)</summary>
      <small>
        Domaine public, CC0, CC BY et CC BY-SA seulement. L&apos;auteur et la licence partent dans le crédit de l&apos;image, comme ces licences l&apos;exigent.
        Vérifiez sur la page de l&apos;image qu&apos;elle ne reprend pas une œuvre protégée (illustration du jeu, capture d&apos;écran).
      </small>
      <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
        <input
          type="search" value={terme} onChange={(e) => setTerme(e.target.value)} placeholder="Exemple : taverne, montagne enneigée, chope de bière"
          aria-label="Recherche sur Wikimedia Commons" style={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lancer(); } }}
        />
        <button type="button" className="btn btn-contour" onClick={lancer} disabled={enCours}>{enCours ? "Recherche…" : "Chercher"}</button>
      </div>
      {erreur ? <p className="alerte" role="alert">{erreur}</p> : null}
      {resultats && !resultats.length ? <p className="doux">Aucune image libre assez grande pour un en-tête (800 pixels de large au moins).</p> : null}
      {resultats?.length ? (
        <div className="images-proposees" style={{ maxHeight: 460, overflowY: "auto" }}>
          {resultats.map((i) => {
            const cle = `wikimedia:${i.titre}`;
            return (
              <label key={cle} className={`image-proposee${choix === cle ? " image-choisie" : ""}`}>
                <input type="radio" name="imageProposee" value={cle} checked={choix === cle} onChange={() => setChoix(cle)} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.apercu} alt="" loading="lazy" referrerPolicy="no-referrer" />
                <span>
                  <strong>{i.nom}</strong>
                  <small className="doux">{i.auteur || "Auteur inconnu"} · {i.licence} · {i.largeur}×{i.hauteur}</small>
                  <small><a href={i.page} target="_blank" rel="noreferrer noopener">Voir sur Commons</a></small>
                </span>
              </label>
            );
          })}
        </div>
      ) : null}
    </details>
  );
}

/**
 * Toutes les illustrations du jeu que possède le site (écrans de chargement, cartes), avec un filtre par nom.
 * Aucune image venue d'un autre site : le choix passe, comme les propositions, par la case de déclaration et enregistrerImage.
 */
function GalerieImages({ images, nom, choix, setChoix }: { images: ImageProposeeEditeur[]; nom: string; choix: string; setChoix: (c: string) => void }) {
  const [filtre, setFiltre] = useState("");
  if (!images.length) return null;
  const n = (t: string) => t.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const vues = filtre ? images.filter((i) => n(`${i.nom} ${i.raison}`).includes(n(filtre))) : images;
  const choisie = images.find((i) => i.cle === choix);
  return (
    <details style={{ marginTop: 12 }} open={!!choisie}>
      <summary>Voir toutes les illustrations du site ({images.length}){choisie ? ` · choisie : ${choisie.nom}` : ""}</summary>
      <input
        type="search" value={filtre} onChange={(e) => setFiltre(e.target.value)} placeholder="Filtrer : Orgrimmar, Mortemines, carte, Kalimdor…"
        aria-label="Filtrer les illustrations" style={{ margin: "10px 0", width: "100%" }}
      />
      <div className="images-proposees" style={{ maxHeight: 460, overflowY: "auto" }}>
        {vues.map((i) => (
          <label key={i.cle} className={`image-proposee${choix === i.cle ? " image-choisie" : ""}`}>
            <input type="radio" name={nom} value={i.cle} checked={choix === i.cle} onChange={() => setChoix(i.cle)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.apercu} alt="" loading="lazy" />
            <span><strong>{i.nom}</strong><small className="doux">{i.raison}</small></span>
          </label>
        ))}
        {!vues.length ? <p className="doux">Aucune illustration ne correspond.</p> : null}
      </div>
    </details>
  );
}

/**
 * Légende de l'image d'en-tête, affichée sous l'image avant le crédit. Pour un brouillon sans légende, une proposition de l'IA
 * (ton de Jobwow, sur le thème de l'article) est demandée d'office ; elle reste modifiable, et rien n'est enregistré sans « Enregistrer ».
 */
function LegendeImage({ initiale, nomImage, proposer, auto }: {
  initiale: string; nomImage: string; auto: boolean;
  proposer: (contenu: { titre: string; chapo: string; corps: string }, image: string) => Promise<{ legende?: string; erreur?: string }>;
}) {
  const [legende, setLegende] = useState(initiale);
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const ref = useRef<HTMLInputElement>(null);
  const demander = () => {
    if (!nomImage) return;
    setErreur("");
    demarrer(async () => {
      const form = ref.current?.form ?? null;
      const r = await proposer({ titre: champ(form, "titre"), chapo: champ(form, "chapo"), corps: champ(form, "corps") }, nomImage);
      if (r.legende) setLegende(r.legende);
      else setErreur(r.erreur ?? "Proposition impossible.");
    });
  };
  const demandee = useRef(false);
  useEffect(() => {
    if (auto && !initiale && nomImage && !demandee.current) { demandee.current = true; demander(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, nomImage]);
  return (
    <div className="champ">
      <label htmlFor="imageLegende">Légende</label>
      <small>Affichée sous l&apos;image, avant le crédit. Une phrase sympathique sur le thème de l&apos;article, proposée par l&apos;IA : gardez-la, reprenez-la ou effacez-la.</small>
      <input ref={ref} id="imageLegende" name="imageLegende" type="text" value={legende} onChange={(e) => setLegende(e.target.value)} maxLength={200} placeholder={enCours ? "Proposition en cours…" : ""} />
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-contour btn-petit" onClick={demander} disabled={enCours || !nomImage}>
          {enCours ? "Proposition…" : legende ? "Proposer une autre légende" : "Proposer une légende"}
        </button>
        {!nomImage ? <small className="doux">Choisissez d&apos;abord une image.</small> : null}
        {erreur ? <small className="alerte" role="alert" style={{ padding: "2px 8px" }}>{erreur}</small> : null}
      </div>
    </div>
  );
}

/**
 * Accroche et texte du post Facebook. Pour un brouillon sans texte, une proposition de l'IA (ton de Jobwow, fidèle à l'article)
 * est demandée d'office ; « Proposer un autre texte » en demande une nouvelle. Rien n'est enregistré sans « Enregistrer ».
 */
function TexteFacebook({ accrocheInitiale, texteInitial, proposer, auto }: {
  accrocheInitiale: string; texteInitial: string; auto: boolean;
  proposer: (contenu: { titre: string; chapo: string; corps: string }) => Promise<{ accroche?: string; texte?: string; erreur?: string }>;
}) {
  const [accroche, setAccroche] = useState(accrocheInitiale);
  const [texte, setTexte] = useState(texteInitial);
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const ref = useRef<HTMLInputElement>(null);
  const demander = () => {
    setErreur("");
    demarrer(async () => {
      const form = ref.current?.form ?? null;
      const r = await proposer({ titre: champ(form, "titre"), chapo: champ(form, "chapo"), corps: champ(form, "corps") });
      if (r.accroche && r.texte) { setAccroche(r.accroche); setTexte(r.texte); }
      else setErreur(r.erreur ?? "Proposition impossible.");
    });
  };
  const demandee = useRef(false);
  useEffect(() => {
    if (auto && !accrocheInitiale && !texteInitial && !demandee.current) { demandee.current = true; demander(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);
  return (
    <>
      <div className="champ">
        <label htmlFor="accrocheFacebook">Accroche</label>
        <small>90 caractères maximum, un emoji au plus.</small>
        <input ref={ref} id="accrocheFacebook" name="accrocheFacebook" type="text" value={accroche} onChange={(e) => setAccroche(e.target.value)} maxLength={90} placeholder={enCours ? "Proposition en cours…" : ""} />
      </div>
      <div className="champ">
        <label htmlFor="texteFacebook">Texte de présentation</label>
        <small>2 à 3 phrases sympathiques sur l&apos;article, proposées par l&apos;IA : gardez-les ou reprenez-les. Le lien « Lire la suite à la Taverne », la phrase d&apos;appel et les mots-dièse sont ajoutés automatiquement.</small>
        <textarea id="texteFacebook" name="texteFacebook" value={texte} onChange={(e) => setTexte(e.target.value)} style={{ minHeight: 90 }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-contour btn-petit" onClick={demander} disabled={enCours}>
            {enCours ? "Proposition…" : accroche || texte ? "Proposer un autre texte" : "Proposer un texte sympa"}
          </button>
          {erreur ? <small className="alerte" role="alert" style={{ padding: "2px 8px" }}>{erreur}</small> : null}
        </div>
      </div>
    </>
  );
}

/** Image du post Facebook : par défaut l'image de l'article (aperçu du lien), ou une image proposée (post photo). */
function ImageFacebookProposee({ images, toutes, actuelle }: { images: ImageProposeeEditeur[]; toutes: ImageProposeeEditeur[]; actuelle: boolean }) {
  const [choix, setChoix] = useState("");
  if (!images.length && !toutes.length) return null;
  return (
    <div className="champ">
      <label>Image du post</label>
      <small>
        {actuelle ? "Le post utilise l'image ci-dessus." : "Par défaut, le post montre l'image de l'article, en aperçu du lien."} Une image choisie ici en fait un post photo.
      </small>
      <div className="images-proposees">
        <label className={`image-proposee image-aucune${choix === "" ? " image-choisie" : ""}`}>
          <input type="radio" name="imageFacebookProposee" value="" checked={choix === ""} onChange={() => setChoix("")} />
          <span><strong>{actuelle ? "Garder l'image actuelle" : "Image de l'article"}</strong><small className="doux">{actuelle ? "post photo" : "aperçu du lien"}</small></span>
        </label>
        {images.map((i) => (
          <label key={i.cle} className={`image-proposee${choix === i.cle ? " image-choisie" : ""}`}>
            <input type="radio" name="imageFacebookProposee" value={i.cle} checked={choix === i.cle} onChange={() => setChoix(i.cle)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.apercu} alt="" loading="lazy" />
            <span><strong>{i.nom}</strong><small className="doux">{i.raison}</small></span>
          </label>
        ))}
      </div>
      <GalerieImages images={toutes.filter((t) => !images.some((i) => i.cle === t.cle))} nom="imageFacebookProposee" choix={choix} setChoix={setChoix} />
    </div>
  );
}

export function Editeur({
  action, proposerAvis, proposerLegende, proposerTexteFacebook, valeurs, rubriques, piliers, publie, avisMinimum, sources, imagesProposees = [],
  toutesImages = [], chercherWikimedia,
}: {
  imagesProposees?: ImageProposeeEditeur[];
  toutesImages?: ImageProposeeEditeur[];
  chercherWikimedia?: ChercherWikimedia;
  proposerLegende: (contenu: { titre: string; chapo: string; corps: string }, image: string) => Promise<{ legende?: string; erreur?: string }>;
  proposerTexteFacebook: (contenu: { titre: string; chapo: string; corps: string }) => Promise<{ accroche?: string; texte?: string; erreur?: string }>;
  sources: SourceEditeur[];
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
  const [choixImage, setChoixImage] = useState(valeurs.imageId ? "" : imagesProposees[0]?.cle ?? "");
  // Image dont parle la légende : l'image proposée cochée, sinon l'image déjà en place (d'après sa description).
  const nomImage = (choixImage.startsWith("wikimedia:") ? choixImage.replace(/^wikimedia:File:/, "").replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ") : undefined)
    ?? [...imagesProposees, ...toutesImages].find((i) => i.cle === choixImage)?.nom ?? (valeurs.imageId ? valeurs.imageAlt || "image d'en-tête" : "");
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
        <ImagesProposees images={imagesProposees} toutes={toutesImages} chercher={chercherWikimedia} sansImage={!valeurs.imageId} choix={choixImage} setChoix={setChoixImage} />
        <div className="champ">
          <label htmlFor="image">{valeurs.imageId ? "Remplacer par une autre image" : "Ou envoyer une image"}</label>
          <small>JPEG, PNG ou WebP, 8 Mo au maximum, 1200 px de large conseillés. L&apos;image est recadrée automatiquement pour Facebook.</small>
          <input id="image" name="image" type="file" accept={TYPES_IMAGES} />
        </div>
        <div className="champ">
          <label htmlFor="imageAlt">Description de l&apos;image</label>
          <small>Obligatoire avec une image : ce qu&apos;elle montre, en une phrase (lue aux malvoyants et par Google). Vide avec une image proposée : sa description est reprise.</small>
          <input id="imageAlt" name="imageAlt" type="text" defaultValue={valeurs.imageAlt} maxLength={200} />
        </div>
        <div className="champ">
          <label htmlFor="imageCredit">Crédit</label>
          <small>Affiché sous l&apos;image. Exemple : « Capture de Jobwow · © Blizzard Entertainment ».</small>
          <input id="imageCredit" name="imageCredit" type="text" defaultValue={valeurs.imageCredit} maxLength={160} />
        </div>
        <LegendeImage initiale={valeurs.imageLegende} nomImage={nomImage} proposer={proposerLegende} auto={!publie} />
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
        <label htmlFor="avisSilfax">L&apos;avis de Jobwow</label>
        <small>Obligatoire pour publier ({avisMinimum} caractères minimum) : ressenti de joueur, ce qui donne envie, ce qui inquiète.</small>
        <textarea id="avisSilfax" name="avisSilfax" ref={avisRef} defaultValue={valeurs.avisSilfax} style={{ minHeight: 140 }} />
      </div>
      <PropositionAvis initiale={valeurs.avisPropose} proposer={proposerAvis} avisRef={avisRef} />

      {sources.length ? (
        <fieldset className="encadre" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <legend className="surtitre" style={{ padding: "0 6px" }}>Sources</legend>
          <small className="doux">
            Cochées : affichées en bas de l&apos;article. L&apos;IA a coché celles dont elle a repris une information.
            Au moins une source doit rester affichée.
          </small>
          <input type="hidden" name="sourcesPresentes" value="1" />
          {sources.map((s, i) => (
            <label key={s.url} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15 }}>
              <input type="checkbox" name="sourceAffichee" value={i} defaultChecked={s.publiee} style={{ width: 20, height: 20, flex: "none", marginTop: 2 }} />
              <span>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.nom} — {s.titre}</a>{" "}
                <span className="doux">
                  ({s.mention}
                  {s.urlOriginal ? <> · <a href={s.urlOriginal} target="_blank" rel="noopener noreferrer nofollow">original</a></> : null})
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}

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
        <TexteFacebook accrocheInitiale={valeurs.accrocheFacebook} texteInitial={valeurs.texteFacebook} proposer={proposerTexteFacebook} auto={!publie} />
        {valeurs.imageFacebookId ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/medias/${valeurs.imageFacebookId}/`} alt="Image du post Facebook" style={{ width: 200, maxWidth: "100%", borderRadius: 6, display: "block" }} />
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="retirerImageFacebook" style={{ width: 20, height: 20 }} /> Retirer cette image
            </label>
          </div>
        ) : null}
        <ImageFacebookProposee images={imagesProposees} toutes={toutesImages} actuelle={!!valeurs.imageFacebookId} />
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
