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

  if (notices.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white py-20 text-center text-sm text-ink-soft">
        등록된 공지가 없습니다.
      </div>
    );
  }

  return (
    <ul>
      {notices.map((n, i) => {
        const isOpen = openId === n.id;
        const isNewest = i === 0;
        return (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => toggle(n.id)}
              aria-expanded={isOpen}
              aria-controls={`notice-${n.id}`}
              className="group grid w-full grid-cols-[80px_1fr_24px] items-start gap-6 border-t border-line py-8 text-left transition hover:border-brand-dark md:grid-cols-[100px_1fr_120px_24px] md:items-center"
            >
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${
                  isNewest
                    ? "bg-brand-dark text-cream"
                    : "bg-ink/5 text-ink-soft"
                }`}
              >
                {isNewest ? "NEW" : n.category}
              </span>

              <div className="min-w-0">
                <h3 className="font-serif text-xl leading-snug transition group-hover:text-brand-dark md:text-2xl">
                  {n.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft md:hidden">
                  {n.body[0]}
                </p>
              </div>

              <span className="hidden text-xs tracking-[0.15em] text-ink-soft md:block md:text-right">
                {formatDate(n.date)}
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
              <div
                id={`notice-${n.id}`}
                className="border-t border-dashed border-line bg-sand/30 px-6 py-8 md:px-10 md:py-10"
              >
                <div className="space-y-3 text-sm leading-relaxed text-ink-soft md:text-base">
                  {n.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>

                {n.items && n.items.length > 0 && (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
                          <span className="font-serif text-2xl leading-none">{it.day}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.2em] text-ink-soft">
                            2026. 08
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
  );
}
