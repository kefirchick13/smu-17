import { normalizeGallerySrc } from "@/features/ProjectPhotoGallery/ProjectPhotoGallery";
import type { ProjectsCarouselProject } from "@/features/ProjectsCarousel/types";
import type { Project } from "./types";
import { projectTypeLabel } from "./projectLabels";

const TYPE_FALLBACK_IMAGE: Record<Project["type"], string> = {
  industrial: "/images/industrial-buildings.png",
  angar: "/images/angars.png",
  warehouse: "/images/warehouses.png",
  cottage: "/images/into-section.png",
  design: "/images/into-section.png",
  other: "/images/into-section.png",
};

export function projectToCarouselItem(project: Project): ProjectsCarouselProject {
  const raw = project.imageSrc?.trim();
  const imageSrc = raw
    ? normalizeGallerySrc(raw)
    : TYPE_FALLBACK_IMAGE[project.type];
  const tags =
    project.tags && project.tags.length > 0
      ? project.tags
      : [projectTypeLabel(project.type)];
  const description =
    project.description?.trim() ||
    "Описание проекта можно посмотреть на странице карточки.";

  return {
    id: project.id,
    href: `/projects/${encodeURIComponent(project.id)}`,
    title: project.name,
    tags,
    description,
    imageSrc,
    imageAlt: project.name,
  };
}
