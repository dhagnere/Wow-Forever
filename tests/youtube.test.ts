import { describe, expect, it } from "vitest";
import { idChaineValide, videosDepuisFlux } from "@/modules/veille";

// Flux public d'une chaîne YouTube (format Atom, champs yt: et media:), réduit à deux vidéos.
const FLUX = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>La Taverne Éternelle</title>
 <entry>
  <id>yt:video:AbCdEfGhIjK</id>
  <yt:videoId>AbCdEfGhIjK</yt:videoId>
  <title>Journal de Jobwow · 11 novembre 2026 · Durotar → Les Tarides</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=AbCdEfGhIjK"/>
  <published>2026-11-11T20:00:00+00:00</published>
  <media:group>
   <media:title>Journal de Jobwow</media:title>
   <media:description>Une séance de jeu sur WoW Forever, filmée sans guide payant : Durotar, Les Tarides.

Chapitres :
0:00 Début de la séance
14:32 Niveau 5</media:description>
  </media:group>
 </entry>
 <entry>
  <id>yt:video:ZzZzZzZzZz1</id>
  <yt:videoId>ZzZzZzZzZz1</yt:videoId>
  <title>Bande-annonce &lt;de la Taverne&gt;</title>
  <published>2026-11-04T18:00:00+00:00</published>
  <media:group><media:description>&lt;b&gt;Présentation&lt;/b&gt; de la chaîne.</media:description></media:group>
 </entry>
</feed>`;

describe("chaîne YouTube", () => {
  it("lit les vidéos du flux public : identifiant, titre, date, lien, résumé sans les chapitres", async () => {
    const v = await videosDepuisFlux(FLUX);
    expect(v).toHaveLength(2);
    expect(v[0]).toEqual({
      id: "AbCdEfGhIjK",
      titre: "Journal de Jobwow · 11 novembre 2026 · Durotar → Les Tarides",
      publieLe: "2026-11-11T20:00:00.000Z",
      lien: "https://www.youtube.com/watch?v=AbCdEfGhIjK",
      resume: "Une séance de jeu sur WoW Forever, filmée sans guide payant : Durotar, Les Tarides.",
    });
    // le titre reste du texte, le résumé perd toute balise
    expect(v[1].titre).toBe("Bande-annonce <de la Taverne>");
    expect(v[1].resume).toBe("Présentation de la chaîne.");
  });

  it("n'accepte qu'un identifiant de chaîne valide", () => {
    expect(idChaineValide("UCabcdefghijklmnopqrstuv")).toBe(true);
    expect(idChaineValide("@taverne-eternelle")).toBe(false);
    expect(idChaineValide("UC123")).toBe(false);
  });
});
