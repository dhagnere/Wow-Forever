import type { Metadata } from "next";
import Link from "next/link";
import { adminConnecte } from "@/lib/admin";
import { seDeconnecter } from "./connexion/actions";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Affichage seulement : chaque page vérifie elle-même la session avec exigerAdmin().
  const admin = await adminConnecte().catch(() => null);
  return (
    <>
      <header className="entete">
        <div className="wrap">
          <Link href={admin ? "/admin/" : "/"} className="logo" style={{ fontSize: 20 }}>AZEROTH <span>FOREVER</span> · administration</Link>
          {admin ? (
            <nav className="nav" aria-label="Administration">
              <Link href="/admin/">Tableau de bord</Link>
              <Link href="/admin/veille/">Articles</Link>
              <Link href="/admin/veille/revue/">Revue du jour</Link>
              <Link href="/admin/sources/">Sources</Link>
              <Link href="/" target="_blank">Voir le site</Link>
            </nav>
          ) : null}
        </div>
      </header>
      {admin ? (
        <div className="wrap admin-barre">
          <span className="doux">Connecté : <Link href="/admin/compte/">{admin.identifiant}</Link></span>
          <form action={seDeconnecter}><button type="submit" className="btn btn-contour btn-petit">Se déconnecter</button></form>
        </div>
      ) : null}
      <main id="contenu" className="wrap contenu">{children}</main>
    </>
  );
}
