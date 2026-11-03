import type { Metadata } from "next";
import Link from "next/link";
import { guidesDuJoueur } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { fondBandeau } from "@/lib/ecrans";
import { joueurConnecte, retourSur } from "@/lib/joueur";
import { dateLongue } from "@/lib/site";
import { libelleGuide } from "@/lib/guide";
import { AccesCompte, FormulaireMotDePasse, FormulaireSuppression } from "./Formulaires";
import { basculerLettre, seDeconnecter } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mon compte", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const MESSAGES: Record<string, string> = {
  "bienvenue=compte": "Bienvenue à la Taverne ! Votre compte est prêt : votre progression sera sauvegardée.",
  "bienvenue=lettre": "Bienvenue ! Un message de confirmation pour la Lettre vient de partir : cliquez sur le lien qu'il contient.",
  "bienvenue=lettre-plus-tard": "Bienvenue ! L'inscription à la Lettre n'a pas abouti ; réessayez depuis cette page dans quelques minutes.",
  "mot-de-passe=change": "Mot de passe changé. Connectez-vous avec le nouveau.",
  "lettre=arretee": "C'est noté : vous ne recevrez plus la Lettre.",
  "compte=supprime": "Votre compte et votre progression ont été effacés.",
};

export default async function Compte({ searchParams }: Props) {
  const p = await searchParams;
  const message = Object.entries(p).map(([k, v]) => MESSAGES[`${k}=${v}`]).find(Boolean);
  const j = await joueurConnecte();
  const guides = j ? await guidesDuJoueur(j.id) : [];
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Mon compte" }]} />
          <p className="surtitre">La Taverne Éternelle</p>
          <h1>{j ? <>Bonjour, <span className="accent">{j.pseudo}</span></> : "Votre compte à la Taverne"}</h1>
          <p className="chapo">
            {j ? "Votre progression dans les guides, la Lettre et vos réglages." : "Un compte gratuit pour sauvegarder votre progression dans le guide de 1 à 60, et recevoir la Lettre si vous le souhaitez."}
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        {message ? <p className="succes" role="status" style={{ marginBottom: 24 }}>{message}</p> : null}
        {!j ? (
          <div className="colonnes-lettre">
            <div>
              <h2 className="section-titre" style={{ fontSize: 24 }}>Ce que le compte vous apporte</h2>
              <ul className="liste-lettre">
                <li><strong>Votre progression sauvegardée</strong> dans le <Link href="/guides/parcours/">guide de 1 à 60</Link>, quête par quête, sur tous vos appareils.</li>
                <li><strong>Le bilan de chaque jour</strong> : combien de quêtes vous avez bouclées.</li>
                <li><strong>La Lettre</strong> du dimanche, si vous cochez la case.</li>
              </ul>
              <p className="doux">Gratuit, sans publicité. Votre compte s&apos;efface en un clic, progression comprise.</p>
            </div>
            <div className="encadre cadre" style={{ padding: 24 }}>
              <AccesCompte retour={retourSur(p.retour)} mode={p.mode === "connexion" ? "connexion" : "inscription"} />
            </div>
          </div>
        ) : (
          <div className="sections" style={{ gap: 36 }}>
            <section aria-labelledby="t-guides">
              <h2 id="t-guides" className="section-titre" style={{ fontSize: 24 }}>Mes guides</h2>
              {guides.length ? (
                <ul className="liste-lettre">
                  {guides.map((g) => (
                    <li key={g.guide}>
                      <Link href={libelleGuide(g.guide).lien}>{libelleGuide(g.guide).nom}</Link>{" "}
                      <span className="doux">· {g.faites} quêtes faites · dernière mise à jour le {dateLongue(g.majLe.toISOString().slice(0, 10))}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun guide commencé. <Link href="/guides/parcours/">Choisir ma race et ma classe dans le guide de 1 à 60</Link>.</p>
              )}
            </section>
            <section aria-labelledby="t-lettre">
              <h2 id="t-lettre" className="section-titre" style={{ fontSize: 24 }}>La Lettre</h2>
              <form action={basculerLettre}>
                <p style={{ marginTop: 0 }}>
                  {j.lettre ? "Vous avez demandé à recevoir la Lettre du dimanche." : "Vous ne recevez pas la Lettre du dimanche."}
                </p>
                <button type="submit" className={j.lettre ? "btn btn-contour" : "btn btn-or"} data-cta="compte-lettre">
                  {j.lettre ? "Ne plus recevoir la Lettre" : "Recevoir la Lettre"}
                </button>
              </form>
            </section>
            <section aria-labelledby="t-securite">
              <h2 id="t-securite" className="section-titre" style={{ fontSize: 24 }}>Mot de passe</h2>
              <p className="doux" style={{ marginTop: 0 }}>Compte créé le {dateLongue(j.creeLe.toISOString().slice(0, 10))} avec l&apos;adresse {j.courriel}.</p>
              <FormulaireMotDePasse />
            </section>
            <section aria-labelledby="t-quitter">
              <h2 id="t-quitter" className="section-titre" style={{ fontSize: 24 }}>Se déconnecter ou partir</h2>
              <form action={seDeconnecter} style={{ marginBottom: 20 }}>
                <button type="submit" className="btn btn-contour">Me déconnecter</button>
              </form>
              <FormulaireSuppression />
            </section>
          </div>
        )}
      </div>
    </>
  );
}
