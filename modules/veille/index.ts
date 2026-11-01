/**
 * Point d'entrée unique du module de veille.
 * Les pages du site n'importent RIEN d'autre que ce fichier (voir CLAUDE.md).
 */

export type { Article, SourceCitee, Statut } from "./types";
export type { Modifications } from "./articles/depot";
export type { Revue, BilanPassage, EtatRedaction } from "./passage";

export {
  lirePublie,
  lireParSlug,
  listerPublies,
  compterPublies,
  rechercherPublies,
  listerPourPlan,
  listerPourAdmin,
  compterParRubrique,
  lireParId,
  creerBrouillon,
  modifier,
  publier,
  changerStatut,
  ErreurPublication,
} from "./articles/depot";
export { verifierPublication, sourcesPubliees, AVIS_MINIMUM } from "./articles/publication";
export { markdownVersHtml } from "./rendu/html";
export { lienFrancais, nomLangue, type LienSource, type ModeLien } from "./rendu/liens";
export { themeDe, rechercherDossiers, etatDossier } from "./passage";
export { DOSSIERS } from "@/config/dossiers";
export { selectionVariee } from "./collecte/themes";
export { derniereRevue, etatRedaction, preparerRedaction, redigerSujets, MAX_PAR_LANCEMENT } from "./passage";
export { urlArticle, messageFacebook, requeteFacebook, urlMedia } from "./facebook/relais";
export { texteReseau, longueurX } from "./reseaux/textes";
export { videoReel, ErreurVideo, DUREE_REEL_S } from "./reels/video";
export { obtenirVideo, lireVideoStockee } from "./reels/stockage";
export { urlAutorisationTiktok, connecterTiktok, urlRetourTiktok } from "./reseaux/tiktok";
export { lireJeton, supprimerJeton } from "./reseaux/jetons";
export { compteInstagram } from "./reseaux/instagram";
export { definirImage, enregistrerAvisPropose } from "./articles/depot";
export { proposerAvis } from "./redaction/redacteur";
export { enregistrerImage, lireImage, ErreurImage, TAILLE_MAX_OCTETS, LARGEUR_MIN } from "./medias/images";
import { config as configVeille } from "./config";
export const brouillonsParJour = (): number => configVeille.brouillonsParJour();
export { COOKIE_SESSION, DUREE_SESSION_S, creerJeton, jetonValide, motDePasseCorrect } from "./auth/session";
