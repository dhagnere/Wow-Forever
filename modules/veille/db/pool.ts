import { Pool } from "pg";
import { config } from "../config";

declare global {
  // Réutilisé entre les rechargements à chaud en développement.
  var __veillePool: Pool | undefined;
}

function sslPour(url: string) {
  // Scalingo impose TLS ; en local, pas de TLS.
  return /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false };
}

export function pool(): Pool {
  if (!globalThis.__veillePool) {
    const url = config.databaseUrl();
    globalThis.__veillePool = new Pool({ connectionString: url, ssl: sslPour(url), max: 5 });
  }
  return globalThis.__veillePool;
}

export async function fermer(): Promise<void> {
  if (globalThis.__veillePool) {
    await globalThis.__veillePool.end();
    globalThis.__veillePool = undefined;
  }
}
