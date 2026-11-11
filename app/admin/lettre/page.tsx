import type { Metadata } from "next";
import Link from "next/link";
import { chiffresAbonnes, courrielConfigure, lireEnvoi, listerEnvois, markdownVersHtml, plafondJour, type EnvoiLettre } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { enregistrerLettre, importerLettre, importerPreparee, supprimerLettre } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lettre" };

type Props = { searchParams: Promise<{ id?: string; ok?: string; erreur?: string; n?: string }> };

const MESSAGES: Record<string, string> = {
  enregistre: "Brouillon enregistré.",
  essai: "Essai envoyé : vérifiez la boîte de réception.",
  lance: "Envoi lancé : les premiers messages sont partis ; s'il en reste au-delà du plafond du jour, ils partent chaque heure (à h 25).",
  supprime: "Brouillon supprimé.",
  import: "Import terminé.",
  preparee: "Lettre préparée importée en brouillon, avec son édition dans l'autre langue ; elle paraît déjà dans le Carnet. Relisez-la, envoyez l'essai, puis lancez l'envoi.",
  vide: "Le sujet et le texte sont obligatoires.",
  "essai-adresse": "L'adresse d'essai n'est pas valide.",
  envoi: "L'essai n'est pas parti : vérifiez RESEND_API_KEY, COURRIEL_EXPEDITEUR et le domaine chez Resend (journal de l'application).",
  relu: "Cochez la case « J'ai relu l'essai » avant de lancer l'envoi.",
  consentement: "Cochez la case de consentement avant d'importer des adresses.",
  "preparee-inconnue": "Lettre préparée introuvable.",
};

const STATUTS: Record<EnvoiLettre["statut"], string> = { brouillon: "Brouillon", en_cours: "Envoi en cours", termine: "Envoyée" };

