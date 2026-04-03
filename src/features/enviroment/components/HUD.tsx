import TopBar from './TopBar.tsx';
import LeftPanel from './LeftPanel.tsx';
import RightPanel from './RightPanel.tsx';
import BottomBar from './BottomBar.tsx';
import SparkleField from './SparkleField.tsx';
import type {PlayerStats, SessionInfo} from '../types/hud';

interface HUDProps {
    stats: PlayerStats;
    session: SessionInfo;
}

export default function HUD({stats, session}: HUDProps) {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <SparkleField/>
            <TopBar session={session}/>
            <LeftPanel stats={stats}/>
            <RightPanel session={session}/>
            <BottomBar session={session}/>
        </div>
    );
}
