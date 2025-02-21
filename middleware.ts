"use server"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionData = request.cookies.get("session_data")?.value || "";
  console.log("Path:", path);
  console.log("Session Data:", sessionData);

  // Public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login";

  // If user is on a public path and has session data, allow access
  if (isPublicPath && sessionData) {
    return NextResponse.next();
  }

  // If user is on a protected path and has no session data, redirect to login
  if (!isPublicPath && !sessionData) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue otherwise
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

