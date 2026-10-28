import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { clinicConfig } from "./clinic.config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // core 는 TS 소스로 배포된다. core 안의 "@clinic/app" 은 이 병원의 clinic/index.ts
  transpilePackages: ["@yooniqpark/clinic-core"],
  turbopack: {
    resolveAlias: { "@clinic/app": "./clinic/index.ts" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30d
    // Next 16: 로컬 이미지에 쿼리스트링을 쓰려면 localPatterns 등록이 필수.
    // 첫 항목으로 쿼리 없는 모든 로컬 경로를 허용하고,
    // 캐시 버스터(?v=N)를 쓰는 /devices/* 도 추가로 허용한다.
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/devices/**", search: "?v=2" },
      { pathname: "/devices/**", search: "?v=3" },
      { pathname: "/devices/**", search: "?v=4" },
    ],
  },
  async rewrites() {
    return {
      // beforeFiles runs before Next.js checks the filesystem/routing,
      // so /blog is proxied to inblog even though our app has no /blog route.
      // Note: /robots.txt is intentionally NOT rewritten — we keep our own
      //   robots.ts (AI crawler allowlist) and instead add the inblog
      //   sitemap alongside our sitemap.xml. See app/robots.ts.
      beforeFiles: Object.entries(clinicConfig.integrations.inblog ?? {}).flatMap(([locale, sub]) => {
        const prefix = locale === "ko" ? "" : `/${locale}`;
        return [
          { source: `${prefix}/blog`, destination: `https://proxy.inblog.dev/${sub}` },
          { source: `${prefix}/blog/:path*`, destination: `https://proxy.inblog.dev/${sub}/:path*` },
        ];
      }),
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(nextConfig);
