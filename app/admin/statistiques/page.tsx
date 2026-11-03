import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { evolution, statsFacebook, tableauStatistiques, type Compteurs } from "@/modules/veille";
import { dateCourte } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Statistiques" };

const nf = new Intl.NumberFormat("fr-FR");
const pct = (x: number) => `${Math.round(x * 100)} %`;
function duree(s: number): string {
  if (!s) return "–";
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
}

const COMPTEURS: { cle: keyof Compteurs; nom: string; format: (n: number) => string; inverse?: boolean }[] = [
  { cle: "visiteurs", nom: "Visiteurs", format: (n) => nf.format(n) },
  { cle: "visites", nom: "Visites", format: (n) => nf.format(n) },
  { cle: "pagesVues", nom: "Pages vues", format: (n) => nf.format(n) },
  { cle: "lectureMoyenneS", nom: "Lecture moyenne", format: duree },
  { cle: "pagesParVisite", nom: "Pages par visite", format: (n) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) },
  { cle: "partUnePage", nom: "Visites d'une seule page", format: pct, inverse: true },
];

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default async function Statistiques({ searchParams }: { searchParams: Promise<{ jours?: string }> }) {
  await exigerAdmin();
  const jours = Number((await searchParams).jours ?? 30);
  const [t, fb] = await Promise.all([tableauStatistiques(jours), statsFacebook()]);
  const maxJour = Math.max(1, ...t.parJour.map((d) => d.visites));
  const maxCreneau = Math.max(1, ...t.creneaux.flat());
  const largeur = 760;
  const pas = largeur / Math.max(1, t.parJour.length);

  return (
    <div className="stats">
      <div className="stats-tete">
        <h1 style={{ margin: 0 }}>Statistiques</h1>
        <nav className="stats-periodes" aria-label="Période">
          {[7, 30, 90, 365].map((j) => (
            <Link key={j} href={`/admin/statistiques/?jours=${j}`} aria-current={t.jours === j ? "page" : undefined}>{j === 365 ? "1 an" : `${j} jours`}</Link>
          ))}
          <a href={`/admin/statistiques/export/?jours=${t.jours}`} className="btn btn-contour btn-petit">Export CSV</a>
        </nav>
      </div>
      <p className="doux">Du {dateCourte(t.debut)} au {dateCourte(t.fin)}, comparé aux {t.jours} jours précédents. Mesure sans cookie : un visiteur est compté une fois par jour.</p>

      <div className="stats-compteurs">
        {COMPTEURS.map((c) => {
          const e = evolution(t.actuel[c.cle], t.precedent[c.cle]);
          const bon = e === null ? null : c.inverse ? e <= 0 : e >= 0;
          return (
            <div key={c.cle} className="stats-compteur">
              <p>{c.nom}</p>
              <strong>{c.format(t.actuel[c.cle])}</strong>
              <span className={bon === null ? "doux" : bon ? "stats-hausse" : "stats-baisse"}>
                {e === null ? "pas de comparaison" : `${e >= 0 ? "+" : "−"}${pct(Math.abs(e))}`}
              </span>
            </div>
          );
        })}
      </div>

      <section className="encadre stats-bloc">
        <h2>Ce qu&apos;il faut retenir</h2>
        <ul>{t.enseignements.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>

      <section className="stats-bloc">
        <h2>Visites jour par jour</h2>
        <div className="tableau-boite" style={{ padding: 16 }}>
          <svg viewBox={`0 0 ${largeur} 180`} width="100%" height="180" role="img" aria-label={`Visites par jour : ${t.parJour.map((d) => `${d.jour} ${d.visites}`).join(", ")}`}>
            {t.parJour.map((d, i) => {
              const h = (d.visites / maxJour) * 150;
              return <rect key={d.jour} x={i * pas + pas * 0.15} y={160 - h} width={Math.max(1, pas * 0.7)} height={h} rx={2} fill="var(--or)"><title>{`${d.jour} : ${d.visites} visites, ${d.pagesVues} pages vues`}</title></rect>;
            })}
            <line x1="0" x2={largeur} y1="160" y2="160" stroke="var(--bordure)" />
            <text x="0" y="176" fontSize="12" fill="var(--texte-doux)">{t.parJour[0]?.jour}</text>
            <text x={largeur} y="176" fontSize="12" fill="var(--texte-doux)" textAnchor="end">{t.parJour.at(-1)?.jour}</text>
            <text x="0" y="12" fontSize="12" fill="var(--texte-doux)">{maxJour} visites</text>
          </svg>
        </div>
      </section>

      <div className="stats-deux">
        <section className="stats-bloc">
          <h2>Origine des visites</h2>
          <Barres lignes={t.sources} />
        </section>
        <section className="stats-bloc">
          <h2>Appareils</h2>
          <Barres lignes={t.appareils} />
          <h2 style={{ marginTop: 24 }}>Liens sortants cliqués</h2>
          {t.sorties.length ? (
            <ul className="stats-liste">{t.sorties.map((s) => <li key={s.lien}><span>{s.lien}</span><strong>{s.clics}</strong></li>)}</ul>
          ) : <p className="doux">Aucun clic vers un autre site.</p>}
        </section>
      </div>

      <section className="stats-bloc">
        <h2>Pages</h2>
        <div className="tableau-boite">
          <table>
            <thead><tr><th scope="col">Page</th><th scope="col" className="num">Vues</th><th scope="col" className="num">Temps moyen</th><th scope="col" className="num">Lue jusqu&apos;au bout</th><th scope="col" className="num">Venue de Facebook</th></tr></thead>
            <tbody>
              {t.pages.map((p) => (
                <tr key={p.chemin}>
                  <td><a href={p.chemin} target="_blank" rel="noreferrer">{p.chemin}</a></td>
                  <td className="num">{nf.format(p.vues)}</td>
                  <td className="num">{duree(p.dureeMoyenneS)}</td>
                  <td className="num">{p.partLueJusquauBout === null ? "–" : pct(p.partLueJusquauBout)}</td>
                  <td className="num">{pct(p.partFacebook)}</td>
                </tr>
              ))}
              {!t.pages.length ? <tr><td colSpan={5} className="doux">Aucune page vue sur la période.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stats-bloc">
        <h2>Boutons (data-cta)</h2>
        <div className="tableau-boite">
          <table>
            <thead><tr><th scope="col">Bouton</th><th scope="col" className="num">Affichages</th><th scope="col" className="num">Clics</th><th scope="col" className="num">Taux de clic</th></tr></thead>
            <tbody>
              {t.ctas.map((c) => (
                <tr key={c.nom}><td><code>{c.nom}</code></td><td className="num">{nf.format(c.affichages)}</td><td className="num">{nf.format(c.clics)}</td><td className="num">{c.affichages ? pct(c.taux) : "–"}</td></tr>
              ))}
              {!t.ctas.length ? <tr><td colSpan={4} className="doux">Aucun bouton affiché sur la période.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stats-bloc">
        <h2>Affluence par jour et par heure</h2>
        <p className="doux" style={{ marginTop: 0 }}>Pages vues, heure de Paris. Plus la case est foncée, plus il y a de monde : programmer les articles une heure avant.</p>
        <div className="tableau-boite" style={{ padding: 12 }}>
          <table className="stats-creneaux">
            <thead><tr><th scope="col"><span className="sr-only">Jour</span></th>{Array.from({ length: 24 }, (_, h) => <th key={h} scope="col">{h % 3 === 0 ? h : ""}</th>)}</tr></thead>
            <tbody>
              {t.creneaux.map((heures, j) => (
                <tr key={j}>
                  <th scope="row">{JOURS[j]}</th>
                  {heures.map((n, h) => (
                    <td key={h} title={`${JOURS[j]} ${h} h : ${n} pages vues`} style={{ background: n ? `rgba(224, 162, 59, ${0.12 + 0.88 * (n / maxCreneau)})` : undefined }}>
                      <span className="sr-only">{n}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stats-bloc">
        <h2>Page Facebook</h2>
        {!fb ? <p className="doux">Page Facebook non configurée (FACEBOOK_PAGE_ID et FACEBOOK_PAGE_TOKEN).</p>
          : "erreur" in fb ? <p className="alerte">{fb.erreur}</p>
          : (
            <>
              <div className="stats-compteurs" style={{ marginBottom: 16 }}>
                <div className="stats-compteur"><p>Abonnés</p><strong>{fb.abonnes === null ? "–" : nf.format(fb.abonnes)}</strong></div>
                <div className="stats-compteur"><p>Mentions J&apos;aime</p><strong>{fb.jaime === null ? "–" : nf.format(fb.jaime)}</strong></div>
              </div>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Publication</th><th scope="col" className="num">Réactions</th><th scope="col" className="num">Commentaires</th><th scope="col" className="num">Partages</th></tr></thead>
                  <tbody>
                    {fb.publications.map((p) => (
                      <tr key={p.lien || p.date.toISOString()}>
                        <td><span className="doux">{dateCourte(p.date)}</span> · {p.lien ? <a href={p.lien} target="_blank" rel="noreferrer">{p.texte || "Publication"}</a> : p.texte}</td>
                        <td className="num">{p.reactions}</td><td className="num">{p.commentaires}</td><td className="num">{p.partages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </section>
    </div>
  );
}

function Barres({ lignes }: { lignes: { cle: string; nom: string; nombre: number; part: number }[] }) {
  if (!lignes.length) return <p className="doux">Aucune donnée sur la période.</p>;
  return (
    <ul className="stats-barres">
      {lignes.map((l) => (
        <li key={l.cle}>
          <span>{l.nom}</span>
          <span className="stats-barre" aria-hidden="true"><span style={{ width: `${Math.max(2, l.part * 100)}%` }} /></span>
          <strong>{nf.format(l.nombre)} · {pct(l.part)}</strong>
        </li>
      ))}
    </ul>
  );
}
