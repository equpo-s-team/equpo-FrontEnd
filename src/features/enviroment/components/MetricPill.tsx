interface MetricPillProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}

export default function MetricPill({ icon, label, value, accent }: MetricPillProps) {
  return (
    <div
      className="
      flex items-center gap-2
      bg-white/20 border border-white/[0.08]
      backdrop-blur-md rounded-[10px]
      px-3 py-2
    "
    >
      <span className={accent ? 'text-grey-700' : 'text-grey-600'}>{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-grey-700 whitespace-nowrap">
        {label}
      </span>
      <span className="text-[13px] font-bold text-grey-800 whitespace-nowrap">{value}</span>
    </div>
  );
}
