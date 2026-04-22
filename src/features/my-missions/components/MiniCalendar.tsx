import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as React from 'react';

import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { TeamTask } from '@/features/board/types';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasksByDate: Map<string, TeamTask[]>;
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Custom DayButton con puntos para tareas
function TaskDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof CalendarDayButton>) {
  const hasTask = modifiers.hasTask;

  return (
    <CalendarDayButton
      className={cn(
        className,
        "relative"
      )}
      day={day}
      modifiers={modifiers}
      {...props}
    >
      {day.date.getDate()}
      {hasTask && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
          <div className="w-1 h-1 bg-blue-500 rounded-full" />
        </div>
      )}
    </CalendarDayButton>
  );
}

export default function MiniCalendar({
  selectedDate,
  onDateSelect,
  tasksByDate,
}: MiniCalendarProps) {
  return (
    <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-grey-800 font-body truncate">
          {format(selectedDate, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="text-xs text-grey-500 flex-shrink-0 ml-2">
          {tasksByDate.get(toDateKey(selectedDate))?.length || 0} tareas
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-left font-normal">
            {format(selectedDate, 'PPP', { locale: es })}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) onDateSelect(date);
            }}
            defaultMonth={selectedDate}
            locale={es}
            modifiers={{
              hasTask: (date) => {
                return !!tasksByDate.get(toDateKey(date))?.length;
              },
            }}
            modifiersStyles={{
              hasTask: {
                position: 'relative',
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
