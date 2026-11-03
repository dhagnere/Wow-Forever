import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { LienLieu } from "@/components/Cartes";
import { fondBandeau } from "@/lib/ecrans";
import { carte, pageLieu } from "@/lib/cartes";
import { nomLieu, parcours, versionQuetes, type EtapeParcours } from "@/lib/quetes";

export const metadata: Metadata = {
  title: "Parcours de montée en niveau de 1 à 60 sur WoW Forever",
  description: "La route de l'Alliance et celle de la Horde, zone par zone, du niveau 1 au niveau 60 : fourchette de niveaux, nombre de quêtes et principaux donneurs.",
  alternates: { canonical: "/guides/parcours/" },
};

function Route({ camp, etapes }: { camp: string; etapes: EtapeParcours[] }) {
  return (
    <ol className="route">
      {etapes.map((e, i) => (
        <li key={e.lieu} className="etape-route">
          <span className="numero-etape" aria-hidden="true">{i + 1}</span>
          <div>
            <h3>
              {carte(e.lieu) ? <LienLieu slug={e.lieu} nom={nomLieu(e.lieu)} /> : nomLieu(e.lieu)}
            </h3>
            <p className="sort-meta">
              Niveaux {e.niveaux[0]} à {e.niveaux[1]} · {e.quetes} quêtes {camp === "alliance" ? "pour l'Alliance" : "pour la Horde"}
            </p>
            <p className="route-donneurs">
              <span className="doux">Principaux donneurs : </span>
              {e.donneurs.slice(0, 4).map((d, k) => (
                <span key={d.id}>
                  {k ? ", " : ""}
                  <strong>{d.n}</strong> <span className="doux">({d.quetes} quêtes, <Link href={pageLieu(e.lieu)}>{d.x.toLocaleString("fr-FR")} · {d.y.toLocaleString("fr-FR")}</Link>)</span>
                </span>
              ))}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Parcours() {
  const alliance = parcours("alliance");
  const horde = parcours("horde");
  const source = versionQuetes();
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides" }, { nom: "Parcours de 1 à 60" }]} />
          <p className="surtitre">Guides · Montée en niveau</p>
          <h1>Le parcours de 1 à 60</h1>
          <p className="chapo">
            Où aller, et à quel niveau, pour enchaîner les quêtes sans temps mort. Une route pour l&apos;Alliance, une pour la Horde, établies
            à partir des quêtes de chaque zone.
          </p>
          <div className="actions-bandeau">
            <a href="#alliance" className="btn btn-or" data-cta="parcours-alliance">Route de l&apos;Alliance</a>
            <a href="#horde" className="btn btn-contour" data-cta="parcours-horde">Route de la Horde</a>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <div className="encadre-chaud" style={{ marginBottom: 28 }}>
          <p style={{ margin: "0 0 8px" }}>
            <strong>Comment lire la route.</strong> Les zones sont rangées par niveau des quêtes qu&apos;on y trouve. La fourchette couvre l&apos;essentiel
            des quêtes de la zone ; les donneurs cités sont ceux qui en proposent le plus. Quand deux zones se chevauchent, faites la première
            jusqu&apos;à ce que ses quêtes deviennent faciles, puis passez à la suivante.
          </p>
          <p style={{ margin: 0 }}>
            <strong>À vérifier en jeu.</strong> La route s&apos;appuie sur les quêtes de l&apos;Azeroth d&apos;origine encore présentes dans Forever. Les
            nouvelles zones (<Link href="/zones/ile-de-zephras/">île de Zéphras</Link>, <Link href="/zones/mont-hyjal/">mont Hyjal</Link>…) et les
            nouveaux donjons n&apos;y figurent pas encore. Les zones de départ de chaque race sont détaillées dans{" "}
            <Link href="/guides/zones-de-depart/">Zones de départ</Link>.
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
          Quêtes, PNJ et positions : bases communautaires libres de l&apos;Azeroth d&apos;origine ({source?.source ?? "CMaNGOS, AzerothCore"}),
          recoupées avec les fichiers de Forever (version {source?.jeu ?? "?"}). Route établie par la Taverne. Noms : © Blizzard Entertainment.
        </p>
        <p>
          Voir aussi : <Link href="/guides/zones-par-niveau/">Zones par niveau</Link> · <Link href="/guides/liste-des-donjons/">Liste des donjons</Link> ·{" "}
          <Link href="/guides/quetes-de-classe/">Quêtes de classe</Link>
        </p>
      </div>
    </>
  );
}
