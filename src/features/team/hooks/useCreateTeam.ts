import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { CreateTeamPayload } from '../types/teamSchemas';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
