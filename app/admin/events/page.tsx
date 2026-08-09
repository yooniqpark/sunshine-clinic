import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getActiveEventPreset } from "@/lib/active-event-preset";
import { EVENT_PRESETS, type EventPresetId } from "@/lib/event-presets";
import { activateEventPreset, togglePublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsList() {
  const [events, activePresetId] = await Promise.all([
    prisma.event.findMany({
      orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
    }),
    getActiveEventPreset(),
  ]);

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">
            EVENTS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            이벤트 관리
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            총 {events.length}건 · 게시됨{" "}
            {events.filter((event) => event.published).length}건
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-dark sm:self-auto"
        >
          + 새 이벤트
        </Link>
      </header>

      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-brand">
              HOME POPUP
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              메인 팝업 이벤트 교체
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              기존 이벤트와 새 시안 중 하나를 선택하면 홈페이지 팝업이 바로
              교체됩니다.
            </p>
          </div>
          <p className="text-xs text-ink-soft">한 번에 1개만 노출</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {EVENT_PRESETS.map((preset) => {
            const isActive = preset.id === activePresetId;

            return (
              <article
                key={preset.id}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  isActive
                    ? "border-brand ring-2 ring-brand/15"
                    : "border-line hover:border-brand/50"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-line/70">
                  <PresetPreview presetId={preset.id} />
                  {isActive && (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      현재 노출 중
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-brand">
                        {preset.eyebrow}
                      </p>
                      <h3 className="mt-1 font-bold text-ink">
                        {preset.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] text-ink-soft">
                      {preset.period}
                    </span>
                  </div>
                  <p className="mt-2 min-h-10 text-xs leading-relaxed text-ink-soft">
                    {preset.description}
                  </p>

                  <form
                    className="mt-4"
                    action={async () => {
                      "use server";
                      await activateEventPreset(preset.id);
                    }}
                  >
                    <button
                      type="submit"
                      disabled={isActive}
                      className={`w-full rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                        isActive
                          ? "cursor-default bg-emerald-50 text-emerald-700"
                          : "bg-ink text-cream hover:bg-brand-dark"
                      }`}
                    >
                      {isActive ? "선택됨" : "이 이벤트로 교체"}
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-brand">
              EVENT CONTENTS
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              등록 이벤트
            </h2>
          </div>
          <p className="text-xs text-ink-soft">게시·수정·프리뷰 관리</p>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          {events.length === 0 ? (
            <div className="grid place-items-center bg-white p-16 text-sm text-ink-soft">
              아직 등록된 이벤트가 없습니다. 우측 상단 “+ 새 이벤트” 로
              추가하세요.
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
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-line/60 align-middle"
                  >
                    <td className="py-3 pl-5 pr-3">
                      <div
                        className="relative h-14 w-20 overflow-hidden rounded-md"
                        style={{ backgroundColor: event.bgColor }}
                      >
                        {event.photoUrl && (
                          <Image
                            src={event.photoUrl}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-ink">{event.title}</p>
                      <p className="text-xs text-ink-soft">
                        {event.tag} · {event.period}
                      </p>
                      <p className="mt-1 text-[10px] text-ink-soft/70">
                        {event.slug} · 슬라이더{" "}
                        {event.bannerUrl ? "풀블리드" : "split"}
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          event.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-ink/10 text-ink-soft"
                        }`}
                      >
                        {event.published ? "게시 중" : "초안"}
                      </span>
                    </td>
                    <td className="py-3 pr-5">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Link
                          href={`/admin/events/${event.id}/preview`}
                          className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
                        >
                          프리뷰
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
                        >
                          수정
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await togglePublished(event.id, !event.published);
                          }}
                        >
                          <button
                            type="submit"
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                              event.published
                                ? "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                                : "bg-brand text-white hover:bg-brand-dark"
                            }`}
                          >
                            {event.published ? "비공개" : "배포"}
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
      </section>
    </>
  );
}

function PresetPreview({ presetId }: { presetId: EventPresetId }) {
  if (presetId === "after-summer-2026") {
    return (
      <div className="relative h-full w-full bg-[#dca873]">
        <Image
          src="/events/after-summer-2026.svg"
          alt="AFTER SUMMER 이벤트 시안"
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  if (presetId === "grand-open-2026") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#312925] px-5 text-center text-[#f5eadc]">
        <p className="text-[9px] tracking-[0.35em] text-[#d7aa87]">
          INVITATION
        </p>
        <p className="mt-2 font-serif text-3xl">Grand Open</p>
        <p className="mt-1 text-xs italic text-[#d7aa87]">Event</p>
        <p className="mt-4 text-[9px] tracking-[0.2em] text-white/55">
          07.13 — 08.30
        </p>
      </div>
    );
  }

  if (presetId === "aug-2026-holiday") {
    return (
      <div className="flex h-full flex-col justify-between bg-[#ece1d5] p-5 text-[#40342d]">
        <p className="text-[9px] tracking-[0.3em] text-[#9a6d52]">
          SUNSHINE CLINIC
        </p>
        <div>
          <p className="font-serif text-2xl">8월 휴진 안내</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[9px]">
            <span className="rounded-lg bg-white/70 p-2">8.15 휴진</span>
            <span className="rounded-lg bg-white/70 p-2">정기 휴진</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#47332f] px-5 text-center text-[#f4e8df]">
      <p className="text-[9px] tracking-[0.3em] text-[#d7aa87]">
        SAFE SEDATION
      </p>
      <p className="mt-3 font-serif text-2xl">안심 수면마취</p>
      <p className="mt-3 text-[10px] leading-relaxed text-white/60">
        편안함과 안전을 함께 생각하는
        <br />
        선샤인의 수면 시스템
      </p>
    </div>
  );
}
