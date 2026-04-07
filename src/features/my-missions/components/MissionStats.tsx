import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import type { TeamTask } from '@/features/board/types';

interface MissionStatsProps {
  tasks: TeamTask[];
}

export default function MissionStats({ tasks }: MissionStatsProps) {
  const [isOverdueExpanded, setIsOverdueExpanded] = useState(false);

  // Helper to determine if a task is overdue
  const now = new Date();
  const isOverdue = (t: TeamTask) => {
    if (t.status === 'done') return false;
    if (!t.dueDate) return false;

    const isDateOnly = !t.dueDate.includes('T') || t.dueDate.endsWith('T00:00:00.000Z');
    if (isDateOnly) {
      const datePart = t.dueDate.split('T')[0];
      const endOfDay = new Date(`${datePart}T23:59:59`);
      return endOfDay.getTime() < now.getTime();
    }

    const dueDateObj = new Date(t.dueDate);
    return dueDateObj.getTime() < now.getTime();
  };

  // Split tasks
  const overdueTasks = tasks.filter(isOverdue);
  const onTimeTasks = tasks.filter((t) => !isOverdue(t));

  // Regular stats (only on-time)
  const todo = onTimeTasks.filter((t) => t.status === 'todo').length;
  const inProgress = onTimeTasks.filter((t) => t.status === 'in-progress').length;
  const inQa = onTimeTasks.filter((t) => t.status === 'in-qa').length;
  const done = onTimeTasks.filter((t) => t.status === 'done').length;

  // Overdue stats
  const overdueTodo = overdueTasks.filter((t) => t.status === 'todo').length;
  const overdueInProgress = overdueTasks.filter((t) => t.status === 'in-progress').length;
  const overdueInQa = overdueTasks.filter((t) => t.status === 'in-qa').length;

  return (
    <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-4">
      <h3 className="text-sm font-bold text-grey-800 font-body mb-3">Resumen</h3>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-kanban-todo" />
            <span className="text-xs font-semibold text-grey-600 font-body">Por Hacer</span>
          </div>
          <span className="text-xs font-bold text-grey-800 font-body">{todo}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue" />
            <span className="text-xs font-semibold text-grey-600 font-body">En Progreso</span>
          </div>
          <span className="text-xs font-bold text-grey-800 font-body">{inProgress}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-kanban-qa" />
            <span className="text-xs font-semibold text-grey-600 font-body">En QA</span>
          </div>
          <span className="text-xs font-bold text-grey-800 font-body">{inQa}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green" />
            <span className="text-xs font-semibold text-grey-600 font-body">Completadas</span>
          </div>
          <span className="text-xs font-bold text-grey-800 font-body">{done}</span>
        </div>

        <hr className="border-grey-100 my-1" />

        {overdueTasks.length > 0 ? (
          <div
            role="button"
            tabIndex={0}
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsOverdueExpanded(!isOverdueExpanded)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOverdueExpanded(!isOverdueExpanded);
              }
            }}
          >
            <div className="flex items-center gap-2 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-red animate-pulse shadow-[0_0_8px_rgba(246,90,112,0.6)]" />
              <span className="text-xs font-semibold text-grey-600 font-body group-hover:text-grey-900 transition-colors">
                Vencidas
              </span>
              {isOverdueExpanded ? (
                <ChevronUp className="w-3 h-3 text-grey-400 group-hover:text-grey-600 transition-colors" />
              ) : (
                <ChevronDown className="w-3 h-3 text-grey-400 group-hover:text-grey-600 transition-colors" />
              )}
            </div>
            <span className="text-xs font-bold font-body text-red">
              {overdueTasks.length}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-red" />
              <span className="text-xs font-semibold text-grey-600 font-body">Vencidas</span>
            </div>
            <span className="text-xs font-bold font-body text-grey-800">0</span>
          </div>
        )}

        {/* Expandable breakdown for overdue tasks */}
        {isOverdueExpanded && overdueTasks.length > 0 && (
          <div className="flex flex-col gap-1.5 pl-3 mt-0.5 ml-1.5 border-l-2 border-red/20 select-none animate-in slide-in-from-top-2 fade-in duration-200">
            {overdueTodo > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-kanban-todo opacity-60" />
                  <span className="text-[11px] font-medium text-grey-500">Por Hacer</span>
                </div>
                <span className="text-[11px] font-bold text-grey-700">{overdueTodo}</span>
              </div>
            )}
            {overdueInProgress > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue opacity-60" />
                  <span className="text-[11px] font-medium text-grey-500">En Progreso</span>
                </div>
                <span className="text-[11px] font-bold text-grey-700">{overdueInProgress}</span>
              </div>
            )}
            {overdueInQa > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-kanban-qa opacity-60" />
                  <span className="text-[11px] font-medium text-grey-500">En QA</span>
                </div>
                <span className="text-[11px] font-bold text-grey-700">{overdueInQa}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
