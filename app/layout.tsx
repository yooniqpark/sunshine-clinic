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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+KR:wght@400;500;600;700&family=Gowun+Batang:wght@400;700&family=SUIT:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&family=Allura&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