export default async function AdminLettre({ searchParams }: Props) {
  await exigerAdmin();
  const p = await searchParams;
  const [chiffres, envois, courant] = await Promise.all([chiffresAbonnes(), listerEnvois(), p.id ? lireEnvoi(Number(p.id)) : null]);
  const brouillon = courant?.statut === "brouillon" ? courant : null;
  const message = p.erreur ? MESSAGES[p.erreur] : p.ok ? MESSAGES[p.ok] : null;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>La Lettre</h1>
      {!courrielConfigure() ? (
        <p className="info" role="note">L&apos;envoi n&apos;est pas configuré : ajoutez RESEND_API_KEY et COURRIEL_EXPEDITEUR chez Scalingo (voir LETTRE.md). Les inscriptions annoncent une ouverture prochaine.</p>
      ) : null}
      {message ? <p className={p.erreur ? "erreur" : "info"} role="status">{message}{p.n ? ` (${p.n})` : ""}</p> : null}

      <p className="doux">
        Abonnés confirmés : <strong>{chiffres.fr}</strong> en français, <strong>{chiffres.en}</strong> en anglais · {chiffres.enAttente} inscription(s) en attente de
        confirmation (effacées après 7 jours) · plafond : {plafondJour()} messages de Lettre par jour.
      </p>

      {LETTRES_PREPAREES.length ? (
        <section style={{ marginBottom: 32 }}>
          <h2>Brouillons préparés</h2>
          <p className="doux">Préparés chaque semaine à partir des vidéos du Journal (voir <Link href="/admin/videos/">Vidéos</Link>). L&apos;import crée le brouillon français et l&apos;anglais de la même semaine ; ils paraissent aussitôt sous les épisodes du Carnet (version anglaise sur <Link href="/en/notebook/">/en/notebook/</Link>), mais rien ne part aux abonnés sans essai ni lancement.</p>
          <div className="tableau-boite">
            <table>
              <thead><tr><th scope="col">Semaine</th><th scope="col">Édition</th><th scope="col">Sujet</th><th scope="col"></th></tr></thead>
              <tbody>
                {[...LETTRES_PREPAREES].sort((a, b) => b.semaine.localeCompare(a.semaine) || a.langue.localeCompare(b.langue)).map((l) => {
                  const deja = envois.find((e) => e.langue === l.langue && e.sujet === l.sujet);
                  return (
                    <tr key={l.id}>
                      <td>{l.semaine}</td>
                      <td>{l.langue === "en" ? "Anglaise" : "Française"}</td>
                      <td>{l.sujet}</td>
                      <td>
                        {deja ? (
                          deja.statut === "brouillon" ? <Link href={`/admin/lettre/?id=${deja.id}`}>Déjà importée : ouvrir</Link> : <span className="doux">{STATUTS[deja.statut]}</span>
                        ) : (
                          <form action={importerPreparee}><input type="hidden" name="preparee" value={l.id} /><button type="submit" className="btn btn-contour btn-petit">Importer en brouillon</button></form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <h2>{brouillon ? `Modifier le brouillon n° ${brouillon.id}` : "Nouvelle Lettre"}</h2>
      <form action={enregistrerLettre} className="formulaire" style={{ maxWidth: 820 }}>
        {brouillon ? <input type="hidden" name="id" value={brouillon.id} /> : null}
        <div className="champ">
          <label htmlFor="l-langue">Édition</label>
          <select id="l-langue" name="langue" defaultValue={brouillon?.langue ?? "fr"}>
            <option value="fr">Française (abonnés de /lettre/)</option>
            <option value="en">Anglaise (abonnés de /en/newsletter/)</option>
          </select>
        </div>
        <div className="champ">
          <label htmlFor="l-sujet">Sujet</label>
          <input id="l-sujet" type="text" name="sujet" required maxLength={200} defaultValue={brouillon?.sujet ?? ""} />
        </div>
        <div className="champ">
          <label htmlFor="l-corps">Texte</label>
          <textarea id="l-corps" name="corps" required className="grand" defaultValue={brouillon?.corps ?? ""} />
          <small>Markdown : ## intertitre, **gras**, [lien](https://…). Le lien de désinscription est ajouté en bas de chaque message.</small>
        </div>
        <div className="actions-bandeau" style={{ alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <button type="submit" name="action" value="enregistrer" className="btn btn-contour">Enregistrer</button>
          <input name="essai" type="text" inputMode="email" autoComplete="email" placeholder="adresse pour l'essai" style={{ minWidth: 260, width: "auto" }} aria-label="Adresse pour l'essai" />
          <button type="submit" name="action" value="essai" className="btn btn-contour">Envoyer un essai</button>
        </div>
        <div className="actions-bandeau" style={{ alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="relu" value="oui" /> J&apos;ai relu l&apos;essai</label>
          <button type="submit" name="action" value="lancer" className="btn btn-or">Lancer l&apos;envoi aux abonnés</button>
        </div>
      </form>

      {brouillon ? (
        <section style={{ marginTop: 24 }}>
          <h2>Aperçu</h2>
          {/* Contenu filtré par markdownVersHtml (garde-fou « Filtrage du HTML »). */}
          <div className="encadre corps" style={{ maxWidth: 680 }} dangerouslySetInnerHTML={{ __html: markdownVersHtml(brouillon.corps) }} />
        </section>
      ) : null}

      <h2>Lettres</h2>
      {envois.length ? (
        <div className="tableau-boite">
          <table>
            <thead><tr><th scope="col">Sujet</th><th scope="col">Édition</th><th scope="col">Statut</th><th scope="col">Envois</th><th scope="col">Date</th><th scope="col"></th></tr></thead>
            <tbody>
              {envois.map((e) => (
                <tr key={e.id}>
                  <td>{e.statut === "brouillon" ? <Link href={`/admin/lettre/?id=${e.id}`}>{e.sujet}</Link> : e.sujet}</td>
                  <td>{e.langue === "en" ? "Anglaise" : "Française"}</td>
                  <td>{STATUTS[e.statut]}</td>
                  <td>{e.statut === "brouillon" ? "—" : `${e.envoyes} / ${e.destinataires}${e.echecs ? ` · ${e.echecs} en échec` : ""}`}</td>
                  <td className="doux">{dateLongue(e.lanceLe ?? e.creeLe)}</td>
                  <td>
                    {e.statut === "brouillon" ? (
                      <form action={supprimerLettre}><input type="hidden" name="id" value={e.id} /><button type="submit" className="btn btn-danger btn-petit">Supprimer</button></form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="doux">Aucune Lettre pour l&apos;instant.</p>
      )}

      <h2>Reprendre des abonnés</h2>
      <p className="doux">
        Collez l&apos;export CSV de l&apos;ancien prestataire, ou une adresse par ligne : seules les adresses sont lues. Elles sont inscrites sans nouveau message de
        confirmation : n&apos;importez que des personnes qui ont déjà confirmé leur inscription.
      </p>
      <form action={importerLettre} className="formulaire" style={{ maxWidth: 820 }}>
        <div className="champ">
          <label htmlFor="i-langue">Édition</label>
          <select id="i-langue" name="langue" defaultValue="fr"><option value="fr">Française</option><option value="en">Anglaise</option></select>
        </div>
        <div className="champ">
          <label htmlFor="i-adresses">Adresses</label>
          <textarea id="i-adresses" name="adresses" required />
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="consentement" value="oui" /> Ces personnes ont confirmé leur inscription à la Lettre
        </label>
        <div><button type="submit" className="btn btn-contour">Importer</button></div>
      </form>
    </div>
  );
}
