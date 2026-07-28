"use client";

import type { GrandOpenCategory } from "@/lib/grand-open";
import { GRAND_OPEN_META } from "@/lib/grand-open";

/**
 * Single-category card renderer used by:
 *  - AnnouncementPopups grand-open carousel (1 slide)
 *  - community/events GRAND OPEN expanded view (all 4 stacked)
 *
 * `variant="compact"` — for popup (smaller headings, tighter spacing).
 * `variant="full"`    — for events page (more air).
 */
export function GrandOpenCard({
  category,
  variant = "compact",
  showHeader = true,
  showDate = true,
}: {
  category: GrandOpenCategory;
  variant?: "compact" | "full";
  showHeader?: boolean;
  showDate?: boolean;
}) {
  const scale =
    variant === "compact"
      ? {
          pad: "px-5 pt-5 pb-10 sm:px-7 sm:pt-6 sm:pb-12",
          title: "text-4xl sm:text-5xl",
          eventSize: "2.25rem",
          badge: "text-xs",
          rowText: "text-[13px] sm:text-sm",
          rowPrice: "text-xl sm:text-2xl font-semibold",
          gap: "gap-3",
        }
      : {
          pad: "px-6 pt-10 pb-10 sm:px-10",
          title: "text-5xl sm:text-6xl",
          eventSize: "3rem",
          badge: "text-sm",
          rowText: "text-base",
          rowPrice: "text-2xl sm:text-3xl font-semibold",
          gap: "gap-8",
        };

  return (
    <div className={`relative ${scale.pad}`}>
      {showHeader && (
        <header className="text-center">
          <p className="text-[10px] font-medium tracking-[0.28em] text-cream sm:text-[11px]">
            {GRAND_OPEN_META.eyebrow}
          </p>
          <h2
            className={`mt-2 whitespace-nowrap font-serif font-normal leading-none tracking-tight text-brand-soft ${scale.title}`}
          >
            Grand Open
          </h2>
          <p
            className="-mt-1 leading-none tracking-tight text-cream"
            style={{ fontSize: scale.eventSize, fontFamily: '"Allura", cursive' }}
          >
            Event
          </p>
          {showDate && (
            <>
              {/* 모바일: 기간 + VAT 함께 표시 */}
              <p
                className={`mt-2 text-[10px] tracking-[0.18em] text-cream sm:text-[11px] ${
                  variant === "compact" ? "lg:hidden" : ""
                }`}
              >
                {GRAND_OPEN_META.period} · {GRAND_OPEN_META.vatNote}
              </p>
              {/* 데스크탑 compact: 기간은 숨기고 VAT 안내만 표시 */}
              {variant === "compact" && (
                <p className="mt-2 hidden text-[10px] tracking-[0.18em] text-cream/70 lg:block">
                  {GRAND_OPEN_META.vatNote}
                </p>
              )}
            </>
          )}
        </header>
      )}

      {/* Category badge */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <span
          className={`inline-flex rounded-full bg-ink px-4 py-1.5 font-serif tracking-tight text-cream ${scale.badge}`}
        >
          {category.name}
        </span>
        {category.slug === "lifting" && category.note && (
          <p className="text-[10px] text-cream/80 sm:text-[11px]">
            {category.note}
          </p>
        )}
      </div>

      <div className={`mt-3 flex flex-col ${scale.gap}`}>
        {category.slug === "lifting" && (
          <LiftingBody category={category} rowText={scale.rowText} rowPrice={scale.rowPrice} />
        )}
        {category.slug === "whitening-acne" && (
          <WhiteningBody category={category} rowText={scale.rowText} rowPrice={scale.rowPrice} />
        )}
        {category.slug === "skinbooster" && (
          <SkinboosterBody
            category={category}
            rowText={scale.rowText}
            rowPrice={scale.rowPrice}
          />
        )}
        {category.slug === "botox" && (
          <BotoxBody category={category} rowText={scale.rowText} rowPrice={scale.rowPrice} />
        )}
      </div>

    </div>
  );
}

function LiftingBody({
  category,
  rowText,
  rowPrice,
}: {
  category: Extract<GrandOpenCategory, { slug: "lifting" }>;
  rowText: string;
  rowPrice: string;
}) {
  return (
    <>
      <div className="mb-0.5 flex items-center justify-end">
        <span className="rounded-full bg-ink/85 px-3 py-1 text-[10px] font-medium tracking-[0.1em] text-cream">
          이벤트가
        </span>
      </div>
      {category.groups.map((g) => {
        const [head, ...tail] = g.heading.split(" + ");
        return (
        <div key={g.heading}>
          <div className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full bg-ink/85 px-3.5 py-1.5 text-[11px] font-medium text-cream sm:text-xs">
            <span>{head}</span>
            {tail.map((t) => (
              <span key={t} className="text-brand-soft">
                {"+ "}
                {t}
              </span>
            ))}
          </div>
          <ul className="space-y-2">
            {g.rows.map((r) => (
              <li key={r.name} className="flex items-baseline justify-between gap-3">
                <span className={`text-cream text-legible ${rowText}`}>{r.name}</span>
                <span className={`font-serif tabular-nums text-cream text-legible ${rowPrice}`}>
                  {r.price.replace("만원", "")}
                  <span className="ml-1 text-[10px] text-cream">만원</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        );
      })}
    </>
  );
}

function WhiteningBody({
  category,
  rowText,
  rowPrice,
}: {
  category: Extract<GrandOpenCategory, { slug: "whitening-acne" }>;
  rowText: string;
  rowPrice: string;
}) {
  // grid: 이름/설명 | 정가(정렬 우측, 90px) | 이벤트가(우측, 92px)
  const gridCls = "grid grid-cols-[1fr_82px_92px] items-baseline gap-3";
  return (
    <>
      <div className={`mb-1 ${gridCls}`}>
        <span />
        <span className="rounded-full bg-ink/50 px-2 py-1 text-center text-[10px] font-medium tracking-[0.1em] text-cream">
          정가
        </span>
        <span className="rounded-full bg-ink/85 px-2 py-1 text-center text-[10px] font-medium tracking-[0.1em] text-cream">
          이벤트가
        </span>
      </div>
      {category.groups.map((g) => (
        <div key={g.label}>
          <div className="mb-3 inline-flex rounded-full bg-ink/85 px-3.5 py-1.5 text-[11px] font-medium text-cream sm:text-xs">
            {g.label}
          </div>
          <ul className="space-y-4">
            {g.rows.map((r) => (
              <li key={r.name} className={gridCls}>
                <div className="min-w-0">
                  <p className={`font-semibold text-cream text-legible ${rowText}`}>{r.name}</p>
                  {r.desc && (
                    <p className="mt-0.5 text-xs leading-snug text-cream">{r.desc}</p>
                  )}
                </div>
                <span className="text-right text-xs text-cream/60 line-through tabular-nums">
                  {r.original ?? ""}
                </span>
                <span className={`text-right font-serif tabular-nums text-cream text-legible ${rowPrice}`}>
                  {r.event.replace("만원", "")}
                  <span className="ml-0.5 text-[10px] text-cream">만원</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function SkinboosterBody({
  category,
  rowText,
  rowPrice,
}: {
  category: Extract<GrandOpenCategory, { slug: "skinbooster" }>;
  rowText: string;
  rowPrice: string;
}) {
  const gridCls = "grid grid-cols-[1fr_82px_92px] items-baseline gap-3";
  return (
    <div>
      <div className={`mb-3 ${gridCls}`}>
        <span />
        <span className="rounded-full bg-ink/50 px-2 py-1 text-center text-[10px] font-medium tracking-[0.1em] text-cream">
          {category.headers[0]}
        </span>
        <span className="rounded-full bg-ink/85 px-2 py-1 text-center text-[10px] font-medium tracking-[0.1em] text-cream">
          {category.headers[1]}
        </span>
      </div>
      <ul className="divide-y divide-ink/10">
        {category.rows.map((r) => (
          <li key={r.name} className={`${gridCls} py-3`}>
            <span className={`text-cream ${rowText}`}>{r.name}</span>
            <span className="text-right text-xs text-cream/60 line-through tabular-nums">
              {r.original}
            </span>
            <span className={`text-right font-serif tabular-nums text-cream text-legible ${rowPrice}`}>
              {r.event.replace("만원", "")}
              {r.event.includes("만원") && (
                <span className="ml-0.5 text-[10px] text-cream">만원</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BotoxBody({
  category,
  rowText,
  rowPrice,
}: {
  category: Extract<GrandOpenCategory, { slug: "botox" }>;
  rowText: string;
  rowPrice: string;
}) {
  return (
    <div>
      <div className="mb-3 grid grid-cols-[1.15fr_1fr_1fr_1fr] items-center gap-2">
        <span />
        {category.columns.map((c) => (
          <span
            key={c}
            className="rounded-full bg-ink/85 px-2 py-1 text-center text-[9px] font-medium tracking-tight text-cream sm:text-[10px]"
          >
            {c}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-ink/10">
        {category.rows.map((r) => (
          <li
            key={r.name}
            className="grid grid-cols-[1.15fr_1fr_1fr_1fr] items-baseline gap-2 py-3"
          >
            <span
              className={`whitespace-pre-line text-cream text-legible ${rowText}`}
            >
              {r.name}
            </span>
            {r.prices.map((p, i) => (
              <span
                key={i}
                className={`text-center font-serif tabular-nums text-cream text-legible ${rowPrice}`}
              >
                {p.replace("만원", "")}
                <span className="ml-0.5 text-[10px] text-cream">만원</span>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
