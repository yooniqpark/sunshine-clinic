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
    <div className="fixed inset-0 z-[100] overflow-hidden bg-ink">
      <video
        src="/splash.webm"
        autoPlay
        muted
        loop
        playsInline
        poster="/splash.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={enter}
        aria-label="Enter Sunshine"
        className="absolute inset-0 h-full w-full cursor-pointer bg-transparent"
      />
    </div>
  );
}
