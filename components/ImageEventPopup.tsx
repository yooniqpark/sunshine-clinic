"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * 이미지 2단 이벤트 팝업 — 커버 이미지가 뜨고,
 * CTA 버튼(또는 이미지)을 누르면 가격표 이미지로 전환된다.
 */
export function ImageEventPopup({
  popupId,
  cover,
  price,
  coverAspect = "2 / 3",
  priceAspect = "2 / 3",
  ctaLabel,
  ctaTone = "light",
  ariaLabel,
  coverAlt,
  priceAlt,
  onClose,
}: {
  popupId: string;
  cover: string;
  price: string;
  coverAspect?: string;
  priceAspect?: string;
  ctaLabel: string;
  /** light = 흰 유리(사진·어두운 포스터) · smoke = 스모크 유리(밝은 포스터) */
  ctaTone?: "light" | "smoke";
  ariaLabel: string;
  coverAlt: string;
  priceAlt: string;
  onClose?: () => void;
}) {
  const KEY = KEY_PREFIX + popupId;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState<0 | 1>(0);

  useEffect(() => {
    setMounted(true);
    let hidden = false;
    try {
      hidden = localStorage.getItem(KEY) === todayStr();
    } catch {}
    setOpen(!hidden);
    if (hidden) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    setOpen(false);
    onClose?.();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted || !open) return null;

  function closeToday() {
    try {
      localStorage.setItem(KEY, todayStr());
    } catch {}
    dismiss();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-1.5 py-3 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={dismiss}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <section
        aria-label={ariaLabel}
        className="pointer-events-auto relative flex h-auto max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-[1.5rem] bg-[#f4efe7] shadow-2xl shadow-black/35 sm:max-w-[520px]"
      >
        <div className="relative shrink">
          <button
            type="button"
            onClick={() => setStage(stage === 0 ? 1 : 0)}
            aria-label={stage === 0 ? `${ariaLabel} 가격표 보기` : "이벤트 첫 화면으로 돌아가기"}
            className="relative block w-full overflow-hidden"
            style={{ aspectRatio: stage === 0 ? coverAspect : priceAspect }}
          >
            <Image
              src={stage === 0 ? cover : price}
              alt={stage === 0 ? coverAlt : priceAlt}
              fill
              priority
              sizes="(min-width: 640px) 520px, 100vw"
              className="object-contain"
              draggable={false}
            />
          </button>

          {/* CTA — 포스터 위에 얹히는 볼록 유리 버튼 */}
          {stage === 0 && (
            <div className="absolute inset-x-4 bottom-4">
              <button
                type="button"
                onClick={() => setStage(1)}
                className={`group flex w-full items-center justify-between rounded-full border border-white/60 px-6 py-3 text-sm font-bold tracking-[0.04em] text-white shadow-[inset_0_1.5px_0_rgba(255,255,255,0.6),0_10px_24px_rgba(40,30,15,0.28)] backdrop-blur-md transition [text-shadow:0_1px_4px_rgba(40,30,15,0.45)] ${
                  ctaTone === "smoke"
                    ? "bg-gradient-to-b from-[#3c3020]/55 via-[#3c3020]/38 to-[#3c3020]/50 hover:from-[#3c3020]/65 hover:to-[#3c3020]/60"
                    : "bg-gradient-to-b from-white/35 via-white/10 to-white/25 hover:from-white/45 hover:to-white/30"
                }`}
              >
                <span>{ctaLabel}</span>
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-[#d95f26]/20 bg-[#efe7da] px-5 py-2.5 text-xs text-[#5a4a3c]">
          <button type="button" onClick={closeToday} className="hover:text-[#3d3129]">
            오늘 하루 보지 않기
          </button>
          {stage === 1 && (
            <button type="button" onClick={() => setStage(0)} className="font-semibold hover:text-[#3d3129]">
              ← 처음으로
            </button>
          )}
          <button type="button" onClick={dismiss} className="font-semibold hover:text-[#3d3129]">
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}
