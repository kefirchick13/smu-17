import { getPool } from "@/features/db/db";
import type { ProjectStatus, ProjectType } from "../model/types";

/** Понятное сообщение об ошибке БД для админки (и лог с сырым текстом). */
function formatInsertError(e: unknown): string {
  if (e && typeof e === "object" && "code" in e) {
    const code = String((e as { code?: string }).code);
    const detail = (e as { detail?: string }).detail;
    switch (code) {
      case "23505":
        return "Запись с таким ключом уже есть (дубликат).";
      case "23502":
        return "Не заполнено обязательное поле в базе.";
      case "42703":
        return "Схема базы устарела: нет колонки. Выполните актуальный db/migrations/001_init.sql или пересоздайте том Docker.";
      case "42P01":
        return "Таблица projects не найдена — примените миграции.";
      case "ECONNREFUSED":
      case "ETIMEDOUT":
        return "Не удаётся подключиться к базе (сеть / хост / порт).";
      default:
        break;
    }
    if (detail) {
      return `Ошибка базы (${code}): ${detail}`;
    }
  }
  const msg =
    e instanceof Error ? e.message : typeof e === "string" ? e : "неизвестная ошибка";
  return `Не удалось сохранить: ${msg}`;
}

const TYPES: readonly ProjectType[] = ["industrial", "angar", "warehouse"];
const STATUSES: readonly ProjectStatus[] = ["done", "in_progress"];

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** URL картинок (https://…), по строке или через запятую. */
function parseGalleryUrls(raw: string): string[] | null {
  const parts = raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  return parts;
}

/** Один этап — одна строка. */
function parseWorkStages(raw: string): string[] | null {
  const lines = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  return lines;
}

function parseOptionalIsoDate(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    return null;
  }
  return t;
}

export type ProjectFormInput = {
  name: string;
  description: string;
  type: string;
  status: string;
  tagsRaw: string;
  areaM2: string;
  address: string;
  workDateStart: string;
  workDateEnd: string;
  imageSrc: string;
  galleryRaw: string;
  workStagesRaw: string;
};

type ParsedProjectFields = {
  name: string;
  description: string | null;
  type: ProjectType;
  status: ProjectStatus;
  tags: string[];
  areaM2: number | null;
  address: string | null;
  workDateStart: string | null;
  workDateEnd: string | null;
  imageSrc: string | null;
  gallerySrc: string[] | null;
  workStages: string[] | null;
};

function parseProjectFormFields(
  input: ProjectFormInput,
): { ok: true; data: ParsedProjectFields } | { ok: false; error: string } {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Укажите название" };

  if (!TYPES.includes(input.type as ProjectType)) {
    return { ok: false, error: "Неверный тип объекта" };
  }
  if (!STATUSES.includes(input.status as ProjectStatus)) {
    return { ok: false, error: "Неверный статус" };
  }

  const tags = parseTags(input.tagsRaw);
  let areaM2: number | null = null;
  if (input.areaM2.trim()) {
    const n = Number(
      input.areaM2.trim().replace(/\s/g, "").replace(",", "."),
    );
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, error: "Некорректная площадь" };
    }
    areaM2 = Math.round(n);
  }

  const description = input.description.trim() || null;
  const address = input.address.trim() || null;
  const workDateStart = parseOptionalIsoDate(input.workDateStart);
  const workDateEnd = parseOptionalIsoDate(input.workDateEnd);
  let imageSrc = input.imageSrc.trim() || null;
  const gallerySrc = parseGalleryUrls(input.galleryRaw);
  const workStages = parseWorkStages(input.workStagesRaw);

  if (!imageSrc && gallerySrc?.length) {
    imageSrc = gallerySrc[0];
  }

  return {
    ok: true,
    data: {
      name,
      description,
      type: input.type as ProjectType,
      status: input.status as ProjectStatus,
      tags,
      areaM2,
      address,
      workDateStart,
      workDateEnd,
      imageSrc,
      gallerySrc,
      workStages,
    },
  };
}

export async function insertProjectFromForm(
  input: ProjectFormInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const pool = getPool();
  if (!pool) return { ok: false, error: "База данных недоступна" };

  const parsed = parseProjectFormFields(input);
  if (!parsed.ok) return parsed;
  const d = parsed.data;

  const id = crypto.randomUUID();

  try {
    await pool.query(
      `INSERT INTO projects (
        id, name, description, type, status, tags, area_m2, completed_text, image_src,
        gallery_src,
        client_name, address, work_date_start, work_date_end, work_stages, detail_text
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        id,
        d.name,
        d.description,
        d.type,
        d.status,
        d.tags,
        d.areaM2,
        null,
        d.imageSrc,
        d.gallerySrc,
        null,
        d.address,
        d.workDateStart,
        d.workDateEnd,
        d.workStages,
        null,
      ],
    );
    return { ok: true, id };
  } catch (e) {
    console.error("[insertProjectFromForm]", e);
    return { ok: false, error: formatInsertError(e) };
  }
}

/** Обновление проекта из админ-формы (detail_text и client_name в БД не трогаем). */
export async function updateProjectFromForm(
  projectId: string,
  input: ProjectFormInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const pool = getPool();
  if (!pool) return { ok: false, error: "База данных недоступна" };

  const id = projectId.trim();
  if (!id) return { ok: false, error: "Не указан проект" };

  const parsed = parseProjectFormFields(input);
  if (!parsed.ok) return parsed;
  const d = parsed.data;

  try {
    const r = await pool.query(
      `UPDATE projects SET
        name = $1,
        description = $2,
        type = $3,
        status = $4,
        tags = $5,
        area_m2 = $6,
        image_src = $7,
        gallery_src = $8,
        address = $9,
        work_date_start = $10,
        work_date_end = $11,
        work_stages = $12
      WHERE id = $13`,
      [
        d.name,
        d.description,
        d.type,
        d.status,
        d.tags,
        d.areaM2,
        d.imageSrc,
        d.gallerySrc,
        d.address,
        d.workDateStart,
        d.workDateEnd,
        d.workStages,
        id,
      ],
    );
    if (r.rowCount === 0) return { ok: false, error: "Проект не найден" };
    return { ok: true, id };
  } catch (e) {
    console.error("[updateProjectFromForm]", e);
    return { ok: false, error: formatInsertError(e) };
  }
}

export async function deleteProjectById(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const pool = getPool();
  if (!pool) return { ok: false, error: "База данных недоступна" };
  const trimmed = id?.trim();
  if (!trimmed) return { ok: false, error: "Нет идентификатора" };
  try {
    const r = await pool.query(`DELETE FROM projects WHERE id = $1`, [
      trimmed,
    ]);
    if (r.rowCount === 0) return { ok: false, error: "Проект не найден" };
    return { ok: true };
  } catch (e) {
    console.error("[deleteProjectById]", e);
    return { ok: false, error: "Не удалось удалить" };
  }
}
