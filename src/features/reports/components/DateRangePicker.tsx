import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  onRangeChange?: (days: number) => void;
}

export function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>({});

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || {});

    if (range?.from && range?.to) {
      const days = Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1;
      onRangeChange?.(days);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2.5 bg-white dark:bg-gray-800 border rounded-xl px-4 py-2.5 
            shadow-sm transition-all duration-200 select-none text-left w-[340px] sm:w-[390px]
            hover:border-[rgba(96,175,255,0.5)] hover:shadow-[0_0_0_3px_rgba(96,175,255,0.1)]"
        >
          <CalendarIcon className="h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'dd MMM', { locale: es })} -{' '}
                {format(dateRange.to, 'dd MMM yyyy', { locale: es })}
              </>
            ) : (
              format(dateRange.from, 'dd MMM yyyy', { locale: es })
            )
          ) : (
            <span className="text-sm font-medium text-grey-700 dark:text-gray-300">
              Seleccionar rango
            </span>
          )}
          <ChevronDownIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-gray-800 border border-grey-200 dark:border-gray-700 rounded-2xl shadow-lg"
        align="start"
      >
        <Calendar
          mode="range"
          selected={{
            from: dateRange?.from,
            to: dateRange?.to,
          }}
          onSelect={handleDateRangeChange}
          locale={es}
          numberOfMonths={2}
          className="rounded-2xl"
          required={false}
        />
      </PopoverContent>
    </Popover>
  );
}
