export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-[#0f1117]">
      {children}
    </div>
  );
}
