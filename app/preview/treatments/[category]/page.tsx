import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import { getDevicesByCategory, getDeviceImage, getDeviceMarketing, type DeviceDetail } from "@/lib/devices";

type CategoryMeta = {
  slug: string;
  label: string;
  kicker: string;
  hero: string;
  intro: string;
  image: string;
  hasDevices: boolean;
  process: { step: string; title: string; body: string }[];
  fallbackItems?: { name: string; desc: string; duration?: string }[];
};

const CATEGORIES: Record<string, CategoryMeta> = {
  lifting: {
    slug: "lifting",
    label: "리프팅",
    kicker: "LIFTING",
    hero: "결을 다시,\n라인은 선명하게.",
    intro: "얼굴의 처짐과 볼륨 저하를 다층적으로 접근합니다. 시술 조합·강도는 피부 결과 조직 상태에 맞춰 맞춤 설계합니다.",
    image: "/models/lifting.png",
    hasDevices: true,
    process: [
      { step: "01", title: "정밀 상담", body: "얼굴 3D 분석과 피부 결·볼륨 진단을 바탕으로 조합을 설계합니다." },
      { step: "02", title: "맞춤 프로토콜", body: "울쎄라 · 슈링크 · 실 리프팅 등을 조합하여 한 세션에 진행합니다." },
      { step: "03", title: "회복 케어", body: "시술 직후 진정 관리와 홈케어 가이드를 함께 제공합니다." },
    ],
  },
  "anti-aging": {
    slug: "anti-aging",
    label: "안티에이징",
    kicker: "ANTI-AGING",
    hero: "시간은 흘러도,\n결은 자라난다.",
    intro: "잔주름 · 볼륨 · 결 세 가지 축을 함께 관리합니다. 자연스러운 나이 듦을 지지하는 관리 지향의 프로토콜을 제안합니다.",
    image: "/models/anti-aging.jpg",
    hasDevices: false,
    process: [
      { step: "01", title: "노화 진단", body: "잔주름·볼륨·탄력·결을 정밀하게 진단합니다." },
      { step: "02", title: "레이어링 시술", body: "톡신·필러·스킨부스터를 조합해 자연스러운 결과를 만듭니다." },
      { step: "03", title: "장기 플랜", body: "3~6개월 단위의 관리 캘린더를 함께 설계합니다." },
    ],
    fallbackItems: [
      { name: "보톡스", desc: "표정 주름 완화, 근육 라인 정돈" },
      { name: "필러", desc: "볼륨 회복 및 윤곽 보정 (히알루론산)" },
      { name: "스킨보톡스", desc: "얕은 표피에 마이크로 도포로 결·모공 관리" },
      { name: "쥬베룩", desc: "PDLLA 콜라겐 부스터, 결 개선" },
      { name: "리쥬란", desc: "PN 성분으로 피부 재생·탄력 회복" },
    ],
  },
  whitening: {
    slug: "whitening",
    label: "화이트닝 · 홍조",
    kicker: "TONE",
    hero: "톤은 맑게,\n결은 균일하게.",
    intro: "색소침착과 홍조를 원인부터 분석해 접근합니다. 계절과 피부 회복력을 고려한 프로토콜을 제공합니다.",
    image: "/models/whitening.png",
    hasDevices: true,
    process: [
      { step: "01", title: "색소 진단", body: "표피성·진피성·혈관성 요인을 정확히 분류합니다." },
      { step: "02", title: "타겟팅 시술", body: "파장과 강도를 각 병변에 맞춰 세분화합니다." },
      { step: "03", title: "재발 관리", body: "자외선 차단·홈케어 병행으로 재발을 최소화합니다." },
    ],
  },
  acne: {
    slug: "acne",
    label: "여드름 · 흉터",
    kicker: "ACNE & SCAR",
    hero: "피부의 흔적,\n결로 회복시키다.",
    intro: "여드름의 원인과 진행 단계를 파악해 진정·재생·흉터 관리로 이어지는 통합 프로토콜을 제공합니다.",
    image: "/models/acne.png",
    hasDevices: true,
    process: [
      { step: "01", title: "단계 분류", body: "염증성·비염증성·흉터 단계별로 접근을 나눕니다." },
      { step: "02", title: "복합 관리", body: "약물 처방과 시술을 병행하여 재발을 낮춥니다." },
      { step: "03", title: "흉터 회복", body: "잔여 흉터는 프락셔널·니들 RF로 장기 케어합니다." },
    ],
  },
  "skin-disease": {
    slug: "skin-disease",
    label: "피부질환",
    kicker: "MEDICAL DERMATOLOGY",
    hero: "정확한 진단,\n정직한 치료.",
    intro: "피부과 전문의로서 흔한 피부 질환부터 만성 질환까지, 근거 기반의 진료를 제공합니다.",
    image: "/models/skin-disease.png",
    hasDevices: false,
    process: [
      { step: "01", title: "정확한 진단", body: "필요 시 KOH·조직검사 등으로 원인을 확인합니다." },
      { step: "02", title: "근거 기반 치료", body: "가이드라인에 따라 국소·전신·시술을 조합합니다." },
      { step: "03", title: "지속 관찰", body: "만성 질환은 장기 팔로업으로 재발을 관리합니다." },
    ],
    fallbackItems: [
      { name: "아토피 · 습진", desc: "만성 관리 및 국소·전신 치료" },
      { name: "건선", desc: "국소·광선치료·전신 요법" },
      { name: "탈모", desc: "메조테라피 · 두피 진단 · 약물치료" },
      { name: "사마귀 · 티눈", desc: "냉동요법 · 레이저 · 약물치료" },
      { name: "무좀 · 손발톱 진균증", desc: "정밀 검사와 장기 치료" },
    ],
  },
};

