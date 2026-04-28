"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project, ProjectType } from "@/features/projects/model/types";
import { formatWorkPeriod } from "@/features/projects/model/formatProjectDates";
import {
  PROJECTS_PAGE_SIZE,
  parseProjectsSearchParams,
  projectsSearchParamsToUrl,
  type ProjectsUrlFilters,
} from "@/features/projects/server/projectFilters";
import styles from "./page.module.scss";
import SmuInput from "@/shared/ui/SmuInput/SmuInput";
import SearchIcon from "@public/icons/search.svg";
import { useDebounce } from "@/shared/utils/useDebounce";

type Props = {
  initialProjects: Project[];
  total: number;
  pageSize?: number;
};

const typeTabs: Array<{ id: "all" | ProjectType; label: string }> = [
  { id: "all", label: "Все объекты и проекты" },
  { id: "industrial", label: "Промышленные здания" },
  { id: "warehouse", label: "Склады" },
  { id: "cottage", label: "Коттеджи" },
  { id: "design", label: "Проектирование" },
  { id: "other", label: "Прочие объекты" },
];

export function ProjectsClient({
  initialProjects,
  total,
  pageSize = PROJECTS_PAGE_SIZE,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () =>
      parseProjectsSearchParams(
        Object.fromEntries(searchParams.entries()) as Record<
          string,
          string | string[] | undefined
        >,
      ),
    [searchParams],
  );

  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 500);

  const [projects, setProjects] = useState(initialProjects);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    if (debouncedSearch === filters.search) return;
    const qs = projectsSearchParamsToUrl({
      ...filters,
      search: debouncedSearch,
    }).toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { scroll: false });
  }, [debouncedSearch, filters, pathname, router]);

  const replaceFilters = useCallback(
    (next: ProjectsUrlFilters) => {
      const qs = projectsSearchParamsToUrl(next).toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.replace(href, { scroll: false });
    },
    [pathname, router],
  );

  const hasMore = projects.length < total;

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const qs = projectsSearchParamsToUrl(filters);
      qs.set("offset", String(projects.length));
      qs.set("limit", String(pageSize));
      const res = await fetch(`/api/projects?${qs.toString()}`);
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as {
        projects: Project[];
        hasMore?: boolean;
      };
      setProjects((prev) => [...prev, ...data.projects]);
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, filters, projects.length, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || loadingMore) return;
        void loadMore();
      },
      { root: null, rootMargin: "240px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <div className={styles.projectsPage}>
      <div className={styles.projectsToolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>Тип объекта</div>
            <div className={styles.typeChips} aria-label="Фильтр по типу">
              {typeTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.chip} ${filters.type === t.id ? styles.chipActive : ""}`}
                  onClick={() =>
                    replaceFilters({
                      ...filters,
                      search: debouncedSearch,
                      type: t.id,
                    })
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>Статус</div>
            <div className={styles.statusChips} aria-label="Фильтр по статусу">
              <button
                type="button"
                className={`${styles.chip} ${filters.status === "all" ? styles.chipActive : ""}`}
                onClick={() =>
                  replaceFilters({
                    ...filters,
                    search: debouncedSearch,
                    status: "all",
                  })
                }
              >
                Все
              </button>
              <button
                type="button"
                className={`${styles.chip} ${filters.status === "done" ? styles.chipActive : ""}`}
                onClick={() =>
                  replaceFilters({
                    ...filters,
                    search: debouncedSearch,
                    status: "done",
                  })
                }
              >
                Сдан
              </button>
              <button
                type="button"
                className={`${styles.chip} ${filters.status === "in_progress" ? styles.chipActive : ""}`}
                onClick={() =>
                  replaceFilters({
                    ...filters,
                    search: debouncedSearch,
                    status: "in_progress",
                  })
                }
              >
                В работе
              </button>
            </div>
          </div>

          <div className={styles.search}>
            <SmuInput
              placeholder="Поиск по названию, описанию или тегам"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              iconRight={<SearchIcon />}
            />
          </div>
        </div>
      </div>

      <p className={styles.resultsHint} role="status">
        Показано {projects.length} из {total}
      </p>

      <div className={styles.projectsGrid}>
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className={styles.projectCardLink}
          >
            <article className={styles.projectCard}>
              <div
                className={styles.projectImage}
                style={{
                  backgroundImage: p.imageSrc
                    ? `url(${JSON.stringify(p.imageSrc)})`
                    : undefined,
                }}
              >
                <span className={styles.badge}>
                  {p.status === "done" ? "Сдан" : "В работе"}
                </span>
              </div>
              <div className={styles.projectBody}>
                <h3 className={styles.projectTitle}>{p.name}</h3>
                {p.tags?.length ? (
                  <div className={styles.projectTags}>
                    {p.tags.map((tag, ti) => (
                      <span
                        key={`${p.id}-${ti}-${tag}`}
                        className={styles.projectTag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className={styles.projectMeta}>
                  {typeof p.areaM2 === "number" ? (
                    <div>
                      <span className={styles.metaLabel}>Площадь:</span>{" "}
                      {p.areaM2.toLocaleString("ru-RU")} м²
                    </div>
                  ) : null}
                  {formatWorkPeriod(p.workDateStart, p.workDateEnd) ? (
                    <div>
                      <span className={styles.metaLabel}>Сроки:</span>{" "}
                      {formatWorkPeriod(p.workDateStart, p.workDateEnd)}
                    </div>
                  ) : p.completedText ? (
                    <div>
                      <span className={styles.metaLabel}>Сдан:</span>{" "}
                      {p.completedText}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {hasMore ? (
        <div
          ref={sentinelRef}
          className={styles.loadSentinel}
          aria-hidden
        />
      ) : null}

      {loadingMore ? (
        <p className={styles.loadStatus} role="status">
          Загрузка…
        </p>
      ) : null}
    </div>
  );
}
