"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import styles from "./page.module.scss";
import SmuInput from "@/shared/ui/SmuInput/SmuInput";
import SmuButton from "@/shared/ui/SmuButton/SmuButton";

type Props = {
  nextPath: string;
};

export function LoginForm({ nextPath }: Props) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="next" value={nextPath} />
      <label className={styles.label}>
        Электронная почта
        <SmuInput
          type="email"
          name="email"
          size="sm"
          autoComplete="email"
          inputMode="email"
          required
          disabled={pending}
        />
      </label>
      <label className={styles.label}>
        Пароль
        <SmuInput
          type="password"
          name="password"
          size="sm"
          autoComplete="current-password"
          required
          disabled={pending}
        />
      </label>
      {state?.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}
      <SmuButton type="submit" variant="primary" size="sm" disabled={pending}>
        {pending ? "Вход…" : "Войти"}
      </SmuButton>
    </form>
  );
}
