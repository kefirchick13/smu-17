"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ProjectPhotoGallery.module.scss";

type Props = {
  images: string[];
  projectName: string;
  className?: string;
};

/**
 * Поддержка любых источников: https/http, protocol-relative //, пути из public (/…).
 * Без next/image — не нужен allowlist доменов в next.config.
 */
export function normalizeGallerySrc(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (/^\/\//.test(t)) {
    return `https:${t}`;
  }
  if (/^https?:\/\//i.test(t)) {
    try {
      return new URL(t).href;
    } catch {
      return t;
    }
  }
  const path = t.startsWith("/") ? t : `/${t}`;
  return encodeURI(path);
}

export function ProjectPhotoGallery({
  images,
  projectName,
  className,
}: Props) {
  const list = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  const total = list.length;
  const current = total > 0 ? list[Math.min(index, total - 1)] : "";

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      const i = ((next % total) + total) % total;
      setIndex(i);
    },
    [total],
  );

  const imagesDeps = useMemo(() => images.join("|"), [images]);

  useEffect(() => {
    setTimeout(() => {
      setIndex(0);
    }, 0);
  }, [imagesDeps]);

  useEffect(() => {
    if (total <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setIndex((i) => ((i - 1 + total) % total));
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => ((i + 1) % total));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (total === 0) return null;

  const mainSrc = normalizeGallerySrc(current);

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <div className={styles.mainFrame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainSrc}
          alt={`${projectName} — фото ${index + 1} из ${total}`}
          className={styles.mainImage}
          decoding="async"
          loading="eager"
        />
        <div className={styles.counter} aria-live="polite">
          {index + 1} <span className={styles.counterSep}>/</span> {total}
        </div>
        {total > 1 ? (
          <>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Предыдущее фото"
              onClick={() => go(index - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              aria-label="Следующее фото"
              onClick={() => go(index + 1)}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className={styles.thumbs} role="tablist" aria-label="Миниатюры">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={normalizeGallerySrc(src)}
                alt=""
                className={styles.thumbImg}
                decoding="async"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
