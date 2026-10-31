/**
 * Point d'entrée unique du module de veille.
 * Les pages du site n'importent RIEN d'autre que ce fichier (voir CLAUDE.md).
 */

export type { Article, SourceCitee, Statut } from "./types";
export type { Modifications } from "./articles/depot";
export type { Revue, BilanPassage } from "./passage";

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
  ErreurPublication,
} from "./articles/depot";
export { verifierPublication, AVIS_MINIMUM } from "./articles/publication";
export { markdownVersHtml } from "./rendu/html";
export { lienFrancais, nomLangue, type LienSource, type ModeLien } from "./rendu/liens";
export { derniereRevue } from "./passage";
export { urlArticle, messageFacebook } from "./facebook/relais";
export { COOKIE_SESSION, DUREE_SESSION_S, creerJeton, jetonValide, motDePasseCorrect } from "./auth/session";
