import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mypage", "/nickname", "/choices/new", "/auth/"],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
