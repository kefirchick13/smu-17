"use server";

import { verifyAdminCredentials } from "@/features/auth/adminUsers";
import { createSessionToken, getSessionCookieName } from "@/features/auth/auth";
import { getPool } from "@/features/db/db";
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

  if (!getPool()) {
    return {
      error:
        "База не подключена: в Netlify (Supabase → Connect → Session pooler: пользователь postgres.<project-ref>, база postgres, пароль из Database).",
    };
  }

  const auth = await verifyAdminCredentials(email, password);
  if (!auth.ok) {
    if (auth.reason === "invalid_login") {
      return { error: "Неверная почта или пароль" };
    }
    const { diagnostics } = auth;
    const parts = [diagnostics.summaryRu, diagnostics.hintRu].filter(Boolean);
    return { error: parts.join(" ") };
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

