import { WorkshopFormatsDemoLab } from "@/components/demo/WorkshopFormatsDemoLab";

export default function WorkshopFormatsDemoPage() {
  return (
    <div className="min-h-[100dvh] bg-theme-surface text-theme transition-colors duration-700">
      <div className="mx-auto max-w-[1400px] px-4 py-10 pt-28 sm:px-6 sm:py-14">
        <WorkshopFormatsDemoLab />
      </div>
    </div>
  );
}
