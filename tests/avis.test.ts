import { beforeEach, describe, expect, it, vi } from "vitest";

const parse = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  class APIError extends Error { status = 500; }
  class RateLimitError extends APIError {}
  class AuthenticationError extends APIError {}
  class Anthropic {
    static APIError = APIError;
    static RateLimitError = RateLimitError;
    static AuthenticationError = AuthenticationError;
    messages = { parse };
  }
  return { default: Anthropic };
});

const { proposerAvis, rediger, nettoyerAvis } = await import("@/modules/veille/redaction/redacteur");
const { CONSIGNES_AVIS, CONSIGNES } = await import("@/modules/veille/redaction/consignes");

const article = { titre: "La salle des Thanes, nouveau donjon", chapo: "Repéré en bêta.", corps: "Un nouveau donjon accessible dès le niveau 13. ".repeat(10) };
const avis = "Un donjon dès le niveau 13 ? Mon voleur de bas niveau prépare déjà son sac… et ses excuses pour le premier wipe. Prometteur, à condition que les files d'attente suivent.";

beforeEach(() => {
  parse.mockReset();
  vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 404 })));
});

describe("proposition d'avis", () => {
  it("renvoie un avis nettoyé, rédigé selon les consignes humoristiques", async () => {
    parse.mockResolvedValue({ stop_reason: "end_turn", parsed_output: { avis: `${avis} [clin d'œil]` } });
    const r = await proposerAvis(article);
    expect(r).toEqual({ ok: true, avis: `${avis} clin d'œil` });
    const appel = parse.mock.calls[0][0];
    expect(appel.system).toBe(CONSIGNES_AVIS);
    expect(appel.messages[0].content).toContain(article.titre);
  });

  it("n'appelle pas l'API pour un article trop court", async () => {
    expect((await proposerAvis({ ...article, corps: "Trop court." })).ok).toBe(false);
    expect(parse).not.toHaveBeenCalled();
  });

  it("signale un refus ou une clé invalide sans planter", async () => {
    parse.mockResolvedValue({ stop_reason: "refusal", parsed_output: null });
    expect(await proposerAvis(article)).toEqual({ ok: false, raison: "Proposition refusée par le modèle." });
    const Anthropic = (await import("@anthropic-ai/sdk")).default as unknown as { AuthenticationError: new (m: string) => Error };
    parse.mockRejectedValue(new Anthropic.AuthenticationError("401"));
    expect(await proposerAvis(article)).toEqual({ ok: false, raison: "Clé ANTHROPIC_API_KEY invalide ou absente." });
  });

  it("interdit d'inventer une expérience vécue et impose l'humour", () => {
    expect(CONSIGNES_AVIS).toMatch(/humoristique/);
    expect(CONSIGNES_AVIS).toMatch(/aucune expérience vécue/);
    expect(CONSIGNES).toContain("avis_propose");
  });
});

describe("brouillon du matin", () => {
  it("range l'avis de l'IA dans « avis proposé », jamais dans l'avis publié", async () => {
    parse.mockResolvedValue({
      stop_reason: "end_turn",
      parsed_output: {
        titre: "La salle des Thanes", chapo: "c", corps_markdown: "corps", rubrique: "donjons-raids", pilier: null,
        etiquettes: ["donjon"], description: "d", accroche_facebook: "a", texte_facebook: "t", titres_sources_fr: ["Titre FR"],
        avis_propose: avis,
      },
    });
    const r = await rediger({
      cle: "x", titre: "Hall of Thanes", score: 5, detailScore: { sources: 3, fraicheur: 1, video: 0, etranger: 1 },
      elements: [{ sourceId: "w", sourceNom: "Wowhead", langue: "en", poids: 3, video: false, titre: "Hall of Thanes", url: "https://wowhead.com/x", resume: "", publieLe: new Date() }],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.brouillon.avisPropose).toBe(avis);
    expect("avisSilfax" in r.brouillon).toBe(false);
  });

  it("borne la longueur de l'avis proposé", () => {
    expect(nettoyerAvis("mot ".repeat(400)).length).toBeLessThanOrEqual(700);
  });
});
