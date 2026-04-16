import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { UnlockAchievementPayload } from '../types/teamSchemas';

export function useUnlockAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: UnlockAchievementPayload }) =>
      teamsApi.unlockAchievement(teamId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['team', variables.teamId, 'achievements'] });
    },
  });
}
