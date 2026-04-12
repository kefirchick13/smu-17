"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./Accordion.module.scss";
import { useAccordionContext } from "./AccordionList";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const CHEVRON = (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
    <path
      d="M5.5 7.5L10 12l4.5-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type AccordionItemProps = {
  id: string;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  toggleClassName?: string;
  contentClassName?: string;
};

export default function AccordionItem({
  id,
  header,
  children,
  className,
  headerClassName,
  toggleClassName,
  contentClassName,
}: AccordionItemProps) {
  const { groupId, openId, setOpenId } = useAccordionContext();
  const isOpen = openId === id;
  const contentId = useMemo(() => `${groupId}-${id}`, [groupId, id]);

  const innerRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // measure height for smooth transition
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const toggle = useCallback(() => {
    setOpenId((prev) => (prev === id ? null : id));
  }, [id, setOpenId]);

  return (
    <li className={cx(styles.item, className)}>
      <div className={cx(styles.header, headerClassName)}>
        <div className={styles.headerContent}>{header}</div>
        <button
          type="button"
          className={cx(styles.toggle, toggleClassName)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={toggle}
        >
          {CHEVRON}
        </button>
      </div>

      <div
        id={contentId}
        className={cx(styles.content, contentClassName)}
        data-open={isOpen ? "true" : "false"}
        style={{
          maxHeight: isOpen ? contentHeight : 0,
        }}
      >
        <div ref={innerRef} className={styles.contentInner}>
          {children}
        </div>
      </div>
    </li>
  );
}

