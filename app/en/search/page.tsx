import type { Metadata } from "next";
import { rechercherPubliesEn } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { RepertoireEn } from "@/components/RepertoireEn";
import { fondBandeau } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchEn({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const brut = (await searchParams).q;
  const q = (Array.isArray(brut) ? brut[0] : brut ?? "").slice(0, 120).trim();
  const articles = q ? await rechercherPubliesEn(q, 50) : [];
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("gnomeregan")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Search" }]} />
          <p className="surtitre">In the site&apos;s articles</p>
          <h1>{q ? <>Results for <span className="accent">“{q}”</span></> : "Search"}</h1>
          <p className="chapo">{q ? `${articles.length} article${articles.length === 1 ? "" : "s"} found.` : "A class, a dungeon, a zone, a word from the article: type it, Jobwow searches."}</p>
        </div>
      </section>
      <div className="wrap contenu">
        {q ? <span hidden data-recherche={q} data-lieu="site" data-resultats={articles.length} /> : null}
        <RepertoireEn articles={articles} total={articles.length} page={1} base="/en/search/" requete={q} />
      </div>
    </>
  );
}
