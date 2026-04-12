import { env } from "@/lib/env";
import { Pool, type PoolConfig } from "pg";

let _pool: Pool | null = null;

function buildPoolConfig(): PoolConfig | null {
  const connectionString = env("DATABASE_URL")?.trim();
  if (connectionString) {
    return {
      connectionString,
      max: Number(env("PG_POOL_MAX") ?? 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    };
  }

  const host = env("POSTGRES_HOST")?.trim() ?? env("PGHOST")?.trim();
  const user = env("POSTGRES_USER")?.trim() ?? env("PGUSER")?.trim();
  const password = env("POSTGRES_PASSWORD") ?? env("PGPASSWORD") ?? "";
  const database =
    env("POSTGRES_DATABASE")?.trim() ?? env("PGDATABASE")?.trim();
  const port = Number(env("POSTGRES_PORT") ?? env("PGPORT") ?? 5432);

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
    port,
    user,
    password,
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
