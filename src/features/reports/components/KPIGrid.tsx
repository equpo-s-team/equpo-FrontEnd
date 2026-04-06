import React, { useEffect, useRef } from 'react';

import { type KpiMetrics } from '@/features/reports/types/types.ts';

interface KPIGridProps {
  metrics: KpiMetrics;
}

const KPICard: React.FC<{
  label: string;
  value: number;
  sub: string;
  badge: string;
  badgeClass: string;
  type: string;
}> = ({ label, value, sub, badge, badgeClass, type }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate number increment
    const el = cardRef.current?.querySelector('.kpi-value');
    if (el) {
      const from = parseInt(el.textContent ?? '0');
      const to = value;
      if (from === to) return;
      const duration = 500;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        el.textContent = Math.round(from + (to - from) * ease).toString();
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [value]);

  return (
    <div className={`kpi-card ${type}`} ref={cardRef}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
      <div className={`kpi-badge ${badgeClass}`}>{badge}</div>
    </div>
  );
};

const KPIGrid: React.FC<KPIGridProps> = ({ metrics }) => {
  return (
    <>
      <div className="section-label">Resumen de estados</div>
      <div className="kpi-grid">
        <KPICard
          label="Por hacer"
          value={metrics.todo}
          sub="tareas pendientes"
          badge="↑ 3 nuevas"
          badgeClass="up"
          type="todo"
        />
        <KPICard
          label="En progreso"
          value={metrics.progress}
          sub="en desarrollo activo"
          badge="↑ +12%"
          badgeClass="up"
          type="progress"
        />
        <KPICard
          label="En QA"
          value={metrics.qa}
          sub="en revisión"
          badge="→ estable"
          badgeClass="warn"
          type="qa"
        />
        <KPICard
          label="Completadas"
          value={metrics.done}
          sub="tareas finalizadas"
          badge="↑ +28%"
          badgeClass="up"
          type="done"
        />
        <KPICard
          label="Vencidas"
          value={metrics.overdue}
          sub="requieren atención"
          badge="⚠ crítico"
          badgeClass="down"
          type="overdue"
        />
      </div>
    </>
  );
};

export default KPIGrid;
