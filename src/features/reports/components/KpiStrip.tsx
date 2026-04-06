import type { KpiData } from '../types/types.ts';
import { KpiCard } from './KpiCard.tsx'

interface KpiStripProps {
  data: KpiData
}

export function KpiStrip({ data }: KpiStripProps) {
  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KpiCard variant="todo"     label="Por hacer"    value={data.todo}     sub="tareas pendientes"    badge="↑ 3 nuevas"  badgeType="up"   />
        <KpiCard variant="progress" label="En progreso"  value={data.progress} sub="en desarrollo activo" badge="↑ +12%"      badgeType="up"   />
        <KpiCard variant="qa"       label="En QA"        value={data.qa}       sub="en revisión"          badge="→ estable"   badgeType="warn" />
        <KpiCard variant="done"     label="Completadas"  value={data.done}     sub="tareas finalizadas"   badge="↑ +28%"      badgeType="up"   />
        <KpiCard variant="overdue"  label="Vencidas"     value={data.overdue}  sub="requieren atención"   badge="⚠ crítico"  badgeType="down" />
      </div>
    </section>
  )
}
