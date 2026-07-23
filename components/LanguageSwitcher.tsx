"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

export function LanguageSwitcher({
  variant = "default",
  tone = "auto",
}: {
  variant?: "default" | "compact";
  tone?: "auto" | "dark" | "light";
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function change(next: string) {
    setOpen(false);
    if (next === locale) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    start(() => {
      router.replace(`${pathname}${hash}`, {
        locale: next as (typeof routing.locales)[number],
      });
    });
  }

  const btnSize = variant === "compact" ? "h-9 w-9" : "h-10 w-10";
  const iconSize = variant === "compact" ? "h-4 w-4" : "h-5 w-5";
  const iconColor =
    tone === "dark" ? "text-cream" : tone === "light" ? "text-ink" : "text-current";

  return (
    <div ref={ref} className={`relative ${pending ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-label={t("switchLanguage")}
        aria-expanded={open}
        title={LABELS[locale]}
        className={`grid place-items-center rounded-full transition hover:bg-white/10 ${btnSize} ${iconColor}`}
      >
        <GlobeIcon className={iconSize} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-ink/15"
        >
          {routing.locales.map((l) => {
            const active = locale === l;
            return (
              <button
                key={l}
                type="button"
                role="menuitem"
                onClick={() => change(l)}
                aria-current={active}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${
                  active
                    ? "bg-brand/10 font-semibold text-brand-dark"
                    : "text-ink hover:bg-sand/60"
                }`}
              >
                <span>{LABELS[l]}</span>
                {active && <CheckIcon className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0 -18" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
