"use server";

import { getSessionCookieName } from "@/features/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
  redirect("/admin/login");
}
