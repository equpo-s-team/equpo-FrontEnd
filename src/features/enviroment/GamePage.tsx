import Spline from '@splinetool/react-spline';
import type { Application, SplineEvent } from '@splinetool/runtime';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import type { PlayerStats, SessionInfo } from '@/features/enviroment/types/hud.ts';

import HUD from './components/HUD.tsx';
import { useSplineRealtimePlayers } from './hooks/useSplineRealtimePlayers.ts';

export default function GamePage() {
  const { user, isAuth } = useAuth();
  const { teamId } = useTeam();
  const [splineApp, setSplineApp] = useState<Application | null>(null);
  const [isSplineRendered, setIsSplineRendered] = useState(false);
  const localUid = useMemo(() => user?.uid ?? null, [user?.uid]);

  const handleSplineLoad = useCallback((app: Application) => {
    setIsSplineRendered(false);
    setSplineApp(app);
  }, []);

  useEffect(() => {
    if (!splineApp) {
      return;
    }

    const handleRendered = (_event: SplineEvent) => {
      setIsSplineRendered(true);
      splineApp.removeEventListener('rendered', handleRendered);
    };

    splineApp.addEventListener('rendered', handleRendered);

    return () => {
      splineApp.removeEventListener('rendered', handleRendered);
    };
  }, [splineApp]);

  useSplineRealtimePlayers({
    app: splineApp,
    teamId: teamId ?? null,
    localUid,
    isEnabled: isAuth,
    isSceneReady: isSplineRendered,
  });

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
          onLoad={handleSplineLoad}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* HUD overlay */}
      <HUD stats={stats} session={session} />
    </div>
  );
}
