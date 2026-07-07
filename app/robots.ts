import type { MetadataRoute } from "next";

const SITE_URL = "https://mysunshineclinic.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
      // Major AI crawlers — explicit allow so we're not stuck at implicit defaults
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Claude-Web", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
