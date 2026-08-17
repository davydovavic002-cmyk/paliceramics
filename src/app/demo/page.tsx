import { FloatingControls } from "@/components/demo/FloatingControls";
import { ButtonVariantsLab } from "@/components/demo/ButtonVariantsLab";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col gap-8 px-4 py-10 sm:py-14">
      <FloatingControls />
      <nav className="flex flex-col gap-2 font-body text-[10px] uppercase tracking-[0.18em] text-theme-muted">
        <Link href="/demo/catalog-cards" className="hover:text-theme">
          Catalog cards A / B / C →
        </Link>
        <Link href="/demo/workshop-formats" className="hover:text-theme">
          Workshop copy layouts A / B →
        </Link>
      </nav>
      <ButtonVariantsLab />
    </div>
  );
}
