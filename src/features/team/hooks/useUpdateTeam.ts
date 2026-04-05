import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { UpdateTeamPayload } from '../types/teamSchemas';

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: UpdateTeamPayload }) =>
      teamsApi.update(teamId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
