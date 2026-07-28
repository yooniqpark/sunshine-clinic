import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider";
import { ClinicJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { DeviceCarousel, type CarouselItem } from "@/components/DeviceCarousel";
import { getDevicesByCategory, getDeviceImage, getDeviceMarketing } from "@/lib/devices";
import { categories, clinic } from "@/lib/data";
import { getPublishedEvents } from "@/lib/queries";
import { getSiteContent, type Locale } from "@/lib/site-content";
import {
  ArrowIcon,
  ArrowUpRightIcon,
  PinIcon,
  ClockIcon,
  PhoneIcon,
  CalendarIcon,
  SparkleIcon,
} from "@/components/icons";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const events = await getPublishedEvents(locale);
  const content = getSiteContent(locale);
  const t = content.home;
  const common = content.common;
  const doc = content.doctors.kim;
  const categoryList = (Object.keys(categories) as Array<keyof typeof categories>).map(
    (slug) => {
      const base = categories[slug];
      const tr = content.categories[slug as keyof typeof content.categories];
      return { slug: base.slug, image: base.image, label: tr.label, eyebrow: tr.eyebrow };
    }
  );
  const carouselBrand = {
    tagline: content.clinic.marketingTagline,
    clinicName: content.clinic.clinicNameFull,
    englishName: "SUNSHINE CLINIC",
  };

  function categoryItems(category: "lifting" | "whitening" | "acne"): CarouselItem[] {
    const cat = content.categories[category];
    const items: CarouselItem[] = [
      {
        kind: "intro",
        eyebrow: cat.eyebrow,
        title: cat.label,
        body: cat.description,
        ctaLabel: common.viewAll,
        href: `/${locale}/treatments/${category}`,
      },
    ];
    for (const d of getDevicesByCategory(locale, category)) {
      const img = getDeviceImage(d.slug);
      const meta = getDeviceMarketing(d.slug);
      if (!img || !meta) continue;
      const featuresForCard = d.features.slice(0, 4).map((f, idx) => ({
        title: meta.featureKeywords[idx] ?? f.title,
        body: f.body,
      }));
      items.push({
        kind: "device",
        slug: d.slug,
        name: d.name,
        desc: d.tagline,
        image: img,
        href: `/${locale}/treatments/${category}#${d.slug}`,
        marketing: {
          englishName: meta.englishName,
          localizedName: d.name,
          description: d.tagline,
          image: img,
          features: featuresForCard,
        },
      });
    }
    return items;
  }

  // unified items: 3 intros + devices in category order, dedup devices by slug
  const carouselItems: CarouselItem[] = (() => {
    const merged: CarouselItem[] = [];
    const seenDevices = new Set<string>();
    for (const cat of ["lifting", "whitening", "acne"] as const) {
      for (const it of categoryItems(cat)) {
        if (it.kind === "device") {
          if (seenDevices.has(it.slug)) continue;
          seenDevices.add(it.slug);
        }
        merged.push(it);
      }
    }
    return merged;
  })();
  return (
    <>
      <ClinicJsonLd locale={locale} />
      <WebSiteJsonLd />

      {/* HERO SLIDER */}
      <HeroSlider events={events} />

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading index="01" label={t.categoriesLabel} title={t.categoriesTitle} />
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {categoryList.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link
                href={`/${locale}/treatments/${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-brand-soft transition-transform duration-500 hover:-translate-y-1"
              >
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent"
                />
                <div className="absolute inset-x-0 top-0 p-5 lg:p-6">
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-cream/90">
                    0{i + 1}
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-cream/85">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-tight text-cream lg:text-xl">
                    {c.label}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cream/95">
                    {common.viewDetail}
                    <ArrowUpRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SIGNATURE — unified device carousel across all categories */}
      <section className="bg-sand/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading index="02" label={t.devicesLabel} title={t.devicesTitle} />
          </Reveal>
          <div className="mt-12">
            <DeviceCarousel
              items={carouselItems}
              detailLabel={common.viewDetail}
              brand={carouselBrand}
            />
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-ink py-20 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="flex items-end justify-between gap-4">
            <SectionHeading index="03" label={t.eventsLabel} title={t.eventsTitle} tone="dark" />
            <Link
              href={`/${locale}/community/events`}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-cream/90 transition hover:text-brand-soft sm:inline-flex"
            >
              {common.viewAll} <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {events.map((e, i) => (
              <Reveal key={e.title} delay={i * 80}>
                <Link
                  href={`/${locale}/community/events`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-3xl"
                  style={{ backgroundColor: e.bgColor }}
                >
                  {e.photo && (
                    <Image
                      src={e.photo}
                      alt={e.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  {/* fade the photo into the matching background color */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-3/5"
                    style={{
                      background: `linear-gradient(to top, ${e.bgColor} 22%, ${e.bgColor}d9 46%, transparent)`,
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-brand-dark">
                      {e.tag}
                    </span>
                    <p className="mt-2 text-xs font-medium text-ink/70">{e.period}</p>
                    <h3 className="mt-1 text-xl font-bold text-ink">{e.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{e.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                      {common.viewDetail} <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONCEPT BAND */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-blush/40 to-sand">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-soft/40 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-32 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start px-5 py-20 lg:px-8 lg:py-28">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand">{t.conceptEyebrow}</p>
            <h2 className="mt-4 text-balance text-2xl font-bold leading-[1.2] tracking-tight text-ink sm:text-3xl lg:text-4xl">
              {t.conceptHeadlineL1}
              <br />
              {t.conceptHeadlineL2}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              {t.conceptBody}
            </p>
            <a
              href="#book"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
            >
              <CalendarIcon className="h-4 w-4" /> {common.bookConsultation}
            </a>
          </Reveal>
        </div>
      </section>

      {/* LOCATION / CTA */}
      <section id="booking" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <SectionHeading index="04" label={t.locationLabel} title={t.locationTitle} />
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>
                  <span className="font-semibold text-ink">{content.clinic.addressLine}</span>
                  <br />
                  <span className="text-ink-soft">{content.clinic.addressSub}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="text-ink-soft">
                  {content.hours.map((h, idx) => (
                    <span key={idx} className="block">
                      <span className="font-medium text-ink">{h.day}</span> {h.time}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-brand" />
                <a href={clinic.phoneHref} className="font-semibold text-ink">
                  {clinic.phone}
                </a>
              </li>
            </ul>
            <a
              href={clinic.bookingHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <CalendarIcon className="h-4 w-4" />
              {common.bookConsultation}
            </a>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-line">
              <iframe
                title={t.mapTitle}
                src={`https://www.google.com/maps?q=${encodeURIComponent("선샤인의원 서울특별시 송파구 올림픽로 102")}&z=17&output=embed`}
                className="block h-[320px] w-full lg:h-[460px]"
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
    </>
  );
}
