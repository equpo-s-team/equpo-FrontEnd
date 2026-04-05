import { Monitor, Package, Users } from 'lucide-react';

import type { SessionInfo } from '../types/hud';
import MetricPill from './MetricPill.tsx';

interface BottomBarProps {
  session: SessionInfo;
}

export default function BottomBar({ session }: BottomBarProps) {
  const fpsColor = session.fps >= 60 ? 'text-blue' : 'text-[#FCE98D]';

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-auto">
      <MetricPill
        icon={<Users size={12} strokeWidth={2} />}
        label="Online"
        value={
          <span className="text-kanban-done">
            {session.connectedUsers} / {session.maxUsers}
          </span>
        }
      />
      <MetricPill
        icon={<Monitor size={12} strokeWidth={2} />}
        label="FPS"
        value={<span className={fpsColor}>{session.fps}</span>}
        accent
      />
      <MetricPill
        icon={<Package size={12} strokeWidth={2} />}
        label="Objetos"
        value={<span className="text-purple">{session.items}</span>}
      />
    </div>
  );
}
