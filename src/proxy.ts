import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATHS = ["/admin", "/admin/curator", "/admin/packages", "/admin/prices"];
const PROTECTED_PATHS = ["/dashboard", "/countdown"];
const ADMIN_API_PATHS = ["/api/seed", "/api/curator", "/api/prices/sync", "/api/alerts"];

const ALLOWED_ORIGINS = [
  "https://srevol.com",
  "https://www.srevol.com",
];

function getOrigin(request: NextRequest): string | null {
  return request.headers.get("origin");
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Same-origin requests have no Origin header
  return ALLOWED_ORIGINS.includes(origin);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = getOrigin(request);

  // ─────────────────────────────────────────────
  // CORS preflight for API routes
  // ─────────────────────────────────────────────
  if (pathname.startsWith("/api") && request.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    const response = new NextResponse(null, { status: 204 });
    response.headers.set("Access-Control-Allow-Origin", origin || ALLOWED_ORIGINS[0]);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }

  // ─────────────────────────────────────────────
  // JWT verification (edge-safe)
  // ─────────────────────────────────────────────
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "ADMIN";

  // ─────────────────────────────────────────────
  // Admin route + API protection (role-based)
  // ─────────────────────────────────────────────
  const isAdminRoute = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isAdminApi = ADMIN_API_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminRoute || isAdminApi) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Frontend: redirect home. API: return 403 JSON.
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ─────────────────────────────────────────────
  // Protected app routes
  // ─────────────────────────────────────────────
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─────────────────────────────────────────────
  // Redirect logged-in users away from auth pages
  // ─────────────────────────────────────────────
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ─────────────────────────────────────────────
  // CORS for actual API responses
  // ─────────────────────────────────────────────
  const response = NextResponse.next();

  if (pathname.startsWith("/api")) {
    if (!isAllowedOrigin(origin)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }
    response.headers.set("Access-Control-Allow-Origin", origin || ALLOWED_ORIGINS[0]);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
