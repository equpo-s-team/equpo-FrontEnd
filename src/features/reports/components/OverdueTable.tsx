import type { OverdueTaskRow, Priority } from '../types/types.ts';

interface OverdueTableProps {
  tasks: OverdueTaskRow[]
}

const PRIORITY_STYLES: Record<Priority, string> = {
  Alta: 'bg-[rgba(246,90,112,0.1)] text-[#c94155]',
  Media: 'bg-[rgba(255,148,174,0.15)] text-[#b85570]',
  Baja: 'bg-[rgba(156,237,193,0.2)] text-[#2e9660]',
}

export function OverdueTable({ tasks }: OverdueTableProps) {
  return (
    <div
      className="relative flex h-full min-h-0 flex-col bg-white border border-grey-150 rounded-[14px] p-6 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}
    >
      <div
        className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,148,174,0.10) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 mb-5 flex shrink-0 items-center justify-between">
        <h2 className="text-[0.88rem] font-semibold text-grey-800 tracking-[-0.01em]">Tareas vencidas</h2>
        <button className="text-[0.74rem] text-[#c94155] font-medium hover:opacity-70 transition-opacity">
          Ver todas →
        </button>
      </div>

      <div className="relative z-10 grid shrink-0 grid-cols-[1fr_auto_auto] gap-3 border-b border-grey-150 pb-2">
        <span className="text-[0.65rem] text-grey-400">Tarea</span>
        <span className="text-[0.65rem] text-grey-400">Dias</span>
        <span className="text-[0.65rem] text-grey-400">Prio.</span>
      </div>

      <div
        className="relative z-10 min-h-0 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E2DE transparent' }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 border-b border-grey-100 last:border-0 text-[0.78rem]"
          >
            <div>
              <p className="font-medium text-grey-800 truncate">{task.task}</p>
              <p className="text-[0.69rem] text-grey-500 mt-0.5">{task.assignee}</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.67rem] font-semibold bg-[rgba(246,90,112,0.1)] text-[#c94155] whitespace-nowrap">
              +{task.daysOverdue} {task.daysOverdue === 1 ? 'dia' : 'dias'}
            </span>
            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold whitespace-nowrap ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
