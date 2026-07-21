import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const EVENTS = [
  {
    tag: "OPEN",
    title: "선샤인의원 개원 기념 상담 이벤트",
    period: "2026.07.15 ~ 2026.08.31",
    body: "정식 개원을 기념하여 방문 상담 시 피부 진단 서비스를 무료로 제공합니다.",
  },
  {
    tag: "이벤트",
    title: "여름 톤 케어 프로모션",
    period: "2026.07.20 ~ 2026.08.31",
    body: "여름철 색소·홍조 관리를 위한 톤업 프로그램을 특별가로 만나 보세요.",
  },
  {
    tag: "안내",
    title: "홈케어 화장품 리커버 가이드",
    period: "상시",
    body: "시술 후 회복을 돕는 홈케어 제품 가이드를 진료실에서 안내해 드립니다.",
  },
];

export default function EventsPage() {
  return (
    <>
      <section className="bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            COMMUNITY
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
            이벤트
          </h1>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          {EVENTS.map((e, i) => (
            <Reveal key={e.title} delay={i * 60}>
              <article className="group flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:border-brand-dark hover:shadow-lg">
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${
                      e.tag === "OPEN"
                        ? "bg-brand-dark text-cream"
                        : "bg-ink/5 text-ink-soft"
                    }`}
                  >
                    {e.tag}
                  </span>
                  <h3 className="mt-5 font-serif text-2xl leading-tight lg:text-3xl">
                    {e.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{e.body}</p>
                </div>
                <div className="mt-8 border-t border-line pt-5 text-xs tracking-[0.15em] text-ink-soft">
                  기간 · {e.period}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/preview#book"
            className="inline-flex rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
          >
            상담 예약하기
          </Link>
        </div>
      </section>
    </>
  );
}
