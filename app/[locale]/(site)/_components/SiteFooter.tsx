"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/** Keep the editorial ending exclusive to the homepage, in every locale. */
export function SiteFooter({ home, children }: { home: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/home" ? home : children;
}
