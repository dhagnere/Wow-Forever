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
    "Les chopes sont lavées, les os sont graissés : on peut y aller.",
    "Prenez une chaise. Pas celle-là, elle est hantée. Enfin, plus que les autres.",
    "Aujourd'hui, j'ai un plan. Il ne survivra pas à la première bestiole, mais j'ai un plan.",
    "On ouvre le carnet. Page blanche, plume neuve, mauvaise foi intacte.",
    "Fermeture exceptionnelle de la taverne : le patron part à l'aventure.",
    "Nouvelle journée en Azeroth. Le soleil brille. Je déteste le soleil.",
    "J'ai laissé un mot sur le comptoir : « Servez-vous. » Je crois que c'était une erreur.",
    "Échauffement : je fais craquer mes doigts. Tous. Un par un. Ça prend du temps.",
    "Rappel : je ne cours pas, je me déplace avec détermination.",
    "La dernière fois, j'ai promis de ne pas mourir. Je promets encore. Ça ne coûte rien.",
    "Préparez les chopes, je reviens avec des histoires. Et sans doute sans mon pantalon.",
    "On repart d'où on s'était arrêtés. Je ne sais plus où, mais on repart.",
    "Un tavernier, une route, et trop de gens qui veulent me taper. C'est parti.",
    "Bonsoir la taverne ! Ce soir on joue, demain on raconte, après-demain on exagère.",
    "Mes os sont prêts. Mon courage arrive, il traîne un peu derrière.",
  ],
  zone: [
    "{zone}. Joli coin. On dirait que tout veut me manger, mais joli coin.",
    "Bienvenue à {zone}. Personne ne m'attendait, comme d'habitude.",
    "{zone} : j'ouvrirais bien une taverne ici. Il manque juste des clients vivants.",
    "Nouvelle zone, nouveaux ennuis. Je prends des notes pour la carte des vins.",
    "{zone}. Si je disparais, cherchez du côté du premier buisson suspect.",
    "{zone} : l'air est frais. Je ne respire plus, mais je le note quand même.",
    "On entre à {zone}. Essuyez vos pieds. Surtout moi.",
    "{zone}, enfin ! J'avais lu la brochure. Elle ne parlait pas des bestioles.",
    "Panneau « {zone} ». Pas de panneau « attention, tout mord ». Négligence.",
    "{zone}. Je cherche l'auberge. Pour surveiller la concurrence, évidemment.",
    "Premiers pas à {zone}. Les gens du coin me regardent bizarrement. Normal.",
    "{zone} : nouvelle carte, nouvelles routes, nouvelles façons de me perdre.",
    "Arrivée à {zone}. Quelqu'un a prévenu les monstres ? Visiblement, oui.",
    "On découvre {zone}. Ici, même les buissons ont l'air d'avoir des opinions.",
    "{zone} ! La brochure dit « pittoresque ». Traduction : dangereux.",
    "{zone}, me voilà. Cachez les tonneaux, le tavernier est en ville.",
    "Nouvelle zone. Saveur du jour : sanglier, avec une pointe de danger.",
    "{zone}. On m'a dit d'éviter la nuit. Personne n'a parlé du jour.",
    "{zone}. Je prends une image mentale. Elle sera floue, comme ma mémoire.",
    "Changement de décor : {zone}. Les ennuis, eux, n'ont pas changé.",
  ],
  niveau: [
    "Niveau {niveau} ! À ce rythme, je serai à la retraite avant d'être au 60.",
    "Niveau {niveau}. Je sens la puissance… ou une articulation qui se démet.",
    "Niveau {niveau} ! Ça s'arrose. Moi je regarde, mais ça s'arrose.",
    "Un niveau de plus. L'entraîneur va encore me faire les poches.",
    "Niveau {niveau}. Ma mère serait fière. Si elle n'était pas une goule.",
    "Niveau {niveau} ! Je ne me sens pas plus fort, mais le chiffre est formel.",
    "Ding ! Niveau {niveau}. La cloche de la taverne a sonné toute seule.",
    "Niveau {niveau}. Je range mes vieilles faiblesses, j'en ai des neuves à essayer.",
    "Niveau {niveau} : bientôt, je battrai un poulet sans trembler.",
    "Niveau {niveau} ! Tournée générale, sauf pour les sangliers. Ils ont assez donné.",
    "Le niveau {niveau} est à moi. Je l'aurais bien encadré, mais il est invisible.",
    "Niveau {niveau}. Les bestioles du coin peuvent commencer à s'inquiéter.",
    "Niveau {niveau}. Ça brille, ça chante, et personne ne m'a offert de gâteau.",
    "Niveau {niveau} : j'ai pris de l'expérience. Et des coups. Surtout des coups.",
    "Niveau {niveau} ! Je note la date sur le mur, à côté des ardoises des clients.",
    "Niveau {niveau}. Le compteur avance, mes os craquent : tout est normal.",
    "Je ne vieillis plus, alors je monte de niveau. Niveau {niveau}, compensation.",
    "Niveau {niveau}. Quelque part, un sanglier regrette de s'être levé ce matin.",
    "Niveau {niveau}, et toujours aussi beau. Donc pas tellement, mais toujours.",
    "Niveau {niveau}. Le 60 se rapproche. Lentement. Très lentement.",
  ],
  mort: [
    "Mourir ? Pour un mort-vivant, c'est presque une pause café.",
    "Même pas mal. Bon, un peu. Surtout à l'ego.",
    "Je ne suis pas mort, je fais du repérage au cimetière.",
    "Note pour plus tard : ne pas provoquer tout ce qui bouge en même temps.",
    "Retour au corps. Encore. Il connaît le chemin mieux que moi.",
    "Mort. Je vais finir par avoir une carte de fidélité au cimetière.",
    "L'esprit du cimetière me reconnaît. On se tutoie, maintenant.",
    "Petite sieste au sol. Volontaire, évidemment.",
    "Je suis tombé. Le sol était là, il avait l'air accueillant.",
    "Défaite tactique. Mon plan était de perdre, et il a très bien marché.",
    "Ils étaient trop nombreux. Ou j'étais trop seul. Ou trop maladroit. Un peu des trois.",
    "Mourir, c'est mon métier d'origine. Je suis juste un peu rouillé.",
    "Mon fantôme fait sa promenade. Il trouve le paysage gris. Il a raison.",
    "Je reviens. Ce n'est pas une menace, c'est une habitude.",
    "Au moins, la course jusqu'au corps, ça fait les mollets.",
    "Rien de cassé. Si, tout. Mais rien de nouveau.",
    "C'était de l'audace. Les mauvaises langues diront de la bêtise.",
    "Le tavernier est mort, vive le tavernier. Dans trente secondes.",
    "J'ai voulu montrer qui était le patron. Le patron, c'était lui.",
    "Encore un sol visité de très près. J'en fais la collection.",
  ],
  exploit: [
    "{nom} au tapis ! Il fallait venir à plusieurs, mais je suis têtu.",
    "{nom} vaincu. Je l'accroche au-dessus du comptoir, ça fera causer.",
    "{nom}, un élite de moins. Je mérite une chope. Une petite.",
    "{nom} ne m'embêtera plus. Je ne sens plus mes bras, mais ça, c'est normal.",
    "{nom} est tombé. Grand, fort, et en retard d'un coup.",
    "{nom} vaincu ! Je garde une dent en souvenir. S'il en avait.",
    "Adieu, {nom}. Tu étais coriace, mais moi, je suis déjà mort.",
    "{nom} au sol. Je raconterai qu'il faisait trois mètres. Il en fait deux.",
    "{nom} n'a pas vu venir le tavernier. Personne ne voit venir le tavernier.",
    "{nom}, vaincu seul ! Bon, avec beaucoup de potions, mais seul.",
    "{nom} : vaincu. Mes mains tremblent. Pas de peur : l'arthrose.",
    "{nom} est terrassé. Cette histoire vaudra trois chopes au comptoir.",
    "{nom} découvre le goût du sol. Je le connais bien, ce goût.",
    "{nom} vaincu. La carte disait « groupe conseillé ». Je ne lis pas les cartes.",
    "{nom} est tombé ! Je ferai graver son nom sur un tabouret.",
    "Victoire contre {nom}. J'ai eu chaud, ce qui est rare à ma température.",
    "{nom} a été battu par un tavernier. Il ne s'en remettra pas.",
    "{nom}, terrassé. Il me reste deux points de vie et toute ma dignité.",
    "Un {nom} de moins dans le coin. Les petits vont se sentir bien seuls.",
  ],
  entraineur: [
    "L'entraîneur : le seul qui me fait payer pour me faire souffrir.",
    "Nouveaux sorts appris. Je vais enfin pouvoir rater des choses plus impressionnantes.",
    "Une leçon, quelques pièces, et me voilà presque compétent.",
    "Des pièces contre du savoir. Le seul commerce plus rentable qu'une taverne.",
    "Nouvelle leçon. J'ai écouté la moitié et payé le tout.",
    "L'entraîneur dit que j'ai du potentiel. Il dit ça à tous ceux qui paient.",
    "Passage chez l'entraîneur. Je repars plus fort et plus pauvre.",
    "Nouveaux tours à essayer sur le premier sanglier venu. Désolé, sanglier.",
    "L'entraîneur m'a regardé longtemps, a soupiré, puis m'a appris des trucs.",
    "Mes économies ont fondu. Mes compétences, un peu moins.",
    "Leçon apprise. La prochaine dans deux niveaux, et plus chère.",
    "Je sors avec une barre d'action pleine et une bourse vide.",
    "Apprendre à mon âge ? On n'a plus d'âge quand on est mort.",
    "L'entraîneur me montre un geste. Je le refais. Mal. Il encaisse quand même.",
    "Je retiens tout. Surtout le chemin pour revenir chez l'entraîneur.",
  ],
  grimoire: [
    "Un grimoire tout neuf. Reste à trouver quelqu'un qui sait lire à la taverne.",
    "Clic droit sur le grimoire. La lecture du soir la plus utile de ma non-vie.",
    "Un grimoire ! Pas de dessins, mais beaucoup de promesses.",
    "Le vendeur m'a juré que ce grimoire n'était pas maudit. Je l'ai cru.",
    "Lecture du soir : un grimoire. Pas de fin heureuse, mais des pouvoirs.",
    "Grimoire acheté. Ça sent le vieux papier. Et un peu moi, donc.",
    "Un grimoire ! Je l'ouvre, je le lis, je le comprends. Dans le désordre.",
    "Un livre qui rend plus fort. Si le registre de la taverne pouvait faire pareil…",
    "Grimoire en main. N'oubliez pas : clic droit. Moi, j'oublie toujours.",
    "Un grimoire de plus, et un sac de moins en moins grand.",
    "Je range le grimoire entre le pain rassis et les dents de loup. Bibliothèque fine.",
    "Ma bibliothèque passe à trois livres. Dont une recette de ragoût.",
  ],
  quete: [
    "Quête rendue. Ils me paient en pièces, j'aurais préféré en tonneaux.",
    "Mission accomplie. Personne n'a applaudi, mais je l'ai entendu dans ma tête.",
    "Encore une. Mon carnet de quêtes est plus épais que mon dossier médical.",
    "Rendue ! Le donneur a souri, je crois. Difficile à dire sous la poussière.",
    "Quête rendue. On m'a dit merci. Je le note, ça arrive rarement.",
    "Encore une course de faite. Azeroth manque cruellement de coursiers.",
    "Mission terminée ! Prochaine étape : une autre mission. Surprise.",
    "Rendue. J'ai rapporté ce qu'on voulait, et quelques puces en bonus.",
    "Quête bouclée. La récompense ? Des bottes. J'en ai déjà six paires.",
    "C'est fait. Je ne sais pas toujours pourquoi on me demande ça, mais c'est fait.",
    "Une quête de moins. Il en reste… attendez que je compte… beaucoup.",
    "Rendue ! Et le donneur a déjà une autre demande. Aucune pudeur, ces gens.",
    "Quête terminée. Payé, remercié, renvoyé. Efficace.",
    "Mission accomplie. Je me suis perdu deux fois en route, gracieusement.",
    "Quête rendue. Les poches sont plus lourdes, les épaules protestent.",
    "Rendue. Si on m'avait dit qu'aventurier, c'était surtout facteur…",
    "Une quête de plus. Je devrais facturer à l'heure.",
    "Quête terminée. L'objet ramené sent bizarre. Je ne pose pas de questions.",
    "Le donneur est content. Moi aussi. Le sanglier, beaucoup moins.",
    "Encore une ligne rayée dans le carnet. La plume s'use plus vite que moi.",
  ],
  trajet: [
    "En voiture ! Enfin, en zeppelin. Ou en bateau. Bref, ça bouge et je n'aime pas ça.",
    "Le trajet : le seul moment où personne ne me demande de tuer dix bestioles.",
    "Je m'accroche au bastingage. Mes os n'aiment pas le vent.",
    "Ça tangue. Heureusement, je n'ai plus rien à rendre.",
    "En route ! Le capitaine a l'air sûr de lui. C'est ce qui m'inquiète.",
    "Traversée en cours. Je compte les vagues. J'en suis à beaucoup.",
    "Ça grince plus que mes genoux. C'est dire.",
    "Si on coule, je flotte. Je crois. Je n'ai jamais vérifié.",
    "Pendant le trajet, l'inventaire : trois défenses de sanglier. Comment ?",
    "On avance sans marcher. Le luxe. Je pourrais m'y habituer.",
    "Le vent du large. Mon crâne siffle comme une bouilloire.",
    "Le trajet est long. J'en profite pour réfléchir. Ça ne mène à rien.",
  ],
  vol: [
    "En vol ! Vue imprenable, siège inconfortable.",
    "Je survole tout ça. D'en haut, même les ennuis ont l'air petits.",
    "Un peu de vol, un peu de repos. Ne me réveillez qu'à l'arrivée.",
    "En l'air ! Je vous salue d'en haut. Vous ne me voyez pas, mais je salue.",
    "Je ne regarde pas en bas. Ce n'est pas la peur, c'est le principe.",
    "Le vol : on monte, on attend, on descend. Comme mon humeur.",
    "Je survole des endroits où je suis mort. Il y en a beaucoup.",
    "Vue d'en haut, la carte est jolie. Vue d'en bas, elle mord.",
    "Pause en vol. Je médite. Enfin, je regarde les nuages.",
    "Le seul moment de la journée où rien n'essaie de me manger.",
    "Accrochez-vous. Moi, je m'accroche à ce qui reste de ma dignité.",
    "On plane. Je profite du calme avant les dix prochaines bestioles.",
  ],
  marqueur: [
    "Je note ça dans le carnet. Avec une tache de bière, pour l'authenticité.",
    "Moment important. Retenez-le, moi j'oublie tout depuis que je suis mort.",
    "Repère posé. On en reparlera au comptoir.",
    "Arrêt sur image. Retenez ce moment, il servira au procès.",
    "Un jour, on en fera une chanson. Mauvaise, mais une chanson.",
    "Repère posé. Pour retrouver l'endroit, ou pour l'éviter.",
    "Ici, il s'est passé quelque chose. Je ne sais plus quoi, mais quelque chose.",
    "Ce moment mérite une croix sur la carte et une chope sur le comptoir.",
    "Je grave ça dans ma mémoire. Elle est vermoulue, mais je grave.",
    "Marqué. Les historiens d'Azeroth me remercieront. Ou pas.",
    "Un instant à garder pour la Lettre de la semaine.",
    "Quand je raconterai ça, j'aurai été plus héroïque. Promis.",
  ],
};

