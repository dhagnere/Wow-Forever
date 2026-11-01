import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CLASSES } from "@/content/classes";
import { listerPublies } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { SelecteurClasses } from "@/components/SelecteurClasses";
import { CarteArticle } from "@/components/Articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Les classes de WoW Forever",
  description: "Les neuf classes de World of Warcraft: Forever : rôles, armure, races possibles et conseils pour bien débuter avec chacune.",
  alternates: { canonical: "/classes/" },
};

export default async function Classes() {
  const articles = await listerPublies({ rubrique: "classes", limite: 3 });
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Classes" }]} />
          <p className="surtitre">Tank, soigneur ou dégâts</p>
          <h1>Choisis ta <span className="accent">voie</span></h1>
          <p className="chapo">Neuf classes, neuf façons d&apos;aborder Azeroth. Rôles, armure, races possibles et premiers conseils, fiche par fiche.</p>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 56 }}>
        <section aria-labelledby="t-classes">
          <h2 id="t-classes" className="sr-only">Les neuf classes</h2>
          <div className="cartes-classes">
            {CLASSES.map((c) => (
              <Link key={c.slug} href={`/classes/${c.slug}/`} className="carte-classe" style={{ "--couleur": `${c.couleur}99` } as CSSProperties}>
                <IconeClasse slug={c.slug} couleur={c.couleur} taille={48} />
                <span>
                  <strong>{c.nom}</strong>
                  <span>{c.resume}</span>
                </span>
              </Link>
            ))}
          </div>
          <SelecteurClasses classes={CLASSES.map(({ slug, nom, couleur, roles, armure, presentation }) => ({ slug, nom, couleur, roles, armure, presentation }))} />
          <p className="doux" style={{ marginTop: 16, fontSize: 14 }}>
            Rôles hérités de l&apos;Azeroth d&apos;origine ; les nouveautés de Forever sont ajoutées dès leur confirmation.
            Icônes : <a href="https://game-icons.net" rel="noopener noreferrer">game-icons.net</a>, licence CC BY 3.0.
          </p>
        </section>

        <section aria-labelledby="t-hesiter" className="encadre-chaud cadre" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 420px" }}>
            <h2 id="t-hesiter" className="titre" style={{ margin: "0 0 6px", fontSize: 22, color: "var(--or-clair)" }}>Encore indécis ?</h2>
            <p style={{ margin: 0, color: "var(--texte-chaud)" }}>Commencez par la zone de départ de votre race préférée : la classe suivra.</p>
          </div>
          <div className="boutons" style={{ justifyContent: "flex-start" }}>
            <Link href="/guides/zones-de-depart/" className="btn btn-or">Zones de départ</Link>
            <Link href="/guides/bien-demarrer/" className="btn btn-contour">Bien démarrer</Link>
          </div>
        </section>

        {articles.length ? (
          <section aria-labelledby="t-derniers">
            <p className="surtitre">À lire avant de choisir</p>
            <h2 id="t-derniers" className="section-titre">Derniers articles <span className="accent">Classes</span></h2>
            <div className="g3">{articles.map((a) => <CarteArticle key={a.id} article={a} />)}</div>
          </section>
        ) : null}
      </div>
    </>
  );
}
