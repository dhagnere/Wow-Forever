import Link from "next/link";
import { etatConfiguration, historiquePassages, passageEnCours, statistiques, type PassageJournal } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { lancerVeille } from "./actions";

export const dynamic = "force-dynamic";

const heure = (d: Date) => new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });

function duree(p: PassageJournal): string {
  if (!p.fin) return "en cours";
  const s = Math.round((new Date(p.fin).getTime() - new Date(p.debut).getTime()) / 1000);
  return s < 90 ? `${s} s` : `${Math.round(s / 60)} min`;
}

function Etat({ ok, oui = "Prêt", non = "À configurer" }: { ok: boolean; oui?: string; non?: string }) {
  return <span className={`pastille ${ok ? "pastille-ok" : "pastille-ko"}`}>{ok ? oui : non}</span>;
}

export default async function TableauDeBord({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const admin = await exigerAdmin();
  const { message } = await searchParams;
  const [stats, passages, enCours] = await Promise.all([statistiques(), historiquePassages(8), passageEnCours()]);
  const reglages = etatConfiguration();

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="titre" style={{ margin: 0 }}>Tableau de bord</h1>
        <Link href="/admin/veille/" className="btn btn-contour">Relire les brouillons</Link>
      </div>
      <p className="doux">Bonjour {admin.identifiant}. {stats.prochaineProgrammation ? `Prochaine publication programmée : ${heure(stats.prochaineProgrammation)}.` : "Aucune publication programmée."}</p>
      {message ? <p className="info" role="status">{message}</p> : null}

      <div className="chiffres">
        <Link className="chiffre" href="/admin/veille/?statut=brouillon"><strong>{stats.brouillons}</strong><span>brouillons à relire</span></Link>
        <Link className="chiffre" href="/admin/veille/?statut=programme"><strong>{stats.programmes}</strong><span>publications programmées</span></Link>
        <Link className="chiffre" href="/admin/veille/?statut=publie"><strong>{stats.publies7j}</strong><span>publiés ces 7 jours ({stats.publies} au total)</span></Link>
        <Link className={`chiffre${stats.facebookEchecs ? " alerte-chiffre" : ""}`} href="/admin/veille/?statut=publie">
          <strong>{stats.facebookEchecs}</strong><span>échecs Facebook · {stats.facebookAttente} en attente</span>
        </Link>
      </div>

      <div className="g2" style={{ alignItems: "start" }}>
        <section className="encadre">
          <h2>Veille</h2>
          <p className="doux" style={{ marginTop: 0, fontSize: 15 }}>
            Passage automatique chaque matin vers 6h40 (7h40 en heure d&apos;été). Vous pouvez aussi la lancer maintenant.
          </p>
          {enCours ? (
            <p className="info" role="status">Passage « {enCours.mode} » en cours depuis {heure(enCours.debut)}. Rechargez la page pour suivre.</p>
          ) : (
            <div className="actions-ligne" style={{ marginBottom: 16 }}>
              <form action={lancerVeille}>
                <input type="hidden" name="mode" value="quotidien" />
                <button type="submit" className="btn btn-or" disabled={!reglages.redaction}>Lancer la veille maintenant</button>
              </form>
              <form action={lancerVeille}>
                <input type="hidden" name="mode" value="essai" />
                <button type="submit" className="btn btn-contour">Classement seul, sans IA</button>
              </form>
            </div>
          )}
          <h2 style={{ marginTop: 8 }}>Derniers passages</h2>
          {passages.length === 0 ? (
            <p className="doux" style={{ fontSize: 15 }}>Aucun passage enregistré pour l&apos;instant.</p>
          ) : (
            <div className="tableau-boite">
              <table className="admin-table">
                <thead><tr><th scope="col">Début</th><th scope="col">Type</th><th scope="col">État</th><th scope="col">Bilan</th></tr></thead>
                <tbody>
                  {passages.map((p) => (
                    <tr key={p.id}>
                      <td>{heure(p.debut)}<br /><span className="doux">{duree(p)}</span></td>
                      <td>{p.mode === "quotidien" ? "Rédaction" : "Classement"}<br /><span className="doux">{p.declencheur}</span></td>
                      <td>
                        <span className={`pastille ${p.statut === "termine" ? "pastille-ok" : p.statut === "echec" ? "pastille-ko" : "pastille-attente"}`}>
                          {p.statut === "termine" ? "Terminé" : p.statut === "echec" ? "Échec" : "En cours"}
                        </span>
                      </td>
                      <td>{p.erreur ?? p.resume ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginBottom: 0 }}><Link href="/admin/veille/revue/">Voir la revue complète du dernier passage →</Link></p>
        </section>

        <section className="encadre">
          <h2>Réglages</h2>
          <ul className="liste-reglages">
            <li><span>Rédaction des brouillons (ANTHROPIC_API_KEY)</span><Etat ok={reglages.redaction} /></li>
            <li><span>Relais Facebook (FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN)</span><Etat ok={reglages.facebook} /></li>
            <li><span>Adresse publique (SITE_URL){reglages.siteUrl ? ` : ${reglages.siteUrl}` : ""}</span><Etat ok={Boolean(reglages.siteUrl)} oui="OK" /></li>
            <li><span>Brouillons rédigés par passage</span><strong>{reglages.brouillonsParJour}</strong></li>
          </ul>
          <p className="doux" style={{ fontSize: 14, marginBottom: 0 }}>Ces réglages se modifient dans Scalingo, onglet Environment. Un changement redémarre le site.</p>
        </section>
      </div>
    </>
  );
}