/** Paliers de niveau : leur propre réplique, qui dit ce que le palier change. */
export const REPLIQUES_PALIERS: Record<number, string[]> = {
  10: [
    "Niveau 10 ! Les talents s'ouvrent. Enfin des choix à regretter.",
    "Niveau 10 : premier point de talent. Je le dépense ou je le garde pour mes vieux jours ?",
    "Niveau 10. On ne m'appelle plus le débutant. On m'appelle « l'autre débutant ».",
  ],
  20: [
    "Niveau 20 ! Le tiers du chemin. Restent deux tiers et toute ma patience.",
    "Niveau 20. Je commence à faire peur. Surtout à ma bourse.",
  ],
  30: [
    "Niveau 30, la moitié du chemin vers le 60. Je fête ça à moitié.",
    "Niveau 30. Si j'avais encore des cheveux, je trouverais le premier blanc.",
  ],
  40: [
    "Niveau 40 ! Une monture, enfin. Mes pieds étaient en grève depuis des semaines.",
    "Niveau 40. Je vais pouvoir me perdre deux fois plus vite.",
    "Niveau 40 : la monture. Reste à trouver les pièces. Ah. Les pièces.",
  ],
  50: [
    "Niveau 50. Le sommet est en vue. La montée aussi, hélas.",
    "Niveau 50 ! Dix niveaux encore, et je repeins l'enseigne de la taverne.",
  ],
  60: [
    "Niveau 60 ! Le tavernier est au sommet. Quelqu'un tient le comptoir ? Je pleure.",
    "Niveau 60. J'ai fini. Non : c'est maintenant que tout commence, paraît-il.",
    "60 ! Tournée générale, pour de vrai cette fois. Enfin, presque.",
  ],
};

