import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ApproachSteps } from "@/components/ApproachSteps";
import { ScrollSpyTabs } from "@/components/ScrollSpyTabs";
import { RightRail, type RailSection } from "@/components/RightRail";
import { ArrowIcon, CalendarIcon } from "@/components/icons";
import { clinic } from "@/lib/data";
import { getConcernsByCategory } from "@/lib/concerns";
import { getSiteContent, type Locale } from "@/lib/site-content";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getSiteContent(locale).categories.whitening;
  return { title: c.label, description: c.description };
}

export default async function WhiteningPage({ params }: Props) {
  const { locale } = await params;
  const content = getSiteContent(locale);
  const cat = content.categories.whitening;
  const tt = content.treatment;
  const common = content.common;
  const concerns = getConcernsByCategory(locale, "whitening");

  const tabItems = [
    { id: "overview", label: tt.overviewLabel },
    ...concerns.map((c) => ({ id: c.slug, label: c.name })),
  ];

  const subLabels = {
    approach: tt.approachLabel,
    rec: "RECOMMENDED",
    faq: "FAQ",
  };
  const railSections: RailSection[] = [
    { id: "overview", label: cat.label },
    ...concerns.flatMap((c) => [
      { id: c.slug, label: c.name },
      { id: `${c.slug}-approach`, label: subLabels.approach, parent: c.slug },
      { id: `${c.slug}-rec`, label: subLabels.rec, parent: c.slug },
      { id: `${c.slug}-faq`, label: subLabels.faq, parent: c.slug },
    ]),
  ];

  return (
    <>
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
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] text-brand">
                0{i + 1} · {cat.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {concern.name}
              </h2>
              <p className="mt-3 max-w-3xl text-lg leading-snug text-ink-soft">
                {concern.tagline}
              </p>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-soft">
                {concern.intro}
              </p>
            </Reveal>

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
