import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers.ts';

import { MobileJoystick } from './components/environment/MobileJoystick.tsx';
import Experience from './components/Experience.tsx';
import HUD from './components/HUD.tsx';
import NeonLoadingOverlay from './components/NeonLoadingOverlay.tsx';
import { useHudData } from './hooks/useHudData.ts';
import { usePlayerInput } from './hooks/usePlayerInput.ts';
import { useThreeRealtime } from './hooks/useThreeRealtime.ts';
import { type Vector3State } from './types/realtime.ts';

export default function GamePage() {
  const { user, isAuth } = useAuth();
  const { teamId } = useTeam();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const localUid = useMemo(() => user?.uid ?? null, [user?.uid]);

  const inputRef = usePlayerInput();
  const { data: teamMembers } = useTeamMembers(teamId || undefined);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

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

  const handleLoaded = useCallback(() => {
    setIsReady(true);
  }, []);

  const playerNames = useMemo(() => {
    if (!teamMembers) return {};
    const map: Record<string, string> = {};
    for (const member of teamMembers) {
      if (member.displayName) {
        // Extract first name
        map[member.uid] = member.displayName.split(' ')[0] || member.displayName;
      }
    }
    // Also include local user's first name if possible
    const authUser = user as { uid?: string; displayName?: string } | null;
    if (authUser?.uid && authUser.displayName) {
      map[authUser.uid] = authUser.displayName.split(' ')[0] || authUser.displayName;
    }
    return map;
  }, [teamMembers, user]);

  const handleLocalMove = useCallback((pos: Vector3State, rot: Vector3State) => {
    setLocalPos(pos);
    setLocalRot(rot);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-grey-900">
      <div className="absolute inset-0 z-0">
        <Experience
          localUid={localUid}
          localSlotId={localSlotId}
          remotePlayers={playersState}
          healthPercent={healthPercent}
          inputRef={inputRef}
          playerNames={playerNames}
          onLoaded={handleLoaded}
          onLocalMove={handleLocalMove}
        />
      </div>

      {/* Mobile joystick overlay — only rendered on touch devices */}
      {isTouchDevice && <MobileJoystick inputRef={inputRef} />}

      <HUD stats={stats} session={session} />

      {!isReady && <NeonLoadingOverlay />}
    </div>
  );
}
