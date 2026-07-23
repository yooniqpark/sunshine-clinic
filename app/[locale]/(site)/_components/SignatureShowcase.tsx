"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  img: string;
  category: string;
  categoryLabel: string;
};

const AUTO_ROTATE_MS = 5500;

export function SignatureShowcase({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % total);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [total]);

  const cur = items[idx];

  if (!cur) return null;

  return (
    <div className="relative">
      {/* Main split */}
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        {/* Image side */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-cream/5">
            {items.map((d, i) => (
              <div
                key={d.slug}
                aria-hidden={i !== idx}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                  i === idx ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={d.img}
                  alt={d.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            ))}

            {/* Corner ornaments */}
            <div className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t border-cream/25" />
            <div className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t border-cream/25" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l border-cream/25" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r border-cream/25" />

            {/* Chapter number floating on top-left */}
            <div className="pointer-events-none absolute left-8 top-8">
              <p className="font-serif text-[11px] tracking-[0.32em] text-cream/50">
                CHAPTER
              </p>
              <p
                className="mt-1 font-serif leading-none text-cream/80"
                style={{ fontSize: "3.5rem" }}
              >
                {String(idx + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[10px] tracking-[0.28em] text-cream/40">
                / {String(total).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Content side */}
        <div>
          <span className="inline-flex rounded-full border border-brand-soft/40 bg-brand-soft/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-brand-soft">
            {cur.categoryLabel}
          </span>

          <h3
            key={cur.slug}
            className="mt-6 font-serif text-5xl font-normal leading-none tracking-tight text-cream lg:text-6xl"
            style={{ animation: "fadeUp 0.6s ease-out" }}
          >
            {cur.name}
          </h3>
          <p
            className="mt-4 font-serif italic leading-relaxed text-brand-soft/90"
            style={{ fontSize: "1.25rem" }}
          >
            &ldquo;{cur.tagline}&rdquo;
          </p>

          <div className="mt-10 h-px w-16 bg-cream/25" />

          <div className="mt-8 flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/40 bg-transparent text-cream transition hover:border-cream hover:bg-cream/10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <div className="flex flex-1 items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === idx}
                  className={`h-0.5 flex-1 rounded-full transition-all ${
                    i === idx ? "bg-cream" : "bg-cream/20 hover:bg-cream/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/40 bg-transparent text-cream transition hover:border-cream hover:bg-cream/10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>

          <Link
            href={`/treatments/${cur.category}/${cur.slug}`}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 text-xs font-semibold tracking-[0.18em] text-ink transition hover:bg-brand-soft"
          >
            상세 보기
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-4 w-4 transition group-hover:translate-x-0.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      <style>{`@keyframes fadeUp { 0% { opacity: 0; transform: translateY(12px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
    </div>
  );
}
