import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teamsApi';
import type { AddTeamMemberPayload } from '../types/teams';

export function useAddTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: AddTeamMemberPayload }) =>
      teamsApi.addMember(teamId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId, 'members'] });
    },
  });
}
