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
      className={cn(className, 'relative')}
      day={day}
      modifiers={modifiers}
      {...props}
    >
      {day.date.getDate()}
      {hasTask && (
        <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5 sm:bottom-1 sm:gap-1">
          <div
            className={cn(
              'h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5',
              hasOverdueTask ? 'bg-red' : 'bg-blue-500',
            )}
          />
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
    <div className="w-full rounded-xl border border-grey-150 dark:border-gray-700 bg-white dark:bg-gray-800 px-[1vw] py-[2vh] shadow-card sm:rounded-2xl">
      <div className="w-full overflow-visible">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) onDateSelect(date);
          }}
          defaultMonth={selectedDate}
          locale={es}
          className="w-full p-0"
          modifiers={{
            hasTask: (date) => {
              return !!tasksByDate.get(toDateKey(date))?.length;
            },
            hasOverdueTask: (date) => {
              const tasks = tasksByDate.get(toDateKey(date));
              if (!tasks || tasks.length === 0) return false;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return tasks.some((task) => {
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate < today && task.status !== 'done';
              });
            },
          }}
          components={{
            DayButton: TaskDayButton,
          }}
        />
      </div>
    </div>
  );
}
