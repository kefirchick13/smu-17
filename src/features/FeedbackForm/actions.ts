"use server";

import {
  // sendFeedbackConfirmationEmail,
  sendFeedbackEmail,
} from "@/features/FeedbackForm/mail/sendFeedbackEmail";
import { parseFeedbackFormData } from "./feedbackValidation";

export type FeedbackActionState = {
  error: string | null;
  success: boolean;
  /** Письмо-подтверждение ушло на этот адрес (если отправка не удалась — undefined). */
  // confirmationSentTo?: string;
};

export async function submitFeedback(
  _prevState: FeedbackActionState,
  formData: FormData,
): Promise<FeedbackActionState> {
  const parsed = parseFeedbackFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error, success: false };
  }

  try {
    await sendFeedbackEmail(parsed.data);
  } catch (e) {
    const err = e as Error;
    if (err.message === "mail_not_configured") {
      console.error("[submitFeedback] SMTP not configured");
      return {
        error: "Отправка писем не настроена на сервере.",
        success: false,
      };
    }
    console.error("[submitFeedback]", e);
    return {
      error: "Не удалось отправить заявку. Попробуйте позже.",
      success: false,
    };
  }

  // let confirmationSentTo: string | undefined;
  // try {
  //   await sendFeedbackConfirmationEmail(parsed.data);
  //   confirmationSentTo = parsed.data.email;
  // } catch (e) {
  //   console.error("[submitFeedback] confirmation email failed", e);
  // }
  
  return {
    error: null,
    success: true,
  };

  // return {
    // error: null,
    // success: true,
    // // ...(confirmationSentTo ? { confirmationSentTo } : {}),
    // };
}
