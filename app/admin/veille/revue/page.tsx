import Link from "next/link";
import {
  brouillonsParJour, derniereRevue, DOSSIERS, etatDossier, etatRedaction, lienFrancais, MAX_PAR_LANCEMENT, nomLangue,
  selectionVariee, themeDe,
} from "@/modules/veille";
import { RechercheDossiers } from "./Dossiers";
import { RUBRIQUES, trouverRubrique } from "@/config/taxonomie";
import { exigerAdmin } from "@/lib/admin";
import { dateLongue } from "@/lib/site";
import { SelectionRevue, type LigneRevue } from "./Selection";
import { lancerDossiers, redigerSelection } from "./actions";

export const dynamic = "force-dynamic";

const HEURE = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

export default async function Revue({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  await exigerAdmin();
  const demande = (await searchParams).theme;
  const filtre = demande && trouverRubrique(demande) ? demande : undefined;
  const [revue, redaction] = await Promise.all([derniereRevue(), Promise.resolve(etatRedaction())]);
  const dossierEnCours = etatDossier();
  const blocDossiers = (
    <>
      {dossierEnCours ? (
        <>
          <meta httpEquiv="refresh" content="20" />
          <p className="info" role="status">Recherche des dossiers en cours : {dossierEnCours.dossiers.join(", ")}. La page se met à jour toute seule.</p>
        </>
      ) : null}
      <RechercheDossiers action={lancerDossiers} dossiers={DOSSIERS.map((d) => ({ id: d.id, nom: d.nom }))} enCours={!!dossierEnCours} />
    </>
  );

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
        {blocDossiers}
        <p className="doux">Aucun passage de veille pour l&apos;instant. Lancer <code>npm run veille:essai</code> pour un premier classement sans coût d&apos;API.</p>
      </>
    );
  }

  const b = revue.bilan;
  const sujets = revue.sujets.map((s, i) => ({ ...s, ...themeDe(s), rang: i + 1 }));
  const parTheme = new Map<string, number>();
  for (const s of sujets) if (!s.dejaTraite) parTheme.set(s.theme, (parTheme.get(s.theme) ?? 0) + 1);
  const affiches = filtre ? sujets.filter((s) => s.theme === filtre) : sujets;
  // Présélection : les meilleurs sujets non rédigés, variés entre les thèmes (ou les meilleurs du thème filtré).
  const libres = affiches.filter((s) => !s.dejaTraite);
  const aCocher = new Set((filtre ? libres.slice(0, brouillonsParJour()) : selectionVariee(libres, brouillonsParJour())).map((s) => s.cle));
  const lignes: LigneRevue[] = affiches.map((s) => ({
    cle: s.cle,
    rang: s.rang,
    titre: s.titre,
    theme: trouverRubrique(s.theme)?.nom ?? s.theme,
    pilier: s.pilier,
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
      <h1 className="titre">{revue.mode === "dossier" ? "Dossiers" : "Revue"} du {dateLongue(revue.creeLe)}</h1>
      {bandeau}
      {blocDossiers}
      <p className="doux">
        {revue.mode === "dossier" ? `Recherche « ${(b.dossiers ?? []).join(", ")} » sur 60 jours` : `Passage « ${revue.mode} »`} de {HEURE.format(revue.creeLe)} : {b.elementsLus} éléments lus, {b.sujetsRetenus} sujets retenus,{" "}
        {revue.sujets.filter((s) => s.dejaTraite).length} déjà rédigés. {aCocher.size} sujets cochés
        {filtre ? " : les meilleurs de ce thème." : " : les meilleurs, variés entre les thèmes."}
      </p>
      <nav className="onglets" aria-label="Thèmes">
        <Link href="/admin/veille/revue/" aria-current={!filtre ? "page" : undefined}>Tous ({sujets.filter((s) => !s.dejaTraite).length})</Link>
        {RUBRIQUES.filter((r) => parTheme.has(r.slug)).map((r) => (
          <Link key={r.slug} href={`/admin/veille/revue/?theme=${r.slug}`} aria-current={filtre === r.slug ? "page" : undefined}>
            {r.nom} ({parTheme.get(r.slug)})
          </Link>
        ))}
      </nav>
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
