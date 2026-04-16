import { useQuery } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useTeamMembers(teamId: string | undefined) {
  return useQuery({
    queryKey: ['team', teamId, 'members'],
    queryFn: async () => {
      if (!teamId) {
        throw new Error('teamId is required to fetch team members');
      }

      const res = await teamsApi.listMembers(teamId);
      return res.members;
    },
    enabled: !!teamId,
  });
}
