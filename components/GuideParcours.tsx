"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cadrer, glisser, versEcran, VUE_ENTIERE, zoomerAutour, ZOOM_MAX, ZOOM_MIN, type Vue } from "./zoomCarte";

export interface HubVue { x: number; y: number; n: string[] }
export interface EtapeVue {
  id: number; t: string; nv: number; min: number; cl: number; grp: 0 | 1; obj: string[]; g: number; gn: string; r: number; rn: string; rl: string | null;
  cib: { p: [number, number][]; c: [number, number] } | null;
}
export interface ActionVue { a: "prendre" | "faire" | "rendre"; q: number }
export interface ArretVue { x: number | null; y: number | null; type: "pnj" | "cible" | "ailleurs"; hub: number; actions: ActionVue[] }
export interface ZoneVue {
  lieu: string; nom: string; carte: string; lienCarte: string; niveaux: [number, number]; hubs: HubVue[]; etapes: EtapeVue[]; arrets: ArretVue[];
  /** Lieux nommés à afficher sur la carte (île de Zéphras). */
  lieux?: { nom: string; x: number; y: number }[];
  /** Message à la place des étapes, quand la zone n'a pas encore de quêtes relevées. */
  note?: string;
}

type Jour = { jour: string; faites: number };

/** Hauteur de la carte dans le repère du tracé (cartes de zone en 1002 × 668 : 100 de large, 66,7 de haut). */
const H = 66.7;
const yCarte = (y: number) => (y * H) / 100;

/** Segment de A vers B raccourci aux deux bouts, pour que la pointe de la flèche ne disparaisse pas sous la pastille. */
export function segment(a: { x: number; y: number }, b: { x: number; y: number }, marge = 2.2): [number, number, number, number] | null {
  const ax = a.x, ay = yCarte(a.y), bx = b.x, by = yCarte(b.y);
  const d = Math.hypot(bx - ax, by - ay);
  if (d < marge * 2.2) return null;
  const ux = (bx - ax) / d, uy = (by - ay) / d;
  return [ax + ux * marge, ay + uy * marge, bx - ux * marge, by - uy * marge];
}

/**
 * Flèche courbe de A vers B (chemin SVG) : légèrement bombée vers la gauche du trajet, si bien qu'un aller et un retour
 * entre les deux mêmes points s'écartent au lieu de se superposer.
 */
export function courbe(a: { x: number; y: number }, b: { x: number; y: number }, marge = 2.2, bombe = 0.18): string | null {
  const s = segment(a, b, marge);
  if (!s) return null;
  const [x1, y1, x2, y2] = s;
  const d = Math.hypot(x2 - x1, y2 - y1);
  const cx = (x1 + x2) / 2 + ((y2 - y1) / d) * d * bombe;
  const cy = (y1 + y2) / 2 - ((x2 - x1) / d) * d * bombe;
  const r = (v: number) => Math.round(v * 1000) / 1000;
  return `M${r(x1)},${r(y1)} Q${r(cx)},${r(cy)} ${r(x2)},${r(y2)}`;
}

