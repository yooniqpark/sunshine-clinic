"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { AnnouncementPopups } from "@/components/AnnouncementPopups";
import { EventPresetRail, EventPresetTabs } from "@/components/EventPresetRail";
import { MagazineEventPoster } from "@/components/MagazineEventPoster";
import { CAMPAIGNS, type Campaign, type CampaignCategory } from "@/lib/campaign-events";
import type { EventPresetId } from "@/lib/event-presets";

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function CampaignPopups({ activePreset }: { activePreset: EventPresetId }) {
  const [selectedPreset, setSelectedPreset] = useState<EventPresetId>(activePreset);

  useEffect(() => setSelectedPreset(activePreset), [activePreset]);

  if (selectedPreset === "grand-open-2026") {
    return <AnnouncementPopups onSelectPreset={setSelectedPreset} />;
  }

  return (
    <SeasonalCampaignPopup
      campaign={CAMPAIGNS[selectedPreset]}
      onSelectPreset={setSelectedPreset}
      showEventRail={selectedPreset === "first-visit-2026"}
    />
  );
}

function SeasonalCampaignPopup({
  campaign,
  onSelectPreset,
  showEventRail,
}: {
  campaign: Campaign;
  onSelectPreset: (preset: EventPresetId) => void;
  showEventRail: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [detail, setDetail] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setOpen(localStorage.getItem(KEY_PREFIX + campaign.popupId) !== todayStr());
    } catch {
      setOpen(true);
    }
  }, [campaign.popupId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted || !open) return null;

  const warm = campaign.theme === "warm";
  const shell = warm ? "bg-[#2c1713]" : "bg-[#20284f]";
  const footer = warm ? "bg-[#321b16]" : "bg-[#20284f]";

  function closeToday() {
    try {
      localStorage.setItem(KEY_PREFIX + campaign.popupId, todayStr());
    } catch {}
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/35 px-3 py-4 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className={`pointer-events-auto relative flex h-[92dvh] max-h-[900px] w-full flex-col lg:flex-row ${showEventRail ? "max-w-[500px] lg:max-w-[1232px]" : "max-w-md sm:max-w-xl lg:max-w-[1120px]"}`}>
        {showEventRail && (
          <>
            <EventPresetTabs activePreset="first-visit-2026" onSelect={onSelectPreset} />
            <EventPresetRail activePreset="first-visit-2026" onSelect={onSelectPreset} />
          </>
        )}
      <section
        aria-label={campaign.title}
        className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden shadow-2xl shadow-black/35 ${showEventRail ? "rounded-b-[2rem] rounded-t-none lg:rounded-l-none lg:rounded-r-[2rem]" : "rounded-[2rem]"} ${shell}`}
      >
        <div className="relative flex min-h-0 flex-1 lg:flex-row">
          <div className={`${detail ? "hidden" : "flex"} min-h-0 flex-1 flex-col lg:flex lg:w-[500px] lg:flex-none`}>
            <button
              type="button"
              onClick={() => setDetail(true)}
              aria-label={`${campaign.title} 상세 가격표 보기`}
              className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden ${warm ? "bg-[#a85436]" : "bg-[#dce6fa]"}`}
            >
              {campaign.desktopImageUrl ? (
                <>
                  {campaign.magazineTemplate ? (
                    <MagazineEventPoster
                      template={campaign.magazineTemplate}
                      className="h-full w-full lg:hidden"
                    />
                  ) : (
                    <Image
                      src={campaign.posterUrl}
                      alt={`${campaign.title} 이벤트 매거진`}
                      fill
                      priority
                      sizes="100vw"
                      className="object-contain lg:hidden"
                      draggable={false}
                    />
                  )}
                  <Image
                    src={campaign.desktopImageUrl}
                    alt={`${campaign.title} 이벤트 모델`}
                    fill
                    priority
                    sizes="500px"
                    className="hidden object-cover object-center lg:block"
                    draggable={false}
                  />
                </>
              ) : (
                <Image
                  src={campaign.posterUrl}
                  alt={`${campaign.title} 이벤트 포스터`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 440px, 100vw"
                  className="object-contain"
                  draggable={false}
                />
              )}
            </button>
            <div className={`shrink-0 border-t border-white/15 px-3 py-2.5 lg:hidden ${warm ? "bg-[#7e3b2b]" : "bg-[#3d55bb]"}`}>
              <button
                type="button"
                onClick={() => setDetail(true)}
                className="group inline-flex w-full items-center justify-between rounded-full border border-white/35 bg-black/15 px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white transition hover:bg-black/25"
              >
                <span>전체 가격표 · 자세히 보기</span>
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          </div>

          <div className={`${detail ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex`}>
            <CampaignPricePanel campaign={campaign} onBack={() => setDetail(false)} />
          </div>
        </div>

        <div className={`flex shrink-0 items-center justify-between border-t border-white/15 px-5 py-2 text-[11px] text-white ${footer}`}>
          <button type="button" onClick={closeToday} className="text-white/70 hover:text-white">
            오늘 하루 보지 않기
          </button>
          <button type="button" onClick={() => setOpen(false)} className="font-semibold hover:text-white/75">
            닫기
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}

