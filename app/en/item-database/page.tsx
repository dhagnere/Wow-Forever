import type { Metadata } from "next";
import Link from "next/link";
import { categoriesObjets, etatBase, nomCategorie, qualites } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { fondBandeau } from "@/lib/ecrans";
import { AvertissementEn } from "./Avertissement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WoW Forever item database",
  description: "Weapons, armour, consumables, recipes: every item in WoW Forever, with its level, quality, stats, sell price and where to find it.",
  alternates: { canonical: "/en/item-database/", languages: { fr: "/base-de-donnees/", en: "/en/item-database/", "x-default": "/base-de-donnees/" } },
};

export default async function BaseEn() {
  const [etat, categories] = await Promise.all([etatBase(), categoriesObjets("en")]);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("excavations-les-paluns")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Item database" }]} />
          <p className="surtitre">Game items</p>
          <h1>WoW Forever item database</h1>
          <p className="chapo">
            {etat
              ? `${etat.nombre.toLocaleString("en-GB")} items, with their English names from version ${etat.version} of the game.`
              : "The item database is being prepared. Please come back in a few hours."}
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <form action="/en/item-database/items/" method="get" className="recherche" role="search">
          <label htmlFor="q-objets" className="sr-only">Search for an item</label>
          <input id="q-objets" name="q" type="search" placeholder="Thunderfury, linen bag, potion…" />
          <button type="submit" className="btn btn-or">Search</button>
        </form>

        <p className="filtres-qualite" aria-label="By quality">
          {qualites("en").slice(2, 6).map(([code, q]) => (
            <Link key={code} href={`/en/item-database/items/?qualite=${code}`} style={{ color: q.couleur }}>{q.nom}</Link>
          ))}
        </p>

        {categories.length ? (
          <div className="categories-objets">
            {categories.map((c) => (
              <section key={c.classe} className="categorie-objets" aria-labelledby={`cat-${c.classe}`}>
                <h2 id={`cat-${c.classe}`}>
                  <Link href={`/en/item-database/items/?classe=${c.classe}`}>{nomCategorie(c.nom)}</Link>
                  <span>{c.total.toLocaleString("en-GB")}</span>
                </h2>
                {c.sous.length > 1 ? (
                  <ul>
                    {c.sous.map((s) => (
                      <li key={s.sousClasse}>
                        <Link href={`/en/item-database/items/?classe=${c.classe}&sous=${s.sousClasse}`}>{s.nom}</Link>
                        <span>{s.total.toLocaleString("en-GB")}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        ) : null}

        <AvertissementEn etat={etat} />
      </div>
    </>
  );
}
