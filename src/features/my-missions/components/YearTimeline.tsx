import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import type { TeamTask } from '@/features/board/types';
import { isTaskOverdue } from '@/features/board/utils/taskUtils';

import { getTaskDotClass } from '../utils/timelineStyles';

interface YearTimelineProps {
  selectedDate: Date;
  tasks: TeamTask[];
  onDateChange: (date: Date) => void;
  view: 'day' | 'week' | 'month' | 'year';
  onViewChange: (v: 'day' | 'week' | 'month' | 'year') => void;
}

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

export default function YearTimeline({
  selectedDate,
  tasks,
  onDateChange,
  view,
  onViewChange,
}: YearTimelineProps) {
  const year = selectedDate.getFullYear();

  const monthsData = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      // Find tasks for this month
      // monthIndex is 0-11. padStart required for string comparison
      const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const monthTasks = tasks.filter((t) => t.dueDate?.startsWith(monthPrefix));

      const todo = monthTasks.filter((t) => t.status === 'todo');
      const inProgress = monthTasks.filter((t) => t.status === 'in-progress');
      const inQa = monthTasks.filter((t) => t.status === 'in-qa');
      const done = monthTasks.filter((t) => t.status === 'done');
      const overdue = monthTasks.filter((t) => isTaskOverdue(t));

      return {
        monthIndex,
        total: monthTasks.length,
        todo,
        inProgress,
        inQa,
        done,
        overdue,
      };
    });
  }, [year, tasks]);

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setFullYear(year - 1);
    onDateChange(d);
  };

  const goNext = () => {
    const d = new Date(selectedDate);
    d.setFullYear(year + 1);
    onDateChange(d);
  };

  const currentMonthIdx = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-grey-150 shadow-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-grey-150 shrink-0"
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
          <span className="text-xs font-semibold text-white/90 font-body capitalize">{year}</span>
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
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {monthsData.map((data) => {
            const isCurrentMonth = data.monthIndex === currentMonthIdx && year === currentYear;

            return (
              <div
                key={data.monthIndex}
                onClick={() => {
                  const d = new Date(year, data.monthIndex, 1);
                  onDateChange(d);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const d = new Date(year, data.monthIndex, 1);
                    onDateChange(d);
                  }
                }}
                className={`
                  p-4 rounded-2xl border-[1.5px] cursor-pointer transition-all duration-200
                  hover:-translate-y-1 hover:shadow-card
                  ${isCurrentMonth ? 'border-blue bg-blue/5' : 'border-grey-150 bg-white hover:border-grey-200'}
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-sm font-bold font-body ${isCurrentMonth ? 'text-blue' : 'text-grey-800'}`}
                  >
                    {MONTH_NAMES[data.monthIndex]}
                  </h3>
                  {data.total > 0 && (
                    <span className="bg-grey-100 text-grey-600 text-xs font-bold px-2 py-0.5 rounded-full font-body">
                      {data.total}
                    </span>
                  )}
                </div>

                {data.total === 0 ? (
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-xs text-grey-400 font-medium font-body flex gap-1">Vacío</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Tiny bars summary */}
                    <div className="h-1.5 w-full bg-grey-100 rounded-full overflow-hidden flex">
                      {data.todo.length > 0 && (
                        <div
                          style={{ width: `${(data.todo.length / data.total) * 100}%` }}
                          className={`${getTaskDotClass('todo')} h-full`}
                        />
                      )}
                      {data.inProgress.length > 0 && (
                        <div
                          style={{ width: `${(data.inProgress.length / data.total) * 100}%` }}
                          className={`${getTaskDotClass('in-progress')} h-full`}
                        />
                      )}
                      {data.inQa.length > 0 && (
                        <div
                          style={{ width: `${(data.inQa.length / data.total) * 100}%` }}
                          className={`${getTaskDotClass('in-qa')} h-full`}
                        />
                      )}
                      {data.done.length > 0 && (
                        <div
                          style={{ width: `${(data.done.length / data.total) * 100}%` }}
                          className={`${getTaskDotClass('done')} h-full`}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${getTaskDotClass('todo')}`} />
                        <span className="text-xs text-grey-600 font-body">
                          {data.todo.length} Por Hacer
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${getTaskDotClass('in-progress')}`}
                        />
                        <span className="text-xs text-grey-600 font-body">
                          {data.inProgress.length} Proceso
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${getTaskDotClass('in-qa')}`} />
                        <span className="text-xs text-grey-600 font-body">
                          {data.inQa.length} En QA
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${getTaskDotClass('done')}`} />
                        <span className="text-xs text-grey-600 font-body">
                          {data.done.length} Completadas
                        </span>
                      </div>
                      {data.overdue.length > 0 && (
                        <div className="flex items-center gap-1.5 col-span-2 pt-1">
                          <div className={`w-2 h-2 rounded-full bg-red`} />
                          <span className="text-xs font-bold text-red font-body">
                            {data.overdue.length} Tarea(s) Vencida(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