/** Choix d'une capacité chez un entraîneur (sans dire laquelle ni pour qui). */
export const REPLIQUES_CAPACITE: string[] = [
  "Je choisis une capacité. Celle qui fait le plus de bruit, évidemment.",
  "Une capacité à choisir. J'hésite comme devant la carte des bières.",
  "Choix d'une capacité. J'ai pris la plus jolie. On a du goût, à la taverne.",
  "Nouvelle capacité ! Je la teste tout de suite sur le premier volontaire.",
  "Je réfléchis longtemps, puis je prends la première. Méthode éprouvée.",
  "Capacité choisie. Elle a l'air puissante. Sur le papier.",
];

/** Deuxième mort (et suivantes) dans la même vidéo. */
export const REPLIQUES_MORT_REPETEE: string[] = [
  "Encore ? Je commence à connaître chaque pierre de ce chemin.",
  "Deuxième visite au cimetière. On va finir par me réserver une tombe.",
  "Bon. On va dire que la première fois, c'était l'entraînement.",
  "Je ne suis pas têtu, je suis… bon, si, je suis têtu.",
  "La même erreur deux fois, ce n'est plus une erreur, c'est une tradition.",
  "À ce rythme, mon fantôme va demander un salaire.",
  "Le chemin du retour, je le ferais les yeux fermés. Ils sont vides, de toute façon.",
  "Je recommence. Le monstre aussi, apparemment.",
];

