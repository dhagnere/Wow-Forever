"use client";

import { useActionState, useState } from "react";
import type { FicheGuilde } from "@/modules/veille";
import { inscrireGuilde, mettreAJourGuilde, type EtatGuilde } from "./actions";

function Cases({ nom, options, cochees }: { nom: string; options: Record<string, string>; cochees: string[] }) {
  return (
    <div className="cases-guilde">
      {Object.entries(options).map(([valeur, libelle]) => (
        <label key={valeur} className="case">
          <input type="checkbox" name={nom} value={valeur} defaultChecked={cochees.includes(valeur)} />
          <span>{libelle}</span>
        </label>
      ))}
    </div>
  );
}

function CopierLien({ lien }: { lien: string }) {
  const [copie, setCopie] = useState(false);
  return (
    <div className="encadre-chaud" role="status">
      <h2 style={{ marginTop: 0 }}>Fiche reçue, merci !</h2>
      <p>Jobwow la relit et la publie sous 48 heures. Voici votre lien personnel pour la modifier ou confirmer que la guilde est toujours active :</p>
      <p className="lien-secret"><code>{lien}</code></p>
      <button
        type="button"
        className="btn btn-or"
        onClick={() => navigator.clipboard?.writeText(lien).then(() => setCopie(true)).catch(() => {})}
      >
        {copie ? "Lien copié" : "Copier le lien"}
      </button>
      <p className="doux" style={{ fontSize: 14, marginBottom: 0 }}>
        Gardez-le précieusement : il ne sera plus affiché et personne d&apos;autre ne doit l&apos;avoir. Une fiche non confirmée pendant 90 jours
        disparaît du tableau.
      </p>
    </div>
  );
}

/** Libellés des listes, transmis par la page serveur : le formulaire n'importe pas le module côté navigateur. */
export interface LibellesGuilde {
  factions: Record<string, string>;
  types: Record<string, string>;
  objectifs: Record<string, string>;
  roles: Record<string, string>;
  classes: Record<string, string>;
}

export function FormulaireGuilde({ fiche, jeton, libelles }: { fiche?: FicheGuilde; jeton?: string; libelles: LibellesGuilde }) {
  const { factions: FACTIONS, types: TYPES_ROYAUME, objectifs: OBJECTIFS, roles: ROLES, classes: CLASSES_GUILDE } = libelles;
  const [etat, action, enCours] = useActionState<EtatGuilde, FormData>(jeton ? mettreAJourGuilde : inscrireGuilde, null);
  if (etat?.lien) return <CopierLien lien={etat.lien} />;
  // Après une erreur, la saisie revient telle quelle ; sinon, la fiche existante (modification) ou rien.
  const z = etat?.saisie;
  const t = (c: keyof FicheGuilde): string | undefined => (z ? String(z[c] ?? "") : fiche ? String(fiche[c] ?? "") : undefined);
  const l = (c: "objectifs" | "classes" | "roles"): string[] => (z ? (z[c] as string[]) ?? [] : fiche?.[c] ?? []);
  const recrute = z ? z.recrute === "oui" : fiche ? fiche.recrute : true;
  return (
    // La clé reconstruit le formulaire avec la saisie renvoyée : sinon les listes déroulantes reviennent à « Choisir ».
    <form action={action} className="formulaire-guilde" key={z ? JSON.stringify(z) : "vide"}>
      {jeton ? <input type="hidden" name="jeton" value={jeton} /> : null}
      {etat?.erreurs.length ? (
        <div className="alerte" role="alert">
          <ul style={{ margin: 0, paddingLeft: 18 }}>{etat.erreurs.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      ) : null}
      {etat?.message ? <p className="info" role="status">{etat.message}</p> : null}

      <div className="grille-champs">
        <div className="champ">
          <label htmlFor="nom">Nom de la guilde</label>
          <input id="nom" name="nom" type="text" required minLength={2} maxLength={60} defaultValue={t("nom")} />
        </div>
        <div className="champ">
          <label htmlFor="serveur">Serveur (royaume)</label>
          <input id="serveur" name="serveur" type="text" required minLength={2} maxLength={40} defaultValue={t("serveur")} />
        </div>
        <div className="champ">
          <label htmlFor="faction">Faction</label>
          <select id="faction" name="faction" required defaultValue={t("faction") ?? ""}>
            <option value="" disabled>Choisir</option>
            {Object.entries(FACTIONS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="champ">
          <label htmlFor="typeRoyaume">Type de royaume</label>
          <select id="typeRoyaume" name="typeRoyaume" required defaultValue={t("typeRoyaume") ?? ""}>
            <option value="" disabled>Choisir</option>
            {Object.entries(TYPES_ROYAUME).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      <fieldset>
        <legend>Ce que fait la guilde</legend>
        <Cases nom="objectifs" options={OBJECTIFS} cochees={l("objectifs")} />
      </fieldset>

      <fieldset>
        <legend>Recrutement</legend>
        <label className="case" style={{ marginBottom: 12 }}>
          <input type="checkbox" name="recrute" value="oui" defaultChecked={recrute} />
          <span>La guilde recrute en ce moment</span>
        </label>
        <p className="doux" style={{ margin: "0 0 8px", fontSize: 14 }}>Rôles recherchés</p>
        <Cases nom="roles" options={ROLES} cochees={l("roles")} />
        <p className="doux" style={{ margin: "12px 0 8px", fontSize: 14 }}>Classes recherchées</p>
        <Cases nom="classes" options={CLASSES_GUILDE} cochees={l("classes")} />
      </fieldset>

      <div className="champ">
        <label htmlFor="description">Présentation</label>
        <small>Ambiance, objectifs, ce que vous attendez des recrues. 600 caractères au plus, sans lien.</small>
        <textarea id="description" name="description" required minLength={40} maxLength={600} defaultValue={t("description")} />
      </div>
      <div className="champ">
        <label htmlFor="horaires">Horaires de jeu</label>
        <input id="horaires" name="horaires" type="text" maxLength={80} placeholder="Soirs de semaine, 21 h – minuit" defaultValue={t("horaires")} />
      </div>

      <fieldset>
        <legend>Contact (un au moins)</legend>
        <div className="grille-champs">
          <div className="champ">
            <label htmlFor="discord">Invitation Discord</label>
            <input id="discord" name="discord" type="text" maxLength={120} placeholder="discord.gg/…" defaultValue={t("discord")} />
          </div>
          <div className="champ">
            <label htmlFor="contactJeu">Personnage à contacter en jeu</label>
            <input id="contactJeu" name="contactJeu" type="text" maxLength={40} defaultValue={t("contactJeu")} />
          </div>
          <div className="champ">
            <label htmlFor="site">Site de la guilde</label>
            <input id="site" name="site" type="text" maxLength={200} placeholder="https://…" defaultValue={t("site")} />
          </div>
        </div>
      </fieldset>

      <div className="piege" aria-hidden="true">
        <label htmlFor="site_web">Ne pas remplir</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {!jeton ? (
        <label className="case">
          <input type="checkbox" name="charte" value="oui" required />
          <span>
            Je représente cette guilde et j&apos;accepte les règles du tableau : guilde francophone de WoW Forever, présentation honnête,
            ni vente d&apos;or ni service payant, aucun propos discriminant.
          </span>
        </label>
      ) : null}

      <button type="submit" className="btn btn-or" disabled={enCours} data-cta={jeton ? "modifier-guilde" : "envoyer-guilde"}>
        {enCours ? "Envoi…" : jeton ? "Enregistrer les modifications" : "Inscrire ma guilde"}
      </button>
    </form>
  );
}
