"use client";

import { useEffect, useMemo, useState } from "react";
import {
  POINTS_MAX, blocageAjout, blocageRetrait, decoder, encoder, modifier, niveauRequis, somme, total, vide,
  type Points,
} from "@/lib/calculateur";

export interface TalentVue {
  id: number;
  nom: string;
  icone: string;
  palier: number;
  colonne: number;
  rangs: number;
  niveau: number;
  description: string;
  /** Description de chaque rang (null : pas encore publiée). */
  descriptions: (string | null)[];
  prerequisId: number | null;
  prerequis: string | null;
  actif: boolean;
}

export interface ArbreVue {
  slug: string;
  nom: string;
  icone: string;
  talents: TalentVue[];
}

const COLONNES = 4;

/** Comme l'infobulle du jeu : le rang atteint, puis le rang suivant ; à défaut, le premier rang publié. */
function DescriptionsRangs({ t, pt }: { t: TalentVue; pt: number }) {
  const texte = (k: number) => t.descriptions[k] ?? null;
  const lignes: { titre: string; texte: string }[] = [];
  if (t.rangs === 1) {
    if (t.description) lignes.push({ titre: "", texte: t.description });
  } else {
    if (pt > 0 && texte(pt - 1)) lignes.push({ titre: `Rang ${pt}`, texte: texte(pt - 1)! });
    if (pt < t.rangs && texte(pt)) lignes.push({ titre: pt ? `Rang suivant (${pt + 1})` : "Rang 1", texte: texte(pt)! });
    if (!lignes.length && t.description) lignes.push({ titre: "Rang 1", texte: t.description });
  }
  const manquants = t.descriptions.slice(1).filter((d) => !d).length;
  return (
    <>
      {lignes.map((l) => (
        <p key={l.titre} className="sort-desc">{l.titre ? <span className="doux">{l.titre} : </span> : null}{l.texte}</p>
      ))}
      {t.rangs > 1 && manquants && pt > 1 ? (
        <p className="doux calc-motif">Les fichiers de Forever ne décrivent pas encore les rangs 2 à {t.rangs} de ce talent.</p>
      ) : null}
    </>
  );
}

/**
 * Calculateur de talents : trois arbres côte à côte. Clic (ou Entrée) : un point de plus ; clic droit (ou Suppr) : un point
 * de moins ; le panneau du talent choisi offre aussi + et −, pour les écrans tactiles. Le build se lit et s'écrit dans
 * l'adresse (?build=…), pour le partager.
 */
