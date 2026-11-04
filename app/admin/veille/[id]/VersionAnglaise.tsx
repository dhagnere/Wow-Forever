import Link from "next/link";
import { empreinteTraduction, lireTraduction, type Article } from "@/modules/veille";
import { enregistrerAnglais, retirerAnglais, traduireMaintenant } from "../actions";

const MESSAGES: Record<string, [string, string]> = {
  traduit: ["succes", "Version anglaise mise à jour."],
  enregistre: ["succes", "Version anglaise enregistrée. La traduction automatique ne l'écrasera plus."],
  retire: ["info", "Version anglaise retirée. Elle sera refaite au prochain passage de la traduction automatique."],
};

const date = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(d);

/**
 * Version anglaise de l'article (/en/articles/<slug>/) : traduite par l'IA après publication, à relire et corriger ici.
 * L'avis anglais est la traduction de l'avis de Jobwow, jamais un avis produit sans lui.
 */
export async function VersionAnglaise({ a, retour }: { a: Article; retour?: string }) {
  const t = await lireTraduction(a.id);
  const message = retour ? MESSAGES[retour] ?? ["alerte", retour] : null;
  const aJour = t ? t.empreinte === empreinteTraduction(a) : false;
  return (
    <section id="anglais" className="encadre" style={{ marginTop: 32 }}>
      <h2>Version anglaise</h2>
      {message ? <p className={message[0]} role="status">{message[1]}</p> : null}
      {a.statut !== "publie" ? (
        <p className="doux" style={{ margin: 0 }}>Traduite automatiquement dans l&apos;heure qui suit la publication (tâche veille:traduire).</p>
      ) : (
        <>
          <p style={{ margin: "0 0 12px" }}>
            {t ? (
              <>
                Traduite le {date(t.traduitLe)}{t.manuel ? ", corrigée à la main" : ", automatiquement"} ·{" "}
                {aJour ? "à jour" : <strong>le texte français a changé depuis{t.manuel ? " : à revoir" : " : retraduction au prochain passage"}</strong>} ·{" "}
                <Link href={`/en/articles/${a.slug}/`} target="_blank">voir en anglais</Link>
              </>
            ) : "Pas encore traduite : elle le sera dans l'heure, ou tout de suite avec le bouton ci-dessous."}
          </p>
          {t?.erreur ? <p className="alerte" style={{ fontSize: 14 }}>Dernier échec : {t.erreur}</p> : null}
          <div className="actions-bandeau" style={{ marginTop: 0, marginBottom: 16 }}>
            <form action={traduireMaintenant.bind(null, a.id)}>
              <button type="submit" className="btn btn-or">{t ? "Retraduire maintenant" : "Traduire maintenant"}</button>
            </form>
            {t ? <form action={retirerAnglais.bind(null, a.id)}><button type="submit" className="btn btn-contour">Retirer la version anglaise</button></form> : null}
          </div>
          {t ? (
            <details>
              <summary>Relire et corriger la version anglaise</summary>
              <form action={enregistrerAnglais.bind(null, a.id)} className="formulaire-compte" style={{ marginTop: 14 }}>
                <div className="champ"><label htmlFor="en-titre">Title</label><input id="en-titre" name="titre" defaultValue={t.titre} maxLength={160} /></div>
                <div className="champ"><label htmlFor="en-chapo">Standfirst</label><textarea id="en-chapo" name="chapo" rows={3} defaultValue={t.chapo} /></div>
                <div className="champ"><label htmlFor="en-corps">Body (Markdown)</label><textarea id="en-corps" name="corps" rows={18} defaultValue={t.corps} /></div>
                <div className="champ"><label htmlFor="en-avis">Jobwow&apos;s take (translation of the French avis)</label><textarea id="en-avis" name="avis" rows={5} defaultValue={t.avis} /></div>
                <div className="champ"><label htmlFor="en-legende">Image caption</label><input id="en-legende" name="legende" defaultValue={t.legende} maxLength={200} /></div>
                <div className="champ"><label htmlFor="en-description">Google description</label><input id="en-description" name="description" defaultValue={t.description} maxLength={170} /></div>
                <div className="champ"><label htmlFor="en-etiquettes">Tags (comma-separated)</label><input id="en-etiquettes" name="etiquettes" defaultValue={t.etiquettes.join(", ")} /></div>
                <button type="submit" className="btn btn-or">Enregistrer la version anglaise</button>
              </form>
            </details>
          ) : null}
        </>
      )}
    </section>
  );
}
