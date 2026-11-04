import Link from "next/link";
import type { EtatBase } from "@/modules/veille";

const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);

export function AvertissementEn({ etat }: { etat: EtatBase | null }) {
  return (
    <p className="doux note-donnees">
      Data read from the game files thanks to <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>
      {etat ? <>, version {etat.version}, updated on {dateEn(etat.importeLe)}</> : null}. The database follows each new game version.
      Stats, armour and damage are computed the way the game does; item-specific “Equip” and “Use” effects are not listed yet.
      Names and icons: © Blizzard Entertainment (see the <Link href="/mentions-legales/" hrefLang="fr">legal notice</Link>, in French).
    </p>
  );
}