/** Textes de l'interface du guide, en français et en anglais. */
const TXT = {
  fr: {
    carte: "Carte", secteur: "Secteur des objectifs", ailleurs: "Hors de la zone", etape: (n: number) => `étape${n > 1 ? "s" : ""}`,
    titreSecteur: "Monstres et objets des quêtes en cours", zoomer: "Zoomer", dezoomer: "Dézoomer", entiere: "Toute la zone",
    pnj: "PNJ", objectifs: "objectifs", fleches: (a: number, b: number) => ` · flèches : étapes ${a} à ${b}`,
    aide: "Molette ou deux doigts pour zoomer, glisser pour se déplacer, double clic pour approcher.", detaillee: "Carte détaillée",
    verbes: { prendre: "Prendre", faire: "Faire", rendre: "Rendre" }, a: "à", niv: "niv.", classe: "Classe", groupe: "Groupe", terminee: "Terminée",
    voirCibles: "Monstres et objets sur la carte", rendues: "quêtes rendues", progression: "Progression du guide",
    chargement: "Chargement de votre progression…",
    duJour: (n: number) => `aujourd'hui : ${n} quête${n > 1 ? "s" : ""} rendue${n > 1 ? "s" : ""}.`,
    envoi: "Sauvegarde…", ok: "Progression sauvegardée.", erreur: "Sauvegarde impossible, réessayez.", compte: "Progression sauvegardée sur votre compte.",
    derniers: "Derniers jours", sansCompte: ["Vos cases cochées disparaîtront en quittant la page.", "Créez un compte gratuit", "pour garder votre progression."],
    resume: (a: number, b: number, nb: number, t: number, e: number) => ` · niveaux ${a} à ${b} · ${nb}/${t} quêtes · ${e} étapes`,
    depart: " · zone de départ · quêtes à relever au lancement",
    popupTitre: "Gardez votre progression",
    popup: (t: string) => `Avec un compte gratuit à la Taverne, chaque quête cochée dans « ${t} » est sauvegardée, jour après jour, sur tous vos appareils. Sans compte, vos cases s'effacent quand vous quittez la page.`,
    popupLettre: "Le même formulaire vous inscrit à la Lettre du dimanche, si vous le souhaitez.",
    creer: "Créer mon compte", connexion: "Me connecter", plusTard: "Plus tard", nombre: "fr-FR", decimal: ",", dp: " : ", pv: " ; ",
  },
  en: {
    carte: "Map", secteur: "Objective area", ailleurs: "Outside the zone", etape: (n: number) => `step${n > 1 ? "s" : ""}`,
    titreSecteur: "Monsters and objects for current quests", zoomer: "Zoom in", dezoomer: "Zoom out", entiere: "Whole zone",
    pnj: "NPCs", objectifs: "objectives", fleches: (a: number, b: number) => ` · arrows: steps ${a} to ${b}`,
    aide: "Scroll or pinch to zoom, drag to move, double-click to get closer.", detaillee: "Detailed map",
    verbes: { prendre: "Accept", faire: "Do", rendre: "Turn in" }, a: "to", niv: "lvl", classe: "Class", groupe: "Group", terminee: "Done",
    voirCibles: "Monsters and objects on the map", rendues: "quests turned in", progression: "Guide progress",
    chargement: "Loading your progress…",
    duJour: (n: number) => `today: ${n} quest${n === 1 ? "" : "s"} turned in.`,
    envoi: "Saving…", ok: "Progress saved.", erreur: "Could not save, please try again.", compte: "Progress saved to your account.",
    derniers: "Last days", sansCompte: ["Your ticks will be lost when you leave the page.", "Create a free account", "to keep your progress."],
    resume: (a: number, b: number, nb: number, t: number, e: number) => ` · levels ${a} to ${b} · ${nb}/${t} quests · ${e} steps`,
    depart: " · starting zone · quests to be recorded at launch",
    popupTitre: "Keep your progress",
    popup: (t: string) => `With a free account at the Tavern, every quest you tick in “${t}” is saved, day after day, on all your devices. Without an account, your ticks are cleared when you leave the page.`,
    popupLettre: "The same form can also sign you up for our Sunday newsletter, if you wish.",
    creer: "Create my account", connexion: "Log in", plusTard: "Later", nombre: "en-GB", decimal: ".", dp: ": ", pv: "; ",
  },
} as const;
type Textes = (typeof TXT)["fr"] | (typeof TXT)["en"];

const aujourdhui = () => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());

