import type { ProjectStatus, ProjectType } from "../model/types";

export type ProjectsUrlFilters = {
  search: string;
  type: "all" | ProjectType;
  status: "all" | ProjectStatus;
};

/** Начальное состояние фильтров (главная, запросы без query). */
export const emptyProjectsFilters = (): ProjectsUrlFilters => ({
  search: "",
  type: "all",
  status: "all",
});

/** Порция для страницы /projects и API подгрузки. */
export const PROJECTS_PAGE_SIZE = 10;

/** Карусель на главной. */
export const HOME_CAROUSEL_PROJECT_LIMIT = 5;

const projectTypes: readonly ProjectType[] = [
  "industrial",
  "angar",
  "warehouse",
  "cottage",
  "design",
  "other",
];

const projectStatuses: readonly ProjectStatus[] = ["done", "in_progress"];

function first(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export function parseProjectsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): ProjectsUrlFilters {
  const search = (first(sp.search) ?? "").trim();

  const rawType = first(sp.type);
  const type =
    rawType &&
    (projectTypes as readonly string[]).includes(rawType)
      ? (rawType as ProjectType)
      : "all";

  const rawStatus = first(sp.status);
  const status =
    rawStatus &&
    (projectStatuses as readonly string[]).includes(rawStatus)
      ? (rawStatus as ProjectStatus)
      : "all";

  return { search, type, status };
}

export function projectsSearchParamsToUrl(
  filters: ProjectsUrlFilters,
): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.type !== "all") p.set("type", filters.type);
  if (filters.status !== "all") p.set("status", filters.status);
  return p;
}
