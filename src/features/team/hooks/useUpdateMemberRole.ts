import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teamsApi';
import type { UpdateTeamMemberRolePayload } from '../types/teamSchemas';

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      userUid,
      payload,
    }: {
      teamId: string;
      userUid: string;
      payload: UpdateTeamMemberRolePayload;
    }) => teamsApi.updateMemberRole(teamId, userUid, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId, 'members'] });
    },
  });
}
