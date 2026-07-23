"use client";

import { useRouter } from "@/i18n/navigation";

export function EntrySplash({ locale }: { locale: string }) {
  const router = useRouter();

  function enter() {
    router.push("/home", {
      locale: locale as "ko" | "en" | "ja" | "zh",
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: "#F5F0EA" }}
    >
      <video
        src="/splash.webm"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Soft ivory wash so the video reads as an ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "rgba(245, 240, 234, 0.35)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F5F0EA]/40 via-transparent to-[#F5F0EA]/50" />

      {/* Responsive brand overlay (scales with viewport) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ink">
        <h1
          className="font-serif font-normal leading-none tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 14vw, 9rem)" }}
        >
          Sunshine
        </h1>
        <p className="mt-4 text-[9px] font-medium tracking-[0.3em] text-ink-soft sm:text-[11px] sm:tracking-[0.4em]">
          DERMATOLOGY CLINIC · SINCE 2026
        </p>
      </div>

      <button
        type="button"
        onClick={enter}
        aria-label="Enter Sunshine"
        className="absolute inset-0 h-full w-full cursor-pointer bg-transparent"
      />
    </div>
  );
}
