"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const POPUP_ID = "first-visit-welcome-2026-v1";
const KEY = "sunshine-popup:" + POPUP_ID;

const COVER = "/events/first-visit-welcome-2026.jpg";
const PRICE = "/events/first-visit-benefit-2026.jpg";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * 첫 방문 이벤트 팝업 — 웰컴 커버 이미지가 뜨고,
 * 이미지를 누르면 가격표(WELCOME BENEFIT) 이미지로 전환된다.
 * 탭·프리셋 전환 없이 단일 팝업.
 */
export function FirstVisitPopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState<0 | 1>(0);

  useEffect(() => {
    setMounted(true);
    try {
      setOpen(localStorage.getItem(KEY) !== todayStr());
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted || !open) return null;

  function closeToday() {
    try {
      localStorage.setItem(KEY, todayStr());
    } catch {}
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-1.5 py-3 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <section
        aria-label="첫 방문 이벤트"
        className="pointer-events-auto relative flex h-auto max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-[1.5rem] bg-[#f4efe7] shadow-2xl shadow-black/35 sm:max-w-[520px]"
      >
        <button
          type="button"
          onClick={() => setStage(stage === 0 ? 1 : 0)}
          aria-label={stage === 0 ? "첫 방문 혜택 가격표 보기" : "이벤트 첫 화면으로 돌아가기"}
          className="relative block w-full shrink overflow-hidden"
          style={{ aspectRatio: "2 / 3" }}
        >
          <Image
            src={stage === 0 ? COVER : PRICE}
            alt={stage === 0 ? "선샤인의원 첫 방문 이벤트" : "첫 방문 웰컴 혜택 가격표"}
            fill
            priority
            sizes="(min-width: 640px) 520px, 100vw"
            className="object-contain"
            draggable={false}
          />
          {stage === 0 && (
            <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-[#3d3129]/65 px-3.5 py-1 text-[10px] font-semibold tracking-[0.06em] text-[#f6ecdc] backdrop-blur-sm">
              이미지를 누르면 혜택이 열려요
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center justify-between border-t border-[#d95f26]/20 bg-[#efe7da] px-5 py-2.5 text-xs text-[#5a4a3c]">
          <button type="button" onClick={closeToday} className="hover:text-[#3d3129]">
            오늘 하루 보지 않기
          </button>
          {stage === 1 && (
            <button type="button" onClick={() => setStage(0)} className="font-semibold hover:text-[#3d3129]">
              ← 처음으로
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)} className="font-semibold hover:text-[#3d3129]">
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}
