import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teamsApi';
import type { UpdateTeamPayload } from '../types/teamSchemas';

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, payload, memberUids }: { teamId: string; payload: UpdateTeamPayload, memberUids?: string[] }) => {
      let response;
      if (Object.keys(payload).length > 0) {
        response = await teamsApi.update(teamId, payload);
      }
      
      if (memberUids && memberUids.length > 0) {
        await Promise.all(
          memberUids.map(uid =>
            teamsApi.addMember(teamId, { userUid: uid, role: 'member' })
              .catch(err => console.error(`Failed to add user ${uid}`, err))
          )
        );
      }
      
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
