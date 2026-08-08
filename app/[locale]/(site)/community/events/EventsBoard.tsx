"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUpRightIcon } from "@/components/icons";
import { getGrandOpenCategories } from "@/lib/grand-open";
import { GrandOpenCard } from "@/components/GrandOpenCard";

export type EventImage = { src: string; label: string };
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
  const GRAND_OPEN_CATEGORIES = getGrandOpenCategories(useLocale());
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
                  {/* Mobile date */}
                  <p className="mb-4 font-serif text-xs tabular-nums text-ink/50 md:hidden">
                    {e.date}
                  </p>

                  {/* Body copy */}
                  <div className="grid gap-8 md:grid-cols-[110px_1fr]">
                    <p className="hidden text-[10px] font-medium tracking-[0.32em] text-ink/40 md:block">
                      NOTES
                    </p>
                    <div className="max-w-2xl space-y-4 text-[15px] leading-[1.85] text-ink/70">
                      {e.body.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </div>

                  {/* Grand Open card — 강조: 다크 프리미엄 카드 스택 */}
                  {e.slug === "grand-open-2026-07" && (
                    <div className="mt-10 space-y-4 md:ml-[110px]">
                      {GRAND_OPEN_CATEGORIES.map((cat, i) => (
                        <div
                          key={cat.slug}
                          className="overflow-hidden rounded-3xl bg-ink shadow-xl shadow-ink/15"
                        >
                          <GrandOpenCard
                            category={cat}
                            variant="full"
                            showHeader={i === 0}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA — 얇은 라인 버튼 (피부과 톤) */}
                  <div className="mt-10 flex flex-wrap items-center gap-3 md:ml-[110px]">
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
          </li>
        );
      })}
    </ul>
  );
}
