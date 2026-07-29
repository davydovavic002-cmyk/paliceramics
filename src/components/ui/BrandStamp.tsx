/** Hanko-style studio seal */
export function BrandStamp({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-16 w-16 items-center justify-center border-2 border-[#8a8580]/45 bg-[#2e2e32]/60 shadow-[inset_0_0_0_2px_rgba(200,196,188,0.06),0_2px_8px_rgba(0,0,0,0.12)] [border-radius:48%_52%_50%_50%_/_50%_48%_52%_50%] ${className}`}
      aria-hidden
    >
      <span className="absolute inset-[5px] rounded-full border border-[#a8a4a0]/15" />
      <span className="font-display text-2xl text-porcelain/55">陶</span>
    </div>
  );
}
