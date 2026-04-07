import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import type { PlayerStats, SessionInfo } from '@/features/enviroment/types/hud.ts';
import { resolvePlayerKeyFromUid } from '@/features/enviroment/types/realtime.ts';

import HUD from './components/HUD.tsx';
import { useSplineRealtimePlayers } from './hooks/useSplineRealtimePlayers.ts';

export default function GamePage() {
  const { user, isAuth } = useAuth();
  const [splineApp, setSplineApp] = useState<Application | null>(null);
  const localPlayer = useMemo(
    () => (user?.uid ? resolvePlayerKeyFromUid(user.uid) : null),
    [user?.uid],
  );

  useSplineRealtimePlayers({ app: splineApp, localPlayer, isEnabled: isAuth });

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
    <div className="relative h-screen w-screen overflow-hidden bg-grey-900">
      <div className="absolute inset-0 z-0">
        <Spline
          scene="/models/scene.splinecode"
          onLoad={setSplineApp}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* HUD overlay */}
      <HUD stats={stats} session={session} />
    </div>
  );
}
