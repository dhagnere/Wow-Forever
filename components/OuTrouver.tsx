import Link from "next/link";
import { RANGS, RANGS_EN, type Emplacement, type OuTrouver as Donnees } from "@/modules/veille";
import { carte, pageLieu } from "@/lib/cartes";
import { nomLieuEn, pageLieuEn } from "@/lib/anglais";
import { Vignette } from "./Visuels";
import { CarteSources, type PointCarte } from "./CarteSources";
import type { SlugEcran } from "@/config/ecrans";

type Langue = "fr" | "en";
const pctFr = (p: number) => `${p >= 10 ? Math.round(p) : p.toLocaleString("fr-FR", { maximumFractionDigits: p < 1 ? 2 : 1 })} %`;
const pctEn = (p: number) => `${p >= 10 ? Math.round(p) : p.toLocaleString("en-GB", { maximumFractionDigits: p < 1 ? 2 : 1 })}%`;
const niveaux = ([a, b]: [number, number]) => (a === b ? `${a}` : `${a}-${b}`);
const nomZone = (slug: string, l: Langue) => (l === "en" ? nomLieuEn(slug) : undefined) ?? carte(slug)!.nom;
const lienZone = (slug: string, l: Langue) => (l === "en" ? pageLieuEn(slug) : pageLieu(slug));

const TXT = {
  fr: {
    titre: "Où le trouver", fabrique: "Cet objet ne tombe pas sur les monstres et ne se vend pas : il se fabrique (voir « Fabriqué par » ci-dessous).",
    aucune: "Aucune source connue : nouveauté de Forever, objet de boutique ou source encore inconnue. [Source à relever en jeu.]",
    niveau: "niveau", marchand: "marchand", quete: (t: string) => `quête « ${t} »`, monstres: "Sur les monstres", monstre: "Monstre", niv: "Niveau",
    taux: "Taux", lieu: "Lieu", pendant: " (pendant la quête)", autres: (n: number) => `Et ${n} autres monstres, avec un taux plus faible.`,
    aleatoire: (n: string, a: number, b: number) => `peut tomber sur ${n} monstres de niveau ${a} à ${b}, avec un taux très faible.`, butin: "Butin aléatoire :",
    decor: "Dans le décor (coffres, filons, plantes)", vendu: "Vendu par", recompense: "Récompense de quête", guillemets: ["« ", " »"], donnee: "donnée par",
    nombre: "fr-FR",
  },
  en: {
    titre: "Where to find it", fabrique: "This item does not drop from monsters and is not sold: it is crafted (see “Created by” below).",
    aucune: "No known source: new in Forever, shop item or source still unknown. [Source to be checked in game.]",
    niveau: "level", marchand: "vendor", quete: (t: string) => `quest “${t}”`, monstres: "Dropped by", monstre: "Monster", niv: "Level",
    taux: "Chance", lieu: "Location", pendant: " (during the quest)", autres: (n: number) => `And ${n} other monsters, with a lower chance.`,
    aleatoire: (n: string, a: number, b: number) => `can drop from ${n} monsters of level ${a} to ${b}, with a very low chance.`, butin: "World drop:",
    decor: "In the world (chests, veins, herbs)", vendu: "Sold by", recompense: "Quest reward", guillemets: ["“", "”"], donnee: "given by",
    nombre: "en-GB",
  },
} as const;

function Lieu({ e, langue }: { e: Emplacement; langue: Langue }) {
  const z = e.zones[0];
  if (z && carte(z.lieu)) return <Link href={lienZone(z.lieu, langue)}>{nomZone(z.lieu, langue)}</Link>;
  if (e.donjon) return <span className="lien-icone">{e.donjon.ecran ? <Vignette ecran={e.donjon.ecran as SlugEcran} /> : null}{e.donjon.nom}</span>;
  return <span className="doux">—</span>;
}

/** Points à placer sur les cartes, une entrée par source et par zone. */
function points(nom: string, detail: string, cle: string, e: Emplacement, langue: Langue): PointCarte[] {
  return e.zones.filter((z) => carte(z.lieu)).slice(0, 2).map((z) => ({
    cle: `${cle}-${z.lieu}`, nom, detail, points: z.points, zone: { slug: z.lieu, nom: nomZone(z.lieu, langue), lien: lienZone(z.lieu, langue) },
  }));
}

