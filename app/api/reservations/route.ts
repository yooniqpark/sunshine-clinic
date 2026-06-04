import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// in-memory naive rate limit (per process). Replace with Redis for prod.
const recent = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 5;

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function withinLimit(ip: string) {
  const now = Date.now();
  const r = recent.get(ip);
  if (!r || now - r.ts > WINDOW_MS) {
    recent.set(ip, { count: 1, ts: now });
    return true;
  }
  if (r.count >= LIMIT) return false;
  r.count++;
  return true;
}

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

const ALLOWED_CONTACT_TYPES = new Set([
  "PHONE",
  "EMAIL",
  "KAKAO",
  "LINE",
  "WECHAT",
  "WHATSAPP",
  "OTHER",
]);

function contactTypeOf(s: string): string {
  if (/^[0-9+()\-\s]{7,}$/.test(s)) return "PHONE";
  if (/@/.test(s)) return "EMAIL";
  if (/^wx[\w]+|wechat:/i.test(s)) return "WECHAT";
  if (/line[:\s]/i.test(s)) return "LINE";
  if (/whatsapp/i.test(s)) return "WHATSAPP";
  return "OTHER";
}

const ALLOWED_LOCALES = new Set(["ko", "en", "ja", "zh"]);

export async function POST(req: Request) {
  if (!withinLimit(clientIp(req))) {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요. (요청이 너무 잦습니다)" },
      { status: 429 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = str(body.name);
  const contact = str(body.contact);
  if (!name || name.length > 60) {
    return NextResponse.json({ error: "이름을 입력해 주세요." }, { status: 400 });
  }
  if (!contact || contact.length > 120) {
    return NextResponse.json({ error: "연락처를 입력해 주세요." }, { status: 400 });
  }

  const preferredRaw = str(body.preferredAt);
  let preferredAt: Date | null = null;
  if (preferredRaw) {
    const d = new Date(preferredRaw);
    if (!Number.isNaN(d.getTime())) preferredAt = d;
  }

  const interest = str(body.interest).slice(0, 80) || null;
  const message = str(body.message).slice(0, 5000) || null;
  const localeRaw = str(body.locale).toLowerCase();
  const locale = ALLOWED_LOCALES.has(localeRaw) ? localeRaw : "ko";
  const source = str(body.source) || "chatbot";

  try {
    const created = await prisma.reservation.create({
      data: {
        name: name.slice(0, 60),
        contact: contact.slice(0, 120),
        contactType: (() => {
          const explicit = str(body.contactType).toUpperCase();
          return ALLOWED_CONTACT_TYPES.has(explicit) ? explicit : contactTypeOf(contact);
        })(),
        preferredAt,
        interest,
        message,
        locale,
        source: source.slice(0, 20),
      },
    });
    return NextResponse.json({ id: created.id, ok: true });
  } catch (e) {
    console.error("/api/reservations error:", e);
    return NextResponse.json(
      { error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
