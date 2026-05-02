import { Plus, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import {
  AssignedGroupFilter,
  AssignedUserFilter,
} from '@/features/board/components/filterBar/AssignedEntityFilter.tsx';
import { CategoriesFilter } from '@/features/board/components/filterBar/CategoriesFilter.tsx';
import { DueDateFilter } from '@/features/board/components/filterBar/DueDateFilter.tsx';
import { PriorityFilter } from '@/features/board/components/filterBar/PriorityFilter.tsx';
import { RecurringFilter } from '@/features/board/components/filterBar/RecurringFilter.tsx';
import { type filterBarProp } from '@/features/board/types';

export default function FilterBar({
  filters,
  setFilter,
  resetFilters,
  activeFilterCount,
  allCategories,
  members,
  groups,
  onCreateTask,
  canCreateTask = true,
}: filterBarProp) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const divider = <div className="w-px h-5 bg-grey-200 shrink-0" />;

  const filterControls = (
    <>
      <CategoriesFilter
        categories={allCategories}
        selected={filters.categories}
        onChange={(v) => setFilter('categories', v)}
      />

      {divider}

      <PriorityFilter selected={filters.priorities} onChange={(v) => setFilter('priorities', v)} />

      {divider}

      <DueDateFilter
        value={filters.dueDateBefore}
        onChange={(v) => setFilter('dueDateBefore', v)}
      />

      {divider}

      <RecurringFilter
        isRecurring={filters.isRecurring}
        onIsRecurringChange={(v) => setFilter('isRecurring', v)}
        interval={filters.recurringInterval}
        onIntervalChange={(v) => setFilter('recurringInterval', v)}
        count={filters.recurringCount}
        onCountChange={(v) => setFilter('recurringCount', v)}
      />

      {divider}

      <AssignedUserFilter
        members={members}
        selected={filters.assignedUserUids}
        onChange={(v) => setFilter('assignedUserUids', v)}
      />

      {divider}

      <AssignedGroupFilter
        groups={groups}
        selected={filters.assignedGroupIds}
        onChange={(v) => setFilter('assignedGroupIds', v)}
      />

      {/* Reset button */}
      {activeFilterCount > 0 && (
        <>
          {divider}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px] border-red/30 text-red text-[12px] font-semibold bg-red/5 hover:bg-red/10 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw size={11} />
            Limpiar todo
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Desktop filter bar */}
      <div
        className="
        hidden md:flex
        sticky top-[62px] z-40
        bg-primary dark:bg-gray-700 border-b border-grey-200 dark:border-gray-600
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        px-8 py-2.5 items-center gap-2.5 flex-wrap
        justify-between
      "
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.9px] text-grey-400 mr-1 shrink-0">
            Filtros
          </span>
          {filterControls}
        </div>
        {canCreateTask && (
          <button
            onClick={onCreateTask}
            id="crear-mision-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white
              bg-gradient-blue-bg
              shadow-neonBlue hover:shadow transition-all duration-200 cursor-pointer shrink-0 mr-2 font-body"
          >
            <Plus size={13} strokeWidth={2.5} />
            Crear Misión
          </button>
        )}
      </div>

      {/* Mobile toggle */}
      <div
        className="
        flex md:hidden
        sticky top-14 z-40
        bg-primary border-b border-grey-200
        px-4 py-2 items-center justify-between gap-2
      "
      >
        {canCreateTask && (
          <button
            onClick={onCreateTask}
            id="crear-mision-btn-mobile"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white
              bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400
              transition-all duration-200 cursor-pointer font-body shrink-0"
          >
            <Plus size={12} strokeWidth={2.5} />
            Crear Misión
          </button>
        )}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border-[1.5px] font-body transition-all duration-200 cursor-pointer
            ${mobileOpen || activeFilterCount > 0 ? 'border-blue text-blue bg-blue/8' : 'border-grey-200 text-grey-500'}
          `}
        >
          <SlidersHorizontal size={13} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="bg-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
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
          <div className="flex flex-wrap gap-2">{filterControls}</div>
        </div>
      )}
    </>
  );
}
