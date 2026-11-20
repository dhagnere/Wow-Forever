import Link from "next/link";
import { SITE } from "@/lib/site";
import { GererCookies } from "./BandeauCookies";

/** Corps du pied de page, en colonnes thématiques : maillage interne lisible pour les visiteurs comme pour les moteurs. */

type Colonne = { titre: string; liens: [string, string][] };

const COLONNES: Record<"fr" | "en", Colonne[]> = {
  fr: [
    {
      titre: "Guides",
      liens: [
        ["/guides/parcours/", "Guide de 1 à 60"],
        ["/addon/", "Addon TaverneRoutes"],
        ["/guides/bien-demarrer/", "Bien débuter"],
        ["/guides/zones-de-depart/", "Zones de départ"],
        ["/guides/zones-par-niveau/", "Zones par niveau"],
        ["/guides/quetes-de-classe/", "Quêtes de classe"],
        ["/guides/liste-des-donjons/", "Liste des donjons"],
      ],
    },
    {
      titre: "Explorer",
      liens: [
        ["/classes/", "Classes et talents"],
        ["/races/", "Races"],
        ["/races/skyborne/", "Skyborne"],
        ["/zones/", "Zones"],
        ["/cartes/", "Cartes du monde"],
        ["/donjons/", "Donjons et raids"],
        ["/base-de-donnees/", "Base d'objets"],
      ],
    },
    {
      titre: "Le Comptoir",
      liens: [
        ["/actualites/", "Actualités"],
        ["/calendrier/", "Calendrier"],
        ["/carnet/", "Le Carnet de Jobwow"],
        ["/carnet/videos/", "Les vidéos"],
        ["/lettre/", "La Lettre du dimanche"],
        ["/guildes/", "Tableau des guildes"],
        ["/communaute/", "Communauté"],
      ],
    },
    {
      titre: "La Taverne",
      liens: [
        ["/a-propos/", "Qui est Jobwow ?"],
        ["/soutenir/", "Soutenir la Taverne"],
        ["/contact/", "Contact"],
        ["/compte/", "Mon compte"],
        ["/recherche/", "Recherche"],
        ["/plan-du-site/", "Plan du site"],
        ["/mentions-legales/", "Mentions légales"],
        ["/confidentialite/", "Confidentialité"],
      ],
    },
  ],
  en: [
    {
      titre: "Guides",
      liens: [
        ["/en/leveling-guide/", "Leveling guide 1-60"],
        ["/en/addon/", "TaverneRoutes addon"],
        ["/en/guides/getting-started/", "Getting started"],
        ["/en/guides/starting-zones/", "Starting zones"],
        ["/en/guides/zones-by-level/", "Zones by level"],
        ["/en/guides/class-quests/", "Class quests"],
        ["/en/guides/dungeon-list/", "Dungeon list"],
      ],
    },
    {
      titre: "Explore",
      liens: [
        ["/en/classes/", "Classes and talents"],
        ["/en/races/", "Races"],
        ["/en/races/skyborne/", "Skyborne"],
        ["/en/zones/", "Zones"],
        ["/en/maps/", "World maps"],
        ["/en/dungeons/", "Dungeons and raids"],
        ["/en/item-database/", "Item database"],
      ],
    },
    {
      titre: "The Bar",
      liens: [
        ["/en/news/", "News"],
        ["/en/calendar/", "Calendar"],
        ["/en/notebook/", "Jobwow's notebook"],
        ["/en/notebook/videos/", "Videos"],
        ["/en/newsletter/", "Sunday newsletter"],
        ["/en/guilds/", "Guild board"],
        ["/en/community/", "Community"],
      ],
    },
    {
      titre: "The Tavern",
      liens: [
        ["/en/about/", "Who is Jobwow?"],
        ["/en/support/", "Support the Tavern"],
        ["/en/contact/", "Contact"],
        ["/en/account/", "My account"],
        ["/en/search/", "Search"],
        ["/en/sitemap/", "Site map"],
        ["/en/legal-notice/", "Legal notice"],
        ["/en/privacy/", "Privacy policy"],
      ],
    },
  ],
};

const ICONES = {
  facebook: <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
  discord: <><path d="M8 7c2.5-1 5.5-1 8 0l1.5 9c-1.5 1.2-3 1.8-4.5 2l-.8-1.6M8 7 6.5 16c1.5 1.2 3 1.8 4.5 2l.8-1.6" /><circle cx="9.5" cy="12" r="1" /><circle cx="14.5" cy="12" r="1" /></>,
  rss: <><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" /><circle cx="6" cy="18" r="1.2" /></>,
};

function Icone({ nom }: { nom: keyof typeof ICONES }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONES[nom]}
    </svg>
  );
}

export function PiedColonnes({ langue = "fr", marque }: { langue?: "fr" | "en"; marque: React.ReactNode }) {
  const en = langue === "en";
  const suffixe = en ? "-en" : "";
  return (
    <div className="wrap pied-colonnes">
      <div className="pied-marque">
        {marque}
        <div className="pied-social">
          <a href={SITE.facebook} rel="noopener noreferrer" aria-label={en ? "Facebook page" : "Page Facebook"} data-cta={`facebook-pied${suffixe}`}><Icone nom="facebook" /></a>
          {SITE.youtube ? <a href={SITE.youtube} rel="noopener noreferrer" aria-label={en ? "YouTube channel" : "Chaîne YouTube"} data-cta={`youtube-pied${suffixe}`}><Icone nom="youtube" /></a> : null}
          {SITE.discord ? <a href={SITE.discord} rel="noopener noreferrer" aria-label="Discord" data-cta={`discord-pied${suffixe}`}><Icone nom="discord" /></a> : null}
          <a href="/rss.xml" aria-label={en ? "RSS feed (French)" : "Flux RSS"}><Icone nom="rss" /></a>
        </div>
      </div>
      {COLONNES[langue].map((c, i) => (
        <nav key={c.titre} aria-labelledby={`pied-${langue}-${i}`}>
          <h2 id={`pied-${langue}-${i}`}>{c.titre}</h2>
          <ul>
            {c.liens.map(([href, nom]) => <li key={href}><Link href={href}>{nom}</Link></li>)}
            {i === COLONNES[langue].length - 1 && SITE.gtmId ? <li><GererCookies langue={langue} /></li> : null}
          </ul>
        </nav>
      ))}
    </div>
  );
}
