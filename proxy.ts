import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import { rateLimit } from "@/lib/rate-limit";

const intl = createIntlMiddleware(routing);

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate-limit admin login POST (credentials callback) — 5 attempts / 15 min / IP
  if (
    req.method === "POST" &&
    pathname === "/api/auth/callback/credentials"
  ) {
    const ip = clientIp(req);
    const result = rateLimit(`login:${ip}`, 5, 900, 900);
    if (!result.ok) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=too-many-attempts&retry=${result.retryAfterSec}`,
          req.url
        )
      );
    }
  }

  // admin routes go through NextAuth's middleware (auth.config callback handles redirect to /admin/login)
  if (pathname.startsWith("/admin")) {
    return (auth as unknown as (r: NextRequest) => Response)(req);
  }
  // api routes pass through untouched
  if (pathname.startsWith("/api")) {
    return undefined;
  }
  // /blog is served by inblog via next.config.ts rewrites — skip locale middleware
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    return undefined;
  }
  // everything else: locale-aware (redirects /, prefixes, etc.)
  return intl(req);
}

export const config = {
  matcher: [
    // skip _next, public assets, fav-/asset files
    "/((?!_next|.*\\..*).*)",
    "/admin/:path*",
    "/api/auth/callback/credentials",
  ],
};
