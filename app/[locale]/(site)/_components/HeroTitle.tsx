"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroTitle() {
  const [t, setT] = useState(1);

  useEffect(() => {
    const onScroll = () => {
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
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-8"
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * -30}px)`,
        transition: "opacity 180ms linear, transform 180ms linear",
      }}
    >
      <Image
        src="/logo-lockup.svg"
        alt="Sunshine Dermatology Clinic"
        width={2100}
        height={720}
        priority
        className="h-auto w-[80vw] max-w-[900px] brightness-0 invert drop-shadow-2xl"
      />
    </div>
  );
}
