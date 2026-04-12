import type { Project } from "../model/types";
import { getPool } from "@/features/db/db";
import type { ProjectsUrlFilters } from "./projectFilters";

function pgDateToIsoDay(val: unknown): string | undefined {
  if (val == null) return undefined;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  const s = String(val);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return s;
}

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    name: String(row.name),
    description: row.description != null ? String(row.description) : undefined,
    detailText:
      row.detail_text != null ? String(row.detail_text) : undefined,
    type: row.type as Project["type"],
    status: row.status as Project["status"],
    tags: Array.isArray(row.tags)
      ? (row.tags as string[])
      : typeof row.tags === "string"
        ? [row.tags]
        : undefined,
    areaM2:
      row.area_m2 != null ? Number(row.area_m2) : undefined,
    completedText:
      row.completed_text != null ? String(row.completed_text) : undefined,
    imageSrc: row.image_src != null ? String(row.image_src) : undefined,
    gallerySrc: Array.isArray(row.gallery_src)
      ? (row.gallery_src as string[])
      : undefined,
    clientName:
      row.client_name != null ? String(row.client_name) : undefined,
    address: row.address != null ? String(row.address) : undefined,
    workDateStart: pgDateToIsoDay(row.work_date_start),
    workDateEnd: pgDateToIsoDay(row.work_date_end),
    workStages: Array.isArray(row.work_stages)
      ? (row.work_stages as string[])
      : undefined,
  };
}

/** SELECT * чтобы страница /projects не падала на старой схеме без новых колонок. */
const PROJECT_SELECT = "*";

type WhereClause = { sql: string; values: unknown[] };

function buildWhere(filters: ProjectsUrlFilters): WhereClause {
  const conditions: string[] = ["1 = 1"];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (filters.type !== "all") {
    conditions.push(`type = $${paramIndex++}`);
    values.push(filters.type);
  }
  if (filters.status !== "all") {
    conditions.push(`status = $${paramIndex++}`);
    values.push(filters.status);
  }
  if (filters.search.trim()) {
    const needle = filters.search.trim().toLowerCase();
    conditions.push(
      `position($${paramIndex}::text in lower(concat_ws(' ', name, coalesce(description, ''), coalesce(array_to_string(tags, ' '), '')))) > 0`,
    );
    values.push(needle);
    paramIndex += 1;
  }

  return {
    sql: `WHERE ${conditions.join(" AND ")}`,
    values,
  };
}

export type ListProjectsParams = {
  filters: ProjectsUrlFilters;
  limit: number;
  offset: number;
};

/**
 * Список проектов с фильтрами и окном (для главной, /projects, «лента»). Порядок: по названию.
 */
export async function listProjects(
  params: ListProjectsParams,
): Promise<{ projects: Project[]; total: number }> {
  const { filters, limit, offset } = params;
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);
  const safeOffset = Math.max(0, Math.floor(offset));
  const pool = getPool();
  if (!pool) {
    console.warn("[listProjects] DATABASE_URL / POSTGRES_* не заданы — список пуст");
    return { projects: [], total: 0 };
  }

  const { sql: whereSql, values: whereValues } = buildWhere(filters);
  const orderSql = "ORDER BY name ASC";

  const countResult = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM projects ${whereSql}`,
    whereValues,
  );
  const total = Number(countResult.rows[0]?.c ?? 0) || 0;

  const limitParam = whereValues.length + 1;
  const offsetParam = whereValues.length + 2;
  const listSql = `
    SELECT ${PROJECT_SELECT}
    FROM projects
    ${whereSql}
    ${orderSql}
    LIMIT $${limitParam} OFFSET $${offsetParam}
  `;
  const listValues = [...whereValues, safeLimit, safeOffset];

  const result = await pool.query<Record<string, unknown>>(listSql, listValues);
  return {
    projects: result.rows.map((row) => rowToProject(row)),
    total,
  };
}

/** Одна карточка по id (для /projects/[id]). */
export async function getProjectById(
  id: string,
): Promise<Project | undefined> {
  const pool = getPool();
  if (!pool) return undefined;
  const trimmed = id?.trim();
  if (!trimmed) return undefined;
  try {
    const result = await pool.query<Record<string, unknown>>(
      `SELECT ${PROJECT_SELECT} FROM projects WHERE id = $1`,
      [trimmed],
    );
    const row = result.rows[0];
    return row ? rowToProject(row) : undefined;
  } catch (err) {
    console.error("[getProjectById]", err);
    return undefined;
  }
}

/** Все проекты для админки (без фильтров). */
export async function getAllProjects(): Promise<Project[]> {
  const pool = getPool();
  if (!pool) return [];
  try {
    const result = await pool.query<Record<string, unknown>>(
      `SELECT ${PROJECT_SELECT}
       FROM projects
       ORDER BY name ASC`,
    );
    return result.rows.map((row) => rowToProject(row));
  } catch (err) {
    console.error("[getAllProjects]", err);
    return [];
  }
}
