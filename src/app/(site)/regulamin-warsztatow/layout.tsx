import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin warsztatów — pali ceramics",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
