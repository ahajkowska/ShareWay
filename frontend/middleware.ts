import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const hasAuthCookie =
    request.cookies.get("access_token") ||
    request.cookies.get("refresh_token");

  if (hasAuthCookie) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.searchParams.set(
    "from",
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  );

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
