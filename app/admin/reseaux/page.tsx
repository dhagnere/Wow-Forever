import { compteInstagram, lireJeton, urlRetourTiktok } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { deconnecterTiktok } from "./actions";

export const dynamic = "force-dynamic";

const MESSAGES: Record<string, [string, string]> = {
  ok: ["info", "Compte TikTok relié."],
  refus: ["alerte", "Autorisation refusée sur TikTok."],
  invalide: ["alerte", "Retour de TikTok invalide ou expiré : recommencez."],
  echec: ["alerte", "TikTok a refusé l'échange du code. Vérifiez TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET et l'adresse de retour déclarée."],
};

function Etat({ ok, texte }: { ok: boolean; texte: string }) {
  return <p style={{ margin: "4px 0" }}>{ok ? "✓" : "✗"} {texte}</p>;
}

export default async function Reseaux({ searchParams }: { searchParams: Promise<{ tiktok?: string }> }) {
  await exigerAdmin();
  const message = MESSAGES[(await searchParams).tiktok ?? ""];
  const facebook = !!process.env.FACEBOOK_PAGE_ID && !!process.env.FACEBOOK_PAGE_TOKEN;
  const reels = facebook && process.env.FACEBOOK_REELS !== "off";
  const igActif = process.env.INSTAGRAM_PUBLICATION !== "off" && !!(process.env.INSTAGRAM_TOKEN || process.env.FACEBOOK_PAGE_TOKEN);
  const ig = igActif ? await compteInstagram().then((id) => ({ ok: true, texte: `compte relié (identifiant ${id})` })).catch((e: Error) => ({ ok: false, texte: e.message })) : null;
  const ttActif = process.env.TIKTOK_PUBLICATION !== "off" && !!process.env.TIKTOK_CLIENT_KEY && !!process.env.TIKTOK_CLIENT_SECRET;
  const jeton = ttActif ? await lireJeton("tiktok") : null;
  const mode = process.env.TIKTOK_MODE === "direct" ? "direct" : "brouillon";

  return (
    <>
      <h1 className="titre">Réseaux sociaux</h1>
      <p className="doux">Chaque heure, de 8h à 22h, les articles en ligne partent sur chaque réseau configuré : trois publications par heure et par réseau au plus, avec la même phrase d&apos;appel à l&apos;action.</p>
      {message ? <p className={message[0]} role="status">{message[1]}</p> : null}

      <div className="g2" style={{ marginTop: 24 }}>
        <section className="encadre">
          <h2>Facebook</h2>
          <Etat ok={facebook} texte={facebook ? "Page configurée (posts)" : "FACEBOOK_PAGE_ID et FACEBOOK_PAGE_TOKEN à renseigner"} />
          <Etat ok={reels} texte={reels ? "Reels actifs" : "Reels inactifs"} />
        </section>

        <section className="encadre">
          <h2>Instagram</h2>
          {ig ? <Etat ok={ig.ok} texte={ig.texte} /> : <Etat ok={false} texte="Inactif : jeton absent ou INSTAGRAM_PUBLICATION=off" />}
          <p className="doux" style={{ fontSize: 14, margin: "8px 0 0" }}>
            Compte professionnel relié à la Page Facebook. Le jeton de Page doit avoir les permissions instagram_basic et instagram_content_publish.
            Publication : Reel avec la vidéo de l&apos;article et sa légende.
          </p>
        </section>

        <section className="encadre">
          <h2>TikTok</h2>
          {!ttActif ? (
            <Etat ok={false} texte="Inactif : TIKTOK_CLIENT_KEY et TIKTOK_CLIENT_SECRET à renseigner" />
          ) : jeton ? (
            <>
              <Etat ok texte={`Compte relié : ${jeton.compte ?? "TikTok"}`} />
              <p className="doux" style={{ fontSize: 14, margin: "4px 0" }}>
                Accès renouvelé automatiquement{jeton.rafraichissementExpireLe ? `, jusqu'au ${dateLongue(jeton.rafraichissementExpireLe)}` : ""}.
              </p>
              <form action={deconnecterTiktok}><button type="submit" className="btn btn-contour">Déconnecter</button></form>
            </>
          ) : (
            <>
              <Etat ok={false} texte="Aucun compte relié" />
              <a href="/admin/reseaux/tiktok/connexion/" className="btn btn-or" style={{ marginTop: 8 }}>Relier le compte TikTok</a>
            </>
          )}
          <p className="doux" style={{ fontSize: 14, margin: "10px 0 0" }}>
            Mode <strong>{mode}</strong> :{" "}
            {mode === "brouillon"
              ? "la vidéo arrive dans votre boîte de réception TikTok ; vous ajoutez la légende (copiable dans l'éditeur) et publiez depuis l'application."
              : "publication immédiate. Sans audit de l'application par TikTok, les vidéos restent privées."}
          </p>
          {ttActif ? <p className="doux" style={{ fontSize: 13, margin: "6px 0 0" }}>Adresse de retour à déclarer dans l&apos;application TikTok : {urlRetourTiktok()}</p> : null}
        </section>

        <section className="encadre">
          <h2>X</h2>
          <Etat ok={false} texte="Publication automatique non branchée : texte prêt à copier dans l'éditeur" />
        </section>
      </div>
    </>
  );
}
