"use client";

import styles from "./Tags.module.scss";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function TagItem({ className, children }: Props) {
  return <span className={cx(styles.tag, className)}>{children}</span>;
}