function CarteZone({ z, faites, voir, actif, onArret, cadrage, t }: {
  z: ZoneVue; t: Textes; faites: Set<number>; voir: Set<number>; actif: number | null; onArret: (i: number) => void;
  cadrage: { cle: string; points: [number, number][] } | null;
}) {
  const [v, setV] = useState<Vue>(VUE_ENTIERE);
  const cadre = useRef<HTMLDivElement>(null);
  const pointeurs = useRef(new Map<number, { x: number; y: number }>());
  const aGlisse = useRef(false);

  // Cadrage demandé par la liste (étape choisie, cibles affichées).
  useEffect(() => {
    if (cadrage) setV(cadrer(cadrage.points));
  }, [cadrage]);

  // Molette : zoom autour du curseur. Au zoom le plus large, la molette vers le bas laisse défiler la page.
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const molette = (e: WheelEvent) => {
      const r = el.getBoundingClientRect();
      const f = Math.exp(-e.deltaY * 0.0015);
      setV((avant) => {
        if (avant.s <= 1 && f < 1) return avant;
        return zoomerAutour(avant, f, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      });
      if (!(f < 1 && v.s <= 1)) e.preventDefault();
    };
    el.addEventListener("wheel", molette, { passive: false });
    return () => el.removeEventListener("wheel", molette);
  }, [v.s]);

  // Glisser pour se déplacer ; deux doigts pour zoomer.
  const appui = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    cadre.current?.setPointerCapture(e.pointerId);
    pointeurs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    aGlisse.current = false;
  };
  const mouvement = (e: React.PointerEvent) => {
    const el = cadre.current;
    const avant = pointeurs.current.get(e.pointerId);
    if (!el || !avant) return;
    const r = el.getBoundingClientRect();
    const autres = [...pointeurs.current.entries()].filter(([id]) => id !== e.pointerId).map(([, p]) => p);
    if (autres.length === 1) {
      const o = autres[0];
      const f = Math.hypot(e.clientX - o.x, e.clientY - o.y) / Math.max(1, Math.hypot(avant.x - o.x, avant.y - o.y));
      setV((w) => zoomerAutour(w, f, ((e.clientX + o.x) / 2 - r.left) / r.width, ((e.clientY + o.y) / 2 - r.top) / r.height));
    } else {
      setV((w) => glisser(w, (e.clientX - avant.x) / r.width, (e.clientY - avant.y) / r.height));
    }
    if (Math.hypot(e.clientX - avant.x, e.clientY - avant.y) > 2) aGlisse.current = true;
    pointeurs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const relache = (e: React.PointerEvent) => { pointeurs.current.delete(e.pointerId); };

  // Un arrêt est fait quand toutes les quêtes qu'on y rend ou qu'on y avance sont terminées.
  const arretFait = (a: ArretVue) => a.actions.every((x) => faites.has(z.etapes[x.q].id));
  // Portion de route affichée : l'étape choisie, sinon la première qui reste à faire, et les suivantes.
  const debut = actif ?? Math.max(0, z.arrets.findIndex((a) => !arretFait(a)));
  const fin = debut + FENETRE;
  const toutes = z.arrets.map((a, i) => ({ ...a, i })).filter((a) => a.x !== null && a.y !== null) as (ArretVue & { i: number; x: number; y: number })[];
  const places = toutes.filter((a) => a.i >= debut - 1 && a.i <= fin);
  // Plusieurs passages au même point de rassemblement : une seule pastille, avec les numéros d'étape.
  const pastilles = new Map<string, { x: number; y: number; type: ArretVue["type"]; etapes: number[]; noms: string[]; fait: boolean }>();
  // Les autres PNJ de la zone restent visibles, sans numéro.
  const horsFenetre = new Map<number, ArretVue & { x: number; y: number }>();
  for (const a of toutes) if (a.type === "pnj" && (a.i < debut - 1 || a.i > fin)) horsFenetre.set(a.hub, a);
  for (const a of places) {
    const cle = a.type === "pnj" ? `h${a.hub}` : `c${a.x},${a.y}`;
    const p = pastilles.get(cle) ?? { x: a.x, y: a.y, type: a.type, etapes: [], noms: a.type === "pnj" ? z.hubs[a.hub].n : [], fait: true };
    p.etapes.push(a.i + 1);
    p.fait &&= arretFait(a);
    pastilles.set(cle, p);
  }
  const quetesVues = z.etapes.map((e, q) => ({ e, q })).filter(({ e }) => voir.has(e.id) && e.cib);
  const idSvg = `fl-${z.lieu}`;
  // Au zoom s, épaisseurs, pointes et marges sont divisées par s : à l'écran, elles ne changent pas.
  const ep = (base: number) => base / v.s;
  const pos = (x: number, y: number) => versEcran(v, x, y);
  const pointe = 2.4 / v.s;
  return (
    <figure className="carte-guide">
      <div
        ref={cadre}
        className={`carte-points carte-zoom${v.s > 1 ? " zoomee" : ""}`}
        onPointerDown={appui}
        onPointerMove={mouvement}
        onPointerUp={relache}
        onPointerCancel={relache}
        onDoubleClick={(e) => {
          const r = cadre.current!.getBoundingClientRect();
          setV((w) => zoomerAutour(w, 2, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height));
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={z.carte}
          alt={`${t.carte}${t.dp}${z.nom}`}
          width={1000}
          height={667}
          loading="lazy"
          draggable={false}
          style={{ transform: `scale(${v.s}) translate(${-v.x}%, ${-v.y}%)`, transformOrigin: "0 0" }}
        />
        <svg className="trace-route" viewBox={`${v.x} ${yCarte(v.y)} ${100 / v.s} ${H / v.s}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id={`${idSvg}-or`} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth={pointe} markerHeight={pointe} orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="pointe-or" />
            </marker>
            <marker id={`${idSvg}-rouge`} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth={pointe} markerHeight={pointe} orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="pointe-rouge" />
            </marker>
          </defs>
          {places.slice(1).map((b, k) => {
            const d = courbe(places[k], b, ep(2.2));
            if (!d) return null;
            const fait = arretFait(b);
            return (
              <path
                key={b.i} d={d}
                className={`fleche-route${fait ? " fleche-faite" : ""}${actif === b.i ? " fleche-active" : ""}`}
                style={{ strokeWidth: ep(actif === b.i ? 0.7 : 0.45) }}
                markerEnd={`url(#${idSvg}-or)`}
              />
            );
          })}
          {quetesVues.map(({ e }) => {
            const c = { x: e.cib!.c[0], y: e.cib!.c[1] };
            const depart = e.g >= 0 ? z.hubs[e.g] : null;
            const fin = e.r >= 0 ? z.hubs[e.r] : null;
            const aller = depart ? courbe(depart, c, ep(1.3)) : null;
            const retour = fin ? courbe(c, fin, ep(1.3)) : null;
            return (
              <g key={e.id} className="fleches-quete">
                {aller ? <path d={aller} style={{ strokeWidth: ep(0.55) }} markerEnd={`url(#${idSvg}-rouge)`} /> : null}
                {retour ? <path d={retour} className="retour" style={{ strokeWidth: ep(0.55), strokeDasharray: `${ep(1.2)} ${ep(0.8)}` }} markerEnd={`url(#${idSvg}-rouge)`} /> : null}
              </g>
            );
          })}
        </svg>
        {(z.lieux ?? []).map((l) => {
          const p = pos(l.x, l.y);
          return p.visible ? <span key={l.nom} className="lieu-carte" style={{ left: `${p.gauche}%`, top: `${p.haut}%` }}>{l.nom}</span> : null;
        })}
        {quetesVues.flatMap(({ e }) => e.cib!.p.map(([x, y], k) => {
          const p = pos(x, y);
          return p.visible ? <span key={`${e.id}-${k}`} className="cible-carte" style={{ left: `${p.gauche}%`, top: `${p.haut}%` }} title={`${e.t}${t.dp}${e.obj.join(t.pv)}`} aria-hidden="true" /> : null;
        }))}
        {[...horsFenetre.entries()].filter(([h]) => !places.some((a) => a.type === "pnj" && a.hub === h)).map(([h, a]) => {
          const p = pos(a.x, a.y);
          return p.visible ? <span key={`loin-${h}`} className="hub-loin" style={{ left: `${p.gauche}%`, top: `${p.haut}%` }} title={z.hubs[h].n.join(", ")} aria-hidden="true" /> : null;
        })}
        {[...pastilles.values()].map((p) => {
          const e = pos(p.x, p.y);
          if (!e.visible) return null;
          const libelle = p.etapes.length > 3 ? `${p.etapes.slice(0, 3).join("·")}…` : p.etapes.join("·");
          return (
            <button
              key={`${p.type}-${p.x}-${p.y}`}
              type="button"
              className={`${p.type === "pnj" ? "hub-carte" : "secteur-carte"}${p.fait ? " hub-fini" : ""}${actif !== null && p.etapes.includes(actif + 1) ? " hub-choisi" : ""}`}
              style={{ left: `${e.gauche}%`, top: `${e.haut}%` }}
              onClick={() => { if (!aGlisse.current) onArret(p.etapes.find((n) => !arretFait(z.arrets[n - 1])) ?? p.etapes[0]); }}
              aria-label={`${p.type === "pnj" ? p.noms.join(", ") : t.secteur}, ${t.etape(p.etapes.length)} ${p.etapes.join(", ")}`}
              title={p.type === "pnj" ? p.noms.join(", ") : t.titreSecteur}
            >
              <span>{libelle}</span>
            </button>
          );
        })}
        <div className="zoom-commandes">
          <button type="button" onClick={() => setV((w) => zoomerAutour(w, 1.6, 0.5, 0.5))} disabled={v.s >= ZOOM_MAX} aria-label={t.zoomer}>+</button>
          <button type="button" onClick={() => setV((w) => zoomerAutour(w, 1 / 1.6, 0.5, 0.5))} disabled={v.s <= ZOOM_MIN} aria-label={t.dezoomer}>−</button>
          <button type="button" onClick={() => setV(VUE_ENTIERE)} disabled={v.s <= ZOOM_MIN} aria-label={t.entiere} title={t.entiere}>⤢</button>
        </div>
        {v.s > 1 ? <span className="zoom-niveau" aria-live="polite">× {v.s.toFixed(1).replace(".", t.decimal)}</span> : null}
      </div>
      <figcaption className="doux">
        <span className="legende-pnj" aria-hidden="true" /> {t.pnj} · <span className="legende-secteur" aria-hidden="true" /> {t.objectifs}{z.arrets.length ? t.fleches(debut + 1, Math.min(fin + 1, z.arrets.length)) : ""}.
        {t.aide}{" "}
        <Link href={z.lienCarte}>{t.detaillee}</Link> · © Blizzard Entertainment
      </figcaption>
    </figure>
  );
}

