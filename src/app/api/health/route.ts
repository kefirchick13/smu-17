import { getPool } from "@/features/db/db";
import { safePgDiagnostics } from "@/lib/pgDiagnostics";

/**
 * Диагностика деплоя: `db` = not_configured | ok | error (без паролей и полного URL).
 */
export async function GET() {
  const pool = getPool();
  if (!pool) {
    return Response.json({
      ok: true,
      db: "not_configured",
      summaryRu:
        "DATABASE_URL не задан — задайте в Netlify переменную с URI из Supabase (Session pooler).",
      hintRu:
        "Формат: postgresql://postgres.<ref>:[PASSWORD]@aws-….pooler.supabase.com:5432/postgres",
    });
  }
  try {
    await pool.query("SELECT 1");
    return Response.json({ ok: true, db: "ok" });
  } catch (err) {
    console.error("[GET /api/health] db ping", err);
    const d = safePgDiagnostics(err);
    return Response.json(
      {
        ok: false,
        db: "error",
        pgCode: d.pgCode,
        summaryRu: d.summaryRu,
        hintRu: d.hintRu,
      },
      { status: 503 },
    );
  }
}

