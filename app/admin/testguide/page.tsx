import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { nomLieu } from "@/lib/quetes";
import { QUETES_FOREVER } from "@/content/ajouts-forever";
import { cleGuide, ficheGuide, nomRace, raceGuide } from "@/lib/guide";
import { trouverClasse } from "@/content/classes";
import { VIDEOS_ANALYSEES, type VideoAnalysee } from "@/content/analyses-videos";
import { CopierBloc } from "./Copier";
import { appliquerRemarques } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "TestGuide — analyse des vidéos" };

type Props = { searchParams: Promise<{ ok?: string }> };

const ACTIONS = { prendre: "Prendre", faire: "Faire", rendre: "Rendre" } as const;
const STATUTS = { traitee: "Analysée", ecartee: "Écartée", "a-traiter": "À analyser" } as const;

const FOREVER = new Map(QUETES_FOREVER.map((q) => [q.id, q]));

function titreQuete(id: number): string {
  return FOREVER.get(id)?.titre ?? ficheGuide(id)?.t ?? `Quête #${id}`;
}
function niveauQuete(id: number): string {
  const f = FOREVER.get(id);
  if (f) return String(f.niveau);
  const n = ficheGuide(id)?.nv;
  return n ? String(n) : "?";
}
function objectifsQuete(id: number): string[] {
  return FOREVER.get(id)?.objectifs ?? ficheGuide(id)?.obj ?? [];
}
function blocRemarques(v: VideoAnalysee): string {
  return v.remarques.map((r) => `${r.etape} | ${r.verifie ? "oui" : "non"} | ${r.remarque}`).join("\n");
}

