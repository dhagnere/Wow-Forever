/**
 * Numéros de la Lettre préparés chaque semaine à partir des vidéos du Journal de Jobwow, en français et en anglais
 * (même `semaine`, une entrée par langue). Ils s'affichent dans /admin/lettre (« Brouillons préparés ») : un clic les
 * importe comme brouillon ; l'essai obligatoire et le lancement restent à Jobwow.
 *
 * Règles : Markdown (passé par markdownVersHtml à l'affichage et à l'envoi), liens vers le site seulement
 * (/carnet/videos/ ou /en/notebook/videos/, le Carnet, les guides), faits vus dans les vidéos, rien d'inventé
 * (une information non confirmée reste entre crochets), mêmes faits dans les deux langues.
 */

export interface LettrePreparee {
  /** Identifiant stable : « 2026-S46-fr ». */
  id: string;
  semaine: string;
  langue: "fr" | "en";
  sujet: string;
  corps: string;
}

export const LETTRES_PREPAREES: LettrePreparee[] = [
  {
    id: "2026-S46-fr",
    semaine: "2026-S46",
    langue: "fr",
    sujet: "La Lettre de la Taverne · Du Glas à Brill, niveau 8 en une séance",
    corps: `Bonjour,

Cette semaine, une séance de deux heures dix de vidéo dans les Clairières de Tirisfal, du réveil au Glas jusqu'aux rues de Brill. Je suis parti niveau 1, je suis revenu niveau 8.

## Le Glas, premiers pas

Tout commence par « Réveil brutal », comme pour tout mort-vivant qui se respecte. Suivent « Lever le voile », « Les Maudits » et « Faites cliqueter les thorax ! » : niveau 4 en un peu plus de vingt minutes. Les grottes des Tisse-nuit et la chasse aux trésors du Glas m'ont mené au niveau 5.

## En route vers Brill

Une première rencontre avec la Croisade écarlate, l'herboristerie apprise au passage, puis « Le messager rouge » m'a mis sur la route du Manoir du Foyerfroid et de Brill. Arrivé au village, j'ai appris la cuisine : un tavernier doit savoir faire autre chose que servir.

## Autour de Brill

La seconde heure s'est passée entre le Lac Étincelant, l'Étang immobile et la Ferme des Solliden, avec « Une peste nouvelle » et « Le frisson de la mort ». Niveau 8 atteint en chemin, puis retour à Brill pour une belle série de quêtes rendues.

## La vidéo

La séance complète, découpée en chapitres par lieu et par niveau, est sur [la page des vidéos](https://www.taverne-eternelle.fr/carnet/videos/). Le récit de la semaine continue dans [le Carnet](https://www.taverne-eternelle.fr/carnet/).

À la semaine prochaine, au comptoir.

— Jobwow`,
  },
  {
    id: "2026-S46-en",
    semaine: "2026-S46",
    langue: "en",
    sujet: "The Tavern's newsletter · From Deathknell to Brill, level 8 in one session",
    corps: `Hello,

This week: one play session, two hours and ten minutes of video in Tirisfal Glades, from waking up in Deathknell to the streets of Brill. I started at level 1 and came back at level 8.

## Deathknell, first steps

It all starts with "Rude Awakening", as it should for any self-respecting Undead. Then "Piercing the Veil" and "The Damned": level 4 in just over twenty minutes. Night Web's Hollow and "Scavenging Deathknell" took me to level 5.

## On the road to Brill

A first brush with the Scarlet Crusade, herbalism learned along the way, then "The Red Messenger" sent me on the road to Brill. Once in the village, I learned cooking: an innkeeper should be able to do more than pour drinks.

## Around Brill

The second hour went by among the lakes and farms around Brill, with "A New Plague" and "The Chill of Death". Level 8 came on the way, then back to Brill to turn in a whole batch of quests.

## The video

The full session, split into chapters by place and level, is on [the videos page](https://www.taverne-eternelle.fr/en/notebook/videos/) (the videos are in French). The weekly story goes on in [the Notebook](https://www.taverne-eternelle.fr/en/notebook/).

See you next week at the bar.

— Jobwow`,
  },
];
