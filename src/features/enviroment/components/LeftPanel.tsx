import { Heart, Zap } from 'lucide-react';
import StatBar from './StatBar.tsx';
import type { PlayerStats } from '../types/hud';

interface LeftPanelProps {
  stats: PlayerStats;
}

export default function LeftPanel({ stats }: LeftPanelProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 pointer-events-auto">
      <StatBar
        label="Vida"
        value={stats.hp}
        max={stats.maxHp}
        fillClass="bg-gradient-green-bg"
        valueColorClass="text-kanban-done"
        icon={<Heart size={12} strokeWidth={2} />}
      />
      <StatBar
        label="Energía"
        value={stats.energy}
        max={stats.maxEnergy}
        fillClass="bg-gradient-orange-bg"
        valueColorClass="text-[#FCE98D]"
        icon={<Zap size={12} strokeWidth={2} />}
      />
    </div>
  );
}
