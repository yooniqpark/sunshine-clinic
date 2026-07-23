"use client";

import { useEffect, useState } from "react";

const KEY = "sunshine-splash-seen";

export function SplashIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const seen = sessionStorage.getItem(KEY);
      if (!seen) setVisible(true);
    } catch {
      // sessionStorage unavailable → skip
    }
  }, []);

  useEffect(() => {
    if (visible) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [visible]);

  function enter() {
    setLeaving(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    window.setTimeout(() => setVisible(false), 700);
  }

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter Sunshine"
      className={`fixed inset-0 z-[100] transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundImage: "url('/splash.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Click anywhere to enter */}
      <button
        type="button"
        onClick={enter}
        aria-label="Enter site"
        className="absolute inset-0 h-full w-full cursor-pointer bg-transparent"
      />

      {/* Hint at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-cream/70 sm:bottom-12">
        <span className="text-[10px] font-medium uppercase tracking-[0.4em]">
          Tap logo to enter
        </span>
        <span className="h-4 w-px animate-pulse bg-cream/50" />
      </div>
    </div>
  );
}
