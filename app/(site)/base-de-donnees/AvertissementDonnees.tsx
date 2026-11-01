import Link from "next/link";
import type { EtatBase } from "@/modules/veille";
import { dateLongue } from "@/lib/site";

export function AvertissementDonnees({ etat }: { etat: EtatBase | null }) {
  return (
    <p className="doux note-donnees">
      Données lues dans les fichiers du jeu grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>
      {etat ? <>, version {etat.version}, mise à jour le {dateLongue(etat.importeLe.toISOString().slice(0, 10))}</> : null}.
      La base suit chaque nouvelle version du jeu. Les caractéristiques chiffrées (force, endurance…) ne figurent pas encore sur les fiches.
      Noms et icônes : © Blizzard Entertainment (voir les <Link href="/mentions-legales/">mentions légales</Link>).
    </p>
  );
}
