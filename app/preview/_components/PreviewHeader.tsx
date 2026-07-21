"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";

type SubItem = { label: string; href: string; sub?: string };
type Column = { title: string; href?: string; items: SubItem[] };
type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; href: string; children: Column[] };

const NAV: NavItem[] = [
  { label: "병원 소개", href: "/preview/about" },
  {
    label: "시술",
    href: "/preview/treatments/lifting",
    children: [
      {
        title: "리프팅",
        href: "/preview/treatments/lifting",
        items: [
          { label: "울쎄라 프라임", sub: "ULTHERA PRIME", href: "/preview/treatments/lifting/ulthera-prime" },
          { label: "써마지 FLX", sub: "THERMAGE FLX", href: "/preview/treatments/lifting/thermage-flx" },
          { label: "슈링크 유니버스", sub: "SHRINK UNIVERSE", href: "/preview/treatments/lifting/shurink-universe" },
          { label: "인모드", sub: "INMODE", href: "/preview/treatments/lifting/inmode" },
          { label: "엘란쎄", sub: "ELLANSÉ", href: "/preview/treatments/lifting/ellanse" },
        ],
      },
      {
        title: "안티에이징",
        href: "/preview/treatments/anti-aging",
        items: [
          { label: "보톡스", href: "/preview/treatments/anti-aging" },
          { label: "필러", href: "/preview/treatments/anti-aging" },
          { label: "스킨보톡스", href: "/preview/treatments/anti-aging" },
          { label: "쥬베룩", href: "/preview/treatments/anti-aging" },
          { label: "리쥬란", href: "/preview/treatments/anti-aging" },
        ],
      },
      {
        title: "화이트닝 · 홍조",
        href: "/preview/treatments/whitening",
        items: [
          { label: "클라리티 II", sub: "CLARITY II", href: "/preview/treatments/whitening/clarity-ii" },
          { label: "스타워커", sub: "STARWALKER", href: "/preview/treatments/whitening/fotona-starwalker" },
          { label: "브이빔", sub: "VBEAM", href: "/preview/treatments/whitening/vbeam" },
          { label: "시크릿 RF", sub: "SECRET RF", href: "/preview/treatments/whitening/secret-rf" },
        ],
      },
      {
        title: "여드름 · 흉터",
        href: "/preview/treatments/acne",
        items: [
          { label: "카프리 CO2", sub: "CARPRI CO2", href: "/preview/treatments/acne/carpri-co2" },
          { label: "골드 PTT", sub: "GOLD PTT", href: "/preview/treatments/acne/gold-ptt" },
          { label: "큐라젯", sub: "CUREJET", href: "/preview/treatments/acne/curajet" },
        ],
      },
      {
        title: "피부질환",
        href: "/preview/treatments/skin-disease",
        items: [
          { label: "아토피 · 습진", href: "/preview/treatments/skin-disease" },
          { label: "건선", href: "/preview/treatments/skin-disease" },
          { label: "탈모", href: "/preview/treatments/skin-disease" },
          { label: "사마귀 · 티눈", href: "/preview/treatments/skin-disease" },
          { label: "무좀 · 손발톱 진균증", href: "/preview/treatments/skin-disease" },
        ],
      },
    ],
  },
  {
    label: "커뮤니티",
    href: "/preview/community/notices",
    children: [
      {
        title: "커뮤니티",
        items: [
          { label: "공지사항", href: "/preview/community/notices" },
          { label: "이벤트", href: "/preview/community/events" },
          { label: "비급여 수가표", href: "/preview/community/prices" },
        ],
      },
    ],
  },
];

export function PreviewHeader() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-8 z-50 border-b border-line/60 bg-cream/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
        <Link
          href="/preview"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3"
        >
          <Image
            src="/logo-mark.svg"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 -translate-y-[3px] object-contain lg:h-10 lg:w-10"
          />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[15px] font-normal tracking-tight text-ink lg:text-base">
              선샤인의원
            </span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-ink-soft/80">
              Dermatology Clinic
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:text-brand-dark"
              >
                {item.label}
                {item.children && <ChevronDownIcon className="h-3 w-3" />}
              </Link>
            </div>
          ))}
          <Link
            href="/preview#book"
            className="ml-3 rounded-full bg-ink px-5 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark"
          >
            상담 예약
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop mega panel — full-width bar */}
      {NAV.map((item) =>
        item.children ? (
          <div
            key={item.label}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
            className={`absolute left-0 right-0 top-full hidden overflow-hidden border-t border-line bg-white/98 shadow-xl shadow-ink/10 backdrop-blur transition-all duration-200 lg:block ${
              hovered === item.label
                ? "visible max-h-[600px] opacity-100"
                : "invisible max-h-0 opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-8 py-10 md:grid-cols-3 lg:grid-cols-5">
              {item.children.map((col) => (
                <div key={col.title}>
                  {col.href ? (
                    <Link
                      href={col.href}
                      onClick={() => setHovered(null)}
                      className="mb-4 flex items-center justify-between border-b border-line pb-2 text-[11px] font-bold tracking-[0.2em] text-brand-dark transition hover:text-ink"
                    >
                      <span>{col.title.toUpperCase()}</span>
                      <span className="text-ink-soft/60 transition group-hover:translate-x-0.5">→</span>
                    </Link>
                  ) : (
                    <p className="mb-4 border-b border-line pb-2 text-[10px] font-bold tracking-[0.2em] text-brand-dark">
                      {col.title.toUpperCase()}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {col.items.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setHovered(null)}
                          className="group block rounded-xl px-3 py-2 transition hover:bg-brand/10"
                        >
                          <span className="block text-sm font-medium text-ink transition group-hover:text-brand-dark">
                            {c.label}
                          </span>
                          {c.sub && (
                            <span className="mt-0.5 block text-[10px] tracking-[0.15em] text-ink-soft">
                              {c.sub}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-line bg-cream lg:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-3">
            {NAV.map((item) => (
              <div key={item.label} className="py-1">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileOpen((v) => (v === item.label ? null : item.label))
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand/5"
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={`h-3 w-3 transition ${
                          mobileOpen === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileOpen === item.label && (
                      <div className="ml-3 mt-1 space-y-4 border-l border-line pl-3 pb-3">
                        {item.children.map((col) => (
                          <div key={col.title}>
                            {col.href ? (
                              <Link
                                href={col.href}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileOpen(null);
                                }}
                                className="mb-2 block px-2 text-[11px] font-bold tracking-[0.2em] text-brand-dark hover:text-ink"
                              >
                                {col.title.toUpperCase()} →
                              </Link>
                            ) : (
                              <p className="mb-2 px-2 text-[10px] font-bold tracking-[0.2em] text-brand-dark">
                                {col.title.toUpperCase()}
                              </p>
                            )}
                            {col.items.map((c) => (
                              <Link
                                key={c.href}
                                href={c.href}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileOpen(null);
                                }}
                                className="block rounded-lg px-2 py-2 text-sm text-ink-soft hover:text-brand-dark"
                              >
                                {c.label}
                                {c.sub && (
                                  <span className="ml-2 text-[9px] tracking-[0.15em] text-ink-soft/60">
                                    {c.sub}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand/5"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/preview#book"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-cream"
            >
              상담 예약
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
