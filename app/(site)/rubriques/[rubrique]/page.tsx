import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compterPublies, listerPublies } from "@/modules/veille";
import { trouverRubrique } from "@/config/taxonomie";
import { Ariane } from "@/components/Ariane";
import { Repertoire } from "@/components/Repertoire";
import { pageDemandee } from "@/components/ListePaginee";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ rubrique: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = trouverRubrique((await params).rubrique);
  if (!r) return {};
  return { title: `${r.nom} — WoW Forever`, description: r.description, alternates: { canonical: `/rubriques/${r.slug}/` } };
}

const PAR_PAGE = 20;

export default async function PageRubrique({ params, searchParams }: Props) {
  const r = trouverRubrique((await params).rubrique);
  if (!r) notFound();
  const page = pageDemandee((await searchParams).page);
  const [articles, total] = await Promise.all([
    listerPublies({ rubrique: r.slug, limite: PAR_PAGE, decalage: (page - 1) * PAR_PAGE }),
    compterPublies(r.slug),
  ]);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Actualités", href: "/actualites/" }, { nom: r.nom }]} />
          <p className="surtitre">Rubrique</p>
          <h1>{r.nom}</h1>
          <p className="chapo">{r.description}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <Repertoire actif={r.slug} articles={articles} total={total} page={page} base={`/rubriques/${r.slug}/`} />
      </div>
    </>
  );
}
