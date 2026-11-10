/**
 * Visuels du kit officiel de Blizzard (presse ou sites de fans), importés par npm run kit:blizzard -- <dossier>.
 * Fichier réécrit par la commande : on peut y corriger un nom à la main, la commande garde les noms déjà saisis.
 * Les images sont dans public/images/kit/<slug>-1600.jpg et <slug>-800.jpg.
 */
export interface VisuelKit { slug: string; nom: string; credit: string }

export const KIT_BLIZZARD: VisuelKit[] = [];
