import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';

import HUD from './components/HUD.tsx';
import { useHudData } from './hooks/useHudData.ts';
import { useSplineRealtimePlayers } from './hooks/useSplineRealtimePlayers.ts';

export default function GamePage() {
  const { user, isAuth } = useAuth();
  const { teamId } = useTeam();
  const [splineApp, setSplineApp] = useState<Application | null>(null);
  const [isSplineRendered, setIsSplineRendered] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const localUid = useMemo(() => user?.uid ?? null, [user?.uid]);

  const handleSplineLoad = useCallback((app: Application) => {
    setIsSplineRendered(false);
    setSplineApp(app);
  }, []);

  useEffect(() => {
    if (!splineApp) {
      return;
    }

    const handleRendered = () => {
      setIsSplineRendered(true);
      splineApp.removeEventListener('rendered', handleRendered);
    };

    splineApp.addEventListener('rendered', handleRendered);

    return () => {
      splineApp.removeEventListener('rendered', handleRendered);
    };
  }, [splineApp]);

  useEffect(() => {
    setElapsedSeconds(0);

    if (!isAuth || !teamId) {
      return;
    }

    const startAt = Date.now();
    const timerId = globalThis.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startAt) / 1000));
    }, 1000);

    return () => {
      globalThis.clearInterval(timerId);
    };
  }, [isAuth, teamId]);

  const { connectedUsers, connectedUserUids } = useSplineRealtimePlayers({
    app: splineApp,
    teamId: teamId ?? null,
    localUid,
    isEnabled: isAuth,
    isSceneReady: isSplineRendered,
  });

  const { stats, session } = useHudData({
    teamId,
    connectedUsers,
    connectedUserUids,
    elapsedSeconds,
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-grey-900">
      <div className="absolute inset-0 z-0">
        <Spline
          scene="/models/scene.splinecode"
          onLoad={handleSplineLoad}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <HUD stats={stats} session={session} />
    </div>
  );
}
