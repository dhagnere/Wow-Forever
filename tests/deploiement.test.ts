import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("déploiement Scalingo", () => {
  it("garde cinq tâches planifiées au plus dans cron.json (limite de Scalingo, sinon le déploiement échoue)", () => {
    const cron = JSON.parse(readFileSync("cron.json", "utf8")) as { jobs: { command: string }[] };
    expect(cron.jobs.length).toBeLessThanOrEqual(5);
  });

  it("lance chaque tâche planifiée par un script npm qui existe", () => {
    const scripts = (JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> }).scripts;
    const cron = JSON.parse(readFileSync("cron.json", "utf8")) as { jobs: { command: string }[] };
    for (const j of cron.jobs) {
      const nom = j.command.match(/npm run ([\w:-]+)/)?.[1];
      expect(nom && scripts[nom], j.command).toBeTruthy();
    }
    for (const nom of scripts["veille:horaire"].match(/npm run ([\w:-]+)/g) ?? []) expect(scripts[nom.replace("npm run ", "")]).toBeTruthy();
  });
});
