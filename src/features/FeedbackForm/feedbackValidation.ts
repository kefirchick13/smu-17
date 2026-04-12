const MAX_MESSAGE = 8000;
const MAX_NAME = 200;
const MAX_PHONE = 40;

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export type FeedbackPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function parseFeedbackFormData(
  formData: FormData,
): { ok: true; data: FeedbackPayload } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || name.length > MAX_NAME) {
    return { ok: false, error: "Укажите имя (не длиннее 200 символов)." };
  }
  if (!email || !isEmail(email)) {
    return { ok: false, error: "Укажите корректный email." };
  }
  if (phone.length > MAX_PHONE) {
    return { ok: false, error: "Телефон слишком длинный." };
  }
  if (!message || message.length > MAX_MESSAGE) {
    return { ok: false, error: "Напишите сообщение (не длиннее 8000 символов)." };
  }

  return { ok: true, data: { name, email, phone, message } };
}
