import {ChevronDown, Tag} from "lucide-react";
import {useState} from "react";

import {FilterPanelFooter} from "@/components/ui/FilterPanelFooter.tsx";
import {Pill} from "@/components/ui/Pill.tsx";
import {DropPanel} from "@/features/board/components/filterBar/DropPanel.tsx";
import {type categoriesFilterProp, CATEGORY_PALETTE, type categoryPillProp} from "@/features/board/types";

function getCategoryStyle(label:string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}

export function CategoryPill({ label, selected, onClick } :  categoryPillProp) {
  const cfg = getCategoryStyle(label);
  return (
    <button
      onClick={onClick}
      className={`
        px-2.5 py-1 rounded-xl text-[12px] font-medium border-[1.5px]
        transition-all duration-150 cursor-pointer
        ${cfg.bg} ${cfg.text} ${cfg.border}
        ${selected ? 'ring-2 ring-offset-0 ring-current' : 'opacity-70 hover:opacity-100'}
      `}
    >
      {label}
    </button>
  );
}

export function CategoriesFilter({ categories, selected, onChange }: categoriesFilterProp) {
  const [open, setOpen] = useState(false);
  const toggle = (cat:string) =>
    onChange(selected.includes(cat) ? selected.filter((c) => c !== cat) : [...selected, cat]);

  const label =
    selected.length === 0
      ? 'Categorías'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} categorías`;

  return (
    <div className="relative">
      <Pill active={selected.length > 0} onClick={() => setOpen((o) => !o)}>
        <Tag size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)}>
        <div className="p-3">
          {categories.length === 0 ? (
            <p className="text-[12px] text-grey-400 py-2 text-center">No hay categorías</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  selected={selected.includes(cat)}
                  onClick={() => toggle(cat)}
                />
              ))}
            </div>
          )}
        </div>
        <FilterPanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}
