import { useState } from 'react'
import { NeonBackground }  from './Componentes/NeonBackground'
import { ReportHeader }    from './Componentes/ReportHeader'
import { DateRangePicker } from './Componentes/DateRangePicker'
import { KpiStrip }        from './Componentes/KpiStrip'
import { MemberList }      from './Componentes/MemberList'
import { StatusDonut }     from './Componentes/StatusDonut'
import { VelocityChart }   from './Componentes/VelocityChart'
import { OverdueTable }    from './Componentes/OverdueTable'
import { getKpiForDays }   from './data'
import { TEAM_MEMBERS, OVERDUE_TASKS, WEEKLY_VELOCITY, VELOCITY_STATS } from './data'

export default function Reports() {
  const [activeDays, setActiveDays] = useState(30)
  const kpi = getKpiForDays(activeDays)

  return (
    <div className="relative min-h-screen bg-white text-grey-800 overflow-x-hidden font-body">
      <NeonBackground />

      <main className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-9 pb-18">

        <ReportHeader />

        {/* Page title + date picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-[clamp(1.7rem,3vw,2.3rem)] font-semibold tracking-[-0.035em] text-grey-900 leading-[1.1]">
              Rendimiento del Equipo
            </h1>
            <p className="text-[0.85rem] text-grey-500 mt-1.5">
              Vista general de tareas, estados y contribuciones individuales
            </p>
          </div>
          <div className="flex-shrink-0">
            <DateRangePicker onRangeChange={setActiveDays} />
          </div>
        </div>

        {/* KPI strip */}
        <div className="mb-8">
          <KpiStrip data={kpi} />
        </div>

        {/* Main grid: member list + donut */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-5 mb-5">
          <MemberList members={TEAM_MEMBERS} />
          <StatusDonut data={kpi} />
        </div>

        {/* Bottom grid: velocity + overdue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <VelocityChart weeks={WEEKLY_VELOCITY} stats={VELOCITY_STATS} />
          <OverdueTable tasks={OVERDUE_TASKS} />
        </div>

      </main>
    </div>
  )
}