const ALL = Object.values(CATEGORIES);

export function generateStaticParams() {
  return ALL.map((c) => ({ category: c.slug }));
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = CATEGORIES[category];
  if (!data) notFound();

  const devices = data.hasDevices ? getDevicesByCategory("ko", data.slug) : [];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-25">
          <Image src={data.image} alt="" fill className="object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-[11px] tracking-[0.15em] text-cream/50">
            <Link href="/preview" className="hover:text-cream">HOME</Link>
            <span>/</span>
            <span className="text-cream/80">TREATMENTS</span>
          </nav>
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {data.kicker}
          </p>
          <h1 className="mt-6 whitespace-pre-line font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            {data.hero}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 lg:text-lg">
            {data.intro}
          </p>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div className="sticky top-24 z-40 border-b border-line bg-cream/90 backdrop-blur lg:top-28">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 lg:px-8">
          {ALL.map((c) => (
            <Link
              key={c.slug}
              href={`/preview/treatments/${c.slug}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                c.slug === data.slug
                  ? "bg-ink text-cream"
                  : "text-ink-soft hover:bg-ink/5"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* DEVICES (rich) or ITEMS (simple fallback) */}
      {devices.length > 0 ? (
        <DeviceSections devices={devices} />
      ) : data.fallbackItems ? (
        <SimpleItemList label={data.label} items={data.fallbackItems} />
      ) : null}

      {/* PROCESS */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">PROCESS</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">진행 방식</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {data.process.map((p) => (
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
            {data.label} 상담을 <em className="italic text-brand-dark">예약</em>하세요.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/preview#book"
              className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
            >
              온라인 상담 예약
            </Link>
            <a
              href="tel:024217588"
              className="rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink hover:border-ink"
            >
              02-421-7588
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function DeviceSections({ devices }: { devices: DeviceDetail[] }) {
  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">DEVICES</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
          하이엔드 장비
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft lg:text-base">
          진단과 개인의 피부 상태에 따라 아래 장비들을 조합해 최적의 프로토콜을 설계합니다.
        </p>

        <div className="mt-20 space-y-24 lg:space-y-32">
          {devices.map((d, i) => (
            <DeviceCard key={d.slug} device={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceCard({ device, index }: { device: DeviceDetail; index: number }) {
  const img = getDeviceImage(device.slug);
  const meta = getDeviceMarketing(device.slug);
  const reversed = index % 2 === 1;
  const detailHref = `/preview/treatments/${device.category}/${device.slug}`;

  return (
    <Reveal>
      <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image side — click to detail */}
        <Link
          href={detailHref}
          className={`group relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5 ${reversed ? "lg:order-2" : ""}`}
        >
          {img && (
            <Image
              src={img}
              alt={device.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          )}
          {meta && (
            <div className="absolute bottom-6 left-6 rounded-full bg-cream/90 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-ink backdrop-blur">
              {meta.englishName}
            </div>
          )}
          <div className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-ink text-cream opacity-0 transition group-hover:opacity-100">
            <ArrowUpRightIcon className="h-5 w-5" />
          </div>
        </Link>

        {/* Content side */}
        <div className={reversed ? "lg:order-1" : ""}>
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
            {device.manufacturer}
          </p>
          <h3 className="mt-3 font-serif text-3xl leading-tight lg:text-4xl">{device.name}</h3>
          <p className="mt-2 text-sm italic text-ink-soft">{device.tagline}</p>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft lg:text-base">
            {device.intro}
          </p>

          {device.highlightStat && (
            <div className="mt-8 inline-flex items-baseline gap-3 border-l-2 border-brand pl-4">
              <span className="font-serif text-4xl text-ink">{device.highlightStat.value}</span>
              <span className="text-xs tracking-[0.15em] text-ink-soft">
                {device.highlightStat.label}
              </span>
            </div>
          )}

          {/* Feature keywords */}
          {meta && (
            <div className="mt-8 flex flex-wrap gap-2">
              {meta.featureKeywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-line px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-ink-soft"
                >
                  {k}
                </span>
              ))}
            </div>
          )}

          {/* Features grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {device.features.slice(0, 4).map((f) => (
              <div key={f.title}>
                <h4 className="font-serif text-base text-ink">{f.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>

          {/* How + Recommended */}
          <div className="mt-10 space-y-6 border-t border-line pt-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] text-ink-soft">HOW IT WORKS</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{device.howItWorks}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] text-ink-soft">RECOMMENDED FOR</p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {device.recommendedFor.map((r) => (
                  <li key={r} className="flex gap-2 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-brand">
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detail link */}
          <Link
            href={detailHref}
            className="group mt-10 inline-flex items-center gap-3 border-b border-ink/30 pb-2 text-sm font-semibold text-ink transition hover:border-brand-dark hover:text-brand-dark"
          >
            상세 페이지 보기
            <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function SimpleItemList({
  label,
  items,
}: {
  label: string;
  items: { name: string; desc: string; duration?: string }[];
}) {
  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">MENU</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
          {label} 시술
        </h2>
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 40}>
              <div className="group flex items-start justify-between gap-6 border-t border-line py-8 transition hover:border-brand-dark">
                <div>
                  <h3 className="font-serif text-2xl">{item.name}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{item.desc}</p>
                  {item.duration && (
                    <p className="mt-3 text-[11px] tracking-[0.2em] text-ink-soft/70">
                      DURATION · {item.duration}
                    </p>
                  )}
                </div>
                <ArrowUpRightIcon className="mt-2 h-5 w-5 shrink-0 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-dark" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
