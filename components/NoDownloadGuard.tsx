"use client";

import { useEffect } from "react";

/**
 * .no-download 컨테이너 내부의 이미지에서 우클릭 · 드래그 · 저장을 차단.
 * CSS pointer-events/user-drag만으로 못 막는 케이스(우클릭 메뉴)를 보강.
 */
export function NoDownloadGuard() {
  useEffect(() => {
    const stopIfInside = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const guarded = target.closest(".no-download");
      if (!guarded) return;
      const isImg = target.tagName === "IMG" || target.closest("picture, img");
      if (!isImg) return;
      e.preventDefault();
    };
    document.addEventListener("contextmenu", stopIfInside);
    document.addEventListener("dragstart", stopIfInside);
    return () => {
      document.removeEventListener("contextmenu", stopIfInside);
      document.removeEventListener("dragstart", stopIfInside);
    };
  }, []);
  return null;
}
