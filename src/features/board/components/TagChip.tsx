const TAG_COLORS = [
  'bg-blue/10 text-[10.5px] text-blue border-blue/50 shadow-[0_0_8px_rgba(96,175,255,0.4)]',
  'bg-kanban-qa/10 text-[10.5px] text-kanban-qa border-kanban-qa/50 shadow-[0_0_8px_rgba(255,148,174,0.4)]',
  'bg-green/10 text-[10.5px] text-green border-green/50 shadow-[0_0_8px_rgba(156,237,193,0.4)]',
  'bg-kanban-todo/10 text-[10.5px] text-kanban-todo border-kanban-todo/50 shadow-[0_0_8px_rgba(155,127,225,0.4)]',
  'bg-red/10 text-[10.5px] text-red border-red/50 shadow-[0_0_8px_rgba(246,90,112,0.4)]',
  'bg-kanban-progress/10 text-[10.5px] text-kanban-progress border-kanban-progress/50 shadow-[0_0_8px_rgba(134,240,253,0.4)]',
];

export function getTagColorClass(label: string = '') {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

interface TagChipProps {
  label: string;
}

export function TagChip({ label }: TagChipProps) {
  const colorClass = getTagColorClass(label);
  return (
    <span
      className={`px-2 py-[2.5px] rounded-[8px] font-semibold tracking-wide border-[1px] ${colorClass}`}
    >
      {label}
    </span>
  );
}
