import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/hero/Header";
import { HashScrollHandler } from "@/components/HashScrollHandler";
import { notoSerifJP, shipporiMincho } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "pali ceramics",
  description: "Quiet handcrafted ceramics — Japandi atelier",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSerifJP.variable} ${shipporiMincho.variable}`}>
      <body className="font-body antialiased">
        <LanguageProvider>
          <HashScrollHandler />
          <Header />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
