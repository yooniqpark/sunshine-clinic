"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";

const NAV = [
  { label: "병원 소개", href: "/preview/about" },
  {
    label: "시술",
    href: "/preview/treatments/lifting",
    children: [
      { label: "리프팅", href: "/preview/treatments/lifting" },
      { label: "안티에이징", href: "/preview/treatments/anti-aging" },
      { label: "화이트닝 · 홍조", href: "/preview/treatments/whitening" },
      { label: "여드름 · 흉터", href: "/preview/treatments/acne" },
      { label: "피부질환", href: "/preview/treatments/skin-disease" },
    ],
  },
  {
    label: "커뮤니티",
    href: "/preview/community/notices",
    children: [
      { label: "공지사항", href: "/preview/community/notices" },
      { label: "이벤트", href: "/preview/community/events" },
      { label: "비급여 수가표", href: "/preview/community/prices" },
    ],
  },
];

export function PreviewHeader() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

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
        <nav className="hidden items-center gap-2 lg:flex">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:text-brand"
              >
                {item.label}
                {item.children && <ChevronDownIcon className="h-3 w-3" />}
              </Link>
              {item.children && (
                <div
                  className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 transition-all duration-200 ${
                    hovered === item.label
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-line bg-white/95 p-2 shadow-xl shadow-ink/15 backdrop-blur">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-xl px-3 py-2 text-sm text-ink-soft transition hover:bg-brand/10 hover:text-brand-dark"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-line bg-cream lg:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-3">
            {NAV.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-brand/5"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-line pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:text-brand-dark"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
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
