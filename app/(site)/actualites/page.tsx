import type { Metadata } from "next";
import Link from "next/link";
import { compterPublies, listerPublies } from "@/modules/veille";
import { RUBRIQUES } from "@/config/taxonomie";
import { Ariane } from "@/components/Ariane";
import { ListePaginee, PAR_PAGE, pageDemandee } from "@/components/ListePaginee";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités de WoW Forever",
  description: "Toute l'actualité de World of Warcraft: Forever en français : annonces, patchs, donjons, classes et nouvelles zones.",
  alternates: { canonical: "/actualites/" },
};

export default async function Actualites({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageDemandee((await searchParams).page);
  const [articles, total] = await Promise.all([listerPublies({ limite: PAR_PAGE, decalage: (page - 1) * PAR_PAGE }), compterPublies()]);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Actualités" }]} />
          <h1>Actualités</h1>
          <p className="chapo">L&apos;actualité de WoW Forever, triée chaque matin et relue par Silfax avant publication.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <nav aria-label="Rubriques" className="onglets">
          {RUBRIQUES.map((r) => <Link key={r.slug} href={`/rubriques/${r.slug}/`}>{r.nom}</Link>)}
        </nav>
        <ListePaginee articles={articles} total={total} page={page} base="/actualites/" />
      </div>
    </>
  );
}
