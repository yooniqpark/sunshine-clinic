import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30d
  },
  async rewrites() {
    return {
      // beforeFiles runs before Next.js checks the filesystem/routing,
      // so /blog is proxied to inblog even though our app has no /blog route.
      // Note: /robots.txt is intentionally NOT rewritten — we keep our own
      //   robots.ts (AI crawler allowlist) and instead add the inblog
      //   sitemap alongside our sitemap.xml. See app/robots.ts.
      beforeFiles: [
        // Korean (default locale, no prefix)
        { source: "/blog", destination: "https://proxy.inblog.dev/sunshineclinic" },
        { source: "/blog/:path*", destination: "https://proxy.inblog.dev/sunshineclinic/:path*" },
        // English
        { source: "/en/blog", destination: "https://proxy.inblog.dev/sunshineclinic-en" },
        { source: "/en/blog/:path*", destination: "https://proxy.inblog.dev/sunshineclinic-en/:path*" },
        // Japanese (inblog uses -jp not -ja)
        { source: "/ja/blog", destination: "https://proxy.inblog.dev/sunshineclinic-jp" },
        { source: "/ja/blog/:path*", destination: "https://proxy.inblog.dev/sunshineclinic-jp/:path*" },
        // Chinese (inblog uses -cn not -zh)
        { source: "/zh/blog", destination: "https://proxy.inblog.dev/sunshineclinic-cn" },
        { source: "/zh/blog/:path*", destination: "https://proxy.inblog.dev/sunshineclinic-cn/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(nextConfig);
