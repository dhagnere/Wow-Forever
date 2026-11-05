import Link from "next/link";
import { notFound } from "next/navigation";
import { PartageFacebook } from "@/components/PartageFacebook";
import { AVIS_MINIMUM, DUREE_REEL_S, etatVideo, lienFrancais, lireParId, longueurX, messageFacebook, nomLangue, texteReseau } from "@/modules/veille";
import { TexteACopier } from "./Copier";
import { PILIERS, RUBRIQUES } from "@/config/taxonomie";
import { exigerAdmin } from "@/lib/admin";
import { SITE, dateLongue } from "@/lib/site";
import { Editeur } from "./Editeur";
import type { SourceEditeur } from "./Editeur";
import { depublier, enregistrer, relancerReseaux, proposerAvisPour, proposerLegendePour, proposerTexteFacebookPour, restaurer, supprimer } from "../actions";
import { VersionAnglaise } from "./VersionAnglaise";
import { proposerImages } from "@/lib/imagesProposees";

export const dynamic = "force-dynamic";

export default async function EditerArticle({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ anglais?: string }> }) {
  await exigerAdmin();
  const retourAnglais = (await searchParams).anglais;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const a = await lireParId(id);
  if (!a) notFound();
  const video = await etatVideo(a.id);
  const enEchec =
    (!a.facebookPostId && !!a.facebookErreur) || (!a.facebookReelId && !!a.facebookReelErreur) ||
    (!a.instagramMediaId && !!a.instagramErreur) || (!a.tiktokPublishId && !!a.tiktokErreur);

  return (
    <>
      <p><Link href="/admin/veille/">← Retour à la liste</Link></p>
      <h1 className="titre" style={{ fontSize: 30 }}>{a.titre}</h1>
      <p className="doux">
        {a.statut === "publie" ? <>En ligne depuis le {a.publieLe ? dateLongue(a.publieLe) : "—"} · <Link href={`/articles/${a.slug}/`} target="_blank">voir l&apos;article</Link></> : a.statut === "supprime" ? "Dans la corbeille" : "Brouillon"}
        {a.score !== null ? ` · score ${a.score}` : ""}
      </p>

      <div className="colonnes">
        <div className="colonne-principale">
          <Editeur
            action={enregistrer.bind(null, a.id)}
            valeurs={{
              titre: a.titre, chapo: a.chapo, corps: a.corps, avisSilfax: a.avisSilfax, rubrique: a.rubrique,
              etiquettes: a.etiquettes.join(", "), pilier: a.pilier ?? "", description: a.description,
              accrocheFacebook: a.accrocheFacebook, texteFacebook: a.texteFacebook,
              imageId: a.image?.id ?? null, imageAlt: a.image?.alt ?? "", imageCredit: a.image?.credit ?? "", imageLegende: a.image?.legende ?? "",
              imageFacebookId: a.imageFacebookId,
              avisPropose: a.avisPropose,
            }}
            proposerAvis={proposerAvisPour.bind(null, a.id)}
            proposerLegende={proposerLegendePour}
            proposerTexteFacebook={proposerTexteFacebookPour}
            imagesProposees={proposerImages(a).map(({ cle, nom, apercu, alt, credit, raison }) => ({ cle, nom, apercu, alt, credit, raison }))}
            sources={a.sources.map((s): SourceEditeur => {
              const fr = lienFrancais(s.url, s.langue);
              const traduite = fr.mode !== "original";
              return {
                nom: s.nom,
                titre: s.titreFr || s.titre,
                url: fr.url,
                mention: traduite ? (fr.mode === "officiel" ? "version française officielle" : "traduction automatique") : nomLangue(s.langue),
                urlOriginal: traduite ? s.url : undefined,
                publiee: s.publiee !== false,
              };
            })}
            rubriques={RUBRIQUES.map((r) => ({ slug: r.slug, nom: r.nom }))}
            piliers={PILIERS}
            publie={a.statut === "publie"}
            avisMinimum={AVIS_MINIMUM}
          />
          <VersionAnglaise a={a} retour={retourAnglais} />
        </div>
        <aside className="colonne-laterale">

          <div className="encadre">
            <h2>Aperçu du post Facebook</h2>
            <p className="doux" style={{ margin: "0 0 8px", fontSize: 14 }}>
              {a.imageFacebookId ? "Post photo, avec l'image propre au post." : a.image ? "Post lien, avec l'image d'en-tête recadrée." : "Post lien, avec l'image générée par le site."}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.imageFacebookId ? `/medias/${a.imageFacebookId}/` : a.image ? `/medias/${a.image.id}/og/` : `/articles/${a.slug}/image/`}
              alt=""
              style={{ width: "100%", borderRadius: 6, display: "block", marginBottom: 10 }}
            />
            <p style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 15 }}>{messageFacebook(a)}</p>
            {a.statut === "publie" ? (
              <div className="partage" style={{ margin: "12px 0 0" }}>
                <PartageFacebook url={`${SITE.url}/articles/${a.slug}/`} texte={messageFacebook(a)} libelle="Publier depuis la Page Facebook" page={SITE.facebook} />
                <PartageFacebook url={`${SITE.url}/articles/${a.slug}/`} texte={messageFacebook(a)} libelle="Fenêtre de partage" className="btn btn-contour" />
              </div>
            ) : null}
            {a.facebookErreur ? <p className="alerte" style={{ marginTop: 12, fontSize: 14 }}>Dernier échec : {a.facebookErreur}</p> : null}
            {a.statut === "publie" && enEchec ? (
              <form action={relancerReseaux.bind(null, a.id)} style={{ marginTop: 12 }}>
                <button type="submit" className="btn btn-contour">Relancer les publications en échec</button>
                <p className="doux" style={{ margin: "6px 0 0", fontSize: 13 }}>
                  Post et Reel Facebook, Instagram, TikTok : trois nouveaux essais pendant sept jours, au prochain passage du relais (chaque heure, de 8h à 22h).
                </p>
              </form>
            ) : null}
          </div>
          <div className="encadre" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2>Reel, Instagram, TikTok</h2>
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>
              Vidéo verticale de {DUREE_REEL_S} secondes, publiée sur la Page après le post.{" "}
              {a.facebookReelId ? "Reel publié ✓" : a.facebookReelErreur ? `Dernier échec : ${a.facebookReelErreur}` : a.statut === "publie" ? "Reel en attente." : "Partira après publication."}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/articles/${a.slug}/reel/`} alt="Image du Reel" style={{ width: 160, borderRadius: 8, display: "block" }} />
            <a href={`/admin/veille/${a.id}/reel/`} className="btn btn-contour" style={{ alignSelf: "flex-start" }}>
              {video.prete ? "Télécharger la vidéo (MP4)" : "Préparer et télécharger la vidéo (MP4)"}
            </a>
            <p className="doux" style={{ margin: 0, fontSize: 13 }}>
              {video.prete
                ? "Vidéo prête."
                : video.erreur
                  ? `Dernier échec de fabrication : ${video.erreur}`
                  : video.demandeLe
                    ? `En préparation depuis le ${dateLongue(video.demandeLe)} (tâche toutes les dix minutes).`
                    : "Fabriquée à la demande, en dix à quinze minutes au plus."}
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              Instagram : {a.instagramMediaId ? "publié ✓" : a.instagramErreur ? `échec — ${a.instagramErreur}` : a.statut === "publie" ? "en attente" : "après publication"}
              <br />
              TikTok : {a.tiktokPublishId ? "envoyé ✓" : a.tiktokErreur ? `échec — ${a.tiktokErreur}` : a.statut === "publie" ? "en attente" : "après publication"}
            </p>
            <TexteACopier titre="Texte du Reel" texte={texteReseau("reel", a)} />
            <TexteACopier titre="Texte pour X" texte={texteReseau("x", a)} note={`${longueurX(texteReseau("x", a))} caractères sur 280 (un lien compte pour 23).`} />
            <TexteACopier titre="Texte pour Instagram" texte={texteReseau("instagram", a)} note="Lien non cliquable sur Instagram : mettre l'adresse du site dans la bio." />
            <TexteACopier titre="Texte pour TikTok" texte={texteReseau("tiktok", a)} note="À poster avec la vidéo téléchargée ci-dessus." />
          </div>
          <div className="encadre" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2>Actions</h2>
            {a.statut === "publie" ? (
              <form action={depublier.bind(null, a.id)}><button type="submit" className="btn btn-contour">Retirer du site</button></form>
            ) : null}
            {a.statut === "supprime" ? (
              <form action={restaurer.bind(null, a.id)}><button type="submit" className="btn btn-contour">Remettre en brouillon</button></form>
            ) : (
              <form action={supprimer.bind(null, a.id)}><button type="submit" className="btn btn-danger">Supprimer</button></form>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
