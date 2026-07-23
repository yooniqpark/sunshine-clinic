"use client";

import { useEffect, useState } from "react";

export function HeroTitle() {
  const [t, setT] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      // fade 0 → 1 over first 320px of scroll
      const y = window.scrollY;
      const clamped = Math.min(1, Math.max(0, 1 - y / 320));
      setT(clamped);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * -30}px)`,
        transition: "opacity 180ms linear, transform 180ms linear",
      }}
    >
      <h1
        className="font-serif font-normal leading-none tracking-tight text-cream drop-shadow-2xl"
        style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
      >
        Sunshine
      </h1>
    </div>
  );
}
