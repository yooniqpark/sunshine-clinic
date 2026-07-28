import { NextResponse } from "next/server";
import { auth } from "@/auth";

const COOKIE = "sunshine-noanalytics";
const ONE_YEAR = 60 * 60 * 24 * 365;

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { enabled?: boolean } = {};
  try {
    body = (await req.json()) as { enabled?: boolean };
  } catch {
    /* ignore */
  }
  const enabled = body.enabled !== false; // default true

  const res = NextResponse.json({ ok: true, enabled });
  if (enabled) {
    res.cookies.set(COOKIE, "1", {
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: ONE_YEAR,
      path: "/",
    });
  } else {
    res.cookies.delete(COOKIE);
  }
  return res;
}

export async function GET() {
  return NextResponse.json({ ok: true, cookieName: COOKIE });
}
