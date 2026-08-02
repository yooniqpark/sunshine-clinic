import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon, ArrowIcon } from "@/components/icons";
import {
  getDevicesByCategory,
  getDeviceImage,
  getDeviceHeroImage,
  getDeviceMarketing,
} from "@/lib/devices";
import koData from "@/content/devices-ko.json";
import concernsKoData from "@/content/concerns-ko.json";
import { getConcern, type Concern } from "@/lib/concerns";
import type { DeviceDetail } from "@/lib/devices";
import type { AppLocale } from "@/i18n/routing";
import { pageSeo, truncateDescription, localeUrl } from "@/lib/seo";
import {
  MedicalProcedureJsonLd,
  FaqPageJsonLd,
  BreadcrumbJsonLd,
} from "@/components/JsonLd";

const ALL_DEVICES_KO = koData as Record<string, DeviceDetail>;
const ALL_CONCERNS_KO = concernsKoData as Record<string, Concern>;

const CATEGORY_KEYS = ["lifting", "anti-aging", "whitening", "acne", "skin-disease"];
const CONCERN_CATEGORY_KEYS = ["anti-aging", "skin-disease"];

const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  lifting: "/models/lifting.png",
  "anti-aging": "/models/anti-aging.jpg",
  whitening: "/models/whitening.png",
  acne: "/models/acne.png",
  "skin-disease": "/models/skin-disease.png",
};

type ProcessStep = { step: string; title: string; body: string };

export function generateStaticParams() {
  const deviceParams = Object.values(ALL_DEVICES_KO)
    .filter((d) => CATEGORY_KEYS.includes(d.category))
    .map((d) => ({ category: d.category, device: d.slug }));
  const concernParams = Object.values(ALL_CONCERNS_KO)
    .filter((c) => CONCERN_CATEGORY_KEYS.includes(c.category))
    .map((c) => ({ category: c.category, device: c.slug }));
  return [...deviceParams, ...concernParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; device: string }>;
}) {
  const { locale, category, device } = await params;
  const path = `/treatments/${category}/${device}`;
  const dict = (
    await import(`@/content/devices-${locale}.json`).catch(() => ({ default: ALL_DEVICES_KO }))
  ).default as Record<string, DeviceDetail>;
  const d = dict[device] ?? ALL_DEVICES_KO[device];
  if (d) {
    return pageSeo({
      locale,
      path,
      title: d.name,
      description: truncateDescription(`${d.tagline} — ${d.intro}`),
    });
  }
  const concern = getConcern(locale as AppLocale, device);
  if (concern) {
    return pageSeo({
      locale,
      path,
      title: concern.name,
      description: truncateDescription(`${concern.tagline} — ${concern.intro}`),
    });
  }
  return {};
}

