import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMessages, jobState, requireAdmin } from "@/lib/writing/service";

export const runtime = "nodejs";

// 대화 내용 (after 이후의 새 메시지만) + 진행 상태
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  const { id } = await params;
  const conversation = await prisma.writingConversation.findUnique({ where: { id } });
  if (!conversation) return NextResponse.json({ error: "대화를 찾을 수 없습니다" }, { status: 404 });
  const after = Number(req.nextUrl.searchParams.get("after")) || 0;
  return NextResponse.json({ conversation, messages: await getMessages(id, after), job: jobState(id) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  const { id } = await params;
  if (jobState(id).status === "running") {
    return NextResponse.json({ error: "작업 중인 대화는 지울 수 없어요." }, { status: 400 });
  }
  await prisma.writingConversation.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
