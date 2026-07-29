import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/hero/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "pali ceramics",
  description: "Quiet handcrafted ceramics — Japandi atelier",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <LanguageProvider>
          <Header />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
