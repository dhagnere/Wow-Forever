import type { Metadata } from "next";
import { compterPublies, listerPublies } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { Repertoire } from "@/components/Repertoire";
import { pageDemandee } from "@/components/ListePaginee";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités de WoW Forever",
  description: "Toute l'actualité de World of Warcraft: Forever en français : annonces, patchs, donjons, classes et nouvelles zones.",
  alternates: { canonical: "/actualites/" },
};

const PAR_PAGE = 20;

export default async function Actualites({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageDemandee((await searchParams).page);
  const [articles, total] = await Promise.all([listerPublies({ limite: PAR_PAGE, decalage: (page - 1) * PAR_PAGE }), compterPublies()]);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Actualités" }]} />
          <p className="surtitre">Chaque matin, relu par Silfax</p>
          <h1>Le fil <span className="accent">d&apos;Azeroth</span></h1>
          <p className="chapo">Les nouvelles de WoW Forever repérées dans le monde entier, traduites, triées par rubrique et commentées.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <Repertoire articles={articles} total={total} page={page} base="/actualites/" />
      </div>
    </>
  );
}
