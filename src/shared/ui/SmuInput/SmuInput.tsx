"use client";

import styles from "./SmuInput.module.scss";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  placeholder?: string;
  errorMessage?: string;
  type?: "text" | "email" | "password" | "tel";
  mask?: string;
  /** Управляемый режим; без `value` — нативная отправка формы (`name` + `defaultValue`). */
  value?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  size?: "md" | "sm";
  className?: string;
  iconRight?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onCopy?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onCut?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
};

export default function SmuInput({
  placeholder,
  errorMessage,
  type = "text",
  value,
  defaultValue,
  name,
  id,
  disabled,
  required,
  autoComplete,
  inputMode,
  size = "md",
  className,
  iconRight,
  onChange,
  onBlur = () => {},
  onFocus = () => {},
  onPaste = () => {},
  onCopy = () => {},
  onCut = () => {},
}: Props) {
  const controlled = value !== undefined;

  return (
    <div className={cx(styles.inputWrapper, className)}>
      <input
        id={id}
        name={name}
        className={cx(
          styles.input,
          size === "sm" && styles.inputSm,
          Boolean(iconRight) && styles.withRightIcon,
        )}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onBlur={onBlur}
        onFocus={onFocus}
        onPaste={onPaste}
        onCopy={onCopy}
        onCut={onCut}
        {...(controlled
          ? { value, onChange: onChange ?? (() => {}) }
          : { defaultValue, ...(onChange ? { onChange } : {}) })}
      />
      {iconRight ? (
        <span className={styles.rightIcon} aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
      {errorMessage ? (
        <span className={styles.error}>{errorMessage}</span>
      ) : null}
    </div>
  );
}
