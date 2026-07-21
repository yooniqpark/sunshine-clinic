import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";

const HISTORY = [
  { year: "2010", event: "가톨릭대학교 의과대학 졸업" },
  { year: "2015", event: "가톨릭대학교 서울성모병원 피부과 전문의 취득" },
  { year: "2016", event: "대한피부과학회 정회원" },
  { year: "2018", event: "대한미용성형레이저의학회 정회원" },
  { year: "2020", event: "국제모발이식학회 (ISHRS) 정회원" },
  { year: "2026", event: "선샤인의원 개원 · 대표원장" },
];

const VALUES = [
  {
    n: "01",
    title: "정직한 진료",
    body: "필요하지 않은 시술은 권하지 않습니다. 피부 상태와 라이프 사이클에 맞춘 최소 개입을 우선합니다.",
  },
  {
    n: "02",
    title: "섬세한 손길",
    body: "10년 이상의 임상 경험을 바탕으로 결·톤·라인을 하나씩 다듬는 밀도 있는 진료를 제공합니다.",
  },
  {
    n: "03",
    title: "프리미엄 장비",
    body: "국내 상위권 하이엔드 장비를 도입해 회복이 빠르고 편안한 시술 환경을 만듭니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            ABOUT SUNSHINE
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            결을 다듬고,
            <br />
            <em className="italic text-brand-soft">일상을 밝히다.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 lg:text-lg">
            선샤인의원은 대학병원에서 오랜 임상 경험을 쌓은 피부과 전문의가 직접 진료하는 로컬 클리닉입니다.
            유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을 지향합니다.
          </p>
        </div>
      </section>

      {/* DIRECTOR */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
              <Image
                src="/team/kim.jpg"
                alt="김병현 대표원장"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                DIRECTOR
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                김병현 <span className="text-ink-soft/70">대표원장</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                가톨릭대학교 서울성모병원 피부과 전문의로서 15년 이상 다양한 피부 케이스를 진료해 왔습니다.
                유행을 좇지 않고, 각자의 톤과 결을 존중한 진료 계획을 세워 드립니다.
              </p>

              <div className="mt-10 border-t border-line pt-8">
                <p className="text-[10px] font-bold tracking-[0.24em] text-ink-soft">
                  HISTORY
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {HISTORY.map((h) => (
                    <li key={h.year} className="grid grid-cols-[64px_1fr] gap-4">
                      <span className="font-serif text-base text-brand-dark">
                        {h.year}
                      </span>
                      <span className="text-ink-soft">{h.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            PHILOSOPHY
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            서두르지 않고,
            <br />
            <em className="italic text-brand-soft">오래가는 결과.</em>
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {VALUES.map((v) => (
              <Reveal key={v.n}>
                <div className="border-t border-cream/15 pt-8">
                  <p className="font-serif text-3xl text-brand-soft">{v.n}</p>
                  <h3 className="mt-4 font-serif text-xl">{v.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/65">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight lg:text-6xl">
              첫 상담,
              <br />
              가장 가까운 <em className="italic text-brand-dark">시작</em>입니다.
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/preview/treatments/lifting"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition hover:bg-brand-dark"
              >
                시술 알아보기
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
    </>
  );
}
