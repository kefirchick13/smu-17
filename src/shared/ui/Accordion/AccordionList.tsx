"use client";

import { Children, createContext, isValidElement, useContext, useId, useMemo, useState } from "react";
import styles from "./Accordion.module.scss";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type Ctx = {
  groupId: string;
  openId: string | null;
  setOpenId: React.Dispatch<React.SetStateAction<string | null>>;
};

const AccordionContext = createContext<Ctx | null>(null);

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used inside AccordionList");
  return ctx;
}

export type AccordionListProps = {
  defaultOpenItemId?: string;
  className?: string;
  children: React.ReactNode;
};

export default function AccordionList({
  defaultOpenItemId,
  className,
  children,
}: AccordionListProps) {
  const groupId = useId();

  const ids = useMemo(() => {
    const out: string[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const id = (child.props as { id?: string }).id;
      if (typeof id === "string") out.push(id);
    });
    return out;
  }, [children]);

  const [openId, setOpenId] = useState<string | null>(
    defaultOpenItemId ?? (ids[0] ?? null),
  );

  return (
    <AccordionContext.Provider value={{ groupId, openId, setOpenId }}>
      <ol className={cx(styles.root, className)}>{children}</ol>
    </AccordionContext.Provider>
  );
}

