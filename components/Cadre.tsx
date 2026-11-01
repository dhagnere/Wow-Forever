import Link from "next/link";
import { NavPrincipale } from "./NavPrincipale";
import { SITE } from "@/lib/site";
import { GererCookies } from "./BandeauCookies";
import { Decompte } from "./Decompte";

/** Médaillon Silfax, décoratif : le nom du site est écrit à côté. */
export function Medaillon({ taille }: { taille: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-silfax-96.png"
      srcSet="/images/logo-silfax-96.png 1x, /images/logo-silfax-192.png 2x"
      width={taille}
      height={taille}
      alt=""
      className="logo-medaillon"
    />
  );
}

export function Entete() {
  return (
    <header className="entete">
      <div className="wrap entete-haut">
        <Decompte />
        <Link href="/" className="logo logo-pile" aria-label="Azeroth Forever, accueil">
          <Medaillon taille={56} />
          <span className="logo-texte">AZEROTH <span>FOREVER</span></span>
        </Link>
        <div className="outils-entete">
          <Link href="/recherche/" aria-label="Rechercher dans les articles">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="sr-only">Rechercher</span>
          </Link>
          <a href={SITE.facebook} rel="noopener noreferrer" aria-label="Page Facebook Azeroth Forever">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" /></svg>
          </a>
        </div>
      </div>
      <div className="entete-menu">
        <div className="wrap">
          <NavPrincipale />
        </div>
      </div>
    </header>
  );
}

const LIENS_PIED: [string, string][] = [
  ["/actualites/", "Actualités"],
  ["/guides/bien-demarrer/", "Guides"],
  ["/classes/", "Classes"],
  ["/races/", "Races"],
  ["/zones/", "Zones"],
  ["/guides/liste-des-donjons/", "Donjons"],
  ["/carnet/", "Carnet de Silfax"],
  ["/recherche/", "Recherche"],
  ["/plan-du-site/", "Plan du site"],
  ["/a-propos/", "Qui est Silfax ?"],
  ["/mentions-legales/", "Mentions légales"],
];

export function Pied() {
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
              <span className="logo-texte">AZEROTH <span>FOREVER</span></span>
            </p>
            <p>WoW Forever en français, de 1 à 60. Écrit et relu par Silfax.</p>
          </div>
          <nav aria-label="Pied de page" className="pied-liens">
            {LIENS_PIED.map(([href, nom]) => <Link key={href} href={href}>{nom}</Link>)}
            <a href={SITE.facebook} rel="noopener noreferrer">Page Facebook</a>
            {SITE.gtmId ? <GererCookies /> : null}
          </nav>
        </div>
        <div className="wrap pied-bas">
          <p>
            {SITE.mentionBlizzard} Les captures d&apos;écran du jeu restent la propriété de Blizzard Entertainment. Certains liens
            sont affiliés : ils peuvent rapporter une commission au site, sans surcoût pour vous.
          </p>
          <p className="pied-devise">Écrit par un joueur, pour les joueurs ✦</p>
        </div>
      </footer>
    </>
  );
}

export function SiteCadre({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenu" className="sr-only">Aller au contenu</a>
      <Entete />
      <main id="contenu">{children}</main>
      <Pied />
    </>
  );
}
