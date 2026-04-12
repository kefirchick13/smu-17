import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FeedBackForm from "@/features/FeedbackForm/FeedBackForm";
import { ProjectPhotoGallery } from "@/features/ProjectPhotoGallery/ProjectPhotoGallery";
import { formatWorkPeriod } from "@/features/projects/model/formatProjectDates";
import { projectTypeLabel } from "@/features/projects/model/projectLabels";
import { getProjectById } from "@/features/projects/server/getProjects";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    return { title: "Проект не найден" };
  }
  return {
    title: `${project.name} — проекты`,
    description: project.description ?? project.detailText,
  };
}

export default async function ProjectCardPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const workPeriod = formatWorkPeriod(project.workDateStart, project.workDateEnd);
  const statusLabel =
    project.status === "done" ? "Сдан" : "В работе";
  const bodyText =
    project.detailText ?? project.description ?? "";
  const galleryImages =
    project.gallerySrc && project.gallerySrc.length > 0
      ? project.gallerySrc
      : project.imageSrc
        ? [project.imageSrc]
        : [];
  const hasStages = Boolean(project.workStages?.length);
  const hasBody = Boolean(bodyText);

  return (
    <main className={styles.main}>
      <nav className={styles.breadcrumbs} aria-label="Навигация">
        <Link href="/">Главная</Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <Link href="/projects">Проекты</Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span>{project.name}</span>
      </nav>

      <div className={styles.projectSections}>
      {galleryImages.length > 0 ? (
        <ProjectPhotoGallery
          images={galleryImages}
          projectName={project.name}
          className={styles.gallery}
        />
      ) : (
        <div className={styles.hero} aria-hidden />
      )}

      <div className={styles.titleSpecs}>
      <h1 className={styles.title}>{project.name}</h1>

      <div className={styles.specGrid}>
        <div>
          <div className={styles.specLabel}>Вид объекта</div>
          <div className={styles.specValue}>{projectTypeLabel(project.type)}</div>
        </div>
        {typeof project.areaM2 === "number" ? (
          <div>
            <div className={styles.specLabel}>Площадь</div>
            <div className={styles.specValue}>
              {project.areaM2.toLocaleString("ru-RU")} м²
            </div>
          </div>
        ) : null}
        {project.clientName ? (
          <div>
            <div className={styles.specLabel}>Заказчик</div>
            <div className={styles.specValue}>{project.clientName}</div>
          </div>
        ) : null}
        {project.address ? (
          <div>
            <div className={styles.specLabel}>Адрес</div>
            <div className={styles.specValue}>{project.address}</div>
          </div>
        ) : null}
        {workPeriod ? (
          <div>
            <div className={styles.specLabel}>Сроки работ</div>
            <div className={styles.specValue}>{workPeriod}</div>
          </div>
        ) : null}
        <div>
          <div className={styles.specLabel}>Статус объекта</div>
          <div className={styles.specValue}>{statusLabel}</div>
        </div>
      </div>
      </div>

      {hasStages || hasBody ? (
        <section
          className={styles.stagesDescriptionRow}
          aria-label="Этапы работы и описание проекта"
        >
          {hasStages && project.workStages ? (
            <div className={styles.stagesCol}>
              <h2 id="stages-heading" className={styles.blockTitle}>
                Этапы работы
              </h2>
              <ol
                className={styles.stagesList}
                aria-labelledby="stages-heading"
              >
                {project.workStages.map((stage, i) => (
                  <li key={`${i}-${stage.slice(0, 24)}`}>{stage}</li>
                ))}
              </ol>
            </div>
          ) : null}
          {hasBody ? (
            <div className={styles.descCol}>
              <h2 id="desc-heading" className={styles.blockTitle}>
                Описание проекта
              </h2>
              <p className={styles.descriptionBody}>{bodyText}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className={styles.feedbackSlot}>
        <FeedBackForm
          variant="callback"
          title="Нужен похожий проект?"
          description="Оставьте контакты — перезвоним и обсудим задачу."
        />
      </div>
      </div>
    </main>
  );
}
