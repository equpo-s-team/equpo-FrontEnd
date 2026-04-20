import { useMemo } from 'react';

import { useReportsKpi } from '@/features/reports/hooks';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers.ts';
import { getInitials } from '@/lib/avatar/avatarInitials.ts';

import type { ConnectedUser, PlayerStats, SessionInfo } from '../types/hud.ts';

interface UseHudDataParams {
  teamId: string | undefined;
  connectedUsers: number;
  connectedUserUids: string[];
  elapsedSeconds: number;
}

interface UseHudDataResult {
  stats: PlayerStats;
  session: SessionInfo;
}

const AVATAR_GRADIENTS = [
  'bg-avatar-at',
  'bg-avatar-jr',
  'bg-avatar-ml',
  'bg-avatar-cs',
  'bg-avatar-lv',
  'bg-avatar-dm',
  'bg-avatar-sr',
] as const;

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function toConnectedUsers(
  memberList:
    | Array<{ uid: string; displayName: string | null; photoUrl?: string | null }>
    | undefined,
  connectedUserUids: string[],
): ConnectedUser[] {
  if (!memberList || connectedUserUids.length === 0) {
    return [];
  }

  const byUid = new Map(memberList.map((member) => [member.uid, member]));

  return connectedUserUids.map((uid, index) => {
    const member = byUid.get(uid);
    const name = member?.displayName ?? `Usuario ${uid.slice(0, 6)}`;

    return {
      uid,
      id: getInitials(name, 'NA'),
      name,
      photoUrl: member?.photoUrl ?? null,
      gradient: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
    };
  });
}

export function useHudData({
  teamId,
  connectedUsers,
  connectedUserUids,
  elapsedSeconds,
}: UseHudDataParams): UseHudDataResult {
  const kpiQuery = useReportsKpi(teamId, { days: 30 });
  const membersQuery = useTeamMembers(teamId);

  return useMemo(() => {
    const totalTasks = kpiQuery.data?.kpi.total ?? 0;
    const doneTasks = kpiQuery.data?.kpi.done ?? 0;
    const overdueTasks = kpiQuery.data?.kpi.overdue ?? 0;

    const completedPercent = totalTasks > 0 ? clampPercentage((doneTasks / totalTasks) * 100) : 0;
    const overduePercent = totalTasks > 0 ? clampPercentage((overdueTasks / totalTasks) * 100) : 0;

    const hp = clampPercentage(60 + completedPercent - overduePercent * 2);
    const maxUsers = membersQuery.data?.length ?? 0;
    const energy = maxUsers > 0 ? clampPercentage((connectedUsers / maxUsers) * 100) : 0;
    const connectedMembers = toConnectedUsers(membersQuery.data, connectedUserUids);

    return {
      stats: {
        hp: Math.round(hp),
        maxHp: 100,
        energy: Math.round(energy),
        maxEnergy: 100,
      },
      session: {
        elapsedSeconds,
        connectedUsers,
        maxUsers,
        completedPercent: Math.round(completedPercent),
        overduePercent: Math.round(overduePercent),
        connectedMembers,
      },
    };
  }, [
    connectedUserUids,
    connectedUsers,
    elapsedSeconds,
    kpiQuery.data?.kpi.done,
    kpiQuery.data?.kpi.overdue,
    kpiQuery.data?.kpi.total,
    membersQuery.data,
  ]);
}
