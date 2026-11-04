import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { ChoixGuideParRaceEn } from "@/components/ChoixGuideEn";
import { fondBandeau } from "@/lib/ecrans";
import { carte } from "@/lib/cartes";
import { LienLieu } from "@/components/Cartes";
import { pageLieuEn } from "@/lib/anglais";
import { nomLieu, parcours, versionQuetes, type EtapeParcours } from "@/lib/quetes";

export const metadata: Metadata = {
  title: "WoW Forever leveling guide 1-60: Alliance and Horde routes",
  description: "Leveling in WoW Forever from 1 to 60: a quest-by-quest guide for each race and class, and the Alliance and Horde routes zone by zone, with level ranges and main quest givers.",
  alternates: { canonical: "/en/leveling-guide/", languages: { fr: "/guides/parcours/", en: "/en/leveling-guide/", "x-default": "/guides/parcours/" } },
};

function Route({ camp, etapes }: { camp: "alliance" | "horde"; etapes: EtapeParcours[] }) {
  return (
    <ol className="route">
      {etapes.map((e, i) => (
        <li key={e.lieu} className="etape-route">
          <span className="numero-etape" aria-hidden="true">{i + 1}</span>
          <div>
            <h3>{carte(e.lieu) ? <LienLieu slug={e.lieu} nom={nomLieu(e.lieu, "en")} langue="en" /> : nomLieu(e.lieu, "en")}</h3>
            <p className="sort-meta">Levels {e.niveaux[0]} to {e.niveaux[1]} · {e.quetes} quests for the {camp === "alliance" ? "Alliance" : "Horde"}</p>
            <p className="route-donneurs">
              <span className="doux">Main quest givers: </span>
              {e.donneurs.slice(0, 4).map((d, k) => (
                <span key={d.id}>
                  {k ? ", " : ""}
                  <strong>{d.n}</strong> <span className="doux">({d.quetes} quests, <Link href={pageLieuEn(e.lieu)}>{d.x.toLocaleString("en-GB")} · {d.y.toLocaleString("en-GB")}</Link>)</span>
                </span>
              ))}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function GuideIndexEn() {
  const alliance = parcours("alliance", "en");
  const horde = parcours("horde", "en");
  const source = versionQuetes("en");
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Leveling guide 1-60" }]} />
          <p className="surtitre">Guides · Leveling</p>
          <h1>The leveling guide, 1 to 60</h1>
          <p className="chapo">
            Where to go, and at what level, to chain quests without downtime. Pick your race and class for the step-by-step guide, or read the
            Alliance and Horde routes at a glance.
          </p>
          <div className="actions-bandeau">
            <a href="#alliance" className="btn btn-or" data-cta="parcours-alliance-en">Alliance route</a>
            <a href="#horde" className="btn btn-contour" data-cta="parcours-horde-en">Horde route</a>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <section aria-labelledby="t-choix" style={{ marginBottom: 36 }}>
          <h2 id="t-choix" className="section-titre" style={{ fontSize: 26 }}>Your step-by-step guide</h2>
          <p className="doux" style={{ marginTop: 0 }}>
            Pick your race and class: every quest in order, numbered NPCs on each zone map, the route drawn, and your progress to tick
            (saved with a <Link href="/en/account/">free account</Link>).
          </p>
          <ChoixGuideParRaceEn />
        </section>

        <h2 className="section-titre" style={{ fontSize: 26 }}>The route at a glance</h2>
        <div className="encadre-chaud" style={{ marginBottom: 28 }}>
          <p style={{ margin: "0 0 8px" }}>
            <strong>How to read the route.</strong> Zones are sorted by the level of their quests. The range covers most quests of the zone; the
            quest givers listed offer the most. When two zones overlap, stay in the first until its quests become easy, then move on.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Check in game.</strong> The route relies on original Azeroth quests still found in Forever&apos;s files. New zones (Zephras Isle,
            Mount Hyjal…) and new dungeons are not included yet.
          </p>
        </div>

        <div className="routes">
          <section id="alliance" aria-labelledby="t-alliance">
            <h2 id="t-alliance" className="section-titre" style={{ fontSize: 26 }}>Alliance <span className="doux">({alliance.length} zones)</span></h2>
            <Route camp="alliance" etapes={alliance} />
          </section>
          <section id="horde" aria-labelledby="t-horde">
            <h2 id="t-horde" className="section-titre" style={{ fontSize: 26 }}>Horde <span className="doux">({horde.length} zones)</span></h2>
            <Route camp="horde" etapes={horde} />
          </section>
        </div>

        <p className="doux note-donnees">
          Quests, NPCs and positions: free community databases of original Azeroth ({source?.source ?? "CMaNGOS, AzerothCore"}), cross-checked
          with Forever&apos;s files (version {source?.jeu ?? "?"}). Route built by the Tavern. Names: © Blizzard Entertainment.
        </p>
      </div>
    </>
  );
}
