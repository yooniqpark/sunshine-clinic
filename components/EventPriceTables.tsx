"use client";

import { useLocale } from "next-intl";
import type { CampaignCategory } from "@/lib/campaign-events";
import type { PopupEvent, PopupTheme } from "@/lib/event-popup";
import { formatPrice, tr } from "@/lib/event-popup-i18n";

/** 팝업과 커뮤니티 게시판이 같은 가격표를 쓰도록 분리한 표 컴포넌트 */
export function MatrixTable({ category, theme: t }: { category: CampaignCategory; theme: PopupTheme }) {
  const locale = useLocale();
  const columns = category.columns ?? [];
  const template = `minmax(72px, 1.2fr) repeat(${columns.length}, minmax(0, 1fr))`;

  return (
    <div
      className="overflow-hidden rounded-xl border lg:rounded-2xl"
      style={{ background: t.tableBg, borderColor: t.tableLine }}
    >
      <div
        className="grid items-center gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-4 lg:py-3"
        style={{ gridTemplateColumns: template, background: t.headBg }}
      >
        <span className="text-[9px] font-bold lg:text-[11px]" style={{ color: t.meta }}>
          {tr("구분", locale)}
        </span>
        {columns.map((c) => (
          <span
            key={c}
            className="break-keep text-center text-[8px] font-bold leading-tight lg:text-[11px]"
            style={{ color: t.headText }}
          >
            {c}
          </span>
        ))}
      </div>
      {category.rows.map((row) => (
        <div
          key={row.name}
          className="grid items-center gap-1.5 border-t px-2.5 py-2.5 sm:gap-2 sm:px-4 lg:py-3"
          style={{ gridTemplateColumns: template, borderColor: t.tableLine }}
        >
          <span
            className="break-keep text-[10px] font-semibold leading-snug lg:text-[13px]"
            style={{ color: t.ink }}
          >
            {row.name}
          </span>
          {(row.prices ?? []).map((p, i) => (
            <span
              key={`${row.name}-${i}`}
              className="text-center text-[11px] font-bold tabular-nums lg:text-[13px]"
              style={{ color: t.price }}
            >
              <Won value={p} unitColor={t.unit} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListTable({ category, theme: t }: { category: CampaignCategory; theme: PopupTheme }) {
  return (
    <div
      className="overflow-hidden rounded-xl border px-4 lg:rounded-2xl"
      style={{ background: t.tableBg, borderColor: t.tableLine }}
    >
      {category.rows.map((row, i) => (
        <div
          key={row.name}
          className="flex items-center justify-between gap-4 py-3 lg:py-3.5"
          style={i > 0 ? { borderTop: `1px solid ${t.tableLine}` } : undefined}
        >
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold lg:text-[13px]" style={{ color: t.ink }}>
              {row.name}
            </p>
            {row.desc && (
              <p className="mt-0.5 text-[9px] leading-relaxed lg:text-[10px]" style={{ color: t.meta }}>
                {row.desc}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            {row.original && (
              <p className="text-[9px] line-through lg:text-[10px]" style={{ color: t.meta }}>
                {row.original}
              </p>
            )}
            <p
              className="text-[13px] font-bold tabular-nums lg:text-[15px]"
              style={{ color: t.price }}
            >
              <Won value={row.event ?? ""} unitColor={t.unit} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** "100만원" → 숫자는 강조, 만원 단위는 작게 */
export function Won({ value, unitColor }: { value: string; unitColor: string }) {
  const locale = useLocale();
  const { num, unit } = formatPrice(value, locale);
  if (!unit) return <>{num}</>;
  return (
    <>
      {num}
      <em className="ml-0.5 text-[0.72em] font-semibold not-italic" style={{ color: unitColor }}>
        {unit}
      </em>
    </>
  );
}

/** 커뮤니티 게시판용 — 한 이벤트의 모든 카테고리를 한 번에 펼쳐 보여준다 */
export function EventPriceSheet({ event }: { event: PopupEvent }) {
  const t = event.theme;
  return (
    <div
      className="overflow-hidden rounded-3xl border p-5 md:p-7"
      style={{ background: t.panel, borderColor: t.line }}
    >
      <div
        className="flex items-center justify-between border-b pb-3 text-[10px] font-semibold tracking-[0.16em]"
        style={{ borderColor: t.line, color: t.meta }}
      >
        <span>{event.period}</span>
        <span>{event.vatNote}</span>
      </div>

      <div className="mt-6 space-y-8">
        {event.categories.map((category) => (
          <section key={category.slug}>
            <p className="text-[10px] font-bold tracking-[0.2em]" style={{ color: t.accent }}>
              {category.kicker}
            </p>
            <h4 className="mt-1 text-lg font-extrabold" style={{ color: t.ink }}>
              {category.name}
            </h4>
            <p className="mt-1 break-keep text-xs" style={{ color: t.meta }}>
              {category.copy}
            </p>
            <div className="mt-3">
              {category.columns ? (
                <MatrixTable category={category} theme={t} />
              ) : (
                <ListTable category={category} theme={t} />
              )}
            </div>
          </section>
        ))}
      </div>

      <p
        className="mt-6 rounded-xl px-4 py-3 text-[11px] leading-relaxed"
        style={{ background: t.noteBg, color: t.noteText }}
      >
        {event.closingCopy}
      </p>
    </div>
  );
}
