import { POPUP_EVENTS } from "../lib/event-popup";
import { localizeEvent } from "../lib/event-popup-i18n";

const locales = ["en", "ja", "zh"] as const;
const hangul = /[가-힣]/;

function collectHangul(value: unknown, path = "events", found: string[] = []): string[] {
  if (typeof value === "string") {
    // Price strings are localized at render time by formatPrice().
    if (hangul.test(value) && !/^[\d.]+만원/.test(value)) {
      found.push(`${path}: ${value}`);
    }
    return found;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectHangul(entry, `${path}[${index}]`, found));
    return found;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) =>
      collectHangul(entry, `${path}.${key}`, found),
    );
  }

  return found;
}

const errors = locales.flatMap((locale) =>
  collectHangul(POPUP_EVENTS.map((event) => localizeEvent(event, locale))).map(
    (message) => `${locale} ${message}`,
  ),
);

if (errors.length > 0) {
  console.error("Event locale check failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(`Event locale check passed (${locales.join(", ")}).`);
