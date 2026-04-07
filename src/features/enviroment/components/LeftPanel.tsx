import { Heart, Zap } from 'lucide-react';

import type { PlayerStats } from '../types/hud';
import StatBar from './StatBar.tsx';

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
        valueColorClass="text-grey-800"
        icon={<Heart size={12} strokeWidth={2} />}
      />
      <StatBar
        label="Energía"
        value={stats.energy}
        max={stats.maxEnergy}
        fillClass="bg-gradient-orange-bg"
        valueColorClass="text-grey-800"
        icon={<Zap size={12} strokeWidth={2} />}
      />
    </div>
  );
}
