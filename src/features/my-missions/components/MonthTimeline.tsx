import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import type { TeamTask } from '@/features/board/types';

import { getTaskColorClass } from '../utils/timelineStyles';

interface MonthTimelineProps {
  selectedDate: Date;
  tasks: TeamTask[];
  onDateChange: (date: Date) => void;
  onTaskClick: (task: TeamTask) => void;
  selectedTaskId: string | null;
  view: 'day' | 'week' | 'month' | 'year';
  onViewChange: (v: 'day' | 'week' | 'month' | 'year') => void;
}

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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

export default function MonthTimeline({
  selectedDate,
  tasks,
  onDateChange,
  onTaskClick,
  selectedTaskId,
  view,
  onViewChange,
}: MonthTimelineProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday-based offset
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;

    const totalDays = lastDay.getDate();

    const days: Array<{ date: Date; key: string; isCurrentMonth: boolean; tasks: TeamTask[] }> = [];

    // Prev month
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLast - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: d,
        key,
        isCurrentMonth: false,
        tasks: tasks.filter((t) => t.dueDate?.startsWith(key)),
      });
    }

    // Current month
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().slice(0, 10);
      days.push({
        date,
        key,
        isCurrentMonth: true,
        tasks: tasks.filter((t) => t.dueDate?.startsWith(key)),
      });
    }

    // Next month remaining
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      const key = date.toISOString().slice(0, 10);
      days.push({
        date,
        key,
        isCurrentMonth: false,
        tasks: tasks.filter((t) => t.dueDate?.startsWith(key)),
      });
    }

    return days;
  }, [year, month, tasks]);

  const goPrev = () => onDateChange(new Date(year, month - 1, 1));
  const goNext = () => onDateChange(new Date(year, month + 1, 1));

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-grey-150 shadow-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-grey-150"
        style={{
          background: 'linear-gradient(135deg, #5961F9 0%, #60AFFF 100%)',
        }}
      >
        <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-xl p-0.5">
          {(['day', 'week', 'month', 'year'] as const).map((v) => {
            const labels = { day: 'Día', week: 'Semana', month: 'Mes', year: 'Año' };
            const isActive = view === v;
            return (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`
                  px-3 py-1 font-body text-xs font-bold rounded-lg transition-all
                  ${isActive ? 'bg-white text-blue shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10 cursor-pointer'}
                `}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/90 font-body capitalize">
            {MONTH_NAMES[month]} {year}
          </span>
          <div className="flex items-center gap-0.5">
            <button onClick={goPrev} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
              <ChevronLeft size={14} className="text-white" />
            </button>
            <button onClick={goNext} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
              <ChevronRight size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col min-h-0 bg-grey-50">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-grey-150 bg-white shrink-0">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="py-2 text-xs font-bold text-grey-400 text-center uppercase tracking-widest font-body"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-grey-150 min-h-0">
          {calendarDays.map(({ date, key, isCurrentMonth, tasks: dayTasks }) => {
            const isToday = key === todayKey;

            return (
              <div
                key={key}
                className={`
                  flex flex-col min-w-0 bg-white p-1 overflow-hidden
                  ${isCurrentMonth ? '' : 'bg-grey-50 opacity-60'}
                `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-body mb-1 shrink-0
                    ${isToday ? 'bg-blue text-white shadow-neonBlue mx-auto mt-0.5' : 'text-grey-700 ml-1'}
                  `}
                >
                  {date.getDate()}
                </div>

                <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar px-1 pb-1">
                  {dayTasks.map((t) => {
                    const isActive = selectedTaskId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => onTaskClick(t)}
                        className={`
                          w-full text-left px-1.5 py-1 rounded-[4px] text-xs font-bold font-body truncate transition-transform
                          ${getTaskColorClass(t.status)}
                          ${isActive ? 'ring-2 ring-grey-800 ring-offset-1 scale-[1.05]' : 'hover:brightness-110'}
                        `}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
