import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName, verifySessionToken } from "./auth";

/** Есть ли валидная админ-сессия (для шапки и т.п., без редиректа). */
export async function isAdminSession(): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    const store = await cookies();
    const token = store.get(getSessionCookieName())?.value;
    if (!token) return false;
    return await verifySessionToken(token, secret);
  } catch {
    return false;
  }
}

/** Редирект на логин, если нет валидной админ-сессии. */
export async function requireAdmin(): Promise<void> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    redirect("/admin/login?next=%2Fadmin");
  }
  const store = await cookies();
  const token = store.get(getSessionCookieName())?.value;
  if (!token || !(await verifySessionToken(token, secret))) {
    redirect("/admin/login?next=%2Fadmin");
  }
}
