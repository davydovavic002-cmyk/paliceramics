import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/siteOrigin";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/demo"] }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
