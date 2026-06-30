import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "zh", "ja", "en"] as const,
  defaultLocale: "ko",
  // 한국어가 기본: '/' = ko (prefix 없음), '/en' '/ja' '/zh' 만 prefix
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
