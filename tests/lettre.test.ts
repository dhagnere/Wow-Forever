import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { envoyerCourriel, envoyerLot, TAILLE_LOT } from "@/modules/veille/courriel/resend";
import {
  lienDesinscription, markdownVersTexte, messageConfirmation, messageLettre, resteDuJour, signatureAbonne, signatureValide,
} from "@/modules/veille/lettre/messages";

vi.mock("server-only", () => ({}));

const SITE = "https://www.taverne-eternelle.fr";
const appels: { url: string; entetes: Record<string, string>; corps: unknown }[] = [];
function resend(statut = 200) {
  appels.length = 0;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init: { body: string; headers: Record<string, string> }) => {
    appels.push({ url, entetes: init.headers, corps: JSON.parse(init.body) });
    return new Response("{}", { status: statut });
  }));
}

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", "x".repeat(40));
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("COURRIEL_EXPEDITEUR", "lettre@taverne-eternelle.fr");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("envoi par Resend", () => {
  it("envoie un message avec la clé, l'expéditeur et l'adresse de réponse", async () => {
    vi.stubEnv("COURRIEL_REPONSE", "contact@taverne-eternelle.fr");
    resend();
    expect(await envoyerCourriel({ a: "joueur@exemple.fr", sujet: "Bonjour", texte: "t", html: "<p>h</p>" })).toBe(true);
    expect(appels[0].url).toBe("https://api.resend.com/emails");
    expect(appels[0].entetes.Authorization).toBe("Bearer re_test");
    expect(appels[0].corps).toMatchObject({
      from: "La Taverne Éternelle <lettre@taverne-eternelle.fr>", to: ["joueur@exemple.fr"], subject: "Bonjour", reply_to: "contact@taverne-eternelle.fr",
    });
  });

  it("n'envoie rien sans configuration, et signale un refus", async () => {
    resend(403);
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await envoyerCourriel({ a: "a@b.fr", sujet: "s", texte: "t", html: "h" })).toBe(false);
    vi.stubEnv("RESEND_API_KEY", "");
    resend();
    expect(await envoyerCourriel({ a: "a@b.fr", sujet: "s", texte: "t", html: "h" })).toBe(false);
    expect(appels).toHaveLength(0);
  });

  it("groupe les messages de la Lettre en un seul appel, 50 au plus", async () => {
    resend();
    const m = { a: "a@b.fr", sujet: "s", texte: "t", html: "h" };
    expect(await envoyerLot([m, { ...m, a: "c@d.fr" }])).toBe(true);
    expect(appels[0].url).toBe("https://api.resend.com/emails/batch");
    expect(appels[0].corps).toHaveLength(2);
    await expect(envoyerLot(Array(TAILLE_LOT + 1).fill(m))).rejects.toThrow();
  });
});

describe("messages de la Lettre", () => {
  it("signe le lien de désinscription pour un seul abonné", () => {
    const s = signatureAbonne(12, "joueur@exemple.fr");
    expect(signatureValide(12, "joueur@exemple.fr", s)).toBe(true);
    expect(signatureValide(13, "joueur@exemple.fr", s)).toBe(false);
    expect(signatureValide(12, "autre@exemple.fr", s)).toBe(false);
    expect(signatureValide(12, "joueur@exemple.fr", "faux")).toBe(false);
    expect(lienDesinscription(SITE, "en", 12, "joueur@exemple.fr")).toBe(`${SITE}/en/newsletter/unsubscribe/?a=12&s=${s}`);
  });

  it("envoie le lien de confirmation vers la page de la bonne langue", () => {
    expect(messageConfirmation(SITE, "fr", "a@b.fr", "jeton-1").texte).toContain(`${SITE}/lettre/confirmation/?jeton=jeton-1`);
    const en = messageConfirmation(SITE, "en", "a@b.fr", "jeton-2");
    expect(en.sujet).toMatch(/Confirm/);
    expect(en.html).toContain(`${SITE}/en/newsletter/confirm/?jeton=jeton-2`);
  });

  it("filtre le HTML de la Lettre et ajoute la désinscription en un clic", () => {
    const m = messageLettre(SITE, { langue: "fr", sujet: "La Lettre", corps: "## Bonjour\n\nVoir [le guide](https://www.taverne-eternelle.fr/guides/)\n\n<script>alert(1)</script>" }, { id: 7, courriel: "a@b.fr" });
    expect(m.html).not.toContain("<script");
    expect(m.html).toContain("<h2");
    expect(m.html).toContain("/lettre/desinscription/?a=7&amp;s=");
    expect(m.entetes?.["List-Unsubscribe"]).toBe(`<${SITE}/api/lettre/desinscription/?a=7&s=${signatureAbonne(7, "a@b.fr")}>`);
    expect(m.entetes?.["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(m.texte).toContain("le guide (https://www.taverne-eternelle.fr/guides/)");
    expect(m.texte).toContain("/lettre/desinscription/?a=7&s=");
  });

  it("garde le Markdown lisible en texte brut", () => {
    expect(markdownVersTexte("## Titre\n\n**Gras** et *italique*")).toBe("Titre\n\nGras et italique");
  });

  it("respecte le plafond quotidien", () => {
    expect(resteDuJour(80, 30)).toBe(50);
    expect(resteDuJour(80, 95)).toBe(0);
  });
});

describe("inscription depuis les pages", () => {
  it("refuse une adresse invalide et annonce l'ouverture sans configuration, sans toucher à la base", async () => {
    const { inscrire } = await import("@/lib/lettre");
    expect(await inscrire("pas-une-adresse")).toEqual({ ok: false, message: expect.stringMatching(/pas valide/) });
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await inscrire("joueur@exemple.fr", "en")).toEqual({ ok: false, message: expect.stringMatching(/Sign-ups open/) });
  });

  it("ne garde aucune trace de Brevo dans le site", () => {
    const fichiers = (d: string): string[] =>
      readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? fichiers(path.join(d, f)) : [path.join(d, f)]));
    const code = ["app", "lib", "components"].flatMap(fichiers).filter((f) => /\.(ts|tsx)$/.test(f));
    expect(code.filter((f) => /api\.brevo\.com|BREVO_/.test(readFileSync(f, "utf8")))).toEqual([]);
  });
});
