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
      {/* HERO — dark editorial */}
      <section className="relative bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-cream/50">
            <Link href={`/${locale}`} className="hover:text-cream">
              {common.home?.toUpperCase() ?? "HOME"}
            </Link>
            <span>/</span>
            <span className="text-cream/80">COMMUNITY</span>
          </nav>
          <p className="mt-6 text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            NOTICES
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
            공지사항
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/60 lg:text-base">
            휴진·진료 시간 변경 등 병원 소식을 안내해 드립니다.
          </p>
        </div>
      </section>

      {/* LIST */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <NoticeBoard notices={NOTICES} />

          <p className="mt-12 text-center text-xs leading-relaxed text-ink-soft">
            문의는{" "}
            <a href="tel:024217588" className="font-semibold text-brand-dark hover:underline">
              02-421-7588
            </a>{" "}
            또는 카카오톡 채널로 연락해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
