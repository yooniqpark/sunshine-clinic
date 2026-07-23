"use client";

import { useEffect, useState } from "react";

export function HeroTitle() {
  const [t, setT] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const start = 60;
      const end = 480;
      const raw = 1 - (y - start) / (end - start);
      setT(Math.min(1, Math.max(0, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-8"
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * -24}px) scale(${0.98 + t * 0.02})`,
        transition: "opacity 220ms ease-out, transform 220ms ease-out",
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
