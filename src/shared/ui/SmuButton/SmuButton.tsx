"use client";

import Link from "next/link";
import styles from "./SmuButton.module.scss";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary";
  /** Если задан, рендерится `Link` (корректная разметка), а не `button` внутри `<a>`. */
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size?: "md" | "sm";
};

export default function SmuButton({
  children,
  onClick,
  variant = "primary",
  href,
  type = "button",
  disabled,
  size = "md",
}: Props) {
  const className = cx(
    styles.button,
    styles[variant],
    size === "sm" && styles.sm,
  );
  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-disabled={disabled ? true : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
