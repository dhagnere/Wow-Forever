import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES, trouverClasse } from "@/content/classes";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { ChaineQuetes } from "@/components/Quetes";
import { FiltreRace } from "@/components/FiltreRace";
import { ECRAN_CLASSE, fondBandeau } from "@/lib/ecrans";
import { TRANCHES_QUETES, chainesDeClasse, tranche, versionQuetes } from "@/lib/quetes";

type Props = { params: Promise<{ classe: string }> };

export function generateStaticParams() {
  return CLASSES.map((c) => ({ classe: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = trouverClasse((await params).classe);
  if (!c) return {};
  return {
    title: `Quêtes de classe du ${c.nom} sur WoW Forever`,
    description: `Toutes les quêtes de classe du ${c.nom.toLowerCase()} sur WoW Forever, chaîne par chaîne : niveau, donneur et position sur la carte, objectifs et récompenses.`,
    alternates: { canonical: `/guides/quetes-de-classe/${c.slug}/` },
  };
}

export default async function QuetesDeClasse({ params }: Props) {
  const c = trouverClasse((await params).classe);
  const chaines = c ? chainesDeClasse(c.slug) : [];
  if (!c || !chaines.length) notFound();
  const total = chaines.reduce((s, x) => s + x.quetes.length, 0);
  const races = c.races.map((r) => r.race).filter((r) => r !== "Skyborne");
  const source = versionQuetes();

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
          <IconeClasse slug={c.slug} couleur={c.couleur} taille={96} />
          <div style={{ flex: "1 1 420px" }}>
            <Ariane etapes={[{ nom: "Guides", href: "/guides/quetes-de-classe/" }, { nom: "Quêtes de classe", href: "/guides/quetes-de-classe/" }, { nom: c.nom }]} />
            <h1>Quêtes de classe du {c.nom}</h1>
            <p className="chapo" style={{ margin: 0 }}>
              {total} quêtes réservées au {c.nom.toLowerCase()}, réparties en {chaines.length} chaînes, du premier niveau aux récompenses de raid.
              Chaque étape indique qui la donne, où le trouver et ce qu&apos;elle rapporte.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <div className="encadre-chaud" style={{ marginBottom: 28 }}>
          <p style={{ margin: 0 }}>
            <strong>À vérifier en jeu.</strong> Ces chaînes sont celles de l&apos;Azeroth d&apos;origine, limitées aux quêtes encore présentes dans
            les fichiers de Forever. Les PNJ, les étapes ou les récompenses peuvent avoir changé ; les quêtes propres à Forever et aux Skyborne
            n&apos;y figurent pas encore. Les Skyborne suivent leurs propres quêtes de départ sur l&apos;<Link href="/zones/ile-de-zephras/">île de Zéphras</Link>.
          </p>
        </div>

        <FiltreRace races={races}>
          {TRANCHES_QUETES.map((t, i) => {
            const liste = chaines.filter((x) => tranche(x) === i);
            if (!liste.length) return null;
            const raid = i === TRANCHES_QUETES.length - 1;
            const contenu = <div className="chaines">{liste.map((x) => <ChaineQuetes key={x.quetes[0]} c={x} />)}</div>;
            return (
              <section key={t.titre} data-tranche aria-labelledby={`t-tranche-${i}`} style={{ marginBottom: 36 }}>
                <h2 id={`t-tranche-${i}`} className="section-titre" style={{ fontSize: 24 }}>{t.titre}</h2>
                {raid ? (
                  <details className="rangs">
                    <summary>Voir les {liste.length} chaînes d&apos;équipement de haut niveau</summary>
                    {contenu}
                  </details>
                ) : contenu}
              </section>
            );
          })}
        </FiltreRace>

        <p className="doux note-donnees">
          Quêtes, PNJ et positions : bases communautaires libres de l&apos;Azeroth d&apos;origine ({source?.source ?? "CMaNGOS, AzerothCore"}),
          recoupées avec les fichiers de Forever (version {source?.jeu ?? "?"}). Objectifs résumés par la Taverne. Noms : © Blizzard Entertainment
          (voir les <Link href="/mentions-legales/">mentions légales</Link>).
        </p>
        <p>
          <Link href={`/classes/${c.slug}/`}>Guide du {c.nom.toLowerCase()}</Link>
          {" · "}
          <Link href="/guides/parcours/">Parcours de montée en niveau</Link>
          {" · "}Autres classes :{" "}
          {CLASSES.filter((x) => x.slug !== c.slug).map((x, i) => (
            <span key={x.slug}>{i ? ", " : ""}<Link href={`/guides/quetes-de-classe/${x.slug}/`}>{x.nom}</Link></span>
          ))}
        </p>
      </div>
    </>
  );
}
