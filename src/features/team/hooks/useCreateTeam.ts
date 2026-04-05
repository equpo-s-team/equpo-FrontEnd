import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teamsApi';
import type { CreateTeamPayload } from '../types/teamSchemas';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTeamPayload & { memberUids?: string[] }) => {
      const response = await teamsApi.create({
        name: payload.name,
        description: payload.description,
      });

      if (payload.memberUids && payload.memberUids.length > 0) {
        // Cast is necessary to grab the team id based on standard Equpo backend response { team: { id: ... } }
        const teamId = (response as any).team?.id;
        if (teamId) {
          // Send addMember requests for all UIDs
          await Promise.all(
            payload.memberUids.map(uid =>
              teamsApi.addMember(teamId, { userUid: uid, role: 'member' })
                .catch(err => console.error(`Failed to add user ${uid}`, err)) // Ignore if user doesn't exist to not crash entirely
            )
          );
        }
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
