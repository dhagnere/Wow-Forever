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
import { slugRace } from "@/lib/sorts";
import { CLASSES_EN, classeDepuisEn, nomRaceEn, pageZoneEn } from "@/lib/anglais";

type Props = { params: Promise<{ classe: string }> };

/** Titres des tranches (TRANCHES_QUETES), dans le même ordre. */
const TRANCHES_EN = ["First steps (levels 1 to 9)", "Levels 10 to 29", "Levels 30 to 49", "Levels 50 to 57", "Levels 58 to 60: gear and raids"];

export function generateStaticParams() {
  return CLASSES.map((c) => ({ classe: CLASSES_EN[c.slug].slug }));
}

const lire = (slug: string) => trouverClasse(classeDepuisEn(slug) ?? "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = lire((await params).classe);
  if (!c) return {};
  const nom = CLASSES_EN[c.slug].nom;
  const fr = `/guides/quetes-de-classe/${c.slug}/`;
  const en = `/en/guides/class-quests/${CLASSES_EN[c.slug].slug}/`;
  return {
    title: `${nom} class quests in WoW Forever`,
    description: `Every ${nom.toLowerCase()} class quest in WoW Forever, chain by chain: level, quest giver and location on the map, objectives and rewards.`,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
  };
}

export default async function ClassQuests({ params }: Props) {
  const c = lire((await params).classe);
  const chaines = c ? chainesDeClasse(c.slug, "en") : [];
  if (!c || !chaines.length) notFound();
  const nom = CLASSES_EN[c.slug].nom;
  const total = chaines.reduce((s, x) => s + x.quetes.length, 0);
  const races = c.races.map((r) => r.race).filter((r) => r !== "Skyborne").map((r) => nomRaceEn(slugRace(r)));
  const source = versionQuetes("en");

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
          <IconeClasse slug={c.slug} couleur={c.couleur} taille={96} />
          <div style={{ flex: "1 1 420px" }}>
            <Ariane langue="en" etapes={[{ nom: "Guides", href: "/en/guides/class-quests/" }, { nom: "Class quests", href: "/en/guides/class-quests/" }, { nom }]} />
            <h1>{nom} class quests</h1>
            <p className="chapo" style={{ margin: 0 }}>
              {total} quests for the {nom.toLowerCase()} only, in {chaines.length} chains, from the first levels to raid rewards. Each step shows who
              gives it, where to find them and what it rewards.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <div className="encadre-chaud" style={{ marginBottom: 28 }}>
          <p style={{ margin: 0 }}>
            <strong>Check in game.</strong> These chains are those of original Azeroth, limited to quests still present in Forever&apos;s files.
            NPCs, steps or rewards may have changed; quests specific to Forever and to the Skyborne are not included yet. The Skyborne follow their
            own starting quests on <Link href={pageZoneEn("ile-de-zephras")}>Zephras Isle</Link>.
          </p>
        </div>

        <FiltreRace races={races} langue="en">
          {TRANCHES_QUETES.map((t, i) => {
            const liste = chaines.filter((x) => tranche(x) === i);
            if (!liste.length) return null;
            const raid = i === TRANCHES_QUETES.length - 1;
            const contenu = <div className="chaines">{liste.map((x) => <ChaineQuetes key={x.quetes[0]} c={x} langue="en" />)}</div>;
            return (
              <section key={t.titre} data-tranche aria-labelledby={`t-tranche-${i}`} style={{ marginBottom: 36 }}>
                <h2 id={`t-tranche-${i}`} className="section-titre" style={{ fontSize: 24 }}>{TRANCHES_EN[i] ?? t.titre}</h2>
                {raid ? (
                  <details className="rangs">
                    <summary>Show the {liste.length} high-level gear chains</summary>
                    {contenu}
                  </details>
                ) : contenu}
              </section>
            );
          })}
        </FiltreRace>

        <p className="doux note-donnees">
          Quests, NPCs and positions: free community databases of original Azeroth ({source?.source ?? "CMaNGOS, AzerothCore"}), cross-checked
          with Forever&apos;s files (version {source?.jeu ?? "?"}). Objectives summarised by the Tavern. Names: © Blizzard Entertainment.
        </p>
        <p>
          <Link href={`/en/classes/${CLASSES_EN[c.slug].slug}/`}>{nom} spells and talents</Link>
          {" · "}<Link href="/en/leveling-guide/">Leveling guide 1-60</Link>
          {" · "}Other classes:{" "}
          {CLASSES.filter((x) => x.slug !== c.slug).map((x, i) => (
            <span key={x.slug}>{i ? ", " : ""}<Link href={`/en/guides/class-quests/${CLASSES_EN[x.slug].slug}/`}>{CLASSES_EN[x.slug].nom}</Link></span>
          ))}
        </p>
      </div>
    </>
  );
}
