import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lireRelecture } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { trouverClasse } from "@/content/classes";
import { cleGuide, combinaisons, etapesRelevees, guidePour, nomRace, ordreDuGuide, raceGuide, versionGuide, type EtapeGuide, type TypeAction } from "@/lib/guide";
import { nomLieu } from "@/lib/quetes";
import { enregistrerZone, importerRemarques } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Relecture d'un guide" };

type Props = { params: Promise<{ race: string; classe: string }>; searchParams: Promise<{ ok?: string; importees?: string }> };

const ACTIONS: Record<TypeAction, string> = { prendre: "Prendre", faire: "Faire", rendre: "Rendre" };

function detail(a: TypeAction, e: EtapeGuide): string {
  if (a === "prendre") return `auprès de ${e.gn || "[donneur inconnu]"}`;
  if (a === "rendre") return `à ${e.rn || "[receveur inconnu]"}${e.rl ? ` (${nomLieu(e.rl)})` : ""}`;
  return e.obj.length ? e.obj.join(" · ") : "objectifs non relevés dans les données";
}

export default async function RelectureGuide({ params, searchParams }: Props) {
  await exigerAdmin();
  const p = await params;
  const race = raceGuide(p.race);
  const classe = trouverClasse(p.classe);
  if (!race || !classe || !combinaisons().some((c) => c.race.slug === race.slug && c.classe.slug === classe.slug)) notFound();
  const { ok, importees } = await searchParams;
  const guide = cleGuide(race, classe.slug);
  const chemin = `/admin/guides/${race.slug}/${classe.slug}/`;
  const publique = `/guides/parcours/${race.slug}/${classe.slug}/`;
  const notes = await lireRelecture(guide);

  let numero = 0;
  const zones = guidePour(race, classe.slug).map((z) => {
    const relevees = etapesRelevees(z, race, classe.slug);
    const lignes = ordreDuGuide(z, race, classe.slug).flatMap((arret) =>
      arret.actions.map((act) => {
        // act.q : rang de la quête dans la zone ; la clé garde l'identifiant de la quête, stable d'une version à l'autre.
        const e = z.etapes[act.q];
        const cle = `${act.a}:${e.id}`;
        return { cle, numero: ++numero, a: act.a, e, ailleurs: arret.type === "ailleurs", note: notes.get(cle), releve: relevees.has(cle) };
      }),
    );
    return { lieu: z.lieu, nom: nomLieu(z.lieu), niveaux: z.niveaux, lignes, verifiees: lignes.filter((l) => l.note?.verifie).length };
  });
  const total = zones.reduce((s, z) => s + z.lignes.length, 0);
  const verifiees = zones.reduce((s, z) => s + z.verifiees, 0);
  const remarques = zones.flatMap((z) => z.lignes.filter((l) => l.note?.remarque).map((l) => ({ ...l, zone: z.nom })));
  const version = versionGuide();

  return (
    <div>
      <p className="doux" style={{ margin: 0 }}><Link href="/admin/guides/">← Tous les guides</Link></p>
      <h1 style={{ marginTop: 8 }}>Relecture : {nomRace(race)} {classe.nom.toLowerCase()}</h1>
      <p className="doux">
        {zones.length} zones, {total} étapes · <strong>{verifiees}</strong> vérifiées en jeu ({Math.round((100 * verifiees) / Math.max(1, total))} %) ·{" "}
        {remarques.length} remarque(s) · données du jeu {version?.jeu ?? "?"} · <Link href={publique} target="_blank">voir le guide public et ses cartes</Link>
      </p>
      <p className="doux" style={{ fontSize: 14 }}>
        Cochez « vérifié » quand l&apos;étape se passe en jeu comme indiqué. Sinon, décrivez l&apos;écart en quelques mots (PNJ ailleurs, quête absente, niveau trop
        bas, autre ordre plus pratique). Enregistrez zone par zone.
      </p>

      {importees ? <p className="info" role="status">{importees} étape(s) importée(s).</p> : null}
      <details style={{ margin: "12px 0" }}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Importer des remarques</summary>
        <form action={importerRemarques} style={{ marginTop: 8 }}>
          <input type="hidden" name="guide" value={guide} />
          <input type="hidden" name="chemin" value={chemin} />
          <div className="champ">
            <label htmlFor="i-remarques">Une étape par ligne : <code>prendre:4641 | oui | remarque</code></label>
            <textarea id="i-remarques" name="remarques" required placeholder={"prendre:4641 | oui |\nprendre:788 | non | Gornek la propose après le rendu"} />
            <small>« oui » coche « vérifié en jeu ». Une étape absente du bloc garde sa note ; une ligne sans « oui » ni remarque l&apos;efface.</small>
          </div>
          <p><button type="submit" className="btn btn-contour">Importer</button></p>
        </form>
      </details>

      {remarques.length ? (
        <section className="encadre" style={{ margin: "16px 0" }}>
          <h2 style={{ marginTop: 0 }}>Remarques de ce guide</h2>
          <ul style={{ margin: 0 }}>
            {remarques.map((r) => (
              <li key={r.cle}><a href={`#etape-${r.cle.replace(":", "-")}`}>n° {r.numero} · {ACTIONS[r.a]} « {r.e.t} »</a> <span className="doux">({r.zone})</span> : {r.note!.remarque}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {zones.map((z) => (
        <details key={z.lieu} id={`zone-${z.lieu}`} open={ok === z.lieu || (z.verifiees < z.lignes.length && z === zones.find((x) => x.verifiees < x.lignes.length))} style={{ margin: "14px 0" }}>
          <summary style={{ cursor: "pointer", fontSize: 19, fontWeight: 700 }}>
            {z.nom} <span className="doux" style={{ fontWeight: 400, fontSize: 15 }}>· niveaux {z.niveaux[0]} à {z.niveaux[1]} · {z.verifiees} / {z.lignes.length} vérifiées</span>
          </summary>
          {ok === z.lieu ? <p className="info" role="status">Zone enregistrée.</p> : null}
          <p className="doux" style={{ margin: "6px 0" }}><Link href={`${publique}#zone-${z.lieu}`} target="_blank">Carte de la zone dans le guide public</Link></p>
          <form action={enregistrerZone}>
            <input type="hidden" name="guide" value={guide} />
            <input type="hidden" name="chemin" value={chemin} />
            <input type="hidden" name="zone" value={z.lieu} />
            <input type="hidden" name="etapes" value={z.lignes.map((l) => l.cle).join(",")} />
            <div className="tableau-boite">
              <table>
                <thead>
                  <tr><th scope="col">N°</th><th scope="col">Étape</th><th scope="col">Vérifié</th><th scope="col" style={{ minWidth: 260 }}>Remarque</th></tr>
                </thead>
                <tbody>
                  {z.lignes.map((l) => (
                    <tr key={l.cle} id={`etape-${l.cle.replace(":", "-")}`}>
                      <td className="doux">{l.numero}</td>
                      <td>
                        <strong>{ACTIONS[l.a]}</strong> « {l.e.t} »{" "}
                        <span className="doux">
                          niv. {l.e.nv}{l.e.cl ? " · quête de classe" : ""}{l.e.grp ? " · en groupe" : ""}{l.ailleurs ? " · hors de la zone" : ""}{l.releve ? " · relevé en vidéo" : ""}
                        </span>
                        <br />
                        <span className="doux" style={{ fontSize: 14 }}>{detail(l.a, l.e)}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" name={`v:${l.cle}`} value="oui" defaultChecked={!!l.note?.verifie} aria-label={`Étape ${l.numero} vérifiée en jeu`} />
                      </td>
                      <td>
                        <input type="text" name={`r:${l.cle}`} defaultValue={l.note?.remarque ?? ""} maxLength={1000} aria-label={`Remarque sur l'étape ${l.numero}`} style={{ width: "100%" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p><button type="submit" className="btn btn-or">Enregistrer {z.nom}</button></p>
          </form>
        </details>
      ))}
    </div>
  );
}
