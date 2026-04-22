import { es } from 'date-fns/locale';
import * as React from 'react';

import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
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

function TaskDayButton({
                         className,
                         day,
                         modifiers,
                         ...props
                       }: React.ComponentProps<typeof CalendarDayButton>) {
  const hasTask = modifiers.hasTask;
  const hasOverdueTask = modifiers.hasOverdueTask;

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
          <div className={cn(
            "w-1 h-1 rounded-full",
            hasOverdueTask ? "bg-red-500" : "bg-blue-500"
          )} />
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

      <div className="w-full overflow-visible">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) onDateSelect(date);
          }}
          defaultMonth={selectedDate}
          locale={es}
          className="w-full"
          modifiers={{
            hasTask: (date) => {
              return !!tasksByDate.get(toDateKey(date))?.length;
            },
            hasOverdueTask: (date) => {
              const tasks = tasksByDate.get(toDateKey(date));
              if (!tasks || tasks.length === 0) return false;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return tasks.some(task => {
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate < today && task.status !== 'done';
              });
            }
          }}
          components={{
            DayButton: TaskDayButton
          }}
        />
      </div>
    </div>
  );
}
