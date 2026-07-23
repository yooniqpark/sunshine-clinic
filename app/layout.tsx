import "./globals.css";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+KR:wght@400;500;600;700&family=Gowun+Batang:wght@400;700&family=SUIT:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
