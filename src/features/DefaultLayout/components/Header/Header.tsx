"use client";

import SmuLogo from "@public/SMU-17.svg";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import {
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/shared/constants/companyContacts";

type Props = {
  /** Валидная сессия администратора (проверка на сервере в DefaultLayout). */
  isAdmin?: boolean;
};

export default function Header({ isAdmin = false }: Props) {
  const [open, setOpen] = useState(false);
  const ctaHref = isAdmin ? "/admin" : "/admin/login";
  const ctaLabel = isAdmin ? "Админ-панель" : "Вход";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.logoLink} aria-label="Главная">
          <SmuLogo className={styles.logo} aria-hidden="true" />
        </Link>
        <nav className={styles.nav}>
          <Link className={styles.navLink} href="/">
            Главная
          </Link>
          <Link className={styles.navLink} href="/projects">
            Проекты
          </Link>
          <Link className={styles.navLink} href="/about">
            О нас
          </Link>
        </nav>
      </div>

      <div className={styles.right}>
        <a className={styles.phone} href={`tel:${COMPANY_PHONE_TEL}`}>
          {COMPANY_PHONE_DISPLAY}
        </a>
        <Link className={styles.cta} href={ctaHref}>
          {ctaLabel}
        </Link>
        <button
          type="button"
          className={styles.burger}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
        </button>
      </div>

      {open ? (
        <div className={styles.mobileMenu} role="dialog" aria-modal="true">
          <nav id="mobile-nav" className={styles.mobileNav}>
            <Link
              className={styles.mobileNavLink}
              href="/"
              onClick={() => setOpen(false)}
            >
              Главная
            </Link>
            <Link
              className={styles.mobileNavLink}
              href="/projects"
              onClick={() => setOpen(false)}
            >
              Проекты
            </Link>
            <Link
              className={styles.mobileNavLink}
              href="/about"
              onClick={() => setOpen(false)}
            >
              О нас
            </Link>
            <div className={styles.mobileActions}>
              <a
                className={styles.mobilePhone}
                href={`tel:${COMPANY_PHONE_TEL}`}
                onClick={() => setOpen(false)}
              >
                {COMPANY_PHONE_DISPLAY}
              </a>
              <Link
                className={styles.mobileCta}
                href={ctaHref}
                onClick={() => setOpen(false)}
              >
                {ctaLabel}
              </Link>
            </div>
          </nav>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </header>
  );
}
