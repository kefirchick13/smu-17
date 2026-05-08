import { Suspense } from "react";
import type { Metadata } from "next";
import {
  PROJECTS_PAGE_SIZE,
  parseProjectsSearchParams,
} from "@/features/projects/server/projectFilters";
import styles from "./page.module.scss";
import { ProjectsClient } from "./projects-client";
import { listProjects } from "@/features/projects/server/getProjects";
import { getSiteUrl } from "@/shared/constants/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Все объекты и проекты — промышленное строительство в СПб",
  description:
    "Портфолио СМУ-17: промышленные объекты, склады, ангары, коттеджи и проекты в Санкт-Петербурге и Ленинградской области.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Все объекты и проекты — СМУ-17",
    description:
      "Примеры реализованных и текущих строительных проектов в Санкт-Петербурге и ЛО.",
    url: "/projects",
  },
  keywords: [
    "все объекты и проекты сму-17",
    "все объекты и проекты сму-17 в санкт-петербурге",
    "все объекты и проекты сму-17 в ленинградской области",
    "все объекты и проекты сму-17 в Санкт-Петербурге",
    "все объекты и проекты сму-17 в Ленинградской области",
    "все объекты и проекты сму-17 в Санкт-Петербурге и Ленинградской области",
    "все объекты и проекты сму-17 в Санкт-Петербурге и ЛО",
    "все объекты и проекты сму-17 в Санкт-Петербурге и Ленинградской области",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

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
  const siteUrl = getSiteUrl();
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Все объекты и проекты",
    itemListElement: initialProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/projects/${project.id}`,
      name: project.name,
    })),
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <h1 className={styles.title}>Все объекты и проекты</h1>
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