/** Nombre d'étapes tracées après l'étape en cours. */
const FENETRE = 8;

export function GuideParcours({ cle, titre, zones, retour, langue = "fr" }: { cle: string; titre: string; zones: ZoneVue[]; retour: string; langue?: "fr" | "en" }) {
  const t: Textes = TXT[langue];
  const [faites, setFaites] = useState<Set<number>>(new Set());
  const [voir, setVoir] = useState<Set<number>>(new Set());
  const [compte, setCompte] = useState<{ connecte: boolean; pseudo?: string } | null>(null);
  const [jours, setJours] = useState<Jour[]>([]);
  const [etat, setEtat] = useState<"" | "envoi" | "ok" | "erreur">("");
  const [popup, setPopup] = useState(false);
  const [actif, setActif] = useState<{ zone: number; arret: number } | null>(null);
  const [cadrage, setCadrage] = useState<{ zone: number; cle: string; points: [number, number][] } | null>(null);
  // Zone demandée par l'adresse (#zone-durotar), depuis la page d'une zone.
  const [demandee, setDemandee] = useState<string | null>(null);
  useEffect(() => {
    const lire = () => {
      const m = /^#zone-([a-z0-9-]+)$/.exec(window.location.hash);
      if (!m || !zones.some((z) => z.lieu === m[1])) return;
      setDemandee(m[1]);
      requestAnimationFrame(() => document.getElementById(`zone-${m[1]}`)?.scrollIntoView({ block: "start" }));
    };
    lire();
    window.addEventListener("hashchange", lire);
    return () => window.removeEventListener("hashchange", lire);
  }, [zones]);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deja = useRef(false);

  useEffect(() => {
    fetch(`/api/progression/?guide=${encodeURIComponent(cle)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { connecte: boolean; pseudo?: string; quetes?: number[]; jours?: Jour[] }) => {
        setCompte({ connecte: d.connecte, pseudo: d.pseudo });
        if (d.quetes) setFaites(new Set(d.quetes));
        if (d.jours) setJours(d.jours);
      })
      .catch(() => setCompte({ connecte: false }));
  }, [cle]);

  const sauvegarder = useCallback((s: Set<number>) => {
    if (minuteur.current) clearTimeout(minuteur.current);
    setEtat("envoi");
    minuteur.current = setTimeout(() => {
      fetch("/api/progression/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guide: cle, quetes: [...s] }) })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d: { jours?: Jour[] }) => { setEtat("ok"); if (d.jours) setJours(d.jours); })
        .catch(() => setEtat("erreur"));
    }, 800);
  }, [cle]);

  const basculer = (id: number) => {
    setFaites((avant) => {
      const s = new Set(avant);
      if (s.has(id)) s.delete(id); else s.add(id);
      if (compte?.connecte) sauvegarder(s);
      return s;
    });
    // Sans compte : la proposition s'affiche une fois par visite.
    if (compte && !compte.connecte && !deja.current) {
      deja.current = true;
      let vu = false;
      try { vu = sessionStorage.getItem("taverne-proposition-compte") === "1"; } catch { /* navigation privée */ }
      if (!vu) setPopup(true);
    }
  };

  const basculerVoir = (zi: number, e: EtapeVue) => {
    const affiche = !voir.has(e.id);
    setVoir((avant) => {
      const s = new Set(avant);
      if (s.has(e.id)) s.delete(e.id); else s.add(e.id);
      return s;
    });
    // La carte s'approche du donneur, des cibles et du PNJ à qui rendre la quête.
    if (affiche && e.cib) {
      const z = zones[zi];
      const points: [number, number][] = [...e.cib.p];
      for (const h of [e.g, e.r]) if (h >= 0) points.push([z.hubs[h].x, z.hubs[h].y]);
      setCadrage({ zone: zi, cle: `q${e.id}-${Date.now()}`, points });
    }
  };

  /** Étape choisie dans la liste : la carte s'approche de cette étape et de la suivante. */
  const cadrerEtape = (zi: number, ai: number) => {
    const z = zones[zi];
    const points = z.arrets.slice(ai, ai + 2).filter((a) => a.x !== null && a.y !== null).map((a) => [a.x!, a.y!] as [number, number]);
    if (points.length) setCadrage({ zone: zi, cle: `a${ai}-${Date.now()}`, points });
  };

  const fermerPopup = () => {
    setPopup(false);
    try { sessionStorage.setItem("taverne-proposition-compte", "1"); } catch { /* sans stockage */ }
  };

  useEffect(() => {
    if (!popup) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && fermerPopup();
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [popup]);

  const allerA = (zone: number, arret: number) => {
    setActif({ zone, arret });
    document.getElementById(`arret-${zones[zone].lieu}-${arret}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const total = zones.reduce((s, z) => s + z.etapes.length, 0);
  const nbFaites = zones.reduce((s, z) => s + z.etapes.filter((e) => faites.has(e.id)).length, 0);
  const duJour = jours.find((j) => j.jour === aujourdhui())?.faites ?? 0;
  // Joueur qui commence : la première zone (même sans quêtes relevées, comme Zéphras) ; sinon la première à terminer.
  const zoneEnCours = nbFaites === 0 ? 0 : zones.findIndex((z) => z.etapes.some((e) => !faites.has(e.id)));
  const lienCompte = `${langue === "en" ? "/en/account/" : "/compte/"}?retour=${encodeURIComponent(retour)}`;

  return (
    <div className="guide-parcours">
      <div className="guide-bilan" aria-live="polite">
        <div>
          <p className="guide-compteur"><strong>{nbFaites}</strong> / {total} {t.rendues}</p>
          <div className="barre" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={nbFaites} aria-label={t.progression}>
            <span style={{ width: `${total ? (100 * nbFaites) / total : 0}%` }} />
          </div>
        </div>
        <div className="guide-sauvegarde">
          {compte === null ? <span className="doux">{t.chargement}</span>
            : compte.connecte ? (
              <>
                <span>
                  <strong>{compte.pseudo}</strong>, {t.duJour(duJour)}{" "}
                  <span className="doux">{etat === "envoi" ? t.envoi : etat === "ok" ? t.ok : etat === "erreur" ? t.erreur : t.compte}</span>
                </span>
                {jours.length > 1 ? (
                  <span className="doux jours">{t.derniers}{t.dp}{jours.slice(0, 7).map((j) => `${j.jour.slice(8, 10)}/${j.jour.slice(5, 7)} · ${j.faites}`).join(" — ")}</span>
                ) : null}
              </>
            ) : (
              <span>
                {t.sansCompte[0]} <Link href={lienCompte} data-cta="guide-compte">{t.sansCompte[1]}</Link> {t.sansCompte[2]}
              </span>
            )}
        </div>
      </div>

      <ol className="zones-guide">
        {zones.map((z, zi) => {
          const nb = z.etapes.filter((e) => faites.has(e.id)).length;
          const arretActif = actif?.zone === zi ? actif.arret : null;
          return (
            <li key={z.lieu} id={`zone-${z.lieu}`} className="zone-guide">
              <details open={demandee ? z.lieu === demandee || zi === Math.max(0, zoneEnCours) : zi === Math.max(0, zoneEnCours)}>
                <summary>
                  <span className="numero-etape" aria-hidden="true">{zi + 1}</span>
                  <span className="zone-titre">
                    <strong>{z.nom}</strong>
                    <span className="doux">
                      {z.etapes.length ? t.resume(z.niveaux[0], z.niveaux[1], nb, z.etapes.length, z.arrets.length) : t.depart}
                    </span>
                  </span>
                  {z.etapes.length && nb === z.etapes.length ? <span className="badge-talent">{t.terminee}</span> : null}
                </summary>
                <div className="zone-corps">
                  <CarteZone z={z} faites={faites} voir={voir} actif={arretActif} onArret={(n) => allerA(zi, n - 1)} cadrage={cadrage?.zone === zi ? cadrage : null} t={t} />
                  {z.note ? <p className="note-zone">{z.note}</p> : null}
                  <ol className="arrets-guide">
                    {z.arrets.map((a, ai) => {
                      const lieu = a.type === "pnj" ? z.hubs[a.hub].n.slice(0, 3).join(", ")
                        : a.type === "cible" ? t.secteur : t.ailleurs;
                      return (
                        <li key={ai} id={`arret-${z.lieu}-${ai}`} className={`arret-guide arret-${a.type}${arretActif === ai ? " arret-actif" : ""}`}>
                          <button type="button" className="arret-titre" onClick={() => { setActif(arretActif === ai ? null : { zone: zi, arret: ai }); if (arretActif !== ai) cadrerEtape(zi, ai); }}>
                            <span className={a.type === "pnj" ? "pastille" : "pastille pastille-secteur"}>{ai + 1}</span>
                            <strong>{lieu}</strong>
                            {a.x !== null && a.y !== null ? <span className="doux"> ({a.x.toLocaleString(t.nombre)} · {a.y.toLocaleString(t.nombre)})</span> : null}
                          </button>
                          <ul className="actions-arret">
                            {a.actions.map((x) => {
                              const e = z.etapes[x.q];
                              const fait = faites.has(e.id);
                              return (
                                <li key={`${x.a}-${e.id}`} className={`action-${x.a}${fait ? " faite" : ""}`}>
                                  {x.a === "rendre" ? (
                                    <label className="ligne-action">
                                      <input type="checkbox" checked={fait} onChange={() => basculer(e.id)} />
                                      <span><span className="verbe">{t.verbes[x.a]}</span> <strong>{e.t}</strong>{e.rl ? <span className="doux"> {t.a} {e.rn} ({e.rl})</span> : a.type !== "pnj" && e.rn ? <span className="doux"> {t.a} {e.rn}</span> : null}</span>
                                    </label>
                                  ) : (
                                    <div className="ligne-action">
                                      <span className="puce-action" aria-hidden="true">{x.a === "prendre" ? "!" : "⚔"}</span>
                                      <span>
                                        <span className="verbe">{t.verbes[x.a]}</span> <strong>{e.t}</strong>
                                        {x.a === "prendre" ? <span className="doux"> · {t.niv} {e.nv}</span> : null}
                                        {x.a === "prendre" && e.cl ? <span className="badge-talent">{t.classe}</span> : null}
                                        {x.a === "prendre" && e.grp ? <span className="badge-talent">{t.groupe}</span> : null}
                                        {x.a === "faire" && e.obj.length ? <span className="objectifs">{t.dp}{e.obj.join(t.pv)}</span> : null}
                                        {e.cib && x.a === "faire" ? (
                                          <label className="voir-cibles">
                                            <input type="checkbox" checked={voir.has(e.id)} onChange={() => basculerVoir(zi, e)} />
                                            {t.voirCibles}
                                          </label>
                                        ) : null}
                                      </span>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      {popup ? (
        <div className="fond-popup" role="presentation" onClick={fermerPopup}>
          <div className="popup" role="dialog" aria-modal="true" aria-labelledby="titre-popup" onClick={(e) => e.stopPropagation()}>
            <h2 id="titre-popup">{t.popupTitre}</h2>
            <p>{t.popup(titre)}</p>
            <p className="doux" style={{ fontSize: 14 }}>{t.popupLettre}</p>
            <div className="actions-bandeau">
              <Link href={lienCompte} className="btn btn-or" data-cta="popup-compte-creer">{t.creer}</Link>
              <Link href={`${lienCompte}&mode=connexion`} className="btn btn-contour" data-cta="popup-compte-connexion">{t.connexion}</Link>
              <button type="button" className="btn btn-contour" onClick={fermerPopup}>{t.plusTard}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
