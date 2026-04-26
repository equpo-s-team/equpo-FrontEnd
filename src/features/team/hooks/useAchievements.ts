import { useQuery } from '@tanstack/react-query';

import { achievementsApi } from '../api/achievementsApi';

export function useAchievements(teamId: string | undefined) {
  return useQuery({
    queryKey: ['achievements', teamId],
    queryFn: () => achievementsApi.list(teamId!),
    enabled: !!teamId,
    select: (data) =>
      data.achievements.map((achievement) => ({
        ...achievement,
        iconUrl:
          achievement.iconUrl ??
          (achievement as typeof achievement & { iconURL?: string | null }).iconURL ??
          null,
      })),
  });
}
