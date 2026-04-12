export type ProjectId = string;

export type ProjectType = "industrial" | "angar" | "warehouse";
export type ProjectStatus = "done" | "in_progress";

export type Project = {
  id: ProjectId;
  name: string;
  description?: string;
  /** Развёрнутое описание для страницы карточки */
  detailText?: string;
  type: ProjectType;
  status: ProjectStatus;
  tags?: string[];
  areaM2?: number;
  completedText?: string;
  /** URL обложки для списка (https://…) */
  imageSrc?: string;
  /** URL фото галереи карточки, порядок = слайды */
  gallerySrc?: string[];
  clientName?: string;
  address?: string;
  /** ISO date YYYY-MM-DD */
  workDateStart?: string;
  workDateEnd?: string;
  workStages?: string[];
};

