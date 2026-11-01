import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { emplacement, etatBase, lireObjet, nomCategorie, prixEnTexte, qualite } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { FicheObjet, Prix, TableauObjets } from "@/components/Objets";
import { urlObjets } from "@/lib/objets";
import { AvertissementDonnees } from "../../AvertissementDonnees";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function charger(texte: string) {
  return /^\d{1,9}$/.test(texte) ? lireObjet(Number(texte)) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = await charger((await params).id);
  if (!o) return { title: "Objet introuvable" };
  const details = [qualite(o.qualite).nom, o.categorie, o.niveauObjet ? `niveau d'objet ${o.niveauObjet}` : "", o.niveauRequis > 1 ? `niveau ${o.niveauRequis} requis` : ""]
    .filter(Boolean).join(", ");
  return {
    title: `${o.nom} — objet de WoW Forever`,
    description: `${o.nom} dans WoW Forever : ${details}.${o.prixVente ? ` Se vend ${prixEnTexte(o.prixVente)}.` : ""}`,
    alternates: { canonical: `/base-de-donnees/objets/${o.id}/` },
  };
}

export default async function FicheObjetPage({ params }: Props) {
  const o = await charger((await params).id);
  if (!o) notFound();
  const etat = await etatBase();
  const autresPieces = o.ensemble?.objets.filter((p) => p.id !== o.id) ?? [];
  return (
    <>
      <section className="bandeau-page bandeau-objet">
        <div className="wrap">
          <Ariane etapes={[
            { nom: "Base de données", href: "/base-de-donnees/" },
            { nom: nomCategorie(o.nomClasse) || "Objets", href: urlObjets({ classe: o.classe }) },
            { nom: o.nom },
          ]} />
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes-objet">
          <FicheObjet objet={o} />
          <div>
            <h2 className="section-titre" style={{ fontSize: 22, marginTop: 0 }}>En bref</h2>
            <dl className="details-objet">
              <dt>Catégorie</dt>
              <dd><Link href={urlObjets({ classe: o.classe, sousClasse: o.sousClasse })}>{o.categorie || nomCategorie(o.nomClasse)}</Link></dd>
              {emplacement(o.emplacement) ? <><dt>Emplacement</dt><dd>{emplacement(o.emplacement)}</dd></> : null}
              <dt>Qualité</dt>
              <dd><Link href={urlObjets({ qualite: o.qualite })} style={{ color: qualite(o.qualite).couleur }}>{qualite(o.qualite).nom}</Link></dd>
              {o.niveauObjet ? <><dt>Niveau d&apos;objet</dt><dd>{o.niveauObjet}</dd></> : null}
              {o.niveauRequis > 1 ? <><dt>Niveau requis</dt><dd>{o.niveauRequis}</dd></> : null}
              {o.pile > 1 ? <><dt>Se cumule par</dt><dd>{o.pile}</dd></> : null}
              {o.prixAchat > 0 ? <><dt>Prix chez un marchand</dt><dd><Prix cuivre={o.prixAchat} /></dd></> : null}
              {o.prixVente > 0 ? <><dt>Prix de vente</dt><dd><Prix cuivre={o.prixVente} /></dd></> : <><dt>Prix de vente</dt><dd>Ne se vend pas</dd></>}
              <dt>Identifiant</dt>
              <dd>{o.id}</dd>
            </dl>
          </div>
        </div>

        {o.ensemble ? (
          <section aria-labelledby="t-ensemble" style={{ marginTop: 40 }}>
            <h2 id="t-ensemble" className="section-titre" style={{ fontSize: 22 }}>Ensemble : {o.ensemble.nom}</h2>
            <TableauObjets objets={autresPieces} vide="Aucune autre pièce connue pour cet ensemble." />
          </section>
        ) : null}

        <AvertissementDonnees etat={etat} />
      </div>
    </>
  );
}
