import Link from "next/link";
import { emplacement, qualite, type CreatureReleve, type ObjetResume } from "@/modules/veille";
import { raidOrigine, RAIDS, type DonjonReference } from "@/content/reference";
import { IconeObjet, NomObjet } from "@/components/Objets";
import { CarteSources, type PointCarte } from "@/components/CarteSources";
import { carte, lieuParNom, pageLieu } from "@/lib/cartes";
import { CONTINENTS_EN, nomLieuEn, nomZoneEn, pageLieuEn } from "@/lib/anglais";
import { STATUTS_RAIDS_EN } from "@/content/monde-en";
import { niveaux, objetOrigine, rangMonstre, type BossDonjon, type DonneesDonjon, type QueteDonjon } from "@/lib/donjons";

type Langue = "fr" | "en";

const TXT = {
  fr: {
    niveaux: "Niveaux conseillés", zone: "Entrée", continent: "Continent", boss: "Boss", bossN: (n: number) => `${n} boss`,
    carte: "Où est l'entrée ?", entree: "Entrée du donjon", entrees: (n: number) => `${n} entrées`,
    tBoss: "Les boss, dans l'ordre", tBossIntro: "Dans l'ordre des rencontres. Butin de l'Azeroth d'origine : objets verts et mieux, à partir de 1 % de chance. Forever a refait une partie du butin : tant qu'aucun relevé n'est fait en jeu, chaque objet reste à confirmer.",
    niveau: "Niveau", objet: "Objet", chance: "Chance", quete: "quête", sansButin: "Pas d'objet notable connu.",
    horsForever: "absent des fichiers de Forever", origine: "Butin de l'Azeroth d'origine, à confirmer en jeu.",
    joueurs: "Joueurs", statut: "Dans Forever",
    releve: (n: number) => `Relevé en jeu sur ${n} victoire${n > 1 ? "s" : ""}`, releveVide: (n: number) => `Aucun objet vert ou mieux sur ${n} victoire${n > 1 ? "s" : ""}.`,
    voirOrigine: "Butin de l'Azeroth d'origine", vus: (v: number) => `vu ${v} fois`,
    tCoffres: "Coffres relevés", tCoffresIntro: "Coffres de fin de rencontre fouillés en jeu.", coffre: "Coffre", creature: (c: string) => `Créature n° ${c}`,
    tRares: "Monstres rares", tRaresIntro: "Ils n'apparaissent pas à chaque passage.",
    tQuetes: "Quêtes du donjon", tQuetesIntro: "Quêtes rattachées au donjon ou dont les cibles s'y trouvent, avec leur niveau.",
    alliance: "Alliance", horde: "Horde", deux: "Les deux factions", min: (n: number) => `dès le niv. ${n}`,
    aVerifier: "[Liste de l'Azeroth d'origine : présence de chaque quête dans Forever à vérifier au prochain relevé des fichiers du jeu.]",
    butinIndispo: "[Base d'objets injoignable : le butin s'affiche avec les noms des bases libres, sans lien vers les fiches.]",
    sources: "Sources", sourcesTexte: (s: string) => `Boss, butin, entrées et quêtes : bases libres de l'Azeroth d'origine (${s}). Objets cliquables, noms et icônes : fichiers de Forever, base d'objets du site ; les autres objets gardent le nom des bases libres. Des boss ou du butin peuvent changer dans Forever : signalez-nous un écart.`,
    voirObjet: "Voir la fiche", carteAlt: "carte",
  },
  en: {
    niveaux: "Suggested levels", zone: "Entrance", continent: "Continent", boss: "Bosses", bossN: (n: number) => `${n} bosses`,
    carte: "Where is the entrance?", entree: "Dungeon entrance", entrees: (n: number) => `${n} entrances`,
    tBoss: "The bosses, in order", tBossIntro: "In encounter order. Loot of original Azeroth: green items and better, from a 1% chance. Forever has reworked part of the loot: until it is recorded in game, every item is still to be confirmed.",
    niveau: "Level", objet: "Item", chance: "Chance", quete: "quest", sansButin: "No notable item known.",
    horsForever: "not in Forever's game files", origine: "Loot of original Azeroth, to be confirmed in game.",
    joueurs: "Players", statut: "In Forever",
    releve: (n: number) => `Recorded in game over ${n} kill${n > 1 ? "s" : ""}`, releveVide: (n: number) => `No green or better item over ${n} kill${n > 1 ? "s" : ""}.`,
    voirOrigine: "Loot of original Azeroth", vus: (v: number) => `seen ${v} time${v > 1 ? "s" : ""}`,
    tCoffres: "Recorded chests", tCoffresIntro: "End-of-encounter chests looted in game.", coffre: "Chest", creature: (c: string) => `Creature no. ${c}`,
    tRares: "Rare monsters", tRaresIntro: "They do not show up on every run.",
    tQuetes: "Dungeon quests", tQuetesIntro: "Quests tied to the dungeon or whose targets are inside, with their level.",
    alliance: "Alliance", horde: "Horde", deux: "Both factions", min: (n: number) => `from level ${n}`,
    aVerifier: "[Original Azeroth list: whether each quest is in Forever is to be checked at the next read of the game files.]",
    butinIndispo: "[Item database unreachable: loot is shown with the names from the free databases, without links.]",
    sources: "Sources", sourcesTexte: (s: string) => `Bosses, loot, entrances and quests: free databases of original Azeroth (${s}). Linked items, names and icons: Forever's game files, the site's item database; other items keep the name from the free databases. Bosses or loot may change in Forever: tell us if you spot a difference.`,
    voirObjet: "See the item", carteAlt: "map",
  },
};

