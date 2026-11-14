import type { Metadata } from "next";
import Link from "next/link";
import { guidesProbe, type LigneProbe } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { nomLieu } from "@/lib/quetes";
import type { GuideProbe, Verification } from "@/lib/probe";
import { analyserCode, ecarter, publier, retirer } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Guides à valider de Probe" };

type Props = { searchParams: Promise<{ erreur?: string; ok?: string; publie?: string }> };

const PORTEES = [
  { valeur: "race", libelle: "Toutes les classes de cette race" },
  { valeur: "faction", libelle: "Toute la faction" },
  { valeur: "classe", libelle: "Cette race et cette classe seulement" },
] as const;

const ETATS: Record<LigneProbe["etat"], string> = { a_valider: "à valider", publie: "publié", ecarte: "écarté", retire: "retiré" };

function minutes(s: number | null) {
  if (s === null) return "?";
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
}

function Fiche({ l }: { l: LigneProbe }) {
  const g = l.guide as GuideProbe;
  const v = l.verification as Verification;
  const lieu = (x: string | null) => (x ? nomLieu(x) : "zone inconnue");
  return (
    <article id={`guide-${l.id}`} className="encadre" style={{ marginBottom: 24 }}>
      <h2>
        N° {l.id} · {g.personnage || "Personnage inconnu"} · {g.race ?? `race « ${g.raceFichier || "?"} »`}{g.classe ? ` ${g.classe}` : ""} · niveaux {g.niveaux[0]} à {g.niveaux[1]}
      </h2>
      <p className="doux" style={{ marginTop: 0 }}>
        Reçu le {dateLongue(l.recuLe)} · {g.partie === "depart" ? "zone de départ" : g.partie === "commune" ? "partie commune" : "partie non précisée"} ·{" "}
        {g.evenements} événements · état : <strong>{ETATS[l.etat]}</strong>{l.decideLe ? ` le ${dateLongue(l.decideLe)}` : ""}
      </p>

      <div className={v.ok ? "succes" : "info"} role="note" style={v.ok ? undefined : { borderColor: "#ff8d7a", color: "#ffd2c9", background: "rgba(255,141,122,0.08)" }}>
        {v.ok
          ? <>Vérification réussie : l&apos;ordre reste jouable dans {v.pages.length} guide(s). {v.reconnues} étape(s) sur {v.total} reprise(s) par le guide.</>
          : <>À corriger avant publication : <ul style={{ margin: "6px 0 0" }}>{v.problemes.map((p) => <li key={p}>{p}</li>)}</ul></>}
      </div>

      <h3>Zones jouées, dans l&apos;ordre</h3>
      <div className="tableau-boite">
        <table>
          <thead><tr><th scope="col">Zone</th><th scope="col">Étapes</th><th scope="col">Début du parcours</th></tr></thead>
          <tbody>
            {g.zones.map((z) => (
              <tr key={z.lieu}>
                <td>{nomLieu(z.lieu)}</td>
                <td className="num">{z.etapes.length}</td>
                <td className="doux">{z.etapes.slice(0, 6).join(" · ")}{z.etapes.length > 6 ? " …" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {g.inconnues.length > 0 && (
        <>
          <h3>Quêtes que le guide ne connaît pas ({g.inconnues.length})</h3>
          <p className="doux">Souvent des quêtes propres à Forever : à saisir dans content/ajouts-forever.ts pour qu&apos;elles entrent dans le guide.</p>
          <ul>{g.inconnues.map((q) => <li key={q.id}>{q.titre} <span className="doux">(n° {q.id}, {lieu(q.lieu)})</span></li>)}</ul>
        </>
      )}

      {g.trajets.length > 0 && (
        <>
          <h3>Trajets ({g.trajets.length})</h3>
          <ul>{g.trajets.map((t, i) => <li key={i}>{t.nom} : {t.depart.zone} → {t.arrivee?.zone ?? "?"} ({minutes(t.duree)})</li>)}</ul>
        </>
      )}

      {g.exploits.length > 0 && (
        <>
          <h3>Élites et rares vaincus ({g.exploits.length})</h3>
          <ul>{g.exploits.map((x, i) => <li key={i}>{x.nom} <span className="doux">({x.classement}, {lieu(x.lieu)})</span></li>)}</ul>
        </>
      )}

      {v.pages.length > 0 && (
        <p className="doux">
          Guides concernés : {v.pages.map((p, i) => (
            <span key={`${p.race}-${p.classe}`}>{i ? ", " : ""}<Link href={`/guides/parcours/${p.race}/${p.classe}/`} target="_blank">{p.titre}</Link></span>
          ))}
        </p>
      )}

      {(l.etat === "a_valider" || l.etat === "retire") && (
        <div className="actions-bandeau" style={{ alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <form action={publier} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input type="hidden" name="id" value={l.id} />
            <label htmlFor={`portee-${l.id}`}>S&apos;applique à</label>
            <select id={`portee-${l.id}`} name="portee" defaultValue={l.portee}>
              {PORTEES.map((p) => <option key={p.valeur} value={p.valeur}>{p.libelle}</option>)}
            </select>
            <button type="submit" className="btn btn-or">Publier</button>
          </form>
          {l.etat === "a_valider" && (
            <form action={ecarter}><input type="hidden" name="id" value={l.id} /><button type="submit" className="btn btn-contour">Écarter</button></form>
          )}
        </div>
      )}
      {l.etat === "publie" && (
        <form action={retirer}><input type="hidden" name="id" value={l.id} /><button type="submit" className="btn btn-contour">Retirer du site</button></form>
      )}
    </article>
  );
}

/**
 * Guides à valider de Probe : coller le code de /ep export, relire ce qui a été joué, publier. Un guide publié passe en
 * tête de ses zones dans les pages du guide de 1 à 60, sans déploiement ; « Retirer » rend l'ordre d'avant.
 */
export default async function AdminProbe({ searchParams }: Props) {
  await exigerAdmin();
  const q = await searchParams;
  const [aValider, publies, archives] = await Promise.all([guidesProbe(["a_valider"]), guidesProbe(["publie"]), guidesProbe(["retire", "ecarte"])]);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Guides à valider de Probe</h1>
      <p className="doux">
        En jeu, tapez <code>/ep export</code> : la fenêtre montre un code déjà sélectionné. Ctrl+C, collez-le ci-dessous, puis relisez et publiez.
        Avant chaque publication, le site vérifie que l&apos;ordre reste jouable (prendre, faire, rendre, quête préalable d&apos;abord) dans chaque guide concerné.
      </p>
      {q.erreur && <p className="info" role="alert" style={{ borderColor: "#ff8d7a", color: "#ffd2c9", background: "rgba(255,141,122,0.08)" }}>{q.erreur}</p>}
      {q.ok && <p className="succes" role="status">Code lu : guide n° {q.ok} à relire ci-dessous.</p>}
      {q.publie && <p className="succes" role="status">Guide n° {q.publie} publié : les pages concernées se mettent à jour dans la minute.</p>}

      <form action={analyserCode} className="formulaire" style={{ maxWidth: 820, marginBottom: 32 }}>
        <div className="champ">
          <label htmlFor="code">Code de /ep export</label>
          <textarea id="code" name="code" required rows={6} placeholder="EP1:…" style={{ fontFamily: "monospace", fontSize: 12 }} />
        </div>
        <button type="submit" className="btn btn-or">Analyser le code</button>
      </form>

      <h2>À valider ({aValider.length})</h2>
      {aValider.length ? aValider.map((l) => <Fiche key={l.id} l={l} />) : <p className="doux">Aucun guide en attente.</p>}

      <h2 style={{ marginTop: 40 }}>Publiés ({publies.length})</h2>
      {publies.length ? publies.map((l) => <Fiche key={l.id} l={l} />) : <p className="doux">Aucun guide publié pour l&apos;instant.</p>}

      {archives.length > 0 && (
        <details style={{ marginTop: 40 }}>
          <summary>Retirés et écartés ({archives.length})</summary>
          {archives.map((l) => <Fiche key={l.id} l={l} />)}
        </details>
      )}
    </div>
  );
}
