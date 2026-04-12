"use client";

import styles from "./Tags.module.scss";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  className?: string;
  size?: "md" | "sm";
  mobileSize?: "md" | "sm";
  children: React.ReactNode;
};

export default function Tags({ className, size = "md", mobileSize, children }: Props) {
  return (
    <div
      className={cx(styles.tags, className)}
      data-size={size}
      data-mobile-size={mobileSize}
    >
      {children}
    </div>
  );
}

