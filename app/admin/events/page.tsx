import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { togglePublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsList() {
  const events = await prisma.event.findMany({
    orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">EVENTS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">이벤트 관리</h1>
          <p className="mt-2 text-sm text-ink-soft">
            총 {events.length}건 · 게시됨 {events.filter((e) => e.published).length}건
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-dark sm:self-auto"
        >
          + 새 이벤트
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {events.length === 0 ? (
          <div className="grid place-items-center bg-white p-16 text-sm text-ink-soft">
            아직 등록된 이벤트가 없습니다. 우측 상단 “+ 새 이벤트” 로 추가하세요.
          </div>
        ) : (
          <table className="w-full bg-white text-sm">
            <thead className="bg-sand/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="py-3 pl-5 pr-3">미리보기</th>
                <th className="py-3 pr-3">제목 · 기간</th>
                <th className="py-3 pr-3">상태</th>
                <th className="py-3 pr-5 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-line/60 align-middle">
                  <td className="py-3 pl-5 pr-3">
                    <div
                      className="relative h-14 w-20 overflow-hidden rounded-md"
                      style={{ backgroundColor: e.bgColor }}
                    >
                      {e.photoUrl && (
                        <Image
                          src={e.photoUrl}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover object-top"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-ink">{e.title}</p>
                    <p className="text-xs text-ink-soft">
                      {e.tag} · {e.period}
                    </p>
                    <p className="mt-1 text-[10px] text-ink-soft/70">
                      {e.slug} · 슬라이더 {e.bannerUrl ? "풀블리드" : "split"}
                    </p>
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        e.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-ink/10 text-ink-soft"
                      }`}
                    >
                      {e.published ? "게시 중" : "초안"}
                    </span>
                  </td>
                  <td className="py-3 pr-5">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Link
                        href={`/admin/events/${e.id}/preview`}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
                      >
                        프리뷰
                      </Link>
                      <Link
                        href={`/admin/events/${e.id}`}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
                      >
                        수정
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await togglePublished(e.id, !e.published);
                        }}
                      >
                        <button
                          type="submit"
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                            e.published
                              ? "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                              : "bg-brand text-white hover:bg-brand-dark"
                          }`}
                        >
                          {e.published ? "비공개" : "배포"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
