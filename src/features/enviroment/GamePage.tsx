import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';

import HUD from './components/HUD.tsx';
import ThreeScene from './components/ThreeScene.tsx';
import { useHudData } from './hooks/useHudData.ts';
import { useKeyboardControls } from './hooks/useKeyboardControls.ts';
import { useThreeRealtime } from './hooks/useThreeRealtime.ts';
import { type Vector3State } from './types/realtime.ts';

export default function GamePage() {
  const { user, isAuth } = useAuth();
  const { teamId } = useTeam();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const localUid = useMemo(() => user?.uid ?? null, [user?.uid]);
  const keyboard = useKeyboardControls();

  const [localPos, setLocalPos] = useState<Vector3State>({ x: 0, y: 0, z: 0 });
  const [localRot, setLocalRot] = useState<Vector3State>({ x: 0, y: 0, z: 0 });

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

  const { connectedUsers, connectedUserUids, playersState, localSlotId } = useThreeRealtime({
    teamId: teamId ?? null,
    localUid,
    isEnabled: isAuth,
    localPosition: localPos,
    localRotation: localRot,
  });

  const { stats, session } = useHudData({
    teamId,
    connectedUsers,
    connectedUserUids,
    elapsedSeconds,
  });

  const healthPercent = useMemo(() => {
    if (stats.maxHp <= 0) {
      return 1;
    }

    return Math.max(0, Math.min(1, stats.hp / stats.maxHp));
  }, [stats.hp, stats.maxHp]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-grey-900">
      <div className="absolute inset-0 z-0">
        <ThreeScene
          localSlotId={localSlotId}
          remotePlayers={playersState}
          healthPercent={healthPercent}
          keyboard={keyboard}
          onLocalMove={(pos, rot) => {
            setLocalPos(pos);
            setLocalRot(rot);
          }}
        />
      </div>

      <HUD stats={stats} session={session} />
    </div>
  );
}
