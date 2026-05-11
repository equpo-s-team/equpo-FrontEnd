import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAchievementPopup } from '@/context/AchievementContext';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import { MobileJoystick } from '@/features/enviroment/components/game/MobileJoystick.tsx';
import { useSidebar } from '@/features/navbar/SidebarContext.tsx';
import { useAchievements } from '@/features/team/hooks/useAchievements';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers.ts';
import { useUnlockAchievement } from '@/features/team/hooks/useUnlockAchievement';

import Experience from './components/game/Experience.tsx';
import HUD from './components/HUD.tsx';
import NeonLoadingOverlay from './components/NeonLoadingOverlay.tsx';
import { useHudData } from './hooks/useHudData.ts';
import { usePlayerInput } from './hooks/usePlayerInput.ts';
import { useThreeRealtime } from './hooks/useThreeRealtime.ts';
import { type Vector3State } from './types/realtime.ts';

export default function GamePage() {
  const { user, isAuth } = useAuth();
  const { teamId } = useTeam();
  const { setActiveItem } = useSidebar();
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

  const { mutate: unlockAchievement } = useUnlockAchievement();
  const { showAchievement } = useAchievementPopup();
  const { data: teamAchievements } = useAchievements(teamId || undefined);

  const { stats, session, setCoinBalance } = useHudData({
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

  const handleBoardEntry = useCallback(() => {
    setActiveItem('missiones');
  }, [setActiveItem]);

  const disabledPointIds = useMemo(() => {
    const ids = new Set<string>();
    const explorador = teamAchievements?.find(a => a.name === 'Explorador');
    if (explorador?.unlockedAt) {
      ids.add('duck-statue');
    }
    return ids;
  }, [teamAchievements]);

  const handleDuckStatue = useCallback(() => {
    if (!teamId || !localUid) return;

    const processAchievement = () => {
      const achievement = teamAchievements?.find(a => a.name === 'Explorador');
      if (!achievement) return;

      unlockAchievement(
        { teamId, payload: { userUid: localUid, achievementId: achievement.id } },
        {
          onSuccess: () => {
            showAchievement(achievement);
          },
          onError: (error) => {
            console.error('Failed to unlock achievement:', error);
          },
        },
      );
    };

    processAchievement();
  }, [teamId, localUid, teamAchievements, unlockAchievement, showAchievement]);

  const playerNames = useMemo(() => {
    if (!teamMembers) return {};
    const map: Record<string, string> = {};
    for (const member of teamMembers) {
      if (member.displayName) {
        map[member.uid] = member.displayName.split(' ')[0] || member.displayName;
      }
    }
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
          teamId={teamId ?? null}
          coinBalance={stats.coinBalance}
          onCoinSpent={setCoinBalance}
          onBoardEntry={handleBoardEntry}
          onDuckStatue={handleDuckStatue}
          disabledPointIds={disabledPointIds}
        />
      </div>

      {isTouchDevice && <MobileJoystick inputRef={inputRef} />}

      <HUD stats={stats} session={session} />

      {!isReady && <NeonLoadingOverlay />}
    </div>
  );
}
