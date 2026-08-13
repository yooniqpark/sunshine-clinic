"use client";

import { useState } from "react";
import { ImageEventPopup } from "@/components/ImageEventPopup";
import { NoticeEventPopup } from "@/components/NoticeEventPopup";

/**
 * 홈 팝업 순서: 첫 방문 이벤트 → 그랜드 오픈 이벤트 → 8월 진료 안내 → 안심 수면마취.
 * 하나씩 차례로 노출되며, 각 팝업의 "오늘 하루 보지 않기"는 개별 기억한다.
 */
export function HomePopups() {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <ImageEventPopup
        key="first-visit"
        popupId="first-visit-welcome-2026-v1"
        cover="/events/first-visit-welcome-2026.jpg"
        price="/events/first-visit-benefit-2026.jpg"
        ctaLabel="첫 방문 혜택 · 가격 보기"
        ariaLabel="첫 방문 이벤트"
        coverAlt="선샤인의원 첫 방문 이벤트"
        priceAlt="첫 방문 웰컴 혜택 가격표"
        onClose={() => setStep(1)}
      />
    );
  }

  if (step === 1) {
    return (
      <ImageEventPopup
        key="grand-open"
        popupId="grand-open-welcome-2026-v1"
        cover="/events/grand-open-welcome-2026.jpg"
        price="/events/grand-open-benefit-2026.jpg"
        priceAspect="1237 / 1271"
        ctaLabel="오픈 기념 혜택 · 가격 보기"
        ariaLabel="그랜드 오픈 이벤트"
        coverAlt="선샤인의원 그랜드 오픈 이벤트"
        priceAlt="그랜드 오픈 이벤트 가격표"
        onClose={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <NoticeEventPopup
        key="holiday"
        popupId="aug-2026-holiday"
        ariaLabel="8월 진료 안내"
        variant="holiday"
        onClose={() => setStep(3)}
      />
    );
  }

  if (step === 3) {
    return (
      <NoticeEventPopup
        key="sedation"
        popupId="sedation-2026-07"
        ariaLabel="안심 수면마취 안내"
        variant="sedation"
        onClose={() => setStep(4)}
      />
    );
  }

  return null;
}
