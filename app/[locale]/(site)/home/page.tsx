import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { AnnouncementPopups } from "@/components/AnnouncementPopups";
import { LiftingDeviceSlider } from "../_components/LiftingDeviceSlider";
import { SignatureShowcase } from "../_components/SignatureShowcase";
import { getDevicesByCategory, getDeviceImage } from "@/lib/devices";
import { getConcernsByCategory } from "@/lib/concerns";
import type { AppLocale } from "@/i18n/routing";
import { ArrowUpRightIcon } from "@/components/icons";

export default async function PreviewHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.home");

  const STATS_KEYS = ["years", "devices", "languages", "personal"] as const;
  const DEVICES_KEYS = [
    { key: "ulthera", img: "/devices/ulthera-prime.png" },
    { key: "thermage", img: "/devices/thermage-flx.png" },
    { key: "shurink", img: "/devices/shurink-universe.png" },
    { key: "fotona", img: "/devices/fotona-starwalker.png" },
    { key: "vbeam", img: "/devices/vbeam.png" },
    { key: "secretRf", img: "/devices/secret-rf.png" },
  ] as const;

  return (
    <>
      <AnnouncementPopups />

      {/* ═══════ 1. HERO — 풀스크린 영상 ═══════ */}
      <section className="relative h-screen w-full overflow-hidden bg-ink text-cream">
        <video
          src="/clinic/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/clinic/hero-panorama.jpg"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(10,6,3,0.30) 0%, rgba(10,6,3,0.55) 70%, rgba(10,6,3,0.75) 100%)",
          }}
        />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <h1 className="font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-normal leading-[1.06] tracking-tight text-cream">
                {t("heroTitleLine1")}
                <br />
                <span className="text-brand-soft">{t("heroTitleAccent")}</span>
              </h1>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ 1.5 EVENTS — 이벤트 카드 (3-slot grid, 현재 GRAND OPEN 1개) ═══════ */}
      <section className="border-b border-line bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] text-brand-dark">
                EVENTS
              </p>
              <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-tight text-ink lg:text-5xl">
                진행 중인 이벤트
              </h2>
            </div>
            <Link
              href="/community/events"
              className="hidden text-xs font-semibold tracking-[0.18em] text-ink-soft underline underline-offset-4 hover:text-brand-dark sm:inline"
            >
              전체 이벤트 →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <Link
                href="/community/events#grand-open-2026-07"
                className="group relative flex aspect-[4/5] h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-ink p-8 text-cream shadow-xl shadow-ink/15 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink/25 lg:p-10"
              >
                {/* 배경 그라디언트 · 노이즈 · 오너먼트 */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at top right, rgba(232,205,175,0.20) 0%, transparent 55%), radial-gradient(ellipse at bottom left, rgba(154,110,84,0.18) 0%, transparent 55%)",
                  }}
                />
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-soft/10 blur-3xl transition duration-700 group-hover:bg-brand-soft/20" />
                <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-cream/25" />
                <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-b border-r border-cream/25" />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-soft/40 bg-brand-soft/10 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-brand-soft backdrop-blur">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-soft" />
                    OPEN
                  </span>
                  <p className="mt-8 text-[10px] font-medium tracking-[0.32em] text-cream/55">
                    2026.07.13 – 08.30
                  </p>
                  <h3 className="mt-6 font-serif text-4xl leading-none tracking-tight lg:text-5xl">
                    Grand Open
                  </h3>
                  <p
                    className="-mt-1 font-serif italic leading-none tracking-tight text-brand-soft"
                    style={{ fontSize: "2.25rem" }}
                  >
                    Event
                  </p>

                  <div className="mt-10 h-px w-16 bg-cream/25" />

                  <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/75 lg:text-base">
                    리프팅 · 화이트닝 · 스킨부스터 · 보톡스
                    <br />
                    <span className="text-brand-soft">4개 카테고리 오픈 특별가</span>
                  </p>
                </div>

                <div className="relative mt-8 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-cream transition group-hover:text-brand-soft">
                    자세히 보기
                    <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <span className="rounded-full border border-cream/20 px-3 py-1 text-[9px] tracking-[0.15em] text-cream/50">
                    VAT 별도
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* 향후 이벤트 자리 (플레이스홀더) */}
            <div className="hidden aspect-[4/5] items-center justify-center rounded-[2rem] border border-dashed border-line bg-white/40 text-center text-xs tracking-[0.15em] text-ink-soft/60 md:flex">
              추가 이벤트 준비 중
            </div>
            <div className="hidden aspect-[4/5] items-center justify-center rounded-[2rem] border border-dashed border-line bg-white/40 text-center text-xs tracking-[0.15em] text-ink-soft/60 lg:flex">
              추가 이벤트 준비 중
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. TRUST BAR (removed) ═══════ */}
      {false && (
      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-14 md:grid-cols-4 lg:px-8">
          {STATS_KEYS.map((k, i) => (
            <Reveal key={k} delay={i * 60}>
              <div className="text-center">
                <p className="font-serif text-5xl font-normal tracking-tight lg:text-6xl">
                  {t(`stats.${k}.n`)}
                  <span className="text-xl align-super text-brand">
                    {t(`stats.${k}.u`)}
                  </span>
                </p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
                  {t(`stats.${k}.l`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* ═══════ 5. SIGNATURE — 대표 시술 에디토리얼 쇼케이스 ═══════ */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-36">
        {/* 배경 미묘한 방사형 하이라이트 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(232,205,175,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(154,110,84,0.08) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* Section header */}
          <div className="mb-16 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.32em] text-brand-soft">
                SIGNATURE
              </p>
              <h2 className="mt-3 font-serif text-5xl font-normal leading-none tracking-tight lg:text-6xl">
                대표 시술
              </h2>
              <p
                className="-mt-1 font-serif italic leading-none tracking-tight text-brand-soft/80"
                style={{ fontSize: "2rem" }}
              >
                &amp; Devices
              </p>
            </div>
            <Link
              href="/about#devices"
              className="hidden text-xs font-semibold tracking-[0.2em] text-cream/60 underline underline-offset-8 hover:text-brand-soft sm:inline"
            >
              전체 장비 보기 →
            </Link>
          </div>

          <SignatureShowcase
            items={[
              ...getDevicesByCategory(locale as AppLocale, "lifting").map((d) => ({
                slug: d.slug,
                name: d.name,
                tagline: d.tagline,
                img: getDeviceImage(d.slug) ?? "",
                category: "lifting",
                categoryLabel: "LIFTING",
              })),
              ...getConcernsByCategory(locale as AppLocale, "anti-aging")
                .filter((c) => c.image)
                .map((c) => ({
                  slug: c.slug,
                  name: c.name,
                  tagline: c.tagline,
                  img: c.image ?? "",
                  category: "anti-aging",
                  categoryLabel: "ANTI-AGING",
                })),
            ]}
          />
        </div>
      </section>

      {/* ═══════ 6. CONCEPT · WHY ═══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.28em] text-brand">{t("whyKicker")}</p>
          <h2 className="mt-6 font-serif text-3xl font-normal leading-tight tracking-tight lg:text-5xl">
            <span className="text-brand-dark">{t("whyLine1a")}</span>
            {t("whyLine1b")}
            <br />
            <span className="text-brand-dark">{t("whyLine2a")}</span>
            {t("whyLine2b")}
            <br />
            <span className="text-brand-dark">{t("whyLine3a")}</span>
            {t("whyLine3b")}
          </h2>
          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand"
          >
            {t("whyCta")} <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══════ 7. CTA / LOCATION ═══════ */}
      <section id="book" className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.28em] text-brand-soft">{t("ctaKicker")}</p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-6xl">
            {t("ctaTitleLead")}
            <span className="text-brand-soft">{t("ctaTitleAccent")}</span>
            {t("ctaTitleTail")}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-cream/70">
            {t("ctaDesc")}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="tel:024217588"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {t("ctaPhone")}
            </a>
            <a
              href="https://m.booking.naver.com/booking/13/bizes/1698236"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-white/10 px-8 py-4 text-sm font-semibold text-cream backdrop-blur transition hover:bg-white/20"
            >
              {t("ctaNaver")}
            </a>
          </div>
          <p className="mt-16 text-[11px] tracking-[0.2em] text-cream/50">
            {t("address")}
          </p>
        </div>
      </section>
    </>
  );
}

// First device/concern slug per category — deep-link entry from home bento
const FIRST_ITEM: Record<string, string> = {
  lifting: "ulthera-prime",
  "anti-aging": "rejuran",
  whitening: "clarity-ii",
  acne: "carpri-co2",
  "skin-disease": "atopy",
};

function BentoCard({
  slug,
  img,
  label,
  title,
  detail,
  wide,
  tall,
}: {
  slug: string;
  img?: string;
  label: string;
  title: string;
  detail: string;
  wide?: boolean;
  tall?: boolean;
}) {
  const span = [
    wide ? "lg:col-span-2" : "",
    tall ? "lg:row-span-2" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const target = FIRST_ITEM[slug]
    ? `/treatments/${slug}/${FIRST_ITEM[slug]}`
    : "/treatments/lifting/ulthera-prime";
  return (
    <Reveal className={`${span} h-full`}>
      <Link
        href={target}
        className="group relative flex aspect-[4/5] h-full flex-col overflow-hidden rounded-3xl bg-ink sm:aspect-[16/10] lg:aspect-auto lg:min-h-[240px]"
      >
        {img ? (
          <>
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_25%] opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-soft/70" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cream/15 blur-3xl" />
          </>
        )}
        <div className="relative mt-auto p-6 lg:p-7">
          <p className="text-[10px] font-bold tracking-[0.22em] text-brand-soft">{label}</p>
          <h3 className="mt-2 font-serif text-2xl font-normal leading-tight text-cream lg:text-3xl">
            {title}
          </h3>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cream/80 transition group-hover:text-cream">
            {detail}
            <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
