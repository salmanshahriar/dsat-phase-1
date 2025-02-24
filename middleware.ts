"use server"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionData = request.cookies.get("session_data")?.value || "";
  console.log("Path:", path);
  console.log("Session Data:", sessionData);

  const isPublicPath = path === "/" || path === "/login";

  if (isPublicPath && sessionData) {
    return NextResponse.next();
  }

  if (!isPublicPath && !sessionData) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

