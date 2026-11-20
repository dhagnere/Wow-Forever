// Robot d'exploration du site local : liens internes, ancres, canonical, hreflang, images.
// npm run verifier:liens -- [adresse] [limite] → rapport dans verifier-liens.json (dossier courant, non versionné)
// Lancer d'abord le site (npm run build && npm start). Une fiche d'objet en 404 en local est normale si la base d'objets est vide.
import { writeFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const LIMITE = Number(process.argv[3] ?? 6000);
const DEPARTS = ["/", "/en/", "/plan-du-site/", "/en/sitemap/", "/404-test-introuvable/"];

const pages = new Map(); // chemin → { statut, ids:Set, liens:[], canonical, hreflang:[], titre, description, h1, robots, images:[] }
const sources = new Map(); // cible → Set(pages qui y mènent)
const ancres = []; // { de, vers, ancre }
const file = [];
const vus = new Set();

function normaliser(href, depuis) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:") || href.startsWith("data:")) return null;
  let u;
  try { u = new URL(href, BASE + depuis); } catch { return null; }
  if (u.origin !== new URL(BASE).origin) return { externe: u.href };
  return { chemin: u.pathname + u.search, ancre: u.hash ? decodeURIComponent(u.hash.slice(1)) : "" };
}

function attr(balise, nom) {
  const m = balise.match(new RegExp(`\\s${nom}="([^"]*)"`, "i"));
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"') : null;
}

const externes = new Map();

async function lire(chemin) {
  let rep;
  try {
    rep = await fetch(BASE + chemin, { redirect: "manual", headers: { "user-agent": "explorateur-taverne", "accept-language": "fr-FR" } });
  } catch (e) {
    return { statut: 0, erreur: String(e) };
  }
  const info = { statut: rep.status, location: rep.headers.get("location"), type: rep.headers.get("content-type") ?? "" };
  if (rep.status >= 300 && rep.status < 400) return info;
  if (!info.type.includes("text/html")) { await rep.arrayBuffer(); return info; }
  const html = await rep.text();
  info.ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  info.liens = [...html.matchAll(/<a\s[^>]*>/gi)].map((m) => attr(m[0], "href")).filter(Boolean);
  info.images = [...html.matchAll(/<img\s[^>]*>/gi)].map((m) => ({ src: attr(m[0], "src"), alt: attr(m[0], "alt") }));
  info.canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1] ?? null;
  info.hreflang = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => [m[1], m[2]]);
  info.titre = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? null;
  info.description = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? null;
  info.robots = (html.match(/<meta name="robots" content="([^"]*)"/) ?? [])[1] ?? null;
  info.h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  info.crochets = [...html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").matchAll(/\[(TITRE|À compléter|A compléter|TODO|XXX)[^\]]{0,60}\]/gi)].map((m) => m[0]);
  info.introuvable = html.includes("data-introuvable");
  return info;
}

function ajouter(chemin, de) {
  if (!sources.has(chemin)) sources.set(chemin, new Set());
  if (de) sources.get(chemin).add(de);
  if (!vus.has(chemin) && vus.size < LIMITE) { vus.add(chemin); file.push(chemin); }
}

// Plan du site XML en plus des départs.
for (const plan of ["/sitemap.xml", "/sitemap-actualites.xml"]) {
  try {
    const xml = await (await fetch(BASE + plan)).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = new URL(m[1]);
      ajouter(u.pathname, plan);
    }
    for (const m of xml.matchAll(/href="([^"]+)"/g)) { const u = new URL(m[1]); ajouter(u.pathname, plan + " (hreflang)"); }
  } catch {}
}
for (const d of DEPARTS) ajouter(d, null);

const PARALLELE = 8;
async function ouvrier() {
  while (file.length) {
    const chemin = file.shift();
    const info = await lire(chemin);
    pages.set(chemin, info);
    if (info.location) {
      const n = normaliser(info.location, chemin);
      if (n?.chemin) ajouter(n.chemin, chemin + " (redirection)");
    }
    for (const href of info.liens ?? []) {
      const n = normaliser(href, chemin);
      if (!n) continue;
      if (n.externe) { if (!externes.has(n.externe)) externes.set(n.externe, new Set()); externes.get(n.externe).add(chemin); continue; }
      if (n.chemin.startsWith("/admin") || n.chemin.startsWith("/api/")) continue;
      if (n.ancre) ancres.push({ de: chemin, vers: n.chemin, ancre: n.ancre });
      ajouter(n.chemin, chemin);
    }
    for (const img of info.images ?? []) {
      const n = img.src && normaliser(img.src, chemin);
      if (n?.chemin) ajouter(n.chemin, chemin + " (image)");
    }
    if (pages.size % 200 === 0) process.stderr.write(`${pages.size} pages, ${file.length} en file\n`);
  }
}
await Promise.all(Array.from({ length: PARALLELE }, ouvrier));

