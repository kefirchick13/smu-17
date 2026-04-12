import type { Project } from "../model/types";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectList.module.scss";

type Props = {
  projects: Project[];
};

export function ProjectList({ projects }: Props) {
  return (
    <div className={styles.grid}>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
