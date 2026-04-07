import { AlertTriangle, CheckCircle2, Users } from 'lucide-react';

import type { SessionInfo } from '../types/hud';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
}

function MetricCard({ icon, label, value, sub }: MetricCardProps) {
  return (
    <div
      className="
      bg-grey-100/85 border border-grey-200/90
      backdrop-blur-md rounded-[12px]
      px-3.5 py-3 min-w-[130px]
    "
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-grey-600">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-grey-700">{label}</span>
      </div>
      <div className="font-maxwell text-[22px] font-bold leading-none text-grey-800">{value}</div>
      <div className="text-[10px] text-grey-600 mt-0.5">{sub}</div>
    </div>
  );
}

interface RightPanelProps {
  session: SessionInfo;
}

export default function RightPanel({ session }: RightPanelProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 pointer-events-auto">
      <MetricCard
        icon={<Users size={12} strokeWidth={2} />}
        label="Conectados"
        value={
          <span>
            {session.connectedUsers}/{session.maxUsers}
          </span>
        }
        sub="miembros activos"
      />
      <MetricCard
        icon={<CheckCircle2 size={12} strokeWidth={2} />}
        label="Completadas"
        value={<span>{session.completedPercent}%</span>}
        sub="porcentaje del equipo"
      />
      <MetricCard
        icon={<AlertTriangle size={12} strokeWidth={2} />}
        label="Vencidas"
        value={<span>{session.overduePercent}%</span>}
        sub="impacto negativo"
      />
    </div>
  );
}
