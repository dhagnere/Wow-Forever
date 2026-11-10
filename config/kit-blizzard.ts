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
  }
];
