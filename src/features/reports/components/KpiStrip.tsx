import type { KpiData } from '../types/types.ts';
import { KpiCard } from './KpiCard.tsx';

interface KpiStripProps {
  data: KpiData;
}

export function KpiStrip({ data }: KpiStripProps) {
  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KpiCard variant="todo" label="Por hacer" value={data.todo} sub="tareas pendientes" />
        <KpiCard
          variant="progress"
          label="En progreso"
          value={data.progress}
          sub="en desarrollo activo"
        />
        <KpiCard variant="qa" label="En QA" value={data.qa} sub="en revisión" />
        <KpiCard variant="done" label="Completadas" value={data.done} sub="tareas finalizadas" />
        <KpiCard variant="overdue" label="Vencidas" value={data.overdue} sub="requieren atención" />
      </div>
    </section>
  );
}
