"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EventTabsPopup } from "@/components/EventTabsPopup";
import { NoticeEventPopup } from "@/components/NoticeEventPopup";

/** 앞 팝업을 닫은 직후 다음 팝업이 곧바로 겹쳐 뜨지 않도록 두는 간격 */
const GAP_MS = 450;

/**
 * 홈 팝업 순서: 이벤트(그랜드 오픈 · 첫 방문 탭 전환) → 안심 수면마취.
 *
 * 8월 진료 안내(광복절)는 기간이 지나 노출에서 제외했다.
 * NoticeEventPopup의 holiday 변형과 v2.popups.holiday 문구는 그대로 두었으니,
 * 다음 연휴 안내가 필요하면 문구만 고쳐 이 목록에 다시 넣으면 된다.
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
    return <EventTabsPopup key="events" onClose={next} />;
  }

  if (step === 1) {
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
