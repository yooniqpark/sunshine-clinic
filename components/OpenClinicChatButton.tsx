"use client";

import type { ReactNode } from "react";
import { requestClinicChatOpen } from "@/lib/clinic-chat-events";

export function OpenClinicChatButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => requestClinicChatOpen(window)}
    >
      {children}
    </button>
  );
}
