import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarDays,
  ChevronDown,
  ChevronDownIcon,
  Plus,
  Repeat,
  RotateCcw,
  SlidersHorizontal,
  Tag,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { TAG_COLOR_CONFIG } from './columnConfig.js';

function Pill({ active, children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px]
        font-body text-[12px] cursor-pointer whitespace-nowrap select-none
        transition-all duration-200
        ${active ? 'border-blue text-blue bg-blue/8' : 'border-grey-200 text-grey-500 bg-primary hover:border-blue hover:text-blue hover:bg-blue/5'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function DropPanel({ open, onClose, children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`
        absolute top-[calc(100%+8px)] left-0 z-[300]
        bg-primary border-[1.5px] border-grey-200
        rounded-[10px] shadow-card-lg
        overflow-hidden animate-fade-down
        min-w-60
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function PanelFooter({ onClear, onApply }) {
  return (
    <div className="px-3 py-2 border-t border-grey-100 flex justify-between items-center">
      <button
        onClick={onClear}
        className="text-[12px] text-grey-400 hover:text-red transition-colors font-body cursor-pointer"
      >
        Limpiar
      </button>
      <button
        onClick={onApply}
        className="text-[12px] font-semibold text-blue bg-blue/8 border border-blue/25 px-3 py-1 rounded-lg hover:bg-blue/14 transition-colors font-body cursor-pointer"
      >
        Aplicar
      </button>
    </div>
  );
}

function CheckRow({ label, icon, checked, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 cursor-pointer transition-colors duration-150 ${checked ? 'bg-blue/6' : 'hover:bg-grey-50'}`}
    >
      {icon && <span className="text-[13px] shrink-0">{icon}</span>}
      <span className="flex-1 text-left text-[13px] font-medium text-grey-800">{label}</span>
      <div
        className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center text-[10px] shrink-0 transition-all duration-150 ${checked ? 'bg-blue border-blue text-white' : 'border-grey-300'}`}
      >
        {checked && '✓'}
      </div>
    </button>
  );
}

const CATEGORY_PALETTE = [
  TAG_COLOR_CONFIG.blue,
  TAG_COLOR_CONFIG.green,
  TAG_COLOR_CONFIG.cyan,
  TAG_COLOR_CONFIG.purple,
  TAG_COLOR_CONFIG.orange,
  TAG_COLOR_CONFIG.red,
];

function getCategoryStyle(label) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}

function CategoryPill({ label, selected, onClick }) {
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

function CategoriesFilter({ categories, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const toggle = (cat) =>
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
        <PanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}

const PRIORITY_ITEMS = [
  { value: 'high', label: 'Alta', dot: 'bg-red' },
  { value: 'medium', label: 'Media', dot: 'bg-orange-dark' },
  { value: 'low', label: 'Baja', dot: 'bg-green' },
];

function PriorityFilter({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const toggle = (val) =>
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
              checked={selected.includes(item.value)}
              onClick={() => toggle(item.value)}
            />
          ))}
        </div>
        <PanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}

function DueDateFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const label = value
    ? `Antes del ${new Date(value + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
    : 'Fecha límite';

  return (
    <div className="relative">
      <Pill active={Boolean(value)} onClick={() => setOpen((o) => !o)}>
        <CalendarDays size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)}>
        <div className="p-3">
          <p className="text-[11px] font-semibold text-grey-500 uppercase tracking-wide mb-2">
            Mostrar tareas antes de:
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150"
              >
                {value ? format(new Date(value), 'PPP', { locale: es }) : 'Seleccionar fecha'}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    onChange(date.toISOString().split('T')[0]);
                  } else {
                    onChange(null);
                  }
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
        <PanelFooter onClear={() => onChange(null)} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}

const RECURRING_STATES = [
  { value: null, label: 'Todas' },
  { value: true, label: 'Solo recurrentes' },
  { value: false, label: 'Solo no recurrentes' },
];

const INTERVAL_LABELS = {
  days: 'Días',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
};

function RecurringFilter({
  isRecurring,
  onIsRecurringChange,
  interval,
  onIntervalChange,
  count,
  onCountChange,
}) {
  const [open, setOpen] = useState(false);

  const parts = [];
  if (isRecurring === true) parts.push('Recurrentes');
  if (isRecurring === false) parts.push('No recurrentes');
  if (interval) parts.push(INTERVAL_LABELS[interval]);
  if (count !== null) parts.push(`cada ${count}`);
  const label = parts.length > 0 ? parts.join(' · ') : 'Recurrencia';

  return (
    <div className="relative">
      <Pill active={isRecurring !== null} onClick={() => setOpen((o) => !o)}>
        <Repeat size={12} />
        <span className="max-w-[160px] truncate">{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)} className="min-w-[240px]">
        <div className="py-1.5">
          {RECURRING_STATES.map((item) => (
            <CheckRow
              key={String(item.value)}
              label={item.label}
              checked={isRecurring === item.value}
              onClick={() => {
                onIsRecurringChange(item.value);
                if (item.value !== true) {
                  onIntervalChange(null);
                  onCountChange(null);
                }
              }}
            />
          ))}
        </div>

        {isRecurring === true && (
          <div className="px-3 pb-3 space-y-3 border-t border-grey-100 pt-3">
            <div>
              <p className="text-[11px] font-semibold text-grey-500 uppercase tracking-wide mb-1.5">
                Intervalo
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full px-3 py-2 rounded-[8px] border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 justify-between"
                  >
                    {interval ? INTERVAL_LABELS[interval] : 'Todos'}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="start">
                  <DropdownMenuItem onClick={() => onIntervalChange(null)}>Todos</DropdownMenuItem>
                  {Object.entries(INTERVAL_LABELS).map(([val, lbl]) => (
                    <DropdownMenuItem key={val} onClick={() => onIntervalChange(val)}>
                      {lbl}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-grey-500 uppercase tracking-wide mb-1.5">
                Cada (cantidad)
              </p>
              <input
                type="number"
                min={1}
                max={365}
                value={count ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onCountChange(val ? Math.max(1, Number(val)) : null);
                }}
                placeholder="Ej: 3"
                className="w-full px-3 py-2 rounded-[8px] border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 placeholder:text-grey-400"
              />
            </div>
          </div>
        )}

        <PanelFooter
          onClear={() => {
            onIsRecurringChange(null);
            onIntervalChange(null);
            onCountChange(null);
          }}
          onApply={() => setOpen(false)}
        />
      </DropPanel>
    </div>
  );
}

function AssignedUserFilter({ members, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const toggle = (uid) =>
    onChange(selected.includes(uid) ? selected.filter((u) => u !== uid) : [...selected, uid]);

  const filtered = members.filter((m) =>
    (m.displayName || m.uid).toLowerCase().includes(query.toLowerCase()),
  );

  const label =
    selected.length === 0
      ? 'Persona'
      : selected.length === 1
        ? (members.find((m) => m.uid === selected[0])?.displayName ?? selected[0])
        : `${selected.length} personas`;

  return (
    <div className="relative">
      <Pill active={selected.length > 0} onClick={() => setOpen((o) => !o)}>
        <Users size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)} className="min-w-[240px]">
        <div className="px-3 pt-3 pb-2 border-b border-grey-100">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar usuario…"
            className="w-full px-2.5 py-2 rounded-[7px] bg-secondary border-[1.5px] border-transparent focus:border-blue focus:bg-blue/5 text-[13px] font-body text-grey-800 placeholder:text-grey-400 outline-none transition-all duration-200"
          />
        </div>

        <div className="max-h-[210px] overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-[12px] text-grey-400 py-4">Sin resultados</p>
          ) : (
            filtered.map((m) => (
              <CheckRow
                key={m.uid}
                label={m.displayName || m.uid}
                checked={selected.includes(m.uid)}
                onClick={() => toggle(m.uid)}
              />
            ))
          )}
        </div>
        <PanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}

function AssignedGroupFilter({ groups, selected, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((g) => g !== id) : [...selected, id]);

  const label =
    selected.length === 0
      ? 'Grupo'
      : selected.length === 1
        ? (groups.find((g) => g.id === selected[0])?.groupName ?? selected[0])
        : `${selected.length} grupos`;

  return (
    <div className="relative">
      <Pill active={selected.length > 0} onClick={() => setOpen((o) => !o)}>
        <Users size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)}>
        <div className="py-1.5">
          {groups.length === 0 ? (
            <p className="text-center text-[12px] text-grey-400 py-4">No hay grupos</p>
          ) : (
            groups.map((g) => (
              <CheckRow
                key={g.id}
                label={g.groupName}
                checked={selected.includes(g.id)}
                onClick={() => toggle(g.id)}
              />
            ))
          )}
        </div>
        <PanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}


export default function FilterBar({
  filters,
  setFilter,
  resetFilters,
  activeFilterCount,
  allCategories,
  members,
  groups,
  onCreateTask,
}) {
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
        bg-primary border-b border-grey-200
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

      {/* Mobile panel */}
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
