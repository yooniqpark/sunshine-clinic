"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, { native: string; flag: string }> = {
  ko: { native: "한국어", flag: "🇰🇷" },
  en: { native: "English", flag: "🇺🇸" },
  ja: { native: "日本語", flag: "🇯🇵" },
  zh: { native: "中文", flag: "🇨🇳" },
};

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "compact" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [pending, start] = useTransition();

  function change(next: string) {
    if (next === locale) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    start(() => {
      router.replace(`${pathname}${hash}`, {
        locale: next as (typeof routing.locales)[number],
      });
    });
  }

  const size = variant === "compact" ? "text-base" : "text-lg";

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      className={`inline-flex items-center gap-2 ${pending ? "opacity-60" : ""}`}
    >
      {routing.locales.map((l) => {
        const active = locale === l;
        const label = LABELS[l];
        return (
          <button
            key={l}
            type="button"
            onClick={() => change(l)}
            disabled={pending}
            aria-label={label.native}
            aria-current={active}
            title={label.native}
            className={`${size} leading-none transition ${
              active ? "" : "opacity-40 hover:opacity-100"
            }`}
          >
            <span className="select-none">{label.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
