"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { GRAND_OPEN_CATEGORIES } from "@/lib/grand-open";
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
  const [openSlug, setOpenSlug] = useState<string | null>(items[0]?.slug ?? null);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white py-20 text-center text-sm text-ink-soft">
        No events.
      </div>
    );
  }

  return (
    <ul>
      {items.map((e) => {
        const isOpen = openSlug === e.slug;
        const isNew = e.tag === openTag;
        return (
          <li key={e.slug} id={e.slug} className="scroll-mt-24">
            <button
              type="button"
              onClick={() =>
                setOpenSlug((cur) => (cur === e.slug ? null : e.slug))
              }
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-[80px_1fr_24px] items-start gap-6 border-t border-line py-8 text-left transition hover:border-brand-dark md:grid-cols-[100px_1fr_140px_24px] md:items-center"
            >
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${
                  isNew
                    ? "bg-brand-dark text-cream"
                    : "bg-ink/5 text-ink-soft"
                }`}
              >
                {e.tag}
              </span>

              <div className="min-w-0">
                <h3 className="font-serif text-xl leading-snug transition group-hover:text-brand-dark md:text-2xl">
                  {e.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft md:hidden">
                  {e.excerpt}
                </p>
              </div>

              <span className="hidden text-xs tracking-[0.15em] text-ink-soft md:block md:text-right">
                {e.date}
              </span>

              <svg
                className={`h-5 w-5 justify-self-end text-ink-soft transition-transform ${
                  isOpen ? "rotate-180 text-brand-dark" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-dashed border-line bg-sand/30 px-6 py-8 md:px-10 md:py-10">
                <p className="text-xs tracking-[0.15em] text-ink-soft md:hidden">
                  {e.date}
                </p>

                <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-soft md:mt-0 md:text-base">
                  {e.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>

                {e.slug === "grand-open-2026-07" && (
                  <div className="mt-8 space-y-4">
                    {GRAND_OPEN_CATEGORIES.map((cat, i) => (
                      <div
                        key={cat.slug}
                        className="overflow-hidden rounded-3xl bg-ink/85 shadow-xl shadow-ink/20 backdrop-blur"
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

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="tel:024217588"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold text-cream hover:bg-brand-dark"
                  >
                    02-421-7588
                  </a>
                  <a
                    href="https://pf.kakao.com/_xoVzwX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-xs font-semibold text-ink hover:border-ink"
                  >
                    KakaoTalk
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
