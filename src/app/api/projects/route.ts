import { NextResponse } from "next/server";
import { safePgDiagnostics } from "@/lib/pgDiagnostics";
import {
  PROJECTS_PAGE_SIZE,
  parseProjectsSearchParams,
} from "@/features/projects/server/projectFilters";
import { listProjects } from "@/features/projects/server/getProjects";

export const dynamic = "force-dynamic";

/**
 * Подгрузка проектов для бесконечной ленты на /projects.
 * Query: те же, что у страницы (search, type, status) + offset, limit.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = Object.fromEntries(url.searchParams.entries());
  const filters = parseProjectsSearchParams(sp);

  const rawOffset = sp.offset ?? "0";
  const rawLimit = sp.limit ?? String(PROJECTS_PAGE_SIZE);
  const offset = Math.max(0, parseInt(rawOffset, 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || PROJECTS_PAGE_SIZE));

  try {
    const { projects, total } = await listProjects({
      filters,
      limit,
      offset,
    });
    const loaded = offset + projects.length;
    return NextResponse.json({
      projects,
      total,
      hasMore: loaded < total,
    });
  } catch (err) {
    console.error("[GET /api/projects]", err);
    const d = safePgDiagnostics(err);
    return NextResponse.json(
      {
        error: "Не удалось загрузить проекты",
        summaryRu: d.summaryRu,
        hintRu: d.hintRu,
        pgCode: d.pgCode,
      },
      { status: 500 },
    );
  }
}
