import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { DateRangePicker } from './DateRangePicker.tsx';

interface FilterBarProps {
  setActiveDays: (days: number) => void;
}

export default function FilterBar({ setActiveDays }: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div
        className="
        hidden md:flex
        sticky top-[62px] z-40
        w-full
        bg-primary border-b border-grey-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        px-8 py-2.5 items-center gap-2.5 flex-wrap
      "
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.9px] text-grey-400 mr-1 shrink-0">
          Filtros
        </span>

        <div className="w-px h-5 bg-grey-200 shrink-0" />

        <DateRangePicker onRangeChange={setActiveDays} />

        <div className="w-px h-5 bg-grey-200 shrink-0" />
      </div>

      <div
        className="
        flex md:hidden
        sticky top-14 z-40
        bg-primary border-b border-grey-200
        px-4 py-2 items-center justify-between
      "
      >
        <span className="text-[12px] font-semibold text-grey-600">
          Sprint 7 - Modulo de Reportes
        </span>
        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border-[1.5px] font-body transition-all duration-200"
        >
          <SlidersHorizontal size={13} />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="
          flex md:hidden flex-col gap-3
          bg-primary border-b border-grey-200
          px-4 py-3 sticky top-[calc(56px+41px)] z-30
          shadow-[0_4px_12px_rgba(0,0,0,0.06)]
          animate-fade-down
        "
        >
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.9px] text-grey-400">
              Usuarios
            </span>
            <DateRangePicker onRangeChange={setActiveDays} />
          </div>
        </div>
      )}
    </>
  );
}
