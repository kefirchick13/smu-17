"use client";

import { useActionState, useState } from "react";
import SmuInput from "@/shared/ui/SmuInput/SmuInput";
import styles from "./FeedBackForm.module.scss";
import SmuButton from "@/shared/ui/SmuButton/SmuButton";
import {
  submitFeedback,
  type FeedbackActionState,
} from "@/features/FeedbackForm/actions";

type FeedBackFormProps = {
  id?: string;
  className?: string;
  /** Заголовок; если задан, рендерится как `h2` (блок на внутренних страницах). */
  title?: string;
  description?: string;
  /** Вариант текста шапки; поля формы одинаковые (имя, email, телефон, сообщение). */
  variant?: "contact" | "callback";
};

const initialActionState: FeedbackActionState = {
  error: null,
  success: false,
};

function FeedBackFormInner({
  id,
  className,
  title,
  description,
  variant = "contact",
  onSendAnother,
}: FeedBackFormProps & { onSendAnother: () => void }) {
  const [state, formAction, isPending] = useActionState(
    submitFeedback,
    initialActionState,
  );

  const heading = title ?? "Связаться с нами";
  const desc =
    description ??
    "Оставьте контакты и сообщение — ответим в рабочее время";
  const isCallback = variant === "callback";

  if (isPending) {
    return (
      <div
        id={id}
        className={[styles.feedbackForm, className].filter(Boolean).join(" ")}
      >
        <div className={styles.feedbackFormContent}>
          <h2 className={styles.feedbackTitle}>{heading}</h2>
          <p className={styles.feedbackFormDescription}>{desc}</p>
        </div>
        <div className={styles.feedbackFormLoading}>
          <p className={styles.feedbackStatusLoading} role="status">
            Отправка заявки…
          </p>
        </div>
      </div>
    );

  }

  if (state.error) {
    return (
      <div
        id={id}
        className={[styles.feedbackForm, className].filter(Boolean).join(" ")}
      >
        <div className={styles.feedbackFormContent}>
          <h2 className={styles.feedbackTitle}>{heading}</h2>
          <p className={styles.feedbackFormDescription}>{desc}</p>
        </div>
        <div className={styles.feedbackErrorBlock}>
          <p className={styles.feedbackStatusError} role="alert">
            {state.error}
          </p>
        </div>
      </div>
    );
  }
  
  if (state.success) {
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
        <div className={styles.feedbackSuccessBlock}>
          <p className={styles.feedbackStatusOk} role="status">
            Заявка принята. Мы свяжемся с вами в рабочее время.
          </p>
          <SmuButton
            type="button"
            variant="secondary"
            onClick={onSendAnother}
          >
            Отправить ещё раз
          </SmuButton>
        </div>
      </div>
    );
  }

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

      <form className={styles.feedbackFormInputs} action={formAction}>
        <SmuInput
          name="name"
          placeholder="Имя"
          autoComplete="name"
          required
          disabled={isPending}
          aria-label="Имя"
        />
        <SmuInput
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-label="Email"
        />
        <SmuInput
          name="phone"
          type="tel"
          placeholder={isCallback ? "+7 (000) 000-00-00" : "Телефон"}
          autoComplete="tel"
          disabled={isPending}
          aria-label="Телефон"
        />
        <textarea
          name="message"
          className={styles.feedbackTextarea}
          placeholder="Ваш запрос или комментарий"
          rows={4}
          disabled={isPending}
          aria-label="Сообщение"
        />
        {state.error ? (
          <p className={styles.feedbackError} role="alert">
            {state.error}
          </p>
        ) : null}
        <SmuButton type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Отправка…" : "Оставить заявку"}
        </SmuButton>
      </form>
    </div>
  );
}

export default function FeedBackForm(props: FeedBackFormProps) {
  const [instance, setInstance] = useState(0);
  return (
    <FeedBackFormInner
      key={instance}
      {...props}
      onSendAnother={() => setInstance((n) => n + 1)}
    />
  );
}
