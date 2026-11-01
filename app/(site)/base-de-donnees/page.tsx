import type { Metadata } from "next";
import Link from "next/link";
import { categoriesObjets, etatBase, nomCategorie, QUALITES } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { AvertissementDonnees } from "./AvertissementDonnees";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Base de données des objets de WoW Forever",
  description: "Armes, armures, consommables, recettes : tous les objets de WoW Forever en français, avec leur niveau, leur qualité et leur prix de vente.",
  alternates: { canonical: "/base-de-donnees/" },
};

export default async function BaseDeDonnees() {
  const [etat, categories] = await Promise.all([etatBase(), categoriesObjets()]);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Base de données" }]} />
          <p className="surtitre">Objets du jeu</p>
          <h1>Base de données de WoW Forever</h1>
          <p className="chapo">
            {etat
              ? `${etat.nombre.toLocaleString("fr-FR")} objets, noms et descriptions en français, tirés de la version ${etat.version} du jeu.`
              : "La base d'objets est en cours de préparation. Revenez dans quelques heures."}
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <form action="/base-de-donnees/objets/" method="get" className="recherche" role="search">
          <label htmlFor="q-objets" className="sr-only">Rechercher un objet</label>
          <input id="q-objets" name="q" type="search" placeholder="Lame-tonnerre, sac en lin, potion…" />
          <button type="submit" className="btn btn-or">Chercher</button>
        </form>

        <p className="filtres-qualite" aria-label="Par qualité">
          {Object.entries(QUALITES).slice(2, 6).map(([code, q]) => (
            <Link key={code} href={`/base-de-donnees/objets/?qualite=${code}`} style={{ color: q.couleur }}>{q.nom}</Link>
          ))}
        </p>

        {categories.length ? (
          <div className="categories-objets">
            {categories.map((c) => (
              <section key={c.classe} className="categorie-objets" aria-labelledby={`cat-${c.classe}`}>
                <h2 id={`cat-${c.classe}`}>
                  <Link href={`/base-de-donnees/objets/?classe=${c.classe}`}>{nomCategorie(c.nom)}</Link>
                  <span>{c.total.toLocaleString("fr-FR")}</span>
                </h2>
                {c.sous.length > 1 ? (
                  <ul>
                    {c.sous.map((s) => (
                      <li key={s.sousClasse}>
                        <Link href={`/base-de-donnees/objets/?classe=${c.classe}&sous=${s.sousClasse}`}>{s.nom}</Link>
                        <span>{s.total.toLocaleString("fr-FR")}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        ) : null}

        <AvertissementDonnees etat={etat} />
      </div>
    </>
  );
}
