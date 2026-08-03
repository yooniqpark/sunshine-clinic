import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

// 콘텐츠(장비/이미지) 변경이 즉시 반영되도록 60초 revalidate
export const revalidate = 60;

import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import { getDevicesByCategory, getDeviceImage } from "@/lib/devices";
import type { AppLocale } from "@/i18n/routing";
import { pageSeo, truncateDescription } from "@/lib/seo";

const ABOUT_TITLE: Record<string, string> = {
  ko: "병원 소개",
  en: "About",
  ja: "医院紹介",
  zh: "医院介绍",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.about" });
  return pageSeo({
    locale,
    path: "/about",
    title: ABOUT_TITLE[locale] ?? ABOUT_TITLE.ko,
    description: truncateDescription(t("heroDesc")),
  });
}

const DEVICE_CATEGORIES: {
  slug: "lifting" | "anti-aging" | "whitening" | "acne";
  labelKey: string;
}[] = [
  { slug: "lifting", labelKey: "리프팅" },
  { slug: "anti-aging", labelKey: "안티에이징" },
  { slug: "whitening", labelKey: "화이트닝 · 홍조" },
  { slug: "acne", labelKey: "여드름 · 흉터" },
];

type HistoryItem = { year: string; event: string };
type SpaceItem = { label: string; desc: string };
type ValueItem = { n: string; title: string; body: string };

