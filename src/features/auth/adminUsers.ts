import { getPool } from "@/features/db/db";
import { verifyPassword } from "@/features/auth/password";

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const pool = getPool();
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return false;

  try {
    const result = await pool.query<{ password_hash: string }>(
      `SELECT password_hash FROM admin_users WHERE lower(trim(email)) = $1 LIMIT 1`,
      [normalized],
    );
    const row = result.rows[0];
    if (!row?.password_hash) return false;
    return verifyPassword(password, row.password_hash);
  } catch {
    return false;
  }
}
