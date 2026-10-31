import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DONJONS, NOTE_DONJONS } from "@/content/monde";
import { estPilier } from "@/config/taxonomie";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const d = DONJONS.find((x) => x.slug === slug);
  if (!d) return {};
  return { title: `${d.nom} — donjon de WoW Forever`, description: `${d.nom}, nouveau donjon de WoW Forever accessible dès le niveau ${d.niveau} : accès, boss et butin.`, alternates: { canonical: `/donjons/${d.slug}/` } };
}

export default async function PageDonjon({ params }: Props) {
  const slug = (await params).slug;
  const d = DONJONS.find((x) => x.slug === slug);
  if (!d) notFound();
  const pilier = `donjons/${d.slug}`;
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Donjons et raids", href: "/donjons/" }, { nom: d.nom }]} />
          <p className="surtitre">Nouveau donjon · dès le niveau {d.niveau}</p>
          <h1>{d.nom}</h1>
          <p className="chapo">{d.resume}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-acces">
              <h2 id="t-acces" className="section-titre" style={{ fontSize: 26 }}>Accès et préparation</h2>
              <p className="doux">[Emplacement de l&apos;entrée, quêtes à prendre avant d&apos;entrer, composition de groupe conseillée : à relever en jeu.]</p>
            </section>
            <section aria-labelledby="t-boss">
              <h2 id="t-boss" className="section-titre" style={{ fontSize: 26 }}>Boss et butin</h2>
              <p className="doux">[Liste des boss, techniques à connaître et objets notables.]</p>
            </section>
            <p className="doux" style={{ fontSize: 15 }}>{NOTE_DONJONS}</p>
            {estPilier(pilier) ? <ArticlesLies pilier={pilier} /> : null}
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Autres donjons</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {DONJONS.filter((x) => x.slug !== d.slug).map((x) => <li key={x.slug}><Link href={`/donjons/${x.slug}/`}>{x.nom}</Link> <span className="doux">— niv. {x.niveau}</span></li>)}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
