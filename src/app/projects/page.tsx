import { Suspense } from "react";
import {
  PROJECTS_PAGE_SIZE,
  parseProjectsSearchParams,
} from "@/features/projects/server/projectFilters";
import styles from "./page.module.scss";
import { ProjectsClient } from "./projects-client";
import { listProjects } from "@/features/projects/server/getProjects";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = parseProjectsSearchParams(sp);
  let initialProjects: Awaited<ReturnType<typeof listProjects>>["projects"] =
    [];
  let total = 0;
  try {
    const result = await listProjects({
      filters,
      limit: PROJECTS_PAGE_SIZE,
      offset: 0,
    });
    initialProjects = result.projects;
    total = result.total;
  } catch (err) {
    console.error("[ProjectsPage] failed to get projects:", err);
    return <div>Failed to get projects</div>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Проекты</h1>
      <Suspense fallback={<div className={styles.projectsSuspense} />}>
        <ProjectsClient
          initialProjects={initialProjects}
          total={total}
          pageSize={PROJECTS_PAGE_SIZE}
        />
      </Suspense>
    </main>
  );
}
