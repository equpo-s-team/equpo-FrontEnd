import type { WeeklyVelocity, VelocityStats } from '../types'

interface VelocityChartProps {
  weeks: WeeklyVelocity[]
  stats: VelocityStats
}

export function VelocityChart({ weeks, stats }: VelocityChartProps) {
  const maxVal = Math.max(...weeks.map(w => w.value))

  return (
    <div
      className="relative bg-white border border-grey-150 rounded-[14px] p-6 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}
    >
      {/* Corner neon glow */}
      <div
        className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(156,237,193,0.12) 0%, transparent 65%)' }}
      />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h2 className="text-[0.88rem] font-semibold text-grey-800 tracking-[-0.01em]">
          Velocidad de cierre semanal
        </h2>
        <span className="text-[0.7rem] text-grey-400 hidden sm:block">tareas / semana</span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-[88px] pb-0.5 relative z-10">
        {weeks.map(w => {
          const isMax = w.value === maxVal
          const heightPx = (w.value / maxVal) * 82

          return (
            <div key={w.label} className="flex flex-col items-center gap-1.5 flex-1 group">
              <div className="relative w-full" style={{ height: heightPx }}>
                {/* Tooltip */}
                <div
                  className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[0.62rem] font-semibold text-grey-600
                    bg-white border border-grey-200 px-1.5 py-0.5 rounded-md
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                >
                  {w.value} tareas
                </div>
                <div
                  className="w-full h-full rounded-t-md"
                  style={{
                    background: isMax
                      ? 'linear-gradient(180deg,#9CEDC1,#CEFB7C)'
                      : 'linear-gradient(180deg,#E4E2DE,#EEECEA)',
                    boxShadow: isMax
                      ? '0 0 18px rgba(156,237,193,0.65), 0 0 6px rgba(206,251,124,0.5)'
                      : undefined,
                  }}
                />
              </div>
              <span className="text-[0.62rem] text-grey-400">{w.label}</span>
            </div>
          )
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5 mt-4.5 relative z-10">
        <div className="text-center">
          <p className="text-[1.2rem] font-semibold text-grey-900 tracking-[-0.03em]">{stats.average}</p>
          <p className="text-[0.67rem] text-grey-400 mt-0.5">promedio / sem.</p>
        </div>
        <div className="text-center border-x border-grey-150">
          <p
            className="text-[1.2rem] font-semibold tracking-[-0.03em]"
            style={{ color: '#2e9660', textShadow: '0 0 14px rgba(156,237,193,0.7)' }}
          >
            {stats.best}
          </p>
          <p className="text-[0.67rem] text-grey-400 mt-0.5">mejor semana</p>
        </div>
        <div className="text-center">
          <p className="text-[1.2rem] font-semibold text-grey-900 tracking-[-0.03em]">↑ {stats.growthPct}%</p>
          <p className="text-[0.67rem] text-grey-400 mt-0.5">vs periodo ant.</p>
        </div>
      </div>
    </div>
  )
}
