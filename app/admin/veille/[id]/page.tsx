import Link from "next/link";
import { notFound } from "next/navigation";
import { AVIS_MINIMUM, lireParId, messageFacebook } from "@/modules/veille";
import { PILIERS, RUBRIQUES } from "@/config/taxonomie";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { Editeur } from "./Editeur";
import { depublier, enregistrer, relancer, restaurer, supprimer } from "../actions";

export const dynamic = "force-dynamic";

/** Date au format du champ datetime-local, en heure de Paris. */
function champDate(d: Date): string {
  return new Date(d).toLocaleString("sv-SE", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(" ", "T");
}

/** Proposition par défaut : demain à 8h, heure de Paris. */
function demainHuitHeures(): string {
  return `${champDate(new Date(Date.now() + 24 * 3600_000)).slice(0, 10)}T08:00`;
}

export default async function EditerArticle({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> }) {
  await exigerAdmin();
  const { message } = await searchParams;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const a = await lireParId(id);
  if (!a) notFound();

  return (
    <>
      <p><Link href="/admin/veille/">← Retour à la liste</Link></p>
      <h1 className="titre" style={{ fontSize: 30 }}>{a.titre}</h1>
      <p className="doux">
        {a.statut === "publie" ? <>En ligne depuis le {a.publieLe ? dateLongue(a.publieLe) : "—"} · <Link href={`/articles/${a.slug}/`} target="_blank">voir l&apos;article</Link></>
          : a.statut === "supprime" ? "Dans la corbeille"
          : a.programmeLe ? <strong style={{ color: "var(--or)" }}>Publication programmée le {new Date(a.programmeLe).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" })}</strong>
          : "Brouillon"}
        {a.score !== null ? ` · score ${a.score}` : ""}
      </p>

      {message ? <p className="info" role="status">{message}</p> : null}

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
            programmeLe={a.programmeLe ? champDate(a.programmeLe) : ""}
            programmeParDefaut={demainHuitHeures()}
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
            {a.statut === "publie" ? (
              <p style={{ marginTop: 12, marginBottom: 0 }}>
                {a.facebookPostId ? <span className="pastille pastille-ok">Relayé sur la Page</span>
                  : a.facebookTentatives >= 3 ? <span className="pastille pastille-ko">Abandonné après 3 échecs</span>
                  : <span className="pastille pastille-attente">En attente du passage horaire</span>}
              </p>
            ) : null}
            {a.facebookErreur ? <p className="alerte" style={{ marginTop: 12, fontSize: 14 }}>Dernier échec : {a.facebookErreur}</p> : null}
            {a.statut === "publie" && !a.facebookPostId && a.facebookErreur ? (
              <form action={relancer.bind(null, a.id)} style={{ marginTop: 12 }}>
                <button type="submit" className="btn btn-contour btn-petit">Relancer sur Facebook</button>
              </form>
            ) : null}
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
