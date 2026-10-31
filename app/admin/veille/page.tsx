import Link from "next/link";
import { listerPourAdmin, statistiques, verifierPublication, type Statut } from "@/modules/veille";
import { nomRubrique } from "@/components/Articles";
import { exigerAdmin } from "@/lib/admin";
import { dateCourte } from "@/lib/site";
import { ecrireArticle } from "./actions";

export const dynamic = "force-dynamic";

type Onglet = Statut | "programme";

const ONGLETS: { statut: Onglet; nom: string }[] = [
  { statut: "brouillon", nom: "Brouillons" },
  { statut: "programme", nom: "Programmés" },
  { statut: "publie", nom: "Publiés" },
  { statut: "supprime", nom: "Corbeille" },
];

const dateHeure = (d: Date) => new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });

export default async function Veille({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  await exigerAdmin();
  const demande = (await searchParams).statut;
  const statut: Onglet = ONGLETS.some((o) => o.statut === demande) ? (demande as Onglet) : "brouillon";
  const [articles, stats] = await Promise.all([listerPourAdmin(statut), statistiques()]);
  const compte: Partial<Record<Onglet, number>> = { brouillon: stats.brouillons, programme: stats.programmes, publie: stats.publies };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="titre" style={{ margin: 0 }}>Relecture</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <form action={ecrireArticle}><button className="btn btn-or" type="submit">Écrire un article</button></form>
        </div>
      </div>
      <p className="doux">Chaque matin, la veille dépose ici ses brouillons, classés par score. Relire, écrire l&apos;avis de Silfax, publier les meilleurs, supprimer les autres.</p>

      <nav className="onglets" aria-label="Statut">
        {ONGLETS.map((o) => (
          <Link key={o.statut} href={`/admin/veille/?statut=${o.statut}`} aria-current={o.statut === statut ? "page" : undefined}>
            {o.nom}{compte[o.statut] !== undefined ? <span>{compte[o.statut]}</span> : null}
          </Link>
        ))}
      </nav>

      {articles.length === 0 ? (
        <p className="doux">Rien ici pour l&apos;instant.</p>
      ) : (
        <div className="tableau-boite">
          <table className="admin-table">
            <thead>
              <tr><th scope="col">Titre</th><th scope="col">Rubrique</th><th scope="col">Score</th><th scope="col">{statut === "programme" ? "Prévu le" : "Date"}</th><th scope="col">État</th></tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const manques = verifierPublication(a);
                return (
                  <tr key={a.id}>
                    <td><Link href={`/admin/veille/${a.id}/`}>{a.titre}</Link>{a.origine === "manuel" ? <span className="doux"> · écrit à la main</span> : null}</td>
                    <td>{nomRubrique(a.rubrique)}</td>
                    <td>{a.score ?? "—"}</td>
                    <td>{a.programmeLe ? dateHeure(a.programmeLe) : dateCourte(a.publieLe ?? a.creeLe)}</td>
                    <td>
                      {a.statut === "publie"
                        ? a.facebookPostId ? "En ligne · Facebook ✓" : a.facebookErreur ? `En ligne · Facebook en échec` : "En ligne · Facebook en attente"
                        : a.programmeLe ? "Programmé"
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
