import Link from "next/link";
import { notFound } from "next/navigation";
import { AVIS_MINIMUM, lireParId, messageFacebook } from "@/modules/veille";
import { PILIERS, RUBRIQUES } from "@/config/taxonomie";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { Editeur } from "./Editeur";
import { depublier, enregistrer, restaurer, supprimer } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditerArticle({ params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const a = await lireParId(id);
  if (!a) notFound();

  return (
    <>
      <p><Link href="/admin/veille/">← Retour à la liste</Link></p>
      <h1 className="titre" style={{ fontSize: 30 }}>{a.titre}</h1>
      <p className="doux">
        {a.statut === "publie" ? <>En ligne depuis le {a.publieLe ? dateLongue(a.publieLe) : "—"} · <Link href={`/articles/${a.slug}/`} target="_blank">voir l&apos;article</Link></> : a.statut === "supprime" ? "Dans la corbeille" : "Brouillon"}
        {a.score !== null ? ` · score ${a.score}` : ""}
      </p>

      <div className="colonnes">
        <div className="colonne-principale">
          <Editeur
            action={enregistrer.bind(null, a.id)}
            valeurs={{
              titre: a.titre, chapo: a.chapo, corps: a.corps, avisSilfax: a.avisSilfax, rubrique: a.rubrique,
              etiquettes: a.etiquettes.join(", "), pilier: a.pilier ?? "", description: a.description,
              accrocheFacebook: a.accrocheFacebook, texteFacebook: a.texteFacebook,
            }}
            rubriques={RUBRIQUES.map((r) => ({ slug: r.slug, nom: r.nom }))}
            piliers={PILIERS}
            publie={a.statut === "publie"}
            avisMinimum={AVIS_MINIMUM}
          />
        </div>
        <aside className="colonne-laterale">
          <div className="encadre">
            <h2>Sources</h2>
            {a.sources.length ? (
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.nom}</a> — {s.titre}</li>)}
              </ul>
            ) : <p className="doux" style={{ margin: 0, fontSize: 15 }}>Article écrit à la main.</p>}
          </div>
          <div className="encadre">
            <h2>Aperçu du post Facebook</h2>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 15 }}>{messageFacebook(a)}</p>
            {a.facebookErreur ? <p className="alerte" style={{ marginTop: 12, fontSize: 14 }}>Dernier échec : {a.facebookErreur}</p> : null}
          </div>
          <div className="encadre" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2>Actions</h2>
            {a.statut === "publie" ? (
              <form action={depublier.bind(null, a.id)}><button type="submit" className="btn btn-contour">Retirer du site</button></form>
            ) : null}
            {a.statut === "supprime" ? (
              <form action={restaurer.bind(null, a.id)}><button type="submit" className="btn btn-contour">Remettre en brouillon</button></form>
            ) : (
              <form action={supprimer.bind(null, a.id)}><button type="submit" className="btn btn-danger">Supprimer</button></form>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
