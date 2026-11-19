import Link from "next/link";
import type { ObjetResume } from "@/modules/veille";
import type { DonjonReference } from "@/content/reference";
import { IconeObjet, NomObjet } from "@/components/Objets";
import { CarteSources, type PointCarte } from "@/components/CarteSources";
import { carte, lieuParNom, pageLieu } from "@/lib/cartes";
import { CONTINENTS_EN, nomLieuEn, nomZoneEn, pageLieuEn } from "@/lib/anglais";
import { niveaux, rangMonstre, type BossDonjon, type DonneesDonjon, type QueteDonjon } from "@/lib/donjons";

type Langue = "fr" | "en";

const TXT = {
  fr: {
    niveaux: "Niveaux conseillés", zone: "Entrée", continent: "Continent", boss: "Boss", bossN: (n: number) => `${n} boss`,
    carte: "Où est l'entrée ?", entree: "Entrée du donjon", entrees: (n: number) => `${n} entrées`,
    tBoss: "Les boss, dans l'ordre", tBossIntro: "Dans l'ordre des rencontres du donjon. Butin : objets verts et mieux, à partir de 1 % de chance, tels qu'ils existent dans Forever.",
    niveau: "Niveau", objet: "Objet", chance: "Chance", quete: "quête", sansButin: "Pas d'objet notable connu dans Forever.",
    tRares: "Monstres rares", tRaresIntro: "Ils n'apparaissent pas à chaque passage.",
    tQuetes: "Quêtes du donjon", tQuetesIntro: "Quêtes rattachées au donjon ou dont les cibles s'y trouvent, avec leur niveau.",
    alliance: "Alliance", horde: "Horde", deux: "Les deux factions", min: (n: number) => `dès le niv. ${n}`,
    aVerifier: "[Liste de l'Azeroth d'origine : présence de chaque quête dans Forever à vérifier au prochain relevé des fichiers du jeu.]",
    butinIndispo: "[Butin momentanément indisponible : la base d'objets ne répond pas.]",
    sources: "Sources", sourcesTexte: (s: string) => `Boss, butin, entrées et quêtes : bases libres de l'Azeroth d'origine (${s}). Objets, noms et icônes : fichiers de Forever, base d'objets du site. Des boss ou du butin peuvent changer dans Forever : signalez-nous un écart.`,
    voirObjet: "Voir la fiche", carteAlt: "carte",
  },
  en: {
    niveaux: "Suggested levels", zone: "Entrance", continent: "Continent", boss: "Bosses", bossN: (n: number) => `${n} bosses`,
    carte: "Where is the entrance?", entree: "Dungeon entrance", entrees: (n: number) => `${n} entrances`,
    tBoss: "The bosses, in order", tBossIntro: "In the dungeon's encounter order. Loot: green items and better, from a 1% chance, as they exist in Forever.",
    niveau: "Level", objet: "Item", chance: "Chance", quete: "quest", sansButin: "No notable item known in Forever.",
    tRares: "Rare monsters", tRaresIntro: "They do not show up on every run.",
    tQuetes: "Dungeon quests", tQuetesIntro: "Quests tied to the dungeon or whose targets are inside, with their level.",
    alliance: "Alliance", horde: "Horde", deux: "Both factions", min: (n: number) => `from level ${n}`,
    aVerifier: "[Original Azeroth list: whether each quest is in Forever is to be checked at the next read of the game files.]",
    butinIndispo: "[Loot temporarily unavailable: the item database is not answering.]",
    sources: "Sources", sourcesTexte: (s: string) => `Bosses, loot, entrances and quests: free databases of original Azeroth (${s}). Items, names and icons: Forever's game files, the site's item database. Bosses or loot may change in Forever: tell us if you spot a difference.`,
    voirObjet: "See the item", carteAlt: "map",
  },
};

