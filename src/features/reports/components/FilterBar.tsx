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
        bg-primary dark:bg-gray-800 border-b border-grey-200 dark:border-gray-700
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        px-8 py-2.5 items-center gap-2.5 flex-wrap
      "
      >
        <span className="text-xs font-bold uppercase tracking-[0.9px] text-grey-400 dark:text-grey-500 mr-1 shrink-0">
          Filtros
        </span>

        <div className="w-px h-5 bg-grey-200 dark:bg-gray-700 shrink-0" />

        <DateRangePicker onRangeChange={setActiveDays} />

        <div className="w-px h-5 bg-grey-200 dark:bg-gray-700 shrink-0" />
      </div>

      <div
        className="
        flex md:hidden
        sticky top-14 z-40
        bg-primary dark:bg-gray-800 border-b border-grey-200 dark:border-gray-700
        px-4 py-2 items-center justify-between
      "
      >
        <span className="text-xs font-semibold text-grey-600 dark:text-grey-400">Sprint 7 - Modulo de Reportes</span>
        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border-[1.5px] border-grey-200 dark:border-gray-600 text-grey-600 dark:text-grey-400 font-body transition-all duration-200"
        >
          <SlidersHorizontal size={13} />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="
          flex md:hidden flex-col gap-3
          bg-primary dark:bg-gray-800 border-b border-grey-200 dark:border-gray-700
          px-4 py-3 sticky top-[calc(56px+41px)] z-30
          shadow-[0_4px_12px_rgba(0,0,0,0.06)]
          animate-fade-down
        "
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.9px] text-grey-400 dark:text-grey-500">
              Usuarios
            </span>
            <DateRangePicker onRangeChange={setActiveDays} />
          </div>
        </div>
      )}
    </>
  );
}
