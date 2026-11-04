import type { Metadata } from "next";
import Link from "next/link";
import { categoriesObjets, chercherObjets, nomCategorie, OBJETS_PAR_PAGE, qualites } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { TableauObjets } from "@/components/Objets";
import { listeIndexable, lireFiltres, urlObjets, urlObjetsEn } from "@/lib/objets";
import { fondBandeau } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = lireFiltres(await searchParams);
  const categories = await categoriesObjets("en");
  const cat = categories.find((c) => c.classe === f.classe);
  const sous = cat?.sous.find((s) => s.sousClasse === f.sousClasse);
  const nom = sous?.nom ?? (cat ? nomCategorie(cat.nom) : "All items");
  const fr = urlObjets({ classe: f.classe, sousClasse: f.sousClasse });
  const en = urlObjetsEn({ classe: f.classe, sousClasse: f.sousClasse });
  return {
    title: f.q ? `Items: “${f.q}”` : `${nom} — WoW Forever items`,
    description: `${nom} in WoW Forever: full list with level, quality and a detailed page for each item.`,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
    robots: listeIndexable(f) ? undefined : { index: false, follow: true },
  };
}

export default async function ListeEn({ searchParams }: Props) {
  const f = lireFiltres(await searchParams);
  const [{ objets, total }, categories] = await Promise.all([chercherObjets(f, "en"), categoriesObjets("en")]);
  const cat = categories.find((c) => c.classe === f.classe);
  const sous = cat?.sous.find((s) => s.sousClasse === f.sousClasse);
  const titre = sous?.nom ?? (cat ? nomCategorie(cat.nom) : "All items");
  const page = f.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / OBJETS_PAR_PAGE));
  const totalBase = categories.reduce((n, c) => n + c.total, 0);
  const nb = (n: number) => n.toLocaleString("en-GB");

  return (
    <>
      <section className="bandeau-page" style={fondBandeau("excavations-les-paluns")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[
            { nom: "Item database", href: "/en/item-database/" },
            ...(cat && sous ? [{ nom: nomCategorie(cat.nom), href: urlObjetsEn({ classe: cat.classe }) }] : []),
            { nom: titre },
          ]} />
          <p className="surtitre">Item database</p>
          {f.q ? <span hidden data-recherche={f.q} data-lieu="objets" data-resultats={total} /> : null}
          <h1>{f.q ? <>Items: <span className="accent">“{f.q}”</span></> : titre}</h1>
          <p className="chapo">{nb(total)} item{total === 1 ? "" : "s"}{f.q || f.qualite !== undefined || f.niveauMin !== undefined || f.niveauMax !== undefined ? " matching your search" : ""}.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="repertoire repertoire-objets">
          <nav className="repertoire-categories" aria-label="Item categories">
            <p className="surtitre">Categories</p>
            <Link href={urlObjetsEn({ ...f, classe: undefined, sousClasse: undefined, page: 1 })} aria-current={f.classe === undefined ? "page" : undefined}>
              All <span>{nb(totalBase)}</span>
            </Link>
            {categories.map((c) => (
              <div key={c.classe}>
                <Link href={urlObjetsEn({ ...f, classe: c.classe, sousClasse: undefined, page: 1 })} aria-current={f.classe === c.classe && f.sousClasse === undefined ? "page" : undefined}>
                  {nomCategorie(c.nom)} <span>{nb(c.total)}</span>
                </Link>
                {f.classe === c.classe && c.sous.length > 1 ? (
                  <div className="sous-categories">
                    {c.sous.map((s) => (
                      <Link key={s.sousClasse} href={urlObjetsEn({ ...f, sousClasse: s.sousClasse, page: 1 })} aria-current={f.sousClasse === s.sousClasse ? "page" : undefined}>
                        {s.nom} <span>{nb(s.total)}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <div>
            <form action="/en/item-database/items/" method="get" className="filtres-objets" role="search">
              {f.classe !== undefined ? <input type="hidden" name="classe" value={f.classe} /> : null}
              {f.classe !== undefined && f.sousClasse !== undefined ? <input type="hidden" name="sous" value={f.sousClasse} /> : null}
              <label className="filtre-texte">
                <span className="sr-only">Item name</span>
                <input name="q" type="search" placeholder="Item name" defaultValue={f.q} />
              </label>
              <label>
                <span>Quality</span>
                <select name="qualite" defaultValue={f.qualite ?? ""}>
                  <option value="">All</option>
                  {qualites("en").map(([code, q]) => <option key={code} value={code}>{q.nom}</option>)}
                </select>
              </label>
              <label>
                <span>Required level, from</span>
                <input name="min" type="number" min={0} max={100} inputMode="numeric" defaultValue={f.niveauMin} />
              </label>
              <label>
                <span>to</span>
                <input name="max" type="number" min={0} max={100} inputMode="numeric" defaultValue={f.niveauMax} />
              </label>
              <button type="submit" className="btn btn-or">Filter</button>
            </form>

            <TableauObjets langue="en" objets={objets} vide="No item matches this search." />

            {pages > 1 ? (
              <nav className="pagination" aria-label="Pagination">
                {page > 1 ? <Link href={urlObjetsEn(f, { page: page - 1 })}>← Previous</Link> : <span />}
                <span className="doux">Page {page} of {pages}</span>
                {page < pages ? <Link href={urlObjetsEn(f, { page: page + 1 })}>Next →</Link> : <span />}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
