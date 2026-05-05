'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, ChevronDownIcon, Clock } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FieldLabel } from '@/components/ui/FieldLabel.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  required?: boolean;
  showLabel?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Fecha y hora',
  className = '',
  error = false,
  required = false,
  showLabel = true,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [time, setTime] = React.useState<string>(
    value ? value.split('T')[1]?.slice(0, 5) || '12:00' : '12:00',
  );

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
        setTime(value.split('T')[1]?.slice(0, 5) || '12:00');
      }
    } else {
      setDate(undefined);
      setTime('12:00');
    }
  }, [value]);

  const buildIso = (d: Date, t: string) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${t}`;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onChange(buildIso(selectedDate, time));
    } else {
      setDate(undefined);
      onChange('');
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    const base = date ?? new Date();
    onChange(buildIso(base, newTime));
    if (!date) setDate(base);
  };

  const displayLabel = date ? `${format(date, 'd MMM yyyy', { locale: es })}  ${time}` : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <FieldLabel required={required}>
          <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
          Fecha y Hora Límite
        </FieldLabel>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between text-left font-normal font-body text-sm ${error ? 'border-red' : 'border-grey-200 dark:border-gray-600 hover:border-blue focus:border-blue'
              } ${!displayLabel ? 'text-grey-400 dark:text-grey-500' : 'text-grey-800 dark:text-gray-300'} bg-primary dark:bg-gray-800`}
          >
            <span className="truncate">{displayLabel ?? placeholder}</span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-grey-400 dark:text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 rounded-2xl border-grey-150 dark:border-gray-700 shadow-card"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            locale={es}
            initialFocus
          />
          {/* Time selector inside the popover */}
          <div className="border-t bg-primary dark:bg-gray-800 border-grey-100 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-grey-400 dark:text-gray-300 shrink-0" />
              <span className="text-xs text-grey-500 dark:text-gray-300 font-body font-medium">Hora límite</span>
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="ml-auto w-28 px-2 py-1 rounded-lg border border-grey-200 dark:border-gray-700 text-sm font-body text-grey-800 dark:text-gray-300 outline-none focus:border-blue transition-colors bg-white appearance-none dark:bg-gray-800 [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
