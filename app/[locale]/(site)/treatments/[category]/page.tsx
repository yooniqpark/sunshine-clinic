import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import { getDevicesByCategory, getDeviceMarketing, type DeviceDetail } from "@/lib/devices";
import type { AppLocale } from "@/i18n/routing";

const CATEGORY_SLUGS = ["lifting", "anti-aging", "whitening", "acne", "skin-disease"] as const;

const CATEGORY_META: Record<string, { image: string; hasDevices: boolean }> = {
  lifting: { image: "/models/lifting.png", hasDevices: true },
  "anti-aging": { image: "/models/anti-aging.jpg", hasDevices: false },
  whitening: { image: "/models/whitening.png", hasDevices: true },
  acne: { image: "/models/acne.png", hasDevices: true },
  "skin-disease": { image: "/models/skin-disease.png", hasDevices: false },
};

type ProcessStep = { step: string; title: string; body: string };
type FallbackItem = { name: string; desc: string; duration?: string };

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const meta = CATEGORY_META[category];
  if (!meta) notFound();

  const t = await getTranslations("v2.treatments");
  const tc = await getTranslations(`v2.treatments.categories.${category}`);

  const label = tc("label");
  const kicker = tc("kicker");
  const heroLine1 = tc("heroLine1");
  const heroLine2 = tc("heroLine2");
  const intro = tc("intro");
  const process = tc.raw("process") as ProcessStep[];
  const hasFallback = !meta.hasDevices;
  const fallbackItems: FallbackItem[] | undefined = hasFallback
    ? (tc.raw("fallbackItems") as FallbackItem[])
    : undefined;

  const devices = meta.hasDevices
    ? getDevicesByCategory(locale as AppLocale, category)
    : [];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-25">
          <Image src={meta.image} alt="" fill className="object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-[11px] tracking-[0.15em] text-cream/50">
            <Link href="/" className="hover:text-cream">{t("crumbHome")}</Link>
            <span>/</span>
            <span className="text-cream/80">{t("crumbTreatments")}</span>
          </nav>
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {kicker}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            {heroLine1}
            <br />
            {heroLine2}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 lg:text-lg">
            {intro}
          </p>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div className="sticky top-24 z-40 border-b border-line bg-cream/90 backdrop-blur lg:top-28">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 lg:px-8">
          {CATEGORY_SLUGS.map((slug) => (
            <CategoryTab
              key={slug}
              slug={slug}
              active={slug === category}
            />
          ))}
        </div>
      </div>

      {/* ITEMS */}
      <TreatmentList
        label={label}
        menuKicker={t("menuKicker")}
        menuTitleSuffix={t("menuTitleSuffix")}
        menuDesc={t("menuDesc")}
        devices={devices}
        items={fallbackItems}
        category={category}
      />

      {/* PROCESS */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">{t("processKicker")}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">{t("processTitle")}</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {process.map((p) => (
              <Reveal key={p.step}>
                <div className="border-t border-cream/15 pt-8">
                  <p className="font-serif text-3xl text-brand-soft">{p.step}</p>
                  <h3 className="mt-4 font-serif text-xl">{p.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/65">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center lg:px-8">
          <h2 className="font-serif text-3xl lg:text-5xl">
            {t.rich("ctaTitle", {
              label,
              accent: (chunks) => (
                <em className="italic text-brand-dark">{chunks}</em>
              ),
            })}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#book"
              className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
            >
              {t("ctaOnline")}
            </Link>
            <a
              href="tel:024217588"
              className="rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink hover:border-ink"
            >
              {t("ctaPhone")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

async function CategoryTab({ slug, active }: { slug: string; active: boolean }) {
  const tc = await getTranslations(`v2.treatments.categories.${slug}`);
  return (
    <Link
      href={`/treatments/${slug}`}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
        active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5"
      }`}
    >
      {tc("label")}
    </Link>
  );
}

type ListRow = {
  name: string;
  desc: string;
  href?: string;
  meta?: string;
};

function TreatmentList({
  label,
  menuKicker,
  menuTitleSuffix,
  menuDesc,
  devices,
  items,
  category,
}: {
  label: string;
  menuKicker: string;
  menuTitleSuffix: string;
  menuDesc: string;
  devices: DeviceDetail[];
  items?: FallbackItem[];
  category: string;
}) {
  const rows: ListRow[] =
    devices.length > 0
      ? devices.map((d) => ({
          name: d.name,
          desc: d.tagline,
          href: `/treatments/${category}/${d.slug}`,
          meta: getDeviceMarketing(d.slug)?.englishName ?? d.manufacturer,
        }))
      : (items ?? []).map((it) => ({
          name: it.name,
          desc: it.desc,
          meta: it.duration ? `DURATION · ${it.duration}` : undefined,
        }));

  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">{menuKicker}</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
          {label}
          {menuTitleSuffix}
        </h2>
        {devices.length > 0 && (
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft lg:text-base">
            {menuDesc}
          </p>
        )}

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {rows.map((row, i) => (
            <Reveal key={row.name} delay={i * 40}>
              <ListItem row={row} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ListItem({ row }: { row: ListRow }) {
  const inner = (
    <div className="flex h-full items-start justify-between gap-6 border-t border-line py-8 transition group-hover:border-brand-dark">
      <div className="min-w-0">
        {row.meta && (
          <p className="text-[10px] font-bold tracking-[0.2em] text-brand-dark">
            {row.meta}
          </p>
        )}
        <h3 className="mt-2 font-serif text-2xl transition group-hover:text-brand-dark">
          {row.name}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          {row.desc}
        </p>
      </div>
      {row.href && (
        <ArrowUpRightIcon className="mt-2 h-5 w-5 shrink-0 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-dark" />
      )}
    </div>
  );
  return row.href ? (
    <Link href={row.href} className="group block h-full">
      {inner}
    </Link>
  ) : (
    <div className="group h-full">{inner}</div>
  );
}
