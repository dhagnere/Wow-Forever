import type { Metadata } from "next";
import Link from "next/link";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { ZONES, DONJONS } from "@/content/monde";
import { ZONES_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { fondBandeau } from "@/lib/ecrans";
import { CLASSES_EN, nomDonjonEn, pageDonjonEn, pageRubriqueEn, pageZoneEn, RUBRIQUES_EN } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "Site map",
  alternates: { canonical: "/en/sitemap/", languages: { fr: "/plan-du-site/", en: "/en/sitemap/", "x-default": "/plan-du-site/" } },
};

export default function SitemapEn() {
  const rubriques = (famille: string) => RUBRIQUES.filter((r) => r.famille === famille).map((r) => [pageRubriqueEn(r.slug), RUBRIQUES_EN[r.slug]?.nom ?? r.nom] as [string, string]);
  const blocs: { titre: string; liens: [string, string][] }[] = [
    { titre: "News", liens: [["/en/news/", "All news"], ...rubriques("fil"), ["/en/calendar/", "Calendar"], ["/en/newsletter/", "The newsletter"]] },
    { titre: "Classes", liens: [["/en/classes/", "The nine classes"], ...CLASSES.map((c) => [`/en/classes/${CLASSES_EN[c.slug].slug}/`, CLASSES_EN[c.slug].nom] as [string, string])] },
    { titre: "Races", liens: [["/en/races/", "All races"], ["/en/races/skyborne/", "Skyborne, the new race"]] },
    {
      titre: "World",
      liens: [
        ["/en/zones/", "Zones"], ...ZONES.map((z) => [pageZoneEn(z.slug), ZONES_EN[z.slug]?.nom ?? z.nom] as [string, string]),
        ["/en/dungeons/", "Dungeons and raids"], ...DONJONS.map((d) => [pageDonjonEn(d.slug), nomDonjonEn(d.nom) ?? d.nom] as [string, string]),
        ["/en/item-database/", "Item database"], ["/en/maps/", "World maps"],
      ],
    },
    {
      titre: "Guides",
      liens: [
        ["/en/leveling-guide/", "Leveling guide 1-60"], ["/en/guides/getting-started/", "Getting started"], ["/en/guides/starting-zones/", "Starting zones"],
        ["/en/guides/zones-by-level/", "Zones by level"], ["/en/guides/class-quests/", "Class quests"], ["/en/guides/dungeon-list/", "Dungeon list"], ...rubriques("guides"),
      ],
    },
    { titre: "Jobwow's Notebook", liens: [["/en/notebook/", "All episodes"], [pageRubriqueEn("tests"), RUBRIQUES_EN.tests?.nom ?? "Reviews"]] },
    {
      titre: "The site",
      liens: [
        ["/en/about/", "Who is Jobwow?"], ["/en/community/", "Community"], ["/en/guilds/", "Guild board"], ["/en/support/", "Support the Tavern"],
        ["/en/contact/", "Contact"], ["/en/account/", "My account"], ["/en/legal-notice/", "Legal notice"], ["/en/privacy/", "Privacy policy"],
      ],
    },
  ];
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("royaumes-de-l-est")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Site map" }]} />
          <h1>Site map</h1>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="g3">
          {blocs.map((b) => (
            <section key={b.titre} className="encadre cadre">
              <h2 className="titre" style={{ fontSize: 20, color: "var(--or-clair)" }}>{b.titre}</h2>
              <ul style={{ margin: 0, paddingLeft: 20 }}>{b.liens.map(([href, nom]) => <li key={href}><Link href={href}>{nom}</Link></li>)}</ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