/**
 * Icône d'un objet que la base du site ne connaît pas (butin d'origine absent de Forever) : l'image est servie par
 * /base-de-donnees/icones/origine/<id>/ (icône des fichiers de Classic Era une fois notée, sinon un « ? »), bordure de la couleur de sa qualité.
 */
function IconeInconnue({ q, id }: { q: number; id: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="icone-objet" src={`/base-de-donnees/icones/origine/${id}/`} alt="" width={36} height={36} loading="lazy" style={{ borderColor: qualite(q).couleur }} />
  );
}

function TableauButin({ boss, objets, langue }: { boss: BossDonjon; objets: Map<number, ObjetResume>; langue: Langue }) {
  const t = TXT[langue];
  const en = langue === "en";
  // objets décrits par Forever (base du site) d'abord tels quels ; les autres avec le nom et la qualité des bases libres
  const lignes = boss.butin.map((b) => ({ b, o: objets.get(b.i), orig: objetOrigine(b.i) })).filter((l) => l.o || l.orig);
  if (!lignes.length) return <p className="doux" style={{ margin: "6px 0 0", fontSize: 14 }}>{t.sansButin}</p>;
  const nb = en ? "en-GB" : "fr-FR";
  return (
    <div className="tableau-boite" style={{ marginTop: 8 }}>
      <table className="table-objets">
        <thead>
          <tr><th scope="col">{t.objet}</th><th scope="col" className="num">{t.chance}</th><th scope="col" className="num masque-mobile">{t.niveau}</th></tr>
        </thead>
        <tbody>
          {lignes.map(({ b, o, orig }) => {
            const place = orig && orig.s ? emplacement(orig.s, langue) : null;
            return (
              <tr key={b.i}>
                <td>
                  {o ? (
                    <span className="cellule-objet"><IconeObjet objet={o} /><NomObjet objet={o} langue={langue} />{b.q ? <span className="doux" style={{ fontSize: 13 }}> · {t.quete}</span> : null}</span>
                  ) : (
                    <span className="cellule-objet">
                      <IconeInconnue q={orig!.q} id={b.i} />
                      <span>
                        <span className="nom-objet" style={{ color: qualite(orig!.q).couleur }}>{en ? orig!.en : orig!.n}</span>
                        <span className="doux" style={{ fontSize: 13, display: "block" }}>{[place, b.q ? t.quete : null, t.horsForever].filter(Boolean).join(" · ")}</span>
                      </span>
                    </span>
                  )}
                </td>
                <td className="num">{b.p.toLocaleString(nb, { maximumFractionDigits: 1 })} %</td>
                <td className="num masque-mobile">{o ? o.niveauRequis || o.niveauObjet || "–" : orig!.req || orig!.nv || "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Butin relevé en jeu (TaverneTrace) : chance observée = fois vu / victoires. */
export function TableauReleve({ releve, objets, langue }: { releve: CreatureReleve; objets: Map<number, ObjetResume>; langue: Langue }) {
  const t = TXT[langue];
  const nb = langue === "en" ? "en-GB" : "fr-FR";
  if (!releve.objets.length) return <p className="doux" style={{ margin: "6px 0 0", fontSize: 14 }}>{t.releveVide(releve.victoires)}</p>;
  return (
    <div className="tableau-boite" style={{ marginTop: 8 }}>
      <table className="table-objets">
        <thead>
          <tr><th scope="col">{t.objet}</th><th scope="col" className="num">{t.chance}</th><th scope="col" className="num masque-mobile">{t.niveau}</th></tr>
        </thead>
        <tbody>
          {releve.objets.map((x) => {
            const o = objets.get(x.id);
            return (
              <tr key={x.id}>
                <td>
                  {o ? (
                    <span className="cellule-objet"><IconeObjet objet={o} /><NomObjet objet={o} langue={langue} /></span>
                  ) : (
                    <span className="cellule-objet">
                      <IconeInconnue q={x.qualite} id={x.id} />
                      <span className="nom-objet" style={{ color: qualite(x.qualite).couleur }}>{x.nom || `#${x.id}`}</span>
                    </span>
                  )}
                </td>
                <td className="num" title={t.vus(x.vus)}>{((100 * x.vus) / releve.victoires).toLocaleString(nb, { maximumFractionDigits: 1 })} %</td>
                <td className="num masque-mobile">{o ? o.niveauRequis || o.niveauObjet || "–" : "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Butin relevé dans une instance sans liste de boss (nouveaux donjons de Forever) : créatures et coffres qui ont donné des objets. */
export function ButinReleveInstance({ releve, objets, langue = "fr" }: { releve: CreatureReleve[]; objets: Map<number, ObjetResume>; langue?: Langue }) {
  const t = TXT[langue];
  const liste = releve.filter((c) => c.victoires > 0 && c.objets.length).sort((a, b) => b.victoires - a.victoires || a.cle.localeCompare(b.cle));
  if (!liste.length) return null;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {liste.map((c) => (
        <article key={c.cle} className="encadre cadre" style={{ padding: 18 }}>
          <h3 style={{ margin: 0, fontSize: 20 }}>{c.nom || (c.cle.startsWith("g") ? t.coffre : t.creature(c.cle))}</h3>
          <p className="surtitre" style={{ margin: "8px 0 0" }}>{t.releve(c.victoires)}</p>
          <TableauReleve releve={c} objets={objets} langue={langue} />
        </article>
      ))}
    </div>
  );
}

function CarteBoss({ boss, rang, objets, releve, langue }: { boss: BossDonjon; rang?: number; objets: Map<number, ObjetResume>; releve?: CreatureReleve; langue: Langue }) {
  const t = TXT[langue];
  const nom = langue === "en" ? boss.en : boss.n;
  const r = releve && releve.victoires > 0 ? releve : null;
  return (
    <article className="encadre cadre" style={{ padding: 18 }} id={`boss-${boss.id}`}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        {rang ? <span className="surtitre" style={{ margin: 0 }}>{rang}</span> : null}
        <h3 style={{ margin: 0, fontSize: 20 }}>{nom}</h3>
        <span className="doux" style={{ fontSize: 14 }}>{t.niveau} {niveaux(boss.nv)} · {rangMonstre(boss.r, langue)}</span>
      </div>
      {r ? (
        <>
          <p className="surtitre" style={{ margin: "8px 0 0", color: "var(--vert, #6fbf73)" }}>{t.releve(r.victoires)}</p>
          <TableauReleve releve={r} objets={objets} langue={langue} />
          {boss.butin.length ? (
            <details style={{ marginTop: 8 }}>
              <summary className="doux" style={{ fontSize: 14 }}>{t.voirOrigine}</summary>
              <TableauButin boss={boss} objets={objets} langue={langue} />
            </details>
          ) : null}
        </>
      ) : (
        <TableauButin boss={boss} objets={objets} langue={langue} />
      )}
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
export function FicheDonjon({ donjon: ref, d, objets, butinLu, quetesVerifiees, source, releve = new Map(), langue = "fr" }: {
  donjon: DonjonReference; d: DonneesDonjon | null; objets: Map<number, ObjetResume>; butinLu: boolean; quetesVerifiees: boolean; source: string;
  releve?: Map<string, CreatureReleve>; langue?: Langue;
}) {
  const t = TXT[langue];
  const en = langue === "en";
  const slugZone = lieuParNom(ref.zone);
  const nomZone = en ? nomZoneEn(ref.zone) : ref.zone;
  const lienZone = slugZone ? (en ? pageLieuEn(slugZone) : pageLieu(slugZone)) : null;
  const reperes: [string, React.ReactNode][] = [
    [t.niveaux, niveaux([ref.min, ref.max])],
    [t.zone, lienZone ? <Link href={lienZone}>{nomZone}</Link> : nomZone],
    [t.continent, en ? CONTINENTS_EN[ref.continent] ?? ref.continent : ref.continent],
    [t.boss, d ? t.bossN(d.boss.length) : "[À compléter]"],
  ];
  const coffres = [...releve.values()].filter((c) => c.cle.startsWith("g") && c.objets.length && c.victoires > 0);
  const raid = raidOrigine(ref.slug);
  if (raid) {
    reperes.splice(1, 0, [t.joueurs, raid.joueurs]);
    const statut = RAIDS.find((r) => r.slug === ref.slug)?.statut;
    if (statut) reperes.push([t.statut, en ? STATUTS_RAIDS_EN[statut] ?? statut : statut]);
  }
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
            {d.boss.map((b, i) => <CarteBoss key={b.id} boss={b} rang={i + 1} objets={objets} releve={releve.get(String(b.id))} langue={langue} />)}
          </div>
        </section>
      ) : null}
      {d && d.rares.length ? (
        <section aria-labelledby="t-rares">
          <h2 id="t-rares" className="section-titre" style={{ fontSize: 26 }}>{t.tRares}</h2>
          <p className="doux" style={{ marginTop: 0 }}>{t.tRaresIntro}</p>
          <div style={{ display: "grid", gap: 14 }}>
            {d.rares.map((b) => <CarteBoss key={b.id} boss={b} objets={objets} releve={releve.get(String(b.id))} langue={langue} />)}
          </div>
        </section>
      ) : null}
      {coffres.length ? (
        <section aria-labelledby="t-coffres">
          <h2 id="t-coffres" className="section-titre" style={{ fontSize: 26 }}>{t.tCoffres}</h2>
          <p className="doux" style={{ marginTop: 0 }}>{t.tCoffresIntro}</p>
          <div style={{ display: "grid", gap: 14 }}>
            {coffres.map((c) => (
              <article key={c.cle} className="encadre cadre" style={{ padding: 18 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>{c.nom || t.coffre}</h3>
                <p className="surtitre" style={{ margin: "8px 0 0" }}>{t.releve(c.victoires)}</p>
                <TableauReleve releve={c} objets={objets} langue={langue} />
              </article>
            ))}
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
