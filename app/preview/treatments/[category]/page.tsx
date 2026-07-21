import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";

type Category = {
  slug: string;
  label: string;
  kicker: string;
  hero: string;
  intro: string;
  image: string;
  items: { name: string; desc: string; duration?: string }[];
  process: { step: string; title: string; body: string }[];
};

const CATEGORIES: Record<string, Category> = {
  lifting: {
    slug: "lifting",
    label: "리프팅",
    kicker: "LIFTING",
    hero: "결을 다시,\n라인은 선명하게.",
    intro:
      "얼굴의 처짐과 볼륨 저하를 다층적으로 접근합니다. 시술 조합·강도는 피부 결과 조직 상태에 맞춰 맞춤 설계합니다.",
    image: "/models/lifting.png",
    items: [
      { name: "울쎄라", desc: "SMAS 층까지 도달하는 고강도 초음파 리프팅", duration: "45~60분" },
      { name: "슈링크 유니버스", desc: "MP·MF 듀얼 카트리지로 리프팅 + 탄력", duration: "40~60분" },
      { name: "덴서티", desc: "모노폴라 RF 리프팅, 다운타임 최소화", duration: "40분" },
      { name: "인모드 FX", desc: "고주파 + 진공 리프팅으로 윤곽 정리", duration: "30~45분" },
      { name: "실 리프팅", desc: "PDO·PLLA 실로 즉각적 리프팅과 콜라겐 자극", duration: "60~90분" },
    ],
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
    intro:
      "잔주름 · 볼륨 · 결 세 가지 축을 함께 관리합니다. 자연스러운 나이 듦을 지지하는 관리 지향의 프로토콜을 제안합니다.",
    image: "/models/anti-aging.jpg",
    items: [
      { name: "보톡스", desc: "표정 주름 완화, 근육 라인 정돈" },
      { name: "필러", desc: "볼륨 회복 및 윤곽 보정 (히알루론산)" },
      { name: "스킨보톡스", desc: "얕은 표피에 마이크로 도포로 결·모공 관리" },
      { name: "쥬베룩", desc: "PDLLA 콜라겐 부스터, 결 개선" },
      { name: "리쥬란", desc: "PN 성분으로 피부 재생·탄력 회복" },
    ],
    process: [
      { step: "01", title: "노화 진단", body: "잔주름·볼륨·탄력·결을 정밀하게 진단합니다." },
      { step: "02", title: "레이어링 시술", body: "톡신·필러·스킨부스터를 조합해 자연스러운 결과를 만듭니다." },
      { step: "03", title: "장기 플랜", body: "3~6개월 단위의 관리 캘린더를 함께 설계합니다." },
    ],
  },
  whitening: {
    slug: "whitening",
    label: "화이트닝 · 홍조",
    kicker: "TONE",
    hero: "톤은 맑게,\n결은 균일하게.",
    intro: "색소침착과 홍조를 원인부터 분석해 접근합니다. 계절과 피부 회복력을 고려한 프로토콜을 제공합니다.",
    image: "/models/whitening.png",
    items: [
      { name: "피코 레이저", desc: "색소·잡티·기미 등 다양한 색소성 병변" },
      { name: "브이빔 퍼펙타", desc: "혈관성 병변 · 홍조 · 딸기코 관리" },
      { name: "IPL 레이저", desc: "톤 · 잡티 · 홍조 복합 관리" },
      { name: "제네시스", desc: "롱펄스 야그로 결·모공·홍조 완화" },
    ],
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
    intro:
      "여드름의 원인과 진행 단계를 파악해 진정·재생·흉터 관리로 이어지는 통합 프로토콜을 제공합니다.",
    image: "/models/acne.png",
    items: [
      { name: "여드름 압출·주사", desc: "화농성 병변의 즉각 관리" },
      { name: "PDT (광역동)", desc: "피지선을 타겟팅한 여드름 관리" },
      { name: "프락셀 (프락셔널)", desc: "여드름 흉터·모공 재생" },
      { name: "인피니 하이브리드", desc: "니들 RF로 흉터·리프팅 동시 관리" },
      { name: "TCA CROSS", desc: "얼음송곳형 흉터 개별 관리" },
    ],
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
    intro:
      "피부과 전문의로서 흔한 피부 질환부터 만성 질환까지, 근거 기반의 진료를 제공합니다.",
    image: "/models/skin-disease.png",
    items: [
      { name: "아토피 · 습진", desc: "만성 관리 및 국소·전신 치료" },
      { name: "건선", desc: "국소·광선치료·전신 요법" },
      { name: "탈모", desc: "메조테라피 · 두피 진단 · 약물치료" },
      { name: "사마귀 · 티눈", desc: "냉동요법 · 레이저 · 약물치료" },
      { name: "무좀 · 손발톱 진균증", desc: "정밀 검사와 장기 치료" },
    ],
    process: [
      { step: "01", title: "정확한 진단", body: "필요 시 KOH·조직검사 등으로 원인을 확인합니다." },
      { step: "02", title: "근거 기반 치료", body: "가이드라인에 따라 국소·전신·시술을 조합합니다." },
      { step: "03", title: "지속 관찰", body: "만성 질환은 장기 팔로업으로 재발을 관리합니다." },
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

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image src={data.image} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            TREATMENT · {data.kicker}
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

      {/* ITEMS */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">MENU</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
            {data.label} 시술
          </h2>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {data.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 40}>
                <div className="group flex items-start justify-between gap-6 border-t border-line py-8 transition hover:border-brand-dark">
                  <div>
                    <h3 className="font-serif text-2xl">{item.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                      {item.desc}
                    </p>
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

      {/* PROCESS */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">PROCESS</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
            진행 방식
          </h2>

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
