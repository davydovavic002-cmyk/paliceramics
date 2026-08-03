import { Inter, Noto_Serif_JP, Shippori_Mincho } from "next/font/google";

export const inter = Inter({
  weight: ["400", "500"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

/** Only 400/500 are used in UI — same look, fewer font files than 7 weights via @import */
export const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  preload: true,
});

export const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  preload: true,
});