// Ancres : l'identifiant doit exister sur la page cible.
const ancresCassees = [];
for (const a of ancres) {
  const p = pages.get(a.vers);
  if (!p?.ids) continue;
  if (!p.ids.has(a.ancre)) ancresCassees.push(a);
}

const sortie = {
  total: pages.size,
  parStatut: {},
  erreurs: [],
  redirections: [],
  ancresCassees: [],
  sansTitre: [], sansDescription: [], sansH1: [], plusieursH1: [], canonicalAbsent: [], canonicalDifferent: [], hreflangCasse: [], crochets: [], imagesSansAlt: [], titresDoubles: {},
  externes: [...externes.entries()].map(([u, s]) => ({ url: u, pages: s.size, exemple: [...s][0] })).sort((a, b) => b.pages - a.pages),
};
const titres = new Map();
for (const [chemin, p] of pages) {
  sortie.parStatut[p.statut] = (sortie.parStatut[p.statut] ?? 0) + 1;
  const de = [...(sources.get(chemin) ?? [])].slice(0, 5);
  if (p.statut >= 400 || p.statut === 0) { if (chemin !== "/404-test-introuvable/") sortie.erreurs.push({ chemin, statut: p.statut, de }); continue; }
  if (p.statut >= 300) { sortie.redirections.push({ chemin, vers: p.location, de }); continue; }
  if (!p.type.includes("text/html")) continue;
  const indexable = !(p.robots ?? "").includes("noindex");
  if (!p.titre) sortie.sansTitre.push(chemin);
  if (indexable && !p.description) sortie.sansDescription.push(chemin);
  if (!p.h1?.length) sortie.sansH1.push(chemin);
  if ((p.h1?.length ?? 0) > 1) sortie.plusieursH1.push({ chemin, h1: p.h1 });
  if (indexable && !p.canonical) sortie.canonicalAbsent.push(chemin);
  if (p.canonical) { const c = new URL(p.canonical).pathname; if (indexable && c !== chemin.split("?")[0]) sortie.canonicalDifferent.push({ chemin, canonical: c }); }
  for (const [, href] of p.hreflang ?? []) { const c = new URL(href).pathname; const q = pages.get(c); if (q && q.statut >= 400) sortie.hreflangCasse.push({ chemin, vers: c, statut: q.statut }); else if (!q) sortie.hreflangCasse.push({ chemin, vers: c, statut: "non visité" }); }
  if (p.crochets?.length) sortie.crochets.push({ chemin, textes: [...new Set(p.crochets)].slice(0, 5) });
  for (const i of p.images ?? []) if (i.alt === null) sortie.imagesSansAlt.push({ chemin, src: i.src });
  if (indexable && p.titre) { if (!titres.has(p.titre)) titres.set(p.titre, []); titres.get(p.titre).push(chemin); }
}
for (const [t, l] of titres) if (l.length > 1) sortie.titresDoubles[t] = l;
sortie.ancresCassees = ancresCassees;
const p404 = pages.get("/404-test-introuvable/");
sortie.orphelines = [...pages.keys()].filter((c) => { const src = [...(sources.get(c) ?? [])]; const p = pages.get(c); return p?.statut === 200 && (p.type ?? "").includes("text/html") && src.length > 0 && src.every((x) => x.startsWith("/sitemap")); });
sortie.page404 = { statut: p404?.statut, introuvable: p404?.introuvable };
writeFileSync("verifier-liens.json", JSON.stringify(sortie, null, 2));
console.log(JSON.stringify({ total: sortie.total, parStatut: sortie.parStatut, erreurs: sortie.erreurs.length, redirections: sortie.redirections.length, ancresCassees: ancresCassees.length, sansDescription: sortie.sansDescription.length, sansH1: sortie.sansH1.length, plusieursH1: sortie.plusieursH1.length, canonicalAbsent: sortie.canonicalAbsent.length, canonicalDifferent: sortie.canonicalDifferent.length, hreflangCasse: sortie.hreflangCasse.length, crochets: sortie.crochets.length, imagesSansAlt: sortie.imagesSansAlt.length, titresDoubles: Object.keys(sortie.titresDoubles).length, externes: sortie.externes.length, orphelines: sortie.orphelines.length, page404: sortie.page404 }, null, 1));
