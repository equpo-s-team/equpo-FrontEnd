import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { CreateTeamRewardPayload } from '../types/teamSchemas';

export function useCreateTeamReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: CreateTeamRewardPayload }) =>
      teamsApi.createReward(teamId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['team', variables.teamId, 'rewards'] });
    },
  });
}
