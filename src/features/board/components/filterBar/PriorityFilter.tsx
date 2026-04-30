import { ChevronDown, Zap} from "lucide-react";
import {useState} from "react";

import {FilterPanelFooter} from "@/components/ui/FilterPanelFooter.tsx";
import { Pill } from "@/components/ui/Pill.tsx";
import {CheckRow} from "@/features/board/components/filterBar/CheckRow.tsx";
import {DropPanel} from "@/features/board/components/filterBar/DropPanel.tsx";

import {PRIORITY_ITEMS, type priorityFilterProp, type TaskPriority} from "../../types";

export function PriorityFilter({ selected, onChange }: priorityFilterProp) {
  const [open, setOpen] = useState(false);
  const toggle = (val: TaskPriority) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  const label =
    selected.length === 0
      ? 'Prioridad'
      : selected.length === 1
        ? (PRIORITY_ITEMS.find((p) => p.value === selected[0])?.label ?? selected[0])
        : `${selected.length} prioridades`;

  return (
    <div className="relative">
    <Pill active={selected.length > 0} onClick={() => setOpen((o) => !o)}>
  <Zap size={12} />
  <span>{label}</span>
  <ChevronDown
  size={11}
  className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  />
  </Pill>
  <DropPanel open={open} onClose={() => setOpen(false)}>
  <div className="py-1.5">
    {PRIORITY_ITEMS.map((item) => (
        <CheckRow
          key={item.value}
      icon={<div className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />}
  label={item.label}
  checked={selected.includes(item.value as TaskPriority)}
  onClick={() => toggle(item.value as TaskPriority)}
  />
))}
  </div>
  <FilterPanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
  </DropPanel>
  </div>
);
}
