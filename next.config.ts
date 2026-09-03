import type { NextConfig } from "next";

/** VPS has ~2GB RAM — runtime Sharp resizing via /_next/image is too slow; assets are pre-WebP in public/. */
const serveStaticImages =
  process.env.NEXT_IMAGE_UNOPTIMIZED === "1" || process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    unoptimized: serveStaticImages,
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 160, 180, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "three"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
