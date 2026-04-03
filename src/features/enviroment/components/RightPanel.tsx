import { Activity, Trophy, Star } from 'lucide-react';
import type { SessionInfo } from '../types/hud';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
}

function MetricCard({ icon, label, value, sub }: MetricCardProps) {
  return (
    <div className="
      bg-grey-900/70 border border-white/[0.08]
      backdrop-blur-md rounded-[12px]
      px-3.5 py-3 min-w-[130px]
    ">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-white/40">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/40">
          {label}
        </span>
      </div>
      <div className="font-maxwell text-[22px] font-bold leading-none">{value}</div>
      <div className="text-[10px] text-white/30 mt-0.5">{sub}</div>
    </div>
  );
}

interface RightPanelProps {
  session: SessionInfo;
}

export default function RightPanel({ session }: RightPanelProps) {
  const pingColor =
    session.ping < 30 ? 'text-kanban-done' :
    session.ping < 60 ? 'text-[#FCE98D]' :
    'text-red';

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 pointer-events-auto">
      <MetricCard
        icon={<Activity size={12} strokeWidth={2} />}
        label="Latencia"
        value={<span className={pingColor}>{session.ping}</span>}
        sub="ms"
      />
      <MetricCard
        icon={<Trophy size={12} strokeWidth={2} />}
        label="Puntos"
        value={<span className="text-purple">{session.score.toLocaleString('es-CO')}</span>}
        sub="puntuación"
      />
      <MetricCard
        icon={<Star size={12} strokeWidth={2} />}
        label="Nivel"
        value={<span className="text-[#FCE98D]">Lv. {session.level}</span>}
        sub={`FPS: `}
      />
    </div>
  );
}
