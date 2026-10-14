import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildDocx, type Summary } from "@/lib/writing/docx";
import { lastOfType, requireAdmin } from "@/lib/writing/service";

export const runtime = "nodejs";

// 워드 파일 받기: ?message=<번호> 면 그 원고만, 없으면 최종 원고 + 작업 기록
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  const { id } = await params;
  const conv = await prisma.writingConversation.findUnique({ where: { id } });
  if (!conv) return NextResponse.json({ error: "대화를 찾을 수 없습니다" }, { status: 404 });

  const mid = Number(req.nextUrl.searchParams.get("message")) || 0;
  let draft: string | undefined;
  let summary: Summary | null = null;
  let name = conv.title;
  if (mid) {
    const m = await prisma.writingMessage.findFirst({ where: { id: mid, conversationId: id, type: "draft" } });
    if (m) {
      draft = m.content;
      const v = (JSON.parse(m.meta || "{}") as { version?: number }).version;
      if (v) name += `_${v}번째`;
    }
  } else {
    draft = (await lastOfType(id, "draft"))?.content;
    summary = ((await lastOfType(id, "done"))?.meta as Summary | undefined) ?? null;
  }
  if (!draft) return NextResponse.json({ error: "원고를 찾을 수 없습니다" }, { status: 404 });

  const buf = await buildDocx(draft, summary);
  const filename = `${name.replace(/[^\w가-힣 -]+/g, "_").trim().slice(0, 40) || "원고"}.docx`;
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
