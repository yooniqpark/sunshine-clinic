"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroTitle() {
  const [t, setT] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // fade window: 60 → 480px 스크롤 구간 (조금 늦게, 부드럽게)
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
      <Image
        src="/hero-logo.svg"
        alt="Sunshine Dermatology Clinic"
        width={834}
        height={282}
        priority
        className="h-auto w-[80vw] max-w-[720px] brightness-0 invert drop-shadow-2xl"
      />
    </div>
  );
}
