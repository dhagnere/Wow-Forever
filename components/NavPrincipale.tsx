"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS = [
  { href: "/actualites/", label: "Actualités", prefixe: ["/actualites", "/articles", "/rubriques"] },
  { href: "/classes/", label: "Classes", prefixe: ["/classes"] },
  { href: "/races/", label: "Races", prefixe: ["/races"] },
  { href: "/zones/", label: "Monde", prefixe: ["/zones", "/donjons"] },
  { href: "/guides/bien-demarrer/", label: "Guides", prefixe: ["/guides"] },
  { href: "/carnet/", label: "Carnet de Silfax", prefixe: ["/carnet"], silfax: true },
];

export function NavPrincipale() {
  const chemin = usePathname() ?? "/";
  return (
    <nav className="nav" aria-label="Rubriques">
      {LIENS.map((l) => {
        const actif = l.prefixe.some((p) => chemin.startsWith(p));
        return (
          <Link key={l.href} href={l.href} aria-current={actif ? "page" : undefined} className={l.silfax ? "nav-silfax" : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
