import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { AnnouncementPopups } from "@/components/AnnouncementPopups";
import { LiftingDeviceSlider } from "../_components/LiftingDeviceSlider";
import { getDevicesByCategory, getDeviceImage } from "@/lib/devices";
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

      {/* ═══════ 1. HERO — clean editorial (light) ═══════ */}
      <section
        className="relative overflow-hidden bg-ink text-cream"
      >
        {/* 병원 리셉션 영상 배경 */}
        <video
          src="/clinic/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/clinic/hero-panorama.jpg"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* 중앙 대비를 위한 부드러운 방사형 어둡기 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(10,6,3,0.35) 0%, rgba(10,6,3,0.55) 70%, rgba(10,6,3,0.7) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-28 lg:min-h-[75vh] lg:px-8 lg:pb-40 lg:pt-40">
          <Reveal>
            <div className="max-w-3xl">
              <p className="hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-soft sm:flex">
                <span className="h-px w-8 bg-brand-soft" />
                {t("heroKicker")}
              </p>
              <h1 className="mt-8 font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-normal leading-[1.06] tracking-tight text-cream">
                {t("heroTitleLine1")}
                <br />
                <span className="text-brand-soft">{t("heroTitleAccent")}</span>
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-cream/75 lg:text-lg">
                {t("heroDescLine1")}
                <br />
                {t("heroDescLine2")}
              </p>
            </div>
          </Reveal>
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

      {/* ═══════ 3. CATEGORIES — bento grid (before director) ═══════ */}
      <section className="border-y border-line bg-sand/30 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] text-brand">
                {t("categoriesKicker")}
              </p>
              <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-5xl">
                {t("categoriesTitleLead")}
                <span className="text-brand-dark">{t("categoriesTitleAccent")}</span>
              </h2>
            </div>
            <Link
              href="/treatments/lifting"
              className="hidden text-xs font-semibold tracking-[0.18em] text-ink-soft underline underline-offset-4 hover:text-brand sm:inline"
            >
              {t("viewAllCategories")}
            </Link>
          </div>

          <div className="grid gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
            <BentoCard
              slug="lifting"
              img="/models/lifting.png"
              label="LIFTING"
              title={t("cards.lifting")}
              detail={t("bentoDetail")}
              tall
              wide
            />
            <BentoCard
              slug="anti-aging"
              img="/models/anti-aging.jpg"
              label="ANTI-AGING"
              title={t("cards.antiAging")}
              detail={t("bentoDetail")}
            />
            <BentoCard
              slug="whitening"
              img="/models/whitening.png"
              label="WHITENING"
              title={t("cards.whitening")}
              detail={t("bentoDetail")}
            />
            <BentoCard
              slug="acne"
              img="/models/acne.png"
              label="ACNE · SCAR"
              title={t("cards.acne")}
              detail={t("bentoDetail")}
            />
            <BentoCard
              slug="skin-disease"
              label="SKIN DISEASE"
              title={t("cards.skinDisease")}
              detail={t("bentoDetail")}
            />
          </div>
        </div>
      </section>

      {/* ═══════ 5. SIGNATURE DEVICES — 리프팅 대표 장비 슬라이드 ═══════ */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] text-brand-soft">
                LIFTING · SIGNATURE
              </p>
              <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-5xl">
                리프팅 <span className="text-brand-soft">대표 장비</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70">
                울쎄라 · 써마지 · 슈링크 등 리프팅 하이엔드 장비를 소개합니다.
                전체 장비는 병원 소개 페이지에서 확인하세요.
              </p>
              <Link
                href="/about#devices"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cream hover:text-brand-soft"
              >
                전체 장비 보기 <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <LiftingDeviceSlider
              devices={getDevicesByCategory(locale as AppLocale, "lifting").map(
                (d) => ({
                  slug: d.slug,
                  name: d.name,
                  tagline: d.tagline,
                  img: getDeviceImage(d.slug) ?? "",
                }),
              )}
            />
          </div>
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
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ink-soft lg:text-base">
            {t("whyDesc")}
          </p>
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
