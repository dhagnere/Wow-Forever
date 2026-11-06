import type { Metadata } from "next";
import Link from "next/link";
import { avancementRelecture, remarquesRelecture } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { cleGuide, combinaisons, guidePour, nomRace, planifier } from "@/lib/guide";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Relecture des guides" };

/** Libellé d'une clé de guide (« horde:orc:chasseur ») et lien vers sa page de relecture. */
function guideDeCle(cle: string) {
  const c = combinaisons().find((x) => cleGuide(x.race, x.classe.slug) === cle);
  return c ? { nom: `${nomRace(c.race)} ${c.classe.nom.toLowerCase()}`, lien: `/admin/guides/${c.race.slug}/${c.classe.slug}/` } : null;
}

/** Nombre d'étapes (prendre, faire, rendre) d'un guide, gardé en mémoire : les données ne changent qu'au déploiement. */
const nbEtapes = new Map<string, number>();
function etapesDuGuide(c: ReturnType<typeof combinaisons>[number]): number {
  const cle = cleGuide(c.race, c.classe.slug);
  if (!nbEtapes.has(cle)) nbEtapes.set(cle, guidePour(c.race, c.classe.slug).reduce((s, z) => s + planifier(z).reduce((t, a) => t + a.actions.length, 0), 0));
  return nbEtapes.get(cle)!;
}

export default async function AdminGuides() {
  await exigerAdmin();
  const [avancement, remarques] = await Promise.all([avancementRelecture(), remarquesRelecture()]);
  const guides = combinaisons().map((c) => {
    const cle = cleGuide(c.race, c.classe.slug);
    return { race: c.race, classe: c.classe, cle, etapes: etapesDuGuide(c), ...(avancement.get(cle) ?? { verifiees: 0, remarques: 0 }) };
  });
  const commences = guides.filter((g) => g.verifiees || g.remarques);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Relecture des guides de 1 à 60</h1>
      <p className="doux">
        Jouez sans guide commercial, en suivant le guide du site, et notez à chaque étape ce qui ne colle pas en jeu : quête absente de Forever, PNJ
        déplacé, ordre peu pratique, objectif mal placé. Les remarques restent ici ; elles servent à corriger le calcul du guide.
      </p>

      {remarques.length ? (
        <section>
          <h2>Remarques à traiter ({remarques.length})</h2>
          <div className="tableau-boite">
            <table>
              <thead><tr><th scope="col">Guide</th><th scope="col">Étape</th><th scope="col">Remarque</th><th scope="col">Date</th></tr></thead>
              <tbody>
                {remarques.map((r) => {
                  const g = guideDeCle(r.guide);
                  return (
                    <tr key={`${r.guide}-${r.etape}`}>
                      <td>{g ? <Link href={`${g.lien}#etape-${r.etape.replace(":", "-")}`}>{g.nom}</Link> : r.guide}</td>
                      <td className="doux">{r.etape}</td>
                      <td>{r.remarque}</td>
                      <td className="doux">{dateLongue(r.majLe)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {commences.length ? (
        <section>
          <h2>En cours</h2>
          <ul>
            {commences.map((g) => (
              <li key={g.cle}>
                <Link href={`/admin/guides/${g.race.slug}/${g.classe.slug}/`}>{nomRace(g.race)} {g.classe.nom.toLowerCase()}</Link>{" "}
                <span className="doux">· {g.verifiees} / {g.etapes} étapes vérifiées · {g.remarques} remarque(s)</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <h2>Tous les guides</h2>
      <div className="tableau-boite">
        <table>
          <thead><tr><th scope="col">Race</th><th scope="col">Classe</th><th scope="col">Étapes</th><th scope="col">Vérifiées</th></tr></thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.cle}>
                <td>{nomRace(g.race)}</td>
                <td><Link href={`/admin/guides/${g.race.slug}/${g.classe.slug}/`}>{g.classe.nom}</Link></td>
                <td>{g.etapes}</td>
                <td className="doux">{g.verifiees ? `${g.verifiees} (${Math.round((100 * g.verifiees) / Math.max(1, g.etapes))} %)` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
