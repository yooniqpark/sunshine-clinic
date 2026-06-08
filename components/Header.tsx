"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MenuIcon, CloseIcon, ChevronDownIcon, SunMarkIcon } from "./icons";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV = [
  {
    key: "about" as const,
    href: "/about" as const,
    childrenGroup: "aboutChildren" as const,
    children: [
      { key: "vision", href: "/about#vision" },
      { key: "doctors", href: "/about#doctors" },
      { key: "tour", href: "/about#tour" },
      { key: "location", href: "/about#location" },
    ] as const,
  },
  {
    key: "lifting" as const,
    href: "/treatments/lifting" as const,
    childrenGroup: "liftingChildren" as const,
    children: [
      { key: "overview", href: "/treatments/lifting#overview" },
      { key: "ulthera", href: "/treatments/lifting#ulthera-prime" },
      { key: "thermage", href: "/treatments/lifting#thermage-flx" },
      { key: "shurink", href: "/treatments/lifting#shurink-universe" },
      { key: "inmode", href: "/treatments/lifting#inmode" },
      { key: "other", href: "/treatments/lifting#other-treatments" },
    ] as const,
  },
  {
    key: "fillerSkinbooster" as const,
    href: "/treatments/filler-skinbooster" as const,
    childrenGroup: "fillerSkinboosterChildren" as const,
    children: [
      { key: "overview", href: "/treatments/filler-skinbooster#overview" },
      { key: "filler", href: "/treatments/filler-skinbooster#filler" },
      { key: "skinbooster", href: "/treatments/filler-skinbooster#skinbooster" },
      { key: "skinAir", href: "/treatments/filler-skinbooster#skin-air" },
      { key: "rejuran", href: "/treatments/filler-skinbooster#rejuran" },
      { key: "juvelook", href: "/treatments/filler-skinbooster#juvelook" },
      { key: "ellanse", href: "/treatments/filler-skinbooster#ellanse" },
      { key: "other", href: "/treatments/filler-skinbooster#other-treatments" },
    ] as const,
  },
  {
    key: "whitening" as const,
    href: "/treatments/whitening" as const,
    childrenGroup: "whiteningChildren" as const,
    children: [
      { key: "overview", href: "/treatments/whitening#overview" },
      { key: "melasma", href: "/treatments/whitening#melasma" },
      { key: "freckles", href: "/treatments/whitening#freckles" },
      { key: "resistantPigment", href: "/treatments/whitening#resistant-pigment" },
      { key: "otaCafe", href: "/treatments/whitening#ota-cafe" },
      { key: "redness", href: "/treatments/whitening#redness" },
      { key: "devices", href: "/treatments/whitening#devices" },
      { key: "other", href: "/treatments/whitening#other-treatments" },
    ] as const,
  },
  {
    key: "acne" as const,
    href: "/treatments/acne" as const,
    childrenGroup: "acneChildren" as const,
    children: [
      { key: "overview", href: "/treatments/acne#overview" },
      { key: "acneActive", href: "/treatments/acne#acne-active" },
      { key: "acnePigment", href: "/treatments/acne#acne-pigment" },
      { key: "acneScar", href: "/treatments/acne#acne-scar" },
      { key: "pores", href: "/treatments/acne#pores" },
      { key: "devices", href: "/treatments/acne#devices" },
      { key: "other", href: "/treatments/acne#other-treatments" },
    ] as const,
  },
  {
    key: "skinDisease" as const,
    href: "/treatments/skin-disease" as const,
    childrenGroup: "skinDiseaseChildren" as const,
    children: [
      { key: "overview", href: "/treatments/skin-disease#overview" },
      { key: "athletesFoot", href: "/treatments/skin-disease#athletes-foot" },
      { key: "psoriasis", href: "/treatments/skin-disease#psoriasis" },
      { key: "atopy", href: "/treatments/skin-disease#atopy" },
      { key: "burns", href: "/treatments/skin-disease#burns" },
      { key: "hairLoss", href: "/treatments/skin-disease#hair-loss" },
    ] as const,
  },
  {
    key: "community" as const,
    href: "/community/events" as const,
    childrenGroup: "communityChildren" as const,
    children: [
      { key: "events", href: "/community/events" },
      { key: "notices", href: "/community/notices" },
      { key: "prices", href: "/community/prices" },
    ] as const,
  },
];

export function Header() {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const tBrand = useTranslations("brand");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHoveredNav(label);
  };
  const handleNavLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoveredNav(null), 140);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
        <Link
          href="/"
          aria-label={tBrand("name")}
          onClick={() => setOpen(false)}
          className="group flex items-center gap-2.5"
        >
          <SunMarkIcon className="h-8 w-8 text-brand transition-transform duration-500 group-hover:rotate-45 lg:h-9 lg:w-9" />
          <span className="flex flex-col leading-none">
            <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink lg:text-sm">
              {tBrand("name").toUpperCase()}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink-soft/80">
              {tBrand("label").replace(/\.$/, "")}
            </span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const label = t(item.key);
            const active = hoveredNav === item.key;
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => handleNavEnter(item.key)}
                onMouseLeave={handleNavLeave}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition lg:px-3.5 lg:text-sm ${
                    active ? "bg-brand/15 text-brand-dark" : "text-ink/80"
                  }`}
                >
                  {label}
                  {"children" in item && item.children && (
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 shrink-0 transition ${active ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
                {"children" in item && item.children && (
                  <div
                    className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 transition-all duration-200 ${
                      active
                        ? "visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-line bg-white/95 p-2 shadow-xl shadow-ink/15 backdrop-blur-md">
                      {item.children.map((c) => (
                        <Link
                          key={c.key}
                          href={c.href}
                          className="block rounded-xl px-3 py-2 text-sm text-ink-soft transition hover:bg-brand/10 hover:text-brand-dark"
                        >
                          {t(`${item.childrenGroup}.${c.key}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            aria-label={tHeader("menuOpen")}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile drawer — floating glass overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-cream shadow-xl shadow-ink/15 lg:hidden">
            <nav className="mx-auto max-w-7xl px-5 py-3">
              {NAV.map((item) => {
                const isExpanded = expanded === item.key;
                const children =
                  "children" in item && item.children ? item.children : null;
                const childrenGroup =
                  "childrenGroup" in item ? item.childrenGroup : null;
                return (
                  <div key={item.key} className="border-b border-line/60 last:border-0">
                    {children ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded((e) => (e === item.key ? null : item.key))
                        }
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[15px] font-semibold transition ${
                          isExpanded
                            ? "bg-brand/20 text-brand-dark ring-1 ring-brand/30"
                            : "text-ink hover:text-brand-dark active:bg-brand/10"
                        }`}
                      >
                        {t(item.key)}
                        <ChevronDownIcon
                          className={`h-5 w-5 transition ${
                            isExpanded ? "rotate-180 text-brand-dark" : "text-ink-soft"
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[15px] font-semibold text-ink transition hover:text-brand-dark active:bg-brand/10"
                      >
                        {t(item.key)}
                      </Link>
                    )}
                    {children && isExpanded && childrenGroup && (
                      <div className="space-y-1 pb-3 pl-1">
                        {children.map((c) => (
                          <Link
                            key={c.key}
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-ink-soft transition hover:text-brand-dark active:bg-brand/10 active:text-brand-dark"
                          >
                            {t(`${childrenGroup}.${c.key}`)}
                          </Link>
                        ))}
                      </div>
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
