interface StatBarProps {
  value: number;
  max: number;
  fillClass: string;
  valueColorClass: string;
  icon: React.ReactNode;
}

export default function StatBar({
  value,
  max,
  fillClass,
  valueColorClass,
  icon,
}: StatBarProps) {
  const pct = Math.round((value / max) * 100);

  return (
    <div
      className="
      bg-white/20 border border-white/[0.08]
      backdrop-blur-md rounded-full
      px-4 py-2 min-w-[12vw]
    "
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between gap-2">
          <span className={`${valueColorClass}`}>{icon}</span>
          <div className={`font-maxwell text-[14px] font-bold leading-none ${valueColorClass}`}>
            {Math.round(value) + '/' + max}
          </div>
        </div>
        <div className="h-[3px] bg-white/[0.07] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${fillClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
