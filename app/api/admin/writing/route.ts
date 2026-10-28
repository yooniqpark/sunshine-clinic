import { NextResponse } from "next/server";
import { prisma } from "@yooniqpark/clinic-core/lib/prisma";
import { DEFAULTS, keyStatus } from "@/lib/writing/engine";
import { requireAdmin, send, type SendInput } from "@/lib/writing/service";

export const runtime = "nodejs";

// 대화 목록 + 설정 기본값
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  const conversations = await prisma.writingConversation.findMany({
    select: { id: true, title: true, kind: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ conversations, keys: keyStatus(), defaults: DEFAULTS });
}

// 메시지 보내기 (새 대화 시작 또는 이어서 수정)
export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  let body: SendInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }
  try {
    const conversationId = await send(body, user.id);
    return NextResponse.json({ conversationId });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "처리하지 못했습니다" }, { status: 400 });
  }
}
