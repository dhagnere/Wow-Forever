import { derniereRevue, lienFrancais, nomLangue } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Revue() {
  await exigerAdmin();
  const revue = await derniereRevue();
  if (!revue) {
    return (
      <>
        <h1 className="titre">Revue du jour</h1>
        <p className="doux">Aucun passage de veille pour l&apos;instant. Lancer <code>npm run veille:essai</code> pour un premier classement sans coût d&apos;API.</p>
      </>
    );
  }
  const b = revue.bilan;
  return (
    <>
      <h1 className="titre">Revue du {dateLongue(revue.creeLe)}</h1>
      <p className="doux">
        Passage « {revue.mode} » : {b.elementsLus} éléments lus, {b.sujetsRetenus} sujets retenus, {b.dejaTraites} déjà traités,{" "}
        {b.brouillons.length} brouillons créés, {b.echecs.length} échecs de rédaction.
      </p>
      {b.sources.some((s) => s.erreur) ? (
        <div className="alerte" style={{ marginBottom: 24 }}>
          <strong>Sources en échec :</strong>
          <ul>{b.sources.filter((s) => s.erreur).map((s) => <li key={s.id}>{s.nom} — {s.erreur}</li>)}</ul>
        </div>
      ) : null}
      <div className="tableau-boite">
        <table className="admin-table">
          <thead><tr><th scope="col">#</th><th scope="col">Score</th><th scope="col">Sujet</th><th scope="col">Sources</th></tr></thead>
          <tbody>
            {revue.sujets.map((s, i) => (
              <tr key={s.cle}>
                <td>{i + 1}</td>
                <td title={`sources ${s.detail.sources} · fraîcheur ${s.detail.fraicheur} · vidéo ${s.detail.video} · étranger ${s.detail.etranger}`}>{s.score}</td>
                <td>{s.titre}{s.dejaTraite ? <span className="doux"> · déjà traité</span> : null}</td>
                <td>
                  {s.elements.map((e) => {
                    const fr = lienFrancais(e.url, e.langue);
                    return (
                      <div key={e.url}>
                        <a href={fr.url} target="_blank" rel="noopener noreferrer nofollow">{e.source}</a>{" "}
                        <span className="doux">
                          ({fr.mode === "original" ? nomLangue(e.langue) : <>en français · <a href={e.url} target="_blank" rel="noopener noreferrer nofollow">original</a></>})
                        </span>
                      </div>
                    );
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
