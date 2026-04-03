import Spline from '@splinetool/react-spline';
import HUD from './components/HUD.tsx';
import type {PlayerStats, SessionInfo} from "@/features/enviroment/types/hud.ts";

export default function GamePage() {
    const stats: PlayerStats = {
        hp: 100,
        maxHp: 100,
        energy: 100,
        maxEnergy: 100,
    };

    const session: SessionInfo = {
        elapsedSeconds: 1254,
        connectedUsers: 1,
        maxUsers: 8,
        fps: 60,
        ping: 24,
        items: 156,
        score: 12500,
        level: 12,
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-grey-900">

            <div className="absolute inset-0 z-0">
                <Spline
                    scene="https://prod.spline.design/KTQJ4-lk3BMLmGOr/scene.splinecode"
                    style={{width: '100%', height: '100%'}}
                />
            </div>

            {/* HUD overlay */}
            <HUD stats={stats} session={session}/>

        </div>
    );
}
