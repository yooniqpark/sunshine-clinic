import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon, ArrowIcon } from "@/components/icons";
import {
  getDevicesByCategory,
  getDeviceImage,
  getDeviceMarketing,
} from "@/lib/devices";
import koData from "@/content/devices-ko.json";
import type { DeviceDetail } from "@/lib/devices";

const ALL_DEVICES = koData as Record<string, DeviceDetail>;

const CATEGORY_LABELS: Record<string, string> = {
  lifting: "리프팅",
  "anti-aging": "안티에이징",
  whitening: "화이트닝 · 홍조",
  acne: "여드름 · 흉터",
  "skin-disease": "피부질환",
};

const DEFAULT_PROCESS = [
  {
    step: "01",
    title: "정밀 상담",
    body: "피부 결·톤·볼륨 등 상태를 진단하고 라이프 사이클에 맞춘 시술 강도를 설계합니다.",
  },
  {
    step: "02",
    title: "맞춤 시술",
    body: "표면 마취 후, 개인의 피부 두께와 반응에 맞춰 카트리지·에너지·샷 수를 조절해 진행합니다.",
  },
  {
    step: "03",
    title: "회복 케어",
    body: "시술 직후 진정 관리와 홈케어 가이드를 제공하고, 필요 시 재진 스케줄을 함께 설계합니다.",
  },
];

export function generateStaticParams() {
  return Object.values(ALL_DEVICES)
    .filter((d) => d.category in CATEGORY_LABELS)
    .map((d) => ({ category: d.category, device: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; device: string }>;
}) {
  const { device } = await params;
  const d = ALL_DEVICES[device];
  if (!d) return {};
  return {
    title: `${d.name} — Preview`,
    robots: { index: false, follow: false },
  };
}

export default async function DevicePage({
  params,
}: {
  params: Promise<{ category: string; device: string }>;
}) {
  const { category, device } = await params;
  const d = ALL_DEVICES[device];
  if (!d || d.category !== category) notFound();

  const catLabel = CATEGORY_LABELS[category] ?? category;
  const img = getDeviceImage(d.slug);
  const meta = getDeviceMarketing(d.slug);
  const siblings = getDevicesByCategory("ko", category).filter((x) => x.slug !== d.slug);

  return (
    <>
      {/* ══════ HERO — spacious editorial ══════ */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          {img && (
            <Image
              src={img}
              alt=""
              fill
              priority
              className="object-cover object-center opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/60 to-ink" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-32 pt-24 lg:px-8 lg:pb-40 lg:pt-32">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.15em] text-cream/40">
            <Link href="/preview" className="hover:text-cream">HOME</Link>
            <span>/</span>
            <Link href={`/preview/treatments/${category}`} className="hover:text-cream">
              {catLabel.toUpperCase()}
            </Link>
            <span>/</span>
            <span className="text-cream/70">{d.name}</span>
          </nav>

          {meta && (
            <p className="mt-16 text-[11px] font-bold tracking-[0.4em] text-brand-soft">
              {meta.englishName}
            </p>
          )}
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6.5rem)] font-normal leading-[1.02] tracking-tight">
            {d.name}
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-lg italic leading-relaxed text-cream/75 lg:text-2xl">
            &ldquo;{d.tagline}&rdquo;
          </p>
          <p className="mt-12 text-[10px] tracking-[0.3em] text-cream/40">
            BY {d.manufacturer.toUpperCase()}
          </p>
        </div>
      </section>

      {/* ══════ INTRO — huge serif quote ══════ */}
      <section className="bg-cream py-32 lg:py-44">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.35em] text-brand-dark">
              INTRODUCTION
            </p>
            <p className="mt-12 font-serif text-2xl leading-[1.5] text-ink lg:text-[32px] lg:leading-[1.45]">
              {d.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════ HIGHLIGHT STAT + TECH TAGS ══════ */}
      <section className="border-y border-line bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-ink-soft">
              CORE SPEC
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
              TECHNOLOGY
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {d.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
                >
                  {t}
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

      {/* ══════ FEATURES — 2-col spacious ══════ */}
      <section className="bg-cream py-32 lg:py-40">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
            FEATURES
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight lg:text-6xl">
            {d.name}만의 <em className="italic text-brand-dark">차별점</em>
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

      {/* ══════ HOW IT WORKS — dark, cinematic ══════ */}
      <section className="relative overflow-hidden bg-ink py-32 text-cream lg:py-44">
        {img && (
          <div className="absolute inset-0 opacity-10">
            <Image src={img} alt="" fill className="object-cover" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            HOW IT WORKS
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
            작동 원리
          </h2>
          <p className="mt-12 font-serif text-xl leading-[1.6] text-cream/80 lg:text-2xl lg:leading-[1.55]">
            {d.howItWorks}
          </p>
        </div>
      </section>

      {/* ══════ RECOMMENDED FOR — editorial list ══════ */}
      <section className="bg-cream py-32 lg:py-40">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              RECOMMENDED FOR
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              이런 분께
              <br />
              <em className="italic text-brand-dark">권해드립니다.</em>
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

      {/* ══════ PROCESS — the requested 3-step ══════ */}
      <section className="bg-ink py-32 text-cream lg:py-44">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            PROCESS
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            상담부터 회복까지,
            <br />
            <em className="italic text-brand-soft">한 흐름으로.</em>
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
            {DEFAULT_PROCESS.map((p) => (
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

      {/* ══════ FAQ ══════ */}
      {d.faq.length > 0 && (
        <section className="bg-cream py-32 lg:py-40">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">FAQ</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              자주 묻는 질문
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

      {/* ══════ CTA — bold ══════ */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight lg:text-6xl">
              {d.name}
              <br />
              <em className="italic text-brand-soft">상담 예약</em>하기
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/preview#book"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-soft"
              >
                온라인 상담 예약
                <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:024217588"
                className="rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold text-cream hover:border-cream"
              >
                02-421-7588
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ SIBLINGS — other devices in same category ══════ */}
      {siblings.length > 0 && (
        <section className="bg-cream py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                  MORE IN {catLabel.toUpperCase()}
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight lg:text-4xl">
                  같은 카테고리
                </h2>
              </div>
              <Link
                href={`/preview/treatments/${category}`}
                className="hidden items-center gap-1 text-xs font-semibold text-ink-soft hover:text-brand-dark md:inline-flex"
              >
                전체 보기 <ArrowIcon className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {siblings.slice(0, 3).map((s) => {
                const sImg = getDeviceImage(s.slug);
                return (
                  <Link
                    key={s.slug}
                    href={`/preview/treatments/${category}/${s.slug}`}
                    className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5"
                  >
                    {sImg && (
                      <Image
                        src={sImg}
                        alt={s.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute inset-x-6 bottom-6 text-cream">
                      <h3 className="font-serif text-2xl leading-tight">{s.name}</h3>
                      <p className="mt-2 line-clamp-2 text-xs text-cream/70">{s.tagline}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-brand-soft">
                        VIEW <ArrowUpRightIcon className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
