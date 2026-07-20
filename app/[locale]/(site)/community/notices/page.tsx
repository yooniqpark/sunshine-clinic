import type { Metadata } from "next";
import Link from "next/link";
import { NoticeBoard } from "./NoticeBoard";
import { getSiteContent, type Locale } from "@/lib/site-content";

type Props = { params: Promise<{ locale: Locale }> };

export const metadata: Metadata = {
  title: "공지사항",
  description: "선샤인의원의 휴진·진료 안내 및 병원 소식을 확인하세요.",
};

export type NoticeItem = {
  day: string;
  weekday: string;
  status: "open" | "closed";
  label: string;
};

export type NoticeEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  title: string;
  body: string[];
  items?: NoticeItem[];
};

// 최신 게시글이 위로 오도록 배열 상단이 최신
const NOTICES: NoticeEntry[] = [
  {
    id: "2026-08-15-holiday",
    date: "2026-07-20",
    category: "진료 안내",
    title: "8월 진료 일정 안내 (8/15 정상 · 8/17 휴진)",
    body: [
      "8월 광복절 및 여름 휴진 일정을 안내드립니다. 방문 전 참고 부탁드립니다.",
      "예약 및 문의는 대표번호(02-421-7588) 또는 카카오톡 채널로 연락 주시면 됩니다.",
    ],
    items: [
      { day: "15", weekday: "토", status: "open", label: "정상 진료" },
      { day: "17", weekday: "월", status: "closed", label: "휴진" },
    ],
  },
];

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
        <NoticeBoard notices={NOTICES} />
        <p className="mt-8 rounded-2xl bg-sand/60 px-6 py-4 text-center text-xs leading-relaxed text-ink-soft">
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
