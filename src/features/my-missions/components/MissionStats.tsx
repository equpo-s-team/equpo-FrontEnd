import type { TeamTask } from '@/features/board/types';

interface MissionStatsProps {
  tasks: TeamTask[];
}

export default function MissionStats({ tasks }: MissionStatsProps) {
  // Count stats
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const inQa = tasks.filter((t) => t.status === 'in-qa').length;
  const done = tasks.filter((t) => t.status === 'done').length;

  const now = new Date();
  const overdue = tasks.filter((t) => {
    if (t.status === 'done') return false;
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < now;
  }).length;

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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full bg-red ${overdue > 0 ? 'animate-pulse shadow-[0_0_8px_rgba(246,90,112,0.6)]' : ''}`}
            />
            <span className="text-xs font-semibold text-grey-600 font-body">Vencidas</span>
          </div>
          <span className={`text-xs font-bold font-body ${overdue > 0 ? 'text-red' : 'text-grey-800'}`}>
            {overdue}
          </span>
        </div>
      </div>
    </div>
  );
}
