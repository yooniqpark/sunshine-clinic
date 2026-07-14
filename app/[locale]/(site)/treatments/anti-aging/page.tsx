import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ApproachSteps } from "@/components/ApproachSteps";
import { ScrollSpyTabs } from "@/components/ScrollSpyTabs";
import { RightRail, type RailSection } from "@/components/RightRail";
import { DeviceMarketingCard } from "@/components/DeviceMarketingCard";
import { ArrowIcon, ArrowUpRightIcon, CalendarIcon } from "@/components/icons";
import { clinic } from "@/lib/data";
import { getConcernsByCategory, getCategoryDeviceSlugs } from "@/lib/concerns";
import {
  getDevicesByCategory,
  getDeviceImage,
  getDeviceMarketing,
} from "@/lib/devices";
import { getSiteContent, type Locale } from "@/lib/site-content";
import { MedicalProceduresJsonLd, FaqPageJsonLd } from "@/components/JsonLd";

const CATEGORY = "anti-aging";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getSiteContent(locale).categories[CATEGORY];
  return { title: c.label, description: c.description };
}

export default async function AntiAgingPage({ params }: Props) {
  const { locale } = await params;
  const content = getSiteContent(locale);
  const cat = content.categories[CATEGORY];
  const tt = content.treatment;
  const common = content.common;
  const concerns = getConcernsByCategory(locale, CATEGORY);
  const allDevices = getDevicesByCategory(locale, CATEGORY);
  const usedDeviceSlugs = getCategoryDeviceSlugs(locale, CATEGORY);
  const usedDevices = usedDeviceSlugs
    .map((s) => allDevices.find((d) => d.slug === s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const tabItems = [
    { id: "overview", label: tt.overviewLabel },
    ...concerns.map((c) => ({ id: c.slug, label: c.name })),
    ...(usedDevices.length > 0 ? [{ id: "devices", label: tt.devicesTitle }] : []),
  ];

  const subLabels = {
    devices: tt.concernDevicesLabel,
    approach: tt.approachLabel,
    rec: "RECOMMENDED",
    faq: "FAQ",
  };
  const railSections: RailSection[] = [
    { id: "overview", label: cat.label },
    ...concerns.flatMap((c) => [
      { id: c.slug, label: c.name },
      ...(c.deviceSlugs.length > 0
        ? [{ id: `${c.slug}-devices`, label: subLabels.devices, parent: c.slug }]
        : []),
      { id: `${c.slug}-approach`, label: subLabels.approach, parent: c.slug },
      { id: `${c.slug}-rec`, label: subLabels.rec, parent: c.slug },
      { id: `${c.slug}-faq`, label: subLabels.faq, parent: c.slug },
    ]),
    ...(usedDevices.length > 0
      ? [{ id: "devices", label: tt.devicesTitle }]
      : []),
  ];

  const brand = {
    tagline: content.clinic.marketingTagline,
    clinicName: content.clinic.clinicNameFull,
    englishName: "SUNSHINE DERMATOLOGY CLINIC",
  };

  return (
    <>
      <MedicalProceduresJsonLd
        category={CATEGORY}
        categoryLabel={cat.label}
        devices={usedDevices}
      />
      <FaqPageJsonLd concerns={concerns} />

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

      <ScrollSpyTabs items={tabItems} offsetTop={160} />
      <RightRail sections={railSections} offsetTop={170} />

      {/* CONCERN SECTIONS */}
      {concerns.map((concern, i) => (
        <section
          key={concern.slug}
          id={concern.slug}
          className={`scroll-mt-40 ${i % 2 === 0 ? "bg-cream" : "bg-sand/40"}`}
        >
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8 lg:pb-28 lg:pt-8">
            {/* CONCERN HERO */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.2em] text-brand">
                  0{i + 1} · {cat.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {concern.name}
                </h2>
                {concern.manufacturer && (
                  <p className="mt-2 text-sm font-semibold tracking-wide text-ink-soft">
                    {concern.manufacturer}
                  </p>
                )}
                <p className="mt-3 max-w-3xl text-lg leading-snug text-ink-soft">
                  {concern.tagline}
                </p>
                <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-soft">
                  {concern.intro}
                </p>
              </Reveal>
              {concern.image && (
                <Reveal delay={120}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-white">
                    <Image
                      src={concern.image}
                      alt={concern.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40rem"
                      className="object-cover object-center"
                    />
                  </div>
                </Reveal>
              )}
            </div>

            {/* USED DEVICES */}
            {concern.deviceSlugs.length > 0 && (
              <div id={`${concern.slug}-devices`} className="mt-14 scroll-mt-40">
                <Reveal>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-brand">
                    {tt.concernDevicesLabel}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    {tt.concernDevicesTitle}
                  </h3>
                </Reveal>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {concern.deviceSlugs.map((slug, j) => {
                    const d = allDevices.find((x) => x.slug === slug);
                    if (!d) return null;
                    const img = getDeviceImage(slug);
                    const meta = getDeviceMarketing(slug);
                    return (
                      <Reveal key={slug} delay={j * 80}>
                        <Link
                          href={`#device-${slug}`}
                          className="group flex h-full items-center gap-4 rounded-3xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand/60">
                            {img && (
                              <Image
                                src={img}
                                alt={d.name}
                                fill
                                sizes="80px"
                                className="object-cover object-center"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-bold tracking-[0.2em] text-brand">
                              {meta?.englishName}
                            </p>
                            <p className="mt-1 text-base font-bold text-ink">{d.name}</p>
                            <p className="mt-0.5 text-[11px] text-ink-soft">{d.manufacturer}</p>
                          </div>
                          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            )}

            {/* APPROACH */}
            <Reveal className="mt-14 scroll-mt-40" id={`${concern.slug}-approach`}>
              <div className="grid gap-6 rounded-3xl bg-ink p-8 text-cream lg:grid-cols-[auto_1fr] lg:items-center lg:p-12">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-soft">
                    {tt.approachLabel}
                  </p>
                  <h3 className="mt-2 text-xl font-bold lg:text-2xl">{tt.approachTitle}</h3>
                </div>
                <ApproachSteps
                  text={concern.approach}
                  className="text-sm leading-relaxed text-cream/85 lg:text-base"
                />
              </div>
            </Reveal>

            {/* RECOMMENDED FOR */}
            <div
              id={`${concern.slug}-rec`}
              className="mt-14 grid gap-10 scroll-mt-40 lg:grid-cols-[1fr_1.2fr] lg:items-start"
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
                  {concern.recommendedFor.map((r, j) => (
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
            <Reveal className="mt-14 scroll-mt-40" id={`${concern.slug}-faq`}>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand">FAQ</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{tt.faqTitle}</h3>
            </Reveal>
            <div className="mt-8 grid gap-3 lg:grid-cols-2">
              {concern.faq.map((qa, j) => (
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

      {/* DEVICES — full marketing cards */}
      {usedDevices.length > 0 && (
        <section id="devices" className="scroll-mt-40 border-t border-line bg-cream pb-20 pt-6 lg:pb-28 lg:pt-8">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand">DEVICES</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {tt.devicesTitle}
              </h2>
            </Reveal>
            <div className="mt-12 space-y-20 lg:space-y-28">
              {usedDevices.map((d, i) => {
                const img = getDeviceImage(d.slug);
                const meta = getDeviceMarketing(d.slug);
                return (
                  <div
                    key={d.slug}
                    id={`device-${d.slug}`}
                    className="scroll-mt-40 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center"
                  >
                    <Reveal>
                      <p className="text-xs font-semibold tracking-[0.2em] text-brand">
                        0{i + 1} · {d.manufacturer.toUpperCase()}
                      </p>
                      <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        {d.name}
                      </h3>
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
                      {img && meta ? (
                        <DeviceMarketingCard
                          variant="detail"
                          device={{
                            englishName: meta.englishName,
                            localizedName: d.name,
                            description: d.tagline,
                            image: img,
                            features: d.features.slice(0, 4).map((f, idx) => ({
                              title: meta.featureKeywords[idx] ?? f.title,
                              body: f.body,
                            })),
                          }}
                          brand={brand}
                        />
                      ) : null}
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


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
