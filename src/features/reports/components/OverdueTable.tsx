import type { OverdueTaskRow, Priority } from '../types/types.ts';

interface OverdueTableProps {
  tasks: OverdueTaskRow[];
}

const PRIORITY_STYLES: Record<Priority, string> = {
  Alta: 'bg-[rgba(246,90,112,0.1)] text-[#c94155]',
  Media: 'bg-[rgba(255,148,174,0.15)] text-[#b85570]',
  Baja: 'bg-[rgba(156,237,193,0.2)] text-[#2e9660]',
};

export function OverdueTable({ tasks }: OverdueTableProps) {
  return (
    <div
      className="relative flex flex-1 min-h-0 flex-col bg-white  dark:bg-gray-800 border border-grey-150 dark:border-gray-700 rounded-[14px] p-3 sm:p-4 lg:p-6 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}
    >
      <div
        className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,148,174,0.10) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 mb-3 sm:mb-5 flex flex-col sm:flex-row shrink-0 items-start sm:items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-grey-800 dark:text-gray-300 tracking-[-0.01em]">Misiones vencidas</h2>
        <button className="text-xs text-[#c94155] font-medium hover:opacity-70 transition-opacity shrink-0">
          Ver todas →
        </button>
      </div>

      <div className="relative z-10 grid shrink-0 grid-cols-[1fr_auto_auto] gap-2 sm:gap-3 border-b border-grey-150 dark:border-gray-700 pb-2">
        <span className="text-xs text-grey-400 dark:text-grey-500">Misión</span>
        <span className="text-xs text-grey-400 dark:text-grey-500">Dias</span>
        <span className="text-xs text-grey-400 dark:text-grey-500">Prio.</span>
      </div>

      <div
        className="relative z-10 min-h-0 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E2DE transparent' }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-3 py-2 sm:py-2.5 border-b border-grey-100 dark:border-gray-700 last:border-0 text-xs"
          >
            <div className="min-w-0">
              <p className="font-medium text-grey-800 dark:text-gray-300 truncate">{task.task}</p>
              <p className="text-xs text-grey-500 dark:text-grey-400 mt-0.5 truncate">{task.assignee}</p>
            </div>
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold bg-[rgba(246,90,112,0.1)] text-[#c94155] whitespace-nowrap text-center">
              +{task.daysOverdue}d
            </span>
            <span
              className={`inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority.charAt(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
