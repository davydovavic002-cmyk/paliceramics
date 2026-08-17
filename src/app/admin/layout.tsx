import { AdminThemeProvider } from "@/context/AdminThemeContext";
import "./admin-theme.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <div className="fixed inset-0 z-[200] h-[100dvh] overflow-hidden bg-admin-bg">{children}</div>
    </AdminThemeProvider>
  );
}
