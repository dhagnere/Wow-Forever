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

type Langue = "fr" | "en";
const TXT = {
  fr: {
    recue: "Fiche reçue, merci !", relue: "Jobwow la relit et la publie sous 48 heures. Voici votre lien personnel pour la modifier ou confirmer que la guilde est toujours active :",
    copie: "Lien copié", copier: "Copier le lien",
    garder: "Gardez-le précieusement : il ne sera plus affiché et personne d'autre ne doit l'avoir. Une fiche non confirmée pendant 90 jours disparaît du tableau.",
    nom: "Nom de la guilde", serveur: "Serveur (royaume)", faction: "Faction", type: "Type de royaume", choisir: "Choisir",
    activite: "Ce que fait la guilde", recrutement: "Recrutement", recrute: "La guilde recrute en ce moment", roles: "Rôles recherchés", classes: "Classes recherchées",
    presentation: "Présentation", aidePresentation: "Ambiance, objectifs, ce que vous attendez des recrues. 600 caractères au plus, sans lien.",
    horaires: "Horaires de jeu", exempleHoraires: "Soirs de semaine, 21 h – minuit", contact: "Contact (un au moins)", discord: "Invitation Discord",
    contactJeu: "Personnage à contacter en jeu", site: "Site de la guilde", piege: "Ne pas remplir",
    charte: "Je représente cette guilde et j'accepte les règles du tableau : guilde francophone de WoW Forever, présentation honnête, ni vente d'or ni service payant, aucun propos discriminant.",
    envoi: "Envoi…", enregistrer: "Enregistrer les modifications", inscrire: "Inscrire ma guilde",
  },
  en: {
    recue: "Listing received, thank you!", relue: "Jobwow reviews and publishes it within 48 hours. Here is your personal link to edit it or confirm the guild is still active:",
    copie: "Link copied", copier: "Copy the link",
    garder: "Keep it safe: it will not be shown again and nobody else should have it. A listing not confirmed for 90 days disappears from the board.",
    nom: "Guild name", serveur: "Realm", faction: "Faction", type: "Realm type", choisir: "Choose",
    activite: "What the guild does", recrutement: "Recruitment", recrute: "The guild is recruiting right now", roles: "Roles wanted", classes: "Classes wanted",
    presentation: "Presentation", aidePresentation: "Atmosphere, goals, what you expect from recruits. 600 characters at most, no links. Write it in the language your guild speaks.",
    horaires: "Play times", exempleHoraires: "Weekday evenings, 9 pm – midnight (Paris time)", contact: "Contact (at least one)", discord: "Discord invite",
    contactJeu: "Character to contact in game", site: "Guild website", piege: "Leave empty",
    charte: "I represent this guild and accept the board's rules: a French-speaking WoW Forever guild, an honest presentation, no gold selling or paid service, no discriminatory remarks.",
    envoi: "Sending…", enregistrer: "Save changes", inscrire: "Register my guild",
  },
} as const;