export function OuTrouver({ o, fabrique = false, langue = "fr" }: { o: Donnees | null; fabrique?: boolean; langue?: Langue }) {
  const t = TXT[langue];
  const pct = langue === "en" ? pctEn : pctFr;
  const rangs = langue === "en" ? RANGS_EN : RANGS;
  if (!o || (!o.monstres.length && !o.decor.length && !o.marchands.length && !o.quetes.length && !o.aleatoire)) {
    return (
      <section aria-labelledby="t-ou" className="ou-trouver">
        <h2 id="t-ou" className="section-titre" style={{ fontSize: 22 }}>{t.titre}</h2>
        <p className="doux">
          {fabrique ? t.fabrique : t.aucune}
        </p>
      </section>
    );
  }
  const cartePoints: PointCarte[] = [
    ...o.monstres.flatMap((m) => points(m.nom, `${pct(m.chance)} · ${t.niveau} ${niveaux(m.niveaux)}`, `m${m.id}`, m, langue)),
    ...o.decor.flatMap((g) => points(g.nom, pct(g.chance), `o${g.id}`, g, langue)),
    ...o.marchands.flatMap((v) => points(v.nom, t.marchand, `v${v.id}`, v, langue)),
    ...o.quetes.flatMap((q) => q.donneurs.flatMap((p) => points(p.nom, t.quete(q.titre), `q${q.id}-${p.id}`, p, langue))),
  ];
  return (
    <section aria-labelledby="t-ou" className="ou-trouver">
      <h2 id="t-ou" className="section-titre" style={{ fontSize: 22 }}>{t.titre}</h2>
      <div className="colonnes-ou">
        <div>
          {o.monstres.length ? (
            <>
              <h3>{t.monstres}</h3>
              <div className="tableau-boite">
                <table className="table-objets">
                  <thead><tr><th scope="col">{t.monstre}</th><th scope="col" className="num">{t.niv}</th><th scope="col" className="num">{t.taux}</th><th scope="col">{t.lieu}</th></tr></thead>
                  <tbody>
                    {o.monstres.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 600 }}>{m.nom}{rangs[m.rang] ? <span className="etiquette" style={{ marginLeft: 8 }}>{rangs[m.rang]}</span> : null}{m.quete ? <span className="doux" style={{ fontSize: 13 }}>{t.pendant}</span> : null}</td>
                        <td className="num">{niveaux(m.niveaux)}</td>
                        <td className="num">{pct(m.chance)}</td>
                        <td><Lieu e={m} langue={langue} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {o.monstresTotal > o.monstres.length ? <p className="doux" style={{ fontSize: 14 }}>{t.autres(o.monstresTotal - o.monstres.length)}</p> : null}
            </>
          ) : null}
          {o.aleatoire ? (
            <p className="encadre" style={{ padding: "12px 16px" }}>
              <strong>{t.butin}</strong> {t.aleatoire(o.aleatoire.monstres.toLocaleString(t.nombre), o.aleatoire.min, o.aleatoire.max)}
            </p>
          ) : null}
          {o.decor.length ? (
            <>
              <h3>{t.decor}</h3>
              <ul className="liste-sources">{o.decor.map((g) => <li key={g.id}><strong>{g.nom}</strong> · {pct(g.chance)} · <Lieu e={g} langue={langue} /></li>)}</ul>
            </>
          ) : null}
          {o.marchands.length ? (
            <>
              <h3>{t.vendu}</h3>
              <ul className="liste-sources">{o.marchands.map((v) => <li key={v.id}><strong>{v.nom}</strong> · <Lieu e={v} langue={langue} /></li>)}</ul>
            </>
          ) : null}
          {o.quetes.length ? (
            <>
              <h3>{t.recompense}</h3>
              <ul className="liste-sources">
                {o.quetes.map((q) => (
                  <li key={q.id}>
                    <strong>{t.guillemets[0]}{q.titre}{t.guillemets[1]}</strong> ({t.niveau} {q.niveau})
                    {q.donneurs[0] ? <> · {t.donnee} {q.donneurs[0].nom}, <Lieu e={q.donneurs[0]} langue={langue} /></> : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        {cartePoints.length ? <CarteSources sources={cartePoints} langue={langue} /> : null}
      </div>
      {langue === "en" ? (
        <p className="doux" style={{ fontSize: 13, marginTop: 16 }}>
          Sources and drop chances from original Azeroth, from the free community databases{" "}
          <a href="https://github.com/cmangos/classic-db" rel="noopener noreferrer">CMaNGOS</a> and{" "}
          <a href="https://github.com/azerothcore/azerothcore-wotlk" rel="noopener noreferrer">AzerothCore</a>. Forever may change them: chances are indicative, to be confirmed in game.
        </p>
      ) : <p className="doux" style={{ fontSize: 13, marginTop: 16 }}>
        Sources et taux de l&apos;Azeroth d&apos;origine, d&apos;après les bases communautaires libres{" "}
        <a href="https://github.com/cmangos/classic-db" rel="noopener noreferrer">CMaNGOS</a> (noms français :{" "}
        <a href="https://github.com/azerothcore/azerothcore-wotlk" rel="noopener noreferrer">AzerothCore</a>). Forever peut les modifier : taux indicatifs, à confirmer en jeu.
      </p>}
    </section>
  );
}
