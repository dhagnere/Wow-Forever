import Link from "next/link";
import { SOURCES } from "@/config/sources";
import { testerSources, type EtatSource } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateCourte } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Sources({ searchParams }: { searchParams: Promise<{ tester?: string }> }) {
  await exigerAdmin();
  const tester = (await searchParams).tester === "1";
  const resultats: Map<string, EtatSource> | null = tester ? new Map((await testerSources()).map((r) => [r.id, r])) : null;
  const echecs = resultats ? [...resultats.values()].filter((r) => r.erreur).length : 0;

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="titre" style={{ margin: 0 }}>Sources surveillées</h1>
        <Link href="/admin/sources/?tester=1" className="btn btn-or">{tester ? "Tester de nouveau" : "Tester toutes les sources"}</Link>
      </div>
      <p className="doux">
        {SOURCES.length} flux lus chaque matin. Le test interroge chacun d&apos;eux maintenant (une vingtaine de secondes), sans rien écrire ni rien coûter.
        La liste se modifie dans <code>config/sources.ts</code>.
      </p>
      {resultats ? (
        <p className={echecs ? "alerte" : "info"} role="status">
          {SOURCES.length - echecs} source(s) répondent, {echecs} en échec.{echecs ? " Corrigez ou retirez les sources en échec dans config/sources.ts." : ""}
        </p>
      ) : null}
      <div className="tableau-boite">
        <table className="admin-table">
          <thead>
            <tr><th scope="col">Source</th><th scope="col">Langue</th><th scope="col">Poids</th>{resultats ? <><th scope="col">État</th><th scope="col">Éléments</th><th scope="col">Plus récent</th></> : null}</tr>
          </thead>
          <tbody>
            {SOURCES.map((s) => {
              const r = resultats?.get(s.id);
              return (
                <tr key={s.id}>
                  <td>{s.nom}{s.video ? <span className="doux"> · vidéo</span> : null}<br /><a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="doux" style={{ fontSize: 13, wordBreak: "break-all" }}>{s.url.length > 70 ? `${s.url.slice(0, 70)}…` : s.url}</a></td>
                  <td>{s.langue}</td>
                  <td>{s.poids}</td>
                  {resultats ? (
                    <>
                      <td>{r?.erreur ? <><span className="pastille pastille-ko">Échec</span><br /><span className="doux" style={{ fontSize: 13 }}>{r.erreur}</span></> : <span className="pastille pastille-ok">OK</span>}</td>
                      <td>{r?.elements ?? "—"}</td>
                      <td>{r?.plusRecent ? dateCourte(r.plusRecent) : "—"}</td>
                    </>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
