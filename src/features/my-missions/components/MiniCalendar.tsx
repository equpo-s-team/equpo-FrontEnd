import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import type { TeamTask } from '@/features/board/types';
import { isTaskOverdue } from '@/features/board/utils/taskUtils';

const DAYS_OF_WEEK = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasksByDate: Map<string, TeamTask[]>;
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function MiniCalendar({
  selectedDate,
  onDateSelect,
  tasksByDate,
}: MiniCalendarProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Array<{ date: Date | null; key: string }> = [];

    // Previous month trailing days
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLast - i);
      days.push({ date: d, key: `prev-${prevMonthLast - i}` });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      days.push({ date, key: `cur-${d}` });
    }

    // Next month leading days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push({ date, key: `next-${d}` });
    }

    return days;
  }, [year, month]);

  const today = toDateKey(new Date());
  const selectedKey = toDateKey(selectedDate);

  const goPrev = () => onDateSelect(new Date(year, month - 1, 1));
  const goNext = () => onDateSelect(new Date(year, month + 1, 1));

  return (
    <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-grey-800 font-body">
          {MONTH_NAMES[month]}, {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            className="p-1 rounded-lg hover:bg-grey-100 transition-colors text-grey-500 hover:text-grey-800"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goNext}
            className="p-1 rounded-lg hover:bg-grey-100 transition-colors text-grey-500 hover:text-grey-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-xs font-bold text-grey-400 text-center uppercase tracking-wider py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map(({ date, key }) => {
          if (!date) return <div key={key} />;

          const dateKey = toDateKey(date);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = dateKey === today;
          const isSelected = dateKey === selectedKey;
          const tasksOnDay = tasksByDate.get(dateKey) || [];
          const hasTask = tasksOnDay.length > 0;
          const hasOverdueTask = tasksOnDay.some(isTaskOverdue);

          return (
            <button
              key={key}
              onClick={() => onDateSelect(date)}
              className={`
                relative flex flex-col items-center justify-center
                h-8 rounded-lg text-xs font-medium
                transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'bg-blue text-white shadow-[0_0_12px_rgba(96,175,255,0.5)]'
                    : isToday
                      ? 'bg-purple/15 text-purple font-bold'
                      : isCurrentMonth
                        ? 'text-grey-700 hover:bg-grey-100'
                        : 'text-grey-300'
                }
              `}
            >
              {date.getDate()}
              {hasTask && (
                <span
                  className={`
                    absolute bottom-0.5 w-1 h-1 rounded-full
                    ${hasOverdueTask ? 'bg-red shadow-[0_0_8px_rgba(246,90,112,0.6)]' : isSelected ? 'bg-white' : 'bg-blue'}
                  `}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
