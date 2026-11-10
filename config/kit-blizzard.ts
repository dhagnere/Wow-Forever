/**
 * Visuels du kit officiel de Blizzard (presse ou sites de fans), importés par npm run kit:blizzard -- <dossier>.
 * Fichier réécrit par la commande : on peut y corriger un nom à la main, la commande garde les noms déjà saisis.
 * Les images sont dans public/images/kit/<slug>-1600.jpg et <slug>-800.jpg.
 */
export interface VisuelKit { slug: string; nom: string; credit: string }

export const KIT_BLIZZARD: VisuelKit[] = [
  {
    "slug": "araignee-rouge-pres-d-un-pavillon-elfe",
    "nom": "Araignée rouge près d'un pavillon elfe",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "creature-du-vide-dans-une-foret-d-automne",
    "nom": "Créature du Vide dans une forêt d'automne",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "creatures-bleues-sur-une-place-elfe",
    "nom": "Créatures bleues sur une place elfe",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "creatures-du-vide-sur-un-chemin-pave",
    "nom": "Créatures du Vide sur un chemin pavé",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "troll-au-masque-a-plumes-dans-un-temple",
    "nom": "Troll au masque à plumes dans un temple",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "arbre-geant-entoure-de-lumiere-bleue",
    "nom": "Arbre géant entouré de lumière bleue",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "crane-geant-dans-une-foret-traversee-de-lumiere-bleue",
    "nom": "Crâne géant dans une forêt traversée de lumière bleue",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "nain-et-son-ours-face-a-une-vallee-et-un-volcan",
    "nom": "Nain et son ours face à une vallée et un volcan",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "nain-et-son-ours-sur-une-crete-enneigee",
    "nom": "Nain et son ours sur une crête enneigée",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  },
  {
    "slug": "terres-flottantes-au-milieu-des-nuages",
    "nom": "Terres flottantes au milieu des nuages",
    "credit": "Visuel officiel · © Blizzard Entertainment"
  }
];
