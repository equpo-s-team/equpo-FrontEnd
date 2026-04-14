import {Heart} from "lucide-react";

import StatBar from "@/features/enviroment/components/StatBar.tsx";

import type {PlayerStats, SessionInfo} from '../types/hud';
import AvatarCluster from './AvatarCluster.tsx';

function formatTime(secs: number): string {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

interface TopBarProps {
  session: SessionInfo;
  stats: PlayerStats;
}

export default function TopBar({ session, stats }: TopBarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 pointer-events-auto">
      {/* Live indicator + timer */}
      <div
        className="
        flex items-center gap-2.5
        bg-white/30 border border-white/[0.08]
        backdrop-blur-md rounded-full
        px-4 py-2
      "
      >
        <span
          className="w-[7px] h-[7px] rounded-full bg-kanban-done animate-pulse-neon flex-shrink-0"
          style={{ boxShadow: '0 0 6px #9CEDC1' }}
        />
        <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-grey-700">En vivo</span>
        <div className="w-px h-4 bg-grey-300/80" />
        <span className="font-maxwell text-[13px] font-bold text-grey-800 tabular-nums">
          {formatTime(session.elapsedSeconds)}
        </span>
      </div>

      {/* Avatar cluster pill */}
      <div
        className="
        bg-white/30 border border-white/[0.08]
        backdrop-blur-md rounded-full
        px-4 py-2
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
        fillClass="bg-gradient-red-bg"
        valueColorClass="text-red"
        icon={<Heart size={16} strokeWidth={3} />}
      />
    </div>
  );
}
