import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="entete">
        <div className="wrap">
          <Link href="/admin/veille/" className="logo" style={{ fontSize: 20 }}>AZEROTH <span>FOREVER</span> · veille</Link>
          <nav className="nav" aria-label="Administration">
            <Link href="/admin/veille/">Articles</Link>
            <Link href="/admin/veille/revue/">Revue du jour</Link>
            <Link href="/" target="_blank">Voir le site</Link>
          </nav>
        </div>
      </header>
      <main id="contenu" className="wrap contenu">{children}</main>
    </>
  );
}
