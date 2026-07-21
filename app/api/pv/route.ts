import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const VISITOR_SALT = process.env.PV_SALT ?? "sunshine-pv-salt-2026";

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function hashVisitor(ip: string, ua: string) {
  // Rotate salt daily so long-term tracking of an individual isn't possible.
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${ua}|${VISITOR_SALT}|${day}`).digest("hex").slice(0, 32);
}

function originOnly(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

const LOCALES = new Set(["ko", "en", "ja", "zh"]);
const PATH_MAX = 200;

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rawPath = String(body.path ?? "");
  if (!rawPath.startsWith("/")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // strip query strings + limit length
  const path = rawPath.split("?")[0].split("#")[0].slice(0, PATH_MAX);

  // ignore admin/api/asset noise
  if (path.startsWith("/admin") || path.startsWith("/api") || path.includes(".")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const localeRaw = String(body.locale ?? "").toLowerCase();
  const locale = LOCALES.has(localeRaw) ? localeRaw : null;
  const referrer = originOnly(String(body.referrer ?? ""));

  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") ?? "";
  const visitorId = hashVisitor(ip, ua);

  try {
    await prisma.pageView.create({
      data: { path, locale, visitorId, referrer },
    });
  } catch (e) {
    console.error("[pv] insert failed:", e);
  }
  return NextResponse.json({ ok: true });
}
