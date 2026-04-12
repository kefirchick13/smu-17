import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/features/auth/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.AUTH_SECRET;

  if (pathname.startsWith("/admin/login")) {
    if (secret) {
      const token = request.cookies.get(getSessionCookieName())?.value;
      if (token && (await verifySessionToken(token, secret))) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!secret) {
      return new NextResponse("AUTH_SECRET is not set", { status: 503 });
    }
    const token = request.cookies.get(getSessionCookieName())?.value;
    if (!token || !(await verifySessionToken(token, secret))) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
