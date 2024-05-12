// import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const session = useSession();
  const pathname = request.nextUrl.pathname;

  const isPublicPath =
    pathname == "/" ||
    pathname == "/verifyemail" ||
    pathname == "/forgotpassword";

  const token = request.cookies.get("token");
  const nextAuthToken = request.cookies.get("next-auth.session-token");

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isPublicPath && nextAuthToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicPath && !token && !nextAuthToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/me", "/verifyemail", "/forgotpassword"],
};
