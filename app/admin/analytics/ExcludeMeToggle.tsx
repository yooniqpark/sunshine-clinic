"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ExcludeMeToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    try {
      await fetch("/api/admin/exclude-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
    } catch {
      setEnabled(!next); // revert
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="rounded-2xl border border-line bg-sand/30 p-4 text-right">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-ink-soft">
        내 접속 통계 제외
      </p>
      <div className="mt-2 flex items-center justify-end gap-3">
        <span className={`text-xs font-semibold ${enabled ? "text-brand-dark" : "text-ink-soft"}`}>
          {enabled ? "ON · 내 접속은 카운트되지 않음" : "OFF · 내 접속도 카운트됨"}
        </span>
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-pressed={enabled}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            enabled ? "bg-brand" : "bg-line"
          } disabled:opacity-60`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
        이 브라우저에 쿠키를 심어 통계 서버에서 skip. 다른 기기·브라우저는 별도로 설정 필요.
      </p>
    </div>
  );
}