function TableauButin({ boss, objets, langue }: { boss: BossDonjon; objets: Map<number, ObjetResume>; langue: Langue }) {
  const t = TXT[langue];
  const lignes = boss.butin.filter((b) => objets.has(b.i));
  if (!lignes.length) return <p className="doux" style={{ margin: "6px 0 0", fontSize: 14 }}>{t.sansButin}</p>;
  const nb = langue === "en" ? "en-GB" : "fr-FR";
  return (
    <div className="tableau-boite" style={{ marginTop: 8 }}>
      <table className="table-objets">
        <thead>
          <tr><th scope="col">{t.objet}</th><th scope="col" className="num">{t.chance}</th><th scope="col" className="num masque-mobile">{t.niveau}</th></tr>
        </thead>
        <tbody>
          {lignes.map((b) => {
            const o = objets.get(b.i)!;
            return (
              <tr key={b.i}>
                <td>
                  <span className="cellule-objet"><IconeObjet objet={o} /><NomObjet objet={o} langue={langue} />{b.q ? <span className="doux" style={{ fontSize: 13 }}> · {t.quete}</span> : null}</span>
                </td>
                <td className="num">{b.p.toLocaleString(nb, { maximumFractionDigits: 1 })} %</td>
                <td className="num masque-mobile">{o.niveauRequis || o.niveauObjet || "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CarteBoss({ boss, rang, objets, langue }: { boss: BossDonjon; rang?: number; objets: Map<number, ObjetResume>; langue: Langue }) {
  const t = TXT[langue];
  const nom = langue === "en" ? boss.en : boss.n;
  return (
    <article className="encadre cadre" style={{ padding: 18 }} id={`boss-${boss.id}`}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        {rang ? <span className="surtitre" style={{ margin: 0 }}>{rang}</span> : null}
        <h3 style={{ margin: 0, fontSize: 20 }}>{nom}</h3>
        <span className="doux" style={{ fontSize: 14 }}>{t.niveau} {niveaux(boss.nv)} · {rangMonstre(boss.r, langue)}</span>
      </div>
      <TableauButin boss={boss} objets={objets} langue={langue} />
    </article>
  );
}

function ListeQuetes({ quetes, langue }: { quetes: QueteDonjon[]; langue: Langue }) {
  const t = TXT[langue];
  const groupes: [string, QueteDonjon[]][] = [
    [t.alliance, quetes.filter((q) => q.camp === 1)],
    [t.horde, quetes.filter((q) => q.camp === 2)],
    [t.deux, quetes.filter((q) => q.camp === 0)],
  ];
  return (
    <div className="g3">
      {groupes.filter(([, l]) => l.length).map(([titre, l]) => (
        <div key={titre} className="encadre">
          <h3 style={{ margin: "0 0 8px", fontSize: 17 }}>{titre}</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15 }}>
            {l.map((q) => (
              <li key={q.id}>{langue === "en" ? q.en : q.fr} <span className="doux" style={{ fontSize: 13 }}>· {q.nv > 0 ? `${t.niveau.toLowerCase()} ${q.nv}` : ""}{q.min > 1 ? ` (${t.min(q.min)})` : ""}</span></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Fiche d'un donjon de l'Azeroth d'origine : repères, carte de l'entrée, boss et butin, rares, quêtes. */
export function FicheDonjon({ donjon: ref, d, objets, butinLu, quetesVerifiees, source, langue = "fr" }: {
  donjon: DonjonReference; d: DonneesDonjon | null; objets: Map<number, ObjetResume>; butinLu: boolean; quetesVerifiees: boolean; source: string; langue?: Langue;
}) {
  const t = TXT[langue];
  const en = langue === "en";
  const slugZone = lieuParNom(ref.zone);
  const nomZone = en ? nomZoneEn(ref.zone) : ref.zone;
  const lienZone = slugZone ? (en ? pageLieuEn(slugZone) : pageLieu(slugZone)) : null;
  const reperes: [string, React.ReactNode][] = [
    [t.niveaux, `${ref.min}-${ref.max}`],
    [t.zone, lienZone ? <Link href={lienZone}>{nomZone}</Link> : nomZone],
    [t.continent, en ? CONTINENTS_EN[ref.continent] ?? ref.continent : ref.continent],
    [t.boss, d ? t.bossN(d.boss.length) : "[À compléter]"],
  ];
  // une source par zone (le Pic et les Profondeurs de Rochenoire peuvent tomber sur deux cartes)
  const parZone = new Map<string, [number, number][]>();
  for (const e of d?.entrees ?? []) parZone.set(e.zone, [...(parZone.get(e.zone) ?? []), [e.x, e.y]]);
  const sources: PointCarte[] = [...parZone].filter(([z]) => carte(z)).map(([z, points]) => ({
    cle: z,
    nom: t.entree,
    detail: points.length > 1 ? t.entrees(points.length) : t.entree,
    zone: { slug: z, nom: en ? nomLieuEn(z) ?? carte(z)!.nom : carte(z)!.nom, lien: en ? pageLieuEn(z) : pageLieu(z) },
    points,
  }));
  return (
    <>
      <dl className="g4" style={{ margin: 0 }}>
        {reperes.map(([titre, v]) => (
          <div key={titre} className="encadre">
            <dt className="surtitre">{titre}</dt>
            <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
          </div>
        ))}
      </dl>
      {sources.length ? (
        <section aria-labelledby="t-carte">
          <h2 id="t-carte" className="section-titre" style={{ fontSize: 26 }}>{t.carte}</h2>
          <CarteSources sources={sources} langue={langue} />
        </section>
      ) : null}
      {d && d.boss.length ? (
        <section aria-labelledby="t-boss">
          <h2 id="t-boss" className="section-titre" style={{ fontSize: 26 }}>{t.tBoss}</h2>
          <p className="doux" style={{ marginTop: 0 }}>{t.tBossIntro}</p>
          {!butinLu ? <p className="doux">{t.butinIndispo}</p> : null}
          <div style={{ display: "grid", gap: 14 }}>
            {d.boss.map((b, i) => <CarteBoss key={b.id} boss={b} rang={i + 1} objets={objets} langue={langue} />)}
          </div>
        </section>
      ) : null}
      {d && d.rares.length ? (
        <section aria-labelledby="t-rares">
          <h2 id="t-rares" className="section-titre" style={{ fontSize: 26 }}>{t.tRares}</h2>
          <p className="doux" style={{ marginTop: 0 }}>{t.tRaresIntro}</p>
          <div style={{ display: "grid", gap: 14 }}>
            {d.rares.map((b) => <CarteBoss key={b.id} boss={b} objets={objets} langue={langue} />)}
          </div>
        </section>
      ) : null}
      {d && d.quetes.length ? (
        <section aria-labelledby="t-quetes">
          <h2 id="t-quetes" className="section-titre" style={{ fontSize: 26 }}>{t.tQuetes}</h2>
          <p className="doux" style={{ marginTop: 0 }}>{t.tQuetesIntro}</p>
          {!quetesVerifiees ? <p className="doux" style={{ fontSize: 14 }}>{t.aVerifier}</p> : null}
          <ListeQuetes quetes={d.quetes} langue={langue} />
        </section>
      ) : null}
      <section className="sources" aria-labelledby="t-sources">
        <h2 id="t-sources">{t.sources}</h2>
        <p style={{ margin: 0 }}>{t.sourcesTexte(source)}</p>
      </section>
    </>
  );
}
