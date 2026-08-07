"use client";

import { useState, useTransition } from "react";
import { resetStats } from "./actions";

export function ResetStatsButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function onClick() {
    if (
      !window.confirm(
        "방문 통계를 모두 삭제하고 0부터 다시 시작할까요?\n삭제된 기록은 복구할 수 없습니다."
      )
    )
      return;
    startTransition(async () => {
      await resetStats();
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="rounded-full border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "초기화 중…" : done ? "초기화 완료 ✓" : "통계 초기화"}
    </button>
  );
}
