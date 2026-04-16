import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userUid }: { teamId: string; userUid: string }) =>
      teamsApi.removeMember(teamId, userUid),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['team', variables.teamId, 'members'] });
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
