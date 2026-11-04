import type { Metadata } from "next";
import { compterPubliesEn, listerPubliesEn } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { RepertoireEn } from "@/components/RepertoireEn";
import { pageDemandee } from "@/components/ListePaginee";
import { fondBandeau } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WoW Forever news",
  description: "World of Warcraft: Forever news: announcements, patches, dungeons, classes and new zones, served every morning by Jobwow.",
  alternates: { canonical: "/en/news/", languages: { fr: "/actualites/", en: "/en/news/", "x-default": "/actualites/" } },
};

const PAR_PAGE = 20;

export default async function NewsEn({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageDemandee((await searchParams).page);
  const [articles, total] = await Promise.all([listerPubliesEn({ limite: PAR_PAGE, decalage: (page - 1) * PAR_PAGE }), compterPubliesEn()]);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "News" }]} />
          <p className="surtitre">The Bar · every morning, reviewed by Jobwow</p>
          <h1>The <span className="accent">Azeroth</span> wire</h1>
          <p className="chapo">WoW Forever news spotted around the world, sorted by topic and commented by Jobwow. Translated from the French edition of the Tavern.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <RepertoireEn articles={articles} total={total} page={page} base="/en/news/" />
      </div>
    </>
  );
}
