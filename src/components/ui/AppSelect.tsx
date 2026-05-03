import { type ReactNode } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils/utils.ts';

export interface AppSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  color?: string;
}

interface AppSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

/* Radix Select.Item forbids value="". Use a private sentinel so callers
   can keep passing empty strings for "unassigned / none" options. */
const NONE_VALUE = '__none__';

export function AppSelect({
  value,
  onChange,
  options,
  disabled,
  className,
  triggerClassName,
}: AppSelectProps) {
  const internalValue = value === '' ? NONE_VALUE : value;

  const internalOptions = options.map((o) => (o.value === '' ? { ...o, value: NONE_VALUE } : o));

  const current = internalOptions.find((o) => o.value === internalValue);

  function handleChange(v: string) {
    onChange(v === NONE_VALUE ? '' : v);
  }

  return (
    <Select value={internalValue} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'h-auto border-grey-150 rounded-xl text-xs font-body text-grey-700 bg-white hover:border-grey-300 focus:ring-0 focus:ring-offset-0 px-2.5 py-1.5',
          triggerClassName,
        )}
      >
        {current ? (
          <span
            className="flex items-center gap-1.5 font-semibold"
            style={current.color ? { color: current.color } : undefined}
          >
            {current.icon}
            {current.label}
          </span>
        ) : (
          <span className="text-grey-400">Seleccionar</span>
        )}
      </SelectTrigger>
      <SelectContent className={cn('rounded-xl border-grey-150 font-body text-xs', className)}>
        {internalOptions.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-lg cursor-pointer focus:bg-secondary"
          >
            <span className="flex items-center gap-2">
              {opt.icon}
              <span style={opt.color ? { color: opt.color } : undefined} className="font-semibold">
                {opt.label}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
