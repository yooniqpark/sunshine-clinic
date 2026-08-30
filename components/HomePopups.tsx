"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EventTabsPopup } from "@/components/EventTabsPopup";
import { NoticeEventPopup } from "@/components/NoticeEventPopup";

/** 앞 팝업을 닫은 직후 다음 팝업이 곧바로 겹쳐 뜨지 않도록 두는 간격 */
const GAP_MS = 450;

/**
 * 홈 팝업 순서: 추석 연휴 진료 안내 → 이벤트(9월·오픈·첫 방문 탭 전환) → 안심 수면마취.
 *
 * 휴진 안내를 맨 앞에 둔다 — 모르고 방문하면 헛걸음이 되므로 이벤트보다 먼저 보여야 한다.
 * 연휴가 지나면 step 0을 빼고 문구(v2.popups.holiday)만 다음 안내로 교체하면 된다.
 */
export function HomePopups() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // 다음 팝업으로 넘어가되, 잠깐 비운 뒤 노출해 오조작(연속 닫기)을 막는다
  const next = useCallback(() => {
    setVisible(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStep((s) => s + 1);
      setVisible(true);
    }, GAP_MS);
  }, []);

  if (!visible) return null;

  if (step === 0) {
    return (
      <NoticeEventPopup
        key="chuseok"
        popupId="chuseok-2026"
        ariaLabel="추석 연휴 진료 안내"
        variant="holiday"
        onClose={next}
      />
    );
  }

  if (step === 1) {
    return <EventTabsPopup key="events" onClose={next} />;
  }

  if (step === 2) {
    return (
      <NoticeEventPopup
        key="sedation"
        popupId="sedation-2026-07"
        ariaLabel="안심 수면마취 안내"
        variant="sedation"
        onClose={next}
      />
    );
  }

  return null;
}
