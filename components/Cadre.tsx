import Link from "next/link";
import { NavPrincipale } from "./NavPrincipale";
import { SITE } from "@/lib/site";
import { GererCookies } from "./BandeauCookies";

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
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Azeroth Forever, accueil">
          <Medaillon taille={52} />
          <span className="logo-texte">AZEROTH <span>FOREVER</span></span>
        </Link>
        <NavPrincipale />
      </div>
    </header>
  );
}

export function Pied() {
  return (
    <footer className="pied">
      <div className="wrap">
        <div style={{ flex: "1 1 320px" }}>
          <p className="logo" style={{ fontSize: 20, margin: "0 0 8px" }}>
            <Medaillon taille={40} />
            <span className="logo-texte">AZEROTH <span>FOREVER</span></span>
          </p>
          <p style={{ margin: 0 }}>
            {SITE.mentionBlizzard} Les captures d&apos;écran du jeu restent la propriété de Blizzard Entertainment. Certains
            liens sont affiliés : ils peuvent rapporter une commission au site, sans surcoût pour vous.
          </p>
        </div>
        <nav aria-label="Pied de page">
          <Link href="/a-propos/">Qui est Silfax ?</Link>
          <Link href="/plan-du-site/">Plan du site</Link>
          <Link href="/mentions-legales/">Mentions légales</Link>
          <a href={SITE.facebook} rel="noopener noreferrer">Page Facebook</a>
          {SITE.gtmId ? <GererCookies /> : null}
        </nav>
      </div>
    </footer>
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