export default async function DevicePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; device: string }>;
}) {
  const { locale, category, device } = await params;
  setRequestLocale(locale);

  // Load the localized device dict
  const dict = (
    await import(`@/content/devices-${locale}.json`).catch(() => ({ default: ALL_DEVICES_KO }))
  ).default as Record<string, DeviceDetail>;
  const d = dict[device] ?? ALL_DEVICES_KO[device];

  // If no device matches, try to resolve as a concern (anti-aging / skin-disease).
  if (!d || d.category !== category) {
    const concern = getConcern(locale as AppLocale, device);
    if (concern && concern.category === category) {
      return <ConcernPage locale={locale} category={category} concern={concern} />;
    }
    notFound();
  }

  const t = await getTranslations("v2.device");
  const catLabel = t(`categoryLabels.${category}` as never);
  const img = getDeviceImage(d.slug);
  const heroImg = getDeviceHeroImage(d.slug);
  const meta = getDeviceMarketing(d.slug);
  const siblings = getDevicesByCategory(locale as AppLocale, category).filter(
    (x) => x.slug !== d.slug,
  );
  const defaultProcess = t.raw("defaultProcess") as ProcessStep[];
  const pageUrl = localeUrl(locale, `/treatments/${category}/${d.slug}`);

  return (
    <div className="no-download">
      <MedicalProcedureJsonLd
        url={pageUrl}
        name={d.name}
        alternateName={meta?.englishName ?? d.manufacturer}
        description={d.tagline}
        howPerformed={d.howItWorks}
      />
      {d.faq.length > 0 && <FaqPageJsonLd items={d.faq} />}
      <BreadcrumbJsonLd
        items={[
          { name: "HOME", url: localeUrl(locale, "/home") },
          { name: catLabel, url: localeUrl(locale, `/treatments/${category}`) },
          { name: d.name, url: pageUrl },
        ]}
      />
      {/* HERO — 매거진 프레임 커버 (다크 배경 · 여백 있는 판형) */}
      <section className="bg-[#3a322d] px-4 pb-12 pt-20 lg:px-6 lg:pt-28">
        <div className="relative mx-auto h-[64vh] min-h-[460px] overflow-hidden rounded-[8px] bg-[#efe4d3] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
          {heroImg && (
            <Image
              src={heroImg}
              alt={d.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
          )}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#1c1613]/85 via-transparent to-[#1c1613]/30"
          />
          {/* 브레드크럼 — 커버 좌상단 오버레이 */}
          <nav className="absolute left-6 top-6 z-10 hidden items-center gap-2 text-[10px] tracking-[0.15em] text-cream/60 lg:flex">
            <Link href="/home" className="hover:text-cream">{t("crumbHome")}</Link>
            <span>/</span>
            <span>{catLabel.toUpperCase()}</span>
            <span>/</span>
            <span className="text-cream/80">{d.name}</span>
          </nav>
          {/* 마스트헤드 */}
          <div className="absolute inset-x-0 top-6 px-8 text-center text-cream">
            <p className="font-serif text-2xl tracking-[0.35em] lg:text-4xl">SUNSHINE</p>
            <p className="mt-1.5 text-[9px] tracking-[0.45em] text-cream/70">
              SKIN JOURNAL · {category.replace("-", " ").toUpperCase()} · N°01
            </p>
          </div>
          {/* 세로 커버라인 */}
          <p className="absolute left-8 top-1/2 hidden -translate-y-1/2 text-[10px] tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl] lg:block">
            {t("byPrefix")} {d.manufacturer.toUpperCase()}
          </p>
          <p className="absolute right-8 top-1/2 hidden -translate-y-1/2 text-[10px] tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl] lg:block">
            SUNSHINE STANDARD — SEOUL
          </p>
          {/* 타이틀 */}
          <div className="absolute inset-x-0 bottom-9 px-8 text-center text-cream">
            {meta && (
              <p className="text-[10px] font-bold tracking-[0.4em] text-cream/70">
                {meta.englishName}
              </p>
            )}
            <h1 className="mt-3 font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-normal leading-[0.98]">
              {d.name}
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-serif text-base text-cream/85">
              &ldquo;{d.tagline}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* INTRO + PRODUCT SHOT — 왼쪽 소개, 오른쪽 제품 사진 */}
      <section className="bg-cream py-32 lg:py-44">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.35em] text-brand-dark">
              {t("introKicker")}
            </p>
            <h2 className="mt-8 whitespace-pre-line font-serif text-[26px] leading-[1.45] text-ink lg:text-[34px] lg:leading-[1.4]">
              {d.intro}
            </h2>
            {d.introBody && (
              <>
                <span aria-hidden className="mt-8 block h-px w-16 bg-brand-dark/50" />
                <p className="mt-8 max-w-lg text-[15px] leading-[1.95] text-ink/60">
                  {d.introBody}
                </p>
              </>
            )}
          </Reveal>

          {img && (
            <Reveal>
              <div className="relative aspect-[4/5] lg:aspect-[3/4]">
                <Image
                  src={img}
                  alt={d.name}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-contain object-center"
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* HIGHLIGHT STAT + TECH */}
      <section className="border-y border-line bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-ink-soft">
              {t("coreSpec")}
            </p>
            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-serif text-6xl leading-none text-ink lg:text-7xl">
                {d.highlightStat.value}
              </span>
            </div>
            <p className="mt-4 text-sm tracking-[0.15em] text-ink-soft">
              {d.highlightStat.label}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-ink-soft">
              {t("technology")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {d.tech.map((tt) => (
                <span
                  key={tt}
                  className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
                >
                  {tt}
                </span>
              ))}
            </div>
            {meta && (
              <div className="mt-8 flex flex-wrap gap-2">
                {meta.featureKeywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-ink px-4 py-2 text-[10px] font-bold tracking-[0.15em] text-cream"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-cream py-32 lg:py-40">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
            {t("featuresKicker")}
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight lg:text-6xl">
            {t.rich("featuresTitle", {
              name: d.name,
              accent: (c) => <span className="text-brand-dark">{c}</span>,
            })}
          </h2>

          <div className="mt-20 grid gap-x-16 gap-y-20 lg:grid-cols-2">
            {d.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="border-t border-ink/20 pt-8">
                  <p className="font-serif text-4xl text-brand-dark">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 font-serif text-2xl leading-snug text-ink lg:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden bg-ink py-32 text-cream lg:py-44">
        <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            {t("howKicker")}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
            {t("howTitle")}
          </h2>
          <p className="mt-12 font-serif text-xl leading-[1.6] text-cream/80 lg:text-2xl lg:leading-[1.55]">
            {d.howItWorks}
          </p>
        </div>
      </section>

      {/* RECOMMENDED FOR */}
      <section className="bg-cream py-32 lg:py-40">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {t("recKicker")}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              {t("recTitleLine1")}
              <br />
              <span className="text-brand-dark">{t("recTitleAccent")}</span>
            </h2>
          </div>

          <ul className="space-y-6">
            {d.recommendedFor.map((r, i) => (
              <Reveal key={r} delay={i * 40}>
                <li className="grid grid-cols-[48px_1fr] gap-6 border-b border-line pb-6">
                  <span className="font-serif text-xl text-brand-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed text-ink">{r}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-ink py-32 text-cream lg:py-44">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            {t("processKicker")}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            {t("processTitleLine1")}
            <br />
            <span className="text-brand-soft">{t("processTitleAccent")}</span>
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
            {defaultProcess.map((p) => (
              <Reveal key={p.step}>
                <div className="border-t border-cream/20 pt-10">
                  <p className="font-serif text-5xl text-brand-soft">{p.step}</p>
                  <h3 className="mt-6 font-serif text-2xl">{p.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-cream/65">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {d.faq.length > 0 && (
        <section className="bg-cream py-32 lg:py-40">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">{t("faqKicker")}</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              {t("faqTitle")}
            </h2>

            <div className="mt-16 divide-y divide-line border-y border-line">
              {d.faq.map((f, i) => (
                <details key={f.q} className="group py-8" open={i === 0}>
                  <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
                    <span className="font-serif text-lg leading-snug text-ink lg:text-xl">
                      Q. {f.q}
                    </span>
                    <span className="mt-1 font-serif text-2xl text-brand-dark transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-6 text-base leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight lg:text-6xl">
              {t("ctaTitleLead")}
              {d.name}
              <br />
              <span className="text-brand-soft">{t("ctaTitleAccent")}</span>
              {t("ctaTitleTail")}
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/home#book"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-soft"
              >
                {t("ctaOnline")}
                <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:024217588"
                className="rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold text-cream hover:border-cream"
              >
                {t("ctaPhone")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}

async function ConcernPage({
  locale,
  category,
  concern,
}: {
  locale: string;
  category: string;
  concern: Concern;
}) {
  const t = await getTranslations("v2.device");
  const catLabel = t(`categoryLabels.${category}` as never);
  const defaultProcess = t.raw("defaultProcess") as ProcessStep[];
  // concern이 자체 이미지 없을 때 모델(카테고리 대표) 사진 대신 은은한 다크 배경만 사용
  const heroBg = concern.heroImage ?? concern.image ?? undefined;

  // Localized concerns for siblings.
  const localizedConcerns = (
    await import(`@/content/concerns-${locale}.json`).catch(() => ({
      default: ALL_CONCERNS_KO,
    }))
  ).default as Record<string, Concern>;
  const siblings = Object.values(localizedConcerns)
    .filter((c) => c.category === category && c.slug !== concern.slug)
    .slice(0, 3);

  const introParagraphs = concern.intro.split(/\n\n+/).filter(Boolean);
  const pageUrl = localeUrl(locale, `/treatments/${category}/${concern.slug}`);

  return (
    <div className="no-download">
      {concern.faq.length > 0 && <FaqPageJsonLd items={concern.faq} />}
      <BreadcrumbJsonLd
        items={[
          { name: "HOME", url: localeUrl(locale, "/home") },
          { name: catLabel, url: localeUrl(locale, `/treatments/${category}`) },
          { name: concern.name, url: pageUrl },
        ]}
      />
      {/* HERO — 매거진 프레임 커버 (Magazine Framed) */}
      {heroBg ? (
        <section className="bg-[#3a322d] px-4 pb-12 pt-20 lg:px-6 lg:pt-28">
          <div className="relative mx-auto h-[64vh] min-h-[460px] overflow-hidden rounded-[8px] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
            <Image
              src={heroBg}
              alt={concern.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_25%]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#1c1613]/85 via-transparent to-[#1c1613]/35"
            />
            {/* 브레드크럼 — 커버 좌상단 오버레이 */}
            <nav className="absolute left-6 top-6 z-10 hidden items-center gap-2 text-[10px] tracking-[0.15em] text-cream/60 lg:flex">
              <Link href="/home" className="hover:text-cream">{t("crumbHome")}</Link>
              <span>/</span>
              <span>{catLabel.toUpperCase()}</span>
              <span>/</span>
              <span className="text-cream/80">{concern.name}</span>
            </nav>
            {/* 마스트헤드 */}
            <div className="absolute inset-x-0 top-6 px-8 text-center text-cream">
              <p className="font-serif text-2xl tracking-[0.35em] lg:text-4xl">SUNSHINE</p>
              <p className="mt-1.5 text-[9px] tracking-[0.45em] text-cream/70">
                SKIN JOURNAL · {category.replace("-", " ").toUpperCase()} · N°01
              </p>
            </div>
            {/* 세로 커버라인 */}
            <p className="absolute left-8 top-1/2 hidden -translate-y-1/2 text-[10px] tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl] lg:block">
              {catLabel}
            </p>
            <p className="absolute right-8 top-1/2 hidden -translate-y-1/2 text-[10px] tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl] lg:block">
              SUNSHINE STANDARD — SEOUL
            </p>
            {/* 타이틀 */}
            <div className="absolute inset-x-0 bottom-9 px-8 text-center text-cream">
              <h1 className="font-serif text-[clamp(2.4rem,5.5vw,4.6rem)] font-normal leading-[0.98]">
                {concern.name}
              </h1>
              <p className="mx-auto mt-5 max-w-lg font-serif text-base text-cream/85">
                &ldquo;{concern.tagline}&rdquo;
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-[#3a322d] text-cream">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-0 hidden select-none whitespace-nowrap font-serif text-[11rem] leading-none text-cream/[0.045] lg:block"
          >
            {category.replace("-", " ").toUpperCase()}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-[-30%] h-[480px] w-[480px] rounded-full bg-[#c49074]/20 blur-[120px]"
          />
          <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-12 lg:pb-32 lg:pt-36">
            <nav className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.15em] text-cream/50">
              <Link href="/home" className="hover:text-cream">
                {t("crumbHome")}
              </Link>
              <span>/</span>
              <span className="text-cream/70">{catLabel.toUpperCase()}</span>
              <span>/</span>
              <span className="text-cream/60">{concern.name}</span>
            </nav>

            <h1 className="mt-14 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-tight">
              {concern.name}
            </h1>
            <p className="mt-8 max-w-xl font-serif text-base leading-relaxed text-cream/75 lg:text-xl">
              &ldquo;{concern.tagline}&rdquo;
            </p>
            {concern.manufacturer && (
              <p className="mt-10 text-[10px] tracking-[0.3em] text-cream/50">
                {t("byPrefix")} {concern.manufacturer.toUpperCase()}
              </p>
            )}
          </div>
        </section>
      )}

      {/* INTRO + IMAGE — 왼쪽 소개, 오른쪽 concern 이미지 */}
      <section className="bg-cream py-32 lg:py-44">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.35em] text-brand-dark">
              {t("introKicker")}
            </p>
            <div className="mt-10 space-y-8">
              {introParagraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-serif text-2xl leading-[1.5] text-ink lg:text-[30px] lg:leading-[1.4]"
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {concern.image && (
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-[3/4]">
                <Image
                  src={concern.image}
                  alt={concern.name}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* APPROACH — 다크 인용 밴드 */}
      {concern.approach && (
        <section className="relative overflow-hidden bg-[#241e1a] py-32 text-cream lg:py-40">
          <span
            aria-hidden
            className="pointer-events-none absolute left-[-8%] top-[-40%] h-[420px] w-[420px] rounded-full bg-[#c49074]/15 blur-[110px]"
          />
          <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
            <Reveal>
              <span aria-hidden className="block font-serif text-7xl leading-none text-brand-soft/40">
                &ldquo;
              </span>
              <p className="mt-2 text-[10px] font-bold tracking-[0.3em] text-brand-soft">
                APPROACH
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                {t("howTitle")}
              </h2>
              <p className="mt-10 text-lg leading-relaxed text-cream/75 lg:text-xl">
                {concern.approach}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* RECOMMENDED FOR */}
      {concern.recommendedFor.length > 0 && (
        <section className="bg-cream py-32 lg:py-40">
          <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                {t("recKicker")}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                {t("recTitleLine1")}
                <br />
                <span className="text-brand-dark">{t("recTitleAccent")}</span>
              </h2>
            </div>

            <ul className="space-y-6">
              {concern.recommendedFor.map((r, i) => (
                <Reveal key={r} delay={i * 40}>
                  <li className="grid grid-cols-[48px_1fr] gap-6 border-b border-line pb-6">
                    <span className="font-serif text-xl text-brand-dark">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg leading-relaxed text-ink">{r}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="bg-ink py-32 text-cream lg:py-44">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            {t("processKicker")}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            {t("processTitleLine1")}
            <br />
            <span className="text-brand-soft">{t("processTitleAccent")}</span>
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
            {defaultProcess.map((p) => (
              <Reveal key={p.step}>
                <div className="border-t border-cream/20 pt-10">
                  <p className="font-serif text-5xl text-brand-soft">{p.step}</p>
                  <h3 className="mt-6 font-serif text-2xl">{p.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-cream/65">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {concern.faq.length > 0 && (
        <section className="bg-cream py-32 lg:py-40">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {t("faqKicker")}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              {t("faqTitle")}
            </h2>

            <div className="mt-16 divide-y divide-line border-y border-line">
              {concern.faq.map((f, i) => (
                <details key={f.q} className="group py-8" open={i === 0}>
                  <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
                    <span className="font-serif text-lg leading-snug text-ink lg:text-xl">
                      Q. {f.q}
                    </span>
                    <span className="mt-1 font-serif text-2xl text-brand-dark transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-6 text-base leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight lg:text-6xl">
              {t("ctaTitleLead")}
              {concern.name}
              <br />
              <span className="text-brand-soft">{t("ctaTitleAccent")}</span>
              {t("ctaTitleTail")}
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/home#book"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-soft"
              >
                {t("ctaOnline")}
                <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:024217588"
                className="rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold text-cream hover:border-cream"
              >
                {t("ctaPhone")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
