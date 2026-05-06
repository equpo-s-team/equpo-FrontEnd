import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { CreateTeamPayload } from '../types/teamSchemas';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTeamPayload & { memberIdentifiers?: string[] }) => {
      const response = await teamsApi.create({
        name: payload.name,
        description: payload.description,
      });

      if (payload.memberIdentifiers && payload.memberIdentifiers.length > 0) {
        const teamId = response.team?.id;
        if (teamId) {
          await Promise.all(
            payload.memberIdentifiers.map((identifier) => {
              const body = identifier.includes('@')
                ? { email: identifier, role: 'member' as const }
                : { userUid: identifier, role: 'member' as const };
              return teamsApi
                .addMember(teamId, body)
                .catch((err) => console.error(`Failed to add user ${identifier}`, err));
            }),
          );
        }
      }

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
