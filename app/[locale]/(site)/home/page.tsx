import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { AnnouncementPopups } from "@/components/AnnouncementPopups";
import { LiftingDeviceSlider } from "../_components/LiftingDeviceSlider";
import { SignatureShowcase } from "../_components/SignatureShowcase";
import { SunshineStandardSplit } from "../_components/SunshineStandardSplit";
import { AiConsultationIntro } from "../_components/AiConsultationIntro";
import { PhilosophyLines } from "../_components/PhilosophyLines";
import {
  getDevicesByCategory,
  getDeviceHeroMobileImage,
  getDeviceMarketing,
} from "@/lib/devices";
import type { AppLocale } from "@/i18n/routing";
import { ArrowUpRightIcon } from "@/components/icons";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // title/description은 레이아웃 기본값 상속, canonical/hreflang/OG url만 페이지 경로로
  return pageSeo({ locale, path: "/home" });
}

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
            SUNSHINE CLINIC
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

      {/* ═══════ 1.3 AI PRE-CONSULTATION — 예약 전 대화 맥락을 상담으로 연결 ═══════ */}
      <AiConsultationIntro locale={locale} />

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
      <section className="relative overflow-hidden bg-[#e9e0d5] py-14 text-ink lg:py-32">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <SignatureShowcase
            items={[
              ...getDevicesByCategory(locale as AppLocale, "lifting"),
              ...getDevicesByCategory(locale as AppLocale, "whitening"),
              ...getDevicesByCategory(locale as AppLocale, "acne").filter(
                (d) => d.slug !== "markview",
              ),
              ...getDevicesByCategory(locale as AppLocale, "anti-aging"),
              // MARK-VU는 마지막
              ...getDevicesByCategory(locale as AppLocale, "acne").filter(
                (d) => d.slug === "markview",
              ),
            ].map((d) => {
              const parts =
                d.tagline
                  ?.split(/[,,·]|—|\s-\s/)
                  .map((s) => s.trim())
                  .filter(Boolean) ?? [];
              const st: [string, string] | undefined =
                parts.length >= 2
                  ? [parts[0] + ",", parts.slice(1).join(" ") + "."]
                  : undefined;
              const mk = getDeviceMarketing(d.slug);
              const catLabel =
                d.slug === "markview"
                  ? "SKIN ANALYSIS"
                  : d.category === "anti-aging"
                    ? "ANTI-AGING"
                    : d.category === "whitening"
                      ? "WHITENING · REDNESS"
                      : d.category === "acne"
                        ? "ACNE · SCAR"
                        : "LIFTING";
              return {
                slug: d.slug,
                name: d.name,
                tagline: d.tagline,
                english: mk?.englishName,
                img: getDeviceHeroMobileImage(d.slug) ?? "",
                category: d.category,
                categoryLabel: catLabel,
                meta: catLabel,
                statement: st,
                description: d.tagline, // 짧게: tagline 한 줄만
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
          <PhilosophyLines />
          <Link
            href="/home#book"
            className="mt-14 inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-ink transition hover:text-brand-dark"
          >
            당신의 피부를 위한 첫 상담
            <span aria-hidden className="text-brand-dark">
              ↗
            </span>
          </Link>
        </div>
      </section>

      {/* ═══════ 7. CTA / LOCATION ═══════ */}
      <section id="book" className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.28em] text-brand-soft">
            {t("ctaKicker")}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-6xl">
            {t("ctaTitleLead")}
            <span className="text-brand-soft">{t("ctaTitleAccent")}</span>
            {t("ctaTitleTail")}
          </h2>
          <p className="mx-auto mt-6 max-w-md whitespace-pre-line break-keep text-[13px] text-cream/70 lg:text-sm">
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
          <p className="mt-16 whitespace-pre-line text-[11px] leading-relaxed tracking-[0.2em] text-cream/50">
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
  const span = [wide ? "lg:col-span-2" : "", tall ? "lg:row-span-2" : ""]
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
          <p className="text-[10px] font-bold tracking-[0.22em] text-brand-soft">
            {label}
          </p>
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
