import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DONJONS, NOTE_DONJONS } from "@/content/monde";
import { DONJONS_ORIGINE } from "@/content/reference";
import { estPilier } from "@/config/taxonomie";
import { objetsParIds, type ObjetResume } from "@/modules/veille";
import { languesDe } from "@/lib/anglais";
import { donjonOrigine, donneesDonjon, objetsDuDonjon, quetesDonjonsVerifiees, sourceDonjons } from "@/lib/donjons";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";
import { FicheDonjon } from "@/components/FicheDonjon";
import { ECRAN_DONJON, ecranParNom, fondBandeau } from "@/lib/ecrans";
import { IllustrationEcran } from "@/components/Visuels";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const d = DONJONS.find((x) => x.slug === slug);
  if (d) return { title: `${d.nom} — donjon de WoW Forever`, description: `${d.nom}, nouveau donjon de WoW Forever accessible dès le niveau ${d.niveau} : accès, boss et butin.`, alternates: { canonical: `/donjons/${d.slug}/`, languages: languesDe(`/donjons/${d.slug}/`) } };
  const o = donjonOrigine(slug);
  if (!o) return {};
  const donnees = donneesDonjon(slug);
  return {
    title: `${o.nom} — boss, butin et entrée · WoW Forever`,
    description: `${o.nom} (niveaux ${o.min}-${o.max}, ${o.zone}) : ${donnees ? `${donnees.boss.length} boss dans l'ordre, ` : ""}leur butin dans Forever, l'entrée sur la carte et les quêtes du donjon.`,
    alternates: { canonical: `/donjons/${o.slug}/`, languages: languesDe(`/donjons/${o.slug}/`) },
  };
}

/** Butin d'un donjon lu dans la base d'objets ; une base injoignable donne un butin vide, sans casser la page. */
async function objetsDe(ids: number[]): Promise<{ objets: Map<number, ObjetResume>; lu: boolean }> {
  try {
    const liste = await objetsParIds(ids);
    return { objets: new Map(liste.map((o) => [o.id, o])), lu: true };
  } catch (e) {
    console.error("[donjons] butin :", e instanceof Error ? e.message : e);
    return { objets: new Map(), lu: false };
  }
}

export default async function PageDonjon({ params }: Props) {
  const slug = (await params).slug;
  const nouveau = DONJONS.find((x) => x.slug === slug);
  if (nouveau) return <NouveauDonjon d={nouveau} />;
  const o = donjonOrigine(slug);
  if (!o) notFound();
  const donnees = donneesDonjon(slug);
  const { objets, lu } = donnees ? await objetsDe(objetsDuDonjon(donnees)) : { objets: new Map(), lu: true };
  const ecran = ecranParNom(o.nom);
  const pilier = `donjons/${o.slug}`;
  const memeTranche = DONJONS_ORIGINE.filter((x) => x.slug !== o.slug && Math.abs(x.min - o.min) <= 8);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ecran ?? "profondeurs-de-rochenoire")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Donjons et raids", href: "/donjons/" }, { nom: o.nom }]} />
          <p className="surtitre">Donjon de l&apos;Azeroth d&apos;origine · niveaux {o.min}-{o.max}</p>
          <h1>{o.nom}</h1>
          <p className="chapo">
            {o.zone}, {o.continent}.{donnees ? ` ${donnees.boss.length} boss à vaincre, leur butin dans Forever, l'entrée sur la carte et les quêtes à prendre avant d'y aller.` : ""}
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            {ecran ? <IllustrationEcran ecran={ecran} /> : null}
            <FicheDonjon donjon={o} d={donnees} objets={objets} butinLu={lu} quetesVerifiees={quetesDonjonsVerifiees()} source={sourceDonjons()} />
            {estPilier(pilier) ? <ArticlesLies pilier={pilier} /> : null}
          </div>
          <aside className="colonne-laterale">
            {donnees && donnees.boss.length ? (
              <div className="encadre cadre">
                <h2>Sommaire des boss</h2>
                <ol style={{ margin: 0, paddingLeft: 22, fontSize: 15 }}>
                  {donnees.boss.map((b) => <li key={b.id}><a href={`#boss-${b.id}`}>{b.n}</a></li>)}
                </ol>
              </div>
            ) : null}
            <div className="encadre cadre">
              <h2>À votre niveau aussi</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {memeTranche.map((x) => <li key={x.slug}><Link href={`/donjons/${x.slug}/`}>{x.nom}</Link> <span className="doux">— {x.min}-{x.max}</span></li>)}
              </ul>
              <p style={{ margin: "10px 0 0", fontSize: 15 }}><Link href="/donjons/">Tous les donjons et raids</Link></p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function NouveauDonjon({ d }: { d: (typeof DONJONS)[number] }) {
  const pilier = `donjons/${d.slug}`;
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_DONJON[d.slug] ?? "salle-des-thanes")}>
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
            {ECRAN_DONJON[d.slug] ? <IllustrationEcran ecran={ECRAN_DONJON[d.slug]} /> : null}
            <section aria-labelledby="t-acces">
              <h2 id="t-acces" className="section-titre" style={{ fontSize: 26 }}>Accès et préparation</h2>
              <p className="doux">[Emplacement de l&apos;entrée, quêtes à prendre avant d&apos;entrer, composition de groupe conseillée : à relever en jeu.]</p>
            </section>
            <section aria-labelledby="t-boss">
              <h2 id="t-boss" className="section-titre" style={{ fontSize: 26 }}>Boss et butin</h2>
              <p className="doux">[Liste des boss, techniques à connaître et objets notables. Ce donjon est propre à Forever : les bases libres de l&apos;Azeroth d&apos;origine ne le connaissent pas, la fiche se remplira au fil des relevés en jeu.]</p>
            </section>
            <p className="doux" style={{ fontSize: 15 }}>{NOTE_DONJONS}</p>
            {estPilier(pilier) ? <ArticlesLies pilier={pilier} /> : null}
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Autres nouveaux donjons</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {DONJONS.filter((x) => x.slug !== d.slug).map((x) => <li key={x.slug}><Link href={`/donjons/${x.slug}/`}>{x.nom}</Link> <span className="doux">— niv. {x.niveau}</span></li>)}
              </ul>
              <p style={{ margin: "10px 0 0", fontSize: 15 }}><Link href="/donjons/">Tous les donjons et raids</Link></p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
