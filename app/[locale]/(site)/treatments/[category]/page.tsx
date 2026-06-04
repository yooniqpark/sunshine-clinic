import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { categories, clinic } from "@/lib/data";
import { getSiteContent, type Locale, type CategorySlug } from "@/lib/site-content";
import { ArrowIcon, CalendarIcon, SparkleIcon } from "@/components/icons";

type Params = { params: Promise<{ category: string; locale: Locale }> };

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, locale } = await params;
  const base = categories[category];
  if (!base) return {};
  const content = getSiteContent(locale);
  const tr = content.categories[category as CategorySlug];
  return { title: tr?.label ?? base.label, description: tr?.description ?? base.description };
}

export default async function CategoryPage({ params }: Params) {
  const { category, locale } = await params;
  const base = categories[category];
  if (!base) notFound();

  const content = getSiteContent(locale);
  const cat = content.categories[category as CategorySlug];
  const tt = content.treatment;
  const common = content.common;

  return (
    <>
      {/* category hero */}
      <section className="relative overflow-hidden border-b border-line bg-sand/40">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blush blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href={`/${locale}`} className="transition hover:text-brand">
              {common.home}
            </Link>
            <span>/</span>
            <span className="text-ink">{cat.label}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-brand">{cat.eyebrow}</p>
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

      {/* treatments */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{tt.guideTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cat.treatments.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition hover:border-brand hover:shadow-lg hover:shadow-brand/10">
                <h3 className="text-lg font-bold">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* devices */}
      {cat.devices.length > 0 && (
        <section className="bg-ink py-16 text-cream lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-brand-soft">
                <SparkleIcon className="h-3.5 w-3.5" /> DEVICES
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {tt.devicesTitle}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {cat.devices.map((d, i) => {
                const baseImg = base.devices?.[i]?.image;
                return (
                  <Reveal key={d.name} delay={i * 80}>
                    <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6">
                      {baseImg ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-white">
                          <Image
                            src={baseImg}
                            alt={d.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain p-3"
                          />
                        </div>
                      ) : (
                        <div className="relative mb-4 flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand/15 via-white/[0.04] to-white/[0.02] ring-1 ring-inset ring-white/10">
                          {/* abstract geometric accent */}
                          <div
                            aria-hidden
                            className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-brand-soft/20 blur-2xl"
                          />
                          <div
                            aria-hidden
                            className="absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-brand/20 blur-2xl"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-0 opacity-[0.04]"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)",
                            }}
                          />
                          {/* device monogram + name */}
                          <span className="relative text-[10px] font-semibold tracking-[0.25em] text-brand-soft/80">
                            DEVICE
                          </span>
                          <span className="relative mt-2 px-4 text-center text-base font-bold leading-tight text-cream/85">
                            {d.name}
                          </span>
                          <span className="relative mt-2 text-[10px] text-cream/35">
                            {tt.deviceImageAlt}
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-brand-soft">{d.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/70">{d.desc}</p>
                    </div>
                  </Reveal>
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
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            {tt.ctaBody}
          </p>
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
