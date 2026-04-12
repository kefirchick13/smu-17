"use client";

import SmuInput from "@/shared/ui/SmuInput/SmuInput";
import styles from "./FeedBackForm.module.scss";
import SmuButton from "@/shared/ui/SmuButton/SmuButton";

type FeedBackFormProps = {
  id?: string;
  className?: string;
  /** Заголовок; если задан, рендерится как `h2` (блок на внутренних страницах). */
  title?: string;
  description?: string;
  /** `callback` — имя и телефон (как на карточке проекта); иначе имя и email. */
  variant?: "contact" | "callback";
};

export default function FeedBackForm({
  id,
  className,
  title,
  description,
  variant = "contact",
}: FeedBackFormProps) {
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const heading = title ?? "Связаться с нами";
  const desc =
    description ??
    "Оставьте ваши контакты, и мы свяжемся с вами в ближайшее время";
  const isCallback = variant === "callback";

  return (
    <div
      id={id}
      className={[styles.feedbackForm, className].filter(Boolean).join(" ")}
    >
      <div className={styles.feedbackFormContent}>
        {title ? (
          <h2 className={styles.feedbackTitle}>{heading}</h2>
        ) : (
          <h1>{heading}</h1>
        )}
        <p className={styles.feedbackFormDescription}>{desc}</p>
      </div>
      <div className={styles.feedbackFormInputs}>
        <SmuInput placeholder="Имя" />
        {isCallback ? (
          <SmuInput placeholder="+7 (000) 000-00-00" type="tel" />
        ) : (
          <SmuInput placeholder="Email" type="email" />
        )}
      </div>
      <SmuButton onClick={handleSubmit} variant="secondary">
        Оставить заявку
      </SmuButton>
    </div>
  );
}