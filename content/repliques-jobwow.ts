/**
 * Répliques de Jobwow pour les bulles des vidéos (`npm run carnet:incrustation`, atelier vidéo).
 * Ton : tavernier mort-vivant, pince-sans-rire, jamais méchant. Aucune classe citée (la classe de Jobwow n'est jamais
 * précisée), aucun parti pris de faction, aucun nom de guide ou d'addon. Une réplique tient en une bulle : 90 caractères au plus.
 * Les répliques peuvent porter {zone}, {niveau}, {nom} : remplacés au moment de la préparation.
 */

export const GENRES_MOMENT = [
  "intro", "zone", "niveau", "mort", "exploit", "entraineur", "grimoire", "quete", "trajet", "vol", "marqueur",
] as const;
export type GenreMoment = (typeof GENRES_MOMENT)[number];

export const LIBELLE_GENRE: Record<GenreMoment, string> = {
  intro: "Début", zone: "Nouvelle zone", niveau: "Niveau gagné", mort: "Mort", exploit: "Élite vaincu",
  entraineur: "Entraîneur", grimoire: "Grimoire", quete: "Quête rendue", trajet: "Trajet", vol: "Vol", marqueur: "Repère",
};

/** Couleur du bord de la bulle : l'œil reconnaît le moment avant de lire. */
export const COULEUR_GENRE: Record<GenreMoment, string> = {
  intro: "#7a5a2b", zone: "#4f8a5e", niveau: "#d6a840", mort: "#7d8a96", exploit: "#b5473a",
  entraineur: "#9670c8", grimoire: "#9670c8", quete: "#7a5a2b", trajet: "#3f7fa8", vol: "#3f7fa8", marqueur: "#7a5a2b",
};

export const REPLIQUES: Record<GenreMoment, string[]> = {
  intro: [
    "Installez-vous, la tournée est pour moi. Enfin, pour vous : moi, je n'ai plus d'estomac.",
    "Au menu du jour : des quêtes, des sangliers, et des quêtes de sangliers.",
    "Nouvelle séance ! J'ai ciré mes os pour l'occasion.",
    "On reprend la route. Si je tombe en morceaux, ramassez-les, merci.",
    "Le tavernier sort de derrière son comptoir. Rare. Profitez-en.",
  ],
  zone: [
    "{zone}. Joli coin. On dirait que tout veut me manger, mais joli coin.",
    "Bienvenue à {zone}. Personne ne m'attendait, comme d'habitude.",
    "{zone} : j'ouvrirais bien une taverne ici. Il manque juste des clients vivants.",
    "Nouvelle zone, nouveaux ennuis. Je prends des notes pour la carte des vins.",
    "{zone}. Si je disparais, cherchez du côté du premier buisson suspect.",
  ],
  niveau: [
    "Niveau {niveau} ! À ce rythme, je serai à la retraite avant d'être au 60.",
    "Niveau {niveau}. Je sens la puissance… ou une articulation qui se démet.",
    "Niveau {niveau} ! Ça s'arrose. Moi je regarde, mais ça s'arrose.",
    "Un niveau de plus. L'entraîneur va encore me faire les poches.",
    "Niveau {niveau}. Ma mère serait fière. Si elle n'était pas une goule.",
  ],
  mort: [
    "Mourir ? Pour un mort-vivant, c'est presque une pause café.",
    "Même pas mal. Bon, un peu. Surtout à l'ego.",
    "Je ne suis pas mort, je fais du repérage au cimetière.",
    "Note pour plus tard : ne pas provoquer tout ce qui bouge en même temps.",
    "Retour au corps. Encore. Il connaît le chemin mieux que moi.",
  ],
  exploit: [
    "{nom} au tapis ! Il fallait venir à plusieurs, mais je suis têtu.",
    "{nom} vaincu. Je l'accroche au-dessus du comptoir, ça fera causer.",
    "Un élite de moins. Je mérite une chope. Une petite.",
    "{nom} ne m'embêtera plus. Je ne sens plus mes bras, mais ça, c'est normal.",
  ],
  entraineur: [
    "L'entraîneur : le seul qui me fait payer pour me faire souffrir.",
    "Nouveaux sorts appris. Je vais enfin pouvoir rater des choses plus impressionnantes.",
    "Une leçon, quelques pièces, et me voilà presque compétent.",
    "Je choisis une capacité. Celle qui fait le plus de bruit, évidemment.",
  ],
  grimoire: [
    "Un grimoire tout neuf. Reste à trouver quelqu'un qui sait lire à la taverne.",
    "Clic droit sur le grimoire. La lecture du soir la plus utile de ma non-vie.",
    "Un grimoire ! Pas de dessins, mais beaucoup de promesses.",
  ],
  quete: [
    "Quête rendue. Ils me paient en pièces, j'aurais préféré en tonneaux.",
    "Mission accomplie. Personne n'a applaudi, mais je l'ai entendu dans ma tête.",
    "Encore une. Mon carnet de quêtes est plus épais que mon dossier médical.",
    "Rendue ! Le donneur de quête a souri. Enfin, je crois. Difficile à dire sous la poussière.",
  ],
  trajet: [
    "En voiture ! Enfin, en zeppelin. Ou en bateau. Bref, ça bouge et je n'aime pas ça.",
    "Le trajet : le seul moment où personne ne me demande de tuer dix bestioles.",
    "Je m'accroche au bastingage. Mes os n'aiment pas le vent.",
  ],
  vol: [
    "En vol ! Vue imprenable, siège inconfortable.",
    "Je survole tout ça. D'en haut, même les ennuis ont l'air petits.",
    "Un peu de vol, un peu de repos. Ne me réveillez qu'à l'arrivée.",
  ],
  marqueur: [
    "Je note ça dans le carnet. Avec une tache de bière, pour l'authenticité.",
    "Moment important. Retenez-le, moi j'oublie tout depuis que je suis mort.",
    "Repère posé. On en reparlera au comptoir.",
  ],
};

/** Réplique n° `rang` d'un genre (en boucle), avec {zone}, {niveau}, {nom} remplacés. */
export function replique(genre: GenreMoment, rang: number, valeurs: { zone?: string; niveau?: string | number; nom?: string } = {}): string {
  const liste = REPLIQUES[genre];
  const brut = liste[((rang % liste.length) + liste.length) % liste.length];
  return brut
    .replace(/\{zone\}/g, valeurs.zone ?? "Cette zone")
    .replace(/\{niveau\}/g, String(valeurs.niveau ?? "?"))
    .replace(/\{nom\}/g, valeurs.nom ?? "Ce gros dur");
}
