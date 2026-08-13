"use client";

import { useState } from "react";
import { FirstVisitPopup } from "@/components/FirstVisitPopup";
import { AnnouncementPopups } from "@/components/AnnouncementPopups";

/**
 * 홈 팝업 순서: 첫 방문 이벤트 → 오픈 이벤트(가격표 버튼) → 8월 휴진 안내 → 안심 수면마취.
 * 각 팝업은 "오늘 하루 보지 않기"를 개별 기억한다.
 */
export function HomePopups() {
  const [firstVisitDone, setFirstVisitDone] = useState(false);

  return firstVisitDone ? (
    <AnnouncementPopups />
  ) : (
    <FirstVisitPopup onClose={() => setFirstVisitDone(true)} />
  );
}
