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

// Base d'objets (wago.tools).
export type { Objet, ObjetResume, Categorie, FiltresObjets, EtatBase } from "./objets/depot";
export { categoriesObjets, chercherObjets, lireObjet, iconeObjet, etatBase, listerObjetsPourPlan, recettesObjet, OBJETS_PAR_PAGE } from "./objets/depot";
export type { Recette, Composant } from "./objets/depot";
export { NOMS_CARACTERISTIQUES, bonusPrincipal } from "./objets/caracteristiques";
export type { Caracteristique } from "./objets/caracteristiques";
export {
  qualite, QUALITES, emplacement, lien as lienObjet, classesAutorisees, decouperPrix, prixEnTexte, vitesse as vitesseArme, nomCategorie,
} from "./objets/libelles";

// Statistiques d'audience (sans cookie).
export type { Signal } from "./statistiques/collecte";
export type { Tableau, Compteurs } from "./statistiques/tableau";
export type { StatsFacebook } from "./statistiques/facebook";
export { enregistrerSignal } from "./statistiques/collecte";
export { tableauStatistiques, csvParJour, evolution } from "./statistiques/tableau";
export { statsFacebook } from "./statistiques/facebook";
export { NOMS_SOURCES } from "./statistiques/classement";

// Tableau des guildes.
export type { Guilde, FiltresGuildes, StatutGuilde } from "./guildes/depot";
export type { FicheGuilde } from "./guildes/validation";
export {
  deposerGuilde, guildeParJeton, modifierGuilde, confirmerGuilde, listerGuildes, lireGuilde, guildesARelire, guildesPubliees,
  deciderGuilde, listerGuildesPourPlan, ErreurGuilde, DUREE_VALIDITE_JOURS, empreinteDepot,
} from "./guildes/depot";
export { validerFiche, FACTIONS, TYPES_ROYAUME, OBJECTIFS, ROLES, CLASSES_GUILDE } from "./guildes/validation";

// Où trouver les objets (données communautaires de l'Azeroth d'origine).
export type { OuTrouver, SourceMonstre, SourceDecor, SourceMarchand, SourceQuete, Emplacement } from "./objets/butin";
export { ouTrouver, RANGS, sourceDesDonnees } from "./objets/butin";

// Sorts et talents des classes (fichiers du jeu, npm run sorts:jeu → content/sorts-jeu.json).
export type { Specialisation, Sort, Talent, RangSort, TraitRacial, Familiers, FamilleFamilier, TechniqueFamilier } from "./sorts/conversion";
