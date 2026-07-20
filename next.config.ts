import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return {
      // beforeFiles runs before Next.js checks the filesystem/routing,
      // so /blog is proxied to inblog even though our app has no /blog route.
      // Note: /robots.txt is intentionally NOT rewritten — we keep our own
      //   robots.ts (AI crawler allowlist) and instead add the inblog
      //   sitemap alongside our sitemap.xml. See app/robots.ts.
      beforeFiles: [
        { source: "/blog", destination: "https://proxy.inblog.dev/sunshineclinic" },
        { source: "/blog/:path*", destination: "https://proxy.inblog.dev/sunshineclinic/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(nextConfig);
