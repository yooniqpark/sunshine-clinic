"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function EntrySplash({ locale }: { locale: string }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function enter() {
    if (leaving) return;
    setLeaving(true);
    // Fade to ivory then navigate to /home
    window.setTimeout(() => {
      router.push("/home", {
        locale: locale as "ko" | "en" | "ja" | "zh",
      });
    }, 700);
  }

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ backgroundColor: "#F5F0EA" }}
    >
      {/* Splash image layer — fades out */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          backgroundImage: "url('/splash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: leaving ? 0 : 1,
        }}
      />
      {/* Ivory brightening overlay — fades in */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          backgroundColor: "#F5F0EA",
          opacity: leaving ? 1 : 0,
        }}
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
