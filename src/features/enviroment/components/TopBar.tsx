import {Sprout} from "lucide-react";

import StatBar from '@/features/enviroment/components/StatBar.tsx';

import type { PlayerStats, SessionInfo } from '../types/hud';
import AvatarCluster from './AvatarCluster.tsx';

interface TopBarProps {
  session: SessionInfo;
  stats: PlayerStats;
}

export default function TopBar({ session, stats }: TopBarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 pointer-events-auto">

      {/* Avatar cluster pill */}
      <div
        className="
        bg-white/30 border border-red/50
        backdrop-blur-md rounded-full
        px-4 py-2 h-12 flex items-center
      "
      >
        <AvatarCluster
          connected={session.connectedUsers}
          max={session.maxUsers}
          users={session.connectedMembers}
        />
      </div>

      <StatBar
        value={stats.hp}
        max={stats.maxHp}
        fillClass="bg-gradient-green-bg"
        valueColorClass="text-secondary-foreground shadow-neon-green"
        icon={<Sprout size={16}/>}
        neonClass="border-green/50 h-12"
      />
    </div>
  );
}
