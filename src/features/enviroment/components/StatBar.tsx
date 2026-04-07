interface StatBarProps {
  label: string;
  value: number;
  max: number;
  fillClass: string;
  valueColorClass: string;
  icon: React.ReactNode;
}

export default function StatBar({
  label,
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
      backdrop-blur-md rounded-[12px]
      px-3.5 py-3 min-w-[130px]
    "
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-grey-600">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-grey-700">
          {label}
        </span>
      </div>
      <div className={`font-maxwell text-[22px] font-bold leading-none ${valueColorClass}`}>
        {Math.round(value)}
      </div>
      <div className="text-[10px] text-grey-600 mt-0.5">de {max}</div>
      <div className="h-[3px] bg-white/[0.07] rounded-full mt-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
