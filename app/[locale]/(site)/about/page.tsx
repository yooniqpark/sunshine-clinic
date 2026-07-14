import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  ArrowIcon,
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  PinIcon,
  SparkleIcon,
} from "@/components/icons";
import { clinic } from "@/lib/data";
import { getDevicesByCategory, getDeviceImage } from "@/lib/devices";
import { getSiteContent, type Locale } from "@/lib/site-content";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = getSiteContent(locale);
  return {
    title: content.about.metaTitle,
    description: content.about.metaDesc,
  };
}

const SPOT_EYEBROWS = ["RECEPTION", "WAITING LOUNGE", "TREATMENT ROOM"];

const DEVICE_CATEGORIES = ["lifting", "whitening", "acne"] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const content = getSiteContent(locale);
  const a = content.about;
  const common = content.common;
  const doc = content.doctors.kim;

  const deviceGroups = DEVICE_CATEGORIES.map((cat) => ({
    key: cat,
    label: content.categories[cat as keyof typeof content.categories].label,
    devices: getDevicesByCategory(locale, cat),
  })).filter((g) => g.devices.length > 0);

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
            <span className="text-ink">{a.breadcrumb}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-brand">ABOUT</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {a.heroTitleL1}<br />
            {a.heroTitleL2}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            {a.brandDescription}
          </p>
        </div>
      </section>

      {/* 01 VISION / PHILOSOPHY */}
      <section id="vision" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading index="01" label={a.valuesLabel} title={a.valuesTitle} />
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[16/12] overflow-hidden rounded-3xl shadow-xl shadow-brand/10">
              <Image
                src="/hero-clinic.png"
                alt={a.spaceImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-4 text-base leading-relaxed text-ink-soft">
              <p>{a.philosophyBody1}</p>
              <p>{a.philosophyBody2}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {a.values.map((v, i) => (
                <div key={i} className="rounded-2xl bg-sand/60 p-5">
                  <p className="text-lg font-bold text-brand">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{v.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{v.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 DEVICES — 사용 장비 안내 (inline, grouped by category) */}
      <section
        id="devices"
        className="scroll-mt-24 border-t border-line bg-cream py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading index="02" label="DEVICES" title="사용 장비 안내" />
          </Reveal>
          <div className="mt-12 space-y-12 lg:space-y-16">
            {deviceGroups.map((group) => (
              <Reveal key={group.key}>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-brand">
                    {group.key.toUpperCase()}
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
                    {group.label}
                  </h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.devices.map((d) => {
                      const img = getDeviceImage(d.slug);
                      return (
                        <Link
                          key={d.slug}
                          href={`/${locale}/treatments/${group.key}`}
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
                            <p className="text-[10px] font-bold tracking-[0.2em] text-brand">
                              {d.manufacturer.toUpperCase()}
                            </p>
                            <p className="mt-1 truncate text-base font-bold text-ink">
                              {d.name}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                              {d.tagline}
                            </p>
                          </div>
                          <ArrowIcon className="h-4 w-4 shrink-0 text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-brand" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 DIRECTOR */}
      <section id="doctors" className="scroll-mt-24 bg-sand/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading index="03" label={a.directorLabel} title={a.directorTitle} />
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-line bg-white">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blush via-sand to-brand-soft/30">
                  <Image
                    src="/team/kim.jpg"
                    alt={doc.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-bold">
                    {doc.name}{" "}
                    <span className="text-base font-normal text-ink-soft">
                      {content.clinic.doctorTitle}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{doc.role}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-medium text-brand-dark">
                    <SparkleIcon className="h-3 w-3" />
                    {doc.focus}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-8">
                <div className="rounded-2xl border border-line bg-white p-6">
                  <p className="text-xs font-semibold tracking-[0.2em] text-brand">CAREER</p>
                  <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                    {a.credentials.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-brand">·</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 TOUR */}
      <section id="tour" className="scroll-mt-24 bg-sand/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading index="04" label={a.tourLabel} title={a.tourTitle} />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {a.tour.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="h-full overflow-hidden rounded-3xl border border-line bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blush via-sand to-brand-soft/30">
                    <div className="absolute inset-0 grid place-items-center text-xs font-medium text-ink/40">
                      {a.tourPhotoPlaceholder}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-brand">
                      {SPOT_EYEBROWS[i] ?? ""}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white/70 px-5 py-4 text-center text-xs leading-relaxed text-ink-soft">
            {a.tourFootnote}
          </p>
        </div>
      </section>

      {/* 05 LOCATION */}
      <section id="location" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading index="05" label="LOCATION" title={a.locationTitle} />
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-6">
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.2em] text-brand">ADDRESS</p>
                <p className="mt-3 flex items-start gap-3 text-sm">
                  <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <span className="text-base font-semibold text-ink">
                      {content.clinic.addressLine}
                    </span>
                    <br />
                    <span className="text-ink-soft">{content.clinic.addressSub}</span>
                  </span>
                </p>
              </div>
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.2em] text-brand">HOURS</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {content.hours.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <span>
                        <span className="font-semibold text-ink">{h.day}</span>{" "}
                        <span className="text-ink-soft">{h.time}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.2em] text-brand">CONTACT</p>
                <p className="mt-3 flex items-center gap-3 text-sm">
                  <PhoneIcon className="h-5 w-5 shrink-0 text-brand" />
                  <a href={clinic.phoneHref} className="text-base font-semibold text-ink">
                    {clinic.phone}
                  </a>
                </p>
              </div>
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.2em] text-brand">DIRECTIONS</p>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {a.directions.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brand">·</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-line lg:sticky lg:top-24">
              <iframe
                title={content.home.mapTitle}
                src={`https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&z=16&output=embed`}
                className="block h-[380px] w-full lg:h-[560px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex gap-2 border-t border-line bg-white p-3">
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(clinic.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sand py-2.5 text-sm font-semibold text-ink transition hover:bg-blush"
                >
                  <PinIcon className="h-4 w-4 text-brand" /> {common.naverMap}
                </a>
                <a
                  href={`https://map.kakao.com/?q=${encodeURIComponent(clinic.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sand py-2.5 text-sm font-semibold text-ink transition hover:bg-blush"
                >
                  <PinIcon className="h-4 w-4 text-brand" /> {common.kakaoMap}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush via-sand to-brand-soft/40 px-6 py-12 text-center lg:py-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {a.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
              {a.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={clinic.bookingHref}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
              >
                <CalendarIcon className="h-4 w-4" /> {common.bookConsultation}
              </a>
              <Link
                href={`/${locale}/treatments/lifting`}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                {a.ctaSecondary} <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
