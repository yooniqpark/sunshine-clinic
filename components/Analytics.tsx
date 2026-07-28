"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

/** Client-side pageview beacon. Fires on every route change. */
export function Analytics() {
  const pathname = usePathname();
  const locale = useLocale();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (last.current === pathname) return;
    last.current = pathname;

    // fire-and-forget; keepalive so it survives page navigation
    const body = JSON.stringify({
      path: pathname,
      locale,
      referrer: document.referrer || "",
      search: typeof window !== "undefined" ? window.location.search : "",
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/pv",
          new Blob([body], { type: "application/json" })
        );
      } else {
        fetch("/api/pv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }, [pathname, locale]);

  return null;
}