export interface ContexteReplique { niveau?: string | number; demons?: boolean; morts?: number }

/** Jeu de répliques d'un personnage (content/personnages.ts) ; Jobwow par défaut. */
export interface JeuDeRepliques {
  parGenre: Record<GenreMoment, string[]>; paliers: Record<number, string[]>; capacite: string[]; mortRepetee: string[];
}

/** Liste à piocher pour un moment : palier de niveau, choix de capacité, mort répétée, sinon celle du genre. */
export function listeRepliques(genre: GenreMoment, c: ContexteReplique = {}, jeu?: JeuDeRepliques): { cle: string; liste: string[] } {
  const j = jeu ?? { parGenre: REPLIQUES, paliers: REPLIQUES_PALIERS, capacite: REPLIQUES_CAPACITE, mortRepetee: REPLIQUES_MORT_REPETEE };
  if (genre === "entraineur" && c.demons) return { cle: "capacite", liste: j.capacite };
  if (genre === "niveau" && j.paliers[Number(c.niveau)]) return { cle: `palier-${Number(c.niveau)}`, liste: j.paliers[Number(c.niveau)] };
  if (genre === "mort" && (c.morts ?? 1) >= 2) return { cle: "mort-repetee", liste: j.mortRepetee };
  return { cle: genre, liste: j.parGenre[genre] };
}

/** Remplace {zone}, {niveau}, {nom}. */
export function remplir(brut: string, valeurs: { zone?: string; niveau?: string | number; nom?: string } = {}): string {
  return brut
    .replace(/\{zone\}/g, valeurs.zone ?? "Cette zone")
    .replace(/\{niveau\}/g, String(valeurs.niveau ?? "?"))
    .replace(/\{nom\}/g, valeurs.nom ?? "Ce gros dur");
}

/** Ordre de passage d'une liste propre à chaque vidéo (graine) : pas de redite avant d'avoir tout servi. */
export function ordreMelange(taille: number, graine: number): number[] {
  const ordre = Array.from({ length: taille }, (_, i) => i);
  let x = (graine >>> 0) || 1;
  for (let i = taille - 1; i > 0; i--) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    const j = x % (i + 1);
    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
  }
  return ordre;
}

/** Réplique n° `rang` d'un genre (en boucle), avec {zone}, {niveau}, {nom} remplacés. */
export function replique(genre: GenreMoment, rang: number, valeurs: { zone?: string; niveau?: string | number; nom?: string } = {}): string {
  const liste = REPLIQUES[genre];
  const brut = liste[((rang % liste.length) + liste.length) % liste.length];
  return remplir(brut, valeurs);
}
