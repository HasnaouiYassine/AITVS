import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const authConfigured =
    Boolean(process.env.MONGODB_URI) &&
    Boolean(process.env.AUTH_SECRET) &&
    process.env.AUTH_SECRET !== "replace-with-a-long-random-secret";

  if (!authConfigured) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const protectedRoutes = ["/dashboard", "/visualize", "/projects", "/catalog", "/settings", "/admin"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const sessionCookie =
    req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = Boolean(sessionCookie);

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
