import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getSiteContent, type Locale } from "@/lib/site-content";

type Props = { params: Promise<{ locale: Locale }> };

export const metadata: Metadata = {
  title: "공지사항",
  description: "선샤인의원의 휴진·진료 안내 및 병원 소식을 확인하세요.",
};

type NoticeEntry = {
  id: string;
  date: string; // YYYY-MM-DD (게시일)
  title: string;
  body: string[];
  items?: { day: string; weekday: string; status: "open" | "closed"; label: string }[];
  category: "진료 안내" | "휴진 안내" | "공지";
};

const NOTICES: NoticeEntry[] = [
  {
    id: "2026-08-15-holiday",
    date: "2026-07-20",
    category: "진료 안내",
    title: "8월 진료 일정 안내",
    body: [
      "8월 광복절 및 여름 휴진 일정을 안내드립니다. 방문 전 참고 부탁드립니다.",
      "예약 및 문의는 대표번호 또는 카카오톡 채널로 연락 주시면 됩니다.",
    ],
    items: [
      { day: "15", weekday: "토", status: "open", label: "정상 진료" },
      { day: "17", weekday: "월", status: "closed", label: "휴진" },
    ],
  },
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export default async function NoticesPage({ params }: Props) {
  const { locale } = await params;
  const content = getSiteContent(locale);
  const common = content.common;

  return (
    <>
      <section className="border-b border-line bg-sand/40">
        <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href={`/${locale}`} className="transition hover:text-brand">
              {common.home}
            </Link>
            <span>/</span>
            <span className="text-ink">공지사항</span>
          </nav>
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-brand">NOTICES</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            공지사항
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
            휴진·진료 시간 변경 등 병원 소식을 안내해 드립니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="space-y-6">
          {NOTICES.map((n, i) => (
            <Reveal key={n.id} delay={i * 80}>
              <article className="overflow-hidden rounded-3xl border border-line bg-white">
                <div className="flex items-center justify-between border-b border-line bg-sand/30 px-6 py-3 sm:px-8">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand-dark">
                    {n.category}
                  </span>
                  <span className="text-xs text-ink-soft">{formatDate(n.date)}</span>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {n.title}
                  </h2>

                  <div className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {n.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>

                  {n.items && n.items.length > 0 && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {n.items.map((it) => (
                        <div
                          key={it.day}
                          className="flex items-center gap-4 rounded-2xl border border-line bg-sand/40 p-4"
                        >
                          <div
                            className={
                              it.status === "closed"
                                ? "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-cream"
                                : "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand/15 text-brand-dark"
                            }
                          >
                            <span className="text-2xl font-bold leading-none">{it.day}</span>
                          </div>
                          <div>
                            <p className="text-[11px] font-medium tracking-wide text-ink-soft">
                              2026년 8월
                            </p>
                            <p className="mt-1 text-base font-semibold text-ink">
                              {it.day}일 ({it.weekday}){" "}
                              <span
                                className={
                                  it.status === "closed"
                                    ? "ml-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600"
                                    : "ml-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-dark"
                                }
                              >
                                {it.label}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-sand/60 px-6 py-4 text-center text-xs leading-relaxed text-ink-soft">
          문의는{" "}
          <a href="tel:024217588" className="font-semibold text-brand hover:underline">
            02-421-7588
          </a>{" "}
          또는 카카오톡 채널로 연락해 주세요.
        </p>
      </section>
    </>
  );
}
