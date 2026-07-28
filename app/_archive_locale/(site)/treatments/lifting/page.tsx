import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ScrollSpyTabs } from "@/components/ScrollSpyTabs";
import { RightRail, type RailSection } from "@/components/RightRail";
import { DeviceMarketingCard } from "@/components/DeviceMarketingCard";
import { ArrowIcon, CalendarIcon } from "@/components/icons";
import { clinic } from "@/lib/data";
import { getDevicesByCategory, getDeviceImage, getDeviceMarketing } from "@/lib/devices";
import { getSiteContent, type Locale } from "@/lib/site-content";
import { MedicalProceduresJsonLd, FaqPageJsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getSiteContent(locale).categories.lifting;
  return { title: c.label, description: c.description };
}

export default async function LiftingPage({ params }: Props) {
  const { locale } = await params;
  const content = getSiteContent(locale);
  const cat = content.categories.lifting;
  const tt = content.treatment;
  const common = content.common;
  const devices = getDevicesByCategory(locale, "lifting");

  const tabItems = [
    { id: "overview", label: tt.overviewLabel },
    ...devices.map((d) => ({ id: d.slug, label: d.name })),
  ];

  const subLabels = {
    features: "Features",
    how: "How It Works",
    rec: "Recommended",
    faq: "FAQ",
  };
  const railSections: RailSection[] = [
    { id: "overview", label: cat.label },
    ...devices.flatMap((d) => [
      { id: d.slug, label: d.name },
      { id: `${d.slug}-features`, label: subLabels.features, parent: d.slug },
      { id: `${d.slug}-how`, label: subLabels.how, parent: d.slug },
      { id: `${d.slug}-rec`, label: subLabels.rec, parent: d.slug },
      { id: `${d.slug}-faq`, label: subLabels.faq, parent: d.slug },
    ]),
  ];

  const deviceFaq = devices.flatMap((d) => d.faq ?? []);

  return (
    <>
      <MedicalProceduresJsonLd
        category="lifting"
        categoryLabel={cat.label}
        devices={devices}
      />
      <FaqPageJsonLd items={deviceFaq} />

      {/* CATEGORY HERO */}
      <section id="overview" className="scroll-mt-40 relative overflow-hidden border-b border-line bg-sand/40">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blush blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href={`/${locale}`} className="transition hover:text-brand">
              {common.home}
            </Link>
            <span>/</span>
            <span className="text-ink">{cat.label}</span>
          </nav>
          <p className="mt-6 text-[10px] font-semibold tracking-[0.25em] text-ink-soft/70">OVERVIEW</p>
          <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-brand">{cat.eyebrow}</p>
          <h1 className="mt-3 whitespace-pre-line text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {cat.headlineL1}
            {"\n"}
            {cat.headlineL2}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            {cat.description}
          </p>
        </div>
      </section>

      {/* SCROLL-SPY TAB RAIL */}
      <ScrollSpyTabs items={tabItems} offsetTop={160} />

      {/* RIGHT-SIDE DOC TOC (xl only, fixed) */}
      <RightRail sections={railSections} offsetTop={170} />

      {/* DEVICE SECTIONS */}
      {devices.map((d, i) => (
        <section
          key={d.slug}
          id={d.slug}
          className={`scroll-mt-40 ${i % 2 === 0 ? "bg-cream" : "bg-sand/40"}`}
        >
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8 lg:pb-28 lg:pt-8">
            {/* device hero band — 2 column: text left, marketing card right */}
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.2em] text-brand">
                  0{i + 1} · {d.manufacturer.toUpperCase()}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {d.name}
                </h2>
                <p className="mt-3 text-lg leading-snug text-ink-soft">{d.tagline}</p>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
                  {d.intro}
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {d.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={120}>
                {(() => {
                  const img = getDeviceImage(d.slug);
                  const meta = getDeviceMarketing(d.slug);
                  if (img && meta) {
                    const featuresForCard = d.features.slice(0, 4).map((f, idx) => ({
                      title: meta.featureKeywords[idx] ?? f.title,
                      body: f.body,
                    }));
                    return (
                      <DeviceMarketingCard
                        variant="detail"
                        device={{
                          englishName: meta.englishName,
                          localizedName: d.name,
                          description: d.tagline,
                          image: img,
                          features: featuresForCard,
                        }}
                        brand={{
                          tagline: content.clinic.marketingTagline,
                          clinicName: content.clinic.clinicNameFull,
                          englishName: "SUNSHINE CLINIC",
                        }}
                      />
                    );
                  }
                  return (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand/20 via-white/[0.04] to-white/[0.02] ring-1 ring-inset ring-line">
                      <div
                        aria-hidden
                        className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-brand-soft/30 blur-3xl"
                      />
                      <div
                        aria-hidden
                        className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-brand/25 blur-3xl"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-semibold tracking-[0.25em] text-brand/80">
                          DEVICE
                        </span>
                        <span className="mt-3 text-2xl font-bold leading-tight text-ink lg:text-3xl">
                          {d.name}
                        </span>
                        <div className="mt-6 rounded-2xl bg-white/70 px-5 py-3 backdrop-blur">
                          <p className="text-2xl font-bold text-brand lg:text-3xl">
                            {d.highlightStat.value}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                            {d.highlightStat.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Reveal>
            </div>

            {/* FEATURES */}
            <Reveal className="mt-16 scroll-mt-40" id={`${d.slug}-features`}>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand">FEATURES</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {d.name} · {tt.deviceDiffTitle}
              </h3>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {d.features.map((f, j) => (
                <Reveal key={j} delay={j * 80}>
                  <div className="h-full rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10">
                    <p className="text-xs font-bold text-brand">0{j + 1}</p>
                    <h4 className="mt-3 text-base font-bold text-ink">{f.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* HOW IT WORKS */}
            <Reveal className="mt-16 scroll-mt-40" id={`${d.slug}-how`}>
              <div className="grid gap-6 rounded-3xl bg-ink p-8 text-cream lg:grid-cols-[auto_1fr] lg:items-center lg:p-12">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-soft">
                    HOW IT WORKS
                  </p>
                  <h3 className="mt-2 text-xl font-bold lg:text-2xl">{tt.howItWorksTitle}</h3>
                </div>
                <p className="text-sm leading-relaxed text-cream/85 lg:text-base">
                  {d.howItWorks}
                </p>
              </div>
            </Reveal>

            {/* RECOMMENDED FOR */}
            <div
              id={`${d.slug}-rec`}
              className="mt-16 grid gap-10 scroll-mt-40 lg:grid-cols-[1fr_1.2fr] lg:items-start"
            >
              <Reveal>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand">
                  RECOMMENDED FOR
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {tt.recommendedTitle}
                </h3>
                <a
                  href={clinic.bookingHref}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {common.bookConsultation}
                </a>
              </Reveal>
              <Reveal delay={120}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {d.recommendedFor.map((r, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                        {j + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-ink">{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* FAQ */}
            <Reveal className="mt-16 scroll-mt-40" id={`${d.slug}-faq`}>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand">FAQ</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {tt.faqTitle}
              </h3>
            </Reveal>
            <div className="mt-8 grid gap-3 lg:grid-cols-2">
              {d.faq.map((qa, j) => (
                <Reveal key={j} delay={j * 60}>
                  <details className="group rounded-2xl border border-line bg-white p-5 open:bg-cream">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink">
                      <span>Q. {qa.q}</span>
                      <span className="text-brand transition group-open:rotate-45">＋</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{qa.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}


      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush via-sand to-brand-soft/40 px-6 py-12 text-center lg:py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{tt.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{tt.ctaBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={clinic.bookingHref}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
            >
              <CalendarIcon className="h-4 w-4" /> {common.bookConsultation}
            </a>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              {tt.ctaSecondary} <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