export default async function TestGuide({ searchParams }: Props) {
  await exigerAdmin();
  const { ok } = await searchParams;
  const videos = VIDEOS_ANALYSEES;

  // Regroupement par race · classe, pour une lecture claire.
  const groupes = new Map<string, VideoAnalysee[]>();
  for (const v of videos) {
    const r = raceGuide(v.race);
    const c = v.classe ? trouverClasse(v.classe) : null;
    const libelle = `${r ? nomRace(r) : v.race || "race ?"} · ${c ? c.nom : "toutes classes"}`;
    if (!groupes.has(libelle)) groupes.set(libelle, []);
    groupes.get(libelle)!.push(v);
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>TestGuide — analyse des vidéos</h1>
      <p className="doux">
        Brouillon de travail : l&apos;analyse de chaque vidéo de jeu (procédure <code>VIDEOS.md</code>, sans guide commercial) donne un parcours relevé,
        d&apos;éventuelles quêtes de Forever manquantes et un bloc de remarques. On relit ici avant de reporter dans{" "}
        <code>content/parcours-releves.ts</code>, <code>content/ajouts-forever.ts</code> et la relecture du guide.
      </p>

      {ok ? (
        <p className="info" role="status">Remarques de la vidéo « {videos.find((v) => v.id === ok)?.titre ?? ok} » appliquées au guide.</p>
      ) : null}

      <section>
        <h2>Vidéos ({videos.length})</h2>
        <div className="tableau-boite">
          <table>
            <thead>
              <tr><th scope="col">Vidéo</th><th scope="col">Zone</th><th scope="col">Race · Classe</th><th scope="col">Durée</th><th scope="col">Statut</th></tr>
            </thead>
            <tbody>
              {videos.map((v) => {
                const r = raceGuide(v.race);
                return (
                  <tr key={v.id}>
                    <td><a href={`#${v.id}`}>{v.titre}</a></td>
                    <td>{v.lieu ? nomLieu(v.lieu) : "—"}</td>
                    <td>{r ? nomRace(r) : v.race || "—"}{v.classe ? ` · ${trouverClasse(v.classe)?.nom ?? v.classe}` : ""}</td>
                    <td className="doux">{v.duree || "—"}</td>
                    <td>{STATUTS[v.statut]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {[...groupes.entries()].map(([libelle, groupeVideos]) => (
        <div key={libelle} style={{ margin: "28px 0" }}>
          <h2 style={{ margin: "0 0 8px", padding: "8px 14px", background: "var(--surface-chaude, #33231a)", borderLeft: "4px solid var(--or)", borderRadius: 4, fontSize: 20 }}>
            {libelle} <span className="doux" style={{ fontWeight: 400, fontSize: 15 }}>· {groupeVideos.length} vidéo{groupeVideos.length > 1 ? "s" : ""}</span>
          </h2>
          {groupeVideos.map((v) => {
        const r = raceGuide(v.race);
        const c = v.classe ? trouverClasse(v.classe) : null;
        const guideKey = r && c ? cleGuide(r, c.slug) : null;
        return (
          <section key={v.id} id={v.id} style={{ margin: "16px 0" }} className="encadre">
            <h2 style={{ marginTop: 0 }}>
              {v.titre} <span className="doux" style={{ fontWeight: 400, fontSize: 16 }}>· {v.date || "date à déterminer"} · {v.duree || "durée à déterminer"}</span>
            </h2>
            <p className="doux" style={{ marginTop: 0 }}>
              {v.lieu ? nomLieu(v.lieu) : "Zone à déterminer"} · {r ? nomRace(r) : v.race || "race à déterminer"}{c ? ` · ${c.nom}` : ""} ·{" "}
              <strong>{STATUTS[v.statut]}</strong> · <a href={v.source} target="_blank" rel="noreferrer">source</a>
            </p>

            {v.statut === "ecartee" ? <p className="doux">Écartée : {v.motif}</p> : null}
            {v.statut === "a-traiter" ? <p className="doux">Vidéo non encore analysée. Télécharger, vérifier l&apos;absence de guide commercial, puis relever le parcours.</p> : null}

            {v.statut === "traitee" ? (
              <>
                <h3>Parcours relevé ({v.etapes.length} étapes)</h3>
                <ol style={{ margin: "6px 0 0", paddingLeft: 22 }}>
                  {v.etapes.map((e, i) => (
                    <li key={i} style={{ margin: "4px 0" }}>
                      <strong>{ACTIONS[e.a]}</strong> « {titreQuete(e.q)} » <span className="doux">(niv. {niveauQuete(e.q)})</span>
                      {e.moment ? <span className="doux"> · {e.moment}</span> : null}
                      {e.a === "faire" ? (
                        <div className="doux" style={{ fontSize: 14 }}>{objectifsQuete(e.q).join(" · ") || "objectifs non relevés"}</div>
                      ) : null}
                      {e.note ? <div className="doux" style={{ fontSize: 14 }}>{e.note}</div> : null}
                    </li>
                  ))}
                </ol>

                {v.ajouts.length ? (
                  <>
                    <h3>Quêtes de Forever relevées ({v.ajouts.length})</h3>
                    <ul style={{ margin: "6px 0 0" }}>
                      {v.ajouts.map((id) => {
                        const q = FOREVER.get(id);
                        if (!q) return null;
                        return (
                          <li key={id}>
                            <strong>{q.titre}</strong> <span className="doux">(id {q.id}, niv. {q.niveau})</span> — {q.donneur.nom} ({q.donneur.x}, {q.donneur.y})
                            {q.rendre ? <> → {q.rendre.nom} ({q.rendre.x}, {q.rendre.y})</> : null}
                            {q.objectifs?.length ? <div className="doux" style={{ fontSize: 14 }}>{q.objectifs.join(" · ")}</div> : null}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}

                {v.remarques.length ? (
                  <>
                    <h3>Bloc de remarques ({v.remarques.length} lignes)</h3>
                    <CopierBloc id={`bloc-${v.id}`} texte={blocRemarques(v)} />
                    {guideKey ? (
                      <form action={appliquerRemarques} style={{ marginTop: 6 }}>
                        <input type="hidden" name="video" value={v.id} />
                        <button type="submit" className="btn btn-or">Appliquer au guide {r ? nomRace(r) : ""} {c?.nom.toLowerCase()}</button>
                      </form>
                    ) : null}
                    <p className="doux" style={{ fontSize: 14, marginTop: 6 }}>
                      Ou copiez le bloc puis collez-le dans{" "}
                      <Link href={guideKey ? `/admin/guides/${v.race}/${v.classe}/` : "/admin/guides/"}>la relecture du guide</Link> (champ « Importer des remarques »).
                    </p>
                  </>
                ) : null}

                {v.observations?.length ? (
                  <>
                    <h3>Observations</h3>
                    <ul style={{ margin: "6px 0 0" }}>{v.observations.map((o, i) => <li key={i}>{o}</li>)}</ul>
                  </>
                ) : null}
              </>
            ) : null}
          </section>
        );
          })}
        </div>
      ))}
    </div>
  );
}
