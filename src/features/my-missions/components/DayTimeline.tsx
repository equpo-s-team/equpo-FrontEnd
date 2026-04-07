import { Calendar,ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { getTaskClasses } from '../utils/timelineStyles';


import type { TeamTask } from '@/features/board/types';

const HOUR_HEIGHT = 64; // px per hour slot
const START_HOUR = 6;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR;

const STATUS_LABEL: Record<string, string> = {
  todo: 'Por Hacer',
  'in-progress': 'En Progreso',
  'in-qa': 'En QA',
  done: 'Completada',
};

const DAY_NAMES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles',
  'Jueves', 'Viernes', 'Sábado',
];

const MONTH_NAMES_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

interface DayTimelineProps {
  selectedDate: Date;
  tasks: TeamTask[];
  onDateChange: (date: Date) => void;
  onTaskClick: (task: TeamTask) => void;
  selectedTaskId: string | null;
  view: 'day' | 'week' | 'month' | 'year';
  onViewChange: (v: 'day' | 'week' | 'month' | 'year') => void;
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:00 ${suffix}`;
}

function getTaskHour(task: TeamTask): number {
  if (!task.dueDate) return 9;
  const d = new Date(task.dueDate);
  return d.getHours();
}

/**
 * Assigns a column index (0-based) to each task so overlapping blocks are stacked
 * side by side rather than z-layered on top of each other.
 */
function layoutTasks(tasks: TeamTask[]): Array<{ task: TeamTask; col: number; totalCols: number }> {
  if (tasks.length === 0) return [];

  // Sort by start hour, then by id for stable ordering
  const sorted = [...tasks].sort((a, b) => getTaskHour(a) - getTaskHour(b) || a.id.localeCompare(b.id));

  const BLOCK_DURATION = 1.25; // hours per block

  // Group overlapping tasks
  const groups: TeamTask[][] = [];
  let currentGroup: TeamTask[] = [sorted[0]];
  let groupEnd = getTaskHour(sorted[0]) + BLOCK_DURATION;

  for (let i = 1; i < sorted.length; i++) {
    const taskStart = getTaskHour(sorted[i]);
    if (taskStart < groupEnd) {
      currentGroup.push(sorted[i]);
      groupEnd = Math.max(groupEnd, taskStart + BLOCK_DURATION);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
      groupEnd = taskStart + BLOCK_DURATION;
    }
  }
  groups.push(currentGroup);

  const result: Array<{ task: TeamTask; col: number; totalCols: number }> = [];
  for (const group of groups) {
    for (let i = 0; i < group.length; i++) {
      result.push({ task: group[i], col: i, totalCols: group.length });
    }
  }

  return result;
}

export default function DayTimeline({
  selectedDate,
  tasks,
  onDateChange,
  onTaskClick,
  selectedTaskId,
  view,
  onViewChange,
}: DayTimelineProps) {
  const dateLabel = `${DAY_NAMES[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_NAMES_SHORT[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  };

  const goNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d);
  };

  const laidOut = useMemo(() => layoutTasks(tasks), [tasks]);

  // Current time indicator
  const now = new Date();
  const isToday =
    now.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowOffset =
    ((nowMinutes - START_HOUR * 60) / (TOTAL_HOURS * 60)) * 100;

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-grey-150 shadow-card overflow-hidden">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-grey-150"
        style={{
          background: 'linear-gradient(135deg, #5961F9 0%, #60AFFF 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* View Switcher inside the timeline header */}
          <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-xl p-0.5">
            {(['day', 'week', 'month', 'year'] as const).map((v) => {
              const labels = { day: 'Día', week: 'Semana', month: 'Mes', year: 'Año' };
              const isActive = view === v;
              return (
                <button
                  key={v}
                  onClick={() => onViewChange(v)}
                  className={`
                    px-3 py-1 font-body text-[11px] font-bold rounded-lg transition-all
                    ${isActive ? 'bg-white text-blue shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10 cursor-pointer'}
                  `}
                >
                  {labels[v]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/90 font-body">
            {dateLabel}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={goPrev}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={14} className="text-white" />
            </button>
            <button
              onClick={goNext}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          className="relative ml-16 mr-4 mt-2"
          style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}
        >
          {/* Hour lines */}
          {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
            const hour = START_HOUR + i;
            return (
              <div
                key={hour}
                className="absolute left-0 right-0 flex items-start"
                style={{ top: `${i * HOUR_HEIGHT}px` }}
              >
                {/* Hour label */}
                <span className="absolute -left-16 w-14 text-right text-[11px] text-grey-400 font-body font-medium -translate-y-1/2">
                  {formatHour(hour)}
                </span>
                {/* Grid line */}
                <div className="w-full h-px bg-grey-150" />
              </div>
            );
          })}

          {/* Current time indicator */}
          {isToday && nowOffset >= 0 && nowOffset <= 100 && (
            <div
              className="absolute left-0 right-0 z-30 flex items-center pointer-events-none"
              style={{ top: `${nowOffset}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red -ml-1.5 shadow-neonRed" />
              <div className="flex-1 h-[2px] bg-red/60" />
            </div>
          )}

          {/* Task blocks */}
          {laidOut.map(({ task, col, totalCols }) => {
            const hour = getTaskHour(task);
            const clampedHour = Math.max(START_HOUR, Math.min(hour, END_HOUR - 1));
            const top = (clampedHour - START_HOUR) * HOUR_HEIGHT + 4;
            const blockHeight = 1.25 * HOUR_HEIGHT - 8;

            const widthPct = totalCols > 1 ? 100 / totalCols : 100;
            const leftPct = col * widthPct;

            const isActive = selectedTaskId === task.id;

            return (
              <button
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`
                  absolute rounded-xl px-3 py-2.5 cursor-pointer border-l-[3px]
                  transition-all duration-200 text-left overflow-hidden
                  hover:scale-[1.02] hover:-translate-y-0.5
                  ${getTaskClasses(task.status)}
                  ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-grey-100 scale-[1.02]' : ''}
                `}
                style={{
                  top: `${top}px`,
                  height: `${blockHeight}px`,
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  paddingRight: totalCols > 1 ? '8px' : undefined,
                  zIndex: isActive ? 30 : 10 + col,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-white/90 font-body">
                    {formatHour(hour)}
                  </span>
                  <span className="text-[9px] font-semibold text-white/70 bg-white/15 px-1.5 py-0.5 rounded-md font-body">
                    {STATUS_LABEL[task.status] ?? task.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-white leading-tight line-clamp-1 font-body">
                  {task.name}
                </p>
                {task.categories?.length > 0 && (
                  <p className="text-[10px] text-white/75 mt-0.5 line-clamp-1 font-body">
                    {task.categories.join(' · ')}
                  </p>
                )}
              </button>
            );
          })}

          {/* Empty state */}
          {laidOut.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Calendar size={32} className="mx-auto mb-2 text-grey-300" />
                <p className="text-sm font-medium text-grey-400 font-body">
                  Sin tareas para este día
                </p>
                <p className="text-xs text-grey-300 font-body mt-1">
                  Selecciona otro día en el calendario
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
