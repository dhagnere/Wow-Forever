import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compterPubliesEn, listerPubliesEn } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { RepertoireEn } from "@/components/RepertoireEn";
import { pageDemandee } from "@/components/ListePaginee";
import { ecranArticle, fondBandeau } from "@/lib/ecrans";
import { RUBRIQUES_EN, rubriqueDepuisEn } from "@/lib/anglais";
import type { SlugRubrique } from "@/config/taxonomie";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ rubrique: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fr = rubriqueDepuisEn((await params).rubrique);
  if (!fr) return {};
  const r = RUBRIQUES_EN[fr];
  return {
    title: `${r.nom} — WoW Forever`,
    description: r.description,
    alternates: { canonical: `/en/topics/${r.slug}/`, languages: { fr: `/rubriques/${fr}/`, en: `/en/topics/${r.slug}/`, "x-default": `/rubriques/${fr}/` } },
  };
}

const PAR_PAGE = 20;

export default async function TopicEn({ params, searchParams }: Props) {
  const fr = rubriqueDepuisEn((await params).rubrique);
  if (!fr) notFound();
  const r = RUBRIQUES_EN[fr];
  const page = pageDemandee((await searchParams).page);
  const [articles, total] = await Promise.all([
    listerPubliesEn({ rubrique: fr, limite: PAR_PAGE, decalage: (page - 1) * PAR_PAGE }),
    compterPubliesEn(fr),
  ]);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ecranArticle({ pilier: null, rubrique: fr as SlugRubrique }))}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "News", href: "/en/news/" }, { nom: r.nom }]} />
          <p className="surtitre">Topic</p>
          <h1>{r.nom}</h1>
          <p className="chapo">{r.description}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <RepertoireEn actif={fr} articles={articles} total={total} page={page} base={`/en/topics/${r.slug}/`} />
      </div>
    </>
  );
}
