"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** `fr` : page encore en français seulement, signalée dans le menu anglais. */
interface Lien { href: string; label: string; detail?: string; fr?: boolean }
interface Groupe { label: string; prefixe: string[]; liens: Lien[] }
type Entree = (Lien & { prefixe: string[]; silfax?: boolean }) | Groupe;

const MENU: Entree[] = [
  { href: "/", label: "Accueil", prefixe: [] },
  {
    label: "Le Comptoir",
    prefixe: ["/actualites", "/articles", "/rubriques", "/recherche", "/calendrier", "/lettre", "/communaute", "/guildes"],
    liens: [
      { href: "/actualites/", label: "Actualités", detail: "Nouvelles du jour, correctifs, annonces" },
      { href: "/calendrier/", label: "Calendrier", detail: "Sortie, raids, Hardcore, été 2027" },
      { href: "/lettre/", label: "La Lettre de la Taverne", detail: "Chaque dimanche à 10 h" },
      { href: "/guildes/", label: "Tableau des guildes", detail: "Les guildes francophones qui recrutent" },
      { href: "/communaute/", label: "Communauté", detail: "Discord, Page Facebook" },
    ],
  },
  {
    label: "Guides",
    prefixe: ["/guides"],
    liens: [
      { href: "/guides/bien-demarrer/", label: "Bien débuter", detail: "Race, classe, zone, premiers métiers" },
      { href: "/guides/zones-de-depart/", label: "Zones de départ", detail: "Où commence chaque race" },
      { href: "/guides/zones-par-niveau/", label: "Zones par niveau", detail: "Toutes les zones, de 1 à 60" },
      { href: "/guides/parcours/", label: "Parcours de 1 à 60", detail: "La route de l'Alliance et de la Horde" },
      { href: "/guides/quetes-de-classe/", label: "Quêtes de classe", detail: "Chaînes, donneurs et récompenses" },
      { href: "/guides/liste-des-donjons/", label: "Liste des donjons", detail: "Donjons et raids par niveau" },
    ],
  },
  {
    label: "Explorer",
    prefixe: ["/classes", "/races", "/zones", "/donjons", "/base-de-donnees", "/cartes"],
    liens: [
      { href: "/classes/", label: "L'Armurerie · Classes", detail: "Rôles, races possibles, conseils" },
      { href: "/races/", label: "Le Registre · Races", detail: "Dont les Skyborne" },
      { href: "/zones/", label: "La Salle des cartes · Zones", detail: "Les nouvelles terres de Forever" },
      { href: "/cartes/", label: "Cartes du monde", detail: "Kalimdor, Royaumes de l'Est, Zéphras" },
      { href: "/donjons/", label: "La Cave · Donjons et raids", detail: "Repérés en bêta, annoncés" },
      { href: "/base-de-donnees/", label: "Base de données", detail: "Tous les objets du jeu, en français" },
    ],
  },
  { href: "/carnet/", label: "Le Carnet de Jobwow", prefixe: ["/carnet"], silfax: true },
];

/** Menu de la version anglaise : mêmes rubriques ; les pages pas encore traduites mènent au site français. */
const MENU_EN: Entree[] = [
  { href: "/en/", label: "Home", prefixe: [] },
  {
    label: "The Bar",
    prefixe: [],
    liens: [
      { href: "/actualites/", label: "News", detail: "Daily news, patches, announcements", fr: true },
      { href: "/calendrier/", label: "Calendar", detail: "Launch, raids, Hardcore, summer 2027", fr: true },
      { href: "/lettre/", label: "The Tavern's newsletter", detail: "Every Sunday at 10 am", fr: true },
      { href: "/guildes/", label: "Guild board", detail: "French-speaking guilds recruiting", fr: true },
      { href: "/communaute/", label: "Community", detail: "Discord, Facebook page", fr: true },
    ],
  },
  {
    label: "Guides",
    prefixe: ["/en/leveling-guide"],
    liens: [
      { href: "/en/leveling-guide/", label: "Leveling guide 1-60", detail: "Quest by quest, for your race and class" },
      { href: "/en/leveling-guide/#alliance", label: "Alliance and Horde routes", detail: "Zones in order, from 1 to 60" },
      { href: "/guides/bien-demarrer/", label: "Getting started", detail: "Race, class, zone, first professions", fr: true },
      { href: "/guides/zones-de-depart/", label: "Starting zones", detail: "Where each race begins", fr: true },
      { href: "/guides/zones-par-niveau/", label: "Zones by level", detail: "Every zone, from 1 to 60", fr: true },
      { href: "/guides/quetes-de-classe/", label: "Class quests", detail: "Chains, quest givers and rewards", fr: true },
      { href: "/guides/liste-des-donjons/", label: "Dungeon list", detail: "Dungeons and raids by level", fr: true },
    ],
  },
  {
    label: "Explore",
    prefixe: ["/en/classes", "/en/races", "/en/maps", "/en/item-database"],
    liens: [
      { href: "/en/classes/", label: "The Armoury · Classes", detail: "Spells, talents, calculator" },
      { href: "/en/races/", label: "The Register · Races", detail: "Racial traits, Skyborne included" },
      { href: "/races/skyborne/", label: "Skyborne", detail: "The new playable race", fr: true },
      { href: "/zones/", label: "The Map Room · Zones", detail: "Forever's new lands", fr: true },
      { href: "/en/maps/", label: "World maps", detail: "Kalimdor, Eastern Kingdoms, Zephras Isle" },
      { href: "/donjons/", label: "The Cellar · Dungeons and raids", detail: "Spotted in beta, announced", fr: true },
      { href: "/en/item-database/", label: "Item database", detail: "Every item in the game" },
    ],
  },
  { href: "/carnet/", label: "Jobwow's notebook", prefixe: ["/carnet"], silfax: true, fr: true },
];

function actif(chemin: string, prefixe: string[], href?: string) {
  if (href === "/" || href === "/en/") return chemin === href || chemin === href.slice(0, -1);
  return prefixe.some((p) => chemin.startsWith(p));
}

export function NavPrincipale({ langue = "fr" }: { langue?: "fr" | "en" }) {
  const chemin = usePathname() ?? "/";
  const menu = langue === "en" ? MENU_EN : MENU;
  const enFrancais = langue === "en" ? " (in French)" : "";
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
    <nav className="nav" aria-label={langue === "en" ? "Sections" : "Rubriques"} ref={nav}>
      {menu.map((e) =>
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
                <Link key={l.href} href={l.href} hrefLang={l.fr && langue === "en" ? "fr" : undefined} aria-current={chemin.startsWith(l.href) ? "page" : undefined}>
                  {l.label}
                  {l.detail || (l.fr && enFrancais) ? <small>{l.detail}{l.fr ? enFrancais : ""}</small> : null}
                </Link>
              ))}
            </div>
          </details>
        ) : (
          <Link key={e.href} href={e.href} aria-current={actif(chemin, e.prefixe, e.href) ? "page" : undefined} className={e.silfax ? "nav-silfax" : undefined} hrefLang={e.fr && langue === "en" ? "fr" : undefined}>
            {e.label}
          </Link>
        ),
      )}
    </nav>
  );
}
