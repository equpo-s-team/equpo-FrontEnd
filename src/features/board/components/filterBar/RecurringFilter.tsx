import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, ChevronDownIcon, Repeat } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FilterPanelFooter } from '@/components/ui/FilterPanelFooter.tsx';
import { CheckRow } from '@/features/board/components/filterBar/CheckRow.tsx';
import {
  INTERVAL_LABELS,
  RECURRING_STATES,
  type recurringFilterProp,
  type RecurringInterval,
} from '@/features/board/types';

import { Pill } from '../../../../components/ui/Pill.tsx';
import { DropPanel } from './DropPanel';

export function RecurringFilter({
  isRecurring,
  onIsRecurringChange,
  interval,
  onIntervalChange,
  count,
  onCountChange,
}: recurringFilterProp) {
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
                    <DropdownMenuItem
                      key={val}
                      onClick={() => onIntervalChange(val as RecurringInterval)}
                    >
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

        <FilterPanelFooter
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
