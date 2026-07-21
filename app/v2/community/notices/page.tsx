import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";

const NOTICES = [
  {
    id: 4,
    tag: "OPEN",
    date: "2026.07.15",
    title: "선샤인의원 정식 개원 안내",
    excerpt: "송파구 올림픽로에 선샤인의원이 정식 개원합니다. 개원 기념 상담 이벤트를 함께 진행합니다.",
  },
  {
    id: 3,
    tag: "안내",
    date: "2026.07.10",
    title: "8월 진료 시간 및 휴진 일정",
    excerpt: "8월 광복절(15일)은 휴진이며, 매주 일요일과 공휴일은 정상 휴진합니다.",
  },
  {
    id: 2,
    tag: "안내",
    date: "2026.07.03",
    title: "온라인 사전 상담 예약 서비스 오픈",
    excerpt: "네이버 예약을 통한 온라인 상담 예약을 이용해 주세요. 실시간 확정으로 대기 시간을 줄일 수 있습니다.",
  },
  {
    id: 1,
    tag: "안내",
    date: "2026.06.28",
    title: "카카오톡 채널 상담 서비스 안내",
    excerpt: "카카오톡 채널로도 상담 접수가 가능합니다. 진료 관련 문의는 진료 시간 내 답변드립니다.",
  },
];

export default function NoticesPage() {
  return (
    <>
      <section className="bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            COMMUNITY
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
            공지사항
          </h1>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <ul>
            {NOTICES.map((n, i) => (
              <Reveal key={n.id} delay={i * 30}>
                <li>
                  <Link
                    href="#"
                    className="group grid grid-cols-[80px_1fr_24px] items-start gap-6 border-t border-line py-8 transition hover:border-brand-dark md:grid-cols-[100px_1fr_120px_24px] md:items-center"
                  >
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${
                        n.tag === "OPEN"
                          ? "bg-brand-dark text-cream"
                          : "bg-ink/5 text-ink-soft"
                      }`}
                    >
                      {n.tag}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl transition group-hover:text-brand-dark md:text-2xl">
                        {n.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{n.excerpt}</p>
                    </div>
                    <span className="hidden text-xs tracking-[0.15em] text-ink-soft md:block md:text-right">
                      {n.date}
                    </span>
                    <ArrowUpRightIcon className="hidden h-5 w-5 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-dark md:block" />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
