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

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (!ua) return "desktop";
  const s = ua.toLowerCase();
  // iPad reports itself as desktop Safari on iPadOS 13+; still check first
  if (/ipad|tablet|(?:android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(s)) return "mobile";
  return "desktop";
}

const LOCALES = new Set(["ko", "en", "ja", "zh"]);
const PATH_MAX = 200;
const UTM_MAX = 80;

// admin·개인 접속 제외용 쿠키. 어드민 페이지에서 토글해 세팅.
const EXCLUDE_COOKIE = "sunshine-noanalytics";

function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v ?? "");
  }
  return null;
}

export async function POST(req: Request) {
  // 사용자가 '내 접속 통계 제외' 토글을 켜뒀으면 즉시 skip
  if (readCookie(req, EXCLUDE_COOKIE) === "1") {
    return NextResponse.json({ ok: true, skipped: "excluded" });
  }

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

  // UTM params — 클라이언트가 window.location.search를 함께 전송
  const search = String(body.search ?? "");
  let utmSource: string | null = null;
  let utmMedium: string | null = null;
  let utmCampaign: string | null = null;
  if (search) {
    try {
      const sp = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
      utmSource = sp.get("utm_source")?.slice(0, UTM_MAX) || null;
      utmMedium = sp.get("utm_medium")?.slice(0, UTM_MAX) || null;
      utmCampaign = sp.get("utm_campaign")?.slice(0, UTM_MAX) || null;
    } catch {
      /* ignore */
    }
  }

  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") ?? "";
  const visitorId = hashVisitor(ip, ua);
  const deviceType = detectDevice(ua);

  // Vercel Edge geo 헤더 (배포 시 자동 주입)
  const country = req.headers.get("x-vercel-ip-country") || null;
  const region = req.headers.get("x-vercel-ip-country-region") || null;
  const cityRaw = req.headers.get("x-vercel-ip-city") || null;
  const city = cityRaw ? decodeURIComponent(cityRaw) : null;

  try {
    await prisma.pageView.create({
      data: {
        path,
        locale,
        visitorId,
        referrer,
        deviceType,
        country,
        region,
        city,
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });
  } catch (e) {
    console.error("[pv] insert failed:", e);
  }
  return NextResponse.json({ ok: true });
}
