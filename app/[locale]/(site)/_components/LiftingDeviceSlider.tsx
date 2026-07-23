"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

type Device = { slug: string; name: string; tagline: string; img: string };

export function LiftingDeviceSlider({ devices }: { devices: Device[] }) {
  const [idx, setIdx] = useState(0);
  const total = devices.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % total);
    }, 5000);
    return () => window.clearInterval(id);
  }, [total]);

  if (total === 0) return null;

  const cur = devices[idx];

  return (
    <div className="relative">
      {/* Image slide viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-cream/5 lg:aspect-[4/3]">
        {devices.map((d, i) => (
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
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain p-8"
            />
          </div>
        ))}

        {/* Prev / Next */}
        <button
          type="button"
          onClick={() => setIdx((i) => (i - 1 + total) % total)}
          aria-label="Previous"
          className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-cream/40 bg-transparent text-cream transition hover:border-cream hover:bg-cream/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button
          type="button"
          onClick={() => setIdx((i) => (i + 1) % total)}
          aria-label="Next"
          className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-cream/40 bg-transparent text-cream transition hover:border-cream hover:bg-cream/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      {/* Summary + dots */}
      <div className="mt-6 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.22em] text-brand-soft">
            {cur.name}
          </p>
          <p className="mt-1 truncate text-sm text-cream/70">{cur.tagline}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {devices.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === idx}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-cream" : "w-1.5 bg-cream/30"
              }`}
            />
          ))}
        </div>
      </div>

      <Link
        href={`/treatments/lifting/${cur.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-cream hover:text-brand-soft"
      >
        상세 보기 →
      </Link>
    </div>
  );
}
