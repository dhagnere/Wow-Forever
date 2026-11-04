import type { Metadata } from "next";
import Link from "next/link";
import { DUREE_VALIDITE_JOURS, listerGuildes } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { CarteGuilde, LIBELLES_GUILDE_EN } from "@/components/Guildes";
import { fondBandeau } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WoW Forever guild board: French-speaking guilds recruiting",
  description: "French-speaking WoW Forever guilds recruiting: Alliance or Horde, PvE, PvP, roleplay or Hardcore. Free listing for guilds.",
  alternates: { canonical: "/en/guilds/", languages: { fr: "/guildes/", en: "/en/guilds/", "x-default": "/guildes/" } },
};

type Params = Record<string, string | string[] | undefined>;
const un = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const parmi = (v: string, table: Record<string, string>) => (v in table ? v : undefined);

export default async function GuildsEn({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const L = LIBELLES_GUILDE_EN;
  const filtres = {
    faction: parmi(un(p.faction), L.factions),
    type: parmi(un(p.type), L.types),
    objectif: parmi(un(p.objectif), L.objectifs),
    classe: parmi(un(p.classe), L.classes),
    recrute: un(p.recrute) === "oui",
  };
  const guildes = await listerGuildes(filtres as Parameters<typeof listerGuildes>[0]);
  const filtre = Object.values(filtres).some(Boolean);

  return (
    <>
      <section className="bandeau-page" style={fondBandeau("vallee-d-alterac")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "News", href: "/en/news/" }, { nom: "Guild board" }]} />
          <p className="surtitre">The Bar · recruitment</p>
          <h1>The guild <span className="accent">board</span></h1>
          <p className="chapo">
            French-speaking WoW Forever guilds post their listings here. Looking for a group, an atmosphere, a raid? Have a look, then drop by
            their Discord. Listings are written by the guilds, in their own language.
          </p>
          <div className="actions-bandeau">
            <Link href="/en/guilds/register/" className="btn btn-or" data-cta="inscrire-guilde-en">Register my guild</Link>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <form method="get" action="/en/guilds/" className="filtres-objets" aria-label="Filter guilds">
          <label>
            <span>Faction</span>
            <select name="faction" defaultValue={filtres.faction ?? ""}>
              <option value="">All</option>
              {Object.entries(L.factions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span>Realm</span>
            <select name="type" defaultValue={filtres.type ?? ""}>
              <option value="">All</option>
              {Object.entries(L.types).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span>Activity</span>
            <select name="objectif" defaultValue={filtres.objectif ?? ""}>
              <option value="">All</option>
              {Object.entries(L.objectifs).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span>Looking for class</span>
            <select name="classe" defaultValue={filtres.classe ?? ""}>
              <option value="">Any</option>
              {Object.entries(L.classes).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="case" style={{ flexDirection: "row", alignSelf: "center" }}>
            <input type="checkbox" name="recrute" value="oui" defaultChecked={filtres.recrute} />
            <span>Recruiting</span>
          </label>
          <button type="submit" className="btn btn-or">Filter</button>
        </form>

        <p className="doux" style={{ fontSize: 14 }}>
          {guildes.length} guild{guildes.length === 1 ? "" : "s"}{filtre ? " matching these criteria" : ""}. Recently updated listings come first;
          a listing not confirmed for {DUREE_VALIDITE_JOURS} days is no longer shown.
        </p>

        {guildes.length ? (
          <div className="grille-guildes">{guildes.map((g) => <CarteGuilde key={g.id} g={g} langue="en" />)}</div>
        ) : (
          <div className="encadre" style={{ padding: 24 }}>
            <p style={{ margin: "0 0 14px" }}>{filtre ? "No guild matches these criteria yet." : "The board is waiting for its first guilds. Yours?"}</p>
            <Link href="/en/guilds/register/" className="btn btn-or" data-cta="inscrire-guilde-vide-en">Register my guild</Link>
          </div>
        )}

        <p className="doux" style={{ fontSize: 13, marginTop: 32, maxWidth: 760 }}>
          Listings are written by the guilds and reviewed by Jobwow before publication. The Tavern guarantees neither their accuracy nor what
          happens on their Discord servers. A problem with a listing? <Link href="/contact/" hrefLang="fr">Report it</Link>.
        </p>
      </div>
    </>
  );
}
