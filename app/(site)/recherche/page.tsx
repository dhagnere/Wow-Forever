import type { Metadata } from "next";
import { rechercherPublies } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { Repertoire } from "@/components/Repertoire";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Rechercher", robots: { index: false, follow: true } };

export default async function Recherche({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const brut = (await searchParams).q;
  const q = (Array.isArray(brut) ? brut[0] : brut ?? "").slice(0, 120).trim();
  const articles = q ? await rechercherPublies(q, 50) : [];
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Recherche" }]} />
          <p className="surtitre">Dans les articles du site</p>
          <h1>{q ? <>Résultats pour <span className="accent">« {q} »</span></> : "Rechercher"}</h1>
          <p className="chapo">{q ? `${articles.length} article${articles.length > 1 ? "s" : ""} trouvé${articles.length > 1 ? "s" : ""}.` : "Une classe, un donjon, une zone, un mot de l'article : tapez, Silfax cherche."}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <Repertoire articles={articles} total={articles.length} page={1} base="/recherche/" requete={q} />
      </div>
    </>
  );
}
