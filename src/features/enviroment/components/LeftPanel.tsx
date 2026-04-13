import { Heart, Zap } from 'lucide-react';

import type { PlayerStats } from '../types/hud';
import StatBar from './StatBar.tsx';

interface LeftPanelProps {
  stats: PlayerStats;
}

export default function LeftPanel({ stats }: LeftPanelProps) {
  return (
    <div className="flex absolute bottom-1/3 left-1/2 flex-row md:left-4 md:top-1/2 md:-translate-y-1/3 md:flex-col gap-2.5 z-20">
      <StatBar
        label="Vida"
        value={stats.hp}
        max={stats.maxHp}
        fillClass="bg-gradient-red-bg"
        valueColorClass="text-red"
        icon={<Heart size={12} strokeWidth={3} />}
      />
      <StatBar
        label="Energía"
        value={stats.energy}
        max={stats.maxEnergy}
        fillClass="bg-gradient-orange-bg"
        valueColorClass="text-red-foreground"
        icon={<Zap size={12} strokeWidth={3} />}
      />
    </div>
  );
}
