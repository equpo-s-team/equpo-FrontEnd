import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teamsApi';
import type { CreateAchievementPayload } from '../types/teams';

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: CreateAchievementPayload }) =>
      teamsApi.createAchievement(teamId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId, 'achievements'] });
    },
  });
}
