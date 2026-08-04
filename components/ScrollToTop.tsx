"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    // 처음엔 천천히 출발했다가 부드럽게 올라가는 커스텀 이징 (easeInOutCubic)
    const startY = window.scrollY;
    if (startY <= 0) return;
    const duration = Math.min(1600, 700 + startY * 0.25);
    const start = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    // html의 scroll-behavior:smooth가 프레임 단위 scrollTo를 가로채지 않도록 잠시 해제
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      window.scrollTo(0, startY * (1 - ease(p)));
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        html.style.scrollBehavior = prevBehavior;
      }
    };
    requestAnimationFrame(step);
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll to top"
      className={`scroll-top-btn fixed bottom-24 right-6 z-[60] grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-ink shadow-lg shadow-ink/20 transition-all duration-300 hover:bg-ink hover:text-cream lg:bottom-7 lg:right-24 lg:h-12 lg:w-12 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
