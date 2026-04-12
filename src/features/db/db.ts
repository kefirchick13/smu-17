import { env } from "@/lib/env";
import { normalizeDatabaseUrlForSupabase } from "@/lib/pgDiagnostics";
import { Pool, type PoolConfig } from "pg";

let _pool: Pool | null = null;

/** Порт из env; если не задан — не передаём в `pg`, клиент подставляет порт по умолчанию для PG. */
function optionalEnvPort(): number | undefined {
  const raw = env("POSTGRES_PORT") ?? env("PGPORT");
  if (raw === undefined || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 && n <= 65535 ? n : undefined;
}

function buildPoolConfig(): PoolConfig | null {
  const rawUrl = env("DATABASE_URL")?.trim();
  if (rawUrl) {
    const connectionString = normalizeDatabaseUrlForSupabase(rawUrl);
    return {
      connectionString,
      max: Number(env("PG_POOL_MAX") ?? 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    };
  }

  const host = env("POSTGRES_HOST")?.trim() ?? env("PGHOST")?.trim();
  const user = env("POSTGRES_USER")?.trim() ?? env("PGUSER")?.trim();
  const database =
    env("POSTGRES_DATABASE")?.trim() ?? env("PGDATABASE")?.trim();
  const port = optionalEnvPort();

  if (!host || !user || !database) {
    return null;
  }

  const sslEnv = env("POSTGRES_SSL")?.toLowerCase();
  const ssl =
    sslEnv === "true" || sslEnv === "1"
      ? { rejectUnauthorized: false }
      : sslEnv === "require"
        ? { rejectUnauthorized: false }
        : undefined;

  return {
    host,
    ...(port !== undefined ? { port } : {}),
    user,
    password: env("POSTGRES_PASSWORD") ?? env("PGPASSWORD") ?? "",
    database,
    max: Number(env("PG_POOL_MAX") ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ...(ssl ? { ssl } : {}),
  };
}

/**
 * Singleton pool for server-side use (Server Components, Route Handlers, Server Actions).
 * Do not use in Client Components or Edge runtime.
 */
export function getPool(): Pool | null {
  if (_pool) return _pool;
  const config = buildPoolConfig();
  if (!config) return null;
  _pool = new Pool(config);
  return _pool;
}
