import { useState } from 'react'
import { NeonBackground }  from './Componentes/NeonBackground'
import { DateRangePicker } from './Componentes/DateRangePicker'
import { KpiStrip }        from './Componentes/KpiStrip'
import { MemberList }      from './Componentes/MemberList'
import { StatusDonut }     from './Componentes/StatusDonut'
import { OverdueTable }    from './Componentes/OverdueTable'
import { getKpiForDays }   from './data'
import { TEAM_MEMBERS, OVERDUE_TASKS } from './data'

export default function Reports() {
  const [activeDays, setActiveDays] = useState(30)
  const kpi = getKpiForDays(activeDays)

  return (
    <div className="relative min-h-screen bg-white text-grey-800 overflow-x-hidden font-body">
      <NeonBackground />

      <main className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-9 pb-18">

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
        <div className="flex flex-row w-full gap-8">
          <div className="flex-col w-3/5">
              {/* KPI strip */}
              <div className="mb-8 w-full">
                  <KpiStrip data={kpi} />
              </div>

              {/* Main grid: member list + donut */}
              <div className="w-full lg:grid-cols-[1fr_370px] gap-5 mb-5">
                  <MemberList members={TEAM_MEMBERS} />

              </div>
          </div>

          <div className="flex flex-col pt-6 w-2/5 h-[85vh] gap-8">
              <StatusDonut data={kpi} />
              {/* Bottom grid: overdue */}
              <OverdueTable tasks={OVERDUE_TASKS} />
          </div>
        </div>

      </main>
    </div>
  )
}
