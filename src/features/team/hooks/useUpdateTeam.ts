import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';
import type { UpdateTeamPayload } from '../types/teamSchemas';

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      payload,
      memberIdentifiers,
    }: {
      teamId: string;
      payload: UpdateTeamPayload;
      memberIdentifiers?: string[];
    }) => {
      let response;
      if (Object.keys(payload).length > 0) {
        response = await teamsApi.update(teamId, payload);
      }

      if (memberIdentifiers && memberIdentifiers.length > 0) {
        await Promise.all(
          memberIdentifiers.map((identifier) => {
            const body = identifier.includes('@')
              ? { email: identifier, role: 'member' as const }
              : { userUid: identifier, role: 'member' as const };
            return teamsApi
              .addMember(teamId, body)
              .catch((err) => console.error(`Failed to add user ${identifier}`, err));
          }),
        );
      }

      return response;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
