import { prisma } from "@yooniqpark/clinic-core/lib/prisma";
import { DEFAULTS, keyStatus } from "@/lib/writing/engine";
import { requireAdmin } from "@/lib/writing/service";
import WritingChat from "./WritingChat";

export const dynamic = "force-dynamic";

export default async function AdminWritingPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  // 관리자(ADMIN) 계정만 사용 — 로그인은 /admin 전체에서 이미 확인됨
  if (!(await requireAdmin())) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center text-ink-soft">
        글쓰기 도우미는 관리자(ADMIN) 계정만 사용할 수 있어요.
      </div>
    );
  }
  const { c } = await searchParams;
  const conversations = await prisma.writingConversation.findMany({
    select: { id: true, title: true, kind: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return (
    <WritingChat
      initialId={c ?? null}
      initialConvs={conversations.map((x) => ({ ...x, updatedAt: x.updatedAt.toISOString() }))}
      keys={keyStatus()}
      defaults={DEFAULTS}
    />
  );
}
