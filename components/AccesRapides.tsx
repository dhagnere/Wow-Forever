import Link from "next/link";

/** Accès rapides sous le héros de l'accueil : les six outils les plus demandés, à un clic. */

type Icone = "route" | "talents" | "objets" | "carte" | "donjon" | "ailes";

interface Acces { href: string; icone: Icone; nom: string; detail: string; cta: string }

const ACCES: Record<"fr" | "en", Acces[]> = {
  fr: [
    { href: "/guides/parcours/", icone: "route", nom: "Guide de 1 à 60", detail: "Quête par quête, par race et classe", cta: "acces-guide" },
    { href: "/classes/", icone: "talents", nom: "Talents", detail: "Sorts, arbres et calculateur", cta: "acces-talents" },
    { href: "/base-de-donnees/", icone: "objets", nom: "Base d'objets", detail: "Armes, armures, recettes", cta: "acces-objets" },
    { href: "/cartes/", icone: "carte", nom: "Cartes du monde", detail: "Kalimdor, Royaumes de l'Est, Zéphras", cta: "acces-cartes" },
    { href: "/donjons/", icone: "donjon", nom: "Donjons et raids", detail: "Boss, butin et entrées", cta: "acces-donjons" },
    { href: "/races/skyborne/", icone: "ailes", nom: "Skyborne", detail: "La nouvelle race jouable", cta: "acces-skyborne" },
  ],
  en: [
    { href: "/en/leveling-guide/", icone: "route", nom: "Leveling guide", detail: "Quest by quest, by race and class", cta: "acces-guide-en" },
    { href: "/en/classes/", icone: "talents", nom: "Talents", detail: "Spells, trees and calculator", cta: "acces-talents-en" },
    { href: "/en/item-database/", icone: "objets", nom: "Item database", detail: "Weapons, armour, recipes", cta: "acces-objets-en" },
    { href: "/en/maps/", icone: "carte", nom: "World maps", detail: "Kalimdor, Eastern Kingdoms, Zephras", cta: "acces-cartes-en" },
    { href: "/en/dungeons/", icone: "donjon", nom: "Dungeons and raids", detail: "Bosses, loot and entrances", cta: "acces-donjons-en" },
    { href: "/en/races/skyborne/", icone: "ailes", nom: "Skyborne", detail: "The new playable race", cta: "acces-skyborne-en" },
  ],
};

function Pictogramme({ icone }: { icone: Icone }) {
  const commun = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (icone) {
    case "route":
      return <svg {...commun}><circle cx="5" cy="19" r="2" /><circle cx="19" cy="5" r="2" /><path d="M7 19h8a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h8" /></svg>;
    case "talents":
      return <svg {...commun}><circle cx="12" cy="4.5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="12" cy="19.5" r="2" /><path d="M10.6 6 7.4 10.5M13.4 6l3.2 4.5M7.4 13.5l3.2 4.5M16.6 13.5 13.4 18" /></svg>;
    case "objets":
      return <svg {...commun}><path d="M14.5 3.5 20.5 9.5 10 20l-6-6z" /><path d="m4 20 3-3M13 6l5 5" /></svg>;
    case "carte":
      return <svg {...commun}><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z" /><path d="M9 4v13M15 6.5v13" /></svg>;
    case "donjon":
      return <svg {...commun}><path d="M4 21V9l3-2V4h3v2h4V4h3v3l3 2v12z" /><path d="M10 21v-5a2 2 0 0 1 4 0v5" /></svg>;
    case "ailes":
      return <svg {...commun}><path d="M12 8c-2-3-6-4-9-3 1 4 4 7 9 8 5-1 8-4 9-8-3-1-7 0-9 3z" /><path d="M12 13v7" /></svg>;
  }
}

export function AccesRapides({ langue = "fr" }: { langue?: "fr" | "en" }) {
  return (
    <nav className="acces-rapides" aria-label={langue === "en" ? "Quick access" : "Accès rapides"}>
      <div className="wrap">
        <ul>
          {ACCES[langue].map((a) => (
            <li key={a.href}>
              <Link href={a.href} data-cta={a.cta}>
                <span className="acces-icone"><Pictogramme icone={a.icone} /></span>
                <span>
                  <strong>{a.nom}</strong>
                  <small>{a.detail}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
