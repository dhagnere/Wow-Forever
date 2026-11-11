import type { Metadata } from "next";
import Link from "next/link";
import { guidesDuJoueur, lettresParues, markdownVersHtml } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { fondBandeau } from "@/lib/ecrans";
import { joueurConnecte, retourSur } from "@/lib/joueur";
import { lienGuideEn, nomClasseEn, nomRaceEn } from "@/lib/anglais";
import { AccesCompte } from "@/app/(site)/compte/Formulaires";
import { seDeconnecterEn } from "@/app/(site)/compte/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const MESSAGES: Record<string, string> = {
  "bienvenue=compte": "Welcome to the Tavern! Your account is ready: your progress will be saved.",
  "bienvenue=lettre": "Welcome! A confirmation email for the newsletter is on its way: click the link inside.",
  "bienvenue=lettre-plus-tard": "Welcome! The newsletter sign-up did not go through; try again from the account settings in a few minutes.",
};

const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);

export default async function CompteEn({ searchParams }: Props) {
  const p = await searchParams;
  const message = Object.entries(p).map(([k, v]) => MESSAGES[`${k}=${v}`]).find(Boolean);
  const j = await joueurConnecte();
  const [guides, lettres] = j ? await Promise.all([guidesDuJoueur(j.id), lettresParues("en")]) : [[], []];
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "My account" }]} />
          <p className="surtitre">La Taverne Éternelle</p>
          <h1>{j ? <>Hello, <span className="accent">{j.pseudo}</span></> : "Your Tavern account"}</h1>
          <p className="chapo">{j ? "Your progress in the leveling guides." : "A free account to save your progress in the 1-60 leveling guide, quest by quest, on all your devices."}</p>
        </div>
      </section>
      <div className="wrap contenu">
        {message ? <p className="succes" role="status" style={{ marginBottom: 24 }}>{message}</p> : null}
        {!j ? (
          <div className="colonnes-lettre">
            <div>
              <h2 className="section-titre" style={{ fontSize: 24 }}>What the account gives you</h2>
              <ul className="liste-lettre">
                <li><strong>Your progress saved</strong> in the <Link href="/en/leveling-guide/">1-60 leveling guide</Link>, quest by quest, on all your devices.</li>
                <li><strong>A daily tally</strong>: how many quests you turned in each day.</li>
                <li><strong>The newsletter</strong> every Sunday, if you tick the box.</li>
              </ul>
              <p className="doux">Free, no ads. Your account can be deleted in one click, progress included. The same account works on the French site.</p>
            </div>
            <div className="encadre cadre" style={{ padding: 24 }}>
              <AccesCompte langue="en" retour={retourSur(p.retour, "/en/account/")} mode={p.mode === "connexion" ? "connexion" : "inscription"} />
            </div>
          </div>
        ) : (
          <div className="sections" style={{ gap: 36 }}>
            <section aria-labelledby="t-guides">
              <h2 id="t-guides" className="section-titre" style={{ fontSize: 24 }}>My guides</h2>
              {guides.length ? (
                <ul className="liste-lettre">
                  {guides.map((g) => {
                    const [, race, classe] = g.guide.split(":");
                    return (
                      <li key={g.guide}>
                        <Link href={lienGuideEn(race, classe)}>Leveling guide 1-60 · {nomRaceEn(race)} {nomClasseEn(classe)}</Link>{" "}
                        <span className="doux">· {g.faites} quest{g.faites === 1 ? "" : "s"} done · last updated {dateEn(g.majLe)}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No guide started yet. <Link href="/en/leveling-guide/">Pick my race and class in the 1-60 leveling guide</Link>.</p>
              )}
            </section>
            <section aria-labelledby="t-lettres">
              <h2 id="t-lettres" className="section-titre" style={{ fontSize: 24 }}>Jobwow&apos;s letters</h2>
              {lettres.length ? (
                <div className="lettres-compte">
                  {lettres.map((l, i) => (
                    <details key={l.id} className="encadre" open={i === 0}>
                      <summary>
                        <strong>{l.sujet}</strong> <span className="doux">· published on {dateEn(l.parueLe)}</span>
                      </summary>
                      {/* "HTML filtering" guardrail: the body goes through markdownVersHtml. */}
                      <div className="corps" dangerouslySetInnerHTML={{ __html: markdownVersHtml(l.corps) }} />
                    </details>
                  ))}
                </div>
              ) : (
                <p style={{ marginTop: 0 }}>No letter has been published yet. They will show up here, newest first.</p>
              )}
            </section>
            <section aria-labelledby="t-reglages">
              <h2 id="t-reglages" className="section-titre" style={{ fontSize: 24 }}>Settings</h2>
              <p style={{ marginTop: 0 }}>
                Account created on {dateEn(j.creeLe)} with the address {j.courriel}. Password change, newsletter and account deletion are on the{" "}
                <Link href="/compte/" hrefLang="fr">account page of the French site</Link>.
              </p>
              <form action={seDeconnecterEn}>
                <button type="submit" className="btn btn-contour">Log out</button>
              </form>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