export function CalculateurTalents({ classe, arbres }: { classe: string; arbres: ArbreVue[] }) {
  const regles = useMemo(() => arbres.map((a) => a.talents), [arbres]);
  const [points, setPoints] = useState<Points>(() => vide(regles));
  const [choix, setChoix] = useState<{ a: number; i: number } | null>(null);
  const [copie, setCopie] = useState(false);
  const [lu, setLu] = useState(false);

  // Build reçu par l'adresse.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("build");
    if (code) {
      const p = decoder(code, regles);
      if (p) setPoints(p);
    }
    setLu(true);
  }, [regles]);

  // Adresse tenue à jour, sans recharger la page.
  useEffect(() => {
    if (!lu) return;
    const code = encoder(points);
    const url = new URL(window.location.href);
    if (code) url.searchParams.set("build", code);
    else url.searchParams.delete("build");
    history.replaceState(null, "", url);
  }, [points, lu]);

  const nomTalent = (a: number) => (id: number) => arbres[a].talents.find((t) => t.id === id)?.nom ?? "son prérequis";
  const ajouter = (a: number, i: number) => {
    setChoix({ a, i });
    if (!blocageAjout(regles, points, a, i)) setPoints((p) => modifier(p, a, i, 1));
  };
  const retirer = (a: number, i: number) => {
    setChoix({ a, i });
    if (!blocageRetrait(regles, points, a, i)) setPoints((p) => modifier(p, a, i, -1));
  };

  const depenses = total(points);
  const parArbre = points.map(somme);
  const principal = parArbre.some((x) => x > 0) ? arbres[parArbre.indexOf(Math.max(...parArbre))].nom : null;

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      setCopie(false);
    }
  };

  const t = choix ? arbres[choix.a].talents[choix.i] : null;
  const pt = choix ? points[choix.a][choix.i] : 0;
  const motifAjout = choix ? blocageAjout(regles, points, choix.a, choix.i, { arbre: arbres[choix.a].nom, talent: nomTalent(choix.a) }) : null;
  const motifRetrait = choix ? blocageRetrait(regles, points, choix.a, choix.i) : null;

  return (
    <div className="calculateur">
      <div className="calc-bilan" aria-live="polite">
        <p>
          <strong>{classe} {parArbre.join(" / ")}</strong>
          {principal ? <span className="doux"> · {principal}</span> : null}
        </p>
        <p className="doux">
          {depenses} point{depenses > 1 ? "s" : ""} sur {POINTS_MAX} · niveau {niveauRequis(depenses)} requis · {POINTS_MAX - depenses} restant{POINTS_MAX - depenses > 1 ? "s" : ""}
        </p>
        <div className="calc-actions">
          <button type="button" className="btn btn-or" onClick={copier} data-cta="partager-build" disabled={!depenses}>
            {copie ? "Lien copié" : "Copier le lien du build"}
          </button>
          <button type="button" className="btn btn-contour" onClick={() => { setPoints(vide(regles)); setChoix(null); }} disabled={!depenses}>
            Tout effacer
          </button>
        </div>
      </div>

      <div className="calc-arbres">
        {arbres.map((arbre, a) => {
          const lignes = Math.max(...arbre.talents.map((x) => x.palier)) + 1;
          const position = new Map(arbre.talents.map((x) => [x.id, x]));
          return (
            <section key={arbre.slug} className="calc-arbre" aria-label={`Arbre ${arbre.nom}`}>
              <header>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {arbre.icone ? <img src={arbre.icone} alt="" width={32} height={32} className="icone-jeu" /> : null}
                <h2>{arbre.nom}</h2>
                <span className="calc-compte">{parArbre[a]}</span>
                {parArbre[a] ? (
                  <button type="button" className="calc-raz" onClick={() => setPoints((p) => p.map((x, k) => (k === a ? x.map(() => 0) : x)))}>
                    Effacer
                  </button>
                ) : null}
              </header>
              <div className="calc-grille" style={{ gridTemplateRows: `repeat(${lignes}, auto)` }}>
                <svg className="calc-fleches" viewBox={`0 0 ${COLONNES} ${lignes}`} preserveAspectRatio="none" aria-hidden="true">
                  {arbre.talents.filter((x) => x.prerequisId && position.has(x.prerequisId)).map((x) => {
                    const p = position.get(x.prerequisId!)!;
                    const j = arbre.talents.indexOf(p);
                    const rempli = points[a][j] >= p.rangs;
                    return (
                      <line
                        key={x.id}
                        x1={p.colonne + 0.5} y1={p.palier + 0.5} x2={x.colonne + 0.5} y2={x.palier + 0.5}
                        className={rempli ? "fleche-active" : ""}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>
                {arbre.talents.map((x, i) => {
                  const v = points[a][i];
                  const ouvert = !blocageAjout(regles, points, a, i) || v > 0;
                  const etat = v >= x.rangs ? "max" : v > 0 ? "entame" : ouvert ? "ouvert" : "ferme";
                  const actif = choix?.a === a && choix.i === i;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      className={`calc-talent calc-${etat}${actif ? " calc-choisi" : ""}`}
                      style={{ gridColumn: x.colonne + 1, gridRow: x.palier + 1 }}
                      aria-label={`${x.nom}, ${v} sur ${x.rangs}`}
                      title={x.nom}
                      onClick={() => ajouter(a, i)}
                      onContextMenu={(e) => { e.preventDefault(); retirer(a, i); }}
                      onFocus={() => setChoix({ a, i })}
                      onMouseEnter={() => setChoix({ a, i })}
                      onKeyDown={(e) => {
                        if (e.key === "Delete" || e.key === "Backspace" || e.key === "-") { e.preventDefault(); retirer(a, i); }
                        if (e.key === "+") { e.preventDefault(); ajouter(a, i); }
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {x.icone ? <img src={x.icone} alt="" width={44} height={44} /> : <span className="calc-sans-icone" aria-hidden="true">?</span>}
                      <span className="calc-rang">{v}/{x.rangs}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="calc-detail" aria-live="polite">
        {t && choix ? (
          <>
            <div className="calc-detail-titre">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {t.icone ? <img src={t.icone} alt="" width={44} height={44} className="icone-jeu" /> : null}
              <div>
                <h3>{t.nom} <span className="doux">{pt}/{t.rangs}</span></h3>
                <p className="sort-meta">
                  {arbres[choix.a].nom} · palier {t.palier + 1} · niveau {t.niveau}
                  {t.palier ? `, ${t.palier * 5} points dans l'arbre` : ""}
                  {t.prerequis ? ` · requiert ${t.prerequis}` : ""}
                  {t.actif ? " · donne un sort" : ""}
                </p>
              </div>
            </div>
            {!t.description && !t.icone ? <p className="doux" style={{ margin: 0 }}>Les fichiers du jeu ne donnent pas encore son nom ni son effet.</p> : null}
            <DescriptionsRangs t={t} pt={pt} />
            <div className="calc-actions">
              <button type="button" className="btn btn-contour" onClick={() => retirer(choix.a, choix.i)} disabled={!!motifRetrait} aria-label={`Retirer un point de ${t.nom}`}>− 1 point</button>
              <button type="button" className="btn btn-or" onClick={() => ajouter(choix.a, choix.i)} disabled={!!motifAjout} aria-label={`Ajouter un point à ${t.nom}`}>+ 1 point</button>
            </div>
            {motifAjout && pt < t.rangs ? <p className="doux calc-motif">{motifAjout}</p> : null}
          </>
        ) : (
          <p className="doux" style={{ margin: 0 }}>
            Clic sur un talent : un point de plus ; clic droit : un point de moins. Sur téléphone, chaque toucher ajoute un point
            et le bouton − de ce panneau en retire un.
          </p>
        )}
      </div>
    </div>
  );
}
