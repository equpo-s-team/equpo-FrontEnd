import { Users } from 'lucide-react';

import type { SessionInfo } from '../types/hud';
import MetricPill from './MetricPill.tsx';

interface BottomBarProps {
  session: SessionInfo;
}

export default function BottomBar({ session }: BottomBarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-auto">
      <MetricPill
        icon={<Users size={12} strokeWidth={2} />}
        label="Online"
        value={
          <span className="text-grey-800">
            {session.connectedUsers} / {session.maxUsers}
          </span>
        }
      />
    </div>
  );
}

