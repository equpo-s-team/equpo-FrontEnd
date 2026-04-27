import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateGroupPayload } from '../types/teamSchemas';

import { teamsApi } from '../api/teamsApi';

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: CreateGroupPayload }) =>
      teamsApi.createGroup(teamId, payload),
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'groups'] });
      void queryClient.invalidateQueries({ queryKey: ['chatRooms', teamId] });
    },
  });
}
