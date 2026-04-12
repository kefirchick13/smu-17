import type { FeedbackPayload } from "@/features/FeedbackForm/feedbackValidation";
import { env } from "@/lib/env";
import nodemailer from "nodemailer";

export type { FeedbackPayload };

function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type FeedbackMailConfig = {
  transporter: ReturnType<typeof nodemailer.createTransport>;
  from: string;
};

function getFeedbackMailConfig(): FeedbackMailConfig {
  const host = env("FEEDBACK_SMTP_HOST")?.trim();
  const user = env("FEEDBACK_SMTP_USER")?.trim();
  const pass = env("FEEDBACK_SMTP_PASS");
  if (!host || !user || pass === undefined) {
    throw new Error("mail_not_configured");
  }

  const port = Number(env("FEEDBACK_SMTP_PORT") ?? "587");
  const secure =
    env("FEEDBACK_SMTP_SECURE")?.toLowerCase() === "true" || port === 465;
  const fromAddress = env("FEEDBACK_MAIL_FROM")?.trim() || user;
  const fromDisplay = env("FEEDBACK_MAIL_FROM_NAME")?.trim();
  const from =
    fromDisplay && fromDisplay.length > 0
      ? `"${fromDisplay.replace(/"/g, "")}" <${fromAddress}>`
      : fromAddress;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return { transporter, from };
}

/**
 * Заявка на корпоративную почту (SMTP).
 * См. переменные в `getFeedbackMailConfig` / прежняя документация в репозитории.
 */
export async function sendFeedbackEmail(payload: FeedbackPayload): Promise<void> {
  const to = env("FEEDBACK_MAIL_TO")?.trim();
  if (!to) {
    throw new Error("mail_not_configured");
  }

  const { transporter, from } = getFeedbackMailConfig();

  const name = oneLine(payload.name);
  const email = oneLine(payload.email);
  const phone = oneLine(payload.phone);
  const message = payload.message.trim();

  const subject = `Заявка с сайта — ${name || "без имени"}`;

  const text = [
    "Это письмо отправлено формой обратной связи на сайте.",
    "",
    `Имя: ${name}`,
    `Email: ${email}`,
    `Телефон: ${phone || "—"}`,
    "",
    "Сообщение:",
    message,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8" /></head>
<body>
<p>Это письмо отправлено формой обратной связи на сайте.</p>
<p><strong>Имя:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Телефон:</strong> ${escapeHtml(phone || "—")}</p>
<p><strong>Сообщение:</strong></p>
<pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(message)}</pre>
</body>
</html>`;

  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject,
    text,
    html,
    headers: {
      "Auto-Submitted": "auto-generated",
      "X-Auto-Response-Suppress": "All",
    },
  });
}

/**
 * Краткое подтверждение на почту заявителя (после успешной отправки основной заявки).
 */
export async function sendFeedbackConfirmationEmail(
  payload: FeedbackPayload,
): Promise<void> {
  const { transporter, from } = getFeedbackMailConfig();

  const name = oneLine(payload.name);
  const email = oneLine(payload.email);
  const siteName = env("FEEDBACK_SITE_LABEL")?.trim();
  const formContext = siteName
    ? `через форму на сайте ${siteName}`
    : "через форму обратной связи на сайте";

  const subject = "Ваша заявка получена";

  const text = [
    `Здравствуйте${name ? `, ${name}` : ""}.`,
    "",
    `Мы получили ваше обращение, отправленное ${formContext}. Мы свяжемся с вами в рабочее время.`,
    "",
    "Ваше сообщение:",
    payload.message.trim().slice(0, 2000),
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8" /></head>
<body>
<p>Здравствуйте${name ? `, ${escapeHtml(name)}` : ""}.</p>
<p>Мы получили ваше обращение, отправленное ${escapeHtml(formContext)}. Мы ответим в рабочее время.</p>
<p><strong>Ваше сообщение:</strong></p>
<pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(payload.message.trim().slice(0, 4000))}</pre>
<hr style="border:none;border-top:1px solid #ccc;margin:16px 0" />
<p style="font-size:13px;color:#666">Это автоматическое письмо, отвечать на него не нужно.</p>
</body>
</html>`;

  await transporter.sendMail({
    from,
    to: email,
    subject,
    text,
    html,
    headers: {
      "Auto-Submitted": "auto-generated",
    },
  });
}
