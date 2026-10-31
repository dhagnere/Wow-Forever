/**
 * Point d'entrée unique du module de veille.
 * Les pages du site n'importent RIEN d'autre que ce fichier (voir CLAUDE.md).
 */

export type { Article, SourceCitee, Statut } from "./types";
export type { Modifications } from "./articles/depot";
export type { Revue, BilanPassage } from "./passage";
export type { Statistiques } from "./articles/depot";
export type { Admin, ResultatConnexion } from "./auth/comptes";
export type { PassageJournal, ModePassage } from "./journal";
export type { EtatSource } from "./collecte/flux";

export {
  lirePublie,
  listerPublies,
  compterPublies,
  listerPourPlan,
  listerPourAdmin,
  lireParId,
  creerBrouillon,
  modifier,
  publier,
  changerStatut,
  programmer,
  annulerProgrammation,
  relancerFacebook,
  statistiques,
  ErreurPublication,
} from "./articles/depot";
export { verifierPublication, AVIS_MINIMUM } from "./articles/publication";
export { markdownVersHtml } from "./rendu/html";
export { derniereRevue } from "./passage";
export { urlArticle, messageFacebook } from "./facebook/relais";
export { COOKIE_SESSION, DUREE_SESSION_S, jetonValide, secretConfigure } from "./auth/session";
export { authentifier, adminDepuisJeton, changerMotDePasse, MOT_DE_PASSE_MINIMUM, ESSAIS_MAX, BLOCAGE_MIN } from "./auth/comptes";
export { historiquePassages, passageEnCours, lancerPassage } from "./journal";
export { etatConfiguration } from "./config";

import { SOURCES } from "@/config/sources";
import { testerSources as tester } from "./collecte/flux";
/** Teste toutes les sources de config/sources.ts. */
export const testerSources = () => tester(SOURCES);
