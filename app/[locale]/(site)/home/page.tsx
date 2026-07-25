import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { AnnouncementPopups } from "@/components/AnnouncementPopups";
import { LiftingDeviceSlider } from "../_components/LiftingDeviceSlider";
import { SignatureShowcase } from "../_components/SignatureShowcase";
import { SunshineStandardSplit } from "../_components/SunshineStandardSplit";
import { getDevicesByCategory, getDeviceImage, getDeviceMarketing } from "@/lib/devices";
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
              "radial-gradient(circle at center, rgba(10,6,3,0.15) 0%, rgba(10,6,3,0.32) 70%, rgba(10,6,3,0.48) 100%)",
          }}
        />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-5 text-center lg:px-8">
          <p className="mb-6 text-[10px] font-medium tracking-[0.36em] text-cream/70 lg:text-[11px]">
            SUNSHINE SKIN CLINIC
          </p>
          <Reveal>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.1] tracking-tight text-cream">
              Refine Your Glow
              <br />
              Find Your <span className="text-brand-soft">SUNSHINE</span>
            </h1>
          </Reveal>
        </div>

        {/* SCROLL cue — 세로 라인 + 흐르는 도트 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
          <p className="text-[10px] font-medium tracking-[0.4em] text-cream/70 lg:text-[11px]">
            SCROLL TO DISCOVER
          </p>
          <span
            aria-hidden
            className="relative block h-12 w-px overflow-hidden bg-cream/25"
          >
            <span className="absolute left-0 top-0 h-1/2 w-full animate-scroll-cue bg-cream" />
          </span>
        </div>
      </section>

      {/* ═══════ 1.2 THE SUNSHINE STANDARD — 참고 사이트 스플릿 레이아웃 (모델 자리 + 챕터 아코디언) ═══════ */}
      <SunshineStandardSplit />

      {/* ═══════ 1.5 EVENTS — 임상/피부과 톤 리스트 ═══════ */}
      <section className="border-b border-ink/10 bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Section header */}
          <div className="mb-14 flex items-end justify-between gap-6 lg:mb-16">
            <div>
              <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
                EVENTS
              </p>
              <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.15] tracking-tight text-ink lg:text-[3rem]">
                진행 중인 이벤트
              </h2>
            </div>
            <Link
              href="/community/events"
              className="hidden items-center gap-2 border-b border-ink/30 pb-1.5 text-[11px] font-medium tracking-[0.2em] text-ink transition hover:border-brand-dark hover:text-brand-dark sm:inline-flex"
            >
              전체 이벤트
              <span aria-hidden className="text-brand-dark">↗</span>
            </Link>
          </div>

          {/* 이벤트 리스트 — 임상 톤 */}
          <ul className="border-t border-ink/15">
            <Reveal>
              <li className="border-b border-ink/15">
                <Link
                  href="/community/events#grand-open-2026-07"
                  className="group grid grid-cols-[64px_1fr_28px] items-center gap-6 py-8 transition md:grid-cols-[110px_1fr_180px_28px] md:py-10"
                >
                  {/* Tag */}
                  <span className="inline-flex w-fit items-center gap-1.5 border-b border-brand-dark pb-1 text-[10px] font-medium tracking-[0.28em] text-brand-dark">
                    <span
                      aria-hidden
                      className="h-1 w-1 animate-pulse rounded-full bg-brand-dark"
                    />
                    OPEN
                  </span>

                  {/* Title + subtitle */}
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl leading-snug tracking-tight text-ink transition group-hover:text-brand-dark lg:text-[1.75rem]">
                      Grand Open{" "}
                      <span
                        className="align-baseline text-brand-dark"
                        style={{
                          fontFamily: '"Allura", cursive',
                          fontSize: "1.3em",
                        }}
                      >
                        Event
                      </span>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/55">
                      리프팅 · 화이트닝 · 스킨부스터 · 보톡스{" "}
                      <span className="text-ink/70">— 4개 카테고리 오픈 특별가</span>
                    </p>
                  </div>

                  {/* Date range */}
                  <div className="hidden text-right md:block">
                    <p className="font-serif text-sm tabular-nums text-ink/55">
                      2026.07.13
                      <br />
                      <span className="text-ink/35">— 2026.08.30</span>
                    </p>
                  </div>

                  {/* Arrow marker */}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center justify-self-end rounded-full border border-ink/25 text-ink/45 transition group-hover:border-brand-dark group-hover:text-brand-dark"
                  >
                    <ArrowUpRightIcon className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            </Reveal>
          </ul>

          {/* 안내 캡션 */}
          <p className="mt-6 flex items-center gap-3 text-[11px] tracking-[0.2em] text-ink/40">
            <span aria-hidden className="h-px w-8 bg-ink/20" />
            추가 이벤트가 준비되는 대로 이곳에 안내드립니다 · VAT 별도
          </p>
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

      {/* ═══════ 5. SIGNATURE SELECTION — 제품 슬라이드 (레퍼런스 톤) ═══════ */}
      <section className="relative overflow-hidden bg-[#e9e0d5] py-24 text-ink lg:py-32">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <SignatureShowcase
            items={getDevicesByCategory(locale as AppLocale, "lifting").map((d) => {
              const parts = d.tagline?.split(/[,,·]|—|\s-\s/).map((s) => s.trim()).filter(Boolean) ?? [];
              const st: [string, string] | undefined =
                parts.length >= 2 ? [parts[0] + ",", parts.slice(1).join(" ") + "."] : undefined;
              const mk = getDeviceMarketing(d.slug);
              // 짧게 요약: 첫 문장(마침표까지)만 사용, 없으면 tagline 사용
              const firstSentence = d.intro?.split(/[.。]/)[0]?.trim();
              const shortDesc = firstSentence && firstSentence.length <= 80
                ? firstSentence + "."
                : d.tagline;
              return {
                slug: d.slug,
                name: d.name,
                tagline: d.tagline,
                english: mk?.englishName,
                img: getDeviceImage(d.slug) ?? "",
                category: "lifting",
                categoryLabel: "LIFTING",
                meta: "LIFTING",
                statement: st,
                description: shortDesc,
              };
            })}
          />
        </div>
      </section>

      {/* ═══════ 6. OUR PHILOSOPHY — 참고 사이트 톤 (센터, 크림 배경) ═══════ */}
      <section className="bg-cream py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
            OUR PHILOSOPHY
          </p>
          <h2 className="mt-8 font-serif text-3xl font-normal leading-[1.35] tracking-tight text-ink lg:text-[3rem] lg:leading-[1.3]">
            <span className="text-ink/40">과잉 진료보다</span>{" "}
            <span className="text-brand-dark">필요한 진료</span>
            <span className="text-ink/40">를</span>
            <br />
            <span className="text-ink/40">화려한 광고보다</span>{" "}
            <span className="text-brand-dark">검증된 결과</span>
            <span className="text-ink/40">를</span>
            <br />
            <span className="text-ink/40">일시적 개선보다</span>{" "}
            <span className="text-brand-dark">건강한 변화</span>
            <span className="text-ink/40">를</span>
          </h2>
          <Link
            href="/home#book"
            className="mt-14 inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-ink transition hover:text-brand-dark"
          >
            당신의 피부를 위한 첫 상담
            <span aria-hidden className="text-brand-dark">↗</span>
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
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
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
