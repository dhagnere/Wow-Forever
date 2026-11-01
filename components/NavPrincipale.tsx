"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface Lien { href: string; label: string; detail?: string }
interface Groupe { label: string; prefixe: string[]; liens: Lien[] }
type Entree = (Lien & { prefixe: string[]; silfax?: boolean }) | Groupe;

const MENU: Entree[] = [
  { href: "/", label: "Accueil", prefixe: [] },
  { href: "/actualites/", label: "Actualités", prefixe: ["/actualites", "/articles", "/rubriques", "/recherche"] },
  {
    label: "Guides",
    prefixe: ["/guides"],
    liens: [
      { href: "/guides/bien-demarrer/", label: "Bien démarrer", detail: "Sortie, abonnement, premiers pas" },
      { href: "/guides/zones-de-depart/", label: "Zones de départ", detail: "Où commence chaque race" },
      { href: "/guides/zones-par-niveau/", label: "Zones par niveau", detail: "La route de 1 à 60" },
      { href: "/guides/liste-des-donjons/", label: "Liste des donjons", detail: "Donjons et raids par niveau" },
    ],
  },
  {
    label: "Explorer",
    prefixe: ["/classes", "/races", "/zones", "/donjons"],
    liens: [
      { href: "/classes/", label: "Classes", detail: "Rôles, races possibles, conseils" },
      { href: "/races/", label: "Races", detail: "Dont les Skyborne" },
      { href: "/zones/", label: "Zones", detail: "Les nouvelles terres de Forever" },
      { href: "/donjons/", label: "Donjons et raids", detail: "Repérés en bêta, annoncés" },
    ],
  },
  { href: "/carnet/", label: "Carnet de Silfax", prefixe: ["/carnet"], silfax: true },
];

function actif(chemin: string, prefixe: string[], href?: string) {
  return href === "/" ? chemin === "/" : prefixe.some((p) => chemin.startsWith(p));
}

export function NavPrincipale() {
  const chemin = usePathname() ?? "/";
  const nav = useRef<HTMLElement>(null);

  // Ferme les sous-menus au changement de page, au clic ailleurs et à la touche Échap.
  useEffect(() => {
    nav.current?.querySelectorAll("details[open]").forEach((d) => d.removeAttribute("open"));
  }, [chemin]);
  useEffect(() => {
    const fermer = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && nav.current?.contains(e.target as Node)) return;
      nav.current?.querySelectorAll("details[open]").forEach((d) => d.removeAttribute("open"));
    };
    document.addEventListener("click", fermer);
    document.addEventListener("keydown", fermer);
    return () => {
      document.removeEventListener("click", fermer);
      document.removeEventListener("keydown", fermer);
    };
  }, []);

  return (
    <nav className="nav" aria-label="Rubriques" ref={nav}>
      {MENU.map((e) =>
        "liens" in e ? (
          <details
            key={e.label}
            className="nav-groupe"
            data-actif={actif(chemin, e.prefixe) ? "" : undefined}
            onToggle={(ev) => {
              // Un seul sous-menu ouvert à la fois.
              if ((ev.currentTarget as HTMLDetailsElement).open) {
                nav.current?.querySelectorAll("details[open]").forEach((d) => d !== ev.currentTarget && d.removeAttribute("open"));
              }
            }}
          >
            <summary>{e.label}</summary>
            <div className="nav-sousmenu">
              {e.liens.map((l) => (
                <Link key={l.href} href={l.href} aria-current={chemin.startsWith(l.href) ? "page" : undefined}>
                  {l.label}
                  {l.detail ? <small>{l.detail}</small> : null}
                </Link>
              ))}
            </div>
          </details>
        ) : (
          <Link key={e.href} href={e.href} aria-current={actif(chemin, e.prefixe, e.href) ? "page" : undefined} className={e.silfax ? "nav-silfax" : undefined}>
            {e.label}
          </Link>
        ),
      )}
    </nav>
  );
}
