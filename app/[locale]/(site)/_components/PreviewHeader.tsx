"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";

type SubItem = { label: string; href: string; sub?: string };
type Column = { title: string; href?: string; items: SubItem[] };
type NavItem =
  | { key: string; label: string; href: string; children?: undefined }
  | { key: string; label: string; href: string; children: Column[] };

export function PreviewHeader() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const t = useTranslations("v2.header");
  const tBrand = useTranslations("brand");

  const NAV: NavItem[] = [
    { key: "about", label: t("nav.about"), href: "/about" },
    {
      key: "treatments",
      label: t("nav.treatments"),
      href: "/treatments/lifting",
      children: [
        {
          title: t("cols.lifting"),
          href: "/treatments/lifting",
          items: [
            { label: t("items.ultheraPrime"), sub: "ULTHERA PRIME", href: "/treatments/lifting/ulthera-prime" },
            { label: t("items.thermageFlx"), sub: "THERMAGE FLX", href: "/treatments/lifting/thermage-flx" },
            { label: t("items.shurinkUniverse"), sub: "SHRINK UNIVERSE", href: "/treatments/lifting/shurink-universe" },
            { label: t("items.inmode"), sub: "INMODE", href: "/treatments/lifting/inmode" },
            { label: t("items.ellanse"), sub: "ELLANSÉ", href: "/treatments/lifting/ellanse" },
          ],
        },
        {
          title: t("cols.antiAging"),
          href: "/treatments/anti-aging",
          items: [
            { label: t("items.botox"), href: "/treatments/anti-aging" },
            { label: t("items.filler"), href: "/treatments/anti-aging" },
            { label: t("items.skinBotox"), href: "/treatments/anti-aging" },
            { label: t("items.jubellook"), href: "/treatments/anti-aging" },
            { label: t("items.rejuran"), href: "/treatments/anti-aging" },
          ],
        },
        {
          title: t("cols.whitening"),
          href: "/treatments/whitening",
          items: [
            { label: t("items.clarityII"), sub: "CLARITY II", href: "/treatments/whitening/clarity-ii" },
            { label: t("items.starwalker"), sub: "STARWALKER", href: "/treatments/whitening/fotona-starwalker" },
            { label: t("items.vbeam"), sub: "VBEAM", href: "/treatments/whitening/vbeam" },
            { label: t("items.secretRf"), sub: "SECRET RF", href: "/treatments/whitening/secret-rf" },
          ],
        },
        {
          title: t("cols.acne"),
          href: "/treatments/acne",
          items: [
            { label: t("items.carpriCo2"), sub: "CARPRI CO2", href: "/treatments/acne/carpri-co2" },
            { label: t("items.goldPtt"), sub: "GOLD PTT", href: "/treatments/acne/gold-ptt" },
            { label: t("items.curejet"), sub: "CUREJET", href: "/treatments/acne/curajet" },
          ],
        },
        {
          title: t("cols.skinDisease"),
          href: "/treatments/skin-disease",
          items: [
            { label: t("items.atopic"), href: "/treatments/skin-disease" },
            { label: t("items.psoriasis"), href: "/treatments/skin-disease" },
            { label: t("items.hairLoss"), href: "/treatments/skin-disease" },
            { label: t("items.wart"), href: "/treatments/skin-disease" },
            { label: t("items.athlete"), href: "/treatments/skin-disease" },
          ],
        },
      ],
    },
    {
      key: "community",
      label: t("nav.community"),
      href: "/community/notices",
      children: [
        {
          title: t("cols.community"),
          items: [
            { label: t("items.notices"), href: "/community/notices" },
            { label: t("items.events"), href: "/community/events" },
            { label: t("items.prices"), href: "/community/prices" },
          ],
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
        <Link
          href="/"
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
              {tBrand("name")}
            </span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-ink-soft/80">
              {tBrand("label")}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => setHovered(item.key)}
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
            href="/#book"
            className="ml-3 rounded-full bg-ink px-5 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark"
          >
            {t("ctaBook")}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
          aria-label={open ? t("menuClose") : t("menuOpen")}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop mega panel */}
      {NAV.map((item) =>
        item.children ? (
          <div
            key={item.key}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
            className={`absolute left-0 right-0 top-full hidden overflow-hidden border-t border-line bg-white/98 shadow-xl shadow-ink/10 backdrop-blur transition-all duration-200 lg:block ${
              hovered === item.key
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
                    {col.items.map((c, idx) => (
                      <li key={`${c.href}-${idx}`}>
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
        <>
          <div
            className="fixed inset-0 top-24 z-30 bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-24 z-40 max-h-[calc(100vh-6rem)] overflow-y-auto border-b border-line bg-cream shadow-xl shadow-ink/15 lg:hidden">
            <nav className="mx-auto max-w-7xl px-5 py-3">
              {NAV.map((item) => {
                const isExpanded = mobileOpen === item.key;
                return (
                  <div key={item.key} className="border-b border-line/60 last:border-0">
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setMobileOpen((v) => (v === item.key ? null : item.key))
                          }
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[17px] font-semibold transition active:bg-brand/10 ${
                            isExpanded
                              ? "bg-brand/15 text-brand-dark ring-1 ring-brand/25"
                              : "text-ink"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDownIcon
                            className={`h-5 w-5 transition ${
                              isExpanded ? "rotate-180 text-brand-dark" : "text-ink-soft"
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="space-y-1 pb-3 pl-1">
                            {item.children.map((col) =>
                              col.href ? (
                                <Link
                                  key={col.title}
                                  href={col.href}
                                  onClick={() => {
                                    setOpen(false);
                                    setMobileOpen(null);
                                  }}
                                  className="block rounded-lg px-3 py-2.5 text-base text-ink-soft transition hover:text-brand-dark active:bg-brand/10 active:text-brand-dark"
                                >
                                  {col.title}
                                </Link>
                              ) : null
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-3.5 text-[17px] font-semibold text-ink transition hover:text-brand-dark active:bg-brand/10"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
              <Link
                href="/#book"
                onClick={() => setOpen(false)}
                className="mt-4 block rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-cream"
              >
                {t("ctaBook")}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
