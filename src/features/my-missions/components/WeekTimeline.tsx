import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import type { TeamTask } from '@/features/board/types';
import { isTaskOverdue } from '@/features/board/utils/taskUtils';

import { getTaskClasses } from '../utils/timelineStyles';

const HOUR_HEIGHT = 64; // px per hour slot
const START_HOUR = 6;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR;
interface WeekTimelineProps {
  selectedDate: Date;
  tasks: TeamTask[];
  onDateChange: (date: Date) => void;
  onTaskClick: (task: TeamTask) => void;
  selectedTaskId: string | null;
  view: 'day' | 'week' | 'month' | 'year';
  onViewChange: (v: 'day' | 'week' | 'month' | 'year') => void;
}

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function getMonday(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
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

function layoutTasks(tasks: TeamTask[]): Array<{ task: TeamTask; col: number; totalCols: number }> {
  if (tasks.length === 0) return [];

  // Sort by start hour, then by id for stable ordering
  const sorted = [...tasks].sort(
    (a, b) => getTaskHour(a) - getTaskHour(b) || a.id.localeCompare(b.id),
  );

  const BLOCK_DURATION = 1; // hours per block

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

export default function WeekTimeline({
  selectedDate,
  tasks,
  onDateChange,
  onTaskClick,
  selectedTaskId,
  view,
  onViewChange,
}: WeekTimelineProps) {
  const monday = useMemo(() => getMonday(selectedDate), [selectedDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(key));
      return { date: d, key, tasks: dayTasks };
    });
  }, [monday, tasks]);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatMonth = (d: Date) => d.toLocaleString('es-ES', { month: 'short' });
  const weekLabel = `${monday.getDate()} ${formatMonth(monday)} - ${sunday.getDate()} ${formatMonth(sunday)} ${monday.getFullYear()}`;

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    onDateChange(d);
  };

  const goNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    onDateChange(d);
  };

  const todayKey = new Date().toISOString().slice(0, 10);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowOffset = ((nowMinutes - START_HOUR * 60) / (TOTAL_HOURS * 60)) * 100;

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-gray-900 border border-grey-150 dark:border-gray-700 shadow-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-grey-150 dark:border-gray-700 shrink-0"
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
            {weekLabel}
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

      {/* Grid container */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 relative">
        {/* Sticky Header Row for Days */}
        <div className="flex border-b border-grey-150 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 z-20">
          {/* Spacer for hours column */}
          <div className="w-[50px] shrink-0 border-r border-grey-150 dark:border-gray-700 bg-grey-50 dark:bg-gray-800" />
          <div className="flex-1 grid grid-cols-7 divide-x divide-grey-150 dark:divide-gray-700">
            {weekDays.map(({ date, key }) => {
              const isToday = key === todayKey;
              return (
                <div
                  key={`header-${key}`}
                  className={`py-3 px-1 text-center bg-white dark:bg-gray-800 ${isToday ? 'bg-blue/5' : ''}`}
                >
                  <p className="text-xs font-bold text-grey-400 dark:text-grey-500 uppercase tracking-widest font-body">
                    {DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                  </p>
                  <div
                    className={`mx-auto mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-body ${
                      isToday ? 'bg-blue text-white shadow-neonBlue' : 'text-grey-800 dark:text-gray-300'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Timeline */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="flex relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
            {/* Hours Background Lines */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
                const hour = START_HOUR + i;
                return (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 flex items-start"
                    style={{ top: `${i * HOUR_HEIGHT}px` }}
                  >
                    <span className="w-[50px] text-right text-xs pr-2 text-grey-400 dark:text-grey-500 font-body font-medium -translate-y-1/2 bg-white dark:bg-gray-800">
                      {formatHour(hour)}
                    </span>
                    <div className="flex-1 h-px bg-grey-150 dark:bg-gray-700" />
                  </div>
                );
              })}
            </div>

            {/* Day Columns */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-grey-150 dark:divide-gray-700 ml-[50px] relative z-10">
              {weekDays.map(({ key, tasks: dayTasks }) => {
                const isToday = key === todayKey;
                const laidOut = layoutTasks(dayTasks);

                return (
                  <div
                    key={`col-${key}`}
                    className={`relative w-full h-full ${isToday ? 'bg-blue/5' : ''}`}
                  >
                    {/* Current time indicator */}
                    {isToday && nowOffset >= 0 && nowOffset <= 100 && (
                      <div
                        className="absolute left-0 right-0 z-30 flex items-center pointer-events-none"
                        style={{ top: `${nowOffset}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-red -ml-1 shadow-neonRed" />
                        <div className="flex-1 h-[2px] bg-red/60" />
                      </div>
                    )}

                    {/* Tasks */}
                    {laidOut.map(({ task, col, totalCols }) => {
                      const hour = getTaskHour(task);
                      const clampedHour = Math.max(START_HOUR, Math.min(hour, END_HOUR - 1));
                      const top = (clampedHour - START_HOUR) * HOUR_HEIGHT + 4;
                      const blockHeight = 1 * HOUR_HEIGHT - 8;

                      const widthPct = totalCols > 1 ? 100 / totalCols : 100;
                      const leftPct = col * widthPct;
                      const isActive = selectedTaskId === task.id;
                      const isOverdue = isTaskOverdue(task);

                      return (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={`
                            absolute rounded-[6px] px-1.5 py-1 cursor-pointer border-l-[2.5px]
                            transition-all duration-200 text-left overflow-hidden
                            hover:brightness-110
                            ${isOverdue ? 'bg-gradient-red-bg border-red text-white' : getTaskClasses(task.status)}
                            ${isActive ? 'ring-2 ring-grey-400 shadow-neonGrey scale-[1.02]' : ''}
                          `}
                          style={{
                            top: `${top}px`,
                            height: `${blockHeight}px`,
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                            zIndex: isActive ? 30 : 10 + col,
                          }}
                        >
                          <p className="text-xs font-bold text-white leading-tight line-clamp-2 font-body break-words">
                            {task.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
