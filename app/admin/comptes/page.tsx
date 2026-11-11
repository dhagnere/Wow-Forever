import type { Metadata } from "next";
import { abonnesSansCompte, listerComptes } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Comptes" };

/**
 * Inscriptions sur le site : comptes joueurs (pseudo, adresse, Lettre) et abonnés à la Lettre sans compte.
 * Les adresses ne s'affichent qu'ici, derrière exigerAdmin() ; elles ne sont jamais journalisées.
 */
export default async function AdminComptes() {
  await exigerAdmin();
  const [comptes, abonnes] = await Promise.all([listerComptes(), abonnesSansCompte()]);
  const avecLettre = comptes.filter((c) => c.abonne).length;
  const enAttente = comptes.filter((c) => c.lettre && !c.abonne).length;
  const abonnesConfirmes = abonnes.filter((a) => a.confirmeLe).length;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Comptes et inscriptions</h1>
      <p className="doux">
        <strong>{comptes.length}</strong> compte(s) joueur · {avecLettre} abonné(s) confirmé(s) à la Lettre, {enAttente} en attente de confirmation ·{" "}
        <strong>{abonnesConfirmes}</strong> abonné(s) à la Lettre sans compte. Les adresses restent privées : ne les copiez pas hors de cet espace.
      </p>

      <h2>Comptes joueurs ({comptes.length})</h2>
      {comptes.length ? (
        <div className="tableau-boite">
          <table>
            <thead>
              <tr>
                <th scope="col">Pseudo</th><th scope="col">Adresse</th><th scope="col">Inscrit le</th><th scope="col">Dernière visite</th>
                <th scope="col">Lettre</th><th scope="col">Guides suivis</th>
              </tr>
            </thead>
            <tbody>
              {comptes.map((c) => (
                <tr key={c.id}>
                  <td>{c.pseudo}</td>
                  <td>{c.courriel}</td>
                  <td>{dateLongue(c.creeLe)}</td>
                  <td>{dateLongue(c.vuLe)}</td>
                  <td>{c.abonne ? `abonné (${c.langueLettre === "en" ? "anglais" : "français"})` : c.lettre ? "demandée, pas confirmée" : "non"}</td>
                  <td>{c.guides}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="doux">Aucun compte pour l&apos;instant.</p>}

      <h2 style={{ marginTop: 40 }}>Abonnés à la Lettre sans compte ({abonnes.length})</h2>
      {abonnes.length ? (
        <div className="tableau-boite">
          <table>
            <thead>
              <tr><th scope="col">Adresse</th><th scope="col">Édition</th><th scope="col">Demande le</th><th scope="col">Confirmée le</th></tr>
            </thead>
            <tbody>
              {abonnes.map((a) => (
                <tr key={a.courriel}>
                  <td>{a.courriel}</td>
                  <td>{a.langue === "en" ? "anglaise" : "française"}</td>
                  <td>{dateLongue(a.demandeLe)}</td>
                  <td>{a.confirmeLe ? dateLongue(a.confirmeLe) : "en attente (effacée après 7 jours)"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="doux">Aucun abonné sans compte.</p>}
    </div>
  );
}
