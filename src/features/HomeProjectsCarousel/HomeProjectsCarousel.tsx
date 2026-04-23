"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectsCarousel from "@/features/ProjectsCarousel/ProjectsCarousel";
import type { Project } from "@/features/projects/model/types";
import { projectToCarouselItem } from "@/features/projects/model/mapProjectToCarousel";
import { HOME_CAROUSEL_PROJECT_LIMIT } from "@/features/projects/server/projectFilters";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; projects: Project[] };

export function HomeProjectsCarousel() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const qs = new URLSearchParams();
        qs.set("offset", "0");
        qs.set("limit", String(HOME_CAROUSEL_PROJECT_LIMIT));
        const res = await fetch(`/api/projects?${qs.toString()}`);
        if (!res.ok) throw new Error("load_failed");
        const data = (await res.json()) as { projects?: Project[] };
        const projects = Array.isArray(data.projects) ? data.projects : [];
        if (cancelled) return;
        setState({ status: "ready", projects });
      } catch {
        if (cancelled) return;
        setState({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const carouselProjects = useMemo(() => {
    if (state.status !== "ready") return [];
    return state.projects.map(projectToCarouselItem);
  }, [state]);

  if (state.status === "loading") {
    return <p role="status">Загрузка проектов…</p>;
  }

  if (state.status === "error") {
    return <p role="status">Не удалось загрузить проекты.</p>;
  }

  if (carouselProjects.length === 0) {
    return <p role="status">Пока нет проектов в каталоге.</p>;
  }

  return (
    <ProjectsCarousel ariaLabel="Наши проекты" projects={carouselProjects} />
  );
}

