import { NextResponse, type NextRequest } from "next/server";
import coreProxy from "@yooniqpark/clinic-core/proxy";

export default function proxy(req: NextRequest) {
  const response = coreProxy(req);

  // Auth.js requests a JSON redirect envelope for client-side signIn().
  // Keep Core's rate limit, but do not redirect this POST to an HTML page.
  if (
    req.method === "POST" &&
    req.nextUrl.pathname === "/api/auth/callback/credentials" &&
    req.headers.get("x-auth-return-redirect") === "1"
  ) {
    const location = response?.headers.get("location");
    if (location) {
      const target = new URL(location, req.url);
      if (
        target.pathname === "/admin/login" &&
        target.searchParams.get("error") === "too-many-attempts"
      ) {
        const seconds = Number(target.searchParams.get("retry"));
        const retryAfter = Number.isFinite(seconds) && seconds > 0
          ? Math.ceil(seconds)
          : 900;
        // signIn() exposes the code query parameter alongside the error.
        target.searchParams.set("code", String(retryAfter));
        return NextResponse.json(
          { url: target.toString() },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "Cache-Control": "no-store",
            },
          }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // skip _next, public assets, fav-/asset files
    "/((?!_next|.*\\..*).*)",
    "/admin/:path*",
    "/api/auth/callback/credentials",
  ],
};
