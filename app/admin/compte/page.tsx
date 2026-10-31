import { DUREE_SESSION_S, MOT_DE_PASSE_MINIMUM } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { FormulaireMotDePasse } from "./Formulaire";

export const dynamic = "force-dynamic";

export default async function Compte({ searchParams }: { searchParams: Promise<{ bienvenue?: string }> }) {
  const admin = await exigerAdmin();
  const { bienvenue } = await searchParams;
  return (
    <>
      <h1 className="titre">Mon compte</h1>
      {bienvenue ? (
        <p className="info" role="status">
          Compte « {admin.identifiant} » créé. Choisissez maintenant votre propre mot de passe : la variable ADMIN_PASSWORD ne sera plus utilisée.
        </p>
      ) : null}
      <p className="doux">
        Identifiant : <strong>{admin.identifiant}</strong>
        {admin.derniereConnexion ? ` · dernière connexion le ${new Date(admin.derniereConnexion).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" })}` : ""}
        {` · une session dure ${DUREE_SESSION_S / 3600} heures.`}
      </p>
      <h2>Changer le mot de passe</h2>
      <p className="doux" style={{ fontSize: 15 }}>Toutes les sessions ouvertes, sur tous vos appareils, seront fermées.</p>
      <FormulaireMotDePasse minimum={MOT_DE_PASSE_MINIMUM} />
      <h2 style={{ marginTop: 40 }}>Mot de passe perdu</h2>
      <p className="doux" style={{ fontSize: 15 }}>
        Depuis l&apos;outil en ligne de commande Scalingo : <code>scalingo --app &lt;application&gt; run npm run admin:compte -- {admin.identifiant}</code>.
        Le nouveau mot de passe est demandé sans s&apos;afficher.
      </p>
    </>
  );
}
