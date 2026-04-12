import type { Project } from "../model/types";
import styles from "./ProjectCard.module.scss";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{project.name}</h3>
      {project.description ? (
        <p className={styles.description}>{project.description}</p>
      ) : null}
    </article>
  );
}
