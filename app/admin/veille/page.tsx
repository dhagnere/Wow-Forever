import Link from "next/link";
import { compterParRubrique, listerPourAdmin, verifierPublication, type Statut } from "@/modules/veille";
import { RUBRIQUES, trouverRubrique } from "@/config/taxonomie";
import { nomRubrique } from "@/components/Articles";
import { exigerAdmin } from "@/lib/admin";
import { dateCourte } from "@/lib/site";
import { ecrireArticle } from "./actions";
import { seDeconnecter } from "../connexion/actions";

export const dynamic = "force-dynamic";

const ONGLETS: { statut: Statut; nom: string }[] = [
  { statut: "brouillon", nom: "Brouillons" },
  { statut: "publie", nom: "Publiés" },
  { statut: "supprime", nom: "Corbeille" },
];

function lien(statut: Statut, rubrique?: string) {
  return `/admin/veille/?statut=${statut}${rubrique ? `&rubrique=${rubrique}` : ""}`;
}

export default async function Veille({ searchParams }: { searchParams: Promise<{ statut?: string; rubrique?: string }> }) {
  await exigerAdmin();
  const q = await searchParams;
  const statut: Statut = ONGLETS.some((o) => o.statut === q.statut) ? (q.statut as Statut) : "brouillon";
  const rubrique = q.rubrique && trouverRubrique(q.rubrique) ? q.rubrique : undefined;
  const [articles, compteurs] = await Promise.all([listerPourAdmin(statut, rubrique), compterParRubrique()]);
  const total = (s: Statut) => Object.values(compteurs).reduce((n, c) => n + (c[s] ?? 0), 0);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="titre" style={{ margin: 0 }}>Relecture</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <form action={ecrireArticle}><button className="btn btn-or" type="submit">Écrire un article</button></form>
          <form action={seDeconnecter}><button className="btn btn-contour" type="submit">Se déconnecter</button></form>
        </div>
      </div>
      <p className="doux">Chaque matin, la veille dépose ici ses brouillons, classés par score et par thème. Relire, valider l&apos;avis de Silfax, publier les meilleurs, supprimer les autres.</p>

      <nav className="onglets" aria-label="Statut">
        {ONGLETS.map((o) => (
          <Link key={o.statut} href={lien(o.statut, rubrique)} aria-current={o.statut === statut ? "page" : undefined}>
            {o.nom} ({total(o.statut)})
          </Link>
        ))}
      </nav>

      <details className="encadre" style={{ marginBottom: 24 }} open={!rubrique}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Remplissage des pages de thème</summary>
        <p className="doux" style={{ margin: "8px 0 12px", fontSize: 15 }}>Articles en ligne et brouillons en attente, par rubrique. Cliquez pour filtrer.</p>
        <div className="onglets" style={{ marginBottom: 0 }}>
          <Link href={lien(statut)} aria-current={!rubrique ? "page" : undefined}>Tous les thèmes</Link>
          {RUBRIQUES.map((r) => {
            const c = compteurs[r.slug] ?? {};
            const vide = !c.publie;
            return (
              <Link key={r.slug} href={lien(statut, r.slug)} aria-current={rubrique === r.slug ? "page" : undefined} title={vide ? "Aucun article en ligne" : undefined}>
                {r.nom} · {c.publie ?? 0} en ligne · {c.brouillon ?? 0} en attente{vide ? " ⚠" : ""}
              </Link>
            );
          })}
        </div>
      </details>

      {articles.length === 0 ? (
        <p className="doux">Rien ici pour l&apos;instant.{rubrique ? " Cherchez des sujets de ce thème dans la revue du jour." : ""}</p>
      ) : (
        <div className="tableau-boite">
          <table className="admin-table">
            <thead>
              <tr><th scope="col">Titre</th><th scope="col">Thème</th><th scope="col">Page pilier</th><th scope="col">Score</th><th scope="col">Date</th><th scope="col">État</th></tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const manques = verifierPublication(a);
                return (
                  <tr key={a.id}>
                    <td><Link href={`/admin/veille/${a.id}/`}>{a.titre}</Link>{a.origine === "manuel" ? <span className="doux"> · écrit à la main</span> : null}</td>
                    <td><Link href={lien(statut, a.rubrique)}>{nomRubrique(a.rubrique)}</Link></td>
                    <td className="doux">{a.pilier ? `/${a.pilier}/` : "—"}</td>
                    <td>{a.score ?? "—"}</td>
                    <td>{dateCourte(a.publieLe ?? a.creeLe)}</td>
                    <td>
                      {a.statut === "publie"
                        ? a.facebookPostId ? "En ligne · Facebook ✓" : a.facebookErreur ? "En ligne · Facebook en échec" : "En ligne · Facebook en attente"
                        : manques.length ? `${manques.length} point(s) à régler` : "Prêt à publier"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
