import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, groupId }: { teamId: string; groupId: string }) =>
      teamsApi.deleteGroup(teamId, groupId),
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'groups'] });
      void queryClient.invalidateQueries({ queryKey: ['chatRooms', teamId] });
    },
  });
}
