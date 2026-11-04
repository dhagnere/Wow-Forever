import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { emplacement, etatBase, lireObjet, nomCategorie, ouTrouver, prixEnTexte, qualite, recettesObjet } from "@/modules/veille";
import { Fabrication } from "@/components/Fabrication";
import { OuTrouver } from "@/components/OuTrouver";
import { Ariane } from "@/components/Ariane";
import { FicheObjet, Prix, TableauObjets } from "@/components/Objets";
import { urlObjetsEn } from "@/lib/objets";
import { AvertissementEn } from "../../Avertissement";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function charger(texte: string) {
  return /^\d{1,9}$/.test(texte) ? lireObjet(Number(texte), "en") : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = await charger((await params).id);
  if (!o) return { title: "Item not found" };
  const details = [qualite(o.qualite, "en").nom, o.categorie, o.niveauObjet ? `item level ${o.niveauObjet}` : "", o.niveauRequis > 1 ? `requires level ${o.niveauRequis}` : ""]
    .filter(Boolean).join(", ");
  const fr = `/base-de-donnees/objets/${o.id}/`;
  const en = `/en/item-database/items/${o.id}/`;
  return {
    title: `${o.nom} — WoW Forever item`,
    description: `${o.nom} in WoW Forever: ${details}.${o.prixVente ? ` Sells for ${prixEnTexte(o.prixVente, "en")}.` : ""}`,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
  };
}

export default async function ObjetEn({ params }: Props) {
  const o = await charger((await params).id);
  if (!o) notFound();
  const [etat, recettes] = await Promise.all([etatBase(), recettesObjet(o.id, "en")]);
  const autresPieces = o.ensemble?.objets.filter((p) => p.id !== o.id) ?? [];
  const q = qualite(o.qualite, "en");
  return (
    <>
      <section className="bandeau-page bandeau-objet">
        <div className="wrap">
          <Ariane langue="en" etapes={[
            { nom: "Item database", href: "/en/item-database/" },
            { nom: nomCategorie(o.nomClasse) || "Items", href: urlObjetsEn({ classe: o.classe }) },
            { nom: o.nom },
          ]} />
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes-objet">
          <FicheObjet objet={o} langue="en" />
          <div>
            <h2 className="section-titre" style={{ fontSize: 22, marginTop: 0 }}>At a glance</h2>
            <dl className="details-objet">
              <dt>Category</dt>
              <dd><Link href={urlObjetsEn({ classe: o.classe, sousClasse: o.sousClasse })}>{o.categorie || nomCategorie(o.nomClasse)}</Link></dd>
              {emplacement(o.emplacement, "en") ? <><dt>Slot</dt><dd>{emplacement(o.emplacement, "en")}</dd></> : null}
              <dt>Quality</dt>
              <dd><Link href={urlObjetsEn({ qualite: o.qualite })} style={{ color: q.couleur }}>{q.nom}</Link></dd>
              {o.niveauObjet ? <><dt>Item level</dt><dd>{o.niveauObjet}</dd></> : null}
              {o.niveauRequis > 1 ? <><dt>Required level</dt><dd>{o.niveauRequis}</dd></> : null}
              {o.pile > 1 ? <><dt>Stacks up to</dt><dd>{o.pile}</dd></> : null}
              {o.prixAchat > 0 ? <><dt>Vendor price</dt><dd><Prix cuivre={o.prixAchat} langue="en" /></dd></> : null}
              {o.prixVente > 0 ? <><dt>Sell price</dt><dd><Prix cuivre={o.prixVente} langue="en" /></dd></> : <><dt>Sell price</dt><dd>Cannot be sold</dd></>}
              <dt>ID</dt>
              <dd>{o.id}</dd>
            </dl>
          </div>
        </div>

        <OuTrouver o={ouTrouver(o.id, "en")} fabrique={recettes.fabrication.length > 0} langue="en" />

        <Fabrication {...recettes} langue="en" />

        {o.ensemble ? (
          <section aria-labelledby="t-ensemble" style={{ marginTop: 40 }}>
            <h2 id="t-ensemble" className="section-titre" style={{ fontSize: 22 }}>Set: {o.ensemble.nom}</h2>
            <TableauObjets langue="en" objets={autresPieces} vide="No other known piece for this set." />
          </section>
        ) : null}

        <AvertissementEn etat={etat} />
      </div>
    </>
  );
}
