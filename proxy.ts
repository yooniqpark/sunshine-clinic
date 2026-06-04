import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";

const intl = createIntlMiddleware(routing);

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // admin routes go through NextAuth's middleware (auth.config callback handles redirect to /admin/login)
  if (pathname.startsWith("/admin")) {
    return (auth as unknown as (r: NextRequest) => Response)(req);
  }
  // api routes pass through untouched
  if (pathname.startsWith("/api")) {
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
  ],
};