function CampaignPricePanel({
  campaign,
  onBack,
}: {
  campaign: Campaign;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const category = campaign.categories[index];
  const warm = campaign.theme === "warm";

  const colors = useMemo(
    () =>
      warm
        ? {
            page: "bg-[#f5e8dc] text-[#3b231d]",
            accent: "text-[#963e36]",
            badge: "bg-[#963e36] text-white",
            soft: "bg-[#ead2c1]",
            line: "border-[#b37d68]/35",
            active: "bg-[#963e36] text-white",
          }
        : {
            page: "bg-[#f2f5ff] text-[#222947]",
            accent: "text-[#3856c6]",
            badge: "bg-[#3856c6] text-white",
            soft: "bg-[#dfe5fb]",
            line: "border-[#7f8abd]/30",
            active: "bg-[#3856c6] text-white",
          },
    [warm],
  );

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${colors.page}`}>
      <header className={`shrink-0 border-b px-6 pb-3 pt-4 sm:px-8 ${colors.line}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-[9px] font-bold tracking-[0.24em] ${colors.accent}`}>{campaign.eyebrow}</p>
            <h2 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {campaign.desktopTitle ? (
                <>
                  <span className="lg:hidden">{campaign.title}</span>
                  <span className="hidden lg:inline">{campaign.desktopTitle}</span>
                </>
              ) : (
                campaign.title
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold lg:hidden ${colors.line}`}
          >
            ← 포스터
          </button>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-current/65">{campaign.subtitle}</p>
        <div className="mt-2.5 flex items-center justify-between text-[9px] font-semibold tracking-[0.16em] text-current/55">
          <span>{campaign.period}</span>
          <span>{campaign.vatNote}</span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 sm:px-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className={`text-[9px] font-bold tracking-[0.2em] ${colors.accent}`}>{category.kicker}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">{category.name}</h3>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-[9px] font-semibold tracking-[0.12em] ${colors.badge}`}>
            {warm ? "가을 특별가" : "첫 방문 혜택"}
          </span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-current/60">{category.copy}</p>

        <div className="mt-4">
          {category.columns ? (
            <MatrixPriceTable category={category} softClass={colors.soft} lineClass={colors.line} accentClass={colors.accent} />
          ) : (
            <ListPriceTable category={category} lineClass={colors.line} accentClass={colors.accent} />
          )}
        </div>

        <p className={`mt-4 rounded-2xl px-4 py-2.5 text-[10px] leading-relaxed text-current/65 ${colors.soft}`}>
          {campaign.closingCopy}
        </p>
      </div>

      <div className={`grid shrink-0 border-t ${colors.line}`} style={{ gridTemplateColumns: `repeat(${campaign.categories.length}, minmax(0, 1fr))` }}>
        {campaign.categories.map((item, itemIndex) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className={`border-r px-1.5 py-2 text-center last:border-r-0 ${colors.line} ${
              index === itemIndex ? colors.active : "text-current/55 hover:bg-black/5"
            }`}
          >
            <span className="block text-[8px] font-bold tracking-[0.16em]">{String(itemIndex + 1).padStart(2, "0")}</span>
            <span className="mt-1 block text-[10px] font-semibold leading-tight sm:text-[11px]">{item.name}</span>
          </button>
        ))}
      </div>

      <Link
        href="/home#book"
        className={`flex shrink-0 items-center justify-between px-6 py-2.5 text-[11px] font-semibold text-white sm:px-8 ${warm ? "bg-[#963e36]" : "bg-[#3856c6]"}`}
      >
        <span>상담 · 예약하기</span>
        <span>02.421.7588 →</span>
      </Link>
    </div>
  );
}

function MatrixPriceTable({
  category,
  softClass,
  lineClass,
  accentClass,
}: {
  category: CampaignCategory;
  softClass: string;
  lineClass: string;
  accentClass: string;
}) {
  const columns = category.columns ?? [];
  const template = `minmax(112px, 1.35fr) repeat(${columns.length}, minmax(70px, 1fr))`;

  return (
    <div className="min-w-[560px] overflow-hidden rounded-2xl border border-current/10 bg-white/45">
      <div className={`grid items-center gap-2 px-4 py-3 ${softClass}`} style={{ gridTemplateColumns: template }}>
        <span className="text-[9px] font-bold">구분</span>
        {columns.map((column) => (
          <span key={column} className="text-center text-[8px] font-bold leading-tight">{column}</span>
        ))}
      </div>
      {category.rows.map((row) => (
        <div
          key={row.name}
          className={`grid items-center gap-2 border-t px-4 py-3 ${lineClass}`}
          style={{ gridTemplateColumns: template }}
        >
          <span className="text-[11px] font-semibold">{row.name}</span>
          {(row.prices ?? []).map((price, priceIndex) => (
            <span key={`${row.name}-${priceIndex}`} className={`text-center text-[12px] font-bold tabular-nums ${accentClass}`}>
              {price}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function ListPriceTable({
  category,
  lineClass,
  accentClass,
}: {
  category: CampaignCategory;
  lineClass: string;
  accentClass: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-current/10 bg-white/45 px-4">
      {category.rows.map((row) => (
        <div key={row.name} className={`flex items-center justify-between gap-5 border-b py-4 last:border-b-0 ${lineClass}`}>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold sm:text-[13px]">{row.name}</p>
            {row.desc && <p className="mt-1 text-[9px] leading-relaxed text-current/55">{row.desc}</p>}
          </div>
          <div className="shrink-0 text-right">
            {row.original && <p className="text-[9px] text-current/40 line-through">{row.original}</p>}
            <p className={`mt-0.5 font-serif text-xl font-semibold tabular-nums sm:text-2xl ${accentClass}`}>{row.event}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
