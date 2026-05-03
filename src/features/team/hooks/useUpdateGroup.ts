import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { UpdateGroupPayload } from '../types/teamSchemas';

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      groupId,
      payload,
    }: {
      teamId: string;
      groupId: string;
      payload: UpdateGroupPayload;
    }) => teamsApi.updateGroup(teamId, groupId, payload),
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'groups'] });
      void queryClient.invalidateQueries({ queryKey: ['chatRooms', teamId] });
    },
  });
}
