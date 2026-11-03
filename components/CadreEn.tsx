import Link from "next/link";
import { SITE } from "@/lib/site";
import { Medaillon, NomSite } from "./Cadre";
import { ChoixLangue } from "./ChoixLangue";
import { Decompte } from "./Decompte";
import { NavEn } from "./NavEn";
import { MENU_EN } from "@/lib/anglais";

/** Cadre de la version anglaise (/en/) : en-tête, menu et pied de page en anglais. */

function Entete() {
  return (
    <header className="entete">
      <div className="wrap entete-haut">
        <Decompte langue="en" />
        <Link href="/en/" className="logo logo-pile" aria-label="La Taverne Éternelle (The Eternal Tavern), home">
          <Medaillon taille={56} />
          <NomSite />
        </Link>
        <div className="outils-entete">
          <ChoixLangue langue="en" />
          <Link href="/en/account/" aria-label="My account" data-cta="compte-entete">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            <span className="sr-only">My account</span>
          </Link>
          <a href={SITE.facebook} rel="noopener noreferrer" aria-label="Facebook page of La Taverne Éternelle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" /></svg>
          </a>
        </div>
      </div>
      <div className="entete-menu">
        <div className="wrap">
          <NavEn />
        </div>
      </div>
    </header>
  );
}

function Pied() {
  return (
    <>
      <div className="rivets" aria-hidden="true" />
      <footer className="pied">
        <div className="wrap pied-ornement" aria-hidden="true">
          <Medaillon taille={40} />
        </div>
        <div className="wrap pied-corps">
          <div className="pied-marque">
            <p className="logo" style={{ fontSize: 20, margin: 0 }}>
              <NomSite />
            </p>
            <p>A French fan site about WoW Forever, run by Jobwow. The English section covers the leveling guide, classes, talents and races.</p>
          </div>
          <nav aria-label="Footer" className="pied-liens">
            {MENU_EN.map((m) => <Link key={m.href} href={m.href}>{m.label}</Link>)}
            <Link href="/en/account/">My account</Link>
            <Link href="/mentions-legales/" hrefLang="fr">Legal notice (French)</Link>
            <Link href="/confidentialite/" hrefLang="fr">Privacy policy (French)</Link>
            <Link href="/contact/" hrefLang="fr">Contact</Link>
          </nav>
        </div>
        <div className="wrap pied-bas">
          <p>
            Independent fan site, not affiliated with Blizzard Entertainment. World of Warcraft and Warcraft are trademarks of Blizzard Entertainment.
            Game screenshots, maps, icons and names remain the property of Blizzard Entertainment.
          </p>
          <p className="pied-devise">Written by a player, for players ✦</p>
        </div>
      </footer>
    </>
  );
}

export function CadreEn({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en">
      <a href="#contenu" className="sr-only">Skip to content</a>
      <Entete />
      <main id="contenu">{children}</main>
      <Pied />
    </div>
  );
}
