import type { PlayerStats, SessionInfo } from '../types/hud';
import LeftPanel from './LeftPanel.tsx';
import TopBar from './TopBar.tsx';

interface HUDProps {
  stats: PlayerStats;
  session: SessionInfo;
}

export default function HUD({ stats, session }: HUDProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <TopBar session={session} />
      <LeftPanel stats={stats} />
    </div>
  );
}
