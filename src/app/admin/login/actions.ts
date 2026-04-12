"use server";

import { verifyAdminCredentials } from "@/features/auth/adminUsers";
import { createSessionToken, getSessionCookieName } from "@/features/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error?: string } | undefined;

function safeRedirectPath(next: FormDataEntryValue | null): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || email.trim().length === 0) {
    return { error: "Укажите почту" };
  }
  if (typeof password !== "string" || password.length === 0) {
    return { error: "Укажите пароль" };
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return { error: "Сервер не настроен (нет AUTH_SECRET)" };
  }

  const ok = await verifyAdminCredentials(email, password);
  if (!ok) {
    return { error: "Неверная почта или пароль" };
  }

  const token = await createSessionToken(
    { exp: Date.now() + 7 * 24 * 60 * 60 * 1000 },
    secret,
  );
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(safeRedirectPath(formData.get("next")));
}

