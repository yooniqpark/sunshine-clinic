import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { PreviewHeader } from "./_components/PreviewHeader";
import { PreviewFooter } from "./_components/PreviewFooter";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Preview — Sunshine 피부과 리디자인",
  robots: { index: false, follow: false },
};

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Preview는 항상 ko 로케일로 강제
  setRequestLocale("ko");
  const messages = await getMessages({ locale: "ko" });

  return (
    <NextIntlClientProvider locale="ko" messages={messages}>
      <div className="min-h-screen bg-cream text-ink antialiased">
        {/* Preview banner */}
        <div className="sticky top-0 z-[60] bg-ink px-5 py-2 text-center text-[11px] font-medium text-cream/80">
          🎨 리디자인 시안 · <a href="/" className="underline">실제 홈 (/)</a> ↔ /preview
        </div>
        <PreviewHeader />
        <main>{children}</main>
        <PreviewFooter />

        {/* AI 챗봇 */}
        <ChatWidget />
      </div>
    </NextIntlClientProvider>
  );
}