const SPACE_IMGS = [
  "/clinic/lounge.jpg",
  "/clinic/corridor.jpg",
  "/clinic/vip-corridor.jpg",
  "/clinic/care-room.jpg",
  "/clinic/powder-room.jpg",
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.about");
  const tLoc = await getTranslations("v2.location");
  const history = t.raw("history") as HistoryItem[];
  const spaces = t.raw("spaces") as SpaceItem[];
  const values = t.raw("values") as ValueItem[];

  const flatDevices = DEVICE_CATEGORIES.flatMap((cat) =>
    getDevicesByCategory(locale as AppLocale, cat.slug).map((d) => ({
      slug: d.slug,
      name: d.name,
      category: cat.slug,
      categoryLabel: cat.labelKey,
      image: getDeviceImage(d.slug),
    })),
  );
  // 병원소개 노출 순서: 안티에이징 블록(리쥬란~엘란쎄)을 LDM 바로 앞으로
  const antiAging = flatDevices.filter((d) => d.category === "anti-aging");
  const rest = flatDevices.filter((d) => d.category !== "anti-aging");
  const ldmIdx = rest.findIndex((d) => d.slug === "ldm");
  const merged =
    ldmIdx === -1
      ? flatDevices
      : [...rest.slice(0, ldmIdx), ...antiAging, ...rest.slice(ldmIdx)];
  // 아쿠아필은 LDM 바로 뒤로
  const aqua = merged.filter((d) => d.slug === "aqua-peel");
  const withoutAqua = merged.filter((d) => d.slug !== "aqua-peel");
  const afterLdm = withoutAqua.findIndex((d) => d.slug === "ldm") + 1;
  const allDevices = [
    ...withoutAqua.slice(0, afterLdm),
    ...aqua,
    ...withoutAqua.slice(afterLdm),
  ];

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section id="vision" className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          <Image
            src="/clinic/reception-v2.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-ink/30 to-ink/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-24 lg:px-8 lg:pb-36 lg:pt-32">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {t("heroKicker")}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            {t("heroTitleLine1")}
            <br />
            <span className="text-brand-soft">{t("heroTitleAccent")}</span>
          </h1>
          <p className="mt-10 max-w-2xl whitespace-pre-line text-base leading-relaxed text-cream/75 lg:text-lg">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      {/* ══════ DIRECTOR ══════ */}
      <section id="doctors" className="scroll-mt-24 bg-cream py-24 lg:scroll-mt-32 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
              <Image
                src="/team/kim.jpg"
                alt={t("directorName")}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                {t("directorKicker")}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                {t("directorName")} <span className="text-ink-soft/70">{t("directorTitle")}</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                {t("directorBio")}
              </p>

              <div className="mt-10 border-t border-line pt-8">
                <p className="text-[10px] font-bold tracking-[0.24em] text-ink-soft">
                  {t("historyLabel")}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {history.map((h) => (
                    <li key={h.event} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-dark" />
                      <span className="text-ink-soft">{h.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ PHILOSOPHY ══════ */}
      <section className="border-y border-line bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {t("philosophyKicker")}
            </p>
            {(() => {
              const paras = (t("philosophyBody") as string)
                .split(/\n\n+/)
                .filter(Boolean);
              const [lead, ...rest] = paras;
              return (
                <>
                  <p className="mt-8 whitespace-pre-line font-serif text-2xl leading-[1.55] text-ink lg:text-[28px] lg:leading-[1.5]">
                    {lead}
                  </p>
                  <span aria-hidden className="mt-8 block h-px w-16 bg-brand-dark/50" />
                  <div className="mt-8 space-y-5 text-[15px] leading-[1.95] text-ink/65">
                    {rest.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </>
              );
            })()}
          </Reveal>
        </div>
      </section>

      {/* ══════ SPACE GALLERY ══════ */}
      <section id="tour" className="scroll-mt-24 bg-cream py-24 lg:scroll-mt-32 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                {t("spaceKicker")}
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight lg:text-6xl">
                {t("spaceTitleLead")}
                <br />
                <span className="text-brand-dark">{t("spaceTitleAccent")}</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              {t("spaceDesc")}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {spaces.map((s, i) => (
              <Reveal
                key={SPACE_IMGS[i]}
                delay={i * 60}
                className={
                  i === 0
                    ? "col-span-2 md:col-span-2 md:row-span-2"
                    : ""
                }
              >
                <figure
                  className={`group relative overflow-hidden rounded-3xl bg-ink/5 ${
                    i === 0
                      ? "aspect-[4/5] md:aspect-square"
                      : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={SPACE_IMGS[i]}
                    alt={s.desc}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/65 via-ink/25 to-transparent" />
                  <figcaption className="absolute inset-x-5 bottom-5 text-cream">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-brand-soft">
                      {s.label}
                    </p>
                    <p className="mt-1 font-serif text-lg md:text-xl">{s.desc}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PHILOSOPHY ══════ */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-40">
          <Image src="/clinic/corridor.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/45 to-ink/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            {t("philosophyKicker")}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            {t("philosophyTitleLead")}
            <br />
            <span className="text-brand-soft">{t("philosophyTitleAccent")}</span>
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <Reveal key={v.n}>
                <div className="border-t border-cream/20 pt-8">
                  <p className="font-serif text-3xl text-brand-soft">{v.n}</p>
                  <h3 className="mt-4 font-serif text-xl">{v.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/70">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ DEVICES — 전체 장비 그리드 ══════ */}
      <section id="devices" className="scroll-mt-24 bg-white py-24 lg:scroll-mt-32 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                {t("equipmentKicker")}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                {t("equipmentTitleLead")}
                <br />
                <span className="text-brand-dark">{t("equipmentTitleAccent")}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft lg:text-base">
                {t("equipmentDesc")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {allDevices.map((d, i) => (
              <Reveal key={d.slug} delay={i * 40}>
                <Link
                  href={`/treatments/${d.category}/${d.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-line transition hover:border-brand-dark hover:shadow-md"
                >
                  {d.image && (
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-cover transition group-hover:scale-105"
                    />
                  )}
                  {/* 라벨 — 투명 그라디언트 오버레이, 사진이 카드 전체로 확장 */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-4 py-3 text-cream">
                    {d.slug !== "markview" && (
                      <p className="text-[9px] font-bold tracking-[0.2em] text-cream/75">
                        {d.categoryLabel}
                      </p>
                    )}
                    <p className={`text-sm font-semibold ${d.slug === "markview" ? "" : "mt-1"}`}>{d.name}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight lg:text-6xl">
              {t("ctaTitleLine1")}
              <br />
              {t("ctaTitleLine2Lead")}
              <span className="text-brand-dark">{t("ctaTitleAccent")}</span>
              {t("ctaTitleTail")}
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/treatments/lifting"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition hover:bg-brand-dark"
              >
                {t("ctaTreatments")}
                <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:024217588"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink hover:border-ink"
              >
                02-421-7588
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ LOCATION ══════ */}
      <section id="location" className="scroll-mt-24 border-t border-line bg-white py-24 lg:scroll-mt-32 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-14">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {tLoc("kicker")}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              {tLoc("title")}
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="space-y-6">
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("addressLabel")}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {tLoc("address")}
                  </p>
                </div>
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("hoursLabel")}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-base text-ink-soft">
                    {(tLoc.raw("hoursLines") as string[]).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("phoneLabel")}
                  </p>
                  <a
                    href="tel:024217588"
                    className="mt-3 block font-serif text-2xl text-ink hover:text-brand-dark"
                  >
                    02-421-7588
                  </a>
                </div>
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("directionsLabel")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                    {(tLoc.raw("directions") as string[]).map((d) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-brand-dark">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-line">
                <iframe
                  title={tLoc("mapTitle")}
                  src={`https://www.google.com/maps?q=${encodeURIComponent("서울특별시 송파구 올림픽로 102 서일빌딩")}&z=17&output=embed`}
                  className="block h-[420px] w-full lg:h-[620px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex gap-2 border-t border-line bg-white p-3">
                  <a
                    href="https://map.naver.com/p/search/서울특별시%20송파구%20올림픽로%20102%20서일빌딩"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center rounded-xl bg-sand/70 py-3 text-sm font-semibold text-ink hover:bg-blush"
                  >
                    {tLoc("naverMap")}
                  </a>
                  <a
                    href="https://map.kakao.com/?q=서울특별시%20송파구%20올림픽로%20102%20서일빌딩"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center rounded-xl bg-sand/70 py-3 text-sm font-semibold text-ink hover:bg-blush"
                  >
                    {tLoc("kakaoMap")}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
