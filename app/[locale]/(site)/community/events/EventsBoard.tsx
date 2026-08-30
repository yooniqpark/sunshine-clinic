"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { EventPriceSheet } from "@/components/EventPriceTables";
import { POPUP_EVENTS } from "@/lib/event-popup";

/** 게시판 항목 ↔ 팝업 이벤트 — 가격표를 팝업과 같은 데이터로 그린다 */
const PRICE_SHEET_BY_SLUG: Record<string, string> = {
  "september-2026": "september-best",
  "grand-open-2026-07": "grand-open",
  "first-visit-2026": "first-visit",
};

export type EventImage = { src: string; label: string; width?: number; height?: number };
export type EventEntry = {
  tag: string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  images?: EventImage[];
};

export function EventsBoard({
  items,
  openTag,
}: {
  items: EventEntry[];
  openTag: string;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(items[0]?.slug ?? null);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white py-20 text-center text-sm text-ink-soft">
        No events.
      </div>
    );
  }

  return (
    <ul className="border-t border-ink/10">
      {items.map((e) => {
        const isOpen = openSlug === e.slug;
        const isNew = e.tag === openTag;
        const priceEvent = POPUP_EVENTS.find(
          (p) => p.id === PRICE_SHEET_BY_SLUG[e.slug],
        );
        // 가격표를 실데이터로 그리는 항목은 커버 포스터만 이미지로 남긴다
        const coverImages = priceEvent ? (e.images ?? []).slice(0, 1) : e.images ?? [];
        return (
          <li
            key={e.slug}
            id={e.slug}
            className="scroll-mt-24 border-b border-ink/10"
          >
            <button
              type="button"
              onClick={() =>
                setOpenSlug((cur) => (cur === e.slug ? null : e.slug))
              }
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-[64px_1fr_28px] items-center gap-6 py-8 text-left transition md:grid-cols-[110px_1fr_160px_28px] md:py-10"
            >
              {/* Tag — 임상 스타일: 코너 도트 + 얇은 캡슐 */}
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-none border-b pb-1 text-[10px] font-medium tracking-[0.28em] transition ${
                  isNew
                    ? "border-brand-dark text-brand-dark"
                    : "border-ink/25 text-ink/45"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-1 w-1 rounded-full ${
                    isNew ? "bg-brand-dark" : "bg-ink/25"
                  }`}
                />
                {e.tag.toUpperCase()}
              </span>

              {/* Title */}
              <div className="min-w-0">
                <h3
                  className={`font-serif leading-snug tracking-tight transition ${
                    isOpen
                      ? "text-2xl text-ink lg:text-[1.75rem]"
                      : "text-xl text-ink/80 group-hover:text-ink lg:text-2xl"
                  }`}
                >
                  {e.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/50 md:hidden">
                  {e.excerpt}
                </p>
              </div>

              {/* Date — tabular numerals for clinical feel */}
              <span className="hidden font-serif text-sm tabular-nums text-ink/50 md:block md:text-right">
                {e.date}
              </span>

              {/* Toggle icon — 얇은 + / − 아이콘 */}
              <span
                aria-hidden
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center justify-self-end rounded-full border transition-colors ${
                  isOpen
                    ? "border-brand-dark text-brand-dark"
                    : "border-ink/25 text-ink/45 group-hover:border-ink group-hover:text-ink"
                }`}
              >
                <span className="absolute h-px w-3 bg-current" />
                <span
                  className={`absolute h-3 w-px bg-current transition-transform duration-300 ${
                    isOpen ? "scale-y-0" : "scale-y-100"
                  }`}
                />
              </span>
            </button>

            {/* Expanded body */}
            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <div className="pb-10 md:pb-14">
                  {/* 본문 카드 — 흰 배경으로 내용 영역을 분리 */}
                  <div className="rounded-2xl border border-ink/10 bg-white px-6 py-7 shadow-sm shadow-ink/5 md:px-9 md:py-9">
                  {/* Mobile date */}
                  <p className="mb-5 font-serif text-xs tabular-nums text-ink/45 md:hidden">
                    {e.date}
                  </p>

                  {/* Body copy */}
                  <div className="grid gap-6 md:grid-cols-[110px_1fr] md:gap-8">
                    <p className="hidden text-[10px] font-medium tracking-[0.32em] text-ink/35 md:block">
                      NOTES
                    </p>
                    <div className="max-w-2xl space-y-4 text-[15px] leading-[1.85] text-ink/70">
                      {e.body.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </div>

                  {/* 이벤트 이미지 — 커버 포스터 (가격표는 아래에서 실데이터로 렌더) */}
                  {coverImages.length > 0 && (
                    <div className="mt-10 space-y-5 md:ml-[110px]">
                      {coverImages.map((img) => (
                        <figure
                          key={img.src}
                          className="overflow-hidden rounded-3xl shadow-xl shadow-ink/10"
                        >
                          <Image
                            src={img.src}
                            alt={img.label}
                            width={img.width ?? 1024}
                            height={img.height ?? 1536}
                            sizes="(min-width: 768px) 672px, 100vw"
                            className="h-auto w-full max-w-2xl"
                          />
                        </figure>
                      ))}
                    </div>
                  )}

                  {/* 가격표 — 팝업과 같은 데이터로 렌더해 내용이 어긋나지 않게 한다 */}
                  {priceEvent && (
                    <div className="mt-6 max-w-2xl md:ml-[110px]">
                      <EventPriceSheet event={priceEvent} />
                    </div>
                  )}

                  {/* CTA — 얇은 라인 버튼 (피부과 톤) */}
                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6 md:ml-[110px]">
                    <a
                      href="tel:024217588"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-cream transition hover:bg-brand-dark"
                    >
                      02-421-7588
                    </a>
                    <a
                      href="https://pf.kakao.com/_xoVzwX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-ink transition hover:border-ink hover:bg-ink/5"
                    >
                      KakaoTalk
                      <ArrowUpRightIcon className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
