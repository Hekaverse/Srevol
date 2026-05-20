import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATHS = ["/admin", "/admin/curator", "/admin/packages", "/admin/prices"];
const PROTECTED_PATHS = ["/dashboard", "/countdown"];

// Check session cookie presence (NextAuth v5 beta auth() is broken in middleware)
function hasSessionCookie(request: NextRequest): boolean {
  return !!(
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Host-authjs.session-token")?.value
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin protection — also check cookie + role via header if possible
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    // For admin, require valid session cookie at minimum
    // The page itself will do stricter role checks client-side
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Auth protection — check session cookie presence
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from login/register pages
  if (pathname === "/login" || pathname === "/register") {
    if (hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self' https://*.vercel.app;"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
