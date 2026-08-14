import "./globals.css";
import type { Viewport } from "next";
import { getLocale } from "next-intl/server";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // admin 등 intl 미들웨어 밖 경로는 getLocale이 실패할 수 있어 ko로 폴백
  const locale = await getLocale().catch(() => "ko");
  return (
    <html lang={locale} className="h-full">
      <head>
        {/* SUIT — 본문 기본 서체.
            구글 폰트는 SUIT를 제공하지 않아(요청해도 조용히 무시됨) 배포처 CDN에서 직접 받는다.
            variable(= "SUIT Variable")과 static(= "SUIT")을 모두 걸어 두고,
            --font-sans에서 두 이름을 함께 지정해 어느 쪽이 내려와도 적용되게 한다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/static/woff2/SUIT.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* 마루부리 — 한글 세리프 (네이버 한글한글아름답게) */}
        <link
          rel="stylesheet"
          href="https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+KR:wght@400;500;600;700&family=Gowun+Batang:wght@400;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Allura&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
