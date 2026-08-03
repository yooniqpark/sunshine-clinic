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
      {/* Mobile portrait video */}
      <video
        src="/splash-mobile.webm?v=2"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
      />
      {/* Desktop landscape video */}
      <video
        src="/splash.webm?v=2"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
      />

      {/* TAP TO ENTER — 클릭 유도 인디케이터 */}
      <style>{`
        @keyframes tapPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        @keyframes tapRing {
          0% { transform: scale(0.6); opacity: 0.7; }
          70%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[60%] flex flex-col items-center gap-3"
      >
        {/* 링 펄스 닷 */}
        <span className="relative grid h-8 w-8 place-items-center">
          <span
            className="absolute inset-0 rounded-full border border-white/70"
            style={{ animation: "tapRing 2.4s ease-out infinite" }}
          />
          <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
        </span>
        <p
          className="text-[10px] font-semibold tracking-[0.45em] text-white [text-shadow:0_1px_10px_rgba(120,90,50,0.45)]"
          style={{ animation: "tapPulse 2.4s ease-in-out infinite" }}
        >
          TAP TO ENTER
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
