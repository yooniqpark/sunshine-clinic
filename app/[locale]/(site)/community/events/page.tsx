import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { clinic } from "@/lib/data";
import { getPublishedEvents } from "@/lib/queries";
import { getSiteContent, type Locale } from "@/lib/site-content";
import { ArrowIcon, CalendarIcon, ClockIcon } from "@/components/icons";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getSiteContent(locale);
  return { title: c.events.metaTitle, description: c.events.metaDesc };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  const events = await getPublishedEvents(locale);
  const content = getSiteContent(locale);
  const t = content.events;
  const common = content.common;

  return (
    <>
      {/* hero */}
      <section className="border-b border-line bg-sand/40">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href={`/${locale}`} className="transition hover:text-brand">
              {common.home}
            </Link>
            <span>/</span>
            <span className="text-ink">{t.breadcrumb}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-brand">EVENT</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">{t.heroBody}</p>
        </div>
      </section>

      {/* posts */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="space-y-8 lg:space-y-12">
          {events.map((e, i) => (
            <Reveal key={e.slug} delay={i * 80}>
              <article className="grid overflow-hidden rounded-[2rem] border border-line bg-white lg:grid-cols-2">
                <div
                  className="relative aspect-[16/10] lg:aspect-auto"
                  style={{ backgroundColor: e.bgColor }}
                >
                  {e.photo ? (
                    <Image
                      src={e.photo}
                      alt={e.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-soft/30 via-blush/40 to-sand" />
                  )}
                </div>
                <div className="flex flex-col justify-center p-7 lg:p-10">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blush px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-dark">
                      {e.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {e.period}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight lg:text-3xl">{e.title}</h2>
                  <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
                    {e.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={clinic.kakaoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition hover:bg-brand-dark"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {t.consultCta}
                    </a>
                    <a
                      href={clinic.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                    >
                      {t.phoneCta} <ArrowIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-sand/60 px-5 py-4 text-center text-xs leading-relaxed text-ink-soft">
          {t.disclaimer}
        </p>
      </section>
    </>
  );
}
