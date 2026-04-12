"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TagItem, Tags } from "@/shared/ui";
import styles from "./ProjectsCarousel.module.scss";
import type { ProjectsCarouselProject } from "./types";

export type { ProjectsCarouselProject };

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const ArrowLeft = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      d="M15 6l-6 6 6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Props = {
  className?: string;
  projects: ProjectsCarouselProject[];
  ariaLabel?: string;
};

export default function ProjectsCarousel({
  className,
  projects,
  ariaLabel,
}: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, projects.length - 1);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      const el = viewportRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(maxIndex, nextIndex));
      const slideEl = el.children.item(clamped) as HTMLElement | null;
      if (!slideEl) return;
      slideEl.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setIndex(clamped);
    },
    [maxIndex],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < children.length; i++) {
        const dist = Math.abs(children[i]!.offsetLeft - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setIndex(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const dots = useMemo(
    () =>
      projects.map((p, i) => (
        <button
          key={p.id}
          type="button"
          className={cx(styles.dot, i === index && styles.dotActive)}
          aria-label={`Slide ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => scrollToIndex(i)}
        />
      )),
    [index, projects, scrollToIndex],
  );

  return (
    <div className={cx(styles.root, className)} aria-label={ariaLabel}>
      <div ref={viewportRef} className={styles.viewport}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={styles.slide}
            aria-roledescription="slide"
          >
            <Link
              href={project.href}
              className={styles.slideLink}
              aria-label={`Открыть проект: ${project.title}`}
            >
              <div className={styles.item}>
                <div className={styles.itemContent}>
                  <h2 className={styles.itemTitle}>{project.title}</h2>
                  <Tags className={styles.itemTags} mobileSize="sm">
                    {project.tags.map((t, ti) => (
                      <TagItem key={`${project.id}-tag-${ti}`}>{t}</TagItem>
                    ))}
                  </Tags>
                  <p className={styles.itemDescription}>{project.description}</p>
                </div>
                <div className={styles.itemImage}>
                  <Image
                    className={styles.itemImageImg}
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    unoptimized
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollToIndex(index - 1)}
          disabled={!canPrev}
          aria-label="Previous slide"
        >
          {ArrowLeft}
        </button>
        <div className={styles.dots}>{dots}</div>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollToIndex(index + 1)}
          disabled={!canNext}
          aria-label="Next slide"
        >
          {ArrowRight}
        </button>
      </div>
    </div>
  );
}
