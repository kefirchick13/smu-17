"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

export type ModalSize = "sm" | "md" | "lg";

type BaseProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  className?: string;
};

type PropsWithTitle = BaseProps & {
  title: string;
  ariaLabel?: string;
};

type PropsWithoutTitle = BaseProps & {
  title?: undefined;
  /** Нужен, если нет видимого title */
  ariaLabel: string;
};

export type ModalProps = PropsWithTitle | PropsWithoutTitle;

export default function Modal(props: ModalProps) {
  const {
    open,
    onClose,
    children,
    size = "md",
    closeOnBackdropClick = true,
    className,
  } = props;

  const title = "title" in props && props.title ? props.title : undefined;
  const ariaLabel = props.ariaLabel;

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const hasTitle = Boolean(title);

  return createPortal(
    <div
      className={`${styles.overlay} ${className ?? ""}`.trim()}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && closeOnBackdropClick) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-label={!hasTitle ? ariaLabel : undefined}
        tabIndex={-1}
        className={`${styles.panel} ${styles[size]}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!hasTitle ? (
          <button
            type="button"
            className={styles.closeFloating}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        ) : null}

        {hasTitle ? (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        ) : null}

        <div
          className={
            hasTitle
              ? styles.body
              : `${styles.body} ${styles.bodyWithFloatingClose}`
          }
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
