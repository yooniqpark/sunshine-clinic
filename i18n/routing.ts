import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "zh", "ja", "en"] as const,
  defaultLocale: "ko",
  // /ko/page (prefix even for default — keeps URLs predictable)
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