function CopierLien({ lien, t }: { lien: string; t: (typeof TXT)[Langue] }) {
  const [copie, setCopie] = useState(false);
  return (
    <div className="encadre-chaud" role="status">
      <h2 style={{ marginTop: 0 }}>{t.recue}</h2>
      <p>{t.relue}</p>
      <p className="lien-secret"><code>{lien}</code></p>
      <button
        type="button"
        className="btn btn-or"
        onClick={() => navigator.clipboard?.writeText(lien).then(() => setCopie(true)).catch(() => {})}
      >
        {copie ? t.copie : t.copier}
      </button>
      <p className="doux" style={{ fontSize: 14, marginBottom: 0 }}>{t.garder}</p>
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

export function FormulaireGuilde({ fiche, jeton, libelles, langue = "fr" }: { fiche?: FicheGuilde; jeton?: string; libelles: LibellesGuilde; langue?: Langue }) {
  const tx = TXT[langue];
  const { factions: FACTIONS, types: TYPES_ROYAUME, objectifs: OBJECTIFS, roles: ROLES, classes: CLASSES_GUILDE } = libelles;
  const [etat, action, enCours] = useActionState<EtatGuilde, FormData>(jeton ? mettreAJourGuilde : inscrireGuilde, null);
  if (etat?.lien) return <CopierLien lien={etat.lien} t={tx} />;
  // Après une erreur, la saisie revient telle quelle ; sinon, la fiche existante (modification) ou rien.
  const z = etat?.saisie;
  const t = (c: keyof FicheGuilde): string | undefined => (z ? String(z[c] ?? "") : fiche ? String(fiche[c] ?? "") : undefined);
  const l = (c: "objectifs" | "classes" | "roles"): string[] => (z ? (z[c] as string[]) ?? [] : fiche?.[c] ?? []);
  const recrute = z ? z.recrute === "oui" : fiche ? fiche.recrute : true;
  return (
    // La clé reconstruit le formulaire avec la saisie renvoyée : sinon les listes déroulantes reviennent à « Choisir ».
    <form action={action} className="formulaire-guilde" key={z ? JSON.stringify(z) : "vide"}>
      {jeton ? <input type="hidden" name="jeton" value={jeton} /> : null}
      <input type="hidden" name="langue" value={langue} />
      {etat?.erreurs.length ? (
        <div className="alerte" role="alert">
          <ul style={{ margin: 0, paddingLeft: 18 }}>{etat.erreurs.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      ) : null}
      {etat?.message ? <p className="info" role="status">{etat.message}</p> : null}

      <div className="grille-champs">
        <div className="champ">
          <label htmlFor="nom">{tx.nom}</label>
          <input id="nom" name="nom" type="text" required minLength={2} maxLength={60} defaultValue={t("nom")} />
        </div>
        <div className="champ">
          <label htmlFor="serveur">{tx.serveur}</label>
          <input id="serveur" name="serveur" type="text" required minLength={2} maxLength={40} defaultValue={t("serveur")} />
        </div>
        <div className="champ">
          <label htmlFor="faction">{tx.faction}</label>
          <select id="faction" name="faction" required defaultValue={t("faction") ?? ""}>
            <option value="" disabled>{tx.choisir}</option>
            {Object.entries(FACTIONS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="champ">
          <label htmlFor="typeRoyaume">{tx.type}</label>
          <select id="typeRoyaume" name="typeRoyaume" required defaultValue={t("typeRoyaume") ?? ""}>
            <option value="" disabled>{tx.choisir}</option>
            {Object.entries(TYPES_ROYAUME).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      <fieldset>
        <legend>{tx.activite}</legend>
        <Cases nom="objectifs" options={OBJECTIFS} cochees={l("objectifs")} />
      </fieldset>

      <fieldset>
        <legend>{tx.recrutement}</legend>
        <label className="case" style={{ marginBottom: 12 }}>
          <input type="checkbox" name="recrute" value="oui" defaultChecked={recrute} />
          <span>{tx.recrute}</span>
        </label>
        <p className="doux" style={{ margin: "0 0 8px", fontSize: 14 }}>{tx.roles}</p>
        <Cases nom="roles" options={ROLES} cochees={l("roles")} />
        <p className="doux" style={{ margin: "12px 0 8px", fontSize: 14 }}>{tx.classes}</p>
        <Cases nom="classes" options={CLASSES_GUILDE} cochees={l("classes")} />
      </fieldset>

      <div className="champ">
        <label htmlFor="description">{tx.presentation}</label>
        <small>{tx.aidePresentation}</small>
        <textarea id="description" name="description" required minLength={40} maxLength={600} defaultValue={t("description")} />
      </div>
      <div className="champ">
        <label htmlFor="horaires">{tx.horaires}</label>
        <input id="horaires" name="horaires" type="text" maxLength={80} placeholder={tx.exempleHoraires} defaultValue={t("horaires")} />
      </div>

      <fieldset>
        <legend>{tx.contact}</legend>
        <div className="grille-champs">
          <div className="champ">
            <label htmlFor="discord">{tx.discord}</label>
            <input id="discord" name="discord" type="text" maxLength={120} placeholder="discord.gg/…" defaultValue={t("discord")} />
          </div>
          <div className="champ">
            <label htmlFor="contactJeu">{tx.contactJeu}</label>
            <input id="contactJeu" name="contactJeu" type="text" maxLength={40} defaultValue={t("contactJeu")} />
          </div>
          <div className="champ">
            <label htmlFor="site">{tx.site}</label>
            <input id="site" name="site" type="text" maxLength={200} placeholder="https://…" defaultValue={t("site")} />
          </div>
        </div>
      </fieldset>

      <div className="piege" aria-hidden="true">
        <label htmlFor="site_web">{tx.piege}</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {!jeton ? (
        <label className="case">
          <input type="checkbox" name="charte" value="oui" required />
          <span>{tx.charte}</span>
        </label>
      ) : null}

      <button type="submit" className="btn btn-or" disabled={enCours} data-cta={jeton ? "modifier-guilde" : "envoyer-guilde"}>
        {enCours ? tx.envoi : jeton ? tx.enregistrer : tx.inscrire}
      </button>
    </form>
  );
}
