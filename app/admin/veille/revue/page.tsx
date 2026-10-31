import Link from "next/link";
import { brouillonsParJour, derniereRevue, etatRedaction, lienFrancais, MAX_PAR_LANCEMENT, nomLangue } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { SelectionRevue, type LigneRevue } from "./Selection";
import { redigerSelection } from "./actions";

export const dynamic = "force-dynamic";

const HEURE = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

export default async function Revue() {
  await exigerAdmin();
  const [revue, redaction] = await Promise.all([derniereRevue(), Promise.resolve(etatRedaction())]);

  const bandeau = redaction.enCours ? (
    <>
      {/* Rafraîchit la page toutes les 20 secondes pendant la rédaction. */}
      <meta httpEquiv="refresh" content="20" />
      <p className="info" role="status">
        Rédaction en cours : {redaction.faits} sur {redaction.total}, {redaction.brouillons.length} brouillon(s) prêt(s).
        La page se met à jour toute seule. <Link href="/admin/veille/">Voir les brouillons</Link>
      </p>
    </>
  ) : redaction.fin ? (
    <div className="info" role="status" style={{ marginBottom: 24 }}>
      Dernière rédaction terminée à {HEURE.format(redaction.fin)} : {redaction.brouillons.length} brouillon(s) créé(s)
      {redaction.echecs.length ? `, ${redaction.echecs.length} échec(s)` : ""}. <Link href="/admin/veille/">Voir les brouillons</Link>
      {redaction.echecs.length ? <ul>{redaction.echecs.map((e) => <li key={e.sujet}>{e.sujet} — {e.raison}</li>)}</ul> : null}
    </div>
  ) : null;

  if (!revue) {
    return (
      <>
        <h1 className="titre">Revue du jour</h1>
        <p className="doux">Aucun passage de veille pour l&apos;instant. Lancer <code>npm run veille:essai</code> pour un premier classement sans coût d&apos;API.</p>
      </>
    );
  }

  const b = revue.bilan;
  const aCocher = new Set(revue.sujets.filter((s) => !s.dejaTraite).slice(0, brouillonsParJour()).map((s) => s.cle));
  const lignes: LigneRevue[] = revue.sujets.map((s, i) => ({
    cle: s.cle,
    rang: i + 1,
    titre: s.titre,
    score: s.score,
    detail: `sources ${s.detail.sources} · fraîcheur ${s.detail.fraicheur} · vidéo ${s.detail.video} · étranger ${s.detail.etranger}`,
    dejaTraite: s.dejaTraite,
    coche: aCocher.has(s.cle),
    sources: s.elements.map((e) => {
      const fr = lienFrancais(e.url, e.langue);
      return fr.mode === "original"
        ? { nom: e.source, url: e.url, mention: nomLangue(e.langue) }
        : { nom: e.source, url: fr.url, mention: "en français", urlOriginal: e.url };
    }),
  }));

  return (
    <>
      <h1 className="titre">Revue du {dateLongue(revue.creeLe)}</h1>
      {bandeau}
      <p className="doux">
        Passage « {revue.mode} » de {HEURE.format(revue.creeLe)} : {b.elementsLus} éléments lus, {b.sujetsRetenus} sujets retenus,{" "}
        {revue.sujets.filter((s) => s.dejaTraite).length} déjà rédigés. Les {aCocher.size} meilleurs sujets non rédigés sont cochés.
      </p>
      {b.sources.some((s) => s.erreur) ? (
        <div className="alerte" style={{ marginBottom: 24 }}>
          <strong>Sources en échec :</strong>
          <ul>{b.sources.filter((s) => s.erreur).map((s) => <li key={s.id}>{s.nom} — {s.erreur}</li>)}</ul>
        </div>
      ) : null}
      <SelectionRevue action={redigerSelection.bind(null, revue.id)} lignes={lignes} bloque={redaction.enCours} max={MAX_PAR_LANCEMENT} />
    </>
  );
}
