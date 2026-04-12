import type { ProjectType } from "./types";

export function projectTypeLabel(type: ProjectType): string {
  switch (type) {
    case "warehouse":
      return "Склад";
    case "angar":
      return "Ангар";
    case "industrial":
      return "Промышленный объект";
    default:
      return type;
  }
}
