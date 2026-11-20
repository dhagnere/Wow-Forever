import type { Metadata } from "next";
import { seriesButin } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { importer, majIcones, supprimerSerie } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Butin relevé" };

type Props = { searchParams: Promise<{ erreur?: string; ok?: string; supprime?: string; icones?: string }> };

export default async function AdminButin({ searchParams }: Props) {
  await exigerAdmin();
  const q = await searchParams;
  const series = await seriesButin();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Butin relevé en jeu</h1>
      <p className="doux" style={{ maxWidth: 820 }}>
        En jeu, l&apos;addon TaverneTrace note ce que donne chaque corps fouillé dans un donjon ou un raid. Tapez <code>/tt butin</code>, copiez le texte
        de la fenêtre (Ctrl+A, Ctrl+C) et collez-le ci-dessous. Sur la fiche du donjon, le butin relevé remplace le butin de l&apos;Azeroth d&apos;origine,
        boss par boss, avec la chance observée (fois vu / victoires). Recoller la même série remplace ses chiffres : rien n&apos;est compté deux fois.
      </p>
      {q.erreur && <p className="info" role="alert" style={{ borderColor: "#ff8d7a", color: "#ffd2c9", background: "rgba(255,141,122,0.08)" }}>{q.erreur}</p>}
      {q.ok && <p className="succes" role="status">Relevé enregistré : {q.ok}. Les fiches des donjons l&apos;affichent tout de suite.</p>}
      {q.supprime && <p className="succes" role="status">Série {q.supprime} supprimée.</p>}
      {q.icones && <p className="succes" role="status">{q.icones} Les images se chargent à la première visite de chaque fiche.</p>}

      <form action={majIcones} style={{ maxWidth: 820, marginBottom: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-contour">Mettre à jour les icônes du butin</button>
        <span className="doux" style={{ fontSize: 14 }}>
          Objets d&apos;origine absents de Forever : l&apos;icône est relue dans les fichiers de Classic Era (wago.tools). Fait aussi chaque nuit par l&apos;import de la base.
        </span>
      </form>

      <form action={importer} className="formulaire" style={{ maxWidth: 820, marginBottom: 32 }}>
        <div className="champ">
          <label htmlFor="texte">Texte de /tt butin</label>
          <textarea id="texte" name="texte" required rows={8} placeholder={"TTB1\nv|1.2.0\ns|…"} style={{ fontFamily: "monospace", fontSize: 12 }} />
        </div>
        <button type="submit" className="btn btn-or">Importer le relevé</button>
      </form>

      <h2>Séries importées ({series.length})</h2>
      {series.length ? (
        <div className="tableau-boite">
          <table>
            <thead><tr><th scope="col">Série</th><th scope="col">Mise à jour</th><th scope="col" className="num">Créatures</th><th scope="col" className="num">Victoires</th><th scope="col" className="num">Objets</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.serie}>
                  <td><code>{s.serie}</code></td>
                  <td>{dateLongue(s.majLe)}</td>
                  <td className="num">{s.creatures}</td>
                  <td className="num">{s.victoires}</td>
                  <td className="num">{s.objets}</td>
                  <td>
                    <form action={supprimerSerie}>
                      <input type="hidden" name="serie" value={s.serie} />
                      <button type="submit" className="btn btn-contour">Supprimer</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="doux">Aucun relevé importé pour l&apos;instant.</p>}
    </div>
  );
}
