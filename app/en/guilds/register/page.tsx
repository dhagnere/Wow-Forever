import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { LIBELLES_GUILDE_EN } from "@/components/Guildes";
import { FormulaireGuilde } from "@/app/(site)/guildes/FormulaireGuilde";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Register my guild on the board",
  description: "Free listing for French-speaking WoW Forever guilds on La Taverne Éternelle's guild board.",
  alternates: { canonical: "/en/guilds/register/", languages: { fr: "/guildes/inscrire/", en: "/en/guilds/register/", "x-default": "/guildes/inscrire/" } },
};

export default function RegisterGuild() {
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("vallee-d-alterac")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Guild board", href: "/en/guilds/" }, { nom: "Register my guild" }]} />
          <p className="surtitre">Free · reviewed within 48 hours</p>
          <h1>Register my guild</h1>
        </div>
      </section>
      <div className="wrap contenu">
        <div style={{ maxWidth: 820 }}>
          <p>
            One listing per guild. Once published, share its address with your future recruits. Remember to keep it up to date: recent listings
            come first on the <Link href="/en/guilds/">board</Link>. The board is for French-speaking guilds.
          </p>
          <FormulaireGuilde libelles={LIBELLES_GUILDE_EN} langue="en" />
          <p className="doux" style={{ fontSize: 13, marginTop: 20 }}>
            No email address is required. The information entered becomes public once the listing is approved. To delete a listing,{" "}
            <Link href="/contact/" hrefLang="fr">write to us</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
