import type { Metadata } from "next";
import Link from "next/link";
import { guildesARelire, guildesPubliees, type Guilde } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { CarteGuilde } from "@/components/Guildes";
import { dateLongue } from "@/lib/site";
import { decider } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Guildes" };

function Decision({ g, publier }: { g: Guilde; publier: boolean }) {
  return (
    <form action={decider} className="actions-guilde" style={{ marginTop: 10 }}>
      <input type="hidden" name="id" value={g.id} />
      {publier ? <button type="submit" name="decision" value="publier" className="btn btn-or btn-petit">{g.statut === "publiee" ? "Valider les modifications" : "Publier"}</button> : null}
      <button type="submit" name="decision" value="refuser" className="btn btn-contour btn-petit">Refuser</button>
      <button type="submit" name="decision" value="supprimer" className="btn btn-danger btn-petit">Supprimer</button>
    </form>
  );
}

export default async function AdminGuildes() {
  await exigerAdmin();
  const [aRelire, publiees] = await Promise.all([guildesARelire(), guildesPubliees()]);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Tableau des guildes</h1>
      <p className="doux">
        Relisez chaque fiche avant publication : guilde francophone de WoW Forever, ni vente d&apos;or ni service payant, ton correct, liens qui
        mènent bien à la guilde. <Link href="/guildes/" target="_blank">Voir le tableau public</Link>
      </p>

      <h2>À relire ({aRelire.length})</h2>
      {aRelire.length ? (
        <div className="grille-guildes">
          {aRelire.map((g) => (
            <div key={g.id}>
              <p className="doux" style={{ fontSize: 13, margin: "0 0 6px" }}>
                {g.statut === "publiee" ? "Modifiée" : "Nouvelle"} · déposée le {dateLongue(g.creeLe)} · mise à jour le {dateLongue(g.majLe)}
              </p>
              <CarteGuilde g={g} complete />
              <Decision g={g} publier />
            </div>
          ))}
        </div>
      ) : <p className="doux">Rien à relire.</p>}

      <h2 style={{ marginTop: 40 }}>Publiées ({publiees.length})</h2>
      {publiees.length ? (
        <div className="tableau-boite">
          <table>
            <thead><tr><th scope="col">Guilde</th><th scope="col">Serveur</th><th scope="col">Mise à jour</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {publiees.map((g) => (
                <tr key={g.id}>
                  <td><Link href={`/guildes/${g.slug}/`} target="_blank">{g.nom}</Link></td>
                  <td>{g.serveur}</td>
                  <td>{dateLongue(g.majLe)}</td>
                  <td><Decision g={g} publier={false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="doux">Aucune fiche publiée.</p>}
    </div>
  );
}
