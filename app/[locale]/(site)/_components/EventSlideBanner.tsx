"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type EventItem = {
  tag: string;
  slug?: string;
  title: string;
  period: string;
  body: string;
};

export function EventSlideBanner() {
  const t = useTranslations("v2.events");
  const items = t.raw("items") as EventItem[];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-y border-line"
      style={{ backgroundColor: "#F5F0EA" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url('/splash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="relative min-h-[130px] lg:min-h-[110px]">
          {items.map((e, i) => (
            <div
              key={i}
              aria-hidden={idx !== i}
              className={`absolute inset-0 flex flex-col gap-4 transition-all duration-700 ease-out lg:flex-row lg:items-center lg:justify-between lg:gap-8 ${
                idx === i
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <div className="flex flex-1 items-start gap-4 lg:items-center">
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] ${
                    e.tag === "OPEN"
                      ? "bg-brand-dark text-cream"
                      : "bg-ink/10 text-ink"
                  }`}
                >
                  {e.tag}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-xl leading-tight text-ink lg:text-2xl">
                    {e.title}
                  </h3>
                  <p className="mt-1 text-[11px] tracking-[0.15em] text-ink-soft">
                    {e.period}
                  </p>
                </div>
              </div>

              <Link
                href={
                  e.slug
                    ? `/community/events#${e.slug}`
                    : "/community/events"
                }
                className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/25 bg-white/60 px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-ink hover:bg-white lg:self-auto"
              >
                {t("ctaSeeMore")}
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <div className="mt-6 flex items-center gap-1.5 lg:mt-4 lg:justify-end">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`slide ${i + 1}`}
                aria-current={idx === i}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-8 bg-ink" : "w-1.5 bg-ink/25"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
