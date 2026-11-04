import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { fondBandeau } from "@/lib/ecrans";
import { chainesDeClasse } from "@/lib/quetes";

export const metadata: Metadata = {
  title: "Quêtes de classe de WoW Forever",
  description: "Les quêtes de classe de WoW Forever, classe par classe : chaînes, donneurs et positions, objectifs et récompenses.",
  alternates: { canonical: "/guides/quetes-de-classe/", languages: languesDe("/guides/quetes-de-classe/") },
};

export default function QuetesDeClasseIndex() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("salle-des-thanes")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides" }, { nom: "Quêtes de classe" }]} />
          <p className="surtitre">Guides · Quêtes</p>
          <h1>Les quêtes de classe</h1>
          <p className="chapo">
            Familier du chasseur, formes du druide, totems du chaman, monture du démoniste : chaque classe a ses quêtes. Choisissez la vôtre.
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <ul className="g3" style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
          {CLASSES.map((c) => {
            const chaines = chainesDeClasse(c.slug);
            const quetes = chaines.reduce((s, x) => s + x.quetes.length, 0);
            return (
              <li key={c.slug}>
                <Link href={`/guides/quetes-de-classe/${c.slug}/`} className="encadre cadre lien-icone" style={{ gap: 14, textDecoration: "none", color: "var(--texte)" }} data-cta="quetes-classe">
                  <IconeClasse slug={c.slug} couleur={c.couleur} taille={56} />
                  <span>
                    <strong style={{ fontSize: 18, color: "var(--texte-titre)" }}>{c.nom}</strong>
                    <br />
                    <span className="doux" style={{ fontSize: 14 }}>{quetes} quêtes, {chaines.length} chaînes</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p>
          Pour la route d&apos;une zone à l&apos;autre, du niveau 1 au niveau 60, voir le <Link href="/guides/parcours/">parcours de montée en niveau</Link>.
        </p>
      </div>
    </>
  );
}
