import Link from "next/link";
import { RANGS, type Emplacement, type OuTrouver as Donnees } from "@/modules/veille";
import { carte, pageLieu } from "@/lib/cartes";
import { Vignette } from "./Visuels";
import { CarteSources, type PointCarte } from "./CarteSources";
import type { SlugEcran } from "@/config/ecrans";

const pct = (p: number) => `${p >= 10 ? Math.round(p) : p.toLocaleString("fr-FR", { maximumFractionDigits: p < 1 ? 2 : 1 })} %`;
const niveaux = ([a, b]: [number, number]) => (a === b ? `${a}` : `${a}-${b}`);

function Lieu({ e }: { e: Emplacement }) {
  const z = e.zones[0];
  if (z && carte(z.lieu)) return <Link href={pageLieu(z.lieu)}>{carte(z.lieu)!.nom}</Link>;
  if (e.donjon) return <span className="lien-icone">{e.donjon.ecran ? <Vignette ecran={e.donjon.ecran as SlugEcran} /> : null}{e.donjon.nom}</span>;
  return <span className="doux">—</span>;
}

/** Points à placer sur les cartes, une entrée par source et par zone. */
function points(nom: string, detail: string, cle: string, e: Emplacement): PointCarte[] {
  return e.zones.filter((z) => carte(z.lieu)).slice(0, 2).map((z) => ({
    cle: `${cle}-${z.lieu}`, nom, detail, points: z.points, zone: { slug: z.lieu, nom: carte(z.lieu)!.nom, lien: pageLieu(z.lieu) },
  }));
}

export function OuTrouver({ o }: { o: Donnees | null }) {
  if (!o || (!o.monstres.length && !o.decor.length && !o.marchands.length && !o.quetes.length && !o.aleatoire)) {
    return (
      <section aria-labelledby="t-ou" className="ou-trouver">
        <h2 id="t-ou" className="section-titre" style={{ fontSize: 22 }}>Où le trouver</h2>
        <p className="doux">Aucune source connue : objet fabriqué, nouveauté de Forever ou objet de boutique. [Source à relever en jeu.]</p>
      </section>
    );
  }
  const cartePoints: PointCarte[] = [
    ...o.monstres.flatMap((m) => points(m.nom, `${pct(m.chance)} · niveau ${niveaux(m.niveaux)}`, `m${m.id}`, m)),
    ...o.decor.flatMap((g) => points(g.nom, pct(g.chance), `o${g.id}`, g)),
    ...o.marchands.flatMap((v) => points(v.nom, "marchand", `v${v.id}`, v)),
    ...o.quetes.flatMap((q) => q.donneurs.flatMap((p) => points(p.nom, `quête « ${q.titre} »`, `q${q.id}-${p.id}`, p))),
  ];
  return (
    <section aria-labelledby="t-ou" className="ou-trouver">
      <h2 id="t-ou" className="section-titre" style={{ fontSize: 22 }}>Où le trouver</h2>
      <div className="colonnes-ou">
        <div>
          {o.monstres.length ? (
            <>
              <h3>Sur les monstres</h3>
              <div className="tableau-boite">
                <table className="table-objets">
                  <thead><tr><th scope="col">Monstre</th><th scope="col" className="num">Niveau</th><th scope="col" className="num">Taux</th><th scope="col">Lieu</th></tr></thead>
                  <tbody>
                    {o.monstres.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 600 }}>{m.nom}{RANGS[m.rang] ? <span className="etiquette" style={{ marginLeft: 8 }}>{RANGS[m.rang]}</span> : null}{m.quete ? <span className="doux" style={{ fontSize: 13 }}> (pendant la quête)</span> : null}</td>
                        <td className="num">{niveaux(m.niveaux)}</td>
                        <td className="num">{pct(m.chance)}</td>
                        <td><Lieu e={m} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {o.monstresTotal > o.monstres.length ? <p className="doux" style={{ fontSize: 14 }}>Et {o.monstresTotal - o.monstres.length} autres monstres, avec un taux plus faible.</p> : null}
            </>
          ) : null}
          {o.aleatoire ? (
            <p className="encadre" style={{ padding: "12px 16px" }}>
              <strong>Butin aléatoire :</strong> peut tomber sur {o.aleatoire.monstres.toLocaleString("fr-FR")} monstres de niveau {o.aleatoire.min} à {o.aleatoire.max}, avec un taux très faible.
            </p>
          ) : null}
          {o.decor.length ? (
            <>
              <h3>Dans le décor (coffres, filons, plantes)</h3>
              <ul className="liste-sources">{o.decor.map((g) => <li key={g.id}><strong>{g.nom}</strong> · {pct(g.chance)} · <Lieu e={g} /></li>)}</ul>
            </>
          ) : null}
          {o.marchands.length ? (
            <>
              <h3>Vendu par</h3>
              <ul className="liste-sources">{o.marchands.map((v) => <li key={v.id}><strong>{v.nom}</strong> · <Lieu e={v} /></li>)}</ul>
            </>
          ) : null}
          {o.quetes.length ? (
            <>
              <h3>Récompense de quête</h3>
              <ul className="liste-sources">
                {o.quetes.map((q) => (
                  <li key={q.id}>
                    <strong>« {q.titre} »</strong> (niveau {q.niveau})
                    {q.donneurs[0] ? <> · donnée par {q.donneurs[0].nom}, <Lieu e={q.donneurs[0]} /></> : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        {cartePoints.length ? <CarteSources sources={cartePoints} /> : null}
      </div>
      <p className="doux" style={{ fontSize: 13, marginTop: 16 }}>
        Sources et taux de l&apos;Azeroth d&apos;origine, d&apos;après les bases communautaires libres{" "}
        <a href="https://github.com/cmangos/classic-db" rel="noopener noreferrer">CMaNGOS</a> (noms français :{" "}
        <a href="https://github.com/azerothcore/azerothcore-wotlk" rel="noopener noreferrer">AzerothCore</a>). Forever peut les modifier : taux indicatifs, à confirmer en jeu.
      </p>
    </section>
  );
}
