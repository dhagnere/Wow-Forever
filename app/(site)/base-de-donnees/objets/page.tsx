import type { Metadata } from "next";
import Link from "next/link";
import { categoriesObjets, chercherObjets, nomCategorie, OBJETS_PAR_PAGE, QUALITES } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { TableauObjets } from "@/components/Objets";
import { listeIndexable, lireFiltres, urlObjets } from "@/lib/objets";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = lireFiltres(await searchParams);
  const categories = await categoriesObjets();
  const cat = categories.find((c) => c.classe === f.classe);
  const sous = cat?.sous.find((s) => s.sousClasse === f.sousClasse);
  const nom = sous?.nom ?? (cat ? nomCategorie(cat.nom) : "Tous les objets");
  return {
    title: f.q ? `Objets : « ${f.q} »` : `${nom} — objets de WoW Forever`,
    description: `${nom} de WoW Forever : liste complète en français, avec niveau, qualité et fiche détaillée.`,
    alternates: { canonical: urlObjets({ classe: f.classe, sousClasse: f.sousClasse }) },
    robots: listeIndexable(f) ? undefined : { index: false, follow: true },
  };
}

export default async function ListeObjets({ searchParams }: Props) {
  const f = lireFiltres(await searchParams);
  const [{ objets, total }, categories] = await Promise.all([chercherObjets(f), categoriesObjets()]);
  const cat = categories.find((c) => c.classe === f.classe);
  const sous = cat?.sous.find((s) => s.sousClasse === f.sousClasse);
  const titre = sous?.nom ?? (cat ? nomCategorie(cat.nom) : "Tous les objets");
  const page = f.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / OBJETS_PAR_PAGE));
  const totalBase = categories.reduce((n, c) => n + c.total, 0);

  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[
            { nom: "Base de données", href: "/base-de-donnees/" },
            ...(cat && sous ? [{ nom: nomCategorie(cat.nom), href: urlObjets({ classe: cat.classe }) }] : []),
            { nom: titre },
          ]} />
          <p className="surtitre">Base de données</p>
          <h1>{f.q ? <>Objets : <span className="accent">« {f.q} »</span></> : titre}</h1>
          <p className="chapo">{total.toLocaleString("fr-FR")} objet{total > 1 ? "s" : ""}{f.q || f.qualite !== undefined || f.niveauMin !== undefined || f.niveauMax !== undefined ? " correspondant à votre recherche" : ""}.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="repertoire repertoire-objets">
          <nav className="repertoire-categories" aria-label="Catégories d'objets">
            <p className="surtitre">Catégories</p>
            <Link href={urlObjets({ ...f, classe: undefined, sousClasse: undefined, page: 1 })} aria-current={f.classe === undefined ? "page" : undefined}>
              Tout <span>{totalBase.toLocaleString("fr-FR")}</span>
            </Link>
            {categories.map((c) => (
              <div key={c.classe}>
                <Link href={urlObjets({ ...f, classe: c.classe, sousClasse: undefined, page: 1 })} aria-current={f.classe === c.classe && f.sousClasse === undefined ? "page" : undefined}>
                  {nomCategorie(c.nom)} <span>{c.total.toLocaleString("fr-FR")}</span>
                </Link>
                {f.classe === c.classe && c.sous.length > 1 ? (
                  <div className="sous-categories">
                    {c.sous.map((s) => (
                      <Link key={s.sousClasse} href={urlObjets({ ...f, sousClasse: s.sousClasse, page: 1 })} aria-current={f.sousClasse === s.sousClasse ? "page" : undefined}>
                        {s.nom} <span>{s.total.toLocaleString("fr-FR")}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <div>
            <form action="/base-de-donnees/objets/" method="get" className="filtres-objets" role="search">
              {f.classe !== undefined ? <input type="hidden" name="classe" value={f.classe} /> : null}
              {f.classe !== undefined && f.sousClasse !== undefined ? <input type="hidden" name="sous" value={f.sousClasse} /> : null}
              <label className="filtre-texte">
                <span className="sr-only">Nom de l&apos;objet</span>
                <input name="q" type="search" placeholder="Nom de l'objet" defaultValue={f.q} />
              </label>
              <label>
                <span>Qualité</span>
                <select name="qualite" defaultValue={f.qualite ?? ""}>
                  <option value="">Toutes</option>
                  {Object.entries(QUALITES).map(([code, q]) => <option key={code} value={code}>{q.nom}</option>)}
                </select>
              </label>
              <label>
                <span>Niveau requis, de</span>
                <input name="min" type="number" min={0} max={100} inputMode="numeric" defaultValue={f.niveauMin} />
              </label>
              <label>
                <span>à</span>
                <input name="max" type="number" min={0} max={100} inputMode="numeric" defaultValue={f.niveauMax} />
              </label>
              <button type="submit" className="btn btn-or">Filtrer</button>
            </form>

            <TableauObjets objets={objets} vide="Aucun objet ne correspond à cette recherche." />

            {pages > 1 ? (
              <nav className="pagination" aria-label="Pagination">
                {page > 1 ? <Link href={urlObjets(f, { page: page - 1 })}>← Précédents</Link> : <span />}
                <span className="doux">Page {page} sur {pages}</span>
                {page < pages ? <Link href={urlObjets(f, { page: page + 1 })}>Suivants →</Link> : <span />}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
