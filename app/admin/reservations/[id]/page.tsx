import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setStatus, saveNote, deleteReservation } from "../actions";

const STATUS_FLOW = [
  { key: "NEW", label: "신규" },
  { key: "CONTACTED", label: "연락함" },
  { key: "CONFIRMED", label: "확정" },
  { key: "COMPLETED", label: "완료" },
  { key: "CANCELED", label: "취소" },
];

const LOCALE_LABEL: Record<string, string> = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
  zh: "🇨🇳 中文",
};

export default async function ReservationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await prisma.reservation.findUnique({
    where: { id },
    include: { handler: true },
  });
  if (!r) notFound();

  const remove = deleteReservation.bind(null, id);
  const saveNoteBound = saveNote.bind(null, id);

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href="/admin/reservations" className="hover:text-brand">
              예약
            </Link>
            <span>/</span>
            <span className="text-ink">{r.name}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{r.name}</h1>
          <p className="mt-2 text-xs text-ink-soft">
            신청 {r.createdAt.toLocaleString("ko-KR")} ·{" "}
            {LOCALE_LABEL[r.locale] ?? r.locale} · 소스 {r.source}
            {r.handler && ` · 응대자 ${r.handler.name ?? r.handler.email}`}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await remove();
          }}
        >
          <button
            type="submit"
            className="rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            삭제
          </button>
        </form>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="space-y-5 lg:col-span-2">
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">CONTACT</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-ink-soft">연락 수단</dt>
                <dd className="font-semibold text-ink">{r.contactType}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">연락처</dt>
                <dd className="font-mono text-ink">{r.contact}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">희망 일시</dt>
                <dd className="text-ink">
                  {r.preferredAt
                    ? r.preferredAt.toLocaleString("ko-KR")
                    : <span className="text-ink-soft">미지정</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">관심 시술</dt>
                <dd className="text-ink">
                  {r.interest ?? <span className="text-ink-soft">미지정</span>}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">MESSAGE</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {r.message ?? <span className="text-ink-soft">메모 없음</span>}
            </p>
          </div>

          <form
            action={saveNoteBound}
            className="rounded-3xl border border-line bg-white p-6"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">INTERNAL NOTE</p>
            <p className="mt-1 text-[11px] text-ink-soft">직원만 보는 응대 메모입니다.</p>
            <textarea
              name="note"
              defaultValue={r.internalNote ?? ""}
              rows={5}
              className="mt-3 block w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-brand focus:bg-white"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark"
              >
                메모 저장
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">STATUS</p>
            <p className="mt-3 text-xs text-ink-soft">현재 상태를 변경하면 응대 기록이 남습니다.</p>
            <div className="mt-4 space-y-2">
              {STATUS_FLOW.map((s) => {
                const active = r.status === s.key;
                return (
                  <form
                    key={s.key}
                    action={async () => {
                      "use server";
                      await setStatus(r.id, s.key);
                    }}
                  >
                    <button
                      type="submit"
                      disabled={active}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-brand/15 text-brand-dark ring-1 ring-brand/30"
                          : "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className="text-xs">{s.key}</span>
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
