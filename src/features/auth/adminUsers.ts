import { getPool } from "@/features/db/db";
import { verifyPassword } from "@/features/auth/password";
import { safePgDiagnostics, type PgDiagnostics } from "@/lib/pgDiagnostics";

export type VerifyAdminResult =
  | { ok: true }
  | { ok: false; reason: "invalid_login" }
  | { ok: false; reason: "db_error"; diagnostics: PgDiagnostics };

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<VerifyAdminResult> {
  const pool = getPool();
  if (!pool) {
    console.error(
      "[verifyAdminCredentials] нет пула БД — задайте DATABASE_URL в окружении деплоя",
    );
    return {
      ok: false,
      reason: "db_error",
      diagnostics: {
        summaryRu: "Пул БД не создан: переменная DATABASE_URL не задана в окружении (Netlify).",
        hintRu: "Вставьте URI из Supabase → Connect → Session pooler: пользователь postgres.<ref>, база postgres.",
      },
    };
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, reason: "invalid_login" };
  }

  try {
    const result = await pool.query<{ password_hash: string }>(
      `SELECT password_hash FROM admin_users WHERE lower(trim(email)) = $1 LIMIT 1`,
      [normalized],
    );
    const row = result.rows[0];
    if (!row?.password_hash) return { ok: false, reason: "invalid_login" };
    const match = await verifyPassword(password, row.password_hash);
    return match ? { ok: true } : { ok: false, reason: "invalid_login" };
  } catch (err) {
    console.error("[verifyAdminCredentials]", err);
    return {
      ok: false,
      reason: "db_error",
      diagnostics: safePgDiagnostics(err),
    };
  }
}
