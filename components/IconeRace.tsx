/** Nom de race affiché sur le site → fichier d'icône (npm run icones:jeu, © Blizzard Entertainment). */
const FICHIERS: Record<string, string> = {
  Humain: "humain", Nain: "nain", "Elfe de la nuit": "elfe-de-la-nuit", Gnome: "gnome",
  Orc: "orc", "Mort-vivant": "mort-vivant", Tauren: "tauren", Troll: "troll", Skyborne: "skyborne",
};

export function aIconeRace(race: string): boolean {
  return race in FICHIERS;
}

/** Icône officielle de la race. Sans nom connu, rien n'est affiché. */
export function IconeRace({ race, sexe = "homme", taille = 40, nom }: { race: string; sexe?: "homme" | "femme"; taille?: number; nom?: string }) {
  const fichier = FICHIERS[race];
  if (!fichier) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/jeu/races/${fichier}-${sexe}.png`}
      width={taille}
      height={taille}
      alt={nom ?? ""}
      aria-hidden={nom ? undefined : true}
      loading="lazy"
      className="icone-jeu icone-race"
    />
  );
}

/** Les deux icônes, homme et femme, côte à côte. */
export function IconesRace({ race, taille = 40 }: { race: string; taille?: number }) {
  if (!aIconeRace(race)) return null;
  return (
    <span className="icones-race">
      <IconeRace race={race} sexe="femme" taille={taille} />
      <IconeRace race={race} sexe="homme" taille={taille} />
    </span>
  );
}
