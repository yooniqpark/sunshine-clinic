"use client";

import { useState } from "react";
import type { NoticeEntry } from "./page";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export function NoticeBoard({ notices }: { notices: NoticeEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(notices[0]?.id ?? null);

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      {/* Header row (desktop only) */}
      <div className="hidden grid-cols-[64px_120px_1fr_120px_40px] items-center gap-4 border-b border-line bg-sand/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft sm:grid">
        <span className="text-center">번호</span>
        <span>구분</span>
        <span>제목</span>
        <span className="text-center">등록일</span>
        <span></span>
      </div>

      <ul className="divide-y divide-line">
        {notices.map((n, i) => {
          const isOpen = openId === n.id;
          const num = notices.length - i;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => toggle(n.id)}
                aria-expanded={isOpen}
                aria-controls={`notice-${n.id}`}
                className="grid w-full grid-cols-[1fr_auto] items-start gap-3 px-5 py-4 text-left transition hover:bg-sand/30 sm:grid-cols-[64px_120px_1fr_120px_40px] sm:items-center sm:gap-4 sm:px-6"
              >
                {/* Mobile: number+category badge together, title full width */}
                <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1 sm:contents">
                  <div className="flex items-center gap-2 sm:contents">
                    <span className="text-xs font-semibold text-ink-soft sm:text-center sm:text-sm">
                      {num}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-dark sm:justify-self-start">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-ink sm:text-base">
                    {n.title}
                  </p>
                  <span className="text-xs text-ink-soft sm:text-center sm:text-sm">
                    {formatDate(n.date)}
                  </span>
                </div>

                <svg
                  className={`h-4 w-4 shrink-0 text-ink-soft transition-transform sm:justify-self-center ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div
                  id={`notice-${n.id}`}
                  className="border-t border-line bg-sand/30 px-6 py-6 sm:px-8"
                >
                  <div className="space-y-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {n.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>

                  {n.items && n.items.length > 0 && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {n.items.map((it) => (
                        <div
                          key={it.day}
                          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
                        >
                          <div
                            className={
                              it.status === "closed"
                                ? "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-cream"
                                : "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand/15 text-brand-dark"
                            }
                          >
                            <span className="text-2xl font-bold leading-none">
                              {it.day}
                            </span>
                          </div>
                          <div>
                            <p className="text-[11px] font-medium tracking-wide text-ink-soft">
                              2026년 8월
                            </p>
                            <p className="mt-1 text-base font-semibold text-ink">
                              {it.day}일 ({it.weekday}){" "}
                              <span
                                className={
                                  it.status === "closed"
                                    ? "ml-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600"
                                    : "ml-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-dark"
                                }
                              >
                                {it.label}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {notices.length === 0 && (
        <div className="py-16 text-center text-sm text-ink-soft">
          등록된 공지가 없습니다.
        </div>
      )}
    </div>
  );
}
