import { env } from "@/lib/env";
import { Pool, type PoolConfig } from "pg";

let _pool: Pool | null = null;

function defaultPoolMax(): number {
  const fromEnv = env("PG_POOL_MAX");
  if (fromEnv !== undefined && fromEnv !== "") return Number(fromEnv);
  if (process.env.NETLIFY === "true" || process.env.AWS_LAMBDA_FUNCTION_NAME)
    return 2;
  return 10;
}

function connectTimeoutMs(): number {
  const raw = env("PG_CONNECT_TIMEOUT_MS");
  if (raw !== undefined && raw !== "") return Number(raw);
  return process.env.NETLIFY === "true" ? 20_000 : 10_000;
}

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
    return {
      connectionString: rawUrl,
      max: defaultPoolMax(),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: connectTimeoutMs(),
      ssl: { rejectUnauthorized: false },
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
    max: defaultPoolMax(),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: connectTimeoutMs(),
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
