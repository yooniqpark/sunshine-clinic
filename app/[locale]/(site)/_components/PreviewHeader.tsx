"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 최상단: 투명 + 크림 텍스트 / 스크롤 후: 크림 배경 + 다크 텍스트
  const solid = scrolled || open;
  const nameColor = solid ? "text-ink" : "text-cream drop-shadow-md";
  const subColor = solid ? "text-ink-soft/80" : "text-cream/80 drop-shadow";
  const linkColor = solid ? "text-ink" : "text-cream drop-shadow-md";

  const subMenu = (slug: string) =>
    (t.raw(`subMenus.${slug}`) as SubItem[]) ?? [];

  const NAV: NavItem[] = [
    { key: "about", label: t("nav.about"), href: "/about" },
    {
      key: "lifting",
      label: t("cols.lifting"),
      href: "/treatments/lifting",
      children: [{ title: t("cols.lifting"), items: subMenu("lifting") }],
    },
    {
      key: "antiAging",
      label: t("cols.antiAging"),
      href: "/treatments/anti-aging",
      children: [{ title: t("cols.antiAging"), items: subMenu("anti-aging") }],
    },
    {
      key: "whitening",
      label: t("cols.whitening"),
      href: "/treatments/whitening",
      children: [{ title: t("cols.whitening"), items: subMenu("whitening") }],
    },
    {
      key: "acne",
      label: t("cols.acne"),
      href: "/treatments/acne",
      children: [{ title: t("cols.acne"), items: subMenu("acne") }],
    },
    {
      key: "skinDisease",
      label: t("cols.skinDisease"),
      href: "/treatments/skin-disease",
      children: [{ title: t("cols.skinDisease"), items: subMenu("skin-disease") }],
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-line/60 bg-cream/85 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
        <Link
          href="/home"
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
            <span
              className={`font-serif text-[15px] font-normal tracking-tight transition lg:text-base ${nameColor}`}
            >
              {tBrand("name")}
            </span>
            <span
              className={`mt-1 text-[9px] font-medium uppercase tracking-[0.24em] transition ${subColor}`}
            >
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
              {item.children ? (
                <span
                  className={`flex cursor-default items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${linkColor}`}
                >
                  {item.label}
                  <ChevronDownIcon className="h-3 w-3" />
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition hover:text-brand-dark ${linkColor}`}
                >
                  {item.label}
                </Link>
              )}

              {/* Per-item dropdown (narrow, positioned under the nav item) */}
              {item.children && (
                <div
                  className={`absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2 transition-all duration-200 ${
                    hovered === item.key
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="min-w-[240px] overflow-hidden rounded-2xl border border-line bg-white/98 p-2 shadow-xl shadow-ink/15 backdrop-blur">
                    {item.children.flatMap((col) =>
                      col.items.map((c, idx) => (
                        <Link
                          key={`${c.href}-${idx}`}
                          href={c.href}
                          onClick={() => setHovered(null)}
                          className="group block rounded-xl px-3 py-2.5 transition hover:bg-brand/10"
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
                      )),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="ml-3 flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/home#book"
              className="rounded-full bg-ink px-5 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark"
            >
              {t("ctaBook")}
            </Link>
          </div>
        </nav>

        {/* Mobile: language + toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`grid h-11 w-11 place-items-center rounded-full border transition ${
              solid ? "border-line text-ink" : "border-cream/40 text-cream"
            }`}
            aria-label={open ? t("menuClose") : t("menuOpen")}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-cream shadow-xl shadow-ink/15 lg:hidden">
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
                            {item.children.map((col) => (
                              <div key={col.title}>
                                {col.href && (
                                  <Link
                                    href={col.href}
                                    onClick={() => {
                                      setOpen(false);
                                      setMobileOpen(null);
                                    }}
                                    className="block rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark active:bg-brand/10"
                                  >
                                    {col.title} →
                                  </Link>
                                )}
                                {col.items.map((c, idx) => (
                                  <Link
                                    key={`${c.href}-${idx}`}
                                    href={c.href}
                                    onClick={() => {
                                      setOpen(false);
                                      setMobileOpen(null);
                                    }}
                                    className="block rounded-lg px-5 py-2 text-sm text-ink-soft transition hover:text-brand-dark active:bg-brand/10 active:text-brand-dark"
                                  >
                                    {c.label}
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
                        className="block rounded-xl px-3 py-3.5 text-[17px] font-semibold text-ink transition hover:text-brand-dark active:bg-brand/10"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
