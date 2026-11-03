import Link from "next/link";
import { NavPrincipale } from "./NavPrincipale";
import { SITE } from "@/lib/site";
import { GererCookies } from "./BandeauCookies";
import { Decompte } from "./Decompte";
import { ChoixLangue, SuggestionAnglais } from "./ChoixLangue";

/** Enseigne de la Taverne (chope et sablier), décorative : le nom du site est écrit à côté. */
export function Medaillon({ taille }: { taille: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/images/enseigne-taverne.svg" width={Math.round((taille * 240) / 228)} height={taille} alt="" className="logo-medaillon" />
  );
}

export function NomSite() {
  return <span className="logo-texte">LA TAVERNE <span>ÉTERNELLE</span></span>;
}

export function Entete() {
  return (
    <header className="entete">
      <div className="wrap entete-haut">
        <Decompte />
        <Link href="/" className="logo logo-pile" aria-label="La Taverne Éternelle, accueil">
          <Medaillon taille={56} />
          <NomSite />
        </Link>
        <div className="outils-entete">
          <ChoixLangue langue="fr" />
          <Link href="/lettre/" className="btn btn-or btn-petit" data-cta="lettre-entete">Recevoir la Lettre</Link>
          <Link href="/compte/" aria-label="Mon compte" data-cta="compte-entete">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            <span className="sr-only">Mon compte</span>
          </Link>
          <Link href="/recherche/" aria-label="Rechercher dans les articles">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="sr-only">Rechercher</span>
          </Link>
          <a href={SITE.facebook} rel="noopener noreferrer" aria-label="Page Facebook de la Taverne Éternelle">
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
  ["/calendrier/", "Calendrier"],
  ["/guides/bien-demarrer/", "Guides"],
  ["/classes/", "Classes"],
  ["/races/", "Races"],
  ["/zones/", "Zones"],
  ["/guides/liste-des-donjons/", "Donjons"],
  ["/carnet/", "Carnet de Jobwow"],
  ["/recherche/", "Recherche"],
  ["/plan-du-site/", "Plan du site"],
  ["/lettre/", "La Lettre"],
  ["/guildes/", "Tableau des guildes"],
  ["/communaute/", "Communauté"],
  ["/soutenir/", "Soutenir la Taverne"],
  ["/a-propos/", "Qui est Jobwow ?"],
  ["/contact/", "Contact"],
  ["/mentions-legales/", "Mentions légales"],
  ["/confidentialite/", "Confidentialité"],
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
              <NomSite />
            </p>
            <p>{SITE.signature}.</p>
          </div>
          <nav aria-label="Pied de page" className="pied-liens">
            {LIENS_PIED.map(([href, nom]) => <Link key={href} href={href}>{nom}</Link>)}
            <a href={SITE.facebook} rel="noopener noreferrer">Page Facebook</a>
            {SITE.discord ? <a href={SITE.discord} rel="noopener noreferrer">Discord</a> : null}
            {SITE.gtmId ? <GererCookies /> : null}
          </nav>
        </div>
        <div className="wrap pied-bas">
          <p>
            {SITE.mentionBlizzard} Les captures d&apos;écran du jeu restent la propriété de Blizzard Entertainment. Certains liens
            sont affiliés : ils peuvent rapporter une commission au site, sans surcoût pour vous.
          </p>
          <p className="pied-devise">Écrit par un joueur, pour les joueurs ✦ <a href="/rss.xml">Flux RSS</a></p>
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
      <SuggestionAnglais />
      <main id="contenu">{children}</main>
      <Pied />
    </>
  );
}
